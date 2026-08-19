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
  /** Canvas pré-criado para receber o desenho (compartilhamento direto, sem download). */
  drawTo?: HTMLCanvasElement;
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

export async function exportTimelineCard({ userName, goldBadges, items, style = DEFAULT_CARD_STYLE, onDone, drawTo }: ExportOptions): Promise<void> {
  const canvas = drawTo ?? document.createElement("canvas");
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

  if (!drawTo) await downloadCanvas(canvas, userName);
  onDone?.();
}

interface RankingExportOptions {
  userName: string;
  goldBadges: number;
  rarityBadges?: number;
  position: number;
  total: number;
  /** "gold" usa o padrão Dicas de Ouro; "unified" destaca o totalScore (Dicas de Ouro + medalhas Codex). */
  rankingMode?: "gold" | "unified";
  totalScore?: number;
  style?: CardStyle;
  onDone?: () => void;
  /** Canvas pré-criado para receber o desenho (compartilhamento direto, sem download). */
  drawTo?: HTMLCanvasElement;
}

/**
 * Exporta um card do placar com a posição do usuário no ranking.
 */
export async function exportRankingCard({ userName, goldBadges, rarityBadges, position, total, rankingMode = "gold", totalScore = 0, style = DEFAULT_CARD_STYLE, onDone, drawTo }: RankingExportOptions): Promise<void> {
  const canvas = drawTo ?? document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEADER_H + 360 + FOOTER_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado neste navegador");

  drawBaseCard(ctx, canvas, style);
  drawHeader(ctx, style, {
    userName,
    subtitle: "— Placar da Comunidade",
    badgeText:
      rankingMode === "unified"
        ? `★ ${totalScore} pontos — Ouro + Codex`
        : goldBadges > 0 && rarityBadges && rarityBadges > 0
          ? `★ ${goldBadges} Dica${goldBadges !== 1 ? "s" : ""} de Ouro · ◆ ${rarityBadges} raridade`
          : goldBadges > 0
            ? `★ ${goldBadges} Dica${goldBadges !== 1 ? "s" : ""} de Ouro`
            : rarityBadges && rarityBadges > 0
              ? `◆ ${rarityBadges} conquista${rarityBadges !== 1 ? "s" : ""} de raridade`
              : undefined,
  });

  // Posição central
  const midY = HEADER_H + 30;
  ctx.fillStyle = "#8b94a0";
  ctx.font = "24px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(rankingMode === "unified" ? "Posição no placar unificado" : "Posição no ranking de Dicas de Ouro", MARGIN, midY);

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

  if (rankingMode === "unified") {
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(`★ ${goldBadges} Dicas de Ouro  ·  ◆ ${Math.max(totalScore - goldBadges, 0)} medalhas do Codex`, MARGIN, midY + 340);
  } else if (rarityBadges && rarityBadges > 0) {
    ctx.fillStyle = "#a78bfa";
    ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(`◆ ${rarityBadges} conquista${rarityBadges !== 1 ? "s" : ""} de raridade do Codex`, MARGIN, midY + 340);
  }

  drawFooter(ctx, canvas);

  if (!drawTo) await downloadCanvas(canvas, userName);
  onDone?.();
}

/**
 * Disponibiliza o canvas como Blob PNG para compartilhamento/cópia.
 */
async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error("Não foi possível gerar a imagem"))),
      "image/png",
      1,
    );
  });
}

export async function shareCardWithBlob(blob: Blob, title: string): Promise<boolean> {
  if (!window.isSecureContext || !navigator.share) return false;
  const file = new File([blob], `${title}.png`, { type: "image/png" });
  try {
    await navigator.share({ title: "Meu card do Guia MIR4", files: [file] });
    return true;
  } catch {
    // usuário cancelou ou share não suportado — sem ação
    return false;
  }
}

/**
 * Copia o card PNG para a área de transferência (Clipboard API, Chrome/Edge/Chrome Android em HTTPS).
 * @returns true se copiado
 */
export async function copyCardToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (!navigator.clipboard || !navigator.clipboard.write) return false;
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Exporta um card desenhado em canvas pelo caminho completo de compartilhamento:
 * primeiro tenta o menu nativo; se falhar/não existir, tenta a área de transferência;
 * por fim, retorna a blob para download manual.
 */
export async function exportCardShared(
  canvas: HTMLCanvasElement,
  userName: string,
  handlers: { onCopied?: () => void; onShared?: () => void; onFallback?: () => void },
): Promise<void> {
  const blob = await canvasToBlob(canvas);
  const title = `mir4-card-${userName.replace(/\s+/g, "-").toLowerCase()}`;
  if (await shareCardWithBlob(blob, title)) {
    handlers.onShared?.();
    return;
  }
  if (await copyCardToClipboard(blob)) {
    handlers.onCopied?.();
    return;
  }
  handlers.onFallback?.();
  await downloadCanvas(canvas, userName);
}

export interface CodexItemCardData {
  name: string;
  category: string;
  rarity: string;
  tier: number;
  tip: string;
  collected: boolean;
  collectedCount: number;
  categoryTotal: number;
}

/**
 * Exporta um card individual de um item do Codex com nome, raridade, tier,
 * dica de farm e progresso da categoria.
 */
export async function exportItemCard({ item, style = DEFAULT_CARD_STYLE, onDone, drawTo }: { item: CodexItemCardData; style?: CardStyle; onDone?: () => void; drawTo?: HTMLCanvasElement }): Promise<void> {
  const canvas = drawTo ?? document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEADER_H + 330 + FOOTER_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado neste navegador");

  drawBaseCard(ctx, canvas, style);
  drawHeader(ctx, style, { userName: item.category, subtitle: "— Item do Codex" });

  const palette = THEMES_PRIVATE[style.theme];
  const midY = HEADER_H + 24;

  // Raridade como badge
  ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
  const rarColor = item.rarity === "Mítico" ? "#a78bfa" : item.rarity === "Lendário" ? "#f59e0b" : item.rarity === "Épico" ? "#f87171" : item.rarity === "Raro" ? "#60a5fa" : "#94a3b8";
  ctx.fillStyle = rarColor;
  const rarText = `${item.rarity} · Tier ${item.tier}`;
  ctx.fillText(rarText, MARGIN, midY);

  // Nome do item (grande)
  ctx.fillStyle = palette.title;
  ctx.font = "bold 52px Georgia, serif";
  ctx.fillText(truncate(item.name, 42), MARGIN, midY + 44);

  // Dica de farm
  ctx.fillStyle = palette.sub;
  ctx.font = "26px 'Segoe UI', Arial, sans-serif";
  const tipWrapped = wrapText(ctx, item.tip, WIDTH - MARGIN * 2);
  tipWrapped.slice(0, 3).forEach((line, i) => {
    ctx.fillText(line, MARGIN, midY + 130 + i * 36);
  });

  // Status da coleção
  ctx.fillStyle = item.collected ? "#34d399" : palette.faded;
  ctx.font = "bold 26px 'Segoe UI', Arial, sans-serif";
  const statusText = item.collected ? "✓ Registrado no seu Codex" : "✗ Ainda não registrado";
  ctx.fillText(statusText, MARGIN, midY + 262);

  // Barra de progresso da categoria
  const barW = 420;
  const ratio = item.categoryTotal > 0 ? item.collectedCount / item.categoryTotal : 0;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(MARGIN, midY + 292, barW, 12);
  ctx.fillStyle = "#b8860b";
  ctx.fillRect(MARGIN, midY + 292, barW * ratio, 12);
  ctx.fillStyle = palette.faded;
  ctx.font = "20px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(`${item.collectedCount}/${item.categoryTotal} itens de ${item.category}`, MARGIN + barW + 16, midY + 304);

  drawFooter(ctx, canvas);

  if (!drawTo) await downloadCanvas(canvas, "codex-item");
  onDone?.();
}

export interface CategoryCardData {
  category: string;
  items: { name: string; rarity: string; tier: number; collected: boolean }[];
  collectedCount: number;
  categoryTotal: number;
}

/** Marca d'água discreta desenhada no rodapé do card em lote do Codex. */
function drawWatermark(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, userName: string | null) {
  const nameLine = userName ? `Colecionado por ${truncate(userName, 30)}` : null;
  const dateLine = `Em ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}`;
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.font = "14px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "right";
  if (nameLine) {
    ctx.fillText(nameLine, WIDTH - MARGIN, canvas.height - FOOTER_H + 36);
  }
  ctx.fillText(dateLine, WIDTH - MARGIN, canvas.height - FOOTER_H + 58);
  ctx.textAlign = "left";
}

/**
 * Exporta um card em lote resumindo todos os itens de uma categoria do Codex
 * (ou o Codex completo quando category for vazia).
 */
export async function exportCategoryCard({ data, style = DEFAULT_CARD_STYLE, onDone, drawTo, userName = null }: { data: CategoryCardData; style?: CardStyle; onDone?: () => void; drawTo?: HTMLCanvasElement; userName?: string | null }): Promise<void> {
  const canvas = drawTo ?? document.createElement("canvas");
  const header = `— ${data.category || "Codex Completo"}`;
  const ratio = data.categoryTotal > 0 ? data.collectedCount / data.categoryTotal : 0;
  const summaryText = `${data.collectedCount}/${data.categoryTotal} itens registrados`;

  // altura estimada: cabeçalho + resumo + 6 linhas de itens + rodapé
  const canvasH = HEADER_H + 330 + FOOTER_H;
  canvas.width = WIDTH;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado neste navegador");

  drawBaseCard(ctx, canvas, style);
  drawHeader(ctx, style, { userName: "Codex", subtitle: header, badgeText: `${summaryText} (${Math.round(ratio * 100)}%)` });

  const palette = THEMES_PRIVATE[style.theme];
  const midY = HEADER_H + 24;

  // Barra de progresso da categoria
  const barW = 480;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(MARGIN, midY + 6, barW, 14);
  ctx.fillStyle = "#b8860b";
  ctx.fillRect(MARGIN, midY + 6, barW * ratio, 14);

  // Lista de itens (máximo 6 visíveis)
  const maxItems = Math.min(data.items.length, 6);
  const listY = midY + 60;
  for (let i = 0; i < maxItems; i++) {
    const it = data.items[i];
    const rarColor = it.rarity === "Mítico" ? "#a78bfa" : it.rarity === "Lendário" ? "#f59e0b" : it.rarity === "Épico" ? "#f87171" : it.rarity === "Raro" ? "#60a5fa" : "#94a3b8";
    ctx.beginPath();
    ctx.arc(MARGIN + 8, listY + i * 34 + 8, 6, 0, Math.PI * 2);
    ctx.fillStyle = it.collected ? "#34d399" : "rgba(255,255,255,0.25)";
    ctx.fill();
    ctx.fillStyle = palette.sub;
    ctx.font = "22px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(truncate(it.name, 52), MARGIN + 26, listY + i * 34);
    ctx.fillStyle = rarColor;
    ctx.font = "18px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(`${it.rarity} · T${it.tier}`, MARGIN + barW - 90, listY + i * 34 + 2);
  }
  if (data.items.length > maxItems) {
    ctx.fillStyle = palette.faded;
    ctx.font = "18px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(`e mais ${data.items.length - maxItems} itens…`, MARGIN + 26, listY + maxItems * 34 + 14);
  }

  // Selo "100% Concluído" quando todos os itens da categoria estiverem registrados
  const isComplete = data.categoryTotal > 0 && data.collectedCount >= data.categoryTotal;
  if (isComplete) {
    ctx.save();
    ctx.translate(WIDTH - 90, HEADER_H + 60);
    ctx.rotate((30 * Math.PI) / 180);
    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.roundRect(-96, -24, 192, 48, 24);
    ctx.fill();
    ctx.strokeStyle = "#bbf7d0";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("100% CONCLUÍDO", 0, 2);
    ctx.restore();
  }

  drawFooter(ctx, canvas);
  drawWatermark(ctx, canvas, userName);

  if (!drawTo) await downloadCanvas(canvas, "codex-categoria");
  onDone?.();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
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

export interface AchievementCardData {
  title: string;
  description: string;
  icon: string;
  achievedAt?: number;
}

/**
 * Exporta um card individual de uma conquista desbloqueada, com o nome do
 * usuário e a data da conquista (ou a data atual).
 */
export async function exportAchievementCard({
  data,
  userName,
  style = DEFAULT_CARD_STYLE,
  onDone,
  drawTo,
}: {
  data: AchievementCardData;
  userName: string;
  style?: CardStyle;
  onDone?: () => void;
  drawTo?: HTMLCanvasElement;
}): Promise<void> {
  const canvas = drawTo ?? document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEADER_H + 360 + FOOTER_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado neste navegador");

  drawBaseCard(ctx, canvas, style);
  drawHeader(ctx, style, { userName: truncate(userName, 34), subtitle: "— Conquista Desbloqueada" });

  const palette = THEMES_PRIVATE[style.theme];
  const midY = HEADER_H + 28;

  // Ícone da conquista em destaque
  ctx.font = "88px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif";
  ctx.fillText(data.icon, MARGIN, midY);

  // Título da conquista
  ctx.fillStyle = palette.title;
  ctx.font = "bold 48px Georgia, serif";
  ctx.fillText(truncate(data.title, 36), MARGIN + 120, midY + 8);

  // Descrição
  ctx.fillStyle = palette.sub;
  ctx.font = "24px 'Segoe UI', Arial, sans-serif";
  const descWrapped = wrapText(ctx, data.description, WIDTH - (MARGIN + 120) * 2);
  descWrapped.slice(0, 3).forEach((line, i) => {
    ctx.fillText(line, MARGIN + 120, midY + 62 + i * 34);
  });

  // Data da conquista
  const achieved = data.achievedAt ? new Date(data.achievedAt) : new Date();
  const dateStr = achieved.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  ctx.fillStyle = palette.faded;
  ctx.font = "22px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(`Desbloqueada em ${dateStr}`, MARGIN + 120, midY + 172);

  // Selo dourado de conquista
  ctx.fillStyle = "#b8860b";
  ctx.font = "bold 26px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("★ Medalha do Codex ★", MARGIN + 120, midY + 222);

  // Marca d'água discreta
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.font = "14px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`Gerado por ${truncate(userName, 30)}`, WIDTH - MARGIN, canvas.height - FOOTER_H + 36);
  ctx.fillText(`Em ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}`, WIDTH - MARGIN, canvas.height - FOOTER_H + 58);
  ctx.textAlign = "left";

  drawFooter(ctx, canvas);

  if (!drawTo) await downloadCanvas(canvas, "conquista");
  onDone?.();
}

export interface HistoryEntryCardData {
  key: string;
  title: string;
  icon: string;
  unlockedAt: number;
  type: "codex" | "gold";
}

/**
 * Exporta um card resumindo o histórico de conquistas do usuário: medalhas do
 * Codex e Dicas de Ouro, cada uma com a data de desbloqueio.
 */
export async function exportHistoryCard({
  entries,
  userName,
  goldBadges = 0,
  style = DEFAULT_CARD_STYLE,
  onDone,
  drawTo,
}: {
  entries: HistoryEntryCardData[];
  userName: string;
  goldBadges?: number;
  style?: CardStyle;
  onDone?: () => void;
  drawTo?: HTMLCanvasElement;
}): Promise<void> {
  const canvas = drawTo ?? document.createElement("canvas");
  const maxItems = Math.min(entries.length, 6);
  const listH = Math.max(maxItems, 1) * ITEM_H + (Math.max(maxItems, 1) - 1) * GAP;
  canvas.width = WIDTH;
  canvas.height = HEADER_H + listH + FOOTER_H + 40;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado neste navegador");

  drawBaseCard(ctx, canvas, style);
  drawHeader(ctx, style, {
    userName: truncate(userName, 34),
    subtitle: "— Histórico de Conquistas",
    badgeText: `🏆 ${entries.length} medalha${entries.length !== 1 ? "s" : ""}${goldBadges > 0 ? ` · ★ ${goldBadges} Dica${goldBadges !== 1 ? "s" : ""} de Ouro` : ""}`,
  });

  const palette = THEMES_PRIVATE[style.theme];
  let y = HEADER_H;
  for (let i = 0; i < maxItems; i++) {
    const e = entries[i];
    ctx.beginPath();
    ctx.arc(MARGIN + 8, y + ITEM_H / 2, 10, 0, Math.PI * 2);
    ctx.fillStyle = e.type === "gold" ? "#f59e0b" : "#94a3b8";
    ctx.fill();
    ctx.fillStyle = "#8b94a0";
    ctx.font = "18px 'Segoe UI', Arial, sans-serif";
    const dateStr = new Date(e.unlockedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    const typeLabel = e.type === "gold" ? "Dica de Ouro" : "Codex";
    ctx.fillText(`${dateStr} · ${typeLabel}`, MARGIN + 32, y + 6);
    ctx.fillStyle = palette.title;
    ctx.font = "bold 22px Georgia, serif";
    ctx.fillText(truncate(`${e.icon} ${e.title}`, 72), MARGIN + 32, y + 34);
    y += ITEM_H + GAP;
  }
  if (entries.length > maxItems) {
    ctx.fillStyle = "#9ca3af";
    ctx.font = "18px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(`e mais ${entries.length - maxItems} medalhas…`, MARGIN + 32, y + 18);
  }

  drawFooter(ctx, canvas);

  if (!drawTo) await downloadCanvas(canvas, "historico-conquistas");
  onDone?.();
}

export interface PvPCompareCardData {
  nameA: string;
  nameB: string;
  totals: { a: number; b: number };
  overallWinner: "a" | "b" | "draw";
  scenarios: {
    scenario: string;
    scenarioLabel: string;
    rows: { attribute: string; attrLabel: string; valueA: number; valueB: number; delta: number; winner: "a" | "b" | "draw" }[];
    winner: "a" | "b" | "draw";
    winsA: number;
    winsB: number;
    /** Valores dano/defesa/utilidade (0–100) para o gráfico de radar do cenário. */
    valuesA?: { dano: number; defesa: number; utilidade: number };
    valuesB?: { dano: number; defesa: number; utilidade: number };
  }[];
}

/**
 * Gráfico de radar canvas puro (Dano/Defesa/Utilidade) reutilizado no card exportado.
 */
function drawRadarExport(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  valuesA: { dano: number; defesa: number; utilidade: number },
  valuesB: { dano: number; defesa: number; utilidade: number },
): void {
  const labels = ["Dano", "Defesa", "Utilidade"];
  const n = 3;
  const angle = (i: number) => -Math.PI / 2 + (i * Math.PI * 2) / n;
  const gridColor = "rgba(217, 119, 6, 0.25)";
  const axisColor = "rgba(217, 119, 6, 0.4)";
  const labelColor = "rgba(251, 191, 36, 0.95)";

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

  ctx.font = "600 22px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < n; i++) {
    const a = angle(i);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(a), cy + radius * Math.sin(a));
    ctx.strokeStyle = axisColor;
    ctx.stroke();
    ctx.fillStyle = labelColor;
    ctx.fillText(labels[i], cx + (radius + 26) * Math.cos(a), cy + (radius + 26) * Math.sin(a));
  }

  const polygon = (vals: typeof valuesA, stroke: string, fill: string) => {
    const arr = [vals.dano, vals.defesa, vals.utilidade];
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const idx = i % n;
      const v = Math.min(100, Math.max(0, arr[idx])) / 100;
      const a = angle(idx);
      const x = cx + radius * v * Math.cos(a);
      const y = cy + radius * v * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  polygon(valuesA, "#f59e0b", "rgba(245, 158, 11, 0.16)");
  polygon(valuesB, "#ef4444", "rgba(239, 68, 68, 0.16)");
}

/**
 * Exporta o comparador PvP lado a lado como card PNG: placar geral,
 * vitória por cenário e deltas de dano/defesa/utilidade de cada um.
 */
export async function exportPvPCompareCard({
  data,
  userName,
  style = DEFAULT_CARD_STYLE,
  onDone,
  drawTo,
}: {
  data: PvPCompareCardData;
  userName: string;
  style?: CardStyle;
  onDone?: () => void;
  drawTo?: HTMLCanvasElement;
}): Promise<void> {
  const canvas = drawTo ?? document.createElement("canvas");
  const scenarioH = 330;
  const radarH = 230;
  const hasRadar = data.scenarios.every(s => s.valuesA && s.valuesB);
  const totalH = HEADER_H + 96 + data.scenarios.length * (scenarioH + (hasRadar ? radarH + 28 : 0) + 24) + FOOTER_H + 24;
  canvas.width = WIDTH;
  canvas.height = totalH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado neste navegador");

  drawBaseCard(ctx, canvas, style);
  drawHeader(ctx, style, {
    userName: truncate(userName, 34),
    subtitle: "— Comparador de Builds PvP",
    badgeText: data.overallWinner === "draw"
      ? "Empate geral"
      : `${data.overallWinner === "a" ? data.nameA : data.nameB} leva a vantagem`,
  });

  const palette = THEMES_PRIVATE[style.theme];
  const gold = "#f59e0b";
  const red = "#ef4444";

  // Placar agregado — nomes nos extremos, placar ao centro
  let y = HEADER_H;
  ctx.textAlign = "center";
  ctx.font = "bold 40px Georgia, serif";
  ctx.fillStyle = palette.title;
  ctx.fillText(truncate(data.nameA, 20), 240, y + 4);
  ctx.fillText(truncate(data.nameB, 20), WIDTH - 240, y + 4);
  ctx.font = "bold 52px Georgia, serif";
  ctx.fillStyle = gold;
  ctx.fillText(String(data.totals.a), WIDTH / 2 - 80, y + 6);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "36px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("×", WIDTH / 2, y + 8);
  ctx.fillStyle = red;
  ctx.font = "bold 52px Georgia, serif";
  ctx.fillText(String(data.totals.b), WIDTH / 2 + 80, y + 6);
  ctx.textAlign = "left";
  y += 96;

  // Cenários
  for (const sc of data.scenarios) {
    ctx.textBaseline = "top";
    ctx.fillStyle = palette.title;
    ctx.font = "bold 24px Georgia, serif";
    ctx.fillText(sc.scenarioLabel, MARGIN + 8, y + 28);
    ctx.fillStyle = palette.faded;
    ctx.font = "18px 'Segoe UI', Arial, sans-serif";
    const scWinnerLabel =
      sc.winner === "draw"
        ? "Empate"
        : sc.winner === "a"
          ? `${sc.winsA}×${sc.winsB} — ${data.nameA} vence`
          : `${sc.winsB}×${sc.winsA} — ${data.nameB} vence`;
    ctx.fillText(scWinnerLabel, WIDTH - MARGIN - ctx.measureText(scWinnerLabel).width - 10, y + 32);

    // Gráfico de radar dano/defesa/utilidade (se os valores estiverem presentes)
    let rowY = y + 58;
    if (sc.valuesA && sc.valuesB) {
      const radarCX = MARGIN + 180;
      const radarCY = rowY + 118;
      drawRadarExport(ctx, radarCX, radarCY, 74, sc.valuesA, sc.valuesB);
      ctx.textBaseline = "alphabetic";
      // Legenda ao lado do radar
      ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
      ctx.fillStyle = gold;
      ctx.fillText(truncate(data.nameA, 18), radarCX + 165, radarCY - 42);
      ctx.fillStyle = red;
      ctx.fillText(truncate(data.nameB, 18), radarCX + 165, radarCY - 12);
      ctx.fillStyle = palette.faded;
      ctx.font = "17px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("radar: dano · defesa · utilidade", radarCX + 165, radarCY + 42);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      rowY += 242;
    }
    for (const row of sc.rows) {
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = palette.sub;
      ctx.font = "18px 'Segoe UI', Arial, sans-serif";
      const deltaTxt =
        row.winner === "draw"
          ? `${row.valueA} × ${row.valueB} — empate`
          : `${row.valueA} × ${row.valueB} — ${row.winner === "a" ? `+${Math.abs(row.delta)} ${data.nameA}` : `+${Math.abs(row.delta)} ${data.nameB}`}`;
      ctx.fillText(`${row.attrLabel}: ${truncate(deltaTxt, 58)}`, MARGIN, rowY + 4);
      // barras 2 colunas
      const barY = rowY + 16;
      const barW = (WIDTH - MARGIN * 2 - 24) / 2;
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(MARGIN, barY, barW, 10);
      ctx.fillRect(MARGIN + barW + 24, barY, barW, 10);
      ctx.fillStyle = gold;
      ctx.fillRect(MARGIN, barY, barW * Math.min(row.valueA / 100, 1), 10);
      ctx.fillStyle = red;
      ctx.fillRect(MARGIN + barW + 24, barY, barW * Math.min(row.valueB / 100, 1), 10);
      rowY += 52;
    }
    y = rowY + 24;
  }

  drawWatermark(ctx, canvas, userName);
  drawFooter(ctx, canvas);

  if (!drawTo) await downloadCanvas(canvas, "comparador-pvp");
  onDone?.();
}

/**
 * Gráfico de radar genérico canvas puro (labels/valores arbitrários) para o card de espíritos.
 */
function drawGenericRadarExport(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  valuesA: number[],
  valuesB: number[],
  labels: string[],
): void {
  const n = labels.length;
  if (n === 0 || (valuesA.length === 0 && valuesB.length === 0)) return;
  const angle = (i: number) => -Math.PI / 2 + (i * Math.PI * 2) / n;
  const gridColor = "rgba(217, 119, 6, 0.25)";
  const axisColor = "rgba(217, 119, 6, 0.4)";
  const labelColor = "rgba(251, 191, 36, 0.95)";

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

  ctx.font = "600 20px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < n; i++) {
    const a = angle(i);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(a), cy + radius * Math.sin(a));
    ctx.strokeStyle = axisColor;
    ctx.stroke();
    ctx.fillStyle = labelColor;
    ctx.fillText(labels[i], cx + (radius + 24) * Math.cos(a), cy + (radius + 24) * Math.sin(a));
  }

  const polygon = (vals: number[], stroke: string, fill: string) => {
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
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  polygon(valuesA, "#f59e0b", "rgba(245, 158, 11, 0.16)");
  polygon(valuesB, "#ef4444", "rgba(239, 68, 68, 0.16)");
}

export interface SpiritCompareCardData {
  nameA: string;
  nameB: string;
  rarityA?: string;
  rarityB?: string;
  totals: { a: number; b: number };
  overallWinner: "a" | "b" | "draw";
  /** Rótulos dos eixos do radar (ex.: Dano, Suporte, Defesa, Farm, Versatilidade). */
  radarLabels: string[];
  valuesA: number[];
  valuesB: number[];
  rows: { label: string; valueA: number; valueB: number; delta: number; winner: "a" | "b" | "draw" }[];
}

/**
 * Exporta o comparador de espíritos lado a lado como card PNG: placar geral com
 * raridades, radar de 5 dimensões e deltas por atributo.
 */
export async function exportSpiritCompareCard({
  data,
  userName,
  style = DEFAULT_CARD_STYLE,
  onDone,
  drawTo,
}: {
  data: SpiritCompareCardData;
  userName: string;
  style?: CardStyle;
  onDone?: () => void;
  drawTo?: HTMLCanvasElement;
}): Promise<void> {
  const canvas = drawTo ?? document.createElement("canvas");
  const totalH = HEADER_H + 96 + 250 + data.rows.length * 56 + 48 + FOOTER_H + 24;
  canvas.width = WIDTH;
  canvas.height = totalH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado neste navegador");

  drawBaseCard(ctx, canvas, style);
  drawHeader(ctx, style, {
    userName: truncate(userName, 34),
    subtitle: "— Comparador de Espíritos",
    badgeText:
      data.overallWinner === "draw"
        ? "Equilibrados"
        : `${data.overallWinner === "a" ? data.nameA : data.nameB} leva a vantagem`,
  });

  const palette = THEMES_PRIVATE[style.theme];
  const gold = "#f59e0b";
  const red = "#ef4444";

  // Placar agregado — nome em cima, raridade abaixo em linha própria
  let y = HEADER_H;
  ctx.textAlign = "center";
  ctx.font = "bold 40px Georgia, serif";
  ctx.fillStyle = palette.title;
  ctx.fillText(truncate(data.nameA, 20), 240, y + 4);
  ctx.fillText(truncate(data.nameB, 20), WIDTH - 240, y + 4);
  ctx.font = "bold 52px Georgia, serif";
  ctx.fillStyle = gold;
  ctx.fillText(String(data.totals.a), WIDTH / 2 - 80, y + 18);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "36px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("×", WIDTH / 2, y + 22);
  ctx.fillStyle = red;
  ctx.font = "bold 52px Georgia, serif";
  ctx.fillText(String(data.totals.b), WIDTH / 2 + 80, y + 18);
  // Raridades em linha própria (mais abaixo, sem sobrepor o placar)
  ctx.font = "bold 17px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = palette.faded;
  if (data.rarityA) ctx.fillText(`Raridade: ${data.rarityA}`, 240, y + 52);
  if (data.rarityB) ctx.fillText(`Raridade: ${data.rarityB}`, WIDTH - 240, y + 52);
  ctx.textAlign = "left";
  y += 96;

  // Radar — diagrama à esquerda, legenda compacta à direita
  const radarCX = MARGIN + 180;
  const radarCY = y + 122;
  drawGenericRadarExport(ctx, radarCX, radarCY, 74, data.valuesA, data.valuesB, data.radarLabels);
  ctx.textAlign = "left";
  ctx.font = "bold 21px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = gold;
  ctx.fillText(truncate(data.nameA, 18), radarCX + 172, radarCY - 30);
  ctx.fillStyle = red;
  ctx.fillText(truncate(data.nameB, 18), radarCX + 172, radarCY);
  ctx.fillStyle = palette.faded;
  ctx.font = "15px 'Segoe UI', Arial, sans-serif";
  const legend = data.radarLabels.join(" · ");
  ctx.fillText(`Radar: ${legend}`, radarCX + 172, radarCY + 30);
  ctx.textBaseline = "alphabetic";
  y += 250;

  // Atributos
  for (const row of data.rows) {
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = palette.sub;
    ctx.font = "18px 'Segoe UI', Arial, sans-serif";
    const deltaTxt =
      row.winner === "draw"
        ? `${row.valueA} × ${row.valueB} — empate`
        : `${row.valueA} × ${row.valueB} — ${row.winner === "a" ? `+${Math.abs(row.delta)} ${data.nameA}` : `+${Math.abs(row.delta)} ${data.nameB}`}`;
    ctx.fillText(`${row.label}: ${truncate(deltaTxt, 58)}`, MARGIN, y + 4);
    const barY = y + 16;
    const barW = (WIDTH - MARGIN * 2 - 24) / 2;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(MARGIN, barY, barW, 10);
    ctx.fillRect(MARGIN + barW + 24, barY, barW, 10);
    ctx.fillStyle = gold;
    ctx.fillRect(MARGIN, barY, barW * Math.min(row.valueA / 100, 1), 10);
    ctx.fillStyle = red;
    ctx.fillRect(MARGIN + barW + 24, barY, barW * Math.min(row.valueB / 100, 1), 10);
    y += 56;
  }

  drawWatermark(ctx, canvas, userName);
  drawFooter(ctx, canvas);

  if (!drawTo) await downloadCanvas(canvas, "comparador-espiritos");
  onDone?.();
}
