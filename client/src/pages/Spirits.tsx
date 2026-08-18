import { useMemo, useState } from "react";
import { RARITY_ORDER, RARITY_STYLES, SPIRITS, SECTION_IMAGES, type Rarity } from "@shared/guideData";
import PageBanner from "@/components/guide/PageBanner";
import FavButton from "@/components/guide/FavButton";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function Spirits() {
  const [filter, setFilter] = useState<Rarity | "Todas">("Todas");
  const { isAuthenticated } = useAuth();
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated });

  const favIds = useMemo(() => new Set(favorites?.map(f => f.itemId) ?? []), [favorites]);
  const spirits = useMemo(
    () => SPIRITS.filter(s => filter === "Todas" || s.rarity === filter),
    [filter],
  );

  return (
    <div>
      <PageBanner
        title="Guia de Espíritos"
        subtitle="Os espíritos (pets) de MIR4 concedem atributos passivos e habilidades ativas. Monte seu set de até 4 espíritos conforme seu estilo de jogo — farm, PvP ou sobrevivência. Organizados por raridade: UC, Raro, Épico, Lendário e Mítico."
        image={SECTION_IMAGES.spirits}
      />
      <div className="container py-10">
        <div className="flex flex-wrap gap-2">
          {(["Todas", ...RARITY_ORDER] as const).map(r => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={cn(
                "rounded-md border px-4 py-1.5 text-sm font-medium transition-all active:scale-[0.97]",
                filter === r
                  ? "border-amber-500 bg-amber-900/40 text-amber-300"
                  : "border-amber-800/40 bg-black/30 text-slate-400 hover:text-amber-200 hover:border-amber-700/50",
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-400">
          {spirits.length} espírito{spirits.length !== 1 ? "s" : ""} exibido{spirits.length !== 1 ? "s" : ""}.
          Clique na estrela para salvar como favorito (exige login).
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {spirits.map(s => {
            const style = RARITY_STYLES[s.rarity];
            const isFav = favIds.has(`spirit:${s.key}`);
            return (
              <article
                key={s.key}
                id={s.key}
                className={cn(
                  "rounded-lg border bg-[oklch(0.19_0.015_280)] scroll-mt-24",
                  style.border,
                )}
              >
                <div className="flex items-start justify-between gap-3 border-b border-amber-900/30 px-5 py-3">
                  <div>
                    <h3 className="font-bold text-amber-100 text-lg">{s.name}</h3>
                    <p className="text-xs text-slate-500">{s.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold", style.border, style.color, style.bg)}>
                      {style.label}
                    </span>
                    <FavButton itemId={`spirit:${s.key}`} itemType="spirit" isFavorite={isFav} />
                  </div>
                </div>
                <div className="px-5 py-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2">Atributos</p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.effects.map(e => (
                        <span key={e} className="rounded border border-slate-700/50 bg-black/30 px-2 py-0.5 text-xs text-slate-300">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold text-amber-300">Habilidade: </span>
                    {s.passive === "—" ? "Sem habilidade passiva." : s.passive}
                  </p>
                  <p className="text-sm text-slate-400">
                    <span className="font-semibold text-emerald-400">Dica: </span>
                    {s.tip}
                  </p>
                  <p className="text-sm text-slate-400">
                    <span className="font-semibold text-red-400">Como obter: </span>
                    {s.obtain}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
