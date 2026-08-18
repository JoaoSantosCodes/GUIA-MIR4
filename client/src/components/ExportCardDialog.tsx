import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageDown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AVATAR_OPTIONS,
  DEFAULT_CARD_STYLE,
  exportCardShared,
  exportRankingCard,
  exportTimelineCard,
  type CardStyle,
  type CardTheme,
} from "@/lib/timelineExport";

const THEME_OPTIONS: { key: CardTheme; label: string; swatch: string }[] = [
  { key: "dark", label: "Escuro Dourado", swatch: "linear-gradient(135deg, #140b0e, #1c0e10)" },
  { key: "blood", label: "Vermelho Sangue", swatch: "linear-gradient(135deg, #1a0808, #240a0c)" },
  { key: "mystic", label: "Roxo Místico", swatch: "linear-gradient(135deg, #0e0818, #16102a)" },
];

interface TimelineItemLike {
  ts: number;
  kind: "fav" | "vote" | "codex";
  title: string;
  section: string;
}

interface ActivityDialogProps {
  userName: string;
  goldBadges: number;
  items: TimelineItemLike[];
  trigger?: React.ReactNode;
}

/** Botão/dialog de exportação da atividade da timeline com personalização. */
export function ExportActivityCardDialog({ userName, goldBadges, items, trigger }: ActivityDialogProps) {
  return <ExportCardDialogInner mode="activity" userName={userName} goldBadges={goldBadges} items={items} trigger={trigger} />;
}

interface RankingDialogProps {
  userName: string;
  goldBadges: number;
  position: number;
  total: number;
  trigger?: React.ReactNode;
}

/** Botão/dialog de exportação do card do placar com personalização. */
export function ExportRankingCardDialog({ userName, goldBadges, position, total, trigger }: RankingDialogProps) {
  return <ExportCardDialogInner mode="ranking" userName={userName} goldBadges={goldBadges} position={position} total={total} trigger={trigger} />;
}

interface InnerProps {
  mode: "activity" | "ranking";
  userName: string;
  goldBadges: number;
  items?: TimelineItemLike[];
  position?: number;
  total?: number;
  trigger?: React.ReactNode;
}

function ExportCardDialogInner({ mode, userName, goldBadges, items = [], position, total, trigger }: InnerProps) {
  const [style, setStyle] = useState<CardStyle>(DEFAULT_CARD_STYLE);
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const maxItems = useMemo(() => items.slice(0, 8), [items]);

  /**
   * Desenha o card em um canvas oculto (mesma arte do PNG) e dispara o fluxo de
   * compartilhamento direto: menu nativo (mobile) → copiar imagem → download manual.
   */
  const exportCard = async () => {
    try {
      setExporting(true);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas não suportado");
      if (mode === "activity") {
        if (maxItems.length === 0) {
          toast.info("Nenhuma atividade para exportar ainda.");
          return;
        }
        await exportTimelineCard({ userName, goldBadges, items: maxItems, style, onDone: () => {}, drawTo: canvas });
      } else {
        await exportRankingCard({ userName, goldBadges, position: position ?? 0, total: total ?? 0, style, onDone: () => {}, drawTo: canvas });
      }
      await exportCardShared(canvas, userName, {
        onShared: () => toast.success("Card compartilhado pelo menu do dispositivo!"),
        onCopied: () => toast.success("Imagem copiada! Cole onde quiser (Ctrl+V)."),
        onFallback: () => toast.success("Seu navegador não permite compartilhar direto — a imagem foi salva na pasta de downloads."),
      });
    } catch {
      toast.error("Não foi possível gerar o card.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="inline-flex items-center gap-1.5 border-amber-600/60 bg-amber-950/50 text-amber-200 hover:bg-amber-900/50">
            <ImageDown className="h-3.5 w-3.5" />
            Exportar card
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg border-amber-800/50 bg-[oklch(0.17_0.015_280)]">
        <DialogHeader>
          <DialogTitle className="gold-text">Personalizar card</DialogTitle>
          <DialogDescription className="text-slate-400">
            Escolha um avatar e um tema de fundo antes de exportar o card em PNG.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-medium text-amber-300">Avatar</p>
            <div className="flex flex-wrap gap-1.5">
              {AVATAR_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setStyle(s => ({ ...s, avatar: emoji }))}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md border text-xl transition-transform active:scale-95",
                    style.avatar === emoji ? "border-amber-500/70 bg-amber-900/40" : "border-slate-700/60 bg-black/25",
                  )}
                  aria-label={`Avatar ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-amber-300">Tema de fundo</p>
            <div className="flex flex-wrap gap-2">
              {THEME_OPTIONS.map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setStyle(s => ({ ...s, theme: t.key }))}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                    style.theme === t.key ? "border-amber-500/70 text-amber-200" : "border-slate-700/60 text-slate-400 hover:text-amber-200",
                  )}
                >
                  <span className="h-4 w-4 rounded-sm border border-white/10" style={{ background: t.swatch }} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="flex items-center gap-3 rounded-lg border border-amber-800/50 p-3"
            style={{
              background: style.theme === "blood" ? "linear-gradient(135deg, #1a0808, #240a0c)" : style.theme === "mystic" ? "linear-gradient(135deg, #0e0818, #16102a)" : "linear-gradient(135deg, #140b0e, #1c0e10)",
            }}
          >
            <span className="text-3xl">{style.avatar}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold" style={{ color: style.theme === "blood" ? "#fecaca" : "#f5d76e" }}>
                {mode === "activity" ? "Atividade de " + userName : `#${position ?? 0} no placar — ${userName}`}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px]" style={{ color: style.theme === "blood" ? "#f3f4f6" : "#e5e7eb" }}>
                <Sparkles className="h-3 w-3" style={{ color: style.theme === "mystic" ? "#a78bfa" : "#b8860b" }} />
                {goldBadges > 0 ? `${goldBadges} Dica${goldBadges !== 1 ? "s" : ""} de Ouro` : "Guia MIR4"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={exportCard}
              disabled={exporting}
              className="w-full bg-red-800 text-amber-100 hover:bg-red-700 disabled:opacity-60"
            >
              <ImageDown className="h-4 w-4" />
              {exporting ? "Gerando…" : "Compartilhar card"}
            </Button>
            <p className="text-center text-[11px] text-slate-500">
              Abre o menu nativo do dispositivo, copia a imagem ou salva o PNG.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
