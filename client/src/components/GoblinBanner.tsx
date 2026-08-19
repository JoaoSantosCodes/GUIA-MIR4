/**
 * Banner de alerta da Loja do Goblin de Ouro: aparece no topo do site quando o
 * evento (Bolo de Agradecimento até 1º/09 e loja até 14/09, horário coreano)
 * está a menos de 24 horas de terminar. O usuário pode dispensar por sessão.
 */
import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const useReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

/** Fim oficial da Loja do Goblin de Ouro (14 de setembro de 2026, 23:59 KST, UTC+9). */
const GOBLIN_END_MS = Date.UTC(2026, 8, 14, 14, 59, 0); // 2026-09-14T23:59+09:00
const DISMISS_KEY = "mir4-goblin-banner-dismissed";
const ALERT_WINDOW_MS = 24 * 60 * 60 * 1000;

function useCountdown(ms: number): number {
  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);
  return Math.max(0, ms - tick);
}

export default function GoblinBanner({ onVisibilityChange }: { onVisibilityChange?: (visible: boolean) => void }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return window.localStorage.getItem(DISMISS_KEY) === String(Date.now()).slice(0, 10);
    } catch {
      return false;
    }
  });
  const [collapsed, setCollapsed] = useState(false);
  const remainingMs = useCountdown(GOBLIN_END_MS);
  const reducedMotion = useReducedMotion();
  const visible = !dismissed && !collapsed && remainingMs > 0 && remainingMs < ALERT_WINDOW_MS;

  useEffect(() => {
    onVisibilityChange?.(visible);
  }, [visible, onVisibilityChange]);

  if (!visible) return null;

  const hours = Math.floor(remainingMs / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
  const urgent = remainingMs < 6 * 60 * 60 * 1000;

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()).slice(0, 10));
    } catch {
      // storage indisponível — apenas fecha visualmente
    }
    setDismissed(true);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex flex-wrap items-center gap-2 border-b-2 border-amber-500/70 bg-gradient-to-r from-red-950/95 via-red-900/90 to-amber-950/95 px-3 py-2 text-xs font-medium text-amber-100 backdrop-blur sm:px-5",
        urgent && !reducedMotion && "countdown-pulse",
        reducedMotion ? "" : "animate-in slide-in-from-top-2 fade-in duration-200",
      )}
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="font-bold text-amber-200">Última chamada — Loja do Goblin de Ouro:</span>{" "}
        <span className="hidden sm:inline">o Bolo de Agradecimento sai de linha em 1º/09 e a loja fecha em 14/09. </span>
        <span>Encerra em{" "}</span>
        <span className="font-bold tabular-nums text-white">
          {hours > 0 ? `${hours}h ` : ""}{minutes}min
        </span>
      </span>
      <button
        type="button"
        onClick={() => setCollapsed(c => !c)}
        className="rounded border border-amber-600/60 px-2 py-0.5 text-[10px] font-semibold text-amber-200 transition-colors hover:bg-amber-900/60 active:scale-[0.96]"
      >
        {collapsed ? "Mostrar" : "Lembrar depois"}
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fechar alerta da Loja do Goblin"
        className="rounded p-0.5 text-amber-300/80 transition-colors hover:bg-red-900/50 hover:text-amber-200 active:scale-[0.95]"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
