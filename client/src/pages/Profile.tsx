import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CODEX_ITEMS, CLASSES, FARM_SPOTS, RAIDS, SPIRITS, SABUK_CONTENT, MYSTERIES, EQUIPMENT_TYPES, MATERIALS } from "@shared/guideData";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Star, BookOpen, Pickaxe, Swords, Coins, LogIn, Loader2, Skull, Castle, Sparkles, Gem, Shield, Package, ThumbsUp, ThumbsDown, RotateCcw, ArrowUpDown, Medal, Heart, StarOff, History, BookmarkPlus } from "lucide-react";
import { GOLD_TIP_UPVOTES } from "@/components/guide/CommentsSection";

const SECTION_META: Record<string, { label: string; path: string; Icon: typeof Star }> = {
  spirit: { label: "Espíritos", path: "/espiritos", Icon: Star },
  codex: { label: "Codex", path: "/codex", Icon: BookOpen },
  farm: { label: "Locais de Farm", path: "/farm", Icon: Pickaxe },
  class: { label: "Classes", path: "/classes", Icon: Swords },
  economy: { label: "Economia", path: "/economia", Icon: Coins },
  raid: { label: "Raids e Bosses", path: "/raids", Icon: Skull },
  boss: { label: "Raids e Bosses", path: "/raids", Icon: Skull },
  sabuk: { label: "Sabuk & Guildas", path: "/sabuk", Icon: Castle },
  mystery: { label: "Mistérios", path: "/misterios", Icon: Sparkles },
  seal: { label: "Selos", path: "/selos", Icon: Gem },
  gear: { label: "Equipamentos", path: "/equipamentos", Icon: Shield },
  materials: { label: "Materiais", path: "/materiais", Icon: Package },
};

const PAGE_KEY_LABEL: Record<string, string> = {
  farm: "Locais de Farm",
  sabuk: "Sabuk & Guildas",
  mystery: "Mistérios",
  seal: "Selos",
  skills: "Subclasses & Skills",
  gear: "Equipamentos",
  materials: "Materiais",
  classes: "Classes",
  economy: "Economia",
  raids: "Raids e Bosses",
};

const SECTION_PATH: Record<string, string> = {
  farm: "/farm",
  sabuk: "/sabuk",
  mystery: "/misterios",
  seal: "/selos",
  skills: "/subclasses",
  gear: "/equipamentos",
  materials: "/materiais",
  classes: "/classes",
  economy: "/economia",
  raids: "/raids",
};

type VoteSort = "recent" | "oldest";

export default function Profile() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const utils = trpc.useUtils();
  const [voteFilter, setVoteFilter] = useState<string>("all");
  const [voteSort, setVoteSort] = useState<VoteSort>("recent");

  const { data: favorites, isLoading: favLoading } = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: progress, isLoading: progLoading } = trpc.codexProgress.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: voteHistory, isLoading: voteLoading } = trpc.user.voteHistory.useQuery(undefined, { enabled: isAuthenticated, refetchInterval: 30_000 });

  const voteCategories = useMemo(
    () => Array.from(new Set((voteHistory ?? []).map(v => v.pageKey ?? ""))).filter(Boolean),
    [voteHistory],
  );

  const filteredVotes = useMemo(() => {
    let list = (voteHistory ?? []).slice();
    if (voteFilter !== "all") list = list.filter(v => v.pageKey === voteFilter);
    list.sort((a, b) => {
      const ta = new Date(a.votedAt).getTime();
      const tb = new Date(b.votedAt).getTime();
      return voteSort === "recent" ? tb - ta : ta - tb;
    });
    return list;
  }, [voteHistory, voteFilter, voteSort]);

  /** Contagem de Dicas de Ouro: votos a favor em dicas que já têm 10+ upvotes. */
  const goldBadges = useMemo(
    () => (voteHistory ?? []).filter(v => v.vote === 1 && (v.upvotes ?? 0) >= GOLD_TIP_UPVOTES).length,
    [voteHistory],
  );

  /** Timeline interativa consolidando favoritos, votos e progresso do Codex. */
  type TimelineKind = "fav" | "vote" | "codex";
  interface TimelineItem { ts: number; kind: TimelineKind; commentId?: number }
  const [timelineFilter, setTimelineFilter] = useState<TimelineKind | "all">("all");
  const timeline = useMemo(() => {
    const items: { ts: number; kind: TimelineKind; itemId: string; title: string; section: string; path: string; commentId?: number; vote?: number }[] = [];
    (favorites ?? []).forEach(f => {
      const [type, key] = f.itemId.split(":");
      const meta = SECTION_META[type] ?? SECTION_META.spirit;
      items.push({ ts: new Date(f.createdAt).getTime(), kind: "fav", itemId: f.itemId, title: resolveTitle(f), section: meta.label, path: meta.path });
    });
    (voteHistory ?? []).forEach(v => {
      const page = SECTION_PATH[v.pageKey ?? ""];
      items.push({ ts: new Date(v.votedAt).getTime(), kind: "vote", itemId: `comment:${v.commentId}`, title: v.content, section: PAGE_KEY_LABEL[v.pageKey ?? ""] ?? v.pageKey ?? "", path: page ?? "/faq", commentId: v.commentId, vote: v.vote });
    });
    (progress ?? []).forEach(p => {
      const item = CODEX_ITEMS.find(c => c.key === p.itemId);
      items.push({ ts: new Date(p.collectedAt).getTime(), kind: "codex", itemId: p.itemId, title: item?.name ?? p.itemId, section: "Codex", path: "/codex" });
    });
    items.sort((a, b) => b.ts - a.ts);
    return items;
  }, [favorites, voteHistory, progress]);
  const visibleTimeline = useMemo(
    () => timelineFilter === "all" ? timeline : timeline.filter(t => t.kind === timelineFilter),
    [timeline, timelineFilter],
  );

  const toggleFav = trpc.favorites.toggle.useMutation({
    onSuccess: () => utils.favorites.list.invalidate(),
  });

  const changeVote = trpc.comments.setUserVote.useMutation({
    onSuccess: () => utils.user.voteHistory.invalidate(),
  });
  const toggleCodex = trpc.codexProgress.toggle.useMutation({
    onSuccess: () => utils.codexProgress.list.invalidate(),
  });

  const collectedIds = new Set(progress?.map(p => p.itemId) ?? []);
  const codexTotal = CODEX_ITEMS.length;
  const codexDone = progress?.length ?? 0;

  const resolveTitle = (fav: { itemId: string; itemType: string }) => {
    const [type, key] = fav.itemId.split(":");
    switch (fav.itemType) {
      case "spirit": return SPIRITS.find(s => s.key === key)?.name ?? key;
      case "codex": return CODEX_ITEMS.find(c => c.key === key)?.name ?? key;
      case "farm": return FARM_SPOTS.find(f => f.key === key)?.name ?? key;
      case "class": return CLASSES.find(c => c.key === key)?.name ?? key;
      case "sabuk":
        if (key === "torre-conquista") return "Torre da Conquista";
        return SABUK_CONTENT.find(s => s.key === key)?.title ?? key;
      case "mystery": return MYSTERIES.find(m => m.key === key)?.name ?? key;
      case "seal": {
        const sealMap: Record<string, string> = { "darksteel-seal": "Darksteel Seal", "jade-seal": "Jade Seal", "dragon-seal": "Dragon Seal" };
        return sealMap[key] ?? key;
      }
      case "raid":
      case "boss": return RAIDS.find(r => r.key === key)?.name ?? key;
      case "gear": {
        const equip = EQUIPMENT_TYPES.find(e => e.key === key);
        if (equip) return `Equipamento: ${equip.slot} (${equip.examples.join(", ")})`;
        return key ?? type;
      }
      case "materials": {
        const mat = MATERIALS.find(m => m.key === key);
        if (mat) return `Material: ${mat.name}`;
        return key ?? type;
      }
      default: return key ?? type;
    }
  };

  if (!loading && !isAuthenticated) {
    return (
      <div className="container py-20">
        <div className="mx-auto max-w-md rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-8 text-center">
          <LogIn className="mx-auto h-10 w-10 text-amber-500" />
          <h1 className="gold-text mt-4 text-2xl font-bold">Área do Jogador</h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Entre com sua conta para salvar favoritos, marcar itens do Codex como coletados e acompanhar seu
            progresso.
          </p>
          <Button onClick={() => startLogin()} className="mt-6 w-full bg-red-800 hover:bg-red-700 text-amber-100 border border-amber-700/50">
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="container flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="gold-text text-3xl font-bold">Meu Perfil</h1>
          <p className="mt-1 text-sm text-slate-400">
            Olá, <strong className="text-amber-200">{user.name ?? "aventureiro"}</strong> — organize seus favoritos e seu
            progresso no Codex.
          </p>
          {goldBadges > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-950/60 to-amber-900/40 px-3 py-1.5 shadow-sm shadow-amber-500/20">
              <Medal className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wide text-amber-200">{goldBadges} Dica{goldBadges !== 1 ? "s" : ""} de Ouro</span>
              <span className="text-[10px] text-slate-500">— votos a favor em dicas premiadas</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const url = `${window.location.origin}/share/${user.id}`;
              navigator.clipboard
                .writeText(url)
                .then(() => toast.success("Link copiado! Envie para seus amigos: " + url))
                .catch(() => toast.error("Não foi possível copiar o link"));
            }}
            className="border-amber-700/50 text-amber-200 hover:bg-amber-900/30"
          >
            Compartilhar perfil
          </Button>
          <Button variant="outline" onClick={() => logout()} className="border-amber-700/50 text-amber-200 hover:bg-amber-900/30">
            Sair
          </Button>
        </div>
      </div>

      {/* Progresso codex */}
      <section className="mt-8 rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
        <h2 className="font-bold text-amber-300">Progresso no Codex</h2>
        {progLoading ? (
          <Loader2 className="mt-3 h-5 w-5 animate-spin text-amber-500" />
        ) : (
          <>
            <p className="mt-2 text-sm text-slate-300">
              {codexDone} de {codexTotal} itens marcados como coletados ({Math.round((codexDone / codexTotal) * 100)}%).
            </p>
            {progress && progress.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {progress.map(p => {
                  const item = CODEX_ITEMS.find(c => c.key === p.itemId);
                  if (!item) return null;
                  return (
                    <button
                      key={p.itemId}
                      onClick={() => toggleCodex.mutate({ itemId: p.itemId, collected: false })}
                      className="rounded border border-emerald-700/50 bg-emerald-950/40 px-2 py-1 text-xs text-emerald-300 hover:bg-red-950/40 hover:text-red-300 hover:border-red-700/50 transition-colors"
                      title="Desmarcar item coletado"
                    >
                      {item.name} ✕
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* Histórico de votos */}
      <section className="mt-8 rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
        <h2 className="font-bold text-amber-300">Histórico de votos nas dicas</h2>
        {voteLoading ? (
          <Loader2 className="mt-3 h-5 w-5 animate-spin text-amber-500" />
        ) : voteHistory && voteHistory.length > 0 ? (
          <>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setVoteFilter("all")}
                  className={voteFilter === "all" ? "rounded-full border border-amber-500/70 bg-amber-900/50 px-2.5 py-1 text-[11px] font-medium text-amber-200" : "rounded-full border border-slate-700/60 px-2.5 py-1 text-[11px] text-slate-400 hover:text-amber-200 transition-colors"}
                >
                  Todas ({voteHistory.length})
                </button>
                {voteCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setVoteFilter(cat)}
                    className={voteFilter === cat ? "rounded-full border border-amber-500/70 bg-amber-900/50 px-2.5 py-1 text-[11px] font-medium text-amber-200" : "rounded-full border border-slate-700/60 px-2.5 py-1 text-[11px] text-slate-400 hover:text-amber-200 transition-colors"}
                  >
                    {PAGE_KEY_LABEL[cat] ?? cat}
                  </button>
                ))}
              </div>
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={() => setVoteSort(s => (s === "recent" ? "oldest" : "recent"))}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-700/60 px-2.5 py-1 text-[11px] text-slate-400 transition-colors hover:text-amber-200"
                  aria-label="Alternar ordenação por data"
                >
                  <ArrowUpDown className="h-3 w-3" />
                  {voteSort === "recent" ? "Mais recentes" : "Mais antigas"}
                </button>
              </div>
            </div>
            <div className="mt-3 space-y-2">
            {filteredVotes.map(v => (
              <div key={`${v.commentId}-${v.pageKey}`} className="flex items-start gap-3 rounded-md border border-slate-800/60 bg-black/25 px-3 py-2">
                {v.vote === 1 ? (
                  <ThumbsUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <ThumbsDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 line-clamp-2">{v.content}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {new Date(v.votedAt).toLocaleDateString("pt-BR")} · score atual: {(v.upvotes ?? 0) - (v.downvotes ?? 0)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label="Alterar para voto a favor"
                    onClick={() => changeVote.mutate({ commentId: v.commentId, vote: 1 })}
                    className="rounded border border-slate-700/60 px-2 py-1 text-[11px] text-slate-400 transition-colors hover:border-emerald-700/60 hover:text-emerald-400"
                  >
                    Votar +
                  </button>
                  <button
                    type="button"
                    aria-label="Alterar para voto contra"
                    onClick={() => changeVote.mutate({ commentId: v.commentId, vote: -1 })}
                    className="rounded border border-slate-700/60 px-2 py-1 text-[11px] text-slate-400 transition-colors hover:border-red-700/60 hover:text-red-400"
                  >
                    Votar −
                  </button>
                  <button
                    type="button"
                    aria-label="Remover meu voto"
                    onClick={() => changeVote.mutate({ commentId: v.commentId, vote: 0 })}
                    className="rounded border border-slate-700/60 px-2 py-1 text-[11px] text-slate-400 transition-colors hover:text-amber-300"
                  >
                    <RotateCcw className="inline h-3 w-3" /> Remover
                  </button>
                </div>
              </div>
            ))}
            {filteredVotes.length === 0 && (
              <p className="py-4 text-center text-xs text-slate-500">Nenhum voto nesta categoria.</p>
            )}
            </div>
          </>
        ) : (
          <p className="mt-3 text-xs text-slate-400">
            Você ainda não votou em nenhuma dica. Os votos que registrar aparecerão aqui e poderão ser alterados.
          </p>
        )}
      </section>

      {/* Timeline interativa */}
      <section className="mt-8 rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
        <h2 className="font-bold text-amber-300">Minha atividade</h2>
        <p className="mt-1 text-xs text-slate-500">Favoritos, votos em dicas e progresso no Codex em ordem cronológica.</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {([
            { key: "all", label: "Tudo", Icon: History },
            { key: "fav", label: "Favoritos", Icon: BookmarkPlus },
            { key: "vote", label: "Votos", Icon: ThumbsUp },
            { key: "codex", label: "Codex", Icon: StarOff },
          ] as { key: TimelineKind | "all"; label: string; Icon: typeof History }[]).map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTimelineFilter(key)}
              className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors", timelineFilter === key ? "border-amber-500/70 bg-amber-900/50 text-amber-200" : "border-slate-700/60 text-slate-400 hover:text-amber-200")}
            >
              <Icon className="h-3 w-3" /> {label}
            </button>
          ))}
        </div>
        {visibleTimeline.length === 0 ? (
          <p className="mt-4 py-4 text-center text-xs text-slate-500">Nenhuma atividade ainda — salve favoritos, vote em dicas ou marque itens do Codex.</p>
        ) : (
          <ol className="mt-4 relative border-l border-amber-800/40 pl-5 space-y-3">
            {visibleTimeline.map(t => {
              const linkable = t.path.startsWith("/");
              return (
                <li key={`${t.kind}-${t.itemId}-${t.commentId ?? ""}`} className="relative">
                  <span className={cn("absolute -left-[27px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border", t.kind === "fav" ? "border-amber-600/60 bg-amber-950/60 text-amber-400" : t.kind === "vote" ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-400" : "border-slate-600/60 bg-slate-900/60 text-slate-400")}>
                    {t.kind === "fav" ? <Heart className="h-2.5 w-2.5" /> : t.kind === "vote" ? <ThumbsUp className="h-2.5 w-2.5" /> : <StarOff className="h-2.5 w-2.5" />}
                  </span>
                  <div className={cn("rounded-md border px-3 py-2 text-sm", "border-slate-800/60 bg-black/25")}>
                    {linkable ? (
                      <Link href={t.path} className="block hover:text-amber-200 transition-colors">
                        <p className="text-slate-300 line-clamp-2">{t.title}</p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {t.kind === "fav" ? "Favorito em" : t.kind === "vote" ? (t.vote === 1 ? "Votou a favor em" : t.vote === -1 ? "Votou contra em" : "Removeu voto em") : "Coletou no Codex:"} {t.section} · {new Date(t.ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                        </p>
                      </Link>
                    ) : (
                      <>
                        <p className="text-slate-300 line-clamp-2">{t.title}</p>
                        <p className="mt-1 text-[11px] text-slate-500">{t.section} · {new Date(t.ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</p>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {/* Favoritos */}
      <section className="mt-8">
        <h2 className="gold-text text-2xl font-bold">Meus favoritos</h2>
        {favLoading ? (
          <Loader2 className="mt-3 h-5 w-5 animate-spin text-amber-500" />
        ) : favorites && favorites.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {favorites.map(f => {
              const [type] = f.itemId.split(":");
              const meta = SECTION_META[type] ?? SECTION_META.spirit;
              const Icon = meta.Icon;
              return (
                <Link
                  key={f.itemId}
                  href={meta.path}
                  className="flex items-center gap-3 rounded-lg border border-amber-900/40 bg-[oklch(0.19_0.015_280)] px-4 py-3 hover:border-amber-600/60 transition-colors"
                >
                  <Icon className="h-5 w-5 shrink-0 text-amber-500" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-amber-100">{resolveTitle(f)}</p>
                    <p className="text-xs text-slate-500">{meta.label}</p>
                  </div>
                  <button
                    aria-label="Remover favorito"
                    onClick={e => { e.preventDefault(); toggleFav.mutate({ itemId: f.itemId, itemType: f.itemType }); }}
                    className="text-xs text-slate-500 hover:text-red-400"
                  >
                    remover
                  </button>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-amber-900/40 bg-black/25 p-8 text-center">
            <Star className="mx-auto h-8 w-8 text-amber-600/50" />
            <p className="mt-3 text-sm text-slate-400">
              Você ainda não salvou favoritos. Explore o guia e clique na estrela de qualquer item para salvá-lo aqui.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button asChild size="sm" variant="outline" className="border-amber-700/50 text-amber-200">
                <Link href="/espiritos">Ver Espíritos</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="border-amber-700/50 text-amber-200">
                <Link href="/farm">Ver Locais de Farm</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
