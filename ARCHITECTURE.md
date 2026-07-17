# VOLTIS — Architecture

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL / Supabase
- NextAuth
- Recharts

## Core Structure
- `app/` — pages, layouts, route handlers, server actions
- `components/` — reusable UI and app components
- `components/ui/` — shared base UI primitives
- `lib/` — business logic, auth, prisma, utilities
- `prisma/` — database schema and migrations
- `public/` — static assets and icons

## Main Product Areas
- Authentication
- Account selection
- Dashboard
- Diary
- Calendar
- Equity
- Analytics
- Reports
- Rules / Playbook
- Members
- Copilot
- Notifications
- Admin
- Profile / Settings
- Support
- Maintenance / Frozen states

## Persistent Trade Synchronization

Automatic MT5 synchronization uses a durable three-stage protocol:

```text
POST /api/trade-sync/operations/start
POST /api/trade-sync/import              (operationId + deterministic itemKey)
POST /api/trade-sync/operations/[operationId]/complete
```

All stages use the shared connector secret and shared account/source authorization. `SyncOperation` owns the batch lifecycle, `SyncOperationItem` provides durable per-item replay and receipt-derived counters, and `SyncOperationEffect` provides the post-completion push outbox.

Completion uses one database transaction for terminal status and counters, account connected state, conditional equity recalculation, aggregate automatic ActivityLog, member Notifications, and pending push-effect rows. Push delivery occurs only after commit and is retried through concurrency-safe durable claims. Terminal completion retries replay persisted state without duplicating database effects.

The MT5 connector collects its exact trade list before start, reuses stable request identities across three bounded attempts with a 500 ms delay, continues after controlled item failures, and never falls back to legacy unbound import after starting a batch. Connector and server metadata/logging exclude secrets, raw payloads, external identifiers, and exception details.

## Role System
Global roles:
- OWNER
- ADMIN
- MEMBER
- VIEWER

Account membership roles:
- OWNER
- ADMIN
- MEMBER
- VIEWER

## Architecture Rules
- Do not duplicate business logic inside UI components.
- Keep permission checks server-side where possible.
- Never expose private database logic to client components.
- Keep shared UI reusable and consistent.
- Avoid one-off styling unless documented in `UI_RULES.md`.
- Any new route must respect auth, account membership, and role permissions.

## Future Compatibility
VOLTIS should remain compatible with a future assistant layer that can:
- read trading data
- answer project/account questions
- trigger safe actions
- respect permissions
- log actions
