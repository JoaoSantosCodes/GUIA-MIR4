import { useMemo, useState } from "react";
import { MINE_AREAS, SEAL_MULTIPLIER, calculateMining, DRACO_REQUIREMENT, CALCULATOR_NOTES } from "@shared/guideData";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FavButton from "@/components/guide/FavButton";
import { Pickaxe, Coins, Gem, Timer, TrendingUp, AlertTriangle, Swords } from "lucide-react";
import EnhanceCalculator from "@/components/EnhanceCalculator";

const SEAL_OPTIONS: { value: 0 | 1 | 2 | 3; label: string; color: string }[] = [
  { value: 0, label: "Sem selo", color: "text-slate-300" },
  { value: 1, label: "Darksteel Seal", color: "text-slate-300" },
  { value: 2, label: "Jade Seal", color: "text-emerald-400" },
  { value: 3, label: "Dragon Seal", color: "text-red-400" },
];

function fmt(n: number) {
  return n.toLocaleString("pt-BR");
}

const CALC_TAB = "calc-tab";

export default function Calculadora() {
  const [tab, setTab] = useState<string>(() => localStorage.getItem(CALC_TAB) ?? "mining");
  const [sealLevel, setSealLevel] = useState<0 | 1 | 2 | 3>(1);
  const [areaKey, setAreaKey] = useState("byeoksan");
  const [hours, setHours] = useState("8");
  const [afk, setAfk] = useState(true);

  const onTabChange = (v: string) => {
    setTab(v);
    localStorage.setItem(CALC_TAB, v);
  };

  const result = useMemo(() => {
    const h = Math.max(0, Math.min(168, Number(hours) || 0));
    return calculateMining({ sealLevel, areaKey, hours: h, afk });
  }, [sealLevel, areaKey, hours, afk]);

  const mult = SEAL_MULTIPLIER[sealLevel] ?? 1;

  return (
    <div className="min-h-screen bg-[oklch(0.15_0.02_280)] text-foreground">
      <div className="container max-w-4xl py-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-4xl font-bold text-amber-400">Calculadora</h1>
            <p className="mt-2 text-sm text-slate-400">
              Estime seus ganhos de mineração e o custo de fortalecimento dos seus equipamentos.
            </p>
          </div>
          <FavButton itemId="seal:calculadora" itemType="seal" isFavorite={false} />
        </div>

        <Tabs value={tab} onValueChange={onTabChange} className="mt-6">
          <TabsList className="w-full bg-black/40">
            <TabsTrigger value="mining" className="flex-1 data-[state=active]:bg-amber-950/50 data-[state=active]:text-amber-300">
              <Pickaxe className="mr-2 h-4 w-4" /> Darksteel &amp; DRACO
            </TabsTrigger>
            <TabsTrigger value="enhance" className="flex-1 data-[state=active]:bg-amber-950/50 data-[state=active]:text-amber-300">
              <Swords className="mr-2 h-4 w-4" /> Fortalecimento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mining">
            <div className="mt-4 rounded-lg border border-amber-900/40 bg-black/30 p-4">
              <p className="flex items-center gap-2 text-xs text-amber-300/80">
                <AlertTriangle className="h-4 w-4" />
                Valores indicativos de comunidade (2024–2026) — variam por servidor, horário e competição de veias.
              </p>
            </div>

        <Card className="mt-6 border-amber-900/40 bg-black/40">
          <CardContent className="space-y-6 p-6">
            {/* Selo */}
            <div>
              <Label className="text-amber-400">Seu selo atual</Label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SEAL_OPTIONS.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSealLevel(s.value)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition-all ${
                      sealLevel === s.value
                        ? "border-amber-500 bg-amber-950/40"
                        : "border-slate-700/60 bg-black/30 hover:border-amber-800/60"
                    } ${s.color}`}
                  >
                    {s.label}
                    <span className="mt-1 block text-[10px] text-slate-500">×{SEAL_MULTIPLIER[s.value].toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Área */}
            <div>
              <Label className="text-amber-400">Área de mineração</Label>
              <select
                value={areaKey}
                onChange={e => setAreaKey(e.target.value)}
                className="mt-2 w-full rounded-md border border-amber-800/50 bg-black/40 px-3 py-2 text-sm text-amber-100"
              >
                {MINE_AREAS.map(a => (
                  <option key={a.key} value={a.key}>
                    {a.name} ({a.levelRange})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                {MINE_AREAS.find(a => a.key === areaKey)?.note}
                {(() => {
                  const min = MINE_AREAS.find(a => a.key === areaKey)?.minSealLevel ?? 0;
                  return min > sealLevel ? (
                    <span className="text-amber-500"> — recomenda selo nível {min} ou superior.</span>
                  ) : null;
                })()}
              </p>
            </div>

            {/* Horas e modo */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="hours" className="text-amber-400">Horas de farm</Label>
                <Input
                  id="hours"
                  type="number"
                  min={0}
                  max={168}
                  value={hours}
                  onChange={e => setHours(e.target.value)}
                  className="mt-2 border-amber-800/50 bg-black/40 text-amber-100"
                />
                <p className="mt-1 text-xs text-slate-500">Máximo semanal: 168h</p>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <Timer className="h-4 w-4 text-slate-400" />
                  <Label htmlFor="afk" className="text-amber-400">Apenas AFK</Label>
                  <Switch id="afk" checked={afk} onCheckedChange={setAfk} />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  O modo AFK penaliza ~20% (PK, perda de veias, monstros). Farm ativo com presença rende mais.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="border-amber-900/40 bg-gradient-to-br from-black/50 to-amber-950/20">
            <CardContent className="p-5">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Pickaxe className="h-4 w-4" /> Darksteel / hora
              </p>
              <p className="mt-2 font-serif text-3xl font-bold text-amber-400">{fmt(result.dsPerHour)}</p>
              <p className="mt-1 text-xs text-slate-500">×{mult.toFixed(2)} selo · {afk ? "modo AFK (−20%)" : "farm ativo"}</p>
            </CardContent>
          </Card>
          <Card className="border-amber-900/40 bg-gradient-to-br from-black/50 to-amber-950/20">
            <CardContent className="p-5">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Gem className="h-4 w-4" /> Darksteel total ({fmt(Number(hours) || 0)}h)
              </p>
              <p className="mt-2 font-serif text-3xl font-bold text-amber-300">{fmt(result.totalDs)}</p>
              <p className="mt-1 text-xs text-slate-500">≈ {fmt(result.goldEstimate.min)}–{fmt(result.goldEstimate.max)} Gold no Mercado</p>
            </CardContent>
          </Card>
          <Card className="border-amber-900/40 bg-gradient-to-br from-black/50 to-red-950/20">
            <CardContent className="p-5">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Coins className="h-4 w-4" /> DRACO estimados
              </p>
              <p className="mt-2 font-serif text-3xl font-bold text-red-400">{result.draco}</p>
              <p className="mt-1 text-xs text-slate-500">1 DRACO = {fmt(DRACO_REQUIREMENT)} DS + taxa (~10%)</p>
            </CardContent>
          </Card>
          <Card className="border-amber-900/40 bg-gradient-to-br from-black/50 to-red-950/20">
            <CardContent className="p-5">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <TrendingUp className="h-4 w-4" /> Para o próximo DRACO
              </p>
              <p className="mt-2 font-serif text-3xl font-bold text-red-300">{fmt(result.dsToNextDraco)} DS</p>
              <p className="mt-1 text-xs text-slate-500">
                ≈ {Math.max(0, Math.ceil(result.dsToNextDraco / (result.dsPerHour || 1)))}h a esse ritmo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Notas */}
        <div className="mt-6 rounded-lg border border-amber-900/40 bg-black/30 p-4">
          <h3 className="mb-2 text-sm font-bold text-amber-400">Observações</h3>
          <ul className="space-y-1.5">
            {CALCULATOR_NOTES.map((n, i) => (
              <li key={i} className="flex gap-2 text-xs text-slate-400">
                <Badge variant="outline" className="border-amber-800/50 text-amber-500 shrink-0">{i + 1}</Badge>
                {n}
              </li>
            ))}
          </ul>
        </div>

        <Button
          variant="link"
          onClick={() => (window.location.hash = "calendario")}
          className="mt-4 text-amber-400 hover:text-amber-300"
        >
          Veja os horários de mineração de elite no Calendário de Eventos →
        </Button>
          </TabsContent>

          <TabsContent value="enhance">
            <EnhanceCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
