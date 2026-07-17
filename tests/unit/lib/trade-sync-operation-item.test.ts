import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  operationFindUnique: vi.fn(),
  receiptFindUnique: vi.fn(),
  transaction: vi.fn(),
  txOperationFindUnique: vi.fn(),
  txOperationUpdateMany: vi.fn(),
  txOperationUpdate: vi.fn(),
  txReceiptCreate: vi.fn(),
  txReceiptUpdate: vi.fn(),
  persistSyncedTrade: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    syncOperation: { findUnique: mocks.operationFindUnique },
    syncOperationItem: { findUnique: mocks.receiptFindUnique },
    $transaction: mocks.transaction,
  },
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
    }
  }

  return {
    persistSyncedTrade: mocks.persistSyncedTrade,
    TradeSyncServiceError,
  };
});

import {
  hashSyncTradePayload,
  OperationItemError,
  processSyncOperationItem,
} from "@/lib/trade-sync-operation-item";
import { TradeSyncServiceError } from "@/lib/trade-sync";

const input = {
  tradingAccountId: "account-1",
  source: "mt5" as const,
  externalTradeId: "trade-1",
  externalAccountId: "external-account",
  externalOrderId: "external-order",
  platform: "MT5",
  brokerName: "Broker",
  symbol: "EURUSD",
  direction: "LONG",
  openDate: new Date("2026-07-01T08:00:00.000Z"),
  openTime: "08:00",
  amount: 1,
  openingPrice: 1.1,
  stopLoss: null,
  takeProfit: null,
  riskReward: null,
  closeDate: new Date("2026-07-01T09:00:00.000Z"),
  closingPrice: 1.2,
  outcome: "win",
  resultUsd: 100,
  commission: -2,
  swap: 0,
  fees: -2,
  rawImportData: { ignored: true },
};
const operation = {
  accountId: "account-1",
  source: "mt5",
  trigger: "automatic",
  status: "STARTED",
};
const binding = {
  operationId: "operation-1",
  itemKey: "item-1",
  payloadHash: hashSyncTradePayload(input),
  input,
};
const tx = {
  syncOperation: {
    findUnique: mocks.txOperationFindUnique,
    updateMany: mocks.txOperationUpdateMany,
    update: mocks.txOperationUpdate,
  },
  syncOperationItem: {
    create: mocks.txReceiptCreate,
    update: mocks.txReceiptUpdate,
  },
};

function receipt(status: string, overrides: Record<string, unknown> = {}) {
  return {
    id: "receipt-1",
    status,
    payloadHash: binding.payloadHash,
    tradeId: 10,
    needsReview: true,
    syncStatus: "imported",
    changedFields: [],
    safeErrorCode: null,
    httpStatus: null,
    ...overrides,
  };
}

function p2002(target: string[]) {
  return new Prisma.PrismaClientKnownRequestError("unique", {
    code: "P2002",
    clientVersion: "6.19.3",
    meta: { target },
  });
}

describe("operation-bound trade item processing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.operationFindUnique.mockResolvedValue(operation);
    mocks.receiptFindUnique.mockResolvedValue(null);
    mocks.txOperationFindUnique.mockResolvedValue(operation);
    mocks.txOperationUpdateMany.mockResolvedValue({ count: 1 });
    mocks.txReceiptCreate.mockResolvedValue({ id: "receipt-1" });
    mocks.txReceiptUpdate.mockResolvedValue({});
    mocks.txOperationUpdate.mockResolvedValue({});
    mocks.transaction.mockImplementation(
      (callback: (client: typeof tx) => unknown) => callback(tx),
    );
  });

  it("hashes only canonical accepted input deterministically", () => {
    const reordered = { ...input, rawImportData: { different: true } };

    expect(hashSyncTradePayload(reordered)).toBe(binding.payloadHash);
    expect(binding.payloadHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it.each([
    {
      status: "created",
      persisted: {
        status: "created",
        tradeId: 10,
        needsReview: true,
        syncStatus: "imported",
        domainUserId: "owner-1",
      },
      receiptStatus: "CREATED",
      changedFields: [],
    },
    {
      status: "updated",
      persisted: {
        status: "updated",
        tradeId: 10,
        needsReview: true,
        syncStatus: "imported",
        changedFields: ["resultUsd"],
        domainUserId: "owner-1",
      },
      receiptStatus: "UPDATED",
      changedFields: ["resultUsd"],
    },
    {
      status: "skipped",
      persisted: {
        status: "skipped",
        tradeId: 10,
        needsReview: true,
        syncStatus: "imported",
        domainUserId: "owner-1",
      },
      receiptStatus: "SKIPPED",
      changedFields: [],
    },
  ])("atomically persists a $status receipt", async ({
    persisted,
    receiptStatus,
    changedFields,
  }) => {
    mocks.persistSyncedTrade.mockResolvedValue(persisted);

    const result = await processSyncOperationItem(binding);

    expect(result).toEqual({
      result: expect.objectContaining({ status: persisted.status }),
      replayed: false,
    });
    expect(mocks.transaction).toHaveBeenCalledOnce();
    expect(mocks.persistSyncedTrade).toHaveBeenCalledWith(tx, input);
    expect(mocks.txReceiptCreate).toHaveBeenCalledWith({
      data: {
        operationId: "operation-1",
        itemKey: "item-1",
        payloadHash: binding.payloadHash,
        status: "PROCESSING",
      },
    });
    expect(mocks.txOperationUpdateMany).toHaveBeenCalledWith({
      where: {
        id: "operation-1",
        status: { in: ["STARTED", "PROCESSING"] },
      },
      data: { status: "PROCESSING" },
    });
    expect(
      mocks.txOperationUpdateMany.mock.invocationCallOrder[0],
    ).toBeLessThan(mocks.txReceiptCreate.mock.invocationCallOrder[0]);
    expect(mocks.txReceiptUpdate).toHaveBeenCalledWith({
      where: { id: "receipt-1" },
      data: expect.objectContaining({
        status: receiptStatus,
        tradeId: 10,
        changedFields,
      }),
    });
    expect(mocks.txOperationUpdate).toHaveBeenCalledWith({
      where: { id: "operation-1" },
      data: {
        lastItemAt: expect.any(Date),
      },
    });
  });

  it.each([
    ["CREATED", "created", []],
    ["UPDATED", "updated", ["resultUsd"]],
    ["SKIPPED", "skipped", []],
  ])("replays a matching %s receipt", async (
    storedStatus,
    resultStatus,
    changedFields,
  ) => {
    mocks.receiptFindUnique.mockResolvedValue(
      receipt(storedStatus, { changedFields }),
    );

    const result = await processSyncOperationItem(binding);

    expect(result.replayed).toBe(true);
    expect(result.result.status).toBe(resultStatus);
    if (result.result.status === "updated") {
      expect(result.result.changedFields).toEqual(["resultUsd"]);
    }
    expect(mocks.transaction).not.toHaveBeenCalled();
    expect(mocks.persistSyncedTrade).not.toHaveBeenCalled();
  });

  it("replays a terminal receipt after parent completion", async () => {
    mocks.operationFindUnique.mockResolvedValue({
      ...operation,
      status: "COMPLETED",
    });
    mocks.receiptFindUnique.mockResolvedValue(receipt("CREATED"));

    await expect(processSyncOperationItem(binding)).resolves.toEqual({
      result: expect.objectContaining({ status: "created" }),
      replayed: true,
    });
  });

  it("rejects mismatched hashes and processing receipts", async () => {
    mocks.receiptFindUnique.mockResolvedValueOnce(
      receipt("CREATED", { payloadHash: "different" }),
    );
    await expect(processSyncOperationItem(binding)).rejects.toMatchObject({
      httpStatus: 409,
      safeMessage: "Item identifier already exists with different payload",
    });

    mocks.receiptFindUnique.mockResolvedValueOnce(receipt("PROCESSING"));
    await expect(processSyncOperationItem(binding)).rejects.toMatchObject({
      httpStatus: 409,
      safeMessage: "Item is already being processed",
    });
  });

  it("rejects missing, mismatched, and terminal operations", async () => {
    mocks.operationFindUnique.mockResolvedValueOnce(null);
    await expect(processSyncOperationItem(binding)).rejects.toMatchObject({
      httpStatus: 404,
    });

    mocks.operationFindUnique.mockResolvedValueOnce({
      ...operation,
      accountId: "other",
    });
    await expect(processSyncOperationItem(binding)).rejects.toMatchObject({
      httpStatus: 409,
      safeMessage: "Sync operation does not match request",
    });

    mocks.operationFindUnique.mockResolvedValueOnce({
      ...operation,
      status: "FAILED",
    });
    await expect(processSyncOperationItem(binding)).rejects.toMatchObject({
      httpStatus: 409,
      safeMessage: "Sync operation is not accepting new items",
    });
  });

  it("recovers a receipt-key race by replaying the winner", async () => {
    mocks.txReceiptCreate.mockRejectedValue(
      p2002(["operationId", "itemKey"]),
    );
    mocks.receiptFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(receipt("CREATED"));

    await expect(processSyncOperationItem(binding)).resolves.toEqual({
      result: expect.objectContaining({ status: "created" }),
      replayed: true,
    });
  });

  it.each([
    {
      winner: receipt("CREATED"),
      outcome: "success",
    },
    {
      winner: receipt("FAILED", {
        tradeId: null,
        needsReview: null,
        syncStatus: null,
        safeErrorCode: "TRADE_VALIDATION_FAILED",
        httpStatus: 400,
      }),
      outcome: "failed",
    },
    {
      winner: receipt("PROCESSING"),
      outcome: "processing",
    },
  ])("resolves a controlled-failure receipt race as $outcome", async ({
    winner,
    outcome,
  }) => {
    const controlled = new TradeSyncServiceError(
      "TRADE_VALIDATION_FAILED",
      "validation",
      false,
      "Trade sync could not assign the required trade owner.",
    );
    mocks.persistSyncedTrade.mockRejectedValue(controlled);
    mocks.txReceiptCreate
      .mockResolvedValueOnce({ id: "processing-receipt" })
      .mockRejectedValueOnce(p2002(["operationId", "itemKey"]));
    mocks.receiptFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(winner);

    const promise = processSyncOperationItem(binding);

    if (outcome === "success") {
      await expect(promise).resolves.toEqual({
        result: expect.objectContaining({ status: "created" }),
        replayed: true,
      });
    } else if (outcome === "failed") {
      await expect(promise).rejects.toMatchObject({
        httpStatus: 400,
        safeMessage: "Trade sync could not assign the required trade owner.",
      });
    } else {
      await expect(promise).rejects.toMatchObject({
        httpStatus: 409,
        safeMessage: "Item is already being processed",
      });
    }
  });

  it("prevents processing when the conditional active-row claim fails", async () => {
    mocks.txOperationUpdateMany.mockResolvedValue({ count: 0 });

    await expect(processSyncOperationItem(binding)).rejects.toMatchObject({
      httpStatus: 409,
      safeMessage: "Sync operation is not accepting new items",
    });
    expect(mocks.txReceiptCreate).not.toHaveBeenCalled();
    expect(mocks.persistSyncedTrade).not.toHaveBeenCalled();
    expect(mocks.txOperationUpdate).not.toHaveBeenCalled();
  });

  it("retries the entire transaction once for the trade unique race", async () => {
    mocks.persistSyncedTrade
      .mockRejectedValueOnce(
        p2002(["tradingAccountId", "externalTradeId"]),
      )
      .mockResolvedValueOnce({
        status: "skipped",
        tradeId: 10,
        needsReview: true,
        syncStatus: "imported",
        domainUserId: "owner-1",
      });

    const result = await processSyncOperationItem(binding);

    expect(result.result.status).toBe("skipped");
    expect(mocks.transaction).toHaveBeenCalledTimes(2);
    expect(mocks.persistSyncedTrade).toHaveBeenCalledTimes(2);
  });

  it("does not retry unrelated persistence errors", async () => {
    const failure = new Error("database unavailable");
    mocks.persistSyncedTrade.mockRejectedValue(failure);

    await expect(processSyncOperationItem(binding)).rejects.toBe(failure);
    expect(mocks.transaction).toHaveBeenCalledOnce();
  });

  it("stores only sanitized terminal data for controlled failures", async () => {
    const controlled = new TradeSyncServiceError(
      "TRADE_VALIDATION_FAILED",
      "validation",
      false,
      "Trade sync could not assign the required trade owner.",
    );
    mocks.persistSyncedTrade.mockRejectedValue(controlled);

    await expect(processSyncOperationItem(binding)).rejects.toBeInstanceOf(
      OperationItemError,
    );
    expect(mocks.transaction).toHaveBeenCalledTimes(2);
    expect(mocks.txOperationFindUnique).toHaveBeenCalledTimes(2);
    expect(mocks.txOperationUpdateMany).toHaveBeenCalledTimes(2);
    const failedData = mocks.txReceiptCreate.mock.calls[1][0].data;
    expect(failedData).toEqual({
      operationId: "operation-1",
      itemKey: "item-1",
      payloadHash: binding.payloadHash,
      status: "FAILED",
      safeErrorCode: "TRADE_VALIDATION_FAILED",
      httpStatus: 400,
      completedAt: expect.any(Date),
    });
    expect(JSON.stringify(failedData)).not.toContain(controlled.stack);
    expect(mocks.txOperationUpdate).toHaveBeenLastCalledWith({
      where: { id: "operation-1" },
      data: { lastItemAt: expect.any(Date) },
    });
  });

  it("does not create a FAILED receipt if the operation became terminal", async () => {
    const controlled = new TradeSyncServiceError(
      "TRADE_VALIDATION_FAILED",
      "validation",
      false,
      "Trade sync could not assign the required trade owner.",
    );
    mocks.persistSyncedTrade.mockRejectedValue(controlled);
    mocks.txOperationFindUnique
      .mockResolvedValueOnce(operation)
      .mockResolvedValueOnce({ ...operation, status: "COMPLETED" });

    await expect(processSyncOperationItem(binding)).rejects.toMatchObject({
      httpStatus: 409,
      safeMessage: "Sync operation is not accepting new items",
    });
    expect(
      mocks.txReceiptCreate.mock.calls.some(
        ([args]) => args.data.status === "FAILED",
      ),
    ).toBe(false);
    expect(mocks.txOperationUpdate).not.toHaveBeenCalled();
  });

  it("replays a matching FAILED receipt with its safe response", async () => {
    mocks.receiptFindUnique.mockResolvedValue(
      receipt("FAILED", {
        tradeId: null,
        needsReview: null,
        syncStatus: null,
        safeErrorCode: "TRADE_VALIDATION_FAILED",
        httpStatus: 400,
      }),
    );

    await expect(processSyncOperationItem(binding)).rejects.toMatchObject({
      httpStatus: 400,
      safeMessage: "Trade sync could not assign the required trade owner.",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("replays a persistence FAILED receipt with the exact safe message", async () => {
    mocks.receiptFindUnique.mockResolvedValue(
      receipt("FAILED", {
        tradeId: null,
        needsReview: null,
        syncStatus: null,
        safeErrorCode: "TRADE_PERSISTENCE_FAILED",
        httpStatus: 500,
      }),
    );

    await expect(processSyncOperationItem(binding)).rejects.toMatchObject({
      httpStatus: 500,
      safeMessage: "Trade sync import failed.",
    });
  });
});
