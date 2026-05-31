"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function markNotificationAsRead(
    formData: FormData
) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const notificationId =
        formData.get("notificationId");

    if (typeof notificationId !== "string") {
        return;
    }

    await prisma.notification.updateMany({
        where: {
            id: notificationId,
            userId: session.user.id,
        },
        data: {
            read: true,
        },
    });

    redirect("/notifications");
}

export async function markAllNotificationsAsRead() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    await prisma.notification.updateMany({
        where: {
            userId: session.user.id,
            read: false,
        },
        data: {
            read: true,
        },
    });

    redirect("/notifications");
}