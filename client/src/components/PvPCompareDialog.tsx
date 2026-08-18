import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Swords, Trophy, Minus } from "lucide-react";
import { compareBuilds, COMPARE_CLASSES, SCENARIO_LABELS, ATTR_LABELS, type CompareResult } from "@/lib/pvpCompare";

export default function PvPCompareDialog() {
  const [open, setOpen] = useState(false);
  const [classA, setClassA] = useState<string>("warrior");
  const [classB, setClassB] = useState<string>("sorcerer");

  const result: CompareResult | null = useMemo(() => compareBuilds(classA, classB), [classA, classB]);

  const nameA = COMPARE_CLASSES.find(c => c.key === classA)?.name ?? classA;
  const nameB = COMPARE_CLASSES.find(c => c.key === classB)?.name ?? classB;

  const overallLabel =
    result?.overallWinner === "draw"
      ? "Empate geral"
      : result?.overallWinner === "a"
        ? `${nameA} leva a vantagem`
        : `${nameB} leva a vantagem`;

  const overallColor =
    result?.overallWinner === "draw"
      ? "text-slate-300"
      : result?.overallWinner === "a"
        ? "text-amber-400"
        : "text-red-400";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-amber-700/50 text-amber-300 hover:bg-amber-950/40 shrink-0"
        >
          <Swords className="mr-1.5 h-4 w-4" /> Comparar builds
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-amber-800/40 bg-[oklch(0.16_0.02_280)] text-foreground">
        <DialogHeader>
          <DialogTitle className="gold-text flex items-center gap-2">
            <Swords className="h-5 w-5 text-amber-500" /> Comparador de builds PvP
          </DialogTitle>
          <DialogDescription>
            Compare duas classes lado a lado em PvP 1×1, PvP em grupo e Bosses — dano, defesa e utilidade.
          </DialogDescription>
        </DialogHeader>

        {/* Seletores */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-amber-400">Build A</p>
            <div className="flex flex-wrap gap-1.5">
              {COMPARE_CLASSES.map(c => (
                <button
                  key={c.key}
                  onClick={() => setClassA(c.key)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                    classA === c.key
                      ? "border-amber-500 bg-amber-950/40 text-amber-300"
                      : "border-slate-700/60 bg-slate-900/50 text-slate-400 hover:border-amber-800/60 hover:text-slate-200"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-red-400">Build B</p>
            <div className="flex flex-wrap gap-1.5">
              {COMPARE_CLASSES.map(c => (
                <button
                  key={c.key}
                  onClick={() => setClassB(c.key)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                    classB === c.key
                      ? "border-red-500 bg-red-950/40 text-red-300"
                      : "border-slate-700/60 bg-slate-900/50 text-slate-400 hover:border-red-800/60 hover:text-slate-200"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Placar agregado */}
        {result && (
          <>
            <div className="flex items-center justify-between rounded-md border border-amber-900/40 bg-black/30 px-4 py-2">
              <span className="text-sm font-bold text-amber-400">{nameA}</span>
              <span className="font-serif text-xl font-bold">{result.totals.a}</span>
              <span className="text-slate-500">×</span>
              <span className="text-sm font-bold text-red-400">{nameB}</span>
              <span className="font-serif text-xl font-bold">{result.totals.b}</span>
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className={`text-xs font-semibold ${overallColor}`}>{overallLabel}</span>
            </div>

            {/* Cenas */}
            <div className="space-y-5">
              {(["duel", "group", "boss"] as const).map(scenario => {
                const wins = result.scenarioWins[scenario];
                const scenarioWinner =
                  wins.a > wins.b ? "a" : wins.b > wins.a ? "b" : "draw";
                return (
                  <div key={scenario}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-bold text-amber-300">{SCENARIO_LABELS[scenario]}</p>
                      <Badge
                        variant="outline"
                        className={`border-slate-700/60 text-[10px] ${
                          scenarioWinner === "a"
                            ? "text-amber-300"
                            : scenarioWinner === "b"
                              ? "text-red-300"
                              : "text-slate-300"
                        }`}
                      >
                        {scenarioWinner === "draw" ? (
                          <Minus className="mr-1 h-3 w-3" />
                        ) : (
                          <Trophy className="mr-1 h-3 w-3" />
                        )}
                        {scenarioWinner === "draw"
                          ? "Empate"
                          : scenarioWinner === "a"
                            ? `${nameA} vence ${wins.a}–${wins.b}`
                            : `${nameB} vence ${wins.b}–${wins.a}`}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {(["dano", "defesa", "utilidade"] as const).map(attr => {
                        const row = result.rows.find(r => r.scenario === scenario && r.attribute === attr);
                        if (!row) return null;
                        const max = 100;
                        const pctA = (row.valueA / max) * 100;
                        const pctB = (row.valueB / max) * 100;
                        const deltaAbs = Math.abs(row.delta);
                        return (
                          <div key={attr}>
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                              {ATTR_LABELS[attr]}
                              <span className="ml-2 font-normal normal-case">
                                {row.valueA} × {row.valueB}
                                {deltaAbs > 0 && (
                                  <span
                                    className={`ml-1.5 ${row.winner === "a" ? "text-amber-400" : "text-red-400"}`}
                                  >
                                    {row.winner === "a" ? `+${deltaAbs} ${nameA}` : `+${deltaAbs} ${nameB}`}
                                  </span>
                                )}
                                {deltaAbs === 0 && <span className="ml-1.5 text-slate-500">empate</span>}
                              </span>
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <Progress value={pctA} className="h-2 bg-slate-800 [&>div]:bg-amber-500" />
                              <Progress value={pctB} className="h-2 bg-slate-800 [&>div]:bg-red-500" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="rounded-md border border-slate-800 bg-black/25 px-3 py-2 text-[10px] text-slate-500">
              Scores indicativos de comunidade (0–100) baseados na tier list deste guia — o meta real varia por
              patch, servidor e gear. Use como ponto de partida para testar as duas builds em combate.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
