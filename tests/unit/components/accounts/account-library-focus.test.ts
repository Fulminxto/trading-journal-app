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
} from "@/components/accounts/AccountLibrary";
import type { AccountLibraryItem } from "@/components/accounts/account-library-utils";

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

describe("Account Library Focus mode", () => {
  it("keeps side previews presentation-only and exposes controls only on the active card", () => {
    const preview = renderToStaticMarkup(React.createElement(FocusCoverCard, { account, labels, active: false }));
    const active = renderToStaticMarkup(React.createElement(FocusCoverCard, { account, labels, active: true }));

    expect(preview).not.toMatch(/<(?:a(?:\s|>)|button\b)/);
    expect(active).toContain("Open workspace");
    expect(active).toContain('aria-label="Account actions"');
    expect(active).not.toMatch(/<button[^>]*>(?:(?!<\/button>)[\s\S])*<a(?:\s|>)/);
    expect(active).not.toMatch(/<a(?:\s[^>]*)?>(?:(?!<\/a>)[\s\S])*<button\b/);
  });

  it("uses the pre-arrow hover-intent carousel behavior", () => {
    const source = readFileSync("components/accounts/AccountLibrary.tsx", "utf8");

    expect(source).toContain("selectWithIntent");
    expect(source).toContain("onPointerEnter");
    expect(source).toContain("pointerRatio");
    expect(source).toContain("focus-card-enter");
    expect(source).not.toContain("FocusNavigationControls");
    expect(source).not.toContain('aria-label="Previous account"');
  });
});
