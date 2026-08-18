import PageBanner from "@/components/guide/PageBanner";
import FavButton from "@/components/guide/FavButton";
import CommentsSection from "@/components/guide/CommentsSection";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, Sword, Gem, Coins, Wrench, Lightbulb } from "lucide-react";
import {
  EQUIPMENT_TYPES,
  ENHANCE_COSTS,
  GRADE_INFO,
  GEMMING_TIPS,
  EQUIPMENT_PAGE_KEY,
} from "@shared/guideData";

const fmt = (n: number) =>
  n.toLocaleString("pt-BR");

export default function Equipamentos() {
  const { isAuthenticated } = useAuth();
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const isFavorite = (key: string) =>
    favorites?.some(f => f.itemId === `gear:${key}`) ?? false;

  return (
    <div className="min-h-screen pb-16">
      <PageBanner
        title="Equipamentos & Geminação"
        subtitle="Slots de equipamento, custos de enhancement por estágio e o uso de Darksteel, Jade e Dragon Steel em cada grau"
        actions={
          <FavButton itemId="gear:equipamentos" itemType="gear" isFavorite={isFavorite("equipamentos")} />
        }
      />

      <div className="container max-w-5xl space-y-10">
        {/* Intro */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-3 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Como funciona a geminação
          </h2>
          <Card className="p-6 bg-gradient-to-br from-red-950/40 to-slate-900/60 border-amber-700/30">
            <p className="text-sm text-slate-300 leading-relaxed">
              A geminação (enhancement) fortalece cada slot de equipamento gastando <strong className="text-amber-300">Darksteel + Copper</strong> por estágio.
              Cada tipo de slot ganha stats diferentes por nível: armas acumulam ATK, armaduras acumulam DEF e HP,
              e acessórios somam CRIT, resistência e utilidade. O custo cresce exponencialmente e a chance de falha
              aumenta com o estágio — em graus antigos, falhar podia <strong className="text-red-400">destruir o item</strong>.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-700/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-100/90">
              <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
              <span>Priorize sempre: <strong>Arma → Armadura → Colar → Anéis → demais slots</strong>. O ATK da arma multiplica todo o seu dano.</span>
            </div>
          </Card>
        </section>

        {/* Stats por tipo de slot */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Sword className="h-6 w-6" />
            Stats por tipo de equipamento
          </h2>
          <div className="overflow-x-auto">
            <Table className="border border-amber-900/40 rounded-lg overflow-hidden">
              <TableHeader>
                <TableRow className="bg-red-950/50 hover:bg-red-950/50">
                  <TableHead className="text-amber-300">Slot</TableHead>
                  <TableHead className="text-amber-300">Exemplos</TableHead>
                  <TableHead className="text-amber-300">Stat principal / nível</TableHead>
                  <TableHead className="text-amber-300">Stats secundários</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EQUIPMENT_TYPES.map(t => (
                  <TableRow key={t.key} className="border-slate-800/60">
                    <TableCell className="font-semibold text-slate-200">{t.slot}</TableCell>
                    <TableCell className="text-xs text-slate-400">{t.examples.join(", ")}</TableCell>
                    <TableCell className="text-xs text-slate-300">{t.statPerLevel}</TableCell>
                    <TableCell className="text-xs text-slate-400">{t.statSecondary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Valores indicativos de comunidade (2022–2026); os gains por nível variam com o grau e o patch do servidor.
          </p>
        </section>

        {/* Custo por estágio */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Coins className="h-6 w-6" />
            Custo de enhancement por estágio
          </h2>
          <Card className="p-4 bg-black/30 border-amber-800/40">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-red-950/50 hover:bg-red-950/50">
                    <TableHead className="text-amber-300">Estágio</TableHead>
                    <TableHead className="text-amber-300">Darksteel</TableHead>
                    <TableHead className="text-amber-300">Copper</TableHead>
                    <TableHead className="text-amber-300">Risco de falha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ENHANCE_COSTS.map(c => (
                    <TableRow key={c.stage} className="border-slate-800/60">
                      <TableCell className="font-bold text-amber-200">+{c.stage}</TableCell>
                      <TableCell className="text-slate-200">{fmt(c.darksteel)}</TableCell>
                      <TableCell className="text-slate-300">{fmt(c.copper)}</TableCell>
                      <TableCell className="text-xs text-slate-400">{c.failRisk}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Referência indicativa por estágio inicial — o custo real varia com o grau do item (graus maiores pagam mais por nível).
            </p>
          </Card>
        </section>

        {/* Graus e materiais */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Gem className="h-6 w-6" />
            Darksteel, Jade e Dragonsteel por grau
          </h2>
          <div className="space-y-4">
            {GRADE_INFO.map(g => (
              <Card
                key={g.key}
                className={`p-5 border-amber-800/40 bg-gradient-to-br from-black/30 to-red-950/20 ${g.key === "mitico" ? "border-red-700/50" : ""}`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className={`text-lg font-bold ${g.color}`}>{g.name}</h3>
                    <p className="mt-1 text-xs text-slate-400">Enhance máximo: <span className="text-slate-300">{g.maxEnhance}</span></p>
                  </div>
                  <FavButton
                    itemId={`gear:${g.key}`}
                    itemType="gear"
                    isFavorite={isFavorite(g.key)}
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2.5">
                    <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Darksteel (craft)</div>
                    <div className="text-xs text-slate-200">{g.darksteelCraft}</div>
                  </div>
                  <div className="rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2.5">
                    <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Jade / Eternals</div>
                    <div className="text-xs text-slate-200">{g.jade}</div>
                  </div>
                  <div className="rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2.5">
                    <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Dragonsteel</div>
                    <div className="text-xs text-slate-200">{g.dragonsteel}</div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed">{g.note}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Dicas */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            Dicas de geminação
          </h2>
          <div className="space-y-2">
            {GEMMING_TIPS.map((t, i) => (
              <Card key={i} className="p-3.5 bg-black/30 border-amber-900/40">
                <p className="flex gap-2 text-xs text-slate-300 leading-relaxed">
                  <Badge variant="outline" className="border-amber-800/50 text-amber-500 shrink-0">{i + 1}</Badge>
                  {t}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Comentários */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            Dicas da comunidade — Equipamentos
          </h2>
          <CommentsSection pageKey="gear" farmKey="geral" title="Equipamentos & Geminação" />
        </section>
      </div>
    </div>
  );
}
