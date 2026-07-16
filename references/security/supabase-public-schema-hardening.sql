-- VOLTIS Supabase public-schema hardening plan
-- STATUS: DOCUMENTATION ONLY — NOT APPLIED
-- TARGET: Supabase LIVE/PROD, project voltis-production, branch main
-- DATE PREPARED: 2026-07-16
--
-- This file intentionally keeps every state-changing statement commented out.
-- Do not execute without a verified backup, maintenance window, catalog preflight,
-- staging rehearsal, and explicit production approval.
--
-- Verified baseline:
--   * public contains the 20 tables listed below.
--   * anon, authenticated, and service_role have no USAGE on public.
--   * those roles have no effective table privileges on the listed tables.
--   * PUBLIC has no table grants.
--   * postgres owns the tables and is the Prisma connection role.
--   * postgres is not superuser, has BYPASSRLS, and retains full privileges.
--   * RLS is disabled and no policies exist.
--   * no custom pg_default_acl entries currently exist.
--
-- This plan does not touch auth, storage, buckets, objects, Storage policies,
-- Realtime, application data, Prisma schema, or application code.

-- ==========================================================================
-- 1. PRE-APPLICATION READ-ONLY VERIFICATION
-- ==========================================================================

-- Confirm tables, owners, and RLS state.
SELECT
  c.relname AS table_name,
  pg_get_userbyid(c.relowner) AS owner,
  c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS rls_forced
FROM pg_class AS c
JOIN pg_namespace AS n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind IN ('r', 'p')
ORDER BY c.relname;

-- Confirm policies remain absent or review every returned policy.
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Confirm declared grants for Data API roles and PUBLIC.
SELECT table_name, grantee, privilege_type, is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated', 'service_role', 'PUBLIC')
ORDER BY table_name, grantee, privilege_type;

-- Confirm default privileges before changing them.
SELECT
  pg_get_userbyid(d.defaclrole) AS owner,
  COALESCE(n.nspname, 'ALL_SCHEMAS') AS schema_name,
  d.defaclobjtype AS object_type,
  d.defaclacl::text AS acl
FROM pg_default_acl AS d
LEFT JOIN pg_namespace AS n ON n.oid = d.defaclnamespace
WHERE n.nspname = 'public' OR n.nspname IS NULL
ORDER BY owner, schema_name, object_type;

-- ==========================================================================
-- 2. EXPLICIT DEFENSIVE TABLE REVOKES — COMMENTED, NOT APPLIED
-- ==========================================================================

-- Apply only after verifying this list exactly matches the intended Prisma and
-- internal tables. These revokes are idempotent against the verified baseline.

-- BEGIN;

-- REVOKE ALL PRIVILEGES ON TABLE public."AccountInvite" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."AccountMember" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."ActivityLog" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."CopilotMemory" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."CopilotMessage" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."CopilotPattern" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."CopilotReviewNote" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."MaintenanceMode" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."Notification" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."PushSubscription" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."ReleaseNote" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."Strategy" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."SupportTicket" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."Trade" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."TradingAccount" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."TradingGoal" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."TradingSession" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."TwoFactorCode" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."User" FROM anon, authenticated;
-- REVOKE ALL PRIVILEGES ON TABLE public."_prisma_migrations" FROM anon, authenticated;

-- PUBLIC currently has no grants. These are defensive and must remain explicit.
-- REVOKE ALL PRIVILEGES ON TABLE public."AccountInvite" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."AccountMember" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."ActivityLog" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."CopilotMemory" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."CopilotMessage" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."CopilotPattern" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."CopilotReviewNote" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."MaintenanceMode" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."Notification" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."PushSubscription" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."ReleaseNote" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."Strategy" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."SupportTicket" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."Trade" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."TradingAccount" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."TradingGoal" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."TradingSession" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."TwoFactorCode" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."User" FROM PUBLIC;
-- REVOKE ALL PRIVILEGES ON TABLE public."_prisma_migrations" FROM PUBLIC;

-- service_role currently has no public schema/table privileges. Keep this block
-- optional and separately approved because the key remains required for Storage.
-- These statements affect public tables only, not the storage schema.
-- REVOKE ALL PRIVILEGES ON TABLE public."AccountInvite" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."AccountMember" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."ActivityLog" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."CopilotMemory" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."CopilotMessage" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."CopilotPattern" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."CopilotReviewNote" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."MaintenanceMode" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."Notification" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."PushSubscription" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."ReleaseNote" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."Strategy" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."SupportTicket" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."Trade" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."TradingAccount" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."TradingGoal" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."TradingSession" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."TwoFactorCode" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."User" FROM service_role;
-- REVOKE ALL PRIVILEGES ON TABLE public."_prisma_migrations" FROM service_role;

-- COMMIT;

-- ==========================================================================
-- 3. DEFAULT PRIVILEGES — COMMENTED, OWNER-SENSITIVE
-- ==========================================================================

-- Verified baseline: no custom default ACL rows are present.
-- PostgreSQL normally grants new table privileges only to the owner. The
-- following statements document defensive intent but MUST be run by, or FOR,
-- the exact role that future Prisma migrations use. Re-check current_user and
-- object ownership immediately before application.

-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
--   REVOKE ALL PRIVILEGES ON TABLES FROM anon, authenticated, service_role, PUBLIC;

-- Sequences may be created by future autoincrement fields. Keep client roles
-- isolated from them as well, after explicit review.
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
--   REVOKE ALL PRIVILEGES ON SEQUENCES FROM anon, authenticated, service_role, PUBLIC;

-- Do not grant USAGE on public to Data API roles as part of this plan.
-- Do not touch storage or auth schema privileges.

-- ==========================================================================
-- 4. DATA API EXPOSED-SCHEMA CHANGE — DASHBOARD, NOT SQL
-- ==========================================================================

-- After staging verification, remove public from the Supabase Data API exposed
-- schemas in Dashboard/API settings. This is deliberately not represented as
-- SQL here. Preserve a screenshot/export of the previous setting for rollback.
-- Verify avatar upload/read/remove after the change; Storage uses separate APIs.

-- ==========================================================================
-- 5. POST-APPLICATION READ-ONLY VERIFICATION
-- ==========================================================================

-- Expected: false for every privilege and Data API role.
SELECT
  c.relname AS table_name,
  r.rolname AS role_name,
  has_schema_privilege(r.rolname, 'public', 'USAGE') AS schema_usage,
  has_table_privilege(r.rolname, c.oid, 'SELECT') AS can_select,
  has_table_privilege(r.rolname, c.oid, 'INSERT') AS can_insert,
  has_table_privilege(r.rolname, c.oid, 'UPDATE') AS can_update,
  has_table_privilege(r.rolname, c.oid, 'DELETE') AS can_delete,
  has_table_privilege(r.rolname, c.oid, 'TRUNCATE') AS can_truncate,
  has_table_privilege(r.rolname, c.oid, 'REFERENCES') AS can_reference,
  has_table_privilege(r.rolname, c.oid, 'TRIGGER') AS can_trigger
FROM pg_class AS c
JOIN pg_namespace AS n ON n.oid = c.relnamespace
CROSS JOIN pg_roles AS r
WHERE n.nspname = 'public'
  AND c.relkind IN ('r', 'p')
  AND r.rolname IN ('anon', 'authenticated', 'service_role')
ORDER BY c.relname, r.rolname;

-- Expected: Prisma role remains owner, BYPASSRLS=true, all privileges true.
SELECT
  current_user AS prisma_role,
  r.rolsuper,
  r.rolbypassrls,
  r.rolcanlogin
FROM pg_roles AS r
WHERE r.rolname = current_user;

-- Confirm there are no accidental grants or policies.
SELECT table_name, grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated', 'service_role', 'PUBLIC')
ORDER BY table_name, grantee, privilege_type;

SELECT tablename, policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ==========================================================================
-- 6. ROLLBACK NOTES — COMMENTED, NO BROAD GRANTS
-- ==========================================================================

-- The verified baseline has no anon/authenticated/service_role/PUBLIC grants,
-- so the defensive REVOKE statements require no SQL rollback.
--
-- If public was removed from exposed schemas, rollback only that dashboard
-- setting after reviewing why a Data API client requires it.
--
-- Do NOT use GRANT ALL as rollback. If a future approved client needs access,
-- create a dedicated API surface with least privilege, RLS, and trusted identity.
-- Example template only; intentionally not executable:
--   GRANT <SPECIFIC_PRIVILEGE> ON <DEDICATED_VIEW_OR_FUNCTION> TO <ROLE>;
--
-- Never grant direct access to TwoFactorCode, User, Trade, ActivityLog,
-- PushSubscription, Copilot content, or _prisma_migrations without a separate
-- threat model and explicit approval.
