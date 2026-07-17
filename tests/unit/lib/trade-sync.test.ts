import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  accountFindUnique: vi.fn(),
  accountUpdate: vi.fn(),
  tradeFindFirst: vi.fn(),
  tradeFindMany: vi.fn(),
  tradeCreate: vi.fn(),
  tradeUpdate: vi.fn(),
  logActivity: vi.fn(),
  notifyAccountMembers: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tradingAccount: {
      findUnique: mocks.accountFindUnique,
      update: mocks.accountUpdate,
    },
    trade: {
      findFirst: mocks.tradeFindFirst,
      findMany: mocks.tradeFindMany,
      create: mocks.tradeCreate,
      update: mocks.tradeUpdate,
    },
  },
}));

vi.mock("@/lib/activity", () => ({
  logActivity: mocks.logActivity,
  notifyAccountMembers: mocks.notifyAccountMembers,
}));

import {
  importSyncedTrade,
  persistSyncedTrade,
  type TradeSyncPersistenceClient,
} from "@/lib/trade-sync";

const openDate = new Date("2026-07-01T08:00:00.000Z");
const closeDate = new Date("2026-07-01T09:00:00.000Z");
const importedAt = new Date("2026-07-01T09:01:00.000Z");

const input = {
  tradingAccountId: "account-1",
  source: "mt5" as const,
  externalTradeId: "deal-123",
  externalAccountId: "login-456",
  externalOrderId: "position-789",
  platform: "MT5",
  brokerName: "Broker",
  symbol: "EURUSD",
  direction: "BUY",
  openDate,
  openTime: "08:00",
  amount: 1,
  openingPrice: 1.1,
  stopLoss: null,
  takeProfit: null,
  riskReward: null,
  closeDate,
  closingPrice: 1.2,
  outcome: "win",
  resultUsd: 100,
  commission: -2,
  swap: 0,
  fees: -2,
  rawImportData: { transport: "test" },
};

function persistedTrade(overrides: Record<string, unknown> = {}) {
  return {
    id: 10,
    openDate,
    openTime: "08:00",
    symbol: "EURUSD",
    direction: "LONG",
    amount: 1,
    openingPrice: 1.1,
    stopLoss: null,
    takeProfit: null,
    riskReward: null,
    closeDate,
    closingPrice: 1.2,
    outcome: "win",
    resultUsd: 100,
    source: "mt5",
    syncStatus: "imported",
    needsReview: true,
    externalTradeId: "deal-123",
    externalAccountId: "login-456",
    externalOrderId: "position-789",
    platform: "MT5",
    brokerName: "Broker",
    commission: -2,
    swap: 0,
    fees: -2,
    importedAt,
    ...overrides,
  };
}

function transactionClient() {
  const transactionMocks = {
    accountFindUnique: vi.fn().mockResolvedValue({
      id: "account-1",
      createdById: "owner-1",
      members: [],
    }),
    tradeFindFirst: vi.fn(),
    tradeCreate: vi.fn(),
    tradeUpdate: vi.fn(),
  };
  const db = {
    tradingAccount: {
      findUnique: transactionMocks.accountFindUnique,
    },
    trade: {
      findFirst: transactionMocks.tradeFindFirst,
      create: transactionMocks.tradeCreate,
      update: transactionMocks.tradeUpdate,
    },
  } as unknown as TradeSyncPersistenceClient;

  return { db, transactionMocks };
}

describe("persistSyncedTrade database-only core", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates through an injected transaction-compatible client without side effects", async () => {
    const { db, transactionMocks } = transactionClient();
    transactionMocks.tradeFindFirst.mockResolvedValue(null);
    transactionMocks.tradeCreate.mockResolvedValue({
      id: 10,
      needsReview: true,
      syncStatus: "imported",
    });

    await expect(persistSyncedTrade(db, input)).resolves.toEqual({
      status: "created",
      tradeId: 10,
      needsReview: true,
      syncStatus: "imported",
      domainUserId: "owner-1",
    });
    expect(transactionMocks.tradeCreate).toHaveBeenCalledOnce();
    expect(mocks.logActivity).not.toHaveBeenCalled();
    expect(mocks.notifyAccountMembers).not.toHaveBeenCalled();
    expect(mocks.accountUpdate).not.toHaveBeenCalled();
    expect(mocks.tradeFindMany).not.toHaveBeenCalled();
  });

  it("updates through an injected client without side effects", async () => {
    const { db, transactionMocks } = transactionClient();
    transactionMocks.tradeFindFirst.mockResolvedValue(
      persistedTrade({ closingPrice: 1.15, resultUsd: 50 }),
    );
    transactionMocks.tradeUpdate.mockResolvedValue({
      id: 10,
      needsReview: true,
      syncStatus: "imported",
    });

    await expect(persistSyncedTrade(db, input)).resolves.toEqual({
      status: "updated",
      tradeId: 10,
      needsReview: true,
      syncStatus: "imported",
      changedFields: ["closingPrice", "resultUsd"],
      domainUserId: "owner-1",
    });
    expect(transactionMocks.tradeUpdate).toHaveBeenCalledOnce();
    expect(mocks.logActivity).not.toHaveBeenCalled();
    expect(mocks.notifyAccountMembers).not.toHaveBeenCalled();
    expect(mocks.accountUpdate).not.toHaveBeenCalled();
    expect(mocks.tradeFindMany).not.toHaveBeenCalled();
  });

  it("skips through an injected client without persistence or side effects", async () => {
    const { db, transactionMocks } = transactionClient();
    transactionMocks.tradeFindFirst.mockResolvedValue(persistedTrade());

    await expect(persistSyncedTrade(db, input)).resolves.toEqual({
      status: "skipped",
      tradeId: 10,
      needsReview: true,
      syncStatus: "imported",
      domainUserId: "owner-1",
    });
    expect(transactionMocks.tradeCreate).not.toHaveBeenCalled();
    expect(transactionMocks.tradeUpdate).not.toHaveBeenCalled();
    expect(mocks.logActivity).not.toHaveBeenCalled();
    expect(mocks.notifyAccountMembers).not.toHaveBeenCalled();
    expect(mocks.accountUpdate).not.toHaveBeenCalled();
    expect(mocks.tradeFindMany).not.toHaveBeenCalled();
  });
});

describe("importSyncedTrade legacy path", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.accountFindUnique.mockResolvedValue({
      id: "account-1",
      createdById: "owner-1",
      members: [],
      initialBalance: 10_000,
      syncStatus: "connected",
      autoSyncEnabled: true,
    });
    mocks.accountUpdate.mockResolvedValue({});
    mocks.tradeFindMany.mockResolvedValue([]);
    mocks.logActivity.mockResolvedValue(undefined);
    mocks.notifyAccountMembers.mockResolvedValue(undefined);
  });

  it("creates a new trade and performs the existing automatic side effects", async () => {
    mocks.tradeFindFirst.mockResolvedValue(null);
    mocks.tradeCreate.mockResolvedValue({
      id: 10,
      needsReview: true,
      syncStatus: "imported",
    });

    const result = await importSyncedTrade(input);

    expect(result).toEqual({
      status: "created",
      tradeId: 10,
      needsReview: true,
      syncStatus: "imported",
    });
    expect(mocks.tradeCreate).toHaveBeenCalledTimes(1);
    expect(mocks.logActivity).toHaveBeenCalledOnce();
    expect(mocks.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ userId: null, type: "TRADE_IMPORTED" }),
    );
    expect(mocks.notifyAccountMembers).toHaveBeenCalledOnce();
    expect(mocks.accountUpdate).toHaveBeenCalledOnce();
    expect(mocks.tradeFindMany).toHaveBeenCalledOnce();
  });

  it("updates only meaningful changed fields and performs the existing automatic side effects", async () => {
    mocks.tradeFindFirst.mockResolvedValue(
      persistedTrade({ closingPrice: 1.15, resultUsd: 50 }),
    );
    mocks.tradeUpdate.mockResolvedValue({
      id: 10,
      needsReview: true,
      syncStatus: "imported",
    });

    const result = await importSyncedTrade(input);

    expect(result).toEqual({
      status: "updated",
      tradeId: 10,
      needsReview: true,
      syncStatus: "imported",
      changedFields: ["closingPrice", "resultUsd"],
    });
    expect(mocks.tradeUpdate).toHaveBeenCalledOnce();
    expect(mocks.logActivity).toHaveBeenCalledOnce();
    expect(mocks.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: null,
        type: "TRADE_SYNC_UPDATED",
        metadata: expect.objectContaining({
          changedFields: ["closingPrice", "resultUsd"],
        }),
      }),
    );
    expect(mocks.notifyAccountMembers).toHaveBeenCalledOnce();
    expect(mocks.accountUpdate).toHaveBeenCalledOnce();
    expect(mocks.tradeFindMany).toHaveBeenCalledOnce();
  });

  it("skips an identical retry without trade or automatic side effects", async () => {
    mocks.tradeFindFirst.mockResolvedValue(persistedTrade());

    const result = await importSyncedTrade(input);

    expect(result).toEqual({
      status: "skipped",
      tradeId: 10,
      needsReview: true,
      syncStatus: "imported",
    });
    expect(mocks.tradeUpdate).not.toHaveBeenCalled();
    expect(mocks.tradeCreate).not.toHaveBeenCalled();
    expect(mocks.logActivity).not.toHaveBeenCalled();
    expect(mocks.notifyAccountMembers).not.toHaveBeenCalled();
    expect(mocks.tradeFindMany).not.toHaveBeenCalled();
    expect(mocks.accountUpdate).not.toHaveBeenCalled();
    expect(mocks.accountFindUnique).toHaveBeenCalledTimes(2);
  });

  it("restores connected state on an identical retry only when required", async () => {
    mocks.tradeFindFirst.mockResolvedValue(persistedTrade());
    mocks.accountFindUnique
      .mockResolvedValueOnce({
        id: "account-1",
        createdById: "owner-1",
        members: [],
      })
      .mockResolvedValueOnce({ syncStatus: "error", autoSyncEnabled: true });

    await importSyncedTrade(input);

    expect(mocks.accountUpdate).toHaveBeenCalledOnce();
    expect(mocks.tradeUpdate).not.toHaveBeenCalled();
    expect(mocks.logActivity).not.toHaveBeenCalled();
    expect(mocks.notifyAccountMembers).not.toHaveBeenCalled();
    expect(mocks.tradeFindMany).not.toHaveBeenCalled();
  });
});
