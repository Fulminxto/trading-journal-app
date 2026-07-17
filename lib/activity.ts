import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendPushToUser } from "@/lib/push";

type LogActivityParams = {
  userId?: string | null;
  accountId?: string | null;
  type: string;
  title: string;
  description?: string;
  metadata?: Prisma.InputJsonValue;
};

type CreateNotificationParams = {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
};

type ActivityPersistenceClient = {
  activityLog: Pick<Prisma.TransactionClient["activityLog"], "create">;
  user: Pick<Prisma.TransactionClient["user"], "update">;
};

type AccountNotificationPersistenceClient = {
  accountMember: Pick<Prisma.TransactionClient["accountMember"], "findMany">;
  notification: Pick<Prisma.TransactionClient["notification"], "createManyAndReturn">;
};

type NotifyAccountMembersParams = {
  accountId: string;
  actorId?: string | null;
  type: string;
  title: string;
  message: string;
  link?: string;
};

async function touchUserActivity(
  db: ActivityPersistenceClient,
  userId?: string | null
) {
  if (!userId) {
    return;
  }

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      lastSeenAt: new Date(),
      lastActivityAt: new Date(),
    },
  });
}

export async function persistActivityLog(
  db: ActivityPersistenceClient,
  {
  userId,
  accountId,
  type,
  title,
  description,
  metadata,
}: LogActivityParams
) {
  await db.activityLog.create({
    data: {
      userId: userId || null,
      accountId: accountId || null,
      type,
      title,
      description: description || null,
      metadata: metadata ?? undefined,
    },
  });

  await touchUserActivity(db, userId);
}

export async function logActivity(params: LogActivityParams) {
  await persistActivityLog(prisma, params);
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: CreateNotificationParams) {
  const [, user] = await Promise.all([
    prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link: link || null,
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { pushNotificationsEnabled: true },
    }),
  ]);

  if (user?.pushNotificationsEnabled) {
    await sendPushToUser(userId, {
      title,
      body: message,
      url: link,
    }).catch((err) =>
      console.error("[push] createNotification:", err)
    );
  }
}

function getNotificationCategory(
  type: string,
): "trade" | "account" | "platform" | "support" | "always" {
  if (
    ["TRADE_CREATED", "TRADE_UPDATED", "TRADE_DELETED",
     "TRADE_IMPORTED", "TRADE_SYNC_UPDATED",
     "trade_sync_summary", "trade_sync_warning"].includes(type)
  ) return "trade";

  if (
    ["ACCOUNT_INVITE", "ACCOUNT_INVITE_ACCEPTED", "ACCOUNT_INVITE_DECLINED",
     "MEMBER_REMOVED", "MEMBER_ROLE_CHANGED", "ACCOUNT_REVIEW_REQUESTED"].includes(type)
  ) return "account";

  if (
    ["RELEASE_NOTE_PUBLISHED", "MAINTENANCE_UPDATED"].includes(type)
  ) return "platform";

  if (
    ["SUPPORT_TICKET_CREATED", "SUPPORT_TICKET_UPDATED"].includes(type)
  ) return "support";

  return "always";
}

export async function persistAccountMemberNotifications(
  db: AccountNotificationPersistenceClient,
  {
    accountId,
    actorId,
    type,
    title,
    message,
    link,
  }: NotifyAccountMembersParams
) {
  const members = await db.accountMember.findMany({
    where: {
      tradingAccountId: accountId,
      userId: actorId
        ? { not: actorId }
        : undefined,
    },
    select: {
      userId: true,
      user: {
        select: {
          notificationsEnabled: true,
          notifyTradeActivity: true,
          notifyAccountActivity: true,
          notifyPlatformUpdates: true,
          notifySupport: true,
          pushNotificationsEnabled: true,
        },
      },
    },
  });

  if (members.length === 0) return [];

  const category = getNotificationCategory(type);
  const eligible = members.filter((m) => {
    if (!m.user.notificationsEnabled) return false;
    if (category === "trade")    return m.user.notifyTradeActivity;
    if (category === "account")  return m.user.notifyAccountActivity;
    if (category === "platform") return m.user.notifyPlatformUpdates;
    if (category === "support")  return m.user.notifySupport;
    return true;
  });

  if (eligible.length === 0) return [];

  const notifications = await db.notification.createManyAndReturn({
    data: eligible.map((m) => ({
      userId: m.userId,
      type,
      title,
      message,
      link: link || null,
    })),
    select: {
      id: true,
      userId: true,
    },
  });

  const pushEnabledByUserId = new Map(
    eligible.map((member) => [
      member.userId,
      member.user.pushNotificationsEnabled,
    ])
  );

  return notifications.map((notification) => ({
    notificationId: notification.id,
    userId: notification.userId,
    pushNotificationsEnabled:
      pushEnabledByUserId.get(notification.userId) ?? false,
  }));
}

export async function notifyAccountMembers(
  params: NotifyAccountMembersParams
) {
  const persisted = await persistAccountMemberNotifications(
    prisma,
    params
  );

  // Push notifications — non-blocking, never fail the in-app notification
  const pushTargets = persisted.filter(
    (notification) => notification.pushNotificationsEnabled
  );
  await Promise.allSettled(
    pushTargets.map((notification) =>
      sendPushToUser(notification.userId, {
        title: params.title,
        body: params.message,
        url: params.link,
      }).catch((err) =>
        console.error(
          `[push] notifyAccountMembers userId=${notification.userId}:`,
          err
        )
      )
    )
  );
}

export async function notifyFoundersAndAdmins({
  actorId,
  type,
  title,
  message,
  link,
}: {
  actorId?: string | null;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  const users = await prisma.user.findMany({
    where: {
      role: { in: ["FOUNDER", "ADMIN"] },
      id: actorId
        ? { not: actorId }
        : undefined,
    },
    select: {
      id: true,
      notificationsEnabled: true,
      notifyTradeActivity: true,
      notifyAccountActivity: true,
      notifyPlatformUpdates: true,
      notifySupport: true,
      pushNotificationsEnabled: true,
    },
  });

  if (users.length === 0) return;

  const category = getNotificationCategory(type);
  const eligible = users.filter((u) => {
    if (!u.notificationsEnabled) return false;
    if (category === "trade")    return u.notifyTradeActivity;
    if (category === "account")  return u.notifyAccountActivity;
    if (category === "platform") return u.notifyPlatformUpdates;
    if (category === "support")  return u.notifySupport;
    return true;
  });

  if (eligible.length === 0) return;

  await prisma.notification.createMany({
    data: eligible.map((u) => ({
      userId: u.id,
      type,
      title,
      message,
      link: link || null,
    })),
  });

  const pushTargets = eligible.filter(
    (u) => u.pushNotificationsEnabled
  );
  await Promise.allSettled(
    pushTargets.map((u) =>
      sendPushToUser(u.id, {
        title,
        body: message,
        url: link,
      }).catch((err) =>
        console.error(
          `[push] notifyFoundersAndAdmins userId=${u.id}:`,
          err
        )
      )
    )
  );
}
