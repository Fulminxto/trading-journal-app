import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import CopilotHero from "@/components/copilot/CopilotHero";
import CriticalAlertCard from "@/components/copilot/CriticalAlertCard";
import DailyIntelligenceFeed from "@/components/copilot/DailyIntelligenceFeed";
import ConsistencyEngineCard from "@/components/copilot/ConsistencyEngineCard";
import AIReviewEngineCard from "@/components/copilot/AIReviewEngineCard";
import TradeReviewCard from "@/components/copilot/TradeReviewCard";
import PerformanceTimelineCard from "@/components/copilot/PerformanceTimelineCard";
import BehavioralDriftCard from "@/components/copilot/BehavioralDriftCard";
import RecoveryIntelligenceCard from "@/components/copilot/RecoveryIntelligenceCard";
import ExecutionStabilityCard from "@/components/copilot/ExecutionStabilityCard";
import ConfidenceStabilityCard from "@/components/copilot/ConfidenceStabilityCard";
import AIRiskSupervisorCard from "@/components/copilot/AIRiskSupervisorCard";
import EmotionalStabilityCard from "@/components/copilot/EmotionalStabilityCard";
import PatternMemoryCard from "@/components/copilot/PatternMemoryCard";
import CopilotConversationCard from "@/components/copilot/CopilotConversationCard";
import { calculateCopilotAnalytics } from "@/lib/copilot/analytics";
import { buildIntelligenceFeed } from "@/lib/copilot/intelligence";
import { calculateStabilityMetrics } from "@/lib/copilot/stability";
import ElevatedRiskCard from "@/components/copilot/ElevatedRiskCard";
import { calculateReviewMetrics } from "@/lib/copilot/review";
import { calculatePatternMetrics } from "@/lib/copilot/patterns";

export default async function CopilotPage({
    params,
}: {
    params: Promise<{ accountId: string }>;
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

    const {
        totalTrades,
        winRate,
        behavioralRisk,
        disciplineScore,
        recentTrades,
        lossStreak,
        winStreak,
    } = calculateCopilotAnalytics(trades);

    const patternMetrics =
        calculatePatternMetrics(recentTrades);

    const {
        revengeRiskTrades,
        weakTimeTrades,
    } = patternMetrics;

    const copilotMessages =
        await prisma.copilotMessage.findMany({
            where: {
                tradingAccountId: accountId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

    const copilotPatterns =
        await prisma.copilotPattern.findMany({
            where: {
                tradingAccountId: accountId,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

    const reviewNotes =
        await prisma.copilotReviewNote.findMany({
            where: {
                tradingAccountId: accountId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        });

    const criticalPatterns =
        copilotPatterns.filter(
            (pattern) =>
                pattern.severity === "critical"
        );

    const highPatterns =
        copilotPatterns.filter(
            (pattern) =>
                pattern.severity === "high"
        );

    const performanceTimeline = trades
        .slice()
        .sort(
            (a, b) =>
                new Date(a.openDate).getTime() -
                new Date(b.openDate).getTime()
        )
        .map((trade, index) => {
            const execution = trade.executionRating || 0;
            const confidence = trade.confidence || 0;
            const isEmotional =
                trade.emotionalState &&
                trade.emotionalState.length > 0;

            const qualityScore = Math.max(
                0,
                Math.min(
                    100,
                    Math.round(
                        execution * 5 +
                        confidence * 3 +
                        (trade.outcome === "win" ? 20 : 0) -
                        (isEmotional ? 15 : 0)
                    )
                )
            );

            return {
                id: trade.id,
                index: index + 1,
                symbol: trade.symbol,
                outcome: trade.outcome,
                qualityScore,
            };
        });

    const consistencyScore =
        totalTrades === 0
            ? 0
            : Math.max(
                0,
                Math.min(
                    100,
                    Math.round(
                        winRate * 0.45 +
                        disciplineScore * 0.35 -
                        behavioralRisk * 0.2
                    )
                )
            );

    const consistencyLabel =
        consistencyScore >= 80
            ? "Elite"
            : consistencyScore >= 65
                ? "Stable"
                : consistencyScore >= 45
                    ? "Developing"
                    : "Fragile";

    const review =
        calculateReviewMetrics({
            trades,
            recentTrades,
            totalTrades,
            consistencyScore,
        });

    const {
        averageExecution,
        averageConfidence,
        reviewScore,
        reviewLabel,
        latestTrade,
        latestTradeReview,
    } = review;

    const recentLosses = recentTrades
        .slice(0, 10)
        .filter((trade) => trade.outcome === "loss")
        .length;

    const recentWins = recentTrades
        .slice(0, 10)
        .filter((trade) => trade.outcome === "win")
        .length;

    const recoveryDetected =
        recentLosses >= 2 &&
        recentWins >= recentLosses;

    const recoveryScore =
        recoveryDetected
            ? Math.min(
                100,
                Math.round(
                    consistencyScore * 0.5 +
                    disciplineScore * 0.3 +
                    winRate * 0.2
                )
            )
            : 0;

    const recoveryLabel =
        recoveryScore >= 80
            ? "Strong Recovery"
            : recoveryScore >= 60
                ? "Stable Recovery"
                : recoveryDetected
                    ? "Weak Recovery"
                    : "No Recovery";

    const stability =
        calculateStabilityMetrics({
            performanceTimeline,
            recentTrades,
            behavioralRisk,
            recoveryDetected,
            recoveryScore,
        });

    const {
        recentAverageQuality,
        previousAverageQuality,
        behavioralDrift,
        recentExecutionAverage,
        previousExecutionAverage,
        executionDecay,
        recentConfidenceAverage,
        previousConfidenceAverage,
        confidenceDecay,
        emotionalRecentTrades,
        emotionalTradesCount,
        emotionalInstabilityScore,
        emotionalVolatility,
        emotionalLabel,
        riskSignals,
        supervisorLevel,
    } = stability;

    const riskLabel =
        behavioralRisk >= 50
            ? "High"
            : behavioralRisk >= 25
                ? "Medium"
                : "Low";

    const summaryText =
        totalTrades === 0
            ? "Non ci sono ancora abbastanza dati per generare una lettura intelligente del conto."
            : disciplineScore >= 75 && behavioralRisk < 25
                ? "VOLTIS ha rilevato una struttura operativa stabile. La disciplina rimane elevata e il rischio comportamentale appare controllato."
                : behavioralRisk >= 50
                    ? "VOLTIS rileva segnali di rischio comportamentale elevato. Serve ridurre impulsività, migliorare review e proteggere execution."
                    : "VOLTIS rileva una struttura in sviluppo. Il focus principale è migliorare consistenza, selezione setup e stabilità decisionale.";

    const intelligenceFeed = buildIntelligenceFeed({
        disciplineScore,
        behavioralRisk,
        revengeRiskTrades,
        winStreak,
        lossStreak,
        weakTimeTrades,
        behavioralDrift,
        recentAverageQuality,
        previousAverageQuality,
        recoveryDetected,
        recoveryLabel,
        executionDecay,
        recentExecutionAverage,
        previousExecutionAverage,
        confidenceDecay,
        recentConfidenceAverage,
        previousConfidenceAverage,
        supervisorLevel,
        emotionalVolatility,
        emotionalInstabilityScore,
        consistencyScore,
        totalTrades,
        reviewScore,
        latestTradeReview,
    });

    return (
        <div className="space-y-8">
            <CopilotHero />

            <CriticalAlertCard
                criticalPatterns={criticalPatterns}
            />

            {criticalPatterns.length === 0 &&
                highPatterns.length > 0 && (
                    <ElevatedRiskCard
                        show={
                            criticalPatterns.length === 0 &&
                            highPatterns.length > 0
                        }
                        highPatternsCount={highPatterns.length}
                    />
                )}

            <DailyIntelligenceFeed
                intelligenceFeed={intelligenceFeed}
            />

            <ConsistencyEngineCard
                consistencyScore={consistencyScore}
                consistencyLabel={consistencyLabel}
                disciplineScore={disciplineScore}
                behavioralRisk={behavioralRisk}
            />

            <AIReviewEngineCard
                reviewScore={reviewScore}
                reviewLabel={reviewLabel}
                averageExecution={averageExecution}
                averageConfidence={averageConfidence}
            />

            <TradeReviewCard
                latestTrade={latestTrade}
                latestTradeReview={latestTradeReview}
            />

            <div className="rounded-[36px] border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                            AI Review Timeline
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Persistent Review Memory
                        </h2>
                    </div>

                    <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                        {reviewNotes.length} Notes
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    {reviewNotes.length === 0 ? (
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                            <p className="text-sm leading-relaxed text-gray-400">
                                Nessuna review AI salvata al momento.
                            </p>
                        </div>
                    ) : (
                        reviewNotes.map((note) => (
                            <div
                                key={note.id}
                                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.15em] text-cyan-400">
                                            {note.title}
                                        </p>

                                        <p className="mt-3 text-sm leading-relaxed text-gray-300">
                                            {note.content}
                                        </p>
                                    </div>

                                    <div
                                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${note.severity === "high"
                                            ? "bg-red-500/10 text-red-400"
                                            : note.severity === "medium"
                                                ? "bg-yellow-500/10 text-yellow-300"
                                                : "bg-emerald-500/10 text-emerald-400"
                                            }`}
                                    >
                                        {note.severity}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <PerformanceTimelineCard
                performanceTimeline={performanceTimeline}
            />

            <BehavioralDriftCard
                behavioralDrift={behavioralDrift}
                recentAverageQuality={recentAverageQuality}
                previousAverageQuality={previousAverageQuality}
            />

            <RecoveryIntelligenceCard
                recoveryScore={recoveryScore}
                recoveryLabel={recoveryLabel}
                recentWins={recentWins}
                recentLosses={recentLosses}
            />

            <ExecutionStabilityCard
                executionDecay={executionDecay}
                recentExecutionAverage={recentExecutionAverage}
                previousExecutionAverage={previousExecutionAverage}
            />

            <ConfidenceStabilityCard
                confidenceDecay={confidenceDecay}
                recentConfidenceAverage={recentConfidenceAverage}
                previousConfidenceAverage={previousConfidenceAverage}
            />

            <AIRiskSupervisorCard
                supervisorLevel={supervisorLevel}
                riskSignals={riskSignals}
                behavioralDrift={behavioralDrift}
                executionDecay={executionDecay}
                confidenceDecay={confidenceDecay}
            />

            <EmotionalStabilityCard
                emotionalLabel={emotionalLabel}
                emotionalInstabilityScore={emotionalInstabilityScore}
                emotionalVolatility={emotionalVolatility}
                emotionalTradesCount={
                    emotionalRecentTrades.filter(
                        (trade) =>
                            trade.emotionalState &&
                            trade.emotionalState.length > 0
                    ).length
                }
            />

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
                    Coming Intelligence Layer
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                    Copilot Engine
                </h2>

                <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-400">
                    In questa sezione costruiremo il layer AI di VOLTIS:
                    analisi automatica dei trade, coaching dinamico,
                    pattern detection, warning comportamentali e suggerimenti
                    operativi contestuali.
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                        Behavioral Detection
                    </p>

                    <h3 className="mt-4 text-2xl font-black text-white">
                        Emotional Trading
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-gray-400">
                        VOLTIS analizzerà pattern emotivi, overtrading, revenge
                        trading e instabilità decisionale.
                    </p>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-500/10 to-violet-500/5 p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
                        AI Coaching
                    </p>

                    <h3 className="mt-4 text-2xl font-black text-white">
                        Dynamic Coaching
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-gray-400">
                        Coaching operativo dinamico basato sui tuoi dati reali e
                        comportamento.
                    </p>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                        Pattern Intelligence
                    </p>

                    <h3 className="mt-4 text-2xl font-black text-white">
                        Pattern Recognition
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-gray-400">
                        Riconoscimento automatico di pattern profittevoli e
                        comportamenti ricorrenti.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[32px] border border-cyan-500/20 bg-cyan-500/10 p-7">
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                        AI Summary
                    </p>

                    <h2 className="mt-4 text-3xl font-black text-white">
                        Operational Intelligence
                    </h2>

                    <p className="mt-5 text-sm leading-relaxed text-cyan-100">
                        {summaryText}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                                Discipline
                            </p>

                            <h3 className="mt-2 text-2xl font-black text-white">
                                {disciplineScore}%
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                                Behavioral Risk
                            </p>

                            <h3 className="mt-2 text-2xl font-black text-emerald-400">
                                {riskLabel}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-[32px] border border-violet-500/20 bg-violet-500/10 p-7">
                    <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
                        AI Recommendations
                    </p>

                    <h2 className="mt-4 text-3xl font-black text-white">
                        Strategic Focus
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm leading-relaxed text-gray-300">
                                Ridurre frequenza operativa dopo una perdita consecutiva.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm leading-relaxed text-gray-300">
                                Proteggere qualità execution durante alta volatilità.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm leading-relaxed text-gray-300">
                                Mantenere focus su setup ad alta probabilità.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <PatternMemoryCard copilotPatterns={copilotPatterns} />

            <CopilotConversationCard
                copilotMessages={copilotMessages}
                accountId={accountId}
            />
        </div>
    );
}