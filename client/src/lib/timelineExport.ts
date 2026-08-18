/**
 * Exporta a atividade da timeline do usuário como um card de imagem (PNG).
 * Desenha o card em um canvas 2D (sem dependências externas) e dispara o download.
 */

interface TimelineExportItem {
  ts: number;
  kind: "fav" | "vote" | "codex";
  title: string;
  section: string;
}

interface ExportOptions {
  userName: string;
  goldBadges: number;
  items: TimelineExportItem[];
  onDone?: () => void;
}

const KIND_LABEL: Record<TimelineExportItem["kind"], string> = {
  fav: "Favorito",
  vote: "Voto",
  codex: "Codex",
};

const WIDTH = 1200;
const HEADER_H = 300;
const FOOTER_H = 90;
const ITEM_H = 64;
const GAP = 12;
const MARGIN = 48;

export async function exportTimelineCard({ userName, goldBadges, items, onDone }: ExportOptions): Promise<void> {
  const canvas = document.createElement("canvas");
  const maxItems = Math.min(items.length, 8);
  const listH = maxItems * ITEM_H + (maxItems - 1) * GAP;
  canvas.width = WIDTH;
  canvas.height = HEADER_H + listH + FOOTER_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado neste navegador");

  // Fundo gradiente escuro
  const bg = ctx.createLinearGradient(0, 0, WIDTH, canvas.height);
  bg.addColorStop(0, "#140b0e");
  bg.addColorStop(0.5, "#1c0e10");
  bg.addColorStop(1, "#10080a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, canvas.height);

  // Borda dourada
  ctx.strokeStyle = "#b45309";
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, WIDTH - 6, canvas.height - 6);

  // Linha decorativa dourada sob o header
  ctx.fillStyle = "#b8860b";
  ctx.fillRect(MARGIN, HEADER_H - 18, WIDTH - MARGIN * 2, 2);

  // Cabeçalho
  ctx.fillStyle = "#f5d76e";
  ctx.font = "bold 54px Georgia, serif";
  ctx.textBaseline = "top";
  ctx.fillText("Guia MIR4", MARGIN, 44);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "28px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(`Atividade de ${userName}`, MARGIN, 120);

  if (goldBadges > 0) {
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(`★ ${goldBadges} Dica${goldBadges !== 1 ? "s" : ""} de Ouro`, MARGIN, 170);
  } else {
    ctx.fillStyle = "#9ca3af";
    ctx.font = "24px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("Explorando o mundo de MIR4", MARGIN, 170);
  }

  // Linha do tempo
  let y = HEADER_H;
  for (let i = 0; i < maxItems; i++) {
    const t = items[i];
    // ponto na linha
    ctx.beginPath();
    ctx.arc(MARGIN + 8, y + ITEM_H / 2, 10, 0, Math.PI * 2);
    ctx.fillStyle = t.kind === "fav" ? "#f59e0b" : t.kind === "vote" ? "#34d399" : "#94a3b8";
    ctx.fill();
    // rótulo de data + seção
    ctx.fillStyle = "#8b94a0";
    ctx.font = "18px 'Segoe UI', Arial, sans-serif";
    const dateStr = new Date(t.ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    ctx.fillText(`${dateStr} · ${t.section} · ${KIND_LABEL[t.kind]}`, MARGIN + 32, y + 6);
    // título
    ctx.fillStyle = "#f3f4f6";
    ctx.font = "22px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(truncate(t.title, 90), MARGIN + 32, y + 32);
    y += ITEM_H + GAP;
  }

  if (items.length > maxItems) {
    ctx.fillStyle = "#9ca3af";
    ctx.font = "18px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(`e mais ${items.length - maxItems} atividades…`, MARGIN + 32, y + 18);
  }

  // Rodapé
  ctx.fillStyle = "#b8860b";
  ctx.fillRect(0, canvas.height - FOOTER_H + 10, WIDTH, 2);
  ctx.fillStyle = "#8b94a0";
  ctx.font = "18px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("mir4guia-ab8pnzuc.manus.space", WIDTH / 2, canvas.height - FOOTER_H + 34);
  ctx.textAlign = "left";

  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `mir4-atividade-${userName.replace(/\s+/g, "-").toLowerCase()}.png`;
  link.click();
  onDone?.();
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}
