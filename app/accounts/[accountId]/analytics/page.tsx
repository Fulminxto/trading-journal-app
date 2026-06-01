import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import AnalyticsStatCard from "@/components/analytics/AnalyticsStatCard";
import PerformanceIntelligence from "@/components/analytics/PerformanceIntelligence";
import SymbolPerformance from "@/components/analytics/SymbolPerformance";
import SessionPerformance from "@/components/analytics/SessionPerformance";
import PerformanceInsights from "@/components/analytics/PerformanceInsights";
import PsychologyAnalytics from "@/components/analytics/PsychologyAnalytics";
import AnalyticsHero from "@/components/analytics/AnalyticsHero";
import WeekdayHeatmap from "@/components/analytics/WeekdayHeatmap";
import EmotionalStateHeatmap from "@/components/analytics/EmotionalStateHeatmap";
import ConfidencePerformanceHeatmap from "@/components/analytics/ConfidencePerformanceHeatmap";
import ExecutionQualityHeatmap from "@/components/analytics/ExecutionQualityHeatmap";
import SetupQualityHeatmap from "@/components/analytics/SetupQualityHeatmap";
import BehavioralRiskHeatmap from "@/components/analytics/BehavioralRiskHeatmap";
import RiskConcentrationMatrix from "@/components/analytics/RiskConcentrationMatrix";
import ExecutionTrendChart from "@/components/analytics/ExecutionTrendChart";
import ConfidenceEvolutionChart from "@/components/analytics/ConfidenceEvolutionChart";
import EmotionalTimelineChart from "@/components/analytics/EmotionalTimelineChart";
import DisciplineEvolutionChart from "@/components/analytics/DisciplineEvolutionChart";
import ConsistencyCurveChart from "@/components/analytics/ConsistencyCurveChart";
import PsychologicalStabilityCurve from "@/components/analytics/PsychologicalStabilityCurve";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  CandlestickChart,
} from "lucide-react";

function formatCurrency(
  value: number,
  currency: string
) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

function getBestWinStreak(
  trades: {
    outcome?: string | null;
  }[]
) {
  let currentStreak = 0;
  let bestStreak = 0;

  for (const trade of trades) {
    if (trade.outcome === "win") {
      currentStreak += 1;
      bestStreak = Math.max(
        bestStreak,
        currentStreak
      );
    } else if (trade.outcome === "loss") {
      currentStreak = 0;
    }
  }

  return bestStreak;
}

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{
    accountId: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

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
    membership.role !== "MANAGER" &&
    !membership.canViewAnalytics
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    membership.tradingAccount.status === "ARCHIVED"
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  const account = membership.tradingAccount;

  const accountMembers =
    await prisma.accountMember.findMany({
      where: {
        tradingAccountId: accountId,
      },

      include: {
        user: true,
      },
    });

  const isSharedAccount =
    accountMembers.length > 1;

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
    },

    include: {
      createdBy: true,
    },

    orderBy: {
      openDate: "asc",
    },
  });

  const totalTrades = trades.length;

  const wins = trades.filter(
    (trade) => trade.outcome === "win"
  );

  const losses = trades.filter(
    (trade) => trade.outcome === "loss"
  );

  const longTrades = trades.filter(
    (trade) =>
      trade.direction?.toLowerCase() ===
      "long"
  );

  const shortTrades = trades.filter(
    (trade) =>
      trade.direction?.toLowerCase() ===
      "short"
  );

  const totalPnl = trades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const grossProfit = wins.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const grossLoss = losses.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const averageWin =
    wins.length > 0
      ? grossProfit / wins.length
      : 0;

  const averageLoss =
    losses.length > 0
      ? grossLoss / losses.length
      : 0;

  const profitFactor =
    Math.abs(grossLoss) > 0
      ? grossProfit / Math.abs(grossLoss)
      : grossProfit > 0
        ? grossProfit
        : 0;

  const bestWinStreak =
    getBestWinStreak(trades);

  const averageRR =
    trades.length > 0
      ? trades.reduce(
        (acc, trade) =>
          acc +
          (trade.riskReward || 0),
        0
      ) / trades.length
      : 0;

  const bestTrade =
    trades.length > 0
      ? Math.max(
        ...trades.map(
          (trade) =>
            trade.resultUsd || 0
        )
      )
      : 0;

  const worstTrade =
    trades.length > 0
      ? Math.min(
        ...trades.map(
          (trade) =>
            trade.resultUsd || 0
        )
      )
      : 0;

  const symbolStats: Record<
    string,
    {
      trades: number;
      pnl: number;
    }
  > = {};

  for (const trade of trades) {
    const symbol = trade.symbol;

    if (!symbolStats[symbol]) {
      symbolStats[symbol] = {
        trades: 0,
        pnl: 0,
      };
    }

    symbolStats[symbol].trades += 1;

    symbolStats[symbol].pnl +=
      trade.resultUsd || 0;
  }

  const bestSymbol =
    Object.entries(symbolStats).sort(
      (a, b) =>
        b[1].pnl - a[1].pnl
    )[0];

  const worstSymbol =
    Object.entries(symbolStats).sort(
      (a, b) =>
        a[1].pnl - b[1].pnl
    )[0];

  const mostTraded =
    Object.entries(symbolStats).sort(
      (a, b) =>
        b[1].trades - a[1].trades
    )[0];

  const mistakesStats: Record<
    string,
    {
      count: number;
      pnl: number;
    }
  > = {};

  for (const trade of trades) {
    if (!trade.mistakes) {
      continue;
    }

    const mistakes =
      trade.mistakes
        .split(",")
        .map((mistake) =>
          mistake.trim()
        )
        .filter(Boolean);

    for (const mistake of mistakes) {
      if (!mistakesStats[mistake]) {
        mistakesStats[mistake] = {
          count: 0,
          pnl: 0,
        };
      }

      mistakesStats[mistake].count += 1;

      mistakesStats[mistake].pnl +=
        trade.resultUsd || 0;
    }
  }

  const emotionalStats: Record<
    string,
    {
      trades: number;
      wins: number;
      pnl: number;
    }
  > = {};

  for (const trade of trades) {
    if (!trade.emotionalState) {
      continue;
    }

    if (
      !emotionalStats[
      trade.emotionalState
      ]
    ) {
      emotionalStats[
        trade.emotionalState
      ] = {
        trades: 0,
        wins: 0,
        pnl: 0,
      };
    }

    emotionalStats[
      trade.emotionalState
    ].trades += 1;

    if (trade.outcome === "win") {
      emotionalStats[
        trade.emotionalState
      ].wins += 1;
    }

    emotionalStats[
      trade.emotionalState
    ].pnl +=
      trade.resultUsd || 0;
  }

  const winRate =
    totalTrades > 0
      ? (wins.length / totalTrades) * 100
      : 0;

  const longWinRate =
    longTrades.length > 0
      ? (longTrades.filter(
        (trade) =>
          trade.outcome === "win"
      ).length /
        longTrades.length) *
      100
      : 0;

  const shortWinRate =
    shortTrades.length > 0
      ? (shortTrades.filter(
        (trade) =>
          trade.outcome === "win"
      ).length /
        shortTrades.length) *
      100
      : 0;

  const monthlyStats: Record<
    string,
    {
      trades: number;
      wins: number;
      pnl: number;
    }
  > = {};

  for (const trade of trades) {
    const month = new Date(
      trade.openDate
    ).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        trades: 0,
        wins: 0,
        pnl: 0,
      };
    }

    monthlyStats[month].trades += 1;

    if (trade.outcome === "win") {
      monthlyStats[month].wins += 1;
    }

    monthlyStats[month].pnl +=
      trade.resultUsd || 0;
  }

  const sessionStats: Record<
    string,
    {
      trades: number;
      wins: number;
      pnl: number;
    }
  > = {};

  for (const trade of trades) {
    if (!trade.session) {
      continue;
    }

    if (!sessionStats[trade.session]) {
      sessionStats[trade.session] = {
        trades: 0,
        wins: 0,
        pnl: 0,
      };
    }

    sessionStats[trade.session].trades += 1;

    if (trade.outcome === "win") {
      sessionStats[trade.session].wins += 1;
    }

    sessionStats[trade.session].pnl +=
      trade.resultUsd || 0;
  }

  const setupQualityStats = {
    low: {
      trades: 0,
      wins: 0,
      pnl: 0,
    },

    medium: {
      trades: 0,
      wins: 0,
      pnl: 0,
    },

    high: {
      trades: 0,
      wins: 0,
      pnl: 0,
    },
  };

  for (const trade of trades) {
    if (!trade.setupQuality) {
      continue;
    }

    let bucket:
      | "low"
      | "medium"
      | "high";

    if (trade.setupQuality <= 4) {
      bucket = "low";
    } else if (
      trade.setupQuality <= 7
    ) {
      bucket = "medium";
    } else {
      bucket = "high";
    }

    setupQualityStats[
      bucket
    ].trades += 1;

    if (trade.outcome === "win") {
      setupQualityStats[
        bucket
      ].wins += 1;
    }

    setupQualityStats[
      bucket
    ].pnl +=
      trade.resultUsd || 0;
  }

  const insights: string[] = [];

  const bestEmotion =
    Object.entries(emotionalStats).sort(
      (a, b) => {
        const aRate =
          a[1].trades > 0
            ? a[1].wins /
            a[1].trades
            : 0;

        const bRate =
          b[1].trades > 0
            ? b[1].wins /
            b[1].trades
            : 0;

        return bRate - aRate;
      }
    )[0];

  if (bestEmotion) {
    const rate =
      bestEmotion[1].trades > 0
        ? (
          (bestEmotion[1].wins /
            bestEmotion[1].trades) *
          100
        ).toFixed(0)
        : "0";

    insights.push(
      `Best emotional state: ${bestEmotion[0]} (${rate}% WR)`
    );
  }

  const worstMistake =
    Object.entries(mistakesStats).sort(
      (a, b) =>
        a[1].pnl - b[1].pnl
    )[0];

  if (worstMistake) {
    insights.push(
      `Most expensive mistake: ${worstMistake[0]}`
    );
  }

  if (longWinRate > shortWinRate) {
    insights.push(
      "Long trades currently perform better than short trades."
    );
  } else if (
    shortWinRate > longWinRate
  ) {
    insights.push(
      "Short trades currently perform better than long trades."
    );
  }

  if (winRate >= 60) {
    insights.push(
      "Your overall execution is currently very solid."
    );
  } else if (winRate <= 40) {
    insights.push(
      "Focus on risk management and trade selection."
    );
  }

  const traderStats: Record<
    string,
    {
      name: string;
      trades: number;
      wins: number;
      pnl: number;
    }
  > = {};

  for (const trade of trades) {
    const traderId =
      trade.createdById;

    const traderName =
      trade.createdBy?.username ||
      trade.createdBy?.name ||
      "Trader";

    if (!traderStats[traderId]) {
      traderStats[traderId] = {
        name: traderName,
        trades: 0,
        wins: 0,
        pnl: 0,
      };
    }

    traderStats[traderId].trades += 1;

    if (trade.outcome === "win") {
      traderStats[traderId].wins += 1;
    }

    traderStats[traderId].pnl +=
      trade.resultUsd || 0;
  }

  const monthlyEntries =
    Object.entries(monthlyStats);

  const greenMonths =
    monthlyEntries.filter(
      ([_, stats]) => stats.pnl >= 0
    ).length;

  const redMonths =
    monthlyEntries.filter(
      ([_, stats]) => stats.pnl < 0
    ).length;

  const bestMonth =
    monthlyEntries.sort(
      (a, b) => b[1].pnl - a[1].pnl
    )[0];

  const worstMonth =
    monthlyEntries.sort(
      (a, b) => a[1].pnl - b[1].pnl
    )[0];

  const cards = [
    {
      label: "Total Trades",
      value: totalTrades,
      tone: "text-white",
      icon: BarChart3,
    },

    {
      label: "Win Rate",
      value: `${winRate.toFixed(2)}%`,
      tone:
        winRate >= 50
          ? "text-green-400"
          : "text-red-400",
      icon: Target,
    },

    {
      label: "Average RR",
      value: averageRR.toFixed(2),
      tone: "text-yellow-400",
      icon: CandlestickChart,
    },

    {
      label: "Total PnL",
      value: formatCurrency(
        totalPnl,
        account.currency
      ),
      tone:
        totalPnl >= 0
          ? "text-green-400"
          : "text-red-400",
      icon:
        totalPnl >= 0
          ? TrendingUp
          : TrendingDown,
    },
  ];

  const weekdayMap = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  trades.forEach((trade) => {
    const date = new Date(trade.openDate);

    const day = date.toLocaleDateString(
      "en-US",
      {
        weekday: "short",
      }
    );

    if (
      day in weekdayMap &&
      typeof trade.resultUsd === "number"
    ) {
      weekdayMap[
        day as keyof typeof weekdayMap
      ] += trade.resultUsd;
    }
  });

  const weekdayHeatmapData = Object.entries(
    weekdayMap
  ).map(([day, pnl]) => ({
    day,
    pnl,
  }));

  const emotionalStateMap = trades.reduce(
    (acc, trade) => {
      const emotion =
        trade.emotionalState || "Unknown";

      if (!acc[emotion]) {
        acc[emotion] = {
          count: 0,
          pnl: 0,
        };
      }

      acc[emotion].count += 1;
      acc[emotion].pnl += trade.resultUsd || 0;

      return acc;
    },
    {} as Record<
      string,
      {
        count: number;
        pnl: number;
      }
    >
  );

  const emotionalStateHeatmapData =
    Object.entries(emotionalStateMap).map(
      ([emotion, stats]) => ({
        emotion,
        count: stats.count,
        pnl: stats.pnl,
      })
    );

  const confidenceHeatmapData = [
    {
      level: "Low Confidence",
      count: trades.filter(
        (trade) =>
          (trade.confidence || 0) > 0 &&
          (trade.confidence || 0) <= 4
      ).length,
      pnl: trades
        .filter(
          (trade) =>
            (trade.confidence || 0) > 0 &&
            (trade.confidence || 0) <= 4
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
    {
      level: "Medium Confidence",
      count: trades.filter(
        (trade) =>
          (trade.confidence || 0) >= 5 &&
          (trade.confidence || 0) <= 7
      ).length,
      pnl: trades
        .filter(
          (trade) =>
            (trade.confidence || 0) >= 5 &&
            (trade.confidence || 0) <= 7
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
    {
      level: "High Confidence",
      count: trades.filter(
        (trade) =>
          (trade.confidence || 0) >= 8
      ).length,
      pnl: trades
        .filter(
          (trade) =>
            (trade.confidence || 0) >= 8
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
  ];

  const executionHeatmapData = [
    {
      level: "Weak Execution",
      count: trades.filter(
        (trade) =>
          (trade.executionRating || 0) > 0 &&
          (trade.executionRating || 0) <= 4
      ).length,
      pnl: trades
        .filter(
          (trade) =>
            (trade.executionRating || 0) > 0 &&
            (trade.executionRating || 0) <= 4
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
    {
      level: "Average Execution",
      count: trades.filter(
        (trade) =>
          (trade.executionRating || 0) >= 5 &&
          (trade.executionRating || 0) <= 7
      ).length,
      pnl: trades
        .filter(
          (trade) =>
            (trade.executionRating || 0) >= 5 &&
            (trade.executionRating || 0) <= 7
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
    {
      level: "Elite Execution",
      count: trades.filter(
        (trade) =>
          (trade.executionRating || 0) >= 8
      ).length,
      pnl: trades
        .filter(
          (trade) =>
            (trade.executionRating || 0) >= 8
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
  ];

  const setupHeatmapData = [
    {
      level: "Weak Setup",
      count: trades.filter(
        (trade) =>
          (trade.setupQuality || 0) > 0 &&
          (trade.setupQuality || 0) <= 4
      ).length,
      pnl: trades
        .filter(
          (trade) =>
            (trade.setupQuality || 0) > 0 &&
            (trade.setupQuality || 0) <= 4
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
    {
      level: "Average Setup",
      count: trades.filter(
        (trade) =>
          (trade.setupQuality || 0) >= 5 &&
          (trade.setupQuality || 0) <= 7
      ).length,
      pnl: trades
        .filter(
          (trade) =>
            (trade.setupQuality || 0) >= 5 &&
            (trade.setupQuality || 0) <= 7
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
    {
      level: "Elite Setup",
      count: trades.filter(
        (trade) =>
          (trade.setupQuality || 0) >= 8
      ).length,
      pnl: trades
        .filter(
          (trade) =>
            (trade.setupQuality || 0) >= 8
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
  ];

  function getRiskSeverity(
    count: number,
    total: number
  ): "low" | "medium" | "high" {
    if (total === 0) {
      return "low";
    }

    const ratio = count / total;

    if (ratio >= 0.4) {
      return "high";
    }

    if (ratio >= 0.2) {
      return "medium";
    }

    return "low";
  }

  const lowConfidenceCount = trades.filter(
    (trade) =>
      (trade.confidence || 0) > 0 &&
      (trade.confidence || 0) <= 4
  ).length;

  const weakExecutionCount = trades.filter(
    (trade) =>
      (trade.executionRating || 0) > 0 &&
      (trade.executionRating || 0) <= 4
  ).length;

  const weakSetupCount = trades.filter(
    (trade) =>
      (trade.setupQuality || 0) > 0 &&
      (trade.setupQuality || 0) <= 4
  ).length;

  const emotionalCount = trades.filter(
    (trade) =>
      trade.emotionalState &&
      trade.emotionalState.length > 0
  ).length;

  const behavioralRiskHeatmapData = [
    {
      factor: "Low Confidence",
      count: lowConfidenceCount,
      severity: getRiskSeverity(
        lowConfidenceCount,
        trades.length
      ),
    },
    {
      factor: "Weak Execution",
      count: weakExecutionCount,
      severity: getRiskSeverity(
        weakExecutionCount,
        trades.length
      ),
    },
    {
      factor: "Weak Setups",
      count: weakSetupCount,
      severity: getRiskSeverity(
        weakSetupCount,
        trades.length
      ),
    },
    {
      factor: "Emotional Trades",
      count: emotionalCount,
      severity: getRiskSeverity(
        emotionalCount,
        trades.length
      ),
    },
  ];

  const riskConcentrationData = [
    {
      label: "Psychology",
      value:
        trades.length > 0
          ? Math.round(
            (emotionalCount / trades.length) *
            100
          )
          : 0,
    },
    {
      label: "Confidence",
      value:
        trades.length > 0
          ? Math.round(
            (lowConfidenceCount /
              trades.length) *
            100
          )
          : 0,
    },
    {
      label: "Execution",
      value:
        trades.length > 0
          ? Math.round(
            (weakExecutionCount /
              trades.length) *
            100
          )
          : 0,
    },
    {
      label: "Setup Quality",
      value:
        trades.length > 0
          ? Math.round(
            (weakSetupCount / trades.length) *
            100
          )
          : 0,
    },
  ];

  const executionTrendData = trades
    .filter(
      (trade) =>
        typeof trade.executionRating === "number"
    )
    .map((trade) => ({
      date: new Date(trade.openDate).toLocaleDateString(
        "it-IT",
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
      execution: trade.executionRating || 0,
    }));

  const confidenceEvolutionData = trades
    .filter(
      (trade) =>
        typeof trade.confidence === "number"
    )
    .map((trade) => ({
      date: new Date(trade.openDate).toLocaleDateString(
        "it-IT",
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
      confidence: trade.confidence || 0,
    }));

  const emotionalTimelineData = trades
    .filter(
      (trade) =>
        trade.emotionalState &&
        trade.emotionalState.length > 0
    )
    .map((trade) => ({
      date: new Date(trade.openDate).toLocaleDateString(
        "it-IT",
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
      emotional: 1,
    }));

  const disciplineEvolutionData = trades
    .filter(
      (trade) =>
        typeof trade.executionRating === "number" ||
        typeof trade.setupQuality === "number"
    )
    .map((trade) => {
      const execution =
        trade.executionRating || 0;

      const setupQuality =
        trade.setupQuality || 0;

      const discipline =
        Math.round(
          (execution + setupQuality) / 2
        );

      return {
        date: new Date(trade.openDate).toLocaleDateString(
          "it-IT",
          {
            day: "2-digit",
            month: "2-digit",
          }
        ),
        discipline,
      };
    });

  const consistencyCurveData = trades.map((trade) => {
    const execution =
      trade.executionRating || 0;

    const setupQuality =
      trade.setupQuality || 0;

    const confidence =
      trade.confidence || 0;

    const tradeScore = Math.round(
      execution * 4 +
      setupQuality * 4 +
      confidence * 2
    );

    return {
      date: new Date(trade.openDate).toLocaleDateString(
        "it-IT",
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
      consistency: Math.min(100, tradeScore),
    };
  });

  const psychologicalStabilityData = trades.map((trade) => {
    const confidence =
      trade.confidence || 0;

    const hasEmotion =
      trade.emotionalState &&
      trade.emotionalState.length > 0;

    const stability = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          confidence * 10 -
          (hasEmotion ? 20 : 0)
        )
      )
    );

    return {
      date: new Date(trade.openDate).toLocaleDateString(
        "it-IT",
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
      stability,
    };
  });

  return (
    <div className="space-y-8">

      <AnalyticsHero
        accountName={account.name}
        totalPnl={formatCurrency(
          totalPnl,
          account.currency
        )}
        winRate={winRate}
        totalTrades={trades.length}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Gross Profit
          </p>

          <h2 className="mt-2 text-2xl font-black text-green-400">
            {formatCurrency(
              grossProfit,
              account.currency
            )}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Gross Loss
          </p>

          <h2 className="mt-2 text-2xl font-black text-red-400">
            {formatCurrency(
              grossLoss,
              account.currency
            )}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Profit Factor
          </p>

          <h2 className={`mt-2 text-2xl font-black ${profitFactor >= 1
            ? "text-green-400"
            : "text-red-400"
            }`}>
            {profitFactor.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Best Win Streak
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            {bestWinStreak}
          </h2>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-400">
          Statistiche avanzate
        </p>

        <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
          <BarChart3 className="text-green-400" />
          Analytics
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <AnalyticsStatCard
            key={card.label}
            label={card.label}
            value={card.value}
            tone={card.tone}
            icon={card.icon}
          />
        ))}
      </div>

      <PerformanceIntelligence
        averageWin={formatCurrency(
          averageWin,
          account.currency
        )}
        averageLoss={formatCurrency(
          Math.abs(averageLoss),
          account.currency
        )}
        profitFactor={profitFactor.toFixed(2)}
        bestWinStreak={bestWinStreak}
      />

      <PerformanceInsights
        winRate={winRate}
        averageRR={averageRR}
        totalPnl={totalPnl}
        bestSymbol={bestSymbol?.[0]}
      />

      <div className="mt-8">
        <WeekdayHeatmap
          data={weekdayHeatmapData}
        />
      </div>

      <div className="mt-8">
        <EmotionalStateHeatmap
          data={emotionalStateHeatmapData}
        />
      </div>

      <div className="mt-8">
        <ConfidencePerformanceHeatmap
          data={confidenceHeatmapData}
        />
      </div>

      <div className="mt-8">
        <ExecutionQualityHeatmap
          data={executionHeatmapData}
        />
      </div>

      <div className="mt-8">
        <SetupQualityHeatmap
          data={setupHeatmapData}
        />
      </div>

      <div className="mt-8">
        <BehavioralRiskHeatmap
          data={behavioralRiskHeatmapData}
        />
      </div>

      <div className="mt-8">
        <RiskConcentrationMatrix
          risks={riskConcentrationData}
        />
      </div>

      <div className="mt-8">
        <ExecutionTrendChart
          data={executionTrendData}
        />
      </div>

      <div className="mt-8">
        <ConfidenceEvolutionChart
          data={confidenceEvolutionData}
        />
      </div>

      <div className="mt-8">
        <EmotionalTimelineChart
          data={emotionalTimelineData}
        />
      </div>

      <div className="mt-8">
        <DisciplineEvolutionChart
          data={disciplineEvolutionData}
        />
      </div>

      <div className="mt-8">
        <ConsistencyCurveChart
          data={consistencyCurveData}
        />
      </div>

      <div className="mt-8">
        <PsychologicalStabilityCurve
          data={psychologicalStabilityData}
        />
      </div>

      <PsychologyAnalytics
        averageConfidence={
          Math.round(
            trades.reduce(
              (acc, trade) =>
                acc + (trade.confidence || 0),
              0
            ) / Math.max(trades.length, 1)
          )
        }
        averageExecution={
          Math.round(
            trades.reduce(
              (acc, trade) =>
                acc +
                (trade.executionRating || 0),
              0
            ) / Math.max(trades.length, 1)
          )
        }
        averageSetupQuality={
          Math.round(
            trades.reduce(
              (acc, trade) =>
                acc +
                (trade.setupQuality || 0),
              0
            ) / Math.max(trades.length, 1)
          )
        }
      />

      <div className="grid grid-cols-1 gap-8">
        <SymbolPerformance
          bestSymbol={bestSymbol}
          worstSymbol={worstSymbol}
          mostTraded={mostTraded}
          currency={account.currency}
          formatCurrency={formatCurrency}
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-sm text-gray-400">
          Trade Direction
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          Long vs Short
        </h2>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                Long Trades
              </p>

              <p className="font-bold text-white">
                {longTrades.length}
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-green-400"
                style={{
                  width: `${Math.min(
                    longWinRate,
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm text-green-400">
              {longWinRate.toFixed(2)}%
              winrate
            </p>
          </div>

          <div className="rounded-2xl bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                Short Trades
              </p>

              <p className="font-bold text-white">
                {shortTrades.length}
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-red-400"
                style={{
                  width: `${Math.min(
                    shortWinRate,
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm text-red-400">
              {shortWinRate.toFixed(2)}%
              winrate
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-sm text-gray-400">
          Trade Results
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          Migliori risultati
        </h2>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              Best Trade
            </p>

            <h3 className="mt-2 text-2xl font-bold text-green-400">
              {formatCurrency(
                bestTrade,
                account.currency
              )}
            </h3>
          </div>

          <div className="rounded-2xl bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              Worst Trade
            </p>

            <h3 className="mt-2 text-2xl font-bold text-red-400">
              {formatCurrency(
                worstTrade,
                account.currency
              )}
            </h3>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <SessionPerformance
          londonTrades={
            trades.filter(
              (trade) =>
                trade.session === "London"
            ).length
          }
          newYorkTrades={
            trades.filter(
              (trade) =>
                trade.session === "New York"
            ).length
          }
          asianTrades={
            trades.filter(
              (trade) =>
                trade.session === "Asian"
            ).length
          }
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-sm text-gray-400">
          Outcome Breakdown
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          Breakdown risultati
        </h2>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
            <p className="text-gray-400">
              Wins
            </p>

            <p className="font-bold text-green-400">
              {wins.length}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
            <p className="text-gray-400">
              Losses
            </p>

            <p className="font-bold text-red-400">
              {losses.length}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
            <p className="text-gray-400">
              Break Even
            </p>

            <p className="font-bold text-yellow-400">
              {trades.filter(
                (trade) =>
                  trade.outcome === "be"
              ).length}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
        <p className="text-sm text-gray-400">
          Mistakes Analytics
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          Errori ricorrenti
        </h2>

        <div className="mt-6 space-y-4">
          {Object.entries(mistakesStats).length === 0 ? (
            <p className="text-sm text-gray-500">
              Nessun errore registrato nei trade.
            </p>
          ) : (
            Object.entries(mistakesStats)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([mistake, stats]) => (
                <div
                  key={mistake}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="font-bold text-white">
                      {mistake}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Ripetuto {stats.count} volte
                    </p>
                  </div>

                  <p
                    className={`font-bold ${stats.pnl >= 0
                      ? "text-green-400"
                      : "text-red-400"
                      }`}
                  >
                    {formatCurrency(stats.pnl, account.currency)}
                  </p>
                </div>
              ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
        <p className="text-sm text-gray-400">
          Setup Quality
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          Setup Performance
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.entries(
            setupQualityStats
          ).map(([level, stats]) => {
            const wr =
              stats.trades > 0
                ? (
                  (stats.wins /
                    stats.trades) *
                  100
                ).toFixed(0)
                : "0";

            return (
              <div
                key={level}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold capitalize text-white">
                    {level}
                  </h3>

                  <div
                    className={`rounded-xl px-3 py-1 text-xs font-bold ${Number(wr) >= 50
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                      }`}
                  >
                    {wr}%
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Trades
                    </p>

                    <p className="font-bold text-white">
                      {stats.trades}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Wins
                    </p>

                    <p className="font-bold text-green-400">
                      {stats.wins}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      PnL
                    </p>

                    <p
                      className={`font-bold ${stats.pnl >= 0
                        ? "text-green-400"
                        : "text-red-400"
                        }`}
                    >
                      {formatCurrency(
                        stats.pnl,
                        account.currency
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isSharedAccount && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <p className="text-sm text-gray-400">
            Team Analytics
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Trader Leaderboard
          </h2>

          <div className="mt-6 space-y-4">
            {Object.values(traderStats)
              .sort((a, b) => b.pnl - a.pnl)
              .map((trader, index) => {
                const wr =
                  trader.trades > 0
                    ? (
                      (trader.wins /
                        trader.trades) *
                      100
                    ).toFixed(0)
                    : "0";

                return (
                  <div
                    key={trader.name}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10 font-bold text-green-400">
                          #{index + 1}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {trader.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {trader.trades} trades
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div>
                        <p className="text-xs text-gray-500">
                          WR
                        </p>

                        <p className="font-bold text-white">
                          {wr}%
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Wins
                        </p>

                        <p className="font-bold text-green-400">
                          {trader.wins}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          PnL
                        </p>

                        <p
                          className={`font-bold ${trader.pnl >= 0
                            ? "text-green-400"
                            : "text-red-400"
                            }`}
                        >
                          {formatCurrency(
                            trader.pnl,
                            account.currency
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
        <p className="text-sm text-gray-400">
          Monthly Performance
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          Monthly Dashboard
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              Best Month
            </p>

            <h3 className="mt-2 text-lg font-bold text-green-400">
              {bestMonth?.[0] || "-"}
            </h3>

            <p className="mt-1 text-sm text-green-400">
              {bestMonth
                ? formatCurrency(
                  bestMonth[1].pnl,
                  account.currency
                )
                : "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              Worst Month
            </p>

            <h3 className="mt-2 text-lg font-bold text-red-400">
              {worstMonth?.[0] || "-"}
            </h3>

            <p className="mt-1 text-sm text-red-400">
              {worstMonth
                ? formatCurrency(
                  worstMonth[1].pnl,
                  account.currency
                )
                : "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              Green Months
            </p>

            <h3 className="mt-2 text-2xl font-bold text-green-400">
              {greenMonths}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              Red Months
            </p>

            <h3 className="mt-2 text-2xl font-bold text-red-400">
              {redMonths}
            </h3>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {Object.entries(monthlyStats)
            .reverse()
            .map(([month, stats]) => {
              const wr =
                stats.trades > 0
                  ? (
                    (stats.wins /
                      stats.trades) *
                    100
                  ).toFixed(0)
                  : "0";

              return (
                <div
                  key={month}
                  className="card-hover flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {month}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {stats.trades} trades
                    </p>
                  </div>

                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-gray-500">
                        WR
                      </p>

                      <p
                        className={`font-bold ${Number(wr) >= 50
                          ? "text-green-400"
                          : "text-red-400"
                          }`}
                      >
                        {wr}%
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Wins
                      </p>

                      <p className="font-bold text-green-400">
                        {stats.wins}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        PnL
                      </p>

                      <p
                        className={`font-bold ${stats.pnl >= 0
                          ? "text-green-400"
                          : "text-red-400"
                          }`}
                      >
                        {formatCurrency(
                          stats.pnl,
                          account.currency
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
        <p className="text-sm text-gray-400">
          AI Insights
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          Performance Insights
        </h2>

        <div className="mt-6 space-y-4">
          {insights.length === 0 ? (
            <p className="text-sm text-gray-500">
              Non ci sono ancora abbastanza dati.
            </p>
          ) : (
            insights.map((insight) => (
              <div
                key={insight}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-sm leading-6 text-gray-300">
                  {insight}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
        <p className="text-sm text-gray-400">
          Trading Psychology
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          Emotional Performance
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(
            emotionalStats
          ).map(([state, stats]) => {
            const stateWinRate =
              stats.trades > 0
                ? (stats.wins /
                  stats.trades) *
                100
                : 0;

            return (
              <div
                key={state}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    {state}
                  </h3>

                  <div
                    className={`rounded-xl px-3 py-1 text-xs font-bold ${stateWinRate >= 50
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                      }`}
                  >
                    {stateWinRate.toFixed(0)}%
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Trades
                    </p>

                    <p className="font-bold text-white">
                      {stats.trades}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Wins
                    </p>

                    <p className="font-bold text-green-400">
                      {stats.wins}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Total PnL
                    </p>

                    <p
                      className={`font-bold ${stats.pnl >= 0
                        ? "text-green-400"
                        : "text-red-400"
                        }`}
                    >
                      {formatCurrency(
                        stats.pnl,
                        account.currency
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}