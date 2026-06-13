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

async function touchUserActivity(userId?: string | null) {
  if (!userId) {
    return;
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lastSeenAt: new Date(),
      lastActivityAt: new Date(),
    },
  });
}

export async function logActivity({
  userId,
  accountId,
  type,
  title,
  description,
  metadata,
}: LogActivityParams) {
  await prisma.activityLog.create({
    data: {
      userId: userId || null,
      accountId: accountId || null,
      type,
      title,
      description: description || null,
      metadata: metadata ?? undefined,
    },
  });

  await touchUserActivity(userId);
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
     "TRADE_IMPORTED", "TRADE_SYNC_UPDATED"].includes(type)
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

export async function notifyAccountMembers({
  accountId,
  actorId,
  type,
  title,
  message,
  link,
}: {
  accountId: string;
  actorId?: string | null;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  const members = await prisma.accountMember.findMany({
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

  if (members.length === 0) return;

  const category = getNotificationCategory(type);
  const eligible = members.filter((m) => {
    if (!m.user.notificationsEnabled) return false;
    if (category === "trade")    return m.user.notifyTradeActivity;
    if (category === "account")  return m.user.notifyAccountActivity;
    if (category === "platform") return m.user.notifyPlatformUpdates;
    if (category === "support")  return m.user.notifySupport;
    return true;
  });

  if (eligible.length === 0) return;

  await prisma.notification.createMany({
    data: eligible.map((m) => ({
      userId: m.userId,
      type,
      title,
      message,
      link: link || null,
    })),
  });

  // Push notifications — non-blocking, never fail the in-app notification
  const pushTargets = eligible.filter(
    (m) => m.user.pushNotificationsEnabled
  );
  await Promise.allSettled(
    pushTargets.map((m) =>
      sendPushToUser(m.userId, {
        title,
        body: message,
        url: link,
      }).catch((err) =>
        console.error(
          `[push] notifyAccountMembers userId=${m.userId}:`,
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