import PageBanner from "@/components/guide/PageBanner";
import FavButton from "@/components/guide/FavButton";
import CommentsSection from "@/components/guide/CommentsSection";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Gem, MapPin, Lightbulb, ArrowRight, CircleDollarSign } from "lucide-react";
import { SEAL_GUIDE, SEAL_ORDER, SEAL_STYLES, SEAL_OVERVIEW } from "@shared/guideData";

export default function Selos() {
  const { isAuthenticated } = useAuth();
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const isFavorite = (stage: string) =>
    favorites?.some(f => f.itemId === `seal:${stage.toLowerCase().replace(/\s/g, "-")}`) ?? false;

  return (
    <div className="min-h-screen pb-16">
      <PageBanner
        title="Selos & Geminação"
        subtitle="Progressão das Magic Stones lacradas, bônus por estágio e rotas de farm de Darksteel para cada selo"
      />

      <div className="container max-w-4xl space-y-10">
        {/* Intro */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-3 flex items-center gap-2">
            <Gem className="h-6 w-6" />
            O que são os Selos
          </h2>
          <Card className="p-6 bg-gradient-to-br from-red-950/40 to-slate-900/60 border-amber-700/30">
            <p className="text-sm text-slate-300 leading-relaxed">{SEAL_OVERVIEW.description}</p>
            <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-700/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-100/90">
              <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
              <span>{SEAL_OVERVIEW.tip}</span>
            </div>
          </Card>
        </section>

        {/* Fluxo dos estágios */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Gem className="h-6 w-6" />
            A cadeia de geminação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            {SEAL_ORDER.map((stage, i) => (
              <div key={stage} className="relative">
                <div className={`rounded-lg border px-4 py-5 ${SEAL_STYLES[stage].border} ${SEAL_STYLES[stage].bg}`}>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                    Estágio {i + 1}
                  </div>
                  <div className={`text-base font-bold ${SEAL_STYLES[stage].color}`}>{stage}</div>
                </div>
                {i < 2 && (
                  <span className="hidden md:block absolute top-1/2 -right-4 z-10 text-amber-500/70 font-bold">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
                {i < 2 && (
                  <span className="md:hidden block text-center text-amber-500/70 font-bold my-1">
                    <ArrowRight className="h-5 w-5 mx-auto rotate-90" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Guia por estágio */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Rotas de farm por estágio
          </h2>
          <div className="space-y-6">
            {SEAL_GUIDE.map(seal => {
              const sealKey = seal.stage.toLowerCase().replace(/\s/g, "-");
              return (
                <Card key={seal.stage} className="p-6 bg-slate-900/60 border-amber-700/30">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-md border px-3 py-1 text-sm font-bold ${SEAL_STYLES[seal.stage].border} ${SEAL_STYLES[seal.stage].bg} ${SEAL_STYLES[seal.stage].color}`}>
                        {seal.stage}
                      </span>
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        Estágio {seal.level} de 3
                      </Badge>
                    </div>
                    <FavButton itemId={`seal:${sealKey}`} itemType="seal" isFavorite={isFavorite(sealKey)} />
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-3">{seal.description}</p>

                  <p className="flex items-start gap-2 text-sm text-emerald-300/90 mb-4">
                    <CircleDollarSign className="h-4 w-4 mt-0.5 shrink-0" />
                    <span><strong>Bônus:</strong> {seal.bonus}</span>
                  </p>

                  <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wide mb-2">
                    Rotas recomendadas
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    {seal.route.map(r => (
                      <div key={r.name} className="rounded-md border border-slate-700/50 bg-slate-800/40 px-3 py-2.5 text-sm">
                        <span className="font-semibold text-amber-300">{r.name}</span>
                        <p className="mt-1 text-slate-400 leading-relaxed">{r.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-md border border-amber-700/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-100/90">
                    <span className="font-semibold text-amber-300">Como promover: </span>
                    {seal.howToUpgrade}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Comentários */}
        <section id="dicas">
          <CommentsSection
            pageKey="seal"
            farmKey="geral"
            title="Dicas da comunidade: Selos & Geminação"
            placeholder="Compartilhe uma dica sobre selos, geminação ou rotas de darksteel... (máx. 300 caracteres)"
          />
        </section>
      </div>
    </div>
  );
}
