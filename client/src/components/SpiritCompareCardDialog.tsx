import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageDown, Share2, Copy } from "lucide-react";
import { toast } from "sonner";
import { exportSpiritCompareCard, exportCardShared, type SpiritCompareCardData } from "@/lib/timelineExport";
import {
  SPIRIT_ATTRIBUTES,
  SPIRIT_RADAR_LABELS,
  SPIRIT_TIER_NAMES,
  SPIRITS,
  RARITY_STYLES,
} from "@shared/guideData";
import { useAuth } from "@/_core/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface SpiritCompareCardDialogProps {
  spiritA: string;
  spiritB: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const nameOf = (k: string): string => SPIRIT_TIER_NAMES[k] ?? SPIRITS.find(s => s.key === k)?.name ?? k;

/**
 * Diálogo de exportação do comparador de espíritos: gera um card PNG do resultado
 * atual (compartilhar nativo → copiar imagem → download).
 */
export default function SpiritCompareCardDialog({ spiritA, spiritB, open, onOpenChange }: SpiritCompareCardDialogProps) {
  const { user } = useAuth();
  const userName = user?.name ?? "Aventureiro";

  const attrsA = SPIRIT_ATTRIBUTES[spiritA] ?? null;
  const attrsB = SPIRIT_ATTRIBUTES[spiritB] ?? null;

  const cardData: SpiritCompareCardData | null = useMemo(() => {
    if (!attrsA || !attrsB) return null;
    const valuesA = Object.values(attrsA) as number[];
    const valuesB = Object.values(attrsB) as number[];
    const totalA = valuesA.reduce((a, b) => a + b, 0);
    const totalB = valuesB.reduce((a, b) => a + b, 0);
    const overallWinner = totalA > totalB ? "a" : totalB > totalA ? "b" : "draw";
    const rows = SPIRIT_RADAR_LABELS.map((label, idx) => {
      const delta = valuesA[idx] - valuesB[idx];
      return {
        label,
        valueA: valuesA[idx],
        valueB: valuesB[idx],
        delta,
        winner: delta > 0 ? ("a" as const) : delta < 0 ? ("b" as const) : ("draw" as const),
      };
    });
    const rarityA = SPIRITS.find(s => s.key === spiritA)?.rarity;
    const rarityB = SPIRITS.find(s => s.key === spiritB)?.rarity;
    return {
      nameA: nameOf(spiritA),
      nameB: nameOf(spiritB),
      rarityA: rarityA ? RARITY_STYLES[rarityA].label : undefined,
      rarityB: rarityB ? RARITY_STYLES[rarityB].label : undefined,
      totals: { a: totalA, b: totalB },
      overallWinner,
      radarLabels: Array.from(SPIRIT_RADAR_LABELS),
      valuesA,
      valuesB,
      rows,
    };
  }, [attrsA, attrsB, spiritA, spiritB]);

  const [exporting, setExporting] = useState(false);

  async function handleShare() {
    if (!cardData) return;
    setExporting(true);
    try {
      const canvas = document.createElement("canvas");
      await exportSpiritCompareCard({ data: cardData, userName, drawTo: canvas });
      await exportCardShared(canvas, userName, {
        onShared: () => toast.success("Menu de compartilhamento aberto"),
        onCopied: () => toast.success("Imagem copiada para a área de transferência"),
        onFallback: () => toast.success("Download do card iniciado"),
      });
    } catch {
      toast.error("Não foi possível gerar o card. Tente novamente.");
    } finally {
      setExporting(false);
    }
  }

  async function handleDownload() {
    if (!cardData) return;
    setExporting(true);
    try {
      await exportSpiritCompareCard({ data: cardData, userName });
      toast.success("Card do comparador baixado como PNG");
    } catch {
      toast.error("Não foi possível gerar o card. Tente novamente.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-amber-800/40 bg-[oklch(0.16_0.02_280)] text-foreground">
        <DialogHeader>
          <DialogTitle className="gold-text flex items-center gap-2">
            <ImageDown className="h-5 w-5 text-amber-500" /> Exportar comparador de espíritos
          </DialogTitle>
          <DialogDescription>
            Gere um card PNG com o resultado da comparação entre{" "}
            <strong className="text-amber-300">{nameOf(spiritA)}</strong> e{" "}
            <strong className="text-red-300">{nameOf(spiritB)}</strong> para compartilhar nas redes.
          </DialogDescription>
        </DialogHeader>

        {cardData ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-amber-900/40 bg-black/30 px-4 py-2.5">
              <span className="text-sm font-bold text-amber-400">{cardData.nameA}</span>
              <span className="font-serif text-lg font-bold">{cardData.totals.a}</span>
              <span className="text-slate-500">×</span>
              <span className="text-sm font-bold text-red-400">{cardData.nameB}</span>
              <span className="font-serif text-lg font-bold">{cardData.totals.b}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              O card inclui o placar geral com as raridades, o radar de 5 dimensões (dano, suporte, defesa, farm
              e versatilidade) e os deltas por atributo, com marca d'água do seu nome e a data.
            </p>
          </div>
        ) : (
          <Skeleton className="h-16 w-full" />
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            className="border-amber-700/50 text-amber-300 hover:bg-amber-950/40"
            onClick={handleShare}
            disabled={exporting || !cardData}
          >
            {exporting ? (
              <Skeleton className="h-4 w-28" />
            ) : (
              <>
                <Share2 className="mr-1.5 h-4 w-4" /> Compartilhar
              </>
            )}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-slate-800"
              onClick={async () => {
                if (!cardData) return;
                setExporting(true);
                try {
                  const canvas = document.createElement("canvas");
                  await exportSpiritCompareCard({ data: cardData, userName, drawTo: canvas });
                  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
                  if (blob && navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.write([new window.ClipboardItem({ "image/png": blob })]);
                    toast.success("Imagem copiada para a área de transferência");
                  } else {
                    toast.info("Copiar não disponível neste navegador — use Baixar PNG");
                  }
                } catch {
                  toast.error("Não foi possível copiar a imagem.");
                } finally {
                  setExporting(false);
                }
              }}
              disabled={exporting || !cardData}
            >
              <Copy className="mr-1 h-4 w-4" /> Copiar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-800/50 text-red-300 hover:bg-red-950/40"
              onClick={handleDownload}
              disabled={exporting || !cardData}
            >
              {exporting ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <>
                  <ImageDown className="mr-1.5 h-4 w-4" /> Baixar PNG
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
