import { Link } from "wouter";
import { useMemo, useState } from "react";
import { Crown, Medal, Trophy, TrendingUp, Sparkles, ImageDown, Gem, ScrollText, BookOpenCheck } from "lucide-react";

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import PageBanner from "@/components/guide/PageBanner";
import CountdownTimer from "@/components/CountdownTimer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExportRankingCardDialog } from "@/components/ExportCardDialog";
import { evaluateChapterAchievements, TOTAL_CHAPTERS } from "@/lib/chapterAchievements";

const PODIUM_STYLES: Record<number, string> = {
  1: "from-amber-300/25 to-amber-600/10 border-amber-400/60",
  2: "from-slate-200/15 to-slate-400/10 border-slate-300/50",
  3: "from-orange-400/15 to-orange-700/10 border-orange-400/50",
};

const PODIUM_ICON: Record<number, React.ReactNode> = {
  1: <Trophy className="h-6 w-6 text-amber-400 drop-shadow" />,
  2: <Medal className="h-5 w-5 text-slate-300" />,
  3: <Medal className="h-5 w-5 text-orange-400" />,
};

const CHAPTERS_PLAYED_KEY = "mir4-chapters-played";

/** Lê os capítulos marcados pelo usuário logado no navegador (mesma chave da página Notícias). */
function readPlayedChapters(): number[] {
  try {
    const raw = window.localStorage.getItem(CHAPTERS_PLAYED_KEY);
    const arr: number[] = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter(n => typeof n === "number") : [];
  } catch {
    return [];
  }
}

export default function Leaderboard() {
  const auth = useAuth();
  const [mode, setMode] = useState<"gold" | "unified">("gold");
  const [veteransOnly, setVeteransOnly] = useState(false);
  // Status de veterano: mescla os capítulos do servidor (sincronizados entre dispositivos)
  // com os marcados no navegador deste dispositivo.
  const { data: serverChapters } = trpc.chapterProgress.list.useQuery(undefined, {
    enabled: auth.isAuthenticated,
    refetchOnWindowFocus: false,
  });
  const playedChapters = useMemo(() => {
    if (!auth.isAuthenticated) return [];
    const merged = new Set<number>();
    readPlayedChapters().forEach(n => merged.add(n));
    if (serverChapters) serverChapters.forEach(r => merged.add(Number(r.chapter)));
    return Array.from(merged).sort((a, b) => a - b);
  }, [auth.isAuthenticated, serverChapters]);
  const myVeteranStatus = useMemo(() => evaluateChapterAchievements(playedChapters).find(a => a.key === "capitulos-veterano"), [playedChapters]);
  const isVeteran = myVeteranStatus?.earned ?? false;

  const { data: goldEntries, isLoading: goldLoading } = trpc.community.goldLeaderboard.useQuery(undefined, {
    refetchInterval: 60000,
    enabled: mode === "gold",
  });
  const { data: unifiedEntries, isLoading: unifiedLoading } = trpc.community.unifiedLeaderboard.useQuery(undefined, {
    refetchInterval: 60000,
    enabled: mode === "unified",
  });

  const entries = mode === "gold" ? goldEntries : unifiedEntries;
  const isLoading = mode === "gold" ? goldLoading : unifiedLoading;
  // Filtragem de Veteranos: somente no placar pessoal (usuário logado marcado 21/21),
  // os capítulos marcados são dados do navegador — o placar global não armazena isso no servidor.
  const showVeterans = veteransOnly && auth.isAuthenticated && isVeteran;

  const podium = useMemo(() => entries?.slice(0, 3) ?? [], [entries]);
  const rest = useMemo(() => entries?.slice(3) ?? [], [entries]);

  const myEntry = useMemo(
    () => (auth.user?.id ? entries?.find(e => Number(e.userId) === Number(auth.user!.id)) : undefined),
    [entries, auth.user?.id],
  );
  const myPosition = useMemo(() => (myEntry && entries ? (entries as unknown[]).indexOf(myEntry) + 1 : 0), [myEntry, entries]);
  const myScore = useMemo(() => (myEntry ? Number((myEntry as { totalScore?: number; goldBadges?: number }).totalScore ?? (myEntry as { goldBadges?: number }).goldBadges) : 0), [myEntry]);

  return (
    <div className="min-h-screen pb-16">
        <PageBanner
        title="Placar da Comunidade"
        subtitle={
          mode === "gold"
            ? 'Os jogadores com mais medalhas "Dica de Ouro" — conquiste a sua ao votar nas melhores dicas!'
            : "Ranking unificado: Dicas de Ouro + medalhas do Codex somadas"
        }
        className="gold-text"
        actions={<CountdownTimer endDate="2026-09-01T00:00:00+08:00" label="Fusão de Servidores" />}
      />
      <div className="container max-w-4xl px-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="inline-flex overflow-hidden rounded-md border border-amber-700/50">
            <button
              type="button"
              onClick={() => setMode("gold")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold transition-colors",
                mode === "gold" ? "bg-amber-700/40 text-amber-200" : "bg-transparent text-slate-400 hover:text-amber-200",
              )}
            >
              Dicas de Ouro
            </button>
            <button
              type="button"
              onClick={() => setMode("unified")}
              className={cn(
                "border-l border-amber-700/50 px-3 py-1.5 text-xs font-semibold transition-colors",
                mode === "unified" ? "bg-amber-700/40 text-amber-200" : "bg-transparent text-slate-400 hover:text-amber-200",
              )}
            >
              Unificado
            </button>
          </div>
          <button
            type="button"
            onClick={() => setVeteransOnly(v => !v)}
            aria-pressed={veteransOnly}
            title="Mostrar apenas o placar de Veteranos (21/21 capítulos marcados)"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
              showVeterans
                ? "border-amber-400/60 bg-amber-500/20 text-amber-200"
                : "border-amber-700/50 text-slate-400 hover:text-amber-200",
            )}
          >
            <BookOpenCheck className="h-3.5 w-3.5" />
            Veterano
          </button>
        </div>
        {showVeterans && (
          <section className="mb-4 flex items-start gap-3 rounded-lg border border-amber-400/50 bg-gradient-to-r from-amber-400/15 via-amber-500/10 to-transparent p-4">
            <BookOpenCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <p className="text-sm text-amber-100/90">
              <strong className="text-amber-200">Modo Veterano de Sabuk:</strong> você marcou todos os{" "}
              <strong className="text-amber-200">{TOTAL_CHAPTERS}/{TOTAL_CHAPTERS} capítulos</strong> da linha do tempo e
              seu placar agora destaca a trilha completa do MIR4 — das medalhas de Dicas de Ouro às conquistas do Codex.
            </p>
          </section>
        )}
        {veteransOnly && auth.isAuthenticated && !isVeteran && (
          <section className="mb-4 flex items-start gap-3 rounded-lg border border-slate-500/40 bg-gradient-to-r from-slate-500/10 to-transparent p-4">
            <BookOpenCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <p className="text-sm text-muted-foreground">
              Você ainda não completou os <strong className="text-amber-300">{TOTAL_CHAPTERS} capítulos</strong> da linha do
              tempo. Marque todos como vivenciados na página{" "}
              <a href="/novidades" className="text-amber-300 underline-offset-2 hover:underline">Notícias</a> para liberar
              o placar de Veterano.
            </p>
          </section>
        )}
        <section className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent p-4">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-sm text-muted-foreground">
            Uma <strong className="text-amber-400">Dica de Ouro</strong> é conquistada cada vez que você vota a favor
            de uma dica que possui <strong className="text-amber-400">10 ou mais votos positivos</strong>. A medalha
            permanece no seu placar mesmo que a dica perca votos depois — ela conta como sua conquista eterna.
          </p>
        </section>

        <section className="mb-6 flex flex-wrap items-center justify-between gap-3">
          {auth.isAuthenticated ? (
            <ExportRankingCardDialog
              userName={auth.user?.name ?? "Aventureiro"}
              goldBadges={Number((myEntry as { goldBadges?: number })?.goldBadges) || 0}
              rarityBadges={Number((myEntry as { rarityBadges?: number })?.rarityBadges) || 0}
              totalScore={mode === "unified" ? Number(myScore) || 0 : undefined}
              position={myPosition ?? 0}
              total={entries?.length ?? 0}
              mode={mode}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Faça login para ver sua posição e exportar seu card.</p>
          )}
          {auth.user && myPosition === 0 && (
            <p className="text-xs text-muted-foreground">Vote em dicas de ouro para aparecer no placar.</p>
          )}
        </section>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : podium.length === 0 ? (
          <Card className="border-dashed py-16 text-center">
            <Crown className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h2 className="mb-2 text-xl font-semibold">Nenhuma medalha conquistada ainda</h2>
            <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
              Ainda não há votos em dicas premiadas. Explore as seções do guia, vote nas melhores dicas e seja o
              primeiro no placar!
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-amber-500 to-amber-700 px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <TrendingUp className="h-4 w-4" />
              Ver dicas da comunidade
            </Link>
          </Card>
        ) : (
          <>
            {/* Pódio */}
            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {podium.map((e, idx) => (
                <Card
                  key={e.userId}
                  className={cn(
                    "relative overflow-hidden border bg-gradient-to-b p-5 text-center transition-transform",
                    PODIUM_STYLES[idx + 1],
                  )}
                >
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-background/60">
                    {PODIUM_ICON[idx + 1]}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {idx === 0 ? "Ouro" : idx === 1 ? "Prata" : "Bronze"}
                  </div>
                  {showVeterans && (
                    <div className="mb-1 mt-1 inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                      <BookOpenCheck className="h-3 w-3" /> Veterano de Sabuk
                    </div>
                  )}
                  <div className="mb-1 mt-1 truncate font-semibold">{e.userName ?? `Jogador #${e.userId}`}</div>
                  {"totalScore" in e ? (
                    <>
                      <div className="flex items-center justify-center gap-1 text-amber-400">
                        <ScrollText className="h-4 w-4" />
                        <span className="text-2xl font-bold">{Number(e.totalScore)}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5 text-amber-400"><Crown className="h-3 w-3" />{Number(e.goldBadges)}</span>
                        <span className="flex items-center gap-0.5 text-purple-300"><Gem className="h-3 w-3" />{Number((e as { codexMedals?: number }).codexMedals)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-1 text-amber-400">
                      <Crown className="h-4 w-4" />
                      <span className="text-2xl font-bold">{Number(e.goldBadges)}</span>
                    </div>
                  )}
                  {Number((e as { rarityBadges?: number })?.rarityBadges ?? 0) > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-purple-400/40 bg-purple-500/10 px-2 py-0.5 text-xs text-purple-300">
                      <Gem className="h-3 w-3" />
                      {Number((e as { rarityBadges?: number }).rarityBadges)} conquista{Number((e as { rarityBadges?: number }).rarityBadges) === 1 ? "" : "s"} de raridade
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Restante */}
            <Card>
              <div className="border-b px-5 py-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Classificação completa
                </h3>
              </div>
              <ul>
                {rest.map((e, i) => (
                  <li key={e.userId} className="flex items-center gap-4 border-b border-border/50 px-5 py-3 last:border-0">
                    <span className="w-8 text-center text-sm font-bold text-muted-foreground">{i + 4}º</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
                      <Crown className="h-4 w-4 text-amber-400" />
                    </div>
                    {showVeterans && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-200">
                        <BookOpenCheck className="h-2.5 w-2.5" /> Veterano
                      </span>
                    )}
                    <span className="flex-1 truncate font-medium">{e.userName ?? `Jogador #${e.userId}`}</span>
                    {"totalScore" in e ? (
                      <>
                        <span className="flex items-center gap-1 text-sm font-semibold text-amber-400">
                          <ScrollText className="h-3.5 w-3.5" />
                          {Number(e.totalScore)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="text-amber-400"><Crown className="h-3 w-3" />{Number(e.goldBadges)}</span>
                          <span className="text-purple-300"><Gem className="h-3 w-3" />{Number((e as { codexMedals?: number }).codexMedals)}</span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-sm font-semibold text-amber-400">
                          <Crown className="h-3.5 w-3.5" />
                          {Number(e.goldBadges)}
                        </span>
                        <span className="flex items-center gap-1 text-sm font-semibold text-purple-300" title="Conquistas de raridade do Codex">
                          <Gem className="h-3.5 w-3.5" />
                          {Number((e as { rarityBadges?: number }).rarityBadges)}
                        </span>
                      </>
                    )}
                    {auth.user?.id && myEntry?.userId === e.userId && myPosition > 0 && (
                      <ExportRankingCardDialog
                        userName={e.userName ?? "Aventureiro"}
                        goldBadges={Number((e as { goldBadges?: number }).goldBadges)}
                        rarityBadges={Number((e as { rarityBadges?: number }).rarityBadges)}
                        totalScore={mode === "unified" ? Number((e as { totalScore?: number }).totalScore) || 0 : undefined}
                        position={myPosition}
                        total={entries?.length ?? 0}
                        mode={mode}
                        trigger={
                          <span className="ml-1 inline-flex cursor-pointer items-center gap-1 rounded-md border border-amber-600/60 bg-amber-950/50 px-2 py-1 text-[11px] font-medium text-amber-200 transition-colors hover:bg-amber-900/50">
                            <ImageDown className="h-3 w-3" /> Exportar
                          </span>
                        }
                      />
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
