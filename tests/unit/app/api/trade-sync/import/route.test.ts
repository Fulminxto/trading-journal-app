import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  accountFindUnique: vi.fn(),
  accountUpdateMany: vi.fn(),
  importSyncedTrade: vi.fn(),
  logActivity: vi.fn(),
  processSyncOperationItem: vi.fn(),
}));

vi.mock("@/lib/trade-sync-operation-item", () => {
  class OperationItemError extends Error {
    constructor(
      readonly httpStatus: number,
      readonly safeMessage: string,
    ) {
      super(safeMessage);
    }
  }

  return {
    hashSyncTradePayload: vi.fn(() => "payload-hash"),
    processSyncOperationItem: mocks.processSyncOperationItem,
    OperationItemError,
  };
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tradingAccount: {
      findUnique: mocks.accountFindUnique,
      updateMany: mocks.accountUpdateMany,
    },
  },
}));

vi.mock("@/lib/activity", () => ({
  logActivity: mocks.logActivity,
}));

vi.mock("@/lib/trade-sync", () => {
  class TradeSyncServiceError extends Error {
    constructor(
      readonly code: string,
      readonly stage: "validation" | "persistence" | "internal",
      readonly retryable: boolean,
      readonly safeMessage: string,
    ) {
      super(code);
      this.name = "TradeSyncServiceError";
    }
  }

  return {
    importSyncedTrade: mocks.importSyncedTrade,
    TradeSyncServiceError,
  };
});

import { POST } from "@/app/api/trade-sync/import/route";

const secret = "unit-test-secret";
const payload = {
  tradingAccountId: "account-1",
  source: "mt5",
  externalTradeId: "external-trade-sensitive",
  externalAccountId: "external-account-sensitive",
  externalOrderId: "external-order-sensitive",
  symbol: "EURUSD",
  direction: "BUY",
  openDate: "2026-07-01T08:00:00.000Z",
  rawImportData: { sensitive: "raw-payload" },
};

function request(
  body: Record<string, unknown> = payload,
) {
  return new Request("http://localhost/api/trade-sync/import", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-voltis-sync-secret": secret,
    },
    body: JSON.stringify(body),
  }) as never;
}

describe("POST /api/trade-sync/import legacy response contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TRADE_SYNC_SECRET = secret;
    mocks.accountFindUnique.mockResolvedValue({
      id: "account-1",
      status: "ACTIVE",
      integrationMode: "mt5",
      autoSyncEnabled: true,
      mt5Enabled: true,
      brokerSyncEnabled: false,
      syncStatus: "connected",
    });
    mocks.accountUpdateMany.mockResolvedValue({ count: 1 });
    mocks.logActivity.mockResolvedValue(undefined);
  });

  afterEach(() => {
    delete process.env.TRADE_SYNC_SECRET;
  });

  it("preserves import authentication response bodies", async () => {
    delete process.env.TRADE_SYNC_SECRET;
    const unconfigured = await POST(request());
    expect(unconfigured.status).toBe(500);
    expect(await unconfigured.json()).toEqual({
      error: "Trade sync is not configured",
    });

    process.env.TRADE_SYNC_SECRET = secret;
    const unauthorizedRequest = new Request(
      "http://localhost/api/trade-sync/import",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-voltis-sync-secret": "wrong",
        },
        body: JSON.stringify(payload),
      },
    ) as never;
    const unauthorized = await POST(unauthorizedRequest);
    expect(unauthorized.status).toBe(401);
    expect(await unauthorized.json()).toEqual({ error: "Unauthorized" });
    expect(mocks.importSyncedTrade).not.toHaveBeenCalled();
  });

  it("preserves import account-authorization response bodies", async () => {
    mocks.accountFindUnique.mockResolvedValue(null);

    const response = await POST(request());

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Trading account not found",
    });
    expect(mocks.importSyncedTrade).not.toHaveBeenCalled();
  });

  it("rejects archived legacy and operation-bound imports before persistence", async () => {
    mocks.accountFindUnique.mockResolvedValue({
      id: "account-1",
      name: "Archived",
      status: "ARCHIVED",
      integrationMode: "mt5",
      autoSyncEnabled: true,
      mt5Enabled: true,
      brokerSyncEnabled: false,
      syncStatus: "connected",
      lastSyncedAt: null,
    });

    for (const body of [
      payload,
      { ...payload, operationId: "operation-1", itemKey: "item-1" },
    ]) {
      const response = await POST(request(body));
      expect(response.status).toBe(409);
      expect(await response.json()).toEqual({
        error: "This account is archived and read-only.",
      });
    }

    expect(mocks.importSyncedTrade).not.toHaveBeenCalled();
    expect(mocks.processSyncOperationItem).not.toHaveBeenCalled();
    expect(mocks.accountUpdateMany).not.toHaveBeenCalled();
    expect(mocks.logActivity).not.toHaveBeenCalled();
  });

  it("requires operationId and itemKey together", async () => {
    const response = await POST(
      request({ ...payload, operationId: "operation-1" }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "operationId and itemKey must be provided together",
    });
    expect(mocks.importSyncedTrade).not.toHaveBeenCalled();
    expect(mocks.processSyncOperationItem).not.toHaveBeenCalled();
  });

  it("returns operation metadata only for a bound item", async () => {
    mocks.processSyncOperationItem.mockResolvedValue({
      result: {
        status: "updated",
        tradeId: 10,
        needsReview: true,
        syncStatus: "imported",
        changedFields: ["resultUsd"],
      },
      replayed: false,
    });

    const response = await POST(
      request({
        ...payload,
        operationId: " operation-1 ",
        itemKey: " item-1 ",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "updated",
      tradeId: 10,
      needsReview: true,
      syncStatus: "imported",
      changedFields: ["resultUsd"],
      operationId: "operation-1",
      itemStatus: "processed",
      replayed: false,
    });
    expect(mocks.importSyncedTrade).not.toHaveBeenCalled();
    expect(mocks.logActivity).not.toHaveBeenCalled();
  });

  it.each([
    {
      name: "created",
      serviceResult: {
        status: "created",
        tradeId: 10,
        needsReview: true,
        syncStatus: "imported",
      },
      response: {
        status: "created",
        tradeId: 10,
        needsReview: true,
        syncStatus: "imported",
      },
    },
    {
      name: "updated",
      serviceResult: {
        status: "updated",
        tradeId: 10,
        needsReview: false,
        syncStatus: "reviewed",
        changedFields: ["resultUsd"],
      },
      response: {
        status: "updated",
        tradeId: 10,
        needsReview: false,
        syncStatus: "reviewed",
        changedFields: ["resultUsd"],
      },
    },
    {
      name: "skipped",
      serviceResult: {
        status: "skipped",
        tradeId: 10,
        needsReview: true,
        syncStatus: "imported",
      },
      response: {
        status: "skipped",
        tradeId: 10,
        needsReview: true,
        syncStatus: "imported",
      },
    },
  ])("preserves the $name response shape", async ({ serviceResult, response }) => {
    mocks.importSyncedTrade.mockResolvedValue(serviceResult);

    const result = await POST(request());

    expect(result.status).toBe(200);
    expect(await result.json()).toEqual(response);
  });

  it("returns a safe persistence error and logs only sanitized metadata", async () => {
    const unsafeError = new Error("database exploded external-trade-sensitive");
    unsafeError.stack = "secret stack trace";
    mocks.importSyncedTrade.mockRejectedValue(unsafeError);

    const result = await POST(request());

    expect(result.status).toBe(500);
    expect(await result.json()).toEqual({ error: "Trade sync import failed." });
    expect(mocks.accountUpdateMany).toHaveBeenCalledOnce();
    expect(mocks.logActivity).toHaveBeenCalledOnce();

    const activity = mocks.logActivity.mock.calls[0][0];
    expect(activity).toEqual({
      userId: null,
      accountId: "account-1",
      type: "TRADE_SYNC_ERROR",
      title: "Trade sync error",
      description: "Trade sync import failed.",
      metadata: {
        source: "mt5",
        code: "TRADE_PERSISTENCE_FAILED",
        stage: "persistence",
        retryable: true,
      },
    });

    const serializedActivity = JSON.stringify(activity);
    for (const sensitiveValue of [
      payload.externalTradeId,
      payload.externalAccountId,
      payload.externalOrderId,
      "raw-payload",
      unsafeError.message,
      unsafeError.stack,
      secret,
    ]) {
      expect(serializedActivity).not.toContain(sensitiveValue);
    }
  });
});
