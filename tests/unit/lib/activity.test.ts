import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  activityCreate: vi.fn(),
  userUpdate: vi.fn(),
  userFindUnique: vi.fn(),
  memberFindMany: vi.fn(),
  notificationCreate: vi.fn(),
  notificationCreateMany: vi.fn(),
  notificationCreateManyAndReturn: vi.fn(),
  sendPushToUser: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    activityLog: { create: mocks.activityCreate },
    user: {
      update: mocks.userUpdate,
      findUnique: mocks.userFindUnique,
    },
    accountMember: { findMany: mocks.memberFindMany },
    notification: {
      create: mocks.notificationCreate,
      createMany: mocks.notificationCreateMany,
      createManyAndReturn: mocks.notificationCreateManyAndReturn,
    },
  },
}));

vi.mock("@/lib/push", () => ({
  sendPushToUser: mocks.sendPushToUser,
}));

import {
  notifyAccountMembers,
  persistAccountMemberNotifications,
  persistActivityLog,
} from "@/lib/activity";

const notificationParams = {
  accountId: "account-1",
  actorId: "actor-1",
  type: "TRADE_IMPORTED",
  title: "Trade imported",
  message: "One trade was imported",
  link: "/accounts/account-1/diary",
};

function member(
  userId: string,
  overrides: Record<string, boolean> = {},
) {
  return {
    userId,
    user: {
      notificationsEnabled: true,
      notifyTradeActivity: true,
      notifyAccountActivity: true,
      notifyPlatformUpdates: true,
      notifySupport: true,
      pushNotificationsEnabled: false,
      ...overrides,
    },
  };
}

describe("transaction-compatible activity persistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses only the supplied client and does not touch a null user", async () => {
    const activityCreate = vi.fn().mockResolvedValue({ id: "activity-1" });
    const userUpdate = vi.fn();
    const db = {
      activityLog: { create: activityCreate },
      user: { update: userUpdate },
    } as unknown as Parameters<typeof persistActivityLog>[0];

    await persistActivityLog(db, {
      userId: null,
      accountId: "account-1",
      type: "TRADE_SYNC_SUMMARY",
      title: "Trade sync completed",
      metadata: { importedCount: 2 },
    });

    expect(activityCreate).toHaveBeenCalledWith({
      data: {
        userId: null,
        accountId: "account-1",
        type: "TRADE_SYNC_SUMMARY",
        title: "Trade sync completed",
        description: null,
        metadata: { importedCount: 2 },
      },
    });
    expect(userUpdate).not.toHaveBeenCalled();
    expect(mocks.activityCreate).not.toHaveBeenCalled();
    expect(mocks.userUpdate).not.toHaveBeenCalled();
    expect(mocks.sendPushToUser).not.toHaveBeenCalled();
  });
});

describe("transaction-compatible account notification persistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates one row per eligible member and returns durable IDs", async () => {
    const memberFindMany = vi.fn().mockResolvedValue([
      member("eligible-push", { pushNotificationsEnabled: true }),
      member("eligible-no-push"),
      member("globally-muted", { notificationsEnabled: false }),
      member("trade-muted", { notifyTradeActivity: false }),
    ]);
    const createManyAndReturn = vi.fn().mockResolvedValue([
      { id: "notification-1", userId: "eligible-push" },
      { id: "notification-2", userId: "eligible-no-push" },
    ]);
    const db = {
      accountMember: { findMany: memberFindMany },
      notification: { createManyAndReturn },
    } as unknown as Parameters<typeof persistAccountMemberNotifications>[0];

    const result = await persistAccountMemberNotifications(
      db,
      notificationParams,
    );

    expect(memberFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tradingAccountId: "account-1",
          userId: { not: "actor-1" },
        },
      }),
    );
    expect(createManyAndReturn).toHaveBeenCalledWith({
      data: [
        {
          userId: "eligible-push",
          type: "TRADE_IMPORTED",
          title: "Trade imported",
          message: "One trade was imported",
          link: "/accounts/account-1/diary",
        },
        {
          userId: "eligible-no-push",
          type: "TRADE_IMPORTED",
          title: "Trade imported",
          message: "One trade was imported",
          link: "/accounts/account-1/diary",
        },
      ],
      select: { id: true, userId: true },
    });
    expect(result).toEqual([
      {
        notificationId: "notification-1",
        userId: "eligible-push",
        pushNotificationsEnabled: true,
      },
      {
        notificationId: "notification-2",
        userId: "eligible-no-push",
        pushNotificationsEnabled: false,
      },
    ]);
    expect(mocks.memberFindMany).not.toHaveBeenCalled();
    expect(mocks.notificationCreateManyAndReturn).not.toHaveBeenCalled();
    expect(mocks.sendPushToUser).not.toHaveBeenCalled();
  });

  it.each(["trade_sync_summary", "trade_sync_warning"])(
    "maps %s to trade notification preferences",
    async (type) => {
      const memberFindMany = vi.fn().mockResolvedValue([
        member("trade-muted", { notifyTradeActivity: false }),
      ]);
      const createManyAndReturn = vi.fn();
      const db = {
        accountMember: { findMany: memberFindMany },
        notification: { createManyAndReturn },
      } as unknown as Parameters<typeof persistAccountMemberNotifications>[0];

      await expect(
        persistAccountMemberNotifications(db, {
          ...notificationParams,
          type,
        }),
      ).resolves.toEqual([]);
      expect(createManyAndReturn).not.toHaveBeenCalled();
    },
  );
});

describe("legacy account notification wrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.memberFindMany.mockResolvedValue([
      member("push-user", { pushNotificationsEnabled: true }),
      member("in-app-user"),
    ]);
    mocks.notificationCreateManyAndReturn.mockResolvedValue([
      { id: "notification-1", userId: "push-user" },
      { id: "notification-2", userId: "in-app-user" },
    ]);
    mocks.sendPushToUser.mockResolvedValue(undefined);
  });

  it("persists first and then attempts the existing push path", async () => {
    await notifyAccountMembers(notificationParams);

    expect(mocks.notificationCreateManyAndReturn).toHaveBeenCalledOnce();
    expect(mocks.sendPushToUser).toHaveBeenCalledOnce();
    expect(mocks.sendPushToUser).toHaveBeenCalledWith("push-user", {
      title: "Trade imported",
      body: "One trade was imported",
      url: "/accounts/account-1/diary",
    });
    expect(
      mocks.notificationCreateManyAndReturn.mock.invocationCallOrder[0],
    ).toBeLessThan(mocks.sendPushToUser.mock.invocationCallOrder[0]);
  });
});
