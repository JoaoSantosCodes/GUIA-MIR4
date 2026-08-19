import { describe, expect, it, vi, beforeEach } from "vitest";

const T1 = 1_700_000_000_000;

function makeEntry(key: string, unlockedAt: number, source: "session" | "retro" = "session") {
  return {
    key,
    title: key,
    description: `desc ${key}`,
    iconKey: "star",
    unlockedAt,
    source,
  };
}

const localStorageMock = new Map<string, string>();

beforeEach(() => {
  localStorageMock.clear();
  vi.resetModules();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => localStorageMock.get(k) ?? null,
    setItem: (k: string, v: string) => { localStorageMock.set(k, v); },
    removeItem: (k: string) => { localStorageMock.delete(k); },
  });
});

describe("histórico de conquistas (localStorage)", () => {
  it("append registra a conquista e read a recupera", async () => {
    const { appendAchievementHistory, readAchievementHistory } = await import("./celebrationState");
    appendAchievementHistory(makeEntry("codex-10", T1));
    const all = readAchievementHistory();
    expect(all).toHaveLength(1);
    expect(all[0].key).toBe("codex-10");
    expect(all[0].source).toBe("session");
  });

  it("ordena o mais recente primeiro", async () => {
    const { appendAchievementHistory, readAchievementHistory } = await import("./celebrationState");
    appendAchievementHistory(makeEntry("codex-10", T1));
    appendAchievementHistory(makeEntry("codex-25", T1 + 60000));
    const all = readAchievementHistory();
    expect(all[0].key).toBe("codex-25");
  });

  it("limita o histórico a 100 entradas (FIFO pelo ranking)", async () => {
    const { appendAchievementHistory, readAchievementHistory } = await import("./celebrationState");
    for (let i = 0; i < 110; i++) {
      appendAchievementHistory(makeEntry(`ach-${i}`, T1 + i));
    }
    expect(readAchievementHistory()).toHaveLength(100);
    // o mais antigo sobra
    const keys = readAchievementHistory().map(e => e.key);
    expect(keys.includes("ach-0")).toBe(false);
  });

  it("descarta entradas corrompidas na leitura", async () => {
    localStorageMock.set("mir4-achievement-history", "[{\"chave\": 1}, \"garbage\"]");
    const { readAchievementHistory } = await import("./celebrationState");
    expect(readAchievementHistory()).toEqual([]);
  });

  it("tolera storage indisponível", async () => {
    const orig = globalThis.localStorage;
    vi.stubGlobal("localStorage", undefined);
    const { appendAchievementHistory, readAchievementHistory } = await import("./celebrationState");
    expect(() => appendAchievementHistory(makeEntry("codex-10", T1))).not.toThrow();
    expect(readAchievementHistory()).toEqual([]);
    vi.stubGlobal("localStorage", orig);
  });
});
