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
