/**
 * Notícias oficiais do MIR4 — Capítulo 21 e 5º aniversário (agosto 2026)
 * Fonte: mir4global.com (Notas do Patch de 18 de agosto de 2026 e avisos oficiais)
 */

export interface Chapter21NewsItem {
  key: string;
  category: "Classe" | "Servidores" | "Sistemas" | "Itens";
  title: string;
  description: string;
  detail: string;
  /** Data de fim da oferta/evento em ISO 8601 com fuso UTC+8 (apenas para vigências limitadas). */
  endDate?: string;
  /** Link da nota de patch oficial da Wemade no fórum do MIR4 Global. */
  url: string;
}

export const CHAPTER21_NEWS: Chapter21NewsItem[] = [
  {
    key: "invocador",
    category: "Classe",
    url: "https://forum.mir4global.com/post/2598?lang=pt",
    title: "Nova classe: Invocador (Spirit Summoner)",
    description:
      "A 8ª classe do MIR4 chegou no Capítulo 21: uma invocadora de ataque mágico que comanda os espíritos de toda a criação com uma vara mágica.",
    detail:
      "A Invocadora usa varinha mágica, invoca e comanda espíritos, luta ao lado deles e domina o combate versátil à distância. Skills principais: Vórtice Espiritual, Onda Espiritual, Passo Espiritual, Areias Ilusórias, Círculo de Raios, Presa Negra, Pluma Dourada, Prisão Abissal, Fascínio, Fonte Espiritual, Corte da Alma, Explosão do Dragão e Orbe Explosivo. ATENÇÃO oficial: a classe NÃO pode realizar Mudança de Classe (nem para outras, nem de outras para ela).",
  },
  {
    key: "fusao-servidores",
    endDate: "2026-09-01T00:00:00+08:00",
    url: "https://forum.mir4global.com/post/2598?lang=pt",
    category: "Servidores",
    title: "Fusão de Servidores",
    description:
      "A Wemade está fundindo servidores para unificar as forças — o mapa de forças será reorganizado.",
    detail:
      "Com a redução do número total de servidores, o Mapa das Forças foi ajustado. O Saque entre servidores, temporariamente suspenso durante a preparação, voltou após a manutenção de 18/08/2026. O 23º Confronto de Sabuk (previsto para agosto) foi adiado para outubro para garantir uma fusão tranquila. Um Passe de Viagem do Viajante promocional (500 Copper, nível 40+) está à venda até 1º de setembro.",
  },
  {
    key: "mundo-impulsionador",
    category: "Servidores",
    url: "https://forum.mir4global.com/post/2598?lang=pt",
    title: "Servidor Especializado em Crescimento: Mundo Impulsionador",
    description:
      "4º servidor do jogo, dedicado a acelerar a progressão de novos jogadores.",
    detail:
      "Eventos exclusivos: Presença de 7 dias de boas-vindas com Caixa de Recompensa de Nível, Presença de 28 dias acumulada de Yiun, Os Mais Poderosos do Mundo Impulsionador, Pergaminho do Yiun, Missão de Passe, evento de subida de nível, evento de Poder de Combate e Recarga Feliz de Porquínio.",
  },
  {
    key: "5aniversario",
    category: "Sistemas",
    url: "https://forum.mir4global.com/post/2598?lang=pt",
    title: "5º Aniversário do MIR4 (agosto 2026)",
    description:
      "O jogo completa 5 anos em agosto de 2026 com uma série de eventos comemorativos.",
    detail:
      "Eventos: Presença de 14 dias, Presença de 7 dias, Bênção do Dragão Divino, Loja de Troca de Moeda de Agradecimento, Invocação + Invocação do 5º Aniversário, A Grande Fortuna de Osher, Obtenção de Raide/Raide de Boss do evento, Presente Surpresa de Mir e eventos de comunidade (Tomo Secreto do Invocador e Festa de Aniversário de 5 Anos).",
  },
  {
    key: "goblin-ouro-bolo",
    category: "Itens",
    title: "Bolo de Agradecimento (destaque da loja Goblin de Ouro)",
    description:
      "A venda do Bolo de Agradecimento termina em 1º de setembro e desbloqueia a loja do Goblin de Ouro até 14/09.",
    detail:
      "Bolo de Agradecimento de 5 Anos em venda até 1º de setembro (23h59 UTC+8). A loja do Goblin de Ouro funciona até 14 de setembro, 23h59 UTC+8, com Caixas de Material de Dragão Lendário, Pedras de Aprimoramento do Dragão Divino, Bilhetes de Praça Mágica/Pico Secreto Fissurados e Caixas de Aço de Dragão Épico.",
    endDate: "2026-09-14T23:59:00+08:00",
    url: "https://forum.mir4global.com/post/470?lang=pt",
  },
  {
    key: "loja-goblin",
    category: "Itens",
    title: "Nova Loja de NPC: Goblin de Ouro do Aniversário",
    description:
      "NPC 'Celebração do 5º Aniversário' nas principais cidades, trocando itens pelo Bolo de Agradecimento.",
    detail:
      "Os 19 produtos em oferta incluem o 'Bolo de Agradecimento do Aniversário de 5 Anos' (venda até 1º de setembro), que desbloqueia a loja do Goblin de Ouro (até 14 de setembro, 23h59 UTC+8). Itens da loja: Caixas de Material de Dragão Lendário, Pedras de Aprimoramento do Dragão Divino, Bilhetes de Praça Mágica/Pico Secreto Fissurados, Caixas de Aço de Dragão Épico e mais.",
    url: "https://forum.mir4global.com/post/470?lang=pt",
  },
  {
    key: "artefatos-miticos",
    category: "Itens",
    title: "Novos Artefatos de Dragão Míticos",
    description:
      "A raridade Mítica chegou aos Artefatos de Dragão no Capítulo 21.",
    detail:
      "Novos Artefatos de Dragão de raridade Mítica foram adicionados, no topo da progressão dos 5 slots de Artefatos de Dragão. A Loja de NPC do aniversário também vende Pedra de Aprimoramento de Artefato de Dragão do Dragão Divino Lendária.",
    url: "https://forum.mir4global.com/post/2598?lang=pt",
  },
  {
    key: "missao-pedido",
    category: "Sistemas",
    title: "Novo sistema: Concluir Agora Missão e Pedido",
    description:
      "Sistema de conclusão instantânea de missões e pedidos para agilizar a progressão.",
    detail:
      "Adicionado o sistema 'Concluir Agora Missão e Pedido', junto com melhorias no sistema de Aprimoramento de Constituição e Chi e o novo item 'Credencial de Missão'.",
    url: "https://forum.mir4global.com/post/2598?lang=pt",
  },
  {
    key: "migracao-mainnet",
    category: "Sistemas",
    title: "Migração DRACO / HYDRA para mainnet WEMIX3.0",
    description:
      "A migração dos tokens para a mainnet foi retomada, com conversão 1:1 dos legados.",
    detail:
      "As pools pHYDRA-pWEMIX$ e pDRACO-pWEMIX$ foram encerradas com o fim das chains Tornado e PLAY. A migração é unidirecional e pode levar até 24h em status de espera. O sistema HSPFE4 funciona apenas com HYDRA da mainnet e fica disponível até 3 de janeiro de 2027. A troca PLAY Token → EXDRA4 e o HSPFE4 foram retomados em 19/08/2026.",
    url: "https://forum.mir4global.com/post/469?lang=pt",
  },
];

// Fusão de Servidores — mapa completo por região (fonte: post oficial 2542, atualizado 05/08/2026)
export interface ServerMerge {
  mergedInto: string;
  mergedServers: string[];
}

export const SERVER_MERGE_MAP: Record<string, Record<string, ServerMerge>> = {
  ASIA1: {
    ASIA011: { mergedInto: "ASIA011", mergedServers: ["ASIA011"] },
    ASIA012: { mergedInto: "ASIA012", mergedServers: ["ASIA012"] },
    ASIA021: { mergedInto: "ASIA021", mergedServers: ["ASIA021", "ASIA013"] },
    ASIA022: { mergedInto: "ASIA022", mergedServers: ["ASIA022", "ASIA014"] },
    ASIA023: { mergedInto: "ASIA023", mergedServers: ["ASIA023", "ASIA024"] },
    ASIA031: { mergedInto: "ASIA031", mergedServers: ["ASIA031", "ASIA041"] },
    ASIA032: { mergedInto: "ASIA032", mergedServers: ["ASIA032"] },
    ASIA033: { mergedInto: "ASIA033", mergedServers: ["ASIA033"] },
    ASIA034: { mergedInto: "ASIA034", mergedServers: ["ASIA034"] },
    ASIA042: { mergedInto: "ASIA042", mergedServers: ["ASIA042"] },
  },
  ASIA2: {
    ASIA051: { mergedInto: "ASIA051", mergedServers: ["ASIA051", "ASIA082"] },
    ASIA052: { mergedInto: "ASIA052", mergedServers: ["ASIA052", "ASIA071"] },
    ASIA053: { mergedInto: "ASIA053", mergedServers: ["ASIA053"] },
    ASIA061: { mergedInto: "ASIA061", mergedServers: ["ASIA061", "ASIA072"] },
    ASIA062: { mergedInto: "ASIA062", mergedServers: ["ASIA062", "ASIA073"] },
    ASIA063: { mergedInto: "ASIA063", mergedServers: ["ASIA063", "ASIA091"] },
    ASIA081: { mergedInto: "ASIA081", mergedServers: ["ASIA081"] },
    ASIA083: { mergedInto: "ASIA083", mergedServers: ["ASIA083"] },
    ASIA092: { mergedInto: "ASIA092", mergedServers: ["ASIA092"] },
  },
  ASIA3: {
    ASIA311: { mergedInto: "ASIA311", mergedServers: ["ASIA311", "ASIA314"] },
    ASIA312: { mergedInto: "ASIA312", mergedServers: ["ASIA312", "ASIA341"] },
    ASIA313: { mergedInto: "ASIA313", mergedServers: ["ASIA313", "ASIA324"] },
    ASIA321: { mergedInto: "ASIA321", mergedServers: ["ASIA321"] },
    ASIA322: { mergedInto: "ASIA322", mergedServers: ["ASIA322"] },
    ASIA323: { mergedInto: "ASIA323", mergedServers: ["ASIA323"] },
    ASIA331: { mergedInto: "ASIA331", mergedServers: ["ASIA331"] },
    ASIA332: { mergedInto: "ASIA332", mergedServers: ["ASIA332"] },
    ASIA333: { mergedInto: "ASIA333", mergedServers: ["ASIA333"] },
    ASIA334: { mergedInto: "ASIA334", mergedServers: ["ASIA334"] },
    ASIA342: { mergedInto: "ASIA342", mergedServers: ["ASIA342"] },
  },
  NA1: {
    NA011: { mergedInto: "NA011", mergedServers: ["NA011"] },
    NA012: { mergedInto: "NA012", mergedServers: ["NA012", "NA041"] },
    NA013: { mergedInto: "NA013", mergedServers: ["NA013"] },
    NA014: { mergedInto: "NA014", mergedServers: ["NA014"] },
    NA021: { mergedInto: "NA021", mergedServers: ["NA021"] },
    NA022: { mergedInto: "NA022", mergedServers: ["NA022"] },
    NA023: { mergedInto: "NA023", mergedServers: ["NA023"] },
    NA031: { mergedInto: "NA031", mergedServers: ["NA031", "NA033"] },
    NA032: { mergedInto: "NA032", mergedServers: ["NA032"] },
    NA042: { mergedInto: "NA042", mergedServers: ["NA042"] },
  },
  EU1: {
    EU011: { mergedInto: "EU011", mergedServers: ["EU011", "EU013"] },
    EU012: { mergedInto: "EU012", mergedServers: ["EU012"] },
    EU021: { mergedInto: "EU021", mergedServers: ["EU021", "EU023"] },
    EU022: { mergedInto: "EU022", mergedServers: ["EU022", "EU031"] },
    EU024: { mergedInto: "EU024", mergedServers: ["EU024", "EU014"] },
    EU032: { mergedInto: "EU032", mergedServers: ["EU032"] },
  },
  SA1: {
    SA011: { mergedInto: "SA011", mergedServers: ["SA011"] },
    SA012: { mergedInto: "SA012", mergedServers: ["SA012"] },
    SA013: { mergedInto: "SA013", mergedServers: ["SA013", "SA041"] },
    SA021: { mergedInto: "SA021", mergedServers: ["SA021"] },
    SA022: { mergedInto: "SA022", mergedServers: ["SA022"] },
    SA023: { mergedInto: "SA023", mergedServers: ["SA023", "SA014"] },
    SA031: { mergedInto: "SA031", mergedServers: ["SA031", "SA033"] },
    SA032: { mergedInto: "SA032", mergedServers: ["SA032"] },
    SA042: { mergedInto: "SA042", mergedServers: ["SA042"] },
  },
  INMENA1: {
    INMENA011: { mergedInto: "INMENA011", mergedServers: ["INMENA011", "INMENA012"] },
    INMENA013: { mergedInto: "INMENA013", mergedServers: ["INMENA013", "INMENA014"] },
    INMENA021: { mergedInto: "INMENA021", mergedServers: ["INMENA021", "INMENA022"] },
    INMENA023: { mergedInto: "INMENA023", mergedServers: ["INMENA023", "INMENA024"] },
    INMENA031: { mergedInto: "INMENA031", mergedServers: ["INMENA031"] },
    INMENA032: { mergedInto: "INMENA032", mergedServers: ["INMENA032"] },
  },
};

export interface ChapterTimelineItem {
  number: number;
  title: string;
  date: string;
  highlights: string[];
  year: string;
}

/**
 * Linha do tempo oficial dos capítulos do MIR4 (Chronicle, mir4global.com).
 * Chapter 22 está marcado como "Coming Soon".
 */
export const MIR4_CHAPTERS: ChapterTimelineItem[] = [
  {
    number: 1,
    title: "Névoa de Guerra",
    date: "02 de novembro de 2021",
    year: "2021",
    highlights: ["Nova classe Besteiro (Arbalist)", "Sistema de Mudança de Classe entre 5 classes", "Treino Ermo", "Boss especial Imperador Carmesim Utukan", "DSP (DRACO Staking Program)"],
  },
  {
    number: 2,
    title: "Cerco do Castelo",
    date: "16 de novembro de 2021",
    year: "2021",
    highlights: ["Véspera do Cerco do Castelo", "1º Cerco do Castelo de Bicheon", "Tesouro de Espírito / Pedra do demônio Transcender", "XDRACO"],
  },
  {
    number: 3,
    title: "Expedição",
    date: "30 de novembro de 2021",
    year: "2021",
    highlights: ["Viagem do Viajante entre servidores", "Espíritos Leocrat Khun (Heroico) e Bloodtip Drago (Lendário)", "Nova região Phantasia", "Nível máximo 130", "Assalto Ninho de Dragão Carmesim", "MIR4 NFT"],
  },
  {
    number: 4,
    title: "Novo Mundo",
    date: "Março de 2022",
    year: "2022",
    highlights: ["Nerkan, Chamas Negras do Arquidemônio (novo boss mundial)", "Balanceamento de habilidades", "Expedição entre servidores", "Altar das Trevas: Expedição"],
  },
  {
    number: 5,
    title: "Expansão",
    date: "03 de maio de 2022",
    year: "2022",
    highlights: ["Áreas Túmulo de Rockcut e Paraíso das Espadas", "Abertura de Sabuk", "Nível máximo 150", "Novo evento de Mistério", "Raide Demente Infernal Renascido", "Turkan, o Demônio da Névoa Violeta"],
  },
  {
    number: 6,
    title: "Desequilíbrio de Poderes",
    date: "14 de junho de 2022",
    year: "2022",
    highlights: ["Raide Altar Oculto", "Desafio de clã Lv. 5", "Saque a Bicheon entre servidores"],
  },
  {
    number: 7,
    title: "Retomada de Controle",
    date: "Junho de 2022",
    year: "2022",
    highlights: ["Restrição de nível para minerar Darksteel", "Redistribuição da oferta de Darksteel nos Vales Ocultos"],
  },
  {
    number: 8,
    title: "Noblesse Oblige",
    date: "Junho de 2022",
    year: "2022",
    highlights: ["Imposto de Darksteel reduzido pela metade se o Altar das Trevas for destruído"],
  },
  {
    number: 9,
    title: "Prelúdio de Conquista",
    date: "12 de julho de 2022",
    year: "2022",
    highlights: ["Sistema de Relíquias", "Ruptura do Mundo dos Dragões", "Boss mundial Trasgo Diabólico", "8F da Praça Mágica e do Pico Secreto", "Felina Encantada", "Servidor NFT"],
  },
  {
    number: 10,
    title: "Torre do Dragão Negro",
    date: "20 de setembro de 2022",
    year: "2022",
    highlights: ["Servidor da Dominação (até 16 servidores)", "Torre do Dragão Negro", "Artefatos de Dragão (5 slots)", "Nível máximo 170", "Modo Assassino", "Raide Campo de Execução de Sabuk"],
  },
  {
    number: 11,
    title: "Raide Infernal",
    date: "04 de outubro de 2022",
    year: "2022",
    highlights: ["Raide Infernal (até 15 membros do clã)", "Aprimoramento Especial (Épico/Lendário)", "Transcendência de espíritos Lendários", "Missão Cooperativa de Clã"],
  },
  {
    number: 12,
    title: "Área do Campo de Neve",
    date: "Outubro de 2022",
    year: "2022",
    highlights: ["Nine Dragon Ice Field (Campo de Gelo dos Nove Dragões)", "Rastros de Cheonpa além da Grande Muralha de Sabuk"],
  },
  {
    number: 13,
    title: "Soturna",
    date: "Novembro de 2022",
    year: "2022",
    highlights: ["Nova área Soturna (150+)", "Conteúdo pós-Nine Dragon"],
  },
  {
    number: 14,
    title: "Confronto de Sabuk",
    date: "Novembro de 2022",
    year: "2022",
    highlights: ["Renovação do Confronto de Sabuk entre regiões", "Disputa pelo trono regional"],
  },
  {
    number: 15,
    title: "Miragem de Navio",
    date: "2023",
    year: "2023",
    highlights: ["Rastros do vento do Mundo Exterior", "Sistema Miragem de Navio"],
  },
  {
    number: 16,
    title: "Grande Unificação",
    date: "2024",
    year: "2024",
    highlights: ["Mercado Unificado: mercado único e orgânico de grande escala"],
  },
  {
    number: 17,
    title: "Rei dos Espíritos",
    date: "2024",
    year: "2024",
    highlights: ["Esfera da Alma Mágica", "Novo poder concedido pelos espíritos"],
  },
  {
    number: 18,
    title: "Supersona",
    date: "2025",
    year: "2025",
    highlights: ["Competição acirrada pela sobrevivência", "Sistema Supersona"],
  },
  {
    number: 19,
    title: "O Novo Vento",
    date: "2025",
    year: "2025",
    highlights: ["Novas mecânicas de progressão", "Expansão de conteúdo"],
  },
  {
    number: 20,
    title: "Coração de Leão",
    date: "2026",
    year: "2026",
    highlights: ["Preparação para a nova classe Lionheart"],
  },
  {
    number: 21,
    title: "Invocador",
    date: "18 de agosto de 2026",
    year: "2026",
    highlights: ["8ª classe: Invocador (Spirit Summoner)", "Fusão de Servidores", "Servidor Mundo Impulsionador", "5º aniversário do MIR4", "Artefatos de Dragão Míticos", "Loja do Goblin de Ouro", "Migração mainnet WEMIX3.0"],
  },
  {
    number: 22,
    title: "Coming Soon",
    date: "A confirmar",
    year: "2026",
    highlights: ["Próxima grande atualização oficial — acompanhe o fórum da Wemade"],
  },
];

export const CHAPTER22_COMING_SOON = "Chapter 22 — Coming Soon";
