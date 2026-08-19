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
}

export const CHAPTER21_NEWS: Chapter21NewsItem[] = [
  {
    key: "invocador",
    category: "Classe",
    title: "Nova classe: Invocador (Spirit Summoner)",
    description:
      "A 8ª classe do MIR4 chegou no Capítulo 21: uma invocadora de ataque mágico que comanda os espíritos de toda a criação com uma vara mágica.",
    detail:
      "A Invocadora usa varinha mágica, invoca e comanda espíritos, luta ao lado deles e domina o combate versátil à distância. Skills principais: Vórtice Espiritual, Onda Espiritual, Passo Espiritual, Areias Ilusórias, Círculo de Raios, Presa Negra, Pluma Dourada, Prisão Abissal, Fascínio, Fonte Espiritual, Corte da Alma, Explosão do Dragão e Orbe Explosivo. ATENÇÃO oficial: a classe NÃO pode realizar Mudança de Classe (nem para outras, nem de outras para ela).",
  },
  {
    key: "fusao-servidores",
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
    title: "Servidor Especializado em Crescimento: Mundo Impulsionador",
    description:
      "4º servidor do jogo, dedicado a acelerar a progressão de novos jogadores.",
    detail:
      "Eventos exclusivos: Presença de 7 dias de boas-vindas com Caixa de Recompensa de Nível, Presença de 28 dias acumulada de Yiun, Os Mais Poderosos do Mundo Impulsionador, Pergaminho do Yiun, Missão de Passe, evento de subida de nível, evento de Poder de Combate e Recarga Feliz de Porquínio.",
  },
  {
    key: "5aniversario",
    category: "Sistemas",
    title: "5º Aniversário do MIR4 (agosto 2026)",
    description:
      "O jogo completa 5 anos em agosto de 2026 com uma série de eventos comemorativos.",
    detail:
      "Eventos: Presença de 14 dias, Presença de 7 dias, Bênção do Dragão Divino, Loja de Troca de Moeda de Agradecimento, Invocação + Invocação do 5º Aniversário, A Grande Fortuna de Osher, Obtenção de Raide/Raide de Boss do evento, Presente Surpresa de Mir e eventos de comunidade (Tomo Secreto do Invocador e Festa de Aniversário de 5 Anos).",
  },
  {
    key: "loja-goblin",
    category: "Itens",
    title: "Nova Loja de NPC: Goblin de Ouro do Aniversário",
    description:
      "NPC 'Celebração do 5º Aniversário' nas principais cidades, trocando itens pelo Bolo de Agradecimento.",
    detail:
      "Os 19 produtos em oferta incluem o 'Bolo de Agradecimento do Aniversário de 5 Anos' (venda até 1º de setembro), que desbloqueia a loja do Goblin de Ouro (até 14 de setembro, 23h59 UTC+8). Itens da loja: Caixas de Material de Dragão Lendário, Pedras de Aprimoramento do Dragão Divino, Bilhetes de Praça Mágica/Pico Secreto Fissurados, Caixas de Aço de Dragão Épico e mais.",
  },
  {
    key: "artefatos-miticos",
    category: "Itens",
    title: "Novos Artefatos de Dragão Míticos",
    description:
      "A raridade Mítica chegou aos Artefatos de Dragão no Capítulo 21.",
    detail:
      "Novos Artefatos de Dragão de raridade Mítica foram adicionados, no topo da progressão dos 5 slots de Artefatos de Dragão. A Loja de NPC do aniversário também vende Pedra de Aprimoramento de Artefato de Dragão do Dragão Divino Lendária.",
  },
  {
    key: "missao-pedido",
    category: "Sistemas",
    title: "Novo sistema: Concluir Agora Missão e Pedido",
    description:
      "Sistema de conclusão instantânea de missões e pedidos para agilizar a progressão.",
    detail:
      "Adicionado o sistema 'Concluir Agora Missão e Pedido', junto com melhorias no sistema de Aprimoramento de Constituição e Chi e o novo item 'Credencial de Missão'.",
  },
  {
    key: "migracao-mainnet",
    category: "Sistemas",
    title: "Migração DRACO / HYDRA para mainnet WEMIX3.0",
    description:
      "A migração dos tokens para a mainnet foi retomada, com conversão 1:1 dos legados.",
    detail:
      "As pools pHYDRA-pWEMIX$ e pDRACO-pWEMIX$ foram encerradas com o fim das chains Tornado e PLAY. A migração é unidirecional e pode levar até 24h em status de espera. O sistema HSPFE4 funciona apenas com HYDRA da mainnet e fica disponível até 3 de janeiro de 2027. A troca PLAY Token → EXDRA4 e o HSPFE4 foram retomados em 19/08/2026.",
  },
];

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
];

export const CHAPTER22_COMING_SOON = "Chapter 22 — Coming Soon";
