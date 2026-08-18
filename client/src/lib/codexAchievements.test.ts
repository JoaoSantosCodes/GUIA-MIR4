import { describe, expect, it } from "vitest";
import { evaluateCodexAchievements, CODEX_ACHIEVEMENTS } from "./codexAchievements";
import { CODEX_ITEMS } from "@shared/guideData";

function keysOf(...kinds: string[]): string[] {
  const ids: string[] = [];
  for (const kind of kinds) {
    CODEX_ITEMS.filter(c => c.category === kind).forEach(c => ids.push(c.key));
  }
  return ids;
}

describe("evaluateCodexAchievements", () => {
  it("não concede conquistas com coleção vazia", () => {
    const result = evaluateCodexAchievements([]);
    expect(result.every(a => !a.earned)).toBe(true);
  });

  it("concede codex-10 pelo total correto e não concede metas inalcançáveis", () => {
    // o dataset atual tem 20 itens no total — todos os itens somados atingem codex-10
    const all = CODEX_ITEMS.map(c => c.key);
    expect(evaluateCodexAchievements(all).find(a => a.key === "codex-10")!.earned).toBe(true);
    expect(evaluateCodexAchievements(all).find(a => a.key === "codex-25")!.earned).toBe(false);
    expect(evaluateCodexAchievements(all.slice(0, 9)).find(a => a.key === "codex-10")!.earned).toBe(false);
  });

  it("concede codex-50/codex-100 apenas com quantidade suficiente", () => {
    const big: string[] = [];
    for (let i = 0; i < 110; i++) big.push(`codex-item-${i}`);
    const r = evaluateCodexAchievements(big);
    expect(r.find(a => a.key === "codex-100")!.earned).toBe(true);
    expect(r.find(a => a.key === "codex-50")!.earned).toBe(true);
    expect(evaluateCodexAchievements(big.slice(0, 49)).find(a => a.key === "codex-50")!.earned).toBe(false);
    expect(evaluateCodexAchievements(big.slice(0, 99)).find(a => a.key === "codex-100")!.earned).toBe(false);
  });

  it("concede conquista de categoria completa quando todas as categorias estão 100%", () => {
    const allKeys = CODEX_ITEMS.map(c => c.key);
    const result = evaluateCodexAchievements(allKeys);
    expect(result.find(a => a.key === "cat-equipamentos")!.earned).toBe(true);
  });

  it("não concede conquista de categoria completa se uma categoria falta um item", () => {
    const missingOne = CODEX_ITEMS.map(c => c.key).slice(0, -1);
    const result = evaluateCodexAchievements(missingOne);
    expect(result.find(a => a.key === "cat-equipamentos")!.earned).toBe(false);
  });

  it("raro-5 respeita raridade e conta itens únicos do dataset", () => {
    const ucOnly = keysOf("Equipamentos", "Materiais");
    expect(evaluateCodexAchievements(ucOnly).find(a => a.key === "raro-5")!.earned).toBe(false);
    // o dataset tem apenas 1 item Raro; a conquista conta itens únicos coletados
    const all = CODEX_ITEMS.map(c => c.key);
    expect(evaluateCodexAchievements(all).find(a => a.key === "raro-5")!.earned).toBe(false);
    expect(evaluateCodexAchievements(all).find(a => a.key === "raro-5")!.progress).toBe(1);
  });

  it("progress e goal são consistentes com earned", () => {
    const allKeys = CODEX_ITEMS.map(c => c.key);
    for (const a of evaluateCodexAchievements(allKeys)) {
      expect(a.goal).toBeGreaterThan(0);
      expect(a.progress).toBeLessThanOrEqual(a.goal);
      if (a.earned) expect(a.progress).toBe(a.goal);
    }
  });

  it("todas as conquistas têm meta e chave de ícone válidas", () => {
    for (const a of CODEX_ACHIEVEMENTS) {
      expect(["book", "gem", "crown", "sparkle", "sword", "star"]).toContain(a.iconKey);
      expect(a.title.length).toBeGreaterThan(0);
    }
  });
});
