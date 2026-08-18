/**
 * Taxas de sucesso e risco de quebra do fortalecimento (enhancement) do MIR4.
 *
 * Referência indicativa de comunidade (2024–2026): nos estágios baixos a
 * taxa de sucesso é alta e a falha apenas consome o material; acima de
 * +5 a quebra passa a ser real, especialmente em Dragon Artifacts Rare e
 * Epic (destruídos ao falhar). Itens de proteção (protection jade/rolls)
 * e a mecânica de pity aumentam a taxa efetiva.
 *
 * Os números são aproximações divulgadas pela comunidade — o jogo não
 * publica as taxas oficiais de todas as faixas.
 */

export interface EnhanceRateRow {
  from: number; // estágio de partida (+N)
  to: number; // estágio alvo (+N)
  successRate: number; // taxa de sucesso em % (0–100)
  breakRisk: "none" | "low" | "moderate" | "high" | "destruction";
  breakRate: number; // taxa de quebra em % (0–100, 0 = não quebra)
  note: string;
}

export const BREAK_RISK_LABELS: Record<EnhanceRateRow["breakRisk"], string> = {
  none: "Sem quebra",
  low: "Baixo",
  moderate: "Moderado",
  high: "Alto",
  destruction: "Destruição",
};

/**
 * Taxas por tentativa de +N → +(N+1), de +0→+1 até +9→+10, alinhadas aos
 * custos de ENHANCE_COSTS (stage N cobre +N → +(N+1)).
 */
export const ENHANCE_RATES: EnhanceRateRow[] = [
  { from: 0, to: 1, successRate: 100, breakRisk: "none", breakRate: 0, note: "Garantido — falha apenas consome o material." },
  { from: 1, to: 2, successRate: 95, breakRisk: "none", breakRate: 0, note: "Falha não penaliza além do custo." },
  { from: 2, to: 3, successRate: 90, breakRisk: "none", breakRate: 0, note: "Falha não penaliza além do custo." },
  { from: 3, to: 4, successRate: 80, breakRisk: "low", breakRate: 0, note: "Risco baixo; versões antigas podiam perder níveis." },
  { from: 4, to: 5, successRate: 70, breakRisk: "moderate", breakRate: 5, note: "Primeira faixa com chance de quebra." },
  { from: 5, to: 6, successRate: 60, breakRisk: "moderate", breakRate: 10, note: "Use itens de proteção a partir daqui." },
  { from: 6, to: 7, successRate: 45, breakRisk: "high", breakRate: 25, note: "Dragon Artifacts Rare/Epic são destruídos ao falhar." },
  { from: 7, to: 8, successRate: 35, breakRisk: "high", breakRate: 35, note: "Alta quebra; acumule proteção antes de tentar." },
  { from: 8, to: 9, successRate: 25, breakRisk: "destruction", breakRate: 50, note: "Taxa brutal; só tente com proteção + pity." },
  { from: 9, to: 10, successRate: 15, breakRisk: "destruction", breakRate: 75, note: "Extremo — itens de proteção obrigatórios." },
];

export const ENHANCE_RATES_NOTE =
  "Valores indicativos de comunidade (2024–2026) — o jogo não publica todas as taxas. Dragon Artifacts Rare e Epic são destruídos ao falhar; Black/White Dragon apenas perdem 1–3 níveis. Itens de proteção (Eternals, protection rolls) elevam a taxa efetiva.";

/** Taxa efetiva de sucesso estimada com proteção aplicada (aprox. +15–25 p.p.). */
export function effectiveRate(rate: EnhanceRateRow, protected_: boolean): number {
  return protected_ ? Math.min(100, rate.successRate + 20) : rate.successRate;
}
