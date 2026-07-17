import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  operationFindUnique: vi.fn(),
  operationUpdateMany: vi.fn(),
  operationUpdate: vi.fn(),
  itemGroupBy: vi.fn(),
  effectCreate: vi.fn(),
  updateAccount: vi.fn(),
  recalculateEquity: vi.fn(),
  persistActivity: vi.fn(),
  persistNotifications: vi.fn(),
  sendPush: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { $transaction: mocks.transaction },
}));

vi.mock("@/lib/trade-sync", () => ({
  updateTradeSyncAccountConnected: mocks.updateAccount,
  recalculateTradeSyncAccountEquity: mocks.recalculateEquity,
}));

vi.mock("@/lib/activity", () => ({
  persistActivityLog: mocks.persistActivity,
  persistAccountMemberNotifications: mocks.persistNotifications,
}));

vi.mock("@/lib/push", () => ({ sendPushToUser: mocks.sendPush }));

import {
  completeSyncOperation,
  SyncOperationCompletionError,
} from "@/lib/trade-sync-operation-completion";

const completedAt = new Date("2026-07-17T12:00:00.000Z");
const startedAt = new Date("2026-07-17T11:59:00.000Z");
const baseOperation = {
  id: "operation-1",
  accountId: "account-1",
  source: "mt5",
  trigger: "automatic",
  status: "STARTED",
  totalCount: null,
  importedCount: 0,
  updatedCount: 0,
  skippedCount: 0,
  failedCount: 0,
  startedAt,
  completedAt: null,
  durationMs: null,
};

const tx = {
  syncOperation: {
    findUnique: mocks.operationFindUnique,
    updateMany: mocks.operationUpdateMany,
    update: mocks.operationUpdate,
  },
  syncOperationItem: { groupBy: mocks.itemGroupBy },
  syncOperationEffect: { create: mocks.effectCreate },
};

function counts(
  values: Partial<Record<"PROCESSING" | "CREATED" | "UPDATED" | "SKIPPED" | "FAILED", number>>,
) {
  return Object.entries(values).map(([status, count]) => ({
    status,
    _count: { _all: count },
  }));
}

function terminalOperation(
  overrides: {
    skippedCount?: number;
    totalCount?: number | null;
  } = {},
) {
  return {
    ...baseOperation,
    status: "COMPLETED",
    totalCount: 0,
    completedAt,
    durationMs: 60_000,
    ...overrides,
  };
}

describe("trade-sync operation completion transaction", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(completedAt);
    vi.clearAllMocks();
    mocks.operationFindUnique.mockResolvedValue(baseOperation);
    mocks.operationUpdateMany.mockResolvedValue({ count: 1 });
    mocks.itemGroupBy.mockResolvedValue([]);
    mocks.updateAccount.mockResolvedValue(undefined);
    mocks.recalculateEquity.mockResolvedValue(undefined);
    mocks.persistActivity.mockResolvedValue({ id: "activity-1" });
    mocks.persistNotifications.mockResolvedValue([]);
    mocks.effectCreate.mockResolvedValue({ id: "effect-1" });
    mocks.operationUpdate.mockImplementation(({ data }) =>
      Promise.resolve({ ...baseOperation, ...data }),
    );
    mocks.transaction.mockImplementation(
      (callback: (client: typeof tx) => unknown) => callback(tx),
    );
  });

  it("completes an unknown-total zero-item batch without summary work", async () => {
    const result = await completeSyncOperation({
      operationId: "operation-1",
      tradingAccountId: "account-1",
      source: "mt5",
    });

    expect(result).toEqual({
      operationId: "operation-1",
      status: "COMPLETED",
      totalCount: 0,
      importedCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      failedCount: 0,
      processedCount: 0,
      completedAt,
      durationMs: 60_000,
      replayed: false,
    });
    expect(mocks.updateAccount).toHaveBeenCalledWith(tx, "account-1", completedAt);
    expect(mocks.recalculateEquity).not.toHaveBeenCalled();
    expect(mocks.persistActivity).not.toHaveBeenCalled();
    expect(mocks.persistNotifications).not.toHaveBeenCalled();
    expect(mocks.effectCreate).not.toHaveBeenCalled();
  });

  it("completes an all-skipped batch without summary effects", async () => {
    mocks.operationFindUnique.mockResolvedValue({ ...baseOperation, totalCount: 2 });
    mocks.itemGroupBy.mockResolvedValue(counts({ SKIPPED: 2 }));

    const result = await completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    });

    expect(result).toMatchObject({ status: "COMPLETED", skippedCount: 2 });
    expect(mocks.persistActivity).not.toHaveBeenCalled();
    expect(mocks.persistNotifications).not.toHaveBeenCalled();
  });

  it("creates one success summary and effects only for push-enabled notifications", async () => {
    mocks.itemGroupBy.mockResolvedValue(counts({ CREATED: 2, UPDATED: 1 }));
    mocks.persistNotifications.mockResolvedValue([
      { notificationId: "notification-push", userId: "user-1", pushNotificationsEnabled: true },
      { notificationId: "notification-in-app", userId: "user-2", pushNotificationsEnabled: false },
    ]);

    const result = await completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    });

    expect(result).toMatchObject({
      status: "COMPLETED", totalCount: 3, importedCount: 2, updatedCount: 1,
    });
    expect(mocks.recalculateEquity).toHaveBeenCalledOnce();
    expect(mocks.persistActivity).toHaveBeenCalledWith(tx, expect.objectContaining({
      userId: null,
      type: "TRADE_SYNC_SUMMARY",
    }));
    expect(mocks.persistNotifications).toHaveBeenCalledWith(tx, expect.objectContaining({
      actorId: null,
      type: "trade_sync_summary",
    }));
    expect(mocks.effectCreate).toHaveBeenCalledExactlyOnceWith({
      data: {
        operationId: "operation-1",
        notificationId: "notification-push",
        effectKey: "push:notification-push",
      },
    });
    expect(mocks.sendPush).not.toHaveBeenCalled();
  });

  it("uses warning effects for a PARTIAL batch and preserves failed receipts", async () => {
    mocks.operationFindUnique.mockResolvedValue({ ...baseOperation, totalCount: 3 });
    mocks.itemGroupBy.mockResolvedValue(counts({ CREATED: 1, FAILED: 1 }));

    const result = await completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    });

    expect(result).toMatchObject({ status: "PARTIAL", failedCount: 1, processedCount: 2 });
    expect(mocks.persistActivity).toHaveBeenCalledWith(tx, expect.objectContaining({
      type: "TRADE_SYNC_WARNING",
    }));
    expect(mocks.persistNotifications).toHaveBeenCalledWith(tx, expect.objectContaining({
      type: "trade_sync_warning",
    }));
  });

  it.each([
    { totalCount: 2, receipts: counts({ FAILED: 2 }), failedCount: 2 },
    { totalCount: 2, receipts: [], failedCount: 0 },
  ])("makes a batch with no successful receipts FAILED", async ({ totalCount, receipts, failedCount }) => {
    mocks.operationFindUnique.mockResolvedValue({ ...baseOperation, totalCount });
    mocks.itemGroupBy.mockResolvedValue(receipts);

    const result = await completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    });

    expect(result).toMatchObject({ status: "FAILED", failedCount });
    expect(mocks.recalculateEquity).not.toHaveBeenCalled();
    expect(mocks.persistActivity).toHaveBeenCalledWith(tx, expect.objectContaining({
      type: "TRADE_SYNC_WARNING",
    }));
  });

  it("rejects excess or processing receipts before all finalization effects", async () => {
    mocks.operationFindUnique.mockResolvedValue({ ...baseOperation, totalCount: 1 });
    mocks.itemGroupBy.mockResolvedValueOnce(counts({ CREATED: 2 }));

    await expect(completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    })).rejects.toMatchObject({ httpStatus: 409 });

    mocks.itemGroupBy.mockResolvedValueOnce(counts({ PROCESSING: 1 }));
    await expect(completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    })).rejects.toMatchObject({ httpStatus: 409 });
    expect(mocks.updateAccount).not.toHaveBeenCalled();
    expect(mocks.operationUpdate).not.toHaveBeenCalled();
    expect(mocks.persistActivity).not.toHaveBeenCalled();
  });

  it.each([
    [null, 404],
    [{ ...baseOperation, accountId: "other" }, 409],
    [{ ...baseOperation, source: "broker" }, 409],
    [{ ...baseOperation, trigger: "manual" }, 409],
  ])("validates operation binding before claiming", async (stored, status) => {
    mocks.operationFindUnique.mockResolvedValue(stored);

    await expect(completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    })).rejects.toMatchObject({ httpStatus: status });
    expect(mocks.operationUpdateMany).not.toHaveBeenCalled();
  });

  it("claims before aggregating receipts and running side effects", async () => {
    await completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    });

    expect(mocks.operationUpdateMany).toHaveBeenCalledWith({
      where: { id: "operation-1", status: { in: ["STARTED", "PROCESSING"] } },
      data: { status: "PROCESSING" },
    });
    expect(mocks.operationUpdateMany.mock.invocationCallOrder[0])
      .toBeLessThan(mocks.itemGroupBy.mock.invocationCallOrder[0]);
    expect(mocks.itemGroupBy.mock.invocationCallOrder[0])
      .toBeLessThan(mocks.updateAccount.mock.invocationCallOrder[0]);
  });

  it("replays a terminal winner after a failed claim without side effects", async () => {
    const terminal = terminalOperation({ skippedCount: 2, totalCount: 2 });
    mocks.operationUpdateMany.mockResolvedValue({ count: 0 });
    mocks.operationFindUnique
      .mockResolvedValueOnce(baseOperation)
      .mockResolvedValueOnce(terminal);

    const result = await completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    });

    expect(result).toMatchObject({ replayed: true, skippedCount: 2 });
    expect(mocks.itemGroupBy).not.toHaveBeenCalled();
    expect(mocks.updateAccount).not.toHaveBeenCalled();
    expect(mocks.operationUpdate).not.toHaveBeenCalled();
  });

  it("replays an initially terminal operation without database effects", async () => {
    mocks.operationFindUnique.mockResolvedValue(terminalOperation());

    const result = await completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    });

    expect(result.replayed).toBe(true);
    expect(mocks.operationUpdateMany).not.toHaveBeenCalled();
    expect(mocks.itemGroupBy).not.toHaveBeenCalled();
    expect(mocks.updateAccount).not.toHaveBeenCalled();
  });

  it("uses one completion timestamp and only approved activity metadata", async () => {
    mocks.itemGroupBy.mockResolvedValue(counts({ UPDATED: 1 }));

    await completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    });

    expect(mocks.updateAccount).toHaveBeenCalledWith(tx, "account-1", completedAt);
    expect(mocks.operationUpdate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ completedAt }),
    }));
    const metadata = mocks.persistActivity.mock.calls[0][1].metadata;
    expect(metadata).toEqual({
      source: "mt5",
      trigger: "automatic",
      status: "COMPLETED",
      totalCount: 1,
      processedCount: 1,
      importedCount: 0,
      updatedCount: 1,
      skippedCount: 0,
      failedCount: 0,
      durationMs: 60_000,
      origin: "system",
    });
    expect(Object.keys(metadata).sort()).toEqual([
      "durationMs", "failedCount", "importedCount", "origin", "processedCount",
      "skippedCount", "source", "status", "totalCount", "trigger", "updatedCount",
    ].sort());
  });

  it("creates the completion timestamp after the operation claim resolves", async () => {
    const afterClaim = new Date("2026-07-17T12:01:00.000Z");
    mocks.operationUpdateMany.mockImplementation(async () => {
      vi.setSystemTime(afterClaim);
      return { count: 1 };
    });

    const result = await completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    });

    expect(mocks.updateAccount).toHaveBeenCalledWith(tx, "account-1", afterClaim);
    expect(mocks.operationUpdate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        completedAt: afterClaim,
        durationMs: 120_000,
      }),
    }));
    expect(result).toMatchObject({
      completedAt: afterClaim,
      durationMs: 120_000,
    });
  });

  it("returns a controlled conflict when a nonterminal operation cannot be claimed", async () => {
    mocks.operationUpdateMany.mockResolvedValue({ count: 0 });
    mocks.operationFindUnique.mockResolvedValue(baseOperation);

    await expect(completeSyncOperation({
      operationId: "operation-1", tradingAccountId: "account-1", source: "mt5",
    })).rejects.toBeInstanceOf(SyncOperationCompletionError);
    expect(mocks.itemGroupBy).not.toHaveBeenCalled();
  });
});
