import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  Activity,
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
import RulesStandardsLink from "@/components/rules/RulesStandardsLink";
import { isCorrectionMode } from "@/lib/correction-mode";

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

function getCurrencySymbol(currency: string, language: AppLanguage) {
  return (
    new Intl.NumberFormat(getLocaleFromLanguage(language), {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currency
  );
}

function isConfiguredStandard(
  value: unknown,
  { min, max, integer = false }: { min: number; max: number; integer?: boolean }
) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max &&
    (!integer || Number.isInteger(value))
  );
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

function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "info" | "positive" | "warning" | "negative";
}) {
  const tones = {
    neutral: "border-flash/[0.12] bg-surface-2 text-muted",
    info: "border-accent-bright/25 bg-accent-bright/[0.08] text-accent-bright",
    positive: "border-positive/25 bg-positive/[0.08] text-positive",
    warning: "border-warning/25 bg-warning/[0.08] text-warning",
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
  prefix,
  suffix,
}: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue: number | string;
  step?: string;
  prefix?: string;
  suffix?: string;
}) {
  const inputId = `rules-${name}`;
  const unitId = `${inputId}-unit`;

  return (
    <div>
      <label htmlFor={inputId} className="text-micro uppercase tracking-label text-muted-faint">
        {label}
      </label>
      <div className="relative mt-2">
        {prefix && (
          <span id={unitId} className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-muted">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          name={name}
          type="number"
          step={step}
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-describedby={prefix || suffix ? unitId : undefined}
          className={`w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 py-3 text-sm text-white outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10 ${
            prefix ? "pl-10 pr-4" : suffix ? "pl-4 pr-10" : "px-4"
          }`}
        />
        {suffix && (
          <span id={unitId} className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default async function RulesPage({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>;
  searchParams: Promise<{ correction?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;
  const query = await searchParams;

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
  const isArchived = account.status === "ARCHIVED";
  const correctionMode = isArchived && isCorrectionMode(query.correction);
  const currency = account.currency || "USD";
  const currencySymbol = getCurrencySymbol(currency, language);

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
  const standardConfiguration = {
    profit: isConfiguredStandard(monthlyProfitGoal, {
      min: -100000000,
      max: 100000000,
    }),
    winRate: isConfiguredStandard(monthlyWinRateGoal, { min: 0, max: 100 }),
    drawdown: isConfiguredStandard(maxDrawdownLimit, { min: 0, max: 100 }),
    frequency: isConfiguredStandard(maxTradesPerDay, {
      min: 0,
      max: 1000,
      integer: true,
    }),
  };
  const configuredStandardsCount = Object.values(
    standardConfiguration
  ).filter(Boolean).length;
  const configuredMonthlyProfitGoal = standardConfiguration.profit
    ? (monthlyProfitGoal as number)
    : null;
  const configuredMonthlyWinRateGoal = standardConfiguration.winRate
    ? (monthlyWinRateGoal as number)
    : null;
  const configuredMaxDrawdownLimit = standardConfiguration.drawdown
    ? (maxDrawdownLimit as number)
    : null;
  const configuredMaxTradesPerDay = standardConfiguration.frequency
    ? (maxTradesPerDay as number)
    : null;
  const hasAnyStandard = configuredStandardsCount > 0;

  const profitProgress =
    configuredMonthlyProfitGoal !== null && configuredMonthlyProfitGoal !== 0
      ? (totalPnl / configuredMonthlyProfitGoal) * 100
      : null;
  const winRateProgress =
    configuredMonthlyWinRateGoal !== null && configuredMonthlyWinRateGoal !== 0 && winRate !== null
      ? (winRate / configuredMonthlyWinRateGoal) * 100
      : null;
  const drawdownUsage =
    configuredMaxDrawdownLimit !== null && configuredMaxDrawdownLimit !== 0 && maxDrawdown !== null
      ? (maxDrawdown / configuredMaxDrawdownLimit) * 100
      : null;
  const tradeLimitUsage =
    configuredMaxTradesPerDay !== null && configuredMaxTradesPerDay !== 0 && busiestDayTrades !== null
      ? (busiestDayTrades / configuredMaxTradesPerDay) * 100
      : null;

  const profitState = !standardConfiguration.profit
    ? { label: "No standard", tone: "neutral" as const }
    : totalPnl >= configuredMonthlyProfitGoal!
      ? { label: "Target reached", tone: "positive" as const }
      : { label: "Below target", tone: "warning" as const };
  const winRateState = winRate === null
    ? { label: "Not measured", tone: "neutral" as const }
    : !standardConfiguration.winRate
      ? { label: "No standard", tone: "neutral" as const }
      : winRate >= configuredMonthlyWinRateGoal!
        ? { label: "Standard met", tone: "positive" as const }
        : { label: "Below standard", tone: "negative" as const };
  const drawdownState = maxDrawdown === null
    ? { label: "Not measured", tone: "neutral" as const }
    : !standardConfiguration.drawdown
      ? { label: "No boundary", tone: "neutral" as const }
      : maxDrawdown >= configuredMaxDrawdownLimit!
        ? { label: "Breached", tone: "negative" as const }
        : { label: "Within limit", tone: "positive" as const };
  const frequencyState = busiestDayTrades === null
    ? { label: "Not measured", tone: "neutral" as const }
    : !standardConfiguration.frequency
      ? { label: "No cap", tone: "neutral" as const }
      : busiestDayTrades > configuredMaxTradesPerDay!
        ? { label: "Breached", tone: "negative" as const }
        : busiestDayTrades === configuredMaxTradesPerDay
          ? { label: "Cap reached", tone: "warning" as const }
          : { label: "Within cap", tone: "positive" as const };
  const controlAssessment =
    configuredStandardsCount === 0
      ? { label: "Unassessed", tone: "neutral" as const }
      : configuredStandardsCount < 4
        ? { label: "Partially assessed", tone: "warning" as const }
        : { label: "Measured", tone: "info" as const };

  const standards: Standard[] = [
    {
      key: "profit",
      label: "Monthly profit standard",
      value:
        standardConfiguration.profit
          ? formatCurrencyByLanguage(configuredMonthlyProfitGoal!, currency, language)
          : "Not set",
      detail: "Defines what counts as enough for the month.",
      icon: TrendingUp,
      configured: standardConfiguration.profit,
    },
    {
      key: "win-rate",
      label: "Win-rate standard",
      value:
        standardConfiguration.winRate
          ? formatPercent(configuredMonthlyWinRateGoal!, language)
          : "Not set",
      detail: "Sets the minimum quality bar for closed trades.",
      icon: Target,
      configured: standardConfiguration.winRate,
    },
    {
      key: "drawdown",
      label: "Drawdown boundary",
      value:
        standardConfiguration.drawdown
          ? formatPercent(configuredMaxDrawdownLimit!, language)
          : "Not set",
      detail: "Marks when protection overrides activity.",
      icon: ShieldCheck,
      configured: standardConfiguration.drawdown,
    },
    {
      key: "frequency",
      label: "Daily frequency cap",
      value:
        standardConfiguration.frequency ? String(configuredMaxTradesPerDay) : "Not set",
      detail: "Limits the most common path into overtrading.",
      icon: Activity,
      configured: standardConfiguration.frequency,
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
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Build your trading playbook and measure how consistently you follow it.
          </p>
        </div>

      </div>

      <Card variant="hero" className="reveal-rise">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone="info">{account.name}</StatusPill>
              <StatusPill>{monthLabel}</StatusPill>
              <StatusPill tone={hasAnyStandard ? "info" : "neutral"}>
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
            {(!isArchived || correctionMode) && configuredStandardsCount > 0 && configuredStandardsCount < 4 && (
              <RulesStandardsLink className="mt-5 inline-flex min-h-11 items-center justify-center rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-4 py-2.5 text-sm font-semibold text-accent-bright transition-colors duration-fast hover:bg-accent-bright/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/50" />
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-micro uppercase tracking-label text-muted-faint">
                  Standards configured
                </p>
                <p className="text-body font-medium text-flash">
                  {configuredStandardsCount}/4
                </p>
              </div>
              <ProgressBar value={(configuredStandardsCount / 4) * 100} />
            </div>

            <div>
              <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
                <p className="text-micro uppercase tracking-label text-muted-faint">
                  Current month sample
                </p>
                <p className="mt-2 text-body text-flash">
                  {trades.length} {trades.length === 1 ? "trade" : "trades"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {configuredStandardsCount === 0 ? (
        <Card className="p-6">
          <p className="text-micro uppercase tracking-label text-accent-bright">
            Operating standards
          </p>
          <h2 className="mt-3 text-section text-flash">No standards configured</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Set a monthly profit target, win-rate goal, drawdown boundary and daily trade cap.
          </p>
          {!isArchived && <RulesStandardsLink className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-4 py-2.5 text-sm font-semibold text-accent-bright transition-colors duration-fast hover:bg-accent-bright/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/50 sm:w-auto" />}
        </Card>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {standards.map((standard) => (
            <StandardCard key={standard.key} standard={standard} />
          ))}
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        {(!isArchived || correctionMode) && <Card id="set-the-rulebook" className="scroll-mt-6">
          <SectionHeader eyebrow="Execution standards" title="Set the rulebook">
            <StatusPill tone="info">Current month</StatusPill>
          </SectionHeader>

          <form
            action={saveTradingGoals.bind(null, accountId)}
            className="mt-6 space-y-4"
          >
            {correctionMode && <input type="hidden" name="correctionMode" value="1" />}
            <FormField
              name="monthlyProfitGoal"
              label="Monthly profit"
              placeholder="Example: 2500"
              defaultValue={monthlyProfitGoal ?? ""}
              step="0.01"
              prefix={currencySymbol}
            />
            <FormField
              name="monthlyWinRateGoal"
              label="Win-rate goal"
              placeholder="Example: 55"
              defaultValue={monthlyWinRateGoal ?? ""}
              step="0.01"
              suffix="%"
            />
            <FormField
              name="maxDrawdownLimit"
              label="Max drawdown"
              placeholder="Example: 5"
              defaultValue={maxDrawdownLimit ?? ""}
              step="0.01"
              suffix="%"
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
        </Card>}

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
          <StatusPill tone={controlAssessment.tone}>
            {controlAssessment.label}
          </StatusPill>
        </SectionHeader>

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
                  {standardConfiguration.profit
                    ? `Configured standard: ${formatCurrencyByLanguage(configuredMonthlyProfitGoal!, currency, language)}.`
                    : "No monthly profit standard is configured."}
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
                    Based on {closedTrades.length} closed{" "}
                    {closedTrades.length === 1 ? "trade" : "trades"}.
                  </p>
                </>
              ) : (
                <p className="mt-4 text-caption text-muted">
                  {winRate === null
                    ? "No closed trades are available to measure win rate."
                    : standardConfiguration.winRate
                      ? `Configured standard: ${formatPercent(configuredMonthlyWinRateGoal!, language)}.`
                      : "No win-rate standard is configured."}
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
                      drawdownState.tone === "negative"
                        ? "text-negative"
                        : "text-flash"
                    }`}
                  >
                    {maxDrawdown !== null
                      ? formatPercent(maxDrawdown, language)
                      : "Not measured"}
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
                    tone={drawdownUsage >= 100 ? "negative" : "info"}
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
                  {standardConfiguration.drawdown
                    ? `Configured boundary: ${formatPercent(configuredMaxDrawdownLimit!, language)}.`
                    : "No drawdown boundary is configured."}
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
                      frequencyState.tone === "negative"
                        ? "text-negative"
                        : frequencyState.tone === "warning"
                          ? "text-warning"
                          : "text-flash"
                    }`}
                  >
                    {busiestDayTrades !== null
                      ? String(busiestDayTrades)
                      : "Not measured"}
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
                    tone={
                      tradeLimitUsage > 100
                        ? "negative"
                        : tradeLimitUsage === 100
                          ? "warning"
                          : "info"
                    }
                  />
                  <p className="mt-3 text-caption text-muted">
                    Busiest day: {busiestDayTrades ?? 0}{" "}
                    {busiestDayTrades === 1 ? "trade" : "trades"}.
                  </p>
                </>
              ) : (
                <p className="mt-4 text-caption text-muted">
                  {standardConfiguration.frequency
                    ? `Configured cap: ${configuredMaxTradesPerDay} trades per day.`
                    : "No daily trade frequency cap is configured."}
                </p>
              )}
            </Card>
        </div>
      </section>

      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
              <LockKeyhole size={18} />
            </div>
            <div>
              <p className="text-body font-medium text-flash">
                Account-protected standards
              </p>
              <p className="mt-1 text-caption text-muted">
                Only authorized members can update the operating rules.
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
