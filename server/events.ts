import { SERVER_REGIONS } from "../shared/guideData";

/** Timers fixos usados para alertas de eventos (horário do servidor da região). */
export const ALERT_TIMERS = [
  {
    key: "sabuk",
    name: "Guerra de Sabuk (Castle Siege)",
    hour: 21.5, // 21:30 horário do servidor
    durationHours: 1,
    description: "O cerco ao Castelo de Bicheon — chegue 15 minutos antes com o clã completo.",
    weekday: "weekend",
  },
  {
    key: "ms-leader3",
    name: "Leader's Chamber III (Skill Tome)",
    hour: 0,
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

/** Extrai componentes de data de um instante no fuso dado, sem parsing de string. */
function tzDateParts(date: Date, tz: string): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(date);
  const g = (type: string) => Number(parts.find(p => p.type === type)?.value ?? 0);
  return { y: g("year"), m: g("month"), d: g("day") };
}

/** Próxima ocorrência de um evento com dias da semana, no fuso de servidor. */
export function nextOccurrenceInTz(tz: string, days: string[], time: string, now: Date): Date | null {
  const [hh, mm] = time.split(":").map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  const dayMap: Record<string, number> = { dom: 0, "domingo": 0, seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, sáb: 6, sab: 6 };
  const targetDows = days.map(d => dayMap[d.toLowerCase().slice(0, 3)]).filter(Number.isFinite);
  if (targetDows.length === 0) return null;
  for (let d = 0; d < 8; d++) {
    const candidate = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
    const { y, m, d: dd } = tzDateParts(candidate, tz);
    const tzMidnight = Date.UTC(y, m - 1, dd);
    const dow = new Date(tzMidnight).getUTCDay();
    if (!targetDows.includes(dow)) continue;
    const occ = new Date(tzMidnight + (hh * 3600 + mm * 60) * 1000);
    if (occ.getTime() > now.getTime()) return occ;
  }
  return null;
}

/** Próxima ocorrência de respawn periódico (everyHours) no fuso de servidor. */
export function nextPeriodicInTz(tz: string, everyHours: number, now: Date): Date | null {
  const { y, m, d } = tzDateParts(now, tz);
  const midnight = Date.UTC(y, m - 1, d);
  const localHours = (now.getTime() - midnight) / 3600000;
  const cycleMs = everyHours * 60 * 60 * 1000;
  const nextMs = midnight + Math.ceil(localHours / everyHours) * cycleMs;
  if (nextMs <= now.getTime()) return new Date(nextMs + cycleMs);
  return new Date(nextMs);
}

export interface UpcomingAlert {
  key: string;
  name: string;
  minutesUntil: number;
  activeNow: boolean;
  description: string;
}

/** Calcula os próximos alertas de eventos para a região dada. */
export function computeUpcomingAlerts(regionKey: string, now: Date = new Date()): UpcomingAlert[] {
  const region = SERVER_REGIONS.find(r => r.key === regionKey) ?? SERVER_REGIONS[0];
  return ALERT_TIMERS.map(t => {
    let occ: Date | null = null;
    if (t.key === "sabuk") {
      occ = nextOccurrenceInTz(region.timezone, region.sabukDays, region.sabukTime, now);
    } else if ("everyHours" in t && t.everyHours) {
      occ = nextPeriodicInTz(region.timezone, t.everyHours ?? 1, now);
    }
    const mins = occ ? Math.round((occ.getTime() - now.getTime()) / 60000) : 999999;
    const activeNow = mins <= 0 || mins <= (t.durationHours ?? 0) * 60;
    return { key: t.key, name: t.name, minutesUntil: Math.max(0, mins), activeNow, description: t.description };
  }).sort((a, b) => a.minutesUntil - b.minutesUntil);
}
