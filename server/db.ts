import { eq, and, inArray, desc, isNotNull } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, favorites, codexProgress, farmComments, InsertFavorite, InsertCodexProgress } from "../drizzle/schema";
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
