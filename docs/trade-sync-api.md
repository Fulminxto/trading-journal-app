# VOLTIS Trade Sync API

VOLTIS uses a persistent three-stage protocol for automatic MT5 synchronization:

1. Start a synchronization operation.
2. Import each selected trade as an operation-bound item.
3. Complete the operation and derive its terminal result from durable receipts.

All three endpoints require the shared connector header:

```text
x-voltis-sync-secret: <TRADE_SYNC_SECRET>
```

The server validates the shared secret, trading account, account status, integration mode, enabled source, and automatic-sync setting. Supported normalized sources are `mt5` and `broker`; the MT5 connector uses `mt5`.

Secrets, authorization headers, raw request or response bodies, external identifiers, payload hashes, item keys, and exception details must not be logged.

## 1. Start an operation

```text
POST /api/trade-sync/operations/start
```

Request shape:

```json
{
  "tradingAccountId": "configured-account-id",
  "source": "mt5",
  "externalBatchId": "stable-non-secret-run-id",
  "trigger": "automatic",
  "totalCount": 12
}
```

`totalCount` is the exact number of trades collected by the connector before transmission. The non-secret `externalBatchId` remains stable across retries of the same scan execution.

Start is idempotent through the unique account, source, and external-batch identity. A compatible retry returns the persisted `SyncOperation` and does not reset its state or counters. Reusing a batch identity with incompatible immutable parameters returns a safe conflict.

## 2. Import operation-bound items

```text
POST /api/trade-sync/import
```

Each request contains the existing trade import fields plus:

```json
{
  "operationId": "server-issued-operation-id",
  "itemKey": "deterministic-key-for-this-trade",
  "tradingAccountId": "configured-account-id",
  "source": "mt5",
  "externalTradeId": "stable-platform-trade-id",
  "symbol": "MARKET",
  "direction": "BUY",
  "openDate": "2026-01-01T09:30:00.000Z"
}
```

`operationId` and `itemKey` must be supplied together. The connector derives a deterministic item key from the stable platform trade identity and reuses the same request across retries.

The server stores one `SyncOperationItem` receipt per operation item. Its payload hash covers only normalized accepted trade fields. Matching terminal receipts replay their original `created`, `updated`, `skipped`, or safe failure result without repeating trade persistence. A reused item key with a different normalized payload is rejected.

The existing unbound import contract remains available for legacy callers, but the MT5 automatic batch flow never falls back to it after an operation has started.

## 3. Complete an operation

```text
POST /api/trade-sync/operations/[operationId]/complete
```

Request shape:

```json
{
  "tradingAccountId": "configured-account-id",
  "source": "mt5"
}
```

Completion derives counters from durable terminal item receipts:

- `CREATED` contributes to `importedCount`.
- `UPDATED` contributes to `updatedCount`.
- `SKIPPED` contributes to `skippedCount`.
- `FAILED` contributes to `failedCount`.

Terminal operation statuses are:

- `COMPLETED`: no failed receipts and no missing expected items.
- `PARTIAL`: at least one successful or skipped receipt plus a failure or missing expected item.
- `FAILED`: no successful or skipped receipts and at least one failure or missing expected item.

Zero-item and all-skipped successful batches are `COMPLETED`. Completion retries return the persisted terminal result with `replayed: true` and do not duplicate database effects.

## Durable records and transaction boundary

- `SyncOperation` stores batch identity, lifecycle, terminal counters, and timing.
- `SyncOperationItem` stores per-item idempotency receipts and safe technical results.
- `SyncOperationEffect` is the durable outbox for post-completion push delivery.

One completion transaction atomically persists the terminal operation, receipt-derived counters, account connected state, optional equity recalculation, optional aggregate automatic ActivityLog, member Notification rows, and pending push effects. Automatic ActivityLog entries use `userId: null` and safe aggregate metadata only.

Equity is recalculated only when at least one trade was created or updated. Zero-item and all-skipped successful batches update account sync state but create no aggregate ActivityLog, Notification, push effect, or equity work.

## Post-commit push delivery

After completion commits, the route runs the durable push-effect dispatcher for both first completion and terminal replay. It claims eligible effects conditionally and sends push content derived only from the linked Notification.

The dispatcher processes at most 25 effects per invocation, retries failed or stale processing effects, uses a five-minute stale timeout, and stops retrying after five attempts. Push dispatch failure never changes an already successful completion HTTP response. External push delivery is at-least-once: a crash after remote delivery but before durable completion can result in a duplicate device notification.

## MT5 retry and failure policy

The EA uses three bounded attempts with a 500 ms delay for transport failures and retryable HTTP responses. It retries the exact same start, item, or completion request with stable identifiers.

- Start failure aborts the batch before items are sent.
- Individual item failure is counted locally and does not stop remaining items.
- Completion is attempted after every item attempt, including controlled item failures.
- Completion failure reports that item transmission occurred but finalization was not confirmed.
- The EA does not create a replacement operation or use legacy unbound import after a batch has started.

## Verification status

The persistent protocol implementation is complete. The current project checkpoint records nine Prisma migrations, 143 passing unit tests, and MetaEditor compilation with 0 errors. The repository was clean at that implementation checkpoint.

Real MT5-to-VOLTIS execution remains deferred because no active MT5 account is currently available. This is a verification task, not unfinished implementation, and live MT5 synchronization has not yet been claimed as tested.
