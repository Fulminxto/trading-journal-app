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