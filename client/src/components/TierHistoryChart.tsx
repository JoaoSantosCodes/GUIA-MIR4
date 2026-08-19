import { useEffect, useRef } from "react";
import { CLASSES } from "@shared/guideData";

/**
 * Gráfico de linha em canvas puro: evolução semanal do tier comunitário
 * de cada classe em um cenário (dados de tierlist_history do backend).
 * Eixo Y: tiers S=4, A=3, B=2, C=1. Eixo X: semanas ISO (YYYY-Wnn).
 */
const CLASS_TIER_KEYS = ["warrior", "sorcerer", "taoist", "lancer", "arbalist", "darkist", "lionheart", "spiritsummoner"] as const;

function tierLevel(tier: string): number {
  switch (tier) {
    case "S": return 4;
    case "A": return 3;
    case "B": return 2;
    default: return 1;
  }
}

const COLORS = ["#fbbf24", "#f43f5e", "#a78bfa", "#34d399", "#60a5fa", "#fb923c", "#f472b6", "#94a3b8"];

export default function TierHistoryChart({
  data,
  scenarioLabel,
}: {
  data: { week: string; classKey: string; tier: string }[];
  scenarioLabel: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || data.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = 380;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const byClass = new Map<string, { week: string; tier: string }[]>();
    for (const row of data) {
      const list = byClass.get(row.classKey) ?? [];
      list.push({ week: row.week, tier: row.tier });
      byClass.set(row.classKey, list);
    }
    const weeks = Array.from(new Set(data.map(d => d.week))).sort();
    if (weeks.length === 0) return;

    const padX = 72;
    const padY = 44;
    const plotW = width - padX * 2;
    const plotH = height - padY - 60;

    // Fundo.
    ctx.fillStyle = "oklch(0.19 0.015 280)";
    ctx.fillRect(0, 0, width, height);

    // Título.
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 15px Georgia";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Evolução semanal — ${scenarioLabel}`, padX, 12);

    // Linhas de grade horizontais (tiers).
    ctx.strokeStyle = "rgba(251,191,36,0.12)";
    ctx.lineWidth = 1;
    for (let t = 1; t <= 4; t++) {
      const y = padY + plotH - ((t - 1) / 3) * plotH;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(width - padX, y);
      ctx.stroke();
      ctx.fillStyle = "rgba(148,163,184,0.9)";
      ctx.font = "12px Georgia";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(["C", "B", "A", "S"][t - 1], padX - 10, y);
    }

    // Séries por classe, na ordem fixa de CLASS_KEYS (ordem estável).
    let seriesIdx = 0;
    for (const classKey of CLASS_TIER_KEYS) {
      const list = byClass.get(classKey);
      if (!list) continue;
      const color = COLORS[seriesIdx % COLORS.length];
      seriesIdx += 1;
      list.sort((a, b) => weeks.indexOf(a.week) - weeks.indexOf(b.week));

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let started = false;
      for (const item of list) {
        const idx = weeks.indexOf(item.week);
        const x = padX + (weeks.length === 1 ? plotW / 2 : (idx / (weeks.length - 1)) * plotW);
        const y = padY + plotH - ((tierLevel(item.tier) - 1) / 3) * plotH;
        if (!started) { ctx.moveTo(x, y); started = true; } else { ctx.lineTo(x, y); }
      }
      ctx.stroke();

      for (const item of list) {
        const idx = weeks.indexOf(item.week);
        const x = padX + (weeks.length === 1 ? plotW / 2 : (idx / (weeks.length - 1)) * plotW);
        const y = padY + plotH - ((tierLevel(item.tier) - 1) / 3) * plotH;
        ctx.fillStyle = "oklch(0.19 0.015 280)";
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Rótulos X.
    ctx.fillStyle = "rgba(148,163,184,0.9)";
    ctx.font = "11px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(weeks[0], padX, padY + plotH + 10);
    if (weeks.length > 1) ctx.fillText(weeks[weeks.length - 1], width - padX, padY + plotH + 10);

    // Legenda (2 colunas).
    const legendY0 = height - 34;
    let col = 0;
    let colX = padX;
    seriesIdx = 0;
    for (const classKey of CLASS_TIER_KEYS) {
      if (!byClass.has(classKey)) continue;
      const color = COLORS[seriesIdx % COLORS.length];
      seriesIdx += 1;
      const name = (CLASSES.find(c => c.key === classKey)?.name) ?? classKey;
      const metrics = ctx.measureText(name);
      if (colX + metrics.width + 30 > width - padX) {
        col += 1;
        colX = padX;
      }
      ctx.fillStyle = color;
      ctx.fillRect(colX, legendY0 + col * 18, 12, 3);
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(148,163,184,0.95)";
      ctx.fillText(name, colX + 18, legendY0 + col * 18 + 2);
      colX += metrics.width + 44;
    }
  }, [data, scenarioLabel]);

  if (data.length === 0) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-lg border border-amber-900/40 bg-black/30 p-6 text-center">
        <p className="text-sm font-semibold text-amber-300">Histórico ainda vazio</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          O histórico acumula os tiers comunitários (S–C) semanalmente a partir dos votos registrados.
          Quanto mais votos a comunidade registrar, mais o gráfico evolui.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <canvas ref={canvasRef} className="w-full" />
    </div>
  );
}
