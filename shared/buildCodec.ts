import { CLASS_SKILLS } from "./guideData";

/**
 * Formato de texto compartilhável de builds de skills:
 * MIR4-SKILLS:{classe}|{cenario}|{skills separadas por +}|{rotation}|{notas}
 * URL-safe, legível e sem dependência de servidor.
 */
export const BUILD_PREFIX = "MIR4-SKILLS:";

export interface BuildText {
  classKey: string;
  scenario: string;
  skills: string[];
  rotation: string;
  notes: string;
}

export function encodeBuild(build: { classKey: string; scenario: string; skills: string[]; rotation: string; notes: string }): string {
  const validClass = CLASS_SKILLS.some(c => c.key === build.classKey) ? build.classKey : build.classKey;
  const parts = [
    validClass,
    build.scenario ?? "custom",
    build.skills.join("+"),
    build.rotation,
    build.notes,
  ].map(p => String(p ?? ""));
  return `${BUILD_PREFIX}${parts.map(p => encodeURIComponent(p)).join("|")}`;
}

export interface BuildTextResult {
  classKey: string;
  scenario: string;
  skills: string[];
  rotation: string;
  notes: string;
  importedClassKnown: boolean;
}

export function decodeBuild(text: string): BuildTextResult | null {
  const raw = (text ?? "").trim();
  const body = raw.startsWith(BUILD_PREFIX) ? raw.slice(BUILD_PREFIX.length) : raw;
  const parts = body.split("|").map(p => decodeURIComponent(p ?? ""));
  if (parts.length < 5) return null;
  const [classKey, scenario, skills, rotation, notes] = parts;
  if (!classKey || !scenario || !skills) return null;
  const skillsList = skills.split("+").map(s => s.trim()).filter(Boolean);
  const known = CLASS_SKILLS.some(c => c.key === classKey);
  return { classKey, scenario, skills: skillsList, rotation: rotation ?? "", notes: notes ?? "", importedClassKnown: known };
}

