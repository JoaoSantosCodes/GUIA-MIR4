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
import {
  compareBuilds,
  COMPARE_CLASSES,
  SCENARIO_LABELS,
  ATTR_LABELS,
  type CompareResult,
} from "@/lib/pvpCompare";
import { exportPvPCompareCard, exportCardShared, type PvPCompareCardData } from "@/lib/timelineExport";
import { useAuth } from "@/_core/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface PvPCompareCardDialogProps {
  classA: string;
  classB: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Diálogo de exportação do comparador PvP: gera um card PNG do resultado
 * atual (compartilhar nativo → copiar imagem → download).
 */
export default function PvPCompareCardDialog({ classA, classB, open, onOpenChange }: PvPCompareCardDialogProps) {
  const { user } = useAuth();
  const userName = user?.name ?? "Aventureiro";

  const result: CompareResult | null = useMemo(() => compareBuilds(classA, classB), [classA, classB]);

  const cardData: PvPCompareCardData | null = useMemo(() => {
    if (!result) return null;
    return {
      nameA: COMPARE_CLASSES.find(c => c.key === classA)?.name ?? classA,
      nameB: COMPARE_CLASSES.find(c => c.key === classB)?.name ?? classB,
      totals: result.totals,
      overallWinner: result.overallWinner,
      scenarios: (["duel", "group", "boss"] as const).map(scenario => {
        const wins = result.scenarioWins[scenario];
        const rows = (["dano", "defesa", "utilidade"] as const)
          .map(attr => {
            const row = result.rows.find(r => r.scenario === scenario && r.attribute === attr);
            if (!row) return null;
            return {
              attribute: attr,
              attrLabel: ATTR_LABELS[attr],
              valueA: row.valueA,
              valueB: row.valueB,
              delta: row.delta,
              winner: row.winner,
            };
          })
          .filter((r): r is NonNullable<typeof r> => r !== null);
        return {
          scenario,
          scenarioLabel: SCENARIO_LABELS[scenario],
          rows,
          winner: wins.a > wins.b ? "a" : wins.b > wins.a ? "b" : "draw",
          winsA: wins.a,
          winsB: wins.b,
        };
      }),
    };
  }, [result, classA, classB]);

  const [exporting, setExporting] = useState(false);

  async function handleShare() {
    if (!cardData) return;
    setExporting(true);
    try {
      const canvas = document.createElement("canvas");
      await exportPvPCompareCard({ data: cardData, userName, drawTo: canvas });
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
      await exportPvPCompareCard({ data: cardData, userName });
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
            <ImageDown className="h-5 w-5 text-amber-500" /> Exportar comparador PvP
          </DialogTitle>
          <DialogDescription>
            Gere um card PNG com o resultado da comparação entre{" "}
            <strong className="text-amber-300">{COMPARE_CLASSES.find(c => c.key === classA)?.name}</strong> e{" "}
            <strong className="text-red-300">{COMPARE_CLASSES.find(c => c.key === classB)?.name}</strong> para compartilhar nas redes.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-amber-900/40 bg-black/30 px-4 py-2.5">
              <span className="text-sm font-bold text-amber-400">{COMPARE_CLASSES.find(c => c.key === classA)?.name}</span>
              <span className="font-serif text-lg font-bold">{result.totals.a}</span>
              <span className="text-slate-500">×</span>
              <span className="text-sm font-bold text-red-400">{COMPARE_CLASSES.find(c => c.key === classB)?.name}</span>
              <span className="font-serif text-lg font-bold">{result.totals.b}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              O card inclui o placar geral, a vitória por cenário (PvP 1×1, grupo, Bosses) e os deltas de
              dano, defesa e utilidade, com marca d'água do seu nome e a data.
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
                  await exportPvPCompareCard({ data: cardData, userName, drawTo: canvas });
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
