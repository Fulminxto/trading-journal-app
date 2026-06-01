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
import ElevatedRiskCard from "@/components/copilot/ElevatedRiskCard";
import RiskEscalationCard from "@/components/copilot/RiskEscalationCard";
import SessionLockCard from "@/components/copilot/SessionLockCard";
import { buildCopilotSystem } from "@/lib/copilot";
import AdaptiveCoachingCard from "@/components/copilot/AdaptiveCoachingCard";
import MandatoryReviewCard from "@/components/copilot/MandatoryReviewCard";
import RecoveryChecklistCard from "@/components/copilot/RecoveryChecklistCard";
import RecoveryStatusCard from "@/components/copilot/RecoveryStatusCard";
import { analyzeCopilotMemory } from "@/lib/copilot/copilot-memory";

function getRiskLabel(behavioralRisk: number) {
    if (behavioralRisk >= 50) {
        return "High";
    }

    if (behavioralRisk >= 25) {
        return "Medium";
    }

    return "Low";
}

function getRiskTone(behavioralRisk: number) {
    if (behavioralRisk >= 50) {
        return "text-red-400";
    }

    if (behavioralRisk >= 25) {
        return "text-yellow-300";
    }

    return "text-emerald-400";
}

function getMemoryTone(severity: string) {
    if (severity === "critical") {
        return "bg-red-500/10 text-red-400";
    }

    if (severity === "high") {
        return "bg-orange-500/10 text-orange-300";
    }

    if (severity === "medium") {
        return "bg-yellow-500/10 text-yellow-300";
    }

    return "bg-emerald-500/10 text-emerald-400";
}

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
            include: {
                tradingAccount: true,
            },
        });

    if (!membership) {
        redirect("/accounts");
    }

    if (
        membership.role !== "MANAGER" &&
        !membership.canViewCopilot
    ) {
        redirect(`/accounts/${accountId}/dashboard`);
    }

    if (
        membership.tradingAccount.status === "ARCHIVED"
    ) {
        redirect(`/accounts/${accountId}/dashboard`);
    }

    const trades = await prisma.trade.findMany({
        where: {
            tradingAccountId: accountId,
        },
        orderBy: {
            openDate: "desc",
        },
    });

    const copilotMessages =
        await prisma.copilotMessage.findMany({
            where: {
                tradingAccountId: accountId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

    const memorySnapshot =
        await analyzeCopilotMemory(accountId);

    const copilotPatterns =
        memorySnapshot.patterns;

    const copilotMemories =
        memorySnapshot.memories;

    const reviewNotes =
        memorySnapshot.reviewNotes;

    const criticalPatterns =
        copilotPatterns.filter(
            (pattern) => pattern.severity === "critical"
        );

    const highPatterns =
        copilotPatterns.filter(
            (pattern) => pattern.severity === "high"
        );

    const copilotSystem =
        buildCopilotSystem({
            trades,
            copilotMemories,
        });

    const {
        performanceTimeline,
        consistencyScore,
        consistencyLabel,
        intelligenceFeed,
        adaptiveCoaching,
        riskEscalation,
        sessionLock,
        recoveryScore,
        recoveryLabel,
        recentWins,
        recentLosses,
    } = copilotSystem;

    const {
        totalTrades,
        behavioralRisk,
        disciplineScore,
    } = copilotSystem.analytics;

    const {
        averageExecution,
        averageConfidence,
        reviewScore,
        reviewLabel,
        latestTrade,
        latestTradeReview,
    } = copilotSystem.review;

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
    } = copilotSystem.stability;

    const riskLabel = getRiskLabel(behavioralRisk);

    const riskTone = getRiskTone(behavioralRisk);

    const summaryText =
        totalTrades === 0
            ? "Non ci sono ancora abbastanza dati per generare una lettura intelligente del conto."
            : disciplineScore >= 75 && behavioralRisk < 25
                ? "VOLTIS ha rilevato una struttura operativa stabile. La disciplina rimane elevata e il rischio comportamentale appare controllato."
                : behavioralRisk >= 50
                    ? "VOLTIS rileva segnali di rischio comportamentale elevato. Serve ridurre impulsività, migliorare review e proteggere execution."
                    : "VOLTIS rileva una struttura in sviluppo. Il focus principale è migliorare consistenza, selezione setup e stabilità decisionale.";

    return (
        <div className="space-y-10">
            <CopilotHero />

            <section className="space-y-4">
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
            </section>

            <section className="rounded-[36px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                            Copilot Control Room
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Account Intelligence Snapshot
                        </h2>

                        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
                            Una lettura rapida dello stato operativo del conto:
                            disciplina, rischio comportamentale, review e memoria attiva.
                        </p>
                    </div>

                    <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                        {membership.tradingAccount.name}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                            Total Trades
                        </p>

                        <h3 className="mt-3 text-3xl font-black text-white">
                            {totalTrades}
                        </h3>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                            Discipline
                        </p>

                        <h3 className="mt-3 text-3xl font-black text-white">
                            {disciplineScore}%
                        </h3>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                            Behavioral Risk
                        </p>

                        <h3 className={`mt-3 text-3xl font-black ${riskTone}`}>
                            {riskLabel}
                        </h3>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                            Active Memories
                        </p>

                        <h3 className="mt-3 text-3xl font-black text-emerald-400">
                            {copilotMemories.length}
                        </h3>
                    </div>
                </div>
            </section>

            <section className="grid items-stretch gap-6 xl:grid-cols-5">
                <div className="flex xl:col-span-3 [&>*]:h-full [&>*]:w-full">
                    <DailyIntelligenceFeed
                        intelligenceFeed={intelligenceFeed}
                    />
                </div>

                <div className="flex xl:col-span-2 [&>*]:h-full [&>*]:w-full">
                    <AdaptiveCoachingCard
                        mode={adaptiveCoaching.mode}
                        tone={adaptiveCoaching.tone}
                        message={adaptiveCoaching.message}
                    />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
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
            </section>

            <TradeReviewCard
                latestTrade={latestTrade}
                latestTradeReview={latestTradeReview}
            />

            <section className="rounded-[36px] border border-white/10 bg-black/30 p-6 backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                            AI Review Timeline
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Persistent Review Memory
                        </h2>
                    </div>

                    <div className="w-fit rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
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
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.15em] text-cyan-400">
                                            {note.title}
                                        </p>

                                        <p className="mt-3 text-sm leading-relaxed text-gray-300">
                                            {note.content}
                                        </p>
                                    </div>

                                    <div
                                        className={`w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${note.severity === "high"
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
            </section>

            <section className="grid items-stretch gap-6 xl:grid-cols-3">
                <div className="flex xl:col-span-2 [&>*]:h-full [&>*]:w-full">
                    <PerformanceTimelineCard
                        performanceTimeline={performanceTimeline}
                    />
                </div>

                <div className="flex [&>*]:h-full [&>*]:w-full">
                    <RecoveryIntelligenceCard
                        recoveryScore={recoveryScore}
                        recoveryLabel={recoveryLabel}
                        recentWins={recentWins}
                        recentLosses={recentLosses}
                    />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <BehavioralDriftCard
                    behavioralDrift={behavioralDrift}
                    recentAverageQuality={recentAverageQuality}
                    previousAverageQuality={previousAverageQuality}
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
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
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
            </section>

            <section className="rounded-[36px] border border-red-500/20 bg-red-500/[0.04] p-6 backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-red-400">
                            Protection Layer
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Risk Supervision
                        </h2>

                        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
                            Controlli dedicati a rischio, escalation, blocco sessione e recupero operativo.
                        </p>
                    </div>

                    <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-red-300">
                        {riskSignals} Signals
                    </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                    <AIRiskSupervisorCard
                        supervisorLevel={supervisorLevel}
                        riskSignals={riskSignals}
                        behavioralDrift={behavioralDrift}
                        executionDecay={executionDecay}
                        confidenceDecay={confidenceDecay}
                    />

                    <RiskEscalationCard
                        escalationLevel={riskEscalation.escalationLevel}
                        protectionRequired={riskEscalation.protectionRequired}
                        cooldownRecommended={riskEscalation.cooldownRecommended}
                        message={riskEscalation.message}
                    />

                    <SessionLockCard
                        sessionLocked={sessionLock.sessionLocked}
                        reviewRequired={sessionLock.reviewRequired}
                        lockReason={sessionLock.lockReason}
                    />

                    <MandatoryReviewCard
                        sessionLocked={sessionLock.sessionLocked}
                        reviewRequired={sessionLock.reviewRequired}
                    />

                    <RecoveryChecklistCard
                        reviewRequired={sessionLock.reviewRequired}
                    />

                    <RecoveryStatusCard
                        sessionLocked={sessionLock.sessionLocked}
                        reviewRequired={sessionLock.reviewRequired}
                    />
                </div>
            </section>

            <section className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/[0.05] p-6 backdrop-blur-xl sm:p-8">
                <div className="grid gap-6 xl:grid-cols-2">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                            AI Summary
                        </p>

                        <h2 className="mt-4 text-3xl font-black text-white">
                            Operational Intelligence
                        </h2>

                        <p className="mt-5 text-sm leading-relaxed text-cyan-100">
                            {summaryText}
                        </p>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
                            Strategic Focus
                        </p>

                        <div className="mt-6 space-y-4">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <p className="text-sm leading-relaxed text-gray-300">
                                    Ridurre frequenza operativa dopo una perdita consecutiva.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <p className="text-sm leading-relaxed text-gray-300">
                                    Proteggere qualità execution durante alta volatilità.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <p className="text-sm leading-relaxed text-gray-300">
                                    Mantenere focus su setup ad alta probabilità.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-[36px] border border-emerald-500/20 bg-emerald-500/[0.06] p-6 backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                            Copilot Memory System
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Active Operational Memory
                        </h2>

                        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
                            VOLTIS conserva pattern, rischi e punti di forza ricorrenti del tuo account per rendere il Copilot sempre più contestuale.
                        </p>
                    </div>

                    <div className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-300">
                        {copilotMemories.length} Memories
                    </div>
                </div>

                <div className="mt-8 grid gap-4 xl:grid-cols-3">
                    {copilotMemories.length === 0 ? (
                        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 xl:col-span-3">
                            <p className="text-sm leading-relaxed text-gray-400">
                                Nessuna memoria operativa attiva. Usa il Copilot dopo aver inserito trade, sessioni e review per generare pattern persistenti.
                            </p>
                        </div>
                    ) : (
                        copilotMemories.slice(0, 6).map((memory) => (
                            <div
                                key={memory.id}
                                className="rounded-[28px] border border-white/10 bg-black/20 p-5"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                                            {memory.memoryType}
                                        </p>

                                        <h3 className="mt-3 text-lg font-black text-white">
                                            {memory.title}
                                        </h3>
                                    </div>

                                    <span
                                        className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${getMemoryTone(memory.severity)}`}
                                    >
                                        {memory.severity}
                                    </span>
                                </div>

                                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                                    {memory.description}
                                </p>

                                <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                    <span className="text-xs uppercase tracking-[0.15em] text-gray-500">
                                        Score
                                    </span>

                                    <span className="text-sm font-black text-white">
                                        {memory.score}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <PatternMemoryCard copilotPatterns={copilotPatterns} />

            <CopilotConversationCard
                copilotMessages={copilotMessages}
                accountId={accountId}
            />
        </div>
    );
}
