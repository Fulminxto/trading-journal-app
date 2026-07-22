import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  getLocaleFromLanguage,
  normalizeAppLanguage,
} from "@/lib/i18n";
import { getNotificationTypeLabel } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import NotificationsInbox from "./NotificationsInbox";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { appLanguage: true },
  });
  const appLanguage = normalizeAppLanguage(currentUser?.appLanguage);

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <NotificationsInbox
      locale={getLocaleFromLanguage(appLanguage)}
      referenceTime={Date.now()}
      notifications={notifications.map((notification) => ({
        id: notification.id,
        type: notification.type,
        typeLabel: getNotificationTypeLabel(notification.type, appLanguage),
        title: notification.title,
        message: notification.message,
        read: notification.read,
        link: notification.link,
        createdAt: notification.createdAt.toISOString(),
      }))}
    />
  );
}
