import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "./actions";

import {
    normalizeAppLanguage,
    type AppLanguage,
} from "@/lib/i18n";

import { getNotificationTypeLabel } from "@/lib/notifications";

type NotificationsCopy = {
    eyebrow: string;
    title: string;
    description: string;
    markAllAsRead: string;
    total: string;
    unread: string;
    read: string;
    new: string;
    open: string;
    markAsRead: string;
    empty: string;
};

const notificationsCopy: Record<AppLanguage, NotificationsCopy> = {
    it: {
        eyebrow: "Notification Center",
        title: "Notifiche",
        description:
            "Qui trovi gli aggiornamenti importanti sui tuoi account, trade e permessi.",
        markAllAsRead: "Segna tutto come letto",
        total: "Totale",
        unread: "Non lette",
        read: "Lette",
        new: "Nuova",
        open: "Apri",
        markAsRead: "Segna come letta",
        empty: "Nessuna notifica per ora.",
    },

    en: {
        eyebrow: "Notification Center",
        title: "Notifications",
        description:
            "Here you can find important updates about your accounts, trades and permissions.",
        markAllAsRead: "Mark all as read",
        total: "Total",
        unread: "Unread",
        read: "Read",
        new: "New",
        open: "Open",
        markAsRead: "Mark as read",
        empty: "No notifications for now.",
    },

    uk: {
        eyebrow: "Ð¦ÐµÐ½Ñ‚Ñ€ ÑÐ¿Ð¾Ð²Ñ–Ñ‰ÐµÐ½ÑŒ",
        title: "Ð¡Ð¿Ð¾Ð²Ñ–Ñ‰ÐµÐ½Ð½Ñ",
        description:
            "Ð¢ÑƒÑ‚ Ð·Ð½Ð°Ñ…Ð¾Ð´ÑÑ‚ÑŒÑÑ Ð²Ð°Ð¶Ð»Ð¸Ð²Ñ– Ð¾Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ Ñ‰Ð¾Ð´Ð¾ Ð²Ð°ÑˆÐ¸Ñ… Ð°ÐºÐ°ÑƒÐ½Ñ‚Ñ–Ð², ÑƒÐ³Ð¾Ð´ Ñ– Ð´Ð¾Ð·Ð²Ð¾Ð»Ñ–Ð².",
        markAllAsRead: "ÐŸÐ¾Ð·Ð½Ð°Ñ‡Ð¸Ñ‚Ð¸ Ð²ÑÐµ ÑÐº Ð¿Ñ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð½Ðµ",
        total: "Ð£ÑÑŒÐ¾Ð³Ð¾",
        unread: "ÐÐµÐ¿Ñ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð½Ñ–",
        read: "ÐŸÑ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð½Ñ–",
        new: "ÐÐ¾Ð²Ðµ",
        open: "Ð’Ñ–Ð´ÐºÑ€Ð¸Ñ‚Ð¸",
        markAsRead: "ÐŸÐ¾Ð·Ð½Ð°Ñ‡Ð¸Ñ‚Ð¸ ÑÐº Ð¿Ñ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð½Ðµ",
        empty: "ÐŸÐ¾ÐºÐ¸ Ñ‰Ð¾ Ð½ÐµÐ¼Ð°Ñ” ÑÐ¿Ð¾Ð²Ñ–Ñ‰ÐµÐ½ÑŒ.",
    },

    ru: {
        eyebrow: "Ð¦ÐµÐ½Ñ‚Ñ€ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ð¹",
        title: "Ð£Ð²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ñ",
        description:
            "Ð—Ð´ÐµÑÑŒ Ð½Ð°Ñ…Ð¾Ð´ÑÑ‚ÑÑ Ð²Ð°Ð¶Ð½Ñ‹Ðµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ Ð¿Ð¾ Ð²Ð°ÑˆÐ¸Ð¼ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°Ð¼, ÑÐ´ÐµÐ»ÐºÐ°Ð¼ Ð¸ Ñ€Ð°Ð·Ñ€ÐµÑˆÐµÐ½Ð¸ÑÐ¼.",
        markAllAsRead: "ÐžÑ‚Ð¼ÐµÑ‚Ð¸Ñ‚ÑŒ Ð²ÑÐµ ÐºÐ°Ðº Ð¿Ñ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð½Ð½Ñ‹Ðµ",
        total: "Ð’ÑÐµÐ³Ð¾",
        unread: "ÐÐµÐ¿Ñ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð½Ð½Ñ‹Ðµ",
        read: "ÐŸÑ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð½Ð½Ñ‹Ðµ",
        new: "ÐÐ¾Ð²Ð¾Ðµ",
        open: "ÐžÑ‚ÐºÑ€Ñ‹Ñ‚ÑŒ",
        markAsRead: "ÐžÑ‚Ð¼ÐµÑ‚Ð¸Ñ‚ÑŒ ÐºÐ°Ðº Ð¿Ñ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð½Ð½Ð¾Ðµ",
        empty: "ÐŸÐ¾ÐºÐ° Ð½ÐµÑ‚ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ð¹.",
    },

    es: {
        eyebrow: "Centro de notificaciones",
        title: "Notificaciones",
        description:
            "AquÃ­ encuentras actualizaciones importantes sobre tus cuentas, trades y permisos.",
        markAllAsRead: "Marcar todo como leÃ­do",
        total: "Total",
        unread: "No leÃ­das",
        read: "LeÃ­das",
        new: "Nueva",
        open: "Abrir",
        markAsRead: "Marcar como leÃ­da",
        empty: "No hay notificaciones por ahora.",
    },

    fr: {
        eyebrow: "Centre de notifications",
        title: "Notifications",
        description:
            "Vous trouverez ici les mises Ã  jour importantes concernant vos comptes, trades et permissions.",
        markAllAsRead: "Tout marquer comme lu",
        total: "Total",
        unread: "Non lues",
        read: "Lues",
        new: "Nouvelle",
        open: "Ouvrir",
        markAsRead: "Marquer comme lue",
        empty: "Aucune notification pour le moment.",
    },

    de: {
        eyebrow: "Benachrichtigungszentrum",
        title: "Benachrichtigungen",
        description:
            "Hier findest du wichtige Updates zu deinen Konten, Trades und Berechtigungen.",
        markAllAsRead: "Alle als gelesen markieren",
        total: "Gesamt",
        unread: "Ungelesen",
        read: "Gelesen",
        new: "Neu",
        open: "Ã–ffnen",
        markAsRead: "Als gelesen markieren",
        empty: "Derzeit keine Benachrichtigungen.",
    },
};

const localeMap: Record<AppLanguage, string> = {
    it: "it-IT",
    en: "en-US",
    uk: "uk-UA",
    ru: "ru-RU",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
};

export default async function NotificationsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            appLanguage: true,
        },
    });

    const appLanguage = normalizeAppLanguage(
        currentUser?.appLanguage
    );

    const t = notificationsCopy[appLanguage];
    const locale = localeMap[appLanguage];

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
                    <p className="text-sm text-accent">
                        {t.eyebrow}
                    </p>

                    <h1 className="mt-2 text-4xl font-bold">
                        {t.title}
                    </h1>

                    <p className="mt-3 text-sm text-gray-400">
                        {t.description}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <form action={markAllNotificationsAsRead}>
                        <button
                            type="submit"
                            className="rounded-2xl bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent-bright"
                        >
                            {t.markAllAsRead}
                        </button>
                    </form>
                )}
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        {t.total}
                    </p>

                    <h2 className="mt-2 text-3xl font-black">
                        {notifications.length}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        {t.unread}
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-red-400">
                        {unreadCount}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        {t.read}
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-accent">
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
                                    : "border-accent/20 bg-accent/[0.06]"
                                }`}
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        {!notification.read && (
                                            <span className="rounded-full bg-accent px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                                                {t.new}
                                            </span>
                                        )}

                                        <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                                            {getNotificationTypeLabel(notification.type, appLanguage)}
                                        </span>
                                    </div>

                                    <h2 className="text-lg font-bold">
                                        {notification.title}
                                    </h2>

                                    <p className="mt-2 text-sm text-gray-400">
                                        {notification.message}
                                    </p>

                                    <p className="mt-3 text-xs text-gray-600">
                                        {new Date(
                                            notification.createdAt
                                        ).toLocaleString(locale)}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {notification.link && (
                                        <Link
                                            href={notification.link}
                                            className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/20"
                                        >
                                            {t.open}
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
                                                className="rounded-xl bg-accent/10 px-4 py-3 text-sm font-semibold text-accent hover:bg-accent/20"
                                            >
                                                {t.markAsRead}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">
                        {t.empty}
                    </div>
                )}
            </div>
        </div>
    );
}
