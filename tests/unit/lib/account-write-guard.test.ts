import { describe, expect, it } from "vitest";

import {
  ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE,
  ArchivedAccountReadOnlyError,
  assertAccountWritable,
  getArchivedAccountActionError,
  isArchivedAccount,
} from "@/lib/account-write-guard";

describe("archived account write guard", () => {
  it("preserves active-account writes", () => {
    expect(isArchivedAccount("ACTIVE")).toBe(false);
    expect(() => assertAccountWritable("ACTIVE")).not.toThrow();
    expect(getArchivedAccountActionError("ACTIVE")).toBeNull();
  });

  it("deterministically rejects archived-account writes with a safe conflict", () => {
    expect(isArchivedAccount("ARCHIVED")).toBe(true);
    expect(() => assertAccountWritable("ARCHIVED")).toThrow(
      ArchivedAccountReadOnlyError,
    );

    try {
      assertAccountWritable("ARCHIVED");
    } catch (error) {
      expect(error).toMatchObject({
        httpStatus: 409,
        message: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE,
      });
    }

    expect(getArchivedAccountActionError("ARCHIVED")).toEqual({
      error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE,
    });
  });
});
