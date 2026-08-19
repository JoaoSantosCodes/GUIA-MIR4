import { describe, it, expect } from "vitest";
import { setChapterProgress, listChapterProgress } from "./db";

/**
 * Testes da persistência server-side dos capítulos marcados na linha do tempo.
 * Nota: os helpers do db validam entrada (1-21) e usam upsert + limpeza dos capítulos
 * não listados, garantindo que o estado do servidor sempre reflita exatamente a
 * lista enviada pelo cliente (sincronização bidirecional).
 */

const TEST_USER_ID = 999999; // usuário inexistente no banco de produção; usado apenas para validar a lógica

describe("setChapterProgress / listChapterProgress", () => {
  it("grava capítulos e os retorna na listagem", async () => {
    const result = await setChapterProgress(TEST_USER_ID, [1, 5, 21]);
    expect(result.success).toBe(true);
    const rows = await listChapterProgress(TEST_USER_ID);
    const chapters = rows.map(r => r.chapter).sort((a, b) => a - b);
    expect(chapters).toEqual([1, 5, 21]);
    // Limpeza do teste
    await setChapterProgress(TEST_USER_ID, []);
  });

  it("filtra capítulos fora do intervalo 1-21", async () => {
    await setChapterProgress(TEST_USER_ID, [0, 10, 22, -1]);
    const rows = await listChapterProgress(TEST_USER_ID);
    const chapters = rows.map(r => r.chapter);
    expect(chapters).toEqual([10]);
    await setChapterProgress(TEST_USER_ID, []);
  });

  it("removes capítulos que não estão na nova lista (sync completo)", async () => {
    await setChapterProgress(TEST_USER_ID, [2, 4, 6, 8]);
    await setChapterProgress(TEST_USER_ID, [2, 8]);
    const rows = await listChapterProgress(TEST_USER_ID);
    const chapters = rows.map(r => r.chapter).sort((a, b) => a - b);
    expect(chapters).toEqual([2, 8]);
    await setChapterProgress(TEST_USER_ID, []);
  });

  it("aceita lista vazia (desmarcar tudo)", async () => {
    await setChapterProgress(TEST_USER_ID, [1, 2, 3]);
    await setChapterProgress(TEST_USER_ID, []);
    const rows = await listChapterProgress(TEST_USER_ID);
    expect(rows.length).toBe(0);
  });

  it("upsert não duplica registros ao reenviar a mesma lista", async () => {
    await setChapterProgress(TEST_USER_ID, [7, 14]);
    await setChapterProgress(TEST_USER_ID, [7, 14]);
    const rows = await listChapterProgress(TEST_USER_ID);
    expect(rows.length).toBe(2);
    await setChapterProgress(TEST_USER_ID, []);
  });
});

describe("evaluateChapterAchievements (regra de veterano)", () => {
  it("conquista Veterano de Sabuk exige 21/21 capítulos", async () => {
    const { evaluateChapterAchievements, TOTAL_CHAPTERS } = await import("../client/src/lib/chapterAchievements");
    const all = Array.from({ length: TOTAL_CHAPTERS }, (_, i) => i + 1);
    const veteran21 = evaluateChapterAchievements(all).find(a => a.key === "capitulos-veterano");
    expect(veteran21?.earned).toBe(true);
    const veteran20 = evaluateChapterAchievements(all.slice(0, 20)).find(a => a.key === "capitulos-veterano");
    expect(veteran20?.earned).toBe(false);
  });
});
