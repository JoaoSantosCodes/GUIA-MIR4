import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  AVATAR_OPTIONS,
  DEFAULT_CARD_STYLE,
  exportAchievementCard,
  exportCardShared,
  type AchievementCardData,
  type CardStyle,
} from "@/lib/timelineExport";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: AchievementCardData;
  userName: string;
  goldBadges: number;
}

export default function AchievementCardDialog({ open, onOpenChange, data, userName, goldBadges }: Props) {
  const [style, setStyle] = useState<CardStyle>(DEFAULT_CARD_STYLE);
  const [exporting, setExporting] = useState(false);

  const runExport = async (drawTo?: HTMLCanvasElement) => {
    await exportAchievementCard({ data, userName, style, drawTo });
  };

  const handleShare = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const canvas = document.createElement("canvas");
      await exportAchievementCard({
        data,
        userName,
        style,
        drawTo: canvas,
        onDone: () => {
          void exportCardShared(canvas, userName, {
            onShared: () => toast.success("Card compartilhado com sucesso"),
            onCopied: () => toast.success("Imagem copiada para a área de transferência"),
            onFallback: () => toast.info("Salvando imagem para download"),
          });
        },
      });
    } catch {
      toast.error("Não foi possível gerar o card");
    } finally {
      setExporting(false);
    }
  };

  const handleCopy = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const canvas = document.createElement("canvas");
      await runExport(canvas);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => (b ? resolve(b) : reject(new Error("Falha"))), "image/png");
      });
      if (navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        toast.success("Imagem copiada para a área de transferência");
      } else {
        await runExport();
        toast.success("Imagem baixada");
      }
    } catch {
      toast.error("Não foi possível copiar a imagem");
    } finally {
      setExporting(false);
    }
  };

  const handleDownload = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await runExport();
      toast.success("Imagem baixada");
    } catch {
      toast.error("Não foi possível baixar a imagem");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-300">Card da conquista</DialogTitle>
          <DialogDescription>
            {data.title} — personalize e exporte o card da medalha.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <p className="mb-1 text-xs font-medium text-slate-400">Avatar</p>
            <div className="flex flex-wrap gap-1.5">
              {AVATAR_OPTIONS.map(av => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setStyle(s => ({ ...s, avatar: av }))}
                  className={
                    style.avatar === av
                      ? "flex h-8 w-8 items-center justify-center rounded border-2 border-amber-500 bg-amber-900/40 text-lg"
                      : "flex h-8 w-8 items-center justify-center rounded border border-slate-700 text-lg hover:border-amber-600 transition-colors"
                  }
                  aria-label={`Avatar ${av}`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-slate-400">Tema de fundo</p>
            <div className="flex gap-2">
              {(
                [
                  ["dark", "Escuro Dourado"],
                  ["blood", "Vermelho Sangue"],
                  ["mystic", "Roxo Místico"],
                ] as const
              ).map(([theme, label]) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setStyle(s => ({ ...s, theme }))}
                  className={
                    style.theme === theme
                      ? "rounded border-2 border-amber-500 bg-amber-900/40 px-2.5 py-1 text-[11px] font-medium text-amber-200"
                      : "rounded border border-slate-700 px-2.5 py-1 text-[11px] text-slate-400 hover:text-amber-200 transition-colors"
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {goldBadges > 0 && (
            <p className="text-xs text-slate-500">
              ★ {goldBadges} Dica{goldBadges !== 1 ? "s" : ""} de Ouro no placar
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            disabled={exporting}
            className="border-purple-400/60 text-purple-300 hover:bg-purple-900/40"
          >
            <Share2 className="h-4 w-4" /> Compartilhar
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleCopy} disabled={exporting}>
            <Copy className="h-4 w-4" /> Copiar
          </Button>
          <Button type="button" size="sm" onClick={handleDownload} disabled={exporting}>
            <Download className="h-4 w-4" /> Baixar PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
