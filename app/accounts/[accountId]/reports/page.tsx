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
import PrintReportButton from "@/components/reports/PrintReportButton";
import PDFReportHeader from "@/components/reports/PDFReportHeader";
import PDFReportFooter from "@/components/reports/PDFReportFooter";
import PDFCompactReport from "@/components/reports/PDFCompactReport";

function formatCurrency(
  value: number,
  currency: string
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
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

function getRiskTone(value: number) {
  if (value >= 60) {
    return "text-red-400";
  }

  if (value >= 35) {
    return "text-yellow-400";
  }

  return "text-green-400";
}

function getScoreTone(value: number) {
  if (value >= 70) {
    return "text-green-400";
  }

  if (value >= 45) {
    return "text-yellow-400";
  }

  return "text-red-400";
}

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
      include: {
        tradingAccount: true,
      },
    });

  if (!membership) {
    redirect("/accounts");
  }

  if (
    membership.role !== "MANAGER" &&
    !membership.canViewReports
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    membership.tradingAccount.status === "ARCHIVED"
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  const account = membership.tradingAccount;
  const currency = account.currency || "USD";

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
    },

    orderBy: {
      openDate: "desc",
    },
  });

  const totalTrades = trades.length;

  const wins = trades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const losses = trades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const breakEven = trades.filter(
    (trade) => trade.outcome === "be"
  ).length;

  const closedTrades =
    wins + losses + breakEven;

  const totalPnl = trades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const winningTrades = trades.filter(
    (trade) => trade.outcome === "win"
  );

  const losingTrades = trades.filter(
    (trade) => trade.outcome === "loss"
  );

  const grossProfit = winningTrades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const grossLoss = losingTrades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const winRate =
    closedTrades > 0
      ? Math.round((wins / closedTrades) * 100)
      : 0;

  const lossRate =
    closedTrades > 0
      ? Math.round((losses / closedTrades) * 100)
      : 0;

  const averageWin =
    wins > 0 ? grossProfit / wins : 0;

  const averageLoss =
    losses > 0 ? grossLoss / losses : 0;

  const averageResult =
    closedTrades > 0
      ? totalPnl / closedTrades
      : 0;

  const profitFactor =
    Math.abs(grossLoss) > 0
      ? grossProfit / Math.abs(grossLoss)
      : grossProfit > 0
        ? grossProfit
        : 0;

  const emotionalTrades = trades.filter(
    (trade) =>
      trade.emotionalState &&
      trade.emotionalState.length > 0
  ).length;

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

  const disciplineScore =
    closedTrades > 0
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

  const behavioralRisk =
    totalTrades > 0
      ? Math.min(
        100,
        Math.round(
          ((emotionalTrades +
            lowConfidenceTrades +
            weakExecutionTrades) /
            totalTrades) *
          100
        )
      )
      : 0;

  const reportReadiness =
    totalTrades >= 30
      ? "Strong sample"
      : totalTrades >= 10
        ? "Growing sample"
        : "Early sample";

  const accountStatus =
    totalTrades === 0
      ? "Waiting for data"
      : totalPnl >= 0 &&
        behavioralRisk < 35
        ? "Healthy"
        : totalPnl >= 0
          ? "Profitable, monitor behavior"
          : "Needs review";

  const primaryFocus =
    behavioralRisk >= 50
      ? "Reduce behavioral risk before scaling volume."
      : profitFactor < 1
        ? "Improve risk/reward balance and loss control."
        : winRate < 45
          ? "Review setups and entry quality."
          : "Protect the current edge with consistent execution.";

  return (
    <div className="space-y-8 print:space-y-0 print:bg-[#050b10]">
      <PDFCompactReport
        userName={session.user.name ?? "Trader"}
        totalTrades={totalTrades}
        totalPnl={totalPnl}
        winRate={winRate}
        wins={wins}
        losses={losses}
        averageWin={averageWin}
        averageLoss={averageLoss}
        disciplineScore={disciplineScore}
        behavioralRisk={behavioralRisk}
        emotionalTrades={emotionalTrades}
        weakExecutionTrades={weakExecutionTrades}
      />

      <div className="web-report-content space-y-8">
        <div className="print-hidden">
          <PDFReportHeader
            totalTrades={totalTrades}
            totalPnl={totalPnl}
            winRate={winRate}
          />
        </div>

        <div className="print-hidden relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#070b14] via-[#0f1726] to-black p-8 shadow-2xl shadow-cyan-500/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_35%)]" />

          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                VOLTIS AI Reports
              </p>

              <h1 className="mt-4 text-5xl font-black tracking-tight text-white xl:text-7xl">
                Intelligence Reports
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-400 xl:text-lg">
                Un riepilogo operativo per leggere
                performance, comportamento, rischio,
                disciplina ed evoluzione del trader.
              </p>
            </div>

            <div className="shrink-0">
              <PrintReportButton />
            </div>
          </div>
        </div>

        <ReportsNavigation />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              Total Trades
            </p>

            <h2 className="mt-4 text-4xl font-black text-cyan-400">
              {totalTrades}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              {reportReadiness}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              Total PnL
            </p>

            <h2 className={`mt-4 text-4xl font-black ${getResultTone(totalPnl)}`}>
              {formatCurrency(totalPnl, currency)}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Average {formatCurrency(averageResult, currency)}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              Win Rate
            </p>

            <h2 className={`mt-4 text-4xl font-black ${getScoreTone(winRate)}`}>
              {winRate}%
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              {wins}W / {losses}L / {breakEven}BE
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              Behavioral Risk
            </p>

            <h2 className={`mt-4 text-4xl font-black ${getRiskTone(behavioralRisk)}`}>
              {behavioralRisk}%
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Emotion, confidence, execution
            </p>
          </div>
        </div>

        <div className="print-hidden grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 xl:col-span-2">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
              Executive focus
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {accountStatus}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-400">
              {primaryFocus}
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
              Edge quality
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {profitFactor.toFixed(2)}
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Profit factor based on gross profit and
              gross loss. Loss rate is {lossRate}%.
            </p>
          </div>
        </div>

        <div id="executive">
          <ExecutiveSummaryCard
            totalPnl={totalPnl}
            winRate={winRate}
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
          />
        </div>

        <div
          id="weekly"
          className="print-hidden"
        >
          <WeeklyReportCard
            totalTrades={totalTrades}
            totalPnl={totalPnl}
            winRate={winRate}
          />
        </div>

        <div
          id="monthly"
          className="report-section"
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
          className="report-section"
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
          className="report-section"
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
          id="evolution"
          className="print-hidden report-section"
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
          className="report-section"
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
          className="report-section"
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
          className="print-hidden report-section"
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
          className="print-hidden report-section"
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
          className="print-hidden report-section"
        >
          <PerformanceForecastReport
            winRate={winRate}
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
            totalPnl={totalPnl}
          />
        </div>

        <div
          id="growth"
          className="print-hidden report-section"
        >
          <GrowthRoadmapReport
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
            winRate={winRate}
          />
        </div>

        <div
          id="edge"
          className="print-hidden report-section"
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
          className="print-hidden report-section"
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
          className="print-hidden report-section"
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
          className="print-hidden report-section"
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
          className="print-hidden report-section"
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
          className="print-hidden report-section"
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
          className="print-hidden report-section"
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
          className="print-hidden report-section"
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
          className="print-hidden report-section"
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
          className="print-hidden report-section"
        >
          <MentalResilienceReport
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
            emotionalTrades={emotionalTrades}
            losses={losses}
            totalTrades={totalTrades}
          />
        </div>

        <div className="print-hidden">
          <PDFReportFooter />
        </div>
      </div>
    </div>
  );
}
