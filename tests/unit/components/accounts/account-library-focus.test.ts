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
  FocusNavigationControls,
  getFocusCardTransition,
  getFocusSelectionIndex,
  isEditableFocusTarget,
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

describe("Account Library Focus mode", () => {
  it("renders visible, named previous and next controls without nested interactions", () => {
    const markup = renderToStaticMarkup(React.createElement(FocusNavigationControls, {
      index: 1,
      accountCount: 3,
      onMove: vi.fn(),
    }));

    expect(markup).toContain('aria-label="Previous account"');
    expect(markup).toContain('aria-label="Next account"');
    expect(markup).not.toMatch(/<button[^>]*>(?:(?!<\/button>)[\s\S])*<(?:button\b|a(?:\s|>))/);
  });

  it("keeps side previews presentation-only and exposes controls only on the active card", () => {
    const preview = renderToStaticMarkup(React.createElement(FocusCoverCard, { account, labels, active: false }));
    const active = renderToStaticMarkup(React.createElement(FocusCoverCard, { account, labels, active: true }));

    expect(preview).not.toMatch(/<(?:a(?:\s|>)|button\b)/);
    expect(active).toContain("Open workspace");
    expect(active).toContain('aria-label="Account actions"');
    expect(active).not.toMatch(/<button[^>]*>(?:(?!<\/button>)[\s\S])*<a(?:\s|>)/);
    expect(active).not.toMatch(/<a(?:\s[^>]*)?>(?:(?!<\/a>)[\s\S])*<button\b/);
  });

  it("clamps explicit and arrow navigation to the available accounts", () => {
    expect(getFocusSelectionIndex(1, -1, 3)).toBe(0);
    expect(getFocusSelectionIndex(1, 1, 3)).toBe(2);
    expect(getFocusSelectionIndex(0, -1, 3)).toBe(0);
    expect(getFocusSelectionIndex(2, 1, 3)).toBe(2);
  });

  it("excludes editable descendants from carousel arrow handling", () => {
    const editable = Object.assign(new EventTarget(), { closest: vi.fn(() => ({ tagName: "INPUT" })) });
    const staticContent = Object.assign(new EventTarget(), { closest: vi.fn(() => null) });

    expect(isEditableFocusTarget(editable)).toBe(true);
    expect(isEditableFocusTarget(staticContent)).toBe(false);
  });

  it("uses the base motion token and removes transitions for reduced-motion users", () => {
    expect(getFocusCardTransition(false)).toContain("var(--duration-base)");
    expect(getFocusCardTransition(false)).not.toMatch(/(?:520|560)ms/);
    expect(getFocusCardTransition(true)).toBe("none");
  });
});
