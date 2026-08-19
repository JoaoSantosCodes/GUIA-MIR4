/**
 * Lógica pura da Tier List de espíritos (10 espíritos com identidade própria).
 *
 * - resolveSpiritTier: calcula o tier exibido de um espírito num cenário.
 *   O voto pessoal (localStorage, persistido por cenário) prevalece sobre
 *   o tier de referência da comunidade (SPIRIT_TIER_RANKINGS).
 * - aggregateSpiritCommunityVotes: agrega os votos comunitários (backend) e soma
 *   ao tier de referência; o voto pessoal do usuário ainda prevalece.
 */
import { SPIRIT_TIER_RANKINGS, type TierListTier } from "@shared/guideData";
export const SPIRIT_TIER_KEY_PREFIX = "mir4-spirit-tier-";
export type SpiritTierVote = "up" | "down"; // up = espírito melhor que o tier atual; down = pior
const TIER_ORDER: TierListTier[] = ["S", "A", "B", "C"];
function shiftTier(tier: TierListTier, direction: SpiritTierVote): TierListTier {
  const idx = TIER_ORDER.indexOf(tier);
  const next = direction === "up" ? idx - 1 : idx + 1;
  if (next < 0) return TIER_ORDER[0];
  if (next >= TIER_ORDER.length) return TIER_ORDER[TIER_ORDER.length - 1];
  return TIER_ORDER[next];
}
export function spiritTierStorageKey(scenarioKey: string, spiritKey: string): string {
  return `${SPIRIT_TIER_KEY_PREFIX}${scenarioKey}-${spiritKey}`;
}
/** Tier de referência da comunidade para o cenário (defaults fixos). */
export function baseSpiritTier(scenarioKey: string, spiritKey: string): TierListTier | undefined {
  return SPIRIT_TIER_RANKINGS[scenarioKey]?.[spiritKey]?.tier;
}
/** Ler o tier pessoal de um espírito em um cenário (ou undefined se não houver). */
export function readPersonalSpiritTier(scenarioKey: string, spiritKey: string): TierListTier | undefined {
  try {
    const raw = localStorage.getItem(spiritTierStorageKey(scenarioKey, spiritKey));
    if (!raw) return undefined;
    const value = JSON.parse(raw) as TierListTier | null;
    return value ?? undefined;
  } catch {
    return undefined;
  }
}
/** Persistir o tier pessoal de um espírito em um cenário. */
export function writePersonalSpiritTier(scenarioKey: string, spiritKey: string, tier: TierListTier | undefined): void {
  try {
    if (tier === undefined) {
      localStorage.removeItem(spiritTierStorageKey(scenarioKey, spiritKey));
    } else {
      localStorage.setItem(spiritTierStorageKey(scenarioKey, spiritKey), JSON.stringify(tier));
    }
  } catch {
    /* storage indisponível — ignorar */
  }
}
/**
 * Resolver o tier exibido de um espírito: o voto pessoal (aplicado sobre o tier
 * de referência) prevalece sobre o tier agregado da comunidade.
 */
export function resolveSpiritTier(
  scenarioKey: string,
  spiritKey: string,
  communityShift = 0,
): { tier: TierListTier; source: "personal" | "community" | "default"; why: string } {
  const base = baseSpiritTier(scenarioKey, spiritKey) ?? "B";
  const why = SPIRIT_TIER_RANKINGS[scenarioKey]?.[spiritKey]?.why ?? "";
  // Voto pessoal prevalece (localStorage).
  const personal = readPersonalSpiritTier(scenarioKey, spiritKey);
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
export function getPersonalSpiritOverrideCount(scenarioKey: string, spiritKeys: string[]): number {
  return spiritKeys.filter(s => readPersonalSpiritTier(scenarioKey, s) !== undefined).length;
}
/** Agregar votos comunitários: devolve o shift médio por espírito (float, usado como comunidadeShift). */
export function aggregateSpiritCommunityVotes(
  scenarioKey: string,
  votes: { spiritKey: string; vote: SpiritTierVote }[],
): Record<string, number> {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};
  for (const v of votes) {
    if (v.vote === "up") {
      sums[v.spiritKey] = (sums[v.spiritKey] ?? 0) + 1;
    } else {
      sums[v.spiritKey] = (sums[v.spiritKey] ?? 0) - 1;
    }
    counts[v.spiritKey] = (counts[v.spiritKey] ?? 0) + 1;
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
