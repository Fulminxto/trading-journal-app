import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  operationFindUnique: vi.fn(),
  operationCreate: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    syncOperation: {
      findUnique: mocks.operationFindUnique,
      create: mocks.operationCreate,
    },
  },
}));

import {
  startSyncOperation,
  SyncOperationConflictError,
  SyncOperationTriggerError,
} from "@/lib/trade-sync-operation";

const startedAt = new Date("2026-07-17T12:00:00.000Z");
const operation = {
  id: "operation-1",
  accountId: "account-1",
  source: "mt5",
  trigger: "automatic",
  externalBatchId: "batch-1",
  status: "STARTED",
  totalCount: 12,
  importedCount: 0,
  updatedCount: 0,
  skippedCount: 0,
  failedCount: 0,
  startedAt,
};
const input = {
  accountId: "account-1",
  source: "mt5" as const,
  externalBatchId: "batch-1",
  trigger: "automatic",
  totalCount: 12,
};

describe("startSyncOperation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates one automatic operation with a null actor and zero counters", async () => {
    mocks.operationFindUnique.mockResolvedValue(null);
    mocks.operationCreate.mockResolvedValue(operation);

    await expect(startSyncOperation(input)).resolves.toEqual({
      operation,
      resumed: false,
    });
    expect(mocks.operationCreate).toHaveBeenCalledOnce();
    expect(mocks.operationCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          accountId: "account-1",
          actorUserId: null,
          source: "mt5",
          trigger: "automatic",
          externalBatchId: "batch-1",
          status: "STARTED",
          totalCount: 12,
          importedCount: 0,
          updatedCount: 0,
          skippedCount: 0,
          failedCount: 0,
        },
      }),
    );
  });

  it("resumes a compatible operation without creating another row", async () => {
    const persisted = {
      ...operation,
      status: "PARTIAL",
      importedCount: 4,
      failedCount: 1,
    };
    mocks.operationFindUnique.mockResolvedValue(persisted);

    await expect(startSyncOperation(input)).resolves.toEqual({
      operation: persisted,
      resumed: true,
    });
    expect(mocks.operationCreate).not.toHaveBeenCalled();
  });

  it("rejects reuse with a different trigger", async () => {
    mocks.operationFindUnique.mockResolvedValue(operation);

    await expect(
      startSyncOperation({ ...input, trigger: "manual" }),
    ).rejects.toBeInstanceOf(SyncOperationConflictError);
    expect(mocks.operationCreate).not.toHaveBeenCalled();
  });

  it("rejects reuse when totalCount differs including null", async () => {
    mocks.operationFindUnique.mockResolvedValue(operation);

    await expect(
      startSyncOperation({ ...input, totalCount: null }),
    ).rejects.toBeInstanceOf(SyncOperationConflictError);
    expect(mocks.operationCreate).not.toHaveBeenCalled();
  });

  it("rejects a new non-automatic operation before create", async () => {
    mocks.operationFindUnique.mockResolvedValue(null);

    await expect(
      startSyncOperation({ ...input, trigger: "manual" }),
    ).rejects.toBeInstanceOf(SyncOperationTriggerError);
    expect(mocks.operationCreate).not.toHaveBeenCalled();
  });

  it("recovers a compatible operation after a unique-constraint race", async () => {
    const uniqueError = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "6.19.3",
        meta: {
          target: ["accountId", "source", "externalBatchId"],
        },
      },
    );
    mocks.operationFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(operation);
    mocks.operationCreate.mockRejectedValue(uniqueError);

    await expect(startSyncOperation(input)).resolves.toEqual({
      operation,
      resumed: true,
    });
    expect(mocks.operationCreate).toHaveBeenCalledOnce();
    expect(mocks.operationFindUnique).toHaveBeenCalledTimes(2);
  });

  it("does not treat unrelated persistence errors as duplicates", async () => {
    const failure = new Error("database unavailable");
    mocks.operationFindUnique.mockResolvedValue(null);
    mocks.operationCreate.mockRejectedValue(failure);

    await expect(startSyncOperation(input)).rejects.toBe(failure);
    expect(mocks.operationFindUnique).toHaveBeenCalledOnce();
  });
});
