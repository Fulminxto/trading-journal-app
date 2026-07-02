import {
  ArrowLeft,
  BarChart3,
  Trophy,
  Activity,
  Target,
} from "lucide-react";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  formatCurrencyByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type MemberPerformanceLabels = {
  memberPerformance: string;
  description: string;
  back: string;
  totalTrades: string;
  winRate: string;
  totalPnl: string;
  bestSymbol: string;
  bestTrade: string;
  winLoss: string;
  win: string;
  loss: string;
  operatingFocus: string;
  mostUsedInstrument: string;
  noSymbol: string;
};

const memberPerformanceLabels: Record<
  AppLanguage,
  MemberPerformanceLabels
> = {
  it: {
    memberPerformance: "Performance membro",
    description:
      "Analisi operativa individuale del membro su questo account.",
    back: "Indietro",
    totalTrades: "Trade totali",
    winRate: "Win rate",
    totalPnl: "PnL totale",
    bestSymbol: "Miglior simbolo",
    bestTrade: "Miglior trade",
    winLoss: "Win / Loss",
    win: "win",
    loss: "loss",
    operatingFocus: "Focus operativo",
    mostUsedInstrument: "Strumento più utilizzato",
    noSymbol: "N/D",
  },

  en: {
    memberPerformance: "Member Performance",
    description:
      "Individual operational analysis of this member on the selected account.",
    back: "Back",
    totalTrades: "Total Trades",
    winRate: "Win Rate",
    totalPnl: "Total PnL",
    bestSymbol: "Best Symbol",
    bestTrade: "Best Trade",
    winLoss: "Win / Loss",
    win: "win",
    loss: "loss",
    operatingFocus: "Operating Focus",
    mostUsedInstrument: "Most used instrument",
    noSymbol: "N/A",
  },

  uk: {
    memberPerformance: "Результативність учасника",
    description:
      "Індивідуальний операційний аналіз цього учасника в обраному акаунті.",
    back: "Назад",
    totalTrades: "Усього угод",
    winRate: "Відсоток виграшів",
    totalPnl: "Загальний PnL",
    bestSymbol: "Найкращий символ",
    bestTrade: "Найкраща угода",
    winLoss: "Win / Loss",
    win: "win",
    loss: "loss",
    operatingFocus: "Операційний фокус",
    mostUsedInstrument: "Найчастіше використаний інструмент",
    noSymbol: "Н/Д",
  },

  ru: {
    memberPerformance: "Результативность участника",
    description:
      "Индивидуальный операционный анализ этого участника в выбранном аккаунте.",
    back: "Назад",
    totalTrades: "Всего сделок",
    winRate: "Процент выигрышей",
    totalPnl: "Общий PnL",
    bestSymbol: "Лучший символ",
    bestTrade: "Лучшая сделка",
    winLoss: "Win / Loss",
    win: "win",
    loss: "loss",
    operatingFocus: "Операционный фокус",
    mostUsedInstrument: "Самый используемый инструмент",
    noSymbol: "Н/Д",
  },

  es: {
    memberPerformance: "Rendimiento del miembro",
    description:
      "Análisis operativo individual de este miembro en la cuenta seleccionada.",
    back: "Atrás",
    totalTrades: "Trades totales",
    winRate: "Win rate",
    totalPnl: "PnL total",
    bestSymbol: "Mejor símbolo",
    bestTrade: "Mejor trade",
    winLoss: "Win / Loss",
    win: "win",
    loss: "loss",
    operatingFocus: "Enfoque operativo",
    mostUsedInstrument: "Instrumento más utilizado",
    noSymbol: "N/D",
  },

  fr: {
    memberPerformance: "Performance du membre",
    description:
      "Analyse opérationnelle individuelle de ce membre sur le compte sélectionné.",
    back: "Retour",
    totalTrades: "Trades totaux",
    winRate: "Win rate",
    totalPnl: "PnL total",
    bestSymbol: "Meilleur symbole",
    bestTrade: "Meilleur trade",
    winLoss: "Win / Loss",
    win: "win",
    loss: "loss",
    operatingFocus: "Focus opérationnel",
    mostUsedInstrument: "Instrument le plus utilisé",
    noSymbol: "N/A",
  },

  de: {
    memberPerformance: "Mitglieder-Performance",
    description:
      "Individuelle operative Analyse dieses Mitglieds im ausgewählten Konto.",
    back: "Zurück",
    totalTrades: "Trades gesamt",
    winRate: "Win Rate",
    totalPnl: "Gesamt-PnL",
    bestSymbol: "Bestes Symbol",
    bestTrade: "Bester Trade",
    winLoss: "Win / Loss",
    win: "win",
    loss: "loss",
    operatingFocus: "Operativer Fokus",
    mostUsedInstrument: "Meistgenutztes Instrument",
    noSymbol: "N/V",
  },
};

export default async function MemberPerformancePage({
  params,
}: {
  params: Promise<{
    accountId: string;
    memberId: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId, memberId } = await params;

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      appLanguage: true,
      defaultCurrency: true,
    },
  });

  const language = normalizeAppLanguage(
    currentUser?.appLanguage
  );

  const t = memberPerformanceLabels[language];

  const membership =
    await prisma.accountMember.findFirst({
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

  if (
    membership.tradingAccount.status ===
    "ARCHIVED"
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    membership.role !== "MANAGER" &&
    !membership.canViewMembers
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  const targetMembership =
    await prisma.accountMember.findFirst({
      where: {
        userId: memberId,
        tradingAccountId: accountId,
      },
      include: {
        user: true,
      },
    });

  if (!targetMembership) {
    redirect(`/accounts/${accountId}/members`);
  }

  const member = targetMembership.user;

  const currency =
    membership.tradingAccount.currency ??
    currentUser?.defaultCurrency ??
    "USD";

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
      createdById: memberId,
    },
    orderBy: [
      {
        openDate: "desc",
      },
      {
        openTime: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const totalTrades = trades.length;

  const wins = trades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const losses = trades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const winRate =
    totalTrades > 0
      ? Math.round((wins / totalTrades) * 100)
      : 0;

  const totalPnl = trades.reduce(
    (sum, trade) =>
      sum + (trade.resultUsd || 0),
    0
  );

  const bestTrade =
    trades.length > 0
      ? Math.max(
        ...trades.map(
          (trade) => trade.resultUsd || 0
        )
      )
      : 0;

  const symbols = trades.reduce<
    Record<string, number>
  >((acc, trade) => {
    acc[trade.symbol] =
      (acc[trade.symbol] || 0) + 1;

    return acc;
  }, {});

  const bestSymbol =
    Object.entries(symbols).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || t.noSymbol;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-sm text-gray-400">
            {t.memberPerformance}
          </p>

          <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
            <BarChart3 className="text-accent-bright" />
            {member.name || member.username}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
            {t.description}
          </p>
        </div>

        <Link
          href={`/accounts/${accountId}/members`}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-gray-300 transition hover:bg-white/[0.05]"
        >
          <ArrowLeft size={16} />
          {t.back}
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
            {t.totalTrades}
          </p>

          <p className="mt-4 text-3xl font-black text-white">
            {totalTrades}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
            {t.winRate}
          </p>

          <p className="mt-4 text-3xl font-black text-white">
            {winRate}%
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
            {t.totalPnl}
          </p>

          <p
            className={`mt-4 text-3xl font-black ${totalPnl >= 0
                ? "text-accent-bright"
                : "text-red-300"
              }`}
          >
            {formatCurrencyByLanguage(
              totalPnl,
              currency,
              language
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
            {t.bestSymbol}
          </p>

          <p className="mt-4 text-3xl font-black text-white">
            {bestSymbol}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[32px] border border-accent-bright/20 bg-accent-bright/10 p-6">
          <Trophy className="text-accent-bright" />

          <h2 className="mt-4 text-2xl font-black text-white">
            {t.bestTrade}
          </h2>

          <p className="mt-4 text-3xl font-black text-accent-bright">
            {formatCurrencyByLanguage(
              bestTrade,
              currency,
              language
            )}
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
          <Activity className="text-accent-bright" />

          <h2 className="mt-4 text-2xl font-black text-white">
            {t.winLoss}
          </h2>

          <p className="mt-4 text-sm text-gray-300">
            {wins} {t.win} · {losses} {t.loss}
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
          <Target className="text-accent-bright" />

          <h2 className="mt-4 text-2xl font-black text-white">
            {t.operatingFocus}
          </h2>

          <p className="mt-4 text-sm text-gray-300">
            {t.mostUsedInstrument}: {bestSymbol}
          </p>
        </div>
      </div>
    </div>
  );
}
