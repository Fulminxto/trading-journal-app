import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  operationFindUnique: vi.fn(),
  effectFindMany: vi.fn(),
  effectFindUnique: vi.fn(),
  effectUpdateMany: vi.fn(),
  effectCount: vi.fn(),
  sendPush: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    syncOperation: { findUnique: mocks.operationFindUnique },
    syncOperationEffect: {
      findMany: mocks.effectFindMany,
      findUnique: mocks.effectFindUnique,
      updateMany: mocks.effectUpdateMany,
      count: mocks.effectCount,
    },
  },
}));

vi.mock("@/lib/push", () => ({ sendPushToUser: mocks.sendPush }));

import {
  dispatchSyncOperationPushEffects,
  SYNC_EFFECT_BATCH_SIZE,
  SYNC_EFFECT_MAX_ATTEMPTS,
  SYNC_EFFECT_STALE_PROCESSING_MS,
} from "@/lib/trade-sync-operation-effects";

const now = new Date("2026-07-17T12:00:00.000Z");
const staleBefore = new Date(now.getTime() - SYNC_EFFECT_STALE_PROCESSING_MS);
const notification = {
  userId: "user-1",
  title: "Trade sync complete",
  message: "Three trades processed",
  link: "/accounts/account-1/diary?source=mt5",
};

function candidate(
  overrides: Partial<{
    id: string;
    status: "PENDING" | "FAILED" | "PROCESSING" | "COMPLETED";
    attemptCount: number;
    startedAt: Date | null;
  }> = {},
) {
  return {
    id: "effect-1",
    status: "PENDING" as const,
    attemptCount: 0,
    startedAt: null,
    ...overrides,
  };
}

describe("trade-sync push-effect dispatcher", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    vi.clearAllMocks();
    mocks.operationFindUnique.mockResolvedValue({ status: "COMPLETED" });
    mocks.effectFindMany.mockResolvedValue([]);
    mocks.effectFindUnique.mockResolvedValue({ notification });
    mocks.effectUpdateMany.mockResolvedValue({ count: 1 });
    mocks.effectCount.mockResolvedValue(0);
    mocks.sendPush.mockResolvedValue(undefined);
  });

  it("returns safe errors for missing and active operations", async () => {
    mocks.operationFindUnique.mockResolvedValueOnce(null);
    await expect(dispatchSyncOperationPushEffects({ operationId: "operation-1", now }))
      .rejects.toMatchObject({ httpStatus: 404, safeMessage: "Sync operation not found" });

    mocks.operationFindUnique.mockResolvedValueOnce({ status: "PROCESSING" });
    await expect(dispatchSyncOperationPushEffects({ operationId: "operation-1", now }))
      .rejects.toMatchObject({ httpStatus: 409, safeMessage: "Sync operation is not complete" });
    expect(mocks.effectFindMany).not.toHaveBeenCalled();
  });

  it.each(["COMPLETED", "PARTIAL", "FAILED"])(
    "permits dispatch for terminal operation status %s",
    async (status) => {
      mocks.operationFindUnique.mockResolvedValue({ status });

      await expect(dispatchSyncOperationPushEffects({ operationId: "operation-1", now }))
        .resolves.toMatchObject({ operationId: "operation-1" });
    },
  );

  it.each([
    ["PENDING", 0],
    ["FAILED", 2],
    ["PROCESSING", 1],
  ] as const)("claims and delivers an eligible %s effect", async (status, attemptCount) => {
    mocks.effectFindMany.mockResolvedValue([candidate({ status, attemptCount })]);

    const result = await dispatchSyncOperationPushEffects({ operationId: "operation-1", now });

    expect(result).toMatchObject({ claimedCount: 1, completedCount: 1 });
    expect(mocks.sendPush).toHaveBeenCalledOnce();
    expect(mocks.effectUpdateMany.mock.calls[0][0]).toEqual({
      where: expect.objectContaining({
        id: "effect-1",
        operationId: "operation-1",
        attemptCount: { equals: attemptCount, lt: SYNC_EFFECT_MAX_ATTEMPTS },
        status,
        ...(status === "PROCESSING" ? { lastAttemptAt: { lte: staleBefore } } : {}),
      }),
      data: {
        status: "PROCESSING",
        attemptCount: { increment: 1 },
        startedAt: now,
        lastAttemptAt: now,
        safeErrorCode: null,
      },
    });
  });

  it("queries only eligible effects with deterministic bounded ordering", async () => {
    await dispatchSyncOperationPushEffects({ operationId: "operation-1", now });

    expect(mocks.effectFindMany).toHaveBeenCalledWith({
      where: {
        operationId: "operation-1",
        attemptCount: { lt: 5 },
        OR: [
          { status: "PENDING" },
          { status: "FAILED" },
          { status: "PROCESSING", lastAttemptAt: { lte: staleBefore } },
        ],
      },
      select: { id: true, status: true, attemptCount: true, startedAt: true },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      take: SYNC_EFFECT_BATCH_SIZE,
    });
  });

  it("does not claim fresh PROCESSING, COMPLETED, or exhausted effects", async () => {
    await dispatchSyncOperationPushEffects({ operationId: "operation-1", now });

    const eligibility = mocks.effectFindMany.mock.calls[0][0].where;
    expect(eligibility.attemptCount).toEqual({ lt: 5 });
    expect(eligibility.OR).not.toContainEqual({ status: "COMPLETED" });
    expect(eligibility.OR).toContainEqual({
      status: "PROCESSING",
      lastAttemptAt: { lte: staleBefore },
    });
    expect(mocks.sendPush).not.toHaveBeenCalled();
  });

  it("classifies maximum-attempt effects as exhausted", async () => {
    mocks.effectCount.mockResolvedValueOnce(2).mockResolvedValueOnce(0);

    const result = await dispatchSyncOperationPushEffects({ operationId: "operation-1", now });

    expect(result.exhaustedCount).toBe(2);
    expect(mocks.effectCount).toHaveBeenNthCalledWith(1, {
      where: {
        operationId: "operation-1",
        status: { not: "COMPLETED" },
        attemptCount: { gte: 5 },
      },
    });
  });

  it("skips delivery when the conditional claim loses", async () => {
    mocks.effectFindMany.mockResolvedValue([candidate()]);
    mocks.effectUpdateMany.mockResolvedValueOnce({ count: 0 });

    const result = await dispatchSyncOperationPushEffects({ operationId: "operation-1", now });

    expect(result).toMatchObject({ claimedCount: 0, skippedCount: 1 });
    expect(mocks.sendPush).not.toHaveBeenCalled();
    expect(mocks.effectFindUnique).not.toHaveBeenCalled();
  });

  it("derives the push payload only from the linked Notification", async () => {
    mocks.effectFindMany.mockResolvedValue([candidate()]);

    await dispatchSyncOperationPushEffects({ operationId: "operation-1", now });

    expect(mocks.effectFindUnique).toHaveBeenCalledWith({
      where: { id: "effect-1" },
      select: {
        notification: {
          select: { userId: true, title: true, message: true, link: true },
        },
      },
    });
    expect(mocks.sendPush).toHaveBeenCalledWith("user-1", {
      title: "Trade sync complete",
      body: "Three trades processed",
      url: "/accounts/account-1/diary?source=mt5",
    });
  });

  it("records a safe missing-notification failure without push", async () => {
    mocks.effectFindMany.mockResolvedValue([candidate()]);
    mocks.effectFindUnique.mockResolvedValue({ notification: null });

    const result = await dispatchSyncOperationPushEffects({ operationId: "operation-1", now });

    expect(result.failedCount).toBe(1);
    expect(mocks.sendPush).not.toHaveBeenCalled();
    expect(mocks.effectUpdateMany).toHaveBeenNthCalledWith(2, {
      where: {
        id: "effect-1", operationId: "operation-1", status: "PROCESSING",
        attemptCount: 1, lastAttemptAt: now,
      },
      data: { status: "FAILED", safeErrorCode: "NOTIFICATION_MISSING", completedAt: null },
    });
  });

  it("records completion with the claimed-attempt ownership guard", async () => {
    mocks.effectFindMany.mockResolvedValue([candidate({ attemptCount: 2 })]);

    await dispatchSyncOperationPushEffects({ operationId: "operation-1", now });

    expect(mocks.effectUpdateMany).toHaveBeenNthCalledWith(2, {
      where: {
        id: "effect-1", operationId: "operation-1", status: "PROCESSING",
        attemptCount: 3, lastAttemptAt: now,
      },
      data: { status: "COMPLETED", completedAt: now, safeErrorCode: null },
    });
  });

  it("persists only a bounded safe code when push rejects", async () => {
    mocks.effectFindMany.mockResolvedValue([candidate()]);
    mocks.sendPush.mockRejectedValue(new Error("raw provider token and stack"));

    const result = await dispatchSyncOperationPushEffects({ operationId: "operation-1", now });

    expect(result).toMatchObject({ failedCount: 1 });
    const failureData = mocks.effectUpdateMany.mock.calls[1][0].data;
    expect(failureData).toEqual({
      status: "FAILED", safeErrorCode: "PUSH_DELIVERY_FAILED", completedAt: null,
    });
    expect(JSON.stringify({ result, failureData })).not.toContain("provider token");
  });

  it("continues sequentially after one push failure", async () => {
    mocks.effectFindMany.mockResolvedValue([
      candidate({ id: "effect-1" }),
      candidate({ id: "effect-2" }),
    ]);
    mocks.effectFindUnique
      .mockResolvedValueOnce({ notification })
      .mockResolvedValueOnce({ notification: { ...notification, userId: "user-2" } });
    mocks.sendPush.mockRejectedValueOnce(new Error("failure")).mockResolvedValueOnce(undefined);

    const result = await dispatchSyncOperationPushEffects({ operationId: "operation-1", now });

    expect(result).toMatchObject({ claimedCount: 2, completedCount: 1, failedCount: 1 });
    expect(mocks.sendPush).toHaveBeenCalledTimes(2);
    expect(mocks.sendPush.mock.invocationCallOrder[0])
      .toBeLessThan(mocks.sendPush.mock.invocationCallOrder[1]);
  });

  it("does not overwrite newer state when final ownership is lost", async () => {
    mocks.effectFindMany.mockResolvedValue([candidate()]);
    mocks.effectUpdateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });

    const result = await dispatchSyncOperationPushEffects({ operationId: "operation-1", now });

    expect(result).toMatchObject({ completedCount: 0, skippedCount: 1 });
    expect(mocks.effectUpdateMany).toHaveBeenCalledTimes(2);
  });

  it("modifies only SyncOperationEffect state", async () => {
    mocks.effectFindMany.mockResolvedValue([candidate()]);

    await dispatchSyncOperationPushEffects({ operationId: "operation-1", now });

    for (const [call] of mocks.effectUpdateMany.mock.calls) {
      expect(call.data).not.toHaveProperty("importedCount");
      expect(call.data).not.toHaveProperty("accountId");
      expect(call.data).not.toHaveProperty("tradeId");
      expect(call.data).not.toHaveProperty("activityLog");
    }
  });
});
