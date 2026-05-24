import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import WeeklyReportCard from "@/components/reports/WeeklyReportCard";
import MonthlyReportCard from "@/components/reports/MonthlyReportCard";
import BehavioralReportCard from "@/components/reports/BehavioralReportCard";
import PerformanceBreakdownCard from "@/components/reports/PerformanceBreakdownCard";
import TraderEvolutionReport from "@/components/reports/TraderEvolutionReport";
import ExecutiveSummaryCard from "@/components/reports/ExecutiveSummaryCard";
import AICoachingReport from "@/components/reports/AICoachingReport";
import RiskManagementReport from "@/components/reports/RiskManagementReport";
import ConsistencyIntelligenceReport from "@/components/reports/ConsistencyIntelligenceReport";
import PsychologicalStabilityReport from "@/components/reports/PsychologicalStabilityReport";
import PerformanceForecastReport from "@/components/reports/PerformanceForecastReport";
import GrowthRoadmapReport from "@/components/reports/GrowthRoadmapReport";
import EdgeAnalysisReport from "@/components/reports/EdgeAnalysisReport";
import DecisionQualityReport from "@/components/reports/DecisionQualityReport";
import ExecutionIntelligenceReport from "@/components/reports/ExecutionIntelligenceReport";
import SetupIntelligenceReport from "@/components/reports/SetupIntelligenceReport";
import ConfidenceIntelligenceReport from "@/components/reports/ConfidenceIntelligenceReport";
import DisciplineIntelligenceReport from "@/components/reports/DisciplineIntelligenceReport";
import EmotionalIntelligenceReport from "@/components/reports/EmotionalIntelligenceReport";
import TraderIdentityReport from "@/components/reports/TraderIdentityReport";
import CognitivePerformanceReport from "@/components/reports/CognitivePerformanceReport";
import MentalResilienceReport from "@/components/reports/MentalResilienceReport";
import ReportsNavigation from "@/components/reports/ReportsNavigation";

export default async function ReportsPage({
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
    });

  if (!membership) {
    redirect("/accounts");
  }

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
    },

    orderBy: {
      openDate: "desc",
    },
  });

  const totalTrades = trades.length;

  const totalPnl = trades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

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

  const emotionalTrades = trades.filter(
    (trade) =>
      trade.emotionalState &&
      trade.emotionalState.length > 0
  ).length;

  const disciplineScore =
    totalTrades > 0
      ? Math.max(
        0,
        Math.min(
          100,
          Math.round(
            winRate +
            (totalPnl > 0 ? 10 : -10)
          )
        )
      )
      : 0;

  const lowConfidenceTrades = trades.filter(
    (trade) =>
      (trade.confidence || 0) > 0 &&
      (trade.confidence || 0) <= 4
  ).length;

  const weakExecutionTrades = trades.filter(
    (trade) =>
      (trade.executionRating || 0) > 0 &&
      (trade.executionRating || 0) <= 4
  ).length;

  const breakEven = trades.filter(
    (trade) => trade.outcome === "be"
  ).length;

  const averageWin =
    wins > 0
      ? trades
        .filter(
          (trade) =>
            trade.outcome === "win"
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ) / wins
      : 0;

  const averageLoss =
    losses > 0
      ? trades
        .filter(
          (trade) =>
            trade.outcome === "loss"
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ) / losses
      : 0;

  const behavioralRisk =
    totalTrades > 0
      ? Math.round(
        ((emotionalTrades +
          lowConfidenceTrades +
          weakExecutionTrades) /
          totalTrades) *
        100
      )
      : 0;

  return (
    <div className="space-y-8">

      <div id="executive">
        <ExecutiveSummaryCard
          totalPnl={totalPnl}
          winRate={winRate}
          disciplineScore={disciplineScore}
          behavioralRisk={behavioralRisk}
        />
      </div>

      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#070b14] via-[#0f1726] to-black p-8 shadow-2xl shadow-cyan-500/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_35%)]" />

        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            VOLTIS AI Reports
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight text-white xl:text-7xl">
            Intelligence Reports
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-400 xl:text-lg">
            Report automatici su
            performance, comportamento,
            disciplina, execution e
            psicologia operativa del trader.
          </p>
        </div>
      </div>

      <ReportsNavigation />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="text-sm text-gray-400">
            Total Trades
          </p>

          <h2 className="mt-4 text-4xl font-black text-cyan-400">
            {totalTrades}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="text-sm text-gray-400">
            Total PnL
          </p>

          <h2 className="mt-4 text-4xl font-black text-green-400">
            ${totalPnl.toFixed(0)}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="text-sm text-gray-400">
            Win Rate
          </p>

          <h2 className="mt-4 text-4xl font-black text-violet-400">
            {winRate}%
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="text-sm text-gray-400">
            Losses
          </p>

          <h2 className="mt-4 text-4xl font-black text-red-400">
            {losses}
          </h2>
        </div>
      </div>

      <div id="weekly">
        <WeeklyReportCard
          totalTrades={totalTrades}
          totalPnl={totalPnl}
          winRate={winRate}
        />
      </div>

      <div
        id="monthly"
        className="mt-8"
      >
        <MonthlyReportCard
          totalTrades={totalTrades}
          totalPnl={totalPnl}
          winRate={winRate}
          emotionalTrades={emotionalTrades}
          disciplineScore={disciplineScore}
        />
      </div>

      <div
        id="behavior"
        className="mt-8"
      >
        <BehavioralReportCard
          emotionalTrades={emotionalTrades}
          lowConfidenceTrades={lowConfidenceTrades}
          weakExecutionTrades={weakExecutionTrades}
          totalTrades={totalTrades}
        />
      </div>

      <div
        id="performance"
        className="mt-8"
      >
        <PerformanceBreakdownCard
          wins={wins}
          losses={losses}
          breakEven={breakEven}
          averageWin={averageWin}
          averageLoss={averageLoss}
        />
      </div>

      <div
        id="growth"
        className="mt-8"
      >
        <GrowthRoadmapReport
          disciplineScore={disciplineScore}
          behavioralRisk={behavioralRisk}
          winRate={winRate}
        />
      </div>

      <div
        id="edge"
        className="mt-8"
      >
        <EdgeAnalysisReport
          averageWin={averageWin}
          averageLoss={averageLoss}
          winRate={winRate}
          disciplineScore={disciplineScore}
        />
      </div>

      <div
        id="decision"
        className="mt-8"
      >
        <DecisionQualityReport
          disciplineScore={disciplineScore}
          behavioralRisk={behavioralRisk}
          winRate={winRate}
          emotionalTrades={emotionalTrades}
        />
      </div>

      <div
        id="execution"
        className="mt-8"
      >
        <ExecutionIntelligenceReport
          weakExecutionTrades={weakExecutionTrades}
          totalTrades={totalTrades}
          disciplineScore={disciplineScore}
          averageWin={averageWin}
          averageLoss={averageLoss}
        />
      </div>

      <div
        id="setup"
        className="mt-8"
      >
        <SetupIntelligenceReport
          totalTrades={totalTrades}
          disciplineScore={disciplineScore}
          averageWin={averageWin}
          averageLoss={averageLoss}
          winRate={winRate}
        />
      </div>

      <div
        id="confidence"
        className="mt-8"
      >
        <ConfidenceIntelligenceReport
          lowConfidenceTrades={lowConfidenceTrades}
          totalTrades={totalTrades}
          disciplineScore={disciplineScore}
          winRate={winRate}
        />
      </div>

      <div
        id="discipline"
        className="mt-8"
      >
        <DisciplineIntelligenceReport
          disciplineScore={disciplineScore}
          behavioralRisk={behavioralRisk}
          emotionalTrades={emotionalTrades}
          totalTrades={totalTrades}
        />
      </div>

      <div
        id="emotion"
        className="mt-8"
      >
        <EmotionalIntelligenceReport
          emotionalTrades={emotionalTrades}
          totalTrades={totalTrades}
          behavioralRisk={behavioralRisk}
          disciplineScore={disciplineScore}
        />
      </div>

      <div
        id="identity"
        className="mt-8"
      >
        <TraderIdentityReport
          disciplineScore={disciplineScore}
          behavioralRisk={behavioralRisk}
          winRate={winRate}
          emotionalTrades={emotionalTrades}
          totalTrades={totalTrades}
        />
      </div>

      <div
        id="cognitive"
        className="mt-8"
      >
        <CognitivePerformanceReport
          disciplineScore={disciplineScore}
          behavioralRisk={behavioralRisk}
          lowConfidenceTrades={lowConfidenceTrades}
          weakExecutionTrades={weakExecutionTrades}
          totalTrades={totalTrades}
        />
      </div>

      <div
        id="resilience"
        className="mt-8"
      >
        <MentalResilienceReport
          disciplineScore={disciplineScore}
          behavioralRisk={behavioralRisk}
          emotionalTrades={emotionalTrades}
          losses={losses}
          totalTrades={totalTrades}
        />
      </div>

      <div
        id="evolution"
        className="mt-8"
      >
        <TraderEvolutionReport
          disciplineScore={disciplineScore}
          winRate={winRate}
          emotionalTrades={emotionalTrades}
          totalTrades={totalTrades}
        />
      </div>

      <div
        id="coaching"
        className="mt-8"
      >
        <AICoachingReport
          disciplineScore={disciplineScore}
          behavioralRisk={behavioralRisk}
          winRate={winRate}
          emotionalTrades={emotionalTrades}
        />
      </div>

      <div
        id="risk"
        className="mt-8"
      >
        <RiskManagementReport
          averageLoss={averageLoss}
          averageWin={averageWin}
          behavioralRisk={behavioralRisk}
          losses={losses}
        />
      </div>

      <div
        id="consistency"
        className="mt-8"
      >
        <ConsistencyIntelligenceReport
          disciplineScore={disciplineScore}
          winRate={winRate}
          totalTrades={totalTrades}
          emotionalTrades={emotionalTrades}
        />
      </div>

      <div
        id="psychology"
        className="mt-8"
      >
        <PsychologicalStabilityReport
          emotionalTrades={emotionalTrades}
          totalTrades={totalTrades}
          behavioralRisk={behavioralRisk}
          disciplineScore={disciplineScore}
        />
      </div>

      <div
        id="forecast"
        className="mt-8"
      >
        <PerformanceForecastReport
          winRate={winRate}
          disciplineScore={disciplineScore}
          behavioralRisk={behavioralRisk}
          totalPnl={totalPnl}
        />
      </div>

      <h2 className="mt-3 text-3xl font-black text-white">
        Performance Summary
      </h2>

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            Performance Analysis
          </p>

          <h3 className="mt-3 text-xl font-black text-white">
            {totalPnl >= 0
              ? "Performance positiva. Il trader sta mantenendo una struttura operativa profittevole."
              : "Performance negativa. Necessaria revisione di execution e gestione rischio."}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            Consistency Analysis
          </p>

          <h3 className="mt-3 text-xl font-black text-white">
            {winRate >= 50
              ? "La consistenza operativa è sopra la soglia base."
              : "La consistenza è instabile. Focus su qualità setup e disciplina."}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            AI Coaching Insight
          </p>

          <h3 className="mt-3 text-xl font-black text-cyan-400">
            VOLTIS suggerisce di
            mantenere focus sulla
            qualità esecutiva e sulla
            ripetibilità del processo.
          </h3>
        </div>
      </div>
    </div>
  );
}