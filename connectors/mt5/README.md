# VOLTIS MT5 Connector

This folder contains the MetaTrader 5 Expert Advisor that synchronizes selected closed trades with VOLTIS.

## Source

```text
VoltisTradeSyncEA.mq5
```

## Persistent batch flow

Each scheduled or manually triggered scan:

1. Performs the existing connector health check.
2. Collects the complete eligible closed-trade list using the existing history window, filtering, and local duplicate protection.
3. Starts one persistent operation with the exact collected `totalCount`.
4. Sends every trade to `/api/trade-sync/import` with the returned operation identity and a deterministic item key derived from the stable trade identity.
5. Calls the operation completion endpoint after all item attempts.

The EA preserves the existing account/source fields, trade mapping, monetary values, dates, external identifiers, scheduling, manual-trigger behavior, and shared-secret header.

## Retry behavior

HTTP work is bounded to three attempts with a 500 ms delay. Transport uncertainty retries the exact same request:

- One batch identifier is generated per scan and reused across start retries.
- One deterministic item key and payload are reused across item retries.
- The returned operation identity is reused across all items and completion retries.

Start failure aborts before item transmission. An individual item failure does not stop later items, and completion still runs after controlled item failures. If completion cannot be confirmed, the EA reports that items were sent but does not create a replacement operation or fall back to legacy unbound imports during the same execution.

## Safe logging

Connector logs contain only safe operational and aggregate status. They do not print the shared secret, authorization headers, raw payloads or responses, operation identities, item keys, configured account identity, or trade/order identifiers.

## Verification

The EA has compiled in MetaEditor with 0 errors. Backend coverage currently has 143 passing unit tests.

Real MT5-to-VOLTIS execution is deferred because no active MT5 account is currently available. The connector implementation is complete; the remaining work is environment-dependent verification, not unfinished implementation. Live synchronization has not yet been tested against a real MT5 account.
