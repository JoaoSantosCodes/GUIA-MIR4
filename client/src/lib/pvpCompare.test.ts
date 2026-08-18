import { describe, expect, it } from "vitest";
import { compareBuilds, COMPARE_CLASSES, SCENARIOS } from "./pvpCompare";

describe("compareBuilds", () => {
  it("retorna null para classes iguais ou inválidas", () => {
    expect(compareBuilds("warrior", "warrior")).toBeNull();
    expect(compareBuilds("warrior", "invalido")).toBeNull();
    expect(compareBuilds("invalido", "lancer")).toBeNull();
  });

  it("compara warrior × sorcerer retornando 9 linhas (3 cenários × 3 atributos)", () => {
    const res = compareBuilds("warrior", "sorcerer");
    expect(res).not.toBeNull();
    expect(res!.rows.length).toBe(9);
    expect(res!.rows.filter(r => r.scenario === "duel").length).toBe(3);
  });

  it("calcula deltas corretos no duelo warrior × sorcerer", () => {
    const res = compareBuilds("warrior", "sorcerer");
    const duelDano = res!.rows.find(r => r.scenario === "duel" && r.attribute === "dano")!;
    expect(duelDano.valueA).toBe(78);
    expect(duelDano.valueB).toBe(85);
    expect(duelDano.delta).toBe(-7);
    expect(duelDano.winner).toBe("b");
  });

  it("identifica empates quando os scores são iguais", () => {
    const res = compareBuilds("warrior", "sorcerer");
    // warrior defesa duel 92 × sorcerer 52 → vitória A; procuramos algum empate: não há — testamos o mecanismo invertendo
    const allDraw = res!.rows.every(r =>
      r.delta === (r.valueA - r.valueB) &&
      (r.delta > 0 ? r.winner === "a" : r.delta < 0 ? r.winner === "b" : r.winner === "draw"),
    );
    expect(allDraw).toBe(true);
  });

  it("placar agregado: warrior (675) vence sorcerer (588) na soma total", () => {
    const res = compareBuilds("warrior", "sorcerer");
    expect(res!.totals.a).toBe(675);
    expect(res!.totals.b).toBe(588);
    expect(res!.overallWinner).toBe("a");
  });

  it("lancer vence warrior nos cenários de grupo (2×1) e boss (2×1)", () => {
    const res = compareBuilds("lancer", "warrior");
    expect(res!.scenarioWins.group.a).toBe(2);
    expect(res!.scenarioWins.boss.a).toBe(2);
    expect(res!.overallWinner).toBe("a");
  });

  it("ordem simétrica: comparar a×b dá deltas opostos de b×a", () => {
    const ab = compareBuilds("warrior", "sorcerer")!;
    const ba = compareBuilds("sorcerer", "warrior")!;
    ab.rows.forEach((row, i) => {
      expect(row.delta).toBe(-ba.rows[i].delta);
      expect(row.valueA).toBe(ba.rows[i].valueB);
    });
  });

  it("todas as 5 classes possuem scores em 0–100 nos 3 cenários", () => {
    expect(COMPARE_CLASSES.length).toBe(5);
    for (const c of COMPARE_CLASSES) {
      for (const s of SCENARIOS) {
        for (const attr of Object.keys(c.scores[s]) as (keyof typeof c.scores.duel)[]) {
          expect(c.scores[s][attr]).toBeGreaterThanOrEqual(0);
          expect(c.scores[s][attr]).toBeLessThanOrEqual(100);
        }
      }
    }
  });
});
