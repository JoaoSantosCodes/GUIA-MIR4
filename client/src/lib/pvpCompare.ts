/**
 * Comparador lado a lado de builds PvP do MIR4 — lógica pura e testável.
 *
 * Cada classe recebe scores base (0–100) por atributo em três cenários:
 * PvP 1×1, PvP de grupo e Bosses. O comparador calcula deltas, vencedor por
 * cenário e um placar agregado, permitindo a comparação de duas classes.
 *
 * Os scores refletem o perfil relativo de cada classe conforme a tier list
 * e o guia do site (ranking PvE: Lancer > Taoist > Arbalist > Warrior >
 * Sorcerer). São valores indicativos de comunidade — o meta real varia
 * por patch e servidor.
 */

export type Scenario = "duel" | "group" | "boss";

export const SCENARIO_LABELS: Record<Scenario, string> = {
  duel: "PvP 1×1",
  group: "PvP em grupo",
  boss: "Bosses / PvE",
};

export interface ClassScores {
  key: string;
  name: string;
  scores: Record<Scenario, { dano: number; defesa: number; utilidade: number }>;
}

/** Classes disponíveis para comparação com scores base. */
export const COMPARE_CLASSES: ClassScores[] = [
  {
    key: "warrior",
    name: "Warrior",
    scores: {
      duel: { dano: 78, defesa: 92, utilidade: 60 },
      group: { dano: 72, defesa: 90, utilidade: 74 },
      boss: { dano: 74, defesa: 80, utilidade: 55 },
    },
  },
  {
    key: "sorcerer",
    name: "Sorcerer",
    scores: {
      duel: { dano: 85, defesa: 52, utilidade: 58 },
      group: { dano: 90, defesa: 48, utilidade: 70 },
      boss: { dano: 88, defesa: 45, utilidade: 52 },
    },
  },
  {
    key: "taoist",
    name: "Taoist",
    scores: {
      duel: { dano: 55, defesa: 70, utilidade: 94 },
      group: { dano: 62, defesa: 72, utilidade: 96 },
      boss: { dano: 70, defesa: 68, utilidade: 90 },
    },
  },
  {
    key: "lancer",
    name: "Lancer",
    scores: {
      duel: { dano: 88, defesa: 66, utilidade: 72 },
      group: { dano: 94, defesa: 64, utilidade: 86 },
      boss: { dano: 96, defesa: 60, utilidade: 64 },
    },
  },
  {
    key: "arbalist",
    name: "Arbalist",
    scores: {
      duel: { dano: 80, defesa: 58, utilidade: 66 },
      group: { dano: 84, defesa: 56, utilidade: 80 },
      boss: { dano: 82, defesa: 54, utilidade: 76 },
    },
  },
  {
    key: "darkist",
    name: "Darkist",
    scores: {
      duel: { dano: 86, defesa: 50, utilidade: 64 },
      group: { dano: 88, defesa: 46, utilidade: 72 },
      boss: { dano: 84, defesa: 44, utilidade: 58 },
    },
  },
  {
    key: "lionheart",
    name: "Lionheart",
    scores: {
      duel: { dano: 74, defesa: 70, utilidade: 76 },
      group: { dano: 80, defesa: 72, utilidade: 84 },
      boss: { dano: 78, defesa: 66, utilidade: 70 },
    },
  },
  {
    key: "spiritsummoner",
    name: "Spirit Summoner",
    scores: {
      duel: { dano: 82, defesa: 48, utilidade: 72 },
      group: { dano: 86, defesa: 44, utilidade: 82 },
      boss: { dano: 84, defesa: 42, utilidade: 68 },
    },
  },
];

export const ATTR_LABELS: Record<string, string> = {
  dano: "Dano",
  defesa: "Defesa",
  utilidade: "Utilidade",
};

/** Resultado da comparação de um atributo em um cenário. */
export interface CompareRow {
  scenario: Scenario;
  attribute: keyof ClassScores["scores"][Scenario];
  valueA: number;
  valueB: number;
  delta: number; // a - b
  winner: "a" | "b" | "draw";
}

export interface CompareResult {
  rows: CompareRow[];
  /** Vitórias de A e B por cenário (contagem de atributos). */
  scenarioWins: Record<Scenario, { a: number; b: number; draws: number }>;
  /** Placar agregado: soma dos atributos por classe. */
  totals: { a: number; b: number };
  overallWinner: "a" | "b" | "draw";
}

export const SCENARIOS: Scenario[] = ["duel", "group", "boss"];
export const ATTRIBUTES: (keyof ClassScores["scores"][Scenario])[] = [
  "dano",
  "defesa",
  "utilidade",
];

function pick(key: string): ClassScores | undefined {
  return COMPARE_CLASSES.find(c => c.key === key);
}

/**
 * Compara duas classes lado a lado. Retorna os deltas por atributo/
 * cenário, o placar por cenário e o vencedor geral.
 */
export function compareBuilds(keyA: string, keyB: string): CompareResult | null {
  const a = pick(keyA);
  const b = pick(keyB);
  if (!a || !b || a.key === b.key) return null;

  const rows: CompareRow[] = [];
  const scenarioWins: CompareResult["scenarioWins"] = {
    duel: { a: 0, b: 0, draws: 0 },
    group: { a: 0, b: 0, draws: 0 },
    boss: { a: 0, b: 0, draws: 0 },
  };
  let totalA = 0;
  let totalB = 0;

  for (const scenario of SCENARIOS) {
    for (const attr of ATTRIBUTES) {
      const valueA = a.scores[scenario][attr];
      const valueB = b.scores[scenario][attr];
      const delta = valueA - valueB;
      const winner: CompareRow["winner"] =
        delta > 0 ? "a" : delta < 0 ? "b" : "draw";
      rows.push({ scenario, attribute: attr, valueA, valueB, delta, winner });
      totalA += valueA;
      totalB += valueB;
      if (winner === "a") scenarioWins[scenario].a += 1;
      else if (winner === "b") scenarioWins[scenario].b += 1;
      else scenarioWins[scenario].draws += 1;
    }
  }

  const overallWinner: CompareResult["overallWinner"] =
    totalA > totalB ? "a" : totalB > totalA ? "b" : "draw";

  return { rows, scenarioWins, totals: { a: totalA, b: totalB }, overallWinner };
}
