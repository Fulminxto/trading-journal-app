# VOLTIS Trade Sync Batch Boundary Audit

**Audit date:** 2026-07-16

**Branch inspected:** `feature/workspace-redesign`

**Scope:** read-only analysis of the real multi-trade boundary around the already-approved single-trade sync implementation. No application code, Prisma schema, migration, connector, environment file, notification behavior, or existing document was modified.

## 1. Executive summary

A real caller exists in the repository: `connectors/mt5/VoltisTradeSyncEA.mq5`. It is a MetaTrader 5 Expert Advisor intended to run outside the VOLTIS Next.js process. Every 30 seconds, when enabled, it performs a health check, selects a configurable historical window, iterates MT5 history sequentially, and sends one `POST /api/trade-sync/import` request for each eligible closed deal that is not marked as processed locally.

The real multi-trade operation therefore begins and ends inside the MT5 function `CheckClosedTrades()`. This is a confirmed logical scan boundary, not a boundary known to VOLTIS. The import route receives isolated trade requests and does not know:

- when the scan started;
- when it completed;
- how many eligible trades existed;
- which item is being processed;
- whether another request belongs to the same scan;
- whether a missing final request represents completion, failure, or connector shutdown.

No batch ID, operation ID, total count, item index, final marker, or completion call exists. The route authenticates a service through a shared secret and has no trustworthy user initiator. The connector is automatic, so its future summary must use `userId: null`.

No broker caller, webhook, cron job, queue worker, GitHub Action, Supabase Function, CSV batch importer, internal batch orchestrator, or Admin sync action was found. Broker mode is accepted by the API and represented in account settings, but the caller is absent from this repository.

The current single-trade result—`created`, `updated`, or `skipped`—is suitable for aggregation by a future orchestrator. However, the MT5 connector currently treats every 2xx response as success and does not parse those statuses into counts.

The primary recommendation is: **introduce a persistent `SyncOperation` contract before implementing a batch summary**. Then implement a start/item/complete protocol around the confirmed `CheckClosedTrades()` boundary. This requires a separate Prisma phase and coordinated changes to both VOLTIS and the MT5 connector. Until that contract exists, the batch summary is a no-go: temporal aggregation or an `isFinal` flag alone would not be reliable.

## 2. Files and call paths inspected

### Application and API

- `app/api/trade-sync/import/route.ts`
- `app/api/trade-sync/health/route.ts`
- `lib/trade-sync.ts`
- `lib/activity.ts`
- `lib/notifications.ts`
- `prisma/schema.prisma`
- `app/activities/page.tsx`
- `app/admin/activity/page.tsx`
- `app/accounts/[accountId]/integrations/page.tsx`
- `app/accounts/[accountId]/integrations/actions.ts`
- `components/integrations/IntegrationSetupForm.tsx`
- `app/settings/page.tsx`
- manual trade actions in `app/accounts/[accountId]/diary/actions.ts`

### Confirmed connector

- `connectors/mt5/VoltisTradeSyncEA.mq5`
- `connectors/mt5/README.md`

### Repository-wide search

The audit searched application code, libraries, connector files, documentation, references, hidden configuration, scripts, workflow locations, and infrastructure directories for:

- import route URLs and function calls;
- the shared secret and custom header;
- external trade payloads;
- HTTP clients and command-line requests;
- loops, arrays, queues, polling, retries, intervals, cron, and webhooks;
- batch/operation/correlation identifiers;
- MT5 and broker connectors;
- GitHub Actions, Supabase/Edge Functions, workers, and scheduled jobs;
- manual, CSV, historical, and Admin import entry points.

No `.github` workflow files or Supabase Function directory were found. The only connector files are the MT5 Expert Advisor and its short README.

## 3. Confirmed callers

### 3.1 MT5 Expert Advisor

The only confirmed caller of `POST /api/trade-sync/import` is `VoltisTradeSyncEA.mq5`.

Call path:

```text
MT5 OnTick
  -> interval gate (default 30 seconds)
  -> CheckClosedTrades
  -> POST /api/trade-sync/health
  -> HistorySelect(lookback window)
  -> for each MT5 deal
       -> skip invalid/already-processed/non-closing deal
       -> HandleClosedDeal
       -> BuildTradePayload
       -> POST /api/trade-sync/import
       -> on any HTTP 2xx, mark deal processed locally
```

### Confirmed behavior

| Property | Evidence-based conclusion |
|---|---|
| Trigger | Automatic `OnTick`, gated by `ENABLE_SYNC` and `CHECK_INTERVAL_SECONDS` |
| Default frequency | At most once every 30 seconds while ticks arrive |
| History window | Configurable, default 30 days |
| Batch source | One `HistorySelect` scan inside `CheckClosedTrades()` |
| Iteration | Sequential `for` loop over `HistoryDealsTotal()` |
| Eligible items | Closing or in/out deals not already marked locally |
| Request shape | One HTTP POST per eligible deal |
| Authentication | Shared `VOLTIS_SYNC_SECRET` in `x-voltis-sync-secret` |
| Retry behavior | Failed deals remain unmarked and can be retried on later scans |
| Local deduplication | MT5 terminal Global Variable keyed by VOLTIS account and deal ticket |
| Success interpretation | Any HTTP 2xx; response body is printed but not semantically parsed |
| User actor | None; the EA is an automatic service process |
| Start boundary | Entry to `CheckClosedTrades()` after successful health check |
| End boundary | Function return after the loop finishes |
| Server-visible boundary | None |

### Important boundary limitation

`HistoryDealsTotal()` is not the batch size of imported trades. It includes entries later discarded because of invalid tickets, local processed markers, and non-closing entry types. The EA could calculate an eligible count with a pre-pass, but it does not currently do so.

The connector also has multiple early exits:

- disabled sync;
- interval not elapsed;
- failed health check;
- failed `HistorySelect`;
- terminal or process shutdown;
- HTTP failure on individual items, after which the loop continues.

Therefore the local function boundary is real, but completion needs an explicit protocol and partial-result semantics.

## 4. Missing or external callers

### Broker caller

Broker source support is present in route validation and account configuration, but no broker connector, webhook, worker, script, or external service implementation exists in this repository.

Status: **planned or external, not confirmed**.

Missing information:

- whether it sends one trade or arrays;
- webhook versus polling behavior;
- retry policy;
- whether it knows a page/cursor boundary;
- whether it can generate stable operation IDs;
- whether it is controlled by the VOLTIS team;
- maximum duration and volume;
- authentication beyond the shared secret.

### Other searched scenarios

| Scenario | Repository status | Conclusion |
|---|---|---|
| Internal cron/scheduled sync | Absent | No scheduler found |
| Queue/worker | Absent | No application worker or sync queue found |
| Broker webhook | Absent | API accepts broker source, but no caller exists |
| Supabase/Edge Function | Absent | No function directory or caller found |
| GitHub Action | Absent | No workflow files found |
| Manual sync button/action | Absent | Integration UI configures connection/reset only |
| CSV import through sync route | Absent | No CSV caller found |
| Admin-triggered import | Absent | No Admin sync action found |
| Direct internal caller of `importSyncedTrade` | Absent | Only the import route calls the service |

### Questions required for any missing caller

Before extending batch support to a broker or another connector, obtain answers to:

1. Does it send trades in a loop?
2. Does it know the total eligible count before sending?
3. Can it create and persist a stable batch/operation ID?
4. Can it make explicit start and completion calls?
5. How does it retry failed items and completion calls?
6. Is it stateless, stateful, or cursor-based?
7. Is it controlled and deployable by the same team?
8. Can it sign an operation/initiator token?
9. What are maximum batch duration and trade count?
10. Can it send arrays, and what payload limits apply?
11. Can multiple connector instances sync the same account concurrently?
12. Does a provider webhook represent one trade, one page, or one provider job?

## 5. Current single-trade contract

### 5.1 Request contract

`POST /api/trade-sync/import` accepts one JSON object. Required fields are:

- `tradingAccountId`;
- `source` (`mt5` or `broker`);
- `externalTradeId`;
- `symbol`;
- `direction` (`BUY`, `SELL`, `LONG`, or `SHORT`);
- valid `openDate`.

Optional fields cover external account/order identifiers, platform, broker name, time, size, prices, stop/take-profit, risk/reward, close date/price, outcome, result, commission, swap, and fees.

Although the local payload type contains `rawImportData`, caller-supplied raw data is not trusted directly. The route constructs its own stored technical snapshot.

### 5.2 Authentication and authorization

- Server secret: `TRADE_SYNC_SECRET`.
- Request header: `x-voltis-sync-secret`.
- Equality check against one global shared secret.
- Account lookup verifies active status, integration mode, source enablement, and auto-sync.
- The secret identifies an authorized sync service class, not a specific user, device, connector instance, account, or operation.

### 5.3 Response contract

Successful responses preserve:

- `status`: `created`, `updated`, or `skipped`;
- internal numeric `tradeId`;
- `needsReview`;
- per-Trade `syncStatus`.

`updated` additionally returns `changedFields` containing field names only.

The MT5 EA does not currently parse these result categories. It marks the deal locally processed for any 2xx response.

### 5.4 Error contract

The route returns controlled validation/access messages and safe service error messages. `TRADE_SYNC_ERROR` uses `userId: null` and sanitized metadata with source, stable code, stage, and retryability. It does not persist exception text, stack, external trade ID, or raw payload in ActivityLog.

### 5.5 Batch knowledge matrix

| Question | Route knows it? |
|---|---|
| Batch start | No |
| Batch end | No |
| Total eligible trades | No |
| Total MT5 history entries | No |
| Item index | No |
| Stable batch/operation ID | No |
| Whether this is the final item | No |
| Actual connector instance | No |
| Real user initiator | No |
| Manual versus automatic trigger | No; source does not prove trigger |
| Retry versus first delivery | Only indirectly through `skipped`; no transport-attempt identity |

### 5.6 Future field compatibility and risks

The JSON contract can be extended with optional `operationId` or `batchId` without breaking current callers. Merely accepting these strings is not sufficient:

- an arbitrary caller can forge or collide identifiers;
- a caller can attach items to another account's operation unless the server binds operation, account, source, and service identity;
- a freely supplied `initiatorUserId` is not trustworthy under a shared secret;
- `isFinal` can arrive twice, arrive early, or never arrive;
- a declared total can be incorrect or change during scanning.

Any future identifier must be issued or cryptographically validated by VOLTIS, or bound to a trusted connector identity and validated against account/source.

## 6. Current single-trade service and orchestration suitability

`importSyncedTrade` has a useful discriminated result and can be called repeatedly by a future internal orchestrator.

### Input and output

- Input is one normalized sync trade plus account/source/external identifiers and technical raw snapshot.
- Output is `created`, `updated` with changed field names, or `skipped`.
- Domain ownership remains valid through a required Trade creator.
- Automatic ActivityLogs use `userId: null`.

### Side effects per result

| Side effect | Created | Updated | Skipped |
|---|---:|---:|---:|
| Create/update Trade | Yes | Yes | No |
| Per-trade ActivityLog | `TRADE_IMPORTED` | `TRADE_SYNC_UPDATED` | No |
| Member notification | Yes | Yes | No |
| Full equity recalculation | Yes | Yes | No |
| Account connected/last-sync update | Yes | Yes | Only if operational recovery is needed |
| User activity timestamp | No | No | No |

### Data available for a batch aggregator

After each call, an orchestrator can count:

- created;
- updated;
- skipped;
- failed exceptions/error codes.

It also knows account, source, platform, broker, and per-item changed field names from its input/result. This is sufficient to calculate a summary in memory when the full batch is already held by an internal orchestrator.

It is insufficient to aggregate independent serverless HTTP calls without persistent operation state.

### Side effects that should be reconsidered for batch mode

Potentially once per batch:

- equity recalculation;
- account connected state and last successful sync timestamp;
- member notification summary;
- user/Admin summary ActivityLog;
- aggregate failure status;
- duration.

Likely per trade:

- input validation;
- create/update/skip decision;
- Trade mutation;
- technical result;
- optionally technical child event if a concrete Admin diagnostic need remains.

The current single-trade behavior must remain for legacy callers. A future orchestrator therefore needs an execution option that defers selected side effects, rather than globally removing them from `importSyncedTrade`.

## 7. Real batch boundary analysis

### Confirmed boundary

The true existing boundary is one MT5 historical scan in `CheckClosedTrades()`:

```text
health passed
  -> HistorySelect(fromTime, toTime)
  -> sequential loop
  -> zero or more item requests
  -> function returns
```

This boundary is controlled by the connector process, not by the import route.

### Why VOLTIS cannot infer it

Requests carry only account, source, and trade data. Adjacent requests may belong to:

- one scan;
- overlapping scans from different terminals;
- a retry from an earlier scan;
- a different connector instance;
- a future broker caller.

Account/source/time proximity cannot distinguish these cases.

### Batch lifecycle already available locally

The EA can observe:

- scan start time;
- scan completion;
- attempted items;
- HTTP success/failure per item;
- local processed state.

It does not currently maintain:

- stable operation ID;
- server result counts by created/updated/skipped;
- safe error-code counts;
- eligible total known before processing;
- completion retry state;
- persistent server-backed operation state.

### Manual versus automatic origin

The confirmed EA flow is automatic even if a person manually enables the EA. The individual scan is initiated by `OnTick`, not by an authenticated VOLTIS user action. It must not be attributed to the account owner or configuration editor.

## 8. Operation-origin scenarios

| Scenario | Status | Caller/authentication | Actor | Existing batch boundary | Frequency/volume | Recommended Activity destination |
|---|---|---|---|---|---|---|
| A. Automatic periodic sync | Confirmed for MT5 | EA + shared secret | System/null | Local `CheckClosedTrades` scan | Default 30-second checks; 0..N eligible trades | System/Admin summary; Integrations status |
| B. Manual user-started import | Absent | No server action or authenticated route | None currently | None | Unknown | My Activity only if later authenticated |
| C. Broker webhook | Absent/planned | No caller found | Unknown | Unknown | Unknown | System/Admin unless trusted manual initiator exists |
| D. External MT5 bridge | Confirmed | Repository EA executed externally; shared secret | System/null | One history scan | Up to history-window size | System/Admin; Integrations |
| E. Automatic retry | Confirmed behavior | Later EA scan retries unmarked failed deal | System/null | Retry belongs to later scan, not reliably original batch | Per failed item | System technical/error; no personal activity |
| F. Initial historical import | Probable through first EA scan | Same EA/shared secret | System/null | One or several scans depending runtime/failures | Potentially high, 30-day default | System/Admin summary; Integrations |
| G. Incremental sync | Confirmed after local marks exist | Same EA/shared secret | System/null | Each periodic scan | Usually low | System/Admin summary only if meaningful |
| H. CSV/file import | Absent | No caller found | None | None | Unknown | No Activity until feature exists |
| I. Admin operation | Absent | No Admin sync action | None | None | Unknown | Admin Activity if implemented |

“Initial historical import” is classified probable rather than explicit because the same scan algorithm handles it; no separate import mode or marker exists.

## 9. Actor and authentication analysis

### Summary actor rules

- Confirmed MT5 automatic operation: `userId: null`.
- Future broker webhook/automatic polling: `userId: null`.
- Future authenticated manual import: the authenticated initiating user may be stored.
- Shared-secret caller alone: cannot nominate a user safely.

### Strategy comparison

| Strategy | Security/reliability | Complexity | My Activity compatibility | Recommendation |
|---|---|---:|---|---|
| 1. No actor for automatic sync | High and truthful | Low | Not shown by current personal query | Required default |
| 2. Authenticated internal server action creates operation | High; user derived from session | Medium | Correctly appears for manual import | Recommended for future manual flow |
| 3. Signed initiator token | High if short-lived, scoped, and verified | High | Correct when signature binds user/account/operation | Optional for delegated trusted workflows |
| 4. VOLTIS creates operation before batch | Very high; server binds actor/account/source | Medium/high | Supports both null automatic and real manual actor | Recommended foundation |
| 5. Map shared secret to service identity | Better service attribution, not user attribution | Medium | Should not appear as personal activity | Useful after per-connector credentials exist |
| 6. Caller sends raw user ID | Low; impersonation possible | Low | Incorrect and unsafe | Reject |

The current single global shared secret cannot distinguish MT5 installations, accounts, environments, or broker services. A future service-identity design should use scoped connector credentials or signed operation grants, not overload user identity.

## 10. Architecture comparison

| Architecture | Advantages | Disadvantages/risks | Code changes | Prisma | Current-caller compatibility | Summary quality | Recommendation |
|---|---|---|---|---|---|---|---|
| A. `POST /api/trade-sync/import-batch` with array | Server sees complete array; simple counts; one completion point; internal orchestration possible | Payload/memory/time limits; long equity work; partial errors; whole-request retry; MT5 must construct potentially large JSON arrays; serverless timeout risk | New route, batch validator/orchestrator, connector rewrite, deferred side effects | Optional initially, advisable for audit/idempotency | Low/moderate | High only when request completes | Suitable for bounded small imports, not primary MT5 design |
| B. Start/item/complete | Explicit lifecycle; handles long batches; item retries; good partial status; works with current per-item route shape | Requires persistent incomplete operations, expiry, idempotent complete, cleanup, authorization, and connector changes | Start/complete routes, item operation binding, connector protocol, operation service | Yes for robust serverless behavior | High after additive rollout | Highest | Recommended with `SyncOperation` |
| C. Batch ID on every item + optional final marker | Additive to current route; simple caller change | Caller-supplied ID may collide; `isFinal` can be missing/duplicated/early; totals uncertain; summary races | Route fields, aggregation store, connector changes | Yes for reliable counts/finalization | High | Medium unless server owns operation | Transitional only; do not trust `isFinal` alone |
| D. Internal orchestrator calls service directly | Avoids N internal HTTP requests; easy in-memory counts; one equity recalculation; authenticated manual actor possible | Only applicable when VOLTIS receives/loads full batch; not applicable to current EA without changing transport | Server action/route/orchestrator and deferred side-effect mode | Optional for bounded synchronous batch; recommended for durable history | Not compatible with current per-trade EA | High | Recommended for future manual file import |
| E. Temporal aggregation | No caller change | Cannot identify operations; pages/groups split; duplicate summaries; unsafe across instances/retries | Query/UI heuristics | No | Superficially high | Low/unreliable | Reject |

### Payload and timeout notes for a batch route

A new array route would need explicit limits for:

- maximum item count;
- maximum request bytes;
- validation cost;
- execution timeout;
- partial-result response size;
- rate limiting;
- transaction scope.

One database transaction for a large external batch is not recommended by default: it creates long locks and makes partial retry harder. Item-level persistence plus a durable operation state is safer.

### Start/item/complete failure policy

A robust protocol must handle:

- operation started but never completed;
- duplicated start or complete;
- item retry before/after completion;
- declared total mismatch;
- connector crash;
- expiry and cleanup;
- partial failure;
- concurrent connector instances;
- late-arriving item after completion.

`complete` should be idempotent and summary creation should be protected by operation status/uniqueness, not by checking for a recent ActivityLog.

## 11. Recommended summary contract

### Classification

| Field | Classification | Notes |
|---|---|---|
| `accountId` | REQUIRED | Bind server-side to operation |
| `source` | REQUIRED | `mt5` or `broker` |
| `operationId` | REQUIRED | Server-issued canonical lifecycle ID |
| `batchId` | OPTIONAL | External caller reference, namespaced and validated |
| `importedCount` | REQUIRED | Created results |
| `updatedCount` | REQUIRED | Updated results |
| `skippedCount` | REQUIRED | Identical/idempotent results |
| `failedCount` | REQUIRED | Failed item outcomes |
| `totalCount` | REQUIRED | Prefer processed/eligible total, not raw MT5 history count |
| `startedAt` | REQUIRED | Server timestamp |
| `completedAt` | REQUIRED for terminal status | Server timestamp |
| `durationMs` | REQUIRED for terminal status | Derived server-side |
| `trigger` | REQUIRED | `manual`, `automatic`, `webhook`, or `retry` |
| `status` | REQUIRED | `completed`, `partial`, or `failed` |
| `origin` | REQUIRED | Trusted service/orchestration origin |
| `userId` | OPTIONAL | Real authenticated initiator only |
| `platform` | OPTIONAL | Safe platform label |
| `brokerName` | OPTIONAL | Only if treated as non-sensitive provider label |
| safe error-code counts/list | ADMIN ONLY | Bounded, no item identifiers |
| connector/service identity | ADMIN ONLY | Prefer scoped identity, not secret value |
| declared item total/index | ADMIN ONLY or operation state | Validation aid, not user-feed content |
| `externalTradeId` | NEVER LOG | Item-level external identifier |
| raw payload/trade data | NEVER LOG | Data minimization |
| credentials, secret, token | NEVER LOG | Security |
| stack/exception text | NEVER LOG | Use safe codes |

The summary should enforce:

```text
totalCount = importedCount + updatedCount + skippedCount + failedCount
```

If the connector stops before complete, the operation should transition after a timeout to an incomplete/failed terminal state through a controlled recovery process, not silently emit a completed summary.

## 12. Future event-type options

| Option | Semantic clarity | ActivityLog compatibility | Prisma required | Completed/partial/failed handling | Recommendation |
|---|---|---|---|---|---|
| `TRADE_IMPORT_BATCH_COMPLETED` | Clear for historical/manual imports | Immediate string type support | No for event alone | Needs additional failed/partial convention | Good for explicit import workflows |
| `TRADE_SYNC_BATCH_COMPLETED` | Clear for automatic synchronization | Immediate | No for event alone | Metadata status can express partial | Good summary event after operation model |
| `TRADE_SYNC_BATCH_FAILED` | Explicit failure | Immediate | No for event alone | Clear terminal failure | Useful System/Admin event |
| One `TRADE_SYNC_COMPLETED` | Simpler policy list | Immediate | No | Metadata must distinguish import/sync/partial/failed | Acceptable but less explicit |
| Separate `SyncOperation` model | Best lifecycle and drill-down semantics | ActivityLog can reference/snapshot outcome | Yes | Native durable states | Recommended foundation |

### Recommended event approach

Use `SyncOperation` as the source of truth. Emit a terminal ActivityLog summary from its finalized state. Prefer distinct completed and failed event types only if product copy/policy materially differs; otherwise one completed type with explicit trigger/status is technically adequate.

Because ActivityLog type is a string, adding a future event type does not itself require Prisma. Reliable operation lifecycle, idempotent completion, and incomplete-batch recovery do.

Historical per-trade records should remain untouched. No historical summary should be synthesized without operation IDs.

## 13. Side-effect policy

### Recommended per-trade work

- validate item payload;
- identify create/update/skip;
- create or update Trade;
- return technical result;
- optionally retain bounded technical child diagnostics when justified.

### Recommended once-per-batch work

- equity recalculation;
- account connected/last successful sync update;
- summary ActivityLog;
- member summary notification;
- operation terminal status;
- aggregate safe errors;
- duration calculation.

### Equity impact

Today each created or updated item performs a full account-equity recalculation that updates every trade. A scan with N changed items can therefore cause N full recalculations. Deferring this to operation completion can reduce that cost to one recalculation.

Risks of deferral:

- equity is temporarily stale while the operation is open;
- a missing completion call can leave equity stale;
- partial batches still need a final recalculation over successfully persisted items;
- a timeout recovery worker or completion fallback is required;
- legacy single-trade requests must retain immediate recalculation.

Recommended mitigation: an operation-aware mode defers recalculation, while legacy unbound requests retain current side effects. Finalization and timeout recovery must both trigger one recalculation when any item changed.

### Account state

The account should move to connected and receive `lastSyncedAt` once at successful/partial finalization. Item-level fatal errors should be accumulated; one failed item should not repeatedly toggle account state during an otherwise successful batch.

## 14. Notification policy

### Current behavior

Created and updated automatic trades call `notifyAccountMembers`; skipped trades do not. Recipients are account members who:

- have notifications globally enabled;
- have trade-activity notifications enabled;
- are not excluded by the current domain-user actor parameter.

Eligible recipients receive one in-app notification per created/updated trade. Push is attempted for recipients with push enabled. Copy is per-trade and includes symbol, direction, and source, without claiming that a named human performed the import.

### Batch volume

A batch with C created and U updated trades can generate up to `C + U` notification records per eligible recipient, plus corresponding push attempts. All-skipped scans generate no trade notification.

### Recommended future policy

- Replace per-trade member notifications with one summary for operation-bound batches.
- Retain per-trade notifications for legacy single-item calls until rollout completes.
- All-skipped automatic batch: normally no member notification; update Integrations status silently.
- Partial failure: one neutral summary with successful counts and failed count, without item identifiers.
- Failed batch with zero successes: one operational warning, preference policy to be defined.
- Admin technical diagnostics should remain separate from member copy.

No notification behavior should change before the operation boundary exists.

## 15. My Activity policy

The current personal query filters by the current user's `userId`. Automatic per-trade events already use `userId: null` and therefore do not appear.

Consequences for a future summary:

- automatic MT5/broker summary with `userId: null`: not visible in My Activity;
- manual authenticated import summary with a real initiating user: visible;
- automatic summary must not be attributed to the account owner merely to force visibility.

### Product recommendation

My Activity should show user-initiated imports only. Automatic synchronization is account-oriented system activity and belongs primarily in the account Integrations area, where connection state and recent sync logs already exist. If VOLTIS later creates an account-scoped Activity experience, automatic summaries may appear there with explicit “automatic” origin.

Do not broaden My Activity to account events as part of the batch implementation. That is a separate product/query decision with pagination consequences.

## 16. Admin Activity policy

Admin currently loads only the newest 200 ActivityLog records. High-volume technical child events can displace unrelated audit events before an operator sees them.

A summary helps but does not solve displacement if every technical child record remains indefinitely.

Recommended evolution:

- terminal batch summaries remain in Admin Activity;
- system errors remain visible with safe codes;
- per-trade technical events receive retention or move behind operation drill-down;
- Admin Activity eventually gains pagination/filtering;
- a `SyncOperation` detail view can provide counts and bounded error information without showing raw trade payloads;
- automatic and manual origin should be explicit.

For long-lived operation data, ActivityLog should be the audit/presentation layer, not the only state machine.

## 17. Prisma and concurrency considerations

| Option | Necessity/priority | Migration | Risk and history | Gradual rollout |
|---|---|---|---|---|
| A. Summary event only, no schema | Possible only for a caller-held synchronous batch | None | No durable incomplete state; duplicate completion risk | Can support bounded internal batch, not robust MT5 protocol |
| B. Add ActivityLog operation/audience fields | Valuable long term, secondary to operation state | Required | Null fallback needed for historical rows | Add nullable fields, then populate new events |
| C. New `SyncOperation` | High priority before reliable external summary | Required | New rows only; no historical backfill necessary | Add model/routes, then upgrade connectors |
| D. Unique `(tradingAccountId, externalTradeId)` | High priority separate concurrency fix | Required | Migration may fail if duplicates exist; requires preflight cleanup policy | Audit duplicates, migrate, then rely on DB constraint |

### Suggested `SyncOperation` responsibilities

- server-issued ID;
- account/source/service binding;
- optional verified initiating user;
- trigger/origin;
- started/last-seen/completed timestamps;
- expected and processed counts;
- created/updated/skipped/failed counts;
- status and safe error summary;
- idempotent finalization marker;
- expiry/recovery state.

### Concurrency risk remains open

There is no unique constraint on `(tradingAccountId, externalTradeId)`. Two concurrent first deliveries can both pass find-before-create and create duplicate Trades. A batch protocol does not fix this. Database uniqueness requires a separate Prisma phase, including an existing-data duplicate audit.

## 18. Short-term recommendation

### Primary decision

**Do not implement the ActivityLog batch summary yet. Introduce the `SyncOperation` contract first.**

Short-term work should be design and protocol preparation:

1. Confirm the MT5 connector is the production caller and identify deployed versions.
2. Define operation states, expiry, count invariants, and idempotent completion.
3. Define start/item/complete request/response contracts.
4. Decide scoped connector authentication and operation binding.
5. Decide whether the first rollout keeps current per-trade side effects or adds a deferred mode.
6. Answer the missing broker-caller questions before claiming broker batch support.

The current single-trade route and result remain valid during this preparation.

## 19. Long-term architecture

Recommended architecture:

```text
MT5 CheckClosedTrades
  -> POST /trade-sync/operations/start
       <- server-issued operationId
  -> N x POST /trade-sync/import with operationId
       <- created / updated / skipped
  -> POST /trade-sync/operations/{id}/complete
       <- idempotent terminal result

VOLTIS SyncOperation
  -> durable counts/status
  -> one equity recalculation when changes exist
  -> one account status/lastSyncedAt update
  -> one summary ActivityLog
  -> one summary notification according to policy
```

Requirements:

- operation ID issued by VOLTIS;
- operation bound to account, source, and connector identity;
- automatic actor remains null;
- completion is idempotent;
- item accounting is durable and duplicate-safe;
- timeout recovery finalizes or marks abandoned operations;
- legacy unbound single-trade calls remain supported during rollout;
- future manual import creates its operation from an authenticated server action;
- broker support is enabled only after its real caller contract is known.

## 20. Minimal implementation plan

### Phase 0 — Caller confirmation and protocol specification

Files/documents likely involved:

- `connectors/mt5/VoltisTradeSyncEA.mq5`;
- `connectors/mt5/README.md`;
- new API contract documentation.

No Prisma required.

### Phase 1 — Persistence and service identity

Files likely involved:

- `prisma/schema.prisma`;
- new migration;
- new `lib/trade-sync-operation.ts`;
- authentication/configuration layer for scoped connector identity.

Prisma required.

### Phase 2 — Start/item/complete API

Files likely involved:

- new operation start route;
- `app/api/trade-sync/import/route.ts` for validated operation binding;
- new complete route;
- `lib/trade-sync.ts` only for an explicit side-effect mode if required;
- operation service tests.

Prisma required for reliable external orchestration.

### Phase 3 — MT5 connector upgrade

Files likely involved:

- `connectors/mt5/VoltisTradeSyncEA.mq5`;
- connector README/setup documentation.

Work:

- start operation before loop;
- parse created/updated/skipped responses;
- retry items safely;
- complete operation with idempotent retry;
- persist enough local operation state to recover after restart.

### Phase 4 — Deferred side effects and summary policy

Files likely involved:

- `lib/trade-sync.ts`;
- operation finalization service;
- `lib/activity.ts`/activity policy only if new type policy is needed;
- notification policy/service;
- Integrations presentation;
- tests.

Work:

- one equity recalculation;
- one account-state update;
- one summary ActivityLog;
- one summary notification;
- retention/drill-down decision for child technical events.

### Phase 5 — Separate concurrency hardening

Files likely involved:

- duplicate-audit script/report;
- `prisma/schema.prisma`;
- migration adding the composite unique constraint;
- sync persistence error handling.

This remains separate from batch-summary delivery.

## 21. Open questions

### MT5 deployment

- Is the repository EA already deployed in production, or still future/prototype code as its README states?
- Can all deployed terminals be upgraded together?
- Can multiple terminals target the same VOLTIS account?
- Are MT5 Global Variables durable across terminal updates, profiles, VPS migration, and reinstall?
- Should an all-skipped scan create an operation row or remain silent?
- What is the real maximum `HistoryDealsTotal()` and eligible trade count?
- Can a scan exceed the current 10-second per-request timeout many times over?
- Should connector shutdown attempt completion or leave timeout recovery to VOLTIS?

### Broker integration

- What service will call broker source?
- Is it webhook, polling, paginated REST import, or file ingestion?
- Does the provider expose a job/cursor ID?
- Who controls retries and concurrency?
- Can it participate in start/item/complete?

### Product policy

- Should automatic successful summaries be visible only in Integrations or also an account-scoped activity feed?
- Should users receive a notification for every automatic batch, only changed batches, or only failures?
- What retention period applies to child technical events and operations?
- Does Admin need item drill-down, or are counts and safe error codes sufficient?

## 22. Required tests for a future implementation

### Operation lifecycle

- authenticated/scoped start creates one operation;
- duplicate start with idempotency key returns the same operation;
- operation is bound to account/source/service;
- item for another account/source is rejected;
- complete is idempotent and creates one summary;
- item after completion is rejected or handled by explicit policy;
- abandoned operation expires and receives controlled terminal status;
- declared versus processed count mismatch becomes partial/incomplete.

### Item accounting

- created/updated/skipped increment correct counters exactly once;
- item retry does not double-count;
- safe failures increment failed count;
- external trade IDs are never copied to summary ActivityLog;
- operation totals satisfy the count invariant.

### Side effects

- N changed items cause one equity recalculation at completion;
- zero changed/all-skipped operation causes no recalculation;
- partial operation recalculates once for successful changes;
- account status and `lastSyncedAt` update once;
- missing complete is recovered without permanently stale equity;
- legacy unbound single-trade calls preserve current behavior.

### Actor and security

- automatic operation summary uses `userId: null`;
- authenticated manual operation uses session user;
- raw caller-provided user ID is ignored/rejected;
- signed initiator is account/operation scoped;
- connector cannot attach to another service's operation;
- no secret, payload, stack, or external trade ID reaches ActivityLog.

### Notifications and views

- one summary notification per eligible recipient;
- all-skipped policy is respected;
- partial/failed copy uses safe aggregate data;
- automatic summary does not appear in current My Activity;
- manual summary appears with real actor;
- Admin summary remains visible without child-event displacement assumptions.

### MT5 connector

- parses created/updated/skipped;
- retries transport failure without corrupting counts;
- retries complete idempotently;
- resumes or abandons operation predictably after restart;
- handles zero eligible deals;
- handles partial HTTP failures;
- never sends a free-form user ID.

### Concurrency

- concurrent first delivery behavior remains explicitly tested as unsafe before the unique constraint;
- after the separate Prisma phase, concurrent create results in one Trade and deterministic retry handling.

## 23. Final go / no-go decision

### Decision: NO-GO for an ActivityLog batch summary now

The batch boundary is known locally in the MT5 connector but is invisible to VOLTIS. Implementing a summary solely in the current route would require unreliable temporal inference or an untrusted final marker. The broker caller is also unknown.

### GO for the next design phase

Proceed with a `SyncOperation` schema and start/item/complete protocol design, then upgrade the MT5 connector to expose its confirmed `CheckClosedTrades()` lifecycle. Only after persistent operation accounting and idempotent completion exist should VOLTIS move equity/account updates and member notifications to batch finalization and emit a terminal summary.

This ordering provides a trustworthy summary, preserves truthful system attribution, supports partial failure and recovery, and avoids building a long-lived audit policy on an inferred time window.
