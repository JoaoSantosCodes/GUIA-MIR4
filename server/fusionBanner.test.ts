/**
 * Testes da lógica do banner de countdown da Fusão de Servidores.
 * Valida a data-alvo (01/09/2026 00:00 UTC+8 = 31/08/2026 16:00 UTC),
 * a formatação do countdown e a lógica de urgência (<48h).
 */
import { describe, expect, it } from "vitest";

// Replicação da constante do FusionCountdownBanner para validação determinística.
const FUSION_START_MS = Date.UTC(2026, 8, 0, 16, 0, 0);

function formatCountdown(remainingMs: number): { label: string; short: string; urgent: boolean } {
  if (remainingMs <= 0) return { label: "Manutenção em andamento", short: "Agora", urgent: false };
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const label = days > 0 ? `${days}d ${pad(hours)}h ${pad(minutes)}min` : `${pad(hours)}h ${pad(minutes)}min ${pad(seconds)}s`;
  const short = days > 0 ? `${days}d ${pad(hours)}h` : `${pad(hours)}:${pad(minutes)}`;
  return { label, short, urgent: remainingMs < 48 * 60 * 60 * 1000 };
}

describe("FusionCountdownBanner — data-alvo da manutenção", () => {
  it("corresponde a 01/09/2026 00:00 em UTC+8 (início da manutenção)", () => {
    const date = new Date(FUSION_START_MS);
    expect(date.getUTCFullYear()).toBe(2026);
    expect(date.getUTCMonth()).toBe(7); // agosto (0-indexed)
    expect(date.getUTCDate()).toBe(31);
    expect(date.getUTCHours()).toBe(16); // 31/08 16:00 UTC == 01/09 00:00 UTC+8
  });

  it("formata corretamente com dias restantes (2 semanas antes)", () => {
    const remaining = 14 * 24 * 60 * 60 * 1000;
    const { label, short, urgent } = formatCountdown(remaining);
    expect(label).toBe("14d 00h 00min");
    expect(short).toBe("14d 00h");
    expect(urgent).toBe(false);
  });

  it("formata corretamente dentro do dia final (modo horas/minutos/segundos)", () => {
    const remaining = 3 * 60 * 60 * 1000 + 45 * 60 * 1000 + 12 * 1000;
    const { label, short, urgent } = formatCountdown(remaining);
    expect(label).toBe("03h 45min 12s");
    expect(short).toBe("03:45");
    expect(urgent).toBe(true);
  });

  it("marca como urgente abaixo de 48 horas (limite estrito)", () => {
    const fortyEight = 48 * 60 * 60 * 1000;
    expect(formatCountdown(fortyEight).urgent).toBe(false); // exatamente 48h ainda não é urgente
    expect(formatCountdown(fortyEight + 1).urgent).toBe(false);
    expect(formatCountdown(fortyEight - 1).urgent).toBe(true); // qualquer instante abaixo dispara
  });

  it("trata o momento da manutenção (zero restante)", () => {
    const { label, short } = formatCountdown(0);
    expect(label).toBe("Manutenção em andamento");
    expect(short).toBe("Agora");
  });

  it("não produz valores negativos após a manutenção", () => {
    const after = FUSION_START_MS - Date.UTC(2026, 8, 2);
    expect(formatCountdown(after).label).toBe("Manutenção em andamento");
  });
});

describe("GoblinBanner — janela de alerta da Loja do Goblin", () => {
  const GOBLIN_END_MS = Date.UTC(2026, 8, 14, 14, 59, 0); // 14/09 23:59 KST

  it("o fim da loja ocorre depois do início da fusão", () => {
    const FUSION_START_MS = Date.UTC(2026, 8, 0, 16, 0, 0);
    expect(GOBLIN_END_MS).toBeGreaterThan(FUSION_START_MS);
  });

  it("a janela de alerta de 24h corresponde a 13/09 23:59 KST", () => {
    const ALERT_WINDOW_MS = 24 * 60 * 60 * 1000;
    const alertStart = new Date(GOBLIN_END_MS - ALERT_WINDOW_MS);
    expect(alertStart.getUTCFullYear()).toBe(2026);
    expect(alertStart.getUTCMonth()).toBe(8);
    expect(alertStart.getUTCDate()).toBe(13);
    expect(alertStart.getUTCHours()).toBe(14);
    expect(alertStart.getUTCMinutes()).toBe(59);
  });
});
