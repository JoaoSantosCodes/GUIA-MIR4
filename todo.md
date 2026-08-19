# Project TODO — Guia Completo MIR4

## Design e estrutura
- [x] Direção visual: tons escuros base + dourado + vermelho, atmosfera épica do MIR4 (index.css, fontes)
- [x] Layout global com header fixo de navegação
- [x] Busca rápida global por todo o conteúdo do guia

## Páginas
- [x] Página inicial com visão geral do jogo e links de acesso rápido para todas as seções
- [x] Seção Espíritos (Pets): lista completa por raridade (UC, Raro, Épico, Lendário, Mítico) com atributos, habilidades e como obter
- [x] Seção Codex: explicação do sistema, tabela de bônus, ranking do Collection Codex, dicas de farm por categoria
- [x] Seção Locais de Farm: tabela de áreas por nível, spots de Darksteel, Magic Square (câmaras + respawn), ervas/coleta
- [x] Seção Classes: guia individual das 5 classes (Warrior, Sorcerer, Taoist, Lancer, Arbalist) com skills, combos e builds
- [x] Seção Economia: moedas, Darksteel, DRACO, Mercado e dicas de acumulação de riqueza

## Backend e dados
- [x] Schema DB: tabelas de favoritos e progresso de codex por usuário
- [x] Migração aplicada no banco
- [x] tRPC procedures: favoritos (CRUD), progresso codex (toggle/lista)
- [x] Seeds de conteúdo do guia (dados de espíritos, codex, farm, classes, economia)

## Funcionalidades logadas
- [x] Login OAuth (Manus) com header mostrando usuário/logado
- [x] Salvar favoritos por usuário autenticado (com prompt de login para não logados)
- [x] Marcar progresso no Codex (itens coletados) por usuário autenticado
- [x] Página de perfil/meus favoritos/meu progresso

## Qualidade
- [x] Testes vitest para procedures de favoritos e progresso
- [x] Responsividade mobile
- [x] Checkpoint final e entrega

## Refinamentos pós-revisão
- [x] Busca indexando também descrições, skills, combos, dicas e textos das seções (não só títulos)
- [x] Campo "Como obter" explícito por espírito, exibido nos cards de Espíritos
- [x] Recomendações de build por classe (PvE/PvP/farm) na página Classes
- [x] Validar mobile em todas as páginas principais
- [x] Validar mobile na página /classes
- [x] Checkpoint final (v14b8d7c5) salvo

## Nova funcionalidade: Raids e Bosses, filtros de Espíritos e comentários
- [x] Pesquisar raids/bosses do MIR4 (nomes, nível recomendado, mecânicas, drops)
- [x] Criar dados de bosses (RAIDS) em shared/guideData.ts
- [x] Tabela de bosses desnecessária — raids/bosses são conteúdo estático em shared/guideData.ts (não é conteúdo dinâmico por usuário)
- [x] Helpers db + procedures tRPC para comentários (tabela farm_comments)
- [x] Página Raids com estratégia de combate, filtros por dificuldade e tabelas de drops por boss
- [x] Rota /raids registrada no App.tsx, navegação e busca indexada
- [x] Filtros por raridade E atributo na página Espíritos (checkboxes de atributos)
- [x] Ordenação de espíritos (rarity, nome) na página Espíritos
- [x] Testes vitest para favoritos raid/boss e comentários (16 testes aprovados)
- [x] Screenshot desktop e mobile das novas páginas (/raids, /espiritos, /farm)
- [x] Checkpoint (v b36ea8c8) salvo — todas as 3 funcionalidades novas implementadas e testadas (16 testes)
- [x] Comentários com polling de 30s para atualização quase em tempo real (auto-publish já ativo: checkpoint cfa39dae = publicação)

## Nova funcionalidade: upvote/downvote, progresso Codex, Tier List e Leveling
- [x] Pesquisar/sintetizar tier list de espíritos por cenário (PvP, Mineração, Bosses) e combos recomendados
- [x] Pesquisar/sintetizar guia de leveling por faixa (1-10, 10-20, 20-30, 30-40, 40-50, 50-60, 60-70, 70-100, 100+)
- [x] Voto (up/down) na tabela farm_comments + colunas de score
- [x] Procedures tRPC comments.vote e helpers db
- [x] UI de votos na CommentsSection com ordenação por score
- [x] Rastreador de progresso no Codex: barra total no topo + barra e contador por categoria nos filtros
- [x] Página Tier List (/tier-list) com rankings por cenário e combos de 4 espíritos
- [x] Página Leveling (/nivel) com faixas 1-10, 10-20, ..., 100+ em acordeão
- [x] Rotas, navegação, busca indexada e testes para as novas páginas (21 testes aprovados, incl. teste de dados do leveling guide)
- [x] Screenshots verificados (/tier-list, /nivel, /farm, /codex, /espiritos, /raids) — UI votos/progresso renderizada
- [x] Screenshot desktop/mobile, pnpm test/check e checkpoint final

## Nova funcionalidade: Sabuk War, Guildas, tema toggle e Mistérios
- [x] Pesquisar Guerra de Sabuk (regras, fases do cerco, recompensas, guild mechanics)
- [x] Pesquisar Torre da Conquista e outros conteúdos de conquista, mistérios/segredos do MIR4
- [x] Dados de Sabuk War + guildas + Mistérios em shared/guideData.ts (tipos favorito "sabuk"/"mystery", enums e schema atualizados no banco)
- [x] Página Sabuk (/sabuk) com estratégias de cerco, fases, recompensas e mecânicas de guilda
- [x] Página Mistérios (/misterios) com segredos, dicas avançadas e conquistas (Torre da Conquista etc.)
- [x] Toggle modo escuro/claro no header (o site base é dark; tema claro como opção)
- [x] Rota, navegação, busca indexada e favoritos para as novas páginas
- [x] Favoritos de Torre da Conquista aceitos no backend (chave torre-conquista validada)
- [x] Títulos amigáveis sabuk/mystery no Profile
- [x] Screenshots desktop + checkpoint e entrega

## Nova funcionalidade: Selos & Geminação, Calendário de Eventos e comentários em Sabuk/Mistérios
- [x] Pesquisar Selos (Darksteel Seal, Jade Seal, Dragon Seal) e rotas de farm por estágio
- [x] Pesquisar horários de Guerra de Sabuk e Magic Square por servidor
- [x] Dados de Selos & Geminação em shared/guideData.ts (rota favorita "seal")
- [x] Coluna pageKey na tabela de comentários (migração 0005) + enum "seal" nos favoritos (migração 0006)
- [x] Procedures tRPC comments genéricas por pageKey (list/add/remove/vote com validação por página)
- [x] Página Selos & Geminação (/selos) com estágios e rotas de farm
- [x] Página Calendário de Eventos (/calendario) interativa: filtros por categoria, guerras de Sabuk, Magic Square, horários e tabela de respawns fixos
- [x] Seção de comentários com votação nas páginas Sabuk e Mistérios
- [x] Rota, navegação, busca indexada e favoritos para as novas páginas + links na Home + títulos no Profile
- [x] Testes vitest (26 aprovados) + screenshots desktop/mobile + checkpoint e entrega

## Nova funcionalidade: Calculadora Darksteel/DRACO, notificações de eventos e Subclasses/Skills
- [x] Pesquisar ganhos de Darksteel por hora (selo, estágio, áreas) e conversão DRACO
- [x] Pesquisar subclasses e skills por classe (Warrior, Sorcerer, Taoist, Lancer, Arbalist) e builds avançadas
- [x] Dados de mineração/DRACO (MINE_AREAS, SEAL_MULTIPLIER, calculateMining) e subclasses/skills (CLASS_SKILLS) em shared/guideData.ts
- [x] Página Calculadora (/calculadora) interativa: selo, estágio, área e horas → estimativa de Darksteel, Gold e DRACO
- [x] Notificações visuais no calendário de eventos: painel "Próximos horários" com contagens para Sabuk/Magic Square
- [x] Página Subclasses & Skills (/subclasses) com árvores recomendadas e builds avançadas por classe (tabs PvE/PvP/AFK)
- [x] Rota, navegação, busca indexada e links na Home para as novas páginas (favorito seal:calculadora, pageKey "skills")
- [x] Chave seal:calculadora aceita no backend de favoritos + árvore de progressão visual por classe (skillOrder/orderNote)
- [x] Screenshots verificados (Subclasses com árvore de progressão, Calculadora com 4 cards de resultado + Gold) + checkpoint e entrega

## Nova funcionalidade: comentários Economia/Classes/Raids, Equipamentos & Geminação e tema persistente
- [x] Pesquisar geminação de equipamentos (Darksteel, Jade, Dragon Steel) por tipo de item
- [x] Dados de equipamentos em shared/guideData.ts: EQUIPMENT_TYPES (10 slots), ENHANCE_COSTS (+1..+10), GRADE_INFO (5 graus), GEMMING_TIPS
- [x] Página Equipamentos & Geminação (/equipamentos) com stats por slot, custos de enhancement e uso por grau
- [x] Favorito "gear" (schema enum + routers validação), pageKey "gear" nos comentários, rota /equipamentos, nav, busca indexada, card na Home e título no Profile
- [x] Comentários com votação nas páginas Economia, Classes e Raids (pageKeys classes/economy/raids validados)
- [x] Preferência de tema persistente: ThemeContext com localStorage("theme") + script inline anti-flash no index.html
- [x] Testes vitest (31 aprovados) + screenshots desktop/mobile + checkpoint e entrega

## Nova funcionalidade: compartilhamento, materiais/crafting e seletor de servidor
- [x] Pesquisar materiais e crafting (Darksteel Seal, Jade, Dragon Steel, Blacksteel, reagentes raros, fontes de farm)
- [x] Dados de MATERIALS em shared/guideData.ts (materiais por grau, fontes de farm, rotas de progressão) (materiais por grau e fontes de farm)
- [x] Link público de favoritos: procedure tRPC share.getProfile (pública, via userId) + botão de copiar link no perfil
- [x] Página compartilhada (/share/:id) com favoritos e progresso do usuário, sem login
- [x] Página Materiais & Crafting (/materiais) com farm por material, filtros por grau e comentários
- [x] Seletor de servidor (SA, SEA, NA, EU, Ásia) no calendário com contagem regressiva personalizada e localStorage do fuso
- [x] Rotas, navegação, busca indexada, cards na Home e títulos no Profile para as novas páginas
- [x] Testes vitest (39 aprovados) + screenshots desktop verificados + checkpoint e entrega

## Nova funcionalidade: notificações de eventos, FAQ comunitário e builds compartilháveis
- [x] Notificação no cabeçalho (badge "próximos eventos") quando um evento do calendário estiver a <= 15 min de começar (polling a cada 30s, alerta Sonner, EventNotificationsBell + router events.upcoming por região)
- [x] Seção FAQ comunitária: procedure tRPC para listar dicas mais votadas por página (router faq.topTips, score = upvotes - downvotes, db.fetchTopTips)
- [x] Página/rota FAQ (/faq) agregando top dicas votadas de todas as páginas com navegação para a seção original (client/src/pages/Faq.tsx)
- [x] Importar/exportar builds de skills em formato de texto (shared/buildCodec.ts formato MIR4-SKILLS:..., componente BuildShare na página Subclasses)
- [x] Rotas, navegação, busca indexada e link na Home para as novas páginas (rota /faq registrada, entrada em GUIDE_SECTIONS e índice de busca)
- [x] Testes vitest (47 aprovados, incl. events.upcoming, faq.topTips e buildCodec) + screenshots verificados + checkpoint e entrega

## Nova funcionalidade: alerta sonoro, banner ao vivo e histórico de votos
- [x] Preferência de usuário "alerta sonoro" (ativar/desativar som quando evento estiver a <= 15 min) persistente (localStorage + coluna na tabela user)
- [x] Som de alerta no EventNotificationsBell quando alerta sonoro ativo (usar Web Audio API / beep, sem arquivo externo)
- [x] Banner "evento em andamento" no topo do site quando um evento estiver ativo, com tempo restante (LiveBanner)
- [x] Router comments.vote: registrar voto por usuário (tabela comment_votes) para permitir alterar votos; endpoint user.voteHistory
- [x] Migração: tabela comment_votes (migração 0009 aplicada) (userId, commentId, vote +1/-1, createdAt, unique userId+commentId)
- [x] Seção no perfil do usuário: histórico de votos com botões para alterar voto (up/down/remover)
- [x] UI de votos nas páginas refletir o voto do usuário logado (CommentsSection setUserVote + myVotes) (highlight do voto atual)
- [x] Rotas, navegação, busca e testes para as novas funcionalidades
- [x] Testes vitest (62 aprovados) + screenshots verificados + checkpoint e entrega

## Nova funcionalidade: selo Dica de Ouro, filtros de histórico e pulso no banner
- [x] Selo "Dica de Ouro" visual (ícone + badge dourado) para dicas com upvotes >= 10 nos componentes de comentários (CommentsSection) e na página FAQ
- [x] Filtros no histórico de votos do perfil: ordenação por data (mais recente/mais antiga) e por categoria da dica
- [x] Animação de pulso suave no banner de evento ao vivo (LiveEventBanner) com prefers-reduced-motion respeitado
- [x] Testes vitest (62 aprovados) + screenshots verificados + checkpoint e entrega

## Nova funcionalidade: medalhas, aba Dicas de Ouro e timeline
- [x] Contador de medalhas "Dica de Ouro" no perfil: derivar dos votos do usuário em dicas com 10+ upvotes (GOLD_TIP_UPVOTES) e exibir badge/medalha no topo do perfil
- [x] Aba dedicada na FAQ: toggle "Apenas Dicas de Ouro" (filtro client-side sobre os dados do faq.topTips, com upvotes >= 10)
- [x] Timeline interativa no perfil consolidando favoritos, histórico de votos e progresso do Codex em ordem cronológica (createdAt/collectedAt/votedAt, filtros por tipo Tudo/Favoritos/Votos/Codex)
- [x] Testes vitest (62 aprovados) + screenshots verificados + checkpoint e entrega

## Nova funcionalidade: skill reutilizável, placar, notificação de medalha, exportação e redes sociais
- [x] Criar skill reutilizável com skill-creator documentando o processo deste projeto (game-guide-builder atualizada e validada)
- [x] Placar da comunidade: página/ranking público dos usuários com mais medalhas "Dica de Ouro" (agregação server-side via comment_votes com upvotes >= 10 — db.goldLeaderboard + community.goldLeaderboard + Leaderboard.tsx em /placar)
- [x] Notificação visual na timeline quando dica votada pelo usuário atingir 10+ upvotes (banner de conquista + badge "Dica de Ouro" nos itens de voto na timeline)
- [x] Botão de exportar atividades da timeline como card de imagem compartilhável (lib/timelineExport.ts: canvas → PNG 1200px com nome, medalhas e atividades)
- [x] Ícones de redes sociais (X/Twitter, Discord, YouTube, Instagram) no footer do site
- [x] Rotas, navegação, busca indexada e link na Home para o placar (rota /placar, GUIDE_SECTIONS, hit de busca, card na Home)
- [x] Testes vitest (64 aprovados, incl. community.goldLeaderboard) + screenshots verificados + checkpoint e entrega

## Nova funcionalidade: conquistas Codex, card personalizado e export do placar
- [x] Conquistas no perfil: medalhas visuais por marcos do Codex (10/25/50/100 itens + categorias completas) em client/lib/codexAchievements.ts + seção no Profile
- [x] Personalização do card exportado: escolher avatar/ícone e tema de fundo antes de exportar (ExportCardDialog com preview ao vivo, 3 temas: dark/blood/mystic)
- [x] Botão de exportar card com posição no ranking na página /placar (exportRankingCard em timelineExport.ts + ExportRankingCardDialog no Leaderboard, destaque para top 3)
- [x] Atualizar skill game-guide-builder com o processo de conquistas/cards personalizados e validar (quick_validate.py passou)
- [x] Rotas, navegação e busca: novas funcionalidades são seções de páginas existentes (Profile e /placar), sem novas rotas necessárias
- [x] Testes vitest para evaluateCodexAchievements (8) e timelineExport (3) — 75 testes aprovados + screenshots desktop/mobile verificados

## Nova funcionalidade: conquista recém-desbloqueada, compartilhamento do card e expansão do Codex
- [x] Notificação visual animada no topo do perfil quando uma nova conquista do Codex for desbloqueada (banner dourado com entrada animada, auto-dismiss após alguns segundos, respeitando prefers-reduced-motion)
- [x] Botão de compartilhamento direto no card exportado: copiar imagem para a área de transferência (Clipboard API, com fallback) e/ou abrir menu nativo de compartilhamento (navigator.share)
- [x] Expandir itens do Codex: adicionar Consumíveis e Colecionáveis por faixa de nível (1-20, 20-40, 40-60, 60-80, 80-100+) e Badges de Reputação por faixa, em shared/guideData.ts (46 itens no total)
- [x] Revisar conquistas (metas de total, categorias e raridade) para o novo dataset ampliado (13 conquistas: novas consumiveis-6, colecionaveis-6, rep-6, faixa-t1; equipamentos-5 ajustado)
- [x] Testes vitest atualizados para os novos itens/categorias (78 aprovados) + screenshots verificados + checkpoint e entrega

## Nova funcionalidade: busca/filtros do Codex, conquistas por faixa e card individual de item
- [x] Busca por nome e filtros (categoria, raridade, faixa de nível 1-20/20-40/40-60/60-80/80-100+) na página do Codex
- [x] Conquistas por faixa de raridade completa: faixa-t2..t5 (Ascensão Rara, Mestre Épico, Lenda da Arena, Ascensão Mítica)
- [x] Card individual por item do Codex: ItemCardDialog com preview (nome, raridade, dica de farm, tier, progresso da categoria) e exportação PNG
- [x] Testes vitest para novas conquistas de faixa (83 aprovados) + screenshots verificados + checkpoint e entrega

## Nova funcionalidade: persistência de filtros, export em lote e badges de raridade
- [x] Persistir preferências de filtro do Codex (busca, categoria, raridade, faixa) em localStorage (mir4-codex-filters) e restaurar na reabertura da página
- [x] Exportação em lote: CategoryCardDialog + exportCategoryCard — botão por categoria e "Codex completo" no Codex.tsx
- [x] Exibir conquistas de raridade (faixa-t2..t5) no perfil (destaque roxo + selo RARIDADE) e no placar (contador no pódio/linha + exportRankingCard com rarityBadges)
- [x] Testes vitest (83 aprovados) + screenshots verificados + checkpoint 75f14b00 salvo
- [x] Documentação do projeto criada (5 arquivos em /home/ubuntu/docs-obsidian/, entregues em anexo para mover à pasta GuiaMir4 do Obsidian)

## Nova funcionalidade: marca d'água, tooltips e barras de progresso
- [x] Marca d'água nos cards em lote do Codex (drawWatermark no exportCategoryCard): nome do usuário + data atual (passado do CategoryCardDialog via useAuth)
- [x] Tooltip nas conquistas de raridade do perfil (selo Raridade group-hover): descrição + instruções de registro da raridade na página Codex
- [x] Barra de progresso visual por categoria no Codex (grid com Progress e catPct% + contagem, abaixo dos filtros — já implementado e verificado em screenshot)
- [x] Testes vitest (84 aprovados, incl. teste da marca d'água) + screenshots verificados + checkpoint

## Nova funcionalidade: skill atualizada, tooltips gerais, selo 100% e barras verdes
- [x] Atualizar a skill reutilizável (game-guide-builder) com tooltips por conquista, selo 100%, marca d'água, filtros persistentes e unlock banner — validada com quick_validate.py
- [x] Tooltips explicativos em todas as conquistas do perfil (achievementTooltip por key + title nativo em group cursor-help) + ícone Info no canto superior direito que fica âmbar no hover
- [x] Selo visual "100% CONCLUÍDO" verde rotacionado 30° no exportCategoryCard quando collectedCount >= categoryTotal (teste vitest adicionado)
- [x] Barras de progresso do Codex mudam para verde (emerald) em 100% de conclusão da categoria (catPct >= 100)
- [x] Testes vitest (85 aprovados) + screenshots verificados + checkpoint

## Nova funcionalidade: ordenação de conquistas, card de conquista, celebração sonora/confete, skill atualizada
- [x] Ordenação na seção de conquistas do perfil: pills Todas / Conquistadas / Em progresso / Raridade primeiro (achFilter + filteredAchievements memo)
- [x] Exportar card PNG individual por conquista desbloqueada (AchievementCardDialog + exportAchievementCard: nome do usuário + data; botão Exportar card em cada conquista conquistada)
- [x] Notificação sonora suave + confete na tela ao desbloquear nova conquista (Web Audio jingle 3 tons + AchievementConfetti canvas ~2,5s, prefers-reduced-motion respeitado, auto-dismiss 2,5s)
- [x] Atualizar a skill reutilizável (game-guide-builder) com ordenação, exportAchievementCard e celebração som+confete — validada (quick_validate.py: Skill is valid)
- [x] Testes vitest (87 aprovados, incl. 2 testes de exportAchievementCard: título/descrição/nome/data e achievedAt) + screenshots verificados + checkpoint

## Nova funcionalidade: compartilhamento nativo do card de conquista, última conquista permanente, preferência de celebração, skill atualizada
- [x] Botão de compartilhamento nativo no card de conquista exportado (Compartilhar via exportCardShared: navigator.share no mobile, Clipboard no desktop, download fallback; achievedAt passado ao dialog)
- [x] Painel de destaque permanente no topo do perfil com a última conquista desbloqueada (localStorage mir4-last-achievement, medalha, data, botão Exportar card)
- [x] Preferência nas configurações do perfil para desativar som e confetes das conquistas (toggle Celebração no header do perfil, localStorage mir4-achievement-celebration, condicional no som e no confete)
- [x] Atualizar a skill reutilizável (game-guide-builder) com painel permanente, toggle e share de conquista — validada (quick_validate.py: Skill is valid)
- [x] Testes vitest (93 aprovados, incl. 6 testes de celebrationState com localStorage mock) + screenshots verificados + checkpoint bb43e711 salvo

## Nova funcionalidade: placar unificado, histórico de conquistas, notificação de conquistas acumuladas

- [x] Placar unificado: ranquear usuários pela soma de Dicas de Ouro + medalhas do Codex (backend novo helper/endpoint db.unifiedLeaderboard + community.unifiedLeaderboard, frontend /placar com toggle Unificado, card de ranking exporta com modo unificado/totalScore)
- [x] Histórico de conquistas no perfil: listar todas as conquistas desbloqueadas com datas (celebrationState: mir4-achievement-history + source session/retro; seção "Histórico de Conquistas" no Profile com badge de origem)
- [x] Notificação de conquistas acumuladas ao retornar ao site (banner com até 5 novidades desde a última visita, comparando retro reconstruído com registros de sessão, dismissível, respeitando prefers-reduced-motion)
- [x] Registro em sessão: appendAchievementHistory com source "session" e data exata ao desbloquear + backfill retro no mount (achievementRetroDates.ts: reconstrói datas por N-ésima coleta/última coleta da raridade/categoria, dedupe key+data)
- [x] Atualizar a skill reutilizável (game-guide-builder) com placar unificado, histórico de conquistas com datas retro e banner de novidades acumuladas — validada (quick_validate.py: Skill is valid)
- [x] Testes vitest (110 aprovados, incl. 11 novos: achievementRetroDates + celebrationHistory) + screenshots verificados
- [x] Checkpoint salvo (79a76aae) e entregue — versão já publicada em produção (auto-publish ativo)

## Nova funcionalidade: melhorias no histórico de conquistas + validação de classes

- [x] Botão de compartilhamento no histórico de conquistas (HistoryCardDialog: exportHistoryCard com até 6 medalhas — data, tipo Codex/Dica de Ouro e contador de Dicas de Ouro; Compartilhar via menu nativo → Copiar → Baixar PNG; avatar e tema personalizáveis)
- [x] Filtros de ordenação no histórico de conquistas: pills Codex/Dicas de Ouro/Todas + ordenação Mais recente/Raridade primeiro (filteredHistory), com estado vazio contextual quando o filtro não retorna medalhas
- [x] Efeito sonoro suave (playAchievementSound) + confete (AchievementConfetti) quando o banner de conquistas acumuladas aparecer, respeitando readCelebrationEnabled() e prefers-reduced-motion
- [x] Validar conteúdo de classes: as 5 classes (Warrior, Sorcerer, Taoist, Lancer, Arbalist) presentes com skills, combos, builds e subclasses em /classes e /subclasses (verificado via screenshots); corrigido o seletor de Subclasses — Taoist, Lancer e Arbalist agora exibem retrato próprio (CLASS_IMAGES completo; URLs validadas no storage)
- [x] Testes vitest (112 aprovados, incl. 2 novos para exportHistoryCard) + screenshots verificados (perfil com filtros/botão, classes com 5 retratos) — checkpoint e entrega

## Nova funcionalidade: calculadora de fortalecimento, vídeos e comparador PvP

- [x] Calculadora de fortalecimento: aba "Fortalecimento" na página /calculadora (EnhanceCalculator + enhanceCalc.ts): 10 slots com multiplicador Darksteel, níveis +0–10 por slider, custo acumulado por estágio + total em Darksteel/Copper, custo opcional em Jade (proteção × tentativas), tabela progressiva, persistência em localStorage (enhance-prefs); 10 testes aprovados
- [x] Vídeos embutidos do YouTube nas páginas de Classes e Subclasses (ClassVideoPlayer: youtube-nocookie, lazy, carregado ao clicar em Assistir; CLASS_VIDEOS no guideData com IDs reais verificados da comunidade — 1 vídeo por classe: warrior=Q82PZqjxPz4, sorcerer=Zj9QMzxzt1Y, taoist=GTmrnnEUDtQ, lancer=yx3S_QYnEBo, arbalist=hMmHk7OBTr0; nota "pausado por padrão" no player)
- [x] Comparador lado a lado de builds PvP (PvPCompareDialog no cabeçalho do seletor de classe em Subclasses: seletor de 2 classes, scores 0–100 de dano/defesa/utilidade em 3 cenários — PvP 1×1, grupo, Bosses; barras comparativas, deltas com vencedor, placar por cenário e vencedor geral; pvpCompare.ts puro com 8 testes aprovados)
- [x] Testes vitest (130 aprovados, incl. 10 de enhanceCalc e 8 de pvpCompare) + screenshots verificados (/classes e /subclasses com player de vídeo, /calculadora com abas) + TSC limpo — checkpoint e entrega

## Nova funcionalidade: tabelas de fortalecimento, export PvP e preços em Gold

- [x] Tabelas de taxa de sucesso/quebra de fortalecimento por nível na página de Equipamentos (/equipamentos, nova seção "Taxas de sucesso e quebra por nível": ENHANCE_RATES +0→+10 com barras de progresso, taxas de quebra, badge de risco colorido e observações; enhanceRates.ts pura com effectiveRate e nota indicativa; 7 testes aprovados; link para a calculadora)
- [x] Exportação do comparador PvP como card PNG (exportPvPCompareCard no timelineExport: placar geral, vitória por cenário e deltas; botão "Exportar card" dentro do PvPCompareDialog abrindo PvPCompareCardDialog com Compartilhar/Copiar/Baixar PNG; marca d'água com nome e data)
- [x] Preços de mercado em Gold integrados à aba Fortalecimento: MATERIAL_GOLD_PRICES no guideData (Darksteel 1.000 Gold/unid, Copper 0,0001, Jade 40.000, Dragonsteel 25.000), novo card "Custo estimado em Gold" na calculadora, campo de cotação do Darksteel ajustável pelo jogador (persistido em localStorage) com nota de flutuação do mercado, goldBreakdown na enhanceCalc; ?tab=enhance abre direto na aba; 2 testes novos aprovados
- [x] Testes vitest (139 aprovados, incl. 7 de enhanceRates, 2 de exportPvPCompareCard e 2 de gold) + screenshots verificados (/calculadora?tab=enhance com 4 cards incluindo Gold, /equipamentos com tabela ENHANCE_RATES, /subclasses OK) + TSC limpo — skill atualizada e validada, checkpoint 36f8d675 entregue

## Nova funcionalidade: expansão para 8 classes

- [x] Identificar as 8 classes oficiais do MIR4 (confirmado: Warrior, Sorcerer, Taoist, Lancer, Arbalist + Darkist, Lionheart, Spirit Summoner — via site oficial/fórum MIR4 Global)
- [x] Pesquisar conteúdo das classes faltantes: skills, combos, builds e subclasses recomendadas (Darkist: veneno/maldições/Blood Chain/Asura; Lionheart: cargas/Roaring Fist/War Heal/Lion's Impact; Spirit Summoner: Spirit Control/Wand Arts/Spirit Shield/Spirit Cascade)
- [x] Adicionar as 3 classes faltantes ao CLASSES (retratos gerados no tema dark/gold/red no storage), CLASS_SKILLS (builds PvE/PvP/AFK completas), CLASS_VIDEOS (IDs reais: darkist=8IW8-NW1opY, lionheart=zhaGosHGsUk, spiritsummoner=KBxPdi4gyWE) e CLASS_IMAGES/COMPARES_CLASSES (scores PvP); referências "5 classes" corrigidas para 8 na Home e notas do Warrior
- [x] Testes vitest (139 aprovados: asserções CLASS_SKILLS e COMPARE_CLASSES atualizadas para 8) + screenshots verificados (/classes com 8 seções, /subclasses com 8 abas e retratos) + TSC limpo — checkpoint 890acb30 entregue (auto-publish ativo)

## Nova funcionalidade: skill atualizada, tier list, radar PvP e builds específicas

- [x] Atualizar a skill game-guide-builder via /skill-creator com o processo completo (8 classes, tier list, radar, builds específicas) e validar — feito na seção posterior (itens 266-273)
- [x] Página de Tier List interativa (/tier-list): implementada com tiers S–C, votação comunitária e overrides pessoais (ver seção posterior)
- [x] Gráfico de radar no comparador PvP: implementado (ver seção posterior)
- [x] Abas de builds específicas Darkist e Spirit Summoner: implementadas (ver seção posterior)
- [x] Testes vitest + screenshots + checkpoint: entregues (ver seção posterior)

## Nova funcionalidade: tier list interativa com votação, radar PvP, builds específicas, export em lote e validação móvel

- [x] Skill game-guide-builder atualizada e revalidada ("Skill is valid"): description incluiu tier list comunitária com votos e batch export; seção 11 ampliada (tier list com backing DB tierlist_votes + estabilidade de tier com mínimo de 2 votos, radar chart com drawRadarExport e canvas hygiene, build modes Darkist/Spirit Summoner); seção 12 ganhou batch PNG export (scripts/export-pvp-cards.mjs com esbuild em memória + node-canvas/JSDOM) e relatório de validação móvel; sección 11 antiga + common pitfalls (tier list stability, duplicate checklist items)
- [x] Página Tier List interativa (/tier-list): 8 classes ranqueadas por cenário (PvP massivo, farm Darksteel, Bosses) com tiers S–C, tiers pessoais editáveis e persistidas em localStorage (resolveClassTier em tierlistLogic), contador de votos, limpar overrides
- [x] Votação comunitária na Tier List: tabela tierlist_votes criada e migration aplicada, router tRPC tierlist.vote/tierlist.results, logado vota por cenário/classe (mín. 2 votos p/ mover tier, média decide direção), prevalece voto pessoal quando presente
- [x] Gráfico de radar no comparador PvP (RadarChart.tsx canvas puro, dano/defesa/utilidade, legenda gold/red, seletor de cenário duel/group/boss) e no card exportado (drawRadarExport em timelineExport.ts com valuesA/valuesB por cenário)
- [x] Abas de builds específicas em Subclasses: Darkist (Tabs Sustain vs. Burst com foco/skills/rotação/equipamento) e Spirit Summoner (grid de 4 espíritos elementais: Água/Fogo/Vento/Terra com efeitos e uso ideal)
- [x] Script automatizado de exportação em lote (scripts/export-pvp-cards.mjs: node-canvas + JSDOM, 28 pares das 8 classes em pvp-cards/ com placar, radar e barras por cenário) — exportPvPCompareCard corrigido (textAlign reset após radar)
- [x] Relatório de validação móvel: screenshots 375×812 de /tier-list e /subclasses verificados (grid, abas de classes, cards de tier responsivos, sem overflow)
- [x] Testes vitest (152 aprovados, incl. 3 novos do card PvP exportado: placar/legendas do radar e altura com/sem radar) + screenshots desktop/mobile verificados (/tier-list, /subclasses, /calculadora) + checkpoint e entrega

## Nova funcionalidade: tier list de espíritos, histórico semanal e comparador de espíritos

- [x] Tier list interativa de espíritos (/tier-list tab Espíritos): SpiritTierBoard com tiers S–C, votação comunitária (tabela tierlist_votes_spirit, min. 2 votos, router spiritTierlist.vote/results), overrides pessoais em localStorage, combos recomendados por cenário (4 slots), radar por card
- [x] Gráfico de histórico semanal (TierHistoryChart.tsx, canvas puro): evolução dos tiers das classes por semana com base nos votos; tabela tierlist_history + snapshot semanal automático pós-voto em tierlist.vote (resolveClassTier server-side)
- [x] Comparador de espíritos: SpiritCompareDialog + SpiritCompareCardDialog (radar de 5 eixos Dano/Suporte/Defesa/Farm/Versatilidade, placar geral, deltas), exportação PNG (exportSpiritCompareCard + drawGenericRadarExport com marca d'água); botão "Comparar espíritos" no SpiritTierBoard; bichon adicionado a SPIRITS
- [x] Ajustes de layout: tabs Classes/Espíritos com visual dourado, header do SpiritTierBoard com cenário selecionado, grid responsivo; card PNG validado (1200×1088, placar+rada r+barras+marca d'água)
- [x] Testes vitest: 155 aprovados (3 novos do card de espíritos: placar/empate/altura); screenshots desktop/mobile validados (/tier-list tab espíritos + comparador + export no browser)

## Nova funcionalidade: batch espíritos, histórico espíritos, filtros e refinamento UX

- [x] Batch export do comparador de espíritos (scripts/export-spirit-cards.mjs: 45 pares em spirit-cards/, parser de blocos balanceados, card 1200×1088; placar com raridade em linha própria + legenda do radar compacta à direita)
- [x] Histórico semanal da tier list de espíritos (tierlist_history_spirit + snapshot automático pós-voto em spiritTierlist.vote, gráfico TierHistoryChart por espírito na tab Espíritos, router spiritTierlistHistory.list)
- [x] Filtros de cenário na tier list de espíritos (PvP Massivo/Sabuk, Farm de Darksteel, Bosses e Raids) — SPIRIT_TIER_RANKINGS por cenário com seletor compartilhado entre as abas
- [x] Filtro por raridade na tier list de espíritos (Todas/UC/Raro/Épico/Lendário/Mítico com chips coloridos por RARITY_STYLES)
- [x] Ajustes de UX: aba sincronizada com ?tab=spirits na URL (link compartilhável), raridade no header do SpiritTierBoard junto ao placar de votos, microcopy dos filtros mais clara, estados vazios
- [x] Testes vitest (155 aprovados, incl. ajuste do teste do card de espíritos para o novo layout de raridade/legenda) + screenshots desktop + mobile verificados (/tier-list, /tier-list?tab=spirits) + TSC limpo
