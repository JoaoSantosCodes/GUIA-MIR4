import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { CODEX_ITEMS, SPIRITS, FARM_SPOTS, CLASSES, RAIDS } from "@shared/guideData";

const favoritesItemType = z.enum(["spirit", "codex", "farm", "class", "economy", "boss"]);

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
      .input(z.object({ farmKey: z.string().min(1).max(120) }))
      .query(({ input }) => db.listFarmComments(input.farmKey)),
    add: protectedProcedure
      .input(z.object({
        farmKey: z.string().min(1).max(120),
        content: z.string().trim().min(3).max(300),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!FARM_SPOTS.some(f => f.key === input.farmKey)) {
          throw new Error("Local de farm inválido");
        }
        await db.addFarmComment(ctx.user.id, input.farmKey, input.content);
        return { success: true } as const;
      }),
    remove: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFarmComment(ctx.user.id, input.id);
        return { success: true } as const;
      }),
    }),
});

export type AppRouter = typeof appRouter;
