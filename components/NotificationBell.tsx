"use client";

import {
  ArrowRight,
  Bell,
  CheckCheck,
  Inbox,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  acceptInvite,
  declineInvite,
} from "@/app/accounts/[accountId]/members/actions";
import { CRYSTAL_FACE } from "@/components/ui/Card";
import ListRow from "@/components/ui/ListRow";
import {
  getLocaleFromLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { getNotificationTypeLabel } from "@/lib/notifications";

const OVERLAY_FACE =
  "linear-gradient(160deg, rgba(7,16,24,0.98) 0%, rgba(10,16,32,0.98) 58%, rgba(7,16,24,0.96) 100%)";

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
  commandSurface: string;
  markAllAsRead: string;
  refresh: string;
  viewAll: string;
  emptyTitle: string;
  emptyDescription: string;
};

const basePanelCopy: PanelCopy = {
  bell: "Notifications",
  title: "Notifications",
  commandSurface: "Command surface",
  markAllAsRead: "Mark all read",
  refresh: "Refresh",
  viewAll: "View all",
  emptyTitle: "No notifications",
  emptyDescription: "Important account updates will appear here.",
};

const panelCopy: Record<AppLanguage, PanelCopy> = {
  it: {
    ...basePanelCopy,
    refresh: "Aggiorna",
  },
  en: basePanelCopy,
  uk: basePanelCopy,
  ru: basePanelCopy,
  es: basePanelCopy,
  fr: basePanelCopy,
  de: basePanelCopy,
};

type InviteCopy = {
  accept: string;
  decline: string;
  declineSuccess: string;
  acceptError: string;
  declineError: string;
};

const baseInviteCopy: InviteCopy = {
  accept: "Accept",
  decline: "Decline",
  declineSuccess: "Invite declined.",
  acceptError: "Could not accept invite. Try again.",
  declineError: "Could not decline invite. Try again.",
};

const inviteCopy: Record<AppLanguage, InviteCopy> = {
  it: baseInviteCopy,
  en: baseInviteCopy,
  uk: baseInviteCopy,
  ru: baseInviteCopy,
  es: baseInviteCopy,
  fr: baseInviteCopy,
  de: baseInviteCopy,
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

function extractAccountId(link: string | null): string | null {
  if (!link) return null;
  const parts = link.split("/");
  return parts[2] || null;
}

function NotificationIcon({ type }: { type: string }) {
  const Icon = type === "ACCOUNT_INVITE" ? Users : ShieldCheck;

  return (
    <span className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-2 text-muted transition-colors duration-fast group-hover:text-accent-bright">
      <Icon size={15} />
    </span>
  );
}

export default function NotificationBell({ language }: { language?: string }) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const appLanguage = normalizeAppLanguage(language);
  const t = panelCopy[appLanguage];
  const ti = inviteCopy[appLanguage];
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

  async function handleRefresh() {
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

  async function markNotificationRead(notification: NotificationItem) {
    if (notification.read) return;

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item
      )
    );
    setCount((current) => Math.max(0, current - 1));

    try {
      await fetch(`/api/notifications/${notification.id}/read`, {
        method: "POST",
      });
    } catch {
      // Optimistic state stands.
    }
  }

  async function handleNotificationClick(notification: NotificationItem) {
    setOpen(false);

    if (!notification.read) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item
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

  async function handleAccept(notification: NotificationItem) {
    const accountId = extractAccountId(notification.link);

    if (!accountId || loadingInvite) return;

    setLoadingInvite(notification.id);

    try {
      await markNotificationRead(notification);
      await acceptInvite(accountId);
    } catch {
      setLoadingInvite(null);
      toast.error(ti.acceptError);
    }
  }

  async function handleDecline(notification: NotificationItem) {
    const accountId = extractAccountId(notification.link);

    if (!accountId || loadingInvite) return;

    setLoadingInvite(notification.id);

    try {
      const result = await declineInvite(accountId);

      if (result?.error) {
        toast.error(ti.declineError);
        return;
      }

      await markNotificationRead(notification);
      setNotifications((current) =>
        current.filter((n) => n.id !== notification.id)
      );
      toast.success(ti.declineSuccess);
    } catch {
      toast.error(ti.declineError);
    } finally {
      setLoadingInvite(null);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={count > 0 ? `${t.bell} (${count})` : t.bell}
        title={t.bell}
        className="relative overflow-hidden rounded-inner border-[0.5px] border-flash/[0.1] p-3 shadow-[0_8px_28px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/45"
        style={{ background: CRYSTAL_FACE }}
      >
        <Bell size={18} className="relative z-10 text-muted" />

        {count > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-2.5 top-2.5 h-2 w-2 rounded-pill bg-accent-bright"
          />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-card border-[0.5px] border-flash/[0.14] shadow-[0_22px_70px_rgba(0,0,0,0.58)] backdrop-blur-2xl sm:w-96"
          style={{ background: OVERLAY_FACE }}
        >
          <div className="border-b-[0.5px] border-flash/[0.08] bg-surface-2/55 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-micro uppercase tracking-label text-muted-faint">
                  {t.commandSurface}
                </p>
                <h2 className="mt-1 text-subsection text-flash">{t.title}</h2>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 px-3 py-2 text-caption font-medium text-muted transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/45 hover:text-accent-bright disabled:pointer-events-none disabled:opacity-60"
                >
                  <RefreshCw
                    size={14}
                    className={loading ? "animate-spin" : ""}
                  />
                  {t.refresh}
                </button>

              {count > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center gap-1.5 rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 px-3 py-2 text-caption font-medium text-muted transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/45 hover:text-accent-bright"
                >
                  <CheckCheck size={14} />
                  {t.markAllAsRead}
                </button>
              )}
              </div>
            </div>
          </div>

          <div className="max-h-[70vh] space-y-2 overflow-y-auto p-2">
            {loading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-inner border-[0.5px] border-flash/[0.06] bg-surface-2"
                  />
                ))}
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) =>
                notification.type === "ACCOUNT_INVITE" ? (
                  <ListRow
                    key={notification.id}
                    className={`flex flex-col gap-3 ${
                      notification.read
                        ? "bg-transparent"
                        : "border-accent-bright/25 bg-accent-bright/[0.06]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <NotificationIcon type={notification.type} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {!notification.read && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-pill bg-accent-bright" />
                          )}
                          <span className="rounded-pill border-[0.5px] border-flash/[0.1] bg-surface-2 px-2 py-0.5 text-micro uppercase tracking-label text-muted">
                            {getNotificationTypeLabel(
                              notification.type,
                              appLanguage
                            )}
                          </span>
                          <span className="ml-auto shrink-0 text-micro text-muted-faint">
                            {formatRelativeTime(notification.createdAt, locale)}
                          </span>
                        </div>
                        <p className="mt-2 text-body font-medium text-flash">
                          {notification.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-caption leading-5 text-muted">
                          {notification.message}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAccept(notification)}
                        disabled={loadingInvite === notification.id}
                        className="inline-flex items-center justify-center gap-1.5 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-3 py-2 text-caption font-semibold text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55 disabled:opacity-60"
                      >
                        {loadingInvite === notification.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : null}
                        {ti.accept}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDecline(notification)}
                        disabled={loadingInvite === notification.id}
                        className="inline-flex items-center justify-center gap-1.5 rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 px-3 py-2 text-caption font-semibold text-muted transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/45 hover:text-accent-bright disabled:opacity-60"
                      >
                        {loadingInvite === notification.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : null}
                        {ti.decline}
                      </button>
                    </div>
                  </ListRow>
                ) : (
                  <ListRow
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex flex-col gap-2 ${
                      notification.read
                        ? "bg-transparent"
                        : "border-accent-bright/25 bg-accent-bright/[0.06]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <NotificationIcon type={notification.type} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {!notification.read && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-pill bg-accent-bright" />
                          )}
                          <span className="rounded-pill border-[0.5px] border-flash/[0.1] bg-surface-2 px-2 py-0.5 text-micro uppercase tracking-label text-muted">
                            {getNotificationTypeLabel(
                              notification.type,
                              appLanguage
                            )}
                          </span>
                          <span className="ml-auto shrink-0 text-micro text-muted-faint">
                            {formatRelativeTime(notification.createdAt, locale)}
                          </span>
                        </div>
                        <p className="mt-2 text-body font-medium text-flash">
                          {notification.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-caption leading-5 text-muted">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </ListRow>
                )
              )
            ) : (
              <div className="m-2 rounded-inner border-[0.5px] border-dashed border-flash/[0.12] bg-surface-2 p-6 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-1 text-muted">
                  <Inbox size={18} />
                </div>
                <p className="mt-4 text-body font-medium text-flash">
                  {t.emptyTitle}
                </p>
                <p className="mt-2 text-caption leading-5 text-muted">
                  {t.emptyDescription}
                </p>
              </div>
            )}
          </div>

          <div className="border-t-[0.5px] border-flash/[0.08] p-2">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-inner px-3 py-3 text-sm font-medium text-muted transition-all duration-fast hover:bg-surface-2 hover:text-accent-bright"
            >
              {t.viewAll}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
