/**
 * Modal de exportação de card individual de um item do Codex.
 * Permite escolher avatar e tema de fundo, visualizar o preview em canvas
 * e compartilhar diretamente (menu nativo → copiar → download).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AVATAR_OPTIONS, CardTheme, CardStyle, DEFAULT_CARD_STYLE, exportItemCard, CodexItemCardData } from "@/lib/timelineExport";
import { useAuth } from "@/_core/hooks/useAuth";
import { copyCardToClipboard, shareCardWithBlob } from "@/lib/timelineExport";
import { toast } from "sonner";
import { Download, Share2, Copy } from "lucide-react";

interface ItemCardDialogProps {
  item: CodexItemCardData;
  collected: boolean;
  onClose: () => void;
}

export default function ItemCardDialog({ item, collected, onClose }: ItemCardDialogProps) {
  const { isAuthenticated, user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [style, setStyle] = useState<CardStyle>(DEFAULT_CARD_STYLE);
  const [drawing, setDrawing] = useState(false);

  const userName = useMemo(
    () => (isAuthenticated && user?.name ? user.name : "Aventureiro"),
    [isAuthenticated, user],
  );

  const cardData: CodexItemCardData = useMemo(
    () => ({
      ...item,
      collected,
      collectedCount: item.collectedCount,
      categoryTotal: item.categoryTotal,
    }),
    [item, collected],
  );

  // redesenha o canvas sempre que o estilo ou o item muda
  useEffect(() => {
    let cancelled = false;
    setDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    void (async () => {
      try {
        await exportItemCard({
          item: cardData,
          style,
          drawTo: canvas,
          onDone: () => {
            if (!cancelled) setDrawing(false);
          },
        });
      } catch (err) {
        if (!cancelled) {
          setDrawing(false);
          toast.error("Não foi possível gerar o card");
          console.error(err);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cardData, style]);

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error("Falha ao gerar PNG"))), "image/png", 1),
    );
    const title = `mir4-item-${item.name.replace(/\s+/g, "-").toLowerCase()}`;
    if (await shareCardWithBlob(blob, title)) {
      toast.success("Card compartilhado!");
      return;
    }
    if (await copyCardToClipboard(blob)) {
      toast.success("Imagem copiada para a área de transferência!");
      return;
    }
    toast("Seu navegador não suporta cópia direta — baixando o card");
    canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${title}-${userName.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[oklch(0.17_0.01_280)] border-amber-800/50">
        <DialogHeader>
          <DialogTitle className="gold-text text-xl">Card do item — {item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar */}
          <div>
            <p className="text-xs font-medium text-amber-300 mb-2">Escolha um avatar</p>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map(a => (
                <button
                  key={a}
                  onClick={() => setStyle(s => ({ ...s, avatar: a }))}
                  className={`flex h-9 w-9 items-center justify-center rounded border text-lg transition-all active:scale-[0.95] ${
                    style.avatar === a
                      ? "border-amber-500 bg-amber-900/40"
                      : "border-amber-800/40 bg-black/30 hover:border-amber-600"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Tema de fundo */}
          <div>
            <p className="text-xs font-medium text-amber-300 mb-2">Escolha o tema do fundo</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { key: "dark", label: "Escuro Dourado" },
                  { key: "blood", label: "Vermelho Sangue" },
                  { key: "mystic", label: "Roxo Místico" },
                ] as { key: CardTheme; label: string }[]
              ).map(t => (
                <button
                  key={t.key}
                  onClick={() => setStyle(s => ({ ...s, theme: t.key }))}
                  className={`rounded-md border px-4 py-1.5 text-sm font-medium transition-all active:scale-[0.97] ${
                    style.theme === t.key
                      ? "border-amber-500 bg-amber-900/40 text-amber-300"
                      : "border-amber-800/40 bg-black/30 text-slate-400 hover:text-amber-200 hover:border-amber-700/50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-amber-800/40 bg-black/30 p-2 overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-auto" aria-label="Preview do card do item" />
            {drawing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-amber-300">
                Gerando card…
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleShare} className="flex-1 gap-2 bg-red-800 hover:bg-red-700 text-amber-100 border border-amber-700/50">
              <Share2 className="h-4 w-4" /> Compartilhar card
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-amber-700/50 text-amber-200 hover:bg-amber-900/30"
              onClick={async () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                try {
                  const blob = await new Promise<Blob>((resolve, reject) =>
                    canvas.toBlob(b => (b ? resolve(b) : reject(new Error("Falha"))), "image/png", 1),
                  );
                  if (await copyCardToClipboard(blob)) {
                    toast.success("Imagem copiada!");
                    return;
                  }
                } catch {
                  /* fallback */
                }
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                const safeName = item.name.replace(/\s+/g, "-").toLowerCase();
                link.download = `mir4-item-${safeName}-${userName.replace(/\s+/g, "-").toLowerCase()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Download iniciado!");
              }}
            >
              <Copy className="h-4 w-4" /> Copiar
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-amber-700/50 text-amber-200 hover:bg-amber-900/30"
              onClick={async () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                await exportItemCard({ item: cardData, style, onDone: () => toast.success("Download iniciado!") });
              }}
            >
              <Download className="h-4 w-4" /> Baixar PNG
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
