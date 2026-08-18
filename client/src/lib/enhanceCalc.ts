/**
 * Calculadora de fortalecimento (Enhancement) do MIR4 — lógica pura e testável.
 *
 * Calcula o custo acumulado em Darksteel para levar um equipamento do nível
 * atual até o nível alvo. O custo por estágio baseia-se na tabela ENHANCE_COSTS
 * do guideData, com multiplicador por slot (a base Darksteel varia por slot).
 * Jade é um material opcional de proteção/extra: o usuário informa o preço do
 * Jade no mercado e a calculadora estima o custo adicional para usar um Jade
 * por tentativa (proteção contra perda de nível).
 *
 * Todos os cálculos são determinísticos — sem acesso a DOM/API.
 */
import { ENHANCE_COSTS, EQUIPMENT_TYPES, MATERIAL_GOLD_PRICES } from "@shared/guideData";

/** Multiplicador de custo Darksteel por slot em relação à base do estágio. */
export const SLOT_DARKSTEEL_MULTIPLIER: Record<string, number> = {
  weapon: 1.0,
  armor: 0.8,
  helm: 0.7,
  gloves: 0.6,
  pants: 0.6,
  boots: 0.5,
  necklace: 0.6,
  rings: 0.6,
  bracelet: 0.5,
  "dragon-artifact": 50,
};

export const DEFAULT_SLOT = "weapon";

/** Custo de um único estágio para um slot específico. */
export function stageSlotCost(stage: number, slotKey: string): { darksteel: number; copper: number } {
  const entry = ENHANCE_COSTS.find(e => e.stage === stage);
  if (!entry) return { darksteel: 0, copper: 0 };
  const mult = SLOT_DARKSTEEL_MULTIPLIER[slotKey] ?? 1;
  return {
    darksteel: Math.round(entry.darksteel * mult),
    copper: entry.copper,
  };
}

/** Resultado da estimativa de fortalecimento. */
export interface EnhanceEstimate {
  /** Lista detalhada: custo de cada estágio intermediário. */
  steps: { stage: number; darksteel: number; copper: number; cumulativeDarksteel: number }[];
  /** Custo total em Darksteel do nível atual até o alvo. */
  totalDarksteel: number;
  /** Custo total em Copper. */
  totalCopper: number;
  /** Custo estimado em Jade, se informado. */
  totalJade: number;
  /** Valor em Jade (custo Jade = jadePriceUnit * tentativas estimadas). */
  jadeValue: number;
  /** Tentativas estimadas usando Jade protetor (1 por estágio tentado). */
  jadeAttempts: number;
  /** Custo total estimado em Gold: Darksteel, Copper e Jade pelo preço de mercado. */
  totalGold: number;
  /** Detalhe do custo em Gold por material. */
  goldBreakdown: { key: string; name: string; gold: number }[];
}

/**
 * Estima o custo total para levar um equipamento do nível `current` ao `target`.
 * `jadePriceUnit` é o custo de 1 Jade em Darksteel (0 = não usar Jade).
 */
export function estimateEnhance({
  current,
  target,
  slotKey = DEFAULT_SLOT,
  jadePriceUnit = 0,
}: {
  current: number;
  target: number;
  slotKey?: string;
  jadePriceUnit?: number;
}): EnhanceEstimate {
  const safeCurrent = Math.max(0, Math.min(current, 10));
  const safeTarget = Math.max(0, Math.min(target, 10));
  const steps: EnhanceEstimate["steps"] = [];
  let totalDarksteel = 0;
  let totalCopper = 0;
  let jadeAttempts = 0;

  if (safeTarget > safeCurrent) {
    for (let stage = safeCurrent + 1; stage <= safeTarget; stage++) {
      const cost = stageSlotCost(stage, slotKey);
      totalDarksteel += cost.darksteel;
      totalCopper += cost.copper;
      jadeAttempts += 1;
      steps.push({ stage, darksteel: cost.darksteel, copper: cost.copper, cumulativeDarksteel: totalDarksteel });
    }
  }

  const totalJade = jadePriceUnit > 0 ? jadeAttempts * jadePriceUnit : 0;

  // Preços de mercado em Gold (MaterialGoldPrice do guideData)
  const dsPrice = MATERIAL_GOLD_PRICES.find(p => p.key === "darksteel")?.goldPerUnit ?? 1000;
  const cuPrice = MATERIAL_GOLD_PRICES.find(p => p.key === "copper")?.goldPerUnit ?? 0.0001;
  const jadePrice = MATERIAL_GOLD_PRICES.find(p => p.key === "jade")?.goldPerUnit ?? 40000;

  const goldDarksteel = totalDarksteel * dsPrice;
  const goldCopper = totalCopper * cuPrice;
  const goldJade = totalJade * jadePrice;

  return {
    steps,
    totalDarksteel,
    totalCopper,
    totalJade,
    jadeValue: jadePriceUnit,
    jadeAttempts,
    totalGold: goldDarksteel + goldCopper + goldJade,
    goldBreakdown: [
      { key: "darksteel", name: "Darksteel", gold: goldDarksteel },
      { key: "copper", name: "Copper", gold: goldCopper },
      { key: "jade", name: "Jade", gold: goldJade },
    ],
  };
}

/** Formata um número grande com separadores de milhar (pt-BR). */
export function fmtNumber(n: number): string {
  return new Intl.NumberFormat("pt-BR").format(n);
}

export const ENHANCE_MAX_LEVEL = 10;

/** Lista de opções de slot para a calculadora (com nome e base Darksteel). */
export function enhanceSlotOptions() {
  return EQUIPMENT_TYPES.map(t => ({
    key: t.key,
    label: t.slot,
    baseDarksteel: t.enhCostBase,
  }));
}
