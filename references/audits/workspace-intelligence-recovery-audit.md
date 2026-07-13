# Workspace Intelligence Recovery Audit

**Audit date:** 2026-07-12  
**Scope:** Read-only recovery from Git plus comparison with the current application. No application source was changed.  
**Immediate predecessor examined:** `HEAD` / `bcb6e76` (`checkpoint: account experience before workspace redesign`) for the three required files.  
**Earlier lineage examined:** `1bd9481` (`Improve workspace layout and live presence`) because it is the implementation that actually used the title “Workspace Intelligence” and explains the still-current skeleton.  
**Current state:** the working-tree route redirects `/accounts/[accountId]/workspace` to `/accounts/[accountId]/dashboard`.

## Executive conclusion

Do not restore Workspace or Account Hub.

The immediate pre-redirect Workspace was mostly a permission-aware account navigation/readiness hub. Its legitimate collaboration content consisted of a four-person account-presence preview (name, role, and global user last activity/last seen), a five-event account audit preview, a member count, and a link to Members. It did not invite, remove, change roles, edit permissions, or convert an account.

The current Members area already preserves the real people-management capabilities and, in several respects, exceeds the immediate predecessor: full roster, pending invitations, invite/cancel/accept/decline flows, role changes, seven editable granular permissions, removal, creator protection, last-manager protection, joined date, and last-seen display. The global Activities page preserves the general audit viewer. Manage Account preserves account creation (including directly creating a `SHARED` type when globally allowed), archive, restore, delete, member count, and account summaries.

Two material gaps remain:

1. Standard Members actions do not call `logActivity`, so invitations, removals, role changes, and permission changes performed through the account Members flow are not reliably represented in `ActivityLog`/Activities. The former audit preview could display such event names, but its own Members flow did not generate those records.
2. No personal-to-shared conversion/evolution action exists. The application can create a new `SHARED` account and can add members to any account, but cannot change an existing account's `type` or guide a personal account into collaboration.

Recommended outcome: **B. Extend Members with specific missing collaboration functions**, narrowly: add account-scoped activity logging/notification coverage for membership lifecycle changes and define an honest collaboration-setup state/entry point. If product semantics require changing `TradingAccount.type` to `SHARED`, the mutation belongs under Manage Account, while the people setup remains in Members. No new collaboration destination is justified.

## Method and recovery boundary

- Read every document currently under `references/` as project specification.
- Queried the existing knowledge graph. The graphify launcher could not start because its saved Windows Store Python interpreter no longer exists; the existing `graphify-out/graph.json` was inspected directly without rebuild/update.
- Used `git show HEAD:<path>` for the required last committed files; nothing was checked out or restored.
- Compared current source for Members, its server actions and client forms, member detail, Manage Account, account actions, Activities, Prisma schema, activity helpers, and permission helpers.
- Examined `1bd9481` only to distinguish the collaboration-centric “Workspace Intelligence” lineage from the immediate command-hub predecessor and to classify the stale skeleton accurately.

## 1. Recovered immediate pre-redirect Workspace

### Required files

| File | Recovered state |
|---|---|
| `app/accounts/[accountId]/workspace/page.tsx` | 911-line server component at `HEAD`; replaced in the working tree by a Dashboard redirect. |
| `app/accounts/[accountId]/workspace/loading.tsx` | Imports and renders `WorkspaceSkeleton`; unchanged by the redirect. |
| `components/skeletons/WorkspaceSkeleton.tsx` | Client skeleton for the older collaboration-centric layout; unchanged and no longer structurally matches the 911-line command hub. |

### Authentication, access, and side effects

The former page:

1. Called `auth()` and redirected unauthenticated users to `/login`.
2. Queried `AccountMember` by current `userId` and `tradingAccountId`, including the related `TradingAccount` and `User`.
3. Redirected non-members to `/accounts`.
4. Allowed access only when the membership role was `MANAGER` or `canViewMembers` was true; otherwise redirected to Dashboard.
5. Redirected archived accounts to Dashboard.
6. Updated the current user's `lastSeenAt` and `lastActivityAt` merely by viewing Workspace.

This was a read/display route apart from the user-presence timestamp update. It had no collaboration mutations.

### Queries

After membership resolution, it ran six queries in parallel:

| Query | Exact data |
|---|---|
| Members | All `AccountMember` rows for the account, including full related `User`, ordered by membership `createdAt` ascending. |
| Recent activities | Account-scoped `ActivityLog`, including `user`, newest first, limited to 5. |
| Trades count | `Trade.count` for `tradingAccountId`. |
| Sessions count | `TradingSession.count` for `tradingAccountId`. |
| Goals count | `TradingGoal.count` for `tradingAccountId`. |
| Strategies count | `Strategy.count` for `tradingAccountId`. |

### Permission-derived visibility

- Manager status used `isManager()` from `lib/permissions.ts` (strictly `role === "MANAGER"`).
- Analytics: manager or `canViewAnalytics`.
- Reports: manager or `canViewReports`.
- Sessions: manager or role `MEMBER`; this was a local heuristic, not a dedicated permission.
- Copilot: manager or `canViewCopilot`.
- Member-management readiness: manager or `canManageMembers`.
- Rules/Goals and Integrations visibility: manager or `canManageAccount`.
- Playbook management readiness: manager or `canCreateTrades`.
- Diary note directly checked `canCreateTrades` without the manager override.

These checks controlled displayed links/status notes. They did not implement actions.

### Visible sections and information

#### Header

- “Account command hub” label.
- Shared/Solo derived solely from `members.length > 1`.
- Page title “Workspace”.
- Copy describing account environment and daily tools.

#### Readiness hero

- Badges: Shared/Solo and current membership role (`MANAGER` displayed as “Admin”, then Viewer or Member).
- Derived state: “Still assembling”, “Operational”, or “Fully wired”.
- Percentage based on five equally weighted checks:
  - account created;
  - trade history exists;
  - planning layer exists (any session, goal, or strategy);
  - access roster exists;
  - data channel is manual or externally connected.
- A five-row breakdown with Ready, Manual mode, Pending, or Unavailable.

This was functional display logic over real counts/settings, but the weighting and labels were presentational product heuristics, not stored state.

#### Four stat cards

- Count of modules visible to the current role.
- Total stored trades.
- Total account members.
- Integration/data mode: Manual, MT5, Broker, or Hybrid.

#### Recommended next move

Selected one link in this order:

1. Integrations when non-manual, not connected, and account-manage permission exists.
2. Playbook when no strategies and playbook-manage heuristic exists.
3. Rules when no goals and account-manage permission exists.
4. Reports if visible, otherwise Dashboard.

This was navigation guidance only.

#### Account wiring

- Manual mode: “Manual input”, “Not connected”, “No external activity”.
- External mode: mode, sync status (`Active`, `Needs attention`, or `Not connected`), and `lastSyncedAt`.
- Badge: Manual mode, Ready, or Pending.

This was an integrations status summary, not an integration action.

#### Launch deck / modules

Every card was a link plus a derived Ready/Limited/Pending/Manual state and explanatory note:

- Dashboard: trade-data availability.
- Trading Diary: create-trade permission note.
- Calendar: trade-data availability.
- Equity: trade-data availability.
- Analytics: permission-filtered; trade-data availability.
- Reports: permission-filtered; trade-data availability.
- Sessions: role-filtered; session count.
- Copilot: permission-filtered; considered ready at five trades.
- Members: always shown; management capability summarized.
- Rules & Goals: account-management-filtered; goal count.
- Integrations: account-management-filtered; connection mode/state.
- Playbook: always shown; strategy count.

The page grouped these into four “primary” modules (the first four), “intelligence rooms”, and “account controls”. It did not reproduce any destination's actions.

#### Account presence

- Showed at most four members.
- Displayed name fallback (`name ?? username`), normalized role, and `user.lastActivityAt ?? user.lastSeenAt`.
- Displayed a link to full Members only when more than four members existed.
- No online threshold, active-today count, account-specific activity calculation, sorting by recency, or member action.

This was a functional read-only preview. The timestamp is user-global, not proof of activity in this account.

#### Recent account events

- Displayed up to five account-scoped `ActivityLog` records.
- Displayed normalized titles for goals, sessions, trades, integration settings, member invitation, and member removal; unknown types were humanized.
- Added canned descriptions for goals, sessions, trades, and integrations.
- Displayed actor name/username fallback and event timestamp.
- Empty state when there were no logs.

This was a functional query/viewer, but completeness depended on producers calling `logActivity`. The standard Members actions do not.

#### Protection footer

- Static “Account-protected workspace”/“Protected” message.
- No additional security enforcement beyond the earlier route and module checks.

### Loading UI and stale implications

`loading.tsx` simply rendered `WorkspaceSkeleton`.

The skeleton visually promised:

- a hero with two actions and three status blocks;
- four statistics;
- “Leaderboard” plus “Online Members”;
- “Inactive Members” plus “Recent Activity”.

It matched the earlier `1bd9481` Workspace Intelligence page, not the immediate 911-line page. Therefore leaderboard, explicit online/offline lists, and active-today statistics were **not capabilities of the last committed pre-redirect page**, even though its loading state implied them.

## Historical Workspace Intelligence lineage (context, not restoration target)

At `1bd9481`, Workspace really did show:

- Workspace status derived from member presence;
- active-today percentage;
- live-presence percentage;
- total members, online now, active today, and count of the 10 loaded events;
- “Most Active Members” top five, sorted by `User.loginCount`;
- online members, defined as `lastActivityAt` within five minutes;
- inactive members, defined as everyone not online;
- ten account-scoped activity records;
- links to Members and global Activities.

Important accuracy limits:

- `User.loginCount`, `lastActivityAt`, and `lastSeenAt` are global user fields, not account-scoped collaboration metrics.
- “Most active” meant most lifetime logins, not most actions in this shared account.
- “Inactive” meant not active in the last five minutes, not genuinely inactive.
- Visiting Workspace itself updated the viewer's activity fields, affecting the displayed presence.
- The page had no invite, role, permission, removal, or conversion mutations.

Those widgets were functional calculations, but their labels overstated what the data proved.

## 2. Feature inventory

| Former Workspace capability | Exact source/data | Intended user | Functional or presentational | Exists elsewhere now? | Current destination | Lost after redirect? |
|---|---|---|---|---|---|---|
| Shared/Solo label | `members.length > 1` | Any roster viewer | Functional derived display | Partly; Members always labels itself “Shared account”, Manage exposes account type/member count | Members / Manage / future Library status | The exact truthful derived label is lost; no action lost. |
| Current role badge | Membership `role` | Current member | Functional display | Yes | Members | No. |
| Workspace readiness percentage/state | Five derived checks over counts and integrations | Manager/roster viewer | Presentational heuristic | No exact equivalent | Dashboard/Library only if later judged useful | Display lost; not a collaboration function. |
| Visible module count | Permission-filtered module array | Current member | Presentational | Navigation exists directly | Sidebar/account navigation | No useful function lost. |
| Trade/session/goal/strategy setup signals | Prisma counts | Operators/managers | Functional display | Data exists in destinations; Dashboard covers operations | Dashboard, Diary, Sessions, Rules, Playbook | Only centralized summary lost. |
| Integration wiring/last sync | TradingAccount integration fields | Account manager | Functional display | Yes, in dedicated integration area | Integrations; concise status may also fit Library | No action lost. |
| Recommended next action | Ordered local heuristic | Account manager/operator | Presentational navigation | Not centrally | Dashboard/Library contextual entries | Guidance lost, not capability. |
| Member count | `AccountMember.findMany().length` | Collaborators | Functional display | Yes | Members and Manage | No. |
| Four-member roster preview | First four memberships ordered by `createdAt` | Roster viewers | Functional display | Full roster exists | Members | No. |
| Member role | `AccountMember.role` | Roster viewers/managers | Functional display | Yes, with owner distinction | Members | No. |
| Member last activity/seen | Global `User.lastActivityAt ?? lastSeenAt` | Collaborators/managers | Functional display with scope caveat | Yes, list and member dossier | Members | No. |
| Recent five account events | `ActivityLog` by `accountId`, newest five | Collaborators/managers | Functional viewer, producer-dependent | Yes, broader viewer (up to 100) | Activities | No viewer lost; account-focused preview lost. |
| Member invitation/removal event labels | Title/description mapping only | Collaborators/managers | Presentational unless logs already existed | Activities can display logged records | Activities | Standard Members actions still do not log them; gap predates redirect. |
| Dashboard/Diary/Calendar/Equity links | Static routes plus counts/permissions | Operators | Functional navigation | Yes | Dashboard and account navigation | No. |
| Analytics/Reports/Copilot links | Permission-filtered links | Authorized members | Functional navigation | Yes | Respective pages | No. |
| Members link/readiness | Link plus `canManageMembers` | Collaborators/managers | Functional navigation/display | Yes | Members | No. |
| Rules/Integrations links | `canManageAccount`/manager | Account managers | Functional navigation | Yes | Rules / Integrations | No. |
| Leaderboard | Earlier `User.loginCount`, top five | Managers | Functional calculation but misleading/global | No | None recommended | Removed before redirect; not a legitimate capability to restore. |
| Online now | Earlier global `lastActivityAt < 5 minutes` | Collaborators/managers | Functional calculation, not account-scoped | Not explicit; last-seen exists | Members if a clearly labeled global-presence policy is desired | Removed before redirect; skeleton still implies it. |
| Active today / inactive lists | Earlier global `lastActivityAt` date/threshold | Managers | Functional calculation, overstated | Last-seen exists | Members/Activities only with precise semantics | Removed before redirect; do not restore unchanged. |
| Invite members | None on Workspace; link only | Managers | Never existed on Workspace | Yes, complete flow | Members | No. |
| Change roles | None on Workspace | Role managers | Never existed on Workspace | Yes | Members | No. |
| Edit granular permissions | None on Workspace | Role managers | Never existed on Workspace | Yes, seven editable flags | Members | No. |
| Remove member | None on Workspace | Member managers | Never existed on Workspace | Yes | Members | No. |
| Convert personal account to shared | None; Shared/Solo was derived from count, while `AccountType.SHARED` was separate | Account owner/manager | Never existed | No conversion; only new shared-account creation | Future Manage + Members setup | Missing product capability. |

## 3. Current Members verification

### Listing members — supported

- Requires authenticated account membership.
- Blocks archived accounts.
- Requires `MANAGER` role or `canViewMembers`.
- Queries every account member including `User`, ordered by membership creation.
- Sorts display as creator, managers, members, viewers.
- Displays name, username, owner/role, current-user marker, joined date, last seen, seven-permission summary, access dossier link, and filtered Diary link.

### Invitations — supported

- Pending invites are queried only when the viewer has `canManageMembers`.
- Invitation form targets an existing username and assigns MEMBER, VIEWER, or (when `canManageRoles`) MANAGER.
- Server checks: authenticated membership, `canManageMembers`, valid target, not self, not already a member, no duplicate pending invite, and no MANAGER invite without `canManageRoles`.
- Creates `AccountInvite` and an `ACCOUNT_INVITE` notification.
- Pending invites show invitee, role, inviter, and cancel action.
- Cancellation verifies account ownership of the invite and `canManageMembers`.
- Acceptance is restricted to the invited user, creates membership with role defaults, deletes the invite transactionally, notifies inviter, and redirects to Dashboard.
- Decline deletes the invite and notifies inviter.

### Role changes — supported

- Requires `canManageRoles` (role `MANAGER` alone is not an automatic server bypass).
- Cannot change own role.
- Cannot demote account creator from MANAGER.
- Cannot demote the last MANAGER.
- Applies the full default permission preset for the new role.

### Granular permissions — supported with deliberate limits

Editable flags:

- `canCreateTrades`
- `canEditTrades`
- `canDeleteTrades`
- `canViewAnalytics`
- `canViewReports`
- `canViewCopilot`
- `canViewMembers`

The server requires `canManageRoles`, prevents self-editing, validates the target membership, strips all unapproved keys, and updates only booleans in the allowlist.

The three management flags (`canManageMembers`, `canManageRoles`, `canManageAccount`) are displayed in the member dossier but intentionally cannot be toggled through this standard action. They are set by role defaults when an invite is accepted or a role changes; separate admin tooling can edit management permissions. Thus granular operational permissions are functional, while granular delegation of management authority is not available in account Members.

### Removing members — supported

- Requires `canManageMembers`.
- Cannot remove self.
- Cannot remove account creator.
- Removing a MANAGER additionally requires `canManageRoles`.
- Cannot remove the last MANAGER.
- Deletes the membership after account-scoped target verification.

### Owner and last-manager protection — supported

The UI hides/disables invalid actions and identifies protected identities, but the decisive protections are also server-side in `removeMember` and `changeMemberRole`.

### Member activity / last seen — partially supported

- Members list and member dossier display `lastActivityAt ?? lastSeenAt`.
- The dossier labels it “Last seen”; the list does the same.
- These are global user timestamps updated by authentication, layout/page touches, and `logActivity`, not account-scoped member activity.
- Members does not show account-specific recent actions, online-now state, or activity history per member.
- The Diary link can filter trades by member, which is operational contribution, not general activity.

### Account conversion or collaboration setup — not supported as a conversion

- Members can add people to any account, which makes it collaborative in practice.
- `TradingAccount.type` includes `SHARED`, and Manage/Create can create a new SHARED account if the user's global `canCreateSharedAccounts` policy allows it.
- No action updates an existing account from a personal type to `SHARED`.
- No explicit collaboration setup checklist or conversion wizard exists.

## 4. Current Manage Account, Activities, Prisma, and helpers

### Manage Account

Manage lists accounts created by the user or where the user has role `MANAGER`. It shows creator, status, type, balance, PnL, trade count, and member count; opens Dashboard; creates accounts; and conditionally archives, restores, or deletes.

Important permission behavior:

- New personal types require global role FOUNDER/ADMIN or `User.canCreatePersonalAccounts`.
- New SHARED accounts require global role FOUNDER/ADMIN or `User.canCreateSharedAccounts`.
- Creation makes the creator a MANAGER with every operational and management flag true.
- Archive/restore for ordinary users requires creator status plus `canArchiveOwnAccounts`; being an account MANAGER is enough to see the account in Manage but not enough to archive it.
- Delete similarly requires creator status plus `canDeleteOwnAccounts` (or global FOUNDER/ADMIN).
- `AccountMember.canManageAccount` is not consulted by Manage's archive/restore/delete actions.
- Manage has no edit-account or type-conversion action.

### Activities

The Activities page queries up to 100 newest logs where the current user is the actor or the log belongs to any account of which the user is a member. It shows type, account, actor, title, description, timestamp, and before/after metadata changes, with a link to Dashboard.

It is the correct general audit destination, but it has no account filter or member filter in this implementation. More importantly, it can show only records that actions create.

### Prisma model support

- `User`: global account-creation policies, global platform role, `lastSeenAt`, `lastLoginAt`, `lastActivityAt`, `loginCount`.
- `TradingAccount`: `type`, `status`, creator, integration state, members/invites/activity relations.
- `AccountMember`: role plus ten permission flags; unique user/account membership.
- `AccountInvite`: existing-user invitation, inviter, target account, role; unique pending invite per target/account. No expiry, status, email address, token, or message.
- `ActivityLog`: optional user and account, type/title/description/JSON metadata/timestamp. It can support membership audit records without a schema change.
- `MemberRole`: MANAGER, MEMBER, VIEWER. “Owner” is UI semantics inferred from `TradingAccount.createdById`, not a stored role.
- `AccountType`: includes SHARED, but no conversion history or collaboration state.

### Permission helpers

`lib/permissions.ts` centralizes the membership permission selection and provides:

- `isManager`: strict role test;
- `canManageRules`: manager or `canManageAccount`;
- `canUseCopilot`: manager or `canViewCopilot`;
- account permission and membership-with-account queries.

Members actions mostly perform their own explicit permission checks. There is no centralized helper for owner protection, last-manager protection, invitation policy, or editable permission allowlists.

## 5. Product responsibility recommendation

The provisional model is sound and should be retained.

| Capability | Recommended home | Reason |
|---|---|---|
| Full roster, member identity, joined date, last seen | Members | Person/account-membership data. |
| Invite, pending invite, cancel, accept, decline | Members (with notification entry points) | Membership lifecycle. |
| Role assignment and role defaults | Members | Access hierarchy. |
| Operational granular permissions | Members | Person-specific access. |
| Management-authority delegation | Members if intentionally exposed later; retain platform Admin override | Still person-specific, but high risk and currently intentionally withheld. |
| Remove member and creator/last-manager protections | Members | Membership lifecycle and invariants. |
| Account-specific member activity | Activities as the record; Members may link/filter to that record | Audit data should not be duplicated into a new page. |
| Global user presence/last seen | Members only if clearly labeled as global product activity | It describes a person, but does not prove account collaboration. |
| Account creation/type, archive, restore, delete, editable configuration | Manage Account | Account object lifecycle/configuration. |
| Personal-to-shared semantic conversion | Manage Account for the type/config mutation; Members for inviting/configuring people | It spans account state and people setup but does not require a third destination. |
| Shared-account status/member count/pending invite indicator | Account Library, concise only | Helps choose and enter an account; must link to Members/Manage. |
| Operational performance/setup | Dashboard | Selected-account operation, not collaboration administration. |
| Integration mode/sync | Integrations; optionally one concise Library status | Dedicated capability; unrelated to people except context. |
| Workspace readiness/module directory | Nowhere as a separate page | It recreated obsolete Account Hub responsibility. |

### Challenge to one provisional detail

“Activities: audit history and member activity” is correct only if “member activity” means account-scoped logged events. Global presence (`lastActivityAt`, `lastSeenAt`, `loginCount`) is not an audit trail and should not be presented as account activity without a new account-scoped event model or carefully qualified wording.

## 6. Missing capability report

### Functionality already preserved elsewhere

- Full member listing, roles, joined date, and last seen: Members.
- Invitation create/list/cancel/accept/decline: Members plus Notifications.
- Role changes and operational granular permissions: Members.
- Member removal, creator protection, and last-manager protection: Members.
- Member access dossier including management flags: Members detail.
- Account-level event viewer: Activities.
- Account creation including new SHARED accounts, member count, archive/restore/delete: Manage.
- Integration status/actions: Integrations.
- All former module links: dedicated destinations/current account navigation.

### Functionality that existed but is now inaccessible

From the immediate predecessor:

- The centralized readiness score/state and recommended-next-step heuristic.
- The concise four-member presence preview on the retired route.
- The account-scoped five-event preview on the retired route.
- The consolidated module readiness directory.

These are inaccessible displays, not lost mutations. The underlying roster, last-seen values, audit records, counts, permissions, and destination routes remain accessible elsewhere.

From the earlier Workspace Intelligence lineage (already removed before the redirect):

- explicit online-now, active-today, and offline lists;
- percentage presence/status widgets;
- login-count “most active” leaderboard.

Those should not be restored unchanged because the data was global and the labels implied account-specific intelligence.

### Functionality that existed only as display

- Workspace health/readiness percentage and state.
- Shared/Solo derivation.
- Module readiness badges and visible module count.
- Recommended next move.
- Account wiring summary.
- Roster and audit previews.
- Earlier online/active/inactive percentages and leaderboard.
- Static protection footer.

### Functionality that never existed but was implied

- Workspace-based invites, role changes, permission editing, or removal; these were always links to Members or absent.
- A true account-scoped presence system.
- A true account-scoped member activity score/leaderboard.
- Invitation expiry, email invitation, external-user invitation, resend, or invitation status history.
- A personal-to-shared conversion action or guided evolution flow.
- A stored workspace health/readiness model.
- Complete membership audit generation from standard Members actions.
- A dedicated stored Owner role; Owner is inferred from account creator.
- Editable management permissions within Members despite their display in the dossier.

### Functionality to implement later

Priority 1 — preserve audit truth:

- Add `logActivity` calls to the standard Members server actions for invite created/cancelled/accepted/declined, member removed, role changed, and operational permissions changed.
- Include actor, account, target user, role, and before/after metadata where appropriate.
- Align activity type names with Activities/notification categorization and avoid claiming events that are not produced.
- Add account/member filtering or direct filtered links in Activities if needed; the existing `ActivityLog` model is sufficient.

Priority 2 — define collaboration setup semantics:

- Decide whether “shared” is merely `members.length > 1`, an explicit `AccountType.SHARED`, or both with distinct meanings.
- If type conversion is legitimate, implement the mutation under Manage Account with authorization and audit logging, then hand off to Members for invitations and permissions.
- If no type mutation is needed, present “Set up collaboration” in Members as inviting the first additional member; do not call it conversion.

Priority 3 — optional, evidence-safe activity context:

- Keep last seen in Members with wording that it reflects global VOLTIS activity.
- If account-scoped member activity is required, derive it from account-scoped `ActivityLog`/trade/session records, not global login count.
- Do not restore a competitive leaderboard unless a valid account-scoped metric and product purpose are established.

## 7. Final recommendation

**Outcome B: Extend Members with specific missing collaboration functions.**

Members and Manage already preserve all actual immediate-predecessor collaboration mutations because Workspace never had any. Members is the correct home for people, invitations, roles, operational permissions, removal, protections, and collaboration onboarding. The specific extension should be audit-complete membership lifecycle actions and an honest first-collaborator setup entry point.

There is also a bounded **Manage Account follow-up** if product policy requires a real personal-to-SHARED type conversion. That does not change the selected outcome to C because account conversion was never a recovered Workspace capability and the dominant missing responsibility is collaboration lifecycle completeness in Members.

Do not:

- restore Workspace or Account Hub;
- remove the Dashboard redirect;
- create a new collaboration destination;
- restore global-login leaderboard/online widgets as account intelligence;
- duplicate Activities into Members;
- treat integrations as collaboration management;
- infer that role `MANAGER` automatically grants every management action—the current standard Members actions deliberately use explicit flags.

## Source evidence index

### Historical

- `bcb6e76:app/accounts/[accountId]/workspace/page.tsx`
- `bcb6e76:app/accounts/[accountId]/workspace/loading.tsx`
- `bcb6e76:components/skeletons/WorkspaceSkeleton.tsx`
- `1bd9481:app/accounts/[accountId]/workspace/page.tsx`

### Current

- `app/accounts/[accountId]/workspace/page.tsx`
- `app/accounts/[accountId]/members/page.tsx`
- `app/accounts/[accountId]/members/[memberId]/page.tsx`
- `app/accounts/[accountId]/members/actions.ts`
- `app/accounts/[accountId]/members/invite-form.tsx`
- `app/accounts/[accountId]/members/member-actions.tsx`
- `app/api/accounts/[accountId]/permissions/route.ts`
- `app/accounts/manage/page.tsx`
- `app/accounts/actions.ts`
- `app/activities/page.tsx`
- `lib/activity.ts`
- `lib/permissions.ts`
- `prisma/schema.prisma`

