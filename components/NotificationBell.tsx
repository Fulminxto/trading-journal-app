"use client";

import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getLocaleFromLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { getNotificationTypeLabel } from "@/lib/notifications";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
};

type PanelCopy = {
  bell: string;
  title: string;
  markAllAsRead: string;
  viewAll: string;
  empty: string;
};

const panelCopy: Record<AppLanguage, PanelCopy> = {
  it: {
    bell: "Notifiche",
    title: "Notifiche",
    markAllAsRead: "Segna tutte come lette",
    viewAll: "Vedi tutte",
    empty: "Nessuna notifica per ora.",
  },
  en: {
    bell: "Notifications",
    title: "Notifications",
    markAllAsRead: "Mark all as read",
    viewAll: "View all",
    empty: "No notifications for now.",
  },
  uk: {
    bell: "Сповіщення",
    title: "Сповіщення",
    markAllAsRead: "Позначити все як прочитане",
    viewAll: "Переглянути всі",
    empty: "Поки що немає сповіщень.",
  },
  ru: {
    bell: "Уведомления",
    title: "Уведомления",
    markAllAsRead: "Отметить все как прочитанные",
    viewAll: "Посмотреть все",
    empty: "Пока нет уведомлений.",
  },
  es: {
    bell: "Notificaciones",
    title: "Notificaciones",
    markAllAsRead: "Marcar todo como leído",
    viewAll: "Ver todas",
    empty: "No hay notificaciones por ahora.",
  },
  fr: {
    bell: "Notifications",
    title: "Notifications",
    markAllAsRead: "Tout marquer comme lu",
    viewAll: "Voir toutes",
    empty: "Aucune notification pour le moment.",
  },
  de: {
    bell: "Benachrichtigungen",
    title: "Benachrichtigungen",
    markAllAsRead: "Alle als gelesen markieren",
    viewAll: "Alle anzeigen",
    empty: "Derzeit keine Benachrichtigungen.",
  },
};

const RELATIVE_TIME_UNITS: {
  unit: Intl.RelativeTimeFormatUnit;
  ms: number;
}[] = [
  { unit: "year", ms: 1000 * 60 * 60 * 24 * 365 },
  { unit: "month", ms: 1000 * 60 * 60 * 24 * 30 },
  { unit: "week", ms: 1000 * 60 * 60 * 24 * 7 },
  { unit: "day", ms: 1000 * 60 * 60 * 24 },
  { unit: "hour", ms: 1000 * 60 * 60 },
  { unit: "minute", ms: 1000 * 60 },
];

function formatRelativeTime(value: string, locale: string) {
  const diffMs = new Date(value).getTime() - Date.now();
  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  });

  for (const { unit, ms } of RELATIVE_TIME_UNITS) {
    const diffInUnit = diffMs / ms;

    if (Math.abs(diffInUnit) >= 1) {
      return formatter.format(Math.round(diffInUnit), unit);
    }
  }

  return formatter.format(Math.round(diffMs / 1000), "second");
}

export default function NotificationBell({
  language,
}: {
  language?: string;
}) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const appLanguage = normalizeAppLanguage(language);
  const t = panelCopy[appLanguage];
  const locale = getLocaleFromLanguage(appLanguage);

  async function fetchNotifications() {
    const response = await fetch("/api/notifications");

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      notifications: (data.notifications || []) as NotificationItem[],
      unreadCount: (data.unreadCount || 0) as number,
    };
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const result = await fetchNotifications();

        if (!cancelled && result) {
          setNotifications(result.notifications);
          setCount(result.unreadCount);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleToggle() {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      setLoading(true);

      try {
        const result = await fetchNotifications();

        if (result) {
          setNotifications(result.notifications);
          setCount(result.unreadCount);
        }
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleMarkAllAsRead() {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
    setCount(0);

    try {
      await fetch("/api/notifications/read-all", {
        method: "POST",
      });
    } catch {
      // Optimistic state stands; the next open re-syncs from the server.
    }
  }

  async function handleNotificationClick(
    notification: NotificationItem
  ) {
    setOpen(false);

    if (!notification.read) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item
        )
      );
      setCount((current) => Math.max(0, current - 1));

      try {
        const response = await fetch(
          `/api/notifications/${notification.id}/read`,
          { method: "POST" }
        );

        if (response.ok) {
          const data = await response.json();
          setCount(data.unreadCount ?? 0);
        }
      } catch {
        // Optimistic state stands; the next open re-syncs from the server.
      }
    }

    if (notification.link) {
      router.push(notification.link);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={t.bell}
        title={t.bell}
        className="relative rounded-2xl border border-white/10 bg-[#071018]/80 p-3 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-[#071018]"
      >
        <Bell size={18} />

        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#071018] shadow-2xl sm:w-96">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <p className="text-sm font-bold text-white">{t.title}</p>

            {count > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-green-400 transition-colors hover:bg-green-500/10"
              >
                <CheckCheck size={14} />
                {t.markAllAsRead}
              </button>
            )}
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-xl bg-white/5"
                  />
                ))}
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex w-full flex-col gap-1.5 px-4 py-3 text-left transition-colors hover:bg-white/5 ${
                      notification.read ? "" : "bg-green-500/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                      )}

                      <span className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-300">
                        {getNotificationTypeLabel(
                          notification.type,
                          appLanguage
                        )}
                      </span>

                      <span className="ml-auto shrink-0 text-[11px] text-gray-500">
                        {formatRelativeTime(notification.createdAt, locale)}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-white">
                      {notification.title}
                    </p>

                    <p className="line-clamp-2 text-xs text-gray-400">
                      {notification.message}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">
                {t.empty}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-2">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {t.viewAll}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
