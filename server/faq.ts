import { fetchTopTips } from "./db";
import { commentPagePath } from "../shared/faqPaths";

export interface TopTip {
  id: number;
  pageKey: string;
  farmKey: string;
  content: string;
  upvotes: number;
  downvotes: number;
  score: number;
  userName: string | null;
  createdAt: Date;
}

export interface PageTopTips {
  pageKey: string;
  sectionLabel: string;
  tips: TopTip[];
}

export interface RawTopTipRow {
  id: number;
  pageKey: string | null;
  farmKey: string | null;
  content: string | null;
  upvotes: number | null;
  downvotes: number | null;
  createdAt: Date | null;
  userName: string | null;
}

const SECTION_LABELS: Record<string, string> = {
  farm: "Locais de Farm",
  sabuk: "Sabuk & Guildas",
  mystery: "Mistérios",
  seal: "Selos & Geminação",
  skills: "Subclasses & Skills",
  gear: "Equipamentos & Geminação",
  materials: "Materiais & Crafting",
  classes: "Classes",
  economy: "Economia",
  raids: "Raids & Bosses",
};

/** Agrupa as dicas por página, calcula o score e aplica limite/filtro. */
export function mapTopTips(rows: RawTopTipRow[], minUpvotes: number = 0, limitPerPage: number = 5): PageTopTips[] {
  const perPage = new Map<string, TopTip[]>();
  for (const r of rows) {
    if (!r.pageKey) continue;
    const score = (r.upvotes ?? 0) - (r.downvotes ?? 0);
    const list = perPage.get(r.pageKey) ?? [];
    if (list.length >= limitPerPage) continue;
    if ((r.upvotes ?? 0) < minUpvotes) continue;
    list.push({
      id: r.id,
      pageKey: r.pageKey,
      farmKey: r.farmKey ?? "",
      content: r.content ?? "",
      upvotes: r.upvotes ?? 0,
      downvotes: r.downvotes ?? 0,
      score,
      userName: r.userName ?? null,
      createdAt: r.createdAt ?? new Date(),
    });
    perPage.set(r.pageKey, list);
  }
  // Ordena as dicas dentro de cada página por score (upvotes - downvotes)
  Array.from(perPage.values()).forEach(tips => {
    tips.sort((a: TopTip, b: TopTip) => b.score - a.score);
  });
  return Array.from(perPage.entries())
    .map(([pageKey, tips]) => ({ pageKey, sectionLabel: SECTION_LABELS[pageKey] ?? pageKey, tips }))
    .sort((a, b) => Math.max(...b.tips.map(t => t.score)) - Math.max(...a.tips.map(t => t.score)));
}

/** Retorna as dicas mais votadas por página (score = upvotes - downvotes). */
export async function topTipsByPage(minUpvotes: number = 0, limitPerPage: number = 5): Promise<PageTopTips[]> {
  const rows = await fetchTopTips();
  return mapTopTips(rows, minUpvotes, limitPerPage);
}

export { commentPagePath };
