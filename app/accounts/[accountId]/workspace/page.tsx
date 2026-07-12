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
  Layers3,
  LineChart,
  PlugZap,
  Radar,
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
  state: "ready" | "limited" | "pending" | "manual" | "unavailable";
  note: string;
};

type ReadinessState = "Ready" | "Manual mode" | "Pending" | "Limited" | "Unavailable";

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

function getActivityTitle(type: string) {
  const titles: Record<string, string> = {
    TRADING_GOALS_UPDATED: "Trading goals updated",
    TRADING_SESSION_CREATED: "Trading session created",
    TRADE_CREATED: "Trade created",
    TRADE_UPDATED: "Trade updated",
    TRADE_DELETED: "Trade deleted",
    INTEGRATION_SETTINGS_UPDATED: "Integration settings updated",
    MEMBER_INVITED: "Member invited",
    MEMBER_REMOVED: "Member removed",
  };

  if (titles[type]) return titles[type];

  const readable = type.toLowerCase().replaceAll("_", " ");
  return readable.charAt(0).toUpperCase() + readable.slice(1);
}

function getActivityDescription(type: string) {
  const descriptions: Record<string, string> = {
    TRADING_GOALS_UPDATED: "Account standards were updated.",
    TRADING_SESSION_CREATED: "A trading session was added to the account.",
    TRADE_CREATED: "A trade was added to the account history.",
    TRADE_UPDATED: "A trade record was updated.",
    TRADE_DELETED: "A trade record was removed.",
    INTEGRATION_SETTINGS_UPDATED: "The account data channel was updated.",
  };

  return descriptions[type] ?? null;
}

function getDataMode(mode: string | null) {
  if (mode === "mt5") return "MT5";
  if (mode === "broker") return "Broker";
  if (mode === "hybrid") return "Hybrid";
  return "Manual";
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
      : module.state === "manual"
        ? "info"
      : module.state === "limited"
        ? "warning"
        : module.state === "pending"
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
                : module.state === "manual"
                  ? "Manual mode"
                : module.state === "limited"
                  ? "Limited"
                  : module.state === "pending"
                    ? "Pending"
                    : "Unavailable"}
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
  const canManagePlaybook = isManager || membership.canCreateTrades;
  const isManualMode = account.integrationMode === "manual";
  const hasExternalSync =
    account.autoSyncEnabled || account.mt5Enabled || account.brokerSyncEnabled;

  const readinessChecks: Array<{ label: string; state: ReadinessState }> = [
    { label: "Account created", state: "Ready" },
    { label: "Trade history", state: hasTradingData ? "Ready" : "Pending" },
    { label: "Planning layer", state: hasPlanningData ? "Ready" : "Pending" },
    { label: "Access roster", state: members.length > 0 ? "Ready" : "Unavailable" },
    {
      label: "Data channel",
      state: isManualMode
        ? "Manual mode"
        : hasExternalSync
          ? "Ready"
          : "Pending",
    },
  ];
  const readyCount = readinessChecks.filter(
    (check) => check.state === "Ready" || check.state === "Manual mode"
  ).length;
  const readinessPercent = (readyCount / readinessChecks.length) * 100;
  const workspaceState =
    readyCount <= 2
      ? "Still assembling"
      : readyCount < readinessChecks.length
        ? "Operational"
        : "Fully wired";
  const integrationState =
    isManualMode
      ? "Manual input"
      : getDataMode(account.integrationMode);

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
      state: isManualMode ? "manual" : hasExternalSync ? "ready" : "pending",
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
    !isManualMode && !hasExternalSync && canManageAccount
      ? {
          title: "Connect the account data channel",
          description:
            "Configure a supported data source to automate account activity.",
          href: `/accounts/${accountId}/integrations`,
          label: "Open integrations",
        }
      : strategiesCount === 0 && canManagePlaybook
      ? {
          title: "Define the operating playbook",
          description:
            "Add the first strategy to organize the account's execution language.",
          href: `/accounts/${accountId}/playbook`,
          label: "Open playbook",
        }
      : goalsCount === 0 && canManageAccount
        ? {
            title: "Configure account guardrails",
            description:
              "Define profit, win-rate, drawdown and frequency standards.",
            href: `/accounts/${accountId}/rules`,
            label: "Open rules",
          }
        : {
            title: "Review the account operating state",
            description:
              "Move into reports when you need a structured executive review.",
            href: canViewReports
              ? `/accounts/${accountId}/reports`
              : `/accounts/${accountId}/dashboard`,
            label: canViewReports ? "Open reports" : "Open dashboard",
          };
  const dataChannelBadge = isManualMode
    ? "Manual mode"
    : hasExternalSync
      ? "Ready"
      : "Pending";
  const wiringRows = isManualMode
    ? [
        ["Mode", "Manual input"],
        ["Data sync", "Not connected"],
        ["Last sync", "No external activity"],
      ]
    : [
        ["Mode", getDataMode(account.integrationMode)],
        [
          "Data sync",
          account.syncStatus === "active"
            ? "Active"
            : account.syncStatus === "error"
              ? "Needs attention"
              : "Not connected",
        ],
        [
          "Last sync",
          account.lastSyncedAt
            ? formatDate(account.lastSyncedAt)
            : "No external activity",
        ],
      ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:pr-[18rem] xl:pr-[20rem] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-micro uppercase tracking-hero text-muted-faint">
            Account command hub &middot; {isSharedAccount ? "Shared account" : "Solo account"}
          </p>
          <h1 className="mt-3 text-hero text-flash">Workspace</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Configure your account environment and organize the tools you use every day.
          </p>
        </div>

      </div>

      <Card variant="hero" className="reveal-rise">
        <div className="space-y-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill tone={isSharedAccount ? "info" : "neutral"}>
                  {isSharedAccount ? "Shared account" : "Solo account"}
                </StatusPill>
                <StatusPill>{getRoleLabel(membership.role)}</StatusPill>
              </div>

              <h2 className="mt-6 max-w-3xl text-section text-flash">
                {workspaceState}
              </h2>
              <p className="mt-4 max-w-3xl text-body text-muted">
                Workspace does not invent health scores. It reads account setup,
                permissions, and existing records to show the next operational
                move.
              </p>
            </div>

            <div className="w-full lg:min-w-[300px] lg:max-w-[420px] lg:justify-self-end">
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
          </div>

          <div className="border-t border-flash/[0.1] pt-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {readinessChecks.map((check, index) => (
                <div
                  key={check.label}
                  className={`rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 px-4 py-3 ${
                    index === readinessChecks.length - 1
                      ? "sm:col-span-2 xl:col-span-4"
                      : ""
                  }`}
                >
                  <p className="text-caption text-muted">{check.label}</p>
                  <p
                    className={`mt-1 text-body font-medium ${
                      check.state === "Ready" || check.state === "Manual mode"
                        ? "text-accent-bright"
                        : check.state === "Pending" || check.state === "Limited"
                          ? "text-warning"
                          : "text-muted-faint"
                    }`}
                  >
                    {check.state}
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
          label="Recorded trades"
          value={String(tradesCount)}
          detail="Trades stored in this account."
          icon={CandlestickChart}
        />
        <StatCard
          label="Account members"
          value={String(members.length)}
          detail="People listed on the account."
          icon={Users}
        />
        <StatCard
          label="Data mode"
          value={getDataMode(account.integrationMode)}
          detail="How activity enters the account."
          icon={PlugZap}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="reveal-rise xl:h-full xl:[&>div]:flex xl:[&>div]:h-full xl:[&>div]:flex-col">
          <SectionHeader eyebrow="Next move" title={nextStep.title}>
            <StatusPill tone="info">Recommended</StatusPill>
          </SectionHeader>
          <p className="mt-4 text-body text-muted">{nextStep.description}</p>
          <Link
            href={nextStep.href}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm font-medium text-muted transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/45 hover:text-accent-bright xl:mt-auto"
          >
            {nextStep.label}
            <ArrowRight size={16} />
          </Link>
        </Card>

        <Card className="reveal-rise">
          <SectionHeader eyebrow="Data channel" title="Account wiring">
            <StatusPill
              tone={
                isManualMode || hasExternalSync
                  ? "info"
                  : "neutral"
              }
            >
              {dataChannelBadge}
            </StatusPill>
          </SectionHeader>
          <div className="mt-6 space-y-3">
            {wiringRows.map(([label, value]) => (
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

      <section className="space-y-6">
        <Card>
          <SectionHeader eyebrow="Roster signal" title="Account presence">
            <StatusPill>{members.length} listed</StatusPill>
          </SectionHeader>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
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
                  className="flex flex-col gap-3 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-body font-medium text-flash">
                      {getActivityTitle(activity.type)}
                    </p>
                    {getActivityDescription(activity.type) && (
                      <p className="mt-1 text-caption leading-5 text-muted">
                        {getActivityDescription(activity.type)}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-caption text-muted-faint sm:text-right">
                    By {activity.user?.name ?? activity.user?.username ?? "Account member"}
                    {" · "}
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
                Account-protected workspace
              </p>
              <p className="mt-1 text-caption text-muted">
                Only rooms allowed by your role are available.
              </p>
            </div>
          </div>
          <StatusPill tone="info">
            Protected
          </StatusPill>
        </div>
      </Card>
    </div>
  );
}
