# VOLTIS — Security Rules

## Core Principle
Security is enforced server-side.

Client-side restrictions are never considered sufficient.

---

## Authentication
Rules:
- All protected routes must require valid authentication.
- No sensitive page can rely only on client checks.
- Session validation must happen server-side.

---

## Authorization
Rules:
- Every account action must validate membership.
- Every privileged action must validate role permissions.
- UI visibility does not equal permission.

---

## Database
Rules:
- Sensitive queries stay server-side.
- Prisma logic must never be exposed to the client.
- Supabase RLS must be used where applicable.
- Service role keys must never be exposed.

---

## API Security
Rules:
- Validate all input.
- Reject malformed requests.
- Protect all mutation endpoints.
- Never trust client payloads.

---

## Secrets
Rules:
- All secrets stay in .env
- Never hardcode secrets
- Never expose tokens in logs
- Never commit private keys

---

## Logging
Rules:
- Important actions should be traceable.
- Sensitive actions should be logged.

Examples:
- role changes
- member removals
- account deletions
- trade imports

---

## AI Safety Rule
Before creating:
- routes
- actions
- APIs
- auth flows

AI assistants must review:
1. role permissions
2. membership validation
3. data exposure risk
4. server/client boundaries

---

## Pre-Deploy Checklist
Before deployment:
- run build
- run security scan
- review permissions
- test role boundaries
- test auth flows
- review exposed env usage