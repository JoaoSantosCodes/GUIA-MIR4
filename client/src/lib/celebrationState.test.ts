import { afterEach, describe, expect, it, vi } from "vitest";
import { readCelebrationEnabled, readLastAchievement, writeCelebrationEnabled, writeLastAchievement } from "./celebrationState";

// Ambiente vitest: node (sem localStorage). Polifilla apenas para estes testes.
const store = new Map<string, string>();
const lsMock = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => store.set(k, v),
  removeItem: (k: string) => store.delete(k),
};
vi.stubGlobal("localStorage", lsMock);

afterEach(() => {
  store.clear();
});

describe("celebrationState", () => {
  it("padrão de celebração é habilitado quando não há chave", () => {
    expect(readCelebrationEnabled()).toBe(true);
  });

  it("persiste e restaura o toggle de celebração", () => {
    writeCelebrationEnabled(false);
    expect(readCelebrationEnabled()).toBe(false);
    writeCelebrationEnabled(true);
    expect(readCelebrationEnabled()).toBe(true);
  });

  it("persiste e restaura a última conquista com validação", () => {
    const ach = { title: "Mestre Épico", description: "d", iconKey: "sparkle", unlockedAt: 1787090000000 };
    writeLastAchievement(ach);
    expect(readLastAchievement()).toEqual(ach);
  });

  it("retorna null quando o JSON armazenado é inválido", () => {
    lsMock.setItem("mir4-last-achievement", "{invalido");
    expect(readLastAchievement()).toBeNull();
  });

  it("retorna null quando faltam campos obrigatórios", () => {
    lsMock.setItem("mir4-last-achievement", JSON.stringify({ title: "X" }));
    expect(readLastAchievement()).toBeNull();
  });

  it("retorna null quando a chave não existe", () => {
    expect(readLastAchievement()).toBeNull();
    expect(readCelebrationEnabled()).toBe(true);
  });
});
