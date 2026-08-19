import { useEffect, useRef } from "react";
import { ATTR_LABELS, ATTRIBUTES, type Scenario } from "@/lib/pvpCompare";

/**
 * Gráfico de radar (canvas puro, sem dependências) para comparar duas builds
 * nos atributos Dano, Defesa e Utilidade em um cenário.
 *
 * - Class A: contorno dourado com preenchimento âmbar translúcido
 * - Class B: contorno vermelho com preenchimento vermelho translúcido
 */
export interface RadarSeries {
  key: string;
  name: string;
  values: { dano: number; defesa: number; utilidade: number };
}

export function drawRadarChart(
  canvas: HTMLCanvasElement,
  seriesA: RadarSeries,
  seriesB: RadarSeries,
  scenario: Scenario,
  opts: { light?: boolean } = {},
): void {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height) || 300;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const light = !!opts.light;
  const gridColor = light ? "rgba(15, 10, 8, 0.18)" : "rgba(217, 119, 6, 0.25)";
  const axisColor = light ? "rgba(15, 10, 8, 0.35)" : "rgba(217, 119, 6, 0.4)";
  const labelColor = light ? "rgba(15, 10, 8, 0.75)" : "rgba(251, 191, 36, 0.95)";

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.36;
  const labels = ATTRIBUTES.map(a => ATTR_LABELS[a]);
  const n = labels.length;
  const step = (Math.PI * 2) / n;
  const angle = (i: number) => -Math.PI / 2 + i * step;

  ctx.clearRect(0, 0, size, size);

  // Grade concêntrica
  for (let ring = 1; ring <= 4; ring++) {
    const r = (radius * ring) / 4;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const a = angle(i % n);
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Eixos + rótulos
  ctx.font = "600 12px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < n; i++) {
    const a = angle(i);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(a), cy + radius * Math.sin(a));
    ctx.strokeStyle = axisColor;
    ctx.stroke();
    const lx = cx + (radius + 18) * Math.cos(a);
    const ly = cy + (radius + 18) * Math.sin(a);
    ctx.fillStyle = labelColor;
    ctx.fillText(labels[i], lx, ly);
  }

  const polygon = (series: RadarSeries, color: string, fill: string) => {
    const vals = [series.values.dano, series.values.defesa, series.values.utilidade];
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const idx = i % n;
      const v = Math.min(100, Math.max(0, vals[idx])) / 100;
      const a = angle(idx);
      const x = cx + radius * v * Math.cos(a);
      const y = cy + radius * v * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  polygon(seriesA, "#f59e0b", "rgba(245, 158, 11, 0.16)");
  polygon(seriesB, "#ef4444", "rgba(239, 68, 68, 0.16)");
}

/** React wrapper do radar chart. */
export default function RadarChart({
  seriesA,
  seriesB,
  scenario,
  className,
}: {
  seriesA: RadarSeries;
  seriesB: RadarSeries;
  scenario: Scenario;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawRadarChart(canvas, seriesA, seriesB, scenario);
  }, [seriesA, seriesB, scenario]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "auto", maxWidth: 300 }}
    />
  );
}
