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

/** Offset em ms do fuso em um instante: tzLocalFields(at) - at.getTime() */
export function tzOffsetMs(at: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(at);
  const g = (type: string) => Number(parts.find(p => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"), g("second"));
  return asUtc - at.getTime();
}

/** Timestamp UTC correspondente à meia-noite local (00:00 no fuso tz) do dia dado. */
export function tzMidnightUtc(y: number, m: number, d: number, tz: string): number {
  const approx = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return Date.UTC(y, m - 1, d, 0, 0, 0) - tzOffsetMs(approx, tz);
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
    const tzMidnight = tzMidnightUtc(y, m, dd, tz);
    const dow = new Date(tzMidnight).getUTCDay();
    if (!targetDows.includes(dow)) continue;
    const occ = new Date(tzMidnight + (hh * 3600 + mm * 60) * 1000);
    if (occ.getTime() >= now.getTime()) return occ;
  }
  return null;
}

export interface PeriodicWindow {
  lastStart: Date;
  nextStart: Date;
}

/** Janela do respawn periódico (everyHours) no fuso de servidor. */
export function periodicWindowInTz(tz: string, everyHours: number, now: Date): PeriodicWindow {
  const { y, m, d } = tzDateParts(now, tz);
  const midnight = tzMidnightUtc(y, m, d, tz);
  const localHours = (now.getTime() - midnight) / 3600000;
  const cycleMs = everyHours * 60 * 60 * 1000;
  const lastStartedMs = midnight + Math.floor(localHours / everyHours) * cycleMs;
  return { lastStart: new Date(lastStartedMs), nextStart: new Date(lastStartedMs + cycleMs) };
}

/** Próxima ocorrência de respawn periódico (everyHours) no fuso de servidor. */
export function nextPeriodicInTz(tz: string, everyHours: number, now: Date): Date {
  return periodicWindowInTz(tz, everyHours, now).nextStart;
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
    const durationMin = Math.max(0, (t.durationHours ?? 0) * 60);
    const tz = region.timezone;
    if ("everyHours" in t && t.everyHours) {
      // Evento periódico: usa a janela lastStart/nextStart para derivar activeNow.
      const { lastStart, nextStart } = periodicWindowInTz(tz, t.everyHours, now);
      const startedAgoMs = now.getTime() - lastStart.getTime();
      const activeNow = startedAgoMs >= 0 && startedAgoMs < durationMin * 60000;
      return {
        key: t.key,
        name: t.name,
        minutesUntil: activeNow ? 0 : Math.max(0, Math.round((nextStart.getTime() - now.getTime()) / 60000)),
        activeNow,
        description: t.description,
      };
    }
    const occ = nextOccurrenceInTz(tz, region.sabukDays, region.sabukTime, now);
    if (!occ) {
      return { key: t.key, name: t.name, minutesUntil: 999999, activeNow: false, description: t.description };
    }
    // Sabuk: ao vivo a partir do início até fim da duração (baseado no próximo start).
    const futureMins = Math.round((occ.getTime() - now.getTime()) / 60000);
    if (futureMins <= 0) {
      const activeNow = -futureMins < durationMin;
      return { key: t.key, name: t.name, minutesUntil: 0, activeNow, description: t.description };
    }
    return { key: t.key, name: t.name, minutesUntil: futureMins, activeNow: false, description: t.description };
  }).sort((a, b) => a.minutesUntil - b.minutesUntil);
}
