import { describe, expect, it } from "vitest";
import {
  stageSlotCost,
  estimateEnhance,
  fmtNumber,
  enhanceSlotOptions,
  SLOT_DARKSTEEL_MULTIPLIER,
  ENHANCE_MAX_LEVEL,
} from "./enhanceCalc";

describe("stageSlotCost", () => {
  it("aplica o multiplicador do slot à base Darksteel do estágio", () => {
    const weapon = stageSlotCost(1, "weapon");
    const armor = stageSlotCost(1, "armor");
    // estágio 1: darksteel base 5000; weapon x1.0, armor x0.8
    expect(weapon.darksteel).toBe(5000);
    expect(armor.darksteel).toBe(4000);
    expect(weapon.copper).toBe(100000);
  });

  it("Dragon Artifact usa o multiplicador de 50x", () => {
    const da = stageSlotCost(1, "dragon-artifact");
    expect(da.darksteel).toBe(250000);
  });

  it("retorna zero para estágio fora da tabela", () => {
    expect(stageSlotCost(99, "weapon")).toEqual({ darksteel: 0, copper: 0 });
  });
});

describe("estimateEnhance", () => {
  it("soma os custos de todos os estágios entre o nível atual e o alvo", () => {
    const est = estimateEnhance({ current: 0, target: 3, slotKey: "weapon" });
    // 5000 + 7500 + 10000 = 22500
    expect(est.totalDarksteel).toBe(22500);
    expect(est.steps.length).toBe(3);
    expect(est.steps[2].cumulativeDarksteel).toBe(22500);
    expect(est.totalCopper).toBe(100000 + 150000 + 200000);
  });

  it("retorna zero quando o alvo é igual ou menor que o nível atual", () => {
    expect(estimateEnhance({ current: 5, target: 5 }).totalDarksteel).toBe(0);
    expect(estimateEnhance({ current: 5, target: 3 }).totalDarksteel).toBe(0);
  });

  it("clampa níveis fora do intervalo 0–10", () => {
    const a = estimateEnhance({ current: -3, target: 2 });
    const b = estimateEnhance({ current: 0, target: 2 });
    expect(a.totalDarksteel).toBe(b.totalDarksteel);
    const c = estimateEnhance({ current: 0, target: 99 });
    const d = estimateEnhance({ current: 0, target: ENHANCE_MAX_LEVEL });
    expect(c.totalDarksteel).toBe(d.totalDarksteel);
  });

  it("calcula o custo em Jade quando informado o preço por unidade", () => {
    const est = estimateEnhance({ current: 0, target: 3, jadePriceUnit: 150000 });
    expect(est.jadeAttempts).toBe(3);
    expect(est.totalJade).toBe(450000);
  });

  it("não cobra Jade quando o preço é zero", () => {
    const est = estimateEnhance({ current: 0, target: 3, jadePriceUnit: 0 });
    expect(est.totalJade).toBe(0);
  });

  it("estima o custo total em Gold com os preços de mercado (Darksteel, Copper, Jade)", () => {
    const est = estimateEnhance({ current: 0, target: 3, slotKey: "weapon" });
    // Darksteel 1.000 Gold/unid + Copper 0,0001 Gold/unid + Jade 0 (não informado)
    const goldDs = est.totalDarksteel * 1000;
    const goldCu = est.totalCopper * 0.0001;
    expect(est.totalGold).toBeCloseTo(goldDs + goldCu, 0);
    expect(est.goldBreakdown.map(b => b.key)).toEqual(["darksteel", "copper", "jade"]);
    expect(est.goldBreakdown[0].gold).toBe(goldDs);
    expect(est.goldBreakdown[2].gold).toBe(0);
  });

  it("inclui o custo em Gold do Jade quando informado", () => {
    const est = estimateEnhance({ current: 0, target: 3, jadePriceUnit: 500 });
    expect(est.totalGold).toBeCloseTo(
      est.totalDarksteel * 1000 + est.totalCopper * 0.0001 + est.totalJade * 40000,
      0,
    );
    expect(est.goldBreakdown[2].gold).toBeGreaterThan(0);
  });
});

describe("fmtNumber", () => {
  it("formata com separadores pt-BR", () => {
    expect(fmtNumber(1000)).toBe("1.000");
    expect(fmtNumber(1234567)).toBe("1.234.567");
  });
});

describe("enhanceSlotOptions", () => {
  it("lista os 10 slots do guia com base Darksteel positiva", () => {
    const opts = enhanceSlotOptions();
    expect(opts.length).toBe(10);
    for (const opt of opts) {
      expect(opt.baseDarksteel).toBeGreaterThan(0);
      expect(opt.key in SLOT_DARKSTEEL_MULTIPLIER).toBe(true);
    }
  });
});
