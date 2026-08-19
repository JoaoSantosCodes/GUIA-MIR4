# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Guia Completo MIR4** — A comprehensive community guide for the MIR4 MMORPG, built as a full-stack React/TypeScript application with real-time community features.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Wouter (routing), TanStack Query, TailwindCSS 4, Radix UI primitives
- **Backend**: Express, tRPC (type-safe API), Drizzle ORM (MySQL/TiDB Cloud)
- **Auth**: OAuth via Manus (session cookies + Bearer token fallback)
- **Package Manager**: pnpm 10.x
- **Testing**: Vitest

## Project Structure

```
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # UI components (shadcn/ui pattern)
│   │   ├── pages/             # Route-level page components
│   │   ├── contexts/          # React contexts (Theme, etc.)
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Client utilities (trpc, utils)
│   │   ├── _core/             # Core client logic (auth hook)
│   │   ├── App.tsx            # Routes + providers
│   │   └── main.tsx           # Entry point
│   └── public/                # Static assets
├── server/                    # Express + tRPC backend
│   ├── _core/                 # Core server modules
│   │   ├── index.ts           # Server entry (dev/prod)
│   │   ├── trpc.ts            # tRPC initialization + procedures
│   │   ├── context.ts         # Request context (auth)
│   │   ├── db.ts              # Database operations
│   │   ├── env.ts             # Environment validation
│   │   ├── oauth.ts           # OAuth routes
│   │   ├── cookies.ts         # Cookie helpers
│   │   ├── vite.ts            # Vite dev/prod integration
│   │   └── ...                # Other core modules
│   ├── routers.ts             # Main tRPC router (all procedures)
│   ├── db.ts                  # Database query functions
│   └── *.test.ts              # Vitest tests
├── shared/                    # Shared types & data (client + server)
│   ├── guideData.ts           # All guide content (spirits, codex, farm, classes, etc.)
│   ├── const.ts               # Shared constants (cookie names, error messages)
│   ├── types.ts               # Shared TypeScript types
│   └── ...
├── drizzle/
│   ├── schema.ts              # Database schema (MySQL)
│   └── migrations/            # Generated migrations
└── dist/                      # Production build output
```

## Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (tsx watch + Vite) |
| `pnpm build` | Production build (Vite client + esbuild server) |
| `pnpm start` | Run production server from `dist/` |
| `pnpm check` | TypeScript type-check (no emit) |
| `pnpm format` | Prettier format all files |
| `pnpm test` | Run Vitest tests |
| `pnpm db:push` | Generate + run Drizzle migrations |

## Architecture Highlights

### tRPC Router Structure (`server/routers.ts`)
- **publicProcedure** — No auth required
- **protectedProcedure** — Requires valid user session
- **adminProcedure** — Requires admin role
- Organized by feature routers: `guide`, `favorites`, `codex`, `farm`, `classes`, `tierlist`, `community`, `share`, `system`

### Database (Drizzle + MySQL/TiDB)
- **Core tables**: `users`, `favorites`, `codexProgress`, `farmComments`, `commentVotes`, `tierlistVotes`, `tierlistVotesSpirit`, `tierlistHistory`, `tierlistHistorySpirit`
- Lazy DB connection in `server/db.ts:getDb()` — handles missing `DATABASE_URL` gracefully
- Schema defined in `drizzle/schema.ts` with MySQL dialect

### Shared Guide Data (`shared/guideData.ts`)
Single source of truth for all guide content (~2500 lines):
- `SPIRITS`, `CODEX_ITEMS`, `FARM_SPOTS`, `CLASSES`, `RAIDS`, `SABUK_CONTENT`, `MYSTERIES`, `SEAL_GUIDE`, `CLASS_SKILLS`, `EQUIPMENT_TYPES`, `MATERIALS`, `LEVELING_GUIDE`, `TIER_SCENARIOS`, `CURRENCIES`, `ECONOMY_TIPS`, etc.
- Stable keys used for favorites/progress: `itemType:itemKey` (e.g., `spirit:styx`)

### Authentication
- OAuth flow with Manus (`server/_core/oauth.ts`)
- Session cookie: `app_session_id` (1 year, HttpOnly, Secure, SameSite=Lax)
- CSRF-protected state cookie: `__Host-oauth_state`
- Client falls back to `sessionStorage` Bearer token for iframe/private browsing scenarios (`client/src/main.tsx`)

### Client Routing (Wouter)
Routes defined in `client/src/App.tsx`:
- `/` Home, `/espiritos`, `/codex`, `/farm`, `/classes`, `/economia`, `/raids`, `/tier-list`, `/nivel`, `/sabuk`, `/misterios`, `/selos`, `/calendario`, `/calculadora`, `/subclasses`, `/equipamentos`, `/materiais`, `/perfil`, `/share/:id`, `/faq`, `/placar`, `/novidades`

### UI Components
- shadcn/ui pattern in `client/src/components/ui/` (Radix + Tailwind)
- `GuideLayout` (`client/src/components/GuideLayout.tsx`) — main layout with sidebar, search, theme toggle, notifications
- Dark theme default with system preference detection

## Environment Variables

Required (see `.project-config.json`):
- `DATABASE_URL` — MySQL connection string (TiDB Cloud)
- `JWT_SECRET` — For session signing
- `OAUTH_SERVER_URL` — Manus OAuth endpoint
- `OWNER_OPEN_ID` — Admin user identifier
- `BUILT_IN_FORGE_API_KEY/URL` — External API integration
- `VITE_*` — Client-exposed config (analytics, app title, etc.)

## Development Notes

- **Path aliases**: `@/*` → `client/src/*`, `@shared/*` → `shared/*` (tsconfig.json)
- **Patched dependency**: `wouter@3.7.1` via `patches/wouter@3.7.1.patch`
- **Vite plugins**: React, Tailwind, Manus runtime, JSX location tracking, custom debug log collector
- **Production**: Server serves static files from `dist/public/`, API at `/api/trpc`
- **Port auto-detection**: Server finds available port starting from 3000 (`server/_core/index.ts`)

## Testing
- Test files: `server/*.test.ts`, `server/guide.features.test.ts`, `server/news.test.ts`, `server/chapterAchievements.test.ts`
- Run with `pnpm test` (Vitest)