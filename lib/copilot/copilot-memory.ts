import { prisma } from "@/lib/prisma";

type Severity =
    | "low"
    | "medium"
    | "high"
    | "critical";

type MemoryInsight = {
    id: string;
    memoryType: string;
    title: string;
    description: string;
    severity: Severity;
    score: number;
};

function getSeverityFromScore(
    score: number
): Severity {
    if (score >= 80) return "critical";
    if (score >= 55) return "high";
    if (score >= 30) return "medium";
    return "low";
}

function getPositiveSeverityFromScore(
    score: number
): Severity {
    if (score >= 75) return "low";
    if (score >= 50) return "medium";
    if (score >= 25) return "high";
    return "critical";
}

function getSessionFromTrade(
    openTime?: string | null,
    fallback?: string | null
) {
    if (fallback) {
        return fallback;
    }

    if (!openTime) {
        return "Unknown";
    }

    const hour = Number(
        openTime.split(":")[0]
    );

    if (!Number.isFinite(hour)) {
        return "Unknown";
    }

    if (hour >= 7 && hour < 13) {
        return "London";
    }

    if (hour >= 13 && hour < 22) {
        return "New York";
    }

    return "Asia";
}

function round(value: number) {
    return Math.round(value);
}

function percentage(
    value: number,
    total: number
) {
    if (total <= 0) return 0;

    return round((value / total) * 100);
}

async function upsertMemory(
    accountId: string,
    insight: MemoryInsight
) {
    await prisma.copilotMemory.upsert({
        where: {
            id: insight.id,
        },

        update: {
            memoryType: insight.memoryType,
            title: insight.title,
            description: insight.description,
            severity: insight.severity,
            score: insight.score,
        },

        create: {
            id: insight.id,
            tradingAccountId: accountId,
            memoryType: insight.memoryType,
            title: insight.title,
            description: insight.description,
            severity: insight.severity,
            score: insight.score,
        },
    });
}

async function upsertPattern({
    accountId,
    id,
    type,
    title,
    description,
    severity,
    occurrences,
}: {
    accountId: string;
    id: string;
    type: string;
    title: string;
    description: string;
    severity: Severity;
    occurrences: number;
}) {
    if (occurrences <= 0) {
        return;
    }

    await prisma.copilotPattern.upsert({
        where: {
            id,
        },

        update: {
            type,
            title,
            description,
            severity,
            occurrences,
        },

        create: {
            id,
            tradingAccountId: accountId,
            type,
            title,
            description,
            severity,
            occurrences,
        },
    });
}

export async function analyzeCopilotMemory(
    accountId: string
) {
    const account =
        await prisma.tradingAccount.findUnique({
            where: {
                id: accountId,
            },
        });

    if (!account) {
        return getCopilotMemorySnapshot(
            accountId
        );
    }

    const trades = await prisma.trade.findMany({
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
    });

    const sessions =
        await prisma.tradingSession.findMany({
            where: {
                tradingAccountId: accountId,
            },
            orderBy: {
                date: "desc",
            },
            take: 30,
        });

    const latestGoal =
        await prisma.tradingGoal.findFirst({
            where: {
                tradingAccountId: accountId,
            },
            orderBy: [
                {
                    year: "desc",
                },
                {
                    month: "desc",
                },
            ],
        });

    const totalTrades = trades.length;

    if (totalTrades === 0) {
        await upsertMemory(accountId, {
            id: `${accountId}:profile:no-data`,
            memoryType: "profile",
            title: "Not Enough Trading Data",
            description:
                "VOLTIS does not have enough trades yet to build reliable operational memory.",
            severity: "low",
            score: 0,
        });

        return getCopilotMemorySnapshot(
            accountId
        );
    }

    const wins = trades.filter(
        (trade) => trade.outcome === "win"
    ).length;
const winRate = percentage(
        wins,
        totalTrades
    );

    const totalPnl = trades.reduce(
        (sum, trade) =>
            sum + (trade.resultUsd || 0),
        0
    );

    const weakExecutionTrades =
        trades.filter(
            (trade) =>
                (trade.executionRating || 0) > 0 &&
                (trade.executionRating || 0) <= 4
        ).length;

    const lowConfidenceTrades =
        trades.filter(
            (trade) =>
                (trade.confidence || 0) > 0 &&
                (trade.confidence || 0) <= 4
        ).length;

    const emotionalTrades =
        trades.filter(
            (trade) =>
                Boolean(
                    trade.emotionalState &&
                    trade.emotionalState.trim()
                )
        ).length;

    const behavioralRisk = percentage(
        weakExecutionTrades +
        lowConfidenceTrades +
        emotionalTrades,
        totalTrades * 3
    );

    const disciplineScore = Math.max(
        0,
        Math.min(
            100,
            round(
                winRate -
                behavioralRisk * 0.35 +
                (totalTrades >= 10 ? 15 : 5)
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
    let winStreak = 0;

    for (const trade of recentTrades) {
        if (trade.outcome === "loss") {
            lossStreak += 1;
        } else {
            break;
        }
    }

    for (const trade of recentTrades) {
        if (trade.outcome === "win") {
            winStreak += 1;
        } else {
            break;
        }
    }

    let revengeRiskTrades = 0;

    for (
        let index = 1;
        index < trades.length;
        index += 1
    ) {
        const previousTrade =
            trades[index - 1];

        const currentTrade = trades[index];

        const currentIsWeak =
            (currentTrade.executionRating || 0) <=
            4 ||
            (currentTrade.confidence || 0) <= 4 ||
            Boolean(
                currentTrade.emotionalState
            );

        if (
            previousTrade.outcome === "loss" &&
            currentIsWeak
        ) {
            revengeRiskTrades += 1;
        }
    }

    const marketStats = trades.reduce(
        (acc, trade) => {
            const symbol =
                trade.symbol || "Unknown";

            if (!acc[symbol]) {
                acc[symbol] = {
                    trades: 0,
                    pnl: 0,
                    wins: 0,
                };
            }

            acc[symbol].trades += 1;
            acc[symbol].pnl +=
                trade.resultUsd || 0;

            if (trade.outcome === "win") {
                acc[symbol].wins += 1;
            }

            return acc;
        },
        {} as Record<
            string,
            {
                trades: number;
                pnl: number;
                wins: number;
            }
        >
    );

    const marketEntries = Object.entries(
        marketStats
    ).filter(
        ([, stats]) => stats.trades >= 2
    );

    const bestMarket =
        marketEntries
            .slice()
            .sort(
                (a, b) => b[1].pnl - a[1].pnl
            )[0] || null;

    const worstMarket =
        marketEntries
            .slice()
            .sort(
                (a, b) => a[1].pnl - b[1].pnl
            )[0] || null;

    const sessionStats = trades.reduce(
        (acc, trade) => {
            const session =
                getSessionFromTrade(
                    trade.openTime,
                    trade.session
                );

            if (!acc[session]) {
                acc[session] = {
                    trades: 0,
                    pnl: 0,
                    wins: 0,
                };
            }

            acc[session].trades += 1;
            acc[session].pnl +=
                trade.resultUsd || 0;

            if (trade.outcome === "win") {
                acc[session].wins += 1;
            }

            return acc;
        },
        {} as Record<
            string,
            {
                trades: number;
                pnl: number;
                wins: number;
            }
        >
    );

    const sessionEntries = Object.entries(
        sessionStats
    ).filter(
        ([, stats]) => stats.trades >= 2
    );

    const bestSession =
        sessionEntries
            .slice()
            .sort(
                (a, b) => b[1].pnl - a[1].pnl
            )[0] || null;

    const worstSession =
        sessionEntries
            .slice()
            .sort(
                (a, b) => a[1].pnl - b[1].pnl
            )[0] || null;

    const averageSessionScore =
        sessions.length > 0
            ? round(
                sessions.reduce(
                    (sum, session) =>
                        sum +
                        (session.finalScore || 0),
                    0
                ) / sessions.length
            )
            : null;

    const worstDrawdown =
        trades.reduce(
            (worst, trade) =>
                Math.min(
                    worst,
                    trade.drawdownPercent || 0
                ),
            0
        );

    const insights: MemoryInsight[] = [
        {
            id: `${accountId}:profile:discipline`,
            memoryType: "profile",
            title: "Discipline Profile",
            description:
                disciplineScore >= 70
        ? `Operational discipline is stable. Current score: ${disciplineScore}/100.`
                    : `Operational discipline requires attention. Current score: ${disciplineScore}/100.`,
            severity:
                getPositiveSeverityFromScore(
                    disciplineScore
                ),
            score: disciplineScore,
        },
        {
            id: `${accountId}:risk:behavioral`,
            memoryType: "behavior",
            title: "Behavioral Risk",
            description:
                behavioralRisk >= 50
                    ? `Elevated behavioral risk: ${behavioralRisk}/100. Weak execution, low confidence or emotional components are affecting performance.`
                    : `Behavioral risk under control: ${behavioralRisk}/100.`,
            severity:
                getSeverityFromScore(
                    behavioralRisk
                ),
            score: behavioralRisk,
        },
        {
            id: `${accountId}:performance:win-rate`,
            memoryType: "performance",
            title: "Win Rate Memory",
            description: `Win rate attuale: ${winRate}%. Trade analizzati: ${totalTrades}.`,
            severity:
                winRate >= 50
                    ? "low"
                    : "medium",
            score: winRate,
        },
        {
            id: `${accountId}:performance:pnl`,
            memoryType: "performance",
            title: "PnL Memory",
            description: `PnL totale analizzato dal Copilot: ${totalPnl.toFixed(
                2
            )} ${account.currency}.`,
            severity:
                totalPnl >= 0
                    ? "low"
                    : "high",
            score: round(Math.abs(totalPnl)),
        },
        {
            id: `${accountId}:risk:drawdown`,
            memoryType: "risk",
            title: "Drawdown Memory",
            description: `Peggior drawdown registrato: ${worstDrawdown.toFixed(
                2
            )}%.`,
            severity:
                Math.abs(worstDrawdown) >= 20
                    ? "high"
                    : Math.abs(worstDrawdown) >= 10
                        ? "medium"
                        : "low",
            score: round(Math.abs(worstDrawdown)),
        },
    ];

    if (revengeRiskTrades > 0) {
        insights.push({
            id: `${accountId}:pattern:revenge`,
            memoryType: "pattern",
            title: "Revenge Trading Risk",
            description: `Possibili segnali di revenge trading rilevati dopo una perdita: ${revengeRiskTrades}.`,
            severity:
                revengeRiskTrades >= 5
                    ? "critical"
                    : revengeRiskTrades >= 3
                        ? "high"
                        : "medium",
            score: revengeRiskTrades,
        });
    }

    if (weakExecutionTrades > 0) {
        insights.push({
            id: `${accountId}:pattern:weak-execution`,
            memoryType: "pattern",
            title: "Weak Execution Pattern",
            description: `Trades with weak execution rating: ${weakExecutionTrades}.`,
            severity:
                getSeverityFromScore(
                    percentage(
                        weakExecutionTrades,
                        totalTrades
                    )
                ),
            score: weakExecutionTrades,
        });
    }

    if (lowConfidenceTrades > 0) {
        insights.push({
            id: `${accountId}:pattern:low-confidence`,
            memoryType: "pattern",
            title: "Low Confidence Pattern",
            description: `Trade con confidence bassa: ${lowConfidenceTrades}.`,
            severity:
                getSeverityFromScore(
                    percentage(
                        lowConfidenceTrades,
                        totalTrades
                    )
                ),
            score: lowConfidenceTrades,
        });
    }

    if (emotionalTrades > 0) {
        insights.push({
            id: `${accountId}:pattern:emotional-trading`,
            memoryType: "behavior",
            title: "Emotional Trading Pattern",
            description: `Trades with emotional component detected: ${emotionalTrades}.`,
            severity:
                getSeverityFromScore(
                    percentage(
                        emotionalTrades,
                        totalTrades
                    )
                ),
            score: emotionalTrades,
        });
    }

    if (bestMarket) {
        insights.push({
            id: `${accountId}:strength:best-market`,
            memoryType: "strength",
            title: "Best Market",
        description: `${bestMarket[0]} is the strongest market in the current data. PnL: ${bestMarket[1].pnl.toFixed(
                2
            )}.`,
            severity: "low",
            score: round(bestMarket[1].pnl),
        });
    }

    if (worstMarket) {
        insights.push({
            id: `${accountId}:risk:worst-market`,
            memoryType: "risk",
            title: "Weakest Market",
        description: `${worstMarket[0]} is the weakest market in the current data. PnL: ${worstMarket[1].pnl.toFixed(
                2
            )}.`,
            severity:
                worstMarket[1].pnl < 0
                    ? "high"
                    : "medium",
            score: round(
                Math.abs(worstMarket[1].pnl)
            ),
        });
    }

    if (bestSession) {
        insights.push({
            id: `${accountId}:strength:best-session`,
            memoryType: "strength",
            title: "Best Session",
        description: `${bestSession[0]} is the strongest session in the current data. PnL: ${bestSession[1].pnl.toFixed(
                2
            )}.`,
            severity: "low",
            score: round(bestSession[1].pnl),
        });
    }

    if (worstSession) {
        insights.push({
            id: `${accountId}:risk:worst-session`,
            memoryType: "risk",
            title: "Weakest Session",
        description: `${worstSession[0]} is the weakest session in the current data. PnL: ${worstSession[1].pnl.toFixed(
                2
            )}.`,
            severity:
                worstSession[1].pnl < 0
                    ? "high"
                    : "medium",
            score: round(
                Math.abs(worstSession[1].pnl)
            ),
        });
    }

    if (averageSessionScore !== null) {
        insights.push({
            id: `${accountId}:session:review-quality`,
            memoryType: "session",
            title: "Session Review Quality",
            description: `Score medio delle ultime sessioni: ${averageSessionScore}/10.`,
            severity:
                averageSessionScore >= 7
                    ? "low"
                    : averageSessionScore >= 5
                        ? "medium"
                        : "high",
            score: averageSessionScore,
        });
    }

    if (latestGoal) {
        insights.push({
            id: `${accountId}:rules:active-goals`,
            memoryType: "rules",
            title: "Active Trading Goals",
            description:
            "Active trading goals exist for the current or recent month. VOLTIS will use them as a reference in future analyses.",
            severity: "low",
            score: 1,
        });
    }

    if (lossStreak >= 2) {
        insights.push({
            id: `${accountId}:risk:loss-streak`,
            memoryType: "risk",
            title: "Loss Streak Alert",
            description: `Streak negativa attuale: ${lossStreak} loss consecutive.`,
            severity:
                lossStreak >= 4
                    ? "critical"
                    : "high",
            score: lossStreak,
        });
    }

    if (winStreak >= 2) {
        insights.push({
            id: `${accountId}:strength:win-streak`,
            memoryType: "strength",
            title: "Positive Streak",
            description: `Streak positiva attuale: ${winStreak} win consecutive.`,
            severity: "low",
            score: winStreak,
        });
    }

    for (const insight of insights) {
        await upsertMemory(
            accountId,
            insight
        );
    }

    await upsertPattern({
        accountId,
        id: `${accountId}:pattern:revenge`,
        type: "behavior",
        title: "Revenge Trading Risk",
        description:
            "Possibili segnali di revenge trading dopo una perdita.",
        severity:
            revengeRiskTrades >= 5
                ? "critical"
                : revengeRiskTrades >= 3
                    ? "high"
                    : "medium",
        occurrences: revengeRiskTrades,
    });

    await upsertPattern({
        accountId,
        id: `${accountId}:pattern:weak-execution`,
        type: "execution",
        title: "Weak Execution",
        description:
                "Weak execution rating detected in multiple trades.",
        severity:
            getSeverityFromScore(
                percentage(
                    weakExecutionTrades,
                    totalTrades
                )
            ),
        occurrences: weakExecutionTrades,
    });

    await upsertPattern({
        accountId,
        id: `${accountId}:pattern:low-confidence`,
        type: "psychology",
        title: "Low Confidence",
        description:
                "Low confidence detected in multiple trades.",
        severity:
            getSeverityFromScore(
                percentage(
                    lowConfidenceTrades,
                    totalTrades
                )
            ),
        occurrences: lowConfidenceTrades,
    });

    await upsertPattern({
        accountId,
        id: `${accountId}:pattern:emotional-trading`,
        type: "psychology",
        title: "Emotional Trading",
        description:
                "Emotional component detected in multiple trades.",
        severity:
            getSeverityFromScore(
                percentage(
                    emotionalTrades,
                    totalTrades
                )
            ),
        occurrences: emotionalTrades,
    });

    return getCopilotMemorySnapshot(accountId);
}

export async function getCopilotMemorySnapshot(
    accountId: string
) {
    const memories =
        await prisma.copilotMemory.findMany({
            where: {
                tradingAccountId: accountId,
            },
            orderBy: [
                {
                    severity: "desc",
                },
                {
                    lastDetectedAt: "desc",
                },
            ],
            take: 12,
        });

    const patterns =
        await prisma.copilotPattern.findMany({
            where: {
                tradingAccountId: accountId,
            },
            orderBy: [
                {
                    occurrences: "desc",
                },
                {
                    updatedAt: "desc",
                },
            ],
            take: 8,
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

    return {
        memories,
        patterns,
        reviewNotes,
    };
}

