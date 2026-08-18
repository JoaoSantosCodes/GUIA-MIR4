# Notas — Novas funcionalidades (fase atual)

## Pedido do usuário (3 itens)
1. Notificação no cabeçalho quando evento do calendário estiver a <= 15 min.
2. Seção FAQ comunitária com dicas mais votadas (auto-classificação).
3. Importar/exportar builds de skills em formato de texto.

## Já implementado (backend)
- `server/events.ts`: ALERT_TIMERS, nextOccurrenceInTz(tz, days, time, now), nextPeriodicInTz(tz, everyHours, now), computeUpcomingAlerts(regionKey, now) -> UpcomingAlert[]. Usa Intl.DateTimeFormat.formatToParts (Node 22 ok).
- `server/faq.ts`: topTipsByPage(minUpvotes=0, limitPerPage=5) -> PageTopTips[] com score=upvotes-downvotes; commentPagePath(pageKey, farmKey) mapeia página -> caminho com anchor.
- `server/routers.ts`: adicionados routers `events.upcoming` (public, input regionKey) e `faq.topTips` (public, input {minUpvotes?}). Imports já adicionados (computeUpcomingAlerts, topTipsByPage). Compila ok (0 TS errors).

## Frontend pendente
- `client/src/components/EventNotificationsBell.tsx`: CRIADO. Usa `trpc.events.upcoming.useQuery({ regionKey }, { refetchInterval: 30000 })`. Toast Sonner.warning quando soon event entra na janela (cooldown localStorage "eventNotificationCooldown"). Badge + popover.
- GuideLayout.tsx: inserir `<EventNotificationsBell />` no header logo antes do botão mobile (linha ~342, antes de `<Button variant="ghost" size="icon" className="md:hidden ...">`). Adicionar import.
- FAQ: criar `client/src/pages/Faq.tsx` (topTips, seção por pageKey, card com score/votos, link para página original, voto via trpc.comments.vote), rota /faq no App.tsx, entrada "FAQ" em GUIDE_SECTIONS, card na Home, hit de busca.
- Builds import/export: página Subclasses.tsx — modal/botão "Exportar build" (gera string JSON comprimido base64 tipo `mir4-build:${b64}` com classKey, scenario, skills, rotation) + botão/área "Importar build" (paste -> parse -> exibir). Formato texto legível.
- Testes: adicionar em `server/guide.features.test.ts` mocks para events.upcoming e faq.topTips (mock getDb já existe). Rodar `pnpm test`.

## Contexto técnico
- `client/src/components/GuideLayout.tsx`: header na linha 287-345; botão mobile menu linha 342.
- `client/src/App.tsx`: rotas registradas na função Router() (linha 29-55); ThemeProvider.
- `shared/guideData.ts`: SERVER_REGIONS (sa/sea/na/eu, sabukDays, sabukTime), CLASS_SKILLS (5 classes com builds [pve,pvp,afk] com skills, rotation, notes, label, focus), PAGE_COMMENT_KEYS.
- `client/src/pages/Calendario.tsx`: useAlerts/ALERT_TIMERS duplicados client-side (ok manter).
- Comentários: trpc.comments.vote input {id, kind: "up"|"down", delta: 1|-1}; list input {pageKey, farmKey}.
- Sonner toast já disponível (Toaster position bottom-right dark em App.tsx).
- Checkpoint anterior: 6e517ef3 (publicado). 39 testes passando.
- Erro de log "Pre-transform Raids.tsx Unexpected token" é antigo (20:03), tsc ok depois; ignorar.
- Site live: https://mir4guia-ab8pnzuc.manus.space

## Passo a passo restante
1. Editar GuideLayout.tsx: import EventNotificationsBell + inserir componente no header.
2. Criar Faq.tsx; registrar rota /faq; GUIDE_SECTIONS + busca BUILD_SEARCH_INDEX (hit faq).
3. Subclasses.tsx: export/import build (modal com textarea).
4. Testes vitest para events e faq (mock getDb: select->from->where retorna []).
5. pnpm test, screenshot, marcar todo.md, checkpoint + entrega.

## Descoberta de depuração (problema atual)
O vi.mock('./db', factory) NO guia.features.test.ts NÃO está sendo aplicado ao server/faq.ts nem a imports dinâmicos (testado com probe.test.ts doMock/resetModules — mesmo resultado). O db real é usado: log mostrou `db: { select: [Function: select] }` (objeto drizzle real) e DATABASE_URL=true no test env. O teste share.getProfile "passa" porque o db real conectado faz a query com sucesso? Na verdade ele passa com mock getDb retornando [authenticatedUser]. O share.getProfile funciona porque db real do ambiente dev? (site já roda com DB real no sandbox). Conclusão: mocks do vitest não se aplicam aos módulos server quando o vite.config.ts (plugins Manus: vitePluginManusRuntime, jsxLocPlugin) processa os arquivos — o hoisting/transform de mocks do vitest v2.1.9 não funciona com a cadeia de plugins neste setup. (listFavorites etc. são funções db mockadas que SÃO aplicadas no routers.ts — porque routers importa * as db e os testes mockam db.listFavorites via vi.mocked — esses mocks funcionam!)
=> A diferença: faq.ts importa getDb E o router chama topTipsByPage (módulo separado importado por routers.ts). Os mocks de listFavorites funcionam porque o módulo db do teste e o usado por routers são o MESMO módulo mockado — mas routers importa faq.ts que importa o MESMO ./db... o vi.mock deve aplicar a todos. Estranho mas observado: não aplicar.
## Solução adotada
Refatorar faq.ts: mover a query para db.ts como `listTopTips(minUpvotes, limitPerPage)` (padrão das demais funções db.testadas via vi.mocked(db.listTopTips)), e faq.ts fica só com o mapper SECTION_LABELS. Isso contorna o problema porque podemos mockar a função db diretamente com vi.mocked(db.listTopTips).mockResolvedValue(...).

## Estado pós-checkpoint b784bb53 (gaps corrigidos em andamento)
Gaps identificados: (1) events.ts activeNow/incorreto → CORRIGIDO: computeUpcomingAlerts agora usa janela ativa (-durationMin < futureMins <= 0); nextOccurrenceInTz aceita occ >= now; nextPeriodicInTz usa floor(lastStarted + cycle). (2) FAQ ordenava por upvotes → CORRIGIDO: db.fetchTopTips usa orderBy desc(sql`(upvotes - downvotes)`). (3) Card FAQ na Home: NÃO existe ainda — pendente adicionar em Home.tsx. (4) Testes novos adicionados: janela ativa, duração expirada, score downvote alto.
Próximos passos: rodar pnpm test (50 esperados); verificar fuso NA=America/New_York (EDT UTC-4 no verão! — mas teste usa instantes 08:20Z; recalcular com tz real: 08:20Z = 04:20 ET; próximo ciclo 3h=06:00ET=10:00Z; Red Box próximo ciclo 1h=05:00ET=09:00Z. Para janela ativa: usar now=10:15Z (06:15 ET, dentro dos 45min do ciclo 06:00) para Leader III e now=09:20Z para Red Box (ciclo 05:00? duração 30min → inativo a 09:20). ATUALIZAR TESTES com esses instantes. Depois: adicionar card FAQ na Home.tsx (seção de cards existentes, link /faq), pnpm test, screenshot, marcar todo, checkpoint final.

## Nova fase: som, banner ao vivo, histórico de votos (checkpoint 65862b5d anterior)
Todo items: alerta sonoro configurável (localStorage + users.soundAlerts coluna já criada), beep via Web Audio no EventNotificationsBell, LiveBanner no topo (server/events.ts: computeUpcomingAlerts retorna activeNow; use trpc.events.upcoming polling 30s), comment_votes tabela criada + users.soundAlerts int default 0 (migração 0009 aplicada via webdev_execute_sql).
Schema: drizzle/schema.ts — users.soundAlerts int default 0; comment_votes (userId, commentId, vote int 1/-1, createdAt, updatedAt, unique userId+commentId).
Plano backend: db.ts — upsertVote(userId, commentId, vote) usa insert ... ON DUPLICATE KEY UPDATE vote; listVoteHistory(userId); setSoundAlerts(userId, on). routers.ts — comments.vote agora verifica insertVote e ajusta upvotes/downvotes contábeis; user.voteHistory (protected); share.getProfile já existe.
EventNotificationsBell.tsx: usa trpc.events.upcoming({regionKey}) polling; adicionar toggle sound via localStorage("soundAlerts") inicial e switch no dropdown; beep com AudioContext oscilador 2 tons quando activeNow ou minutesUntil<=15; prevenir repeat (última chave+minuto).
LiveBanner: novo componente client/src/components/LiveEventBanner.tsx renderizado no GuideLayout acima do header; mostra eventos activeNow com countdown (durationHours por evento); só aparece se algum ativo.
Perfil: client/src/pages/Profile.tsx (ou similar) — adicionar seção "Histórico de votos" com tabela de votos + botões alterar; UI CommentsSection deve destacar voto atual do usuário (adicionar myVote em listPageComments/listFarmComments retornando objeto com userVote).
Testes: adicionar casos upsertVote (trocar voto 1→-1 decrementa upvote e incrementa downvote), voteHistory, setSoundAlerts; eventos já testados.
Componente CommentsSection usado em várias páginas (farm/sabuk/mystery/seal/skills/gear/materials/classes/economy/raids) — verificar signature em client/src/components/CommentsSection.tsx.
Roteiro após implementação: pnpm test (50+), check, screenshots, checkpoint, entrega.

## Progresso da fase atual (som/banner/votos)
FEITO: schema (users.soundAlerts + comment_votes, migração 0009 aplicada); db.ts (setUserCommentVote, listVoteHistory, setSoundAlerts, getSoundAlerts); server/votes.ts (listVotesByUserAndComments); routers.ts (comments.setUserVote, comments.myVotes, user.voteHistory/setSoundAlerts/getSoundAlerts); EventNotificationsBell (playAlertBeep Web Audio + toggle som localStorage "eventSoundAlerts"); LiveEventBanner.tsx (banner fixo top=0 com placeholder 40px quando vazio; DURATION_MIN sabuk 60, ms-leader3 45, ms-box-red 30); GuideLayout renderiza <LiveEventBanner /> antes do header fixo.
PENDENTE (fase 3): (1) Profile.tsx — adicionar seção "Histórico de votos" usando trpc.user.voteHistory (campos: vote 1/-1, commentId, pageKey, farmKey, content, upvotes, downvotes, votedAt) com botões alterar (up/down/remover) via comments.setUserVote; (2) CommentsSection.tsx — usar comments.myVotes para destacar voto do usuário; verificar como VoteButtons funcionam hoje (components/CommentsSection.tsx) e trocar para setUserVote; (3) testes: setUserCommentVote (troca voto 1→-1 ajusta contadores), listVoteHistory, setSoundAlerts; (4) pnpm test + check + screenshots + marcar todo + checkpoint.
Obs: header fixo em GuideLayout usa pt-16 no main (header ~64px); LiveEventBanner reserva 40px quando vazio — header deve ter top deslocado? NÃO — banner não é fixed, é in-flow no topo; header fixo em top-0 ficará SOBRE o banner. CORREÇÃO NECESSÁRIA: mover banner dentro do fluxo antes do header não funciona pois header é fixed. Solução: manter banner como fluxo normal APÓS o header (main com pt-16), OU tornar banner fixed com top-16. Decidido: banner in-flow logo após o header não é possível (header fixed cobre topo). Melhor: adicionar top-10 (40px) ao header quando banner ativo, ou colocar o banner fora do fluxo como fixed top-16. Implementar: banner fixed top-10 quando ativo; main com pt-16 inalterado — banner fica entre logo e header fixo? header z-50, banner z-40 top-10. OK.
Profile.tsx atual: seções Progresso no Codex e Favoritos; usuário user.id disponível.

## Estado final da fase (checkpoint pendente)
- 57 testes vitest aprovados (incl. novos: setUserVote x3, voteHistory x2, setSoundAlerts/getSoundAlerts).
- pnpm run check OK (tsc sem erros). Dev server saudável (logs limpos).
- Screenshots verificados: Home OK, /perfil mostra seção "Histórico de votos nas dicas" (empty state correto), /faq OK, /farm OK (seções de comentários com loading), /calendario OK.
- Perfil logado como "joao Santos" (doninha/owner) — histórico de votos vazio pois nenhum voto existe ainda.
- FALTA: marcar todo.md, salvar checkpoint, entregar.
- Implementação completa: EventNotificationsBell (beep Web Audio + toggle localStorage "eventSoundAlerts"); LiveEventBanner (fixed top-16, durações sabuk 60, ms-leader3 45, ms-box-red 30 min); CommentsSection (setUserVote + myVotes destaque); Profile (seção histórico de votos com alterar/remover via setUserVote); backend (db.ts setUserCommentVote/listVoteHistory/setSoundAlerts/getSoundAlerts; votes.ts listVotesByUserAndComments; routers: comments.setUserVote/myVotes, user.voteHistory/setSoundAlerts/getSoundAlerts); schema users.soundAlerts + tabela comment_votes (migração 0009 aplicada).
