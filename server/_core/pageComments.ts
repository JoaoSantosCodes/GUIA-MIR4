/**
 * Páginas que aceitam comentários comunitários.
 * Chaves devem bater com os `pageKey` usados no frontend ao chamar comments.list/add.
 */
export const PAGE_COMMENT_KEYS = ["farm", "sabuk", "mystery", "seal", "skills", "gear", "materials", "classes", "economy", "raids"] as const;
export type PageCommentKey = (typeof PAGE_COMMENT_KEYS)[number];

export const PAGE_COMMENT_VALID_KEYS: Record<PageCommentKey, (key: string) => boolean> = {
  farm: key => key === "" || true, // farm comments usam farmKey (qualquer chave de farm) — validado separadamente
  sabuk: key => key === "" || key === "geral",
  mystery: key => key === "" || key === "geral",
  seal: key => key === "" || key === "geral",
  skills: key =>
    key === "" || ["warrior", "sorcerer", "taoist", "lancer", "arbalist"].includes(key),
  gear: key => key === "" || key === "geral",
  classes: key => key === "" || key === "geral",
  economy: key => key === "" || key === "geral",
  raids: key => key === "" || key === "geral",
  materials: key => key === "" || key === "geral",
};

/** Chaves válidas de páginas de comentário (usado na validação do input). */
export const VALID_PAGE_KEYS = PAGE_COMMENT_KEYS;
