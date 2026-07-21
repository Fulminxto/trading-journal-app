import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/accounts/actions", () => ({
  archiveAccount: vi.fn(),
  restoreAccount: vi.fn(),
  deleteAccount: vi.fn(),
}));

import AccountLifecycleList, {
  getLifecycleActionLabels,
  type LifecycleAccount,
  type LifecycleLabels,
} from "@/components/accounts/AccountLifecycleList";

const labels: LifecycleLabels = {
  open: "Open workspace",
  viewArchived: "View archived account",
  archive: "Archive account",
  restore: "Restore account",
  delete: "Delete account",
  cancel: "Cancel",
  archiveTitle: "Archive account?",
  archiveDescription: "Historical access remains available in read-only mode.",
  restoreTitle: "Restore account?",
  restoreDescription: "The account will become active again.",
  deleteTitle: "Delete account permanently?",
  deleteDescription: "This permanently deletes the account.",
  pending: "Updating account…",
  actionFailed: "The account could not be updated. Try again.",
};

const active: LifecycleAccount = { id: "active-1", name: "Active account", status: "ACTIVE", type: "LIVE", currency: "USD", broker: "Broker", role: "MANAGER", canArchiveOrRestore: true, canDelete: true };
const archived: LifecycleAccount = { id: "archived-1", name: "Archived account", status: "ARCHIVED", type: "PROP", currency: "EUR", broker: null, role: "MEMBER", canArchiveOrRestore: true, canDelete: false };

describe("account lifecycle management", () => {
  it("gives active and archived accounts distinct applicable actions", () => {
    expect(getLifecycleActionLabels(active, labels)).toEqual(["Open workspace", "Edit account information", "Archive account", "Delete account"]);
    expect(getLifecycleActionLabels(archived, labels)).toEqual(["View archived account", "Edit archived account", "Restore account"]);
  });

  it("honors existing archive, restore, and delete permission flags", () => {
    expect(getLifecycleActionLabels({ ...active, canArchiveOrRestore: false, canDelete: false }, labels)).toEqual(["Open workspace", "Edit account information"]);
    expect(getLifecycleActionLabels({ ...archived, canArchiveOrRestore: false }, labels)).toEqual(["View archived account", "Edit archived account"]);
  });

  it("renders lifecycle actions as accessible siblings without nested controls", () => {
    const markup = renderToStaticMarkup(React.createElement(AccountLifecycleList, { accounts: [active, archived], labels }));

    expect(markup).toContain('aria-label="Open workspace: Active account"');
    expect(markup).toContain('aria-label="View archived account: Archived account"');
    expect(markup).toContain('aria-label="Account actions for Active account"');
    expect(markup).toContain('aria-label="Account actions for Archived account"');
    expect(markup).toContain('aria-haspopup="menu"');
    expect(markup).not.toMatch(/<button[^>]*>(?:(?!<\/button>)[\s\S])*<a(?:\s|>)/);
    expect(markup).not.toMatch(/<a(?:\s[^>]*)?>(?:(?!<\/a>)[\s\S])*<button\b/);
  });

  it("positions the page as lifecycle management without embedded configuration creation", () => {
    const source = readFileSync("app/accounts/manage/page.tsx", "utf8");

    expect(source).toContain('title: "Manage accounts"');
    expect(source).toContain("Create, open, archive, restore, or remove the accounts you are authorized to manage.");
    expect(source).toContain("<AccountLifecycleManager");
    expect(source).not.toContain("createAccount(formData");
    expect(source).not.toContain('<form action={createAccount}');
    expect(source).not.toContain('<form action={createAccount}');
  });

  it("passes distinct account groups into the unified client-side manager", () => {
    const source = readFileSync("app/accounts/manage/page.tsx", "utf8");
    const manager = readFileSync("components/accounts/AccountLifecycleManager.tsx", "utf8");

    expect(source).toContain("activeAccounts={activeAccounts}");
    expect(source).toContain("archivedAccounts={archivedAccounts}");
    expect(manager).toContain("No active accounts");
    expect(manager).toContain("No archived accounts");
    expect(manager).toContain("No recently deleted accounts");
    expect(manager).toContain('role="tablist"');
    expect(manager).toContain('role="tabpanel"');
  });

  it("keeps the server query authoritative and passes no integration secrets to the client", () => {
    const page = readFileSync("app/accounts/manage/page.tsx", "utf8");

    expect(page).toContain('role: "MANAGER"');
    expect(page).toContain("createdById: currentUser.id");
    expect(page).toContain("canArchiveOrRestore:");
    expect(page).toContain("canDelete:");
    for (const forbidden of ["mt5AccountLogin", "mt5ServerName", "brokerAccountId", "rawError", "syncSecret", "externalAccountId"]) {
      expect(page).not.toContain(forbidden);
    }
  });

  it("retains safe lifecycle confirmations and existing server actions", () => {
    const component = readFileSync("components/accounts/AccountLifecycleList.tsx", "utf8");
    const page = readFileSync("app/accounts/manage/page.tsx", "utf8");

    expect(component).toContain("archiveAccount");
    expect(component).toContain("restoreAccount");
    expect(component).toContain("deleteAccount");
    expect(page).toContain("read-only mode");
    expect(component).not.toContain("error.message");
  });
});
