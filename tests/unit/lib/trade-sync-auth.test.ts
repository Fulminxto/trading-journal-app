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

import {
  authenticateTradeSyncRequest,
  authorizeTradeSyncAccount,
  getTradeSyncSource,
} from "@/lib/trade-sync-auth";

const enabledAccount = {
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

describe("trade-sync authentication", () => {
  afterEach(() => {
    delete process.env.TRADE_SYNC_SECRET;
  });

  it("preserves missing server-secret behavior", () => {
    expect(authenticateTradeSyncRequest(new Headers())).toEqual({
      authorized: false,
      status: 500,
      error: "Trade sync is not configured",
    });
  });

  it("preserves missing and incorrect header behavior", () => {
    process.env.TRADE_SYNC_SECRET = "expected";

    for (const headers of [
      new Headers(),
      new Headers({ "x-voltis-sync-secret": "incorrect" }),
    ]) {
      expect(authenticateTradeSyncRequest(headers)).toEqual({
        authorized: false,
        status: 401,
        error: "Unauthorized",
      });
    }
  });

  it("accepts the unchanged exact shared secret", () => {
    process.env.TRADE_SYNC_SECRET = "expected";

    expect(
      authenticateTradeSyncRequest(
        new Headers({ "x-voltis-sync-secret": "expected" }),
      ),
    ).toEqual({ authorized: true });
  });
});

describe("trade-sync source and account authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("preserves accepted sources and case normalization", () => {
    expect(getTradeSyncSource(" MT5 ")).toBe("mt5");
    expect(getTradeSyncSource("BROKER")).toBe("broker");
    expect(getTradeSyncSource("manual")).toBeNull();
    expect(getTradeSyncSource(null)).toBeNull();
  });

  it.each([
    {
      name: "missing account",
      account: null,
      source: "mt5" as const,
      expected: { status: 404, error: "Trading account not found" },
    },
    {
      name: "archived account",
      account: { ...enabledAccount, status: "ARCHIVED" },
      source: "mt5" as const,
      expected: {
        status: 403,
        error: "Trade sync is disabled for archived accounts",
      },
    },
    {
      name: "manual mode",
      account: { ...enabledAccount, integrationMode: "manual" },
      source: "mt5" as const,
      expected: {
        status: 403,
        error: "Trade sync is disabled because this account is set to Manual Only",
      },
    },
    {
      name: "incompatible mode",
      account: { ...enabledAccount, integrationMode: "broker" },
      source: "mt5" as const,
      expected: {
        status: 403,
        error: 'Source "mt5" is not allowed for integration mode "broker"',
      },
    },
    {
      name: "disabled MT5",
      account: { ...enabledAccount, mt5Enabled: false },
      source: "mt5" as const,
      expected: {
        status: 403,
        error: "MT5 sync is not enabled for this account",
      },
    },
    {
      name: "disabled broker",
      account: {
        ...enabledAccount,
        integrationMode: "broker",
        brokerSyncEnabled: false,
      },
      source: "broker" as const,
      expected: {
        status: 403,
        error: "Broker sync is not enabled for this account",
      },
    },
    {
      name: "disabled auto-sync",
      account: { ...enabledAccount, autoSyncEnabled: false },
      source: "mt5" as const,
      expected: {
        status: 403,
        error: "Auto sync is not enabled for this account",
      },
    },
  ])("rejects $name with the existing status and message", async ({
    account,
    source,
    expected,
  }) => {
    mocks.accountFindUnique.mockResolvedValue(account);

    const result = await authorizeTradeSyncAccount({
      tradingAccountId: "account-1",
      source,
    });

    expect(result).toEqual(expect.objectContaining(expected));
  });

  it.each([
    { integrationMode: "mt5", source: "mt5" as const },
    { integrationMode: "broker", source: "broker" as const },
    { integrationMode: "hybrid", source: "mt5" as const },
    { integrationMode: "hybrid", source: "broker" as const },
  ])("allows $source for $integrationMode mode", async ({
    integrationMode,
    source,
  }) => {
    const account = {
      ...enabledAccount,
      integrationMode,
      mt5Enabled: true,
      brokerSyncEnabled: true,
    };
    mocks.accountFindUnique.mockResolvedValue(account);

    await expect(
      authorizeTradeSyncAccount({
        tradingAccountId: "account-1",
        source,
      }),
    ).resolves.toEqual({ allowed: true, account });
  });
});
