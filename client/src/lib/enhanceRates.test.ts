import { describe, expect, it } from "vitest";
import { BREAK_RISK_LABELS, ENHANCE_RATES, ENHANCE_RATES_NOTE, effectiveRate } from "./enhanceRates";

describe("ENHANCE_RATES", () => {
  it("tem 10 linhas cobrindo +0→+10 em sequência sem lacunas", () => {
    expect(ENHANCE_RATES).toHaveLength(10);
    for (let i = 0; i < ENHANCE_RATES.length; i++) {
      expect(ENHANCE_RATES[i].from).toBe(i);
      expect(ENHANCE_RATES[i].to).toBe(i + 1);
    }
  });

  it("começa garantido e degrada monotonicamente", () => {
    expect(ENHANCE_RATES[0].successRate).toBe(100);
    for (let i = 1; i < ENHANCE_RATES.length; i++) {
      expect(ENHANCE_RATES[i].successRate).toBeLessThan(ENHANCE_RATES[i - 1].successRate);
    }
  });

  it("não tem quebra nos estágios baixos (+0→+3) e tem destruição em +9→+10", () => {
    for (let i = 0; i <= 3; i++) {
      expect(ENHANCE_RATES[i].breakRate).toBe(0);
    }
    // risco 'none' só nos três primeiros; +3→+4 já é 'low' (sem quebra, mas versões antigas podiam perder níveis)
    const last = ENHANCE_RATES[ENHANCE_RATES.length - 1];
    expect(last.breakRisk).toBe("destruction");
    expect(last.breakRate).toBeGreaterThan(0);
  });

  it("breakRisk sempre tem rótulo", () => {
    for (const row of ENHANCE_RATES) {
      expect(BREAK_RISK_LABELS[row.breakRisk]).toBeTruthy();
    }
  });
});

describe("effectiveRate", () => {
  it("mantém a taxa base sem proteção", () => {
    expect(effectiveRate(ENHANCE_RATES[6], false)).toBe(45);
  });

  it("adiciona +20 p.p. com proteção, limitado a 100", () => {
    expect(effectiveRate(ENHANCE_RATES[1], true)).toBe(100); // 95 + 20 = 100 (clamp)
    expect(effectiveRate(ENHANCE_RATES[6], true)).toBe(65);
  });
});

describe("nota de referência", () => {
  it("explica que os valores são indicativos", () => {
    expect(ENHANCE_RATES_NOTE).toContain("indicativos");
  });
});
