import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  accountFindUnique: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tradingAccount: {
      findUnique: mocks.accountFindUnique,
    },
  },
}));

import { POST } from "@/app/api/trade-sync/health/route";

const secret = "unit-test-secret";
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

function request({
  header = secret,
  body = { tradingAccountId: "account-1", source: "MT5" },
}: {
  header?: string | null;
  body?: unknown;
} = {}) {
  const headers = new Headers({ "content-type": "application/json" });
  if (header !== null) headers.set("x-voltis-sync-secret", header);

  return new Request("http://localhost/api/trade-sync/health", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  }) as never;
}

describe("POST /api/trade-sync/health authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TRADE_SYNC_SECRET = secret;
    mocks.accountFindUnique.mockResolvedValue(account);
  });

  afterEach(() => {
    delete process.env.TRADE_SYNC_SECRET;
  });

  it("preserves missing-server-secret and unauthorized response bodies", async () => {
    delete process.env.TRADE_SYNC_SECRET;
    const unconfigured = await POST(request());
    expect(unconfigured.status).toBe(500);
    expect(await unconfigured.json()).toEqual({
      ok: false,
      error: "Trade sync is not configured",
    });

    process.env.TRADE_SYNC_SECRET = secret;
    const unauthorized = await POST(request({ header: "wrong" }));
    expect(unauthorized.status).toBe(401);
    expect(await unauthorized.json()).toEqual({
      ok: false,
      error: "Unauthorized",
    });
  });

  it("preserves archived-account context", async () => {
    mocks.accountFindUnique.mockResolvedValue({
      ...account,
      status: "ARCHIVED",
    });

    const response = await POST(request());

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      ok: false,
      error: "This account is archived and read-only.",
    });
  });

  it("preserves the authorized health response and normalized source", async () => {
    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      message: "Trade sync is ready",
      account,
      source: "mt5",
    });
    expect(mocks.accountFindUnique).toHaveBeenCalledOnce();
  });
});
