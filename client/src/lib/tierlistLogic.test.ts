import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  aggregateCommunityVotes,
  baseClassTier,
  getPersonalOverrideCount,
  readPersonalTier,
  resolveClassTier,
  writePersonalTier,
} from "./tierlistLogic";

const memory = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => (memory.has(k) ? memory.get(k)! : null),
  setItem: (k: string, v: string) => {
    memory.set(k, v);
  },
  removeItem: (k: string) => {
    memory.delete(k);
  },
});

beforeEach(() => {
  memory.clear();
});

describe("tierlistLogic", () => {
  it("retorna o tier de referência padrão quando não há override", () => {
    const resolved = resolveClassTier("farm", "sorcerer");
    expect(resolved.tier).toBe("S");
    expect(resolved.source).toBe("default");
  });

  it("baseClassTier cobre as 8 classes nos 3 cenários", () => {
    const keys = ["warrior", "sorcerer", "taoist", "lancer", "arbalist", "darkist", "lionheart", "spiritsummoner"];
    for (const scenario of ["massivo", "farm", "bosses"]) {
      for (const k of keys) {
        expect(baseClassTier(scenario, k)).toBeDefined();
      }
    }
  });

  it("o override pessoal prevalece sobre o tier padrão", () => {
    writePersonalTier("massivo", "warrior", "A");
    const resolved = resolveClassTier("massivo", "warrior");
    expect(resolved.tier).toBe("A");
    expect(resolved.source).toBe("personal");
  });

  it("o override pessoal prevalece sobre o shift comunitário", () => {
    writePersonalTier("farm", "lancer", "A");
    const resolved = resolveClassTier("farm", "lancer", 3);
    expect(resolved.tier).toBe("A");
    expect(resolved.source).toBe("personal");
  });

  it("o shift comunitário move o tier na direção correta", () => {
    // lancer em farm é B; shift -2 (2 votos down médios) leva a C
    const resolved = resolveClassTier("farm", "lancer", -2);
    expect(resolved.tier).toBe("C");
    expect(resolved.source).toBe("community");
  });

  it("o shift comunitário satura nos limites S e C", () => {
    expect(resolveClassTier("farm", "sorcerer", 10).tier).toBe("S");
    expect(resolveClassTier("farm", "lancer", -10).tier).toBe("C");
  });

  it("remove o override pessoal quando writePersonalTier recebe undefined", () => {
    writePersonalTier("bosses", "darkist", "A");
    expect(readPersonalTier("bosses", "darkist")).toBe("A");
    writePersonalTier("bosses", "darkist", undefined);
    expect(readPersonalTier("bosses", "darkist")).toBeUndefined();
  });

  it("aggregateCommunityVotes requer 2+ votos e retorna o shift médio arredondado", () => {
    const votes = [
      { classKey: "warrior", vote: "up" as const },
      { classKey: "warrior", vote: "up" as const },
      { classKey: "warrior", vote: "down" as const },
      { classKey: "lionheart", vote: "up" as const }, // 1 voto — não move
    ];
    const agg = aggregateCommunityVotes("massivo", votes);
    expect(agg.warrior).toBe(0); // (2-1)/2 rounds to 0
    expect(agg.lionheart).toBeUndefined();
  });

  it("aggregateCommunityVotes move com maioria consistente", () => {
    const votes = [
      { classKey: "taoist", vote: "up" as const },
      { classKey: "taoist", vote: "up" as const },
    ];
    const agg = aggregateCommunityVotes("massivo", votes);
    expect(agg.taoist).toBe(1);
  });

  it("getPersonalOverrideCount conta apenas classes com override", () => {
    writePersonalTier("massivo", "warrior", "S");
    writePersonalTier("massivo", "sorcerer", "B");
    const keys = ["warrior", "sorcerer", "taoist"];
    expect(getPersonalOverrideCount("massivo", keys)).toBe(2);
  });
});
