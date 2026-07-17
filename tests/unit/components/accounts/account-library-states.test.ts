import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import AccountsError, { retryAccounts } from "@/app/accounts/error";
import AccountsLoading from "@/app/accounts/loading";
import ArchivedAccountsLoading from "@/app/accounts/archived/loading";
import CreateAccountLoading from "@/app/accounts/create/loading";
import ManageAccountsLoading from "@/app/accounts/manage/loading";
import { getAccountLibraryEmptyState } from "@/components/accounts/AccountLibraryEmptyState";

describe("Account Library route states", () => {
  it("gives creators the localized create action", () => {
    const state = getAccountLibraryEmptyState("en", { canCreateAccount: true, canManageAccounts: false, hasArchivedAccounts: false });

    expect(state).toMatchObject({ title: "No active accounts", description: "Create your first trading account to start using VOLTIS." });
    expect(state.actions).toEqual([{ href: "/accounts/create", label: "Create account", primary: true }]);
  });

  it("never gives a non-creator an unauthorized create action", () => {
    const state = getAccountLibraryEmptyState("it", { canCreateAccount: false, canManageAccounts: true, hasArchivedAccounts: true });

    expect(state.actions).not.toContainEqual(expect.objectContaining({ href: "/accounts/create" }));
    expect(state.actions.map((action) => action.href)).toEqual(["/accounts/manage", "/accounts/archived"]);
  });

  it("shows management and archive actions only when available", () => {
    expect(getAccountLibraryEmptyState("en", { canCreateAccount: false, canManageAccounts: false, hasArchivedAccounts: true }).actions.map((action) => action.href)).toEqual(["/accounts/archived"]);
    expect(getAccountLibraryEmptyState("en", { canCreateAccount: false, canManageAccounts: true, hasArchivedAccounts: false }).actions.map((action) => action.href)).toEqual(["/accounts/manage"]);
  });

  it("explains an unavailable Library without a false call to action", () => {
    const state = getAccountLibraryEmptyState("en", { canCreateAccount: false, canManageAccounts: false, hasArchivedAccounts: false });

    expect(state).toEqual({ title: "No accounts available", description: "You do not currently have access to an active trading account.", actions: [] });
  });

  it("keeps the filtered-empty state distinct from the genuine Library empty state", () => {
    const source = readFileSync("components/accounts/AccountLibrary.tsx", "utf8");

    expect(source).toContain("No accounts found");
    expect(source).toContain("Try adjusting your search or account filters.");
    expect(source).not.toContain("No active accounts");
  });

  it("uses content-shaped, assistive-technology-hidden route skeletons", () => {
    const loadings = [AccountsLoading, CreateAccountLoading, ManageAccountsLoading, ArchivedAccountsLoading];
    for (const Loading of loadings) {
      const markup = renderToStaticMarkup(React.createElement(Loading));
      expect(markup).toContain('aria-hidden="true"');
      expect(markup).toContain("motion-reduce:animate-none");
      expect(markup).not.toContain("VoltisLightningLoader");
    }
    expect(renderToStaticMarkup(React.createElement(AccountsLoading))).toContain("md:grid-cols-2 xl:grid-cols-3");
  });

  it("keeps the archived empty copy accurate with Library navigation", () => {
    const source = readFileSync("app/accounts/archived/page.tsx", "utf8");

    expect(source).toContain('title="No archived accounts"');
    expect(source).toContain('description="Archived trading accounts will appear here."');
    expect(source).toContain('href="/accounts"');
  });

  it("renders only safe error copy and invokes reset explicitly", () => {
    const reset = vi.fn();
    retryAccounts(reset);
    expect(reset).toHaveBeenCalledOnce();

    const markup = renderToStaticMarkup(React.createElement(AccountsError, { error: new Error("raw database secret"), reset }));
    expect(markup).toContain("Accounts could not be loaded");
    expect(markup).toContain("Something went wrong while loading your accounts. Try again.");
    expect(markup).toContain("Try again");
    expect(markup).not.toContain("raw database secret");
  });

  it("adds no account query, permission, archive-policy, or mutation behavior to state components", () => {
    const sources = ["components/accounts/AccountLibraryEmptyState.tsx", "components/accounts/AccountRouteSkeletons.tsx", "app/accounts/error.tsx"].map((path) => readFileSync(path, "utf8")).join("\n");

    expect(sources).not.toContain("@/lib/prisma");
    expect(sources).not.toContain("@/app/accounts/actions");
    expect(sources).not.toContain("archiveAccount");
  });
});
