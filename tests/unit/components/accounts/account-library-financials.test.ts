import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/accounts/AccountActionsMenu", () => ({
  default: vi.fn(),
}));

import {
  getAccountLibraryPnlAggregate,
  getPnlPercentageBadgeData,
  sortAccountLibraryItems,
} from "@/components/accounts/AccountLibrary";

describe("Account Library financial semantics", () => {
  it("orders accounts by name and then ID without mutating the input", () => {
    const accounts = [
      { id: "account-3", name: "Zulu" },
      { id: "account-2", name: "Alpha" },
      { id: "account-1", name: "alpha" },
    ];

    const ordered = sortAccountLibraryItems(accounts);

    expect(ordered.map((account) => account.id)).toEqual([
      "account-1",
      "account-2",
      "account-3",
    ]);
    expect(accounts.map((account) => account.id)).toEqual([
      "account-3",
      "account-2",
      "account-1",
    ]);
  });

  it("calculates PnL percentage from raw PnL and initial balance", () => {
    expect(getPnlPercentageBadgeData({
      pnl: 250,
      initialBalance: 10_000,
      tradesCount: 3,
    })).toEqual({
      label: "+2.50%",
      tone: "positive",
      accessibleLabel: "PnL percentage: positive 2.50 percent",
    });
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "returns the unavailable fallback for invalid initial balance %s",
    (initialBalance) => {
      expect(getPnlPercentageBadgeData({
        pnl: 100,
        initialBalance,
        tradesCount: 2,
      })).toMatchObject({ label: "--", tone: "neutral" });
    },
  );

  it("aggregates accounts only when their currency is the same", () => {
    expect(getAccountLibraryPnlAggregate([
      { currency: "EUR", pnl: 125.5 },
      { currency: "EUR", pnl: -25.5 },
    ])).toEqual({
      kind: "single",
      pnl: 100,
      currency: "EUR",
    });
  });

  it("never combines mixed-currency PnL", () => {
    expect(getAccountLibraryPnlAggregate([
      { currency: "USD", pnl: 1_000 },
      { currency: "EUR", pnl: 2_000 },
    ])).toEqual({
      kind: "mixed",
      pnl: null,
      currency: null,
    });
  });

  it("does not accept formatted display strings as calculation inputs", () => {
    const raw = { pnl: 1_234.56, initialBalance: 10_000, tradesCount: 4 };
    const displayOnly = {
      formattedPnl: "1.234,56 €",
      formattedInitialBalance: "10.000,00 €",
    };

    expect(getPnlPercentageBadgeData(raw).label).toBe("+12.35%");
    expect(displayOnly).toEqual({
      formattedPnl: "1.234,56 €",
      formattedInitialBalance: "10.000,00 €",
    });
  });
});
