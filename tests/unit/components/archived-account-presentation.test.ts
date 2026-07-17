import { describe, expect, it } from "vitest";

import { shouldShowArchivedAccountBanner } from "@/components/ArchivedAccountBanner";
import { isAccountDestinationVisibleForStatus } from "@/components/Sidebar";

describe("archived account presentation policy", () => {
  it("shows the shared banner only for archived workspaces", () => {
    expect(shouldShowArchivedAccountBanner("ARCHIVED")).toBe(true);
    expect(shouldShowArchivedAccountBanner("ACTIVE")).toBe(false);
    expect(shouldShowArchivedAccountBanner()).toBe(false);
  });

  it("keeps historical navigation and excludes management destinations", () => {
    for (const path of [
      "dashboard", "diary", "calendar", "equity", "analytics",
      "reports", "sessions", "rules", "playbook",
    ]) {
      expect(isAccountDestinationVisibleForStatus(path, "ARCHIVED")).toBe(true);
    }

    for (const path of ["members", "integrations", "copilot"]) {
      expect(isAccountDestinationVisibleForStatus(path, "ARCHIVED")).toBe(false);
      expect(isAccountDestinationVisibleForStatus(path, "ACTIVE")).toBe(true);
    }
  });
});
