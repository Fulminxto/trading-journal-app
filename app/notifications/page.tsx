import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "./actions";

export default async function NotificationsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const notifications =
        await prisma.notification.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 100,
        });

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    return (
        <div>
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm text-green-400">
                        Notification Center
                    </p>

                    <h1 className="mt-2 text-4xl font-bold">
                        Notifications
                    </h1>

                    <p className="mt-3 text-sm text-gray-400">
                        Qui trovi gli aggiornamenti importanti sui tuoi account, trade e permessi.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <form action={markAllNotificationsAsRead}>
                        <button
                            type="submit"
                            className="rounded-2xl bg-green-500 px-4 py-3 text-sm font-bold text-black hover:bg-green-400"
                        >
                            Mark all as read
                        </button>
                    </form>
                )}
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Total
                    </p>

                    <h2 className="mt-2 text-3xl font-black">
                        {notifications.length}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Unread
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-red-400">
                        {unreadCount}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Read
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-green-400">
                        {notifications.length - unreadCount}
                    </h2>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`rounded-3xl border p-5 ${notification.read
                                    ? "border-white/10 bg-white/[0.03]"
                                    : "border-green-500/20 bg-green-500/[0.06]"
                                }`}
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        {!notification.read && (
                                            <span className="rounded-full bg-green-500 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                                                New
                                            </span>
                                        )}

                                        <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                                            {notification.type}
                                        </span>
                                    </div>

                                    <h2 className="text-lg font-bold">
                                        {notification.title}
                                    </h2>

                                    <p className="mt-2 text-sm text-gray-400">
                                        {notification.message}
                                    </p>

                                    <p className="mt-3 text-xs text-gray-600">
                                        {new Date(notification.createdAt).toLocaleString("it-IT")}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {notification.link && (
                                        <Link
                                            href={notification.link}
                                            className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/20"
                                        >
                                            Open
                                        </Link>
                                    )}

                                    {!notification.read && (
                                        <form action={markNotificationAsRead}>
                                            <input
                                                type="hidden"
                                                name="notificationId"
                                                value={notification.id}
                                            />

                                            <button
                                                type="submit"
                                                className="rounded-xl bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-400 hover:bg-green-500/20"
                                            >
                                                Mark as read
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">
                        Nessuna notifica per ora.
                    </div>
                )}
            </div>
        </div>
    );
}