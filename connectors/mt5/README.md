# VOLTIS MT5 Connector

This folder will contain the future MetaTrader 5 Expert Advisor used to send closed trades from MT5 to VOLTIS.

The MT5 Connector will:

- read closed trades from MetaTrader 5
- avoid duplicate imports
- call the VOLTIS health endpoint before syncing
- send valid closed trades to the VOLTIS import endpoint
- create imported trades as Needs Review inside the Diary

The connector will not store sensitive credentials inside VOLTIS at this stage.

## Current Status

The first Expert Advisor skeleton is available in:

```text
connectors/mt5/VoltisTradeSyncEA.mq5