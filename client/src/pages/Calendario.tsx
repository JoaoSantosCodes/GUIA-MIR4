import PageBanner from "@/components/guide/PageBanner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Filter, Lightbulb, Swords, Dices, Skull, RefreshCw, Repeat, Trophy } from "lucide-react";
import { GAME_EVENTS, EVENT_CATEGORIES, SERVER_REGIONS, type GameEvent } from "@shared/guideData";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bell, BellRing } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  guerra: <Swords className="h-4 w-4" />,
  dungeon: <Dices className="h-4 w-4" />,
  boss: <Skull className="h-4 w-4" />,
  diario: <RefreshCw className="h-4 w-4" />,
  semanal: <Repeat className="h-4 w-4" />,
  temporada: <Trophy className="h-4 w-4" />,
};

/**
 * Horários fixos usados para notificações (horário do servidor).
 * Sabuk War: fim de semana ~21:30 do servidor (janela de 1h).
 * Leader's III do Magic Square: a cada 3h.
 */
const ALERT_TIMERS = [
  {
    key: "sabuk",
    name: "Guerra de Sabuk (Castle Siege)",
    hour: 21.5, // 21:30 horário do servidor
    durationHours: 1,
    description: "O cerco ao Castelo de Bicheon — chegue 15 minutos antes com o clã completo.",
    weekday: "weekend", // fim de semana
  },
  {
    key: "ms-leader3",
    name: "Leader's Chamber III (Skill Tome)",
    hour: 0, // horários fixos a cada 3h
    everyHours: 3,
    durationHours: 0.75,
    description: "Respawn da câmara que dropa Skill Tomes — vá com party para garantir o abate.",
  },
  {
    key: "ms-box-red",
    name: "Caixa Vermelha (Red Box) — Magic Square",
    hour: 0,
    everyHours: 1,
    durationHours: 0.5,
    description: "Red Box respawna a cada hora no Magic Square — combine com o timer do Leader's.",
  },
];

/** Calcula em quantos minutos um timer de servidor ocorre, dado um offset de reset local. */
function minutesUntil(timer: (typeof ALERT_TIMERS)[number], resetHour: number, now: Date): number {
  const nowMin = now.getHours() + now.getMinutes() / 60;
  if ("everyHours" in timer && timer.everyHours) {
    const cycle = timer.everyHours;
    const localHour = (nowMin - resetHour + 24) % 24;
    const next = Math.ceil(localHour / cycle) * cycle;
    return Math.round(((next === localHour ? cycle : next) - localHour) * 60);
  }
  const localHour = (timer.hour - resetHour + 24) % 24;
  let diffMin = (localHour - nowMin) * 60;
  if (diffMin <= 0) diffMin += 24 * 60;
  if ("weekday" in timer && timer.weekday === "weekend") {
    const dow = now.getDay(); // 0=domingo, 6=sábado
    const daysUntilWeekend = dow === 0 ? 6 : dow === 6 ? 0 : 6 - dow;
    diffMin += daysUntilWeekend * 24 * 60;
  }
  return Math.round(diffMin);
}

/** Regiões de servidor: horários de eventos expressos no fuso do servidor da região. */
const SERVER_RESET_HOUR = 16.58; // reset SA ~16:35 como âncora padrão

function useSelectedRegion(): [string, (r: string) => void] {
  const [region, setRegion] = useState(() => localStorage.getItem("serverRegion") ?? "sa");
  const setRegionPersisted = (r: string) => {
    localStorage.setItem("serverRegion", r);
    setRegion(r);
  };
  return [region, setRegionPersisted];
}

/** Extrai componentes de data (ano, mês, dia) de um instante no fuso dado, sem parsing de string. */
function tzDateParts(date: Date, tz: string): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(date);
  const g = (type: string) => Number(parts.find(p => p.type === type)?.value ?? 0);
  return { y: g("year"), m: g("month"), d: g("day") };
}

/** Meia-noite UTC correspondente à meia-noite local do fuso tz na mesma data local do instante dado. */
function tzMidnightReference(date: Date, tz: string): number {
  const { y, m, d } = tzDateParts(date, tz);
  return Date.UTC(y, m - 1, d);
}

/** Próxima ocorrência de um evento com dias da semana, dado um fuso (timezone) de servidor. */
function nextOccurrenceInTz(tz: string, days: string[], time: string): Date | null {
  const [hh, mm] = time.split(":").map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  const dayMap: Record<string, number> = { dom: 0, "domingo": 0, seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, sáb: 6, sab: 6 };
  const targetDows = days.map(d => dayMap[d.toLowerCase().slice(0, 3)]).filter(Number.isFinite);
  if (targetDows.length === 0) return null;
  const now = new Date();
  // Tenta cada alvo (dia+hora) em até 8 dias no fuso do servidor
  for (let d = 0; d < 8; d++) {
    const candidate = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
    const { y, m, d: dd } = tzDateParts(candidate, tz);
    const tzMidnight = Date.UTC(y, m - 1, dd); // meia-noite UTC == meia-noite local no fuso tz
    const tzDate = new Date(tzMidnight);
    const dow = tzDate.getUTCDay(); // dia da semana no fuso do servidor
    if (!targetDows.includes(dow)) continue;
    // Converte "YYYY-MM-DD HH:mm" no fuso tz para um instante UTC absoluto
    const tzLocal = new Date(tzMidnight + (hh * 3600 + mm * 60) * 1000);
    // tzMidnight já é a meia-noite local no tz; somar horas/minutos em tempo civil preserva o fuso
    const occ = tzLocal;
    if (occ.getTime() > now.getTime()) return occ;
  }
  return null;
}

/** Próxima ocorrência de respawn periódico (everyHours) no fuso do servidor. */
function nextPeriodicInTz(tz: string, everyHours: number): Date | null {
  const now = new Date();
  const { y, m, d } = tzDateParts(now, tz);
  // Meia-noite local do tz como timestamp UTC absoluto
  const midnight = Date.UTC(y, m - 1, d);
  // Horas decorridas no tempo civil do tz desde a meia-noite
  const localHours = (now.getTime() - midnight) / 3600000;
  const cycleMs = everyHours * 60 * 60 * 1000;
  const nextMs = midnight + Math.ceil(localHours / everyHours) * cycleMs;
  if (nextMs <= now.getTime()) return new Date(nextMs + cycleMs);
  return new Date(nextMs);
}

function useAlerts(regionKey: string) {
  const region = SERVER_REGIONS.find(r => r.key === regionKey) ?? SERVER_REGIONS[0];
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const alerts = useMemo(() => {
    return ALERT_TIMERS.map(t => {
      let occ: Date | null = null;
      if (t.key === "sabuk") {
        occ = nextOccurrenceInTz(region.timezone, region.sabukDays, region.sabukTime);
      } else if ("everyHours" in t && t.everyHours) {
        occ = nextPeriodicInTz(region.timezone, t.everyHours ?? 1);
      }
      const mins = occ ? Math.round((occ.getTime() - now.getTime()) / 60000) : 999999;
      const activeNow = mins <= 0 || mins <= (t.durationHours ?? 0) * 60;
      return { ...t, minsUntil: Math.max(0, mins), activeNow, occ };
    }).sort((a, b) => a.minsUntil - b.minsUntil);
  }, [now, region]);
  return alerts;
}

function formatCountdown(mins: number): string {
  if (mins <= 0) return "Agora!";
  if (mins >= 24 * 60) return `em ${Math.round(mins / (24 * 60))}d ${Math.round((mins % (24 * 60)) / 60)}h`;
  if (mins >= 60) return `em ${Math.round(mins / 60)}h${mins % 60 > 0 ? ` ${mins % 60}min` : ""}`;
  return `em ${mins}min`;
}

export default function Calendario() {
  const [active, setActive] = useState<string>("todos");
  const [regionKey, setRegionKey] = useSelectedRegion();
  const alerts = useAlerts(regionKey);
  const region = SERVER_REGIONS.find(r => r.key === regionKey) ?? SERVER_REGIONS[0];

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
              Escolha seu servidor abaixo para ver os timers no fuso dele.
            </span>
          </div>
        </Card>

        {/* Seletor de servidor */}
        <Card className="p-5 border-amber-700/30 bg-[oklch(0.19_0.015_280)]">
          <p className="text-sm font-medium text-amber-300 mb-3">Qual é o seu servidor?</p>
          <div className="flex flex-wrap gap-2">
            {SERVER_REGIONS.map(r => (
              <Badge
                key={r.key}
                variant="outline"
                className={cn(
                  "cursor-pointer px-3 py-1.5 border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors",
                  regionKey === r.key && "border-amber-600 text-amber-300 bg-amber-950/30",
                )}
                onClick={() => setRegionKey(r.key)}
              >
                {r.label} · Sabuk {r.sabukDays.join("/".slice(0)) ? r.sabukDays.join(" e ") : ""} {r.sabukTime}
              </Badge>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Sua escolha fica salva neste navegador. Os timers abaixo mostram a próxima ocorrência no fuso do servidor
            ({region.timezone}) convertida para o seu horário local.
          </p>
        </Card>

        {/* Notificações visuais de horários */}
        <section aria-label="Próximos eventos">
          <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Próximos horários — {region.label}
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            Contagem regressiva atualizada automaticamente. Sabuk: {region.sabukDays.join(" e ")} às {region.sabukTime} no
            fuso do servidor ({region.timezone}).
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {alerts.map(a => {
              const soon = a.minsUntil <= 60;
              const verySoon = a.minsUntil <= 15;
              return (
                <Card
                  key={a.key}
                  className={cn(
                    "relative p-4 border transition-colors",
                    verySoon
                      ? "border-red-500/70 bg-red-950/40"
                      : soon
                        ? "border-amber-500/60 bg-amber-950/30"
                        : "border-slate-700/60 bg-slate-900/60",
                  )}
                >
                  {verySoon && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                    </span>
                  )}
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                    <Bell className={cn("h-4 w-4", verySoon ? "text-red-400" : soon ? "text-amber-400" : "text-slate-500")} />
                    {a.name}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{a.description}</p>
                  <p className={cn("mt-2 text-sm font-bold", verySoon ? "text-red-400" : soon ? "text-amber-300" : "text-slate-300")}>
                    {verySoon ? "Agora / em breve!" : formatCountdown(a.minsUntil)}
                  </p>
                  {a.occ && (
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Próxima: {a.occ.toLocaleString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} (seu horário)
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </section>

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
