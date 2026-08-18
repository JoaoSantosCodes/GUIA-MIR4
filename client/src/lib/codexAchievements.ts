/**
 * Conquistas do Codex: medalhas visuais concedidas ao completar marcos.
 * Lógica pura (client-side, determinística) para facilitar testes.
 */
import { CODEX_ITEMS } from "@shared/guideData";

export interface CodexAchievement {
  key: string;
  title: string;
  description: string;
  /** Ícone (nome de ícone lucide) */
  icon: "BookOpen" | "Gem" | "Crown" | "Sparkles" | "Swords" | "Star";
  /** Medalha concedida quando a condição é atendida */
  iconKey: "book" | "gem" | "crown" | "sparkle" | "sword" | "star";
}

export const CODEX_ACHIEVEMENTS: CodexAchievement[] = [
  { key: "codex-10", title: "Colecionador Iniciante", description: "Marque 10 itens do Codex", icon: "BookOpen", iconKey: "book" },
  { key: "codex-25", title: "Explorador Dedicado", description: "Marque 25 itens do Codex", icon: "BookOpen", iconKey: "book" },
  { key: "equipamentos-5", title: "Ferreiro Aprendiz", description: "Complete todos os 5 itens de Equipamentos", icon: "Swords", iconKey: "sword" },
  { key: "materiais-10", title: "Alquimista Novato", description: "Complete todos os 10 itens de Materiais", icon: "Sparkles", iconKey: "sparkle" },
  { key: "consumiveis-6", title: "Boticário da Trilha", description: "Colete 6 itens de Consumíveis", icon: "Sparkles", iconKey: "sparkle" },
  { key: "colecionaveis-6", title: "Curador de Relíquias", description: "Colete 6 itens de Colecionáveis", icon: "Gem", iconKey: "gem" },
  { key: "rep-6", title: "Herói Reconhecido", description: "Colete 6 Badges de Reputação", icon: "Star", iconKey: "star" },
  { key: "faixa-t1", title: "Forja Completa UC", description: "Registre todos os itens UC do Codex", icon: "Swords", iconKey: "sword" },
  { key: "raro-5", title: "Caçador de Raros", description: "Colete 5 itens de raridade Raro ou superior", icon: "Gem", iconKey: "gem" },
  { key: "lendario-1", title: "Glória Lendária", description: "Colete 1 item Lendário ou Mítico", icon: "Crown", iconKey: "crown" },
  { key: "codex-50", title: "Mestre do Codex", description: "Marque 50 itens do Codex (meta aspiracional)", icon: "Star", iconKey: "star" },
  { key: "codex-100", title: "Coleção Eterna", description: "Marque 100 itens do Codex (meta aspiracional)", icon: "Crown", iconKey: "crown" },
  { key: "cat-equipamentos", title: "Arsenal Completo", description: "Complete todas as categorias do Codex", icon: "Swords", iconKey: "sword" },
];

/** Raridades consideradas "Raro ou superior" (ordem crescente). */
const RARE_OR_BETTER = new Set(["Raro", "Épico", "Lendário", "Mítico"]);
const LEGENDARY_OR_BETTER = new Set(["Lendário", "Mítico"]);

const ACH_BY_KEY = new Map(CODEX_ACHIEVEMENTS.map(a => [a.key, a]));

export interface AchievementStatus extends CodexAchievement {
  earned: boolean;
  progress: number;
  goal: number;
}

/**
 * Avalia as conquistas do Codex a partir dos IDs coletados.
 * - codex-10 / 25 / 50: total coletado
 * - equipamentos-10: itens da categoria Equipamentos
 * - materiais-10: itens da categoria Materiais
 * - raro-5: itens Raro+
 * - lendario-1: itens Lendário+
 */
export function evaluateCodexAchievements(collectedIds: string[]): AchievementStatus[] {
  const collected = new Set(collectedIds);
  const itemsById = new Map(CODEX_ITEMS.map(c => [c.key, c]));
  const total = collected.size;
  const equipCount = CODEX_ITEMS.filter(c => c.category === "Equipamentos" && collected.has(c.key)).length;
  const matCount = CODEX_ITEMS.filter(c => c.category === "Materiais" && collected.has(c.key)).length;
  const consCount = CODEX_ITEMS.filter(c => c.category === "Consumíveis" && collected.has(c.key)).length;
  const collCount = CODEX_ITEMS.filter(c => c.category === "Colecionáveis" && collected.has(c.key)).length;
  const repCount = CODEX_ITEMS.filter(c => c.category === "Badges de Reputação" && collected.has(c.key)).length;
  const ucCount = CODEX_ITEMS.filter(c => c.rarity === "UC" && collected.has(c.key)).length;
  const ucTotal = CODEX_ITEMS.filter(c => c.rarity === "UC").length;
  const rareCount = CODEX_ITEMS.filter(c => RARE_OR_BETTER.has(c.rarity) && collected.has(c.key)).length;
  const legendCount = CODEX_ITEMS.filter(c => LEGENDARY_OR_BETTER.has(c.rarity) && collected.has(c.key)).length;

  // Progresso por categoria para conquistas de categoria completa
  const catProgress = new Map<string, { done: number; all: number }>();
  for (const c of CODEX_ITEMS) {
    let entry = catProgress.get(c.category);
    if (!entry) {
      entry = { done: 0, all: 0 };
      catProgress.set(c.category, entry);
    }
    entry.all += 1;
    if (collected.has(c.key)) entry.done += 1;
  }
  const catCompletionRatio = catProgress.size === 0 ? 0 : Math.min(...Array.from(catProgress.values()).map(e => e.done / Math.max(e.all, 1)));

  const goals: Record<string, number> = {
    "codex-10": Math.min(total, 10),
    "codex-25": Math.min(total, 25),
    "equipamentos-5": Math.min(equipCount, 5),
    "materiais-10": Math.min(matCount, 10),
    "consumiveis-6": Math.min(consCount, 6),
    "colecionaveis-6": Math.min(collCount, 6),
    "rep-6": Math.min(repCount, 6),
    "faixa-t1": Math.min(ucCount, ucTotal),
    "raro-5": Math.min(rareCount, 5),
    "lendario-1": Math.min(legendCount, 1),
    "codex-50": Math.min(total, 50),
    "codex-100": Math.min(total, 100),
    "cat-equipamentos": Math.round(catCompletionRatio * 100),
  };

  return CODEX_ACHIEVEMENTS.map(a => {
    const g = goals[a.key] ?? 0;
    return {
      ...a,
      earned: a.key === "codex-10" ? total >= 10
        : a.key === "codex-25" ? total >= 25
          : a.key === "equipamentos-5" ? equipCount >= 5
            : a.key === "materiais-10" ? matCount >= 10
              : a.key === "consumiveis-6" ? consCount >= 6
                : a.key === "colecionaveis-6" ? collCount >= 6
                  : a.key === "rep-6" ? repCount >= 6
                    : a.key === "faixa-t1" ? ucCount >= ucTotal
                      : a.key === "raro-5" ? rareCount >= 5
                        : a.key === "lendario-1" ? legendCount >= 1
                          : a.key === "codex-50" ? total >= 50
                            : a.key === "codex-100" ? total >= 100
                              : a.key === "cat-equipamentos" ? catCompletionRatio >= 1
                                : false,
      progress: g,
      goal: a.key === "codex-10" ? 10
        : a.key === "codex-25" ? 25
          : a.key === "equipamentos-5" ? 5
            : a.key === "materiais-10" ? 10
              : a.key === "consumiveis-6" ? 6
                : a.key === "colecionaveis-6" ? 6
                  : a.key === "rep-6" ? 6
                    : a.key === "faixa-t1" ? ucTotal
                      : a.key === "raro-5" ? 5
                        : a.key === "lendario-1" ? 1
                          : a.key === "codex-50" ? 50
                            : a.key === "codex-100" ? 100
                              : a.key === "cat-equipamentos" ? 100
                                : 0,
    };
  });
}

export function getAchievement(key: string): CodexAchievement | undefined {
  return ACH_BY_KEY.get(key);
}
