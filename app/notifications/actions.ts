"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function getString(
    formData: FormData,
    key: string
) {
    const value = formData.get(key);

    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
}

export async function markNotificationAsRead(
    formData: FormData
) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const notificationId = getString(
        formData,
        "notificationId"
    );

    if (!notificationId) {
        redirect("/notifications");
    }

    await prisma.notification.updateMany({
        where: {
            id: notificationId,
            userId: session.user.id,
            read: false,
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