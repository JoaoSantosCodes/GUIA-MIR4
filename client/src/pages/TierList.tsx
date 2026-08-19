import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ChevronUp, ChevronDown, Lock, RotateCcw, Users, UserRound, Info, Sparkles, History } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import PageBanner from "@/components/guide/PageBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CLASSES,
  CLASS_TIER_RANKINGS,
  SECTION_IMAGES,
  SPIRIT_ATTRIBUTES,
  SPIRIT_COMBO_RECOMMENDATIONS,
  SPIRIT_RADAR_LABELS,
  SPIRIT_TIER_LIST_KEYS,
  SPIRIT_TIER_RANKINGS,
  TIERLIST_SCENARIOS,
  TIERLIST_TIERS,
  TIERLIST_TIER_STYLE,
  type TierListTier,
  RARITY_ORDER,
  RARITY_STYLES,
  SPIRITS,
} from "@shared/guideData";
import {
  aggregateCommunityVotes,
  baseClassTier,
  getPersonalOverrideCount,
  resolveClassTier,
  writePersonalTier,
} from "@/lib/tierlistLogic";
import {
  aggregateSpiritCommunityVotes,
  getPersonalSpiritOverrideCount,
  readPersonalSpiritTier,
  resolveSpiritTier,
  writePersonalSpiritTier,
} from "@/lib/spiritTierlistLogic";
import GenericRadarChart, { type GenericRadarSeries } from "@/components/GenericRadarChart";
import TierHistoryChart from "@/components/TierHistoryChart";
import SpiritCompareDialog from "@/components/SpiritCompareDialog";

/** Classes oficiais do MIR4 na ordem de apresentação. */
const CLASS_KEYS = [
  "warrior",
  "sorcerer",
  "taoist",
  "lancer",
  "arbalist",
  "darkist",
  "lionheart",
  "spiritsummoner",
] as const;

const CLASS_IMAGES: Record<string, string> = Object.fromEntries(CLASSES.map(c => [c.key, c.image]));

const CLASS_LABELS: Record<string, string> = Object.fromEntries(CLASSES.map(c => [c.key, c.name]));

const CLASS_PATH: Record<string, string> = {
  warrior: "/classes#warrior",
  sorcerer: "/classes#sorcerer",
  taoist: "/classes#taoist",
  lancer: "/classes#lancer",
  arbalist: "/classes#arbalist",
  darkist: "/classes#darkist",
  lionheart: "/classes#lionheart",
  spiritsummoner: "/classes#spiritsummoner",
};

const SPIRIT_IMAGES: Record<string, string> = {};

/** Sincroniza o estado local com o backend: votos comunitários + voto do usuário. */
function useTierlistVote(scenario: string, classKey: string) {
  const auth = useAuth();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.tierlist.results.useQuery({ scenario }, { enabled: !!scenario });
  const community = data?.community?.[classKey] ?? null;
  const userVote = data?.userVotes?.[classKey] ?? 0;

  const voteMutation = trpc.tierlist.vote.useMutation({
    onSuccess: () => void utils.tierlist.results.invalidate({ scenario }),
  });

  const vote = (direction: 1 | -1) => {
    if (!auth.user) return;
    // Toggle: votar na mesma direção remove o voto.
    const next: 1 | -1 | 0 = userVote === direction ? 0 : direction;
    void voteMutation.mutate({ scenario, classKey, vote: next });
  };

  return { community, userVote, isLoading, vote, isMutating: voteMutation.isPending };
}

export default function TierList() {
  const [scenario, setScenario] = useState<string>(TIERLIST_SCENARIOS[0].key);
  const [tab, setTab] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") === "spirits" ? "spirits" : "classes";
  });
  const auth = useAuth();
  const [, rerender] = useState(0);

  // Re-render local quando o cenário muda (localStorage é lido por cenário).
  useEffect(() => {
    rerender(n => n + 1);
  }, [scenario]);

  const resultsQuery = trpc.tierlist.results.useQuery({ scenario });
  const spiritResultsQuery = trpc.spiritTierlist.results.useQuery({ scenario });
  const historyQuery = trpc.tierlistHistory.list.useQuery({ scenario }, { enabled: tab === "classes" });
  const communityVotes = resultsQuery.data?.community ?? {};
  const overrides = getPersonalOverrideCount(scenario, CLASS_KEYS as unknown as string[]);

  const aggregated = useMemo(() => {
    const votes = Object.entries(communityVotes).flatMap(([classKey, { sums, count }]) => {
      const arr: { classKey: string; vote: "up" | "down" }[] = [];
      // Reconstrói votos individuais aproximados: soma/contagem média
      const perVote = count > 0 ? sums / count : 0;
      const upWeight = (perVote + 1) / 2; // fração de votos "up"
      const total = Math.min(count, 2); // agregação precisa de >=2 votos como na lógica
      for (let i = 0; i < total; i++) {
        arr.push({ classKey, vote: i < total * upWeight ? "up" : "down" });
      }
      return arr;
    });
    return aggregateCommunityVotes(scenario, votes);
  }, [scenario, communityVotes]);

  const rows = useMemo(() => {
    return TIERLIST_TIERS.map(tier => ({
      tier,
      classes: (CLASS_KEYS as readonly string[]).filter(c => resolveClassTier(scenario, c, aggregated[c]).tier === tier),
    }));
  }, [scenario, aggregated]);

  const startLogin = () => void (auth.user ? null : void import("@/const").then(m => m.startLogin()));

  return (
    <div>
      <PageBanner
        title="Tier List"
        subtitle="Ranking comunitário das 8 classes oficiais e dos espíritos do MIR4 por cenário. Vote para sugerir ajustes e personalize sua própria tier list."
        image={SECTION_IMAGES.hero}
      />
      <div className="container py-10">
        <Tabs
          value={tab}
          onValueChange={v => {
            setTab(v);
            const url = new URL(window.location.href);
            if (v === "spirits") url.searchParams.set("tab", "spirits");
            else url.searchParams.delete("tab");
            window.history.replaceState({}, "", url.toString());
          }}
          className="w-full"
        >
        <TabsList className="mb-6 border border-amber-800/40 bg-black/40 p-[3px]">
          <TabsTrigger value="classes" className="data-[state=active]:border-amber-500/70 data-[state=active]:bg-amber-900/40 data-[state=active]:text-amber-300 rounded-md px-4 text-slate-400">Classes</TabsTrigger>
          <TabsTrigger value="spirits" className="data-[state=active]:border-amber-500/70 data-[state=active]:bg-amber-900/40 data-[state=active]:text-amber-300 rounded-md px-4 text-slate-400">Espíritos</TabsTrigger>
        </TabsList>
        <TabsContent value="classes">
        <p className="text-sm text-slate-400 leading-relaxed">
          Cada cenário tem um tier de referência da comunidade (baseado em meta atual). Ao votar, a comunidade pode mover
          classes entre tiers (precisa de pelo menos 2 votos e a média decide a direção). Seu voto pessoal no browser sempre
          prevalece sobre o voto da comunidade — use para ajustar à sua experiência.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {TIERLIST_SCENARIOS.map(s => (
            <button
              key={s.key}
              onClick={() => setScenario(s.key)}
              className={cn(
                "flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-all active:scale-[0.97]",
                scenario === s.key
                  ? "border-amber-500 bg-amber-900/40 text-amber-300"
                  : "border-amber-800/40 bg-black/30 text-slate-400 hover:text-amber-200 hover:border-amber-700/50",
              )}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> Votos da comunidade:{" "}
            {Object.values(communityVotes).reduce((acc, v) => acc + v.count, 0)}
          </span>
          <span className="flex items-center gap-1.5">
            <UserRound className="h-4 w-4" /> Seus overrides pessoais: {overrides}/8
          </span>
          {overrides > 0 && (
            <button
              onClick={() => {
                for (const c of CLASS_KEYS) writePersonalTier(scenario, c, undefined);
                rerender(n => n + 1);
              }}
              className="flex items-center gap-1.5 rounded-md border border-red-800/50 bg-red-950/30 px-2.5 py-1 text-xs text-red-300 transition-colors hover:bg-red-900/40 active:scale-[0.97]"
            >
              <RotateCcw className="h-3 w-3" /> Limpar overrides
            </button>
          )}
        </div>

        {/* Tabela de tiers */}
        <div className="mt-6 space-y-4">
          {resultsQuery.isLoading &&
            TIERLIST_TIERS.map(tier => (
              <div key={tier} className="rounded-lg border border-amber-900/40 bg-[oklch(0.19_0.015_280)] p-4">
                <Skeleton className="h-14 w-14" />
              </div>
            ))}
          {!resultsQuery.isLoading &&
            rows.map(({ tier, classes }) => {
              const style = TIERLIST_TIER_STYLE[tier];
              return (
                <div key={tier} className="rounded-lg border border-amber-900/40 bg-[oklch(0.19_0.015_280)] p-4">
                  <div className="flex flex-wrap gap-3">
                    <div
                      className={cn(
                        "flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border text-2xl font-black ring-2",
                        style.bg,
                        style.text,
                        style.ring,
                      )}
                    >
                      {tier}
                    </div>
                    <div className="flex-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {classes.length === 0 && (
                        <p className="col-span-full text-sm italic text-slate-500">Nenhuma classe neste tier ainda.</p>
                      )}
                      {classes.map(classKey => (
                        <ClassTierCell
                          key={classKey}
                          scenario={scenario}
                          classKey={classKey}
                          community={communityVotes[classKey] ?? null}
                          isLoggedIn={!!auth.user}
                          onLoginNeeded={startLogin}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Legenda */}
        <div className="mt-6 rounded-lg border border-amber-900/40 bg-black/30 p-4 text-sm text-slate-400 leading-relaxed">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <span>
              <strong className="text-amber-300">S</strong> = meta absoluta do cenário ·{" "}
              <strong className="text-red-300">A</strong> = excelente · <strong className="text-slate-200">B</strong> = viável ·{" "}
              <strong className="text-slate-400">C</strong> = situacional. Clique em uma classe para abrir a página detalhada
              com skills, builds e vídeo de gameplay.
            </span>
          </p>
        </div>

        {/* Histórico semanal */}
        <div className="mt-8">
          <h2 className="flex items-center gap-2 text-lg font-bold text-amber-200">
            <Info className="h-5 w-5" /> Histórico semanal da tier list
          </h2>
          <p className="mt-1 text-xs text-slate-500">Evolução dos tiers comunitários ao longo das semanas com base nos votos registrados.</p>
          <div className="mt-3">
            <TierHistoryChart data={historyQuery.data ?? []} scenarioLabel={TIERLIST_SCENARIOS.find(s => s.key === scenario)?.label ?? scenario} />
          </div>
        </div>

        </TabsContent>
        <TabsContent value="spirits">
        <SpiritTierBoard scenario={scenario} isLoggedIn={!!auth.user} onLoginNeeded={startLogin} />
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ClassTierCell({
  scenario,
  classKey,
  community,
  isLoggedIn,
  onLoginNeeded,
}: {
  scenario: string;
  classKey: string;
  community: { sums: number; count: number } | null;
  isLoggedIn: boolean;
  onLoginNeeded: () => void;
}) {
  const { vote, userVote, isMutating } = useTierlistVote(scenario, classKey);
  const resolved = resolveClassTier(scenario, classKey, aggregatedOrZero(scenario, classKey, community));
  const base = baseClassTier(scenario, classKey) ?? "B";
  const why = CLASS_TIER_RANKINGS[scenario]?.[classKey]?.why ?? "";
  const style = TIERLIST_TIER_STYLE[resolved.tier];

  const handleVote = (dir: 1 | -1) => {
    if (!isLoggedIn) {
      onLoginNeeded();
      return;
    }
    vote(dir);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 rounded-md border bg-black/30 p-3 transition-colors",
        resolved.source === "personal" ? "border-amber-500/70" : "border-slate-700/50",
      )}
    >
      <div className="flex items-center gap-2">
        <img
          src={CLASS_IMAGES[classKey as keyof typeof CLASS_IMAGES]}
          alt={CLASS_LABELS[classKey]}
          className="h-9 w-9 rounded-md border border-amber-800/40 object-cover"
          loading="lazy"
        />
        <Link href={CLASS_PATH[classKey]} className="flex-1 font-semibold text-amber-100 hover:underline">
          {CLASS_LABELS[classKey]}
        </Link>
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded border text-xs font-black",
            style.bg,
            style.text,
            style.ring,
          )}
        >
          {resolved.tier}
        </div>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{why}</p>

      {/* Controles de voto */}
      <div className="mt-auto flex items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleVote(-1)}
            disabled={isMutating}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded border transition-colors active:scale-[0.9]",
              userVote === -1
                ? "border-red-500 bg-red-900/50 text-red-300"
                : "border-slate-700/60 bg-black/40 text-slate-400 hover:border-red-700 hover:text-red-300",
            )}
            title={isLoggedIn ? "Sugerir tier menor" : "Faça login para votar"}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <span
            className={cn(
              "min-w-[3.5rem] text-center text-xs font-semibold tabular-nums",
              community && community.sums > 0 ? "text-green-400" : community && community.sums < 0 ? "text-red-400" : "text-slate-500",
            )}
          >
            {community ? `${community.count} voto${community.count === 1 ? "" : "s"}` : "sem votos"}
          </span>
          <button
            onClick={() => handleVote(1)}
            disabled={isMutating}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded border transition-colors active:scale-[0.9]",
              userVote === 1
                ? "border-green-500 bg-green-900/50 text-green-300"
                : "border-slate-700/60 bg-black/40 text-slate-400 hover:border-green-700 hover:text-green-300",
            )}
            title={isLoggedIn ? "Sugerir tier maior" : "Faça login para votar"}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
        <span
          className={cn(
            "flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide",
            resolved.source === "personal"
              ? "text-amber-400"
              : resolved.source === "community"
                ? "text-blue-400"
                : "text-slate-600",
          )}
        >
          {resolved.source === "personal" && <UserRound className="h-3 w-3" />}
          {resolved.source === "community" && <Users className="h-3 w-3" />}
          {resolved.source === "personal"
            ? "seu override"
            : resolved.source === "community"
              ? "comunidade"
              : base !== resolved.tier
                ? "deslocado"
                : ""}
          {resolved.tier !== base && resolved.source !== "personal" && resolved.source !== "community" && (
            <span className="text-slate-500">ref. {base}</span>
          )}
        </span>
      </div>

      {/* Célula bloqueada para não logados */}
      {!isLoggedIn && (
        <button
          onClick={onLoginNeeded}
          className="absolute inset-0 z-10 flex items-center justify-center gap-1.5 rounded-md bg-black/60 text-xs font-semibold text-slate-300 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100"
        >
          <Lock className="h-3.5 w-3.5" /> Faça login para votar
        </button>
      )}
    </div>
  );
}

function aggregatedOrZero(
  scenario: string,
  classKey: string,
  community: { sums: number; count: number } | null,
): number {
  if (!community) return 0;
  if (community.count < 2) return 0; // precisa de pelo menos 2 votos para mover
  const avg = community.sums / community.count;
  if (Math.abs(avg) < 0.5) return 0;
  return Math.round(avg) > 0 ? 1 : -1;
}

/**
 * Tab de Espíritos: tier list interativa dos 10 espíritos com identidade própria,
 * combos recomendados por cenário e mini-radar de atributos.
 */
function SpiritTierBoard({
  scenario,
  isLoggedIn,
  onLoginNeeded,
}: {
  scenario: string;
  isLoggedIn: boolean;
  onLoginNeeded: () => void;
}) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.spiritTierlist.results.useQuery({ scenario }, { enabled: !!scenario });
  const historyQuery = trpc.spiritTierlistHistory.list.useQuery({ scenario });
  const community = data?.community ?? {};
  const rankings = data?.rankings ?? {};

  const overrides = getPersonalSpiritOverrideCount(scenario, SPIRIT_TIER_LIST_KEYS);
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);
  const [, rerender] = useState(0);

  const aggregated = useMemo(
    () =>
      aggregateSpiritCommunityVotes(
        scenario,
        Object.entries(community).map(([spiritKey, { sums, count }]) => ({
          spiritKey,
          vote: count > 0 && sums / count >= 0 ? "up" : "down",
        })),
      ),
    [scenario, community],
  );

  const rows = useMemo(() => {
    return TIERLIST_TIERS.map(tier => ({
      tier,
      spirits: SPIRIT_TIER_LIST_KEYS.filter(s => {
        if (resolveSpiritTier(scenario, s, aggregated[s]).tier !== tier) return false;
        if (rarityFilter) {
          const spirit = SPIRITS.find(sp => sp.key === s);
          if (spirit?.rarity !== rarityFilter) return false;
        }
        return true;
      }),
    }));
  }, [scenario, aggregated, rarityFilter]);

  const voteMutation = trpc.spiritTierlist.vote.useMutation({
    onSuccess: () => void utils.spiritTierlist.results.invalidate({ scenario }),
  });

  const handleVote = (spiritKey: string, direction: 1 | -1) => {
    if (!isLoggedIn) {
      onLoginNeeded();
      return;
    }
    const current: 1 | -1 | 0 = (data?.userVotes?.[spiritKey] as 1 | -1 | 0) ?? 0;
    const next: 1 | -1 | 0 = current === direction ? 0 : direction;
    void voteMutation.mutate({ scenario, spiritKey, vote: next });
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-amber-300">Tier list de espíritos — {TIERLIST_SCENARIOS.find(s => s.key === scenario)?.label ?? scenario}</p>
          <p className="mt-1 text-xs text-slate-500">
            A comunidade pode mover espíritos entre tiers (mínimo de 2 votos, média decide a direção). Seu voto pessoal no
            browser sempre prevalece. Abaixo, os combos recomendados por cenário.
          </p>
        </div>
        <SpiritCompareDialog />
      </div>

      {/* Filtro de raridade */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Raridade:</span>
        <button
          onClick={() => setRarityFilter(null)}
          className={cn(
            "rounded-md border px-3 py-1 text-xs font-semibold transition-all active:scale-[0.97]",
            rarityFilter === null
              ? "border-amber-500 bg-amber-900/40 text-amber-300"
              : "border-amber-800/40 bg-black/30 text-slate-400 hover:text-amber-200",
          )}
        >
          Todas
        </button>
        {RARITY_ORDER.map(r => {
          const style = (RARITY_STYLES as Record<string, { color: string; border: string; bg: string }> | undefined)?.[r];
          return (
            <button
              key={r}
              onClick={() => setRarityFilter(rarityFilter === r ? null : r)}
              className={cn(
                "rounded-md border px-3 py-1 text-xs font-semibold transition-all active:scale-[0.97]",
                rarityFilter === r
                  ? "border-amber-500 bg-amber-900/40 text-amber-300"
                  : style
                    ? `${style.border} ${style.bg} ${style.color} opacity-75 hover:opacity-100`
                    : "border-amber-800/40 bg-black/30 text-slate-400 hover:text-amber-200",
              )}
            >
              {r}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-400">
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" /> Votos da comunidade: {Object.values(community).reduce((acc, v) => acc + v.count, 0)}
        </span>
        <span className="flex items-center gap-1.5">
          <UserRound className="h-4 w-4" /> Seus overrides pessoais: {overrides}/{SPIRIT_TIER_LIST_KEYS.length}
        </span>
        {overrides > 0 && (
          <button
            onClick={() => {
              for (const s of SPIRIT_TIER_LIST_KEYS) writePersonalSpiritTier(scenario, s, undefined);
              rerender(n => n + 1);
            }}
            className="flex items-center gap-1.5 rounded-md border border-red-800/50 bg-red-950/30 px-2.5 py-1 text-xs text-red-300 transition-colors hover:bg-red-900/40 active:scale-[0.97]"
          >
            <RotateCcw className="h-3 w-3" /> Limpar overrides
          </button>
        )}
      </div>

      {/* Tabela de tiers */}
      <div className="mt-6 space-y-4">
        {isLoading &&
          TIERLIST_TIERS.map(tier => (
            <div key={tier} className="rounded-lg border border-amber-900/40 bg-[oklch(0.19_0.015_280)] p-4">
              <Skeleton className="h-14 w-14" />
            </div>
          ))}
        {!isLoading &&
          rows.map(({ tier, spirits }) => {
            const style = TIERLIST_TIER_STYLE[tier];
            return (
              <div key={tier} className="rounded-lg border border-amber-900/40 bg-[oklch(0.19_0.015_280)] p-4">
                <div className="flex flex-wrap gap-3">
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border text-2xl font-black ring-2",
                      style.bg,
                      style.text,
                      style.ring,
                    )}
                  >
                    {tier}
                  </div>
                  <div className="flex-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {spirits.length === 0 && (
                      <p className="col-span-full text-sm italic text-slate-500">Nenhum espírito neste tier ainda.</p>
                    )}
                    {spirits.map(spiritKey => {
                      const resolved = resolveSpiritTier(scenario, spiritKey, aggregated[spiritKey]);
                      const why = rankings[spiritKey]?.why ?? "";
                      const base = rankings[spiritKey]?.tier ?? "B";
                      const attrs = SPIRIT_ATTRIBUTES[spiritKey] ?? null;
                      return (
                        <div
                          key={spiritKey}
                          className={cn(
                            "group relative flex flex-col gap-2 rounded-md border bg-black/30 p-3 transition-colors",
                            resolved.source === "personal" ? "border-amber-500/70" : "border-slate-700/50",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-md border border-amber-800/40 text-base",
                                "bg-amber-950/40 text-amber-300",
                              )}
                            >
                              <Sparkles className="h-4 w-4" />
                            </div>
                            <span className="flex-1 font-semibold capitalize text-amber-100">{spiritKey}</span>
                            <div
                              className={cn(
                                "flex h-6 w-6 items-center justify-center rounded border text-xs font-black",
                                style.bg,
                                style.text,
                                style.ring,
                              )}
                            >
                              {resolved.tier}
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{why}</p>
                          {attrs && (
                            <div className="mt-1">
                              <GenericRadarChart
                                series={[{ key: spiritKey, name: spiritKey, values: Object.values(attrs) } as GenericRadarSeries]}
                                labels={Array.from(SPIRIT_RADAR_LABELS)}
                                colorA="#fbbf24"
                                colorB="transparent"
                                height={130}
                                showLegend={false}
                              />
                            </div>
                          )}
                          <div className="mt-auto flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleVote(spiritKey, -1)}
                                disabled={voteMutation.isPending}
                                className="flex h-7 w-7 items-center justify-center rounded border border-slate-700/60 bg-black/40 text-slate-400 transition-colors hover:border-red-700 hover:text-red-300 active:scale-[0.9]"
                                title="Sugerir tier menor"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                              <span
                                className={cn(
                                  "min-w-[3.5rem] text-center text-xs font-semibold tabular-nums",
                                  community[spiritKey]
                                    ? (community[spiritKey].sums ?? 0) > 0
                                      ? "text-green-400"
                                      : (community[spiritKey].sums ?? 0) < 0
                                        ? "text-red-400"
                                        : "text-slate-500"
                                    : "text-slate-500",
                                )}
                              >
                                {community[spiritKey] ? `${community[spiritKey].count} voto${community[spiritKey].count === 1 ? "" : "s"}` : "sem votos"}
                              </span>
                              <button
                                onClick={() => handleVote(spiritKey, 1)}
                                disabled={voteMutation.isPending}
                                className="flex h-7 w-7 items-center justify-center rounded border border-slate-700/60 bg-black/40 text-slate-400 transition-colors hover:border-green-700 hover:text-green-300 active:scale-[0.9]"
                                title="Sugerir tier maior"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                            </div>
                            <span
                              className={cn(
                                "flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide",
                                resolved.source === "personal"
                                  ? "text-amber-400"
                                  : resolved.source === "community"
                                    ? "text-blue-400"
                                    : "text-slate-600",
                              )}
                            >
                              {resolved.source === "personal" && <UserRound className="h-3 w-3" />}
                              {resolved.source === "community" && <Users className="h-3 w-3" />}
                              {resolved.source === "personal"
                                ? "seu override"
                                : resolved.source === "community"
                                  ? "comunidade"
                                  : base !== resolved.tier
                                    ? "deslocado"
                                    : ""}
                            </span>
                          </div>
                          {!isLoggedIn && (
                            <button
                              onClick={onLoginNeeded}
                              className="absolute inset-0 z-10 flex items-center justify-center gap-1.5 rounded-md bg-black/60 text-xs font-semibold text-slate-300 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100"
                            >
                              <Lock className="h-3.5 w-3.5" /> Faça login para votar
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Histórico semanal */}
      <div className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-amber-200">
          <History className="h-5 w-5" /> Histórico de evolução
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Os tiers comunitários são registrados semanalmente a cada voto registrado. O gráfico mostra a evolução de cada espírito.
        </p>
        <div className="mt-3">
          {historyQuery.isLoading && <Skeleton className="h-[220px] w-full" />}
          {!historyQuery.isLoading && (
            <TierHistoryChart
              data={(historyQuery.data ?? []).map(d => ({ week: d.week, classKey: d.spiritKey, tier: d.tier }))}
              scenarioLabel={TIERLIST_SCENARIOS.find(s => s.key === scenario)?.label ?? scenario}
              kind="spirit"
            />
          )}
        </div>
      </div>

      {/* Combos recomendados */}
      <div className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-amber-200">
          <Sparkles className="h-5 w-5" /> Combos recomendados
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sugestão de 4 slots para o cenário selecionado. Personalize conforme seus espíritos disponíveis.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(SPIRIT_COMBO_RECOMMENDATIONS[scenario]?.slots ?? []).map(slot => (
            <div key={slot.role} className="rounded-md border border-amber-900/40 bg-black/30 p-3">
              <p className="text-xs font-semibold text-amber-300">{slot.role}</p>
              <p className="mt-1 text-sm font-bold capitalize text-amber-100">{slot.spiritKey}</p>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{slot.note}</p>
            </div>
          ))}
          {(!SPIRIT_COMBO_RECOMMENDATIONS[scenario] || SPIRIT_COMBO_RECOMMENDATIONS[scenario].slots.length === 0) && (
            <p className="col-span-full text-sm italic text-slate-500">Sem combos recomendados para este cenário.</p>
          )}
        </div>
      </div>
    </div>
  );
}
