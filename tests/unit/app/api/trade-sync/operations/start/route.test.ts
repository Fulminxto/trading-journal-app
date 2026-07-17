import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  accountFindUnique: vi.fn(),
  accountUpdate: vi.fn(),
  startSyncOperation: vi.fn(),
  logActivity: vi.fn(),
  notifyAccountMembers: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tradingAccount: {
      findUnique: mocks.accountFindUnique,
      update: mocks.accountUpdate,
    },
  },
}));

vi.mock("@/lib/activity", () => ({
  logActivity: mocks.logActivity,
  notifyAccountMembers: mocks.notifyAccountMembers,
}));

vi.mock("@/lib/trade-sync-operation", () => {
  class SyncOperationConflictError extends Error {
    constructor() {
      super("Batch identifier already exists with different parameters");
      this.name = "SyncOperationConflictError";
    }
  }

  class SyncOperationTriggerError extends Error {
    constructor() {
      super("Trigger must be automatic");
      this.name = "SyncOperationTriggerError";
    }
  }

  return {
    startSyncOperation: mocks.startSyncOperation,
    SyncOperationConflictError,
    SyncOperationTriggerError,
  };
});

import { POST } from "@/app/api/trade-sync/operations/start/route";
import {
  SyncOperationConflictError,
  SyncOperationTriggerError,
} from "@/lib/trade-sync-operation";

const secret = "unit-test-secret";
const startedAt = new Date("2026-07-17T12:00:00.000Z");
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
const body = {
  tradingAccountId: "account-1",
  source: "MT5",
  externalBatchId: " batch-1 ",
  trigger: "automatic",
  totalCount: 12,
};
const operation = {
  id: "operation-1",
  status: "STARTED",
  totalCount: 12,
  importedCount: 0,
  updatedCount: 0,
  skippedCount: 0,
  failedCount: 0,
  startedAt,
};

function request({
  requestBody = body,
  header = secret,
}: {
  requestBody?: unknown;
  header?: string | null;
} = {}) {
  const headers = new Headers({ "content-type": "application/json" });
  if (header !== null) headers.set("x-voltis-sync-secret", header);

  return new Request(
    "http://localhost/api/trade-sync/operations/start",
    {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    },
  ) as never;
}

describe("POST /api/trade-sync/operations/start", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TRADE_SYNC_SECRET = secret;
    mocks.accountFindUnique.mockResolvedValue(account);
    mocks.startSyncOperation.mockResolvedValue({
      operation,
      resumed: false,
    });
  });

  afterEach(() => {
    delete process.env.TRADE_SYNC_SECRET;
  });

  it("creates a valid operation and returns HTTP 201", async () => {
    const response = await POST(request());

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      operationId: "operation-1",
      status: "STARTED",
      totalCount: 12,
      importedCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      failedCount: 0,
      startedAt: "2026-07-17T12:00:00.000Z",
      resumed: false,
    });
    expect(mocks.startSyncOperation).toHaveBeenCalledWith({
      accountId: "account-1",
      source: "mt5",
      externalBatchId: "batch-1",
      trigger: "automatic",
      totalCount: 12,
    });
  });

  it("returns persisted values with HTTP 200 when resumed", async () => {
    mocks.startSyncOperation.mockResolvedValue({
      operation: {
        ...operation,
        status: "PROCESSING",
        importedCount: 3,
        skippedCount: 2,
      },
      resumed: true,
    });

    const response = await POST(request());
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual(
      expect.objectContaining({
        status: "PROCESSING",
        importedCount: 3,
        skippedCount: 2,
        resumed: true,
      }),
    );
  });

  it.each([
    { ...body, trigger: "manual" },
    { ...body, totalCount: 13 },
  ])("returns HTTP 409 for incompatible duplicate parameters", async (requestBody) => {
    mocks.startSyncOperation.mockRejectedValue(
      new SyncOperationConflictError(),
    );

    const response = await POST(request({ requestBody }));

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: "Batch identifier already exists with different parameters",
    });
  });

  it("rejects malformed JSON safely", async () => {
    const response = await POST(
      new Request("http://localhost/api/trade-sync/operations/start", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-voltis-sync-secret": secret,
        },
        body: "{not-json",
      }) as never,
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid JSON payload" });
  });

  it("returns HTTP 400 for a new non-automatic trigger", async () => {
    mocks.startSyncOperation.mockRejectedValue(
      new SyncOperationTriggerError(),
    );

    const response = await POST(
      request({ requestBody: { ...body, trigger: "manual" } }),
    );

    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain(
      "trigger (must be automatic)",
    );
  });

  it("preserves shared authentication failures", async () => {
    delete process.env.TRADE_SYNC_SECRET;
    const unconfigured = await POST(request());
    expect(unconfigured.status).toBe(500);
    expect(await unconfigured.json()).toEqual({
      error: "Trade sync is not configured",
    });

    process.env.TRADE_SYNC_SECRET = secret;
    const unauthorized = await POST(request({ header: "wrong" }));
    expect(unauthorized.status).toBe(401);
    expect(await unauthorized.json()).toEqual({ error: "Unauthorized" });
  });

  it("preserves shared account and source authorization failures", async () => {
    mocks.accountFindUnique.mockResolvedValueOnce(null);
    const missing = await POST(request());
    expect(missing.status).toBe(404);
    expect(await missing.json()).toEqual({
      error: "Trading account not found",
    });

    mocks.accountFindUnique.mockResolvedValueOnce({
      ...account,
      integrationMode: "broker",
    });
    const wrongSource = await POST(request());
    expect(wrongSource.status).toBe(403);
    expect(await wrongSource.json()).toEqual({
      error: 'Source "mt5" is not allowed for integration mode "broker"',
    });
    expect(mocks.startSyncOperation).not.toHaveBeenCalled();
  });

  it("rejects archived accounts before creating an operation or side effect", async () => {
    mocks.accountFindUnique.mockResolvedValue({ ...account, status: "ARCHIVED" });

    const response = await POST(request());

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: "This account is archived and read-only.",
    });
    expect(mocks.startSyncOperation).not.toHaveBeenCalled();
    expect(mocks.logActivity).not.toHaveBeenCalled();
    expect(mocks.notifyAccountMembers).not.toHaveBeenCalled();
    expect(mocks.accountUpdate).not.toHaveBeenCalled();
  });

  it.each([
    {},
    { ...body, tradingAccountId: " " },
    { ...body, source: "manual" },
    { ...body, externalBatchId: " " },
    { ...body, externalBatchId: "x".repeat(201) },
    { ...body, trigger: "" },
    { ...body, totalCount: -1 },
    { ...body, totalCount: 1.5 },
    { ...body, totalCount: "12" },
  ])("rejects invalid request fields safely", async (requestBody) => {
    const response = await POST(request({ requestBody }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error:
        "Missing or invalid fields: tradingAccountId, source, externalBatchId, trigger (must be automatic), totalCount (must be a non-negative integer or null)",
    });
  });

  it.each([
    { label: "omitted", requestBody: { ...body, totalCount: undefined } },
    { label: "null", requestBody: { ...body, totalCount: null } },
  ])("accepts $label totalCount as unknown", async ({ requestBody }) => {
    const response = await POST(request({ requestBody }));

    expect(response.status).toBe(201);
    expect(mocks.startSyncOperation).toHaveBeenCalledWith(
      expect.objectContaining({ totalCount: null }),
    );
  });

  it("returns a generic HTTP 500 for unexpected persistence errors", async () => {
    mocks.startSyncOperation.mockRejectedValue(
      new Error("database secret and stack"),
    );

    const response = await POST(request());

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Batch start failed" });
  });

  it("does not invoke activity, notification, equity, or account-state side effects", async () => {
    await POST(request());

    expect(mocks.logActivity).not.toHaveBeenCalled();
    expect(mocks.notifyAccountMembers).not.toHaveBeenCalled();
    expect(mocks.accountUpdate).not.toHaveBeenCalled();
  });
});
