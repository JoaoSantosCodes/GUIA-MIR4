import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { CODEX_ITEMS, SPIRITS, FARM_SPOTS, CLASSES, RAIDS, SABUK_CONTENT, MYSTERIES, SEAL_GUIDE, CLASS_SKILLS, EQUIPMENT_TYPES, MATERIALS, CLASS_TIER_RANKINGS, TIERLIST_SCENARIOS, SPIRIT_TIER_RANKINGS, SPIRIT_TIER_LIST_KEYS } from "@shared/guideData";
import { PAGE_COMMENT_KEYS } from "./_core/pageComments";
import { getPublicProfile } from "./share";
import { computeUpcomingAlerts } from "./events";
import { topTipsByPage } from "./faq";
import { listVotesByUserAndComments } from "./votes";

const favoritesItemType = z.enum(["spirit", "codex", "farm", "class", "economy", "boss", "sabuk", "mystery", "seal", "gear", "materials"]);

// ---------- Helpers server-side para o snapshot semanal da tier list ----------
const CLASS_TIER_ORDER = ["S", "A", "B", "C"] as const;
function currentWeekISO(): string {
  const d = new Date();
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}
function aggregateClassCommunityVotes(
  _scenarioKey: string,
  votes: { classKey: string; vote: 1 | -1 | 0 }[],
): Record<string, number> {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};
  for (const v of votes) {
    if (v.vote !== 0) {
      sums[v.classKey] = (sums[v.classKey] ?? 0) + v.vote;
    }
    counts[v.classKey] = (counts[v.classKey] ?? 0) + 1;
  }
  const result: Record<string, number> = {};
  for (const [k, s] of Object.entries(sums)) {
    if ((counts[k] ?? 0) >= 2) {
      result[k] = Math.round(s / counts[k]);
    }
  }
  return result;
}
function resolveClassTierStatic(
  scenarioKey: string,
  classKey: string,
  communityShift = 0,
): { tier: "S" | "A" | "B" | "C" } {
  const base = (CLASS_TIER_RANKINGS[scenarioKey]?.[classKey]?.tier ?? "B") as "S" | "A" | "B" | "C";
  const clamped = Math.max(-2, Math.min(2, Math.round(communityShift)));
  let t = base;
  for (let i = 0; i < Math.abs(clamped); i++) {
    const idx = CLASS_TIER_ORDER.indexOf(t);
    const next = clamped > 0 ? idx - 1 : idx + 1;
    t = CLASS_TIER_ORDER[Math.max(0, Math.min(CLASS_TIER_ORDER.length - 1, next))];
  }
  return { tier: t };
}

const favoriteInput = z.object({
  itemId: z.string().min(1).max(120),
  itemType: favoritesItemType,
});

const codexToggleInput = z.object({
  itemId: z.string().min(1).max(120),
  collected: z.boolean(),
});

/** Validates that a spirit/codex/farm/class item key actually exists in the guide data. */
function validateGuideItem(itemId: string, itemType: z.infer<typeof favoritesItemType>) {
  const key = itemId.split(":")[1] ?? itemId;
  switch (itemType) {
    case "spirit": return SPIRITS.some(s => s.key === key);
    case "codex": return CODEX_ITEMS.some(c => c.key === key);
    case "farm": return FARM_SPOTS.some(f => f.key === key);
    case "class": return CLASSES.some(c => c.key === key);
    case "economy": return true;
    case "boss": return RAIDS.some(r => r.key === key);
    case "sabuk": return SABUK_CONTENT.some(s => s.key === key) || key === "torre-conquista";
    case "mystery": return MYSTERIES.some(m => m.key === key) || key === "torre-conquista";
    case "seal": return ["darksteel-seal", "jade-seal", "dragon-seal", "calculadora"].includes(key);
    case "gear": return EQUIPMENT_TYPES.some(e => e.key === key);
    case "materials": return MATERIALS.some(m => m.key === key);
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  favorites: router({
    list: protectedProcedure.query(({ ctx }) => db.listFavorites(ctx.user.id)),
    toggle: protectedProcedure
      .input(favoriteInput)
      .mutation(async ({ ctx, input }) => {
        if (!validateGuideItem(input.itemId, input.itemType)) {
          throw new Error("Item do guia inválido");
        }
        const existing = (await db.listFavorites(ctx.user.id)).find(f => f.itemId === input.itemId);
        if (existing) {
          await db.removeFavorite(ctx.user.id, input.itemId);
          return { added: false } as const;
        }
        await db.addFavorite(ctx.user.id, input);
        return { added: true } as const;
      }),
  }),

  codexProgress: router({
    list: protectedProcedure.query(({ ctx }) => db.listCodexProgress(ctx.user.id)),
    toggle: protectedProcedure
      .input(codexToggleInput)
      .mutation(async ({ ctx, input }) => {
        if (!CODEX_ITEMS.some(c => c.key === input.itemId)) {
          throw new Error("Item de Codex inválido");
        }
        await db.setCodexProgress(ctx.user.id, input.itemId, input.collected);
        return { success: true } as const;
      }),
  }),

  comments: router({
    list: publicProcedure
      .input(z.object({ pageKey: z.enum(["farm", "sabuk", "mystery", "seal", "skills", "gear", "materials", "classes", "economy", "raids"]), farmKey: z.string().min(1).max(120) }))
      .query(({ input }) => db.listPageComments(input.pageKey, input.farmKey)),
    add: protectedProcedure
      .input(z.object({
        pageKey: z.enum(["farm", "sabuk", "mystery", "seal", "skills", "gear", "materials", "classes", "economy", "raids"]),
        farmKey: z.string().min(1).max(120),
        content: z.string().trim().min(3).max(300),
      }))
      .mutation(async ({ ctx, input }) => {
        let valid = false;
        if (input.pageKey === "farm") valid = FARM_SPOTS.some(f => f.key === input.farmKey);
        else if (input.pageKey === "sabuk") valid = input.farmKey === "geral" || SABUK_CONTENT.some(s => s.key === input.farmKey) || input.farmKey === "torre-conquista";
        else if (input.pageKey === "mystery") valid = input.farmKey === "geral" || MYSTERIES.some(m => m.key === input.farmKey) || input.farmKey === "torre-conquista";
        else if (input.pageKey === "seal") valid = input.farmKey === "geral" || SEAL_GUIDE.some(s => s.stage === input.farmKey);
        else if (input.pageKey === "skills") valid = input.farmKey === "geral" || CLASS_SKILLS.some(c => c.key === input.farmKey);
        else if (input.pageKey === "gear") valid = input.farmKey === "geral" || EQUIPMENT_TYPES.some(e => e.key === input.farmKey);
        else if (input.pageKey === "materials") valid = input.farmKey === "geral" || MATERIALS.some(m => m.key === input.farmKey);
        else if (input.pageKey === "classes" || input.pageKey === "economy" || input.pageKey === "raids") valid = input.farmKey === "geral";
        if (!valid) {
          throw new Error("Chave de comentário inválida");
        }
        await db.addPageComment(ctx.user.id, input.pageKey, input.farmKey, input.content);
        return { success: true } as const;
      }),
    vote: protectedProcedure
      .input(z.object({
        id: z.number().int().positive(),
        kind: z.enum(["up", "down"]),
        delta: z.union([z.literal(1), z.literal(-1)]),
      }))
      .mutation(async ({ input }) => db.voteComment(input.id, input.kind, input.delta)),
    /** Voto registrado por usuário: previne voto duplo e permite alterar o voto. */
    setUserVote: protectedProcedure
      .input(z.object({
        commentId: z.number().int().positive(),
        vote: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
      }))
      .mutation(async ({ ctx, input }) => db.setUserCommentVote(ctx.user.id, input.commentId, input.vote)),
    /** Voto atual do usuário em um lote de comentários (para destacar na UI). */
    myVotes: protectedProcedure
      .input(z.object({ commentIds: z.array(z.number().int().positive()).max(200) }))
      .query(async ({ ctx, input }) => {
        if (input.commentIds.length === 0) return [];
        const rows = await listVotesByUserAndComments(ctx.user.id, input.commentIds);
        return rows.map(r => ({ commentId: r.commentId, vote: r.vote }));
      }),
    remove: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFarmComment(ctx.user.id, input.id);
        return { success: true } as const;
      }),
    }),
  /** Lightweight countdown used by the header notification bell (polling). */
  events: router({
    upcoming: publicProcedure
      .input(z.object({ regionKey: z.string().min(1).max(10) }))
      .query(({ input }) => computeUpcomingAlerts(input.regionKey)),
  }),

  /** Aggregates the community's most-upvoted tips per guide page. */
  faq: router({
    topTips: publicProcedure
      .input(z.object({ minUpvotes: z.number().int().min(0).optional() }))
      .query(({ input }) => topTipsByPage(input.minUpvotes ?? 0)),
  }),

  /** Histórico de votos do usuário, com edição de voto (alterar/remover). */
  user: router({
    voteHistory: protectedProcedure.query(({ ctx }) => db.listVoteHistory(ctx.user.id)),
    setSoundAlerts: protectedProcedure
      .input(z.object({ enabled: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        await db.setSoundAlerts(ctx.user.id, input.enabled);
        return { success: true, enabled: input.enabled } as const;
      }),
    getSoundAlerts: protectedProcedure.query(({ ctx }) => db.getSoundAlerts(ctx.user.id)),
  }),

  /** Tier list comunitária de classes: votação por cenário + agregados. */
  tierlist: router({
    vote: protectedProcedure
      .input(z.object({ scenario: z.string().min(1).max(40), classKey: z.string().min(1).max(40), vote: z.number().int().min(-1).max(1) }))
      .mutation(async ({ ctx, input }) => {
        if (!TIERLIST_SCENARIOS.some(s => s.key === input.scenario)) throw new Error("Cenário inválido");
        if (!CLASS_TIER_RANKINGS[input.scenario]?.[input.classKey]) throw new Error("Classe inválida para este cenário");
        const result = await db.setTierlistVote(ctx.user.id, input.scenario, input.classKey, input.vote as 1 | -1 | 0);
        // Snapshot semanal do tier comunitário da classe votada (histórico de evolução).
        const aggregated = await db.getTierlistVotes(undefined, input.scenario);
        const rawVotes = Object.entries(aggregated.community).flatMap(([classKey, { sums, count }]) =>
          Array.from({ length: count }, () => ({ classKey, vote: sums / count > 0 ? 1 as const : -1 as const })),
        );
        const shifts = aggregateClassCommunityVotes(input.scenario, rawVotes);
        const shift = shifts[input.classKey] ?? 0;
        const resolved = resolveClassTierStatic(input.scenario, input.classKey, shift);
        await db.recordTierlistHistory(currentWeekISO(), input.scenario, input.classKey, resolved.tier);
        return result;
      }),
    results: publicProcedure
      .input(z.object({ scenario: z.string().min(1).max(40) }))
      .query(async ({ ctx, input }) => {
        if (!TIERLIST_SCENARIOS.some(s => s.key === input.scenario)) throw new Error("Cenário inválido");
        const userId = ctx.user?.id;
        const [aggregated, rankings] = await Promise.all([
          db.getTierlistVotes(userId, input.scenario),
          Promise.resolve(CLASS_TIER_RANKINGS[input.scenario] ?? {}),
        ]);
        return { community: aggregated.community, userVotes: aggregated.userVotes, rankings };
      }),
  }),
  /** Tier list comunitária de espíritos: votação por cenário + agregados. */
  spiritTierlist: router({
    vote: protectedProcedure
      .input(z.object({ scenario: z.string().min(1).max(40), spiritKey: z.string().min(1).max(60), vote: z.number().int().min(-1).max(1) }))
      .mutation(async ({ ctx, input }) => {
        if (!TIERLIST_SCENARIOS.some(s => s.key === input.scenario)) throw new Error("Cenário inválido");
        if (!SPIRIT_TIER_LIST_KEYS.includes(input.spiritKey)) throw new Error("Espírito inválido para este cenário");
        const result = await db.setSpiritTierlistVote(ctx.user.id, input.scenario, input.spiritKey, input.vote as 1 | -1 | 0);
        return result;
      }),
    results: publicProcedure
      .input(z.object({ scenario: z.string().min(1).max(40) }))
      .query(async ({ ctx, input }) => {
        if (!TIERLIST_SCENARIOS.some(s => s.key === input.scenario)) throw new Error("Cenário inválido");
        const userId = ctx.user?.id;
        const [aggregated, rankings] = await Promise.all([
          db.getSpiritTierlistVotes(userId, input.scenario),
          Promise.resolve(SPIRIT_TIER_RANKINGS[input.scenario] ?? {}),
        ]);
        return { community: aggregated.community, userVotes: aggregated.userVotes, rankings };
      }),
  }),
  /** Histórico semanal da tier list de classes: evolução dos tiers comunitários. */
  tierlistHistory: router({
    list: publicProcedure
      .input(z.object({ scenario: z.string().min(1).max(40) }))
      .query(async ({ input }) => {
        if (!TIERLIST_SCENARIOS.some(s => s.key === input.scenario)) throw new Error("Cenário inválido");
        return db.getTierlistHistory(input.scenario);
      }),
  }),
  /** Placar da comunidade: usuários com mais medalhas "Dica de Ouro". */
  community: router({
    goldLeaderboard: publicProcedure.query(() => db.goldLeaderboard()),
    /** Placar unificado: soma de Dicas de Ouro + medalhas do Codex. */
    unifiedLeaderboard: publicProcedure.query(() => db.unifiedLeaderboard()),
  }),
  /** Public shareable profile (favorites + codex progress) — no auth required. */
  share: router({
    getProfile: publicProcedure
      .input(z.object({ userId: z.number().int().positive() }))
      .query(async ({ input }) => {
        const profile = await getPublicProfile(input.userId);
        if (!profile) throw new Error("Perfil não encontrado");
        return profile;
      }),
  }),
});
export type AppRouter = typeof appRouter;
