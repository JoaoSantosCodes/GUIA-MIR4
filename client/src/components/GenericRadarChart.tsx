import { useEffect, useRef } from "react";

/**
 * Radar chart genérico em canvas puro para qualquer conjunto de atributos
 * (usado na tier list de espíritos com rótulos próprios por dimensão).
 */
export interface GenericRadarSeries {
  key: string;
  name: string;
  values: number[]; // 0-100, na ordem dos labels
}

export function drawGenericRadar(
  canvas: HTMLCanvasElement,
  series: GenericRadarSeries[],
  labels: string[],
  options: { colorA: string; colorB: string; showLegend: boolean; labelColor?: string },
): void {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement?.getBoundingClientRect();
  const size = Math.floor(Math.min(rect?.width ?? 200, 240));
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.32;
  const n = labels.length || series[0]?.values.length || 0;
  const labelColor = options.labelColor ?? "#94a3b8";

  // Grade (polígonos concêntricos).
  for (let ring = 1; ring <= 4; ring++) {
    const r = (radius / 4) * ring;
    ctx.strokeStyle = "rgba(251,191,36,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Eixos.
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    ctx.strokeStyle = "rgba(148,163,184,0.25)";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.stroke();

    // Rótulos.
    const lx = cx + (radius + 16) * Math.cos(angle);
    const ly = cy + (radius + 16) * Math.sin(angle);
    ctx.fillStyle = labelColor;
    ctx.font = "10px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(labels[i], lx, ly);
  }

  // Séries.
  const colors = [options.colorA, options.colorB].filter(c => c && c !== "transparent");
  series.forEach((s, idx) => {
    const color = colors[idx % colors.length] ?? "#fbbf24";
    ctx.fillStyle = color === "#f43f5e" ? "rgba(244,63,94,0.18)" : "rgba(251,191,36,0.18)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const v = Math.min(100, Math.max(0, s.values[i] ?? 0));
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = cx + radius * (v / 100) * Math.cos(angle);
      const y = cy + radius * (v / 100) * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < n; i++) {
      const v = Math.min(100, Math.max(0, s.values[i] ?? 0));
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = cx + radius * (v / 100) * Math.cos(angle);
      const y = cy + radius * (v / 100) * Math.sin(angle);
      ctx.fillStyle = "#0f0f0f";
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  });
}

export default function GenericRadarChart({
  series,
  labels,
  colorA = "#fbbf24",
  colorB = "#f43f5e",
  height = 150,
  showLegend = true,
}: {
  series: GenericRadarSeries[];
  labels: string[];
  colorA?: string;
  colorB?: string;
  height?: number;
  showLegend?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawGenericRadar(canvas, series, labels, { colorA, colorB, showLegend });
  }, [series, labels, colorA, colorB, showLegend]);

  return (
    <div ref={wrapRef}>
      <canvas ref={canvasRef} />
      {showLegend && (
        <div className="mt-1 flex items-center justify-center gap-4">
          {series.map((s, idx) => {
            const color = idx === 0 ? colorA : colorB;
            return (
              <span key={s.key} className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                {s.name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
