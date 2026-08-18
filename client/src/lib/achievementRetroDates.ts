/**
 * Reconstrói retrospectivamente as datas de desbloqueio das conquistas do Codex.
 *
 * Base: lista de itens coletados COM timestamps (progresso do Codex).
 * Para cada conquista já ganha, estima a data em que o marco foi atingido:
 * - Conquistas de contagem simples (codex-10/25/50/100, raro-5, lendario-1):
 *   data da N-ésima coleta relevante, em ordem cronológica.
 * - Conquistas de categoria completa (equipamentos-5, materiais-10, consumiveis-6,
 *   colecionaveis-6, rep-6): data da última coleta da categoria.
 * - Conquistas de raridade completa (faixa-t1..t5): data da última coleta daquela raridade.
 * - Conquistas de todas as categorias (cat-equipamentos): data da última coleta global.
 *
 * A função é pura e determinística — usada tanto para preencher o histórico quanto
 * para exibir datas das conquistas já ganhas na primeira visita.
 */
import { CODEX_ITEMS } from "@shared/guideData";
import { CODEX_ACHIEVEMENTS } from "./codexAchievements";

export interface ProgressWithDate {
  itemId: string;
  collectedAt: number;
}

export interface RetroUnlocked {
  key: string;
  title: string;
  description: string;
  iconKey: string;
  unlockedAt: number;
}

const RARE_OR_BETTER = new Set(["Raro", "Épico", "Lendário", "Mítico"]);
const LEGENDARY_OR_BETTER = new Set(["Lendário", "Mítico"]);

function isCategoryComplete(
  category: string,
  collectedIds: Set<string>,
): boolean {
  const all = CODEX_ITEMS.filter(c => c.category === category);
  if (all.length === 0) return false;
  return all.every(c => collectedIds.has(c.key));
}

/**
 * Reconstrói as datas de desbloqueio das conquistas atualmente ganhas.
 * @param progress itens coletados com data de coleta
 */
export function reconstructRetroAchievements(progress: ProgressWithDate[]): RetroUnlocked[] {
  const byDate = progress.slice().sort((a, b) => a.collectedAt - b.collectedAt);
  const collectedIds = new Set(progress.map(p => p.itemId));
  const itemsById = new Map(CODEX_ITEMS.map(c => [c.key, c]));

  function nthRelevantDate(predicate: (itemKey: string) => boolean, n: number): number | null {
    let count = 0;
    for (const p of byDate) {
      if (predicate(p.itemId)) {
        count += 1;
        if (count >= n) return p.collectedAt;
      }
    }
    return null;
  }

  const lastCategoryDate = (category: string): number | null => {
    const relevant = byDate.filter(p => itemsById.get(p.itemId)?.category === category);
    return relevant.length === 0 ? null : relevant[relevant.length - 1].collectedAt;
  };

  const lastRarityDate = (rarity: string): number | null => {
    const relevant = byDate.filter(p => itemsById.get(p.itemId)?.rarity === rarity);
    return relevant.length === 0 ? null : relevant[relevant.length - 1].collectedAt;
  };

  const rarityByTier = (tier: string): string | null => {
    const item = CODEX_ITEMS.find(c => String(c.tier) === tier);
    return item?.rarity ?? null;
  };

  const out: RetroUnlocked[] = [];
  for (const ach of CODEX_ACHIEVEMENTS) {
    let unlockedAt: number | null = null;
    switch (ach.key) {
      case "codex-10": unlockedAt = nthRelevantDate(() => true, 10); break;
      case "codex-25": unlockedAt = nthRelevantDate(() => true, 25); break;
      case "codex-50": unlockedAt = nthRelevantDate(() => true, 50); break;
      case "codex-100": unlockedAt = nthRelevantDate(() => true, 100); break;
      case "raro-5": unlockedAt = nthRelevantDate(k => RARE_OR_BETTER.has(itemsById.get(k)?.rarity ?? ""), 5); break;
      case "lendario-1": unlockedAt = nthRelevantDate(k => LEGENDARY_OR_BETTER.has(itemsById.get(k)?.rarity ?? ""), 1); break;
      case "equipamentos-5": if (isCategoryComplete("Equipamentos", collectedIds)) unlockedAt = lastCategoryDate("Equipamentos"); break;
      case "materiais-10": if (isCategoryComplete("Materiais", collectedIds)) unlockedAt = lastCategoryDate("Materiais"); break;
      case "consumiveis-6": if (isCategoryComplete("Consumíveis", collectedIds)) unlockedAt = lastCategoryDate("Consumíveis"); break;
      case "colecionaveis-6": if (isCategoryComplete("Colecionáveis", collectedIds)) unlockedAt = lastCategoryDate("Colecionáveis"); break;
      case "rep-6": if (isCategoryComplete("Badges de Reputação", collectedIds)) unlockedAt = lastCategoryDate("Badges de Reputação"); break;
      case "faixa-t1": { const r = rarityByTier("1"); if (r) { const all = CODEX_ITEMS.filter(c => c.rarity === r); if (all.every(c => collectedIds.has(c.key))) { const t = byDate.filter(p => itemsById.get(p.itemId)?.rarity === r); unlockedAt = t.length > 0 ? t[t.length - 1].collectedAt : null; } } break; }
      case "faixa-t2": { const r = rarityByTier("2"); if (r) { const all = CODEX_ITEMS.filter(c => c.rarity === r); if (all.every(c => collectedIds.has(c.key))) { const t = byDate.filter(p => itemsById.get(p.itemId)?.rarity === r); unlockedAt = t.length > 0 ? t[t.length - 1].collectedAt : null; } } break; }
      case "faixa-t3": { const r = rarityByTier("3"); if (r) { const all = CODEX_ITEMS.filter(c => c.rarity === r); if (all.every(c => collectedIds.has(c.key))) { const t = byDate.filter(p => itemsById.get(p.itemId)?.rarity === r); unlockedAt = t.length > 0 ? t[t.length - 1].collectedAt : null; } } break; }
      case "faixa-t4": { const r = rarityByTier("4"); if (r) { const all = CODEX_ITEMS.filter(c => c.rarity === r); if (all.every(c => collectedIds.has(c.key))) { const t = byDate.filter(p => itemsById.get(p.itemId)?.rarity === r); unlockedAt = t.length > 0 ? t[t.length - 1].collectedAt : null; } } break; }
      case "faixa-t5": { const r = rarityByTier("5"); if (r) { const all = CODEX_ITEMS.filter(c => c.rarity === r); if (all.every(c => collectedIds.has(c.key))) { const t = byDate.filter(p => itemsById.get(p.itemId)?.rarity === r); unlockedAt = t.length > 0 ? t[t.length - 1].collectedAt : null; } } break; }
      case "cat-equipamentos": if (byDate.length > 0) unlockedAt = byDate[byDate.length - 1].collectedAt; break;
      default: break;
    }
    if (unlockedAt !== null) {
      out.push({
        key: ach.key,
        title: ach.title,
        description: ach.description,
        iconKey: ach.iconKey,
        unlockedAt,
      });
    }
  }
  return out.sort((a, b) => b.unlockedAt - a.unlockedAt);
}

/**
 * Sincroniza o histórico local com o progresso atual do Codex:
 * 1. Adiciona registros "retro" para conquistas ganhas sem registro (reconstruídas);
 * 2. Marca como removidas do retorno da função as conquistas ainda ganhas mas sem registro retro possível (não deve acontecer normalmente).
 * @returns registros retro adicionados nesta chamada
 */
export function backfillRetroHistory(
  progress: ProgressWithDate[],
  registry: { read: () => { key: string; unlockedAt: number; source?: "session" | "retro" }[]; append: (e: { key: string; title: string; description: string; iconKey: string; unlockedAt: number; source: "session" | "retro" }) => void },
): number {
  const existing = registry.read();
  const retro = reconstructRetroAchievements(progress);
  const retroKeys = new Set(existing.filter(e => e.source === "retro").map(e => e.key));
  let added = 0;
  for (const r of retro) {
    if (retroKeys.has(r.key)) continue;
    const fromCode = CODEX_ACHIEVEMENTS.find(a => a.key === r.key);
    registry.append({
      key: r.key,
      title: fromCode?.title ?? r.title,
      description: fromCode?.description ?? r.description,
      iconKey: fromCode?.iconKey ?? r.iconKey,
      unlockedAt: r.unlockedAt,
      source: "retro",
    });
    added += 1;
  }
  return added;
}
