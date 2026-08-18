import { useMemo, useState } from "react";
import { RARITY_ORDER, RARITY_STYLES, SPIRITS, SECTION_IMAGES, type Rarity } from "@shared/guideData";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import PageBanner from "@/components/guide/PageBanner";
import FavButton from "@/components/guide/FavButton";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";

const ATTR_FACETS = [
  { id: "exp", label: "EXP de Caça", match: (e: string) => /hunting exp/i.test(e) },
  { id: "drop", label: "Drop / Lucky Drop", match: (e: string) => /drop/i.test(e) },
  { id: "mining", label: "Coleta / Mineração", match: (e: string) => /coleta|minera|energy/i.test(e) },
  { id: "pvp", label: "PvP", match: (e: string) => /pvp/i.test(e) },
  { id: "boss", label: "Boss ATK / DMG Reduction", match: (e: string) => /boss/i.test(e) },
  { id: "crit", label: "CRIT", match: (e: string) => /crit/i.test(e) },
  { id: "heal", label: "Cura / Sustain", match: (e: string) => /cura|recupera|hability|ressuscita|poç/i.test(e) },
  { id: "cc", label: "Controle (Stun/Silence/Bash)", match: (e: string) => /stun|silence|knockdown|bash/i.test(e) },
];

type SortKey = "rarity" | "name";

export default function Spirits() {
  const [filter, setFilter] = useState<Rarity | "Todas">("Todas");
  const [attrFilters, setAttrFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("rarity");
  const { isAuthenticated } = useAuth();
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated });

  const favIds = useMemo(() => new Set(favorites?.map(f => f.itemId) ?? []), [favorites]);
  const rarityIdx = (r: Rarity) => RARITY_ORDER.indexOf(r);

  const spirits = useMemo(() => {
    let list = SPIRITS.filter(s => filter === "Todas" || s.rarity === filter);
    if (attrFilters.length > 0) {
      const matchers = attrFilters.map(a => ATTR_FACETS.find(f => f.id === a)!.match);
      list = list.filter(s => matchers.every(m => s.effects.some(e => m(e))));
    }
    if (sortBy === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    } else {
      list = [...list].sort((a, b) => rarityIdx(a.rarity) - rarityIdx(b.rarity));
    }
    return list;
  }, [filter, attrFilters, sortBy]);

  const toggleAttr = (id: string) =>
    setAttrFilters(v => (v.includes(id) ? v.filter(x => x !== id) : [...v, id]));

  return (
    <div>
      <PageBanner
        title="Guia de Espíritos"
        subtitle="Os espíritos (pets) de MIR4 concedem atributos passivos e habilidades ativas. Monte seu set de até 4 espíritos conforme seu estilo de jogo — farm, PvP ou sobrevivência. Organizados por raridade: UC, Raro, Épico, Lendário e Mítico."
        image={SECTION_IMAGES.spirits}
      />
      <div className="container py-10">
        <div className="flex flex-wrap items-center gap-2">
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

        <div className="mt-3 flex flex-wrap items-center gap-4 rounded-lg border border-amber-900/40 bg-black/25 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 shrink-0">
            <SlidersHorizontal className="h-4 w-4" /> Atributos
          </div>
          <div className="flex flex-wrap gap-3">
            {ATTR_FACETS.map(a => (
              <label
                key={a.id}
                className={cn(
                  "flex items-center gap-1.5 text-xs cursor-pointer select-none",
                  attrFilters.includes(a.id) ? "text-amber-300" : "text-slate-400 hover:text-amber-200",
                )}
              >
                <Checkbox
                  checked={attrFilters.includes(a.id)}
                  onCheckedChange={() => toggleAttr(a.id)}
                  className="border-amber-700/60 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                />
                {a.label}
              </label>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-amber-500">Ordenar</span>
            <Select value={sortBy} onValueChange={v => setSortBy(v as SortKey)}>
              <SelectTrigger className="w-40 h-8 bg-[oklch(0.2_0.02_280)] border-amber-800/50 text-amber-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[oklch(0.18_0.02_280)] border-amber-800/50">
                <SelectItem value="rarity">Raridade</SelectItem>
                <SelectItem value="name">Nome (A–Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
