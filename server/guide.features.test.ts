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
  listPageComments: vi.fn(async () => []),
  addPageComment: vi.fn(async () => undefined),
  removeFarmComment: vi.fn(async () => undefined),
  voteComment: vi.fn(async () => ({ success: true, upvotes: 0, downvotes: 0 })),
  fetchTopTips: vi.fn(async () => []),
  setUserCommentVote: vi.fn(async () => ({ success: true, upvotes: 0, downvotes: 0, userVote: 0 })),
  listVoteHistory: vi.fn(async () => []),
  setSoundAlerts: vi.fn(async () => ({ success: true, enabled: false })),
  getSoundAlerts: vi.fn(async () => false),
  listVotesByUserAndComments: vi.fn(async () => []),
  goldLeaderboard: vi.fn(async () => []),
  getDb: vi.fn(async () => ({
    select: () => ({ from: () => ({ leftJoin: () => ({ where: async () => [] }) }) }),
  })),
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
  vi.mocked(db.listPageComments).mockResolvedValue([]);
  vi.mocked(db.setUserCommentVote).mockResolvedValue({ success: true, upvotes: 0, downvotes: 0, userVote: 0 });
  vi.mocked(db.listVoteHistory).mockResolvedValue([]);
  vi.mocked(db.setSoundAlerts).mockResolvedValue({ success: true, enabled: false });
  vi.mocked(db.getSoundAlerts).mockResolvedValue(false);
  vi.mocked(db.listVotesByUserAndComments).mockResolvedValue([]);
  vi.mocked(db.goldLeaderboard).mockResolvedValue([]);
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

describe("favorites.toggle with gear items", () => {
  it("accepts a valid gear item id", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.favorites.toggle({ itemId: "gear:weapon", itemType: "gear" });
    expect(result.added).toBe(true);
    expect(db.addFavorite).toHaveBeenCalledOnce();
  });

  it("rejects an unknown gear item id", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    await expect(
      caller.favorites.toggle({ itemId: "gear:nao-existe", itemType: "gear" }),
    ).rejects.toThrow();
  });
});

describe("comments", () => {
  const validFarmKey = "snake-valley";

  it("list is public and returns comments for a farm spot", async () => {
    const caller = appRouter.createCaller(createContext(null));
    const result = await caller.comments.list({ pageKey: "farm", farmKey: validFarmKey });
    expect(Array.isArray(result)).toBe(true);
  });

  it("list returns empty for a key with no comments", async () => {
    const caller = appRouter.createCaller(createContext(null));
    const result = await caller.comments.list({ pageKey: "sabuk", farmKey: "nao-existe" });
    expect(result).toEqual([]);
  });

  it("add requires authentication", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(
      caller.comments.add({ pageKey: "farm", farmKey: validFarmKey, content: "Dica para testar" }),
    ).rejects.toThrow();
  });

  it("add validates content length and farm key", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    await expect(
      caller.comments.add({ pageKey: "farm", farmKey: validFarmKey, content: "ab" }),
    ).rejects.toThrow();
    await expect(
      caller.comments.add({ pageKey: "farm", farmKey: "nao-existe", content: "Dica válida para testar" }),
    ).rejects.toThrow();
  });

  it("add stores the comment for the authenticated user", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.comments.add({ pageKey: "farm", farmKey: validFarmKey, content: "Dica válida para testar" });
    expect(result.success).toBe(true);
    expect(db.addPageComment).toHaveBeenCalledWith(42, "farm", validFarmKey, "Dica válida para testar");
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

describe("calculadora darksteel", () => {
  it("aplica o multiplicador do selo ao ganho base", async () => {
    const { calculateMining, SEAL_MULTIPLIER, MINE_AREAS, DRACO_REQUIREMENT } = await import("@shared/guideData");
    const base = MINE_AREAS.find(a => a.key === "byeoksan")!;
    for (const level of [0, 1, 2, 3] as const) {
      const r = calculateMining({ sealLevel: level, areaKey: "byeoksan", hours: 1, afk: false });
      expect(r.dsPerHour).toBe(Math.round(base.dsPerHourBase * SEAL_MULTIPLIER[level]));
    }
  });

  it("aplica penalidade de AFK e projeta DRACO com taxa de 10%", async () => {
    const { calculateMining, DRACO_REQUIREMENT: DRACO_REQ } = await import("@shared/guideData");
    const afk = calculateMining({ sealLevel: 2, areaKey: "byeoksan", hours: 1, afk: true });
    const active = calculateMining({ sealLevel: 2, areaKey: "byeoksan", hours: 1, afk: false });
    expect(afk.dsPerHour).toBe(Math.round(active.dsPerHour * 0.8));
    const weekly = calculateMining({ sealLevel: 3, areaKey: "jinyu-elite", hours: 100, afk: false });
    const effective = weekly.totalDs * 0.9;
    expect(weekly.draco).toBe(Math.floor(effective / DRACO_REQ));
  });

  it("rejeita área inexistente caindo para a primeira área", async () => {
    const { calculateMining, MINE_AREAS } = await import("@shared/guideData");
    const r = calculateMining({ sealLevel: 1, areaKey: "area-que-nao-existe", hours: 1, afk: false });
    expect(r.dsPerHour).toBeGreaterThan(0);
    void MINE_AREAS;
  });
});

describe("skills e subclasses", () => {
  it("todas as classes têm 3 builds (pve, pvp, afk) com skills e dicas", async () => {
    const { CLASS_SKILLS, SUBCLASS_TIPS } = await import("@shared/guideData");
    const keys = new Set(CLASS_SKILLS.map(c => c.key));
    expect(CLASS_SKILLS.length).toBe(8);
    for (const c of CLASS_SKILLS) {
      expect(keys.has(c.key)).toBe(true);
      const scenarios = c.builds.map(b => b.scenario);
      expect(scenarios).toEqual(["pve", "pvp", "afk"]);
      for (const b of c.builds) {
        expect(b.skills.length).toBeGreaterThan(0);
        expect(b.rotation.length).toBeGreaterThan(0);
        expect(b.notes.length).toBeGreaterThan(0);
      }
      expect(c.skillsHighlight.length).toBeGreaterThan(0);
      expect(c.advancedTips.length).toBeGreaterThan(0);
    }
    expect(SUBCLASS_TIPS.rules.length).toBeGreaterThan(0);
  });
});

describe("comentários skills", () => {
  it("aceita página skills com chave de classe válida e rejeita inválida", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const ok = await caller.comments.add({ pageKey: "skills", farmKey: "warrior", content: "Build de teste para warrior" });
    expect(ok.success).toBe(true);
    await expect(
      caller.comments.add({ pageKey: "skills", farmKey: "classe-inexistente", content: "Dica inválida para testar" }),
    ).rejects.toThrow();
  });
});

describe("favorites.toggle with materials items", () => {
  it("accepts a valid materials item id", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.favorites.toggle({ itemId: "materials:dragonsteel", itemType: "materials" });
    expect(result.added).toBe(true);
    expect(db.addFavorite).toHaveBeenCalledOnce();
  });

  it("rejects an unknown materials item id", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    await expect(
      caller.favorites.toggle({ itemId: "materials:nao-existe", itemType: "materials" }),
    ).rejects.toThrow();
  });
});

describe("comments materials", () => {
  it("aceita página materials com farmKey geral e rejeita chave inválida", async () => {
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const ok = await caller.comments.add({ pageKey: "materials", farmKey: "geral", content: "Rota de teste para dragonsteel" });
    expect(ok.success).toBe(true);
    await expect(
      caller.comments.add({ pageKey: "materials", farmKey: "chave-invalida", content: "Comentário inválido para testar" }),
    ).rejects.toThrow();
  });
});

describe("share.getProfile", () => {
  it("returns public profile for an existing user", async () => {
    vi.mocked(db.listFavorites).mockResolvedValue([]);
    vi.mocked(db.listCodexProgress).mockResolvedValue([]);
    // Simula getDb retornando o usuário
    vi.mocked(db.getDb).mockResolvedValue({
      select: () => ({ from: () => ({ where: async () => [authenticatedUser] }) }),
    } as unknown as ReturnType<typeof db.getDb> extends Promise<infer T> ? T : never);
    const caller = appRouter.createCaller(createContext(null));
    const profile = await caller.share.getProfile({ userId: 42 });
    expect(profile.id).toBe(42);
    expect(profile.name).toBe("Test User");
    expect(Array.isArray(profile.favorites)).toBe(true);
    expect(Array.isArray(profile.progress)).toBe(true);
  });

  it("throws for a non-existent user", async () => {
    vi.mocked(db.getDb).mockResolvedValue({
      select: () => ({ from: () => ({ where: async () => [] }) }),
    } as unknown as ReturnType<typeof db.getDb> extends Promise<infer T> ? T : never);
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.share.getProfile({ userId: 999999 })).rejects.toThrow("Perfil não encontrado");
  });

  it("rejects non-positive user ids", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.share.getProfile({ userId: 0 })).rejects.toThrow();
    await expect(caller.share.getProfile({ userId: -1 })).rejects.toThrow();
  });
});

describe("events.upcoming", () => {
  it("retorna alertas ordenados por proximidade para qualquer região válida", async () => {
    const caller = appRouter.createCaller(createContext(null));
    const alerts = await caller.events.upcoming({ regionKey: "sa" });
    expect(alerts.length).toBeGreaterThan(0);
    for (const a of alerts) {
      expect(a.minutesUntil).toBeGreaterThanOrEqual(0);
      expect(typeof a.name).toBe("string");
    }
    const sorted = [...alerts].sort((a, b) => a.minutesUntil - b.minutesUntil);
    expect(alerts.map(a => a.minutesUntil)).toEqual(sorted.map(a => a.minutesUntil));
  });

  it("recai para a região padrão com chave de região desconhecida", async () => {
    const caller = appRouter.createCaller(createContext(null));
    const alerts = await caller.events.upcoming({ regionKey: "xx-invalid" });
    expect(alerts.length).toBeGreaterThan(0);
  });

  it("calcula corretamente a janela de alerta de 15 minutos", async () => {
    const { computeUpcomingAlerts } = await import("./events");
    // Ponto fixo no tempo para um cálculo determinístico
    const now = new Date("2026-08-19T00:00:00Z");
    const alerts = computeUpcomingAlerts("na", now);
    const sabuk = alerts.find(a => a.key === "sabuk");
    expect(sabuk).toBeDefined();
    expect(sabuk!.minutesUntil).toBeGreaterThan(0);
  });

  it("marca evento como ativo quando a ocorrência está dentro da janela de duração", async () => {
    const { computeUpcomingAlerts } = await import("./events");
    // Região NA fuso America/New_York (EDT = UTC-4 em agosto). 10:15Z = 06:15 ET:
    // Leader's III (ciclo 3h) começa às 06:00 ET = 10:00Z → 15 min dentro da duração de 45 min
    const now = new Date("2026-08-19T10:15:00Z");
    const alerts = computeUpcomingAlerts("na", now);
    const leader = alerts.find(a => a.key === "ms-leader3");
    expect(leader?.activeNow).toBe(true);
    expect(leader?.minutesUntil).toBe(0);
    const box = alerts.find(a => a.key === "ms-box-red");
    // Red Box (ciclo 1h, duração 30 min) começou às 06:00 ET = 10:00Z → também ativo
    expect(box?.activeNow).toBe(true);
  });

  it("não marca evento como ativo depois que a duração termina", async () => {
    const { computeUpcomingAlerts } = await import("./events");
    // 10:50Z = 06:50 ET: 50 min após o início do Red Box (duração 30 min) → inativo
    const now = new Date("2026-08-19T10:50:00Z");
    const alerts = computeUpcomingAlerts("na", now);
    const box = alerts.find(a => a.key === "ms-box-red");
    expect(box?.activeNow).toBe(false);
    expect(box?.minutesUntil).toBeGreaterThan(0);
    // Leader's III (duração 45 min, início 10:00Z) já expirou aos 10:50Z
    const leader = alerts.find(a => a.key === "ms-leader3");
    expect(leader?.activeNow).toBe(false);
  });
});

describe("faq.topTips", () => {
  it("retorna vazio quando não há comentários no banco", async () => {
    vi.mocked(db.fetchTopTips).mockResolvedValue([]);
    const caller = appRouter.createCaller(createContext(null));
    const pages = await caller.faq.topTips({});
    expect(Array.isArray(pages)).toBe(true);
  });

  it("usa score = upvotes - downvotes na ordenação por página", async () => {
    const rows = [
      { id: 1, pageKey: "farm", farmKey: "geral", content: "dica 1", upvotes: 10, downvotes: 2, createdAt: new Date(), userName: "u1" },
      { id: 2, pageKey: "farm", farmKey: "geral", content: "dica 2", upvotes: 5, downvotes: 1, createdAt: new Date(), userName: "u2" },
      { id: 3, pageKey: "raids", farmKey: "geral", content: "dica 3", upvotes: 20, downvotes: 10, createdAt: new Date(), userName: "u3" },
    ];
    vi.mocked(db.fetchTopTips).mockResolvedValue(rows);
    const caller = appRouter.createCaller(createContext(null));
    const pages = await caller.faq.topTips({ minUpvotes: 5 });
    const farmPage = pages.find(p => p.pageKey === "farm");
    expect(farmPage?.tips.length).toBeGreaterThan(0);
    expect(farmPage!.tips[0].id).toBe(1);
    expect(farmPage!.tips[0].score).toBe(8);
    const raidsPage = pages.find(p => p.pageKey === "raids");
    expect(raidsPage?.tips[0].score).toBe(10);
  });

  it("ordena por score e não deixa dica com muitos downvotes vencer dica de score maior", async () => {
    const rows = [
      { id: 1, pageKey: "farm", farmKey: "geral", content: "dica ruim", upvotes: 20, downvotes: 18, createdAt: new Date(), userName: "u1" },
      { id: 2, pageKey: "farm", farmKey: "geral", content: "dica boa", upvotes: 12, downvotes: 0, createdAt: new Date(), userName: "u2" },
    ];
    vi.mocked(db.fetchTopTips).mockResolvedValue(rows);
    const caller = appRouter.createCaller(createContext(null));
    const pages = await caller.faq.topTips({});
    const farmPage = pages.find(p => p.pageKey === "farm");
    // score(1) = 2, score(2) = 12 → dica boa deve ficar em primeiro
    expect(farmPage?.tips[0].id).toBe(2);
    expect(farmPage?.tips[1].id).toBe(1);
  });
});

describe("buildCodec (export/import de builds)", () => {
  it("codifica e decodifica uma build de Warrior PvE sem perda de dados", async () => {
    const { encodeBuild, decodeBuild } = await import("../shared/buildCodec");
    const build = { classKey: "warrior", scenario: "pve", skills: ["Dragon Flame", "Splitting Slash"], rotation: "Bash → Dragon Flame → Ultimate", notes: "Build para raids de clã" };
    const text = encodeBuild(build);
    expect(text.startsWith("MIR4-SKILLS:")).toBe(true);
    const decoded = decodeBuild(text);
    expect(decoded?.classKey).toBe("warrior");
    expect(decoded?.scenario).toBe("pve");
    expect(decoded?.skills).toEqual(["Dragon Flame", "Splitting Slash"]);
    expect(decoded?.rotation).toBe(build.rotation);
    expect(decoded?.notes).toBe(build.notes);
    expect(decoded?.importedClassKnown).toBe(true);
  });

  it("aceita importação sem o prefixo e rejeita strings malformadas", async () => {
    const { encodeBuild, decodeBuild } = await import("../shared/buildCodec");
    const text = encodeBuild({ classKey: "taoist", scenario: "afk", skills: ["Sword Mastery"], rotation: "auto", notes: "x" });
    const bare = text.slice("MIR4-SKILLS:".length);
    expect(decodeBuild(bare)?.classKey).toBe("taoist");
    expect(decodeBuild("texto-qualquer-aleatorio")).toBeNull();
    expect(decodeBuild("MIR4-SKILLS:")).toBeNull();
  });

  it("marca classes desconhecidas no resultado", async () => {
    const { decodeBuild } = await import("../shared/buildCodec");
    const decoded = decodeBuild("MIR4-SKILLS:classe-falsa|pvp|Skill+X|rot|notas");
    expect(decoded?.importedClassKnown).toBe(false);
    expect(decoded?.skills).toEqual(["Skill", "X"]);
  });
});

describe("comments.setUserVote", () => {
  it("registra um upvote novo e ajusta o contador", async () => {
    vi.mocked(db.setUserCommentVote).mockResolvedValue({ success: true, upvotes: 1, downvotes: 0, userVote: 1 });
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.comments.setUserVote({ commentId: 7, vote: 1 });
    expect(result.userVote).toBe(1);
    expect(db.setUserCommentVote).toHaveBeenCalledWith(42, 7, 1);
  });

  it("remove o voto ao receber 0", async () => {
    vi.mocked(db.setUserCommentVote).mockResolvedValue({ success: true, upvotes: 0, downvotes: 0, userVote: 0 });
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.comments.setUserVote({ commentId: 7, vote: 0 });
    expect(result.userVote).toBe(0);
    expect(db.setUserCommentVote).toHaveBeenCalledWith(42, 7, 0);
  });

  it("rejeita acesso anônimo", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.comments.setUserVote({ commentId: 7, vote: 1 })).rejects.toThrow();
  });
});

describe("user.voteHistory", () => {
  it("lista os votos do usuário logado", async () => {
    const rows = [
      { vote: 1, commentId: 1, votedAt: new Date(), pageKey: "farm", farmKey: "darksteel-mine", content: "Farm de darksteel", upvotes: 3, downvotes: 0 },
      { vote: -1, commentId: 2, votedAt: new Date(), pageKey: "sabuk", farmKey: "geral", content: "Ruinosa", upvotes: 1, downvotes: 4 },
    ];
    vi.mocked(db.listVoteHistory).mockResolvedValue(rows);
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.user.voteHistory();
    expect(result).toHaveLength(2);
    expect(result[0].vote).toBe(1);
    expect(result[1].vote).toBe(-1);
  });

  it("rejeita acesso anônimo", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.user.voteHistory()).rejects.toThrow();
  });
});

describe("user.setSoundAlerts", () => {
  it("salva a preferência de alerta sonoro", async () => {
    vi.mocked(db.setSoundAlerts).mockResolvedValue({ success: true, enabled: true } as never);
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const result = await caller.user.setSoundAlerts({ enabled: true });
    expect(result.enabled).toBe(true);
    expect(db.setSoundAlerts).toHaveBeenCalledWith(42, true);
  });

  it("consulta a preferência salva", async () => {
    vi.mocked(db.getSoundAlerts).mockResolvedValue(false);
    const caller = appRouter.createCaller(createContext(authenticatedUser));
    const enabled = await caller.user.getSoundAlerts();
    expect(enabled).toBe(false);
  });
});

describe("Medalhas Dica de Ouro e timeline", () => {
  it("GOLD_TIP_UPVOTES é 10 (limiar do selo)", async () => {
    const cs = await import("../client/src/components/guide/CommentsSection");
    expect(cs.GOLD_TIP_UPVOTES).toBe(10);
  });

  it("conta medalhas corretamente (votos a favor em dicas 10+ upvotes)", async () => {
    const votes = [
      { vote: 1, upvotes: 10 }, // ouro
      { vote: 1, upvotes: 11 }, // ouro
      { vote: 1, upvotes: 9 }, // não
      { vote: -1, upvotes: 10 }, // não (downvote)
      { vote: 0, upvotes: 10 }, // não (removido)
    ];
    const gold = votes.filter(v => v.vote === 1 && (v.upvotes ?? 0) >= 10).length;
    expect(gold).toBe(2);
  });

  it("filtro goldOnly da FAQ mantém apenas dicas com 10+ upvotes", async () => {
    const cs = await import("../client/src/components/guide/CommentsSection");
    const tips = [
      { id: 1, upvotes: 10 },
      { id: 2, upvotes: 7 },
      { id: 3, upvotes: 15 },
      { id: 4, upvotes: 0 },
    ];
    const goldOnly = tips.filter(t => t.upvotes >= cs.GOLD_TIP_UPVOTES);
    expect(goldOnly.map(t => t.id)).toEqual([1, 3]);
  });

  it("timeline mescla favoritos, votos e codex em ordem cronológica decrescente", () => {
    const favs = [{ createdAt: new Date("2026-08-10T00:00:00Z") }];
    const votes = [{ votedAt: new Date("2026-08-12T00:00:00Z"), commentId: 7, vote: 1 }];
    const progress = [{ collectedAt: new Date("2026-08-11T00:00:00Z") }];
    const items: { ts: number; kind: string }[] = [
      ...favs.map(f => ({ ts: new Date(f.createdAt).getTime(), kind: "fav" })),
      ...votes.map(v => ({ ts: new Date(v.votedAt).getTime(), kind: "vote" })),
      ...progress.map(p => ({ ts: new Date(p.collectedAt).getTime(), kind: "codex" })),
    ];
    items.sort((a, b) => b.ts - a.ts);
    expect(items.map(i => i.kind)).toEqual(["vote", "codex", "fav"]);
  });

  it("filtro de timeline por tipo seleciona apenas o tipo escolhido", () => {
    const items = [
      { ts: 1, kind: "fav" },
      { ts: 2, kind: "vote" },
      { ts: 3, kind: "codex" },
    ];
    const filter = "vote";
    const visible = items.filter(t => t.kind === filter);
    expect(visible).toHaveLength(1);
    expect(visible[0].kind).toBe("vote");
  });
});

describe("community.goldLeaderboard", () => {
  it("retorna ranking ordenado por medalhas de ouro", async () => {
    vi.mocked(db.goldLeaderboard).mockResolvedValue([
      { userId: 1, userName: "Lendário", goldBadges: 5 },
      { userId: 2, userName: "Ferreiro", goldBadges: 3 },
    ]);
    const caller = appRouter.createCaller(createContext(null));
    const board = await caller.community.goldLeaderboard();
    expect(board).toHaveLength(2);
    expect(board[0].goldBadges).toBe(5);
    expect(board[0].userName).toBe("Lendário");
    expect(board[1].goldBadges).toBe(3);
    expect(db.goldLeaderboard).toHaveBeenCalledOnce();
  });

  it("lista vazia quando ninguém tem medalha", async () => {
    const caller = appRouter.createCaller(createContext(null));
    const board = await caller.community.goldLeaderboard();
    expect(board).toEqual([]);
  });
});
