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
- [ ] Tabela bosses no schema, migração e aplicação SQL
- [x] Helpers db + procedures tRPC para comentários (tabela farm_comments)
- [x] Página Raids com estratégia de combate, filtros por dificuldade e tabelas de drops por boss
- [x] Rota /raids registrada no App.tsx, navegação e busca indexada
- [x] Filtros por raridade E atributo na página Espíritos (checkboxes de atributos)
- [x] Ordenação de espíritos (rarity, nome) na página Espíritos
- [x] Testes vitest para favoritos raid/boss e comentários (16 testes aprovados)
- [x] Screenshot desktop e mobile das novas páginas (/raids, /espiritos, /farm)
- [x] Checkpoint (v b36ea8c8) salvo — todas as 3 funcionalidades novas implementadas e testadas (16 testes)
- [x] Comentários com polling de 30s para atualização quase em tempo real (auto-publish já ativo: checkpoint = publicação)
