/**
 * Script de exportação em lote dos cards do Comparador de Espíritos (PNG).
 *
 * Gera um card PNG para cada par não ordenado de espíritos elegíveis da
 * tier list (combinações C(n,2)) reproduzindo a mesma lógica de canvas
 * usada no site (client/src/lib/timelineExport.ts). Requer JSDOM +
 * node-canvas para desenhar fora do navegador.
 *
 * Uso:
 *   node scripts/export-spirit-cards.mjs [diretório-de-saída]
 *
 * A saída padrão é ./spirit-cards/. Cada arquivo recebe o nome
 * "comparador-espiritos-{spiritA}-vs-{spiritB}.png".
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ---- Carrega os dados de espíritos do código-fonte (parser mínimo) ----
const src = readFileSync(resolve(import.meta.dirname, "../shared/guideData.ts"), "utf-8");

const SPIRIT_TIER_LIST_KEYS = (() => {
  const start = src.indexOf("export const SPIRIT_TIER_RANKINGS");
  const massivoIdx = src.indexOf("massivo: {", start);
  if (start < 0 || massivoIdx < 0) throw new Error("SPIRIT_TIER_RANKINGS/massivo não encontrado");
  // Balanço de chaves para pegar somente o bloco do cenário massivo
  let depth = 1; // abre no '{' do "massivo: {"
  let i = src.indexOf("{", massivoIdx) + 1; // primeiro caractere do corpo
  const bodyStart = i;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth += 1;
    else if (src[i] === "}") {
      depth -= 1;
      if (depth === 0) break;
    }
  }
  const body = src.slice(bodyStart, i);
  const keys = [...body.matchAll(/"([a-z]+)": \{ tier:/g)].map(m => m[1]);
  return [...new Set(keys)];
})();
const keys = SPIRIT_TIER_LIST_KEYS;
console.log(`Espíritos elegíveis (${keys.length}): ${keys.join(", ")}`);

// SPIRIT_ATTRIBUTES: Record<string, { dano, suporte, defesa, farm, versatilidade }>
const ATTR_NAMES = [
  ["dano", "Dano"],
  ["suporte", "Suporte"],
  ["defesa", "Defesa"],
  ["farm", "Farm"],
  ["versatilidade", "Versatilidade"],
];
function parseSpiritAttrs() {
  const start = src.indexOf("export const SPIRIT_ATTRIBUTES");
  const end = src.indexOf("export const ", start + 1);
  const block = src.slice(start, end);
  const entryRe = /"([a-z]+)": \{ dano: (\d+), suporte: (\d+), defesa: (\d+), farm: (\d+), versatilidade: (\d+) \}/g;
  const out = {};
  for (const m of block.matchAll(entryRe)) {
    out[m[1]] = { dano: +m[2], suporte: +m[3], defesa: +m[4], farm: +m[5], versatilidade: +m[6] };
  }
  return out;
}
const attrs = parseSpiritAttrs();
console.log(`Atributos parsados para ${Object.keys(attrs).length} espíritos`);

// SPIRITS: mapa key -> rarity (para exibir a raridade no card)
function parseSpiritRarity() {
  const start = src.indexOf("export const SPIRITS: Spirit[] = [");
  const end = src.indexOf("];", start);
  const block = src.slice(start, end);
  const entryRe = /key: "([a-z]+)",\s*name: "[^"]+",\s*title: "[^"]+",\s*rarity: "([^"]+)"/g;
  const out = {};
  for (const m of block.matchAll(entryRe)) out[m[1]] = m[2];
  return out;
}
const rarity = parseSpiritRarity();

// SPIRIT_TIER_NAMES: mapa key -> nome legível
function parseSpiritNames() {
  const start = src.indexOf("export const SPIRIT_TIER_NAMES");
  const end = src.indexOf("};", start);
  const block = src.slice(start, end);
  const out = {};
  for (const m of block.matchAll(/"([a-z]+)": "([^"]+)"/g)) out[m[1]] = m[2];
  return out;
}
const names = parseSpiritNames();

// ---- Lógica de comparação (espelha SpiritCompareDialog) ----
function compare(keyA, keyB) {
  const a = attrs[keyA];
  const b = attrs[keyB];
  if (!a || !b || keyA === keyB) return null;
  let totalA = 0;
  let totalB = 0;
  const rows = ATTR_NAMES.map(([attr, label]) => {
    const va = a[attr];
    const vb = b[attr];
    totalA += va;
    totalB += vb;
    const delta = va - vb;
    return { label, valueA: va, valueB: vb, delta, winner: delta > 0 ? "a" : delta < 0 ? "b" : "draw" };
  });
  return {
    nameA: names[keyA] ?? keyA,
    nameB: names[keyB] ?? keyB,
    rarityA: rarity[keyA] ?? "UC",
    rarityB: rarity[keyB] ?? "UC",
    totals: { a: totalA, b: totalB },
    overallWinner: totalA > totalB ? "a" : totalB > totalA ? "b" : "draw",
    radarLabels: ATTR_NAMES.map(([, l]) => l),
    valuesA: Object.values(a),
    valuesB: Object.values(b),
    rows,
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

// Importa o módulo de export (.ts) com o ambiente simulado
const { exportSpiritCompareCard } = await import("tsx/esm/api").then(async ({ register }) => {
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
  const tmp = resolve(import.meta.dirname, "_timelineExportSpirit.mjs");
  writeFileSync(tmp, out.outputFiles[0].text);
  return import(tmp);
});

// ---- Gera todos os pares ----
const outDir = resolve(process.argv[2] ?? import.meta.dirname, "../spirit-cards");
mkdirSync(outDir, { recursive: true });
const pairs = [];
for (let i = 0; i < keys.length; i++) {
  for (let j = i + 1; j < keys.length; j++) {
    pairs.push([keys[i], keys[j]]);
  }
}
let done = 0;
for (const [keyA, keyB] of pairs) {
  const data = compare(keyA, keyB);
  if (!data) continue;
  // altura = 300 + 96 + 250 + 5*56 + 48 + 90 + 24 = 1088
  const canvas = createCanvas(1200, 1088);
  try {
    await exportSpiritCompareCard({ data, userName: "Guia MIR4 (export em lote)", drawTo: canvas });
    const buf = canvas.toBuffer("image/png");
    writeFileSync(
      `${outDir}/comparador-espiritos-${keyA}-vs-${keyB}.png`,
      buf,
    );
    done += 1;
    console.log(`[${done}/${pairs.length}] ${data.nameA} × ${data.nameB} exportado`);
  } catch (err) {
    console.error(`Erro ao exportar ${keyA} × ${keyB}:`, err.message);
  }
}
console.log(`Concluído: ${done} cards em ${outDir}`);
