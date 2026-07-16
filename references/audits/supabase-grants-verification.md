# Supabase LIVE/PROD Data API Grants Verification

**Date:** 2026-07-16
**Branch:** `feature/workspace-redesign`
**Project:** `voltis-production`, Supabase `main`, schema `public`
**Method:** read-only PostgreSQL catalog queries plus repository inspection

No rows from application tables were read. No role switch, grant, revoke, RLS, policy, schema, database, Prisma, migration, code, Storage, Auth, or Supabase configuration change was performed.

## 1. Executive summary

The final catalog verification materially narrows the risk identified by the Supabase Security Advisor.

All 20 deployed tables in `public` have RLS disabled and no policies, but the three Supabase Data API roles tested—`anon`, `authenticated`, and `service_role`—have no `USAGE` privilege on `public` and no effective table privilege on any of the 20 tables. The tested privileges were SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, and TRIGGER.

There are no grants to `PUBLIC` on these tables. There are also no custom `pg_default_acl` entries for `public`; new tables created under ordinary PostgreSQL defaults do not automatically grant table privileges to `PUBLIC`, `anon`, `authenticated`, or `service_role`.

The Prisma connection uses role `postgres`. It owns all 20 tables, can log in, is not a superuser, and has `BYPASSRLS`. It has all tested effective privileges with grant option. Revoking privileges from `anon` and `authenticated` would not affect Prisma because those roles are distinct and Prisma is the owner.

Classification is therefore:

- `EXPOSED_AND_GRANTED`: 0
- `EXPOSED_NO_EFFECTIVE_GRANTS`: 20
- `SERVICE_ROLE_ONLY`: 0
- `PRISMA_ONLY`: 0 as the mutually exclusive exposure category
- `UNCLEAR`: 0

Operationally, all 20 tables are Prisma-only today. They are classified as `EXPOSED_NO_EFFECTIVE_GRANTS` rather than `PRISMA_ONLY` only because `public` remains the configured Data API schema and the classification definitions prioritize schema exposure.

The confirmed maximum risk is **LOW**: RLS-disabled warnings are accurate hardening findings, but there is no effective Data API table access for the tested roles. This is not evidence of a breach or accessible data.

Recommended strategy: retain and codify the no-grant posture, add explicit defensive per-table revokes and safe default-privilege controls in a reviewed change, and separately remove `public` from Data API exposed schemas after a staging/dashboard compatibility check. Do not introduce NextAuth-incompatible RLS policies. Storage remains separate and unaffected.

## 2. Prisma role

| Attribute | Verified value |
|---|---|
| `current_user` / `rolname` | `postgres` |
| `rolsuper` | false |
| `rolbypassrls` | true |
| `rolcanlogin` | true |
| Table ownership | Owner of all 20 deployed `public` tables |
| Schema `public` USAGE | true |
| Effective table privileges | All tested privileges on all 20 tables |
| Grantability | Owner privileges reported grantable |

The Prisma role is independent from `anon`, `authenticated`, and `service_role`. A targeted revoke from those Data API roles leaves Prisma ownership and privileges unchanged.

Because the role has `BYPASSRLS`, ordinary RLS activation would not filter Prisma queries. However, relying on bypass is unnecessary for the proposed hardening, and `FORCE ROW LEVEL SECURITY` remains outside scope.

## 3. Grant anon

Verified across all 20 tables:

- schema `public` USAGE: false;
- SELECT: false;
- INSERT: false;
- UPDATE: false;
- DELETE: false;
- TRUNCATE: false;
- REFERENCES: false;
- TRIGGER: false;
- direct catalog grant rows: none.

Even if an anon API key is known, the role cannot resolve/use `public` or access these tables under the current privilege state.

## 4. Grant authenticated

Verified across all 20 tables:

- schema `public` USAGE: false;
- all seven tested table privileges: false;
- direct catalog grant rows: none.

VOLTIS does not use Supabase Auth, so this role is also not part of application identity or authorization.

## 5. Grant service_role

Verified for `public`:

- schema USAGE: false;
- all tested table privileges: false;
- direct catalog grant rows: none.

The repository service-role key is used through Supabase Storage APIs, whose backing objects and policies are in the separate `storage` schema. The absence of `public` privileges does not prevent the existing avatar workflow.

This result also confirms that the server-side Supabase client is not a second table-access path for Prisma models.

## 6. Grant PUBLIC

`information_schema.table_privileges` returned no `PUBLIC` grants for the 20 tables. Because `has_table_privilege` for the named roles is also false, no inherited PUBLIC privilege creates effective access.

No custom default ACL rows were found for `public` or global object defaults. PostgreSQL's ordinary table defaults grant privileges to the owner only.

## 7. Complete results

All rows share these verified properties unless stated otherwise:

- owner: `postgres`;
- RLS enabled: no;
- RLS forced: no;
- policies: none;
- anon/authenticated/service_role schema USAGE: no;
- anon/authenticated/service_role SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER: all no;
- Prisma role: all tested privileges yes.

| Table | Owner | RLS | Policies | anon | authenticated | service_role | Prisma | Classification |
|---|---|---:|---:|---|---|---|---|---|
| `AccountInvite` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `AccountMember` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `ActivityLog` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `CopilotMemory` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `CopilotMessage` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `CopilotPattern` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `CopilotReviewNote` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `MaintenanceMode` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `Notification` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `PushSubscription` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `ReleaseNote` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `Strategy` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `SupportTicket` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `Trade` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `TradingAccount` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `TradingGoal` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `TradingSession` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `TwoFactorCode` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `User` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |
| `_prisma_migrations` | postgres | Off | 0 | None | None | None | Full | EXPOSED_NO_EFFECTIVE_GRANTS |

### Category totals

| Category | Count |
|---|---:|
| EXPOSED_AND_GRANTED | 0 |
| EXPOSED_NO_EFFECTIVE_GRANTS | 20 |
| SERVICE_ROLE_ONLY | 0 |
| PRISMA_ONLY | 0 |
| UNCLEAR | 0 |

## 8. RLS state

`relrowsecurity=false` and `relforcerowsecurity=false` for every table. The Security Advisor warning is factually correct because these are ordinary tables in `public` without RLS.

RLS is not currently the protection boundary. PostgreSQL schema and table privileges are: the Data API roles lack schema USAGE and table privileges.

Enabling RLS solely to silence the advisor would add policy complexity without improving current effective access. It could also create future confusion because VOLTIS identity is NextAuth/Prisma, not `auth.uid()`.

## 9. Policies present

`pg_policies` returned zero rows for `public`. There are no SELECT, INSERT, UPDATE, DELETE, permissive, or restrictive policies on the 20 tables.

No policy is needed for roles that have no access. If Data API use is introduced later, it must be designed with a trusted identity mapping rather than permissive generic policies.

## 10. Prisma impact

Targeted revokes from `anon`, `authenticated`, and optionally `service_role` do not touch the `postgres` owner role. Prisma, NextAuth, server actions, route handlers, migration status, and application queries remain unchanged.

Removing `public` from Data API exposed schemas is a PostgREST/API configuration change, not a PostgreSQL connection change. Prisma connects directly through PostgreSQL and is not dependent on the Data API exposed-schema list.

The role has `BYPASSRLS`, but the recommended strategy does not depend on adding RLS.

## 11. Storage impact

Repository verification remains unchanged:

- `lib/supabase.ts` imports `server-only`;
- it creates `supabaseAdmin` with the service-role key;
- `app/profile/actions.ts` uses `.storage.from(...)` for avatar upload, removal, and public URL generation;
- no table `.from(...)` exists;
- no Realtime usage exists.

Revoking privileges on `public.*` does not modify the `storage` schema, buckets, objects, object policies, or service-role key. Removing `public` from Data API exposed schemas should not affect Storage endpoints, but it must be verified in staging and with an avatar smoke test before production change.

## 12. Comparison of the two solutions

| Dimension | Remove `public` from exposed schemas | Explicit per-table revokes |
|---|---|---|
| Current access reduction | Defense in depth; effective grants already zero | Idempotent defense; current grants already zero |
| Prisma | No impact expected | No impact |
| NextAuth | No impact expected | No impact |
| Storage | Separate API; test required | No impact on `storage` |
| Future tables | Strong if `public` remains unexposed | Requires safe default privileges and migration discipline |
| Reversibility | Dashboard/config rollback | Re-grant captured baseline; current baseline is none |
| Security Advisor | May or may not clear RLS linter; verify | Likely does not clear RLS-disabled warning |
| External clients | Could break unknown Data API clients | Breaks only clients relying on revoked roles |
| Auditability | Dashboard setting must be documented | SQL can be reviewed/versioned |

The two measures are complementary. The exposed-schema change removes the API routing surface; explicit revokes make the database safe even if `public` is re-exposed later.

## 13. Recommended strategy

Use a controlled combination:

1. Preserve the current zero-grant state.
2. Apply explicit, table-by-table defensive revokes from `anon` and `authenticated`; include `_prisma_migrations`.
3. Optionally repeat for `service_role` on `public` to codify the currently verified absence, while leaving Storage untouched.
4. Confirm and codify safe default privileges for the actual migration owner so future Prisma tables do not acquire Data API grants.
5. Remove `public` from Data API exposed schemas after staging and avatar compatibility tests.
6. Do not add application-table RLS policies unless Data API use and an identity bridge are intentionally introduced.

Because the current state already denies access, priority is **P2 hardening**, not emergency incident response.

## 14. Application plan

No step below was executed.

1. Take database, Storage, and dashboard configuration backups.
2. Snapshot current exposed schemas and catalog grants.
3. Re-run this catalog verification immediately before change.
4. Apply the reviewed explicit per-table revokes in a transaction.
5. Apply reviewed default-privilege changes for the exact object owner only.
6. Verify `has_schema_privilege` and all seven table privileges remain false for Data API roles.
7. Run Prisma, NextAuth, trade, Activity, admin, and avatar tests.
8. Remove `public` from exposed schemas in a planned dashboard window.
9. Repeat application and Storage tests.
10. Re-run Security Advisor and record whether its RLS warning persists despite the non-exposed/no-grant state.

The companion SQL file is a commented, non-applied plan with explicit table names and verification queries.

## 15. Rollback plan

The current baseline contains no Data API grants, so defensive revokes do not require privilege rollback. If a future discovered external client needs access, do not broadly restore ALL privileges. Instead:

1. restore `public` to exposed schemas only if it was removed;
2. grant only the required operation on a dedicated view/function/schema;
3. add appropriate RLS and identity mapping;
4. avoid granting direct access to sensitive Prisma tables;
5. verify Prisma and Storage after every configuration reversal.

The SQL companion includes commented rollback templates but deliberately does not prescribe grants that are absent from the baseline.

## 16. Required tests

- Catalog verification for all roles and privileges.
- Prisma pooled read/write smoke test.
- Prisma direct connection and `migrate status`.
- NextAuth credentials login, lockout, 2FA, and session refresh.
- Account membership and permission checks.
- Trade CRUD and automatic sync.
- ActivityLog, notifications, Copilot, support, release notes, and maintenance mode.
- Avatar upload, replacement, removal, and public rendering.
- REST and GraphQL table access attempts with anon/authenticated credentials must fail.
- Storage operations with the server-only service role must continue.
- A disposable future Prisma table must inherit no Data API role privileges.
- Dashboard exposed-schema rollback rehearsal.

## 17. Go / no-go final

**GO for a separately approved hardening change; NO-GO for applying this plan during the audit.**

The catalog evidence is complete: no current Data API role has effective access, and Prisma is safely independent. The hardening is preventive and reversible. Before production application, confirm backups, test the exposed-schema change against Storage in staging, review the exact default-privilege owner context, and approve the companion SQL line by line.
