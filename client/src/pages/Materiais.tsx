import { useMemo, useState } from "react";
import { Link } from "wouter";
import PageBanner from "@/components/guide/PageBanner";
import FavButton from "@/components/guide/FavButton";
import CommentsSection from "@/components/guide/CommentsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { MATERIALS, MATERIALS_PAGE_KEY, type MaterialInfo } from "@shared/guideData";
import { Search, MapPin, Hammer, Lightbulb, Lock, Package } from "lucide-react";

const TIER_ORDER: Record<string, number> = { Common: 0, Rare: 1, Epic: 2, Legendary: 3, Mythic: 4 };

export default function Materiais() {
  const [query, setQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("todos");
  const { user } = useAuth();
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, { enabled: Boolean(user) });

  const filtered = useMemo(() => {
    return MATERIALS.filter(m => {
      const matchTier = tierFilter === "todos" || m.tier === tierFilter;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.sources.some(s => s.toLowerCase().includes(q)) ||
        m.usedFor.some(u => u.toLowerCase().includes(q));
      return matchTier && matchQuery;
    }).sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);
  }, [query, tierFilter]);

  const isFavorite = (key: string) => favorites?.some(f => f.itemId === `materials:${key}`) ?? false;

  return (
    <>
      <PageBanner
        title="Materiais & Crafting"
        subtitle="Onde farmar cada material — Darksteel, Jade, Dragonsteel, Divine Dragon's Soul e reagentes épicos"
      />

      <div className="container space-y-6 pb-12">
        <Card className="border-amber-800/40 bg-[oklch(0.19_0.015_280)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-300">
              <Package className="mr-2 inline h-5 w-5" />
              Fontes de farm por material
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  placeholder="Buscar material, fonte ou uso (ex.: dragonsteel, invoke, pity)"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="pl-9 border-amber-800/50 bg-[oklch(0.16_0.01_280)]"
                />
              </div>
              <Tabs value={tierFilter} onValueChange={setTierFilter}>
                <TabsList className="bg-[oklch(0.16_0.01_280)]">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="Common">Comum</TabsTrigger>
                  <TabsTrigger value="Rare">Raro</TabsTrigger>
                  <TabsTrigger value="Epic">Épico</TabsTrigger>
                  <TabsTrigger value="Legendary">Lendário</TabsTrigger>
                  <TabsTrigger value="Mythic">Mítico</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-4">
              {filtered.map(m => (
                <MaterialCard key={m.key} m={m} isFavorite={isFavorite} user={user} />
              ))}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">
                  Nenhum material encontrado com esses filtros.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-800/40 bg-[oklch(0.19_0.015_280)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-300">
              <Lightbulb className="mr-2 inline h-5 w-5" />
              Fluxo de progressão de materiais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>
              <strong className="text-amber-200">Early game:</strong> Darksteel via mineração + Mercado; Copper acumula sozinho. Use a{" "}
              <Link href="/calculadora" className="text-amber-400 underline">Calculadora</Link> para estimar o tempo.
            </p>
            <p>
              <strong className="text-amber-200">Mid game:</strong> Promova o selo Darksteel → Jade (craft consome Darksteel) para
              destravar as áreas intermediárias de mineração com multiplicador 1,25×–1,55×.
            </p>
            <p>
              <strong className="text-amber-200">Late game:</strong> Dragonsteel (não negociável) vem de Clan Expedition, Fissured Magic
              Square e Secret Peak todos os dias; Divine Dragon's Soul é a chave do despertamento mítico, com pity de 5 falhas.
            </p>
            <p>
              <strong className="text-amber-200">Rotina recomendada:</strong> mineração AFK de madrugada + Expedition + Magic Square fissurado +
              Secret Peak diariamente. Acumulação contínua supera farm intensivo de fim de semana.
            </p>
          </CardContent>
        </Card>

        <CommentsSection pageKey="materials" farmKey="geral" />
      </div>
    </>
  );
}

function MaterialCard({ m, isFavorite, user }: { m: MaterialInfo; isFavorite: (key: string) => boolean; user: ReturnType<typeof useAuth>["user"] }) {
  return (
    <div className="rounded-lg border border-amber-800/40 bg-[oklch(0.16_0.01_280)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-amber-100">{m.name}</h3>
          <Badge variant="outline" className={`border-amber-700/50 ${m.tierColor}`}>{m.tier}</Badge>
          {m.bind && (
            <span className="inline-flex items-center gap-1 text-xs text-sky-400" title="Material ligado à conta (não negociável)">
              <Lock className="h-3 w-3" /> Ligado
            </span>
          )}
        </div>
        <FavButton itemId={`materials:${m.key}`} itemType="materials" isFavorite={isFavorite(m.key)} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <p className="mb-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            <MapPin className="h-3.5 w-3.5" /> Onde farmar
          </p>
          <ul className="space-y-1">
            {m.sources.map((s, i) => (
              <li key={i} className="text-sm text-slate-300">• {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Hammer className="h-3.5 w-3.5" /> Para que serve
          </p>
          <ul className="space-y-1">
            {m.usedFor.map((u, i) => (
              <li key={i} className="text-sm text-slate-300">• {u}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-3 border-t border-amber-900/40 pt-2 text-xs text-amber-400/90">
        <Lightbulb className="mr-1 inline h-3 w-3" /> {m.tip}
      </p>
    </div>
  );
}
