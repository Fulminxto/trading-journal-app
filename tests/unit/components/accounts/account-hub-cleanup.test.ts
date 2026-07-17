import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("retired Account Hub cleanup", () => {
  it("preserves legacy entry redirects to the supported Dashboard without a loop", () => {
    const accountEntry = readFileSync(
      "app/accounts/[accountId]/page.tsx",
      "utf8",
    );
    const workspaceEntry = readFileSync(
      "app/accounts/[accountId]/workspace/page.tsx",
      "utf8",
    );

    for (const source of [accountEntry, workspaceEntry]) {
      expect(source).toContain("redirect(`/accounts/${accountId}/dashboard`)");
      expect(source).not.toContain("redirect(`/accounts/${accountId}/workspace`)");
    }
  });

  it("removes the unreferenced retired Hub loading UI", () => {
    expect(
      existsSync("app/accounts/[accountId]/workspace/loading.tsx"),
    ).toBe(false);
    expect(existsSync("components/skeletons/WorkspaceSkeleton.tsx")).toBe(false);
  });

  it("keeps active account routes free of retired Account Hub terminology", () => {
    const sources = [
      "app/accounts/page.tsx",
      "app/accounts/manage/page.tsx",
      "app/accounts/archived/page.tsx",
      "app/accounts/[accountId]/diary/page.tsx",
      "components/accounts/AccountLibrary.tsx",
      "components/accounts/AccountLifecycleList.tsx",
      "components/Sidebar.tsx",
    ].map((path) => readFileSync(path, "utf8")).join("\n");

    expect(sources).not.toMatch(/Account Hub|Workspace Intelligence/i);
    expect(sources).toContain("Open workspace");
    expect(sources).toContain("View archived account");
  });

  it("keeps account Server Components from invoking client-module helpers", () => {
    const accountsPage = readFileSync("app/accounts/page.tsx", "utf8");
    const managePage = readFileSync("app/accounts/manage/page.tsx", "utf8");

    expect(accountsPage).toContain(
      'import AccountLibrary from "@/components/accounts/AccountLibrary";',
    );
    expect(accountsPage).not.toMatch(
      /import AccountLibrary\s*,\s*\{[\s\S]*?\}\s*from\s*["']@\/components\/accounts\/AccountLibrary["']/,
    );
    expect(managePage).not.toMatch(
      /import\s*\{[^}]*\}\s*from\s*["']@\/components\/accounts\/AccountLifecycleList["']/,
    );
  });
});
