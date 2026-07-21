import { describe, expect, it } from "vitest";

import { shouldShowArchivedAccountBanner } from "@/components/ArchivedAccountBanner";
import { isAccountDestinationVisibleForStatus } from "@/components/Sidebar";

describe("archived account presentation policy", () => {
  it("shows the shared banner only for archived workspaces", () => {
    expect(shouldShowArchivedAccountBanner("ARCHIVED")).toBe(true);
    expect(shouldShowArchivedAccountBanner("ACTIVE")).toBe(false);
    expect(shouldShowArchivedAccountBanner()).toBe(false);
  });

  it("keeps the complete active workspace navigation for archived accounts", () => {
    for (const path of [
      "dashboard", "diary", "calendar", "equity", "analytics",
      "reports", "sessions", "rules", "playbook", "copilot", "members",
      "integrations",
    ]) {
      expect(isAccountDestinationVisibleForStatus(path, "ARCHIVED")).toBe(true);
      expect(isAccountDestinationVisibleForStatus(path, "ACTIVE")).toBe(true);
    }
  });
});
