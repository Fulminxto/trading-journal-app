import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Bell,
  CheckCheck,
  Inbox,
  MailCheck,
  MailOpen,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import { auth } from "@/lib/auth";
import {
  formatDateTimeByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { getNotificationTypeLabel } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./actions";

type NotificationsCopy = {
  eyebrow: string;
  title: string;
  description: string;
  markAllAsRead: string;
  total: string;
  unread: string;
  read: string;
  open: string;
  markAsRead: string;
  emptyTitle: string;
  emptyDescription: string;
};

const baseCopy: NotificationsCopy = {
  eyebrow: "Notification center",
  title: "Notifications",
  description:
    "Review account invitations, permission updates, and system notices in one controlled surface.",
  markAllAsRead: "Mark all read",
  total: "Total",
  unread: "Unread",
  read: "Read",
  open: "Open",
  markAsRead: "Mark read",
  emptyTitle: "No notifications",
  emptyDescription:
    "There is nothing waiting for review. New account activity will appear here when it exists.",
};

const notificationsCopy: Record<AppLanguage, NotificationsCopy> = {
  it: baseCopy,
  en: baseCopy,
  uk: baseCopy,
  ru: baseCopy,
  es: baseCopy,
  fr: baseCopy,
  de: baseCopy,
};

type Tone = "neutral" | "info";

function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  const tones = {
    neutral: "border-flash/[0.12] bg-surface-2 text-muted",
    info: "border-accent-bright/25 bg-accent-bright/[0.08] text-accent-bright",
  };

  return (
    <span
      className={`inline-flex items-center rounded-pill border-[0.5px] px-3 py-1 text-micro font-medium uppercase tracking-label ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="reveal-rise p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-micro uppercase tracking-label text-muted-faint">
            {label}
          </p>
          <p className="mt-3 text-metric tabular-nums text-flash">{value}</p>
          <p className="mt-2 text-caption leading-5 text-muted">{detail}</p>
        </div>
        <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
          <Icon size={18} />
        </div>
      </div>
    </Card>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-inner border-[0.5px] border-dashed border-flash/[0.12] bg-surface-2 p-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-1 text-muted">
        <Inbox size={19} />
      </div>
      <p className="mt-4 text-body font-medium text-flash">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-caption leading-5 text-muted">
        {description}
      </p>
    </div>
  );
}

function NotificationIcon({ unread }: { unread: boolean }) {
  const Icon = unread ? Bell : MailOpen;

  return (
    <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
      <Icon size={18} />
    </div>
  );
}

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

  const appLanguage = normalizeAppLanguage(currentUser?.appLanguage);
  const t = notificationsCopy[appLanguage];

  const notifications = await prisma.notification.findMany({
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
  const readCount = notifications.length - unreadCount;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-micro uppercase tracking-hero text-muted-faint">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-hero text-flash">{t.title}</h1>
          <div className="mt-4 max-w-3xl">
            <SignatureEdge orientation="horizontal" className="mb-4 max-w-40" />
            <p className="text-body text-muted">{t.description}</p>
          </div>
        </div>

        {unreadCount > 0 ? (
          <form action={markAllNotificationsAsRead}>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-5 py-3 text-sm font-semibold text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55"
            >
              <CheckCheck size={17} />
              {t.markAllAsRead}
            </button>
          </form>
        ) : (
          <StatusPill>All clear</StatusPill>
        )}
      </div>

      <Card variant="hero" className="reveal-rise">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={unreadCount > 0 ? "info" : "neutral"}>
                {unreadCount > 0 ? "Review needed" : "No unread items"}
              </StatusPill>
              <StatusPill>{notifications.length} loaded</StatusPill>
            </div>
            <h2 className="mt-6 max-w-3xl text-section text-flash">
              A quiet command inbox for account events.
            </h2>
            <p className="mt-4 max-w-3xl text-body text-muted">
              Unread state is based only on saved notification records. VOLTIS
              does not manufacture urgency when the inbox is clear.
            </p>
          </div>

          <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-5">
            <div className="flex items-start gap-4">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-muted" />
              <div>
                <p className="text-body font-medium text-flash">
                  Server-owned state
                </p>
                <p className="mt-2 text-caption leading-5 text-muted">
                  This page reads notifications scoped to the authenticated
                  user and writes read state through server actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label={t.total}
          value={String(notifications.length)}
          detail="Records available in this notification center."
          icon={MailCheck}
        />
        <StatCard
          label={t.unread}
          value={String(unreadCount)}
          detail="Items still waiting for review."
          icon={Bell}
        />
        <StatCard
          label={t.read}
          value={String(readCount)}
          detail="Items already acknowledged."
          icon={MailOpen}
        />
      </section>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <SignatureEdge orientation="vertical" className="h-4" />
              <p className="text-micro uppercase tracking-label text-accent-bright">
                Inbox
              </p>
            </div>
            <h2 className="mt-2 text-section text-flash">Recent notifications</h2>
          </div>
          <StatusPill>{notifications.length} items</StatusPill>
        </div>

        <div className="mt-6 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const unread = !notification.read;

              return (
                <div
                  key={notification.id}
                  className={`rounded-inner border-[0.5px] p-5 transition-all duration-base hover:-translate-y-0.5 hover:border-accent-bright/40 ${
                    unread
                      ? "border-accent-bright/25 bg-accent-bright/[0.06]"
                      : "border-flash/[0.08] bg-surface-2"
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <NotificationIcon unread={unread} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {unread && (
                            <StatusPill tone="info">Unread</StatusPill>
                          )}
                          <StatusPill>
                            {getNotificationTypeLabel(
                              notification.type,
                              appLanguage
                            )}
                          </StatusPill>
                          <span className="text-caption text-muted-faint">
                            {formatDateTimeByLanguage(
                              notification.createdAt,
                              appLanguage
                            )}
                          </span>
                        </div>

                        <h3 className="mt-3 text-subsection text-flash">
                          {notification.title}
                        </h3>
                        <p className="mt-2 max-w-3xl text-caption leading-5 text-muted">
                          {notification.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm font-medium text-muted transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/45 hover:text-accent-bright"
                        >
                          {t.open}
                          <ArrowRight size={15} />
                        </Link>
                      )}

                      {unread && (
                        <form action={markNotificationAsRead}>
                          <input
                            type="hidden"
                            name="notificationId"
                            value={notification.id}
                          />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-4 py-3 text-sm font-medium text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55"
                          >
                            <CheckCheck size={16} />
                            {t.markAsRead}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              title={t.emptyTitle}
              description={t.emptyDescription}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
