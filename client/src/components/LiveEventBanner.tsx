import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Flame, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import type { UpcomingEvent } from "./EventNotificationsBell";

const POLL_INTERVAL_MS = 30_000;

/** Altura do banner quando visível (usada pelo layout para deslocar o header). */
export const LIVE_BANNER_HEIGHT_PX = 40;

/** Banner de "evento em andamento" no topo do site. */
export default function LiveEventBanner() {
  const region = localStorage.getItem("serverRegion") ?? "sa";
  const { data: alerts, isSuccess } = trpc.events.upcoming.useQuery(
    { regionKey: region },
    { refetchInterval: POLL_INTERVAL_MS, retry: false },
  );

  const activeEvents = useMemo<UpcomingEvent[]>(
    () => (isSuccess ? (alerts ?? []).filter((e: UpcomingEvent) => e.activeNow) : []),
    [isSuccess, alerts],
  );

  const [dismissed, setDismissed] = useState(false);
  const [dismissAt, setDismissAt] = useState<number>(0);

  // Reaparece quando a lista de ativos muda (novo ciclo)
  useEffect(() => {
    const keys = activeEvents.map(e => e.key).join(",");
    setDismissed(false);
    setDismissAt(0);
    void keys;
  }, [activeEvents]);

  // Tempo restante: decrementa um minuto a cada minuto a partir do momento em que
  // o banner apareceu (o servidor reporta apenas "ativo ou não"; não conhecemos o início exato).
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (activeEvents.length > 0) setDismissAt(n => (n === 0 ? Date.now() : n));
  }, [activeEvents]);

  const elapsedMin = dismissAt ? Math.max(0, Math.round((now - dismissAt) / 60000)) : 0;

  if (!isSuccess || dismissed || activeEvents.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed left-0 right-0 top-16 z-40 flex items-center justify-center gap-3 bg-gradient-to-r from-red-950 via-red-900 to-red-950 px-3 py-2 text-center",
        "border-b border-red-700/50",
      )}
    >
      <Flame className="h-4 w-4 shrink-0 animate-pulse text-red-400" />
      <p className="flex-1 text-xs font-medium text-amber-100 sm:text-sm">
        {activeEvents.length === 1
          ? `${activeEvents[0].name} está ACONTECENDO agora — restam ~${Math.max(1, estimatedRemaining(activeEvents[0], elapsedMin))} min`
          : `${activeEvents.map((e: UpcomingEvent) => e.name).join(", ")} em andamento — não perca o momento!}`}
      </p>
      <Link href="/calendario" className="hidden rounded bg-red-800 px-2 py-1 text-[11px] font-semibold text-amber-100 transition-colors hover:bg-red-700 sm:inline-block">
        Ver horários
      </Link>
      <button
        type="button"
        aria-label="Fechar banner"
        onClick={() => setDismissed(true)}
        className="shrink-0 text-red-300 transition-colors hover:text-amber-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Duração padrão dos eventos (usado para estimar o tempo restante na UI). */
const DURATION_MIN: Record<string, number> = {
  sabuk: 60,
  "ms-leader3": 45,
  "ms-box-red": 30,
};

function estimatedRemaining(event: UpcomingEvent, elapsedMin: number): number {
  const total = DURATION_MIN[event.key] ?? 60;
  return Math.max(1, total - elapsedMin);
}
