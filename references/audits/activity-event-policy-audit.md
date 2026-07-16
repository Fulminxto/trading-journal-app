# VOLTIS Activity Event Policy Audit

**Audit scope:** read-only analysis of ActivityLog producers and consumers on `feature/workspace-redesign`

**Audit date:** 2026-07-16

**Implementation status:** no application code, Prisma schema, migration, or existing file was changed as part of this audit.

## 1. Executive summary

The repeated entries visible in `/activities` do not have a single cause. They fall into three materially different categories:

1. `SETTINGS_UPDATED`, `TRADING_GOALS_UPDATED`, `INTEGRATION_SETTINGS_UPDATED`, and `INTEGRATION_SYNC_RESET` are emitted once per successful server-action request, but the producers do not test whether a meaningful change occurred. Re-saving identical values therefore creates semantically duplicate no-op records.
2. `TRADE_IMPORTED` and `TRADE_SYNC_UPDATED` are intentionally emitted once per trade. The sync API accepts one trade per request and has no batch boundary or summary event, so an external batch of N trades can produce N ActivityLog records and N member notifications.
3. `COPILOT_MESSAGE_SENT` is emitted for every ordinary message, every quick prompt, and every full analysis. These are distinct user operations, but the shared type and high interaction frequency make the personal feed noisy.

No analyzed producer calls `logActivity` twice within the same successful request. Events close together in time are therefore generally separate requests, no-op submissions, retries, or per-item processing—not duplicate calls inside one action.

The most consequential attribution defect is in automatic trade sync: the importer selects the account creator, a manager, or the first member as `userId`. This makes a system process appear to be a human action in My Activity and also updates that user's `lastSeenAt` and `lastActivityAt` through `logActivity`.

The recommended short-term solution is a combination of clean producers and a My Activity policy filter:

- suppress no-op logs at the producer;
- detect unchanged trade retries;
- introduce one summary event per import/sync batch;
- keep granular technical events for Admin only where they provide real audit value;
- filter hidden types in the database query, using exactly the same predicate for pagination count and page retrieval;
- sanitize metadata before persistence and before rendering Changes.

The recommended long-term architecture is an explicit event envelope with audience, actor kind, origin, operation/correlation ID, and batch ID. This avoids relying indefinitely on event-type allowlists and makes `USER`, `ADMIN`, and `SYSTEM` semantics durable.

## 2. Current ActivityLog model and consumers

`lib/activity.ts` always inserts a new ActivityLog row. It has no shared support for:

- normalized before/after comparison;
- object diffing;
- metadata redaction;
- idempotency keys;
- request correlation;
- batch/import identifiers;
- event audience or visibility;
- transaction participation with the domain mutation.

After inserting an event, `logActivity` updates the attributed user's `lastSeenAt` and `lastActivityAt`. That behavior is reasonable for genuine user actions but incorrect for automated work attributed to a fallback user.

The Prisma `ActivityLog` model currently stores optional `userId` and `accountId`, a free-form string `type`, title, description, JSON metadata, and `createdAt`. It has indexes on user, account, and creation time but no uniqueness constraint, audience, origin, operation ID, request ID, or batch ID.

### My Activity

In the audited working tree, `/activities` uses `where: { userId: session.user.id }` for both `count` and `findMany`. Therefore:

- system events with `userId: null` are excluded;
- automatic trade events are included because the importer assigns them a human user ID;
- pagination is currently internally consistent because count and retrieval use the same predicate;
- adding a future type filter only after retrieval would break counts and produce sparse or empty pages.

The page derives an expandable Changes table from `metadata.before` and `metadata.after`. It compares values with shallow strict inequality and has no sensitive-field allowlist. Sensitive integration identifiers can therefore be exposed in the personal feed when changed.

### Admin Activity

`/admin/activity` reads the newest 200 global ActivityLog records without type filtering or pagination. It displays event type, actor, account, title, description, and timestamp. It does not currently expand metadata.

High-volume trade events can displace more important audit events from this fixed 200-record window. Although metadata is not currently rendered there, unsafe metadata remains persisted and may become visible through later tooling, exports, debugging, or future UI changes.

## 3. Exact causes of the observed repetitions

| Observed repetition | Exact producer-level cause | Classification |
|---|---|---|
| Multiple `SETTINGS_UPDATED` in one minute | One event per main-settings form request; unchanged values are still updated and logged; separate requests cannot be correlated | No-op, separate submit, or retry |
| Consecutive `TRADING_GOALS_UPDATED` | One event per goals form submit/upsert; producer logs even when all four goal/limit fields are unchanged | No-op, separate submit, or retry |
| Consecutive `INTEGRATION_SETTINGS_UPDATED` | One event per complete integration-form submit; no equality check before update/log | No-op or separate submit; client pending state reduces double-clicks |
| Repeated `INTEGRATION_SYNC_RESET` | Reset action logs even if the calculated target status equals the current status | No-op command or separate command |
| One `TRADE_IMPORTED` per trade | Import endpoint accepts one trade and creates one event for each new external trade | Per-item batch granularity |
| Many `TRADE_SYNC_UPDATED` | Every request for an existing external trade updates and logs it, including identical retry payloads | Per-item batch granularity plus no-op retry noise |
| Repeated `TRADE_SYNC_ERROR` | Each failing trade request/retry writes its own technical error event; no correlation or error coalescing | Retry/automatic-process noise |
| Many `COPILOT_MESSAGE_SENT` | Every ordinary message and quick prompt produces an event; full analysis uses the same event type | Distinct high-frequency actions sharing one type |

No evidence supports deduplicating solely by type, title, account, or minute. Two intentional saves or messages can legitimately share all of those attributes.

## 4. Producer and call-path analysis

### 4.1 `SETTINGS_UPDATED`

**Call path**

`app/settings/page.tsx` main form → `updateSettings(formData)` in `app/settings/actions.ts` → read current user → normalize submitted values → `prisma.user.update` → `logActivity(SETTINGS_UPDATED)` → redirect.

**Producer count and request behavior**

- One server action produces this type.
- One successful request produces exactly one event.
- The main form is not autosave.
- Toggle and push preferences are saved by separate actions (`updateToggle` and `updatePushEnabled`) and do not emit this type.
- A single main-form submit does not create multiple `SETTINGS_UPDATED` records internally.
- The plain server form has no persisted idempotency key, so separate submits or a retried request cannot be distinguished after the fact.

**No-op and before/after**

The producer always performs the update and log. It does not compare normalized submitted values with the stored values. `before` and `after` may therefore be identical.

The snapshots cover all fields modified by this action:

- `defaultCurrency`;
- `appLanguage`;
- `themePreference`;
- `accentColor`;
- `appIconVariant`.

They do not cover toggles or push settings because those are separate unlogged actions.

**Identity and metadata**

- `userId`: authenticated user.
- `accountId`: null.
- metadata: `{ before, after }`.
- operation/request identifier: none.

**Usefulness**

Useful to both views only when a real preference change occurred. A no-op event is useful to neither.

### 4.2 `TRADING_GOALS_UPDATED`

**Call path**

`app/accounts/[accountId]/rules/page.tsx` single form → `saveTradingGoals(accountId, formData)` → permission check → read current month/year goal → `TradingGoal.upsert` → `logActivity(TRADING_GOALS_UPDATED)` → revalidate.

**Producer count and request behavior**

- One server action produces this type.
- One submit produces one request and one event.
- No autosave or per-field action was found.
- Rules and goals are not sent as multiple requests during one save.
- Separate closely timed records imply separate submits, retries, or no-op saves.

**No-op and before/after**

The upsert and log run even when the existing values equal the submitted values. The snapshots contain all fields managed by the form:

- `monthlyProfitGoal`;
- `monthlyWinRateGoal`;
- `maxDrawdownLimit`;
- `maxTradesPerDay`.

On first creation `before` is null. On later saves it is a complete comparable snapshot.

**Rules versus goals naming**

The database entity is `TradingGoal`, but two stored fields are operational limits and the UI describes the area as Rules & Goals. `TRADING_GOALS_UPDATED` is correct relative to the model but narrower than the product wording. The current description also claims that rules and goals were updated. The type should not be renamed until the product taxonomy is decided; the immediate problem is no-op suppression, not naming.

**Identity and metadata**

- `userId`: authenticated account member returned by the permission check.
- `accountId`: target trading account.
- metadata: `goalId`, month, year, before, after.
- operation/request identifier: none.

**Usefulness**

Useful to My Activity and Admin when changed. The metadata supports one concise summary rather than multiple field events.

### 4.3 `INTEGRATION_SETTINGS_UPDATED`

**Call path**

`components/integrations/IntegrationSetupForm.tsx` → `updateAccountIntegrations(accountId, previousState, formData)` → membership/permission validation → validate complete configuration → calculate flags/status → `TradingAccount.update` → `logActivity(INTEGRATION_SETTINGS_UPDATED)` → redirect.

**Producer count and request behavior**

- One server action produces the type.
- Mode, MT5 identifiers, broker identifiers, enablement flags, auto-sync preference, and derived sync status are saved together.
- There is no per-field or per-section ActivityLog.
- `useActionState` disables the submit button while pending, reducing accidental double-clicks.
- It does not provide persisted retry idempotency.
- Credentials/secrets are not collected by this form; only identifiers and setup preferences are stored.

**No-op and before/after**

The producer does not compare the complete normalized desired state to the stored account. Re-saving the same configuration writes and logs again. Before and after cover all fields affected by the action, including identifiers and sync status.

**Identity and metadata**

- `userId`: authenticated member.
- `accountId`: target trading account.
- metadata: before/after snapshots containing integration mode, flags, MT5 login/server, broker provider/account ID, and sync status.
- operation/request identifier: none.

**Usefulness**

A sanitized changed-only event is useful to both views. Full identifier snapshots should not be visible in My Activity or its expandable Changes section. Admin should normally see that an identifier changed, not both raw values.

### 4.4 `INTEGRATION_SYNC_RESET`

**Call path**

Reset-status form in `app/accounts/[accountId]/integrations/page.tsx` → `resetAccountSyncStatus(accountId)` → permission check → calculate `inactive` for manual mode or `pending` otherwise → account update → `logActivity(INTEGRATION_SYNC_RESET)` → redirect.

**Behavior**

- Separate action and request from configuration save.
- One successful request produces one event.
- Before/after contain only `syncStatus`.
- Logs even if current and target status are identical.
- Uses authenticated member as `userId` and the account as `accountId`.
- No request/correlation ID.

**Usefulness**

It should remain a separate event because it represents an explicit operational command, but only when state actually changes. A no-op reset is useful to neither view.

### 4.5 `TRADE_IMPORTED`

**Call path**

External connector/process → `POST app/api/trade-sync/import/route.ts` with shared-secret authentication → validate payload/account/source → `importSyncedTrade(input)` in `lib/trade-sync.ts` → choose importer user → lookup by account and `externalTradeId` → create new Trade → `logActivity(TRADE_IMPORTED)` → notify account members → mark account connected → recalculate account equity.

**Granularity and volume**

The route accepts one trade, not a collection. Every new trade produces:

- one Trade row;
- one `TRADE_IMPORTED` ActivityLog;
- notifications to eligible account members;
- an account sync-status update;
- a complete account-equity recalculation.

A logical external batch of 100 new trades can therefore create 100 events and 100 notification operations. The repository has no unique batch start/end point and no existing result with imported, updated, skipped, failed, source, account, and duration totals.

**Identity and metadata**

The importer chooses, in order:

1. account creator;
2. first manager;
3. first account member.

This is not proof that the selected person initiated the operation. Metadata contains trade ID, source, external trade ID, platform, broker name, and review state. It has no batch ID, import ID, request ID, duration, or before/after.

**Usefulness**

Per-trade detail can be useful for technical audit and diagnosis, but it is unsuitable as the primary My Activity representation of an import batch. My Activity should display a batch summary. Granular records should be Admin-only if retained.

### 4.6 `TRADE_SYNC_UPDATED`

**Call path**

Same import endpoint and validation → `importSyncedTrade` finds an existing trade by account plus external trade ID → unconditional Trade update → mark account connected → recalculate equity → `logActivity(TRADE_SYNC_UPDATED)` → notify members.

**No-op, retry, and idempotency**

`externalTradeId` provides only partial row-level idempotency: a retry normally updates the existing row instead of creating a new row, but it still emits `TRADE_SYNC_UPDATED` even if every business field is unchanged.

There is no Prisma unique constraint on `(tradingAccountId, externalTradeId)`. Concurrent first deliveries can both observe no existing trade and create duplicate rows. Mutation, ActivityLog, notification, account-state update, and equity recalculation are not one transaction.

**Identity and metadata**

Uses the same fallback human `userId` and account ID as import. Metadata contains trade ID, source, external trade ID, platform, broker name, and review state. It contains no before/after or changed-field set.

**Usefulness**

- Changed per-trade events: potentially useful to Admin.
- Unchanged retry events: useful to neither view.
- My Activity: summary only.

### 4.7 `TRADE_SYNC_ERROR`

**Call path**

Import request fails after account identification → `markAccountSyncError` in the route → set account status to `error` → direct `prisma.activityLog.create` for `TRADE_SYNC_ERROR`.

**Behavior**

- Does not use `logActivity`.
- Saves `userId: null` and target account ID.
- One failing trade request or retry can create one error record.
- Repeated failures have no shared correlation or batch identifier.
- Metadata contains source, external trade ID, and error text.
- The catch path may use an exception message originating from lower-level code.

**Usefulness**

This is primarily a System/Admin event. The current My Activity query excludes it because `userId` is null. A user-facing batch failure summary may be appropriate, but it should use controlled copy and an error code rather than raw exception text.

### 4.8 `COPILOT_MESSAGE_SENT`

**Ordinary-message call path**

Conversation form or Quick Prompt button → `sendCopilotMessage(formData)` → persist user prompt in `CopilotMessage` → analyze account data/memory → persist assistant response → `logActivity(COPILOT_MESSAGE_SENT)` → revalidate.

**Full-analysis call path**

Generate Current Analysis button → `generateAnalysis(formData)` → analyze account → persist assistant analysis → `logActivity(COPILOT_MESSAGE_SENT)` with title `Analysis generated` → revalidate.

**Classification**

| Operation | Current representation | Distinguishing data |
|---|---|---|
| Ordinary message | `COPILOT_MESSAGE_SENT` | `messageLength` present |
| Quick prompt | `COPILOT_MESSAGE_SENT` | indistinguishable from ordinary message |
| Full analysis | `COPILOT_MESSAGE_SENT` | different title; `messageLength` absent |
| Regeneration | no dedicated operation/type | another full analysis record |
| Error/retry | no dedicated ActivityLog | a successful retry creates another normal record |

My Activity currently infers a full analysis from the absence of `messageLength`. That is a fragile implicit contract; operation kind should be explicit metadata or a separate summary type.

**Identity and metadata**

- `userId`: authenticated account member.
- `accountId`: target account.
- ordinary-message metadata: message length, total trades, win rate, behavioral risk, discipline score.
- full-analysis metadata: total trades, discipline score, behavioral risk.
- prompt text is not copied into ActivityLog, but it is stored in `CopilotMessage.content`.
- no request/correlation ID.

**Usefulness and volume**

An active user can create one event for every message and quick prompt. Ordinary conversation turns are too granular for My Activity. A deliberately requested full analysis is significant enough to keep. Technical/Admin retention of ordinary message events should be metadata-minimal and must never include prompt content.

## 5. Duplicate classification and deduplication policy

| Category | Present? | Correct treatment |
|---|---|---|
| Two log calls in one successful producer request | Not found for the eight types | No generic fix required |
| No-op save with identical normalized state | Yes: settings, goals, integrations, reset, existing-trade sync | Suppress before logging; often suppress mutation too |
| Separate user submits in the same minute | Yes/possible | Preserve as distinct actions |
| Per-item events in a batch | Yes: imported/updated/error trade requests | Retain only for technical audit if needed; add batch summary |
| Automatic process assigned to a user | Yes: trade import/update | Use system actor/origin; user only when a real initiating user exists |
| Retry producing another event | Possible for every uncorrelated request; definite for sync retries | Persist idempotency/correlation information |
| Identical title/type in the same minute | Common | Never use alone as a deduplication rule |

Separate controls are needed for separate problems:

- **No-op prevention:** compare normalized semantic state before mutation/log.
- **Duplicate calls within one operation:** share an operation ID and create one summary at the orchestration boundary.
- **Retry idempotency:** accept a stable idempotency key and enforce it persistently.
- **Form consolidation:** Settings, Goals, and Integrations already emit one event per form; retain that structure and log only changed fields.

## 6. Metadata and security assessment

No real secret values were inspected or reproduced in this report.

| Field/category | Producer/file | Risk | Classification | Visibility recommendation |
|---|---|---:|---|---|
| `mt5AccountLogin` | integration actions | High | REQUIRES SANITIZATION | Hide raw before/after in My Activity and Changes; normally redact in Admin |
| `brokerAccountId` | integration actions | High | REQUIRES SANITIZATION | Hide raw before/after in both user-facing and general Admin UI |
| `mt5ServerName` | integration actions | Medium | ADMIN ONLY | Do not show in My Activity Changes |
| `brokerProvider` | integration actions | Low/medium | SAFE FOR USER FEED | Show only when useful; full snapshots unnecessary |
| Integration flags/mode/status | integration actions | Low | SAFE FOR USER FEED | Changed-only display |
| `externalTradeId` | trade sync and error route | Medium | ADMIN ONLY | Exclude from My Activity; redact if externally sensitive |
| Internal `tradeId` | trade sync | Low/medium | ADMIN ONLY | No value in the personal feed |
| Source/platform/broker name | trade sync | Low | SAFE FOR USER FEED | Suitable for batch summary |
| Raw exception/error text | sync error route | High | REQUIRES SANITIZATION | Never expose raw in My Activity; sanitize before Admin persistence/display |
| `behavioralRisk` | Copilot actions | Medium | REQUIRES SANITIZATION | User-context only; avoid broad Admin exposure |
| `disciplineScore` | Copilot actions | Medium | SAFE FOR USER FEED | Optional in analysis summary; not necessary for Admin |
| `winRate`, total trade count | Copilot actions | Low | SAFE FOR USER FEED | Suitable for analysis summary |
| Copilot prompt/content | `CopilotMessage`, not ActivityLog | High | NEVER LOG | Never copy to ActivityLog or Admin audit metadata |
| `rawImportData` and full trade payload | Trade/import route, not ActivityLog | High | NEVER LOG | Do not add to ActivityLog or expandable Changes |
| Settings preference snapshots | settings action | Low | SAFE FOR USER FEED | Changed fields only |
| Trading goals and limits | rules action | Medium | SAFE FOR USER FEED | User/account context; avoid unnecessary global Admin detail |

The current expandable Changes implementation uses every key in `after` whose value differs shallowly from `before`. It needs a per-type allowlist or sanitized metadata contract before sensitive snapshots can be considered safe.

## 7. Impact on My Activity and Admin Activity

### Stopping per-trade production

- **My Activity:** removes the largest source of feed noise.
- **Admin:** loses future per-trade traceability unless detail is retained in another technical channel.
- **Historical records:** unaffected; old records can be filtered.
- **Prisma:** no change required.
- **Pagination:** becomes simpler.
- **Privacy:** improves by reducing stored/displayed external identifiers.

### Preventing no-op and duplicate retry logs

- **My Activity:** removes semantically false activity.
- **Admin:** improves audit truth; repeated transport attempts can still be represented as technical delivery telemetry if required.
- **Historical records:** unchanged.
- **Prisma:** no change for no-op checks; durable retry idempotency may need a field/model or unique key.
- **Privacy:** improves through data minimization.

### Introducing summary event types

- **My Activity:** presents meaningful import/sync outcomes.
- **Admin:** can display summary alongside retained detail.
- **Historical records:** old batches lack trustworthy summary boundaries; use presentation fallback only.
- **Prisma:** not required because `type` is a string.
- **Pagination:** coherent if summary-only policy is part of the database predicate.

### Filtering types only in My Activity

- **My Activity:** immediate noise reduction.
- **Admin:** unchanged.
- **Historical records:** benefits immediately without rewrite.
- **Prisma:** no change.
- **Pagination risk:** high if count and find queries diverge or filtering occurs after `take`.
- **Privacy:** display risk reduces, but unsafe metadata remains stored.

### Keeping technical events only in Admin

- **My Activity:** product feed remains intentional.
- **Admin:** preserves diagnostic detail, subject to retention and sanitization.
- **Historical records:** can use a type-policy fallback.
- **Prisma:** no immediate change with a code policy; explicit durable audience requires migration.
- **Privacy:** improved only if persistence and Admin rendering are also sanitized.

## 8. Strategy comparison

| Strategy | Strengths | Weaknesses | Fit for VOLTIS |
|---|---|---|---|
| A — Clean producers | Removes no-op at source; reduces storage, notifications, and count noise; easy to reason about | Removing all granular events may reduce Admin detail; no explicit audience model | Required foundation, insufficient alone |
| B — Technical events plus My Activity filter | Keeps Admin detail; improves personal feed; no immediate migration; supports summaries | Needs a central type policy; unchanged producers can still generate excessive storage and notifications | Best short-term base combined with A |
| C — UI/query temporal aggregation | Minimal producer changes; can visually compress existing data | Minute/title heuristics are unsafe; broken pagination/counts; groups can cross pages; hard to aggregate before/after | Not recommended without a real operation/batch ID |
| D — Data-model audience/visibility | Explicit USER/ADMIN/SYSTEM semantics; durable and queryable; future-proof | Requires schema, migration, producer rollout, and historical default policy | Best long-term architecture |

Temporal aggregation should only group records that share a stable correlation or batch identifier. Time proximity alone is not an operation boundary.

## 9. Recommended policy by event type

| Event type | Current producer behavior | Effective volume | My Activity policy | Admin Audit policy | Recommended change | Prisma change required | Priority |
|---|---|---:|---|---|---|---|---|
| `SETTINGS_UPDATED` | One per main-form request, including identical state | Low/medium | KEEP ONLY WHEN CHANGED | KEEP ONLY WHEN CHANGED | Compare normalized values; store changed fields only | No | P1 |
| `TRADING_GOALS_UPDATED` | One per monthly-goal upsert, including no-op | Low/medium | KEEP ONLY WHEN CHANGED | KEEP ONLY WHEN CHANGED | Skip no-op; retain one form-level summary | No | P1 |
| `INTEGRATION_SETTINGS_UPDATED` | One per complete setup submit; raw identifiers in before/after | Medium | KEEP ONLY WHEN CHANGED | KEEP sanitized | Redact identifiers; allowlisted changed-only metadata | No | P0 |
| `INTEGRATION_SYNC_RESET` | One per command, including status no-op | Low | KEEP ONLY WHEN CHANGED | KEEP ONLY WHEN CHANGED | Do not update/log if target status is current | No | P1 |
| `TRADE_IMPORTED` | One per new trade plus member notification | Very high | SUMMARY ONLY | KEEP technical detail only if needed | Add batch summary; system attribution; retention policy | No for new string type; possibly for durable batch relation | P0 |
| `TRADE_SYNC_UPDATED` | One per existing trade even when payload is identical | Very high | SUMMARY ONLY | KEEP only when business fields changed | Detect unchanged payload; summary; idempotency | No for comparison; likely yes for robust constraints/correlation | P0 |
| `TRADE_SYNC_ERROR` | One per failed request/retry; null user; raw-ish error metadata | Variable/high | SYSTEM ONLY | KEEP sanitized | Error code, redacted message, batch/request correlation | No initially | P0 |
| `COPILOT_MESSAGE_SENT` | One per message/quick prompt/full analysis | High | HIDE ordinary messages; KEEP full analysis | ADMIN ONLY with minimal metadata | Add explicit operation kind; never log prompt content | No | P1 |

Allowed My Activity decisions used above are intentionally type-and-operation specific. `COPILOT_MESSAGE_SENT` cannot be handled accurately by type alone until operation kind is explicit.

## 10. Recommended short-term strategy

Adopt **Strategy B plus the no-op and idempotency parts of Strategy A**:

1. Create a central Activity policy that defines personal-feed visibility and metadata allowlists by type/operation.
2. Suppress no-op Settings, Goals, Integration, Reset, and existing-trade sync events before logging.
3. Stop using a fallback account member as the actor for automatic sync. Preserve the initiating user only when one is actually authenticated or supplied through a trusted orchestration context.
4. Add an import/sync summary event at the real orchestration boundary. Include imported, updated, skipped, failed, source, account, duration, and operation/batch ID.
5. Keep per-trade detail Admin-only only if there is a concrete diagnostic or compliance need. Otherwise rely on Trade state plus batch outcome.
6. Hide ordinary Copilot turns from My Activity; keep explicit full analyses.
7. Apply the My Activity policy in both `activityLog.count` and `activityLog.findMany` using one shared `where` construction.
8. Sanitize metadata before persistence; presentation-time masking is a second layer, not the primary protection.

This can be implemented without an immediate Prisma migration if summary types and policy remain string/type based. Robust batch linkage and retry idempotency may justify a subsequent schema step.

## 11. Recommended long-term architecture

Adopt **Strategy D** with a structured event envelope. A durable ActivityLog should distinguish:

- `audience`: USER, ADMIN, SYSTEM, or a supported multi-audience representation;
- `actorKind`: USER, SYSTEM, SERVICE, ADMIN;
- `actorUserId`: nullable and truthful;
- `origin`: UI, server action, API connector, scheduled job, retry worker;
- `operationId`: one meaningful user/system operation;
- `requestId`: one transport request;
- `batchId` or `importId`: one import/sync batch;
- `severity`: informational, warning, error;
- sanitized public/user metadata versus restricted technical metadata, if both are required;
- retention class for high-volume technical events.

Producer APIs should accept this context explicitly. Automatic jobs must not invent a human actor. Batch summaries and technical child events should be related through the batch/operation ID, making safe grouping and drill-down possible without time heuristics.

## 12. Minimal implementation plan and files

### Step 1 — Central policy, diff, and sanitization

**Files**

- `lib/activity.ts`;
- new `lib/activity-policy.ts` or equivalent;
- focused unit-test files.

**Work**

- define per-type audience and My Activity eligibility;
- define metadata allowlists/redaction;
- add semantic changed-field helper;
- add an explicit Copilot operation kind contract.

No Prisma change is required.

### Step 2 — Suppress form no-ops

**Files**

- `app/settings/actions.ts`;
- `app/accounts/[accountId]/rules/actions.ts`;
- `app/accounts/[accountId]/integrations/actions.ts`.

**Work**

- compare normalized desired state with current state;
- return/revalidate/redirect without ActivityLog when unchanged;
- log one event containing only meaningful changed fields;
- avoid reset update/log when sync status is already the target.

No Prisma change is required.

### Step 3 — Correct trade-sync semantics

**Files**

- `lib/trade-sync.ts`;
- `app/api/trade-sync/import/route.ts`;
- possibly `prisma/schema.prisma` in a later explicitly approved schema phase.

**Work**

- compare incoming business fields with the existing trade;
- return `skipped` when unchanged;
- log updated only for real changes;
- separate system origin from a real user actor;
- sanitize errors into stable codes and safe descriptions;
- decide whether a composite unique constraint on account/external trade ID is required;
- make mutation/log outcome transactional where audit atomicity is required.

### Step 4 — Add batch orchestration and summary

**Files**

- trade-sync orchestration route/service;
- `lib/trade-sync.ts`;
- connector or caller responsible for submitting the batch;
- Activity presentation policy and focused tests;
- possibly Prisma schema if a persistent batch model/relation is selected.

**Work**

- establish one real start/end boundary;
- assign stable batch/operation ID;
- accumulate imported, updated, skipped, and failed counts;
- record source, account, manual/automatic origin, and duration;
- emit exactly one user summary event after completion;
- retain or discard technical child events according to Admin policy.

### Step 5 — Apply My Activity filtering safely

**Files**

- `app/activities/page.tsx`;
- shared Activity policy module.

**Work**

- construct one database `where` policy;
- use it for both count and retrieval;
- do not filter after pagination;
- show batch summaries and full Copilot analyses;
- hide technical per-trade events and ordinary Copilot turns;
- render only sanitized changed fields.

Admin Activity does not need to be modified in this step.

### Step 6 — Introduce structured audience and correlation

**Files**

- `prisma/schema.prisma`;
- a new migration;
- `lib/activity.ts` and policy module;
- all ActivityLog producers;
- My Activity and Admin Activity queries;
- data migration/default-policy script only if explicitly required.

**Work**

- add audience, actor kind, origin, operation/request/batch IDs, and retention semantics;
- roll producers forward with safe defaults;
- preserve historical fallback by type where new fields are null;
- migrate query policy from implicit type lists to explicit fields.

This is the long-term phase and must not be bundled into the short-term cleanup without a separate schema review.

## 13. Required tests

### Policy, diff, and sanitization unit tests

- equal normalized objects produce no changes;
- null, booleans, numbers, trimmed strings, and normalized enum values compare correctly;
- only allowlisted fields reach user metadata;
- MT5/broker identifiers and external trade IDs are redacted or omitted;
- raw exception text and prompt content never reach ActivityLog metadata;
- every supported event type has an explicit policy default.

### Settings, goals, and integration integration tests

- real change produces exactly one event;
- identical submit produces zero events;
- multiple changed fields remain one event;
- before/after accurately represent only changed safe fields;
- authenticated `userId` and correct/null `accountId` are persisted;
- Integration Setup pending behavior does not create duplicate requests;
- reset logs only on a real status transition.

### Trade-sync tests

- new external trade returns created and follows the selected technical-event policy;
- identical repeat returns skipped and creates no update ActivityLog;
- changed repeat returns updated and creates one technical event;
- concurrent first import cannot create two trades for the same account/external ID;
- idempotency key prevents duplicate processing across retry;
- automatic sync has system actor/origin and does not touch a fallback user's activity timestamps;
- genuine manual initiation preserves the actual actor;
- batch totals match created, updated, skipped, and failed outcomes;
- duration and source/account metadata are correct;
- one batch emits one user summary;
- error metadata uses safe code/copy and no secret/internal stack detail.

### Copilot tests

- ordinary message and quick prompt are explicitly classified;
- full analysis is explicitly classified without relying on missing fields;
- prompt and response content are absent from ActivityLog;
- My Activity includes only the approved analysis operation;
- retries do not masquerade as regeneration unless the user requested regeneration.

### My Activity tests

- hidden/system/Admin-only events are excluded at query time;
- count and find queries use equivalent policy;
- page boundaries never become empty because of post-query filtering;
- `userId: null` automatic events are excluded;
- user summary events are included;
- changed-value UI cannot display non-allowlisted fields;
- historical events without new classification fields have safe fallback behavior.

### Admin Activity tests

- retained technical events remain globally visible to authorized Admin users;
- sanitized error descriptions contain no secrets or raw internal details;
- high-volume imports do not unintentionally erase important audit visibility from a fixed-size window, or the limitation is explicitly accepted;
- summary and technical child events can be distinguished when correlation is introduced.

## 14. Existing-history treatment

Historical ActivityLog rows should not be rewritten merely to make the feed cleaner.

Recommended treatment:

1. Apply the My Activity type/operation policy to historical rows immediately.
2. Use the same policy in count and retrieval.
3. Keep a presentation fallback for old `COPILOT_MESSAGE_SENT` records; the current `messageLength` convention can remain a compatibility fallback but not the new contract.
4. Do not synthesize historical import summaries. Without a batch ID, grouping by account, source, type, or minute cannot reliably reconstruct real batches.
5. Do not backfill human-versus-system actor based only on the existing fallback user ID; the stored data does not prove who initiated the operation.
6. Consider retention for old high-volume per-trade technical records after operational and legal requirements are defined.
7. Audit or delete historical metadata only if a separate privacy review finds identifier values that violate the accepted retention policy.
8. If audience fields are added later, allow null historical values and derive a conservative fallback from type/metadata instead of forcing an uncertain bulk rewrite.

No general history deletion, aggregation script, or backfill is required for the recommended short-term solution.

## 15. Final recommendation

VOLTIS should treat ActivityLog as two related but distinct products: a calm personal history of meaningful user actions and a technical/administrative audit record. The same table can support both in the short term, but only with an explicit policy, sanitized metadata, truthful actor attribution, and database-level filtering.

The immediate priorities are:

1. sanitize integration and sync-error metadata;
2. suppress no-op saves and unchanged sync retries;
3. stop attributing automatic imports to fallback users;
4. introduce real batch summaries;
5. hide ordinary Copilot turns from My Activity while retaining full analyses;
6. keep pagination predicates consistent;
7. evolve toward explicit audience, origin, and correlation fields.

Deduplication based only on matching type, title, or minute must not be used. Correct deduplication requires semantic equality, an idempotency key, or a real operation/batch identifier.
