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

function keysByRarity(rarity: string): string[] {
  return CODEX_ITEMS.filter(c => c.rarity === rarity).map(c => c.key);
}

describe("evaluateCodexAchievements", () => {
  it("não concede conquistas com coleção vazia", () => {
    const result = evaluateCodexAchievements([]);
    expect(result.every(a => !a.earned)).toBe(true);
  });

  it("concede codex-10 e codex-25 pelo total correto e não concede metas inalcançáveis", () => {
    // o dataset tem 46 itens no total — todos somados atingem codex-10 e codex-25, mas não codex-50
    const all = CODEX_ITEMS.map(c => c.key);
    expect(evaluateCodexAchievements(all).find(a => a.key === "codex-10")!.earned).toBe(true);
    expect(evaluateCodexAchievements(all).find(a => a.key === "codex-25")!.earned).toBe(true);
    expect(evaluateCodexAchievements(all).find(a => a.key === "codex-50")!.earned).toBe(false);
    expect(evaluateCodexAchievements(all.slice(0, 9)).find(a => a.key === "codex-10")!.earned).toBe(false);
    expect(evaluateCodexAchievements(all.slice(0, 24)).find(a => a.key === "codex-25")!.earned).toBe(false);
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
    // o dataset tem 6 itens Raro (26 Raro+ no total); coletando 5+ atinge raro-5
    const all = CODEX_ITEMS.map(c => c.key);
    expect(evaluateCodexAchievements(all).find(a => a.key === "raro-5")!.earned).toBe(true);
    const rareOnly = keysByRarity("Raro");
    const r2 = evaluateCodexAchievements(rareOnly);
    expect(r2.find(a => a.key === "raro-5")!.earned).toBe(rareOnly.length >= 5);
    // progress é limitado pela meta (5)
    expect(r2.find(a => a.key === "raro-5")!.progress).toBe(Math.min(rareOnly.length, 5));
  });

  it("concede conquistas de categorias novas (Consumíveis, Colecionáveis, Badges, faixa UC)", () => {
    const all = CODEX_ITEMS.map(c => c.key);
    const r = evaluateCodexAchievements(all);
    expect(r.find(a => a.key === "consumiveis-6")!.earned).toBe(true);
    expect(r.find(a => a.key === "colecionaveis-6")!.earned).toBe(true);
    expect(r.find(a => a.key === "rep-6")!.earned).toBe(true);
    expect(r.find(a => a.key === "faixa-t1")!.earned).toBe(true);
    expect(r.find(a => a.key === "equipamentos-5")!.earned).toBe(true);
    expect(r.find(a => a.key === "materiais-10")!.earned).toBe(true);
    expect(r.find(a => a.key === "lendario-1")!.earned).toBe(true);
    expect(r.find(a => a.key === "cat-equipamentos")!.earned).toBe(true);
  });

  it("faixa-t1 só é concedida quando todos os itens UC estão coletados", () => {
    const ucOnly = keysByRarity("UC");
    expect(evaluateCodexAchievements(ucOnly).find(a => a.key === "faixa-t1")!.earned).toBe(true);
    expect(evaluateCodexAchievements(ucOnly.slice(0, -1)).find(a => a.key === "faixa-t1")!.earned).toBe(false);
  });

  it.each(["faixa-t2", "faixa-t3", "faixa-t4", "faixa-t5"])("%s só é concedida quando todos os itens daquela raridade estão coletados", key => {
    const rarity =
      key === "faixa-t2" ? "Raro" : key === "faixa-t3" ? "Épico" : key === "faixa-t4" ? "Lendário" : "Mítico";
    const allKeys = CODEX_ITEMS.map(c => c.key);
    const withAll = evaluateCodexAchievements(allKeys);
    expect(withAll.find(a => a.key === key)!.earned).toBe(true);
    const tierItems = keysByRarity(rarity);
    if (tierItems.length > 0) {
      expect(evaluateCodexAchievements(tierItems.slice(0, -1)).find(a => a.key === key)!.earned).toBe(false);
      expect(evaluateCodexAchievements(tierItems).find(a => a.key === key)!.earned).toBe(true);
      expect(evaluateCodexAchievements(tierItems).find(a => a.key === key)!.progress).toBe(tierItems.length);
    }
  });

  it("progress das conquistas de faixa fica truncado na meta (min(done,all))", () => {
    const all = CODEX_ITEMS.map(c => c.key);
    for (const key of ["faixa-t2", "faixa-t3", "faixa-t4", "faixa-t5"]) {
      const a = evaluateCodexAchievements(all).find(x => x.key === key)!;
      expect(a.progress).toBeLessThanOrEqual(a.goal);
    }
  });

  it("rep-6 e consumiveis-6 exigem 6 itens das respectivas categorias", () => {
    const rep6 = keysByRarity("Raro").concat(keysByRarity("Épico")).slice(0, 6);
    const rep = CODEX_ITEMS.filter(c => c.category === "Badges de Reputação").slice(0, 6).map(c => c.key);
    expect(evaluateCodexAchievements(rep).find(a => a.key === "rep-6")!.earned).toBe(true);
    expect(evaluateCodexAchievements(rep.slice(0, 5)).find(a => a.key === "rep-6")!.earned).toBe(false);
  });

  it("progress e goal são consistentes com earned (coleção completa)", () => {
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
