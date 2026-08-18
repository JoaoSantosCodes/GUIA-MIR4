/**
 * Conteúdo do guia MIR4 — dados compartilhados entre servidor e cliente.
 * Chaves estáveis: `itemType:itemKey` (usadas em favoritos e progresso do Codex).
 */

export type Rarity = "UC" | "Raro" | "Épico" | "Lendário" | "Mítico";

export type FavoriteItemType = "spirit" | "codex" | "farm" | "class" | "economy" | "boss" | "sabuk" | "mystery";

export const FAVORITE_ITEM_TYPES: FavoriteItemType[] = [
  "spirit",
  "codex",
  "farm",
  "class",
  "economy",
  "boss",
  "sabuk",
  "mystery",
];

export const RARITY_ORDER: Rarity[] = ["UC", "Raro", "Épico", "Lendário", "Mítico"];

export const RARITY_STYLES: Record<Rarity, { label: string; color: string; border: string; bg: string }> = {
  UC: { label: "UC (Incomum)", color: "text-slate-300", border: "border-slate-500/50", bg: "bg-slate-800/60" },
  Raro: { label: "Raro", color: "text-emerald-400", border: "border-emerald-600/50", bg: "bg-emerald-950/40" },
  "Épico": { label: "Épico", color: "text-violet-400", border: "border-violet-600/50", bg: "bg-violet-950/40" },
  "Lendário": { label: "Lendário", color: "text-amber-400", border: "border-amber-600/50", bg: "bg-amber-950/30" },
  "Mítico": { label: "Mítico", color: "text-red-400", border: "border-red-600/50", bg: "bg-red-950/30" },
};

export interface Spirit {
  key: string;
  name: string;
  title: string;
  rarity: Rarity;
  effects: string[];
  passive: string;
  tip: string;
  obtain: string;
}

export const SPIRITS: Spirit[] = [
  // ---------- UC ----------
  { key: "grifforse", name: "Grifforse", title: "Cavalo Sombrio", rarity: "UC", effects: ["Max MP +1400", "PvP ATK +6%", "PvP DMG Reduction −6%", "Boss ATK +15%", "Debilitação Success +30%", "Item Drop +10%", "Max HP +10%"], passive: "Ao ser atingido por um Ultimate: recupera 20% do HP máximo e +20% ATK por 20s (CD 40s)", tip: "Bom espírito PvP de nível inicial; o boost de drop ajuda no farm.", obtain: "Drop de mobs e baús de nível 20+; invocação com tickets UC." },
  { key: "styx", name: "Styx", title: "Cavaleiro Fantasma", rarity: "UC", effects: ["Max HP +1800", "Max MP +900", "CRIT +90", "CRIT EVA +90", "Monstro ATK +15%", "Silence Success +30%", "Skill CD −5%", "Coleta −10%", "Mineração −10%"], passive: "Com HP abaixo de 20%: −50% de todo dano por 15s (CD 60s)", tip: "Um dos melhores core spirits do jogo — usado até na versão Lendária. Acelera coleta e mineração.", obtain: "Dungeon e eventos; disponível na tela de invocação desde o início." },
  { key: "darknyan", name: "Darknyan", title: "Ressuscitador", rarity: "UC", effects: ["Max HP +6000", "Skill ATK +12%", "Skill DMG Reduction −12%", "Boss DMG Reduction −15%", "Debilitação RES +30%", "Cura +25%", "Coleta −10%"], passive: "Ressuscita o personagem com 25% do HP máximo (CD 75s)", tip: "Essencial para sobrevivência em raids e zonas PvP de alto risco.", obtain: "Drops de elites e eventos rotativos; invocação UC." },
  { key: "inferno", name: "Inferno", title: "Senhor do Inferno", rarity: "UC", effects: ["Max HP +1600", "Bash ATK +30%", "Bash DMG Reduction −30%", "Boss DMG Reduction −15%", "Knockdown RES +30%", "Efeito de Poção de HP +12%", "Custo de MP −10%"], passive: "25% de chance de recuperar 15% do HP por 5s ao atacar (CD 18s)", tip: "Recomendado como 3º/4º spirit nos builds da comunidade.", obtain: "Drops em áreas PvP e raids de clã; invocação UC." },
  { key: "goldking", name: "Goldking", title: "Falcão de Fogo", rarity: "UC", effects: ["Max HP +4400", "ATK Físico +70", "ATK Mágico +70", "Monstro ATK +15%", "Stun Success +30%", "Copper +10%", "Skill CD −5%"], passive: "Cura de Stun instantânea; +20% ATK e +20% DMG Reduction por 10s (CD 30s)", tip: "Segundo core spirit mais recomendado — forte em ATK e utilidade.", obtain: "Eventos de invocação e drops de boss." },
  { key: "galesoul", name: "Galesoul", title: "Invocador do Vento", rarity: "UC", effects: ["Max HP +4000", "CRIT ATK +20%", "CRIT DMG Reduction −20%", "Boss ATK +15%", "Knockdown Success +30%", "MP Potion +8%", "Max HP +5%", "Custo de MP −10%"], passive: "Com HP abaixo de 15%: recupera 50% do HP em 5s (CD 75s)", tip: "Ótimo para builds CRIT com sustain de emergência.", obtain: "Drops em áreas PvE e loot boxes de evento." },
  { key: "drago", name: "Drago", title: "Sangue-Ponta", rarity: "UC", effects: ["Max HP +2200", "Max MP +700", "ATK Físico +100", "ATK Mágico +100", "Debilitação Success +30%", "PvP ATK +10%", "Poção HP +10%", "Poção MP +5%", "Coleta −10%"], passive: "Após ataque Letal: recupera 40% do HP instantaneamente (CD 30s)", tip: "Hybrid ATK alto; forte em PvP e raids.", obtain: "Drops de elites de nível médio e eventos." },
  { key: "dreamfly", name: "Dreamfly", title: "Fada Borboleta", rarity: "UC", effects: ["Max HP +2400", "Max MP +800", "DEF Física +70", "DEF Mágica +70", "Monstro DMG Reduction −15%", "Stun Success +30%", "Lucky Drop +10%", "Poção HP +20%"], passive: "Cura de Silêncio instantânea; +30% ATK por 10s (CD 30s)", tip: "Frequentemente aparece em eventos de troca — fique de olho nas lojas de evento.", obtain: "Eventos de troca sazonais e loja de evento." },
  { key: "khalion", name: "Khalion", title: "Grande General", rarity: "UC", effects: ["Max HP +3600", "ATK +6%", "DMG Reduction −6%", "Monstro DMG Reduction −15%", "Silence RES +30%", "Hunting EXP +20%", "Drop +5%"], passive: "3% de chance ao atacar de Despertar: +500 CRIT DMG por 15s", tip: "O melhor espírito UC para levelar — +20% de EXP de caça.", obtain: "Eventos de novo jogador e drops de níveis iniciais — o mais comum para começar." },
  { key: "leocrat", name: "Leocrat Khun", title: "Coração de Leão", rarity: "UC", effects: ["Max MP +280", "CRIT EVA +110", "PvP DMG Reduction −8%", "Boss DMG Reduction −8%", "Knockdown RES +10%", "Coleta −10%", "Mineração −10%"], passive: "Ao ser derrubado: 50% de chance de +50% Knockdown RES por 8s (CD 30s)", tip: "Combo de farm com Styx: mineração e coleta aceleradas.", obtain: "Drops de mineração e áreas de coleta; invocação UC." },
  { key: "nyanja", name: "Nyanja", title: "Assassino", rarity: "UC", effects: ["Max MP +160", "ATK +7%", "Boss ATK +8%", "Copper +15%", "Lucky Drop +10%", "Poção MP +5%"], passive: "30% de chance de ativar Evade instantaneamente ao usar Evade", tip: "Bom para farm de Copper e drops em zonas PvP.", obtain: "Drops em áreas PvP e raids." },
  { key: "koiga", name: "Koiga", title: "Coração de Leão Brutal", rarity: "UC", effects: ["Monstro ATK +12%", "Monstro DMG Reduction −12%", "DMG Reduction −10%", "Hunting EXP +15%", "Lucky Drop +10%", "Coleta −10%"], passive: "Ao matar: +2 CRIT, +2 ATK físico/mágico por 30s (até 50 stacks)", tip: "Espírito XP alternativo ao Khalion, com Lucky Drop extra.", obtain: "Drops de mobs em áreas de grind; invocação UC." },
  { key: "baratan", name: "Baratan", title: "Besta Trovão", rarity: "UC", effects: ["Max HP +2200", "ATK Físico +70", "Monstro ATK +8%", "Stun Success +20%", "Efeito de Poção HP +12%"], passive: "Cura instantânea de Stun (CD 30s)", tip: "Anti-stun acessível para early game; útil em áreas PvP.", obtain: "Drops básicos e loja de evento." },
  { key: "sparkler", name: "Sparkler", title: "Gema Brilhante", rarity: "UC", effects: ["Max MP +240", "DMG Reduction −7%", "Bash DMG Reduction −30%", "Hunting EXP +15%", "Coleta −10%", "Mineração −10%"], passive: "Cura instantânea de Silêncio (CD 30s)", tip: "Alternativa de EXP + velocidade de coleta para farm.", obtain: "Drops comuns de áreas AFK; invocação UC." },
  { key: "solari", name: "Solari", title: "Raposa Milenar", rarity: "UC", effects: ["Todas as chances de Drop +10%"], passive: "25% de chance de recuperar 8% do MP por 4s ao atacar (CD 18s)", tip: "Drop +10% geral — valioso para qualquer build de coleta.", obtain: "Eventos de troca; disponível na invocação UC." },
  { key: "luckster", name: "Luckster", title: "Gato da Sorte", rarity: "UC", effects: ["Max MP +160", "DEF Mágica +70", "CRIT DMG Reduction −20%", "Boss DMG Reduction −8%", "Silence RES +20%", "Cura +10%", "Skill CD −3%"], passive: "Ao usar Ultimate: recupera 15% do HP por 5s", tip: "Espírito de evento (Dreamfly's Jelly) — bom suporte defensivo.", obtain: "Evento Dreamfly's Jelly; loja de evento." },
  { key: "suparna", name: "Suparna", title: "Pássaro Dourado", rarity: "UC", effects: ["Max HP +1800", "DEF Física +70", "CRIT ATK +20%", "Bash ATK +30%", "Stun RES +20%", "Custo de MP −10%"], passive: "25% de chance de recuperar 6% do HP por 3s ao atacar (CD 18s)", tip: "Build CRIT/Bash com sustain passivo.", obtain: "Drops em áreas de caça PvE; invocação UC." },
  { key: "flamehorn", name: "Flamehorn", title: "Diabo de Fogo", rarity: "UC", effects: ["Max MP +300", "CRIT EVA +100", "Skill DMG Reduction −10%", "Boss DMG Reduction −8%", "Debilitação Success +20%", "Poção HP +7%", "Max HP +3%"], passive: "Ataques de Burn: 80% chance de +1 nível, 50% de +2 níveis", tip: "Único espírito com escalonamento de nível por Burn.", obtain: "Eventos rotativos de invocação UC." },
  { key: "crystaglass", name: "Crystaglass", title: "Pavão Branco", rarity: "UC", effects: ["Max HP +1600", "PvP ATK +7%", "Bash DMG Reduction −30%", "Knockdown Success +20%", "Lucky Drop +5%"], passive: "Ao atacar: +200 ATK físico por 10s (CD 30s)", tip: "PvP agressivo com proco curto de ATK.", obtain: "Drops em zonas PvP e raids; invocação UC." },
  { key: "shaoshao", name: "Shaoshao", title: "Maníaco de Gemas", rarity: "UC", effects: ["Max HP +1600", "PvP DMG Reduction −7%", "Monstro DMG Reduction −8%", "Knockdown RES +20%", "Hunting EXP +15%"], passive: "25% de chance de recuperar 15% do HP por 5s ao atacar (CD 18s)", tip: "EXP + sustain — bom para builds de grind.", obtain: "Drops comuns em grind; invocação UC." },
  { key: "whaley", name: "Whaley", title: "Beleza Absoluta", rarity: "UC", effects: ["Max MP +200", "ATK Mágico +70", "Monstro DMG Reduction −8%", "Silence Success +20%", "Poção MP +5%", "Max HP +6%", "Custo de MP −5%"], passive: "Aumenta duração de Stun em 1s e Silence em 2s", tip: "Suporte CC para Sorcerers e Taoists.", obtain: "Eventos de invocação UC; drops de elites." },
  { key: "reaper", name: "Reaper", title: "Ceifador de Almas", rarity: "UC", effects: ["Max HP +2400", "CRIT +100", "Skill ATK +10%", "Bash ATK +30%", "Debilitação RES +20%", "Skill CD −3%"], passive: "Ataques de Chill: 80% chance de +1 nível, 50% de +2 níveis", tip: "Par do Flamehorn para builds Chill/Burn.", obtain: "Eventos rotativos de invocação UC." },
  { key: "biyoho", name: "Biyoho", title: "Chama Infernal", rarity: "UC", effects: ["Max MP +300", "CRIT +100", "CRIT ATK +20%", "Hunting EXP +15%", "Item Drop +15%", "Custo de MP −5%"], passive: "10% de chance ao atacar de causar dano em área (CD 25s)", tip: "Melhor drop de item entre os UC — excelente para farm.", obtain: "Drops em áreas de grind de nível médio; eventos." },
  { key: "piggio", name: "Piggio", title: "Porquinho", rarity: "UC", effects: ["Monstro DMG Reduction −6%", "Hunting EXP +10%"], passive: "—", tip: "Espírito de entrada; útil enquanto não se obtém melhores.", obtain: "Concedido no tutorial / início do jogo." },
  { key: "oronki", name: "Oroonki", title: "Leão Esqueleto", rarity: "UC", effects: ["Skill ATK +6%", "Efeito de Poção HP +6%"], passive: "—", tip: "Básico; substitua assim que possível.", obtain: "Concedido no início do jogo." },
  { key: "dracusip", name: "Dracusip", title: "Morcego Vampiro", rarity: "UC", effects: ["CRIT ATK +10%", "Bash ATK +10%", "Lucky Drop +2%", "Max HP +2%"], passive: "—", tip: "Drop baixo; use como preenchedor de slot.", obtain: "Drops básicos iniciais." },
  { key: "lamper", name: "Lamper", title: "Mensageiro da Alma", rarity: "UC", effects: ["Bash ATK +10%", "Monstro ATK +6%", "Copper +10%", "Coleta de Energia −10%"], passive: "—", tip: "Farm de Copper; colete energia com ele.", obtain: "Drops de mobs; útil como espírito de coleta." },
  { key: "flory", name: "Flory", title: "Anjo Verde", rarity: "UC", effects: ["DMG Reduction −3%", "Coleta −10%", "Mineração −10%"], passive: "—", tip: "Apenas para acelerar coleta/mineração no início.", obtain: "Drops de coleta iniciais." },
  { key: "horyong", name: "Horyong", title: "Pequeno Dragão Azul", rarity: "UC", effects: ["Coleta de Energia −10%"], passive: "10% de chance de recuperar 3% do HP por 3s ao atacar", tip: "Coleta de energia; aparece em eventos de assistência mensal.", obtain: "Eventos de assistência mensal." },
  { key: "doggo", name: "Doggo", title: "Lobo Vermelho", rarity: "UC", effects: ["Bônus básicos de sobrevivência"], passive: "—", tip: "Espírito inicial comum.", obtain: "Concedido no início do jogo." },
  { key: "snowfox", name: "Snow Fox", title: "Raposa de Cauda Tripla", rarity: "UC", effects: ["CRIT DMG Reduction −10%", "Boss DMG Reduction −6%"], passive: "30% de chance de ativar Evade instantaneamente", tip: "Evasão defensiva para iniciantes.", obtain: "Drops de eventos iniciais." },
  // ---------- Raro ----------
  { key: "raro-placeholder", name: "Espíritos Raros", title: "Raridade Raro", rarity: "Raro", effects: ["Atributos superiores aos UC", "Habilidades passivas mais fortes", "Bônus de farm aprimorados"], passive: "Variam por espírito — consulte a tela de invocação", tip: "Obtidos em summons com tickets e eventos; base dos builds de meio de jogo.", obtain: "Invocação com tickets Raros; drops de raids de clã e eventos rotativos." },
  // ---------- Épico ----------
  { key: "epico-placeholder", name: "Espíritos Épicos", title: "Raridade Épico", rarity: "Épico", effects: ["Atributos elevados de ATK/HP/DEF", "Passivas de alto impacto", "Bônus de EXP e Drop significativos"], passive: "Variam por espírito — ex.: Biyoho e Reaper (versões superiores)", tip: "Farmáveis via Epic Dragon Statues dos Clan Boss semanais e eventos.", obtain: "Epic Dragon Statues dos Clan Boss semanais; eventos e summons Épicos." },
  // ---------- Lendário ----------
  { key: "lulu", name: "Lulu", title: "a Felina Encantada", rarity: "Lendário", effects: ["Atributos de nível lendário", "Habilidade definitiva poderosa"], passive: "Varia conforme a versão do evento", tip: "Obtida em eventos de invocação lendária rotativos — fique atento aos patches.", obtain: "Eventos de invocação Lendária rotativos (patches sazonais)." },
  { key: "wooska", name: "Wooska", title: "Príncipe Herdeiro das Trevas", rarity: "Lendário", effects: ["Atributos de nível lendário", "Habilidade definitiva poderosa"], passive: "Varia conforme a versão do evento", tip: "Evento de invocação encerrado; lendários sazonais voltam com frequência.", obtain: "Evento de invocação encerrado; lendários sazonais costumam retornar em patches." },
  { key: "lendario-placeholder", name: "Espíritos Lendários", title: "Raridade Lendário", rarity: "Lendário", effects: ["Styx (L) e Goldking (L): melhores core spirits do jogo", "Atributos esmagadores", "Passivas de raid"], passive: "Consulte a tela de invocação e tier lists por classe", tip: "Concentre resources neles primeiro: são os slots 1 e 2 do seu build.", obtain: "Eventos de invocação Lendária (Styx L e Goldking L); summons premium." },
  // ---------- Mítico ----------
  { key: "mitico-placeholder", name: "Espíritos Míticos", title: "Raridade Mítico", rarity: "Mítico", effects: ["Raridade acima do Lendário (desde 2025)", "Atributos esmagadores", "Skills definitivas exclusivas"], passive: "Varia por espírito", tip: "Topo da cadeia — obtidos em summons lendários e eventos premium.", obtain: "Summons lendários, eventos premium e trocas de longo prazo." },
];

/** Itens do Codex que o usuário pode marcar como coletados. */
export interface CodexItem {
  key: string;
  name: string;
  category: string;
  rarity: Rarity;
  tier: number;
  tip: string;
}

export const CODEX_CATEGORIES = [
  "Equipamentos",
  "Materiais",
  "Consumíveis",
  "Colecionáveis",
  "Badges de Reputação",
] as const;

export const CODEX_ITEMS: CodexItem[] = [
  // Equipamentos UC tier 1 (mais fáceis de registrar)
  { key: "uc-weapon-t1", name: "Arma UC Tier 1", category: "Equipamentos", rarity: "UC", tier: 1, tip: "Farma em Secret Mine e áreas de caça de nível baixo." },
  { key: "uc-armor-t1", name: "Armadura UC Tier 1", category: "Equipamentos", rarity: "UC", tier: 1, tip: "Drops comuns de mobs; base do codex F2P." },
  { key: "uc-acc-t1", name: "Acessório UC Tier 1", category: "Equipamentos", rarity: "UC", tier: 1, tip: "Bicheon Labyrinth e Crystalline Forest." },
  { key: "uc-jewel-t1", name: "Joia UC Tier 1", category: "Equipamentos", rarity: "UC", tier: 1, tip: "Drops de mini-bosses de nível baixo." },
  { key: "uc-relic-t1", name: "Relíquia UC Tier 1", category: "Equipamentos", rarity: "UC", tier: 1, tip: "Mysteries e baús de missão." },
  // Materiais
  { key: "uc-magicstone", name: "Magic Stone UC", category: "Materiais", rarity: "UC", tier: 1, tip: "Magic Stone Chambers do Magic Square." },
  { key: "uc-flower-oil", name: "Flower Oil", category: "Materiais", rarity: "UC", tier: 1, tip: "Bicheon Labyrinth 3F — usado em Constitution." },
  { key: "uc-blue-devil", name: "Blue Devil Stone", category: "Materiais", rarity: "UC", tier: 1, tip: "Bicheon Labyrinth 3F." },
  { key: "uc-enhance", name: "Enhancement Stone UC", category: "Materiais", rarity: "UC", tier: 1, tip: "Drops em quase todas as áreas de caça." },
  { key: "uc-skilltome", name: "Skill Tome UC", category: "Materiais", rarity: "UC", tier: 1, tip: "Leader's Chambers do Magic Square." },
  { key: "uc-quintessence", name: "Quintessence UC", category: "Materiais", rarity: "UC", tier: 1, tip: "Crystalline Forest." },
  { key: "uc-exorcism", name: "Exorcism Bauble", category: "Materiais", rarity: "UC", tier: 1, tip: "Crystalline Forest." },
  { key: "uc-dragon-leather", name: "Dragon Leather", category: "Materiais", rarity: "UC", tier: 1, tip: "Crystalline Forest — usado para craftar armadura UC." },
  { key: "uc-greater-yang", name: "Greater Yang Pill", category: "Materiais", rarity: "UC", tier: 1, tip: "Demon Bull Labyrinth — usado em Inner Force." },
  { key: "uc-unihorn", name: "Unihorn Slice", category: "Materiais", rarity: "UC", tier: 1, tip: "Demon Bull Labyrinth — boost de Constitution." },
  // Consumíveis
  { key: "uc-heal-potion", name: "Poção de Cura UC", category: "Consumíveis", rarity: "UC", tier: 1, tip: "Craft e drops básicos; registre sempre." },
  { key: "uc-energy-box", name: "Caixa de Energia 100K", category: "Consumíveis", rarity: "UC", tier: 1, tip: "Craft com Red Energy — também vendável no Mercado." },
  // Colecionáveis
  { key: "soul-orb", name: "Magical Soul Orb", category: "Colecionáveis", rarity: "UC", tier: 1, tip: "Primeiro item do Collection Codex (2024) — coletado automaticamente." },
  // Badges
  { key: "uc-rep-badge", name: "Badge de Reputação UC", category: "Badges de Reputação", rarity: "UC", tier: 1, tip: "Missões de reputação; combine badges que você não usa." },
  { key: "r-rep-badge", name: "Badge de Reputação Rara", category: "Badges de Reputação", rarity: "Raro", tier: 2, tip: "Missões de reputação avançadas; priorize completar." },
];

export interface CodexBonus {
  completion: string;
  bonus: string;
}

export const CODEX_BONUSES: CodexBonus[] = [
  { completion: "Categoria 25%", bonus: "Bônus iniciais de atributos (ATK/DEF/HP)" },
  { completion: "Categoria 50%", bonus: "Aumento de CRIT DMG e Hunting EXP" },
  { completion: "Categoria 75%", bonus: "Lucky Drop Chance e bônus de EXP" },
  { completion: "Categoria 100%", bonus: "Bônus máximos da categoria + EXP bônus" },
  { completion: "A cada 8 tiers", bonus: "Bônus especiais e grande quantidade de EXP" },
];

export const CODEX_RANKING: { rank: string; buff: string }[] = [
  { rank: "1º", buff: "+5% Hunting EXP, +5% Lucky Drop" },
  { rank: "2º", buff: "+4% Hunting EXP, +4% Lucky Drop" },
  { rank: "3º", buff: "+3% Hunting EXP, +3% Lucky Drop" },
  { rank: "4º–10º", buff: "+2% Hunting EXP, +2% Lucky Drop" },
  { rank: "11º–20º", buff: "+1,5% Hunting EXP, +1,5% Lucky Drop" },
  { rank: "21º–50º", buff: "+1,2% Hunting EXP, +1,2% Lucky Drop" },
  { rank: "51º–100º", buff: "+1% Hunting EXP, +1% Lucky Drop" },
  { rank: "101º–200º", buff: "+0,8% Hunting EXP, +0,8% Lucky Drop" },
  { rank: "201º–500º", buff: "+0,5% Hunting EXP, +0,5% Lucky Drop" },
];

export interface FarmSpot {
  key: string;
  name: string;
  area: string;
  level: string;
  highlights: string[];
  pvp: boolean;
  note: string;
}

export const FARM_SPOTS: FarmSpot[] = [
  { key: "necropolis", name: "Nefariox Necropolis", area: "Bicheon", level: "20–26", highlights: ["Kills rápidas", "Bom início de AFK"], pvp: false, note: "Troque de canal se estiver lotado; [Elite] 2F dá mais EXP." },
  { key: "bicheon-labyrinth", name: "Bicheon Labyrinth 3F", area: "Bicheon", level: "~26", highlights: ["Magic Stones UC", "Skill Tomes", "Enhancement Stones"], pvp: false, note: "4 andares que chegam a monstros nível 70+." },
  { key: "crystalline-forest", name: "Crystalline Forest", area: "Bicheon", level: "~30", highlights: ["Quintessence UC", "Dragon Leather", "Ancient Dragon Tokens"], pvp: false, note: "Mini-bosses dão boa EXP; troque canal se lotado." },
  { key: "demon-bull-temple", name: "Demon Bull Temple 1F", area: "Bicheon Valley", level: "31–35", highlights: ["Linear e seguro", "Bom para AFK longo"], pvp: false, note: "Ideal até o fim dos 30s." },
  { key: "demon-bull-labyrinth", name: "Demon Bull Labyrinth", area: "Bicheon", level: "30–80", highlights: ["Greater Yang Pill", "Unihorn Slice", "Adamant Axe"], pvp: false, note: "[Elite] Demon Bull Temple 1F para mobs 32+." },
  { key: "bicheon-valley", name: "Bicheon Valley 1F/2F", area: "Bicheon", level: "40–45", highlights: ["Combine com Main Quest", "Secret Peak", "Magic Square"], pvp: false, note: "Pode levar até 5 dias F2P apenas com EXP." },
  { key: "secret-passage", name: "Bicheon Valley Secret Passage 1–3", area: "Bicheon Valley", level: "31–75", highlights: ["Drops valiosos no fundo"], pvp: true, note: "Zona PvP — leve 10k+ poções e use Vigor ativo." },
  { key: "snake-pit", name: "Snake Pit", area: "Snake Pit", level: "45–60", highlights: ["Serpentes em bandos", "Ótimo para AOE"], pvp: false, note: "Fique perto da entrada do Crystalline Mountain." },
  { key: "snake-valley", name: "Snake Valley F3/F4", area: "Snake Pit", level: "61–95", highlights: ["Spot de mineração famoso", "~12k Darksteel/h AFK", "Rochas raras"], pvp: true, note: "Nível alto desencoraja PvP casual; ótimo para Darksteel." },
  { key: "crystalline-mountain", name: "Crystalline Mountain", area: "Snake Pit", level: "70+", highlights: ["Farm endgame inicial"], pvp: true, note: "Área deserta e de mineração." },
  { key: "phantasia", name: "Phantasia Desert", area: "Phantasia", level: "~100", highlights: ["Ervas de nível médio", "Progressão média"], pvp: true, note: "Progressão para o Sabuk." },
  { key: "sabuk", name: "Sabuk Castle", area: "Sabuk", level: "105+", highlights: ["PvP histórico", "Farm forte"], pvp: true, note: "Território disputado entre clãs." },
  { key: "nine-dragon", name: "Nine Dragon Ice Field", area: "Sabuk", level: "130+", highlights: ["Ervas lendárias", "Endgame"], pvp: true, note: "Azureum e Eternal Snow Panax nesta região." },
  { key: "mirage-ship", name: "Mirage Ship (World 2)", area: "World 2", level: "143+", highlights: ["Nível máximo 200", "Bosses Deity GEN"], pvp: true, note: "Heaven's Way Peak e Illusion Temple (World 5)." },
];

export const MAGIC_SQUARE_CHAMBERS: { name: string; chance: string; purpose: string; pvp: boolean }[] = [
  { name: "Experience I–III", chance: "4,4% cada", purpose: "Farm de EXP", pvp: true },
  { name: "Training I–III", chance: "4,4% cada", purpose: "EXP sem PvP (ideal para nível baixo)", pvp: false },
  { name: "Gold I–III", chance: "4,4% cada", purpose: "Copper", pvp: true },
  { name: "White Silver I–III", chance: "4,4% cada", purpose: "Old Silver e materiais", pvp: true },
  { name: "Magic Stone I–III", chance: "4,4% cada", purpose: "Pedras mágicas", pvp: true },
  { name: "Leader's I–III", chance: "4,4% cada", purpose: "Chefes com materiais de Skill Tomes", pvp: true },
  { name: "Mining", chance: "4,4%", purpose: "Nodos de minério", pvp: true },
  { name: "Gathering", chance: "4,4%", purpose: "Nodos de plantas/ervas", pvp: true },
  { name: "Energy", chance: "4,4%", purpose: "Nodos de energia", pvp: true },
  { name: "Dark Steel", chance: "2,2%", purpose: "Darksteel (PvP ativo, nodos épicos/lendários)", pvp: true },
  { name: "Treasure", chance: "2,2%", purpose: "Tesouros", pvp: true },
  { name: "Protection", chance: "2,2%", purpose: "Baú guardado (multiplayer)", pvp: true },
  { name: "Cooperation", chance: "2,2%", purpose: "2 baús guardados (multiplayer)", pvp: true },
  { name: "Sealing", chance: "2,2%", purpose: "Baú de 60s (interrompível por outros)", pvp: true },
  { name: "Demon's", chance: "2,2%", purpose: "Chefe com shards", pvp: true },
];

export const BOSS_RESPAWN = [
  { boss: "Leader's Chamber I", time: "A cada 30 minutos" },
  { boss: "Leader's Chamber II", time: "A cada 45 minutos" },
  { boss: "Leader's Chamber III", time: "A cada 3 horas (03, 06, 09, 12, 15, 18, 21, 00 UTC+8)" },
];

export interface GameClass {
  key: string;
  name: string;
  role: string;
  gender: string;
  image: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  skills: { name: string; desc: string }[];
  combos: string[];
  strategy: string;
  build: { title: string; desc: string }[];
}

export const CLASSES: GameClass[] = [
  {
    key: "warrior",
    name: "Warrior",
    role: "Tanque",
    gender: "Masculino",
    image: "/manus-storage/class-warrior_b55b2474.jpg",
    description: "O Warrior é o tanque clássico do MIR4: melhor sustentação e sobrevivência do jogo, com defesa e HP elevados. Ideal para iniciantes e para puxar aggro de bosses em raids.",
    strengths: ["Melhor sobrevivência do jogo", "Alta defesa e HP", "CC e debuffs fortes", "Seguro para farm AFK"],
    weaknesses: ["Baixa mobilidade", "Sem dano mágico", "Menos DPS que Lancer"],
    skills: [
      { name: "Dragon Flame", desc: "Ultimate: infunde ATK com Chi Fire; o ambiente arde e o Warrior ganha boost de dano." },
      { name: "Splitting Slash", desc: "Cancela skills inimigas, abrindo espaço para contra-ataque." },
      { name: "Iron Shackle", desc: "Puxa inimigos na direção do Warrior com baixo custo." },
      { name: "Unbreakable Stance", desc: "Pequeno AOE com boost imenso de ATK e evasão." },
      { name: "Barbaric Charge / Void Slash / Ground Smash / Gale Slash / Lion's Roar", desc: "Sequência de limpeza de mobs." },
      { name: "Riposte / Body Check / Crescent Strike", desc: "Habilidades de combo contra elites." },
    ],
    combos: [
      "Limpar mobs (Bar 1): Barbaric Charge → Berserk → Void Slash → Ground Smash → Gale Slash → Lion's Roar",
      "Contra elites (Bar 2): Crescent Strike → Body Check → Splitting Slash → Riposte / Iron Shackle / Unbreakable Stance",
    ],
    strategy: "Organize suas barras para capitalizar o dano: Bar 1 foca em CC e eliminação de mobs iniciais, Bar 2 em elites com taunt (Riposte), pull (Iron Shackle) e evasão (Unbreakable Stance).",
    build: [
      { title: "PvE / Raids", desc: "Foque HP e DMG Reduction; use Inferno ou Darknyan como spirit de sobrevivência. Set de EXP (Hunting EXP) para levelar; espíritos com Lucky Drop para farm." },
      { title: "PvP", desc: "Priorize PvP ATK e debuff Success; Grifforse é o spirit inicial ideal. Leve poções de HP em abundância — sua mobilidade é baixa." },
      { title: "Farm AFK", desc: "Combos de mobs longos na Bar 1 e espíritos de EXP (Khalion + Koiga). Áreas PvE seguras: Demon Bull Temple 1F, Crystalline Forest." },
    ],
  },
  {
    key: "sorcerer",
    name: "Sorcerer",
    role: "DPS Mágico",
    gender: "Feminino",
    image: "/manus-storage/class-sorcerer_9257ccb9.jpg",
    description: "A Sorcerer domina o dano mágico à distância e o AOE, com forte controle de multidão. É extremamente frágil no corpo a corpo, exigindo posicionamento constante.",
    strengths: ["Maior dano mágico/AOE", "Forte controle de multidão", "Adaptável a quase qualquer situação", "Spells de suporte"],
    weaknesses: ["Frágil no corpo a corpo", "Sem sustentação", "Vulnerável a engajamentos rápidos"],
    skills: [
      { name: "Dragon Tornado", desc: "Ultimate: tornado de fogo devastador em área." },
      { name: "Frozen Block", desc: "Congela o corpo e dá imunidade temporária; atacantes também são congelados." },
      { name: "Chain Lightning", desc: "AOE elétrico que atinge o alvo e inimigos ao redor." },
      { name: "Dark Vortex", desc: "Abre um portal dimensional que suga inimigos próximos." },
      { name: "Frost Orb + Flame Orb", desc: "Slow + burst: a combinação clássica da classe." },
      { name: "Blizzard / Flame Strike", desc: "Finaliza mobs e desgasta elites à distância." },
    ],
    combos: [
      "Combo padrão: Frost Orb (slow) → Flame Orb (burst) → Chain Lightning / Blizzard para limpar",
      "Defesa: Frozen Block quando focada + Flame Strike de contra-ataque",
    ],
    strategy: "Mantenha sempre a distância máxima. Aplique Frost Orb para reduzir velocidade, então exploda com Flame Orb e skills de burst. Use Frozen Block quando for focada pelo inimigo.",
    build: [
      { title: "PvE / Raids", desc: "Skill ATK e Skill DMG Reduction; Chain Lightning e Dragon Tornado em destaque. Espíritos de CRIT (Suparna, Reaper) aumentam o burst." },
      { title: "PvP", desc: "Priorize CRIT DMG e Skill CD Reduction; Whaley estende seus CCs. Frozen Block é sua principal ferramenta de sobrevivência." },
      { title: "Farm AFK", desc: "Frost Orb + Flame Orb para limpar mobs à distância com segurança; Khalion como espírito de EXP acelera o levelamento." },
    ],
  },
  {
    key: "arbalist",
    name: "Arbalist",
    role: "DPS Físico à Distância",
    gender: "Feminino",
    image: "/manus-storage/class-arbalist_05cdc1ee.jpg",
    description: "A Arbalist é o DPS físico à distância: alta mobilidade, engaja e desengaja rápido, e seus ataques atravessam alvos. Seu dano crítico melhora ao focar um único alvo por vez.",
    strengths: ["Alta mobilidade", "Engaja/desengaja rápido", "Ataques perfurantes", "Segura para AFK farm"],
    weaknesses: ["Menos AOE que Sorcerer", "Depende de posicionamento", "DPS máximo exige foco em alvo único"],
    skills: [
      { name: "Arrow Rain", desc: "Ultimate: chuva de flechas em área que debilita inimigos." },
      { name: "Cloaking", desc: "Invisibilidade; ataques a partir dela causam mais dano." },
      { name: "Illusion Arrow / Burst Shell", desc: "Teleporte e ataque rápido — mobilidade de combate." },
      { name: "Flash Arrow", desc: "Ataque de stun que abre contra-ataques para aliados." },
    ],
    combos: [
      "Farm de alvo único: posicione inimigos em linha → Flash Arrow → dano perfurante CRIT",
      "Burst com Cloaking: ative invisibilidade → ataque crítico → Burst Shell para reposicionar",
    ],
    strategy: "Alinhe inimigos para ataques perfurantes, mantenha distância máxima e use Cloaking antes de burst. É a melhor classe para farmar EXP como subclasse.",
    build: [
      { title: "PvE / Raids", desc: "CRIT ATK e ATK Físico; Arrow Rain como ultimate de burst. Espíritos de EXP + Lucky Drop (Khalion, Biyoho) maximizam o farm." },
      { title: "PvP", desc: "Foque mobilidade e CRIT DMG; Cloaking + Flash Arrow permitem abrir e fechar engajamentos. Atire de fora do alcance melee." },
      { title: "Farm AFK", desc: "A melhor subclasse de EXP: alinhe os mobs em fileira para ataques perfurantes e deixe o auto-questing trabalhar." },
    ],
  },
  {
    key: "taoist",
    name: "Taoist",
    role: "Suporte / Curandeiro",
    gender: "Feminino",
    image: "/manus-storage/class-taoist_87d085ab.jpg",
    description: "A Taoist é a curandeira/suporte: a melhor cura do jogo, buffs defensivos e CC decente no melee. Tem curva de aprendizado maior por exigir equilíbrio entre cura e dano.",
    strengths: ["Melhor cura do jogo", "Buffs defensivos em área", "CC e melee decentes", "Revive aliados"],
    weaknesses: ["DPS melee menor que Warrior", "Menos durável que Lancer", "Curva de aprendizado maior"],
    skills: [
      { name: "Ray of Light", desc: "Ultimate: raio de luz que ataca tudo à frente." },
      { name: "Heal", desc: "A melhor cura do jogo — afeta a Taoist e os aliados." },
      { name: "Guardian Circle", desc: "Boost de defesa física em área para a Taoist e aliados." },
      { name: "Expulsion Circle", desc: "Resistência a dano mágico — útil contra Sorcerers." },
      { name: "Sunbeam Sword / Moonlight Wave", desc: "Starters de combo de dano direto." },
      { name: "Moonlight Orb / Tai Chi", desc: "CC que abre espaço para curas de emergência." },
      { name: "Greater Heal", desc: "Revive aliados — essencial em raids." },
    ],
    combos: [
      "Dano: Sunbeam Sword → Moonlight Wave → Moonlight Orb (CC)",
      "Suporte: Heal + Guardian Circle mantidos; Greater Heal para revives",
    ],
    strategy: "Domine a rotação de cura primeiro (Heal + Guardian Circle + Greater Heal), depois integre Sunbeam Sword e Moonlight Wave para dano. Em raids, priorize a sobrevivência do grupo.",
    build: [
      { title: "PvE / Raids", desc: "Cura e buffs defensivos em prioridade; Greater Heal é indispensável. Nyanja ou Darknyan aumentam a sobrevivência do grupo." },
      { title: "PvP", desc: "Moonlight Orb (CC) + Expulsion Circle (anti-Sorcerer); mantenha Guardian Circle ativo. Você é prioridade de alvo — use posição recuada." },
      { title: "Farm AFK", desc: "Solari ou Khalion para EXP e drop; rotação de cura mantida e Sunbeam Sword/Moonlight Wave para o dano passivo." },
    ],
  },
  {
    key: "lancer",
    name: "Lancer",
    role: "DPS Híbrido",
    gender: "Masculino",
    image: "/manus-storage/class-lancer_d7a4f100.jpg",
    description: "O Lancer tem o maior DPS do jogo: híbrido melee/magia com alcance médio e altíssima mobilidade. Sua durabilidade é menor que a do Warrior, então não é tanque de raid.",
    strengths: ["Maior DPS do jogo", "Altíssima mobilidade", "Alcance médio versátil", "CC e debuffs fortes"],
    weaknesses: ["Menos durável que Warrior", "Curva de aprendizado alta", "Rotação exige precisão"],
    skills: [
      { name: "Dragon Spear", desc: "Ultimate: invencibilidade durante o cast + knockdown no alvo." },
      { name: "Ravaging Blow", desc: "Melhor starter de combo: stun + redução de velocidade." },
      { name: "Crescent Blade", desc: "Finisher com alta chance de knockdown, reiniciando combos." },
      { name: "Double Strike", desc: "Dano extra em inimigos chilled/stunned + buff de ATK." },
      { name: "Ascending Dragon", desc: "Combo consistente com Ravaging Blow para kills rápidas." },
    ],
    combos: [
      "Rotação principal: Ravaging Blow → Ascending Dragon → Crescent Blade / Double Strike",
      "Burst defensivo: Dragon Spear (invencível no cast) para abrir combo pesado",
    ],
    strategy: "Nivele todas as skills igualmente para DPS consistente. Use Ravaging Blow + Ascending Dragon como rotação principal, finalizando com Crescent Blade ou Double Strike contra alvos controlados.",
    build: [
      { title: "PvE / Raids", desc: "ATK físico/mágico equilibrado (híbrido) e Skill CD Reduction; Dragon Spear como burst de invencibilidade. Nivele todas as skills por igual." },
      { title: "PvP", desc: "CRIT e debuff Success; Ravaging Blow abre quase todo o combo. Dragon Spear garante janelas de invencibilidade em trocas." },
      { title: "Farm AFK", desc: "Máximo DPS: Ravaging Blow → Ascending Dragon → Crescent Blade em loop; Khalion/Koiga de EXP aceleram a progressão." },
    ],
  },
];

export interface Currency {
  name: string;
  obtain: string;
  use: string;
}

export const CURRENCIES: Currency[] = [
  { name: "Copper (Cobre)", obtain: "Caça, Gold Chambers do Magic Square", use: "Reparos e compras básicas" },
  { name: "Energy (Energia)", obtain: "Coleta de ervas/minérios, caixas craftadas", use: "Crafting e trocas" },
  { name: "Darksteel (Aço Negro)", obtain: "Mineração, eventos, achievements", use: "Upgrades, crafting, conversão em DRACO" },
  { name: "Dragonsteel", obtain: "Drops raros, mineração avançada", use: "Crafting lendário e eventos" },
  { name: "Gold (Ouro)", obtain: "Vendas no Mercado (nível 40+)", use: "Comércio entre jogadores" },
  { name: "Clan Coins", obtain: "Atividades de clã", use: "Loja do clã (fundos, itens)" },
];

export interface EconomyTip {
  title: string;
  desc: string;
}

export const ECONOMY_TIPS: EconomyTip[] = [
  { title: "AFK mining em horários de pico baixo", desc: "Farme de madrugada ou fora do horário de pico; escolha spots remotos e fique perto de monstros para o aggro deles 'proteger' sua mineração." },
  { title: "Red Energy = ouro sem mineração", desc: "Farme energia vermelha, crafte caixas de 100K/1M de energia e venda no Mercado — uma forma consistente de ouro sem entrar em zona PvP de mina." },
  { title: "Achievements e eventos", desc: "Complete achievements rotineiramente (dão Darksteel) e participe de eventos rotativos, que distribuem recursos premium." },
  { title: "Compare ervas vs minérios", desc: "Antes de decidir o que farmar, compare o preço atual do Mercado: minérios raros geralmente valem mais, mas ervas endgame (Eternal Snow Panax, Azureum) são valiosas." },
  { title: "Economia de clã", desc: "Clãs acumulam Fundo, Blacksteel, Energia e Ouro de Clã para Expedition Bosses e conquistas. Clãs fortes distribuem Epic Dragon Statues nos boss raids semanais." },
  { title: "Cuidado com golpes", desc: "Nunca confie em 'trocas diretas' fora do Mercado oficial; verifique os itens antes de confirmar transações. O jogo pune RMT, bots e account sharing." },
  { title: "DRACO: conversão e contexto", desc: "100.000 Darksteel = 1 DRACO via smelting. No auge (2021–2022) o DRACO valia centenas de dólares; o valor caiu drasticamente desde então. Hoje o foco voltou ao uso in-game do Darksteel." },
];

export const SECTION_IMAGES = {
  hero: "/manus-storage/mir4-hero_fde93d36.jpg",
  spirits: "/manus-storage/section-spirits_4e1ae361.jpg",
  codex: "/manus-storage/section-codex_35552f7d.jpg",
  farm: "/manus-storage/section-farm_bc0d668a.jpg",
  economy: "/manus-storage/section-economy_94d8f7ab.jpg",
};

/** Raids e Bosses do MIR4. */
export type RaidDifficulty = "Iniciante" | "Intermediário" | "Avançado" | "Endgame";

export interface RaidDrop {
  item: string;
  rarity: "Comum" | "Incomum" | "Raro" | "Épico" | "Lendário";
  chance: string;
}

export interface Boss {
  key: string;
  name: string;
  location: string;
  type: string;
  power: string;
  difficulty: RaidDifficulty;
  strategy: string[];
  drops: RaidDrop[];
  tips: string[];
}

export const RAIDS: Boss[] = [
  {
    key: "king-bull-fiend",
    name: "King Bull Fiend",
    location: "Boss Raid — Minotauro",
    type: "Boss Raid (Party)",
    power: "~50k PS",
    difficulty: "Iniciante",
    strategy: [
      "Verifique o Entry Power Score na tela do Boss Raid antes de entrar — se não atingir o mínimo, a entrada é bloqueada.",
      "Monte uma party no formato 1-1-3: 1 Tanque (Warrior), 1 Healer (Taoist) e 3 DPS.",
      "O Warrior agrega os adds com Thunder Slash e usa Shield Bash antes dos ataques de tank buster.",
      "Concentre o burst de DPS quando o boss sai do enrage; o Tanque posiciona-se de frente e os DPS atacam pelas costas.",
    ],
    drops: [
      { item: "Treasure Chest (EXP + Copper)", rarity: "Comum", chance: "100%" },
      { item: "Materiais de Enhancement", rarity: "Incomum", chance: "Alta" },
      { item: "Spirit Treasures", rarity: "Raro", chance: "Média" },
      { item: "Skill Tome Materials", rarity: "Raro", chance: "Média" },
    ],
    tips: [
      "1 entrada gratuita por dia (reseta 00:00 UTC+8); extras com Gold, máx. 2/dia.",
      "Use o Raid Party Chat (cross-server) para coordenar burst e mecânicas.",
    ],
  },
  {
    key: "nefariox-king",
    name: "Nefariox King",
    location: "Boss Raid — Necrópolis",
    type: "Boss Raid (Party)",
    power: "~60k PS",
    difficulty: "Intermediário",
    strategy: [
      "O boss alterna entre ataques em área no chão e investidas lineares — fique atento aos indicadores vermelhos.",
      "Taoist mantém Rejuvination e cura nos momentos de dano em área; Warrior segura o agro com Threat.",
      "Arbalists e Sorcerers mantêm distância máxima; Lancer flutua entre burst e recuo.",
      "Guarde os ultimates para a fase final (HP < 30%), quando o boss acelera os ataques.",
    ],
    drops: [
      { item: "Treasure Chest (EXP + Copper)", rarity: "Comum", chance: "100%" },
      { item: "Materiais de Enhancement", rarity: "Incomum", chance: "Alta" },
      { item: "Spirit Treasures", rarity: "Épico", chance: "Média" },
      { item: "Rare Spirit Stone", rarity: "Épico", chance: "Baixa" },
    ],
    tips: [
      "First Kill (primeira derrota do servidor) concede recompensas extras de First Clear.",
      "Recompensas são distribuídas por dano — DPS consistente vale mais que um burst único.",
    ],
  },
  {
    key: "hall-of-greed",
    name: "Hall of Greed",
    location: "Hall of Greed (Salão da Cobiça)",
    type: "Raid de Party",
    power: "~52k PS",
    difficulty: "Intermediário",
    strategy: [
      "Conteúdo de party focado em EXP, Copper e materiais — ideal para grind em grupo.",
      "Priorize mobs com debuffs de área: Boss ATK de espírito (ex.: Grifforse) acelera o clear.",
      "Divida funções: 1 jogador cuida dos adds laterais enquanto o core focus no boss central.",
      "Evite desperdiçar ultimates em adds — guarde para o boss final.",
    ],
    drops: [
      { item: "EXP + Copper", rarity: "Comum", chance: "100%" },
      { item: "Materiais de Enhancement", rarity: "Incomum", chance: "Alta" },
      { item: "Spirit Treasures", rarity: "Raro", chance: "Média" },
      { item: "First Clear Rewards (Boar Fiend CPT)", rarity: "Lendário", chance: "Único (1º clear)" },
    ],
    tips: [
      "O 1º clear do servidor (Boar Fiend CPT) dá bônus único — monitore o ranking de raid.",
      "Recompensas escalam com o nível de participação de cada jogador.",
    ],
  },
  {
    key: "demons-ruin",
    name: "Demon's Ruin",
    location: "Ruínas do Demônio",
    type: "Raid de Party",
    power: "~80k PS",
    difficulty: "Avançado",
    strategy: [
      "A raid tem mecânica de boss com fases — o boss invoca adds periódicos que devem ser limpos rapidamente.",
      "O Healer precisa posicionar-se fora do alcance dos adds e priorizar o Tanque.",
      "DPS em área (Sorcerer/Lancer) limpam adds; DPS mono (Arbalist) foca o boss.",
      "Na fase final, o boss entra em enrage: ative todos os buffs de espírito antes do burst.",
    ],
    drops: [
      { item: "Shards de Material", rarity: "Comum", chance: "Alta" },
      { item: "Spirit Treasures", rarity: "Raro", chance: "Alta" },
      { item: "Legendary Spirit Stone Summon", rarity: "Lendário", chance: "Baixa" },
      { item: "Event Badges (Yellow Dragon Wayfarer)", rarity: "Épico", chance: "Variável (eventos)" },
    ],
    tips: [
      "Usada em eventos oficiais como fonte de badges trocáveis por equipamentos +6.",
      "First Kill rewards são significativas — coordenem com o clã.",
    ],
  },
  {
    key: "steelbone",
    name: "Steelbone",
    location: "Boss Raid — Aço Ósseo",
    type: "Boss Raid (Party)",
    power: "~100k PS",
    difficulty: "Avançado",
    strategy: [
      "Boss com alta DEF física — priorize ATK mágico e debuffs de redução de DEF.",
      "Warrior segura agro; Taoist aplica heal-over-time constante; DPS mantém pressão mágica.",
      "O boss tem ataques de bash pesados: mantenha CRIT EVA alta (espíritos com bash reduction).",
      "Burst coordenado nos janelas de vulnerability (indicador dourado no boss).",
    ],
    drops: [
      { item: "Treasure Chest (EXP + Gold)", rarity: "Comum", chance: "100%" },
      { item: "Materiais de Enhancement Raros", rarity: "Raro", chance: "Alta" },
      { item: "Epic Spirit Summon Items", rarity: "Épico", chance: "Média" },
      { item: "Rare Enhancement Stones", rarity: "Épico", chance: "Baixa" },
    ],
    tips: [
      "Conhecida por drops raros de materiais de enhancement — vale a entrada diária.",
      "Farm consistente: mesmo jogadores de PS médio conseguem contribuição útil.",
    ],
  },
  {
    key: "vipergeist-prison",
    name: "Vipergeist Prison",
    location: "Vipergeist Prison (lançado Nov/2022)",
    type: "Raid Especial",
    power: "~120k PS",
    difficulty: "Endgame",
    strategy: [
      "Raid de ambiente fechado com mecânicas de prisão — posicione-se longe das grades ao ativar skills de área.",
      "O boss divide-se em formas: foque a forma principal e ignore clones temporários.",
      "Tanque posiciona o boss de costas para a parede; DPS atacam em flanco.",
      "Comunique via Raid Party Chat os momentos de CC (stun/silence) para maximizar janelas.",
    ],
    drops: [
      { item: "Treasure Chest (EXP + Gold)", rarity: "Comum", chance: "100%" },
      { item: "Legendary Spirit Treasures", rarity: "Lendário", chance: "Baixa" },
      { item: "First Kill Bonus Rewards", rarity: "Lendário", chance: "Único (1º kill)" },
      { item: "Rare Enhancement Materials", rarity: "Épico", chance: "Média" },
    ],
    tips: [
      "First Kill de raids especiais dá recompensas únicas no lançamento — fique atento aos anúncios.",
      "Conteúdo de clã: organize com seu guild para maximizar participação.",
    ],
  },
  {
    key: "claydoh-gen",
    name: "Claydoh GEN",
    location: "Boss Raid — Claydoh GEN",
    type: "Boss Raid (Party)",
    power: "~140k PS",
    difficulty: "Endgame",
    strategy: [
      "Boss de golem com ataques de área massivos — mantenha distância e use pilares como cobertura.",
      "Warrior com Bash DMG Reduction alto (espíritos Inferno/Suparna) sobrevive aos slam attacks.",
      "DPS mágico (Sorcerer) é mais eficaz que DPS físico contra a armadura de pedra.",
      "Na fase final o boss acelera: ative todos os ultimates em sequência coordenada.",
    ],
    drops: [
      { item: "Treasure Chest (EXP + Gold)", rarity: "Comum", chance: "100%" },
      { item: "Legendary Spirit Stone Summon", rarity: "Lendário", chance: "Baixa" },
      { item: "Epic Enhancement Stones", rarity: "Épico", chance: "Média" },
      { item: "First Kill Bonus Rewards", rarity: "Lendário", chance: "Único (1º kill)" },
    ],
    tips: [
      "Lançado junto com Vipergeist Prison (Nov/2022) — conteúdo endgame de raid.",
      "Organize com o clã: a coordenação é mais importante que o PS individual.",
    ],
  },
  {
    key: "leaders-chamber",
    name: "Leader's Chamber Bosses",
    location: "Magic Square — Câmaras do Líder",
    type: "Boss de Dungeon (PvP ativo)",
    power: "Escala com o andar (F1–F4)",
    difficulty: "Intermediário",
    strategy: [
      "As câmaras de boss do Magic Square têm PvP ativo — entre em grupo grande para evitar que outros jogadores roubem o kill.",
      "Tanque posiciona o boss de costas para o grupo; DPS mantêm distância e usam CC.",
      "Monitore o timer de respawn: L1 = 30min, L2 = 45min, L3 = horários fixos (03:00, 06:00, 09:00... UTC+8).",
      "Planeje a entrada do Magic Square com base no timer para monopolizar o boss.",
    ],
    drops: [
      { item: "Materiais para Skill Tome Chest", rarity: "Comum", chance: "100%" },
      { item: "Enhancement Materials", rarity: "Incomum", chance: "Alta" },
      { item: "Boss Chest (loot aleatório)", rarity: "Raro", chance: "Média" },
      { item: "Request Quest Progress (boss 4F)", rarity: "Épico", chance: "Único (quest)" },
    ],
    tips: [
      "O boss do 4º andar é requisito de Request Quest — não ignore esta câmara.",
      "PvP ativo: leve poções e tenha Vigor disponível antes de entrar.",
    ],
  },
  {
    key: "demon-chamber",
    name: "Demon's Chamber Boss",
    location: "Magic Square — Câmara do Demônio",
    type: "Boss de Dungeon (PvP ativo)",
    power: "Escala com o andar",
    difficulty: "Avançado",
    strategy: [
      "Chance de 2,2% de chegar à câmara — use warp repetidamente até aparecer.",
      "O boss dropa shards e materiais valiosos; PvP ativo significa disputa com outros jogadores.",
      "Entre com party grande e coordinate burst rápido para matar antes de interferência.",
      "Guarde ultimates para o boss; não gaste nos mobs de entrada.",
    ],
    drops: [
      { item: "Shards de Material", rarity: "Comum", chance: "Alta" },
      { item: "Enhancement Materials", rarity: "Incomum", chance: "Alta" },
      { item: "Spirit Treasures", rarity: "Raro", chance: "Média" },
      { item: "Rare Darksteel (no chão da câmara)", rarity: "Épico", chance: "Baixa" },
    ],
    tips: [
      "A câmara tem chance de apenas 2,2% por warp — paciência e persistência.",
      "Se encontrar a câmara ocupada, espere o timer ou entre em outro canal.",
    ],
  },
  {
    key: "world-bosses",
    name: "World Bosses (Snake Valley)",
    location: "Snake Valley / Byeoksan (áreas PvP)",
    type: "World Boss (PvP livre)",
    power: "Alto (endgame)",
    difficulty: "Endgame",
    strategy: [
      "World bosses spawnam em áreas PvP de alto nível — prepare poções, Vigor e party.",
      "O primeiro a dar o último hit (last hit) geralmente garante o melhor loot.",
      "Coordene com o clã para controlar a área durante o spawn.",
      "Bosses dropam Treasure Chests valiosos — monopolizar a zona é a estratégia principal.",
    ],
    drops: [
      { item: "Treasure Chest", rarity: "Raro", chance: "Alta" },
      { item: "Rare Darksteel Nodes", rarity: "Épico", chance: "Média" },
      { item: "Epic Enhancement Materials", rarity: "Épico", chance: "Baixa" },
      { item: "Spirit Summon Tickets", rarity: "Lendário", chance: "Muito baixa" },
    ],
    tips: [
      "Snake Valley é a zona mais disputada do jogo — espere guild wars durante spawns.",
      "Limpe os nodes coloridos primeiro para maximizar a chance de Darksteel raro.",
    ],
  },
];

export const RAID_MECHANICS = {
  title: "Como funcionam as Raids",
  entries: [
    {
      label: "Tipos de Raid",
      desc: "MIR4 tem Boss Raids (partida dedicada contra um boss), Raids de Party (Hall of Greed, Demon's Ruin) e conteúdo competitivo mais recente (Hall of Cooperation, Competitive Raid). Todas exigem Entry Power Score mínimo exibido na tela de Raid Party.",
    },
    {
      label: "Entradas e Reset",
      desc: "Cada Boss Raid oferece 1 entrada gratuita por dia, resetando à meia-noite (UTC+8). Entradas extras podem ser compradas com Gold, com limite de 2 adicionais por dia.",
    },
    {
      label: "First Kill Rewards",
      desc: "A primeira derrota de um boss no servidor (First Kill / First Clear) concede recompensas extras significativas. Monitore o ranking de raid e coordene com o clã para garantir o first kill.",
    },
    {
      label: "Composição de Party",
      desc: "O setup clássico 1-1-3 (1 Tanque, 1 Healer, 3 DPS) funciona para a maioria das raids. Warrior agrega com Thunder Slash, Taoist mantém cura constante, e DPS focam em burst coordenado nos janelas de vulnerability.",
    },
    {
      label: "Comunicação",
      desc: "O Raid Party Chat permite comunicação cross-server dentro da raid. Use para coordenar burst, CC e posicionamento — a diferença entre sucesso e wipe geralmente está na comunicação.",
    },
  ],
};

// =====================================================================
// TIER LIST DE ESPÍRITOS (por cenário)
// =====================================================================

export type SpiritTier = "S" | "A" | "B" | "C";

export const TIER_STYLES: Record<SpiritTier, { label: string; color: string; border: string; bg: string }> = {
  S: { label: "Tier S", color: "text-amber-300", border: "border-amber-500/60", bg: "bg-amber-500/15" },
  A: { label: "Tier A", color: "text-violet-300", border: "border-violet-500/60", bg: "bg-violet-500/15" },
  B: { label: "Tier B", color: "text-sky-300", border: "border-sky-500/60", bg: "bg-sky-500/15" },
  C: { label: "Tier C", color: "text-slate-300", border: "border-slate-500/60", bg: "bg-slate-500/10" },
};

export type TierScenario = "pvp" | "mining" | "boss";

export interface TierRow {
  tier: SpiritTier;
  spirits: { key: string; name: string; reason: string }[];
}

export interface TierCombo {
  label: string;
  spirits: { key: string; name: string }[];
  note: string;
}

export interface TierScenarioData {
  key: TierScenario;
  label: string;
  description: string;
  rows: TierRow[];
  combos: TierCombo[];
}

export const TIER_SCENARIOS: TierScenarioData[] = [
  {
    key: "pvp",
    label: "PvP",
    description:
      "Prioriza redução de dano crítico, PvP DMG Reduction e habilidades defensivas que sobrevivem a foco concentrado. Espíritos de CRIT DMG Reduction e evasão sobem no topo.",
    rows: [
      {
        tier: "S",
        spirits: [
          { key: "lendario-placeholder", name: "Styx (L) / Goldking (L)", reason: "Atributos esmagadores + passivas de raid que anulam dano concentrado." },
          { key: "snowfox", name: "Snow Fox", reason: "CRIT DMG Reduction −10% e chance de Evade instantâneo salvam contra burst de Sorcerer e Arbalist." },
          { key: "darknyan", name: "Darknyan", reason: "Ressurreição com 25% do HP evita mortes instantâneas em guerras de Sabuk." },
        ],
      },
      {
        tier: "A",
        spirits: [
          { key: "epico-placeholder", name: "Biyoho (E) / Reaper (E)", reason: "Versões superiores com DEF elevada e procs de alto impacto." },
          { key: "crystaglass", name: "Crystaglass", reason: "PvP ATK + Bash Reduction + proc de ATK." },
          { key: "goldking", name: "Goldking", reason: "Stun + proc de ATK/DEF; útil em trocas agressivas." },
        ],
      },
      {
        tier: "B",
        spirits: [
          { key: "horyong", name: "Horyong", reason: "Recuperação de HP por ataque ajuda em trocas prolongadas." },
          { key: "galesoul", name: "Galesoul", reason: "CRIT ATK com sustain de emergência em HP baixo." },
          { key: "raro-placeholder", name: "Raros defensivos", reason: "Transição até conseguir épicos e lendários." },
        ],
      },
      {
        tier: "C",
        spirits: [
          { key: "flory", name: "Flory", reason: "Bônus de coleta não ajudam em combate." },
          { key: "doggo", name: "Doggo", reason: "Apenas sobrevivência básica." },
        ],
      },
    ],
    combos: [
      {
        label: "Combo de sobrevivência",
        spirits: [
          { key: "lendario-placeholder", name: "Styx (L)" },
          { key: "darknyan", name: "Darknyan" },
          { key: "snowfox", name: "Snow Fox" },
          { key: "epico-placeholder", name: "Biyoho (E)" },
        ],
        note: "Redução de dano + evade + ressurreição: ideal para tanquear em Sabuk e guerras de clã.",
      },
    ],
  },
  {
    key: "mining",
    label: "Mineração",
    description:
      "Prioriza velocidade de mineração e coleta para maximizar Darksteel e recursos por hora. Quanto mais rápido você minera, mais rápido escala para raids e Magic Square.",
    rows: [
      {
        tier: "S",
        spirits: [
          { key: "styx", name: "Styx", reason: "Coleta −10% e Mineração −10% com proc defensivo forte para sobreviver em Snake Valley." },
          { key: "leocrat", name: "Leocrat Khun", reason: "Coleta −10%, Mineração −10% + PvP DMG Reduction −8%: o combo de farm definitivo." },
        ],
      },
      {
        tier: "A",
        spirits: [
          { key: "flory", name: "Flory", reason: "Coleta −10% e Mineração −10%; puro acelerador de farm." },
          { key: "epico-placeholder", name: "Épicos de farm", reason: "Atributos gerais mais altos encurtam o tempo por mineração." },
          { key: "horyong", name: "Horyong", reason: "Coleta de energia sustenta longas sessões AFK." },
        ],
      },
      {
        tier: "B",
        spirits: [
          { key: "raro-placeholder", name: "Raros de coleta", reason: "Bom custo-benefício antes dos épicos." },
          { key: "lamper", name: "Lamper", reason: "Coleta de energia + Copper para renda paralela." },
          { key: "uc-magicstone", name: "Spirits UC de coleta", reason: "Base acessível para quem está começando." },
        ],
      },
      {
        tier: "C",
        spirits: [
          { key: "doggo", name: "Doggo", reason: "Sem bônus relevantes de coleta." },
          { key: "uc-weapon-t1", name: "Spirits UC de combate", reason: "Bônus de ataque não aceleram mineração." },
        ],
      },
    ],
    combos: [
      {
        label: "Combo de Darksteel",
        spirits: [
          { key: "styx", name: "Styx" },
          { key: "leocrat", name: "Leocrat Khun" },
          { key: "flory", name: "Flory" },
          { key: "horyong", name: "Horyong" },
        ],
        note: "Foco total em mineração/coleta com defesa mínima para sobreviver em áreas contestadas.",
      },
    ],
  },
  {
    key: "boss",
    label: "Bosses",
    description:
      "Prioriza Boss DMG Reduction e Boss ATK Reduction para raids, Magic Square e World Bosses. Sobrevivência prolongada é o que permite DPS consistente sem morrer para mecânicas.",
    rows: [
      {
        tier: "S",
        spirits: [
          { key: "lendario-placeholder", name: "Styx (L) / Goldking (L)", reason: "Passivas de raid — as únicas feitas para conteúdo de boss endgame." },
          { key: "snowfox", name: "Snow Fox", reason: "Boss DMG Reduction −6% + evade: quase obrigatória em Magic Square." },
        ],
      },
      {
        tier: "A",
        spirits: [
          { key: "epico-placeholder", name: "Biyoho (E) / Reaper (E)", reason: "Versões superiores com DEF elevada e redução de boss forte." },
          { key: "darknyan", name: "Darknyan", reason: "Boss DMG Reduction −15% + ressurreição: seguro para raids longas." },
          { key: "inferno", name: "Inferno", reason: "Boss DMG Reduction −15% + proc de cura por ataque." },
        ],
      },
      {
        tier: "B",
        spirits: [
          { key: "horyong", name: "Horyong", reason: "Sustain de HP ajuda em raids prolongadas." },
          { key: "uc-armor-t1", name: "Reduções UC", reason: "Base defensiva aceitável para Magic Square de entrada." },
          { key: "raro-placeholder", name: "Raros de boss", reason: "Reduções sólidas até conseguir lendários." },
        ],
      },
      {
        tier: "C",
        spirits: [
          { key: "flory", name: "Flory", reason: "Bônus de coleta não afetam combate com boss." },
          { key: "doggo", name: "Doggo", reason: "Reduções muito baixas para raids." },
        ],
      },
    ],
    combos: [
      {
        label: "Combo de Raid",
        spirits: [
          { key: "lendario-placeholder", name: "Styx (L)" },
          { key: "snowfox", name: "Snow Fox" },
          { key: "darknyan", name: "Darknyan" },
          { key: "inferno", name: "Inferno" },
        ],
        note: "Composição clássica de raid: máxima redução de dano de boss + sustain para garantir First Kill Rewards.",
      },
    ],
  },
];

export const TIER_NOTE =
  "As posições refletem os bônus passivos por cenário. Espíritos lendários e míticos dominam todos os cenários — os rankings focam na relevância relativa dentro de cada cenário. Espíritos de evento rotativo (Lulu, Wooska) sobem para o Tier S quando disponíveis.";

// =====================================================================
// GUIA DE LEVELING POR FAIXA DE NÍVEL
// =====================================================================

export interface LevelBand {
  range: string;
  title: string;
  goals: string[];
  zones: { name: string; note: string; special?: boolean }[];
  tips: string[];
}

export const LEVELING_GUIDE: LevelBand[] = [
  {
    range: "1-10",
    title: "Despertar em Byeoksan",
    goals: [
      "Seguir a Quest Guide principal — a XP por missão é o que mais rende",
      "Coletar energia (Energy Gathering) sempre que o cooldown permitir",
      "Criar sua conta de Darksteel para já minerar recursos iniciais",
    ],
    zones: [
      { name: "Byeoksan (região inicial)", note: "Área segura — PvP desativado para aprendizes.", special: true },
    ],
    tips: [
      "Reserve Darksteel para os 3 primeiros slots de equipamento: arma, capacete e armadura.",
      "Ative o AFK Farm cedo e deixe o jogo minerando enquanto você joga ativamente.",
      "Complete as missões de tutorial para ganhar tokens de invocação de espírito UC.",
    ],
  },
  {
    range: "10-20",
    title: "Primeiros passos como mercenário",
    goals: [
      "Alcançar Nível 20 para desbloquear a invocação de espíritos",
      "Fazer o primeiro summons com tickets UC",
      "Começar a farmar materiais para Constitution",
    ],
    zones: [
      { name: "Byeoksan / arredores", note: "Continue a Quest Guide.", special: true },
      { name: "Secret Mine (eventual)", note: "Boa fonte de itens UC Tier 1 para o Codex.", special: true },
    ],
    tips: [
      "O Doggo (UC) é gratuito — use-o como base até conseguir algo melhor.",
      "Participe do evento de assistência mensal para ganhar o Horyong (espírito de energia).",
      "A partir do nível 15, habilite o auto-combate para caça AFK em áreas seguras.",
    ],
  },
  {
    range: "20-30",
    title: "Labyrinth e primeiros desafios",
    goals: [
      "Dominar Bicheon Labyrinth 3F (25-60) para farm de recursos e itens UC",
      "Montar um setup de 4 espíritos UC focado em coleta/mineração",
      "Entrar no Magic Square assim que disponível (câmaras de Magic Stone)",
    ],
    zones: [
      { name: "Nefariox Necropolis", note: "20-29 — transição natural pós-Byeoksan." },
      { name: "Bicheon Labyrinth 3F", note: "25-60 — farm de UC, Flower Oil e drops de mid-game." },
      { name: "Secret Passage", note: "31-75 — rota paralela eficiente se precisar de XP." },
    ],
    tips: [
      "Registre os itens UC no Codex sempre que possível — os bônus de conclusão são permanentes.",
      "O Magic Stone da câmara UC é a primeira pedra que todo build precisa.",
      "Comece a guardar tickets de summons para eventos de invocação rara.",
    ],
  },
  {
    range: "30-40",
    title: "Demon Bull e expansão territorial",
    goals: [
      "Farmar Demon Bull Temple (31-35) e Demon Bull Labyrinth (30-80)",
      "Fazer sua primeira raid de clã (Unihorn Horn / Magic Stone)",
      "Completar os primeiros tiers do Codex de Equipamentos",
    ],
    zones: [
      { name: "Demon Bull Temple", note: "31-35 — XP sólido e drops de acessório UC." },
      { name: "Demon Bull Labyrinth", note: "30-80 — Greater Yang Pill e Unihorn Slice para o Codex." },
      { name: "Bicheon Valley", note: "40-45 — prepare-se para a próxima faixa." },
    ],
    tips: [
      "Junte-se a um clã ativo: os Clan Boss semanais são a fonte dos Epic Dragon Statues.",
      "Unihorn Slice é um material UC importante — farme em lote.",
      "Priorize Constitution: cada ponto de HP vale mais que ATK no early game.",
    ],
  },
  {
    range: "40-50",
    title: "Crystalline Forest e épicos no radar",
    goals: [
      "Farmar Crystalline Forest (30-76) por materiais de Codex",
      "Obter o primeiro espírito Épico via Clan Boss",
      "Fazer a primeira incursão a Snake Valley para Darksteel",
    ],
    zones: [
      { name: "Crystalline Forest", note: "30-76 — uma das zonas mais rentáveis do mid game." },
      { name: "Snake Pit", note: "45-60 — XP elevado e drops de armadura UC/épica." },
      { name: "Snake Valley", note: "90-95 (Darksteel) — entre com setup completo e clã." },
    ],
    tips: [
      "Snake Valley é PvP aberto: vá com o clã ou em horário de baixa concorrência.",
      "Os espíritos épicos mudam o jogo — priorize Biyoho e Reaper assim que conseguir.",
      "Ative o AFK Mining em paralelo: o Darksteel acumulado vale DRACO.",
    ],
  },
  {
    range: "50-60",
    title: "Consolidação do mid game",
    goals: [
      "Completar equipamentos UC Tier 2 e começar a caçar épicos",
      "Subir no ranking do Collection Codex (bônus por posição no servidor)",
      "Fazer raids de boss (King Bull Fiend, Nefariox King) pela primeira vez",
    ],
    zones: [
      { name: "Snake Pit / Crystalline Forest", note: "45-76 — rotacione as duas para não estagnar." },
      { name: "Crystalline Mountain", note: "76 — próxima área de XP quando estiver pronto.", special: true },
    ],
    tips: [
      "Participe dos raids de boss mesmo sem gear perfeita — First Kill Rewards são valiosos.",
      "Concentre-se em 1-2 espíritos por cenário em vez de espalhar recursos.",
      "Verifique o Mercado semanalmente: preços de materiais caem nos fins de semana.",
    ],
  },
  {
    range: "60-70",
    title: "Snake Valley e raids constantes",
    goals: [
      "Farmar Snake Valley F3/F4 (61-75) — uma das melhores rotas de XP do jogo",
      "Construir o combo de raid: redução de boss + sustain",
      "Acumular Darksteel para a primeira conversão em DRACO",
    ],
    zones: [
      { name: "Snake Valley F3/F4", note: "61-95 — XP e drops balanceados; zona PvP ativa e Darksteel." },
      { name: "Secret Passage (70-75)", note: "Alternativa se Snake Valley estiver saturado." },
    ],
    tips: [
      "100.000 Darksteel = 1 DRACO — planeje a conversão quando o preço do token estiver alto.",
      "As raids Hall of Greed e Demon's Ruin desbloqueiam drops épicos/lendários: entre 1x por dia.",
      "Ajuste seu combo de espíritos por atividade: farm ≠ raid ≠ PvP.",
    ],
  },
  {
    range: "70-100",
    title: "Caminho para o endgame",
    goals: [
      "Alcançar Crystalline Mountain (76) e preparar para Phantasia Desert (100)",
      "Obter o primeiro espírito Lendário (Styx L / Goldking L) via evento de invocação",
      "Dominar Vipergeist Prison e raids de endgame",
    ],
    zones: [
      { name: "Crystalline Mountain", note: "76 — XP denso, recursos de tier alto." },
      { name: "Snake Valley (Darksteel)", note: "90-95 — continue minerando em grupo." },
      { name: "Phantasia Desert", note: "100 — porta de entrada do endgame." },
    ],
    tips: [
      "Lendários definem o endgame: guarde summons premium para os eventos certos.",
      "World Bosses dropam materiais únicos — marque os horários com o clã.",
      "Comece a montar gear para Sabuk War: PvP em larga escala é o conteúdo endgame.",
    ],
  },
  {
    range: "100+",
    title: "Endgame: Sabuk e Nine Dragon",
    goals: [
      "Dominar Sabuk (105+) — o campo de batalha definitivo entre clãs",
      "Explorar Nine Dragon (130+) — o conteúdo mais desafiador do jogo",
      "Competir no ranking do Collection Codex e das raids",
    ],
    zones: [
      { name: "Sabuk", note: "105+ — PvP massivo; o clã que controla Sabuk domina o servidor." },
      { name: "Nine Dragon", note: "130+ — bosses e drops de raridade máxima." },
      { name: "Phantasia Desert", note: "100 — rota de farm endgame quando Sabuk estiver fechado." },
    ],
    tips: [
      "No endgame, a coordenação de clã vale mais que gear individual.",
      "Mantenha espíritos lendários/míticos equipados: a diferença de atributos é brutal.",
      "Continue convertendo Darksteel em DRACO conforme o mercado — é sua renda passiva.",
    ],
  },
];

// =====================================================================
// GUERRA DE SABUK E GUILDAS (Clãs)
// =====================================================================

export interface SabukEntry {
  key: string;
  title: string;
  description: string;
  details: string[];
}

export const SABUK_CONTENT: SabukEntry[] = [
  {
    key: "guerra-sabuk",
    title: "Como funciona a Guerra de Sabuk",
    description:
      "A Guerra de Sabuk é a batalha semanal entre clãs do próprio servidor pelo controle do Castelo de Sabuk. O clã que acumula mais pontos ao final de aproximadamente 1 hora de batalha conquista o castelo — o líder do clã vencedor se torna o Rei do Castelo de Bicheon/Sabuk.",
    details: [
      "A batalha acontece entre clãs do mesmo servidor, geralmente ao fim de semana (sábado, horário anunciado no servidor).",
      "Pontos são ganhos ao matar inimigos na área do castelo, destruir estruturas de defesa e controlar pontos estratégicos.",
      "Organize a party em grupos: tanques nas linhas de frente, DPS em flancos e healers protegidos atrás de pilares.",
      "Membros que não estão em combate direto podem farmar recursos na periferia — cada membro contribui para o score do clã.",
    ],
  },
  {
    key: "sabuk-clash",
    title: "Sabuk Clash — a guerra entre servidores",
    description:
      "O Sabuk Clash é a guerra regional em estilo torneio entre os reis dos castelos de todos os servidores de uma região. A disputa dura 3 semanas e passa por 3 Gateways semanais: Attack Route (1ª rodada), Castle Gate (2ª rodada) e Sabuk Castle (final). O líder do clã vencedor é coroado Imperador do Castelo de Sabuk.",
    details: [
      "Roda 1: 16 clãs disputam 8 Monolitos em 8 áreas — os 8 clãs que gravarem um Monolito avançam.",
      "Roda 2: entre os 8 clãs, 4 gravam Monolitos e avançam à final.",
      "Final (Gateway 3 — Sabuk Castle): entre os 4 clãs, aquele que capturar o Monolito se torna o clã do Imperador.",
      "Apenas clãs que são Reis do Castelo de Bicheon podem participar — conquistar Sabuk no próprio servidor é o pré-requisito.",
      "Se nenhum Monolito for gravado nas rodadas 1 ou 2, o Sabuk Clash encerra e o trono permanece vago até a próxima disputa.",
    ],
  },
  {
    key: "recompensas-sabuk",
    title: "Recompensas e poderes do Imperador",
    description:
      "O Imperador e seu clã ganham autoridade real sobre o território: poder de governança, prêmios exclusivos e benefícios que se espalham por todo o servidor.",
    details: [
      "50.000 Clan Copper para o clã vencedor do Sabuk Clash.",
      "Montura exclusiva Sabuk Destrier — apenas o Imperador pode comprar e montar.",
      "Símbolo exclusivo disponível somente para o clã do Imperador.",
      "Título Imperial concedido a um clã da região do Imperador.",
      "Presente comum para todos os usuários de todos os servidores no dia seguinte à final (ex.: Epic Dragon Oil of Blessing, Rare Dragonsteel Box).",
      "Poderes de governo: nomear cargos do governo no clã rei, gerenciar os impostos acumulados no Armazém de Sabuk, ajustar alíquotas por servidor, premiar personagens específicos, declarar Decretos Imperiais e enviar mensagens que aparecem em todos os servidores da região.",
    ],
  },
  {
    key: "estrategias-cerco",
    title: "Estratégias de cerco para conquistar Sabuk",
    description:
      "Vencer a Guerra de Sabuk exige coordenação de clã, não apenas poder individual. Estas são as práticas consolidadas da comunidade.",
    details: [
      "Divida o clã em esquadrões: 1 grupo de tanques segura o portão, 2 grupos de DPS flanqueiam, 1 grupo reserva contra-ataca invasões.",
      "Comunique-se por voice chat externo — o chat do jogo não sustenta a velocidade de decisão de um cerco.",
      "Priorize matar healers e DPS inimigos antes de trocar dano com tanques: a eliminação de um healer desestabiliza o grupo inteiro.",
      "Guarde ultimates e buffs de espírito para os últimos 15 minutos, quando os pontos decidem a batalha.",
      "Controle o respawn: reposicione membros caídos rapidamente para não perder pressão de números.",
      "No Sabuk Clash, estude o adversário nas rodadas anteriores — clãs que desperdiçam DPS em mobs menores perdem nas finais.",
    ],
  },
  {
    key: "guilda",
    title: "Mecânicas de Guilda (Clã)",
    description:
      "Os clãs (clans) são a unidade de cooperação do MIR4: concentram atividades diárias, raids semanais e a guerra de Sabuk. Criar ou ingressar exige nível 10+, pelo ícone de Clã no canto superior direito.",
    details: [
      "Crie o clã acessando o ícone de Clã (nível 10+), escolhendo nome e emblema — exige recursos iniciais (Copper/Energy).",
      "Clan Boss semanal: cada clã enfrenta um boss semanal que dropa Epic Dragon Statues — fonte principal de espíritos Épicos.",
      "Clan Expedition: expedições cooperativas com torres upáveis (Fox Spirit Beast e similares) — mantenha as torres em nível alto para bônus de atributos.",
      "Recursos do clã (Copper/Clan Points) são acumulados por membros — participe diariamente de missões de clã para contribuir.",
      "Clan Match (desde set/2024): torneio de até 32 clãs, aberto a membros nível 90+.",
      "Clan Alliance: clãs podem formar alianças com chat compartilhado para coordenação de guerras e darksteel.",
      "Dica: um bom clã vale mais que gear individual — procure clãs ativos com Sabuk War programada.",
    ],
  },
  {
    key: "clan-match",
    title: "Clan Match — o torneio entre clãs",
    description:
      "Conteúdo PvP competitivo lançado em setembro de 2024: até 32 clãs disputam em rodadas eliminatórias, com membros nível 90+ habilitados a participar.",
    details: [
      "Até 32 clãs participam por temporada, em formato eliminatório.",
      "Apenas membros nível 90 ou superior podem entrar nas partidas.",
      "Prêmios de temporada incluem equipamentos, recursos e reconhecimento público do clã vencedor.",
      "Exige organização de roster: selecione os membros de maior PS e atributos PvP para o time titular.",
    ],
  },
];

// =====================================================================
// MISTÉRIOS E CONQUISTA (Torre da Conquista)
// =====================================================================

export interface MysteryQuest {
  key: string;
  name: string;
  location: string;
  steps: string[];
  reward: string;
  tip: string;
}

export const MYSTERIES: MysteryQuest[] = [
  {
    key: "nefariox-horn",
    name: "Nefariox Horn",
    location: "Cave of the World Beetles / Ginkgo Valley / Bicheon Town",
    steps: [
      "The First Sage: fale com o Dwarf Digger na Cave of the World Beetles para iniciar.",
      "Bloodshade Nefariox Horn: em Ginkgo Valley, aceite a request Madman's Trace e localize a Grotesque Statue.",
      "Beautiful Sister Magya: em Ginkgo Valley, complete a task Treasure's Aura.",
      "Nefariox Pearl: em Bicheon Town, complete a request For the Greater Good.",
    ],
    reward: "Atributos permanentes (ATK/DEF) e pré-requisito para promoção de edifícios do Conquest.",
    tip: "Comece este mistério logo: desbloqueia progressão de conteúdo e bônus que valem para todas as classes.",
  },
  {
    key: "myriad-needle",
    name: "Myriad Needle",
    location: "Ginkgo Valley / áreas de ervas",
    steps: [
      "Herbalist Hong's True Identity — inicie a cadeia investigando o herbalista.",
      "An Herb More Valuable than Gold — siga o rastro da erva rara.",
      "Those Tainted by Demonic Energy — enfrente os corrompidos por energia demoníaca.",
      "Overambitious Father — complete a Clandestine Investigation 1 para desbloquear o Secret.",
      "Flower of the Demonic Cult — descubra a flor do culto demoníaco.",
      "Mad Healer Pung's Trace — conclua a cadeia rastreando o curandeiro louco.",
    ],
    reward: "Bônus de atributos permanentes e acesso a conteúdos avançados.",
    tip: "As quests de Myriad Needle têm muitos requisitos de coleta — leve ervas e poções suficientes antes de iniciar.",
  },
  {
    key: "noble-cause",
    name: "A Noble Cause",
    location: "Bicheon Town / vilas vizinhas",
    steps: [
      "Jo Gyu's Corruption — investigue a corrupção local.",
      "Noh Wunjang's Evil Path — siga o caminho do vilão.",
      "Cleaning the Backstreet — limpe as ruas da cidade.",
      "Lies and Hypocrisy — desvende as mentiras e hipocrisias.",
      "A Proposal Gem — conclua a cadeia com a joia da proposta.",
    ],
    reward: "Atributos permanentes e progresso de lore essencial para o Conquest.",
    tip: "As quests acontecem em áreas urbanas de nível baixo — resolva cedo no leveling para não travar edifícios do Conquest depois.",
  },
  {
    key: "lost-tome",
    name: "The Lost Tome",
    location: "Snake Pit Village / áreas de Snake Valley",
    steps: [
      "The Owner of the Ring: investigue corpos com marca de Life Leech; descubra Chunsim transformada em Bull Fiend e a família Ma em Snake Pit Village.",
      "Bull Fiend Woman: continue após The Owner of the Ring.",
      "Endless Misunderstanding: complete Bull Fiend Woman primeiro.",
      "Past Grudge: complete Endless Misunderstanding primeiro.",
      "Two Tombs: etapa final da cadeia do Lost Tome.",
    ],
    reward: "Atributos permanentes elevados — uma das cadeias mais longas e recompensadoras.",
    tip: "A cadeia exige paciência narrativa: cada capítulo destrava o seguinte. Não pule diálogos — pistas de localização aparecem neles.",
  },
  {
    key: "incomparable-master",
    name: "Incomparable Master",
    location: "Snake Pit / Trading Post / montanhas",
    steps: [
      "Clue 1 — Boundless Trickster Wuam: vá ao Snake Pit, suba a montanha e fale com Bok Yangjeo no topo.",
      "Clue 2: siga o ícone no mapa e fale com Leo Wujeong, que toca seu instrumento.",
      "Clue 3: obtenha o Talisman (pode exigir abrir o baú várias vezes) e leve ao Trading Post, falando com Yewol.",
      "Clue 4: fale com Yewol novamente (ela recolhe o Talisman); encontre Wuam na estrada para Pakua Stonewall.",
      "Clue 5: volte ao Trading Post e siga o marcador para Wuam na montanha.",
      "Clue 6: complete a raid do Grand Centipede com o Centipede Venom Mystery no inventário; entregue a Yeo Wujeong.",
      "Clue 7: no Trading Post, siga até Ferocious Wild Tiger Pa Gonhyeop e observe a luz verde na montanha.",
      "Clue 8: derrote o Grand Centipedeus, obtenha o Centipede Hust e lute contra Wuam na fenda final para concluir.",
    ],
    reward: "Bônus de atributos permanentes e o título de conclusão da cadeia mais complexa do jogo.",
    tip: "A cadeia mistura requests, raids e exploração — tenha party pronta para o Grand Centipede antes de avançar.",
  },
];

export const CONQUEST_INFO = {
  title: "Torre da Conquista (Conquest)",
  description:
    "O Conquest é o sistema de progressão pessoal de edifícios: são 10 estruturas upáveis até o nível 17, essenciais para o Power Score e para bônus como aumento de armazenamento de Darksteel e redução de imposto do Mercado. Promover exige três coisas ao mesmo tempo: nível do personagem, nível da Tower of Conquest e missões completas de zonas específicas.",
  buildings: [
    { name: "Tower of Conquest", role: "Edifício central — quase todos os outros exigem seu nível para evoluir." },
    { name: "Mine", role: "Aumenta o Darksteel Gain Boost (até +15%) e DEF Mágica." },
    { name: "Forge", role: "Aumenta DEF Física e o armazenamento de Darksteel." },
    { name: "Tower of Quintessence", role: "Reduz o Market Tax Rate (até −20%) — poupança direta nas vendas do Mercado." },
    { name: "Millennial Tree", role: "Atributos de sobrevivência (HP/MP) e pré-requisito de edifícios avançados." },
    { name: "Portal", role: "Facilita deslocamento e desbloqueia acessos." },
    { name: "Tower of Victory", role: "Bônus de Boss ATK DMG Boost e Boss DMG Reduction." },
    { name: "Training Sanctum", role: "Atributos de EXP e treino." },
    { name: "Holy Shrine", role: "Bônus de atributos e proteção." },
    { name: "Sanctuary of Hydra", role: "Edifício avançado de atributos endgame." },
  ],
  tip: "Nunca deixe o Conquest para trás: mistérios resolvidos e edifícios atrasados travam missões, requests e a progressão inteira. Cada promoção leva tempo (como o unsealing) — inicie promoções antes de dormir.",
};
