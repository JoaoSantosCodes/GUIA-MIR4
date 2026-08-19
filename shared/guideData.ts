/**
 * Conteúdo do guia MIR4 — dados compartilhados entre servidor e cliente.
 * Chaves estáveis: `itemType:itemKey` (usadas em favoritos e progresso do Codex).
 */

export type Rarity = "UC" | "Raro" | "Épico" | "Lendário" | "Mítico";

export type FavoriteItemType = "spirit" | "codex" | "farm" | "class" | "economy" | "boss" | "sabuk" | "mystery" | "seal" | "gear" | "materials";

export const FAVORITE_ITEM_TYPES: FavoriteItemType[] = [
  "spirit",
  "codex",
  "farm",
  "class",
  "economy",
  "boss",
  "sabuk",
  "mystery",
  "seal",
  "gear",
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
  // Consumíveis — faixa 1–20
  { key: "uc-heal-potion", name: "Poção de Cura UC", category: "Consumíveis", rarity: "UC", tier: 1, tip: "Craft e drops básicos; registre sempre." },
  { key: "r-heal-potion", name: "Poção de Cura Rara", category: "Consumíveis", rarity: "Raro", tier: 2, tip: "Faixa 1–20: drops em Bicheon e crafting básico — priorize poções +15% HP." },
  // Consumíveis — faixa 20–40
  { key: "uc-energy-box", name: "Caixa de Energia 100K", category: "Consumíveis", rarity: "UC", tier: 1, tip: "Craft com Red Energy — também vendável no Mercado." },
  { key: "r-energy-box", name: "Caixa de Energia 300K", category: "Consumíveis", rarity: "Raro", tier: 2, tip: "Faixa 20–40: Red Energy + crafting — renda passiva via Mercado." },
  { key: "e-mp-potion", name: "Poção de MP Épica", category: "Consumíveis", rarity: "Épico", tier: 3, tip: "Faixa 20–40: sustenta skill spam em Boss Raids iniciantes." },
  // Consumíveis — faixa 40–60
  { key: "e-heal-potion", name: "Poção de Cura Épica", category: "Consumíveis", rarity: "Épico", tier: 3, tip: "Faixa 40–60: essencial para Sabuk early e Magic Square 3F+." },
  { key: "e-greater-energy", name: "Caixa de Energia Maior", category: "Consumíveis", rarity: "Épico", tier: 3, tip: "Faixa 40–60: craft com energia superior — venda no Mercado." },
  // Consumíveis — faixa 60–80
  { key: "l-heal-potion", name: "Poção de Cura Lendária", category: "Consumíveis", rarity: "Lendário", tier: 4, tip: "Faixa 60–80: drops de boss elite; necessária para raids de clã." },
  { key: "l-energy-box", name: "Caixa de Energia Lendária", category: "Consumíveis", rarity: "Lendário", tier: 4, tip: "Faixa 60–80: fonte de renda endgame inicial — Mercado valoriza." },
  // Consumíveis — faixa 80–100+
  { key: "m-heal-potion", name: "Poção de Cura Mítica", category: "Consumíveis", rarity: "Mítico", tier: 5, tip: "Faixa 80–100+: drops raros de Magic Square 5F e bosses de Sabuk." },
  { key: "m-elixir", name: "Elixir de Vitalidade Mítico", category: "Consumíveis", rarity: "Mítico", tier: 5, tip: "Faixa 80–100+: usado em Inner Force de nível alto — raro e valioso." },
  // Colecionáveis — faixa 1–20
  { key: "soul-orb", name: "Magical Soul Orb", category: "Colecionáveis", rarity: "UC", tier: 1, tip: "Primeiro item do Collection Codex (2024) — coletado automaticamente." },
  { key: "r-styx-figurine", name: "Estatueta Styx", category: "Colecionáveis", rarity: "Raro", tier: 2, tip: "Faixa 1–20: drop de boss raro em Bicheon Labyrinth." },
  // Colecionáveis — faixa 20–40
  { key: "r-ancient-map", name: "Mapa Antigo de Bicheon", category: "Colecionáveis", rarity: "Raro", tier: 2, tip: "Faixa 20–40: encontrado em baús de missão e Secret Passage." },
  { key: "e-fire-jade", name: "Fire Jade", category: "Colecionáveis", rarity: "Épico", tier: 3, tip: "Faixa 20–40: drops de mini-bosses no Crystalline Mountain." },
  // Colecionáveis — faixa 40–60
  { key: "e-boss-trophy", name: "Troféu de Boss de Sabuk", category: "Colecionáveis", rarity: "Épico", tier: 3, tip: "Faixa 40–60: recompensa de participação na primeira Sabuk War." },
  { key: "e-dragon-token", name: "Dragon Token Épico", category: "Colecionáveis", rarity: "Épico", tier: 3, tip: "Faixa 40–60: Clan Boss semanais — trocável em lojas de clã." },
  // Colecionáveis — faixa 60–80
  { key: "l-emperor-banner", name: "Estandarte do Imperador", category: "Colecionáveis", rarity: "Lendário", tier: 4, tip: "Faixa 60–80: guild vencedor de Sabuk — cada membro guarda o item." },
  { key: "l-gold-dragon", name: "Dragão Dourado de Ouro", category: "Colecionáveis", rarity: "Lendário", tier: 4, tip: "Faixa 60–80: drops de Sabuk Clash e eventos premium." },
  // Colecionáveis — faixa 80–100+
  { key: "m-abyssal-relic", name: "Relíquia do Abismo", category: "Colecionáveis", rarity: "Mítico", tier: 5, tip: "Faixa 80–100+: Magic Square 5F — um dos itens mais raros do jogo." },
  { key: "m-phoenix-feather", name: "Pena da Fênix", category: "Colecionáveis", rarity: "Mítico", tier: 5, tip: "Faixa 80–100+: evento Phoenix — colecionável de edição limitada." },
  // Badges de Reputação — faixa 1–20
  { key: "uc-rep-badge", name: "Badge de Reputação UC", category: "Badges de Reputação", rarity: "UC", tier: 1, tip: "Missões de reputação; combine badges que você não usa." },
  { key: "uc-rep-badge-silver", name: "Badge de Reputação Prateado", category: "Badges de Reputação", rarity: "UC", tier: 1, tip: "Faixa 1–20: reputação inicial com missões diárias de Bicheon." },
  // Badges de Reputação — faixa 20–40
  { key: "r-rep-badge", name: "Badge de Reputação Rara", category: "Badges de Reputação", rarity: "Raro", tier: 2, tip: "Missões de reputação avançadas; priorize completar." },
  { key: "r-rep-badge-knight", name: "Badge do Cavaleiro de Bicheon", category: "Badges de Reputação", rarity: "Raro", tier: 2, tip: "Faixa 20–40: complete a linha de missões do Cavaleiro para obter." },
  // Badges de Reputação — faixa 40–60
  { key: "e-rep-badge", name: "Badge de Reputação Épico", category: "Badges de Reputação", rarity: "Épico", tier: 3, tip: "Faixa 40–60: reputação com facções de Snake Pit — combine com cuidado." },
  { key: "e-rep-badge-warden", name: "Badge do Guardião do Vale", category: "Badges de Reputação", rarity: "Épico", tier: 3, tip: "Faixa 40–60: recompensa de missões de Bicheon Valley secretas." },
  // Badges de Reputação — faixa 60–80
  { key: "l-rep-badge", name: "Badge de Reputação Lendário", category: "Badges de Reputação", rarity: "Lendário", tier: 4, tip: "Faixa 60–80: missões de guild de alto nível; não combine sem checar o bônus." },
  { key: "l-rep-badge-warlord", name: "Badge do Senhor da Guerra", category: "Badges de Reputação", rarity: "Lendário", tier: 4, tip: "Faixa 60–80: obtido em Sabuk Clash e missões de Warlord." },
  // Badges de Reputação — faixa 80–100+
  { key: "m-rep-badge", name: "Badge de Reputação Mítico", category: "Badges de Reputação", rarity: "Mítico", tier: 5, tip: "Faixa 80–100+: eventos sazonais e reputação máxima — item de colecionador." },
  { key: "m-rep-badge-legend", name: "Badge da Lenda do MIR4", category: "Badges de Reputação", rarity: "Mítico", tier: 5, tip: "Faixa 80–100+: raro badge de eventos de aniversário do jogo." },
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
  {
    key: "darkist",
    name: "Darkist",
    role: "DPS Mágico (veneno e maldição)",
    gender: "Feminino",
    image: "/manus-storage/class-darkist-portrait_0894e6c9.png",
    description: "A Darkist (6ª classe, março de 2023) corrompe e destrói inimigos com magias à distância, especializando-se em venenos potentes e maldições cáusticas. Ataca múltiplos inimigos com correntes de sangue que recuperam HP e, com o ultimate, transforma-se na encarnação de \"Asura\", senhor do inferno, aumentando muito o ataque mágico e aterrorizando monstros próximos (reduzindo a velocidade deles).",
    strengths: ["Alto dano mágico em área", "Veneno e maldições (debuffs fortes)", "Sustain com correntes de sangue", "Ultimate Asura: burst + aterroriza inimigos"],
    weaknesses: ["Frágil no corpo a corpo", "Depende de gestão de stacks de veneno", "Menos controle que a Sorcerer"],
    skills: [
      { name: "Asura (Ultimate)", desc: "Transformação temporária em Asura, senhor do inferno: grande aumento de ataque mágico e aterroriza monstros próximos, reduzindo a velocidade de movimento deles." },
      { name: "Blood Chain / Dark Arts", desc: "Ataca múltiplos inimigos com correntes de sangue, causando dano contínuo e recuperando HP próprio." },
      { name: "Poison Curse / Cursed Ground", desc: "Aplica venenos e maldições em área, corroendo o HP e enfraquecendo defesas dos inimigos." },
      { name: "Forbidden Arts", desc: "Magias proibidas de poder além do limite: dano contínuo alto enquanto durarem." },
    ],
    combos: [
      "Rotina de farm: Poison Curse em área → Blood Chain para sustentar o HP enquanto limpa mobs",
      "Burst: aplique maldições → Forbidden Arts durante o debuff → Asura (ultimate) para finalizar",
    ],
    strategy: "Mantenha os venenos e maldições ativos nos inimigos antes de gastar dano alto: o dano contínuo multiplica o resultado. Use Blood Chain para se sustentar sem poções e entre em Asura apenas nas janelas decisivas — o slow aplicado facilita escapar ou finalizar.",
    build: [
      { title: "PvE / Raids", desc: "Skill ATK e dano contínuo (veneno/maldição); Spirit de burst mágico (Suparna, Reaper). Como Asura aumenta muito o ATK, maximize Skill ATK antes do ultimate." },
      { title: "PvP", desc: "Foque debuff Success e CRIT DMG; Blood Chain permite trocar dano com sustentação. Contra melee, mantenha distância e use o slow do Asura para controlar engajamentos." },
      { title: "Farm AFK", desc: "Veneno + corrente de sangue em loop auto-sustentado; Khalion/Koiga de EXP. É forte para afk em mobs densos por causa do AOE contínuo." },
    ],
  },
  {
    key: "lionheart",
    name: "Lionheart",
    role: "DPS / Carregador (puncher)",
    gender: "Masculino",
    image: "/manus-storage/class-lionheart-portrait_0410c572.png",
    description: "O Lionheart (3ª nova classe, agosto de 2025 — 4º aniversário) é um \"puncher\": empunha braceletes e soqueiras e avança destruindo formações inimigas com investidas brutais. Além do dano físico pesado, carrega habilidades de cura e debuffs, sendo valioso em batalhas de grupo.",
    strengths: ["Investidas que destroem formações", "Cura aliados em grupo", "Debuffs que enfraquecem o time inimigo", "Alta mobilidade de carga"],
    weaknesses: ["Alcance curto de engajamento", "DPS menor que Lancer em alvo único", "Depende de timing das cargas"],
    skills: [
      { name: "Lion's Impact (Ultimate)", desc: "Investida massiva que derruba formações inimigas e causa dano físico brutal em área." },
      { name: "Raging Charge", desc: "Avança em linha reta derrubando e amassando inimigos no caminho." },
      { name: "Roaring Fist", desc: "Combo de soqueiras com alta chance de stun em alvos próximos." },
      { name: "Battle Cry / War Heal", desc: "Grito de guerra que buffa aliados e/ou recupera HP do grupo." },
      { name: "Tear Down / Guard Break", desc: "Debuffs que reduzem DEF e ATK dos inimigos." },
    ],
    combos: [
      "Limpeza de mobs: Raging Charge (engajamento) → Roaring Fist → Guard Break para enfraquecer",
      "Suporte em grupo: Battle Cry → War Heal mantidos enquanto as cargas quebram formações",
    ],
    strategy: "Use as cargas para reposicionar mobs e quebrar formações de elite; em Sabuk, o Lionheart é o que abre linhas para o time. Alterne dano e suporte conforme a necessidade do grupo — não fique só na frente o tempo todo.",
    build: [
      { title: "PvE / Raids", desc: "ATK físico e Bash ATK; War Heal dá autonomia ao grupo sem depender de Taoist. Spirit de EXP + Lucky Drop para o grind." },
      { title: "PvP / Sabuk", desc: "Bash ATK e knockdown/stun Success: Raging Charge + Lion's Impact quebram linhas em grupo. Battle Cry dá o buff que seu time precisa em guerras de clã." },
      { title: "Farm AFK", desc: "Roaring Fist + Raging Charge em loop para mobs densos; Khalion/Koiga de EXP aceleram o nivelamento." },
    ],
  },
  {
    key: "spiritsummoner",
    name: "Spirit Summoner",
    role: "DPS Mágico (invocação)",
    gender: "Feminino",
    image: "/manus-storage/class-spiritsummoner-portrait_52130936.png",
    description: "A Spirit Summoner (4ª nova classe, Capítulo 21, 2026) é uma invocadora que controla os espíritos de toda a criação usando uma vara mágica como meio. Descendente da família que guarda o Navio da Miragem, domina um combate versátil à distância: atrás da aparência inocente esconde um poder sufocante.",
    strengths: ["Dano mágico versátil à distância", "Invocações que atacam e protegem", "Combate adaptável (single-target e AoE)", "Posicionamento seguro"],
    weaknesses: ["Frágil se focada", "Dano depende dos espíritos ativos", "Classe recente: meta ainda em evolução"],
    skills: [
      { name: "Spirit Cascade (Ultimate)", desc: "Libera os espíritos que dominou: dano mágico massivo em área com efeitos variados por espírito invocado." },
      { name: "Spirit Control", desc: "Comanda espíritos para atacar alvos à distância enquanto se mantém protegida." },
      { name: "Wand Arts", desc: "Golpes mágicos com a vara que alternam entre single-target e leques em área." },
      { name: "Spirit Shield", desc: "Espírito guardião absorve parte do dano recebido por um tempo." },
      { name: "Elemental Binding", desc: "Espíritos elementais prendem e desaceleram inimigos próximos." },
    ],
    combos: [
      "Farm: Spirit Control mantém os espíritos atacando enquanto Wand Arts finaliza os alvos",
      "Burst: Elemental Binding (controle) → Spirit Cascade para dano máximo na área",
    ],
    strategy: "Mantenha sempre espíritos ativos entre você e os inimigos: eles são seu dano e sua proteção. Combine bind (controle) antes dos AoE e guarde o Spirit Cascade para mobs densos ou janelas de burst em PvP. Posicione-se atrás dos aliados em grupo.",
    build: [
      { title: "PvE / Raids", desc: "Skill ATK e duração de invocação (quando disponível); espíritos de dano mágico (Suparna, Reaper) amplificam as invocações. Spirit Cascade é a principal fonte de burst." },
      { title: "PvP", desc: "CRIT DMG e controle (bind/slow); Spirit Shield é a sobrevivência principal — use a posição recuada e deixe os espíritos fazerem o trabalho." },
      { title: "Farm AFK", desc: "Spirit Control + Wand Arts rodam quase sozinhos; Khalion/Koiga de EXP para levelamento acelerado." },
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

/**
 * Selos & Geminação — progressão dos Magic Stones lacrados
 */
export type SealStage = "Darksteel Seal" | "Jade Seal" | "Dragon Seal";

export const SEAL_ORDER: SealStage[] = ["Darksteel Seal", "Jade Seal", "Dragon Seal"];

export const SEAL_STYLES: Record<SealStage, { label: string; color: string; border: string; bg: string }> = {
  "Darksteel Seal": { label: "Darksteel Seal", color: "text-slate-300", border: "border-slate-500/50", bg: "bg-slate-800/60" },
  "Jade Seal": { label: "Jade Seal", color: "text-emerald-400", border: "border-emerald-600/50", bg: "bg-emerald-950/40" },
  "Dragon Seal": { label: "Dragon Seal", color: "text-red-400", border: "border-red-600/50", bg: "bg-red-950/30" },
};

export interface SealInfo {
  stage: SealStage;
  level: number;
  description: string;
  bonus: string;
  route: { name: string; detail: string }[];
  howToUpgrade: string;
}

export const SEAL_GUIDE: SealInfo[] = [
  {
    stage: "Darksteel Seal",
    level: 1,
    description:
      "O estágio inicial da Magic Stone lacrada. Nesse nível, o lacre garante os bônus básicos de mineração e é o foco de todo jogador que ainda não domina as áreas intermediárias do continente.",
    bonus: "Boost básico de Darksteel, EXP de mineração e taxas normais de drop de minério.",
    route: [
      { name: "Bicheon Town", detail: "Mineração inicial sem disputa: use as picaretas da cidade e as veias próximas para acumular os primeiros Darksteel enquanto levela de 1 a 30." },
      { name: "Ginkgo Valley", detail: "Veias de minério seguras para level 30–45; combine com coleta de ervas para monetizar no Mercado." },
      { name: "Byeoksan (nível baixo)", detail: "Primeira área de minério de nível médio — ainda pouco disputada antes do peak de players." },
    ],
    howToUpgrade:
      "Upe o lacre fazendo unsealing de Magic Stones do mesmo estágio (boxes de Darksteel Seal). Cada geminação bem-sucedida aumenta o bônus de mineração; falhas reduzem o estágio, então acumule vários boxes antes de tentar promover.",
  },
  {
    stage: "Jade Seal",
    level: 2,
    description:
      "O estágio intermediário. Com o Jade Seal, o ganho de Darksteel por veia aumenta de forma relevante e as áreas de mineração passam a valer o risco de disputa com outros jogadores e guildas.",
    bonus: "Darksteel Gain Boost significativo, chance de minérios raros e mais Darksteel por hora de farm.",
    route: [
      { name: "Byeoksan (área principal)", detail: "Zona clássica de minério para level 45–70; leve party ou vá em horário de pico baixo para não perder veias." },
      { name: "Snake Valley", detail: "Minério médio com monstros mais densos — afk farm com party funciona bem aqui." },
      { name: "Mount Jinyu (andar baixo)", detail: "Acesso a veias de nível alto com menos competição; bom para farm noturno." },
      { name: "Magic Square — Mining Chamber", detail: "Câmara de mineração (4,4% de chance por warp): minério seguro sem PK enquanto estiver lá dentro; combine com rotas de Darksteel fora." },
    ],
    howToUpgrade:
      "Unsealing de Jade Seal boxes (drops de bosses, quests repetidas e Mercado) + materiais de geminação. Priorize promover antes do Dragon Seal: a fila de farm de darksteel em nível alto vale mais com esse selo ativo.",
  },
  {
    stage: "Dragon Seal",
    level: 3,
    description:
      "O estágio final da geminação. O Dragon Seal multiplica o ganho de Darksteel e desbloqueia os spots de elite do continente — é o que separa quem acumula riqueza de verdade de quem apenas sobrevive.",
    bonus: "Maior Darksteel Gain Boost do jogo, chance ampliada de minérios raros/épicos e bônus de atributos para o personagem.",
    route: [
      { name: "Mount Jinyu F1–F3", detail: "As veias de elite do jogo: Darksteel de alto valor, mas sempre disputado. Leve party de guilda e marque horários (após reset diário)." },
      { name: "Secret Peak", detail: "Área de alto nível com minério raro e summons de boss — combine o farm com o abate dos bosses summonados para drop adicional." },
      { name: "Magic Square — Darksteel Chamber", detail: "Câmara exclusiva de Darksteel (2,2% por warp) com veias épicas e lendárias; PK ativo, vá com party." },
      { name: "Darksteel spots de elite (eventos)", detail: "Monoliths e zonas de evento: darksteel bônus multiplicado durante guerras e invasões — priorize quando ativos." },
    ],
    howToUpgrade:
      "Unsealing de Dragon Seal boxes — o recurso mais raro do jogo. Obtidos em drops de bosses endgame, conquistas de Sabuk e eventos raros. Acumule vários antes de tentar; uma falha no estágio final custa caro.",
  },
];

export const SEAL_OVERVIEW = {
  title: "Selos & Geminação (Magic Stones)",
  description:
    "As Magic Stones lacradas evoluem em três estágios de selo — Darksteel Seal, Jade Seal e Dragon Seal. Cada geminação (unsealing de um box do mesmo selo) aumenta os bônus de mineração, atributos e ganho de Darksteel, que é o recurso mais importante da economia do jogo. A rota de farm ideal depende do seu selo atual: não adianta disputar Mount Jinyu com Darksteel Seal, nem perder tempo em Bicheon com Dragon Seal.",
  tip: "Geminacões podem falhar e reduzir o estágio do selo. Acumule boxes e materiais antes de promover, e nunca gaste seu último box do estágio — a falha custa a semana inteira de farm.",
};

/**
 * Calendário de eventos — horários fixos e rotativos do MIR4
 * Horários baseados no servidor SA (América do Sul). Em outros servidores (ASIA/NA/EU),
 * os horários relativos se mantêm, mas o horário local muda com o reset do servidor.
 */
export interface GameEvent {
  key: string;
  name: string;
  category: "guerra" | "dungeon" | "boss" | "diario" | "semanal" | "temporada";
  schedule: string;
  duration: string;
  description: string;
  tip: string;
}

export const EVENT_CATEGORIES = [
  { key: "guerra", label: "Guerras de Guilda", color: "text-red-400", border: "border-red-600/50" },
  { key: "dungeon", label: "Dungeons & Instâncias", color: "text-violet-400", border: "border-violet-600/50" },
  { key: "boss", label: "Bosses Mundiais", color: "text-amber-400", border: "border-amber-600/50" },
  { key: "diario", label: "Diários", color: "text-emerald-400", border: "border-emerald-600/50" },
  { key: "semanal", label: "Semanais", color: "text-sky-400", border: "border-sky-600/50" },
  { key: "temporada", label: "Temporada (Sabuk Clash)", color: "text-rose-400", border: "border-rose-600/50" },
] as const;

export const GAME_EVENTS: GameEvent[] = [
  {
    key: "sabuk-war",
    name: "Guerra de Sabuk (Castle Siege)",
    category: "guerra",
    schedule: "Semanal — horário definido pelo servidor (tipicamente fim de semana, à noite)",
    duration: "~1h de cerco",
    description:
      "O cerco ao Castelo de Bicheon: guildas disputam o controle do castelo. Pontuação contínua por tempo dentro da área, quebra de monólitos e eliminação de inimigos. O clã vencedor governa a região e nomeia o Imperador no Sabuk Clash.",
    tip: "Chegue com o clã completo 15 minutos antes; quem controla os portões externos domina o ritmo do cerco.",
  },
  {
    key: "sabuk-clash",
    name: "Sabuk Clash — Guerra entre Servidores",
    category: "temporada",
    schedule: "Temporada de 3 semanas — 3 Gateways semanais (Attack Route → Castle Gate → Sabuk Castle); rodada final às 22h (horário do servidor)",
    duration: "3 semanas por temporada",
    description:
      "Torneio regional: 16 clãs (reis dos castelos de cada servidor da região) avançam por 3 rounds semanais até restar 1 Imperador. Apenas clãs que são Reis do Castelo de Bicheon no próprio servidor podem participar.",
    tip: "Se nenhum Monólito for gravado nas rodadas 1 ou 2, o trono permanece vago — o clã precisa coordenar gravadores específicos.",
  },
  {
    key: "clan-match",
    name: "Clan Match — Torneio entre Clãs",
    category: "temporada",
    schedule: "A cada 8 semanas, com duração de 3 semanas — até 32 clãs",
    duration: "3 semanas por edição",
    description:
      "Torneio estruturado entre clãs com fases eliminatórias. Clãs precisam se inscrever e montar rosters de combate dentro do período de inscrição.",
    tip: "Monte o roster com classes complementares (tank + DPS + suporte); o formato valoriza composição, não só power.",
  },
  {
    key: "magic-square",
    name: "Magic Square",
    category: "dungeon",
    schedule: "Entrada livre 24h — bosses com respawn fixo (ver tabela de respawn)",
    duration: "Entrada ilimitada durante o dia",
    description:
      "Dungeon instanciada com câmaras aleatórias: EXP, minério, Darksteel, boss drops e caixas. Cada warp tem 2,2% de chance de cair na Darksteel Chamber. Câmaras de boss (Leader's) têm respawn fixo por servidor.",
    tip: "Rastreie o timer dos bosses: a Leader's III respawna a cada 3 horas (03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00, 00:00) e vale os materiais de Skill Tome.",
  },
  {
    key: "secret-peak",
    name: "Secret Peak",
    category: "boss",
    schedule: "Diário — bosses summonados com horários fixos no pico (topo e base vermelhos)",
    duration: "Janela de combate após o summon",
    description:
      "Montanha de alto nível com bosses summonados que dropam Virtue Pills e materiais raros. Os bosses vermelhos (topo e base) são os mais disputados do servidor.",
    tip: "Combine o farm de Secret Peak com o timer dos bosses: fique na área 30 minutos antes do horário do summon.",
  },
  {
    key: "world-boss",
    name: "World Bosses (Labyrinth & Valley)",
    category: "boss",
    schedule: "Diário — Labyrinth Bosses e Valley Bosses com horários rotativos",
    duration: "Janela limitada por spawn",
    description:
      "Bosses mundiais que aparecem em zonas específicas (Labyrinth e Valley) com drops compartilhados para quem participar do abate.",
    tip: "Mesmo sem dar o último hit, participar do abate garante parcela do drop — nunca ignore um world boss ativo.",
  },
  {
    key: "server-expedition",
    name: "Server Expedition",
    category: "diario",
    schedule: "Diário — reset com o servidor",
    duration: "Janela do dia",
    description: "Expedição de servidor com recompensas coletivas. Participação garante itens de progressão.",
    tip: "Faça a expedition logo após o reset diário para garantir a janela antes do peak de players.",
  },
  {
    key: "server-valley-war",
    name: "Server Valley War",
    category: "diario",
    schedule: "Diário — horário rotativo por servidor",
    duration: "Janela da guerra",
    description: "Confronto diário em zonas de vale entre facções do servidor, com recompensas de participação.",
    tip: "Mesmo derrotado, a participação paga tokens — vale mais do que pular para farmar sozinho.",
  },
  {
    key: "clan-expedition",
    name: "Clan Expedition",
    category: "semanal",
    schedule: "~A cada 2 dias (ciclo curto de missão de clã)",
    duration: "Janela de missão",
    description: "Missão coletiva de clã com recompensas compartilhadas entre os membros participantes.",
    tip: "Combine com o clã: as recompensas escalam com o número de participantes.",
  },
  {
    key: "clan-challenge",
    name: "Clan Challenge",
    category: "semanal",
    schedule: "~A cada 3 dias (ciclo de desafio de clã)",
    duration: "Janela de desafio",
    description: "Desafios periódicos de clã com rankings e recompensas por desempenho coletivo.",
    tip: "Priorize os desafios de ranking — as recompensas do topo valem muito mais que as de participação.",
  },
  {
    key: "server-reset",
    name: "Reset Diário do Servidor",
    category: "diario",
    schedule: "Diário — horário fixo por região (ASIA ~03:35, INMENA ~01:35, EU ~21:35, NA ~15:35, SA ~16:35)",
    duration: "Instantâneo",
    description:
      "O reset diário renova os timers de quests repetidas, drops limitados, expedições e janelas de evento. Referência de tempo para todos os outros eventos do servidor.",
    tip: "Use o reset como âncora do seu dia: planeje Magic Square, Darksteel e eventos a partir dele.",
  },
  {
    key: "thursday-event",
    name: "Evento de Quinta-feira",
    category: "semanal",
    schedule: "Semanal — quintas-feiras (horário do servidor)",
    duration: "Janela do evento",
    description: "Evento rotativo semanal com drops especiais e missões de bônus.",
    tip: "Guarde os materiais de craft para dias de evento — as taxas de sucesso e drops costumam melhorar.",
  },
];

/**
 * Calculadora Darksteel & DRACO
 * Estimativas indicativas de Darksteel por hora de mineração por selo e área,
 * e parâmetros de conversão para DRACO. Valores médios de comunidade (2024–2026)
 * e podem variar conforme servidor, eventos e competição de veias.
 */
export interface MineArea {
  key: string;
  name: string;
  levelRange: string;
  dsPerHourBase: number; // Darksteel/hora base (sem selo)
  note: string;
  minSealLevel?: number; // nível de selo mínimo recomendado (0 = qualquer)
}
export const MINE_AREAS: MineArea[] = [
  { key: "bicheon", name: "Bicheon Town", levelRange: "1–30", dsPerHourBase: 12_000, note: "Sem disputa; picaretas da cidade e veias próximas.", minSealLevel: 0 },
  { key: "ginkgo", name: "Ginkgo Valley", levelRange: "30–45", dsPerHourBase: 18_000, note: "Veias seguras; combine com coleta de ervas.", minSealLevel: 0 },
  { key: "byeoksan", name: "Byeoksan", levelRange: "45–70", dsPerHourBase: 26_000, note: "Zona clássica de minério; leve party para manter veias.", minSealLevel: 1 },
  { key: "snake", name: "Snake Valley", levelRange: "40–60", dsPerHourBase: 22_000, note: "Monstros densos; afk farm com party funciona bem.", minSealLevel: 1 },
  { key: "jinyu-low", name: "Mount Jinyu (andar baixo)", levelRange: "60–75", dsPerHourBase: 34_000, note: "Veias de nível alto com menos competição; bom para farm noturno.", minSealLevel: 2 },
  { key: "jinyu-elite", name: "Mount Jinyu F1–F3 (elite)", levelRange: "75+", dsPerHourBase: 55_000, note: "Veias de elite, sempre disputadas; vá com party de guilda.", minSealLevel: 3 },
  { key: "secret-peak", name: "Secret Peak", levelRange: "75+", dsPerHourBase: 42_000, note: "Minério raro + summons de boss para drop adicional.", minSealLevel: 3 },
  { key: "ms-mining", name: "Magic Square — Mining Chamber", levelRange: "60+", dsPerHourBase: 30_000, note: "Minério seguro sem PK (4,4% por warp); combine com farm externo.", minSealLevel: 2 },
  { key: "ms-darksteel", name: "Magic Square — Darksteel Chamber", levelRange: "80+", dsPerHourBase: 80_000, note: "Veias épicas/lendárias (2,2% por warp); PK ativo.", minSealLevel: 3 },
];

/** Multiplicador de ganho por estágio de selo (nível do selo → multiplicador). */
export const SEAL_MULTIPLIER: Record<number, number> = {
  0: 1.0, // sem selo
  1: 1.25, // Darksteel Seal
  2: 1.55, // Jade Seal
  3: 2.0, // Dragon Seal
};

export interface DsCalcParams {
  sealLevel: 0 | 1 | 2 | 3;
  areaKey: string;
  hours: number;
  afk: boolean; // true = apenas AFK (menos eficiente)
}

/** Resultado da estimativa de mineração. */
export interface DsCalcResult {
  dsPerHour: number;
  totalDs: number;
  goldEstimate: { min: number; max: number };
  draco: number;
  dsToNextDraco: number;
}

export const DRACO_REQUIREMENT = 100_000; // Darksteel por 1 DRACO (mais taxa)
export const DRACO_FEE = 0.1; // taxa de processamento (~10%)

export function calculateMining(params: DsCalcParams): DsCalcResult {
  const area = MINE_AREAS.find(a => a.key === params.areaKey) ?? MINE_AREAS[0];
  const mult = SEAL_MULTIPLIER[params.sealLevel] ?? 1;
  const afkPenalty = params.afk ? 0.8 : 1;
  const dsPerHour = Math.round(area.dsPerHourBase * mult * afkPenalty);
  const totalDs = dsPerHour * params.hours;
  // Gold: venda indireta de Darksteel no Mercado — estimativa de 1 Gold ≈ 400–800 DS
  const goldMin = Math.round(totalDs / 800);
  const goldMax = Math.round(totalDs / 400);
  const effective = totalDs * (1 - DRACO_FEE);
  return {
    dsPerHour,
    totalDs,
    goldEstimate: { min: goldMin, max: goldMax },
    draco: Math.floor(effective / DRACO_REQUIREMENT),
    dsToNextDraco: totalDs > 0 ? Math.max(0, Math.round((Math.ceil(effective / DRACO_REQUIREMENT) * DRACO_REQUIREMENT) / (1 - DRACO_FEE) - totalDs)) : DRACO_REQUIREMENT,
  };
}

export const CALCULATOR_NOTES = [
  "Os valores são estimativas indicativas de comunidade e variam por servidor, horário e competição de veias.",
  "1 DRACO = 100.000 Darksteel + taxa de processamento (~10%). O valor do DRACO muda com oferta e demanda.",
  "O modo AFK penaliza o ganho em ~20% (interrupções por PK, perda de veias, monstros).",
  "Em eventos de guerra e invasões, o Darksteel bônus pode multiplicar o ganho — priorize esses horários.",
  "Requisito mínimo de stock para craft de boxes de Darksteel: 500.000 Darksteel.",
];

/**
 * Guia de Subclasses & Skills
 * Árvores de habilidades recomendadas e builds avançadas por classe e cenário.
 */
export type SkillScenario = "pve" | "pvp" | "afk";

export interface SkillBuild {
  scenario: SkillScenario;
  label: string;
  focus: string;
  skills: string[];
  rotation: string;
  notes: string;
}

export interface ClassSkillsInfo {
  key: string;
  name: string;
  subclassTip: string;
  recommendedSubclasses: string[];
  skillsHighlight: { name: string; desc: string; tag: string }[];
  builds: SkillBuild[];
  advancedTips: string[];
  skillOrder: string[];
  orderNote: string;
}

export const CLASS_SKILLS: ClassSkillsInfo[] = [
  {
    key: "warrior",
    name: "Warrior",
    subclassTip: "Warriors de alto nível usam Arbalist como subclasse para levelar rápido (dano à distância no AFK) e Lancer para conteúdo PvP avançado.",
    recommendedSubclasses: ["Arbalist (leveling AFK)", "Lancer (PvP)", "Taoist (survivability)"],
    skillsHighlight: [
      { name: "Dragon Flame", desc: "Ultimate: ATK infundido com Chi Fire que arde no chão e dá boost de dano ao Warrior.", tag: "Ultimate" },
      { name: "Splitting Slash", desc: "Cancela skills inimigas — chave para abrir contra-ataques.", tag: "Dano" },
      { name: "Iron Shackle", desc: "Puxa inimigos na direção do Warrior com baixo custo.", tag: "CC" },
      { name: "Unbreakable Stance", desc: "AOE com boost imenso de ATK e evasão.", tag: "Buff" },
      { name: "Lion's Roar + Body Check", desc: "Sequência de knockdown e atordoamento para controlar elites.", tag: "CC" },
    ],
    builds: [
      {
        scenario: "pve",
        label: "PvE / Raids — Tanque de Frente",
        focus: "HP + DMG Reduction + AGGRO",
        skills: ["Barbaric Charge", "Berserk", "Void Slash", "Ground Smash", "Gale Slash", "Lion's Roar"],
        rotation: "Charge → Berserk → Void Slash → Ground Smash → Gale Slash → Lion's Roar (Bar 1 limpa mobs antes das elites)",
        notes: "Segunda barra com Crescent Strike → Body Check → Splitting Slash → Riposte para elites. Priorize HP e redução de dano.",
      },
      {
        scenario: "pvp",
        label: "PvP — Controlador de Área",
        focus: "PvP ATK + debuff Success + Resistência",
        skills: ["Riposte", "Iron Shackle", "Splitting Slash", "Unbreakable Stance", "Body Check", "Dragon Flame"],
        rotation: "Iron Shackle (puxa) → Body Check (KD) → Splitting Slash (corta skill) → Dragon Flame (ult)",
        notes: "Grifforse como spirit inicial; leve poções de HP em abundância — sua mobilidade é baixa e precisa cobrir com resistências.",
      },
      {
        scenario: "afk",
        label: "Farm AFK — Sobrevivência",
        focus: "EXP Boost + HP Regen",
        skills: ["Barbaric Charge", "Void Slash", "Gale Slash", "Lion's Roar", "Body Check", "Crescent Strike"],
        rotation: "Barra longa de mobs (Bar 1) em área PvE segura: Demon Bull Temple 1F ou Crystalline Forest",
        notes: "Espíritos de EXP (Khalion + Koiga). A alta defesa torna o Warrior o mais seguro de todas as classes para deixar AFK.",
      },
    ],
    advancedTips: [
      "Use Berserk logo antes do combo de mobs — o boost de ATK multiplica todos os hits da sequência.",
      "Riposte só funciona após sofrer um hit melee: baita o inimigo antes de usá-la.",
      "Em raids, a prioridade é manter aggro: Dragon Flame no início garante o boost para o grupo todo.",
    ],
    skillOrder: ["Barbaric Charge", "Berserk", "Splitting Slash", "Void Slash", "Lion's Roar", "Iron Shackle", "Unbreakable Stance", "Dragon Flame"],
    orderNote: "Maximize primeiro o CC e o boost (Barbaric Charge → Berserk), depois o dano AOE; deixe o ultimate Dragon Flame por último porque ele depende do grupo ativo.",
  },
  {
    key: "sorcerer",
    name: "Sorcerer",
    subclassTip: "Sorcerers alternam entre Lancer (burst físico) e Taoist (sustentação) como subclasse; Arbalist é forte para farm à distância.",
    recommendedSubclasses: ["Lancer (burst)", "Arbalist (farm AFK)", "Taoist (sustentação)"],
    skillsHighlight: [
      { name: "Dragon Tornado", desc: "Ultimate: tornado de fogo com dano AOE devastador.", tag: "Ultimate" },
      { name: "Frozen Block", desc: "Congela o corpo e o torna temporariamente imune; inimigos que atacam também congelam.", tag: "Defesa" },
      { name: "Chain Lightning", desc: "AOE em cadeia que eletrocuta o alvo e os ao redor.", tag: "AOE" },
      { name: "Dark Vortex", desc: "Abre um portal que puxa inimigos e direciona o arrasto.", tag: "CC" },
      { name: "Frost Orb + Flame Orb", desc: "Slow + burst elemental — a base de todo farming solo.", tag: "Dano" },
    ],
    builds: [
      {
        scenario: "pve",
        label: "PvE — AOE Controller",
        focus: "Spell ATK + CRIT DMG",
        skills: ["Frost Orb", "Flame Orb", "Flame Strike", "Frozen Block", "Blizzard", "Chain Lightning"],
        rotation: "Frost Orb (slow) → Flame Orb (burst) → Blizzard / Chain Lightning para finalizar mobs",
        notes: "Mantenha sempre distância: a Sorcerer é a classe mais frágil. Use Frozen Block como defesa de emergência.",
      },
      {
        scenario: "pvp",
        label: "PvP — Glass Cannon",
        focus: "PvP Magic ATK + CC Accuracy",
        skills: ["Dark Vortex", "Chain Lightning", "Frozen Block", "Flame Strike", "Dragon Tornado", "Frost Orb"],
        rotation: "Dark Vortex (puxa/isola) → Chain Lightning → Dragon Tornado (ult) → flee com Flame Strike",
        notes: "Contra inimigos de burst, Frozen Block + posicionamento decidem o duelo. Nunca lute de frente com Warrior/Lancer.",
      },
      {
        scenario: "afk",
        label: "Farm AFK — Clear Rápido",
        focus: "AOE + EXP Boost",
        skills: ["Frost Orb", "Flame Orb", "Blizzard", "Chain Lightning", "Flame Strike", "Dark Vortex"],
        rotation: "AOE contínuo em áreas densas: Crystalline Forest e Secret Peak baixo",
        notes: "Arbalist como subclasse para o AFK (dano à distância mais seguro). Espíritos com Lucky Drop para monetizar.",
      },
    ],
    advancedTips: [
      "Frost Orb antes de qualquer combo: o slow garante que todos os hits acertem.",
      "Dark Vortex pode puxar inimigos para dentro de AOE — posicione o portal entre o mob e sua Blizzard.",
      "Magic Shield drena rápido contra mobs físicos: alterne com Frozen Block para economizar mana.",
    ],
    skillOrder: ["Frost Orb", "Magic Shield", "Frozen Block", "Dark Vortex", "Blizzard", "Firewall", "Chain Lightning", "Magic Ultimate"],
    orderNote: "Maximize primeiro a defesa e o controle (Frost Orb → Shield), depois o burst AOE; o ultimate fica por último por depender de mana alta.",
  },
  {
    key: "taoist",
    name: "Taoist",
    subclassTip: "Taoists ganham Arbalist como subclasse para dano de farm e Warrior para conteúdo de grupo como tank secundário.",
    recommendedSubclasses: ["Arbalist (farm AFK)", "Warrior (grupo)", "Sorcerer (dano mágico)"],
    skillsHighlight: [
      { name: "Heal / Divine Light", desc: "Cura o caster e aliados próximos com luz divina — única classe com heal nativo.", tag: "Suporte" },
      { name: "Piercing Blades", desc: "Combate melee com potencial de dano surpresa.", tag: "Dano" },
      { name: "Crowd Control nativo", desc: "CC forte combinado com heal — excelente em party.", tag: "CC" },
    ],
    builds: [
      {
        scenario: "pve",
        label: "PvE / Raids — Suporte Principal",
        focus: "Support ATK + Healing Power",
        skills: ["Heal", "Divine Light", "CC nativo", "Piercing Blades", "Buff de party", "Ultimate de suporte"],
        rotation: "Mantenha heals ativos, alterne CC e buffs; use Piercing Blades entre ciclos de cura",
        notes: "Indispensável em raids: priorize heal para o tank antes de dano.",
      },
      {
        scenario: "pvp",
        label: "PvP — Sobrevivência Mágica",
        focus: "PvP DEF + CC Success",
        skills: ["Heal", "CC nativo", "Piercing Blades", "Defesa mágica", "Slow", "Ultimate"],
        rotation: "CC → Heal → kite → repetir; o duelo ganha por desgaste",
        notes: "Taoist é uma das classes mais difíceis de matar em PvP prolongado — force o desgaste.",
      },
      {
        scenario: "afk",
        label: "Farm AFK — Dano à Distância",
        focus: "EXP + Lucky Drop",
        skills: ["Skills ranged", "CC passivo", "Buff de EXP", "Heal passivo", "AOE leve", "Skill de mob único"],
        rotation: "Dano à distância contínuo em áreas PvE seguras",
        notes: "Arbalist como subclasse fecha o gap de dano do AFK e garante farm consistente.",
      },
    ],
    advancedTips: [
      "Em grupo, o valor do Taoist está no uptime de heal — aprenda o timing de dano dos bosses para pré-castar.",
      "CC combinado com heal torna o Taoist o melhor duelo de desgaste do jogo.",
      "Piercing Blades é o dano melee surpresa: use após um CC para maximizar hits.",
    ],
    skillOrder: ["Heal / Divine Light", "Soul Shield", "Burst Heal", "CC melees", "Piercing Blades", "Debuff mágico", "Ultimate de suporte"],
    orderNote: "Priorize sempre o kit de cura primeiro (Heal → Shield), depois o CC e só então o dano melee — a subclasse (Arbalist) resolve o DPS do AFK.",
  },
  {
    key: "lancer",
    name: "Lancer",
    subclassTip: "Lancers são o DPS burst físico do jogo; usam Sorcerer para dano à distância e Arbalist para AFK consistente.",
    recommendedSubclasses: ["Sorcerer (burst mágico)", "Arbalist (AFK)", "Warrior (tank)"],
    skillsHighlight: [
      { name: "Ravaging Blow", desc: "Skill azul de debuff — reduz defesa e amplifica o combo.", tag: "Debuff" },
      { name: "Ascending Dragon", desc: "Skill azul de debuff — knockback com janela de combo.", tag: "Debuff" },
      { name: "Double Strike", desc: "Skill verde de dano extra — base do DPS sustentado.", tag: "Dano" },
      { name: "Crescent Blade", desc: "Skill verde de dano extra — bom em mobs alinhados.", tag: "Dano" },
    ],
    builds: [
      {
        scenario: "pve",
        label: "PvE — Burst Físico",
        focus: "ATK + CRIT Rate",
        skills: ["Ravaging Blow", "Ascending Dragon", "Double Strike", "Crescent Blade", "Ultimate físico", "Mob AOE"],
        rotation: "Azul (debuff) → Verde (dano): Ravaging Blow + Ascending Dragon → Double Strike + Crescent Blade",
        notes: "A regra do Lancer: sempre abra com skills azuis de debuff antes das verdes de dano.",
      },
      {
        scenario: "pvp",
        label: "PvP — Assassino de Squishies",
        focus: "PvP ATK + Penetration",
        skills: ["Ravaging Blow", "Ascending Dragon", "Double Strike", "Dash / mobilidade", "Ultimate", "CC"],
        rotation: "Debuff azul → burst verde → ultimate no alvo isolado; recue após o combo",
        notes: "Lancer brilha contra Sorcerer/Arbalist: feche a distância com o debuff aplicado.",
      },
      {
        scenario: "afk",
        label: "Farm AFK — DPS Sustentado",
        focus: "ATK + EXP",
        skills: ["Double Strike", "Crescent Blade", "Mob AOE", "Skill de dano contínuo", "CC passivo", "Buff"],
        rotation: "Skills verdes de dano extra em loop em áreas densas",
        notes: "Menos DPS total que o Arbalist em AFK longo, mas melhor contra mobs resistentes.",
      },
    ],
    advancedTips: [
      "A ordem azul → verde é fixa: sem debuff aplicado, as skills verdes perdem parte do valor.",
      "Lancer é o melhor DPS físico de burst do jogo — priorize CRIT Rate sobre CRIT DMG no early.",
      "Em raids, alterne com o Warrior no tank: Lancer segura aggro temporária com os debuffs.",
    ],
    skillOrder: ["Ravaging Blow", "Ascending Dragon", "Double Strike", "Piercing Slash", "Burst físico", "Grito/CC", "Ultimate de burst"],
    orderNote: "Regra fixa do Lancer: skills azuis (debuff) primeiro, verdes (dano) depois — o DPS inteiro depende dessa ordem.",
  },
  {
    key: "arbalist",
    name: "Arbalist",
    subclassTip: "A Arbalist é a melhor subclasse para iniciantes e para levelar: dano à distância consistente em qualquer scenario AFK.",
    recommendedSubclasses: ["Arbalist (default para levelar)", "Sorcerer (burst)", "Lancer (dano físico)"],
    skillsHighlight: [
      { name: "Arrow Rain", desc: "Ultimate: barragem de flechas em área que enfraquece os atingidos.", tag: "Ultimate" },
      { name: "Cloaking", desc: "Fica invisível — ataques da invisibilidade têm dano bonus.", tag: "Mobilidade" },
      { name: "Illusion Arrow", desc: "Teleporte + ataque rápido.", tag: "Mobilidade" },
      { name: "Burst Shell", desc: "Movimento rápido com dano de escape ou engajamento.", tag: "Mobilidade" },
      { name: "Flash Arrow", desc: "Stun que dá janela de contra-ataque para aliados.", tag: "CC" },
    ],
    builds: [
      {
        scenario: "pve",
        label: "PvE — Sniper de Alvo Único",
        focus: "CRIT DMG + ATK",
        skills: ["Arrow Rain", "Cloaking", "Illusion Arrow", "Burst Shell", "Flash Arrow", "Skill de alvo único"],
        rotation: "Cloaking (invisível) → hits bonus → Flash Arrow (stun) → Arrow Rain no grupo",
        notes: "O dano crítico melhora focando um alvo por vez; alinhe mobs em fila para piercing.",
      },
      {
        scenario: "pvp",
        label: "PvP — All Attack Kiter",
        focus: "All ATK + CRIT Rate + Distância",
        skills: ["Illusion Arrow", "Burst Shell", "Flash Arrow", "Skill ranged DPS", "Defesa passiva", "Ultimate"],
        rotation: "Kite constante: hit → Illusion Arrow → reposiciona → repete; nunca fique parado",
        notes: "Build All Attack performa melhor em PvP do que CRIT DMG (mob farm favorece crit).",
      },
      {
        scenario: "afk",
        label: "Farm AFK — A Escolha Padrão",
        focus: "EXP + Lucky Drop",
        skills: ["Skill ranged DPS", "AOE leve", "Dano contínuo", "Buff de EXP", "Skill de alvo único", "Passiva de crit"],
        rotation: "AFK em qualquer área PvE: a Arbalist é a subclasse mais usada para levelar",
        notes: "Warriors, Lancers e Taoists de alto nível usam Arbalist como subclasse justamente pelo AFK consistente.",
      },
    ],
    advancedTips: [
      "Alinhe mobs em fila: os tiros de Arbalist pierce e atingem alvos atrás do primeiro.",
      "Cloaking + Flash Arrow é o combo de segurança: invisibilidade para escapar e stun para contra-atacar.",
      "No PvP, mobilidade é tudo: domine Illusion Arrow e Burst Shell para reposicionar entre trocas.",
    ],
    skillOrder: ["Skill ranged DPS", "Flash Arrow", "Burst Shell", "Illusion Arrow", "Cloaking", "AOE leve", "Arrow Rain"],
    orderNote: "Maximize primeiro o DPS contínuo à distância, depois o CC (Flash Arrow) e por fim a mobilidade e o ultimate — o AFK depende do dano sustentado.",
  },
  {
    key: "darkist",
    name: "Darkist",
    subclassTip: "A Darkist usa Sorcerer como subclasse para burst mágico adicional e Taoist para sustentação em grupo; é a especialista em dano contínuo de veneno.",
    recommendedSubclasses: ["Sorcerer (burst mágico)", "Taoist (sustentação)", "Arbalist (AFK seguro)"],
    skillsHighlight: [
      { name: "Asura (Ultimate)", desc: "Transformação em Asura: grande aumento de Skill ATK e aterroriza monstros próximos (redução de velocidade).", tag: "Ultimate" },
      { name: "Blood Chain", desc: "Correntes de sangue que atacam múltiplos inimigos e recuperam HP.", tag: "Sustain" },
      { name: "Poison Curse", desc: "Veneno e maldições em área que corroem HP e enfraquecem defesas.", tag: "Debuff" },
      { name: "Forbidden Arts", desc: "Magias proibidas de dano contínuo alto.", tag: "Dano" },
    ],
    builds: [
      {
        scenario: "pve",
        label: "PvE — Corrosão e Sustain",
        focus: "Skill ATK + dano contínuo",
        skills: ["Poison Curse", "Blood Chain", "Forbidden Arts", "Asura", "AOE passivo", "Buff mágico"],
        rotation: "Maldições em área → Blood Chain para sustentar HP → Forbidden Arts durante debuff",
        notes: "Mantenha os venenos ativos antes de gastar dano alto: o DPS contínuo multiplica o resultado.",
      },
      {
        scenario: "pvp",
        label: "PvP — Corruptora à Distância",
        focus: "Debuff Success + CRIT DMG",
        skills: ["Poison Curse", "Blood Chain", "Slow de Asura", "Forbidden Arts", "Defesa passiva", "Asura (ult)"],
        rotation: "Aplique maldições → kite com Blood Chain → Asura nas janelas decisivas",
        notes: "Contra melee, mantenha distância e use o slow do Asura para controlar engajamentos.",
      },
      {
        scenario: "afk",
        label: "Farm AFK — Corrosão em Área",
        focus: "AOE contínuo + EXP",
        skills: ["Poison Curse", "Blood Chain", "Forbidden Arts", "AOE passivo", "Buff de EXP", "Dano contínuo"],
        rotation: "Veneno + corrente de sangue em loop auto-sustentado em mobs densos",
        notes: "Forte no AFK contra grupos densos pelo dano contínuo em área; Khalion/Koiga de EXP aceleram.",
      },
    ],
    advancedTips: [
      "Entre em Asura só nas janelas decisivas: o boost de ATK é maior com os debuffs já ativos.",
      "Blood Chain é seu sustain — use-a para se curar entre trocas sem gastar poções.",
      "O slow do Asura funciona como escape: aterrorize, recue e finalize com Forbidden Arts.",
    ],
    skillOrder: ["Poison Curse", "Blood Chain", "Forbidden Arts", "Slow passivo", "AOE mágico", "Buff mágico", "Asura"],
    orderNote: "Maximize primeiro o dano contínuo (veneno/maldição), depois o sustain (Blood Chain) e deixe o Asura por último — o ultimate depende do dano base alto.",
  },
  {
    key: "lionheart",
    name: "Lionheart",
    subclassTip: "O Lionheart usa Warrior como subclasse para tanquear em grupo, Taoist para sustentação e Arbalist para o AFK consistente.",
    recommendedSubclasses: ["Warrior (tanque de grupo)", "Taoist (sustentação)", "Arbalist (AFK)"],
    skillsHighlight: [
      { name: "Lion's Impact (Ultimate)", desc: "Investida massiva que derruba formações inimigas com dano físico brutal.", tag: "Ultimate" },
      { name: "Raging Charge", desc: "Avança em linha reta derrubando e amassando inimigos.", tag: "Mobilidade" },
      { name: "Roaring Fist", desc: "Combo de soqueiras com alta chance de stun.", tag: "Dano" },
      { name: "Battle Cry / War Heal", desc: "Buff de grupo e cura de aliados.", tag: "Suporte" },
      { name: "Tear Down / Guard Break", desc: "Debuffs que reduzem DEF e ATK inimigos.", tag: "Debuff" },
    ],
    builds: [
      {
        scenario: "pve",
        label: "PvE — Quebrador de Formações",
        focus: "ATK físico + Bash ATK",
        skills: ["Raging Charge", "Roaring Fist", "Guard Break", "War Heal", "AOE melee", "Lion's Impact"],
        rotation: "Raging Charge (engajamento) → Roaring Fist → Guard Break → Lion's Impact no grupo",
        notes: "War Heal dá autonomia ao grupo sem depender de Taoist nas raids.",
      },
      {
        scenario: "pvp",
        label: "PvP / Sabuk — Abre-Linhas",
        focus: "Bash ATK + knockdown/stun Success",
        skills: ["Raging Charge", "Lion's Impact", "Battle Cry", "Roaring Fist", "Guard Break", "CC de grupo"],
        rotation: "Raging Charge quebra a linha → Lion's Impact no amontoado → Battle Cry para o time",
        notes: "Em Sabuk, o Lionheart é quem abre caminho para o time — use as cargas no timing certo.",
      },
      {
        scenario: "afk",
        label: "Farm AFK — Mobs Densos",
        focus: "ATK + EXP",
        skills: ["Roaring Fist", "Raging Charge", "AOE melee", "Buff de EXP", "Skill de dano contínuo", "CC passivo"],
        rotation: "Roaring Fist + Raging Charge em loop em áreas densas",
        notes: "Bom em AFK com mobs aglomerados; Khalion/Koiga de EXP para levelamento.",
      },
    ],
    advancedTips: [
      "O timing das cargas é tudo: uma Raging Charge mal posicionada expõe você ao foco do time inimigo.",
      "Battle Cry no início da troca dá o buff que multiplica o dano do seu grupo inteiro.",
      "Em raids, alterne dano e suporte: não fique só na frente — War Heal também é valioso atrás.",
    ],
    skillOrder: ["Raging Charge", "Roaring Fist", "Guard Break", "Battle Cry", "War Heal", "AOE melee", "Lion's Impact"],
    orderNote: "Maximize primeiro o kit de engajamento (cargas e soqueiras), depois o suporte (Battle Cry/War Heal) e o ultimate por último — o Lion's Impact depende de mobs agrupados.",
  },
  {
    key: "spiritsummoner",
    name: "Spirit Summoner",
    subclassTip: "A Spirit Summoner usa Sorcerer como subclasse para burst mágico adicional e Taoist para sustentação; suas invocações fazem o trabalho pesado.",
    recommendedSubclasses: ["Sorcerer (burst mágico)", "Taoist (sustentação)", "Warrior (proteção)"],
    skillsHighlight: [
      { name: "Spirit Cascade (Ultimate)", desc: "Libera os espíritos dominados: dano mágico massivo em área.", tag: "Ultimate" },
      { name: "Spirit Control", desc: "Comanda espíritos para atacar à distância enquanto se mantém protegida.", tag: "Invocação" },
      { name: "Spirit Shield", desc: "Espírito guardião absorve parte do dano recebido.", tag: "Defesa" },
      { name: "Elemental Binding", desc: "Espíritos elementais prendem e desaceleram inimigos.", tag: "CC" },
      { name: "Wand Arts", desc: "Golpes mágicos com a vara, alternando single-target e leques em área.", tag: "Dano" },
    ],
    builds: [
      {
        scenario: "pve",
        label: "PvE — Mestra dos Espíritos",
        focus: "Skill ATK + duração de invocação",
        skills: ["Spirit Control", "Wand Arts", "Elemental Binding", "Spirit Cascade", "AOE mágico", "Buff de spirits"],
        rotation: "Spirit Control mantém espíritos atacando → Wand Arts finaliza → Spirit Cascade no grupo",
        notes: "Mantenha espíritos ativos o tempo todo: eles são seu dano e sua proteção.",
      },
      {
        scenario: "pvp",
        label: "PvP — Controladora Recuada",
        focus: "CRIT DMG + controle (bind/slow)",
        skills: ["Elemental Binding", "Spirit Shield", "Wand Arts", "Spirit Cascade", "CC passivo", "Skill ranged"],
        rotation: "Elemental Binding (prende) → Spirit Cascade → kite; Spirit Shield quando focada",
        notes: "Posicione-se atrás dos aliados e deixe os espíritos fazerem o trabalho — você é frágil de perto.",
      },
      {
        scenario: "afk",
        label: "Farm AFK — Auto-Ataque Espiritual",
        focus: "EXP + dano contínuo",
        skills: ["Spirit Control", "Wand Arts", "AOE leve", "Buff de EXP", "Dano contínuo", "CC passivo"],
        rotation: "Spirit Control + Wand Arts rodam quase sozinhos em áreas PvE seguras",
        notes: "Os espíritos atacam enquanto você se move: excelente consistência de farm no AFK.",
      },
    ],
    advancedTips: [
      "Combine o bind antes do Spirit Cascade: inimigos presos não fogem do AoE.",
      "Spirit Shield é sua sobrevivência — ative antes de recuar, não depois de levar o burst.",
      "Em grupo, posicione-se no fundo: o damage passivo dos espíritos não precisa de proximidade.",
    ],
    skillOrder: ["Spirit Control", "Wand Arts", "Elemental Binding", "Spirit Shield", "AOE mágico", "Buff de spirits", "Spirit Cascade"],
    orderNote: "Maximize primeiro a invocação sustentada (Spirit Control + Wand Arts), depois o controle (bind) e a defesa (Shield); o Spirit Cascade fecha a árvore por depender de spirits fortes.",
  },
];

/**
 * Builds especializadas do Darkist: Sustain vs. Burst.
 * O Darkist pode focar em sustentação (Blood Chain + veneno em área) ou em
 * burst puro (Asura + Forbidden Arts) conforme o papel no grupo.
 */
export const DARKIST_SPECIAL_BUILDS = [
  {
    key: "sustain",
    label: "Sustain — Correntes de Sangue",
    style: "Tanque mágico de segunda linha",
    icon: "🩸",
    focus: ["Max HP", "HP Recovery", "Skill ATK", "Veneno em área"],
    skills: ["Blood Chain", "Poison Curse", "Slow passivo", "Defesa mágica", "AOE contínuo", "Asura (escape)"],
    rotation: "Blood Chain no cooldown (curar) → veneno sempre ativo → Asura só para escapar",
    desc: "Build para quem joga de segunda linha em raids e Sabuk: as correntes de sangue curam continuamente e os venenos mantêm o DPS mesmo sem gastar cooldowns. O Asura vira ferramenta de escape, não de burst.",
    gear: "Set com HP Recovery e MP Recovery; pedras focadas em Max HP + Skill ATK",
    bestFor: "Raids longas, farm AFK e Sabuk Wars como suporte de dano",
  },
  {
    key: "burst",
    label: "Burst — Transformação Asura",
    style: "DPS mágico de janela",
    icon: "🔥",
    focus: ["Skill ATK", "CRIT DMG", "Debuff Success", "CD reduction"],
    skills: ["Poison Curse", "Forbidden Arts", "Asura (Ultimate)", "Blood Chain", "Debuffs de área", "Slow"],
    rotation: "Aplicar todos os debuffs → ativar Asura na janela decisiva → Forbidden Arts até o boost acabar",
    desc: "Build de janela de burst: acumula todos os debuffs primeiro e só então transforma em Asura, multiplicando o dano das magias proibidas. Requer gerenciamento rigoroso de cooldowns e posicionamento recuado.",
    gear: "Set com Skill ATK e CRIT; pedras focadas em Skill DMG + Debuff Success",
    bestFor: "PvP 1×1, raids de dano e foco em boss com grupo de suporte",
  },
];

/**
 * Espíritos elementais da Spirit Summoner: qual elemento usar em cada situação.
 */
export const SUMMONER_ELEMENTALS = [
  { element: "Água", icon: "🌊", spirit: "Invocador aquático", effect: "Slow e redução de velocidade de ataque; controle de zona", bestFor: "Kiting em PvP e mobs rápidos" },
  { element: "Fogo", icon: "🔥", spirit: "Invocador flamejante", effect: "Dano contínuo em área e debuff de queimadura", bestFor: "Mobs densos e farm AFK" },
  { element: "Vento", icon: "🌬️", spirit: "Invocador do vento", effect: "Empurrão (knockback) e chance de desviar de ataques", bestFor: "Defesa pessoal e recuo em PvP" },
  { element: "Terra", icon: "⛰️", spirit: "Invocador telúrico", effect: "Prisão (root) e escudo de pedra; redução de dano físico", bestFor: "Tanquear em grupo e raids" },
];

/** Tabela de referência de subclasse recomendada por situação. */
export const SUBCLASS_TIPS = {
  intro:
    "A subclasse no MIR4 permite trocar de estilo de combate sem perder o progresso da classe principal. A escolha da subclasse muda completamente o AFK, o PvP e o burst — trate-a como uma segunda build.",
  rules: [
    "Leveling rápido: Arbalist é a subclasse padrão para quase todas as classes principais.",
    "PvP de elite: Warriors e Lancers ganham trocando para subclasse de burst ou de debuff conforme o meta.",
    "Sustentação: Taoist como subclasse cobre o gap de cura de qualquer DPS.",
    "A subclasse não transfere equipamentos — o set precisa ser mantido para os dois estilos.",
  ],
};

/**
 * Equipamentos & Geminação (Enhancement)
 * Sistema de fortalecimento de equipamentos: Darksteel + Copper por estágio,
 * custos crescentes, stats por tipo de slot e materiais de grau (Dragonsteel etc.).
 * Valores indicativos de comunidade (2022–2026), podem variar por patch.
 */
export interface EquipmentType {
  key: string;
  slot: string; // slot do equipamento
  examples: string[]; // exemplos de itens
  statPerLevel: string; // stat principal ganho por nível de enhancement
  statSecondary: string; // stats secundários
  enhCostBase: number; // Darksteel base por estágio inicial
}
export const EQUIPMENT_TYPES: EquipmentType[] = [
  { key: "weapon", slot: "Arma (primária e secundária)", examples: ["Espadas", "Cajados", "Bestas", "Lanças", "Chamas"], statPerLevel: "ATK físico/mágico por estágio — armas lentas ganham mais ATK por nível", statSecondary: "CRIT (chance de crítico) em níveis avançados", enhCostBase: 5000 },
  { key: "armor", slot: "Armadura", examples: ["Peitoral", "Manto"], statPerLevel: "DEF física/mágica + Max HP por estágio", statSecondary: "DMG Reduction em níveis altos", enhCostBase: 4000 },
  { key: "helm", slot: "Elmo", examples: ["Capuz", "Capacete", "Viseira"], statPerLevel: "Max HP + DEF por estágio", statSecondary: "RESIST a debuffs (Stun, Silence) em níveis avançados", enhCostBase: 3500 },
  { key: "gloves", slot: "Luvas", examples: ["Manoplas", "Braceletes de combate"], statPerLevel: "ATK + HIT (precisão) por estágio", statSecondary: "CRIT Rate em níveis altos", enhCostBase: 3000 },
  { key: "pants", slot: "Calças", examples: ["Calça de couro", "Greivas"], statPerLevel: "Max HP + DEF por estágio", statSecondary: "DMG Reduction física", enhCostBase: 3000 },
  { key: "boots", slot: "Botas", examples: ["Botas", "Sandálias reforçadas"], statPerLevel: "Max HP + EVA (evasão) por estágio", statSecondary: "Mobilidade e resistência a knockdown", enhCostBase: 2500 },
  { key: "necklace", slot: "Colar", examples: ["Amuletos", "Colares de jade"], statPerLevel: "ATK% e Max HP por estágio", statSecondary: "RESIST elemental", enhCostBase: 3000 },
  { key: "rings", slot: "Anéis (2 slots)", examples: ["Anel de ferro", "Anel selado"], statPerLevel: "CRIT + ATK físico/mágico por estágio", statSecondary: "Skill CD Reduction em níveis avançados", enhCostBase: 3000 },
  { key: "bracelet", slot: "Pulseira", examples: ["Pulseira de runas"], statPerLevel: "Max HP + CRIT EVA por estágio", statSecondary: "Poção MP/HP +", enhCostBase: 2500 },
  { key: "dragon-artifact", slot: "Dragon Artifact (5 tipos)", examples: ["Ornate Blade", "Heavenly Bell", "Incense Burner", "Crescent Jade", "Bronze Mirror"], statPerLevel: "Stats grandes por estágio (ATK DMG Boost, PvP DMG Reduction, DEF, HP)", statSecondary: "Categorias Black/White Dragon chegam a +15 de enhance", enhCostBase: 250000 },
];

/** Custo de enhancement por estágio (Darksteel + Copper), referência indicativa. */
export interface EnhanceStageCost {
  stage: number;
  darksteel: number;
  copper: number;
  failRisk: string; // risco de falha
}
export const ENHANCE_COSTS: EnhanceStageCost[] = [
  { stage: 1, darksteel: 5000, copper: 100000, failRisk: "Baixo — falha custa apenas o material" },
  { stage: 2, darksteel: 7500, copper: 150000, failRisk: "Baixo" },
  { stage: 3, darksteel: 10000, copper: 200000, failRisk: "Moderado" },
  { stage: 4, darksteel: 15000, copper: 300000, failRisk: "Moderado" },
  { stage: 5, darksteel: 25000, copper: 500000, failRisk: "Alto — equipamentos antigos podiam ser destruídos" },
  { stage: 6, darksteel: 50000, copper: 1000000, failRisk: "Alto" },
  { stage: 7, darksteel: 100000, copper: 2000000, failRisk: "Muito alto — Dragon Artifacts Rare/Epic destroem ao falhar" },
  { stage: 8, darksteel: 200000, copper: 4000000, failRisk: "Extremo" },
  { stage: 9, darksteel: 400000, copper: 8000000, failRisk: "Extremo" },
  { stage: 10, darksteel: 800000, copper: 16000000, failRisk: "Máximo — requer itens de proteção" },
];

/** Materiais por grau de equipamento e uso de Darksteel/Jade/Dragonsteel. */
export interface GradeInfo {
  key: string;
  name: string;
  color: string;
  darksteelCraft: string; // Darksteel para craft
  jade: string; // uso de Jade / Eternal
  dragonsteel: string; // uso de Dragonsteel
  maxEnhance: string;
  note: string;
}
export const GRADE_INFO: GradeInfo[] = [
  { key: "uc", name: "Incomum (UC)", color: "text-slate-300", darksteelCraft: "Apenas Copper + drops básicos", jade: "Não usa", dragonsteel: "Não usa", maxEnhance: "Até +5", note: "Gratuito no início; substitua o quanto antes." },
  { key: "raro", name: "Raro (Azul)", color: "text-blue-400", darksteelCraft: "~250.000 Darksteel (Dragon Artifact raro)", jade: "Eternal Coldsteel/Jade x10 no craft", dragonsteel: "25 Dragonsteel por Dragon Artifact", maxEnhance: "Até +7 (Rare Dragon Artifact)", note: "Primeira meta realista de farm — craft via ferreiro com materiais de dragão raros." },
  { key: "epico", name: "Épico (Roxo)", color: "text-violet-400", darksteelCraft: "~2.500.000 Darksteel (Dragon Artifact épico)", jade: "Eternal x30 no craft; Eternal crafted consome Darksteel + 5 Dragonsteel", dragonsteel: "250 Dragonsteel por Dragon Artifact", maxEnhance: "Até +10 (Black/White Dragon)", note: "Requer grind constante; combine Clan Expedition + Magic Square fissurado." },
  { key: "lendario", name: "Lendário (Dourado)", color: "text-amber-400", darksteelCraft: "~25.000.000 Darksteel (Dragon Artifact lendário)", jade: "Eternal Lendário x50 (crafted com 25 Dragonsteel cada)", dragonsteel: "2.500 Dragonsteel por Dragon Artifact", maxEnhance: "Até +10 (Dragon Artifact) / +15 (Black/White Dragon)", note: "Topo do conteúdo atual; Black/White Dragon não são destruídos ao falhar o enhance." },
  { key: "mitico", name: "Mítico (Vermelho)", color: "text-red-400", darksteelCraft: "Chaotic Enhancement Stones (100 Dragonsteel cada)", jade: "Radiant Spacetime Powder + enhancement stones lendários", dragonsteel: "Divine Dragon's Soul + centenas de Dragonsteel", maxEnhance: "Depende do patch (15+)", note: "Despertar de lendário exige Divine Dragon's Soul (pity: 5 falhas = 1 alma garantida)." },
];

/** Regras e dicas de geminação/enhancement. */
export const GEMMING_TIPS = [
  "O enhancement gasta Darksteel + Copper por estágio e o custo cresce exponencialmente — planeje antes de tentar +7.",
  "Em equipamentos antigos, falha no +5 ou +6 podia destruir o item; use os itens de proteção (Safe Enhancement) sempre que disponíveis.",
  "Dragon Artifacts Rare e Epic são destruídos ao falhar no enhance; Black/White Dragon apenas perdem 1–3 níveis — prefira herdá-los.",
  "O enhance NÃO transfere automaticamente ao trocar de grau: use Inheritance (Rare→Raro mesmo grau) antes de evoluir o equipamento.",
  "Priorize os slots: Arma > Armadura > Colar > Anéis > demais. O ATK da arma multiplica todo o dano.",
  "Dragonsteel não é negociável — acumule pelas vias diárias: Clan Expedition, Magic Square fissurado e Secret Peak.",
  "Guarde Glittering Powder e Life Essence para craftar Eternals: eles escalam o grau do equipamento antes do enhance caro.",
  "A ordem ideal: craft do grau alvo → enhance gradual → Pressure Points (6 pontos, cada refresh consome Dragonsteel).",
];

/** Chave da página de equipamentos para comentários. */
export const EQUIPMENT_PAGE_KEY = "gear" as const;

/**
 * Preços de mercado estimados dos materiais de fortalecimento, em Gold.
 * Valores indicativos de comunidade (2022–2026) — o mercado do MIR4 flutua
 * por servidor e patch; os jogadores ajustam na calculadora conforme a cotação local.
 * Base: 1 Darksteel ≈ 1.000 Gold, 10.000 Copper ≈ 1 Gold, 1 Jade ≈ 40.000 Gold,
 * 1 Dragonsteel ≈ 25.000 Gold (não negociável — estimado pelo custo de oportunidade).
 */
export interface MaterialGoldPrice {
  key: string;
  name: string;
  /** Preço em Gold de 1 unidade do material (0 = não negociável/irrelevante). */
  goldPerUnit: number;
  note: string;
}
export const MATERIAL_GOLD_PRICES: MaterialGoldPrice[] = [
  { key: "darksteel", name: "Darksteel", goldPerUnit: 1000, note: "Negociável no Mercado — base de referência da calculadora" },
  { key: "copper", name: "Copper", goldPerUnit: 0.0001, note: "≈ 10.000 Copper por 1 Gold; custo marginal desprezível" },
  { key: "jade", name: "Jade (Eternal)", goldPerUnit: 40000, note: "Custado via Eternal crafted (Darksteel + Dragonsteel) — 1 por tentativa" },
  { key: "dragonsteel", name: "Dragonsteel", goldPerUnit: 25000, note: "Não negociável — custo estimado de oportunidade (≈ 2.500 Dragonsteel × 25.000 Gold por Dragon Artifact lendário)" },
];
export const MATERIAL_GOLD_PRICES_NOTE =
  "Preços indicativos de comunidade (2022–2026): o mercado do MIR4 flutua por servidor, fuso e patch. Ajuste o valor do Darksteel na calculadora conforme a cotação do seu Mercado — os totais em Gold são recalculados na hora.";

/** Materiais e crafting: fontes de farm por material. */
export interface MaterialInfo {
  key: string;
  name: string;
  tier: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";
  tierColor: string;
  bind: boolean;
  sources: string[];
  usedFor: string[];
  tip: string;
}
export const MATERIALS: MaterialInfo[] = [
  { key: "darksteel", name: "Darksteel (Aço Escuro)", tier: "Common", tierColor: "text-slate-300", bind: false,
    sources: ["Mineração ativa em spots de Darksteel (Darksteel Field)", "AFK Mining nos mapas de mineração (rendimento −20% no AFK)", "Mercado: compre com Gold ou venda itens no Exchange", "Venda de Energy Box (Red Energy crafting) no Mercado"],
    usedFor: ["Enhancement de equipamentos (o custo cresce por estágio)", "Craft do Dragon Artifact de cada grau", "Craft do token DRACO (100.000 Darksteel + ~10% de taxa)", "Craft de Dragonsteel Seal nos estágios iniciais"],
    tip: "Prefira farmar de madrugada ou em horários de pico baixo; clãs e zonas seguras reduzem o risco de roubo de spot." },
  { key: "copper", name: "Copper (Cobre)", tier: "Common", tierColor: "text-slate-300", bind: false,
    sources: ["Farm passivo de mobs em qualquer área", "Missions diárias e recompensas de AFK", "Mercado e Exchange"],
    usedFor: ["Custos de enhancement junto com Darksteel", "Crafts básicos e trocas de NPC"],
    tip: "Nunca é gargalo no early game — deixe acumular naturalmente durante o farm de outros recursos." },
  { key: "glittering", name: "Glittering Powder (Pó Brilhante)", tier: "Rare", tierColor: "text-blue-400", bind: false,
    sources: ["AFK mining em áreas de Glittering (minérios especiais)", "AFK Field de mobs em zonas de recurso raro", "Eventos sazonais e caixas de evento"],
    usedFor: ["Craft de Eternal Coldsteel/Eternals intermediários", "Upgrade de grau de equipamento pré-Dragon Artifact"],
    tip: "Minere Glittering quando ainda não tiver selo para Dragonsteel — é a ponte do farm intermediário." },
  { key: "jade", name: "Jade Seal / Eternal Coldsteel", tier: "Rare", tierColor: "text-blue-400", bind: true,
    sources: ["Craft no ferreiro: ~10 Eternal Coldsteel/Jade por Dragon Artifact raro", "Darksteel Seal Stage 2 (multiplicador de mineração 1,25×) habilita as áreas intermediárias"],
    usedFor: ["Promoção do selo Darksteel → Jade Seal", "Multiplicador de mineração 1,55× no Jade Seal", "Craft de Dragon Artifacts de grau superior"],
    tip: "O gargalo é o Darksteel necessário para o craft — use a Calculadora do site para estimar o tempo." },
  { key: "dragonsteel", name: "Dragonsteel", tier: "Epic", tierColor: "text-violet-400", bind: true,
    sources: ["NÃO é negociável no Mercado/DRACO — só vias internas", "Clan Expedition (recompensas diárias do clã)", "Fissured Magic Square (Magic Square fissurado)", "Secret Peak (assentamentos diários)", "Troca HYDRA (boss): 1 HYDRA = 10 Dragonsteel", "Lojas de eventos rotativos"],
    usedFor: ["Pressure Points (6 pontos + refreshes de Aspiration)", "Craft de Chaotic Enhancement Stone (100 por pedra)", "Equipment Awakening (despertar lendário→mítico)", "Eternals crafted (25 por unidade)", "Cada Dragon Artifact custa 25–2.500 conforme o grau"],
    tip: "Trate como rotina diária fixa: Expedition + Magic Square fissurado + Secret Peak todos os dias. Acumulação contínua vence farm intensivo." },
  { key: "dragon-materials", name: "Dragon Materials (Scale, Claw, Leather, Eye, Horn, Sphere)", tier: "Epic", tierColor: "text-violet-400", bind: true,
    sources: ["AFK de monstros épicos em zonas de boss", "Hell Raid floors altos", "Clan Expeditions e caixas de Legendary Dragon Material", "Mana Dismantling de itens épicos+"],
    usedFor: ["Pressure Points (cada ponto exige um material específico)", "Invoke: 3 Legendary Dragon Materials → Divine Dragon's Soul", "Divine Dragon's Keys substituem qualquer material (Mana Dismantling + Shop)"],
    tip: "Dragon Eye e Dragon Sphere têm drop mais baixo — reserve as Divine Dragon's Keys para os pontos mais difíceis." },
  { key: "divine-soul", name: "Divine Dragon's Soul", tier: "Legendary", tierColor: "text-amber-400", bind: true,
    sources: ["Invoke no Martial World Master (Spiritual Center): 3 Legendary Dragon Materials por tentativa", "Pity: 5 Divine Dragon's Promise Points (1 por falha) = 1 Soul garantido"],
    usedFor: ["Despertar equipamento Lendário → Mítico (única via)"],
    tip: "Pior caso = 15 materiais lendários por Soul; os Promise Points acumulam para a próxima tentativa." },
  { key: "fragments", name: "Divine Dragon's Fragments", tier: "Epic", tierColor: "text-violet-400", bind: false,
    sources: ["Desmontar (dismantle) equipamentos épicos+", "Ancient Boxes de grau Épico ou superior", "Clan Expeditions", "Hell Raid Floor 11"],
    usedFor: ["Craft Stone of Manifest Ability (300 fragmentos por craft)", "Re-randomização do efeito único de equipamento mítico"],
    tip: "Fonte dispersa porém estável — desmonte tudo que não usa em vez de vender." },
  { key: "mana-beads", name: "Epic Mana Beads", tier: "Epic", tierColor: "text-violet-400", bind: false,
    sources: ["Mana Dismantling (desmontagem mágica de itens)"],
    usedFor: ["Trocas estáveis: Blue Dragon Statues, Blessed Mystical Piece Boxes", "Shop de recursos épicos"],
    tip: "Uma das saídas épicos mais consistentes do jogo — mantenha o hábito do Mana Dismantling diário." },
  { key: "chaotic-stone", name: "Chaotic Enhancement Stone", tier: "Mythic", tierColor: "text-red-400", bind: true,
    sources: ["Craft: 5 Legendary Mystic Enhancement Stones + 5 Legendary Darkened Enhancement Stones + 1 Radiant Spacetime Powder + 1 Legendary Divine Dragon's Enhancement Stone + 100 Dragonsteel"],
    usedFor: ["Enhancement de equipamentos míticos"],
    tip: "Ciclo típico de 2 semanas a 1 mês: garanta Radiant Spacetime Powder via raids de alta dificuldade antes de iniciar." },
  { key: "radiant-powder", name: "Radiant Spacetime Powder", tier: "Mythic", tierColor: "text-red-400", bind: false,
    sources: ["Primeira vitória em raids/dungeons de alta dificuldade da temporada", "Recompensas sazonais"],
    usedFor: ["Ingrediente do Chaotic Enhancement Stone"],
    tip: "Verifique o estoque ANTES de começar o craft — é o ingrediente mais escasso da receita." },
];
/** Chave da página de materiais para comentários e favoritos. */
export const MATERIALS_PAGE_KEY = "materials" as const;

/** Regiões de servidor para ajuste de fuso no calendário.
 *  Os horários do jogo são expressos no fuso do SERVIDOR da região; offset indica a
 *  diferença em horas entre o fuso do servidor e o horário-local de referência da região. */
export interface ServerRegion {
  key: string;
  label: string;
  timezone: string;
  sabukDays: string[];
  sabukTime: string;
}
export const SERVER_REGIONS: ServerRegion[] = [
  { key: "sa", label: "América do Sul (São Paulo)", timezone: "America/Sao_Paulo", sabukDays: ["Ter", "Sex"], sabukTime: "21:30" },
  { key: "sea", label: "Sudeste Asiático (Singapore)", timezone: "Asia/Singapore", sabukDays: ["Qui"], sabukTime: "21:30" },
  { key: "na", label: "América do Norte (Nova York)", timezone: "America/New_York", sabukDays: ["Dom", "Qua"], sabukTime: "21:30" },
  { key: "eu", label: "Europa (Frankfurt)", timezone: "Europe/Berlin", sabukDays: ["Sáb"], sabukTime: "21:30" },
];

/**
 * Vídeos de gameplay por classe — gameplays oficiais/destaque do MIR4 no YouTube.
 * Cada classe tem um vídeo de gameplay em destaque usado nas páginas de Classes
 * e Subclasses (iframe responsivo). IDs do YouTube verificados.
 */
export const TIERLIST_SCENARIOS = [
  { key: "massivo", label: "PvP Massivo (Sabuk)", icon: "⚔️" },
  { key: "farm", label: "Farm de Darksteel", icon: "⛏️" },
  { key: "bosses", label: "Bosses e Raids", icon: "👹" },
] as const;

export type TierListTier = "S" | "A" | "B" | "C";
export const TIERLIST_TIERS: TierListTier[] = ["S", "A", "B", "C"];

export const TIERLIST_TIER_STYLE: Record<TierListTier, { bg: string; text: string; ring: string }> = {
  S: { bg: "bg-gradient-to-br from-amber-400 to-yellow-600", text: "text-yellow-950", ring: "ring-amber-400/50" },
  A: { bg: "bg-gradient-to-br from-red-500 to-red-700", text: "text-red-50", ring: "ring-red-500/50" },
  B: { bg: "bg-gradient-to-br from-neutral-600 to-neutral-700", text: "text-neutral-100", ring: "ring-neutral-500/50" },
  C: { bg: "bg-gradient-to-br from-neutral-800 to-neutral-900", text: "text-neutral-300", ring: "ring-neutral-700/50" },
};

// Rankings de tier list por cenário — 8 classes oficiais do MIR4 (indicativo de comunidade)
export const CLASS_TIER_RANKINGS: Record<string, Record<string, { tier: TierListTier; why: string }>> = {
  massivo: {
    warrior: { tier: "S", why: "Tanque de linha de frente com alto HP e controle de área em Sabuk Wars; segura objetivos sob pressão." },
    sorcerer: { tier: "A", why: "Dano em área devastador em multidões, mas exige posicionamento para sobreviver." },
    taoist: { tier: "A", why: "Suporte essencial em guerras de guilda: cura e buff para o time inteiro." },
    lancer: { tier: "A", why: "Cargas e imobilizações quebram formações inimigas em larga escala." },
    darkist: { tier: "B", why: "Maldições enfraquecem o time adversário, mas depende de manter venenos ativos." },
    lionheart: { tier: "S", why: "Cura em área + debuff em área: a peça central de sobrevivência do grupo." },
    arbalist: { tier: "B", why: "Dano consistente de longa distância, porém menos impacto em caos puro." },
    spiritsummoner: { tier: "A", why: "Espíritos controlam zonas e pressionam áreas de combate coletivo." },
  },
  farm: {
    warrior: { tier: "B", why: "Resistente, mas dano por segundo modesto para clear rápido." },
    sorcerer: { tier: "S", why: "Clear em área mais rápido do jogo: ideal para grind de Darksteel." },
    taoist: { tier: "A", why: "Sustentação sem gastar poções e dano mágico sólido em mobs agrupados." },
    lancer: { tier: "B", why: "Bom clear, mas depende de cooldowns de carga." },
    darkist: { tier: "A", why: "Veneno mata mobs passivamente enquanto você se move entre zonas." },
    lionheart: { tier: "A", why: "Quase imortal no farm: clear estável sem custo de cura." },
    arbalist: { tier: "B", why: "Dano estável, clear eficiente em mobs parados." },
    spiritsummoner: { tier: "S", why: "Espíritos farmam sozinhos: ideal para farm AFK e multitarefa." },
  },
  bosses: {
    warrior: { tier: "A", why: "Tanque de Boss sem custo: sustenta hits pesados enquanto o DPS trabalha." },
    sorcerer: { tier: "S", why: "Maior DPS sustentado de longa distância contra alvos grandes." },
    taoist: { tier: "S", why: "Redução de dano + cura tornam qualquer grupo de Boss muito mais seguro." },
    lancer: { tier: "B", why: "Crowd control útil, mas dano limitado contra um único alvo grande." },
    darkist: { tier: "A", why: "Debuffs de defesa e veneno acumulam dano relevante em lutas longas." },
    lionheart: { tier: "A", why: "Cura de grupo + debuff de ataque do Boss aumentam a vida útil do raid." },
    arbalist: { tier: "B", why: "Dano constante de longe, sem ferramentas de sobrevivência extras." },
    spiritsummoner: { tier: "A", why: "Spirit Shield protege o time e espíritos somam DPS contra Bosses." },
  },
};

export const CLASS_VIDEOS: Record<string, { id: string; title: string }> = {
  warrior: {
    id: "Q82PZqjxPz4",
    title: "Warrior — gameplay de burst e tank PvP",
  },
  sorcerer: {
    id: "Zj9QMzxzt1Y",
    title: "Sorcerer — gameplay de PvP com dano mágico",
  },
  taoist: {
    id: "GTmrnnEUDtQ",
    title: "Taoist — gameplay de PvP com suporte e debuffs",
  },
  lancer: {
    id: "yx3S_QYnEBo",
    title: "Lancer — gameplay de área e controle de grupo",
  },
  arbalist: {
    id: "hMmHk7OBTr0",
    title: "Arbalist — gameplay de burst e dano à distância",
  },
  darkist: {
    id: "8IW8-NW1opY",
    title: "Darkist — gameplay com venenos, maldições e ultimate Asura",
  },
  lionheart: {
    id: "zhaGosHGsUk",
    title: "Lionheart — gameplay: quebrando formações, cura de aliados e debuffs",
  },
  spiritsummoner: {
    id: "KBxPdi4gyWE",
    title: "Spirit Summoner — preview oficial da nova classe (invocação e AoE)",
  },
};


export const CLASS_VIDEOS_NOTE =
  "Vídeos ilustrativos da comunidade no YouTube — pausados por padrão; ative o som conforme preferir.";
