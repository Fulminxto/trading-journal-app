"use client";

import {
  ArrowRight,
  Bell,
  CheckCheck,
  Settings2,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./actions";

type FilterId = "all" | "unread" | "account" | "security" | "system";
type Category = "account" | "security" | "system" | "other";

type NotificationItem = {
  id: string;
  type: string;
  typeLabel: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
};

const filters: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "account", label: "Account" },
  { id: "security", label: "Security" },
  { id: "system", label: "System" },
];

const relativeTimeUnits: Array<{
  unit: Intl.RelativeTimeFormatUnit;
  milliseconds: number;
}> = [
  { unit: "year", milliseconds: 31_536_000_000 },
  { unit: "month", milliseconds: 2_592_000_000 },
  { unit: "week", milliseconds: 604_800_000 },
  { unit: "day", milliseconds: 86_400_000 },
  { unit: "hour", milliseconds: 3_600_000 },
  { unit: "minute", milliseconds: 60_000 },
];

function getCategory(type: string): Category {
  const normalized = type.toUpperCase();

  if (/AUTH|SECURITY|LOGIN|PASSWORD|SESSION|PERMISSION/.test(normalized)) {
    return "security";
  }
  if (/MAINTENANCE|RELEASE|SUPPORT|SYNC|SYSTEM|PLATFORM/.test(normalized)) {
    return "system";
  }
  if (/ACCOUNT|MEMBER|TRADE/.test(normalized)) {
    return "account";
  }
  return "other";
}

function matchesFilter(notification: NotificationItem, filter: FilterId) {
  if (filter === "all") return true;
  if (filter === "unread") return !notification.read;
  return getCategory(notification.type) === filter;
}

function formatRelativeTime(value: string, locale: string, referenceTime: number) {
  const difference = new Date(value).getTime() - referenceTime;
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  for (const { unit, milliseconds } of relativeTimeUnits) {
    if (Math.abs(difference) >= milliseconds) {
      return formatter.format(Math.round(difference / milliseconds), unit);
    }
  }

  return formatter.format(Math.round(difference / 1000), "second");
}

function iconPresentation(category: Category): {
  Icon: LucideIcon;
  className: string;
} {
  if (category === "account") {
    return { Icon: Users, className: "bg-cyan-500/10 text-cyan-400" };
  }
  if (category === "security") {
    return { Icon: ShieldCheck, className: "bg-amber-500/10 text-amber-400" };
  }
  if (category === "system") {
    return { Icon: Settings2, className: "bg-purple-500/10 text-purple-400" };
  }
  return { Icon: Bell, className: "bg-white/[0.04] text-slate-400" };
}

export default function NotificationsInbox({
  notifications,
  locale,
  referenceTime,
}: {
  notifications: NotificationItem[];
  locale: string;
  referenceTime: number;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const visibleNotifications = notifications.filter((notification) =>
    matchesFilter(notification, activeFilter)
  );

  return (
    <main className="max-w-4xl mx-auto py-6">
      <header className="w-full">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Notifications</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Review account invitations, permission updates, and system notices in one controlled surface.
          </p>
        </div>
      </header>

      <div className="flex justify-between items-center w-full mb-6 flex-wrap gap-3 mt-5">
        <div className="flex flex-wrap items-center gap-2" aria-label="Filter notifications">
          {filters.map((filter) => {
            const active = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-full border px-3 py-1 text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                  active
                    ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                    : "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <form action={markAllNotificationsAsRead}>
          <button
            type="submit"
            disabled={unreadCount === 0}
            className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 disabled:pointer-events-none disabled:cursor-default disabled:opacity-40"
          >
            Mark all as read
          </button>
        </form>
      </div>

      <section className="w-full space-y-3" aria-label="Notification inbox">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[#070d19]/80 p-12 text-center">
            <Bell className="mx-auto mb-3 h-8 w-8 text-cyan-400" aria-hidden="true" />
            <h2 className="text-base font-semibold text-white">You&apos;re all caught up!</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
              No unread notifications at the moment. New account activity and system notices will appear here.
            </p>
          </div>
        ) : visibleNotifications.length === 0 ? (
          <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-6 text-sm text-slate-400">
            No notifications in this category.
          </p>
        ) : (
          visibleNotifications.map((notification) => {
            const unread = !notification.read;
            const category = getCategory(notification.type);
            const { Icon, className } = iconPresentation(category);

            return (
              <article
                key={notification.id}
                aria-label={`${notification.typeLabel}${unread ? ", unread" : ""}`}
                className={`relative flex items-start gap-4 rounded-xl border bg-[#070d19]/70 px-5 py-4 transition-all hover:border-white/[0.10] hover:bg-white/[0.025] ${
                  unread ? "border-cyan-500/20" : "border-white/[0.06]"
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${className}`}>
                  <Icon size={17} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          {notification.typeLabel}
                        </span>
                      </div>
                      <h2 className={`mt-1 text-sm font-semibold ${unread ? "text-white" : "text-slate-100"}`}>
                        {notification.title}
                      </h2>
                      {notification.message ? (
                        <p className="mt-1 text-sm leading-relaxed text-slate-400">
                          {notification.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-2" aria-label={unread ? "Unread notification" : undefined}>
                      <time
                        dateTime={notification.createdAt}
                        className="whitespace-nowrap text-xs text-slate-500"
                      >
                        {formatRelativeTime(notification.createdAt, locale, referenceTime)}
                      </time>
                      {unread ? (
                        <span className="h-2 w-2 rounded-full bg-cyan-400" aria-hidden="true" />
                      ) : null}
                    </div>
                  </div>

                  {(notification.link || unread) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {notification.link ? (
                        <Link
                          href={notification.link}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                        >
                          Open
                          <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                      ) : null}

                      {unread ? (
                        <form action={markNotificationAsRead}>
                          <input type="hidden" name="notificationId" value={notification.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                          >
                            <CheckCheck size={13} aria-hidden="true" />
                            Mark as read
                          </button>
                        </form>
                      ) : null}
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
