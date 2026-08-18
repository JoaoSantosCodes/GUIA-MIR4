import { SECTION_IMAGES, LEVELING_GUIDE } from "@shared/guideData";
import PageBanner from "@/components/guide/PageBanner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BadgeCheck, MapPin, Lightbulb, Target } from "lucide-react";

export default function Leveling() {
  return (
    <div>
      <PageBanner
        title="Guia de Leveling"
        subtitle="Progressão nível a nível: do despertar em Byeoksan ao endgame de Sabuk e Nine Dragon. Saiba o que fazer, onde farmar e quais prioridades seguir em cada faixa."
        image={SECTION_IMAGES.hero}
      />
      <div className="container py-10">
        <div className="flex items-center gap-2 rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] px-4 py-3 text-sm text-slate-300">
          <Lightbulb className="h-4 w-4 shrink-0 text-amber-400" />
          <p>
            Siga as faixas em ordem. A XP por Quest Guide sempre supera a caça AFK — use o auto-combate
            como complemento, nunca como fonte principal.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-6" defaultValue="1-10">
          {LEVELING_GUIDE.map(band => (
            <AccordionItem key={band.range} value={band.range} id={`faixa-${band.range}`} className="scroll-mt-28 border-b border-amber-900/40">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <span className="flex h-9 w-20 shrink-0 items-center justify-center rounded-md border border-amber-600/50 bg-amber-950/40 font-mono text-sm font-bold text-amber-300">
                    {band.range}
                  </span>
                  <span className="font-semibold text-amber-100">{band.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-5 pb-5">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Objetivos */}
                  <div className="rounded-lg border border-amber-900/40 bg-black/25 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-amber-400">
                      <Target className="h-4 w-4" /> Objetivos da faixa
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {band.goals.map((g, i) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-300">
                          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500/80" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Zonas recomendadas */}
                  <div className="rounded-lg border border-amber-900/40 bg-black/25 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-amber-400">
                      <MapPin className="h-4 w-4" /> Zonas recomendadas
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {band.zones.map((z, i) => (
                        <li key={i} className="text-sm text-slate-300">
                          <span className="font-semibold text-amber-200">{z.name}</span>
                          <span className="text-slate-500"> — {z.note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Dicas */}
                <div className="rounded-lg border border-red-900/40 bg-red-950/10 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-red-300">
                    <Lightbulb className="h-4 w-4" /> Dicas essenciais
                  </h3>
                  <ul className="mt-3 space-y-1.5">
                    {band.tips.map((t, i) => (
                      <li key={i} className="text-sm text-slate-300 leading-relaxed">• {t}</li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-4 text-sm text-slate-400">
          <p>
            Faixas de nível indicativas — a progressão varia conforme a classe, o tempo de jogo e a
            participação em eventos. Consulte as páginas de{" "}
            <a href="/espiritos" className="text-amber-400 underline underline-offset-2">Espíritos</a>,{" "}
            <a href="/farm" className="text-amber-400 underline underline-offset-2">Locais de Farm</a> e{" "}
            <a href="/raids" className="text-amber-400 underline underline-offset-2">Raids e Bosses</a> para
            detalhes de cada zona e conteúdo mencionado.
          </p>
        </div>
      </div>
    </div>
  );
}
