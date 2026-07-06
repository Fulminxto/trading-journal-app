import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  Activity,
  CheckCircle2,
  LockKeyhole,
  Save,
  ShieldCheck,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  canManageRules,
  getAccountMembershipWithAccount,
} from "@/lib/permissions";
import {
  formatCurrencyByLanguage,
  getLocaleFromLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { saveTradingGoals } from "./actions";

type Standard = {
  key: string;
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  configured: boolean;
};

type RulebookItem = {
  title: string;
  description: string;
};

const rulebook: RulebookItem[] = [
  {
    title: "No revenge trades",
    description:
      "A loss does not authorize a recovery trade. New risk needs a valid setup.",
  },
  {
    title: "Setup before execution",
    description:
      "Every position needs a reason that would still make sense after the session ends.",
  },
  {
    title: "Respect the drawdown boundary",
    description:
      "Capital protection overrides pace, opportunity, and the urge to force activity.",
  },
  {
    title: "Frequency is a control",
    description:
      "The busiest day matters because overtrading usually starts before the PnL shows it.",
  },
  {
    title: "Process before profit",
    description:
      "Goals are execution standards. They should guide behavior, not invite chasing.",
  },
];

function formatPercent(
  value: number,
  language: AppLanguage,
  digits = 0
) {
  return (
    new Intl.NumberFormat(getLocaleFromLanguage(language), {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value) + "%"
  );
}

function formatMonthLabel(date: Date, language: AppLanguage) {
  return new Intl.DateTimeFormat(getLocaleFromLanguage(language), {
    month: "long",
    year: "numeric",
  }).format(date);
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), 100);
}

function getMetricTone(value: number) {
  if (value > 0) return "text-positive";
  if (value < 0) return "text-negative";
  return "text-muted";
}

function getStandardState({
  configured,
  breached,
  met,
}: {
  configured: boolean;
  breached?: boolean;
  met?: boolean;
}) {
  if (!configured) {
    return { label: "Not set", tone: "neutral" as const };
  }

  if (breached) {
    return { label: "Breached", tone: "warning" as const };
  }

  if (met) {
    return { label: "Met", tone: "positive" as const };
  }

  return { label: "Active", tone: "info" as const };
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

function ProgressBar({
  value,
  tone = "info",
}: {
  value: number;
  tone?: "info" | "positive" | "warning" | "negative";
}) {
  const tones = {
    info: "bg-accent-bright",
    positive: "bg-positive",
    warning: "bg-warning",
    negative: "bg-negative",
  };

  return (
    <div className="mt-4 h-2 overflow-hidden rounded-pill bg-surface-1">
      <div
        className={`h-full rounded-pill transition-all duration-base ${tones[tone]}`}
        style={{ width: `${clampPercent(value)}%` }}
      />
    </div>
  );
}

function StandardCard({ standard }: { standard: Standard }) {
  const Icon = standard.icon;

  return (
    <Card className="reveal-rise p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-micro uppercase tracking-label text-muted-faint">
            {standard.label}
          </p>
          <p className="mt-3 text-metric tabular-nums text-flash">
            {standard.value}
          </p>
          <p className="mt-2 text-caption text-muted">{standard.detail}</p>
        </div>
        <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4">
        <StatusPill tone={standard.configured ? "info" : "neutral"}>
          {standard.configured ? "Configured" : "Not set"}
        </StatusPill>
      </div>
    </Card>
  );
}

function FormField({
  name,
  label,
  placeholder,
  defaultValue,
  step,
}: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue: number | string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-micro uppercase tracking-label text-muted-faint">
        {label}
      </span>
      <input
        name={name}
        type="number"
        step={step}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-white outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10"
      />
    </label>
  );
}

export default async function RulesPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

  const membership = await getAccountMembershipWithAccount(
    session.user.id,
    accountId
  );

  if (!membership) {
    redirect("/accounts");
  }

  if (!canManageRules(membership)) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (membership.tradingAccount.status === "ARCHIVED") {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  const currentUser = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      lastSeenAt: new Date(),
      lastActivityAt: new Date(),
    },
    select: {
      appLanguage: true,
    },
  });

  const language = normalizeAppLanguage(currentUser.appLanguage);
  const account = membership.tradingAccount;
  const currency = account.currency || "USD";

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);
  const monthLabel = formatMonthLabel(now, language);

  const [goal, trades] = await Promise.all([
    prisma.tradingGoal.findUnique({
      where: {
        tradingAccountId_month_year: {
          tradingAccountId: accountId,
          month,
          year,
        },
      },
    }),
    prisma.trade.findMany({
      where: {
        tradingAccountId: accountId,
        openDate: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
      orderBy: [
        {
          openDate: "asc",
        },
        {
          id: "asc",
        },
      ],
      select: {
        id: true,
        openDate: true,
        outcome: true,
        resultUsd: true,
        drawdownPercent: true,
      },
    }),
  ]);

  const totalPnl = trades.reduce(
    (sum, trade) => sum + (trade.resultUsd || 0),
    0
  );
  const closedTrades = trades.filter(
    (trade) =>
      trade.outcome === "win" ||
      trade.outcome === "loss" ||
      trade.outcome === "be"
  );
  const wins = closedTrades.filter((trade) => trade.outcome === "win").length;
  const winRate =
    closedTrades.length > 0 ? (wins / closedTrades.length) * 100 : null;
  const maxDrawdown =
    trades.length > 0
      ? Math.abs(
          Math.min(...trades.map((trade) => trade.drawdownPercent || 0))
        )
      : null;

  const tradesByDay = new Map<string, number>();

  for (const trade of trades) {
    const key = trade.openDate.toDateString();
    tradesByDay.set(key, (tradesByDay.get(key) || 0) + 1);
  }

  const busiestDayTrades =
    tradesByDay.size > 0 ? Math.max(...tradesByDay.values()) : null;

  const monthlyProfitGoal = goal?.monthlyProfitGoal ?? null;
  const monthlyWinRateGoal = goal?.monthlyWinRateGoal ?? null;
  const maxDrawdownLimit = goal?.maxDrawdownLimit ?? null;
  const maxTradesPerDay = goal?.maxTradesPerDay ?? null;
  const configuredStandards = [
    monthlyProfitGoal,
    monthlyWinRateGoal,
    maxDrawdownLimit,
    maxTradesPerDay,
  ].filter((value) => value !== null).length;
  const hasTrades = trades.length > 0;
  const hasAnyStandard = configuredStandards > 0;

  const profitProgress =
    monthlyProfitGoal && monthlyProfitGoal !== 0
      ? (totalPnl / monthlyProfitGoal) * 100
      : null;
  const winRateProgress =
    monthlyWinRateGoal && winRate !== null
      ? (winRate / monthlyWinRateGoal) * 100
      : null;
  const drawdownUsage =
    maxDrawdownLimit && maxDrawdown !== null
      ? (maxDrawdown / maxDrawdownLimit) * 100
      : null;
  const tradeLimitUsage =
    maxTradesPerDay && busiestDayTrades !== null
      ? (busiestDayTrades / maxTradesPerDay) * 100
      : null;

  const profitState = getStandardState({
    configured: monthlyProfitGoal !== null,
    met: monthlyProfitGoal !== null && totalPnl >= monthlyProfitGoal,
  });
  const winRateState = getStandardState({
    configured: monthlyWinRateGoal !== null,
    met:
      monthlyWinRateGoal !== null &&
      winRate !== null &&
      winRate >= monthlyWinRateGoal,
  });
  const drawdownState = getStandardState({
    configured: maxDrawdownLimit !== null,
    breached:
      maxDrawdownLimit !== null &&
      maxDrawdown !== null &&
      maxDrawdown > maxDrawdownLimit,
  });
  const frequencyState = getStandardState({
    configured: maxTradesPerDay !== null,
    breached:
      maxTradesPerDay !== null &&
      busiestDayTrades !== null &&
      busiestDayTrades > maxTradesPerDay,
  });

  const standards: Standard[] = [
    {
      key: "profit",
      label: "Monthly profit standard",
      value:
        monthlyProfitGoal !== null
          ? formatCurrencyByLanguage(monthlyProfitGoal, currency, language)
          : "Not set",
      detail: "Defines what counts as enough for the month.",
      icon: TrendingUp,
      configured: monthlyProfitGoal !== null,
    },
    {
      key: "win-rate",
      label: "Win-rate standard",
      value:
        monthlyWinRateGoal !== null
          ? formatPercent(monthlyWinRateGoal, language)
          : "Not set",
      detail: "Sets the minimum quality bar for closed trades.",
      icon: Target,
      configured: monthlyWinRateGoal !== null,
    },
    {
      key: "drawdown",
      label: "Drawdown boundary",
      value:
        maxDrawdownLimit !== null
          ? formatPercent(maxDrawdownLimit, language)
          : "Not set",
      detail: "Marks when protection overrides activity.",
      icon: ShieldCheck,
      configured: maxDrawdownLimit !== null,
    },
    {
      key: "frequency",
      label: "Daily frequency cap",
      value:
        maxTradesPerDay !== null ? String(maxTradesPerDay) : "Not set",
      detail: "Limits the most common path into overtrading.",
      icon: Activity,
      configured: maxTradesPerDay !== null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:pr-[18rem] xl:pr-[20rem] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-micro uppercase tracking-hero text-muted-faint">
            Discipline control
          </p>
          <h1 className="mt-3 text-hero text-flash">Rules & Goals</h1>
          <div className="mt-4 max-w-3xl">
            <SignatureEdge orientation="horizontal" className="mb-4 max-w-40" />
            <p className="text-body text-muted">
              The account rulebook. Standards are written before execution so
              profit, drawdown, and frequency do not become emotional decisions.
            </p>
          </div>
        </div>

      </div>

      <Card variant="hero" className="reveal-rise">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone="info">{account.name}</StatusPill>
              <StatusPill>{monthLabel}</StatusPill>
              <StatusPill tone={hasAnyStandard ? "info" : "warning"}>
                {hasAnyStandard ? "Rulebook active" : "Standards missing"}
              </StatusPill>
            </div>

            <h2 className="mt-6 max-w-3xl text-section text-flash">
              Discipline is the primary control surface.
            </h2>
            <p className="mt-4 max-w-3xl text-body text-muted">
              This page does not duplicate analytics. It defines the operating
              contract and shows only whether the current month is respecting
              that contract.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-micro uppercase tracking-label text-muted-faint">
                  Standards configured
                </p>
                <p className="text-body font-medium text-flash">
                  {configuredStandards}/4
                </p>
              </div>
              <ProgressBar value={(configuredStandards / 4) * 100} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
                <p className="text-micro uppercase tracking-label text-muted-faint">
                  Month sample
                </p>
                <p className="mt-2 text-body text-flash">
                  {hasTrades ? `${trades.length} trades` : "No trades yet"}
                </p>
              </div>
              <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
                <p className="text-micro uppercase tracking-label text-muted-faint">
                  Permission
                </p>
                <p className="mt-2 text-body text-flash">Server gated</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {standards.map((standard) => (
          <StandardCard key={standard.key} standard={standard} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <SectionHeader eyebrow="Execution standards" title="Set the rulebook">
            <StatusPill tone="info">Current month</StatusPill>
          </SectionHeader>

          <form
            action={saveTradingGoals.bind(null, accountId)}
            className="mt-6 space-y-4"
          >
            <FormField
              name="monthlyProfitGoal"
              label="Monthly profit"
              placeholder="Example: 2500"
              defaultValue={monthlyProfitGoal ?? ""}
              step="0.01"
            />
            <FormField
              name="monthlyWinRateGoal"
              label="Win-rate goal"
              placeholder="Example: 55"
              defaultValue={monthlyWinRateGoal ?? ""}
              step="0.01"
            />
            <FormField
              name="maxDrawdownLimit"
              label="Max drawdown"
              placeholder="Example: 5"
              defaultValue={maxDrawdownLimit ?? ""}
              step="0.01"
            />
            <FormField
              name="maxTradesPerDay"
              label="Max trades per day"
              placeholder="Example: 4"
              defaultValue={maxTradesPerDay ?? ""}
            />

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-5 py-3 text-sm font-semibold text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55"
            >
              <Save size={17} />
              Save standards
            </button>
          </form>
        </Card>

        <Card>
          <SectionHeader eyebrow="Operating charter" title="Discipline rules">
            <StatusPill>{rulebook.length} rules</StatusPill>
          </SectionHeader>

          <div className="mt-6 space-y-3">
            {rulebook.map((rule, index) => (
              <div
                key={rule.title}
                className="flex gap-4 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-1 text-caption font-semibold text-accent-bright">
                  {index + 1}
                </div>
                <div>
                  <p className="text-body font-medium text-flash">{rule.title}</p>
                  <p className="mt-2 text-caption leading-5 text-muted">
                    {rule.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="space-y-5">
        <SectionHeader eyebrow="Monthly enforcement" title="Current control signals">
          <StatusPill tone={hasTrades ? "info" : "neutral"}>
            {hasTrades ? "Measured" : "Waiting for trades"}
          </StatusPill>
        </SectionHeader>

        {!hasTrades ? (
          <EmptyState
            title="No current-month trades"
            description="Control signals will remain limited until real trades exist for this month."
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-4">
            <Card className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-micro uppercase tracking-label text-muted-faint">
                    Monthly PnL
                  </p>
                  <p className={`mt-3 text-metric ${getMetricTone(totalPnl)}`}>
                    {formatCurrencyByLanguage(totalPnl, currency, language)}
                  </p>
                </div>
                <StatusPill tone={profitState.tone}>{profitState.label}</StatusPill>
              </div>
              {profitProgress !== null ? (
                <>
                  <ProgressBar
                    value={profitProgress}
                    tone={profitProgress >= 100 ? "positive" : "info"}
                  />
                  <p className="mt-3 text-caption text-muted">
                    {formatPercent(profitProgress, language)} of the configured
                    monthly profit standard.
                  </p>
                </>
              ) : (
                <p className="mt-4 text-caption text-muted">
                  No monthly profit standard is configured.
                </p>
              )}
            </Card>

            <Card className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-micro uppercase tracking-label text-muted-faint">
                    Win rate
                  </p>
                  <p className="mt-3 text-metric text-flash">
                    {winRate !== null
                      ? formatPercent(winRate, language)
                      : "Not measured"}
                  </p>
                </div>
                <StatusPill tone={winRateState.tone}>
                  {winRateState.label}
                </StatusPill>
              </div>
              {winRateProgress !== null ? (
                <>
                  <ProgressBar
                    value={winRateProgress}
                    tone={winRateProgress >= 100 ? "positive" : "info"}
                  />
                  <p className="mt-3 text-caption text-muted">
                    Based on {closedTrades.length} closed trades.
                  </p>
                </>
              ) : (
                <p className="mt-4 text-caption text-muted">
                  Add closed trades and a win-rate standard to measure this.
                </p>
              )}
            </Card>

            <Card className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-micro uppercase tracking-label text-muted-faint">
                    Drawdown usage
                  </p>
                  <p
                    className={`mt-3 text-metric ${
                      drawdownState.tone === "warning"
                        ? "text-warning"
                        : "text-flash"
                    }`}
                  >
                    {drawdownUsage !== null
                      ? formatPercent(drawdownUsage, language)
                      : "Not set"}
                  </p>
                </div>
                <StatusPill tone={drawdownState.tone}>
                  {drawdownState.label}
                </StatusPill>
              </div>
              {drawdownUsage !== null ? (
                <>
                  <ProgressBar
                    value={drawdownUsage}
                    tone={drawdownUsage > 100 ? "warning" : "info"}
                  />
                  <p className="mt-3 text-caption text-muted">
                    Current max drawdown:{" "}
                    {maxDrawdown !== null
                      ? formatPercent(maxDrawdown, language)
                      : "not measured"}
                    .
                  </p>
                </>
              ) : (
                <p className="mt-4 text-caption text-muted">
                  No drawdown boundary is configured.
                </p>
              )}
            </Card>

            <Card className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-micro uppercase tracking-label text-muted-faint">
                    Frequency usage
                  </p>
                  <p
                    className={`mt-3 text-metric ${
                      frequencyState.tone === "warning"
                        ? "text-warning"
                        : "text-flash"
                    }`}
                  >
                    {tradeLimitUsage !== null
                      ? formatPercent(tradeLimitUsage, language)
                      : "Not set"}
                  </p>
                </div>
                <StatusPill tone={frequencyState.tone}>
                  {frequencyState.label}
                </StatusPill>
              </div>
              {tradeLimitUsage !== null ? (
                <>
                  <ProgressBar
                    value={tradeLimitUsage}
                    tone={tradeLimitUsage > 100 ? "warning" : "info"}
                  />
                  <p className="mt-3 text-caption text-muted">
                    Busiest day: {busiestDayTrades ?? 0} trades.
                  </p>
                </>
              ) : (
                <p className="mt-4 text-caption text-muted">
                  No daily trade frequency cap is configured.
                </p>
              )}
            </Card>
          </div>
        )}
      </section>

      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
              <LockKeyhole size={18} />
            </div>
            <div>
              <p className="text-body font-medium text-flash">
                Rules are protected by account permissions.
              </p>
              <p className="mt-1 text-caption text-muted">
                This page uses the existing server-side manager/account-control
                gate, and the save action validates the same permissions again.
              </p>
            </div>
          </div>
          <StatusPill tone="info">
            <CheckCircle2 size={13} className="mr-2" />
            Server enforced
          </StatusPill>
        </div>
      </Card>
    </div>
  );
}
