import PageBanner from "@/components/guide/PageBanner";
import FavButton from "@/components/guide/FavButton";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookOpen, MapPin, Gift, Lightbulb, Castle, Flame } from "lucide-react";
import { MYSTERIES, CONQUEST_INFO } from "@shared/guideData";

export default function Misterios() {
  const { isAuthenticated } = useAuth();
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const isFavorite = (key: string) =>
    favorites?.some(f => f.itemId === `mystery:${key}`) ?? false;

  return (
    <div className="min-h-screen pb-16">
      <PageBanner
        title="Mistérios & Torre da Conquista"
        subtitle="Cadeias de mistérios secretos, atributos permanentes e a progressão de edifícios que destrava todo o conteúdo do jogo"
      />

      <div className="container max-w-4xl space-y-10">
        {/* Intro */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-3 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            O que são os Mistérios
          </h2>
          <Card className="p-6 bg-gradient-to-br from-violet-950/40 to-slate-900/60 border-amber-700/30">
            <p className="text-sm text-slate-300 leading-relaxed">
              Os <strong className="text-amber-300">Mysteries</strong> são cadeias de quests
              ocultas espalhadas pelo mundo de MIR4. Cada cadeia exige completar múltiplas
              requests e tasks em sequência (uma destrava a seguinte) e recompensa com{" "}
              <strong className="text-amber-300">atributos permanentes</strong> — que valem para
              todas as classes — além de ser{" "}
              <strong className="text-amber-300">pré-requisito para promover edifícios</strong> da
              Torre da Conquista. Ignorar mistérios cedo significa travar o endgame depois.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-700/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-100/90">
              <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
              <span>
                A melhor janela para resolver mistérios é durante o leveling: as primeiras
                cadeias acontecem em áreas de nível baixo (Bicheon Town, Ginkgo Valley) que você
                já vai visitar.
              </span>
            </div>
          </Card>
        </section>

        {/* Mistérios */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            As 5 grandes cadeias de mistério
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {MYSTERIES.map(m => (
              <AccordionItem
                key={m.key}
                value={m.key}
                id={m.key}
                className="rounded-lg border border-slate-700/60 bg-slate-900/50 px-4"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-amber-500">
                      <Flame className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-slate-100">{m.name}</span>
                    <Badge variant="outline" className="ml-2 border-slate-600 text-slate-400 text-xs">
                      {m.location}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ol className="space-y-2 mb-4">
                    {m.steps.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-amber-500 font-semibold shrink-0">
                          {i + 1}º passo:
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="flex items-start gap-2 rounded-md border border-violet-700/30 bg-violet-950/30 px-4 py-3 text-sm text-violet-100/90">
                    <Gift className="h-4 w-4 mt-0.5 shrink-0 text-violet-400" />
                    <span>
                      <strong>Recompensa:</strong> {m.reward}
                    </span>
                  </div>
                  <div className="mt-2 flex items-start gap-2 text-sm text-amber-200/90">
                    <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
                    <span>{m.tip}</span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <FavButton
                      itemId={`mystery:${m.key}`}
                      itemType="mystery"
                      isFavorite={isFavorite(m.key)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Torre da Conquista */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-3 flex items-center gap-2">
            <Castle className="h-6 w-6" />
            Torre da Conquista
          </h2>
          <Card className="p-6 bg-slate-900/60 border-amber-700/30">
            <p className="text-sm text-slate-300 leading-relaxed mb-5">{CONQUEST_INFO.description}</p>
            <div className="grid md:grid-cols-2 gap-3">
              {CONQUEST_INFO.buildings.map(b => (
                <div
                  key={b.name}
                  className="rounded-md border border-slate-700/50 bg-slate-800/40 px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-amber-300">{b.name}:</span>{" "}
                  <span className="text-slate-300">{b.role}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-md border border-amber-700/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-100/90">
              <Badge variant="outline" className="border-amber-600/60 text-amber-300 mb-2">
                Dica essencial
              </Badge>
              <p>{CONQUEST_INFO.tip}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <FavButton itemId="mystery:torre-conquista" itemType="mystery" isFavorite={false} />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
