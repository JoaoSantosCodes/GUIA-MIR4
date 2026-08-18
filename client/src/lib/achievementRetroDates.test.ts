import { describe, expect, it, vi, beforeEach } from "vitest";
import { backfillRetroHistory, reconstructRetroAchievements } from "./achievementRetroDates";
import { CODEX_ITEMS } from "@shared/guideData";

const T1 = 1_700_000_000_000; // data base

function makeProgress(keys: string[], startDate = T1, step = 1000): { itemId: string; collectedAt: number }[] {
  return keys.map((k, i) => ({ itemId: k, collectedAt: startDate + i * step }));
}

function keysByRarity(rarity: string, max = 100): string[] {
  return CODEX_ITEMS.filter(c => c.rarity === rarity).map(c => c.key).slice(0, max);
}

describe("reconstructRetroAchievements", () => {
  it("não reconstrói nada sem progresso", () => {
    expect(reconstructRetroAchievements([])).toEqual([]);
  });

  it("reconstrói codex-10 na data da 10ª coleta", () => {
    const keys = CODEX_ITEMS.slice(0, 10).map(c => c.key);
    const progress = makeProgress(keys);
    const retro = reconstructRetroAchievements(progress);
    const c10 = retro.find(r => r.key === "codex-10");
    expect(c10).toBeTruthy();
    expect(c10!.unlockedAt).toBe(T1 + 9000); // 10ª coleta
  });

  it("reconstrói codex-25 na data da 25ª coleta", () => {
    const keys = CODEX_ITEMS.slice(0, 25).map(c => c.key);
    const retro = reconstructRetroAchievements(makeProgress(keys));
    const c25 = retro.find(r => r.key === "codex-25");
    expect(c25).toBeTruthy();
    expect(c25!.unlockedAt).toBe(T1 + 24000);
  });

  it("reconstrói faixa-t1 (todos UC) com a data da última coleta UC", () => {
    const ucKeys = keysByRarity("UC");
    const retro = reconstructRetroAchievements(makeProgress(ucKeys));
    const t1 = retro.find(r => r.key === "faixa-t1");
    expect(t1).toBeTruthy();
    expect(t1!.unlockedAt).toBe(T1 + (ucKeys.length - 1) * 1000);
  });

  it("reconstrói faixa-t2 quando todos os itens Raros estão coletados, usando a última coleta Rara", () => {
    const rareKeys = keysByRarity("Raro");
    const retro = reconstructRetroAchievements(makeProgress(rareKeys));
    const t2 = retro.find(r => r.key === "faixa-t2");
    expect(t2).toBeTruthy();
    expect(t2!.unlockedAt).toBe(T1 + (rareKeys.length - 1) * 1000);
  });

  it("não reconstrói faixa-t3 quando raridade Épica está incompleta", () => {
    const epicKeys = keysByRarity("Épico", 1);
    const retro = reconstructRetroAchievements(makeProgress(epicKeys));
    expect(retro.find(r => r.key === "faixa-t3")).toBeUndefined();
  });

  it("reconstrói raro-5 na data da 5ª coleta Raro ou superior, ignorando UC", () => {
    const mixed = [
      ...CODEX_ITEMS.filter(c => c.rarity === "UC").slice(0, 3).map(c => c.key),
      ...CODEX_ITEMS.filter(c => c.rarity === "Raro").slice(0, 3).map(c => c.key),
      ...CODEX_ITEMS.filter(c => c.rarity === "Épico").slice(0, 2).map(c => c.key),
    ];
    const retro = reconstructRetroAchievements(makeProgress(mixed));
    const r5 = retro.find(r => r.key === "raro-5");
    expect(r5).toBeTruthy();
    expect(r5!.unlockedAt).toBe(T1 + 7000); // índices 3..7 são Raro/Épico; a 5ª relevante é índice 7
  });

  it("reconstrói conquista de categoria completa com a data da última coleta da categoria", () => {
    const cat = "Consumíveis";
    const catKeys = CODEX_ITEMS.filter(c => c.category === cat).map(c => c.key);
    const retro = reconstructRetroAchievements(makeProgress(catKeys));
    const cons = retro.find(r => r.key === "consumiveis-6");
    expect(cons).toBeTruthy();
    expect(cons!.unlockedAt).toBe(T1 + (catKeys.length - 1) * 1000);
  });

  it("ordena o retorno do mais recente para o mais antigo", () => {
    const keys = CODEX_ITEMS.slice(0, 25).map(c => c.key);
    const retro = reconstructRetroAchievements(makeProgress(keys));
    for (let i = 1; i < retro.length; i++) {
      expect(retro[i - 1].unlockedAt).toBeGreaterThanOrEqual(retro[i].unlockedAt);
    }
  });
});

describe("backfillRetroHistory", () => {
  const localStorageMock = new Map<string, string>();
  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => localStorageMock.get(k) ?? null,
      setItem: (k: string, v: string) => { localStorageMock.set(k, v); },
      removeItem: (k: string) => { localStorageMock.delete(k); },
    });
  });

  it("adiciona registros retro para conquistas ganhas sem histórico", async () => {
    const { readAchievementHistory } = await import("./celebrationState");
    const catKeys = CODEX_ITEMS.filter(c => c.category === "Consumíveis").map(c => c.key);
    const appended: { key: string }[] = [];
    const added = backfillRetroHistory(makeProgress(catKeys), {
      read: readAchievementHistory,
      append: e => { appended.push(e); },
    });
    expect(added).toBeGreaterThan(0);
    expect(appended.some(a => a.key === "consumiveis-6")).toBe(true);
    expect(appended[0].source).toBe("retro");
  });

  it("preenche o histórico local sem duplicar", async () => {
    const { readAchievementHistory, appendAchievementHistory } = await import("./celebrationState");
    const catKeys = CODEX_ITEMS.filter(c => c.category === "Consumíveis").map(c => c.key);
    const appended: { key: string }[] = [];
    const added1 = backfillRetroHistory(makeProgress(catKeys), {
      read: readAchievementHistory,
      append: e => { appended.push(e); return appendAchievementHistory(e); },
    });
    expect(added1).toBeGreaterThan(0);
    expect(appended.some(a => a.key === "consumiveis-6")).toBe(true);
    const added2 = backfillRetroHistory(makeProgress(catKeys), {
      read: readAchievementHistory,
      append: e => appended.push(e),
    });
    expect(added2).toBe(0);
  });

  it("não duplica conquistas já registradas em sessão (mesma data)", async () => {
    const { readAchievementHistory, appendAchievementHistory } = await import("./celebrationState");
    // progress com 10 itens UC garante codex-10, faixa-t1, equipamentos-5 e materiais-10 ganhos
    const keys = CODEX_ITEMS.slice(0, 10).map(c => c.key);
    const retro = reconstructRetroAchievements(makeProgress(keys));
    expect(retro.some(r => r.key === "codex-10")).toBe(true);
    // registra codex-10 em sessão com a MESMA data do retro (simula desbloqueio na hora)
    const c10 = retro.find(r => r.key === "codex-10")!;
    appendAchievementHistory({ ...c10, source: "session" });
    const added = backfillRetroHistory(makeProgress(keys, T1, 1000), {
      read: readAchievementHistory,
      append: () => undefined,
    });
    // codex-10 não foi adicionado de novo (dedupe por key+data), mas as demais conquistas sem registro retro foram
    expect(readAchievementHistory().filter(e => e.key === "codex-10")).toHaveLength(1);
    expect(added).toBe(3);
  });
});
