import { describe, expect, it } from "vitest";
import { CHAPTER21_NEWS, MIR4_CHAPTERS, CHAPTER22_COMING_SOON } from "../shared/newsData";

describe("notícias do Capítulo 21 e 5º aniversário", () => {
  it("lista as novidades oficiais do Capítulo 21 com conteúdo válido", () => {
    expect(CHAPTER21_NEWS.length).toBeGreaterThan(0);
    for (const n of CHAPTER21_NEWS) {
      expect(n.key.length).toBeGreaterThan(0);
      expect(n.title.length).toBeGreaterThan(0);
      expect(n.description.length).toBeGreaterThan(0);
      expect(n.detail.length).toBeGreaterThan(0);
      expect(["Classe", "Servidores", "Sistemas", "Itens"]).toContain(n.category);
    }
    // Sem chaves duplicadas
    const keys = new Set(CHAPTER21_NEWS.map(n => n.key));
    expect(keys.size).toBe(CHAPTER21_NEWS.length);
  });

  it("inclui a nova classe Invocador com as informações oficiais", () => {
    const inv = CHAPTER21_NEWS.find(n => n.key === "invocador");
    expect(inv).toBeDefined();
    expect(inv!.title).toContain("Invocador");
    expect(inv!.detail).toContain("Mudança de Classe");
    expect(inv!.category).toBe("Classe");
  });

  it("inclui os destaques do 5º aniversário e da migração mainnet", () => {
    const categories = new Set(CHAPTER21_NEWS.map(n => n.category));
    expect(categories.has("Sistemas")).toBe(true);
    const mainnet = CHAPTER21_NEWS.find(n => n.key === "migracao-mainnet");
    expect(mainnet).toBeDefined();
    expect(`${mainnet!.title} ${mainnet!.description} ${mainnet!.detail}`).toContain("WEMIX3.0");
  });
});

describe("linha do tempo dos capítulos do MIR4", () => {
  it("cobre os 21 capítulos em ordem numérica", () => {
    expect(MIR4_CHAPTERS.length).toBe(21);
    for (let i = 0; i < MIR4_CHAPTERS.length; i++) {
      expect(MIR4_CHAPTERS[i].number).toBe(i + 1);
      expect(MIR4_CHAPTERS[i].title.length).toBeGreaterThan(0);
      expect(MIR4_CHAPTERS[i].date.length).toBeGreaterThan(0);
      expect(MIR4_CHAPTERS[i].highlights.length).toBeGreaterThan(0);
      expect(["2021", "2022", "2023", "2024", "2025", "2026"]).toContain(MIR4_CHAPTERS[i].year);
    }
  });

  it("começa em Névoa de Guerra (2021) e termina em Invocador (2026)", () => {
    const first = MIR4_CHAPTERS[0];
    const last = MIR4_CHAPTERS[MIR4_CHAPTERS.length - 1];
    expect(first.title).toBe("Névoa de Guerra");
    expect(first.year).toBe("2021");
    expect(last.title).toBe("Invocador");
    expect(last.year).toBe("2026");
    expect(last.highlights.some(h => h.includes("Spirit Summoner"))).toBe(true);
  });

  it("registra marcos oficiais corretos nos capítulos-chave", () => {
    const cap1 = MIR4_CHAPTERS[0];
    expect(cap1.highlights.some(h => h.includes("Arbalist"))).toBe(true);
    const cap10 = MIR4_CHAPTERS.find(c => c.number === 10);
    expect(cap10).toBeDefined();
    expect(cap10!.title).toBe("Torre do Dragão Negro");
    expect(cap10!.highlights.some(h => h.includes("170"))).toBe(true);
    const cap5 = MIR4_CHAPTERS.find(c => c.number === 5);
    expect(cap5).toBeDefined();
    expect(cap5!.highlights.some(h => h.includes("150"))).toBe(true);
  });

  it("anuncia o próximo capítulo", () => {
    expect(CHAPTER22_COMING_SOON).toContain("22");
  });
});
