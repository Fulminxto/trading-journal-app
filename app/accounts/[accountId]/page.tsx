import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  CandlestickChart,
  FileText,
  Goal,
  Landmark,
  Layers3,
  LineChart,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type HubCard = {
  href: string;
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  show: boolean;
  accentClass: string;
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value?: number | null) {
  if (value === null || value === undefined) {
    return "-";
  }

  return `${value.toFixed(2)}%`;
}

function getResultTone(value: number) {
  if (value > 0) {
    return "text-green-400";
  }

  if (value < 0) {
    return "text-red-400";
  }

  return "text-yellow-400";
}

function AccountHubCard({ card }: { card: HubCard }) {
  const Icon = card.icon;

  return (
    <Link
      href={card.href}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div
        className={`absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 ${card.accentClass}`}
      />

      <div className="relative z-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">
              {card.eyebrow}
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              {card.title}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-cyan-300">
            <Icon size={20} />
          </div>
        </div>

        <p className="text-sm leading-6 text-gray-400">
          {card.description}
        </p>
      </div>
    </Link>
  );
}

function StatCard({
  label,
  value,
  tone = "text-white",
}: {
  label: string;
  value: string | number;
  tone?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-gray-400">
        {label}
      </p>

      <p className={`mt-3 text-3xl font-black ${tone}`}>
        {value}
      </p>
    </div>
  );
}

export default async function AccountPage({
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
    },
  });

  if (!membership) {
    redirect("/accounts");
  }

  const account = membership.tradingAccount;

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      lastSeenAt: new Date(),
      lastActivityAt: new Date(),
    },
  });

  const [trades, membersCount] = await Promise.all([
    prisma.trade.findMany({
      where: {
        tradingAccountId: accountId,
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
        resultUsd: true,
        equity: true,
        outcome: true,
        needsReview: true,
      },
    }),

    prisma.accountMember.count({
      where: {
        tradingAccountId: accountId,
      },
    }),
  ]);

  const isManager = membership.role === "MANAGER";
  const isArchived = account.status === "ARCHIVED";

  const canViewAnalytics =
    isManager || membership.canViewAnalytics;

  const canViewReports =
    isManager || membership.canViewReports;

  const canViewCopilot =
    isManager || membership.canViewCopilot;

  const canViewMembers =
    isManager || membership.canViewMembers;

  const canManageAccount =
    isManager || membership.canManageAccount;

  const currency = account.currency || "USD";
  const initialBalance = account.initialBalance || 0;

  const totalTrades = trades.length;

  const closedTrades = trades.filter(
    (trade) =>
      trade.outcome === "win" ||
      trade.outcome === "loss" ||
      trade.outcome === "be"
  );

  const wins = closedTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const totalPnl = trades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const currentEquity =
    trades.length > 0
      ? trades[trades.length - 1].equity ||
      initialBalance
      : initialBalance;

  const currentProfitPercent =
    initialBalance > 0
      ? ((currentEquity - initialBalance) /
        initialBalance) *
      100
      : 0;

  const winRate =
    closedTrades.length > 0
      ? (wins / closedTrades.length) * 100
      : 0;

  const needsReviewCount = trades.filter(
    (trade) => trade.needsReview
  ).length;

  const accountProgress =
    account.profitTarget && account.profitTarget > 0
      ? Math.max(
        0,
        Math.min(
          100,
          (currentProfitPercent /
            account.profitTarget) *
          100
        )
      )
      : 0;

  const coreCards: HubCard[] = [
    {
      href: `/accounts/${account.id}/dashboard`,
      title: "Dashboard",
      description:
        "Vista principale dell’account: equity, performance, target e stato operativo generale.",
      eyebrow: "Overview",
      icon: BarChart3,
      show: true,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/diary`,
      title: "Trading Diary",
      description:
        "Consulta, inserisci e revisiona le operazioni con dati, note, sessioni e qualità esecutiva.",
      eyebrow: "Execution",
      icon: CandlestickChart,
      show: true,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/calendar`,
      title: "Calendar",
      description:
        "Leggi la performance giornaliera e individua i giorni migliori, peggiori e più stabili.",
      eyebrow: "Daily view",
      icon: CalendarDays,
      show: true,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.12),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/equity`,
      title: "Equity",
      description:
        "Segui curva equity, drawdown, crescita del conto e andamento progressivo del capitale.",
      eyebrow: "Capital",
      icon: LineChart,
      show: true,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_38%)]",
    },
  ];

  const intelligenceCards: HubCard[] = [
    {
      href: `/accounts/${account.id}/analytics`,
      title: "Analytics",
      description:
        "Analisi avanzata su simboli, sessioni, psicologia, qualità esecutiva e pattern ricorrenti.",
      eyebrow: "Intelligence",
      icon: Activity,
      show: canViewAnalytics,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.14),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/reports`,
      title: "Reports",
      description:
        "Riepiloghi professionali per leggere risultati, punti forti, criticità e focus operativo.",
      eyebrow: "Review",
      icon: FileText,
      show: canViewReports,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/sessions`,
      title: "Sessions",
      description:
        "Pianifica e rivedi le sessioni operative con contesto, disciplina e focus pre/post market.",
      eyebrow: "Planning",
      icon: BookOpen,
      show: canViewReports && !isArchived,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/copilot`,
      title: "Copilot",
      description:
        "Memoria operativa, pattern comportamentali, segnali di rischio e supporto decisionale.",
      eyebrow: "AI layer",
      icon: Bot,
      show: canViewCopilot && !isArchived,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.14),transparent_38%)]",
    },
  ];

  const managementCards: HubCard[] = [
    {
      href: `/accounts/${account.id}/members`,
      title: "Members",
      description:
        "Controlla membri, ruoli, performance individuali, attività e accessi dell’account.",
      eyebrow: "Team",
      icon: Users,
      show: canViewMembers,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/workspace`,
      title: "Workspace",
      description:
        "Osserva presenza live, attività del team, leaderboard e segnali collaborativi.",
      eyebrow: "Command room",
      icon: Layers3,
      show: canViewMembers && !isArchived,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/rules`,
      title: "Rules & Goals",
      description:
        "Gestisci obiettivi, regole operative, limiti e struttura di controllo dell’account.",
      eyebrow: "Control",
      icon: Goal,
      show: canManageAccount && !isArchived,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.12),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/integrations`,
      title: "Integrations",
      description:
        "Configura MT5, broker sync, modalità di import e stato delle integrazioni automatiche.",
      eyebrow: "Sync",
      icon: Zap,
      show: canManageAccount && !isArchived,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_38%)]",
    },
  ];

  const sections = [
    {
      title: "Core workspace",
      description:
        "Le aree principali per leggere e gestire l’andamento dell’account.",
      cards: coreCards,
    },
    {
      title: "Intelligence layer",
      description:
        "Analisi, report, sessioni e supporto operativo avanzato.",
      cards: intelligenceCards.filter((card) => card.show),
    },
    {
      title: "Management",
      description:
        "Gestione di membri, workspace, regole e integrazioni.",
      cards: managementCards.filter((card) => card.show),
    },
  ].filter((section) => section.cards.length > 0);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_35%)]" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Account hub
              </span>

              <span
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${isArchived
                    ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
                    : "border-green-500/20 bg-green-500/10 text-green-300"
                  }`}
              >
                {account.status}
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                {membership.role}
              </span>
            </div>

            <p className="text-sm text-gray-400">
              Account selezionato
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-6xl">
              {account.name}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400">
              Centro operativo dell’account. Da qui puoi
              accedere rapidamente a performance, diario,
              analytics, report, team e impostazioni operative.
            </p>

            {isArchived && (
              <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-sm leading-6 text-yellow-100">
                Questo account è archiviato. Puoi consultare
                lo storico, ma le funzioni operative e di
                gestione sono limitate.
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2">
            <StatCard
              label="Current Equity"
              value={formatCurrency(currentEquity, currency)}
            />

            <StatCard
              label="Total PnL"
              value={formatCurrency(totalPnl, currency)}
              tone={getResultTone(totalPnl)}
            />

            <StatCard
              label="Win Rate"
              value={`${winRate.toFixed(2)}%`}
              tone={
                winRate >= 50
                  ? "text-green-400"
                  : "text-yellow-400"
              }
            />

            <StatCard
              label="Total Trades"
              value={totalTrades}
              tone="text-cyan-300"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Wallet className="text-green-400" size={22} />
            <p className="text-sm text-gray-400">
              Initial Balance
            </p>
          </div>

          <p className="mt-4 text-3xl font-black text-white">
            {formatCurrency(initialBalance, currency)}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-cyan-300" size={22} />
            <p className="text-sm text-gray-400">
              Target Progress
            </p>
          </div>

          <p className="mt-4 text-3xl font-black text-cyan-300">
            {account.profitTarget
              ? `${accountProgress.toFixed(0)}%`
              : "-"}
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-300"
              style={{
                width: `${accountProgress}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-yellow-300" size={22} />
            <p className="text-sm text-gray-400">
              Needs Review
            </p>
          </div>

          <p className="mt-4 text-3xl font-black text-yellow-300">
            {needsReviewCount}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Landmark className="text-purple-300" size={22} />
            <p className="text-sm text-gray-400">
              Members
            </p>
          </div>

          <p className="mt-4 text-3xl font-black text-white">
            {membersCount}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Account Type
          </p>

          <p className="mt-3 text-2xl font-black text-white">
            {account.type}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Profit Target
          </p>

          <p className="mt-3 text-2xl font-black text-green-400">
            {formatPercent(account.profitTarget)}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Max Drawdown
          </p>

          <p className="mt-3 text-2xl font-black text-red-400">
            {formatPercent(account.maxDrawdown)}
          </p>
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.title}
          className="space-y-5"
        >
          <div>
            <p className="text-sm text-gray-400">
              {section.description}
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              {section.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {section.cards.map((card) => (
              <AccountHubCard
                key={card.href}
                card={card}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}