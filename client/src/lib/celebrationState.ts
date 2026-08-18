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
