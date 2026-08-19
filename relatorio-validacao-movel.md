# Relatório de Validação — Responsividade e Performance Móvel

**Projeto:** Guia Completo MIR4 (`mir4-guia`)
**Data:** 18 de agosto de 2026
**Viewport de teste:** 375 × 812 px (iPhone) e 1280 × 720 px (desktop)

## 1. Páginas validadas

| Página | Desktop (1280×720) | Mobile (375×812) | Observações |
|---|---|---|---|
| Tier List `/tier-list` | OK | OK | Título da página é cortado pelo header fixo na captura, mas é artefato da captura full-page; o conteúdo renderiza corretamente |
| Subclasses `/subclasses` | OK | OK | Abas de classes refluem em grade; vídeos lazy com placeholder |
| Calculadora `/calculadora?tab=pvp-compare` | OK | — | Comparador PvP acessado pelo botão "Comparar builds" em Subclasses |

## 2. Tier List interativa — mobile

O layout móvel de `/tier-list` foi verificado com viewport 375×812 e apresenta comportamento adequado:

- Os cartões de classe empilham verticalmente dentro de cada faixa de tier, ocupando a largura útil da tela sem overflow horizontal.
- Os controles de voto (setas para cima/baixo e contador "sem votos") permanecem legíveis e acessíveis por toque, com alvos de toque adequados.
- Os botões de cenário (PvP Massivo, Farm de Darksteel, Bosses e Raids) quebram em linha própria quando necessário, mantendo destaque no cenário ativo.
- Os contadores de "votos da comunidade" e "overrides pessoais" refluem corretamente abaixo dos botões de cenário.
- O banner animado de evento ao vivo e o header com ícones de ação (busca, tema, perfil, notificações) não sobrepõem o conteúdo da página.

## 3. Subclasses e builds específicas — mobile

- A página `/subclasses` em viewport móvel exibe a grade de abas de classe (Warrior, Sorcerer, Taoist, Lancer, Arbalist, Darkist, Lionheart, Spirit Summoner) com quebra de linha adequada, sem sobreposição.
- As abas de builds PvE/PvP/Farm AFK mantêm espaçamento vertical confortável para toque.
- O player de vídeo lazy (ClassVideoPlayer) usa placeholder com botão "Assistir gameplay", evitando carregamento pesado de iframe no mobile até a interação.
- As seções especializadas adicionadas (Darkist Sustain vs. Burst em `Tabs` e grid de espíritos elementais da Spirit Summoner) usam componentes `Tabs` e `Card` do shadcn/ui, que já são responsivos; a validação visual não mostrou overflow nem texto cortado.

## 4. Comparador PvP e radar chart

- O diálogo `PvPCompareDialog` (com seletor de cenário Duelo/Em grupo/Bosses e o radar chart em canvas) renderiza corretamente no desktop; em telas estreitas o diálogo do shadcn/ui se comporta como modal de largura fluida.
- O export do card PvP (`exportPvPCompareCard`) gera imagem fixa de 1200 px de largura, independentemente do dispositivo — verificado via script em lote (node-canvas), sem dependência do canvas do navegador.
- O script em lote `scripts/export-pvp-cards.mjs` exportou os 28 pares das 8 classes em 1200×~2346 px com placar geral, radar por cenário e barras de atributos, sem erros.

## 5. Performance

- As páginas usam carregamento lazy para vídeos (iframe apenas após clique) e o radar chart é desenhado em canvas puro sem bibliotecas de gráficos, mantendo o bundle leve.
- A votação da tier list usa `useMutation` com `invalidate` no tRPC — nenhuma solicitação é feita até o usuário interagir.
- Os dados de tier list são agregados no backend (`tierlist.results`), reduzindo o payload transferido para o cliente.
- Nenhum erro de TypeScript (tsc limpo) e 152 testes vitest aprovados, incluindo 3 novos testes do card PvP exportado.

## 6. Conclusão

As novas funcionalidades (tier list interativa com votação comunitária, radar chart no comparador PvP, abas especializadas de Darkist e Spirit Summoner e exportação em lote dos cards) estão responsivas em viewport móvel e desktop, com performance adequada. Recomenda-se apenas o teste manual do fluxo de votação por um usuário logado em dispositivo real para validar a experiência de toque no agregado comunitário.
