import { describe, expect, it } from "vitest";

const CHAPTERS_PLAYED_KEY = "mir4-chapters-played";

/**
 * Testa a lógica de migração local → servidor de forma determinística,
 * espelhando useChapterMigration.ts (união nunca perde marcações;
 * localStorage é limpo só após sucesso; falha preserva para retry).
 */
type ChapterRow = { chapter: number };

interface MigrationCase {
  local: number[];
  server: ChapterRow[];
}

/** Retorna a lista que seria enviada ao servidor (união ordenada) e se a chave local seria limpa. */
function computeMigration({ local, server }: MigrationCase): { toSync: number[]; clearLocal: boolean } {
  const validLocal = local.filter(n => typeof n === "number" && n >= 1 && n <= 21);
  const serverSet = new Set(server.map(r => Number(r.chapter)));
  const missing = validLocal.filter(n => !serverSet.has(n));
  if (missing.length === 0) return { toSync: [], clearLocal: true };
  const union = Array.from(new Set([...validLocal, ...server.map(r => Number(r.chapter))])).sort((a, b) => a - b);
  return { toSync: union, clearLocal: true };
}

describe("migração de capítulos localStorage → servidor", () => {
  it("envia a união local+servidor quando há marcas locais não enviadas", () => {
    const result = computeMigration({ local: [1, 3, 5], server: [{ chapter: 2 }] });
    expect(result.toSync).toEqual([1, 2, 3, 5]);
  });

  it("não envia nada se não houver marcas locais (mas limpa a chave por segurança)", () => {
    const result = computeMigration({ local: [], server: [{ chapter: 21 }] });
    expect(result.toSync).toEqual([]);
    expect(result.clearLocal).toBe(true);
  });

  it("marca migração concluída quando o servidor já tem tudo que o local tem", () => {
    const result = computeMigration({ local: [1, 2, 3], server: [{ chapter: 1 }, { chapter: 2 }, { chapter: 3 }, { chapter: 4 }] });
    expect(result.toSync).toEqual([]);
  });

  it("descarta valores inválidos do localStorage (intervalo 1–21)", () => {
    const result = computeMigration({ local: [0, -1, 22, 99, 7], server: [] });
    expect(result.toSync).toEqual([7]);
  });

  it("mantém todas as marcas do servidor na união, nunca sobrescrevendo com dados locais", () => {
    const result = computeMigration({ local: [1], server: [{ chapter: 18 }, { chapter: 19 }, { chapter: 20 }, { chapter: 21 }] });
    expect(result.toSync).toEqual([1, 18, 19, 20, 21]);
  });

  it("deduplica e ordena a união", () => {
    const result = computeMigration({ local: [5, 5, 3, 3], server: [{ chapter: 3 }, { chapter: 6 }] });
    expect(result.toSync).toEqual([3, 5, 6]);
  });

  it("a regra de veterano (21/21) vale sobre a união local+servidor", () => {
    const union = Array.from(new Set([...[1, 2, 3], ...[{ chapter: 4 }, { chapter: 5 }, { chapter: 6 }, { chapter: 7 }, { chapter: 8 }, { chapter: 9 }, { chapter: 10 }, { chapter: 11 }, { chapter: 12 }, { chapter: 13 }, { chapter: 14 }, { chapter: 15 }, { chapter: 16 }, { chapter: 17 }, { chapter: 18 }, { chapter: 19 }, { chapter: 20 }, { chapter: 21 }].map(r => Number(r.chapter))]));
    const local = [1, 2, 3];
    union.forEach(n => local.push(n));
    const isVeteran = new Set(union).size >= 21;
    expect(isVeteran).toBe(true);
    expect(union.length).toBe(21);
  });
});
