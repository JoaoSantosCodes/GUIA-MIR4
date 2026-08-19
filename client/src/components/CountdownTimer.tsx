import { useEffect, useState } from "react";
import { Timer, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  /** ISO 8601 com fuso (ex.: "2026-09-14T23:59:00+08:00"). */
  endDate: string;
  label?: string;
  className?: string;
}

/**
 * Formata a diferença até uma data no formato "Xd Yh Zmin" (sem segundos —
 * atualiza a cada minuto, evitando re-renders excessivos).
 */
function formatRemaining(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const mins = totalMin % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${mins}min`);
  return parts.join(" ");
}

/**
 * Contador regressivo para eventos com vigência limitada.
 * Exibe "Resta Xd Yh Zmin"; nos últimos 15 minutos pulsa em vermelho;
 * após o fim exibe "Evento encerrado".
 */
export default function CountdownTimer({ endDate, label, className }: CountdownTimerProps) {
  const now = Date.now();
  const [target] = useState(() => new Date(endDate).getTime());
  const [remaining, setRemaining] = useState(() => target - now);

  useEffect(() => {
    const id = setInterval(() => setRemaining(target - Date.now()), 60000);
    return () => clearInterval(id);
  }, [target]);

  if (remaining <= 0) {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full border border-slate-700 bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-slate-500", className)}>
        <AlertTriangle className="h-3 w-3" /> {label ?? "Evento encerrado"}
      </span>
    );
  }

  const urgent = remaining < 15 * 60000;

  return (
    <span
      title={`Termina em ${formatRemaining(remaining)}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        urgent
          ? "countdown-pulse border-red-600 bg-red-950/40 text-red-300"
          : "border-amber-700/50 bg-amber-950/30 text-amber-300",
        className,
      )}
    >
      <Timer className="h-3 w-3" /> {urgent ? "Termina em breve" : "Resta"} {formatRemaining(remaining)}
    </span>
  );
}
