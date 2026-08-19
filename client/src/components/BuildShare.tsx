import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Share, Copy, Download, ClipboardPaste, Check, AlertTriangle } from "lucide-react";
import { encodeBuild, decodeBuild } from "@shared/buildCodec";
import { CLASS_SKILLS } from "@shared/guideData";
import type { SkillBuild } from "@shared/guideData";

export default function BuildShare({ build, classKey }: { build: SkillBuild; classKey: string }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"export" | "import">("export");
  const [importText, setImportText] = useState("");
  const [copied, setCopied] = useState(false);

  const text = encodeBuild({
    classKey,
    scenario: build.scenario,
    skills: build.skills,
    rotation: build.rotation,
    notes: build.notes,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Build copiada para a área de transferência!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Não foi possível copiar — selecione o texto manualmente.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mir4-build-${classKey}-${build.scenario}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Arquivo de build baixado!");
  };

  const handleImport = () => {
    const decoded = decodeBuild(importText);
    if (!decoded) {
      toast.error("Formato de build inválido. Cole uma string gerada pelo exportador (começa com MIR4-SKILLS:).");
      return;
    }
    const cls = CLASS_SKILLS.find(c => c.key === decoded.classKey);
    const known = cls ? `${cls.name} (${decoded.scenario})` : decoded.classKey;
    toast.success(`Build importada: ${known} — ${decoded.skills.length} skills`, {
      description: decoded.skills.slice(0, 6).join(", "),
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setMode("export"); setImportText(""); }}
        className="ml-2 inline-flex items-center gap-1 rounded border border-amber-700/50 px-2 py-0.5 text-[10px] font-medium text-amber-300 transition-colors hover:bg-amber-900/30"
        aria-label="Exportar ou importar build"
      >
        <Share className="h-3 w-3" /> Compartilhar
      </button>

      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setImportText(""); }}>
        <DialogContent className="bg-[oklch(0.17_0.015_280)] border-amber-700/50 max-w-lg">
          <DialogHeader>
            <DialogTitle className="gold-text flex items-center gap-2 text-lg">
              <Share className="h-4 w-4 text-amber-400" /> Compartilhar Build
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Exporte ou importe configurações de skills em formato de texto — cole em qualquer conversa ou arquivo.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mode === "export" ? "default" : "outline"}
              className={mode === "export" ? "bg-amber-800 text-amber-100 hover:bg-amber-700" : "border-amber-700/50 text-amber-200"}
              onClick={() => setMode("export")}
            >
              Exportar
            </Button>
            <Button
              size="sm"
              variant={mode === "import" ? "default" : "outline"}
              className={mode === "import" ? "bg-amber-800 text-amber-100 hover:bg-amber-700" : "border-amber-700/50 text-amber-200"}
              onClick={() => setMode("import")}
            >
              Importar
            </Button>
          </div>

          {mode === "export" ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className="border-amber-700/50 text-amber-300">{classKey}</Badge>
                <Badge variant="outline" className="border-amber-700/50 text-amber-300">{build.scenario}</Badge>
                <Badge variant="outline" className="border-slate-700 text-slate-400">{build.focus}</Badge>
              </div>
              <div className="relative">
                <Textarea
                  readOnly
                  value={text}
                  rows={6}
                  className="font-mono text-[11px] bg-black/30 border-amber-800/40 text-amber-100"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCopy} className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copiado!" : "Copiar texto"}
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownload} className="gap-2 border-amber-700/50 text-amber-200 hover:bg-amber-900/30">
                  <Download className="h-4 w-4" /> Baixar .txt
                </Button>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Formato <span className="font-mono text-amber-400">MIR4-SKILLS:</span> — qualquer jogador pode colar o texto no botão Importar para reproduzir a build.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder="Cole aqui a string da build (começa com MIR4-SKILLS:)"
                rows={6}
                className="font-mono text-[11px] bg-black/30 border-amber-800/40 text-amber-100"
              />
              <Button size="sm" onClick={handleImport} disabled={importText.trim().length === 0} className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100 disabled:opacity-50">
                <ClipboardPaste className="h-4 w-4" /> Importar build
              </Button>
              {importText.trim().length > 0 && !decodeBuild(importText) && (
                <p className="flex items-center gap-1.5 text-[11px] text-red-300">
                  <AlertTriangle className="h-3 w-3" /> String inválida — verifique se colou o texto completo.
                </p>
              )}
              {importText.trim().length > 0 && (() => {
                const d = decodeBuild(importText);
                if (!d) return null;
                return (
                  <div className="rounded-md border border-amber-800/40 bg-black/25 p-3 text-xs text-slate-300">
                    <p><span className="text-slate-500">Classe:</span> {d.classKey}{!d.importedClassKnown && " (desconhecida)"}</p>
                    <p><span className="text-slate-500">Cenário:</span> {d.scenario}</p>
                    <p className="mt-1"><span className="text-slate-500">Skills:</span> {d.skills.join(", ")}</p>
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
