/** Página de um comentário: caminho público para deep-link (com item anchor quando farmKey != 'geral'). */
export function commentPagePath(pageKey: string, farmKey: string): string {
  switch (pageKey) {
    case "farm": return farmKey === "geral" ? "/farm" : `/farm#${farmKey}`;
    case "sabuk": return "/sabuk";
    case "mystery": return farmKey === "torre-conquista" ? "/misterios#torre-conquista" : "/misterios";
    case "seal": return "/selos";
    case "skills": return `/subclasses${farmKey === "geral" ? "" : `#${farmKey}`}`;
    case "gear": return "/equipamentos";
    case "materials": return "/materiais";
    case "classes": return "/classes";
    case "economy": return "/economia";
    case "raids": return "/raids";
    default: return "/faq";
  }
}
