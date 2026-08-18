import { useMemo, useState } from "react";
import { CODEX_BONUSES, CODEX_CATEGORIES, CODEX_ITEMS, CODEX_RANKING, SECTION_IMAGES, type CodexItem } from "@shared/guideData";
import PageBanner from "@/components/guide/PageBanner";
import ItemCardDialog from "@/components/ItemCardDialog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast as sonnerToast } from "sonner";
import { BookOpen, FileDown, Image, LogIn, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import CategoryCardDialog from "@/components/CategoryCardDialog";

export default function Codex() {
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();
  const { data: progress } = trpc.codexProgress.list.useQuery(undefined, { enabled: isAuthenticated });
  const [category, setCategory] = useState<string | "Todas">("Todas");
  const [query, setQuery] = useState("");
  const [rarity, setRarity] = useState<string | "Todas">("Todas");
  const [tier, setTier] = useState<string | "Todas">("Todas");
  const [exportingItem, setExportingItem] = useState<CodexItem | null>(null);
  const [exportingCategory, setExportingCategory] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, boolean>>({});

  // Persistência das preferências de filtro em localStorage
  const [restored, setRestored] = useState(false);
  useMemo(() => {
    try {
      const raw = window.localStorage.getItem("mir4-codex-filters");
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.category) setCategory(saved.category);
      if (saved.query) setQuery(saved.query);
      if (saved.rarity) setRarity(saved.rarity);
      if (saved.tier) setTier(saved.tier);
    } catch {
      // preferência corrompida — ignorar e começar do zero
    }
    setRestored(true);
  }, []);

  useMemo(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(
        "mir4-codex-filters",
        JSON.stringify({ category, query, rarity, tier }),
      );
    } catch {
      // localStorage indisponível — sem ação
    }
  }, [restored, category, query, rarity, tier]);

  const collected = useMemo(() => new Set(progress?.map(p => p.itemId) ?? []), [progress]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CODEX_ITEMS.filter(c => {
      if (category !== "Todas" && c.category !== category) return false;
      if (rarity !== "Todas" && c.rarity !== rarity) return false;
      if (tier !== "Todas" && String(c.tier) !== tier) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.tip.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, query, rarity, tier]);
  const totalCollected = collected.size;
  const totalItems = CODEX_ITEMS.length;
  const pct = Math.round((totalCollected / totalItems) * 100);

  const categoryStats = useMemo(
    () =>
      CODEX_CATEGORIES.map(cat => {
        const items = CODEX_ITEMS.filter(c => c.category === cat);
        const done = items.filter(c => collected.has(c.key)).length;
        return { cat, total: items.length, done };
      }),
    [collected],
  );
  const catMap = useMemo(
    () => new Map(categoryStats.map(c => [c.cat, c])),
    [categoryStats],
  );
  // stats por categoria reutilizadas no card individual (Map<string, number>)
  const catTotal = useMemo(
    () => new Map<string, number>(categoryStats.map(s => [s.cat, s.total])),
    [categoryStats],
  );
  const catDone = useMemo(
    () => new Map<string, number>(categoryStats.map(s => [s.cat, s.done])),
    [categoryStats],
  );

  const toggle = trpc.codexProgress.toggle.useMutation({
    onMutate: async ({ itemId, collected: isCollected }) => {
      await utils.codexProgress.list.cancel();
      const prev = utils.codexProgress.list.getData();
      utils.codexProgress.list.setData(undefined, old =>
        isCollected
          ? [...(old ?? []), { id: 0, userId: 0, itemId, collectedAt: new Date() }]
          : (old ?? []).filter(p => p.itemId !== itemId),
      );
      setPending(p => ({ ...p, [itemId]: isCollected }));
      return { prev };
    },
    onError: (_err, input, ctx) => {
      utils.codexProgress.list.setData(undefined, ctx?.prev);
      setPending(p => ({ ...p, [input.itemId]: !p[input.itemId] }));
      sonnerToast.error("Falha ao salvar progresso");
    },
    onSettled: () => {
      utils.codexProgress.list.invalidate();
    },
  });

  const handleToggle = (itemId: string) => {
    if (!isAuthenticated) {
      sonnerToast("Entre com sua conta para marcar itens como coletados", {
        action: { label: "Entrar", onClick: () => startLogin() },
      });
      return;
    }
    const willCollect = !collected.has(itemId);
    toggle.mutate({ itemId, collected: willCollect });
  };

  return (
    <div>
      <PageBanner
        title="Codex"
        subtitle="Registre itens duplicados no Codex para ganhar bônus permanentes de atributos, EXP e drop. O ranking do Collection Codex premia os colecionadores mais completos do servidor."
        image={SECTION_IMAGES.codex}
      />
      <div className="container py-10">
        {/* Progresso pessoal */}
        <section id="progresso" className="rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="gold-text text-xl font-bold">Meu progresso no Codex</h2>
              <p className="text-sm text-slate-400 mt-1">
                {isAuthenticated
                  ? `${totalCollected} de ${totalItems} itens coletados (${pct}%)`
                  : "Faça login para marcar seus itens coletados."}
              </p>
            </div>
            {isAuthenticated ? (
              <span className="text-2xl font-bold text-amber-400">{pct}%</span>
            ) : loading ? null : (
              <Button size="sm" onClick={() => startLogin()} className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100 border border-amber-700/50">
                <LogIn className="h-4 w-4" /> Entrar para salvar progresso
              </Button>
            )}
          </div>
          <Progress value={pct} className="mt-4 [&>div]:bg-gradient-to-r [&>div]:from-amber-600 [&>div]:to-red-600" />
        </section>

        {/* Bônus */}
        <section className="mt-8">
          <h2 className="gold-text text-2xl font-bold">Bônus por conclusão</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-amber-800/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-900/40 bg-black/40 text-left">
                  <th className="px-4 py-3 font-semibold text-amber-300">Conclusão da categoria</th>
                  <th className="px-4 py-3 font-semibold text-amber-300">Bônus</th>
                </tr>
              </thead>
              <tbody>
                {CODEX_BONUSES.map(b => (
                  <tr key={b.completion} className="border-b border-amber-900/20 last:border-0 hover:bg-amber-900/10">
                    <td className="px-4 py-3 font-medium text-slate-200">{b.completion}</td>
                    <td className="px-4 py-3 text-slate-300">{b.bonus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Ranking */}
        <section className="mt-10">
          <h2 className="gold-text text-2xl font-bold">Ranking do Collection Codex</h2>
          <p className="text-sm text-slate-400 mt-2">Bônus por posição no ranking global (por servidor).</p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-amber-800/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-900/40 bg-black/40 text-left">
                  <th className="px-4 py-3 font-semibold text-amber-300">Posição</th>
                  <th className="px-4 py-3 font-semibold text-amber-300">Buff</th>
                </tr>
              </thead>
              <tbody>
                {CODEX_RANKING.map(r => (
                  <tr key={r.rank} className="border-b border-amber-900/20 last:border-0 hover:bg-amber-900/10">
                    <td className="px-4 py-3 font-medium text-slate-200">{r.rank}</td>
                    <td className="px-4 py-3 text-slate-300">{r.buff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Itens */}
        <section className="mt-10">
          <h2 className="gold-text text-2xl font-bold">Itens do Codex</h2>
          <p className="text-sm text-slate-400 mt-2">
            Marque os itens que você já registrou. Filtre por categoria para focar no que falta.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {/* Exportação em lote por categoria */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setExportingCategory("__todas__")}
                className="rounded-md border border-amber-800/40 bg-black/30 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-amber-600 hover:text-amber-200 active:scale-[0.97]"
              >
                <FileDown className="mr-1 inline h-3 w-3" /> Exportar card do Codex completo
              </button>
              {CODEX_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setExportingCategory(cat)}
                  className="rounded-md border border-amber-800/40 bg-black/30 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-amber-600 hover:text-amber-200 active:scale-[0.97]"
                >
                  <FileDown className="mr-1 inline h-3 w-3" /> Card {cat}
                </button>
              ))}
            </div>
            {/* Busca por nome */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar por nome ou dica de farm..."
                  className="pl-9 bg-black/30 border-amber-800/40 placeholder:text-slate-500"
                />
                {query && (
                  <button
                    aria-label="Limpar busca"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-500 hover:text-amber-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {/* Filtro por raridade */}
              <select
                value={rarity}
                onChange={e => setRarity(e.target.value)}
                aria-label="Filtrar por raridade"
                className="rounded-md border border-amber-800/40 bg-black/30 px-3 py-1.5 text-sm text-slate-200 focus:border-amber-600 focus:outline-none"
              >
                <option value="Todas">Todas raridades</option>
                <option value="UC">UC</option>
                <option value="Raro">Raro</option>
                <option value="Épico">Épico</option>
                <option value="Lendário">Lendário</option>
                <option value="Mítico">Mítico</option>
              </select>
              {/* Filtro por faixa de nível */}
              <select
                value={tier}
                onChange={e => setTier(e.target.value)}
                aria-label="Filtrar por faixa de nível"
                className="rounded-md border border-amber-800/40 bg-black/30 px-3 py-1.5 text-sm text-slate-200 focus:border-amber-600 focus:outline-none"
              >
                <option value="Todas">Todas as faixas</option>
                <option value="1">Nível 1–20</option>
                <option value="2">Nível 20–40</option>
                <option value="3">Nível 40–60</option>
                <option value="4">Nível 60–80</option>
                <option value="5">Nível 80–100+</option>
              </select>
            </div>
            {/* Filtro por categoria */}
            <div className="flex flex-wrap gap-2">
              {(["Todas", ...CODEX_CATEGORIES] as const).map(c => {
                const stats = c !== "Todas" ? catMap.get(c) : undefined;
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "rounded-md border px-4 py-1.5 text-sm font-medium transition-all active:scale-[0.97]",
                      category === c
                        ? "border-amber-500 bg-amber-900/40 text-amber-300"
                        : "border-amber-800/40 bg-black/30 text-slate-400 hover:text-amber-200 hover:border-amber-700/50",
                    )}
                  >
                    {c}
                    {stats && (
                      <span className="ml-1.5 text-[10px] text-slate-500">
                        {stats.done}/{stats.total}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {(query || rarity !== "Todas" || tier !== "Todas") && (
              <p className="text-xs text-slate-500">
                {filtered.length} {filtered.length === 1 ? "item encontrado" : "itens encontrados"} com os filtros atuais.
              </p>
            )}
          </div>

          {/* Progresso por categoria */}
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {categoryStats.map(s => {
              const catPct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
              return (
                <div key={s.cat} className="rounded-lg border border-amber-900/40 bg-black/20 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-300/90">{s.cat}</span>
                    <span className="text-slate-400">{s.done}/{s.total} ({catPct}%)</span>
                  </div>
                  <Progress value={catPct} className={cn("mt-2 [&>div]:bg-gradient-to-r", catPct >= 100 ? "[&>div]:from-emerald-700 [&>div]:to-emerald-400" : "[&>div]:from-amber-700 [&>div]:to-amber-500")} />
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {filtered.map(c => {
              const isCollected = collected.has(c.key);
              const state = pending[c.key] ?? isCollected;
              return (
                <div
                  key={c.key}
                  id={c.key}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 scroll-mt-24 transition-colors",
                    state
                      ? "border-emerald-600/50 bg-emerald-950/30"
                      : "border-amber-900/40 bg-[oklch(0.19_0.015_280)]",
                  )}
                >
                  <button
                    aria-label={state ? "Desmarcar item coletado" : "Marcar item como coletado"}
                    onClick={() => handleToggle(c.key)}
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                      state
                        ? "border-emerald-500 bg-emerald-600 text-black"
                        : "border-slate-600 bg-black/40 hover:border-amber-500",
                    )}
                  >
                    {state && <span className="text-xs font-bold">✓</span>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={cn("font-semibold", state ? "text-emerald-300 line-through decoration-emerald-700" : "text-amber-100")}>{c.name}</h3>
                      <span className="rounded-full border border-emerald-700/40 bg-emerald-950/40 px-2 py-0 text-[10px] font-semibold text-emerald-400">
                        {c.rarity} · Tier {c.tier}
                      </span>
                      <span className="rounded-full border border-slate-700/50 bg-black/30 px-2 py-0 text-[10px] text-slate-400">
                        {c.category}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{c.tip}</p>
                  </div>
                  <button
                    aria-label={`Exportar card do item ${c.name}`}
                    onClick={() => setExportingItem(c)}
                    className="shrink-0 rounded-md border border-amber-800/40 bg-black/30 p-1.5 text-slate-400 transition-colors hover:border-amber-600 hover:text-amber-300 active:scale-[0.95]"
                    title="Exportar card do item"
                  >
                    <Image className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-lg border border-dashed border-amber-800/40 bg-black/20 p-8 text-center text-sm text-slate-400">
                Nenhum item encontrado com os filtros atuais. Tente limpar a busca ou alterar os filtros.
              </div>
            )}
          </div>
          {exportingItem && (
            <ItemCardDialog
              item={{
                ...exportingItem,
                collected: collected.has(exportingItem.key),
                collectedCount: catDone.get(exportingItem.category) ?? 0,
                categoryTotal: catTotal.get(exportingItem.category) ?? 0,
              }}
              collected={collected.has(exportingItem.key)}
              onClose={() => setExportingItem(null)}
            />
          )}
          {exportingCategory && (
            <CategoryCardDialog
              category={exportingCategory}
              items={exportingCategory === "__todas__" ? CODEX_ITEMS : CODEX_ITEMS.filter(c => c.category === exportingCategory)}
              collected={collected}
              catDone={catDone}
              catTotal={catTotal}
              onClose={() => setExportingCategory(null)}
            />
          )}
        </section>

        {/* Dicas de farm por categoria */}
        <section className="mt-10">
          <h2 className="gold-text text-2xl font-bold">Dicas de farm por categoria</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              { cat: "Equipamentos", tips: "Foque em UC Tier 1: Secret Mine, Bicheon Labyrinth 3F e Crystalline Forest. Mini-bosses de nível baixo dropam acessórios UC fáceis de registrar." },
              { cat: "Materiais", tips: "Magic Stone e Skill Tomes vêm das câmaras do Magic Square. Exorcism Bauble e Dragon Leather: Crystalline Forest. Greater Yang Pill e Unihorn Slice: Demon Bull Labyrinth." },
              { cat: "Consumíveis", tips: "Crafte caixas de Energia com Red Energy e registre cada tipo. Poções de cura UC saem de drops básicos — registre lotes de uma vez." },
              { cat: "Colecionáveis", tips: "Magical Soul Orb é coletado automaticamente. Verifique o menu de colecionáveis após cada evento — itens sazonais ficam registrados." },
              { cat: "Badges de Reputação", tips: "Missões de reputação diárias/semanais são a fonte principal. Combine badges que você não usa para completar tiers mais rápido." },
            ].map(d => (
              <div key={d.cat} className="rounded-lg border border-amber-900/40 bg-[oklch(0.19_0.015_280)] p-4">
                <h3 className="flex items-center gap-2 font-semibold text-amber-300">
                  <BookOpen className="h-4 w-4" /> {d.cat}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{d.tips}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
