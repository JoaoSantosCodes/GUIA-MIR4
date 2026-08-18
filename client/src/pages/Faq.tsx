import { useMemo, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, ThumbsDown, ArrowRight, MessageCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { toast } from "sonner";
import type { TopTip } from "@/lib/faq";
import { enrichTipPaths } from "@/lib/faq";

export default function Faq() {
  const { user, isAuthenticated } = useAuth();
  const { data: pages, isLoading } = trpc.faq.topTips.useQuery({}, { retry: false });
  const voteMut = trpc.comments.vote.useMutation();
  const utils = trpc.useUtils();
  const [voted, setVoted] = useState<Set<number>>(new Set());

  const enriched = useMemo(
    () => pages?.map(p => ({ ...p, tips: enrichTipPaths(p.tips as never) })) ?? [],
    [pages],
  );
  const totalTips = useMemo(() => enriched.reduce((acc, p) => acc + p.tips.length, 0) ?? 0, [enriched]);

  const handleVote = async (id: number, kind: "up" | "down", delta: 1 | -1) => {
    if (!isAuthenticated) {
      toast.warning("Faça login para votar nas dicas");
      return;
    }
    if (voted.has(id)) return;
    setVoted(v => new Set(v).add(id));
    try {
      await voteMut.mutateAsync({ id, kind, delta });
      utils.faq.topTips.invalidate();
    } catch (e) {
      setVoted(v => { const n = new Set(v); n.delete(id); return n; });
    }
  };

  return (
    <div className="container pb-16">
      <div className="pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">Comunidade</p>
        <h1 className="gold-text text-4xl font-bold font-sans">FAQ Comunitária</h1>
        <p className="mt-2 max-w-2xl text-slate-300">
          As melhores dicas da comunidade, classificadas automaticamente pelos votos.{" "}
          {totalTips > 0 ? (
            <>São <span className="text-amber-300 font-semibold">{totalTips}</span> dicas destacadas distribuídas entre as páginas do guia.</>
          ) : (
            <>Ninguém ainda votou em dicas suficientes — vote nas seções do guia para ver as melhores aqui.</>
          )}
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-amber-700/40 bg-[oklch(0.17_0.02_80_/_0.35)] p-4 text-sm text-slate-300">
        <TrendingUp className="mb-2 h-5 w-5 text-amber-400" />
        Como funciona: cada página do guia tem sua área de comentários com votação. Dicas com mais{" "}
        <ThumbsUp className="inline h-3.5 w-3.5 text-amber-400" /> sobem no ranking e aparecem aqui, com um link direto para a seção original.
        Ajude a curadoria da comunidade votando nas dicas de cada página!
      </div>

      {isLoading && (
        <div className="mt-8 space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-40 bg-amber-900/40" />
              <Skeleton className="h-24 w-full bg-amber-950/40" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && (pages?.length ?? 0) === 0 && (
        <Card className="mt-8 border-amber-700/40 bg-[oklch(0.16_0.015_280)] p-10 text-center">
          <MessageCircle className="mx-auto h-10 w-10 text-amber-600" />
          <p className="mt-3 font-semibold text-slate-300">Ainda não há dicas destacadas</p>
          <p className="mt-1 text-sm text-slate-400">
            Vá para qualquer página do guia, deixe uma dica na área de comentários e vote nas melhores — quando uma dica atingir votos suficientes, ela aparecerá aqui.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button asChild variant="outline" className="border-amber-700/50 text-amber-200 hover:bg-amber-900/30">
              <Link href="/farm">Ver Locais de Farm</Link>
            </Button>
            <Button asChild className="bg-red-800 hover:bg-red-700 text-amber-100">
              <Link href="/subclasses">Ver Subclasses</Link>
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-8 space-y-8">
        {pages?.map(page => (
          <section key={page.pageKey}>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="gold-text text-xl font-bold font-sans">{page.sectionLabel}</h2>
              <span className="rounded-full bg-amber-900/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                {page.tips.length} dica{page.tips.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {enriched.find(p => p.pageKey === page.pageKey)?.tips.map(tip => (
                <Card key={tip.id} className="group border-amber-800/40 bg-[oklch(0.16_0.015_280)] p-4 transition-colors hover:border-amber-600/60">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-slate-200 leading-relaxed">{tip.content}</p>
                    <Link href={`/faq#${tip.id}`} className="shrink-0 text-[10px] font-mono text-slate-600 opacity-0 transition-opacity group-hover:opacity-100">#{tip.id}</Link>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "rounded-md border px-2 py-0.5 font-mono text-xs font-bold",
                        tip.score > 0 ? "border-amber-600/60 text-amber-300" : tip.score < 0 ? "border-red-700/60 text-red-300" : "border-slate-700 text-slate-400",
                      )}>
                        {tip.score > 0 ? "+" : ""}{tip.score}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <ThumbsUp className="h-3 w-3" />{tip.upvotes}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <ThumbsDown className="h-3 w-3" />{tip.downvotes}
                      </span>
                      {tip.userName && <span className="text-[11px] text-slate-500">· por {tip.userName}</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-slate-400 hover:text-amber-300 hover:bg-amber-900/30"
                        onClick={() => handleVote(tip.id, "up", 1)}
                        aria-label="Votar a favor"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-slate-400 hover:text-red-300 hover:bg-red-900/30"
                        onClick={() => handleVote(tip.id, "down", 1)}
                        aria-label="Votar contra"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <Link
                    href={tip.path}
                    className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-amber-500 hover:text-amber-300"
                    onClick={e => { e.preventDefault(); window.location.hash = ""; window.location.href = tip.path; }}
                  >
                    <ArrowRight className="h-3 w-3" /> Ver na página original
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
