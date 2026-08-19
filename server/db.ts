import { eq, and, gte, inArray, desc, isNotNull } from "drizzle-orm";
import { CODEX_ITEMS } from "../shared/guideData";
import { evaluateCodexAchievements } from "../client/src/lib/codexAchievements";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, favorites, codexProgress, farmComments, InsertFavorite, InsertCodexProgress, commentVotes, tierlistVotes, InsertTierlistVote } from "../drizzle/schema";
import { GOLD_TIP_UPVOTES } from "../shared/const";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ---------- Favorites ----------

export async function listFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(favorites).where(eq(favorites.userId, userId));
}

export async function addFavorite(userId: number, fav: Omit<InsertFavorite, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .insert(favorites)
    .values({ ...fav, userId })
    .onDuplicateKeyUpdate({ set: { itemId: fav.itemId } });
  return { success: true };
}

export async function removeFavorite(userId: number, itemId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.itemId, itemId)));
  return { success: true };
}

// ---------- Codex progress ----------

export async function listCodexProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(codexProgress).where(eq(codexProgress.userId, userId));
}

export async function setCodexProgress(userId: number, itemId: string, collected: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (collected) {
    await db
      .insert(codexProgress)
      .values({ userId, itemId })
      .onDuplicateKeyUpdate({ set: { collectedAt: new Date() } });
  } else {
    await db.delete(codexProgress).where(and(eq(codexProgress.userId, userId), eq(codexProgress.itemId, itemId)));
  }
  return { success: true };
}

// ---------- Farm comments ----------

export async function listPageComments(pageKey: string, itemKey: string) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      id: farmComments.id,
      userId: farmComments.userId,
      farmKey: farmComments.farmKey,
      content: farmComments.content,
      upvotes: farmComments.upvotes,
      downvotes: farmComments.downvotes,
      createdAt: farmComments.createdAt,
      userName: users.name,
    })
    .from(farmComments)
    .where(and(eq(farmComments.pageKey, pageKey), eq(farmComments.farmKey, itemKey)))
    .orderBy(farmComments.createdAt);
  const userIds = Array.from(new Set(rows.map(r => r.userId)));
  const names = new Map<number, string>();
  if (userIds.length > 0) {
    const userRows = await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, userIds));
    userRows.forEach(u => {
      if (u.name) names.set(u.id, u.name);
    });
  }
  return rows.map(r => ({ ...r, userName: names.get(r.userId) ?? undefined }));
}

export async function addPageComment(userId: number, pageKey: string, itemKey: string, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(farmComments).values({ userId, farmKey: itemKey, content, pageKey });
  return { success: true };
}

export async function listFarmComments(farmKey: string) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      id: farmComments.id,
      userId: farmComments.userId,
      farmKey: farmComments.farmKey,
      content: farmComments.content,
      upvotes: farmComments.upvotes,
      downvotes: farmComments.downvotes,
      createdAt: farmComments.createdAt,
      userName: users.name,
    })
    .from(farmComments)
    .where(eq(farmComments.farmKey, farmKey))
    .orderBy(farmComments.createdAt);
  // Resolve display names without N+1: fetch all distinct userIds at once.
  const userIds = Array.from(new Set(rows.map(r => r.userId)));
  const names = new Map<number, string>();
  if (userIds.length > 0) {
    const userRows = await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, userIds));
    userRows.forEach(u => {
      if (u.name) names.set(u.id, u.name);
    });
  }
  return rows.map(r => ({ ...r, userName: names.get(r.userId) ?? undefined }));
}

export async function addFarmComment(userId: number, farmKey: string, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(farmComments).values({ userId, farmKey, content });
  return { success: true };
}

export async function voteComment(
  commentId: number,
  kind: "up" | "down",
  delta: 1 | -1,
): Promise<{ success: true; upvotes: number; downvotes: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (delta !== 1 && delta !== -1) throw new Error("Delta inválido");
  const rows = await db.select().from(farmComments).where(eq(farmComments.id, commentId)).limit(1);
  const row = rows[0];
  if (!row) throw new Error("Comentário não encontrado");
  const col: "upvotes" | "downvotes" = kind === "up" ? "upvotes" : "downvotes";
  await db
    .update(farmComments)
    .set({ [col]: Math.max(0, (row[col] ?? 0) + delta) } as never)
    .where(eq(farmComments.id, commentId));
  const updated = await db.select({ upvotes: farmComments.upvotes, downvotes: farmComments.downvotes }).from(farmComments).where(eq(farmComments.id, commentId)).limit(1);
  return { success: true, upvotes: updated[0]?.upvotes ?? 0, downvotes: updated[0]?.downvotes ?? 0 };
}

export async function removeFarmComment(userId: number, commentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db.select().from(farmComments).where(eq(farmComments.id, commentId)).limit(1);
  const row = rows[0];
  if (!row) throw new Error("Comentário não encontrado");
  if (row.userId !== userId) throw new Error("Você só pode excluir seus próprios comentários");
  await db.delete(farmComments).where(eq(farmComments.id, commentId));
  return { success: true };
}

/** Busca as dicas com melhores votos no banco (usado pelo FAQ comunitário). */
export async function fetchTopTips() {
  const db = await getDb();
  if (!db) return [];
  const { users } = await import("../drizzle/schema");
  return db
    .select({
      id: farmComments.id,
      pageKey: farmComments.pageKey,
      farmKey: farmComments.farmKey,
      content: farmComments.content,
      upvotes: farmComments.upvotes,
      downvotes: farmComments.downvotes,
      createdAt: farmComments.createdAt,
      userName: users.name,
    })
    .from(farmComments)
    .leftJoin(users, eq(farmComments.userId, users.id))
    .where(isNotNull(farmComments.pageKey))
    .orderBy(desc(sql`(upvotes - downvotes)`));
}

// ---------- Comment votes ----------

/**
 * Registra/altera o voto do usuário em um comentário. Ajusta os contadores
 * contábeis (upvotes/downvotes) conforme a troca de voto anterior.
 * vote: 1 = upvote, -1 = downvote, 0 = removido.
 */
export async function setUserCommentVote(
  userId: number,
  commentId: number,
  vote: 1 | -1 | 0,
): Promise<{ success: true; upvotes: number; downvotes: number; userVote: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(commentVotes)
    .where(and(eq(commentVotes.userId, userId), eq(commentVotes.commentId, commentId)))
    .limit(1);
  const prev = existing[0]?.vote ?? 0;

  if (prev === vote) return { success: true, upvotes: 0, downvotes: 0, userVote: vote };

  const cRows = await db.select().from(farmComments).where(eq(farmComments.id, commentId)).limit(1);
  const cRow = cRows[0];
  if (!cRow) throw new Error("Comentário não encontrado");

  // Ajustes contábeis: remove o efeito do voto anterior e aplica o novo.
  let up = cRow.upvotes;
  let down = cRow.downvotes;
  if (prev === 1) up = Math.max(0, up - 1);
  if (prev === -1) down = Math.max(0, down - 1);
  if (vote === 1) up += 1;
  if (vote === -1) down += 1;

  if (existing[0]) {
    await db
      .update(commentVotes)
      .set({ vote })
      .where(and(eq(commentVotes.userId, userId), eq(commentVotes.commentId, commentId)));
  } else {
    await db.insert(commentVotes).values({ userId, commentId, vote });
  }

  await db.update(farmComments).set({ upvotes: up, downvotes: down }).where(eq(farmComments.id, commentId));

  return { success: true, upvotes: up, downvotes: down, userVote: vote };
}

const VALID_TIERLIST_VOTES: number[] = [1, -1, 0];

/**
 * Registrar/alterar um voto comunitário de tier list (um voto por usuário por cenário e classe).
 * Retorna o agregado atualizado da classe votada (soma e contagem de votos ativos).
 */
export async function setTierlistVote(
  userId: number,
  scenario: string,
  classKey: string,
  vote: 1 | -1 | 0,
): Promise<{ success: true; sums: number; count: number; userVote: 1 | -1 | 0 }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (!VALID_TIERLIST_VOTES.includes(vote)) throw new Error("Voto inválido");

  const existing = await db
    .select()
    .from(tierlistVotes)
    .where(and(eq(tierlistVotes.userId, userId), eq(tierlistVotes.scenario, scenario), eq(tierlistVotes.classKey, classKey)))
    .limit(1);
  const prev = existing[0]?.vote ?? 0;

  if (prev === vote) {
    const rows = await db
      .select({ sums: sql<number>`SUM(${tierlistVotes.vote})`, count: sql<number>`COUNT(${tierlistVotes.id})` })
      .from(tierlistVotes)
      .where(and(eq(tierlistVotes.scenario, scenario), eq(tierlistVotes.classKey, classKey)));
    return { success: true, sums: rows[0]?.sums ?? 0, count: rows[0]?.count ?? 0, userVote: vote as 1 | -1 | 0 };
  }

  if (existing[0]) {
    await db
      .update(tierlistVotes)
      .set({ vote } as Partial<InsertTierlistVote>)
      .where(and(eq(tierlistVotes.userId, userId), eq(tierlistVotes.scenario, scenario), eq(tierlistVotes.classKey, classKey)));
    if (vote === 0) {
      await db
        .delete(tierlistVotes)
        .where(and(eq(tierlistVotes.userId, userId), eq(tierlistVotes.scenario, scenario), eq(tierlistVotes.classKey, classKey)));
    }
  } else {
    if (vote !== 0) {
      await db.insert(tierlistVotes).values({ userId, scenario, classKey, vote });
    }
  }

  const rows = await db
    .select({ sums: sql<number>`SUM(${tierlistVotes.vote})`, count: sql<number>`COUNT(${tierlistVotes.id})` })
    .from(tierlistVotes)
    .where(and(eq(tierlistVotes.scenario, scenario), eq(tierlistVotes.classKey, classKey)));
  return { success: true, sums: rows[0]?.sums ?? 0, count: rows[0]?.count ?? 0, userVote: vote as 1 | -1 | 0 };
}

/**
 * Agregado comunitário por cenário: soma de votos e quantidade por classe,
 * além dos votos do próprio usuário (userVotes).
 */
export async function getTierlistVotes(
  userId: number | undefined,
  scenario: string,
): Promise<{
  community: Record<string, { sums: number; count: number }>;
  userVotes: Record<string, 1 | -1 | 0>;
}> {
  const db = await getDb();
  if (!db) return { community: {}, userVotes: {} };

  const allRows = await db
    .select({ classKey: tierlistVotes.classKey, vote: tierlistVotes.vote, userId: tierlistVotes.userId })
    .from(tierlistVotes)
    .where(eq(tierlistVotes.scenario, scenario));

  const community: Record<string, { sums: number; count: number }> = {};
  const userVotes: Record<string, 1 | -1 | 0> = {};
  for (const r of allRows) {
    const entry = (community[r.classKey] ??= { sums: 0, count: 0 });
    entry.sums += r.vote;
    entry.count += 1;
    if (userId !== undefined && r.userId === userId) {
      userVotes[r.classKey] = r.vote as 1 | -1 | 0;
    }
  }
  return { community, userVotes };
}

/** Histórico de votos do usuário com o conteúdo do comentário. */
export async function listVoteHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      vote: commentVotes.vote,
      commentId: commentVotes.commentId,
      votedAt: commentVotes.updatedAt,
      pageKey: farmComments.pageKey,
      farmKey: farmComments.farmKey,
      content: farmComments.content,
      upvotes: farmComments.upvotes,
      downvotes: farmComments.downvotes,
    })
    .from(commentVotes)
    .innerJoin(farmComments, eq(commentVotes.commentId, farmComments.id))
    .where(eq(commentVotes.userId, userId))
    .orderBy(desc(commentVotes.updatedAt));
  return rows;
}

/** Preferência de alerta sonoro do usuário. */
export async function setSoundAlerts(userId: number, enabled: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ soundAlerts: enabled ? 1 : 0 }).where(eq(users.id, userId));
  return { success: true, enabled };
}

export async function getSoundAlerts(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const rows = await db.select({ soundAlerts: users.soundAlerts }).from(users).where(eq(users.id, userId)).limit(1);
  return rows[0]?.soundAlerts === 1;
}

/**
 * Placar da comunidade: usuários com mais medalhas "Dica de Ouro",
 * incluindo o número de conquistas de raridade do Codex (faixa-t2..t5)
 * que cada usuário desbloqueou.
 */
export async function goldLeaderboard() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      userId: commentVotes.userId,
      userName: users.name,
      goldBadges: sql<number>`count(*)`,
    })
    .from(commentVotes)
    .innerJoin(farmComments, eq(commentVotes.commentId, farmComments.id))
    .innerJoin(users, eq(commentVotes.userId, users.id))
    .where(and(eq(commentVotes.vote, 1), gte(farmComments.upvotes, GOLD_TIP_UPVOTES)))
    .groupBy(commentVotes.userId, users.name)
    .orderBy(desc(sql<number>`count(*)`))
    .limit(50);

  // Conquistas de raridade (faixa-t2..t5): usuário precisa ter registrado
  // TODOS os itens de uma raridade para contar a medalha.
  const itemsByRarity = new Map<string, string[]>();
  for (const item of CODEX_ITEMS) {
    const list = itemsByRarity.get(item.rarity) ?? [];
    list.push(item.key);
    itemsByRarity.set(item.rarity, list);
  }

  const out: { userId: number; userName: string | null; goldBadges: number; rarityBadges: number }[] = [];
  for (const row of rows) {
    let rarityBadges = 0;
    for (const entry of Array.from(itemsByRarity)) {
      const rarity = entry[0];
      const keys = entry[1];
      if (rarity === "UC" || keys.length === 0) continue;
      const counts = await db
        .select({ n: sql<number>`count(distinct ${codexProgress.itemId})` })
        .from(codexProgress)
        .where(and(eq(codexProgress.userId, row.userId), inArray(codexProgress.itemId, keys)));
      if ((counts[0]?.n ?? 0) >= keys.length) rarityBadges += 1;
    }
    out.push({ ...row, rarityBadges });
  }
  return out;
}

/**
 * Placar unificado da comunidade: ranqueia usuários pela soma de
 * Dicas de Ouro (votos +1 em dicas com 10+ upvotes) e medalhas do Codex
 * (conquistas desbloqueadas: marcos de total, categorias, raridades, faixas).
 * Retorna os 50 primeiros com os subtotais separados para transparência.
 */
export async function unifiedLeaderboard() {
  const db = await getDb();
  if (!db) return [];

  // Votos registrados em dicas "Dica de Ouro" (score >= 10 upvotes)
  const goldRows = await db
    .select({
      userId: commentVotes.userId,
      goldBadges: sql<number>`count(*)`,
    })
    .from(commentVotes)
    .innerJoin(farmComments, eq(commentVotes.commentId, farmComments.id))
    .where(and(eq(commentVotes.vote, 1), gte(farmComments.upvotes, GOLD_TIP_UPVOTES)))
    .groupBy(commentVotes.userId);
  const goldByUser = new Map<number, number>();
  for (const r of goldRows) goldByUser.set(r.userId, r.goldBadges);

  // Todas as conquistas do Codex que o usuário desbloqueou
  const progressRows = await db
    .select({ userId: codexProgress.userId, itemId: codexProgress.itemId })
    .from(codexProgress)
    .where(isNotNull(codexProgress.collectedAt));
  const progressByUser = new Map<number, string[]>();
  for (const r of progressRows) {
    const list = progressByUser.get(r.userId) ?? [];
    list.push(r.itemId);
    progressByUser.set(r.userId, list);
  }

  const medalsByUser = new Map<number, number>();
  for (const entry of Array.from(progressByUser)) {
    const userId = entry[0];
    const collectedIds = entry[1];
    medalsByUser.set(userId, evaluateCodexAchievements(collectedIds).filter((a: { earned: boolean }) => a.earned).length);
  }

  const totalByUser = new Map<number, { gold: number; medals: number; total: number }>();
  for (const userId of Array.from(new Set([...Array.from(goldByUser.keys()), ...Array.from(medalsByUser.keys())]))) {
    const gold = goldByUser.get(userId) ?? 0;
    const medals = medalsByUser.get(userId) ?? 0;
    totalByUser.set(userId, { gold, medals, total: gold + medals });
  }

  const ranked = Array.from(totalByUser.entries())
    .map(([userId, s]) => ({ userId, ...s }))
    .sort((a, b) => (b.total === a.total ? b.medals - a.medals : b.total - a.total))
    .slice(0, 50);

  const nameRows = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(inArray(users.id, ranked.map(r => r.userId)));
  const names = new Map<number, string | null>();
  for (const r of nameRows) names.set(r.id, r.name);

  return ranked.map(r => ({ userId: r.userId, userName: names.get(r.userId) ?? null, goldBadges: r.gold, codexMedals: r.medals, totalScore: r.total }));
}
