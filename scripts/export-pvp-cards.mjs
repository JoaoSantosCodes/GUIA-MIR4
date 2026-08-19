/**
 * Script de exportação em lote dos cards do Comparador PvP (PNG).
 *
 * Gera um card PNG para cada par ordenado de classes (28 combinações)
 * reproduzindo a mesma lógica de canvas usada no site
 * (client/src/lib/timelineExport.ts). Requer JSDOM + node-canvas para
 * desenhar fora do navegador.
 *
 * Uso:
 *   pnpm add -D canvas jsdom   (devDependencies, apenas para o lote)
 *   node scripts/export-pvp-cards.mjs [diretório-de-saída]
 *
 * A saída padrão é ./pvp-cards/. Cada arquivo recebe o nome
 * "comparador-pvp-{classeA}-vs-{classeB}.png".
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Carrega pvpCompare.ts (arquivo TypeScript puro, sem JSX) — os scores
// estão diretamente em COMPARE_CLASSES com a mesma ordem de cenários.
const pvpSrc = readFileSync(
  resolve(import.meta.dirname, "../client/src/lib/pvpCompare.ts"),
  "utf-8",
);

// ---- Extrai os scores das classes do código-fonte (parser mínimo) ----
function parseClassScores() {
  // Bloco por classe: { key: "warrior", name: "Warrior", scores: {...} }
  // Cenários sempre na ordem duel, group, boss; atributos dano, defesa, utilidade.
  const blockRe = /key: "([a-z]+)",\s*name: "([^"]+)",\s*scores: \{[\s\S]*?\n  \},/g;
  const classes = [];
  for (const m of pvpSrc.matchAll(blockRe)) {
    const scenes = [...m[0].matchAll(/(\w+): \{ dano: (\d+), defesa: (\d+), utilidade: (\d+) \}/g)];
    if (scenes.length !== 3) continue;
    classes.push({
      key: m[1],
      name: m[2],
      scores: Object.fromEntries(
        scenes.map((s, i) => [
          ["duel", "group", "boss"][i],
          { dano: Number(s[2]), defesa: Number(s[3]), utilidade: Number(s[4]) },
        ]),
      ),
    });
  }
  return classes;
}

const classes = parseClassScores();
console.log(`Encontradas ${classes.length} classes: ${classes.map(c => c.key).join(", ")}`);

// ---- Lógica de comparação (espelha pvpCompare.ts) ----
const SCENARIOS = ["duel", "group", "boss"];
const SCENARIO_LABELS = { duel: "PvP 1×1", group: "PvP em grupo", boss: "Bosses / PvE" };
const ATTRS = [
  ["dano", "Dano"],
  ["defesa", "Defesa"],
  ["utilidade", "Utilidade"],
];

function compare(keyA, keyB) {
  const a = classes.find(c => c.key === keyA);
  const b = classes.find(c => c.key === keyB);
  if (!a || !b || a.key === b.key) return null;
  let totalA = 0;
  let totalB = 0;
  const scenarios = SCENARIOS.map(scenario => {
    const rows = ATTRS.map(([attr, attrLabel]) => {
      const va = a.scores[scenario][attr];
      const vb = b.scores[scenario][attr];
      totalA += va;
      totalB += vb;
      const delta = va - vb;
      return {
        attribute: attr,
        attrLabel,
        valueA: va,
        valueB: vb,
        delta,
        winner: delta > 0 ? "a" : delta < 0 ? "b" : "draw",
      };
    });
    const winsA = rows.filter(r => r.winner === "a").length;
    const winsB = rows.filter(r => r.winner === "b").length;
    return {
      scenario,
      scenarioLabel: SCENARIO_LABELS[scenario],
      rows,
      winner: winsA > winsB ? "a" : winsB > winsA ? "b" : "draw",
      winsA,
      winsB,
      valuesA: a.scores[scenario],
      valuesB: b.scores[scenario],
    };
  });
  return {
    nameA: a.name,
    nameB: b.name,
    totals: { a: totalA, b: totalB },
    overallWinner: totalA > totalB ? "a" : totalB > totalA ? "b" : "draw",
    scenarios,
  };
}

// ---- Setup JSDOM / node-canvas ----
import { createCanvas } from "canvas";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.window = dom.window;
global.document = dom.window.document;
// navigator é somente-leitura no Node 22 — atribui via defineProperty
Object.defineProperty(global, "navigator", { value: dom.window.navigator, configurable: true });
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.OffscreenCanvas = dom.window.OffscreenCanvas ?? null;
global.getComputedStyle = dom.window.getComputedStyle;

// Importa o módulo de export (.ts) com o ambiente simulado — tsx executa TypeScript nativamente.
const { exportPvPCompareCard } = await import("tsx/esm/api").then(async ({ register }) => {
  register({ tsconfig: resolve(import.meta.dirname, "../tsconfig.json") });
  return import("../client/src/lib/timelineExport.ts");
}).catch(async () => {
  // Fallback: compila o arquivo na hora com esbuild (disponível no projeto)
  const esbuild = await import("esbuild");
  const out = await esbuild.build({
    entryPoints: [resolve(import.meta.dirname, "../client/src/lib/timelineExport.ts")],
    bundle: true,
    platform: "node",
    format: "esm",
    write: false,
    external: ["canvas"],
  });
  const tmp = resolve(import.meta.dirname, "_timelineExport.mjs");
  writeFileSync(tmp, out.outputFiles[0].text);
  return import(tmp);
});

// ---- Gera todos os pares ----
const outDir = resolve(process.argv[2] ?? import.meta.dirname, "../pvp-cards");
mkdirSync(outDir, { recursive: true });

const pairs = [];
for (let i = 0; i < classes.length; i++) {
  for (let j = i + 1; j < classes.length; j++) {
    pairs.push([classes[i].key, classes[j].key]);
  }
}

let done = 0;
for (const [keyA, keyB] of pairs) {
  const data = compare(keyA, keyB);
  if (!data) continue;
  const canvas = createCanvas(1200, 2200);
  try {
    await exportPvPCompareCard({
      data,
      userName: "Guia MIR4 (export em lote)",
      drawTo: canvas,
    });
    const buf = canvas.toBuffer("image/png");
    const safeA = keyA.replace(/[^a-z0-9]/gi, "-");
    const safeB = keyB.replace(/[^a-z0-9]/gi, "-");
    writeFileSync(join(outDir, `comparador-pvp-${safeA}-vs-${safeB}.png`), buf);
    done += 1;
    console.log(`[${done}/${pairs.length}] ${data.nameA} × ${data.nameB} exportado`);
  } catch (err) {
    console.error(`Erro ao exportar ${keyA} × ${keyB}:`, err.message);
  }
}

console.log(`Concluído: ${done} cards em ${outDir}`);
