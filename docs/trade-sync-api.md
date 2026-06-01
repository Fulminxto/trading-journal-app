# VOLTIS Trade Sync API

Endpoint:

```text
POST /api/trade-sync/import
```

Required header:

```text
x-voltis-sync-secret: TRADE_SYNC_SECRET
```

The secret must match the server-side environment variable:

```env
TRADE_SYNC_SECRET="..."
```

## Required Payload Fields

```json
{
  "tradingAccountId": "account_id_here",
  "source": "mt5",
  "externalTradeId": "123456789",
  "symbol": "XAUUSD",
  "direction": "BUY",
  "openDate": "2026-06-01T09:30:00.000Z"
}
```

## Full Payload Example

```json
{
  "tradingAccountId": "account_id_here",
  "source": "mt5",
  "externalTradeId": "123456789",
  "externalAccountId": "987654",
  "externalOrderId": "123456789",

  "platform": "MT5",
  "brokerName": "FTMO",

  "symbol": "XAUUSD",
  "direction": "BUY",

  "openDate": "2026-06-01T09:30:00.000Z",
  "openTime": "09:30",

  "amount": 1.0,
  "openingPrice": 2340.5,
  "stopLoss": 2330.0,
  "takeProfit": 2360.0,
  "riskReward": 2.0,

  "closeDate": "2026-06-01T11:20:00.000Z",
  "closingPrice": 2355.0,

  "outcome": "win",
  "resultUsd": 350.0,

  "commission": -7.0,
  "swap": 0,
  "fees": -7.0
}
```

## Allowed Sources

```text
mt5
broker
```

## Direction Mapping

VOLTIS accepts:

```text
BUY
SELL
LONG
SHORT
```

and stores them internally as:

```text
LONG
SHORT
```

## Outcome Values

```text
win
loss
be
```

If `outcome` is not provided, VOLTIS calculates it from `resultUsd`:

```text
resultUsd > 0  → win
resultUsd < 0  → loss
resultUsd = 0  → be
```

## Integration Mode Rules

VOLTIS only accepts imports if the account integration mode allows the source.

```text
manual  → blocks all imports
mt5     → accepts only mt5
broker  → accepts only broker
hybrid  → accepts mt5 and broker
```

Archived accounts cannot receive imports.

Auto sync must be enabled.

## Duplicate Protection

VOLTIS prevents duplicates using:

```text
tradingAccountId + externalTradeId
```

If a trade with the same external ID already exists:

```text
VOLTIS updates the existing trade
```

If it does not exist:

```text
VOLTIS creates a new imported trade
```

## Imported Trade Behavior

New imported trades are created with:

```text
source = mt5 or broker
syncStatus = imported
needsReview = true
```

After the user completes the personal review, the trade can be marked as:

```text
syncStatus = reviewed
needsReview = false
```

## Security Notes

VOLTIS does not store MT5 passwords, broker passwords, API keys, or sensitive tokens in the database at this stage.

The endpoint is protected by:

```text
TRADE_SYNC_SECRET
Integration mode validation
Account status validation
Source validation
Payload validation
Duplicate protection
```
