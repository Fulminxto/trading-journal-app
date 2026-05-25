import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { sendCopilotMessage } from "./actions";

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

    const copilotMessages =
        await prisma.copilotMessage.findMany({
            where: {
                tradingAccountId: accountId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

    const totalTrades = trades.length;

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

    const recentQuality =
        performanceTimeline.slice(-5);

    const previousQuality =
        performanceTimeline.slice(-10, -5);

    const recentAverageQuality =
        recentQuality.length > 0
            ? Math.round(
                recentQuality.reduce(
                    (acc, item) => acc + item.qualityScore,
                    0
                ) / recentQuality.length
            )
            : 0;

    const previousAverageQuality =
        previousQuality.length > 0
            ? Math.round(
                previousQuality.reduce(
                    (acc, item) => acc + item.qualityScore,
                    0
                ) / previousQuality.length
            )
            : 0;

    const behavioralDrift =
        previousAverageQuality > 0 &&
        recentAverageQuality < previousAverageQuality - 15;

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

    const wins = trades.filter(
        (trade) => trade.outcome === "win"
    ).length;

    const winRate =
        totalTrades > 0
            ? Math.round((wins / totalTrades) * 100)
            : 0;

    const weakExecutionTrades = trades.filter(
        (trade) =>
            (trade.executionRating || 0) > 0 &&
            (trade.executionRating || 0) <= 4
    ).length;

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

    const behavioralRisk =
        totalTrades > 0
            ? Math.round(
                ((weakExecutionTrades +
                    emotionalTrades +
                    lowConfidenceTrades) /
                    totalTrades) *
                100
            )
            : 0;

    const disciplineScore = Math.max(
        0,
        Math.min(
            100,
            Math.round(
                winRate -
                behavioralRisk * 0.4 +
                (totalTrades > 0 ? 20 : 0)
            )
        )
    );

    const recentTrades = trades
        .slice()
        .sort(
            (a, b) =>
                new Date(b.openDate).getTime() -
                new Date(a.openDate).getTime()
        );

    let lossStreak = 0;

    for (const trade of recentTrades) {
        if (trade.outcome === "loss") {
            lossStreak += 1;
        } else {
            break;
        }
    }

    let winStreak = 0;

    for (const trade of recentTrades) {
        if (trade.outcome === "win") {
            winStreak += 1;
        } else {
            break;
        }
    }

    const revengeRiskTrades = recentTrades.filter(
        (trade, index) => {
            const previousTrade = recentTrades[index + 1];

            if (!previousTrade) {
                return false;
            }

            return (
                previousTrade.outcome === "loss" &&
                ((trade.executionRating || 0) <= 4 ||
                    trade.emotionalState ||
                    (trade.confidence || 0) <= 4)
            );
        }
    ).length;

    const weakTimeTrades = trades.filter((trade) => {
        const hour = trade.openTime
            ? Number(trade.openTime.split(":")[0])
            : null;

        if (hour === null) {
            return false;
        }

        return (
            hour >= 18 &&
            ((trade.executionRating || 0) <= 4 ||
                (trade.confidence || 0) <= 4 ||
                trade.emotionalState)
        );
    }).length;

    const intelligenceFeed: string[] = [];

    if (disciplineScore >= 80) {
        intelligenceFeed.push(
            "La disciplina operativa rimane stabile nelle ultime sessioni."
        );
    }

    if (behavioralRisk >= 50) {
        intelligenceFeed.push(
            "Rilevato aumento del rischio comportamentale operativo."
        );
    }

    if (revengeRiskTrades > 0) {
        intelligenceFeed.push(
            "Possibili segnali di revenge trading dopo operazioni negative."
        );
    }

    if (winStreak >= 3) {
        intelligenceFeed.push(
            `Momentum positivo rilevato: ${winStreak} win consecutivi.`
        );
    }

    if (lossStreak >= 3) {
        intelligenceFeed.push(
            `Drawdown comportamentale rilevato: ${lossStreak} loss consecutivi.`
        );
    }

    if (weakTimeTrades > 0) {
        intelligenceFeed.push(
            "Qualità execution ridotta nelle fasce orarie serali."
        );
    }
    if (behavioralDrift) {
        intelligenceFeed.push(
            `Behavioral drift rilevato: qualità recente ${recentAverageQuality}% vs precedente ${previousAverageQuality}%.`
        );
    }

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

    const recentLosses = recentTrades.filter(
        (trade) => trade.outcome === "loss"
    ).length;

    const recentWins = recentTrades.filter(
        (trade) => trade.outcome === "win"
    ).length;

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

    if (recoveryDetected) {
        intelligenceFeed.push(
            `Recovery intelligence rileva segnali di recupero operativo (${recoveryLabel}).`
        );
    }


    const consistencyLabel =
        consistencyScore >= 80
            ? "Elite"
            : consistencyScore >= 65
                ? "Stable"
                : consistencyScore >= 45
                    ? "Developing"
                    : "Fragile";

    if (consistencyScore >= 80) {
        intelligenceFeed.push(
            "Consistency engine rileva una struttura operativa altamente stabile."
        );
    }

    if (consistencyScore <= 45 && totalTrades > 0) {
        intelligenceFeed.push(
            "Consistency engine rileva instabilità operativa e deterioramento decisionale."
        );
    }

    const averageExecution =
        totalTrades > 0
            ? Math.round(
                trades.reduce(
                    (acc, trade) =>
                        acc + (trade.executionRating || 0),
                    0
                ) / totalTrades
            )
            : 0;

    const averageConfidence =
        totalTrades > 0
            ? Math.round(
                trades.reduce(
                    (acc, trade) =>
                        acc + (trade.confidence || 0),
                    0
                ) / totalTrades
            )
            : 0;

    const reviewScore = Math.max(
        0,
        Math.min(
            100,
            Math.round(
                averageExecution * 10 * 0.5 +
                averageConfidence * 10 * 0.3 +
                consistencyScore * 0.2
            )
        )
    );

    const reviewLabel =
        reviewScore >= 85
            ? "Institutional"
            : reviewScore >= 70
                ? "Advanced"
                : reviewScore >= 50
                    ? "Developing"
                    : "Unstable";

    const latestTrade = recentTrades[0];

    let latestTradeReview = "";

    if (latestTrade) {
        const execution =
            latestTrade.executionRating || 0;

        const confidence =
            latestTrade.confidence || 0;

        if (
            latestTrade.outcome === "win" &&
            execution >= 7 &&
            confidence >= 7
        ) {
            latestTradeReview =
                "Trade recente eseguito con buona qualità decisionale, execution stabile e confidence coerente.";
        } else if (
            latestTrade.outcome === "loss" &&
            execution <= 4
        ) {
            latestTradeReview =
                "La perdita recente mostra segnali di weak execution. Priorità: migliorare selezione setup ed evitare ingressi impulsivi.";
        } else if (
            latestTrade.outcome === "loss" &&
            confidence <= 4
        ) {
            latestTradeReview =
                "La perdita recente evidenzia bassa confidence operativa. Il focus è evitare trade presi senza piena convinzione.";
        } else if (latestTrade.emotionalState) {
            latestTradeReview =
                "Componente emotiva rilevata nel trade recente. VOLTIS consiglia review comportamentale post-sessione.";
        } else {
            latestTradeReview =
                "Il trade recente non mostra anomalie operative significative.";
        }
    }

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

    if (reviewScore >= 85) {
        intelligenceFeed.push(
            "AI Review Engine rileva execution e decision making di livello avanzato."
        );
    }

    if (reviewScore <= 50 && totalTrades > 0) {
        intelligenceFeed.push(
            "AI Review Engine rileva deterioramento nella qualità decisionale e execution."
        );
    }

    if (latestTradeReview.length > 0) {
        intelligenceFeed.push(latestTradeReview);
    }

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#070b14] via-[#0f1726] to-black p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%)]" />

                <div className="relative z-10">
                    <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                        VOLTIS Copilot
                    </p>

                    <h1 className="mt-4 text-5xl font-black tracking-tight text-white xl:text-7xl">
                        AI Trading Copilot
                    </h1>

                    <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-400 xl:text-lg">
                        Assistant intelligente per analizzare performance,
                        comportamento, execution, psicologia operativa e pattern
                        ricorrenti.
                    </p>
                </div>
            </div>

            {criticalPatterns.length > 0 && (
                <div className="rounded-[32px] border border-red-500/30 bg-red-500/10 p-6">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-red-300">
                                Critical Alert
                            </p>

                            <h2 className="mt-3 text-3xl font-black text-white">
                                Behavioral Risk Escalation
                            </h2>

                            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-red-100">
                                VOLTIS ha rilevato pattern comportamentali
                                critici ricorrenti. È consigliata una review
                                operativa immediata e riduzione della frequenza
                                esecutiva.
                            </p>
                        </div>

                        <div className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-red-300">
                            {criticalPatterns.length} Critical
                        </div>
                    </div>
                </div>
            )}

            {criticalPatterns.length === 0 &&
                highPatterns.length > 0 && (
                    <div className="rounded-[32px] border border-yellow-500/30 bg-yellow-500/10 p-6">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <p className="text-sm uppercase tracking-[0.2em] text-yellow-300">
                                    Elevated Risk
                                </p>

                                <h2 className="mt-3 text-3xl font-black text-white">
                                    Behavioral Warning
                                </h2>

                                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-yellow-100">
                                    VOLTIS rileva pattern ad alto rischio che
                                    potrebbero ridurre qualità decisionale,
                                    disciplina ed execution.
                                </p>
                            </div>

                            <div className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-yellow-300">
                                {highPatterns.length} High Risk
                            </div>
                        </div>
                    </div>
                )}

            <div className="rounded-[36px] border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                            Daily Intelligence Feed
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Operational Highlights
                        </h2>
                    </div>

                    <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                        {intelligenceFeed.length} Insights
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    {intelligenceFeed.length === 0 ? (
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                            <p className="text-sm leading-relaxed text-gray-400">
                                Nessun insight operativo disponibile al momento.
                            </p>
                        </div>
                    ) : (
                        intelligenceFeed.map((item) => (
                            <div
                                key={item}
                                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5"
                            >
                                <p className="text-sm leading-relaxed text-gray-300">
                                    {item}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="rounded-[36px] border border-emerald-500/20 bg-emerald-500/10 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                            Consistency Engine
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Operational Stability
                        </h2>
                    </div>

                    <div
                        className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${consistencyScore >= 80
                            ? "bg-emerald-500/20 text-emerald-300"
                            : consistencyScore >= 65
                                ? "bg-cyan-500/20 text-cyan-300"
                                : consistencyScore >= 45
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-red-500/20 text-red-300"
                            }`}
                    >
                        {consistencyLabel}
                    </div>
                </div>

                <div className="mt-8 grid gap-4 xl:grid-cols-3">
                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Consistency Score
                        </p>

                        <h3 className="mt-3 text-4xl font-black text-white">
                            {consistencyScore}%
                        </h3>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Discipline
                        </p>

                        <h3 className="mt-3 text-4xl font-black text-white">
                            {disciplineScore}%
                        </h3>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Behavioral Risk
                        </p>

                        <h3 className="mt-3 text-4xl font-black text-white">
                            {behavioralRisk}%
                        </h3>
                    </div>
                </div>
            </div>

            <div className="rounded-[36px] border border-violet-500/20 bg-violet-500/10 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
                            AI Review Engine
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Decision Quality Analysis
                        </h2>
                    </div>

                    <div
                        className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${reviewScore >= 85
                            ? "bg-emerald-500/20 text-emerald-300"
                            : reviewScore >= 70
                                ? "bg-cyan-500/20 text-cyan-300"
                                : reviewScore >= 50
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-red-500/20 text-red-300"
                            }`}
                    >
                        {reviewLabel}
                    </div>
                </div>

                <div className="mt-8 grid gap-4 xl:grid-cols-3">
                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Review Score
                        </p>

                        <h3 className="mt-3 text-4xl font-black text-white">
                            {reviewScore}%
                        </h3>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Avg Execution
                        </p>

                        <h3 className="mt-3 text-4xl font-black text-white">
                            {averageExecution}/10
                        </h3>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Avg Confidence
                        </p>

                        <h3 className="mt-3 text-4xl font-black text-white">
                            {averageConfidence}/10
                        </h3>
                    </div>
                </div>
            </div>

            <div className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/10 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                            Trade-by-Trade Review
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Latest Trade Intelligence
                        </h2>
                    </div>

                    <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-cyan-300">
                        AI Review
                    </div>
                </div>

                <div className="mt-8 rounded-[28px] border border-white/10 bg-black/20 p-6">
                    {latestTrade ? (
                        <>
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                                        Latest Trade
                                    </p>

                                    <h3 className="mt-2 text-2xl font-black text-white">
                                        {latestTrade.symbol}
                                    </h3>
                                </div>

                                <div
                                    className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${latestTrade.outcome === "win"
                                        ? "bg-emerald-500/20 text-emerald-300"
                                        : latestTrade.outcome === "loss"
                                            ? "bg-red-500/20 text-red-300"
                                            : "bg-yellow-500/20 text-yellow-300"
                                        }`}
                                >
                                    {latestTrade.outcome}
                                </div>
                            </div>

                            <p className="mt-6 text-sm leading-relaxed text-gray-300">
                                {latestTradeReview}
                            </p>

                            <div className="mt-6 grid gap-4 xl:grid-cols-3">
                                <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                                    <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                                        Execution
                                    </p>

                                    <h3 className="mt-2 text-3xl font-black text-white">
                                        {latestTrade.executionRating || 0}/10
                                    </h3>
                                </div>

                                <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                                    <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                                        Confidence
                                    </p>

                                    <h3 className="mt-2 text-3xl font-black text-white">
                                        {latestTrade.confidence || 0}/10
                                    </h3>
                                </div>

                                <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                                    <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                                        Emotional State
                                    </p>

                                    <h3 className="mt-2 text-lg font-black text-white">
                                        {latestTrade.emotionalState || "Stable"}
                                    </h3>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-400">
                            Nessun trade disponibile per la review AI.
                        </p>
                    )}
                </div>
            </div>

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

            <div className="rounded-[36px] border border-violet-500/20 bg-violet-500/10 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
                            AI Performance Timeline
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Trader Evolution Tracking
                        </h2>
                    </div>

                    <div className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-violet-300">
                        {performanceTimeline.length} Trades
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    {performanceTimeline.length === 0 ? (
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                            <p className="text-sm text-gray-400">
                                Nessun dato disponibile per costruire la timeline AI.
                            </p>
                        </div>
                    ) : (
                        performanceTimeline.slice(-8).map((item) => (
                            <div
                                key={item.id}
                                className="rounded-[28px] border border-white/10 bg-black/20 p-5"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                                            Trade #{item.index}
                                        </p>

                                        <h3 className="mt-2 text-xl font-black text-white">
                                            {item.symbol}
                                        </h3>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                                            Quality Score
                                        </p>

                                        <h3
                                            className={`mt-2 text-2xl font-black ${item.qualityScore >= 80
                                                ? "text-emerald-400"
                                                : item.qualityScore >= 60
                                                    ? "text-cyan-400"
                                                    : item.qualityScore >= 40
                                                        ? "text-yellow-300"
                                                        : "text-red-400"
                                                }`}
                                        >
                                            {item.qualityScore}%
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-violet-400"
                                        style={{
                                            width: `${item.qualityScore}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="rounded-[36px] border border-red-500/20 bg-red-500/10 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-red-400">
                            Behavioral Drift Detection
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Quality Decay Monitor
                        </h2>
                    </div>

                    <div
                        className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${behavioralDrift
                            ? "bg-red-500/20 text-red-300"
                            : "bg-emerald-500/20 text-emerald-300"
                            }`}
                    >
                        {behavioralDrift ? "Drift Detected" : "Stable"}
                    </div>
                </div>

                <div className="mt-8 grid gap-4 xl:grid-cols-3">
                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Recent Quality
                        </p>

                        <h3 className="mt-3 text-4xl font-black text-white">
                            {recentAverageQuality}%
                        </h3>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Previous Quality
                        </p>

                        <h3 className="mt-3 text-4xl font-black text-white">
                            {previousAverageQuality}%
                        </h3>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Status
                        </p>

                        <h3
                            className={`mt-3 text-3xl font-black ${behavioralDrift
                                ? "text-red-400"
                                : "text-emerald-400"
                                }`}
                        >
                            {behavioralDrift ? "Decay" : "Stable"}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/10 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                            AI Recovery Intelligence
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Drawdown Recovery Analysis
                        </h2>
                    </div>

                    <div
                        className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${recoveryScore >= 80
                            ? "bg-emerald-500/20 text-emerald-300"
                            : recoveryScore >= 60
                                ? "bg-cyan-500/20 text-cyan-300"
                                : recoveryDetected
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-red-500/20 text-red-300"
                            }`}
                    >
                        {recoveryLabel}
                    </div>
                </div>

                <div className="mt-8 grid gap-4 xl:grid-cols-3">
                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Recovery Score
                        </p>

                        <h3 className="mt-3 text-4xl font-black text-white">
                            {recoveryScore}%
                        </h3>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Recent Wins
                        </p>

                        <h3 className="mt-3 text-4xl font-black text-white">
                            {recentWins}
                        </h3>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Recent Losses
                        </p>

                        <h3 className="mt-3 text-4xl font-black text-white">
                            {recentLosses}
                        </h3>
                    </div>
                </div>
            </div>

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

            <div className="rounded-[36px] border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-amber-400">
                            Pattern Memory
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            Behavioral Intelligence
                        </h2>
                    </div>

                    <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-amber-300">
                        {copilotPatterns.length} Patterns
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    {copilotPatterns.length === 0 ? (
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                            <p className="text-sm leading-relaxed text-gray-400">
                                Nessun pattern comportamentale rilevato al momento.
                            </p>
                        </div>
                    ) : (
                        copilotPatterns.map((pattern) => (
                            <div
                                key={pattern.id}
                                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.15em] text-amber-400">
                                            {pattern.type}
                                        </p>

                                        <h3 className="mt-2 text-xl font-black text-white">
                                            {pattern.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-relaxed text-gray-400">
                                            {pattern.description}
                                        </p>
                                    </div>

                                    <div
                                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${pattern.severity === "critical"
                                            ? "bg-red-600/20 text-red-300"
                                            : pattern.severity === "high"
                                                ? "bg-red-500/10 text-red-400"
                                                : pattern.severity === "medium"
                                                    ? "bg-yellow-500/10 text-yellow-300"
                                                    : "bg-emerald-500/10 text-emerald-400"
                                            }`}
                                    >
                                        {pattern.severity}
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
                                    <span>
                                        Occurrences: {pattern.occurrences}
                                    </span>

                                    <span>
                                        Updated recently
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                            AI Conversation
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                            VOLTIS Assistant
                        </h2>
                    </div>

                    <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-400">
                        Online
                    </div>
                </div>

                <div className="mt-8 space-y-6">
                    {copilotMessages.length === 0 ? (
                        <div className="max-w-2xl rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                            <p className="text-sm leading-relaxed text-gray-300">
                                Ciao, sono VOLTIS Copilot. Scrivimi una domanda sul tuo account, sulla tua performance o sui tuoi pattern operativi.
                            </p>
                        </div>
                    ) : (
                        copilotMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`max-w-2xl rounded-[28px] border p-5 ${message.role === "user"
                                    ? "ml-auto border-cyan-500/20 bg-cyan-500/10"
                                    : "border-white/10 bg-white/[0.04]"
                                    }`}
                            >
                                <p
                                    className={`text-sm leading-relaxed ${message.role === "user"
                                        ? "text-cyan-100"
                                        : "text-gray-300"
                                        }`}
                                >
                                    {message.content}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <form
                    action={sendCopilotMessage}
                    className="mt-8 flex items-center gap-4"
                >
                    <input
                        type="hidden"
                        name="tradingAccountId"
                        value={accountId}
                    />

                    <input
                        type="text"
                        name="content"
                        placeholder="Ask VOLTIS Copilot..."
                        className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none placeholder:text-gray-500"
                    />

                    <button className="h-14 rounded-2xl bg-cyan-500 px-6 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-cyan-400">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}