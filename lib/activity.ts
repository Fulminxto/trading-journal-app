import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: CreateNotificationParams) {
  await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link: link || null,
    },
  });
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
        ? {
          not: actorId,
        }
        : undefined,
    },
    select: {
      userId: true,
    },
  });

  if (members.length === 0) {
    return;
  }

  await prisma.notification.createMany({
    data: members.map((member) => ({
      userId: member.userId,
      type,
      title,
      message,
      link: link || null,
    })),
  });
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
      role: {
        in: ["FOUNDER", "ADMIN"],
      },
      id: actorId
        ? {
          not: actorId,
        }
        : undefined,
    },
    select: {
      id: true,
    },
  });

  if (users.length === 0) {
    return;
  }

  await prisma.notification.createMany({
    data: users.map((user) => ({
      userId: user.id,
      type,
      title,
      message,
      link: link || null,
    })),
  });
}