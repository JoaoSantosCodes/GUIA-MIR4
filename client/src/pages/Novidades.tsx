import { useMemo, useState } from "react";
import PageBanner from "@/components/guide/PageBanner";
import { CHAPTER21_NEWS, CHAPTER22_COMING_SOON, MIR4_CHAPTERS, type Chapter21NewsItem } from "@shared/newsData";
import { ChevronLeft, ChevronRight, Newspaper, Crown, Sparkles, Gift, Gem, Wrench, Coins, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [timelineIndex, setTimelineIndex] = useState(MIR4_CHAPTERS.length - 1);
  const filtered = useMemo(
    () => (newsFilter === "Todos" ? CHAPTER21_NEWS : CHAPTER21_NEWS.filter(n => n.category === newsFilter)),
    [newsFilter],
  );

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
            <div className="flex flex-wrap gap-2">
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
          <p className="text-sm text-slate-400 mb-6">
            O cronograma oficial de atualizações (Chronicle) desde o lançamento global em agosto de 2021 até o Capítulo 21, Invocador. Use as setas ou clique em um ano para navegar.
          </p>

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
                  title={`Capítulo ${c.number}: ${c.title}`}
                >
                  {c.number}
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
