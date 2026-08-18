import { ECONOMY_TIPS, SECTION_IMAGES, CURRENCIES } from "@shared/guideData";
import PageBanner from "@/components/guide/PageBanner";
import CommentsSection from "@/components/guide/CommentsSection";
import FavButton from "@/components/guide/FavButton";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Coins, ShieldAlert, Gem, Store, TrendingUp, RefreshCcw, Lightbulb } from "lucide-react";

export default function Economy() {
  const { isAuthenticated } = useAuth();
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated });
  const isFav = favorites?.some(f => f.itemId === "economy:main") ?? false;

  return (
    <div>
      <PageBanner
        title="Economia"
        subtitle="Moedas, Darksteel, token DRACO, funcionamento do Mercado e dicas práticas de acumulação de riqueza. O coração da economia de MIR4 é o Darksteel — mine com estratégia."
        image={SECTION_IMAGES.economy}
        actions={<FavButton itemId="economy:main" itemType="economy" isFavorite={isFav} />}
      />
      <div className="container py-10">
        {/* Moedas */}
        <section id="moedas" className="scroll-mt-24">
          <h2 className="gold-text flex items-center gap-2 text-2xl font-bold"><Coins className="h-6 w-6 text-amber-500" /> Moedas do jogo</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-amber-800/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-900/40 bg-black/40 text-left">
                  <th className="px-4 py-3 font-semibold text-amber-300">Moeda</th>
                  <th className="px-4 py-3 font-semibold text-amber-300">Como obter</th>
                  <th className="px-4 py-3 font-semibold text-amber-300">Uso principal</th>
                </tr>
              </thead>
              <tbody>
                {CURRENCIES.map(c => (
                  <tr key={c.name} className="border-b border-amber-900/20 last:border-0 hover:bg-amber-900/10">
                    <td className="px-4 py-3 font-medium text-amber-200">{c.name}</td>
                    <td className="px-4 py-3 text-slate-300">{c.obtain}</td>
                    <td className="px-4 py-3 text-slate-300">{c.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Darksteel / DRACO */}
        <section id="draco" className="mt-10 scroll-mt-24">
          <h2 className="gold-text flex items-center gap-2 text-2xl font-bold"><Gem className="h-6 w-6 text-red-500" /> Darksteel e o token DRACO</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
              <h3 className="font-bold text-amber-300">A conversão</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                O Darksteel pode ser <strong className="text-amber-200">convertido em DRACO</strong> através do sistema de
                smelting: <span className="rounded border border-amber-700/50 bg-black/40 px-2 py-0.5 font-semibold text-amber-300">100.000 Darksteel = 1 DRACO</span>.
                No auge do play-to-earn (2021–2022), o DRACO chegou a valer centenas de dólares, atraindo milhões de
                jogadores.
              </p>
              <div className="mt-3 flex items-center gap-3 rounded-md border border-amber-900/40 bg-black/30 px-4 py-3">
                <RefreshCcw className="h-5 w-5 shrink-0 text-amber-500" />
                <p className="text-xs text-slate-300">
                  Rota histórica de cash-out: Darksteel → Smelting → DRACO → Exchange (WEMIX/Dragonfly) → fiat.
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-red-900/40 bg-red-950/15 p-5">
              <h3 className="font-bold text-red-300">Contexto atual</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                O valor do DRACO caiu drasticamente nos anos seguintes ao lançamento. Hoje, o foco da comunidade voltou
                ao <strong className="text-amber-200">valor in-game do Darksteel</strong>: upgrades de equipamento, crafting
                e trocas entre jogadores. Trate qualquer promessa de cash-out fácil como suspeita.
              </p>
            </div>
          </div>
        </section>

        {/* Mercado */}
        <section id="mercado" className="mt-10 scroll-mt-24">
          <h2 className="gold-text flex items-center gap-2 text-2xl font-bold"><Store className="h-6 w-6 text-amber-500" /> O Mercado (Market)</h2>
          <p className="mt-3 text-sm text-slate-300 max-w-3xl leading-relaxed">
            O Mercado desbloqueia por volta do <strong className="text-amber-200">nível 40–50</strong> e permite vender
            itens por Gold entre jogadores. Regras importantes:
          </p>
          <ol className="mt-3 space-y-2 text-sm text-slate-300 list-decimal list-inside max-w-3xl">
            <li>O sistema define faixas de preço por item — alguns itens são limitados a <strong className="text-amber-200">10 gold por transação</strong>.</li>
            <li>Itens craftados têm <strong className="text-amber-200">chance de se tornarem vendáveis</strong>; outros são permanentemente não-vendáveis.</li>
            <li>Venda em quantidade certa: materiais básicos rendem mais vendidos em lotes maiores.</li>
          </ol>
        </section>

        {/* Dicas */}
        <section id="dicas" className="mt-10 scroll-mt-24">
          <h2 className="gold-text flex items-center gap-2 text-2xl font-bold"><TrendingUp className="h-6 w-6 text-emerald-500" /> Dicas de acumulação de riqueza</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {ECONOMY_TIPS.map(t => (
              <div key={t.title} className="rounded-lg border border-amber-900/40 bg-[oklch(0.19_0.015_280)] p-4">
                <h3 className="font-semibold text-amber-300">{t.title}</h3>
                <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Segurança */}
        <section className="mt-10">
          <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-5">
            <h2 className="flex items-center gap-2 font-bold text-red-300"><ShieldAlert className="h-5 w-5" /> Alertas de segurança</h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Golpes fora do Mercado oficial são comuns: nunca confie em "trocas diretas" prometidas em chats ou redes
              sociais, e verifique sempre os itens antes de confirmar transações no Mercado. O jogo possui mecanismos de
              denúncia para <strong className="text-red-300">account sharing</strong>, <strong className="text-red-300">RMT</strong> e bots.
            </p>
          </div>
        </section>
      <section>
  <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
    <Lightbulb className="h-6 w-6" />
    Dicas da comunidade — Economy
  </h2>
  <CommentsSection pageKey="economy" farmKey="geral" title="Economy" />
</section>
</div>
    </div>
  );
}
