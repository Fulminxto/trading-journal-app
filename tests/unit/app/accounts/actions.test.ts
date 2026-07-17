import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  userFindUnique: vi.fn(),
  transaction: vi.fn(),
  accountCreate: vi.fn(),
  memberCreate: vi.fn(),
  persistActivity: vi.fn(),
  logActivity: vi.fn(),
  redirect: vi.fn(),
  sendPush: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: mocks.userFindUnique },
    $transaction: mocks.transaction,
  },
}));
vi.mock("@/lib/activity", () => ({
  persistActivityLog: mocks.persistActivity,
  logActivity: mocks.logActivity,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/push", () => ({ sendPushToUser: mocks.sendPush }));

import { createAccountWithState } from "@/app/accounts/actions";

const currentUser = {
  id: "user-1",
  username: "member",
  role: "MEMBER",
  appLanguage: "en",
  canCreatePersonalAccounts: true,
  canCreateSharedAccounts: false,
};
const account = {
  id: "account-1",
  name: "Primary account",
  type: "LIVE",
  initialBalance: 10_000,
  currency: "USD",
};
const tx = {
  tradingAccount: { create: mocks.accountCreate },
  accountMember: { create: mocks.memberCreate },
};

function form(overrides: Record<string, string> = {}) {
  const values = {
    name: "  Primary account  ",
    type: "LIVE",
    initialBalance: "10000",
    currency: "USD",
    broker: " Broker ",
    phase: "",
    profitTarget: "",
    maxDrawdown: "",
    dailyDrawdown: "",
    ...overrides,
  };
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("account creation action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.userFindUnique.mockResolvedValue(currentUser);
    mocks.accountCreate.mockResolvedValue(account);
    mocks.memberCreate.mockResolvedValue({ id: "membership-1" });
    mocks.persistActivity.mockResolvedValue({ id: "activity-1" });
    mocks.transaction.mockImplementation(
      (callback: (client: typeof tx) => unknown) => callback(tx),
    );
    mocks.redirect.mockImplementation((path: string) => {
      throw new Error(`REDIRECT:${path}`);
    });
  });

  it("creates the account, manager membership, and ActivityLog in one transaction", async () => {
    await expect(createAccountWithState(null, form())).rejects.toThrow(
      "REDIRECT:/accounts/account-1/dashboard",
    );

    expect(mocks.transaction).toHaveBeenCalledOnce();
    expect(mocks.accountCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "Primary account",
        type: "LIVE",
        initialBalance: 10_000,
        currency: "USD",
        createdById: "user-1",
        broker: "Broker",
      }),
    });
    expect(mocks.memberCreate).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        tradingAccountId: "account-1",
        role: "MANAGER",
        canCreateTrades: true,
        canEditTrades: true,
        canDeleteTrades: true,
        canViewAnalytics: true,
        canViewReports: true,
        canViewCopilot: true,
        canViewMembers: true,
        canManageMembers: true,
        canManageRoles: true,
        canManageAccount: true,
      },
    });
    expect(mocks.persistActivity).toHaveBeenCalledWith(tx, expect.objectContaining({
      userId: "user-1",
      accountId: "account-1",
      type: "ACCOUNT_CREATED",
    }));
    expect(mocks.logActivity).not.toHaveBeenCalled();
    expect(mocks.sendPush).not.toHaveBeenCalled();
  });

  it.each([
    ["membership", mocks.memberCreate],
    ["activity", mocks.persistActivity],
  ])("returns a generic failure when %s persistence rolls back", async (_label, failingMock) => {
    failingMock.mockRejectedValue(new Error("raw database failure"));

    await expect(createAccountWithState(null, form())).resolves.toEqual({
      error: "Account creation failed. Please try again.",
      values: expect.objectContaining({ name: "Primary account" }),
    });
    expect(mocks.transaction).toHaveBeenCalledOnce();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("prevents persistence for invalid values and preserves submitted values", async () => {
    const result = await createAccountWithState(null, form({
      name: "   ",
      type: "UNKNOWN",
      currency: "BTC",
    }));

    expect(result).toEqual({
      error: "Check the highlighted fields and try again.",
      fieldErrors: {
        name: "Check this field.",
        type: "Check this field.",
        currency: "Check this field.",
      },
      values: expect.objectContaining({
        name: "",
        type: "UNKNOWN",
        currency: "BTC",
      }),
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("rejects unauthorized account types before the transaction", async () => {
    mocks.userFindUnique.mockResolvedValue({
      ...currentUser,
      canCreatePersonalAccounts: false,
    });

    await expect(createAccountWithState(null, form())).resolves.toEqual({
      error: "You do not have permission to create this account.",
      values: expect.objectContaining({ name: "Primary account" }),
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("returns only the safe generic message for an unexpected transaction failure", async () => {
    mocks.transaction.mockRejectedValue(new Error("database URL and stack"));

    const result = await createAccountWithState(null, form());

    expect(result.error).toBe("Account creation failed. Please try again.");
    expect(JSON.stringify(result)).not.toContain("database URL");
  });

  it("validates supported enums and trims name and broker values", async () => {
    await expect(createAccountWithState(null, form({
      name: "  Trimmed name  ",
      broker: "  Firm  ",
      type: "FUNDED",
      currency: "eur",
    }))).rejects.toThrow("REDIRECT:/accounts/account-1/dashboard");

    expect(mocks.accountCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "Trimmed name",
        broker: "Firm",
        type: "FUNDED",
        currency: "EUR",
      }),
    });
  });

  it("does not catch redirect control flow as a persistence failure", async () => {
    await expect(createAccountWithState(null, form())).rejects.toThrow(
      "REDIRECT:/accounts/account-1/dashboard",
    );
    expect(mocks.redirect).toHaveBeenCalledOnce();
    expect(mocks.transaction).toHaveBeenCalledOnce();
  });
});
