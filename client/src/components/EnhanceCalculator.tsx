import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Swords, RotateCcw, Coins } from "lucide-react";
import {
  estimateEnhance,
  fmtNumber,
  enhanceSlotOptions,
  ENHANCE_MAX_LEVEL,
} from "@/lib/enhanceCalc";
import { MATERIAL_GOLD_PRICES, MATERIAL_GOLD_PRICES_NOTE } from "@shared/guideData";

const ENHANCE_PREF = "enhance-prefs";
const SLOT_HINTS: Record<string, string> = {
  weapon: "ATK físico/mágico — o boost multiplica todo o seu dano",
  armor: "DEF + Max HP; em níveis altos ganha DMG Reduction",
  helm: "Max HP + DEF; resistência a Stun/Silence nos níveis altos",
  gloves: "ATK + HIT; CRIT Rate em níveis altos",
  pants: "Max HP + DEF; DMG Reduction física",
  boots: "Max HP + EVA; resistência a knockdown",
  necklace: "ATK% e Max HP; RESIST elemental",
  rings: "CRIT + ATK; Skill CD Reduction nos níveis altos",
  bracelet: "Max HP + CRIT EVA; Poção HP/MP +",
  "dragon-artifact": "Stats gigantes por estágio; Black/White Dragon resistem a falhas",
};

export default function EnhanceCalculator() {
  const stored = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(ENHANCE_PREF) ?? "{}") as Record<string, unknown>;
    } catch {
      return {};
    }
  }, []);

  const [slotKey, setSlotKey] = useState<string>((stored.slot as string) ?? "weapon");
  const [current, setCurrent] = useState<number>((stored.current as number) ?? 0);
  const [target, setTarget] = useState<number>((stored.target as number) ?? 5);
  const [jadePrice, setJadePrice] = useState<number>((stored.jadePrice as number) ?? 0);
  /** Preço de mercado de 1 Darksteel em Gold (ajustável pelo jogador conforme a cotação local). */
  const [dsGoldPrice, setDsGoldPrice] = useState<number>((stored.dsGoldPrice as number) ?? 1000);

  const estimate = useMemo(() => {
    const e = estimateEnhance({ current, target, slotKey, jadePriceUnit: jadePrice });
    // Recalcula o total em Gold com a cotação ajustada do Darksteel
    const dsPrice = MATERIAL_GOLD_PRICES.find(p => p.key === "darksteel")?.goldPerUnit ?? 1000;
    const jadePriceGold = MATERIAL_GOLD_PRICES.find(p => p.key === "jade")?.goldPerUnit ?? 40000;
    const ratio = dsPrice > 0 ? dsGoldPrice / dsPrice : 1;
    return {
      ...e,
      totalGold: e.goldBreakdown[0].gold * ratio + e.goldBreakdown[1].gold + e.goldBreakdown[2].gold * jadePriceGold / 40000,
    };
  }, [current, target, slotKey, jadePrice, dsGoldPrice]);

  const persist = (next: Record<string, unknown>) => {
    try {
      localStorage.setItem(ENHANCE_PREF, JSON.stringify({ ...next, dsGoldPrice }));
    } catch {
      /* storage indisponível */
    }
  };

  const slotLabel = enhanceSlotOptions().find(o => o.key === slotKey)?.label ?? slotKey;
  const slotShort = enhanceSlotOptions().find(o => o.key === slotKey)?.label.split(" (")[0] ?? slotKey;
  const slotHint = SLOT_HINTS[slotKey] ?? "";

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-lg border border-amber-900/40 bg-black/30 p-4">
        <p className="flex items-center gap-2 text-xs text-amber-300/80">
          <AlertTriangle className="h-4 w-4" />
          Custos indicativos de comunidade (2022–2026) — a base Darksteel varia por slot (x0.5 a x50 em Dragon Artifacts). Os valores crescem exponencialmente a partir do +5.
        </p>
      </div>

      <Card className="border-amber-900/40 bg-black/40">
        <CardContent className="space-y-5 p-6">
          {/* Slot */}
          <div>
            <Label className="text-amber-400">Equipamento</Label>
            <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-5">
              {enhanceSlotOptions().map(opt => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setSlotKey(opt.key);
                    persist({ slot: opt.key, current, target, jadePrice });
                  }}
                  className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-all ${
                    slotKey === opt.key
                      ? "border-amber-500 bg-amber-950/40 text-amber-300"
                      : "border-slate-700/60 bg-black/30 text-slate-400 hover:border-amber-800/60 hover:text-slate-200"
                  }`}
                  title={SLOT_HINTS[opt.key] ?? ""}
                >
                  {opt.label.split(" (")[0]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {slotLabel} — {slotHint}
            </p>
          </div>

          {/* Níveis */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="enhance-current" className="text-amber-400">Nível atual (+{current})</Label>
              <input
                id="enhance-current"
                type="range"
                min={0}
                max={ENHANCE_MAX_LEVEL}
                value={current}
                onChange={e => {
                  const v = Number(e.target.value);
                  setCurrent(v);
                  if (v > target) setTarget(v);
                  persist({ slot: slotKey, current: v, target, jadePrice });
                }}
                className="mt-3 w-full accent-amber-500"
              />
              <p className="mt-1 text-xs text-slate-500">+{current}</p>
            </div>
            <div>
              <Label htmlFor="enhance-target" className="text-amber-400">Nível alvo (+{target})</Label>
              <input
                id="enhance-target"
                type="range"
                min={current}
                max={ENHANCE_MAX_LEVEL}
                value={target}
                onChange={e => {
                  const v = Number(e.target.value);
                  setTarget(v);
                  persist({ slot: slotKey, current, target: v, jadePrice });
                }}
                className="mt-3 w-full accent-red-500"
              />
              <p className="mt-1 text-xs text-slate-500">+{target}</p>
            </div>
          </div>

          {/* Jade */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="jade-price" className="text-amber-400">Custo de 1 Jade (opcional)</Label>
              <input
                id="jade-price"
                type="number"
                min={0}
                placeholder="0 — não usar Jade"
                value={jadePrice || ""}
                onChange={e => {
                  const v = Number(e.target.value);
                  setJadePrice(v);
                  persist({ slot: slotKey, current, target, jadePrice: v });
                }}
                className="mt-2 w-full rounded-md border border-amber-800/50 bg-black/40 px-3 py-2 text-sm text-amber-100"
              />
            <p className="mt-1 text-xs text-slate-500">
              Jade protege contra a perda de nível: 1 Jade por tentativa. Informe o preço em Darksteel/Gold para estimar o custo total.
            </p>
            </div>
          </div>

          {/* Cotação do Darksteel em Gold */}
          <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
              <Label htmlFor="ds-gold-price" className="text-amber-400 flex items-center gap-1.5">
                <Coins className="h-4 w-4" /> Cotação do Darksteel no Mercado (Gold por unidade)
              </Label>
              <input
                id="ds-gold-price"
                type="number"
                min={1}
                value={dsGoldPrice || ""}
                onChange={e => {
                  const v = Number(e.target.value);
                  setDsGoldPrice(v);
                  persist({ slot: slotKey, current, target, jadePrice });
                }}
                className="mt-2 w-full rounded-md border border-amber-800/50 bg-black/40 px-3 py-2 text-sm text-amber-100"
              />
              <p className="mt-1 text-xs text-slate-500">{MATERIAL_GOLD_PRICES_NOTE}</p>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="border-amber-800/50 text-amber-400 hover:bg-amber-950/40"
                onClick={() => {
                  setCurrent(0);
                  setTarget(0);
                  setJadePrice(0);
                  setDsGoldPrice(1000);
                  localStorage.removeItem(ENHANCE_PREF);
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Limpar escolha
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Totais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-amber-900/40 bg-gradient-to-br from-black/50 to-amber-950/20">
          <CardContent className="p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Swords className="h-4 w-4" /> Darksteel total (+{current} → +{target})
            </p>
            <p className="mt-2 font-serif text-3xl font-bold text-amber-400">
              {fmtNumber(estimate.totalDarksteel)}
            </p>
            <p className="mt-1 text-xs text-slate-500">≈ {fmtNumber(estimate.totalCopper)} Copper</p>
          </CardContent>
        </Card>
        <Card className="border-amber-900/40 bg-gradient-to-br from-black/50 to-emerald-950/20">
          <CardContent className="p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Custo em Jade
            </p>
            <p className="mt-2 font-serif text-3xl font-bold text-emerald-400">
              {jadePrice > 0 ? fmtNumber(estimate.totalJade) : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {jadePrice > 0
                ? `${estimate.jadeAttempts} tentativa(s) × ${fmtNumber(jadePrice)}`
                : "Informe o preço do Jade para estimar"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-900/40 bg-gradient-to-br from-black/50 to-yellow-950/25">
          <CardContent className="p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Coins className="h-4 w-4" /> Custo estimado em Gold
            </p>
            <p className="mt-2 font-serif text-3xl font-bold text-yellow-400">
              {fmtNumber(Math.round(estimate.totalGold))}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Darksteel × {fmtNumber(dsGoldPrice)} Gold{estimate.jadeAttempts > 0 ? " + Jade (1 por tentativa)" : ""} —
              ajuste a cotação acima conforme o seu Mercado
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-900/40 bg-gradient-to-br from-black/50 to-red-950/20">
          <CardContent className="p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Estágios restantes
            </p>
            <p className="mt-2 font-serif text-3xl font-bold text-red-400">
              {Math.max(0, estimate.steps.length)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {estimate.steps.length > 0
                ? `De +${estimate.steps[0].stage - 1} até +${target} no ${slotShort}`
                : "O equipamento já está no nível alvo"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela progressiva */}
      <Card className="border-amber-900/40 bg-black/40">
        <CardContent className="p-5">
          <h3 className="text-sm font-bold text-amber-400">Custo progressivo por estágio</h3>
          {estimate.steps.length === 0 ? (
            <p className="mt-3 text-xs text-slate-500">
              Nenhum estágio a percorrer — ajuste o nível alvo acima do nível atual.
            </p>
          ) : (
            <Table className="mt-3">
              <TableHeader>
                <TableRow className="border-amber-900/40 hover:bg-transparent">
                  <TableHead className="text-amber-400">Estágio</TableHead>
                  <TableHead className="text-right text-amber-400">Darksteel</TableHead>
                  <TableHead className="text-right text-amber-400">Copper</TableHead>
                  <TableHead className="text-right text-amber-400">Acumulado Darksteel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimate.steps.map(s => (
                  <TableRow key={s.stage} className="border-amber-900/30 hover:bg-amber-950/20">
                    <TableCell className="text-amber-200">
                      <Badge variant="outline" className="border-amber-700/50 text-amber-300">
                        +{s.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-slate-300">{fmtNumber(s.darksteel)}</TableCell>
                    <TableCell className="text-right text-slate-400">{fmtNumber(s.copper)}</TableCell>
                    <TableCell className="text-right font-semibold text-amber-300">{fmtNumber(s.cumulativeDarksteel)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="rounded-lg border border-amber-900/40 bg-black/30 p-4">
        <h3 className="mb-2 text-sm font-bold text-amber-400">Lembretes do sistema de fortalecimento</h3>
        <ul className="space-y-1.5 text-xs text-slate-400">
          <li className="flex gap-2"><Badge variant="outline" className="border-amber-800/50 text-amber-500 shrink-0">1</Badge>Falha a partir do +5 pode destruir o equipamento — use Safe Enhancement sempre que possível.</li>
          <li className="flex gap-2"><Badge variant="outline" className="border-amber-800/50 text-amber-500 shrink-0">2</Badge>Dragon Artifacts Rare e Epic são destruídos ao falhar; Black/White Dragon apenas perdem 1–3 níveis.</li>
          <li className="flex gap-2"><Badge variant="outline" className="border-amber-800/50 text-amber-500 shrink-0">3</Badge>Priorize: Arma &gt; Armadura &gt; Colar &gt; Anéis &gt; demais slots.</li>
          <li className="flex gap-2"><Badge variant="outline" className="border-amber-800/50 text-amber-500 shrink-0">4</Badge>O enhance não transfere ao trocar de grau — use Inheritance antes de evoluir o item.</li>
        </ul>
      </div>
    </div>
  );
}
