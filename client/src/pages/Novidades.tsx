import { useMemo, useState } from "react";
import PageBanner from "@/components/guide/PageBanner";
import { CHAPTER21_NEWS, CHAPTER22_COMING_SOON, MIR4_CHAPTERS, type Chapter21NewsItem } from "@shared/newsData";
import { ChevronLeft, ChevronRight, Newspaper, Crown, Sparkles, Gift, Gem, Wrench, Coins, Calendar, ExternalLink, CheckCircle2, Circle, Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import CountdownTimer from "@/components/CountdownTimer";
import { toast } from "sonner";
import { exportTimelineProgressCard } from "@/lib/timelineExport";

const CHAPTERS_PLAYED_KEY = "mir4-chapters-played";

function readPlayed(): Set<number> {
  try {
    const raw = localStorage.getItem(CHAPTERS_PLAYED_KEY);
    const arr: number[] = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr.filter(n => typeof n === "number") : []);
  } catch {
    return new Set();
  }
}

const CATEGORY_STYLES: Record<Chapter21NewsItem["category"], { border: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
  Classe: { border: "border-violet-700/50", text: "text-violet-300", icon: Sparkles },
  Servidores: { border: "border-sky-700/50", text: "text-sky-300", icon: Crown },
  Sistemas: { border: "border-emerald-700/50", text: "text-emerald-300", icon: Wrench },
  Itens: { border: "border-amber-700/50", text: "text-amber-300", icon: Gift },
};

const NEWS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Classe: Sparkles,
  Servidores: Crown,
  Sistemas: Wrench,
  Itens: Gift,
};

const CATEGORY_ICONS = { Classe: Sparkles, Servidores: Crown, Sistemas: Wrench, Itens: Gift };

/**
 * Página de Notícias: novidades oficiais do Capítulo 21 e do 5º aniversário,
 * mais a linha do tempo completa dos 21 capítulos do MIR4.
 */
export default function Novidades() {
  const [newsFilter, setNewsFilter] = useState<Chapter21NewsItem["category"] | "Todos">("Todos");
  type NewsStatusFilter = "Todos" | "Ativos" | "Encerrados";
  const [newsStatus, setNewsStatus] = useState<NewsStatusFilter>("Todos");
  const [timelineIndex, setTimelineIndex] = useState(MIR4_CHAPTERS.length - 1);
  const [played, setPlayed] = useState<Set<number>>(readPlayed);
  const [, rerender] = useState(0);
  const toggleChapter = (number: number) => {
    setPlayed(prev => {
      const next = new Set(prev);
      if (next.has(number)) next.delete(number);
      else next.add(number);
      localStorage.setItem(CHAPTERS_PLAYED_KEY, JSON.stringify(Array.from(next).sort((a, b) => a - b)));
      rerender(n => n + 1);
      return next;
    });
  };
  const openTimelineCard = async () => {
    const done = Array.from(played).sort((a, b) => a - b);
    let userName = "Jogador";
    try {
      const raw = localStorage.getItem("mir4-user-name");
      const parsed = raw ? JSON.parse(raw) : null;
      userName = typeof parsed === "string" ? parsed : "Jogador";
    } catch {
      userName = "Jogador";
    }
    const canvas = document.createElement("canvas");
    try {
      await exportTimelineProgressCard({ played: done, userName, drawTo: canvas });
    } catch {
      toast.error("Não foi possível gerar o card.");
      return;
    }
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
    if (!blob) return;
    const dataUrl = canvas.toDataURL("image/png");
    try {
      if (typeof navigator.canShare === "function" && navigator.canShare({ files: [] })) {
        const file = new File([blob], "meus-capitulos-mir4.png", { type: "image/png" });
        await navigator.share({ files: [file], title: "Meus Capítulos do MIR4", text: `${done.length} de ${MIR4_CHAPTERS.length} capítulos vividos no MIR4!` });
        return;
      }
    } catch (e) {
      if ((e as DOMException)?.name !== "AbortError") {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "meus-capitulos-mir4.png";
        link.click();
      }
      return;
    }
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "meus-capitulos-mir4.png";
    link.click();
  };
  const filtered = useMemo(() => {
    let list = newsFilter === "Todos" ? CHAPTER21_NEWS : CHAPTER21_NEWS.filter(n => n.category === newsFilter);
    if (newsStatus === "Ativos") {
      list = list.filter(n => !n.endDate || Date.now() < new Date(n.endDate).getTime());
    } else if (newsStatus === "Encerrados") {
      list = list.filter(n => !!n.endDate && Date.now() >= new Date(n.endDate).getTime());
    }
    return list;
  }, [newsFilter, newsStatus]);

  return (
    <div>
      <PageBanner
        title="Notícias — Capítulo 21 & 5º Aniversário"
        subtitle="Tudo o que chegou no MIR4 em agosto de 2026: a nova classe Invocador, a Fusão de Servidores, o servidor Mundo Impulsionador e os eventos comemorativos do 5º aniversário — com fonte nas notas de patch oficiais da Wemade."
        image={undefined}
        className="!py-10"
      />

      <div className="container py-10 space-y-14">
        {/* ===== Novidades do Capítulo 21 ===== */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="gold-text text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Newspaper className="h-6 w-6 text-red-500" /> Novidades do Capítulo 21
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {(["Todos", "Classe", "Servidores", "Sistemas", "Itens"] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setNewsFilter(c)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 active:scale-[0.97]",
                    newsFilter === c
                      ? "border-amber-500 bg-amber-500/15 text-amber-300"
                      : "border-slate-700 text-slate-400 hover:border-amber-800/60 hover:text-amber-300",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-slate-700 px-1.5 py-0.5">
              <Calendar className="ml-1 h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              {(["Todos", "Ativos", "Encerrados"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setNewsStatus(s)}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all duration-200 active:scale-[0.97]",
                    newsStatus === s
                      ? s === "Ativos" ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/60"
                        : s === "Encerrados" ? "bg-red-900/40 text-red-300 ring-1 ring-red-500/50"
                        : "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/60"
                      : "text-slate-500 hover:text-amber-300",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((n, i) => {
              const style = CATEGORY_STYLES[n.category];
              const Icon = NEWS_ICONS[n.category];
              return (
                <article
                  key={n.key}
                  style={{ animationDelay: `${i * 45}ms` }}
                  className={cn(
                    "animate-in fade-in slide-in-from-bottom-2 border rounded-lg bg-[oklch(0.19_0.015_280)] p-5 transition-colors hover:border-amber-700/60",
                    style.border,
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn("mt-0.5 rounded-full border bg-black/40 p-1.5", style.border)}>
                      <Icon className={cn("h-4 w-4", style.text)} />
                    </span>
                    <div>
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider", style.text)}>{n.category}</p>
                      <h3 className="font-bold text-amber-200 mt-1">{n.title}</h3>
                      <p className="text-sm text-slate-300 mt-1 leading-relaxed">{n.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {n.endDate && <CountdownTimer endDate={n.endDate} />}
                        <a
                          href={n.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-amber-700/50 bg-amber-950/25 px-2.5 py-1 text-[10px] font-semibold text-amber-300 transition-colors hover:border-amber-500 hover:bg-amber-900/30 active:scale-[0.97]"
                        >
                          <ExternalLink className="h-3 w-3" /> Ver nota oficial
                        </a>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed border-t border-slate-800/60 pt-2">{n.detail}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-8">Nenhuma novidade nesta categoria.</p>
          )}
        </section>

        {/* ===== Linha do tempo dos capítulos ===== */}
        <section>
          <h2 className="gold-text text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-amber-500" /> Linha do Tempo — Os 21 Capítulos do MIR4
          </h2>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400 max-w-3xl">
              O cronograma oficial de atualizações (Chronicle) desde o lançamento global em agosto de 2021 até o Capítulo 21, Invocador. Marque os capítulos que você já vivenciou — o progresso fica salvo neste navegador e pode virar um card compartilhável.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-amber-300">
                <CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-emerald-400" />
                {played.size}/{MIR4_CHAPTERS.length} capítulos
              </span>
              <button
                onClick={openTimelineCard}
                disabled={played.size === 0}
                className="inline-flex items-center gap-1.5 rounded-md border border-amber-700/50 bg-amber-950/25 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-all hover:border-amber-500 hover:bg-amber-900/30 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Share2 className="h-3.5 w-3.5" /> Exportar card
              </button>
            </div>
          </div>

          {/* Navegação por ano */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["2021", "2022", "2023", "2024", "2025", "2026"].map(y => (
              <button
                key={y}
                onClick={() => {
                  const idx = MIR4_CHAPTERS.findIndex(c => c.year === y);
                  if (idx >= 0) setTimelineIndex(idx);
                }}
                className="rounded-md border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-400 hover:border-amber-700/60 hover:text-amber-300 transition-colors active:scale-[0.97]"
              >
                {y}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] overflow-hidden">
            {/* Trilha visual */}
            <div className="flex items-center gap-1 overflow-x-auto px-4 py-3 bg-black/30 scrollbar-thin">
              {MIR4_CHAPTERS.map((c, i) => (
                <button
                  key={c.number}
                  onClick={() => setTimelineIndex(i)}
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-all duration-200 active:scale-[0.95]",
                    i === timelineIndex
                      ? "border-amber-500 bg-amber-500/20 text-amber-200 scale-105"
                      : c.number === 21
                        ? "border-violet-500/60 text-violet-300 hover:bg-violet-500/10"
                        : "border-slate-700 text-slate-400 hover:border-amber-800/60 hover:text-amber-300",
                  )}
                  title={played.has(c.number) ? `Capítulo ${c.number}: ${c.title} (vivenciado)` : `Capítulo ${c.number}: ${c.title}`}
                >
                  {c.number}{played.has(c.number) && <CheckCircle2 className="ml-0.5 inline h-2.5 w-2.5 text-emerald-400" />}
                </button>
              ))}
            </div>

            {/* Card do capítulo selecionado */}
            {(() => {
              const c = MIR4_CHAPTERS[timelineIndex];
              const Icon = CATEGORY_ICONS[c.number === 21 ? "Classe" : "Sistemas"];
              return (
                <div key={c.number} className="animate-in fade-in slide-in-from-bottom-1 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-600/50 bg-black/40 text-lg font-black text-amber-400">
                        {c.number}
                      </span>
                      <div>
                        <h3 className="gold-text text-xl font-bold">Capítulo {c.number} — {c.title}</h3>
                        <p className="text-xs text-slate-400">{c.date}</p>
                      </div>
                    </div>
                      <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleChapter(c.number)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-all active:scale-[0.97]",
                          played.has(c.number)
                            ? "border-emerald-600 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/30"
                            : "border-slate-700 text-slate-300 hover:border-emerald-700/60 hover:text-emerald-300",
                        )}
                      >
                        {played.has(c.number) ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" /> Vivenciado
                          </>
                        ) : (
                          <>
                            <Circle className="h-4 w-4" /> Marcar como vivenciado
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setTimelineIndex(Math.max(0, timelineIndex - 1))}
                        disabled={timelineIndex === 0}
                        className="rounded-md border border-slate-700 p-1.5 text-slate-400 transition-colors hover:border-amber-700/60 hover:text-amber-300 disabled:opacity-40 active:scale-[0.95]"
                        aria-label="Capítulo anterior"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setTimelineIndex(Math.min(MIR4_CHAPTERS.length - 1, timelineIndex + 1))}
                        disabled={timelineIndex === MIR4_CHAPTERS.length - 1}
                        className="rounded-md border border-slate-700 p-1.5 text-slate-400 transition-colors hover:border-amber-700/60 hover:text-amber-300 disabled:opacity-40 active:scale-[0.95]"
                        aria-label="Próximo capítulo"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {c.highlights.map(h => (
                      <li key={h} className="flex items-start gap-2 rounded-md border border-slate-800/70 bg-black/25 px-3 py-2 text-xs text-slate-300">
                        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

            {/* Rodapé da timeline */}
            <div className="border-t border-amber-900/30 bg-black/30 px-6 py-3 text-center text-xs text-slate-500">
              <Gem className="mr-1 inline h-3.5 w-3.5 text-amber-600" />
              {CHAPTER22_COMING_SOON} — acompanhe as notas de patch oficiais em mir4global.com
            </div>
          </div>
        </section>

        {/* ===== Eventos do 5º aniversário (chamada final) ===== */}
        <section className="rounded-lg border border-amber-700/50 bg-gradient-to-br from-red-950/40 via-[oklch(0.19_0.015_280)] to-black/60 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <h2 className="gold-text text-xl font-bold">Destaques do 5º Aniversário (agosto 2026)</h2>
          </div>
          <div className="grid gap-3 text-xs sm:grid-cols-2">
            {[
              "Presença de 14 e 7 dias com recompensas de participação",
              "Bênção do Dragão Divino e Loja de Moeda de Agradecimento",
              "Invocação + Invocação do 5º Aniversário com espíritos especiais",
              "A Grande Fortuna de Osher e Presente Surpresa de Mir",
              "Loja do Goblin de Ouro com Bolo de Agradecimento (até 14/09)",
              "Eventos de comunidade: Tomo Secreto do Invocador e Festa de Aniversário",
            ].map(e => (
              <p key={e} className="flex items-start gap-2 text-slate-300">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span>{e}</span>
              </p>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-slate-500">
            Fonte: notas de patch e avisos oficiais de 14/08/2026 e 18/08/2026 (mir4global.com). Datas e vigências podem mudar conforme novos avisos da Wemade.
          </p>
        </section>
      </div>
    </div>
  );
}
