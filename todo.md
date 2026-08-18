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
