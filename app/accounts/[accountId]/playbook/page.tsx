import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ClipboardCheck,
  Library,
  PenLine,
  Plus,
  Save,
  ShieldCheck,
  Target,
  Trash2,
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
import {
  createStrategyFromForm,
  deleteStrategyFromForm,
  updateStrategyFromForm,
} from "./actions";

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
    <div className="rounded-inner border-[0.5px] border-dashed border-flash/[0.12] bg-surface-2 p-6">
      <p className="text-body font-medium text-flash">{title}</p>
      <p className="mt-2 text-caption leading-5 text-muted">{description}</p>
    </div>
  );
}

function TextInput({
  name,
  label,
  defaultValue = "",
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-micro uppercase tracking-label text-muted-faint">
        {label}
      </span>
      <input
        name={name}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        maxLength={80}
        autoComplete="off"
        className="mt-2 w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10"
      />
    </label>
  );
}

function TextArea({
  name,
  label,
  defaultValue = "",
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-micro uppercase tracking-label text-muted-faint">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={300}
        rows={3}
        className="mt-2 w-full resize-none rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10"
      />
    </label>
  );
}

function ColdSwatchPicker({ defaultColor }: { defaultColor: string }) {
  return (
    <div>
      <p className="text-micro uppercase tracking-label text-muted-faint">
        Library marker
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {coldSwatches.map((color) => (
          <label
            key={color}
            className="relative h-8 w-8 cursor-pointer rounded-pill border-[0.5px] border-flash/[0.14] bg-surface-2 p-1 transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/45"
            title={color}
          >
            <input
              type="radio"
              name="color"
              value={color}
              defaultChecked={color === defaultColor}
              className="peer sr-only"
            />
            <span
              className="block h-full w-full rounded-pill opacity-80 ring-0 ring-accent-bright/0 transition-all duration-fast peer-checked:opacity-100 peer-checked:ring-2 peer-checked:ring-accent-bright/70"
              style={{ backgroundColor: color }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function CreateStrategyPanel({
  accountId,
  defaultColor,
}: {
  accountId: string;
  defaultColor: string;
}) {
  const createAction = createStrategyFromForm.bind(null, accountId);

  return (
    <Card>
      <SectionHeader eyebrow="Setup" title="Add a doctrine entry">
        <StatusPill tone="info">Cold markers only</StatusPill>
      </SectionHeader>
      <form action={createAction} className="mt-6 space-y-5">
        <TextInput
          name="name"
          label="Strategy name"
          placeholder="Example: London continuation"
          required
        />
        <TextArea
          name="description"
          label="Execution doctrine"
          placeholder="Entry context, invalidation rules, risk notes, and review criteria."
        />
        <ColdSwatchPicker defaultColor={defaultColor} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption leading-5 text-muted">
            A playbook entry is a rule of engagement, not a performance claim.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-5 py-3 text-sm font-semibold text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55"
          >
            <Plus size={17} />
            Add strategy
          </button>
        </div>
      </form>
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
}) {
  const winRate =
    stats.count > 0 ? Math.round((stats.wins / stats.count) * 100) : null;
  const updateAction = updateStrategyFromForm.bind(null, accountId, strategy.id);
  const deleteAction = deleteStrategyFromForm.bind(null, accountId, strategy.id);

  return (
    <Card interactive className="p-5">
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
                  {stats.count > 0 ? "Linked to trades" : "Doctrine only"}
                </StatusPill>
              </div>
              <p className="mt-2 max-w-3xl text-caption leading-5 text-muted">
                {strategy.description ||
                  "No doctrine notes yet. Add entry conditions, invalidation criteria, and review rules before treating this strategy as operational."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
          <div>
            <p className="text-micro uppercase tracking-label text-muted-faint">
              Trades
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
              Net PnL
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
        <details className="group mt-5 border-t-[0.5px] border-flash/[0.08] pt-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-caption font-medium text-muted transition-colors duration-fast group-hover:text-accent-bright">
              <PenLine size={15} />
              Edit doctrine
            </span>
            <ChevronDown
              size={16}
              className="text-muted transition-transform duration-base group-open:rotate-180"
            />
          </summary>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_220px]">
            <form action={updateAction} className="space-y-4">
              <TextInput
                name="name"
                label="Strategy name"
                defaultValue={strategy.name}
                placeholder="Strategy name"
                required
              />
              <TextArea
                name="description"
                label="Execution doctrine"
                defaultValue={strategy.description || ""}
                placeholder="Document setup rules, invalidation criteria, and review notes."
              />
              <ColdSwatchPicker defaultColor={color} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-4 py-3 text-sm font-medium text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55"
              >
                <Save size={16} />
                Save doctrine
              </button>
            </form>

            <div className="rounded-inner border-[0.5px] border-negative/20 bg-negative/[0.06] p-4">
              <p className="text-body font-medium text-flash">
                Remove from library
              </p>
              <p className="mt-2 text-caption leading-5 text-muted">
                Deleting a strategy removes the library entry. Existing trade
                records keep their trade data.
              </p>
              <form action={deleteAction} className="mt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-negative/30 bg-negative/[0.08] px-4 py-3 text-sm font-medium text-negative transition-all duration-fast hover:-translate-y-0.5 hover:border-negative/55"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </form>
            </div>
          </div>
        </details>
      )}
    </Card>
  );
}

export default async function PlaybookPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
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
          name: true,
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
  if (account.status === "ARCHIVED") {
    redirect(`/accounts/${accountId}`);
  }

  const language = normalizeAppLanguage(membership.user.appLanguage);
  const currency = account.currency ?? "USD";
  const canManageStrategies =
    membership.role === "MANAGER" || membership.canCreateTrades;

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

  const measuredStrategies = strategies.filter(
    (strategy) => (statsMap[strategy.id]?.count ?? 0) > 0
  ).length;
  const strategyCoverage =
    totalTrades > 0 ? Math.round((linkedTrades.length / totalTrades) * 100) : null;
  const totalStrategyPnl = Object.values(statsMap).reduce(
    (sum, stats) => sum + stats.totalPnl,
    0
  );
  const hasStrategies = strategies.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:pr-[18rem] xl:pr-[20rem] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-micro uppercase tracking-hero text-muted-faint">
            Strategy library / execution doctrine
          </p>
          <h1 className="mt-3 text-hero text-flash">Playbook</h1>
          <div className="mt-4 max-w-3xl">
            <SignatureEdge orientation="horizontal" className="mb-4 max-w-40" />
            <p className="text-body text-muted">
              Define the setups this account is allowed to trade. Performance
              appears only when trades are linked to a strategy.
            </p>
          </div>
        </div>

        <StatusPill tone={canManageStrategies ? "info" : "neutral"}>
          {canManageStrategies ? "Doctrine editable" : "Read-only"}
        </StatusPill>
      </div>

      <Card variant="hero" className="reveal-rise">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone="info">{account.name}</StatusPill>
              <StatusPill tone={hasStrategies ? "info" : "neutral"}>
                {hasStrategies ? "Library established" : "No doctrine yet"}
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

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Doctrine entries
              </p>
              <p className="mt-2 text-body text-flash">{strategies.length}</p>
            </div>
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Measured entries
              </p>
              <p className="mt-2 text-body text-flash">{measuredStrategies}</p>
            </div>
            <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4 sm:col-span-2">
              <p className="text-micro uppercase tracking-label text-muted-faint">
                Library standard
              </p>
              <p className="mt-2 text-body text-flash">
                Document first, judge only after linked trades
              </p>
            </div>
          </div>
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
          detail="Share of all trades linked to a strategy."
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
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {canManageStrategies ? (
          <CreateStrategyPanel
            accountId={accountId}
            defaultColor={coldSwatches[strategies.length % coldSwatches.length]}
          />
        ) : (
          <Card>
            <SectionHeader eyebrow="Access" title="Doctrine is read-only">
              <StatusPill>Permission gated</StatusPill>
            </SectionHeader>
            <div className="mt-6 flex gap-3 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-5">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-muted" />
              <p className="text-caption leading-5 text-muted">
                Strategy creation and edits require manager access or trade
                creation permission. The server action checks membership again
                before changing anything.
              </p>
            </div>
          </Card>
        )}

        <Card>
          <SectionHeader eyebrow="Library" title="Execution doctrine">
            <StatusPill>{strategies.length} entries</StatusPill>
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
                />
              ))
            ) : (
              <EmptyState
                title="No strategy library yet"
                description="Create the first doctrine entry before comparing setups. Empty performance claims would be noise here."
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
                Playbook is a doctrine layer, not another dashboard.
              </p>
              <p className="mt-1 text-caption leading-5 text-muted">
                Use Dashboard and Analytics for account-wide performance. Use
                Playbook to keep the operating rules clear and linked to trades.
              </p>
            </div>
          </div>
          <StatusPill tone="info">Rulebook feeling</StatusPill>
        </div>
      </Card>
    </div>
  );
}
