import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot: number;
  vr: number;
  shape: "rect" | "circle";
}

const COLORS = ["#f5d76e", "#b8860b", "#f59e0b", "#a78bfa", "#fbbf24", "#fca5a5"];

/**
 * Chuva de confete dourado/roxo para celebrar o desbloqueio de uma conquista.
 * Respeita prefers-reduced-motion (não renderiza nada nesse caso).
 */
export default function AchievementConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);

    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: -20 - Math.random() * H * 0.6,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3,
      size: 4 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    let raf = 0;
    let running = true;
    const started = performance.now();

    const render = () => {
      if (!running || !ctx) return;
      ctx.clearRect(0, 0, W, H);
      const elapsed = performance.now() - started;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > H + 30) continue;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = elapsed < 2200 ? 0.95 : Math.max(0, 0.95 - (elapsed - 2200) / 600);
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (elapsed < 2800) {
        raf = requestAnimationFrame(render);
      }
    };
    raf = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
