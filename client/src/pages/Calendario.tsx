import PageBanner from "@/components/guide/PageBanner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Filter, Lightbulb, Swords, Dices, Skull, RefreshCw, Repeat, Trophy } from "lucide-react";
import { GAME_EVENTS, EVENT_CATEGORIES, type GameEvent } from "@shared/guideData";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  guerra: <Swords className="h-4 w-4" />,
  dungeon: <Dices className="h-4 w-4" />,
  boss: <Skull className="h-4 w-4" />,
  diario: <RefreshCw className="h-4 w-4" />,
  semanal: <Repeat className="h-4 w-4" />,
  temporada: <Trophy className="h-4 w-4" />,
};

export default function Calendario() {
  const [active, setActive] = useState<string>("todos");

  const filtered = useMemo(
    () => (active === "todos" ? GAME_EVENTS : GAME_EVENTS.filter(e => e.category === active)),
    [active],
  );

  return (
    <div className="min-h-screen pb-16">
      <PageBanner
        title="Calendário de Eventos"
        subtitle="Guerras de Sabuk, Magic Square, bosses mundiais e os ciclos diários, semanais e de temporada do servidor"
      />

      <div className="container max-w-5xl space-y-8">
        {/* Aviso de horários */}
        <Card className="p-5 bg-gradient-to-br from-red-950/40 to-slate-900/60 border-amber-700/30">
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            Os horários abaixo são <strong className="text-amber-300">referências por região de servidor</strong>.
            Cada servidor da região tem seu próprio reset diário, e os horários dos eventos
            giram em torno dele — use o reset do <em>seu</em> servidor como âncora.
          </p>
          <div className="flex items-start gap-2 rounded-md border border-amber-700/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-100/90">
            <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
            <span>
              Referência de resets por região: <strong>ASIA</strong> ~03:35 · <strong>INMENA</strong>{" "}
              ~01:35 · <strong>EU</strong> ~21:35 · <strong>NA</strong> ~15:35 ·{" "}
              <strong>SA</strong> ~16:35 (horários aproximados, podem variar por servidor).
            </span>
          </div>
        </Card>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-slate-500 mr-1">
            <Filter className="h-3.5 w-3.5" /> Filtrar:
          </span>
          <Badge
            variant="outline"
            className={cn(
              "cursor-pointer border-slate-600 text-slate-300 hover:bg-slate-800",
              active === "todos" && "border-amber-600 text-amber-300 bg-amber-950/30",
            )}
            onClick={() => setActive("todos")}
          >
            Todos
          </Badge>
          {EVENT_CATEGORIES.map(c => (
            <Badge
              key={c.key}
              variant="outline"
              className={cn(
                "cursor-pointer hover:bg-slate-800",
                active === c.key ? `${c.border} ${c.color} bg-black/40` : "border-slate-700 text-slate-400",
              )}
              onClick={() => setActive(c.key)}
            >
              {c.label}
            </Badge>
          ))}
        </div>

        {/* Grade de eventos */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(event => (
            <EventCard key={event.key} event={event} />
          ))}
        </div>

        {/* Tabela de respawn Magic Square */}
        <section id="magic-square">
          <h2 className="text-2xl font-bold text-amber-400 mb-3 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Respawns fixos — Magic Square (horários do servidor)
          </h2>
          <Card className="p-6 bg-slate-900/60 border-amber-700/30 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-amber-300 border-b border-slate-700/60">
                  <th className="py-2 pr-4">Câmara / Drop</th>
                  <th className="py-2">Respawn</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800/60">
                  <td className="py-2.5 pr-4">Leader's Chamber I</td>
                  <td>Cada 30 minutos</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="py-2.5 pr-4">Leader's Chamber II</td>
                  <td>Cada 45 minutos</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="py-2.5 pr-4">Leader's Chamber III (Skill Tome)</td>
                  <td>03:00 · 06:00 · 09:00 · 12:00 · 15:00 · 18:00 · 21:00 · 00:00</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="py-2.5 pr-4">Caixa Verde (Green Box)</td>
                  <td>Cada 5 minutos</td>
                </tr>
                <tr className="border-b border-slate-800/60">
                  <td className="py-2.5 pr-4">Caixa Azul (Blue Box)</td>
                  <td>Cada 30 minutos</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4">Caixa Vermelha (Red Box)</td>
                  <td>Cada 1 hora</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </section>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: GameEvent }) {
  const cat = EVENT_CATEGORIES.find(c => c.key === event.category);
  return (
    <Card className="p-5 bg-slate-900/60 border-amber-700/30 flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-amber-300 leading-tight">{event.name}</h3>
        {cat && (
          <span className={cn("flex items-center gap-1 text-xs shrink-0 border rounded px-2 py-0.5", cat.border, cat.color, "bg-black/40")}>
            {CATEGORY_ICONS[event.category]}
            {cat.label}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{event.description}</p>
      <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto">
        <Clock className="h-3.5 w-3.5 shrink-0 text-amber-500/70" />
        <span>{event.schedule}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Calendar className="h-3.5 w-3.5 shrink-0 text-amber-500/70" />
        <span>Duração: {event.duration}</span>
      </div>
      <p className="text-xs text-emerald-300/80 border-t border-slate-800/60 pt-2">
        <strong className="text-emerald-400">Dica:</strong> {event.tip}
      </p>
    </Card>
  );
}
