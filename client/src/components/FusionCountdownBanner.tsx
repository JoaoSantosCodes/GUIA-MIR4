/**
 * Banner de contagem regressiva da manutenção da Fusão de Servidores (Capítulo 21).
 * Aparece no cabeçalho até 01/09/2026 (início da manutenção, hora oficial da Wemade)
 * e destaca o Passe de Viagem promocional (500 Copper, nível 40+), que expira nessa data.
 * O usuário pode dispensar por sessão, assim como os demais banners do site.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Hourglass, X, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

const useReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

/** Início oficial da manutenção da Fusão de Servidores (1º de setembro de 2026, 00:00 UTC+8). */
const FUSION_START_MS = Date.UTC(2026, 8, 0, 16, 0, 0); // 2026-09-01T00:00+08:00 → 2026-08-31T16:00Z
const DISMISS_KEY = "mir4-fusion-banner-dismissed";

function useCountdown(targetMs: number): number {
  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  return Math.max(0, targetMs - tick);
}

/** Retorna 10/09: dias, horas, minutos e segundos restantes de forma determinística para o ticker. */
function formatCountdown(remainingMs: number): { label: string; short: string } {
  if (remainingMs <= 0) return { label: "Manutenção em andamento", short: "Agora" };
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const label = days > 0
    ? `${days}d ${pad(hours)}h ${pad(minutes)}min`
    : `${pad(hours)}h ${pad(minutes)}min ${pad(seconds)}s`;
  const short = days > 0 ? `${days}d ${pad(hours)}h` : `${pad(hours)}:${pad(minutes)}`;
  return { label, short };
}

export default function FusionCountdownBanner({ onVisibilityChange }: { onVisibilityChange?: (visible: boolean) => void }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return window.localStorage.getItem(DISMISS_KEY) === String(Date.now()).slice(0, 10);
    } catch {
      return false;
    }
  });
  const [collapsed, setCollapsed] = useState(false);
  const remainingMs = useCountdown(FUSION_START_MS);
  const reducedMotion = useReducedMotion();
  const visible = !dismissed && !collapsed && remainingMs > 0;

  useEffect(() => {
    onVisibilityChange?.(visible);
  }, [visible, onVisibilityChange]);

  if (!visible) return null;

  const { label, short } = formatCountdown(remainingMs);
  const urgent = remainingMs < 48 * 60 * 60 * 1000;

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()).slice(0, 10));
    } catch {
      // storage indisponível — apenas fecha visualmente
    }
    setDismissed(true);
  };

  return (
    <Link
      href="/novidades"
      aria-label="Ver detalhes da Fusão de Servidores (abre em 01/09)"
      className="block"
    >
      <div
        role="alert"
        aria-live="polite"
        className={cn(
          "flex flex-wrap items-center gap-2 border-b-2 border-amber-500/70 bg-gradient-to-r from-[oklch(0.18_0.02_140)] via-[oklch(0.2_0.05_280)] to-[oklch(0.25_0.06_85_/_0.95)] px-3 py-2 text-xs font-medium text-amber-100 backdrop-blur",
          urgent && !reducedMotion && "countdown-pulse",
          reducedMotion ? "" : "animate-in slide-in-from-top-2 fade-in duration-200",
        )}
        data-testid="fusion-countdown-banner"
      >
        <Hourglass className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="font-bold text-amber-200">Fusão de Servidores em </span>
          <span className="font-bold tabular-nums text-white">{short}</span>
          <span className="hidden sm:inline"> — compre o Passe de Viagem promocional (500 Copper) antes da manutenção. </span>
          <span className="sm:hidden"> — Passe promocional até 01/09. </span>
          <span className="text-amber-200/80">{label}</span>
        </span>
        <span className="flex items-center gap-1 text-amber-300/90">
          <Ticket className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Nível 40+ · </span>
        </span>
        <button
          type="button"
          onClick={e => { e.preventDefault(); setCollapsed(c => !c); }}
          className="rounded border border-amber-600/60 px-2 py-0.5 text-[10px] font-semibold text-amber-200 transition-colors hover:bg-amber-900/60 active:scale-[0.96]"
        >
          {collapsed ? "Mostrar" : "Lembrar depois"}
        </button>
        <button
          type="button"
          onClick={e => { e.preventDefault(); dismiss(); }}
          aria-label="Fechar banner da Fusão de Servidores"
          className="rounded p-0.5 text-amber-300/80 transition-colors hover:bg-amber-900/50 hover:text-amber-200 active:scale-[0.95]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </Link>
  );
}
