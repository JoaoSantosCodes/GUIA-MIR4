import { describe, expect, it } from "vitest";
import { CHAPTER21_NEWS, MIR4_CHAPTERS, CHAPTER22_COMING_SOON, SERVER_MERGE_MAP } from "../shared/newsData";

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
  it("cobre os 21 capítulos históricos em ordem numérica (mais o próximo Coming Soon)", () => {
    expect(MIR4_CHAPTERS.length).toBe(22);
    const chapters = MIR4_CHAPTERS.slice(0, 21);
    for (let i = 0; i < chapters.length; i++) {
      expect(chapters[i].number).toBe(i + 1);
      expect(chapters[i].title.length).toBeGreaterThan(0);
      expect(chapters[i].date.length).toBeGreaterThan(0);
      expect(chapters[i].highlights.length).toBeGreaterThan(0);
      expect(["2021", "2022", "2023", "2024", "2025", "2026"]).toContain(chapters[i].year);
    }
    const next = MIR4_CHAPTERS[21];
    expect(next.title).toContain("Coming Soon");
  });

  it("começa em Névoa de Guerra (2021) e o capítulo 21 é o Invocador (2026)", () => {
    const first = MIR4_CHAPTERS[0];
    const cap21 = MIR4_CHAPTERS.find(c => c.number === 21);
    expect(first.title).toBe("Névoa de Guerra");
    expect(first.year).toBe("2021");
    expect(cap21).toBeDefined();
    expect(cap21!.title).toBe("Invocador");
    expect(cap21!.year).toBe("2026");
    expect(cap21!.highlights.some(h => h.includes("Spirit Summoner"))).toBe(true);
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

describe("Tabela de fusões de servidores (SERVER_MERGE_MAP)", () => {
  it("contém todas as 7 regiões com servidores resultantes", () => {
    const regions = Object.keys(SERVER_MERGE_MAP);
    expect(regions).toHaveLength(7);
    for (const region of regions) {
      expect(Object.keys(SERVER_MERGE_MAP[region]).length).toBeGreaterThan(0);
    }
  });

  it("cada servidor resultante contém a si mesmo na lista de fundidos e nenhum servidor aparece como absorvido em duas fusões", () => {
    const absorbed = new Set<string>();
    for (const servers of Object.values(SERVER_MERGE_MAP)) {
      for (const [result, merge] of Object.entries(servers)) {
        expect(merge.mergedServers.length).toBeGreaterThan(0);
        expect(merge.mergedServers).toContain(result);
        for (const name of merge.mergedServers) {
          expect(absorbed.has(name), `servidor absorvido duas vezes: ${name}`).toBe(false);
          absorbed.add(name);
        }
      }
    }
  });

  it("a região NA1 inclui fusões reais (NA012+NA041) e a EU1 funde EU011+EU013", () => {
    const na1 = SERVER_MERGE_MAP.NA1;
    expect(na1.NA012.mergedServers).toEqual(["NA012", "NA041"]);
    const eu1 = SERVER_MERGE_MAP.EU1;
    expect(eu1.EU011.mergedServers).toEqual(["EU011", "EU013"]);
  });
});
