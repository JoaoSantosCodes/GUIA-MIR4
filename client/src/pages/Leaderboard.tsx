import { useMemo } from "react";
import { Link } from "wouter";
import { Crown, Medal, Trophy, TrendingUp, Sparkles, ImageDown } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import PageBanner from "@/components/guide/PageBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExportRankingCardDialog } from "@/components/ExportCardDialog";

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

export default function Leaderboard() {
  const { data: entries, isLoading } = trpc.community.goldLeaderboard.useQuery(undefined, { refetchInterval: 60000 });
  const auth = useAuth();

  const podium = useMemo(() => entries?.slice(0, 3) ?? [], [entries]);
  const rest = useMemo(() => entries?.slice(3) ?? [], [entries]);

  const myEntry = useMemo(
    () => (auth.user?.id ? entries?.find(e => Number(e.userId) === Number(auth.user!.id)) : undefined),
    [entries, auth.user?.id],
  );
  const myPosition = useMemo(() => (myEntry && entries ? entries.indexOf(myEntry) + 1 : 0), [myEntry, entries]);
  const myBadges = useMemo(() => myEntry?.goldBadges, [myEntry]);

  return (
    <div className="min-h-screen pb-16">
      <PageBanner
        title="Placar da Comunidade"
        subtitle='Os jogadores com mais medalhas "Dica de Ouro" — conquiste a sua ao votar nas melhores dicas!'
        className="gold-text"
      />
      <div className="container max-w-4xl px-4">
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
              goldBadges={Number(myBadges) || 0}
              position={myPosition ?? 0}
              total={entries?.length ?? 0}
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
                  <div className="mb-1 mt-1 truncate font-semibold">{e.userName ?? `Jogador #${e.userId}`}</div>
                  <div className="flex items-center justify-center gap-1 text-amber-400">
                    <Crown className="h-4 w-4" />
                    <span className="text-2xl font-bold">{Number(e.goldBadges)}</span>
                  </div>
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
                    <span className="flex-1 truncate font-medium">{e.userName ?? `Jogador #${e.userId}`}</span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-amber-400">
                      <Crown className="h-3.5 w-3.5" />
                      {Number(e.goldBadges)}
                    </span>
                    {auth.user?.id && myEntry?.userId === e.userId && myPosition > 0 && (
                      <ExportRankingCardDialog
                        userName={e.userName ?? "Aventureiro"}
                        goldBadges={Number(e.goldBadges)}
                        position={myPosition}
                        total={entries?.length ?? 0}
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
