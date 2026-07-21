import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  Library,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import { auth } from "@/lib/auth";
import {
  formatCurrencyByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { CreateStrategyForm, StrategyEditor } from "./strategy-form";
import { isCorrectionMode } from "@/lib/correction-mode";

type StrategyStats = {
  count: number;
  wins: number;
  totalPnl: number;
};

type Tone = "neutral" | "info" | "positive" | "negative";

const coldSwatches = [
  "#5BE0FF",
  "#34A8FF",
  "#2E62E6",
  "#9FB4DD",
  "#7D8DB5",
];

function getStrategyColor(color: string | null, index: number) {
  if (color && coldSwatches.includes(color.toUpperCase())) {
    return color;
  }

  return coldSwatches[index % coldSwatches.length];
}

function formatPercent(value: number | null) {
  if (value === null) return "Not measured";
  return `${value}%`;
}

function valueTone(value: number) {
  if (value > 0) return "text-positive";
  if (value < 0) return "text-negative";
  return "text-muted";
}

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
    positive: "border-positive/25 bg-positive/[0.08] text-positive",
    negative: "border-negative/25 bg-negative/[0.08] text-negative",
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
  valueClassName = "text-flash",
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  valueClassName?: string;
}) {
  return (
    <Card className="reveal-rise p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-micro uppercase tracking-label text-muted-faint">
            {label}
          </p>
          <p className={`mt-3 text-metric tabular-nums ${valueClassName}`}>
            {value}
          </p>
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
    <div className="rounded-inner border-[0.5px] border-dashed border-flash/[0.12] bg-surface-2 p-6">
      <p className="text-body font-medium text-flash">{title}</p>
      <p className="mt-2 text-caption leading-5 text-muted">{description}</p>
    </div>
  );
}

function CreateStrategyPanel({
  accountId,
  defaultColor,
  correctionMode,
}: {
  accountId: string;
  defaultColor: string;
  correctionMode: boolean;
}) {
  return (
    <Card>
      <SectionHeader eyebrow="Setup" title="Add a strategy">
        <StatusPill tone="info">Editable</StatusPill>
      </SectionHeader>
      <CreateStrategyForm accountId={accountId} defaultColor={defaultColor} correctionMode={correctionMode} />
    </Card>
  );
}

function StrategyRow({
  accountId,
  strategy,
  stats,
  color,
  currency,
  language,
  canManageStrategies,
  correctionMode,
}: {
  accountId: string;
  strategy: {
    id: string;
    name: string;
    description: string | null;
    color: string | null;
    updatedAt: Date;
  };
  stats: StrategyStats;
  color: string;
  currency: string;
  language: AppLanguage;
  canManageStrategies: boolean;
  correctionMode: boolean;
}) {
  const winRate =
    stats.count > 0 ? Math.round((stats.wins / stats.count) * 100) : null;

  return (
    <Card className="p-5">
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr] xl:items-start">
        <div className="min-w-0">
          <div className="flex min-w-0 items-start gap-4">
            <span
              aria-hidden="true"
              className="mt-1 h-3 w-3 shrink-0 rounded-pill border-[0.5px] border-flash/[0.18]"
              style={{ backgroundColor: color }}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-subsection text-flash">{strategy.name}</h3>
                <StatusPill tone={stats.count > 0 ? "info" : "neutral"}>
                  {stats.count > 0 ? "Evidence linked" : "Awaiting evidence"}
                </StatusPill>
              </div>
              <p className="mt-2 max-w-3xl text-caption leading-5 text-muted">
                {strategy.description ||
                  "No execution doctrine documented yet."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
          <div>
            <p className="text-micro uppercase tracking-label text-muted-faint">
              Linked trades
            </p>
            <p className="mt-2 text-body font-semibold tabular-nums text-flash">
              {stats.count}
            </p>
          </div>
          <div>
            <p className="text-micro uppercase tracking-label text-muted-faint">
              Win rate
            </p>
            <p className="mt-2 text-body font-semibold tabular-nums text-muted">
              {formatPercent(winRate)}
            </p>
          </div>
          <div>
            <p className="text-micro uppercase tracking-label text-muted-faint">
              Measured PnL
            </p>
            <p
              className={`mt-2 text-body font-semibold tabular-nums ${
                stats.count > 0 ? valueTone(stats.totalPnl) : "text-muted"
              }`}
            >
              {stats.count > 0
                ? formatCurrencyByLanguage(stats.totalPnl, currency, language)
                : "Not measured"}
            </p>
          </div>
        </div>
      </div>

      {canManageStrategies && (
        <StrategyEditor
          accountId={accountId}
          strategyId={strategy.id}
          strategyName={strategy.name}
          description={strategy.description}
          color={color}
          correctionMode={correctionMode}
        />
      )}
    </Card>
  );
}

export default async function PlaybookPage({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>;
  searchParams: Promise<{ correction?: string }>;
}) {
  const { accountId } = await params;
  const query = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const membership = await prisma.accountMember.findFirst({
    where: {
      userId: session.user.id,
      tradingAccountId: accountId,
    },
    include: {
      user: {
        select: {
          appLanguage: true,
        },
      },
      tradingAccount: {
        select: {
          type: true,
          currency: true,
          status: true,
        },
      },
    },
  });

  if (!membership) {
    redirect("/accounts");
  }

  const account = membership.tradingAccount;
  const language = normalizeAppLanguage(membership.user.appLanguage);
  const currency = account.currency ?? "USD";
  const correctionMode = account.status === "ARCHIVED" &&
    isCorrectionMode(query.correction) &&
    (membership.role === "MANAGER" || membership.canManageAccount);
  const canManageStrategies =
    (account.status !== "ARCHIVED" || correctionMode) &&
    membership.canCreateTrades;

  const [strategies, linkedTrades, totalTrades] = await Promise.all([
    prisma.strategy.findMany({
      where: {
        tradingAccountId: accountId,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.trade.findMany({
      where: {
        tradingAccountId: accountId,
        strategyId: {
          not: null,
        },
      },
      select: {
        strategyId: true,
        outcome: true,
        resultUsd: true,
      },
    }),
    prisma.trade.count({
      where: {
        tradingAccountId: accountId,
      },
    }),
  ]);

  const statsMap: Record<string, StrategyStats> = {};
  for (const trade of linkedTrades) {
    if (!trade.strategyId) continue;

    const stats = statsMap[trade.strategyId] ?? {
      count: 0,
      wins: 0,
      totalPnl: 0,
    };
    stats.count += 1;
    if (trade.outcome === "win") stats.wins += 1;
    stats.totalPnl += trade.resultUsd ?? 0;
    statsMap[trade.strategyId] = stats;
  }

  const strategyCoverage =
    totalTrades > 0 ? Math.round((linkedTrades.length / totalTrades) * 100) : null;
  const totalStrategyPnl = Object.values(statsMap).reduce(
    (sum, stats) => sum + stats.totalPnl,
    0
  );
  const hasStrategies = strategies.length > 0;

  return (
    <div className="space-y-6">
      <div className="lg:pr-[18rem] xl:pr-[20rem]">
        <div>
          <p className="text-micro uppercase tracking-hero text-muted-faint">
            Strategy library / execution doctrine
          </p>
          <h1 className="mt-3 text-hero text-flash">Playbook</h1>
          <p className="mt-4 max-w-3xl text-body text-muted">
            Define the setups this account is allowed to trade. Performance
            appears only when trades are linked to a strategy.
          </p>
        </div>
      </div>

      <Card variant="hero" className="reveal-rise">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone="info">
                {account.type === "SHARED"
                  ? "Shared account"
                  : `${account.type.toLowerCase()} account`}
              </StatusPill>
              <StatusPill tone={hasStrategies ? "info" : "neutral"}>
                {hasStrategies ? "Strategy library active" : "No strategies yet"}
              </StatusPill>
            </div>

            <h2 className="mt-6 max-w-3xl text-section text-flash">
              A strategy is a rulebook before it is a result.
            </h2>
            <p className="mt-4 max-w-3xl text-body text-muted">
              Use Playbook to keep setups explicit: context, trigger,
              invalidation, review standard. VOLTIS does not name a best
              strategy unless the underlying trade data supports the comparison.
            </p>
          </div>

          <div className="border-l-[0.5px] border-flash/[0.1] pl-5">
            <p className="text-micro uppercase tracking-label text-muted-faint">
              Your access
            </p>
            <p className="mt-3 text-subsection text-flash">
              {canManageStrategies ? "Editable" : "View only"}
            </p>
            <p className="mt-2 text-caption leading-5 text-muted">
              {canManageStrategies
                ? "Create, update, and delete account strategies."
                : "Browse documented strategies and their linked evidence."}
            </p>
          </div>
        </div>
        <div className="mt-7 border-t-[0.5px] border-flash/[0.08] pt-5">
          <p className="text-micro uppercase tracking-label text-muted-faint">
            Library standard
          </p>
          <p className="mt-2 text-body text-flash">
            Document first. Evaluate only after linked trades provide evidence.
          </p>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Strategies"
          value={String(strategies.length)}
          detail="Entries documented in the library."
          icon={Library}
        />
        <StatCard
          label="Linked trades"
          value={String(linkedTrades.length)}
          detail="Trades with an assigned playbook strategy."
          icon={ClipboardCheck}
        />
        <StatCard
          label="Coverage"
          value={strategyCoverage === null ? "Not measured" : `${strategyCoverage}%`}
          detail="Share of recorded trades linked to a strategy."
          icon={Target}
        />
        <StatCard
          label="Measured PnL"
          value={
            linkedTrades.length > 0
              ? formatCurrencyByLanguage(totalStrategyPnl, currency, language)
              : "Not measured"
          }
          detail="Only counted from strategy-linked trades."
          icon={TrendingUp}
          valueClassName={
            linkedTrades.length > 0 ? valueTone(totalStrategyPnl) : "text-muted"
          }
        />
      </section>

      <section className="space-y-6">
        {canManageStrategies && (
          <CreateStrategyPanel
            accountId={accountId}
            defaultColor={coldSwatches[strategies.length % coldSwatches.length]}
            correctionMode={correctionMode}
          />
        )}

        <Card>
          <SectionHeader eyebrow="Library" title="Strategy library">
            <StatusPill>
              {strategies.length} {strategies.length === 1 ? "strategy" : "strategies"}
            </StatusPill>
          </SectionHeader>

          <div className="mt-6 space-y-4">
            {strategies.length > 0 ? (
              strategies.map((strategy, index) => (
                <StrategyRow
                  key={strategy.id}
                  accountId={accountId}
                  strategy={strategy}
                  stats={
                    statsMap[strategy.id] ?? {
                      count: 0,
                      wins: 0,
                      totalPnl: 0,
                    }
                  }
                  color={getStrategyColor(strategy.color, index)}
                  currency={currency}
                  language={language}
                  canManageStrategies={canManageStrategies}
                  correctionMode={correctionMode}
                />
              ))
            ) : (
              <EmptyState
                title="No strategies documented yet"
                description="Document the first strategy before comparing execution results. Performance becomes measurable only after trades are linked."
              />
            )}
          </div>
        </Card>
      </section>

      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
              <BookOpen size={18} />
            </div>
            <div>
              <p className="text-body font-medium text-flash">
                Account-protected playbook
              </p>
              <p className="mt-1 text-caption leading-5 text-muted">
                Only authorized members can create, update, or remove account
                strategies.
              </p>
            </div>
          </div>
          <StatusPill tone="info">Protected</StatusPill>
        </div>
      </Card>
    </div>
  );
}
