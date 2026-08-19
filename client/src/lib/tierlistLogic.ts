/**
 * Lógica pura da Tier List de classes (8 classes oficiais do MIR4).
 *
 * - resolveClassTier: calcula o tier exibido de uma classe num cenário.
 *   O voto pessoal (localStorage, persistido por cenário) prevalece sobre
 *   o tier de referência da comunidade (CLASS_TIER_RANKINGS).
 * - computeCommunityTiers: agrega os votos comunitários (backend) e soma
 *   ao tier de referência; o voto pessoal do usuário ainda prevalece.
 */
import { CLASS_TIER_RANKINGS, TIERLIST_SCENARIOS, type TierListTier } from "@shared/guideData";

export const TIER_LIST_KEY_PREFIX = "mir4-tier-";
export type TierListVote = "up" | "down"; // up = classe melhor que o tier atual; down = pior

export function getScenarioKeys(): string[] {
  return TIERLIST_SCENARIOS.map(s => s.key);
}

export function classTierStorageKey(scenarioKey: string, classKey: string): string {
  return `${TIER_LIST_KEY_PREFIX}${scenarioKey}-${classKey}`;
}

/** Tier de referência da comunidade para o cenário (defaults fixos). */
export function baseClassTier(scenarioKey: string, classKey: string): TierListTier | undefined {
  return CLASS_TIER_RANKINGS[scenarioKey]?.[classKey]?.tier;
}

/** Ler o tier pessoal de uma classe em um cenário (ou undefined se não houver). */
export function readPersonalTier(scenarioKey: string, classKey: string): TierListTier | undefined {
  try {
    const raw = localStorage.getItem(classTierStorageKey(scenarioKey, classKey));
    if (!raw) return undefined;
    const value = JSON.parse(raw) as TierListTier | null;
    return value ?? undefined;
  } catch {
    return undefined;
  }
}

/** Persistir o tier pessoal de uma classe em um cenário. */
export function writePersonalTier(scenarioKey: string, classKey: string, tier: TierListTier | undefined): void {
  try {
    if (tier === undefined) {
      localStorage.removeItem(classTierStorageKey(scenarioKey, classKey));
    } else {
      localStorage.setItem(classTierStorageKey(scenarioKey, classKey), JSON.stringify(tier));
    }
  } catch {
    /* storage indisponível — ignorar */
  }
}

const TIER_ORDER: TierListTier[] = ["S", "A", "B", "C"];

function shiftTier(tier: TierListTier, direction: TierListVote): TierListTier {
  const idx = TIER_ORDER.indexOf(tier);
  const next = direction === "up" ? idx - 1 : idx + 1;
  if (next < 0) return TIER_ORDER[0];
  if (next >= TIER_ORDER.length) return TIER_ORDER[TIER_ORDER.length - 1];
  return TIER_ORDER[next];
}

/**
 * Resolver o tier exibido de uma classe: o voto pessoal (aplicado sobre o tier
 * de referência) prevalece sobre o tier agregado da comunidade.
 */
export function resolveClassTier(
  scenarioKey: string,
  classKey: string,
  communityShift = 0,
): { tier: TierListTier; source: "personal" | "community" | "default"; why: string } {
  const base = baseClassTier(scenarioKey, classKey) ?? "B";
  const why = CLASS_TIER_RANKINGS[scenarioKey]?.[classKey]?.why ?? "";

  // Voto pessoal prevalece (localStorage).
  const personal = readPersonalTier(scenarioKey, classKey);
  if (personal) {
    return { tier: personal, source: "personal", why };
  }

  // Tier agregado pela comunidade (shift médio dos votos backend).
  if (communityShift !== 0) {
    const clamped = Math.max(-2, Math.min(2, Math.round(communityShift)));
    let t: TierListTier = base;
    for (let i = 0; i < Math.abs(clamped); i++) {
      t = shiftTier(t, clamped > 0 ? "up" : "down");
    }
    if (t !== base) return { tier: t, source: "community", why };
  }

  return { tier: base, source: "default", why };
}

export function getPersonalOverrideCount(scenarioKey: string, classKeys: string[]): number {
  return classKeys.filter(c => readPersonalTier(scenarioKey, c) !== undefined).length;
}

/** Agregar votos comunitários: devolve o shift médio por classe (float, usado como comunidadeShift). */
export function aggregateCommunityVotes(
  scenarioKey: string,
  votes: { classKey: string; vote: TierListVote }[],
): Record<string, number> {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};
  for (const v of votes) {
    if (v.vote === "up") {
      sums[v.classKey] = (sums[v.classKey] ?? 0) + 1;
    } else {
      sums[v.classKey] = (sums[v.classKey] ?? 0) - 1;
    }
    counts[v.classKey] = (counts[v.classKey] ?? 0) + 1;
  }
  const result: Record<string, number> = {};
  for (const [k, s] of Object.entries(sums)) {
    // shift médio arredondado: precisa de pelo menos 2 votos para mover
    if ((counts[k] ?? 0) >= 2) {
      result[k] = Math.round(s / counts[k]);
    }
  }
  void scenarioKey;
  return result;
}
