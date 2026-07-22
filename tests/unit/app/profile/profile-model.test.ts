import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  buildProfileReadiness,
  formatProfileHeaderDateTime,
  type ProfileReadinessInput,
} from "@/app/profile/profile-model";

const completeProfile: Required<ProfileReadinessInput> = {
  image: "/avatar.png",
  name: "Ada Lovelace",
  username: "ada",
  workspaceName: "Analytical Engine",
  timezone: "Europe/Rome",
  tradingStyle: "Day Trading",
  favoriteMarket: "Forex",
  preferredSession: "London",
  riskPerTrade: 1,
  preferredBroker: "VOLTIS Broker",
  setupStyle: "Breakout",
};

describe("Profile view model", () => {
  it("formats the authoritative lastLoginAt value as one non-duplicated presentation", () => {
    const lastLoginAt = new Date("2026-07-22T14:25:00.000Z");
    const formatted = formatProfileHeaderDateTime(lastLoginAt, "en");

    expect(formatted).toContain("07/22/2026");
    expect(formatted).toContain("•");
    expect(formatted.match(/07\/22\/2026/g)).toHaveLength(1);
    expect(formatProfileHeaderDateTime(null, "en")).toBe("Never");
  });

  it("derives incomplete readiness and real missing fields from the current model", () => {
    const readiness = buildProfileReadiness({
      ...completeProfile,
      image: null,
      favoriteMarket: " ",
      riskPerTrade: null,
    });

    expect(readiness.percentage).toBe(73);
    expect(readiness.completedCount).toBe(8);
    expect(readiness.missingFields.map((field) => field.label)).toEqual([
      "Avatar",
      "Favorite Market",
      "Risk Per Trade",
    ]);
  });

  it("keeps the completed diagnostic state at 100 percent", () => {
    const readiness = buildProfileReadiness(completeProfile);

    expect(readiness.percentage).toBe(100);
    expect(readiness.completedCount).toBe(readiness.fields.length);
    expect(readiness.missingFields).toEqual([]);
  });

  it("keeps /profile wired to canonical data without stale runtime identifiers", () => {
    const source = readFileSync("app/profile/page.tsx", "utf8");

    expect(source).toContain(
      "formatProfileHeaderDateTime(user.lastLoginAt, appLanguage)"
    );
    expect(source).toContain("readiness.missingFields.map");
    expect(source).toContain("readiness.percentage === 100");
    expect(source).not.toMatch(/\{\s*lastLogin\s*\}/);
    expect(source).not.toContain("readinessGroups");
  });
});
