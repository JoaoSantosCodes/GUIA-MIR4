/**
 * Estado persistente das celebrações de conquistas do Codex.
 *
 * Usa localStorage (mesmo padrão de "mir4-codex-filters"):
 * - "mir4-last-achievement": última conquista desbloqueada (exibida no painel permanente do perfil)
 * - "mir4-achievement-celebration": true = som + confete ativos (padrão true)
 *
 * A lógica de UI (efeitos, som) vive no Profile.tsx; este módulo é puro e testável.
 */

export interface LastAchievement {
  title: string;
  description: string;
  iconKey: string;
  unlockedAt: number;
}

const LAST_KEY = "mir4-last-achievement";
const CELEB_KEY = "mir4-achievement-celebration";

export function readLastAchievement(): LastAchievement | null {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastAchievement;
    if (!parsed || typeof parsed.title !== "string" || typeof parsed.unlockedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeLastAchievement(ach: LastAchievement): void {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(ach));
  } catch {
    // storage indisponível — ignora silenciosamente
  }
}

export function readCelebrationEnabled(): boolean {
  try {
    const raw = localStorage.getItem(CELEB_KEY);
    if (raw === null) return true; // padrão: celebração ativa
    return raw !== "false";
  } catch {
    return true;
  }
}

export function writeCelebrationEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(CELEB_KEY, enabled ? "true" : "false");
  } catch {
    // ignora silenciosamente
  }
}

/**
 * Histórico de conquistas desbloqueadas pelo usuário (com datas).
 *
 * Armazena em "mir4-achievement-history" (limite de 100 entradas, FIFO).
 * Registros vêm de duas fontes, mescladas na leitura:
 * 1. registros explícitos gravados pelo Profile quando uma conquista é desbloqueada em sessão;
 * 2. a data de coleta de itens do Codex (collectedAt) usada para reconstruir retrospectivamente
 *    conquistas derivadas de faixas/totais — a data de desbloqueio é a data em que o marco
 *    foi atingido (última coleta necessária para completar a condição).
 */

export interface AchievementHistoryEntry {
  /** Chave da conquista (ex.: "codex-10", "faixa-t2") */
  key: string;
  title: string;
  description: string;
  iconKey: string;
  /** Data de desbloqueio em ms (UTC). */
  unlockedAt: number;
  /** "session" = desbloqueada em sessão (registrada na hora); "retro" = reconstruída a partir do progresso. */
  source: "session" | "retro";
}

const HISTORY_KEY = "mir4-achievement-history";
const HISTORY_MAX = 100;

export function readAchievementHistory(): AchievementHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AchievementHistoryEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      e => e && typeof e.key === "string" && typeof e.unlockedAt === "number" && typeof e.title === "string",
    );
  } catch {
    return [];
  }
}

export function writeAchievementHistory(entries: AchievementHistoryEntry[]): void {
  try {
    // ordena mais recente primeiro e limita
    const sorted = entries.slice().sort((a, b) => b.unlockedAt - a.unlockedAt).slice(0, HISTORY_MAX);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sorted));
  } catch {
    // ignora silenciosamente
  }
}

/** Registra uma conquista desbloqueada em sessão (com a data exata). */
export function appendAchievementHistory(entry: AchievementHistoryEntry): AchievementHistoryEntry[] {
  const all = readAchievementHistory();
  // evita duplicidade da mesma conquista
  if (all.some(e => e.key === entry.key && Math.abs(e.unlockedAt - entry.unlockedAt) < 60_000)) return all;
  const next = [...all, entry];
  writeAchievementHistory(next);
  return next;
}
