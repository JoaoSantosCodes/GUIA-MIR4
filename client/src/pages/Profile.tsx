import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CODEX_ITEMS, CLASSES, FARM_SPOTS, RAIDS, SPIRITS, SABUK_CONTENT, MYSTERIES, EQUIPMENT_TYPES, MATERIALS } from "@shared/guideData";
import { cn } from "@/lib/utils";
import { useMemo, useEffect, useRef, useState } from "react";
import { Star, BookOpen, Pickaxe, Swords, Coins, LogIn, Loader2, Skull, Castle, Sparkles, Gem, Shield, Package, ThumbsUp, ThumbsDown, RotateCcw, ArrowUpDown, Medal, Heart, StarOff, History, BookmarkPlus, ImageDown, Crown, Zap } from "lucide-react";
import { GOLD_TIP_UPVOTES } from "@/components/guide/CommentsSection";
import { ExportActivityCardDialog } from "@/components/ExportCardDialog";
import { evaluateCodexAchievements } from "@/lib/codexAchievements";
import { evaluateChapterAchievements, TOTAL_CHAPTERS } from "@/lib/chapterAchievements";
import { Scroll as IconScroll } from "lucide-react";
import { readCelebrationEnabled, readLastAchievement, writeCelebrationEnabled, writeLastAchievement, readAchievementHistory, appendAchievementHistory } from "@/lib/celebrationState";
import { backfillRetroHistory, reconstructRetroAchievements } from "@/lib/achievementRetroDates";
import { BookOpen as IconBook, Gem as IconGem, Crown as IconCrown, Sparkles as IconSparkles, Swords as IconSwords, Star as IconStar, Info as IconInfo, ScrollText } from "lucide-react";
import AchievementCardDialog from "@/components/AchievementCardDialog";
import AchievementConfetti from "@/components/AchievementConfetti";
import HistoryCardDialog from "@/components/HistoryCardDialog";

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

  type AchievementFilter = "all" | "earned" | "progress" | "rarity";
  const [achFilter, setAchFilter] = useState<AchievementFilter>("all");
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

  /** Notificação de nova conquista: votos a favor em dicas que atingiram 10+ upvotes. */
  const newBadges = useMemo(
    () => (voteHistory ?? []).filter(v => v.vote === 1 && (v.upvotes ?? 0) >= GOLD_TIP_UPVOTES),
    [voteHistory],
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

  const ACHIEVEMENT_ICONS = { book: IconBook, gem: IconGem, crown: IconCrown, sparkle: IconSparkles, sword: IconSwords, star: IconStar, scroll: IconScroll, clock: IconStar } as const;

  const playedChapters = useMemo(() => {
    try {
      const raw = localStorage.getItem("mir4-chapters-played");
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? (parsed as number[]) : [];
    } catch {
      return [];
    }
  }, []);

const RARITY_LABEL: Record<string, string> = {
  "faixa-t1": "UC",
  "faixa-t2": "Raro",
  "faixa-t3": "Épico",
  "faixa-t4": "Lendário",
  "faixa-t5": "Mítico",
};

function rarityLabelFor(key: string): string {
  return RARITY_LABEL[key] ?? key;
}

/** Tooltip explicativo por conquista: como desbloquear cada medalha. */
function achievementTooltip(key: string, iconKey: string): string {
  switch (key) {
    case "codex-10":
      return "Registre 10 itens no Codex marcando-os como coletados na página Codex.";
    case "codex-25":
      return "Registre 25 itens no Codex marcando-os como coletados na página Codex.";
    case "mestre-codex":
      return "Registre TODOS os itens do Codex (meta máxima): é preciso completar todas as categorias.";
    case "equipamentos-5":
      return "Registre todos os itens da categoria Equipamentos como coletados na página Codex.";
    case "materiais-10":
      return "Registre todos os itens da categoria Materiais como coletados na página Codex.";
    case "consumiveis-6":
      return "Registre todos os itens da categoria Consumíveis como coletados na página Codex.";
    case "colecionaveis-6":
      return "Registre todos os itens da categoria Colecionáveis como coletados na página Codex.";
    case "reputacao-6":
      return "Registre todos os Badges de Reputação como coletados na página Codex.";
    case "faixa-t1":
      return `Registre todos os itens de raridade ${rarityLabelFor(key)} do Codex marcando-os como coletados.`;
    case "raro-5":
      return "Colete 5 itens de raridade Raro ou superior no Codex.";
    case "lendario-1":
      return "Colete pelo menos 1 item de raridade Lendária ou Mítica no Codex.";
    case "capitulos-10":
      return "Marque 10 capítulos como vivenciados na linha do tempo da página Notícias.";
    case "capitulos-veterano":
      return `Marque todos os ${TOTAL_CHAPTERS} capítulos da história do MIR4 como vivenciados na página Notícias — a medalha de veterano é concedida quando o circuito completo é concluído.`;
    default:
      if (/^faixa-t[2-5]$/.test(key)) return `Registre todos os itens de raridade ${rarityLabelFor(key)} do Codex marcando-os como coletados — quando TODOS os itens dessa raridade estiverem registrados, a conquista é desbloqueada.`;
      return "Complete o marco correspondente na página Codex marcando itens como coletados.";
  }
}

  const codexAchievements = useMemo(
    () => evaluateCodexAchievements(progress?.map(p => p.itemId) ?? []),
    [progress],
  );

  const chapterAchievements = useMemo(() => evaluateChapterAchievements(playedChapters), [playedChapters]);

  const allAchievements = useMemo(() => [...codexAchievements, ...chapterAchievements], [codexAchievements, chapterAchievements]);

  const filteredAchievements = useMemo(() => {
    let list = allAchievements.slice();
    if (achFilter === "earned") list = list.filter(a => a.earned);
    else if (achFilter === "progress") list = list.filter(a => !a.earned);
    else if (achFilter === "rarity") {
      // conquistadas primeiro: raridade (roxo) antes das demais
      list = list.slice().sort((a, b) => {
        const rA = /^faixa-t[2-5]$/.test(a.key) && a.earned ? 0 : a.earned ? 1 : 2;
        const rB = /^faixa-t[2-5]$/.test(b.key) && b.earned ? 0 : b.earned ? 1 : 2;
        return rA - rB || a.title.localeCompare(b.title, "pt-BR");
      });
    }
    return list;
  }, [allAchievements, achFilter]);

  const earnedCount = allAchievements.filter(a => a.earned).length;
  const rarityBadges = allAchievements.filter(a => /^faixa-t[2-5]$/.test(a.key) && a.earned).length;

  /** Notificação de conquista recém-desbloqueada: compara conquistas entre revalidações do progresso. */
  const prevEarnedRef = useRef<Set<string>>(new Set());
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);
  const [unlockedDesc, setUnlockedDesc] = useState<string>("");
  const [unlockedKey, setUnlockedKey] = useState<string | null>(null);
  const unlockedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [achCardOpen, setAchCardOpen] = useState(false);
  const [lastUnlocked, setLastUnlocked] = useState(() => readLastAchievement());
  const [achievementHistory, setAchievementHistory] = useState(() => readAchievementHistory());
  const [accumulatedNotices, setAccumulatedNotices] = useState<string[] | null>(null);
  const accumulatedDismissedRef = useRef(false);
  const [showAccumulatedCelebration, setShowAccumulatedCelebration] = useState(false);
  const accumulatedCelebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Ordem dos itens do histórico: "date" (mais recente primeiro), "rarity" (raridade primeiro) e tipo de medalha: "all" | "codex" | "gold". */
  type HistorySort = "date" | "rarity";
  type HistoryType = "all" | "codex" | "gold";
  const [historySort, setHistorySort] = useState<HistorySort>("date");
  const [historyType, setHistoryType] = useState<HistoryType>("all");
  const [historyCardOpen, setHistoryCardOpen] = useState(false);
  const [celebrationEnabled, setCelebrationEnabled] = useState(() => readCelebrationEnabled());
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  /** Histórico de conquistas + notificação de conquistas acumuladas ao retornar ao site. */
  useEffect(() => {
    if (!progress || progress.length === 0) return;
    // 1. preenche o histórico local com conquistas reconstruídas a partir das datas de coleta
    backfillRetroHistory(
      progress.map(p => ({ itemId: p.itemId, collectedAt: new Date(p.collectedAt).getTime() })),
      { read: readAchievementHistory, append: e => appendAchievementHistory(e) },
    );
    // 2. relê o histórico (agora incluindo retro) para exibição
    setAchievementHistory(readAchievementHistory());
    // 3. notificação acumulada: conquistas ganhas que não estavam na sessão anterior
    if (accumulatedDismissedRef.current) return;
    accumulatedDismissedRef.current = true;
    const retro = reconstructRetroAchievements(
      progress.map(p => ({ itemId: p.itemId, collectedAt: new Date(p.collectedAt).getTime() })),
    );
    const retroKeys = new Set(retro.map(r => r.key));
    const knownSession = new Set(achievementHistory.filter(e => e.source === "session").map(e => e.key));
    const brandNew = retro.filter(r => !knownSession.has(r.key));
    // só notifica quando há conquistas genuinamente novas desde a última visita
    const lastVisit = achievementHistory.length > 0 ? Math.max(...achievementHistory.map(e => e.unlockedAt)) : 0;
    const sinceLastVisit = retro.filter(r => r.unlockedAt > lastVisit && !knownSession.has(r.key));
    if (sinceLastVisit.length > 0 || brandNew.length === retro.length) {
      // retro vazia mas progresso existe => tudo é novidade acumulada; senão, só as novas
      const notices = retro.length === 0 ? [] : (sinceLastVisit.length > 0 ? sinceLastVisit : brandNew).map(r => r.title);
      setAccumulatedNotices(notices.slice(0, 5));
      // celebração da volta: som suave + confete quando houver novidades acumuladas
      if (readCelebrationEnabled()) {
        playAchievementSound();
        setShowAccumulatedCelebration(true);
        if (accumulatedCelebrationTimerRef.current) clearTimeout(accumulatedCelebrationTimerRef.current);
        accumulatedCelebrationTimerRef.current = setTimeout(() => setShowAccumulatedCelebration(false), 2500);
      }
    }
  }, [progress]);
  useEffect(() => () => {
    if (accumulatedCelebrationTimerRef.current) clearTimeout(accumulatedCelebrationTimerRef.current);
  }, []);

  /** Identifica a medalha do histórico como do Codex ou de Dicas de Ouro. */
  const historyEntryType = (key: string): "codex" | "gold" =>
    key.startsWith("gold-") ? "gold" : "codex";

  const filteredHistory = useMemo(() => {
    let list = achievementHistory.slice();
    if (historyType !== "all") list = list.filter(e => historyEntryType(e.key) === historyType);
    list.sort((a, b) => {
      if (historySort === "rarity") {
        const rA = /^faixa-t[2-5]$/.test(a.key) ? 0 : 1;
        const rB = /^faixa-t[2-5]$/.test(b.key) ? 0 : 1;
        return rA - rB || b.unlockedAt - a.unlockedAt;
      }
      return b.unlockedAt - a.unlockedAt;
    });
    return list;
  }, [achievementHistory, historySort, historyType]);

  useEffect(() => {
    if (!initializedRef.current) {
      // carga inicial: apenas registra as conquistas já existentes (sem notificação)
      prevEarnedRef.current = new Set(allAchievements.filter(a => a.earned).map(a => a.key));
      initializedRef.current = true;
      return;
    }
    const newly = allAchievements.filter(a => a.earned && !prevEarnedRef.current.has(a.key));
    prevEarnedRef.current = new Set(allAchievements.filter(a => a.earned).map(a => a.key));
    // notifica apenas conquistas desbloqueadas durante a sessão (após a carga inicial)
    if (newly.length > 0) {
      const latest = newly[newly.length - 1];
      setJustUnlocked(latest.title);
      setUnlockedDesc(latest.description);
      setUnlockedKey(latest.key);
      setShowCelebration(true);
      // registra a última conquista desbloqueada (painel permanente do perfil)
      writeLastAchievement({
        title: latest.title,
        description: latest.description,
        iconKey: latest.iconKey,
        unlockedAt: Date.now(),
      });
      setLastUnlocked({ title: latest.title, description: latest.description, iconKey: latest.iconKey, unlockedAt: Date.now() });
      // registra a conquista no histórico persistente (fonte "session", data exata)
      const entry = appendAchievementHistory({
        key: latest.key,
        title: latest.title,
        description: latest.description,
        iconKey: latest.iconKey,
        unlockedAt: Date.now(),
        source: "session",
      });
      setAchievementHistory(entry);
      // jingle suave de celebração (Web Audio), respeitando a preferência de celebração
      if (celebrationEnabled) playAchievementSound();
      if (unlockedTimerRef.current) clearTimeout(unlockedTimerRef.current);
      unlockedTimerRef.current = setTimeout(() => setJustUnlocked(null), 6000);
      if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
      celebrationTimerRef.current = setTimeout(() => setShowCelebration(false), 2500);
    }
  }, [celebrationEnabled, earnedCount, allAchievements]);
  useEffect(() => () => {
    if (unlockedTimerRef.current) clearTimeout(unlockedTimerRef.current);
    if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
  }, []);

  /** Jingle suave de celebração em dois tons via Web Audio (fallback silencioso). */
  function playAchievementSound() {
    try {
      const AudioCtx = (window as typeof window & { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const playTone = (freq: number, at: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + at);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + at + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + at + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + at);
        osc.stop(ctx.currentTime + at + dur);
      };
      playTone(659, 0, 0.25); // E5
      playTone(784, 0.18, 0.25); // G5
      playTone(988, 0.36, 0.45); // B5
    } catch {
      // ambiente sem Web Audio — continua sem som
    }
  }

  const celebrationAchievement = useMemo(
    () => allAchievements.find(a => a.key === unlockedKey) ?? null,
    [allAchievements, unlockedKey],
  );

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
      {/* Notificação animada de conquista recém-desbloqueada */}
      {justUnlocked && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed left-1/2 top-20 z-50 w-[min(92vw,480px)] -translate-x-1/2 rounded-lg border border-amber-400/70 bg-gradient-to-r from-amber-950/95 to-red-950/90 px-4 py-3 shadow-xl shadow-amber-500/25 backdrop-blur",
            reducedMotion ? "" : "animate-in slide-in-from-top-4 fade-in duration-300",
          )}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-amber-400/70 bg-amber-900/60 text-amber-300" style={{ boxShadow: "0 0 18px rgba(245,208,110,0.35)" }}>
              <Medal className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Conquista desbloqueada!</p>
              <p className="text-sm font-semibold text-amber-100">{justUnlocked}</p>
              {unlockedDesc && <p className="mt-0.5 text-[11px] text-amber-200/70">{unlockedDesc}</p>}
            </div>
            <button
              aria-label="Fechar notificação"
              onClick={() => setJustUnlocked(null)}
              className="ml-auto shrink-0 text-xs text-amber-300/70 hover:text-amber-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {showCelebration && celebrationEnabled && <AchievementConfetti />}

      {/* Painel permanente da última conquista desbloqueada */}
      {lastUnlocked && (
        <section className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-amber-500/50 bg-gradient-to-r from-amber-950/70 via-amber-900/40 to-transparent px-4 py-3 shadow-sm shadow-amber-500/15">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-amber-400/70 bg-amber-900/60 text-amber-300" style={{ boxShadow: "0 0 14px rgba(245,208,110,0.3)" }}>
            {ACHIEVEMENT_ICONS[(lastUnlocked.iconKey as keyof typeof ACHIEVEMENT_ICONS) ?? "star"]({ className: "h-5 w-5" }) as React.ReactNode}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Última conquista</p>
            <p className="text-sm font-bold text-amber-100">{lastUnlocked.title}</p>
            <p className="text-[11px] text-slate-400">Desbloqueada em {new Date(lastUnlocked.unlockedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</p>
          </div>
          <button
            type="button"
            aria-label="Abrir card da última conquista"
            onClick={() => {
              setUnlockedKey(
                codexAchievements.find(a => a.title === lastUnlocked.title)?.key ?? null,
              );
              setAchCardOpen(true);
            }}
            className="ml-auto inline-flex items-center gap-1.5 rounded border border-amber-600/50 bg-amber-950/50 px-2.5 py-1.5 text-[11px] font-medium text-amber-200 transition-colors hover:bg-amber-900/60"
          >
            <ImageDown className="h-3.5 w-3.5" /> Exportar card
          </button>
        </section>
      )}

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
          {rarityBadges > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-purple-500/60 bg-gradient-to-r from-purple-950/60 to-purple-900/40 px-3 py-1.5 shadow-sm shadow-purple-500/20">
              <Gem className="h-4 w-4 text-purple-300" />
              <span className="text-xs font-bold uppercase tracking-wide text-purple-200">{rarityBadges} conquista{rarityBadges !== 1 ? "s" : ""} de raridade</span>
              <span className="text-[10px] text-slate-500">— raridades completas no Codex</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-black/25 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-300">Celebração</span>
            <button
              type="button"
              role="switch"
              aria-checked={celebrationEnabled}
              aria-label={celebrationEnabled ? "Desativar som e confetes de conquistas" : "Ativar som e confetes de conquistas"}
              onClick={() => {
                setCelebrationEnabled(on => {
                  writeCelebrationEnabled(!on);
                  return !on;
                });
                toast.success(celebrationEnabled ? "Som e confetes de conquistas desativados" : "Som e confetes de conquistas ativados");
              }}
              className={cn(
                "relative h-4 w-7 rounded-full transition-colors duration-200",
                celebrationEnabled ? "bg-amber-600" : "bg-slate-700",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform duration-200",
                  celebrationEnabled ? "translate-x-3.5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>
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
      {achCardOpen && celebrationAchievement && (
        <AchievementCardDialog
          open={achCardOpen}
          onOpenChange={setAchCardOpen}
          data={{
            title: celebrationAchievement.title,
            description: celebrationAchievement.description,
            icon: celebrationAchievement.icon,
            achievedAt: lastUnlocked?.title === celebrationAchievement.title ? lastUnlocked.unlockedAt : undefined,
          }}
          userName={user.name ?? "Aventureiro"}
          goldBadges={goldBadges}
        />
      )}
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

      {/* Conquistas */}
      <section className="mt-8 rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
        <h2 className="font-bold text-amber-300">Conquistas</h2>
        <p className="mt-1 text-xs text-slate-500">
          Complete marcos no Codex e na linha do tempo de capítulos para desbloquear medalhas visuais.
          {earnedCount > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-amber-500/60 bg-amber-900/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
              <Medal className="h-2.5 w-2.5" /> {earnedCount} conquistad{earnedCount !== 1 ? "as" : "a"}
            </span>
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {([
            ["all", `Todas (${codexAchievements.length})`],
            ["earned", `Conquistadas (${earnedCount})`],
            ["progress", `Em progresso (${codexAchievements.length - earnedCount})`],
            ["rarity", "Raridade primeiro"],
          ] as [AchievementFilter, string][]).map(([f, label]) => (
            <button
              key={f}
              type="button"
              onClick={() => setAchFilter(f)}
              className={achFilter === f ? "rounded-full border border-amber-500/70 bg-amber-900/50 px-2.5 py-1 text-[11px] font-medium text-amber-200" : "rounded-full border border-slate-700/60 px-2.5 py-1 text-[11px] text-slate-400 hover:text-amber-200 transition-colors"}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAchievements.map(a => {
            const Icon = ACHIEVEMENT_ICONS[a.iconKey];
            const isRarity = /^faixa-t[2-5]$/.test(a.key);
            return (
              <div
                key={a.key}
                className={cn(
                  "group relative flex items-start gap-3 rounded-md border px-3 py-3",
                  a.earned
                    ? isRarity
                      ? "border-purple-400/60 bg-gradient-to-br from-purple-950/60 to-purple-900/20 shadow-sm shadow-purple-500/20 ring-1 ring-purple-500/40 hover:ring-purple-400/70"
                      : "border-amber-500/70 bg-gradient-to-br from-amber-950/60 to-amber-900/20 shadow-sm shadow-amber-500/20 hover:ring-amber-400/70"
                    : "border-slate-800/60 bg-black/25 opacity-70 hover:opacity-90",
                  a.earned && "ring-1 ring-transparent",
                )}
                title={achievementTooltip(a.key, a.iconKey)}
              >
                {isRarity && (
                  <span className="absolute -top-1.5 right-2 z-10 rounded-full bg-purple-500/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                    Raridade
                  </span>
                )}
                <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border", a.earned ? (isRarity ? "border-purple-400/70 bg-purple-900/40 text-purple-300" : "border-amber-500/70 bg-amber-900/40 text-amber-400") : "border-slate-700/60 bg-slate-900/40 text-slate-500")}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="absolute right-2 top-2 text-slate-500 group-hover:text-amber-400 transition-colors" aria-hidden="true">
                  <IconInfo className="h-3 w-3" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-semibold", a.earned ? (isRarity ? "text-purple-200" : "text-amber-200") : "text-slate-300")}>{a.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{a.description}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={cn("h-full rounded-full transition-all", a.earned ? (isRarity ? "bg-gradient-to-r from-purple-600 to-purple-400" : "bg-gradient-to-r from-amber-600 to-amber-400") : "bg-amber-800/60")}
                      style={{ width: `${Math.round((a.progress / a.goal) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">{a.progress}/{a.goal}</p>
                </div>
                {a.earned && (
                  <button
                    type="button"
                    aria-label={`Exportar card da conquista ${a.title}`}
                    onClick={() => {
                      setUnlockedKey(a.key);
                      setAchCardOpen(true);
                    }}
                    className="mt-1 flex w-full items-center justify-center gap-1.5 rounded border border-amber-600/50 bg-amber-950/50 px-2 py-1 text-[10px] font-medium text-amber-200 transition-colors hover:bg-amber-900/60"
                  >
                    <ImageDown className="h-3 w-3" /> Exportar card
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Banner de conquistas acumuladas (ao retornar ao site) */}
      {accumulatedNotices !== null && accumulatedNotices.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "relative mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-amber-400/70 bg-gradient-to-r from-amber-950/95 to-red-950/90 px-4 py-3 shadow-xl shadow-amber-500/25 backdrop-blur",
            reducedMotion ? "" : "animate-in slide-in-from-top-4 fade-in duration-300",
          )}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-amber-400/70 bg-amber-900/60 text-amber-300" style={{ boxShadow: "0 0 18px rgba(245,208,110,0.35)" }}>
            <ScrollText className="h-5 w-5" />
          </span>
          {showAccumulatedCelebration && !reducedMotion && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 top-12 overflow-hidden rounded-lg">
              <AchievementConfetti />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Conquistas acumuladas desde sua última visita</p>
            <p className="text-sm font-semibold text-amber-100">
              Você desbloqueou {accumulatedNotices.length} nova{accumulatedNotices.length !== 1 ? "s" : ""} medalha{accumulatedNotices.length !== 1 ? "s" : ""}:
            </p>
            <p className="mt-0.5 text-xs text-amber-200/80">{accumulatedNotices.join(" · ")}</p>
          </div>
          <button
            aria-label="Fechar notificação de conquistas acumuladas"
            onClick={() => setAccumulatedNotices(null)}
            className="ml-auto shrink-0 text-xs text-amber-300/70 hover:text-amber-200 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Histórico de conquistas */}
      <section className="mt-8 rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-amber-300">Histórico de conquistas</h2>
            <p className="mt-1 text-xs text-slate-500">
              Todas as medalhas desbloqueadas por você, com as datas em que foram conquistadas.
            </p>
          </div>
          {filteredHistory.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="border-amber-600/60 text-amber-200 hover:bg-amber-900/40"
              onClick={() => setHistoryCardOpen(true)}
            >
              <ImageDown className="mr-1.5 h-3.5 w-3.5" /> Compartilhar
            </Button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(["all", "codex", "gold"] as const).map(t => (
              <button
                key={t}
                onClick={() => setHistoryType(t)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  historyType === t
                    ? "border-amber-500/70 bg-amber-900/50 text-amber-200"
                    : "border-slate-700/60 bg-slate-900/50 text-slate-400 hover:text-amber-300",
                )}
              >
                {t === "all" ? `Todas (${achievementHistory.length})` : t === "codex" ? "Codex" : "Dicas de Ouro"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3 w-3 text-slate-500" />
            {(["date", "rarity"] as const).map(s => (
              <button
                key={s}
                onClick={() => setHistorySort(s)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  historySort === s
                    ? "border-amber-500/70 bg-amber-900/50 text-amber-200"
                    : "border-slate-700/60 bg-slate-900/50 text-slate-400 hover:text-amber-300",
                )}
              >
                {s === "date" ? "Mais recente" : "Raridade primeiro"}
              </button>
            ))}
          </div>
        </div>
        {filteredHistory.length > 0 ? (
          <ul className="mt-4 divide-y divide-amber-900/30">
            {filteredHistory.map(e => {
              const Icon = ACHIEVEMENT_ICONS[(e.iconKey as keyof typeof ACHIEVEMENT_ICONS) ?? "star"];
              const isRarity = /^faixa-t[2-5]$/.test(e.key);
              return (
                <li key={`${e.key}-${e.unlockedAt}`} className="flex items-center gap-3 py-2.5">
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border", isRarity ? "border-purple-400/70 bg-purple-900/40 text-purple-300" : "border-amber-500/70 bg-amber-900/40 text-amber-400")}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-semibold", isRarity ? "text-purple-200" : "text-amber-200")}>{e.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{e.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <p className="text-[11px] text-slate-300">{new Date(e.unlockedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</p>
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide", e.source === "session" ? "border border-amber-500/60 bg-amber-900/40 text-amber-300" : "border border-slate-700/60 bg-slate-800/60 text-slate-400")}>
                      {e.source === "session" ? "na sessão" : "reconstruída"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 flex items-center gap-2 py-4 text-center text-xs text-slate-500">
            <Medal className="h-3.5 w-3.5" />
            {achievementHistory.length === 0
              ? "Nenhuma conquista desbloqueada ainda — explore a página do Codex e marque seus primeiros itens!"
              : "Nenhuma medalha neste filtro — ajuste o tipo ou a ordenação para ver mais medalhas."}
          </p>
        )}
        <HistoryCardDialog
          open={historyCardOpen}
          onOpenChange={setHistoryCardOpen}
          userName={user.name ?? "Aventureiro"}
          goldBadges={goldBadges}
          entries={filteredHistory.map(e => {
            const entry: Record<string, string> = { book: "📖", gem: "💎", crown: "👑", sword: "⚔️", star: "⭐", sparkle: "✨" };
            return {
              key: e.key,
              title: e.title,
              icon: entry[e.iconKey ?? "star"] ?? "✨",
              unlockedAt: e.unlockedAt,
              type: historyEntryType(e.key),
            };
          })}
        />
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
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-bold text-amber-300">Minha atividade</h2>
            <p className="mt-1 text-xs text-slate-500">Favoritos, votos em dicas e progresso no Codex em ordem cronológica.</p>
          </div>
          <ExportActivityCardDialog
            userName={user.name ?? "Aventureiro"}
            goldBadges={goldBadges}
            items={visibleTimeline.map(t => ({ ts: t.ts, kind: t.kind, title: t.title, section: t.section }))}
          />
        </div>
        {newBadges.length > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-amber-500/50 bg-gradient-to-r from-amber-900/30 to-transparent px-3 py-2">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
            <p className="text-xs text-amber-200">
              <strong>{newBadges.length} dica{newBadges.length !== 1 ? "s" : ""} em que você votou</strong> {newBadges.length !== 1 ? "são" : " é"} premiad{newBadges.length !== 1 ? "as" : "a"} —
              você ganhou medalha{newBadges.length !== 1 ? "s" : ""} de ouro! Continue apoiando as melhores dicas.
            </p>
          </div>
        )}
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
                  <div className={cn("rounded-md border px-3 py-2 text-sm", t.kind === "vote" && t.commentId !== undefined && newBadges.some(b => b.commentId === t.commentId) ? "border-amber-500/60 bg-amber-950/30" : "border-slate-800/60 bg-black/25")}>
                    {linkable ? (
                      <Link href={t.path} className="block hover:text-amber-200 transition-colors">
                        <p className="text-slate-300 line-clamp-2">
                          {t.title}
                          {t.kind === "vote" && t.commentId !== undefined && newBadges.some(b => b.commentId === t.commentId) && (
                            <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-amber-500/60 bg-amber-900/40 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wide text-amber-300">
                              <Crown className="h-2.5 w-2.5" /> Dica de Ouro
                            </span>
                          )}
                        </p>
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
