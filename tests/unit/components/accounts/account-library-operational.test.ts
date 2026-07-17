import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/accounts/AccountActionsMenu", async () => {
  const ReactModule = await import("react");
  return {
    default: () => ReactModule.createElement("button", { type: "button", "aria-label": "Account actions" }),
  };
});

import {
  FocusCoverCard,
  GridAccountCard,
  getAccountOperationalSignal,
  type AccountLibraryItem,
} from "@/components/accounts/AccountLibrary";

const account: AccountLibraryItem = {
  id: "account-a",
  name: "Primary account",
  type: "LIVE",
  status: "ACTIVE",
  membershipRole: "MANAGER",
  membersCount: 1,
  formattedMembersCount: "1",
  hasMultipleMembers: false,
  isSharedType: false,
  initialBalance: 10_000,
  formattedInitialBalance: "$10,000.00",
  pnl: 250,
  formattedPnl: "+$250.00",
  pnlValue: 250,
  tradeCount: 4,
  formattedTradeCount: "4",
  winRate: "50%",
  winRateValue: 50,
  currency: "USD",
  brokerProvider: null,
  updatedAt: "2026-07-17T12:00:00.000Z",
  integrationMode: "mt5",
  autoSyncEnabled: true,
  syncStatus: "connected",
  canViewMembers: true,
  canManageIntegrations: true,
  canOpenManage: true,
  canArchiveAccount: true,
  canDeleteAccount: false,
};

const labels = {
  initialBalance: "Initial balance",
  trades: "Trades",
  winRate: "Win rate",
  notMeasured: "Not measured",
  member: "member",
  members: "members",
  pnl: "PnL",
  openAccount: "Open workspace",
  archived: "Archived",
};

describe("Account Library operational signals", () => {
  it.each([
    [{ integrationMode: "mt5", autoSyncEnabled: true, syncStatus: "error" }, { kind: "attention", label: "Sync needs attention" }],
    [{ integrationMode: "broker", autoSyncEnabled: true, syncStatus: "pending" }, { kind: "pending", label: "Sync pending" }],
    [{ integrationMode: "hybrid", autoSyncEnabled: true, syncStatus: "connected" }, { kind: "connected", label: "Connected" }],
    [{ integrationMode: "manual", autoSyncEnabled: false, syncStatus: "inactive" }, { kind: "manual", label: "Manual" }],
  ])("maps persisted state %# to its visible signal", (input, expected) => {
    expect(getAccountOperationalSignal(input)).toEqual(expected);
  });

  it("does not guess a healthy state for unknown or contradictory values", () => {
    expect(getAccountOperationalSignal({ integrationMode: "mt5", autoSyncEnabled: true, syncStatus: "disconnected" })).toBeNull();
    expect(getAccountOperationalSignal({ integrationMode: "manual", autoSyncEnabled: false, syncStatus: "connected" })).toBeNull();
  });

  it("derives only a safe label and never exposes extra provider data", () => {
    const persisted = {
      integrationMode: "mt5",
      autoSyncEnabled: true,
      syncStatus: "error",
      providerSecret: "never-display",
      rawError: "provider stack details",
    };

    expect(getAccountOperationalSignal(persisted)).toEqual({ kind: "attention", label: "Sync needs attention" });
    expect(JSON.stringify(getAccountOperationalSignal(persisted))).not.toContain("never-display");
    expect(JSON.stringify(getAccountOperationalSignal(persisted))).not.toContain("provider stack details");
  });

  it("uses the same signal and Dashboard workspace action in Grid and active Focus cards", () => {
    const grid = renderToStaticMarkup(React.createElement(GridAccountCard, { account, labels }));
    const focus = renderToStaticMarkup(React.createElement(FocusCoverCard, { account, labels, active: true }));

    for (const markup of [grid, focus]) {
      expect(markup).toContain("Connected");
      expect(markup).toContain("Open workspace");
      expect(markup).toContain('href="/accounts/account-a/dashboard"');
    }
  });

  it("keeps Focus previews non-interactive and free of operational controls", () => {
    const preview = renderToStaticMarkup(React.createElement(FocusCoverCard, { account, labels, active: false }));

    expect(preview).not.toMatch(/<(?:a(?:\s|>)|button\b)/);
    expect(preview).not.toContain("Connected");
  });

  it("labels the global management destination accurately without changing its permission guard", () => {
    const source = readFileSync("components/accounts/AccountActionsMenu.tsx", "utf8");

    expect(source).toContain("{canOpenManage && (");
    expect(source).toContain('href="/accounts/manage"');
    expect(source).toContain("Manage accounts");
    expect(source).not.toContain(">Manage account\n");
  });

  it("introduces no synthetic health score or metric", () => {
    const source = readFileSync("components/accounts/AccountLibrary.tsx", "utf8");

    expect(source.toLowerCase()).not.toContain("health score");
    expect(source.toLowerCase()).not.toContain("health percentage");
  });
});
