/**
 * Exporta a atividade da timeline do usuário como um card de imagem (PNG).
 * Desenha o card em um canvas 2D (sem dependências externas) e dispara o download.
 */

export type CardTheme = "dark" | "blood" | "mystic";

export interface CardStyle {
  avatar: string;
  theme: CardTheme;
}

export const DEFAULT_CARD_STYLE: CardStyle = { avatar: "⚔️", theme: "dark" };

export const AVATAR_OPTIONS = ["⚔️", "🛡️", "🐉", "✨", "🔮", "👑", "🗡️", "💀", "🔥", "🌟"];

interface ThemePalette {
  stops: [number, string][];
  border: string;
  accent: string;
  title: string;
  sub: string;
  faded: string;
}

export const THEMES_PRIVATE: Record<CardTheme, ThemePalette> = {
  dark: {
    stops: [[0, "#140b0e"], [0.5, "#1c0e10"], [1, "#10080a"]],
    border: "#b45309",
    accent: "#b8860b",
    title: "#f5d76e",
    sub: "#e5e7eb",
    faded: "#9ca3af",
  },
  blood: {
    stops: [[0, "#1a0808"], [0.5, "#240a0c"], [1, "#140606"]],
    border: "#b91c1c",
    accent: "#dc2626",
    title: "#fecaca",
    sub: "#f3f4f6",
    faded: "#a1a1aa",
  },
  mystic: {
    stops: [[0, "#0e0818"], [0.5, "#16102a"], [1, "#0a0614"]],
    border: "#7c3aed",
    accent: "#a78bfa",
    title: "#ddd6fe",
    sub: "#e5e7eb",
    faded: "#9ca3af",
  },
};

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
  style?: CardStyle;
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

function drawBaseCard(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, style: CardStyle) {
  const palette = THEMES_PRIVATE[style.theme];

  const bg = ctx.createLinearGradient(0, 0, WIDTH, canvas.height);
  palette.stops.forEach(([stop, color]) => bg.addColorStop(stop, color));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, canvas.height);

  ctx.strokeStyle = palette.border;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, WIDTH - 6, canvas.height - 6);

  ctx.fillStyle = palette.accent;
  ctx.fillRect(MARGIN, HEADER_H - 18, WIDTH - MARGIN * 2, 2);
}

function drawHeader(ctx: CanvasRenderingContext2D, style: CardStyle, args: { userName: string; subtitle?: string; badgeText?: string }) {
  const palette = THEMES_PRIVATE[style.theme];

  ctx.font = "bold 54px Georgia, serif";
  ctx.textBaseline = "top";
  ctx.fillStyle = palette.title;
  ctx.fillText("Guia MIR4", MARGIN, 44);

  ctx.font = "28px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = palette.sub;
  ctx.fillText(`${args.userName} ${args.subtitle ?? ""}`, MARGIN, 120);

  if (args.badgeText) {
    ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
    ctx.fillStyle = palette.title;
    ctx.fillText(args.badgeText, MARGIN, 170);
  } else {
    ctx.font = "24px 'Segoe UI', Arial, sans-serif";
    ctx.fillStyle = palette.faded;
    ctx.fillText("Explorando o mundo de MIR4", MARGIN, 170);
  }

  // Avatar escolhido pelo usuário
  ctx.font = "72px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif";
  ctx.fillText(style.avatar, WIDTH - MARGIN - 90, 40);
}

function drawFooter(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const palette = THEMES_PRIVATE.dark;
  ctx.fillStyle = palette.accent;
  ctx.fillRect(0, canvas.height - FOOTER_H + 10, WIDTH, 2);
  ctx.fillStyle = palette.faded;
  ctx.font = "18px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("mir4guia-ab8pnzuc.manus.space", WIDTH / 2, canvas.height - FOOTER_H + 34);
  ctx.textAlign = "left";
}

function drawTimelineList(ctx: CanvasRenderingContext2D, items: TimelineExportItem[], startH: number) {
  const palette = THEMES_PRIVATE.dark;
  const maxItems = Math.min(items.length, 8);
  let y = startH;
  for (let i = 0; i < maxItems; i++) {
    const t = items[i];
    ctx.beginPath();
    ctx.arc(MARGIN + 8, y + ITEM_H / 2, 10, 0, Math.PI * 2);
    ctx.fillStyle = t.kind === "fav" ? "#f59e0b" : t.kind === "vote" ? "#34d399" : "#94a3b8";
    ctx.fill();
    ctx.fillStyle = "#8b94a0";
    ctx.font = "18px 'Segoe UI', Arial, sans-serif";
    const dateStr = new Date(t.ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    ctx.fillText(`${dateStr} · ${t.section} · ${KIND_LABEL[t.kind]}`, MARGIN + 32, y + 6);
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
  return y;
}

export async function exportTimelineCard({ userName, goldBadges, items, style = DEFAULT_CARD_STYLE, onDone }: ExportOptions): Promise<void> {
  const canvas = document.createElement("canvas");
  const maxItems = Math.min(items.length, 8);
  const listH = Math.max(maxItems, 1) * ITEM_H + (Math.max(maxItems, 1) - 1) * GAP;
  canvas.width = WIDTH;
  canvas.height = HEADER_H + listH + FOOTER_H + 40;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado neste navegador");

  drawBaseCard(ctx, canvas, style);
  drawHeader(ctx, style, {
    userName,
    subtitle: "— Atividade",
    badgeText: goldBadges > 0 ? `★ ${goldBadges} Dica${goldBadges !== 1 ? "s" : ""} de Ouro` : undefined,
  });

  drawTimelineList(ctx, items, HEADER_H);
  drawFooter(ctx, canvas);

  await downloadCanvas(canvas, userName);
  onDone?.();
}

interface RankingExportOptions {
  userName: string;
  goldBadges: number;
  position: number;
  total: number;
  style?: CardStyle;
  onDone?: () => void;
}

/**
 * Exporta um card do placar com a posição do usuário no ranking.
 */
export async function exportRankingCard({ userName, goldBadges, position, total, style = DEFAULT_CARD_STYLE, onDone }: RankingExportOptions): Promise<void> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEADER_H + 360 + FOOTER_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado neste navegador");

  drawBaseCard(ctx, canvas, style);
  drawHeader(ctx, style, {
    userName,
    subtitle: "— Placar da Comunidade",
    badgeText: goldBadges > 0 ? `★ ${goldBadges} Dica${goldBadges !== 1 ? "s" : ""} de Ouro` : undefined,
  });

  // Posição central
  const midY = HEADER_H + 30;
  ctx.fillStyle = "#8b94a0";
  ctx.font = "24px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("Posição no ranking de Dicas de Ouro", MARGIN, midY);

  const palette = THEMES_PRIVATE[style.theme];
  ctx.fillStyle = palette.title;
  ctx.font = "bold 150px Georgia, serif";
  ctx.fillText(`#${position}`, MARGIN, midY + 50);

  ctx.fillStyle = "#8b94a0";
  ctx.font = "28px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(`de ${total} aventureiro${total !== 1 ? "s" : ""} rankeado${total !== 1 ? "s" : ""}`, MARGIN, midY + 240);

  if (position <= 3) {
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 30px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(position === 1 ? "🏆 Top 1 da comunidade!" : position === 2 ? "🥈 Pódio do ranking!" : "🥉 Pódio do ranking!", MARGIN, midY + 296);
  }

  drawFooter(ctx, canvas);

  await downloadCanvas(canvas, userName);
  onDone?.();
}

async function downloadCanvas(canvas: HTMLCanvasElement, userName: string) {
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `mir4-card-${userName.replace(/\s+/g, "-").toLowerCase()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // aguarda o clique do download disparar antes de limpar
  await new Promise(r => setTimeout(r, 120));
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}
