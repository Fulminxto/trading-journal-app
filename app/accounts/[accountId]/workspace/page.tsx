import type { ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookMarked,
  Bot,
  CalendarDays,
  CandlestickChart,
  FileText,
  Goal,
  KeyRound,
  Layers3,
  LineChart,
  PlugZap,
  Radar,
  Route,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isManager as checkIsManager } from "@/lib/permissions";

type HubModule = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  icon: LucideIcon;
  show: boolean;
  state: "ready" | "limited" | "locked";
  note: string;
};

function formatDate(value: Date | null | undefined) {
  if (!value) return "No activity recorded";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function getRoleLabel(role: string) {
  if (role === "MANAGER") return "Admin";
  if (role === "VIEWER") return "Viewer";
  return "Member";
}

function getActivityTone(type: string) {
  const normalizedType = type.toLowerCase();

  if (
    normalizedType.includes("delete") ||
    normalizedType.includes("remove") ||
    normalizedType.includes("freeze")
  ) {
    return "warning" as const;
  }

  if (
    normalizedType.includes("create") ||
    normalizedType.includes("invite") ||
    normalizedType.includes("sync") ||
    normalizedType.includes("import")
  ) {
    return "info" as const;
  }

  return "neutral" as const;
}

function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "info" | "positive" | "warning";
}) {
  const tones = {
    neutral: "border-flash/[0.12] bg-surface-2 text-muted",
    info: "border-accent-bright/25 bg-accent-bright/[0.08] text-accent-bright",
    positive: "border-positive/25 bg-positive/[0.08] text-positive",
    warning: "border-warning/25 bg-warning/[0.08] text-warning",
  };

  return (
    <span
      className={`inline-flex items-center rounded-pill border-[0.5px] px-3 py-1 text-micro font-medium uppercase tracking-label ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <SignatureEdge orientation="vertical" className="h-4" />
          <p className="text-micro uppercase tracking-label text-accent-bright">
            {eyebrow}
          </p>
        </div>
        <h2 className="mt-2 text-section text-flash">{title}</h2>
      </div>
      {children}
    </div>
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
          <p className="mt-2 text-caption text-muted">{detail}</p>
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
    <div className="rounded-inner border-[0.5px] border-dashed border-flash/[0.12] bg-surface-2 p-5">
      <p className="text-body font-medium text-flash">{title}</p>
      <p className="mt-2 text-caption text-muted">{description}</p>
    </div>
  );
}

function ModuleRow({ module }: { module: HubModule }) {
  const Icon = module.icon;
  const stateTone =
    module.state === "ready"
      ? "info"
      : module.state === "limited"
        ? "warning"
        : "neutral";

  return (
    <Link href={module.href} className="block">
      <Card interactive className="p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted transition-colors duration-fast group-hover:text-accent-bright">
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                {module.eyebrow}
              </p>
              <h3 className="mt-1 text-subsection text-flash">{module.title}</h3>
              <p className="mt-2 max-w-2xl text-caption leading-5 text-muted">
                {module.description}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <StatusPill tone={stateTone}>
              {module.state === "ready"
                ? "Ready"
                : module.state === "limited"
                  ? "Limited"
                  : "Locked"}
            </StatusPill>
            <ArrowRight
              size={17}
              className="text-muted transition-colors duration-fast group-hover:text-accent-bright"
            />
          </div>
        </div>
        <p className="mt-4 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 px-4 py-3 text-caption text-muted">
          {module.note}
        </p>
      </Card>
    </Link>
  );
}

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

  const membership = await prisma.accountMember.findFirst({
    where: {
      userId: session.user.id,
      tradingAccountId: accountId,
    },
    include: {
      tradingAccount: true,
      user: true,
    },
  });

  if (!membership) {
    redirect("/accounts");
  }

  if (membership.role !== "MANAGER" && !membership.canViewMembers) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (membership.tradingAccount.status === "ARCHIVED") {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      lastSeenAt: new Date(),
      lastActivityAt: new Date(),
    },
  });

  const [
    members,
    recentActivities,
    tradesCount,
    sessionsCount,
    goalsCount,
    strategiesCount,
  ] = await Promise.all([
    prisma.accountMember.findMany({
      where: {
        tradingAccountId: accountId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.activityLog.findMany({
      where: {
        accountId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
    prisma.trade.count({
      where: {
        tradingAccountId: accountId,
      },
    }),
    prisma.tradingSession.count({
      where: {
        tradingAccountId: accountId,
      },
    }),
    prisma.tradingGoal.count({
      where: {
        tradingAccountId: accountId,
      },
    }),
    prisma.strategy.count({
      where: {
        tradingAccountId: accountId,
      },
    }),
  ]);

  const account = membership.tradingAccount;
  const isManager = checkIsManager(membership);
  const isSharedAccount = members.length > 1;
  const hasTradingData = tradesCount > 0;
  const hasPlanningData = sessionsCount > 0 || goalsCount > 0 || strategiesCount > 0;
  const canViewAnalytics = isManager || membership.canViewAnalytics;
  const canViewReports = isManager || membership.canViewReports;
  const canUseSessions = isManager || membership.role === "MEMBER";
  const canViewCopilot = isManager || membership.canViewCopilot;
  const canManageMembers = isManager || membership.canManageMembers;
  const canManageAccount = isManager || membership.canManageAccount;

  const readinessChecks = [
    { label: "Account created", ready: true },
    { label: "Trade history", ready: hasTradingData },
    { label: "Planning layer", ready: hasPlanningData },
    { label: "Access roster", ready: members.length > 0 },
    {
      label: "Sync channel",
      ready: account.autoSyncEnabled || account.mt5Enabled || account.brokerSyncEnabled,
    },
  ];
  const readyCount = readinessChecks.filter((check) => check.ready).length;
  const readinessPercent = (readyCount / readinessChecks.length) * 100;
  const workspaceState =
    readyCount <= 2
      ? "Still assembling"
      : readyCount < readinessChecks.length
        ? "Operational"
        : "Fully wired";
  const integrationState =
    account.integrationMode === "manual"
      ? "Manual input"
      : account.syncStatus || "Configured";

  const modules: HubModule[] = [
    {
      title: "Dashboard",
      eyebrow: "Overview",
      description: "Open the account summary and current operating condition.",
      href: `/accounts/${accountId}/dashboard`,
      icon: BarChart3,
      show: true,
      state: hasTradingData ? "ready" : "limited",
      note: hasTradingData
        ? "Performance data is available."
        : "No trades yet. Dashboard will stay limited until trade history exists.",
    },
    {
      title: "Trading Diary",
      eyebrow: "Execution",
      description: "Enter, inspect, and replay the account's trade records.",
      href: `/accounts/${accountId}/diary`,
      icon: CandlestickChart,
      show: true,
      state: "ready",
      note: membership.canCreateTrades
        ? "You can create trades from this account."
        : "You can review visible trade records, but creation is not enabled for your role.",
    },
    {
      title: "Calendar",
      eyebrow: "Daily map",
      description: "Use the daily grid when you need date-level orientation.",
      href: `/accounts/${accountId}/calendar`,
      icon: CalendarDays,
      show: true,
      state: hasTradingData ? "ready" : "limited",
      note: hasTradingData
        ? "Daily history is populated from account trades."
        : "Calendar will become meaningful after the first logged trades.",
    },
    {
      title: "Equity",
      eyebrow: "Capital path",
      description: "Inspect the capital curve and drawdown room.",
      href: `/accounts/${accountId}/equity`,
      icon: LineChart,
      show: true,
      state: hasTradingData ? "ready" : "limited",
      note: hasTradingData
        ? "Equity review has trade history to work with."
        : "Equity is waiting for account trades; no synthetic curve is shown.",
    },
    {
      title: "Analytics",
      eyebrow: "Microscope",
      description: "Open deeper analysis only when you need diagnostics.",
      href: `/accounts/${accountId}/analytics`,
      icon: Activity,
      show: canViewAnalytics,
      state: hasTradingData ? "ready" : "limited",
      note: hasTradingData
        ? "Analytics can read the account trade set."
        : "Analytics remains constrained until there is enough trade data.",
    },
    {
      title: "Reports",
      eyebrow: "Executive review",
      description: "Move into report mode for clean review and export surfaces.",
      href: `/accounts/${accountId}/reports`,
      icon: FileText,
      show: canViewReports,
      state: hasTradingData ? "ready" : "limited",
      note: hasTradingData
        ? "Reports can summarize real account activity."
        : "Reports will avoid fake conclusions until trades exist.",
    },
    {
      title: "Sessions",
      eyebrow: "Preparation",
      description: "Plan and review execution sessions before and after market work.",
      href: `/accounts/${accountId}/sessions`,
      icon: Radar,
      show: canUseSessions,
      state: sessionsCount > 0 ? "ready" : "limited",
      note:
        sessionsCount > 0
          ? "Session history exists for this account."
          : "No sessions planned yet. Use this room to establish the operating ritual.",
    },
    {
      title: "Copilot",
      eyebrow: "Intelligence layer",
      description: "Use the rule-based intelligence layer when account context is sufficient.",
      href: `/accounts/${accountId}/copilot`,
      icon: Bot,
      show: canViewCopilot,
      state: tradesCount >= 5 ? "ready" : "limited",
      note:
        tradesCount >= 5
          ? "Copilot has enough trade context for guarded signals."
          : "Copilot will stay conservative until at least five trades exist.",
    },
    {
      title: "Members",
      eyebrow: "Access control",
      description: "Manage account access, role hierarchy, and permission clarity.",
      href: `/accounts/${accountId}/members`,
      icon: Users,
      show: true,
      state: canManageMembers ? "ready" : "limited",
      note: canManageMembers
        ? "You can manage access from the Members control room."
        : "You can view access, but management actions are not enabled for your role.",
    },
    {
      title: "Rules & Goals",
      eyebrow: "Discipline",
      description: "Open the rule system when you need account guardrails.",
      href: `/accounts/${accountId}/rules`,
      icon: Goal,
      show: canManageAccount,
      state: goalsCount > 0 ? "ready" : "limited",
      note:
        goalsCount > 0
          ? "Goal structure is present."
          : "No goals are configured yet. This is an honest setup gap.",
    },
    {
      title: "Integrations",
      eyebrow: "Data channel",
      description: "Check how data enters the account and whether sync is active.",
      href: `/accounts/${accountId}/integrations`,
      icon: PlugZap,
      show: canManageAccount,
      state:
        account.autoSyncEnabled || account.mt5Enabled || account.brokerSyncEnabled
          ? "ready"
          : "limited",
      note: `Current mode: ${integrationState}.`,
    },
    {
      title: "Playbook",
      eyebrow: "Strategy library",
      description: "Keep the account's strategy language organized.",
      href: `/accounts/${accountId}/playbook`,
      icon: BookMarked,
      show: true,
      state: strategiesCount > 0 ? "ready" : "limited",
      note:
        strategiesCount > 0
          ? "Strategy records exist for this account."
          : "No strategies are saved yet. Playbook is ready for the first setup.",
    },
  ];

  const visibleModules = modules.filter((module) => module.show);
  const primaryModules = visibleModules.slice(0, 4);
  const intelligenceModules = visibleModules.filter((module) =>
    ["Analytics", "Reports", "Sessions", "Copilot"].includes(module.title)
  );
  const controlModules = visibleModules.filter((module) =>
    ["Members", "Rules & Goals", "Integrations", "Playbook"].includes(module.title)
  );
  const nextStep =
    !hasTradingData
      ? {
          title: "Log the first account trade",
          description:
            "Most performance rooms stay limited until real trade records exist.",
          href: `/accounts/${accountId}/diary/new`,
          label: "Add trade",
        }
      : !hasPlanningData
        ? {
            title: "Set the operating structure",
            description:
              "Add sessions, goals, or strategies so the account has a planning layer.",
            href: canUseSessions
              ? `/accounts/${accountId}/sessions`
              : `/accounts/${accountId}/playbook`,
            label: canUseSessions ? "Open sessions" : "Open playbook",
          }
        : {
            title: "Review the account operating state",
            description:
              "The workspace is wired. Move into reports when you need an executive review.",
            href: canViewReports
              ? `/accounts/${accountId}/reports`
              : `/accounts/${accountId}/dashboard`,
            label: canViewReports ? "Open reports" : "Open dashboard",
          };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:pr-[18rem] xl:pr-[20rem] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-micro uppercase tracking-hero text-muted-faint">
            Account command hub &middot; {account.name}
          </p>
          <h1 className="mt-3 text-hero text-flash">Workspace</h1>
        </div>

        <Link
          href={`/accounts/${accountId}`}
          className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm font-medium text-muted transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/45 hover:text-accent-bright"
        >
          Account hub
          <ArrowRight size={16} />
        </Link>
      </div>

      <Card variant="hero" className="reveal-rise">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone="info">{account.name}</StatusPill>
              <StatusPill>{getRoleLabel(membership.role)}</StatusPill>
              <StatusPill tone={isSharedAccount ? "info" : "neutral"}>
                {isSharedAccount ? "Shared account" : "Solo account"}
              </StatusPill>
            </div>

            <h2 className="mt-6 max-w-3xl text-section text-flash">
              {workspaceState}
            </h2>
            <p className="mt-4 max-w-3xl text-body text-muted">
              Workspace does not invent health scores. It reads account setup,
              permissions, and existing records to show the next operational
              move.
            </p>

            <div className="mt-6">
              <Link
                href={nextStep.href}
                className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-5 py-3 text-sm font-medium text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55"
              >
                {nextStep.label}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-micro uppercase tracking-label text-muted-faint">
                  Readiness
                </p>
                <p className="text-body font-medium text-flash">
                  {formatPercent(readinessPercent)}
                </p>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-pill bg-surface-1">
                <div
                  className="h-full rounded-pill bg-accent-bright transition-all duration-base"
                  style={{ width: `${readinessPercent}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {readinessChecks.map((check) => (
                <div
                  key={check.label}
                  className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 px-4 py-3"
                >
                  <p className="text-caption text-muted">{check.label}</p>
                  <p
                    className={`mt-1 text-body font-medium ${
                      check.ready ? "text-accent-bright" : "text-muted-faint"
                    }`}
                  >
                    {check.ready ? "Ready" : "Pending"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Visible modules"
          value={String(visibleModules.length)}
          detail="Rooms available to your role."
          icon={Layers3}
        />
        <StatCard
          label="Trade history"
          value={hasTradingData ? String(tradesCount) : "Not started"}
          detail="Used only as readiness, not performance."
          icon={CandlestickChart}
        />
        <StatCard
          label="Planning layer"
          value={hasPlanningData ? "Present" : "Missing"}
          detail="Sessions, goals, or strategies."
          icon={Route}
        />
        <StatCard
          label="Access roster"
          value={`${members.length} member${members.length === 1 ? "" : "s"}`}
          detail="Detailed permissions live in Members."
          icon={Users}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="reveal-rise">
          <SectionHeader eyebrow="Next move" title={nextStep.title}>
            <StatusPill tone="info">Recommended</StatusPill>
          </SectionHeader>
          <p className="mt-4 text-body text-muted">{nextStep.description}</p>
          <Link
            href={nextStep.href}
            className="mt-6 inline-flex items-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm font-medium text-muted transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/45 hover:text-accent-bright"
          >
            {nextStep.label}
            <ArrowRight size={16} />
          </Link>
        </Card>

        <Card className="reveal-rise">
          <SectionHeader eyebrow="Data channel" title="Account wiring">
            <StatusPill
              tone={
                account.autoSyncEnabled || account.mt5Enabled || account.brokerSyncEnabled
                  ? "info"
                  : "neutral"
              }
            >
              {integrationState}
            </StatusPill>
          </SectionHeader>
          <div className="mt-6 space-y-3">
            {[
              ["Mode", account.integrationMode],
              ["Sync status", account.syncStatus],
              ["Last sync", formatDate(account.lastSyncedAt)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 px-4 py-3"
              >
                <span className="text-caption text-muted">{label}</span>
                <span className="text-right text-caption font-medium text-flash">
                  {value || "Not configured"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="space-y-5">
        <SectionHeader eyebrow="Launch deck" title="Core operating rooms">
          <StatusPill>{primaryModules.length} primary</StatusPill>
        </SectionHeader>

        <div className="grid gap-4 xl:grid-cols-2">
          {primaryModules.map((module) => (
            <ModuleRow key={module.href} module={module} />
          ))}
        </div>
      </section>

      {intelligenceModules.length > 0 && (
        <section className="space-y-5">
          <SectionHeader eyebrow="Review layer" title="Intelligence rooms">
            <StatusPill>{intelligenceModules.length} visible</StatusPill>
          </SectionHeader>

          <div className="grid gap-4 xl:grid-cols-2">
            {intelligenceModules.map((module) => (
              <ModuleRow key={module.href} module={module} />
            ))}
          </div>
        </section>
      )}

      {controlModules.length > 0 && (
        <section className="space-y-5">
          <SectionHeader eyebrow="Control layer" title="Account controls">
            <StatusPill>{controlModules.length} visible</StatusPill>
          </SectionHeader>

          <div className="grid gap-4 xl:grid-cols-2">
            {controlModules.map((module) => (
              <ModuleRow key={module.href} module={module} />
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <SectionHeader eyebrow="Roster signal" title="Account presence">
            <StatusPill>{members.length} listed</StatusPill>
          </SectionHeader>
          <div className="mt-6 space-y-3">
            {members.length > 0 ? (
              members.slice(0, 4).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-4 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-body font-medium text-flash">
                      {member.user.name ?? member.user.username}
                    </p>
                    <p className="mt-1 text-caption text-muted">
                      {getRoleLabel(member.role)}
                    </p>
                  </div>
                  <p className="shrink-0 text-right text-caption text-muted">
                    {formatDate(member.user.lastActivityAt ?? member.user.lastSeenAt)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                title="No roster available"
                description="Workspace cannot show team presence until account members exist."
              />
            )}
          </div>
          {members.length > 4 && (
            <Link
              href={`/accounts/${accountId}/members`}
              className="mt-4 inline-flex text-caption font-medium text-accent-bright"
            >
              Open Members for the full roster
            </Link>
          )}
        </Card>

        <Card>
          <SectionHeader eyebrow="Audit preview" title="Recent account events">
            <StatusPill>{recentActivities.length} loaded</StatusPill>
          </SectionHeader>
          <div className="mt-6 space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill tone={getActivityTone(activity.type)}>
                      {activity.type}
                    </StatusPill>
                    {activity.user && (
                      <span className="text-caption text-muted">
                        @{activity.user.username}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-body font-medium text-flash">
                    {activity.title}
                  </p>
                  {activity.description && (
                    <p className="mt-2 text-caption leading-5 text-muted">
                      {activity.description}
                    </p>
                  )}
                  <p className="mt-3 text-micro uppercase tracking-label text-muted-faint">
                    {formatDate(activity.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                title="No recent account events"
                description="The audit preview will populate when real account actions are logged."
              />
            )}
          </div>
        </Card>
      </section>

      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-body font-medium text-flash">
                Workspace respects account permissions.
              </p>
              <p className="mt-1 text-caption text-muted">
                Hidden rooms are omitted from this hub, but server-side checks
                still protect every destination route.
              </p>
            </div>
          </div>
          <StatusPill tone="info">
            <KeyRound size={13} className="mr-2" />
            Server gated
          </StatusPill>
        </div>
      </Card>
    </div>
  );
}
