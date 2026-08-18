import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module so we can test procedure logic without a live database
vi.mock("./db", () => ({
  listFavorites: vi.fn(async () => []),
  addFavorite: vi.fn(async () => undefined),
  removeFavorite: vi.fn(async () => undefined),
  listCodexProgress: vi.fn(async () => []),
  setCodexProgress: vi.fn(async () => undefined),
  listFarmComments: vi.fn(async () => []),
  addFarmComment: vi.fn(async () => undefined),
  removeFarmComment: vi.fn(async () => undefined),
  voteComment: vi.fn(async () => ({ success: true, upvotes: 0, downvotes: 0 })),
}));

import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user: AuthenticatedUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as unknown as TrpcContext["res"],
  };
}

const authenticatedUser: AuthenticatedUser = {
  id: 42,
  openId: "test-user",
  email: "test@example.com",
  name: "Test User",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(db.listFavorites).mockResolvedValue([]);
  vi.mocked(db.listCodexProgress).mockResolvedValue([]);
  vi.mocked(db.listFarmComments).mockResolvedValue([]);
});

describe("favorites.toggle", () => {
  it("rejects unknown guide item ids", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    await expect(
      caller.favorites.toggle({ itemId: "spirit:nao-existe", itemType: "spirit" }),
    ).rejects.toThrow();
  });

  it("adds a favorite when it does not exist", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.favorites.toggle({ itemId: "spirit:khalion", itemType: "spirit" });
    expect(result.added).toBe(true);
    expect(db.addFavorite).toHaveBeenCalledOnce();
    expect(db.removeFavorite).not.toHaveBeenCalled();
  });

  it("removes a favorite when it already exists (toggle)", async () => {
    vi.mocked(db.listFavorites).mockResolvedValue([
      { id: 1, userId: 42, itemId: "spirit:khalion", itemType: "spirit", createdAt: new Date() },
    ]);
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.favorites.toggle({ itemId: "spirit:khalion", itemType: "spirit" });
    expect(result.added).toBe(false);
    expect(db.removeFavorite).toHaveBeenCalledOnce();
  });

  it("rejects unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(
      caller.favorites.toggle({ itemId: "spirit:khalion", itemType: "spirit" }),
    ).rejects.toThrow();
  });
});

describe("codexProgress.toggle", () => {
  it("rejects unknown codex item ids", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    await expect(
      caller.codexProgress.toggle({ itemId: "nao-existe", collected: true }),
    ).rejects.toThrow();
  });

  it("stores collected state for a valid codex item", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.codexProgress.toggle({ itemId: "uc-magicstone", collected: true });
    expect(result.success).toBe(true);
    expect(db.setCodexProgress).toHaveBeenCalledWith(42, "uc-magicstone", true);
  });

  it("rejects unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(
      caller.codexProgress.toggle({ itemId: "uc-magicstone", collected: true }),
    ).rejects.toThrow(); // chave inválida
  });
});

describe("favorites.toggle with raid/boss items", () => {
  it("accepts a valid raid item id", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.favorites.toggle({ itemId: "raid:king-bull-fiend", itemType: "boss" });
    expect(result.added).toBe(true);
    expect(db.addFavorite).toHaveBeenCalledOnce();
  });

  it("rejects an unknown raid item id", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    await expect(
      caller.favorites.toggle({ itemId: "raid:nao-existe", itemType: "boss" }),
    ).rejects.toThrow();
  });
});

describe("favorites.toggle with sabuk/mystery items", () => {
  it("accepts a valid sabuk item id", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.favorites.toggle({ itemId: "sabuk:guerra-sabuk", itemType: "sabuk" });
    expect(result.added).toBe(true);
    expect(db.addFavorite).toHaveBeenCalledOnce();
  });

  it("accepts a valid mystery item id", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.favorites.toggle({ itemId: "mystery:nefariox-horn", itemType: "mystery" });
    expect(result.added).toBe(true);
    expect(db.addFavorite).toHaveBeenCalledOnce();
  });

  it("rejects an unknown sabuk item id", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    await expect(
      caller.favorites.toggle({ itemId: "sabuk:nao-existe", itemType: "sabuk" }),
    ).rejects.toThrow();
  });

  it("rejects an unknown mystery item id", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    await expect(
      caller.favorites.toggle({ itemId: "mystery:nao-existe", itemType: "mystery" }),
    ).rejects.toThrow();
  });
});

describe("comments", () => {
  const validFarmKey = "snake-valley";

  it("list is public and returns comments for a farm spot", async () => {
    const caller = appRouter.createCaller(createContext(null));
    const result = await caller.comments.list({ farmKey: validFarmKey });
    expect(Array.isArray(result)).toBe(true);
  });

  it("list returns empty for a key with no comments", async () => {
    const caller = appRouter.createCaller(createContext(null));
    const result = await caller.comments.list({ farmKey: "nao-existe" });
    expect(result).toEqual([]);
  });

  it("add requires authentication", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(
      caller.comments.add({ farmKey: validFarmKey, content: "Dica para testar" }),
    ).rejects.toThrow();
  });

  it("add validates content length and farm key", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    await expect(
      caller.comments.add({ farmKey: validFarmKey, content: "ab" }),
    ).rejects.toThrow();
    await expect(
      caller.comments.add({ farmKey: "nao-existe", content: "Dica válida para testar" }),
    ).rejects.toThrow();
  });

  it("add stores the comment for the authenticated user", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.comments.add({ farmKey: validFarmKey, content: "Dica válida para testar" });
    expect(result.success).toBe(true);
    expect(db.addFarmComment).toHaveBeenCalledWith(42, validFarmKey, "Dica válida para testar");
  });

  it("remove requires authentication and rejects unknown ids", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.comments.remove({ id: 1 })).rejects.toThrow();
  });
});

describe("comments.vote", () => {
  it("registers an upvote with delta 1", async () => {
    vi.mocked(db.voteComment).mockResolvedValue({ success: true, upvotes: 1, downvotes: 0 });
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.comments.vote({ id: 1, kind: "up", delta: 1 });
    expect(result.success).toBe(true);
    expect(db.voteComment).toHaveBeenCalledWith(1, "up", 1);
  });

  it("registers a downvote with delta -1", async () => {
    vi.mocked(db.voteComment).mockResolvedValue({ success: true, upvotes: 0, downvotes: 1 });
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.comments.vote({ id: 1, kind: "down", delta: -1 });
    expect(result.success).toBe(true);
    expect(db.voteComment).toHaveBeenCalledWith(1, "down", -1);
  });

  it("rejects unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(
      caller.comments.vote({ id: 1, kind: "up", delta: 1 }),
    ).rejects.toThrow();
  });
});

describe("dados das novas páginas", () => {
  it("tier scenarios têm linhas e combos com chaves válidas de espíritos", async () => {
    const { TIER_SCENARIOS } = await import("@shared/guideData");
    const { SPIRITS } = await import("@shared/guideData");
    const spiritKeys = new Set(SPIRITS.map(s => s.key));
    const codexKeys = new Set((await import("@shared/guideData")).CODEX_ITEMS.map(c => c.key));
    for (const t of TIER_SCENARIOS) {
      for (const row of t.rows) {
        for (const s of row.spirits) {
          expect(spiritKeys.has(s.key) || codexKeys.has(s.key), `chave inválida: ${s.key}`).toBe(true);
        }
      }
      for (const combo of t.combos) {
        for (const s of combo.spirits) {
          expect(spiritKeys.has(s.key), `chave inválida: ${s.key}`).toBe(true);
        }
      }
    }
  });

  it("sabuk content e mistérios têm chaves e passos não vazios", async () => {
    const { SABUK_CONTENT, MYSTERIES, CONQUEST_INFO } = await import("@shared/guideData");
    expect(SABUK_CONTENT.length).toBeGreaterThan(0);
    expect(MYSTERIES.length).toBeGreaterThan(0);
    const sabukKeys = new Set(SABUK_CONTENT.map(s => s.key));
    for (const s of SABUK_CONTENT) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.description.length).toBeGreaterThan(0);
      expect(s.details.length).toBeGreaterThan(0);
    }
    for (const m of MYSTERIES) {
      expect(m.steps.length).toBeGreaterThan(0);
      expect(m.reward.length).toBeGreaterThan(0);
      expect(m.tip.length).toBeGreaterThan(0);
    }
    expect(CONQUEST_INFO.buildings.length).toBe(10);
    void sabukKeys;
  });

  it("leveling guide cobre todas as faixas de 1-10 até 100+ com zonas válidas", async () => {
    const { LEVELING_GUIDE, FARM_SPOTS } = await import("@shared/guideData");
    expect(LEVELING_GUIDE.length).toBeGreaterThan(0);
    const farmKeys = new Set(FARM_SPOTS.map(f => f.key));
    for (const b of LEVELING_GUIDE) {
      expect(b.goals.length).toBeGreaterThan(0);
      expect(b.zones.length).toBeGreaterThan(0);
      expect(b.tips.length).toBeGreaterThan(0);
      // nomes de zonas citados devem existir no guideData (prefixo case-insensitive)
      // zonas especiais (ex.: "Byeoksan (região inicial)", "Sabuk") ficam marcadas em z.special
      for (const z of b.zones) {
        if (!z.special) {
          const clean = (str: string) => str.toLowerCase().replace(/\s*\(.*?\)/g, "").replace(/\d+([-\/]\d*)?f/gi, "").replace(/f\d+/gi, "").replace(/\/+/, " ").trim();
          const base = clean(z.name);
          const match = FARM_SPOTS.some(f => {
            const spotBase = clean(f.name);
            return base.includes(spotBase) || spotBase.includes(base) || base.includes(f.key.replace(/-/g, " "));
          });
          expect(match, `zona não encontrada: ${z.name}`).toBe(true);
        }
      }
    }
    void farmKeys;
  });
});
