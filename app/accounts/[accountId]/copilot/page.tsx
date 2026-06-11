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
import AdaptiveCoachingCard from "@/components/copilot/AdaptiveCoachingCard";
import MandatoryReviewCard from "@/components/copilot/MandatoryReviewCard";
import RecoveryChecklistCard from "@/components/copilot/RecoveryChecklistCard";
import RecoveryStatusCard from "@/components/copilot/RecoveryStatusCard";

import { buildCopilotSystem } from "@/lib/copilot";
import { analyzeCopilotMemory } from "@/lib/copilot/copilot-memory";
import { generateAnalysis } from "./actions";
import {
    getArrayCount,
    getCopilotLabels,
    getCopilotStatusLabel,
} from "@/components/copilot/CopilotI18n";
import { renderCopilotText } from "@/components/copilot/CopilotTextRenderer";

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

    const [membership, currentUser] = await Promise.all([
        prisma.accountMember.findFirst({
            where: {
                userId: session.user.id,
                tradingAccountId: accountId,
            },
            include: {
                tradingAccount: true,
            },
        }),
        prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                appLanguage: true,
            },
        }),
    ]);

    if (!membership) {
        redirect("/accounts");
    }

    if (
        membership.role !== "MANAGER" &&
        !membership.canViewCopilot
    ) {
        redirect(`/accounts/${accountId}/dashboard`);
    }

    if (membership.tradingAccount.status === "ARCHIVED") {
        redirect(`/accounts/${accountId}/dashboard`);
    }

    const appLanguage = currentUser?.appLanguage;
    const t = getCopilotLabels(appLanguage);

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

    const copilotPatterns = memorySnapshot.patterns;
    const copilotMemories = memorySnapshot.memories;
    const reviewNotes = memorySnapshot.reviewNotes;

    const criticalPatterns = copilotPatterns.filter(
        (pattern) => pattern.severity === "critical"
    );

    const highPatterns = copilotPatterns.filter(
        (pattern) => pattern.severity === "high"
    );

    const copilotSystem = buildCopilotSystem({
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
        emotionalInstabilityScore,
        emotionalVolatility,
        emotionalLabel,
        riskSignals,
        supervisorLevel,
    } = copilotSystem.stability;

    const riskLabel = getRiskLabel(behavioralRisk);
    const riskTone = getRiskTone(behavioralRisk);
    const riskSignalsCount = getArrayCount(riskSignals);

    
    const translatedIntelligenceFeed = intelligenceFeed.map((item) =>
        renderCopilotText(item, appLanguage)
    );

    const translatedAdaptiveCoachingMessage =
        renderCopilotText(
            adaptiveCoaching.message,
            appLanguage
        );

    const translatedRiskEscalationMessage =
        renderCopilotText(
            riskEscalation.message,
            appLanguage
        );

    const translatedSessionLockReason =
        renderCopilotText(
            sessionLock.lockReason,
            appLanguage
        );

    const translatedLatestTradeReview =
        renderCopilotText(
            latestTradeReview,
            appLanguage
        );

    const translatedReviewNotes = reviewNotes.map((note) => ({
        ...note,
        title: renderCopilotText(note.title, appLanguage),
        content: renderCopilotText(note.content, appLanguage),
    }));

    const translatedCopilotMemories = copilotMemories.map((memory) => ({
        ...memory,
        memoryType: renderCopilotText(memory.memoryType, appLanguage),
        title: renderCopilotText(memory.title, appLanguage),
        description: renderCopilotText(memory.description, appLanguage),
    }));

    const translatedCopilotPatterns = copilotPatterns.map((pattern) => ({
        ...pattern,
        type: renderCopilotText(pattern.type, appLanguage),
        title: renderCopilotText(pattern.title, appLanguage),
        description: renderCopilotText(pattern.description, appLanguage),
    }));

    const translatedCopilotMessages = copilotMessages.map((message) => ({
        ...message,
        content: renderCopilotText(message.content, appLanguage),
    }));
const summaryText =
        totalTrades === 0
            ? t.page.summaryNoData
            : disciplineScore >= 75 && behavioralRisk < 25
                ? t.page.summaryStable
                : behavioralRisk >= 50
                    ? t.page.summaryHighRisk
                    : t.page.summaryDeveloping;

    return (
        <div className="space-y-10">
            <CopilotHero appLanguage={appLanguage} />

            <section className="space-y-4">
                <CriticalAlertCard
                    criticalPatterns={translatedCopilotPatterns.filter(
                        (pattern) => pattern.severity === "critical"
                    )}
                    appLanguage={appLanguage}
                />

                {criticalPatterns.length === 0 &&
                    highPatterns.length > 0 && (
                        <ElevatedRiskCard
                            show={
                                criticalPatterns.length === 0 &&
                                highPatterns.length > 0
                            }
                            highPatternsCount={highPatterns.length}
                            appLanguage={appLanguage}
                        />
                    )}
            </section>

            <section className="rounded-[36px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                            {t.page.controlRoom}
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            {t.page.snapshotTitle}
                        </h2>

                        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
                            {t.page.snapshotDescription}
                        </p>
                    </div>

                    <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                        {membership.tradingAccount.name}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SnapshotCard label={t.common.totalTrades} value={String(totalTrades)} />
                    <SnapshotCard label={t.common.discipline} value={`${disciplineScore}%`} />
                    <SnapshotCard label={t.common.behavioralRisk} value={getCopilotStatusLabel(riskLabel, t)} valueClassName={riskTone} />
                    <SnapshotCard label={t.common.activeMemories} value={String(copilotMemories.length)} valueClassName="text-emerald-400" />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-5">
                <div className="xl:col-span-3">
                    <DailyIntelligenceFeed
                        intelligenceFeed={translatedIntelligenceFeed}
                        appLanguage={appLanguage}
                    />
                </div>

                <div className="xl:col-span-2">
                    <AdaptiveCoachingCard
                        mode={adaptiveCoaching.mode}
                        tone={adaptiveCoaching.tone}
                        message={translatedAdaptiveCoachingMessage}
                        appLanguage={appLanguage}
                    />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <ConsistencyEngineCard
                    consistencyScore={consistencyScore}
                    consistencyLabel={consistencyLabel}
                    disciplineScore={disciplineScore}
                    behavioralRisk={behavioralRisk}
                    appLanguage={appLanguage}
                />

                <AIReviewEngineCard
                    reviewScore={reviewScore}
                    reviewLabel={reviewLabel}
                    averageExecution={averageExecution}
                    averageConfidence={averageConfidence}
                    appLanguage={appLanguage}
                />
            </section>

            <TradeReviewCard
                latestTrade={latestTrade}
                latestTradeReview={translatedLatestTradeReview}
                appLanguage={appLanguage}
            />

            <section className="rounded-[36px] border border-white/10 bg-black/30 p-6 backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                            {t.page.reviewTimeline}
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            {t.page.persistentReviewMemory}
                        </h2>
                    </div>

                    <div className="w-fit rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                        {translatedReviewNotes.length} {t.common.notes}
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    {translatedReviewNotes.length === 0 ? (
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                            <p className="text-sm leading-relaxed text-gray-400">
                                {t.page.noReviewNotes}
                            </p>
                        </div>
                    ) : (
                        translatedReviewNotes.map((note) => (
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
                                        {getCopilotStatusLabel(note.severity, t)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <PerformanceTimelineCard
                        performanceTimeline={performanceTimeline}
                        appLanguage={appLanguage}
                    />
                </div>

                <RecoveryIntelligenceCard
                    recoveryScore={recoveryScore}
                    recoveryLabel={recoveryLabel}
                    recentWins={recentWins}
                    recentLosses={recentLosses}
                    appLanguage={appLanguage}
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <BehavioralDriftCard
                    behavioralDrift={behavioralDrift}
                    recentAverageQuality={recentAverageQuality}
                    previousAverageQuality={previousAverageQuality}
                    appLanguage={appLanguage}
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
                    appLanguage={appLanguage}
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <ExecutionStabilityCard
                    executionDecay={executionDecay}
                    recentExecutionAverage={recentExecutionAverage}
                    previousExecutionAverage={previousExecutionAverage}
                    appLanguage={appLanguage}
                />

                <ConfidenceStabilityCard
                    confidenceDecay={confidenceDecay}
                    recentConfidenceAverage={recentConfidenceAverage}
                    previousConfidenceAverage={previousConfidenceAverage}
                    appLanguage={appLanguage}
                />
            </section>

            <section className="rounded-[36px] border border-red-500/20 bg-red-500/[0.04] p-6 backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-red-400">
                            {t.page.protectionLayer}
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            {t.page.riskSupervision}
                        </h2>

                        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
                            {t.page.riskSupervisionDescription}
                        </p>
                    </div>

                    <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-red-300">
                        {riskSignalsCount} {t.common.signals}
                    </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                    <AIRiskSupervisorCard
                        supervisorLevel={supervisorLevel}
                        riskSignals={riskSignals}
                        behavioralDrift={behavioralDrift}
                        executionDecay={executionDecay}
                        confidenceDecay={confidenceDecay}
                        appLanguage={appLanguage}
                    />

                    <RiskEscalationCard
                        escalationLevel={riskEscalation.escalationLevel}
                        protectionRequired={riskEscalation.protectionRequired}
                        cooldownRecommended={riskEscalation.cooldownRecommended}
                        message={translatedRiskEscalationMessage}
                        appLanguage={appLanguage}
                    />

                    <SessionLockCard
                        sessionLocked={sessionLock.sessionLocked}
                        reviewRequired={sessionLock.reviewRequired}
                        lockReason={translatedSessionLockReason}
                        appLanguage={appLanguage}
                    />

                    <MandatoryReviewCard
                        sessionLocked={sessionLock.sessionLocked}
                        reviewRequired={sessionLock.reviewRequired}
                        appLanguage={appLanguage}
                    />

                    <RecoveryChecklistCard
                        reviewRequired={sessionLock.reviewRequired}
                        appLanguage={appLanguage}
                    />

                    <RecoveryStatusCard
                        sessionLocked={sessionLock.sessionLocked}
                        reviewRequired={sessionLock.reviewRequired}
                        appLanguage={appLanguage}
                    />
                </div>
            </section>

            <section className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/[0.05] p-6 backdrop-blur-xl sm:p-8">
                <div className="grid gap-6 xl:grid-cols-2">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                            {t.page.aiSummary}
                        </p>

                        <h2 className="mt-4 text-3xl font-black text-white">
                            {t.page.operationalIntelligence}
                        </h2>

                        <p className="mt-5 text-sm leading-relaxed text-cyan-100">
                            {summaryText}
                        </p>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
                            {t.page.strategicFocus}
                        </p>

                        <div className="mt-6 space-y-4">
                            {t.page.strategicItems.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                                >
                                    <p className="text-sm leading-relaxed text-gray-300">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-[36px] border border-emerald-500/20 bg-emerald-500/[0.06] p-6 backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                            {t.page.memorySystem}
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            {t.page.activeOperationalMemory}
                        </h2>

                        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
                            {t.page.memoryDescription}
                        </p>
                    </div>

                    <div className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-300">
                        {translatedCopilotMemories.length} {t.common.memories}
                    </div>
                </div>

                <div className="mt-8 grid gap-4 xl:grid-cols-3">
                    {translatedCopilotMemories.length === 0 ? (
                        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 xl:col-span-3">
                            <p className="text-sm leading-relaxed text-gray-400">
                                {t.page.noMemories}
                            </p>
                        </div>
                    ) : (
                        translatedCopilotMemories.slice(0, 6).map((memory) => (
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
                                        className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${getMemoryTone(
                                            memory.severity
                                        )}`}
                                    >
                                        {getCopilotStatusLabel(memory.severity, t)}
                                    </span>
                                </div>

                                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                                    {memory.description}
                                </p>

                                <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                    <span className="text-xs uppercase tracking-[0.15em] text-gray-500">
                                        {t.common.score}
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

            <PatternMemoryCard
                copilotPatterns={translatedCopilotPatterns}
                appLanguage={appLanguage}
            />

            <AnalyzeButton
                accountId={accountId}
                appLanguage={appLanguage}
            />

            <CopilotConversationCard
                copilotMessages={translatedCopilotMessages}
                accountId={accountId}
                appLanguage={appLanguage}
            />
        </div>
    );
}

const ANALYZE_LABELS: Record<string, string> = {
    it: "Analizza il mio andamento",
    en: "Analyze my performance",
    uk: "Проаналізувати мій прогрес",
    ru: "Проанализировать мой прогресс",
    es: "Analizar mi rendimiento",
    fr: "Analyser mes performances",
    de: "Meine Performance analysieren",
};

function AnalyzeButton({
    accountId,
    appLanguage,
}: {
    accountId: string;
    appLanguage?: string | null;
}) {
    const label =
        ANALYZE_LABELS[appLanguage ?? "en"] ??
        "Analyze my performance";

    return (
        <form action={generateAnalysis}>
            <input
                type="hidden"
                name="tradingAccountId"
                value={accountId}
            />

            <button
                type="submit"
                className="w-full rounded-[28px] border border-blue-500/30 bg-blue-500/10 px-6 py-5 text-left transition hover:border-blue-400/50 hover:bg-blue-500/20"
            >
                <p className="text-xs uppercase tracking-[0.2em] text-blue-400">
                    VOLTIS Analyst
                </p>

                <p className="mt-2 text-lg font-black text-white">
                    {label}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    ↩ {appLanguage === "it"
                        ? "Genera analisi completa basata su tutti i tuoi trade"
                        : appLanguage === "uk"
                        ? "Генерувати повний аналіз на основі всіх угод"
                        : appLanguage === "ru"
                        ? "Сгенерировать полный анализ на основе всех сделок"
                        : appLanguage === "es"
                        ? "Generar análisis completo basado en todas tus operaciones"
                        : appLanguage === "fr"
                        ? "Générer une analyse complète basée sur tous vos trades"
                        : appLanguage === "de"
                        ? "Vollständige Analyse basierend auf allen Trades generieren"
                        : "Generate full analysis based on all your trades"}
                </p>
            </button>
        </form>
    );
}

function SnapshotCard({
    label,
    value,
    valueClassName = "text-white",
}: {
    label: string;
    value: string;
    valueClassName?: string;
}) {
    return (
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                {label}
            </p>

            <h3 className={`mt-3 text-3xl font-black ${valueClassName}`}>
                {value}
            </h3>
        </div>
    );
}



