/**
 * Modal de exportação em lote: gera um único card PNG resumindo todos os
 * itens de uma categoria do Codex (ou o Codex completo).
 * Permite escolher avatar e tema, visualizar o preview em canvas e
 * compartilhar/copiar/baixar.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AVATAR_OPTIONS, CardTheme, CardStyle, DEFAULT_CARD_STYLE, exportCategoryCard, CategoryCardData } from "@/lib/timelineExport";
import { useAuth } from "@/_core/hooks/useAuth";
import { copyCardToClipboard, shareCardWithBlob } from "@/lib/timelineExport";
import { toast } from "sonner";
import { Download, Share2, Copy } from "lucide-react";

interface CategoryCardDialogProps {
  category: string;
  items: { name: string; rarity: string; tier: number; key?: string }[];
  collected: Set<string>;
  catDone: Map<string, number>;
  catTotal: Map<string, number>;
  onClose: () => void;
}

export default function CategoryCardDialog({ category, items, collected, catDone, catTotal, onClose }: CategoryCardDialogProps) {
  const { isAuthenticated, user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [style, setStyle] = useState<CardStyle>(DEFAULT_CARD_STYLE);
  const [drawing, setDrawing] = useState(false);

  const userName = useMemo(
    () => (isAuthenticated && user?.name ? user.name : "Aventureiro"),
    [isAuthenticated, user],
  );

  const isAll = category === "__todas__";
  const label = isAll ? "" : category;
  const catKey = isAll ? "__todas__" : category;

  const cardData: CategoryCardData = useMemo(
    () => ({
      category: label,
      items: items.map(it => ({
        name: it.name,
        rarity: it.rarity,
        tier: it.tier,
        collected: collected.has(it.key ?? ""),
      })),
      collectedCount: isAll ? collected.size : (catDone.get(catKey) ?? 0),
      categoryTotal: isAll ? catTotal.values().reduce((a, b) => a + b, 0) : (catTotal.get(catKey) ?? 0),
    }),
    [items, collected, catDone, catTotal, isAll, label, catKey],
  );

  useEffect(() => {
    let cancelled = false;
    setDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    void (async () => {
      try {
        await exportCategoryCard({
          data: cardData,
          style,
          drawTo: canvas,
          userName: isAuthenticated ? user?.name ?? null : null,
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

  const toBlob = async (canvas: HTMLCanvasElement): Promise<Blob> =>
    await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error("Falha ao gerar PNG"))), "image/png", 1),
    );

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await toBlob(canvas);
    const safeLabel = (label || "codex-completo").replace(/\s+/g, "-").toLowerCase();
    const title = `mir4-categoria-${safeLabel}`;
    if (await shareCardWithBlob(blob, title)) {
      toast.success("Card compartilhado!");
      return;
    }
    if (await copyCardToClipboard(blob)) {
      toast.success("Imagem copiada para a área de transferência!");
      return;
    }
    await downloadBlob(canvas, blob, title);
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await toBlob(canvas);
      if (await copyCardToClipboard(blob)) {
        toast.success("Imagem copiada!");
        return;
      }
    } catch {
      /* fallback */
    }
    await handleShare();
  };

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    await exportCategoryCard({ data: cardData, style, userName: isAuthenticated ? user?.name ?? null : null, onDone: () => toast.success("Download iniciado!") });
  };

  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[oklch(0.17_0.01_280)] border-amber-800/50">
        <DialogHeader>
          <DialogTitle className="gold-text text-xl">
            Card da categoria — {isAll ? "Codex Completo" : label}
          </DialogTitle>
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

          {/* Tema */}
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
            <canvas ref={canvasRef} className="w-full h-auto" aria-label="Preview do card da categoria" />
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
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" /> Copiar
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-amber-700/50 text-amber-200 hover:bg-amber-900/30"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" /> Baixar PNG
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

async function downloadBlob(canvas: HTMLCanvasElement, blob: Blob, title: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${title}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  await new Promise(r => setTimeout(r, 120));
}
