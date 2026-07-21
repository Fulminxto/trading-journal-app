import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (file: string) => readFileSync(file, "utf8");

describe("archived account correction mode", () => {
  it("adds active and archived account information edit entries", () => {
    expect(source("components/accounts/AccountActionsMenu.tsx")).toContain("Edit account information");
    const lifecycle = source("components/accounts/AccountLifecycleList.tsx");
    expect(lifecycle).toContain("Edit account information");
    expect(lifecycle).toContain("Edit archived account");
    expect(lifecycle).toContain('"?correction=1"');
  });

  it("keeps normal archived entry read-only and correction entry explicit", () => {
    const lifecycle = source("components/accounts/AccountLifecycleList.tsx");
    expect(lifecycle).toContain('href={`/accounts/${account.id}/dashboard`}');
    const editPage = source("app/accounts/[accountId]/edit/page.tsx");
    expect(editPage).toContain('status === "ARCHIVED" && !correctionMode');
    expect(editPage).toContain('isCorrectionMode(query.correction)');
  });

  it("does not restore an account while correcting information", () => {
    const actions = source("app/accounts/actions.ts");
    const update = actions.slice(actions.indexOf("updateAccountInformationWithState"), actions.indexOf("export async function archiveAccount"));
    expect(update).toContain("tradingAccount.update");
    expect(update).not.toContain('status: "ACTIVE"');
    expect(update).toContain("getArchivedCorrectionAccess");
  });

  it("reuses the existing trade edit pathway with server-authorized correction intent", () => {
    const diary = source("app/accounts/[accountId]/diary/page.tsx");
    const tradeActions = source("app/accounts/[accountId]/diary/actions.ts");
    expect(diary).toContain('isCorrectionMode(filters.correction)');
    expect(diary).toContain('"?correction=1"');
    expect(tradeActions).toContain("getArchivedCorrectionAccess");
    expect(tradeActions).toContain('getString(formData, "correctionMode") === "1"');
  });

  it("reenables existing Sessions, Rules, and Playbook editors through guarded correction intent", () => {
    expect(source("app/accounts/[accountId]/sessions/page.tsx")).toContain("correctionMode");
    expect(source("app/accounts/[accountId]/sessions/actions.ts")).toContain("getArchivedCorrectionAccess");
    expect(source("app/accounts/[accountId]/rules/page.tsx")).toContain("correctionMode");
    expect(source("app/accounts/[accountId]/rules/actions.ts")).toContain("getArchivedCorrectionAccess");
    expect(source("app/accounts/[accountId]/playbook/page.tsx")).toContain("correctionMode");
    expect(source("app/accounts/[accountId]/playbook/actions.ts")).toContain("getArchivedCorrectionAccess");
  });

  it("keeps derived and operational surfaces non-editable", () => {
    for (const page of ["dashboard", "calendar", "equity", "analytics", "reports"]) {
      expect(source(`app/accounts/[accountId]/${page}/page.tsx`)).not.toContain("correctionMode");
    }
    expect(source("app/accounts/[accountId]/copilot/actions.ts")).toContain("assertAccountWritable");
    expect(source("app/accounts/[accountId]/integrations/page.tsx")).toContain("!isArchived");
    expect(source("app/accounts/[accountId]/members/page.tsx")).toContain("!isArchived");
  });

  it("provides a compact exit back to normal read-only mode", () => {
    const indicator = source("components/ArchivedCorrectionModeIndicator.tsx");
    expect(indicator).toContain("Correction mode");
    expect(indicator).toContain("Exit correction mode");
    expect(indicator).toContain("href={pathname}");
  });
});
