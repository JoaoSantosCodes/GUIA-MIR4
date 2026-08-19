import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  AVATAR_OPTIONS,
  DEFAULT_CARD_STYLE,
  exportVeteranCard,
  exportCardShared,
  type CardStyle,
} from "@/lib/timelineExport";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  chaptersPlayed: number;
  totalChapters: number;
  chapters: number[];
}

/**
 * Dialog do card de Veterano de Sabuk: personaliza avatar e tema,
 * e oferece Compartilhar (menu nativo) / Copiar (clipboard) / Baixar PNG.
 */
export default function VeteranCardDialog({ open, onOpenChange, userName, chaptersPlayed, totalChapters, chapters }: Props) {
  const [style, setStyle] = useState<CardStyle>(DEFAULT_CARD_STYLE);
  const [exporting, setExporting] = useState(false);

  const runExport = async (drawTo?: HTMLCanvasElement) => {
    await exportVeteranCard({ userName, chaptersPlayed, totalChapters, chapters, style, drawTo });
  };

  const handleShare = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const canvas = document.createElement("canvas");
      await runExport(canvas);
      await exportCardShared(canvas, userName, {
        onShared: () => toast.success("Card compartilhado com sucesso"),
        onCopied: () => toast.success("Imagem copiada para a área de transferência"),
        onFallback: () => toast.info("Salvando imagem para download"),
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
          <DialogTitle className="text-amber-300">
            {chaptersPlayed >= totalChapters ? "Card de Veterano de Sabuk" : "Card de progresso — Veterano"}
          </DialogTitle>
          <DialogDescription>
            {chaptersPlayed >= totalChapters
              ? `Você vivenciou todos os ${totalChapters} capítulos do MIR4 — exiba a medalha nas redes sociais.`
              : `Você completou ${chaptersPlayed} de ${totalChapters} capítulos. Marque os restantes na linha do tempo (Notícias) para desbloquear a medalha de Veterano de Sabuk.`}
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
