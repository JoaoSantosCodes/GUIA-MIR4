import { describe, it, expect } from "vitest";
import { evaluateChapterAchievements, TOTAL_CHAPTERS, CHAPTER_ACHIEVEMENTS } from "../client/src/lib/chapterAchievements";

describe("conquistas de capítulos", () => {
  it("define 21 capítulos e duas conquistas (10 e veterano)", () => {
    expect(TOTAL_CHAPTERS).toBe(21);
    expect(CHAPTER_ACHIEVEMENTS.length).toBe(2);
    expect(CHAPTER_ACHIEVEMENTS.map(a => a.key)).toContain("capitulos-veterano");
    const full = evaluateChapterAchievements(Array.from({ length: TOTAL_CHAPTERS }, (_, i) => i + 1));
    const veteran = full.find(a => a.key === "capitulos-veterano");
    expect(veteran).toBeDefined();
    expect(veteran!.goal).toBe(TOTAL_CHAPTERS);
  });

  it("Viajante do Tempo é conquistada com 10+ capítulos, veterano só com 21", () => {
    const ten = evaluateChapterAchievements([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(ten.find(a => a.key === "capitulos-10")!.earned).toBe(true);
    expect(ten.find(a => a.key === "capitulos-10")!.progress).toBe(10);
    expect(ten.find(a => a.key === "capitulos-veterano")!.earned).toBe(false);

    const full = evaluateChapterAchievements(Array.from({ length: 21 }, (_, i) => i + 1));
    expect(full.find(a => a.key === "capitulos-veterano")!.earned).toBe(true);
    expect(full.filter(a => a.earned).length).toBe(2);
  });

  it("ignora valores fora do intervalo e duplicados", () => {
    const messy = evaluateChapterAchievements([0, 22, 99, -1, 1, 1, 2]);
    const t = messy.find(a => a.key === "capitulos-10")!;
    // 0, 22, 99 e -1 estão fora do intervalo 1..21; o 1 duplicado conta uma única vez
    expect(t.progress).toBe(2);
    expect(t.earned).toBe(false);
    expect(evaluateChapterAchievements([]).find(a => a.key === "capitulos-veterano")!.progress).toBe(0);
  });

  it("progresso nunca ultrapassa a meta", () => {
    const full = evaluateChapterAchievements(Array.from({ length: 21 }, (_, i) => i + 1));
    for (const a of full) {
      expect(a.progress).toBeLessThanOrEqual(a.goal);
      expect(a.goal).toBeGreaterThan(0);
    }
  });
});
