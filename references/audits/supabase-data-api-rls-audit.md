# Supabase Data API and RLS Audit — VOLTIS LIVE/PROD

**Date:** 2026-07-16
**Branch:** `feature/workspace-redesign`
**Environment:** Supabase LIVE/PROD, branch `main`, PostgreSQL schema `public`, Free plan
**Scope:** read-only repository and database-access-path audit. No database, RLS, policy, grant, schema, migration, application, environment, or Supabase configuration was changed.

## 1. Executive summary

VOLTIS uses two materially different Supabase capabilities:

1. PostgreSQL is the application database and is accessed server-side through Prisma using `DATABASE_URL` and `DIRECT_URL`.
2. Supabase Storage is used server-side for profile avatars through a single `supabaseAdmin` client authenticated with `SUPABASE_SERVICE_ROLE_KEY`.

No repository evidence was found of Supabase Data API access to Prisma application tables: there are no table `.from(...)` calls, PostgREST requests, GraphQL requests, RPC calls, browser Supabase clients, or Supabase server clients used for table CRUD. The only `.from(...)` calls select a Storage bucket, not a PostgreSQL table.

VOLTIS authentication is NextAuth/Auth.js Credentials with JWT sessions and Prisma `User` records. It is not Supabase Auth. Consequently, `auth.uid()` does not map to `User.id`, and conventional Supabase user-facing RLS policies cannot safely express current VOLTIS authorization without introducing a verified identity bridge.

The Security Advisor evidence supplied for LIVE/PROD confirms approximately twenty `public` relations with RLS disabled. The deployed schema is consistent with 19 Prisma application tables plus `_prisma_migrations`; the prepared but unapplied `SyncOperation` migration is not included in that deployed count. The repository evidence establishes that these tables do not need Data API access. Catalog-level grant verification could not be completed in this session because the local Prisma Client was previously generated with `engine=none`, the standard query engine DLL is locked by an active Windows process, `psql`/`pg` are unavailable, and Prisma CLI does not return result rows. No database write or process termination was attempted.

The absence of verified grants means the audit must distinguish two facts:

- **confirmed:** the tables are in the Data API-exposed `public` schema and RLS is disabled according to Security Advisor;
- **not confirmed from catalogs:** whether `anon` and `authenticated` currently have effective SELECT/INSERT/UPDATE/DELETE grants on every relation.

The maximum risk is **HIGH**, not a claimed breach. If default Supabase grants are present, the public anon key—designed to be publishable—could make sensitive rows accessible or mutable through REST/GraphQL while RLS is disabled. If grants are absent, the advisor result is primarily a hardening warning. This distinction must be resolved before SQL remediation.

**Primary recommendation: Strategy C — hybrid hardening.** Treat Prisma domain tables as `PRISMA_ONLY`: remove their Data API privileges for `anon` and `authenticated`, and preferably stop exposing the application schema through Data API after compatibility tests. Keep Supabase Storage separately, server-only, with bucket/object policies reviewed independently. Do not build application-table RLS around `auth.uid()` unless VOLTIS deliberately adopts a trusted Supabase Auth identity mapping.

## 2. Environment classification

| Attribute | Finding | Confidence |
|---|---|---|
| Environment | LIVE/PROD | Confirmed by task authorization |
| Supabase branch | `main` | Confirmed by task context |
| Database | Supabase-hosted PostgreSQL | Confirmed by Prisma datasource and sanitized connection metadata |
| Primary schema | `public` | Confirmed by task context and Prisma defaults |
| Data API exposure | `public` is configured as an exposed schema | Confirmed by Security Advisor context |
| Plan | Free | Confirmed by task context |
| Prisma migration pending | `SyncOperation` migration is prepared but not applied | Confirmed locally; migration application was explicitly frozen |

The configured PostgreSQL endpoint is remote Supabase infrastructure. No connection strings, credentials, project keys, or project reference values are reproduced here.

## 3. Supabase dependencies

| Dependency/component | Location | Actual use |
|---|---|---|
| `@supabase/supabase-js` | `package.json`, lockfile | Server-side Storage client only |
| `createClient` | `lib/supabase.ts` | Creates `supabaseAdmin` with service role |
| `supabaseAdmin.storage` | `app/profile/actions.ts` | Upload, public URL generation, and removal of avatar objects |
| Prisma Client | `lib/prisma.ts` and server modules | All application-table persistence |
| NextAuth | `lib/auth-options.ts`, auth route/helpers | Application authentication and session identity |

No `createBrowserClient`, `createServerClient`, Supabase Auth adapter, PostgREST wrapper, GraphQL client, Edge Function caller, or Realtime client was found.

## 4. Environment variables

Only variable names and roles are reported.

| Variable | Read by | Boundary | Purpose | Exposure risk |
|---|---|---|---|---|
| `DATABASE_URL` | Prisma schema/runtime | Server only | Pooled PostgreSQL application connection | CRITICAL if exposed |
| `DIRECT_URL` | Prisma schema/migrations | Server/operations only | Direct PostgreSQL connection | CRITICAL if exposed |
| `BACKUP_DATABASE_URL` | Present in environment; documented backup intent | Operations only | Backup connection | CRITICAL if exposed |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts` | Name is public; imported by server-only module | Supabase project endpoint | LOW alone; assists discovery |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase.ts` | Server only via `server-only` | Privileged Storage operations | CRITICAL if exposed |
| `AUTH_SECRET` | `lib/auth-options.ts` | Server only | NextAuth JWT/session signing | CRITICAL if exposed |
| `NEXTAUTH_URL` | Auth runtime | Server/configuration | Auth callback origin | LOW alone |

Not found in repository code or current environment-name inventory: `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`, `SUPABASE_PROJECT_REF`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, and `POSTGRES_URL_NON_POOLING`.

The lack of an anon key in this repository supports “Data API not used by VOLTIS,” but it does not make exposed tables safe: Supabase anon keys are intentionally publishable and may exist in platform configuration or other clients.

## 5. Prisma access paths

`lib/prisma.ts` creates a singleton `PrismaClient`. It is imported by server pages, server actions, route handlers, auth callbacks, business services, and the seed. No Prisma import was found in a file marked `"use client"`.

Static query inventory confirms Prisma access for:

- users and authentication state;
- trading accounts, memberships, and invites;
- trades, strategies, sessions, and goals;
- ActivityLog and notifications;
- Copilot messages, patterns, memories, and review notes;
- support, release notes, maintenance mode, push subscriptions, and 2FA codes.

### Database role and RLS interaction

The exact `current_user`, `rolsuper`, and `rolbypassrls` values could not be retrieved without exposing secrets or modifying the local runtime. They remain an explicit open verification item.

Prisma behavior after enabling RLS depends on its PostgreSQL role:

- a superuser, table owner, or role with `BYPASSRLS` normally bypasses RLS;
- an ordinary role without bypass becomes subject to RLS and would need compatible policies or a different schema/grant strategy;
- `FORCE ROW LEVEL SECURITY` can affect owners and must not be introduced casually.

The pooled and direct URLs may use the same logical Supabase role through different endpoints, but this was not proven. Both usernames and role attributes must be compared before RLS changes.

## 6. Authentication architecture

VOLTIS uses NextAuth v4 with a Credentials provider, JWT sessions, Prisma users, bcrypt password verification, application-level lockout, account freeze/status, and a Prisma-backed 2FA pre-auth flow.

The authenticated identity is `session.user.id`, copied from Prisma `User.id`. No Supabase Auth SDK call, Supabase session cookie, Auth user table mapping, or Supabase JWT validation was found.

Therefore:

- `auth.uid()` is not the VOLTIS user ID;
- RLS policies joining `auth.uid()` to `User.id` would fail or be insecure;
- membership and role authorization currently happens in server code using Prisma;
- adopting Data API for domain tables would first require a deliberate, tested identity mapping or signed custom claims architecture.

## 7. Storage and Realtime

### Storage

Storage is confirmed and limited to profile avatars.

| Item | Finding |
|---|---|
| Wrapper | `lib/supabase.ts`, protected by `server-only` |
| Caller | `app/profile/actions.ts` server action |
| Bucket | Profile-image bucket constant; name omitted from this report |
| Operations | Upload, remove prior object, get public URL |
| Credential | Service role key, server-only |
| Browser SDK | None |
| Table RLS dependency | None for Prisma application tables |
| Separate security need | Storage bucket/object policy and public-object review |

The current public URL behavior means avatar objects are intentionally readable if their URL is known. Upload/delete remain server-mediated. Storage policy must be reviewed separately from `public` table RLS.

### Realtime

No `.channel()`, `.subscribe()`, presence, postgres_changes, or Realtime URL usage was found. Notifications poll/use internal Next.js API endpoints and Prisma; they do not use Supabase Realtime.

## 8. Data API usage

| Data API mechanism | Repository evidence | Decision |
|---|---|---|
| PostgREST table CRUD | None | Not used |
| `supabase.from(table)` | None | Not used |
| REST `/rest/v1` | None | Not used |
| GraphQL `/graphql/v1` | None | Not used |
| RPC | None | Not used |
| Browser Supabase client | None | Not used |
| Server Supabase table client | None | Not used |
| Edge/Supabase Functions | None | Not used |
| Storage API | Confirmed | Used, separate from table Data API |

**Classification:** Data API for Prisma tables: **no**. Supabase platform APIs overall: **partially**, because Storage is used.

## 9. Service role usage

`SUPABASE_SERVICE_ROLE_KEY` is read only by `lib/supabase.ts`, which imports `server-only`. The exported admin client is imported only by `app/profile/actions.ts`, a server action module.

No import into a Client Component or public bundle was found. There is no evidence of key logging or hardcoding. The service role is necessary only for the current server-managed Storage workflow; it is not used for database CRUD and should not be expanded to table access.

Risk classification:

- current boundary: **MEDIUM** because compromise has broad Supabase privileges, mitigated by server-only containment;
- client exposure: not found; if introduced, it would be **CRITICAL**;
- replacement with Prisma: not applicable to object storage itself;
- improvement: use the narrowest server-side Storage authorization model that meets avatar requirements and rotate the key after any suspected exposure.

## 10. Table inventory

“RLS” uses Security Advisor evidence for the deployed `public` schema. “Grants” are marked unverified where catalog rows could not be retrieved.

| PostgreSQL table / Prisma model | Sensitive | Prisma access | Data API confirmed | Browser access | Server access | RLS | anon/auth grants | service_role | Category | Recommended strategy |
|---|---:|---:|---:|---:|---:|---|---|---|---|---|
| `User` | Yes | Yes | No | No | Prisma | Disabled/reported | Unverified | Potential bypass | PRISMA_ONLY | Revoke Data API roles; keep server DB access |
| `TradingAccount` | Yes | Yes | No | No | Prisma | Disabled/reported | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `AccountMember` | Yes | Yes | No | No | Prisma | Disabled/reported | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `AccountInvite` | Yes | Yes | No | No | Prisma | Disabled/reported likely | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `Trade` | Yes | Yes | No | No | Prisma | Disabled/reported likely | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `Strategy` | Yes | Yes | No | No | Prisma | Disabled/reported likely | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `TradingSession` | Yes | Yes | No | No | Prisma | Disabled/reported likely | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `TradingGoal` | Yes | Yes | No | No | Prisma | Disabled/reported likely | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `ActivityLog` | Yes | Yes | No | No | Prisma | Disabled/reported likely | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `Notification` | Yes | Yes | No | No | Prisma | Disabled/reported likely | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `CopilotMessage` | Yes | Yes | No | No | Prisma | Disabled/reported | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `CopilotPattern` | Yes | Yes | No | No | Prisma | Disabled/reported | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `CopilotMemory` | Yes | Yes | No | No | Prisma | Disabled/reported | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `CopilotReviewNote` | Yes | Yes | No | No | Prisma | Disabled/reported likely | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `SupportTicket` | Yes | Yes | No | No | Prisma | Disabled/reported | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `ReleaseNote` | Low/Medium | Yes | No | No | Prisma | Disabled/reported | Unverified | Potential bypass | PRISMA_ONLY | Keep server-read; no Data API need |
| `MaintenanceMode` | Medium | Yes | No | No | Prisma | Disabled/reported | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API write/read access |
| `PushSubscription` | Yes | Yes | No | No | Prisma | Disabled/reported likely | Unverified | Potential bypass | PRISMA_ONLY | Remove Data API access |
| `TwoFactorCode` | Critical | Yes | No | No | Prisma | Disabled/reported likely | Unverified | Potential bypass | PRISMA_ONLY | Highest-priority Data API isolation |
| `_prisma_migrations` | Operational | Prisma Migrate | No | No | Prisma CLI | Disabled/reported | Unverified | Potential bypass | INTERNAL | Never expose to client roles |
| `SyncOperation` | Operational | Not yet deployed | No | No | Future Prisma | Not deployed | N/A | N/A | PRISMA_ONLY | Apply only after hardening/backup plan |

The current deployed-table count is 20 schema-exposed relations when `_prisma_migrations` is included and unapplied `SyncOperation` is excluded. Effective row access depends on grants still requiring catalog verification.

## 11. Current RLS state

Security Advisor confirms `RLS Disabled in Public` findings across approximately twenty relations, including the named tables. Prisma migrations create ordinary PostgreSQL tables and do not enable RLS unless SQL explicitly does so; the inspected migration history and prepared SyncOperation SQL contain no RLS statements.

No existing application RLS policy definitions were found in migrations or repository SQL. No `CREATE POLICY`, `ENABLE ROW LEVEL SECURITY`, or policy-management automation was found.

Catalog values `relrowsecurity`, `relforcerowsecurity`, and `pg_policies` could not be independently exported in this session for the tooling reasons documented above. The advisor result is accepted as authoritative environment evidence; per-table policy absence should still be exported before remediation.

## 12. Current grants

The precise `anon`, `authenticated`, and `service_role` table grants remain unverified. This is the main audit limitation.

Before remediation, run a read-only catalog export from Supabase SQL Editor or `psql` covering:

- `information_schema.role_table_grants` for `anon`, `authenticated`, and `service_role`;
- `information_schema.table_privileges`;
- `has_table_privilege` for SELECT/INSERT/UPDATE/DELETE;
- schema USAGE for `public`;
- default privileges that may grant access to future Prisma tables.

The output should contain table names and privilege types only, not row data or credentials.

## 13. Actual exposure analysis

| State | Evidence | Consequence |
|---|---|---|
| Schema exposure | Confirmed: tables are in Data API-exposed `public` | REST/GraphQL can address relations if privileges allow |
| RLS disabled | Confirmed by Security Advisor | No row filtering if a role has table privilege |
| VOLTIS browser usage | Not found | Removing Data API table access should not break repository clients |
| anon key in repository | Not found | Reduces accidental app coupling, not platform exposure |
| anon/auth grants | Unverified | Exploitability cannot be asserted or dismissed |
| service role table use | Not found | Database Data API bypass is unnecessary for VOLTIS |
| Prisma direct access | Confirmed | Server application does not need anon/auth grants |

If anon/auth grants exist, the combination of public schema, disabled RLS, and sensitive tables is an effective exposure and **HIGH** risk. If those grants are absent, the advisor findings are hardening warnings with lower immediate exploitability.

No evidence was found of past unauthorized access. This audit does not claim a breach.

## 14. Security risk classification

| Finding | Risk | Rationale |
|---|---|---|
| Sensitive `public` tables with RLS disabled and possible default grants | HIGH pending grant confirmation | Could expose users, trades, Copilot content, 2FA records, or mutations through Data API |
| `TwoFactorCode` potentially exposed | HIGH | Authentication security material, even though hashes/tokens have expiry semantics |
| `_prisma_migrations` in exposed schema | MEDIUM | Operational fingerprinting and migration history; no client need |
| Service role used for Storage | MEDIUM | Broad bypass credential, currently server-only |
| No Supabase Auth identity mapping | HIGH if RLS is attempted naively | `auth.uid()` policies would not represent VOLTIS users |
| Storage avatar URLs are public | MEDIUM/LOW depending product intent | Public readability is intentional in code but requires product confirmation |
| No Realtime/Data API dependency | INFORMATIONAL/positive | Makes privilege reduction lower risk |
| Missing documented backup script | MEDIUM operational | Documented pre-migration command cannot currently be executed from repository |
| Catalog grant verification blocked | MEDIUM uncertainty | Prevents exact exploitable-access classification |

## 15. Strategy A analysis — limit or disable Data API

This strategy fits Prisma domain tables.

| Option | Advantages | Risks/impact | Rollback |
|---|---|---|---|
| Revoke table privileges from `anon`/`authenticated` | Minimal, explicit, Prisma unaffected if its DB role differs | Must verify default privileges and any external client | Re-grant exact prior privileges from captured baseline |
| Remove `public` from exposed schemas | Strong broad isolation | May affect Supabase-managed or future Data API features; dashboard-level change | Restore exposed schema setting |
| Move app tables to private schema | Strong architecture | Large Prisma/schema migration and qualification impact | Complex schema rollback |
| Disable Data API for project | Strongest if platform permits | May interact with Storage/Auth platform expectations; verify Supabase controls | Re-enable setting |
| Keep Data API but expose a dedicated API schema | Least-privilege future path | Requires schema/view/function design | Remove dedicated schema from exposure |

Prisma uses PostgreSQL connections and should remain functional if only `anon` and `authenticated` grants are revoked. Prisma role privileges and pooling/direct roles must be verified first.

Auth impact should be none because VOLTIS does not use Supabase Auth. Storage impact should be tested separately; Storage APIs and `storage` schema policies are distinct from application `public` tables. Realtime impact should be none because it is unused, but replication/publication configuration should be checked.

## 16. Strategy B analysis — enable RLS and policies

RLS is appropriate only if VOLTIS intentionally exposes application tables via Data API. That is not current architecture.

Conceptually, a future policy system would require:

- SELECT based on verified account membership;
- INSERT/UPDATE/DELETE based on member permissions and server-equivalent role rules;
- global admin/Founder rules tied to trusted claims;
- strict isolation of ActivityLog, notifications, Copilot content, support records, and authentication artifacts;
- no policy using `USING (true)` for authenticated users;
- no direct mapping from current NextAuth `User.id` to `auth.uid()` without a signed identity bridge.

Implementing complete policies now would duplicate complex server authorization and likely diverge. It also risks breaking Prisma if its connection role does not bypass or satisfy RLS. Therefore Strategy B is not the primary recommendation.

## 17. Hybrid strategy analysis

The recommended hybrid is:

1. Prisma-only domain tables: remove `anon` and `authenticated` privileges and prevent future default grants.
2. Internal tables such as `_prisma_migrations`: remove Data API privileges; do not add application policies.
3. Storage: retain server-side use, review bucket/object policies independently, and keep service role server-only.
4. Auth: keep NextAuth/Prisma; do not create Supabase Auth RLS policies without an architecture decision.
5. Future Data API objects: expose only dedicated views/functions/schema with explicit RLS and least privilege.

This avoids inventing a second authorization system while preserving Supabase capabilities actually used.

## 18. `_prisma_migrations` treatment

`_prisma_migrations` lives in `public` because Prisma Migrate created it there. Security Advisor flags it because it is a public-schema table without RLS.

It should not be accessible to `anon` or `authenticated`, and it does not need Data API exposure. Revoking client-role privileges does not prevent Prisma Migrate when the migration connection role retains its own privileges. Enabling application RLS policies on this internal table is unnecessary and may complicate migrations.

Recommended treatment: verify and revoke Data API client-role privileges, verify default grants, retain ownership/access for the direct migration role, and test `prisma migrate status` afterward.

## 19. Recommended architecture

**Primary recommendation: C — hybrid.** Operationally it is “Prisma-only isolation for application tables plus separate Supabase Storage governance.”

Priority order:

1. Export grants, policies, owners, role flags, default privileges, and exposed-schema configuration read-only.
2. Take and verify a complete external backup.
3. Test privilege revocation against a staging clone.
4. Revoke `anon`/`authenticated` table privileges and future default privileges for Prisma-only/internal tables.
5. Consider removing `public` from Data API exposure or introducing a dedicated API schema after Storage/Auth compatibility validation.
6. Re-run Security Advisor and application smoke tests.
7. Only afterward apply the pending SyncOperation migration, ensuring new-table default privileges are safe.

Breaking-change risk is low for repository code but unknown for external/untracked clients. Rollback requires a captured grant baseline and dashboard configuration snapshot.

## 20. Minimal remediation plan

### Phase 0 — evidence

- Export catalog grants and policies.
- Confirm database and migration roles, `rolsuper`, `rolbypassrls`, ownership, and pooled/direct role equality.
- Inventory external clients, scripts, dashboards, and integrations outside this repository.
- Capture Supabase Data API exposed schemas and Realtime publications.

### Phase 1 — backup and rehearsal

- Repair or recreate the missing documented backup script in a separate approved change.
- Create a custom-format and/or plain SQL backup outside the repository.
- Restore into a disposable Supabase/PostgreSQL environment.
- Apply candidate revokes/settings there and run tests.

### Phase 2 — production hardening

- Pause writes/integrations.
- Re-run duplicate and migration preflights.
- Apply only reviewed grant/default-privilege changes.
- Verify Prisma, NextAuth, Storage, and application workflows.
- Re-run Security Advisor.

### Files/configuration likely involved later

- Supabase Dashboard Data API exposed schemas;
- reviewed SQL change/migration for grants/default privileges;
- operational backup documentation/script;
- possibly Prisma migration SQL for future-table privilege posture;
- no application code unless an external Data API dependency is discovered.

## 21. Rollback plan

Before changes, export exact grants, default privileges, policies, owners, and dashboard exposed-schema settings. Rollback should:

1. restore only the prior grants/configuration, not broadly grant all privileges;
2. re-enable any removed exposed schema only if required;
3. validate Prisma pooled/direct connections and migrations;
4. validate Storage upload/delete/public reads;
5. compare Security Advisor before/after;
6. restore the database only for actual data/schema damage, not merely a privilege regression.

## 22. Required tests

- NextAuth login, failed-login lockout, 2FA, frozen users, and logout.
- Account list/create/archive/restore and membership permission boundaries.
- Trade CRUD, manual import, automatic sync, retry skip, and equity calculations.
- ActivityLog and notifications.
- Copilot read/write paths.
- Support, release notes, and maintenance mode.
- Avatar upload, replacement, removal, and public rendering.
- `prisma migrate status`, pooled Prisma query, and direct migration connection.
- REST/GraphQL attempts with anon/authenticated credentials must fail for Prisma-only tables.
- Service role must remain absent from client bundles.
- Future Prisma-created tables must not inherit unintended client grants.

## 23. Manual backup preparation

The repository documentation recommends `pg_dump` through `scripts/backup-supabase.ps1`, but that script is currently missing. Do not rely on the documented command until the script exists and is reviewed.

A suitable manual approach uses `pg_dump` with the direct connection supplied securely at runtime, never embedded in shell history or documentation. Prefer:

- a custom-format database dump for reliable restore selection;
- a separate schema-only dump for review;
- a roles/global-objects export with `pg_dumpall --globals-only` when permissions and Supabase hosting allow it;
- a separate Supabase Storage object backup because PostgreSQL dump does not include object bodies;
- snapshots of Auth, Storage, Realtime, Data API, secrets inventory, and dashboard configuration.

Store dumps outside the repository in encrypted/private storage. Verify file size is greater than zero, inspect `pg_restore --list` for custom format, record checksums, and perform a restore rehearsal to a disposable environment.

Free-plan limitations may include limited managed backup/PITR availability, retention, project pausing, and resource constraints. Exact current Supabase plan capabilities must be confirmed in the LIVE dashboard before relying on them.

Sequence before the future migration:

1. inventory and freeze relevant writes;
2. create database and Storage/configuration backups;
3. verify non-empty files and checksums;
4. restore-test;
5. re-run duplicate and migration status preflights;
6. harden grants/default privileges or explicitly accept the reviewed posture;
7. apply migration;
8. verify catalogs and application;
9. resume sync.

## 24. Open questions

1. What exact SELECT/INSERT/UPDATE/DELETE grants do `anon` and `authenticated` have per table?
2. What default privileges will future Prisma migrations inherit?
3. Does the pooled Prisma role have `BYPASSRLS`, superuser, or table ownership?
4. Does `DIRECT_URL` use the same logical role as `DATABASE_URL`?
5. Are any clients outside this repository using REST, GraphQL, or an anon key?
6. Is `public` removable from exposed schemas without affecting Storage/Auth in this project configuration?
7. Are application tables included in Realtime publications despite no client usage?
8. Is public avatar readability an explicit product requirement?
9. Where is the backup script referenced by documentation?
10. What managed backup/PITR capability is currently enabled on the Free project?

## 25. Final go / no-go decision

**NO-GO for immediate RLS or grant changes. GO for a read-only catalog export and staging rehearsal.**

Repository evidence is strong enough to recommend Prisma-only isolation and a hybrid Storage posture, but not enough to issue production SQL safely because current grants, default privileges, connection-role bypass attributes, and external clients remain unverified.

After those facts are captured, the preferred production change is to remove Data API privileges from `anon` and `authenticated` for Prisma-only and internal tables, prevent unintended future grants, preserve the Prisma/migration roles, and keep Storage governance separate. Full domain RLS should be implemented only if VOLTIS deliberately introduces Data API clients and a trusted identity mapping.
