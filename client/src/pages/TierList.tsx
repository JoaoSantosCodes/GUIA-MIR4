import { useState } from "react";
import { Link } from "wouter";
import { SECTION_IMAGES, TIER_NOTE, TIER_SCENARIOS, TIER_STYLES } from "@shared/guideData";
import type { SpiritTier } from "@shared/guideData";
import PageBanner from "@/components/guide/PageBanner";
import { cn } from "@/lib/utils";
import { Swords, Pickaxe, Flame } from "lucide-react";

const SCENARIO_ICONS: Record<string, React.ReactNode> = {
  pvp: <Swords className="h-4 w-4" />,
  mining: <Pickaxe className="h-4 w-4" />,
  boss: <Flame className="h-4 w-4" />,
};

const TIER_LETTER_STYLES: Record<SpiritTier, string> = {
  S: "bg-amber-500 text-black",
  A: "bg-violet-500 text-white",
  B: "bg-sky-500 text-white",
  C: "bg-slate-500 text-white",
};

export default function TierList() {
  const [scenario, setScenario] = useState(TIER_SCENARIOS[0].key);
  const data = TIER_SCENARIOS.find(s => s.key === scenario)!;

  return (
    <div>
      <PageBanner
        title="Tier List de Espíritos"
        subtitle="Rankings de espíritos por cenário — PvP, Mineração e Bosses — com as melhores combinações de 4 espíritos para cada atividade."
        image={SECTION_IMAGES.spirits}
      />
      <div className="container py-10">
        <p className="text-sm text-slate-400">{TIER_NOTE}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {TIER_SCENARIOS.map(s => (
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
              {SCENARIO_ICONS[s.key]} {s.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-400 leading-relaxed">{data.description}</p>

        {/* Tabela de tiers */}
        <div className="mt-6 space-y-4">
          {data.rows.map(row => {
            const style = TIER_STYLES[row.tier];
            return (
              <div key={row.tier} className="rounded-lg border border-amber-900/40 bg-[oklch(0.19_0.015_280)] p-4">
                <div className="flex flex-wrap gap-3">
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border text-2xl font-black",
                      style.border,
                      style.bg,
                      TIER_LETTER_STYLES[row.tier],
                    )}
                  >
                    {row.tier}
                  </div>
                  <div className="flex-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {row.spirits.map(s => (
                      <Link
                        key={s.key}
                        href={`/espiritos#${s.key}`}
                        className="rounded-md border border-slate-700/50 bg-black/30 p-3 hover:border-amber-600/50 transition-colors"
                      >
                        <p className="font-semibold text-amber-100">{s.name}</p>
                        <p className="mt-1 text-xs text-slate-400 leading-relaxed">{s.reason}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Combos recomendados */}
        <section className="mt-10">
          <h2 className="gold-text text-2xl font-bold">Combo recomendado de 4 espíritos</h2>
          {data.combos.map(combo => (
            <div key={combo.label} className="mt-4 rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
              <h3 className="font-semibold text-amber-300">{combo.label}</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {combo.spirits.map((s, i) => (
                  <Link
                    key={`${combo.label}-${i}`}
                    href={`/espiritos#${s.key}`}
                    className="flex items-center gap-2 rounded-md border border-amber-700/40 bg-black/40 px-3 py-2 hover:border-amber-500/60 transition-colors"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-200">{s.name}</span>
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{combo.note}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
