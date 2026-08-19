import { commentPagePath } from "@shared/faqPaths";

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
  path: string;
}

/** Anexa o caminho público da página original a cada dica retornada por faq.topTips. */
export function enrichTipPaths(
  tips: { id: number; pageKey: string; farmKey: string; content: string; upvotes: number; downvotes: number; score: number; userName: string | null; createdAt: Date }[],
): TopTip[] {
  return tips.map(t => ({ ...t, path: commentPagePath(t.pageKey, t.farmKey) }));
}
