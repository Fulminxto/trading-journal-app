import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

function source(relativePath: string) {
  return readFileSync(path.resolve(process.cwd(), relativePath), "utf8");
}

describe("archived historical workspace policy", () => {
  it("allows authorized Copilot reads while removing archived interaction controls", () => {
    const page = source("app/accounts/[accountId]/copilot/page.tsx");
    const conversation = source("components/copilot/CopilotConversationCard.tsx");
    const actions = source("app/accounts/[accountId]/copilot/actions.ts");

    expect(page).not.toContain('membership.tradingAccount.status === "ARCHIVED") {\n    redirect');
    expect(page).toContain("readOnly={isArchived}");
    expect(conversation).toContain("{!readOnly && <form");
    expect(conversation).toMatch(
      /\{!readOnly\s*&&\s*\(\s*<GenerateCurrentAnalysisButton/
    );
    expect(actions).toContain("assertAccountWritable(membership.tradingAccount.status)");
  });

  it("allows authorized Members reads and hides every archived mutation surface", () => {
    const page = source("app/accounts/[accountId]/members/page.tsx");
    const detailPage = source("app/accounts/[accountId]/members/[memberId]/page.tsx");
    const actions = source("app/accounts/[accountId]/members/actions.ts");

    expect(page).toContain('const isArchived = membership.tradingAccount.status === "ARCHIVED"');
    expect(page).toContain("const canMutateMembers = !isArchived && membership.canManageMembers");
    expect(page).toContain("const canMutateRoles = !isArchived && membership.canManageRoles");
    expect(detailPage).not.toContain('membership.tradingAccount.status === "ARCHIVED"');
    expect(actions.match(/ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE/g)?.length).toBeGreaterThanOrEqual(7);
  });

  it("allows safe Integration status reads without archived configuration or reset controls", () => {
    const page = source("app/accounts/[accountId]/integrations/page.tsx");
    const actions = source("app/accounts/[accountId]/integrations/actions.ts");

    expect(page).toContain("{!isArchived && <form action={resetSyncStatusAction}>");
    expect(page).toContain("{!isArchived && <Card>");
    expect(page).toContain("if (!isArchived) await prisma.user.update");
    expect(actions).toContain("assertAccountWritable(membership.tradingAccount.status)");
    expect(page).not.toMatch(/password\s*[:=]|accessToken\s*[:=]|apiKey\s*[:=]/i);
  });

  it("keeps the approved archived banner copy", () => {
    const banner = source("components/ArchivedAccountBanner.tsx");
    expect(banner).toContain('title: "Account archived"');
    expect(banner).toContain('description: "Historical data is available in read-only mode."');
  });

  it("keeps existing account mutation guards in place", () => {
    for (const file of [
      "app/accounts/[accountId]/diary/actions.ts",
      "app/accounts/[accountId]/sessions/actions.ts",
      "app/accounts/[accountId]/rules/actions.ts",
      "app/accounts/[accountId]/playbook/actions.ts",
    ]) {
      const contents = source(file);
      expect(contents).toMatch(/assertAccountWritable|ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE/);
    }
  });
});
