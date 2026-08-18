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
