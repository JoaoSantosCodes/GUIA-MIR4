import PageBanner from "@/components/guide/PageBanner";
import FavButton from "@/components/guide/FavButton";
import CommentsSection from "@/components/guide/CommentsSection";
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
import { Sword, Crown, Users, Trophy, Castle, ScrollText } from "lucide-react";
import { SABUK_CONTENT, CONQUEST_INFO } from "@shared/guideData";

const ENTRY_ICONS: Record<string, React.ReactNode> = {
  "guerra-sabuk": <Sword className="h-5 w-5" />,
  "sabuk-clash": <Castle className="h-5 w-5" />,
  "recompensas-sabuk": <Trophy className="h-5 w-5" />,
  "estrategias-cerco": <Sword className="h-5 w-5" />,
  guilda: <Users className="h-5 w-5" />,
  "clan-match": <Crown className="h-5 w-5" />,
};

export default function Sabuk() {
  const { isAuthenticated } = useAuth();
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const isFavorite = (key: string) =>
    favorites?.some(f => f.itemId === `sabuk:${key}`) ?? false;

  return (
    <div className="min-h-screen pb-16">
      <PageBanner
        title="Guerra de Sabuk & Guildas"
        subtitle="Cerco ao castelo, Sabuk Clash entre servidores, mecânicas de clã e estratégias de conquista"
      />

      <div className="container max-w-4xl space-y-10">
        {/* Sabuk Clash — fluxograma do torneio */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-3 flex items-center gap-2">
            <Castle className="h-6 w-6" />
            A estrada até o trono: Sabuk Clash
          </h2>
          <Card className="p-6 bg-gradient-to-br from-red-950/40 to-slate-900/60 border-amber-700/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              {["16 clãs", "8 Monolitos", "4 finalistas", "1 Imperador"].map((step, i) => (
                <div key={step} className="relative">
                  <div className="rounded-lg border border-amber-700/40 bg-slate-900/70 px-3 py-4">
                    <div className="text-xs uppercase tracking-wider text-amber-500/70 mb-1">
                      {["Rodada 1", "Rodada 1", "Rodada 2", "Final"].at?.(i)}
                    </div>
                    <div className="text-lg font-bold text-amber-300">{step}</div>
                  </div>
                  {i < 3 && (
                    <span className="hidden md:block absolute top-1/2 -right-3 z-10 text-amber-500/70 font-bold">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Torneio regional de 3 semanas com 3 Gateways semanais:{" "}
              <strong className="text-amber-300">Attack Route</strong> →{" "}
              <strong className="text-amber-300">Castle Gate</strong> →{" "}
              <strong className="text-amber-300">Sabuk Castle</strong>. Apenas clãs que são
              Reis do Castelo de Bicheon no próprio servidor podem participar. Se nenhum
              Monolito for gravado nas rodadas 1 ou 2, o trono permanece vago.
            </p>
          </Card>
        </section>

        {/* Poderes do Imperador */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-3 flex items-center gap-2">
            <Crown className="h-6 w-6" />
            Poderes do Imperador
          </h2>
          <Card className="p-6 bg-slate-900/60 border-amber-700/30">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {[
                { label: "Nomear cargos", desc: "Distribui posições de governo aos membros do clã rei." },
                { label: "Impostos de Sabuk", desc: "Gerencia os impostos acumulados no Armazém de Sabuk." },
                { label: "Ajustar alíquotas", desc: "Define a taxa de cada moeda por servidor da região." },
                { label: "Premiar (Prizing)", desc: "Concede prêmios a personagens específicos." },
                { label: "Título Imperial", desc: "Concede título imperial a um clã da região." },
                { label: "Sabuk Destrier", desc: "Montura exclusiva: só o Imperador compra e monta." },
                { label: "Símbolo exclusivo", desc: "Emblema disponível somente para o clã do Imperador." },
                { label: "Decreto Imperial", desc: "Declara ou levanta decretos em servidores da região." },
                { label: "Voz do Imperador", desc: "Mensagens aparecem em todos os servidores da região." },
                { label: "Proclamação", desc: "Bicheon King envia mails no servidor; Imperador na região." },
              ].map(p => (
                <div key={p.label} className="flex gap-3">
                  <span className="text-amber-400 font-semibold whitespace-nowrap">• {p.label}:</span>
                  <span className="text-slate-300">{p.desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-400 border-t border-slate-700/50 pt-3">
              O clã vencedor recebe <strong className="text-amber-300">50.000 Clan Copper</strong>, e
              todos os usuários de todos os servidores recebem o{" "}
              <strong className="text-amber-300">Sabuk Emperor's Common Royal Gift</strong> no dia
              seguinte à final (ex.: Epic Dragon Oil of Blessing, Rare Dragonsteel Box).
            </p>
          </Card>
        </section>

        {/* Entradas expandíveis */}
        <section>
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <ScrollText className="h-6 w-6" />
            Guia completo
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {SABUK_CONTENT.map(entry => (
              <AccordionItem
                key={entry.key}
                value={entry.key}
                id={entry.key}
                className="rounded-lg border border-slate-700/60 bg-slate-900/50 px-4"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-amber-500">{ENTRY_ICONS[entry.key]}</span>
                    <span className="font-semibold text-slate-100">{entry.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">{entry.description}</p>
                  <ul className="space-y-2">
                    {entry.details.map((d, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-amber-500 shrink-0">{i + 1}.</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex justify-end">
                    <FavButton
                      itemId={`sabuk:${entry.key}`}
                      itemType="sabuk"
                      isFavorite={isFavorite(entry.key)}
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
              <FavButton itemId="sabuk:torre-conquista" itemType="sabuk" isFavorite={false} />
            </div>
          </Card>
        </section>

        {/* Comentários com votação */}
        <section id="dicas">
          <CommentsSection
            pageKey="sabuk"
            farmKey="geral"
            title="Dicas da comunidade: Guerra de Sabuk & Guildas"
            placeholder="Compartilhe uma estratégia de cerco ou dica de guilda... (máx. 300 caracteres)"
          />
        </section>
      </div>
    </div>
  );
}
