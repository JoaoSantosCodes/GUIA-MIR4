# Deploy na Vercel — Guia MIR4

Este documento descreve como publicar o projeto **Guia MIR4** (React 19 + Tailwind 4 + Express 4 + tRPC 11 + MySQL) na Vercel. O projeto já está hospedado automaticamente em `mir4guia-ab8pnzuc.manus.space`; use este guia caso queira um deploy independente na Vercel.

## 1. Requisitos

- Conta na [Vercel](https://vercel.com) (gratuita)
- Repositório Git com o código (o projeto está espelhado em `github.com/JoaoSantosCodes/GUIA-MIR4`)
- Um banco de dados MySQL acessível publicamente (a Vercel não fornece banco MySQL embutido)

## 2. Preparar o banco de dados

A infraestrutura hospedada fornece o banco MySQL gerenciado automaticamente. Na Vercel você precisa apontar para um MySQL externo:

| Opção | Como fazer |
|---|---|
| Aiven / PlanetScale / Supabase Postgres-compatível | Criar o serviço, copiar a connection string |
| Servidor próprio | Garantir acesso TLS público e criar o schema |

Importante: antes do deploy, aplique as migrações do Drizzle no banco externo. O arquivo `drizzle/schema.ts` contém todas as tabelas; gere e aplique com:

```bash
pnpm drizzle-kit generate   # gera o SQL em drizzle/*.sql
```

Aplique os arquivos `.sql` em ordem no seu banco externo (CREATE TABLE na ordem das migrações existentes em `drizzle/meta/_journal.json`).

## 3. Variáveis de ambiente na Vercel

No painel do projeto Vercel (Settings → Environment Variables), adicione:

| Variável | Obrigatória | Fonte / Observação |
|---|---|---|
| `DATABASE_URL` | Sim | Connection string MySQL (`mysql://usuario:senha@host:3306/mir4guia`) |
| `JWT_SECRET` | Sim | String aleatória longa usada para assinar os cookies de sessão |
| `VITE_APP_ID` | Sim | ID da aplicação OAuth — ver nota na seção 5 |
| `VITE_OAUTH_PORTAL_URL` | Sim | URL do portal de login — ver nota na seção 5 |
| `OAUTH_SERVER_URL` | Sim | Base URL do servidor OAuth — ver nota na seção 5 |

Demais variáveis (`OWNER_OPEN_ID`, `BUILT_IN_FORGE_*`, `VITE_ANALYTICS_*`) são específicas da infraestrutura Manus e podem ficar vazias na Vercel. Recursos que dependem delas (geração de imagens, notificações do dono, storage S3 interno) ficarão desativados, mas o site funciona normalmente.

## 4. Conectar o repositório

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório `JoaoSantosCodes/GUIA-MIR4`.
2. Configure as variáveis de ambiente da seção 3.
3. **Build Output Directory**: deixe vazio — o `vercel.json` já define o build como `pnpm build`.
4. Clique em Deploy.

## 5. Sobre o login (OAuth Manus)

O sistema de login usa o OAuth da plataforma Manus. Para que o login funcione fora da infraestrutura Manus, as variáveis `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL` e `OAUTH_SERVER_URL` devem apontar para o mesmo portal. Se preferir autenticação independente (e-mail/senha, Google etc.), é necessário substituir `server/_core/oauth.ts` por um provedor próprio — fora do escopo deste guia.

## 6. Scripts e comandos

```bash
pnpm install        # dependências
pnpm build          # vite build (client) + esbuild (server) → dist/
pnpm start          # serve o bundle de produção
pnpm test           # suíte vitest
```

O `vercel.json` incluído configura o build e roteia `/api/*` e demais rotas para o bundle `dist/index.js` gerado pelo esbuild.

## 7. Limitações conhecidas na Vercel

- **Serverless**: a Vercel executa cada requisição em um ambiente serverless com tempo máximo de execução (60s no plano gratuito). As rotas do site são leves e não devem ser afetadas.
- **WebSockets / processos de fundo**: não funcionam no ambiente serverless (o projeto não usa).
- **Storage S3 interno**: uploads de mídia dependem do storage da infraestrutura Manus; na Vercel, use um S3 próprio ou substitua `server/storage.ts`.
- **Migrações**: não há comando `pnpm db:push` automático no deploy — aplique as migrações manualmente no banco externo (seção 2) antes de subir.

## 8. Healthcheck pós-deploy

1. Abra a URL `*.vercel.app` e verifique a home.
2. Confirme que `/novidades`, `/placar`, `/perfil` carregam.
3. Se o login não funcionar, confira as variáveis de OAuth (seção 5).
