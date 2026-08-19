import { Fragment, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Minus, Trophy, ImageDown } from "lucide-react";
import {
  SPIRIT_ATTRIBUTES,
  SPIRIT_RADAR_LABELS,
  SPIRIT_TIER_LIST_KEYS,
  SPIRIT_TIER_NAMES,
  SPIRITS,
  RARITY_STYLES,
} from "@shared/guideData";
import GenericRadarChart, { type GenericRadarSeries } from "@/components/GenericRadarChart";
import SpiritCompareCardDialog from "@/components/SpiritCompareCardDialog";

const COMPARE_KEYS = SPIRIT_TIER_LIST_KEYS as string[];

export default function SpiritCompareDialog() {
  const [open, setOpen] = useState(false);
  const [keyA, setKeyA] = useState<string>(COMPARE_KEYS[0]);
  const [keyB, setKeyB] = useState<string>(COMPARE_KEYS[1] ?? COMPARE_KEYS[0]);
  const [cardOpen, setCardOpen] = useState(false);

  const attrsA = SPIRIT_ATTRIBUTES[keyA] ?? null;
  const attrsB = SPIRIT_ATTRIBUTES[keyB] ?? null;
  const names = useMemo(() => {
    const find = (k: string): string => SPIRIT_TIER_NAMES[k] ?? SPIRITS.find(s => s.key === k)?.name ?? k;
    return { nameA: find(keyA), nameB: find(keyB) };
  }, [keyA, keyB]);

  if (!attrsA || !attrsB) return null;

  const valuesA = Object.values(attrsA) as number[];
  const valuesB = Object.values(attrsB) as number[];
  const totalA = valuesA.reduce((a, b) => a + b, 0);
  const totalB = valuesB.reduce((a, b) => a + b, 0);
  const winner = totalA > totalB ? "a" : totalB > totalA ? "b" : "draw";
  const winnerLabel = winner === "draw" ? "Equilibrados" : winner === "a" ? `${names.nameA} leva a vantagem` : `${names.nameB} leva a vantagem`;
  const winnerColor = winner === "draw" ? "text-slate-300" : winner === "a" ? "text-amber-400" : "text-red-400";

  const series: GenericRadarSeries[] = [
    { key: keyA, name: names.nameA, values: valuesA },
    { key: keyB, name: names.nameB, values: valuesB },
  ];

  const rarityOf = (k: string) => SPIRITS.find(s => s.key === k)?.rarity ?? null;
  const rarityA = rarityOf(keyA);
  const rarityB = rarityOf(keyB);

  return (
    <Fragment>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="border-amber-700/50 text-amber-300 hover:bg-amber-950/40 shrink-0">
            <Sparkles className="mr-1.5 h-4 w-4" /> Comparar espíritos
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl border-amber-800/40 bg-[oklch(0.16_0.02_280)] text-foreground">
          <DialogHeader>
            <DialogTitle className="gold-text flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" /> Comparador de espíritos
            </DialogTitle>
            <DialogDescription>
              Compare dois espíritos lado a lado — atributos, radar e raridade. Os valores são indicativos de comunidade.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-amber-400">Espírito A</p>
              <div className="flex flex-wrap gap-1.5">
                {COMPARE_KEYS.map(k => (
                  <button
                    key={k}
                    onClick={() => setKeyA(k)}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                      keyA === k
                        ? "border-amber-500 bg-amber-950/40 text-amber-300"
                        : "border-slate-700/60 bg-slate-900/50 text-slate-400 hover:border-amber-800/60 hover:text-slate-200"
                    }`}
                  >
                    {SPIRIT_TIER_NAMES[k] ?? k}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-red-400">Espírito B</p>
              <div className="flex flex-wrap gap-1.5">
                {COMPARE_KEYS.map(k => (
                  <button
                    key={k}
                    onClick={() => setKeyB(k)}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                      keyB === k
                        ? "border-red-500 bg-red-950/40 text-red-300"
                        : "border-slate-700/60 bg-slate-900/50 text-slate-400 hover:border-red-800/60 hover:text-slate-200"
                    }`}
                  >
                    {SPIRIT_TIER_NAMES[k] ?? k}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Placar + raridades */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-900/40 bg-black/30 px-4 py-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-amber-400">{names.nameA}</span>
              <span className="font-serif text-xl font-bold">{totalA}</span>
              <span className="text-slate-500">×</span>
              <span className="text-sm font-bold text-red-400">{names.nameB}</span>
              <span className="font-serif text-xl font-bold">{totalB}</span>
            </div>
            <div className="flex items-center gap-2">
              {rarityA && (
                <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${RARITY_STYLES[rarityA].border} ${RARITY_STYLES[rarityA].color}`}>
                  {RARITY_STYLES[rarityA].label}
                </span>
              )}
              {rarityB && (
                <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${RARITY_STYLES[rarityB].border} ${RARITY_STYLES[rarityB].color}`}>
                  {RARITY_STYLES[rarityB].label}
                </span>
              )}
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className={`text-xs font-semibold ${winnerColor}`}>{winnerLabel}</span>
            </div>
          </div>

          {/* Radar */}
          <div className="flex justify-center rounded-md border border-slate-800 bg-black/25 py-3">
            <GenericRadarChart series={series} labels={Array.from(SPIRIT_RADAR_LABELS)} colorA="#fbbf24" colorB="#f43f5e" height={240} showLegend />
          </div>

          {/* Atributos */}
          <div className="space-y-3">
            {SPIRIT_RADAR_LABELS.map((label, idx) => {
              const vA = valuesA[idx];
              const vB = valuesB[idx];
              const delta = vA - vB;
              const rowWinner = vA > vB ? "a" : vB > vA ? "b" : "draw";
              return (
                <div key={label}>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                    <span className="ml-2 font-normal normal-case">
                      {vA} × {vB}
                      {delta !== 0 && (
                        <span className={`ml-1.5 ${rowWinner === "a" ? "text-amber-400" : "text-red-400"}`}>
                          {rowWinner === "a" ? `+${delta} ${names.nameA}` : `+${Math.abs(delta)} ${names.nameB}`}
                        </span>
                      )}
                      {delta === 0 && <span className="ml-1.5 text-slate-500">empate</span>}
                    </span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Progress value={vA} className="h-2 bg-slate-800 [&>div]:bg-amber-500" />
                    <Progress value={vB} className="h-2 bg-slate-800 [&>div]:bg-red-500" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="rounded-md border border-slate-800 bg-black/25 px-3 py-2 text-[10px] text-slate-500">
              Scores indicativos de comunidade (0–100) baseados no papel de cada espírito — raridade, passiva e efeitos
              reais variam. Use como ponto de partida para montar seus slots.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-amber-700/50 text-amber-300 hover:bg-amber-950/40 shrink-0"
              onClick={() => setCardOpen(true)}
            >
              <ImageDown className="mr-1.5 h-4 w-4" /> Exportar card
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SpiritCompareCardDialog spiritA={keyA} spiritB={keyB} open={cardOpen} onOpenChange={setCardOpen} />
    </Fragment>
  );
}

void Badge;
void Minus;
