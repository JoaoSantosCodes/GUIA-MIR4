/**
 * Conquistas da Linha do Tempo de Capítulos: medalha de veterano concedida
 * ao marcar todos os 21 capítulos como vivenciados.
 * Lógica pura (client-side, determinística) para facilitar testes.
 */

export const TOTAL_CHAPTERS = 21;

export interface ChapterAchievement {
  key: string;
  title: string;
  description: string;
  /** Ícone lucide */
  icon: "Scroll" | "Crown" | "Clock";
  iconKey: "scroll" | "crown" | "clock";
}

export const CHAPTER_ACHIEVEMENTS: ChapterAchievement[] = [
  {
    key: "capitulos-10",
    title: "Viajante do Tempo",
    description: "Marque 10 capítulos como vivenciados na linha do tempo",
    icon: "Scroll",
    iconKey: "scroll",
  },
  {
    key: "capitulos-veterano",
    title: "Veterano de Sabuk",
    description: "Marque todos os 21 capítulos da história do MIR4 como vivenciados",
    icon: "Crown",
    iconKey: "crown",
  },
];

export interface ChapterAchievementStatus extends ChapterAchievement {
  earned: boolean;
  progress: number;
  goal: number;
}

/**
 * Avalia as conquistas de capítulos a partir dos números de capítulos marcados.
 * A chave de persistência é "mir4-chapters-played" (usada pela página Notícias).
 */
export function evaluateChapterAchievements(played: number[]): ChapterAchievementStatus[] {
  const unique = new Set(played.filter(n => Number.isInteger(n) && n >= 1 && n <= TOTAL_CHAPTERS));
  const count = unique.size;
  return CHAPTER_ACHIEVEMENTS.map(a => {
    const goal = a.key === "capitulos-10" ? 10 : TOTAL_CHAPTERS;
    return {
      ...a,
      earned: a.key === "capitulos-10" ? count >= 10 : count >= TOTAL_CHAPTERS,
      progress: Math.min(count, goal),
      goal,
    };
  });
}
