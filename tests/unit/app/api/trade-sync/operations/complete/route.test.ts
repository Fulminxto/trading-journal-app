import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  accountFindUnique: vi.fn(),
  completeSyncOperation: vi.fn(),
  dispatchPushEffects: vi.fn(),
  sendPush: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { tradingAccount: { findUnique: mocks.accountFindUnique } },
}));

vi.mock("@/lib/trade-sync-operation-completion", () => {
  class SyncOperationCompletionError extends Error {
    constructor(
      readonly httpStatus: number,
      readonly safeMessage: string,
    ) {
      super(safeMessage);
    }
  }

  return {
    completeSyncOperation: mocks.completeSyncOperation,
    SyncOperationCompletionError,
  };
});

vi.mock("@/lib/push", () => ({ sendPushToUser: mocks.sendPush }));

vi.mock("@/lib/trade-sync-operation-effects", () => ({
  dispatchSyncOperationPushEffects: mocks.dispatchPushEffects,
}));

import { POST } from "@/app/api/trade-sync/operations/[operationId]/complete/route";
import { SyncOperationCompletionError } from "@/lib/trade-sync-operation-completion";

const secret = "unit-test-secret";
const completedAt = new Date("2026-07-17T12:00:00.000Z");
const account = {
  id: "account-1",
  name: "Account",
  status: "ACTIVE",
  integrationMode: "mt5",
  autoSyncEnabled: true,
  mt5Enabled: true,
  brokerSyncEnabled: false,
  syncStatus: "connected",
  lastSyncedAt: null,
};
const result = {
  operationId: "path-operation",
  status: "COMPLETED" as const,
  totalCount: 3,
  importedCount: 1,
  updatedCount: 1,
  skippedCount: 1,
  failedCount: 0,
  processedCount: 3,
  completedAt,
  durationMs: 60_000,
  replayed: false,
};

function request({
  requestBody = { tradingAccountId: " account-1 ", source: " MT5 " },
  header = secret,
}: {
  requestBody?: unknown;
  header?: string | null;
} = {}) {
  const headers = new Headers({ "content-type": "application/json" });
  if (header !== null) headers.set("x-voltis-sync-secret", header);

  return new Request(
    "http://localhost/api/trade-sync/operations/path-operation/complete",
    { method: "POST", headers, body: JSON.stringify(requestBody) },
  ) as never;
}

function context(operationId = "path-operation") {
  return { params: Promise.resolve({ operationId }) };
}

describe("POST /api/trade-sync/operations/[operationId]/complete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TRADE_SYNC_SECRET = secret;
    mocks.accountFindUnique.mockResolvedValue(account);
    mocks.completeSyncOperation.mockResolvedValue(result);
    mocks.dispatchPushEffects.mockResolvedValue({
      operationId: "path-operation",
      claimedCount: 0,
      completedCount: 0,
      failedCount: 0,
      skippedCount: 0,
      exhaustedCount: 0,
      pendingCount: 0,
    });
  });

  afterEach(() => {
    delete process.env.TRADE_SYNC_SECRET;
  });

  it("calls completion with the path ID and normalized authorized body", async () => {
    const response = await POST(request(), context());

    expect(response.status).toBe(200);
    expect(mocks.completeSyncOperation).toHaveBeenCalledWith({
      operationId: "path-operation",
      tradingAccountId: "account-1",
      source: "mt5",
    });
    expect(mocks.accountFindUnique).toHaveBeenCalledOnce();
    expect(mocks.dispatchPushEffects).toHaveBeenCalledWith({
      operationId: "path-operation",
    });
    expect(mocks.completeSyncOperation.mock.invocationCallOrder[0])
      .toBeLessThan(mocks.dispatchPushEffects.mock.invocationCallOrder[0]);
  });

  it("returns exactly the approved fields and an ISO completion timestamp", async () => {
    const response = await POST(request(), context());

    expect(await response.json()).toEqual({
      operationId: "path-operation",
      status: "COMPLETED",
      totalCount: 3,
      importedCount: 1,
      updatedCount: 1,
      skippedCount: 1,
      failedCount: 0,
      processedCount: 3,
      completedAt: "2026-07-17T12:00:00.000Z",
      durationMs: 60_000,
      replayed: false,
    });
  });

  it("returns a replayed terminal result with HTTP 200", async () => {
    mocks.completeSyncOperation.mockResolvedValue({ ...result, replayed: true });

    const response = await POST(request(), context());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(expect.objectContaining({ replayed: true }));
    expect(mocks.dispatchPushEffects).toHaveBeenCalledWith({
      operationId: "path-operation",
    });
  });

  it("dispatches using the operation ID returned by completion", async () => {
    mocks.completeSyncOperation.mockResolvedValue({
      ...result,
      operationId: "persisted-operation",
    });

    await POST(request(), context("path-operation"));

    expect(mocks.completeSyncOperation).toHaveBeenCalledWith(expect.objectContaining({
      operationId: "path-operation",
    }));
    expect(mocks.dispatchPushEffects).toHaveBeenCalledWith({
      operationId: "persisted-operation",
    });
  });

  it("ignores a body operation ID and uses only the path parameter", async () => {
    await POST(request({ requestBody: {
      tradingAccountId: "account-1",
      source: "mt5",
      operationId: "body-operation",
    } }), context("path-operation"));

    expect(mocks.completeSyncOperation).toHaveBeenCalledWith(expect.objectContaining({
      operationId: "path-operation",
    }));
  });

  it("rejects malformed JSON safely", async () => {
    const response = await POST(new Request(
      "http://localhost/api/trade-sync/operations/path-operation/complete",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-voltis-sync-secret": secret,
        },
        body: "{not-json",
      },
    ) as never, context());

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid JSON payload" });
  });

  it.each([
    {},
    { tradingAccountId: " ", source: "mt5" },
    { tradingAccountId: 1, source: "mt5" },
    { tradingAccountId: "account-1" },
    { tradingAccountId: "account-1", source: "unsupported" },
  ])("rejects missing or invalid body fields", async (requestBody) => {
    const response = await POST(request({ requestBody }), context());

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Missing or invalid fields: tradingAccountId, source",
    });
    expect(mocks.completeSyncOperation).not.toHaveBeenCalled();
    expect(mocks.dispatchPushEffects).not.toHaveBeenCalled();
  });

  it("stops before authorization and completion on authentication failure", async () => {
    const response = await POST(request({ header: "wrong" }), context());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
    expect(mocks.accountFindUnique).not.toHaveBeenCalled();
    expect(mocks.completeSyncOperation).not.toHaveBeenCalled();
    expect(mocks.dispatchPushEffects).not.toHaveBeenCalled();
  });

  it("preserves missing server-secret behavior", async () => {
    delete process.env.TRADE_SYNC_SECRET;

    const response = await POST(request(), context());

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Trade sync is not configured" });
    expect(mocks.completeSyncOperation).not.toHaveBeenCalled();
    expect(mocks.dispatchPushEffects).not.toHaveBeenCalled();
  });

  it("preserves account authorization failures and skips completion", async () => {
    mocks.accountFindUnique.mockResolvedValue(null);

    const response = await POST(request(), context());

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Trading account not found" });
    expect(mocks.completeSyncOperation).not.toHaveBeenCalled();
    expect(mocks.dispatchPushEffects).not.toHaveBeenCalled();
  });

  it("rejects archived completion before finalization and effects", async () => {
    mocks.accountFindUnique.mockResolvedValue({ ...account, status: "ARCHIVED" });

    const response = await POST(request(), context());

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: "This account is archived and read-only.",
    });
    expect(mocks.completeSyncOperation).not.toHaveBeenCalled();
    expect(mocks.dispatchPushEffects).not.toHaveBeenCalled();
    expect(mocks.sendPush).not.toHaveBeenCalled();
  });

  it.each([
    [404, "Sync operation not found"],
    [409, "Sync operation does not match request"],
    [409, "Sync operation still has items being processed"],
  ])("maps a controlled completion error to HTTP %s", async (status, safeMessage) => {
    mocks.completeSyncOperation.mockRejectedValue(
      new SyncOperationCompletionError(status, safeMessage),
    );

    const response = await POST(request(), context());

    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ error: safeMessage });
    expect(mocks.dispatchPushEffects).not.toHaveBeenCalled();
  });

  it("keeps the exact HTTP 200 completion response when dispatch fails", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.dispatchPushEffects.mockRejectedValue(
      new Error("provider token and internal stack"),
    );

    const response = await POST(request(), context());
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({
      operationId: "path-operation",
      status: "COMPLETED",
      totalCount: 3,
      importedCount: 1,
      updatedCount: 1,
      skippedCount: 1,
      failedCount: 0,
      processedCount: 3,
      completedAt: "2026-07-17T12:00:00.000Z",
      durationMs: 60_000,
      replayed: false,
    });
    expect(JSON.stringify(responseBody)).not.toContain("provider token");
    expect(consoleError).toHaveBeenCalledWith(
      "[trade-sync] push effect dispatch failed",
    );
    expect(consoleError.mock.calls.flat().join(" ")).not.toContain("provider token");
    consoleError.mockRestore();
  });

  it("returns a generic safe HTTP 500 for unknown errors", async () => {
    mocks.completeSyncOperation.mockRejectedValue(
      new Error("database credentials and stack details"),
    );

    const response = await POST(request(), context());
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody).toEqual({ error: "Batch completion failed" });
    expect(JSON.stringify(responseBody)).not.toContain("credentials");
    expect(mocks.dispatchPushEffects).not.toHaveBeenCalled();
    expect(mocks.sendPush).not.toHaveBeenCalled();
  });
});
