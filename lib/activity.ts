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