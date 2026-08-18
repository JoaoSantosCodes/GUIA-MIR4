import { useMemo, useState } from "react";
import { RAIDS, RAID_MECHANICS, type RaidDifficulty } from "@shared/guideData";
import PageBanner from "@/components/guide/PageBanner";
import CommentsSection from "@/components/guide/CommentsSection";
import FavButton from "@/components/guide/FavButton";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Shield, Swords, Target, Skull, ChevronDown, ChevronUp, Crown, Lightbulb } from "lucide-react";

const DIFFICULTY_STYLES: Record<RaidDifficulty, { color: string; border: string; bg: string }> = {
  "Iniciante": { color: "text-emerald-400", border: "border-emerald-600/50", bg: "bg-emerald-950/40" },
  "Intermediário": { color: "text-amber-400", border: "border-amber-600/50", bg: "bg-amber-950/30" },
  "Avançado": { color: "text-orange-400", border: "border-orange-600/50", bg: "bg-orange-950/30" },
  "Endgame": { color: "text-red-400", border: "border-red-600/50", bg: "bg-red-950/30" },
};

const DROP_RARITY_STYLES: Record<string, string> = {
  "Comum": "text-slate-400",
  "Incomum": "text-slate-200",
  "Raro": "text-emerald-400",
  "Épico": "text-violet-400",
  "Lendário": "text-amber-400",
};

const DIFFICULTIES: RaidDifficulty[] = ["Iniciante", "Intermediário", "Avançado", "Endgame"];

export default function Raids() {
  const [filter, setFilter] = useState<RaidDifficulty | "Todas">("Todas");
  const [expanded, setExpanded] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated });

  const favIds = useMemo(() => new Set(favorites?.map(f => f.itemId) ?? []), [favorites]);
  const raids = useMemo(
    () => RAIDS.filter(r => filter === "Todas" || r.difficulty === filter),
    [filter],
  );

  return (
    <div>
      <PageBanner
        title="Raids e Bosses"
        subtitle="Todas as raids do MIR4: Boss Raids, Hall of Greed, Demon's Ruin, Magic Square e World Bosses. Estratégias de combate, composição de party e tabelas de drops por boss."
        image={undefined}
        className="!py-10"
      />
      <div className="container py-10">
        <div className="rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5 mb-8">
          <h3 className="gold-text text-lg font-bold mb-3 flex items-center gap-2"><Swords className="h-5 w-5 text-amber-500" /> {RAID_MECHANICS.title}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RAID_MECHANICS.entries.map(e => (
              <div key={e.label} className="rounded-md border border-amber-900/40 bg-black/25 px-3 py-2.5">
                <p className="text-xs font-semibold text-amber-300 mb-1">{e.label}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(["Todas", ...DIFFICULTIES] as const).map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={cn(
                "rounded-md border px-4 py-1.5 text-sm font-medium transition-all active:scale-[0.97]",
                filter === d
                  ? "border-amber-500 bg-amber-900/40 text-amber-300"
                  : "border-amber-800/40 bg-black/30 text-slate-400 hover:text-amber-200 hover:border-amber-700/50",
              )}
            >
              {d}
            </button>
          ))}
        </div>

        <p className="text-sm text-slate-400 mb-4">
          {raids.length} raid{raids.length !== 1 ? "s" : ""} exibida{raids.length !== 1 ? "s" : ""}.
          Clique para expandir estratégia e drops; use a estrela para favoritar.
        </p>

        <div className="space-y-4">
          {raids.map(r => {
            const style = DIFFICULTY_STYLES[r.difficulty];
            const isOpen = expanded === r.key;
            const isFav = favIds.has(`boss:${r.key}`);
            return (
              <article key={r.key} id={r.key} className="scroll-mt-24 rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] overflow-hidden">
                <button
                  className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-amber-950/20 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : r.key)}
                >
                  <Skull className="h-5 w-5 text-red-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-amber-100 text-lg">{r.name}</h3>
                      <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", style.border, style.color, style.bg)}>
                        {r.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {r.type} · {r.location} · <span className="text-amber-300">{r.power}</span>
                    </p>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-amber-500 shrink-0" /> : <ChevronDown className="h-4 w-4 text-amber-500 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="border-t border-amber-900/30 px-5 py-4 space-y-4">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2"><Target className="h-3.5 w-3.5" /> Estratégia de Combate</p>
                      <ul className="space-y-1.5">
                        {r.strategy.map((s, i) => (
                          <li key={i} className="text-sm text-slate-300 flex gap-2">
                            <span className="text-amber-600 font-semibold shrink-0">{i + 1}.</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2"><Crown className="h-3.5 w-3.5" /> Tabela de Drops</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-amber-900/40 text-left">
                              <th className="py-1.5 pr-3 text-xs font-semibold text-amber-400">Item</th>
                              <th className="py-1.5 pr-3 text-xs font-semibold text-amber-400">Raridade</th>
                              <th className="py-1.5 text-xs font-semibold text-amber-400">Chance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {r.drops.map(d => (
                              <tr key={d.item} className="border-b border-amber-900/20 last:border-0">
                                <td className="py-1.5 pr-3 text-slate-200">{d.item}</td>
                                <td className={cn("py-1.5 pr-3 text-xs font-medium", DROP_RARITY_STYLES[d.rarity])}>{d.rarity}</td>
                                <td className="py-1.5 text-xs text-slate-400">{d.chance}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {r.tips.map((t, i) => (
                        <p key={i} className="text-xs text-slate-400 bg-black/25 border border-emerald-900/30 rounded-md px-3 py-2">
                          <span className="font-semibold text-emerald-400">Dica {i + 1}: </span>{t}
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center justify-end pt-2 border-t border-amber-900/20">
                      <span className="text-xs text-slate-500 mr-2">Salvar como favorito:</span>
                      <FavButton itemId={`boss:${r.key}`} itemType="boss" isFavorite={isFav} />
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-red-900/40 bg-red-950/15 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-300">
            <Shield className="h-4 w-4 text-red-400 shrink-0" />
            <span>
              <strong className="text-red-300">Nota:</strong> Boss Raids e Magic Square bosses têm PvP ativo.
              Leve poções, tenha Vigor disponível e entre em grupo sempre que possível.
            </span>
          </p>
        </div>
      <section>
  <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
    <Lightbulb className="h-6 w-6" />
    Dicas da comunidade — Raids
  </h2>
  <CommentsSection pageKey="raids" farmKey="geral" title="Raids" />
</section>
</div>
    </div>
  );
}
