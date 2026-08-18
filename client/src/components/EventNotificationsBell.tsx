import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

const POLL_INTERVAL_MS = 30_000;
const SOON_THRESHOLD_MIN = 15;
const ACTIVE_THRESHOLD_MIN = 5;
const NOTIFICATION_COOLDOWN_KEY = "eventNotificationCooldown";

export interface UpcomingEvent {
  key: string;
  name: string;
  minutesUntil: number;
  activeNow: boolean;
  description: string;
}

/**
 * Polls a lightweight countdown endpoint and renders a header bell with:
 * - badge count of events starting within the threshold
 * - toast notification when an event enters the "soon" window
 * - popover listing upcoming events
 */
export default function EventNotificationsBell() {
  const region = localStorage.getItem("serverRegion") ?? "sa";
  const { data: alerts, isSuccess } = trpc.events.upcoming.useQuery(
    { regionKey: region },
    { refetchInterval: POLL_INTERVAL_MS, retry: false },
  );

  const [countdown, setCountdown] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setCountdown(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const events = useMemo<UpcomingEvent[]>(
    () => (isSuccess ? (alerts ?? []) : []),
    [isSuccess, alerts],
  );

  const soonEvents = useMemo(
    () => events.filter(e => !e.activeNow && e.minutesUntil <= SOON_THRESHOLD_MIN && e.minutesUntil >= 0).sort((a, b) => a.minutesUntil - b.minutesUntil),
    [events],
  );
  const activeEvents = useMemo(() => events.filter(e => e.activeNow), [events]);
  const upcomingOthers = useMemo(
    () => events.filter(e => !e.activeNow && !(soonEvents.some(s => s.key === e.key))).slice(0, 4),
    [events, soonEvents],
  );

  const lastNotified = useRef<string>(localStorage.getItem(NOTIFICATION_COOLDOWN_KEY) ?? "");

  // Toast whenever a soon event first appears (cooldown prevents spam across tabs)
  useEffect(() => {
    if (soonEvents.length === 0) return;
    const top = soonEvents[0];
    if (lastNotified.current === top.key) return;
    lastNotified.current = top.key;
    localStorage.setItem(NOTIFICATION_COOLDOWN_KEY, top.key);
    toast.warning(`${top.name} em ${Math.max(0, Math.round(top.minutesUntil))} min`, {
      description: top.description,
      action: { label: "Ver calendário", onClick: () => (window.location.href = "/calendario") },
      duration: 20000,
    });
  }, [soonEvents]);

  const badgeCount = soonEvents.length + activeEvents.length;

  if (!isSuccess) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notificações de eventos"
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-md border transition-colors",
            soonEvents.length > 0
              ? "border-red-700/70 bg-red-950/50 text-red-300 hover:bg-red-900/40"
              : "border-amber-700/50 text-amber-200 hover:bg-amber-900/30",
          )}
        >
          <Bell className={cn("h-4 w-4", soonEvents.length > 0 && "animate-pulse")} />
          {badgeCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-amber-50">
              {badgeCount > 9 ? "9+" : badgeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 bg-[oklch(0.17_0.015_280)] border-amber-700/50 p-3">
        <p className="gold-text text-sm font-bold">Eventos próximos</p>
        <p className="mt-0.5 text-xs text-slate-400">Horários do servidor {region.toUpperCase()} — atualizado a cada 30s.</p>

        <div className="mt-3 space-y-2">
          {activeEvents.length === 0 && soonEvents.length === 0 && upcomingOthers.length === 0 && (
            <p className="py-4 text-center text-xs text-slate-500">Nenhum evento próximo. Confira o calendário completo.</p>
          )}

          {activeEvents.map(e => (
            <div key={e.key} className="rounded-md border border-red-700/60 bg-red-950/40 p-2.5">
              <p className="text-xs font-bold text-red-300">AO VIVO — {e.name}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{e.description}</p>
            </div>
          ))}

          {soonEvents.map(e => (
            <div key={e.key} className="rounded-md border border-amber-600/60 bg-amber-950/30 p-2.5">
              <p className="text-xs font-bold text-amber-300">Em {Math.max(0, Math.round(e.minutesUntil))} min — {e.name}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{e.description}</p>
            </div>
          ))}

          {upcomingOthers.map(e => (
            <Tooltip key={e.key}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-md border border-amber-800/40 bg-[oklch(0.19_0.015_280)] px-2.5 py-2">
                  <ClockBadge minutes={e.minutesUntil} />
                  <p className="truncate text-xs text-slate-300">{e.name}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-56 text-xs">
                {e.description}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Link href="/calendario" className="mt-3 block rounded-md bg-red-800 px-3 py-1.5 text-center text-xs font-medium text-amber-100 transition-colors hover:bg-red-700">
          Abrir calendário completo
        </Link>
      </PopoverContent>
    </Popover>
  );
}

function ClockBadge({ minutes }: { minutes: number }) {
  const absMin = Math.max(0, Math.round(minutes));
  const h = Math.floor(absMin / 60);
  const m = absMin % 60;
  return (
    <span className="shrink-0 rounded border border-amber-700/50 px-1.5 py-0.5 font-mono text-[10px] text-amber-300">
      {h > 0 ? `${h}h${m > 0 ? String(m).padStart(2, "0") : ""}` : `${m}min`}
    </span>
  );
}
