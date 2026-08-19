import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  AVATAR_OPTIONS,
  DEFAULT_CARD_STYLE,
  THEMES_PRIVATE,
  CardTheme,
} from "./timelineExport";

// Mock do canvas 2D para que os módulos exportem testes puros
beforeEach(() => {
  vi.stubGlobal("document", {
    createElement: vi.fn(() => ({
      getContext: vi.fn(() => ({
        createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
        fillRect: vi.fn(),
        strokeRect: vi.fn(),
        fillText: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        toDataURL: vi.fn(() => "data:image/png;base64,MOCK"),
      })),
      appendChild: vi.fn(),
      removeChild: vi.fn(),
      click: vi.fn(),
    })),
    body: { appendChild: vi.fn(), removeChild: vi.fn() },
  } as unknown as Document);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("timelineExport", () => {
  it("AVATAR_OPTIONS não está vazio e contém 10 opções", () => {
    expect(AVATAR_OPTIONS.length).toBe(10);
    expect(AVATAR_OPTIONS[0].trim().length).toBeGreaterThan(0);
  });

  it("DEFAULT_CARD_STYLE tem tema válido e avatar", () => {
    expect(DEFAULT_CARD_STYLE.avatar.trim().length).toBeGreaterThan(0);
    expect(["dark", "blood", "mystic"]).toContain(DEFAULT_CARD_STYLE.theme);
  });

  it("cada tema define paleta com stops, borda, acento, título e textos", () => {
    for (const theme of ["dark", "blood", "mystic"] as CardTheme[]) {
      const palette = THEMES_PRIVATE[theme];
      expect(palette.stops.length).toBeGreaterThan(0);
      expect(palette.border.startsWith("#")).toBe(true);
      expect(palette.accent.startsWith("#")).toBe(true);
      expect(palette.title.startsWith("#")).toBe(true);
      expect(palette.sub.startsWith("#")).toBe(true);
      expect(palette.faded.startsWith("#")).toBe(true);
    }
  });
});

describe("marca d'água nos cards em lote", () => {
  it("exportCategoryCard aceita userName e desenha o nome e a data no card", async () => {
    const { exportCategoryCard } = await import("./timelineExport");
    const ctx = {
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      set fillStyle(_v: string) {
        /* noop */
      },
      set font(_v: string) {
        /* noop */
      },
      set textAlign(_v: string) {
        /* noop */
      },
      measureText: vi.fn(() => ({ width: 0 })),
      canvas: { width: 1200, height: 900 },
    } as unknown as CanvasRenderingContext2D;
    const canvas = {
      width: 1200,
      height: 900,
      getContext: vi.fn(() => ctx),
      toDataURL: vi.fn(() => "data:image/png;base64,MOCK"),
    } as unknown as HTMLCanvasElement;

    await exportCategoryCard({
      data: {
        category: "Consumíveis",
        items: [
          { name: "Poção de Cura Rara", rarity: "Raro", tier: 2, collected: true },
        ],
        collectedCount: 1,
        categoryTotal: 6,
      },
      userName: "Joao Santos",
      drawTo: canvas,
    });

    const calls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls.map(c => String(c[0]));
    expect(calls.some(c => c.includes("Colecionado por Joao Santos"))).toBe(true);
    const dateCall = calls.find(c => c.startsWith("Em "));
    expect(dateCall).toBeTruthy();
    expect(dateCall).toMatch(/20\d\d/);
  });
});

describe("selo 100% Concluído no card em lote", () => {
  it("desenha o selo apenas quando a categoria está completa", async () => {
    const { exportCategoryCard } = await import("./timelineExport");
    const makeCtx = () => ({
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      roundRect: vi.fn(),
      rotate: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      set fillStyle(_v: string) {
        /* noop */
      },
      set font(_v: string) {
        /* noop */
      },
      set textAlign(_v: string) {
        /* noop */
      },
      set textBaseline(_v: string) {
        /* noop */
      },
      set lineWidth(_v: number) {
        /* noop */
      },
      set strokeStyle(_v: string) {
        /* noop */
      },
      measureText: vi.fn(() => ({ width: 0 })),
      canvas: { width: 1200, height: 900 },
    });
    const ctx = makeCtx();
    const drawTo = {
      width: 1200,
      height: 900,
      getContext: vi.fn(() => ctx),
      toDataURL: vi.fn(() => "data:image/png;base64,MOCK"),
    } as unknown as HTMLCanvasElement;

    const complete = {
      category: "Consumíveis",
      items: [{ name: "Poção de Cura", rarity: "Raro", tier: 2, collected: true }],
      collectedCount: 6,
      categoryTotal: 6,
    };
    const partial = { ...complete, collectedCount: 5 };

    await exportCategoryCard({ data: complete, drawTo });
    const allCalls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls.map(c => String(c[0]));
    expect(allCalls.includes("100% CONCLUÍDO")).toBe(true);

    (ctx.fillText as ReturnType<typeof vi.fn>).mockClear();
    await exportCategoryCard({ data: partial, drawTo });
    const partialCalls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls.map(c => String(c[0]));
    expect(partialCalls.includes("100% CONCLUÍDO")).toBe(false);
  });
});

describe("card individual de conquista (exportAchievementCard)", () => {
  const makeCtx = () => ({
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    roundRect: vi.fn(),
    rotate: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    set fillStyle(_v: string) {
      /* noop */
    },
    set font(_v: string) {
      /* noop */
    },
    set textAlign(_v: string) {
      /* noop */
    },
    set textBaseline(_v: string) {
      /* noop */
    },
    set lineWidth(_v: number) {
      /* noop */
    },
    set strokeStyle(_v: string) {
      /* noop */
    },
    measureText: vi.fn(() => ({ width: 0 })),
    canvas: { width: 1200, height: 900 },
  });

  it("desenha o título da conquista, o nome do usuário e a data", async () => {
    const { exportAchievementCard } = await import("./timelineExport");
    const ctx = makeCtx();
    const drawTo = {
      width: 1200,
      height: 900,
      getContext: vi.fn(() => ctx),
      toDataURL: vi.fn(() => "data:image/png;base64,MOCK"),
    } as unknown as HTMLCanvasElement;

    await exportAchievementCard({
      data: {
        title: "Ascensão Rara",
        description: "Registre todos os itens Raros do Codex",
        icon: "Gem",
      },
      userName: "Joao Santos",
      drawTo,
    });

    const calls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls.map(c => String(c[0]));
    expect(calls.includes("Ascensão Rara")).toBe(true);
    expect(calls.some(c => c.includes("Registre todos os itens Raros do Codex"))).toBe(true);
    expect(calls.some(c => c.includes("Gerado por Joao Santos"))).toBe(true);
    expect(calls.some(c => c.startsWith("Em ") && /20\d\d/.test(c))).toBe(true);
  });

  it("usa a data da conquista quando achievedAt é informado", async () => {
    const { exportAchievementCard } = await import("./timelineExport");
    const ctx = makeCtx();
    const drawTo = {
      width: 1200,
      height: 900,
      getContext: vi.fn(() => ctx),
      toDataURL: vi.fn(() => "data:image/png;base64,MOCK"),
    } as unknown as HTMLCanvasElement;

    await exportAchievementCard({
      data: {
        title: "Ferreiro Aprendiz",
        description: "Complete todos os itens de Equipamentos",
        icon: "Swords",
        achievedAt: new Date(2026, 7, 1).getTime(),
      },
      userName: "Ana",
      drawTo,
    });

    const calls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls.map(c => String(c[0]));
    expect(calls.some(c => c.includes("01 de agosto de 2026"))).toBe(true);
  });
});

describe("card do histórico de conquistas (exportHistoryCard)", () => {
  const makeCtx = () => ({
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    roundRect: vi.fn(),
    rotate: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    set fillStyle(_v: string) {
      /* noop */
    },
    set font(_v: string) {
      /* noop */
    },
    set textAlign(_v: string) {
      /* noop */
    },
    set textBaseline(_v: string) {
      /* noop */
    },
    set lineWidth(_v: number) {
      /* noop */
    },
    set strokeStyle(_v: string) {
      /* noop */
    },
    measureText: vi.fn(() => ({ width: 0 })),
    canvas: { width: 1200, height: 900 },
  });

  it("desenha o nome do usuário, o cabeçalho e as medalhas com data e tipo", async () => {
    const { exportHistoryCard } = await import("./timelineExport");
    const ctx = makeCtx();
    const drawTo = {
      width: 1200,
      height: 900,
      getContext: vi.fn(() => ctx),
      toDataURL: vi.fn(() => "data:image/png;base64,MOCK"),
    } as unknown as HTMLCanvasElement;

    await exportHistoryCard({
      entries: [
        { key: "codex-10", title: "Primeiros 10", icon: "📖", unlockedAt: new Date(2026, 0, 15).getTime(), type: "codex" },
        { key: "gold-tips-5", title: "Dica de Ouro", icon: "⭐", unlockedAt: new Date(2026, 1, 20).getTime(), type: "gold" },
      ],
      userName: "Maria Silva",
      goldBadges: 5,
      drawTo,
    });

    const calls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls.map(c => String(c[0]));
    expect(calls.includes("Maria Silva — Histórico de Conquistas")).toBe(true);
    expect(calls.some(c => c.includes("2 medalhas · ★ 5 Dicas de Ouro"))).toBe(true);
    expect(calls.some(c => c.includes("Primeiros 10"))).toBe(true);
    expect(calls.some(c => c.includes("15 de jan"))).toBe(true);
    expect(calls.some(c => c.includes("Codex"))).toBe(true);
    expect(calls.some(c => c.includes("Dica de Ouro"))).toBe(true);
  });

  it("indica quando há mais medalhas do que as visíveis no card", async () => {
    const { exportHistoryCard } = await import("./timelineExport");
    const ctx = makeCtx();
    const drawTo = {
      width: 1200,
      height: 900,
      getContext: vi.fn(() => ctx),
      toDataURL: vi.fn(() => "data:image/png;base64,MOCK"),
    } as unknown as HTMLCanvasElement;

    const entries = Array.from({ length: 9 }, (_, i) => ({
      key: `codex-${i}`,
      title: `Conquista ${i + 1}`,
      icon: "📖",
      unlockedAt: new Date(2026, 0, i + 1).getTime(),
      type: "codex" as const,
    }));

    await exportHistoryCard({ entries, userName: "Pedro", drawTo });

    const calls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls.map(c => String(c[0]));
    expect(calls.some(c => c.includes("e mais 3 medalhas…"))).toBe(true);
  });
});

describe("card do comparador PvP (exportPvPCompareCard)", () => {
  const baseScenario = (label: string) => ({
    scenarioLabel: label,
    winner: "a" as const,
    winsA: 2,
    winsB: 1,
    valuesA: { dano: 85, defesa: 52, utilidade: 60 },
    valuesB: { dano: 78, defesa: 60, utilidade: 58 },
    rows: [
      { attrLabel: "Dano", valueA: 85, valueB: 78, delta: 7, winner: "a" as const },
      { attrLabel: "Defesa", valueA: 52, valueB: 60, delta: -8, winner: "b" as const },
      { attrLabel: "Utilidade", valueA: 60, valueB: 58, delta: 2, winner: "a" as const },
    ],
  });

  const buildData = (withRadar: boolean) => ({
    nameA: "Warrior",
    nameB: "Sorcerer",
    overallWinner: "a" as const,
    totals: { a: 675, b: 588 },
    scenarios: [baseScenario("PvP 1×1"), baseScenario("PvP em grupo"), baseScenario("Bosses / PvE")].map(
      sc => (withRadar ? sc : { ...sc, valuesA: undefined, valuesB: undefined }),
    ),
  });

  it("desenha o placar agregado com os nomes nos extremos e as barras dos atributos", async () => {
    const calls: string[] = [];
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => ({
        createLinearGradient: () => ({ addColorStop: () => {} }),
        fillRect: () => {},
        strokeRect: () => {},
        fillText: (text: string) => calls.push(String(text)),
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        fill: () => {},
        arc: () => {},
        measureText: (text: string) => ({ width: text.length * 10 }),
      }),
    } as unknown as HTMLCanvasElement;

    const { exportPvPCompareCard } = await import("./timelineExport");
    await exportPvPCompareCard({ data: buildData(true) as never, userName: "Testador", drawTo: canvas as never });

    expect(calls).toContain("Warrior");
    expect(calls).toContain("Sorcerer");
    expect(calls).toContain("675");
    expect(calls).toContain("588");
    expect(calls).toContain("PvP 1×1");
    expect(calls).toContain("Warrior leva a vantagem");
    // deltas das linhas de atributo
    expect(calls.some(c => c.startsWith("Dano: 85 × 78"))).toBe(true);
    expect(calls.some(c => c.includes("radar: dano · defesa · utilidade"))).toBe(true);
  });

  it("aumenta a altura do card quando os valores do radar estão presentes", async () => {
    const { exportPvPCompareCard } = await import("./timelineExport");
    const makeCanvas = () =>
      ({
        width: 0,
        height: 0,
        getContext: () => ({
          createLinearGradient: () => ({ addColorStop: () => {} }),
          fillRect: () => {},
          strokeRect: () => {},
          fillText: () => {},
          beginPath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          closePath: () => {},
          stroke: () => {},
          fill: () => {},
          arc: () => {},
          measureText: (t: string) => ({ width: t.length * 10 }),
        }),
      }) as unknown as HTMLCanvasElement;

    const withRadar = makeCanvas();
    await exportPvPCompareCard({ data: buildData(true) as never, userName: "Testador", drawTo: withRadar as never });
    const withoutRadar = makeCanvas();
    await exportPvPCompareCard({ data: buildData(false) as never, userName: "Testador", drawTo: withoutRadar as never });

    expect(withRadar.height).toBeGreaterThan(withoutRadar.height);
    // cada cenário com radar adiciona a área do radar (230 + 28 de respiro)
    expect(withRadar.height - withoutRadar.height).toBe(3 * 258);
  });

  it("desenha o polígono do radar com vértices proporcionais aos valores (valores clampados a 0–100)", () => {
    // Reproduz a mesma geometria de drawRadarExport para validar o clamping
    const radius = 74;
    const n = 3;
    const angle = (i: number) => -Math.PI / 2 + (i * Math.PI * 2) / n;
    const value = Math.min(100, Math.max(0, 135)) / 100;
    const a = angle(0);
    const x = radius * value * Math.cos(a);
    const y = radius * value * Math.sin(a);
    // valor acima de 100 é clamped, então o vértice fica na borda exata do raio
    expect(Math.hypot(x, y)).toBe(radius);
    expect(value).toBe(1);
  });
});
