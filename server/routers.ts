import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { CODEX_ITEMS, SPIRITS, FARM_SPOTS, CLASSES, RAIDS, SABUK_CONTENT, MYSTERIES, SEAL_GUIDE, CLASS_SKILLS, EQUIPMENT_TYPES, MATERIALS } from "@shared/guideData";
import { PAGE_COMMENT_KEYS } from "./_core/pageComments";
import { getPublicProfile } from "./share";

const favoritesItemType = z.enum(["spirit", "codex", "farm", "class", "economy", "boss", "sabuk", "mystery", "seal", "gear", "materials"]);

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
        remove: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFarmComment(ctx.user.id, input.id);
        return { success: true } as const;
      }),
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
