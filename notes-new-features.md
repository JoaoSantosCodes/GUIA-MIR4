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
