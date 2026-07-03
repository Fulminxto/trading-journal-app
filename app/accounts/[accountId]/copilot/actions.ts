"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import {
    canUseCopilot,
    getAccountMembershipWithAccount,
} from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { analyzeCopilotMemory } from "@/lib/copilot/copilot-memory";
import { buildCopilotSystem } from "@/lib/copilot";
import { composeAnalysis } from "@/lib/copilot/analysis-composer";
import { normalizeAppLanguage } from "@/lib/i18n";

const MAX_COPILOT_MESSAGE_LENGTH = 1200;

function getString(
    formData: FormData,
    key: string
) {
    const value = formData.get(key);

    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
}

function getLimitedString(
    formData: FormData,
    key: string,
    maxLength: number
) {
    return getString(formData, key).slice(
        0,
        maxLength
    );
}

async function getCopilotAccess(
    tradingAccountId: string
) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const membership = await getAccountMembershipWithAccount(
        session.user.id,
        tradingAccountId
    );

    if (!membership) {
        redirect("/accounts");
    }

    if (!canUseCopilot(membership)) {
        redirect(
            `/accounts/${tradingAccountId}/dashboard`
        );
    }

    if (
        membership.tradingAccount.status ===
        "ARCHIVED"
    ) {
        redirect(
            `/accounts/${tradingAccountId}/copilot`
        );
    }

    return membership;
}

export async function sendCopilotMessage(
    formData: FormData
) {
    const tradingAccountId = getString(
        formData,
        "tradingAccountId"
    );

    const content = getLimitedString(
        formData,
        "content",
        MAX_COPILOT_MESSAGE_LENGTH
    );

    if (!tradingAccountId || !content) {
        return;
    }

    const membership =
        await getCopilotAccess(tradingAccountId);

    await prisma.copilotMessage.create({
        data: {
            tradingAccountId,
            role: "user",
            content,
        },
    });

    const trades = await prisma.trade.findMany({
        where: {
            tradingAccountId,
        },
    });

    const memorySnapshot =
        await analyzeCopilotMemory(
            tradingAccountId
        );

    const totalTrades = trades.length;

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

    const revengeRiskTrades =
        recentTrades.filter((trade, index) => {
            const previousTrade =
                recentTrades[index + 1];

            if (!previousTrade) {
                return false;
            }

            return (
                previousTrade.outcome === "loss" &&
                ((trade.executionRating || 0) <= 4 ||
                    trade.emotionalState ||
                    (trade.confidence || 0) <= 4)
            );
        }).length;

    const sessionStats = trades.reduce(
        (acc, trade) => {
            const hour = trade.openTime
                ? Number(trade.openTime.split(":")[0])
                : null;

            const session =
                hour === null
                    ? "Unknown"
                    : hour >= 7 && hour < 13
                        ? "London"
                        : hour >= 13 && hour < 22
                            ? "New York"
                            : "Asia";

            if (!acc[session]) {
                acc[session] = {
                    trades: 0,
                    pnl: 0,
                };
            }

            acc[session].trades += 1;
            acc[session].pnl +=
                trade.resultUsd || 0;

            return acc;
        },
        {} as Record<
            string,
            {
                trades: number;
                pnl: number;
            }
        >
    );

    const sessionEntries = Object.entries(
        sessionStats
    );

    const bestSession =
        sessionEntries.length >= 2
            ? sessionEntries.sort(
                (a, b) => b[1].pnl - a[1].pnl
            )[0]?.[0] || "Not enough data"
            : "Not enough data";

    const worstSession =
        sessionEntries.length >= 2
            ? sessionEntries.sort(
                (a, b) => a[1].pnl - b[1].pnl
            )[0]?.[0] || "Not enough data"
            : "Not enough data";

    const lowerContent = content.toLowerCase();

    const weakTimeTrades = trades.filter(
        (trade) => {
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
        }
    ).length;

    let aiResponse = "";

    if (
        lowerContent.includes("discipline") ||
        lowerContent.includes("consistenza") ||
        lowerContent.includes("consistency")
    ) {
        aiResponse =
            disciplineScore >= 75
                ? `Your operational discipline is stable (${disciplineScore}%). The main issue does not seem to be impulsiveness, but maintaining consistency as trading frequency increases.`
                : `Your operational discipline is still unstable (${disciplineScore}%). VOLTIS detects the need to improve routine, execution and emotional control.`;
    } else if (
        lowerContent.includes("emotion") ||
        lowerContent.includes("emotivo")
    ) {
        aiResponse =
            emotionalTrades > 0
                ? `I detected ${emotionalTrades} trades with an emotional component. The focus is to reduce revenge trading and decisions made under emotional pressure.`
                : "I do not detect major signs of emotional trading. The emotional structure appears stable.";
    } else if (
        lowerContent.includes("revenge") ||
        lowerContent.includes("impuls") ||
        lowerContent.includes("overtrading")
    ) {
        aiResponse =
            revengeRiskTrades > 0
                ? `I detected ${revengeRiskTrades} possible revenge trading signals: after a loss, weak execution, low confidence or an emotional component appear. The focus is to stop after a loss and review before the next trade.`
                : "I do not detect strong revenge trading signals in the current data. Keep monitoring trades taken after a loss.";
    } else if (
        lowerContent.includes("risk") ||
        lowerContent.includes("rischio")
    ) {
        aiResponse =
            behavioralRisk >= 50
                ? `Behavioral risk is elevated (${behavioralRisk}%). Weak execution and low confidence are increasing operational instability.`
                : `Behavioral risk is under control (${behavioralRisk}%). Keep protecting execution quality and sizing.`;
    } else if (
        lowerContent.includes("win rate") ||
        lowerContent.includes("performance") ||
        lowerContent.includes("profit")
    ) {
        aiResponse =
            winRate >= 60
                ? `Operational performance is positive. Current win rate: ${winRate}%. The priority now is to scale while maintaining discipline and setup quality.`
                : `The current win rate (${winRate}%) suggests the need to improve setup selection and execution quality.`;
    } else if (
        lowerContent.includes("orari") ||
        lowerContent.includes("fascia") ||
        lowerContent.includes("time quality") ||
        lowerContent.includes("sera")
    ) {
        aiResponse =
            weakTimeTrades > 0
                ? `I detected ${weakTimeTrades} potentially weak trades during evening hours. This may indicate lower clarity, fatigue or less selective decisions.`
                : "I do not detect a clear deterioration in operational quality during evening hours.";
    } else if (
        lowerContent.includes("session") ||
        lowerContent.includes("londra") ||
        lowerContent.includes("new york") ||
        lowerContent.includes("orario") ||
        lowerContent.includes("time")
    ) {
        aiResponse =
            totalTrades === 0
                ? "I do not have enough data yet to analyze trading sessions."
                : sessionEntries.length < 2
                    ? "For now, the data is concentrated in a single session, so I cannot reliably compare the best and worst session. Add trades across more time windows to activate a real comparison."
                    : `The best session appears to be ${bestSession}, while the weakest one is ${worstSession}. Use this information to understand where your operating edge is strongest and where you risk losing quality.`;
    } else {
        aiResponse =
            totalTrades === 0
                ? "I do not have enough data yet to analyze your account. Add trades to the Diary to activate the intelligence engine."
                : `I analyzed ${totalTrades} trades. Win rate: ${winRate}%, discipline: ${disciplineScore}%, behavioral risk: ${behavioralRisk}%. Current streak: ${winStreak > 0
                    ? `${winStreak} consecutive wins`
                    : lossStreak > 0
                        ? `${lossStreak} consecutive losses`
                        : "neutral"
                }.`;
    }

    if (revengeRiskTrades > 0) {
        await prisma.copilotPattern.upsert({
            where: {
                id: `revenge-${tradingAccountId}`,
            },
            update: {
                occurrences: {
                    increment: 1,
                },
                description:
                    "Possible revenge trading signals after a loss.",
                severity:
                    revengeRiskTrades >= 5
                        ? "critical"
                        : revengeRiskTrades >= 3
                            ? "high"
                            : revengeRiskTrades >= 2
                                ? "medium"
                                : "low",
            },
            create: {
                id: `revenge-${tradingAccountId}`,
                tradingAccountId,
                type: "behavior",
                title: "Revenge Trading Risk",
                description:
                    "Possible revenge trading signals after a loss.",
                severity:
                    revengeRiskTrades >= 5
                        ? "critical"
                        : revengeRiskTrades >= 3
                            ? "high"
                            : revengeRiskTrades >= 2
                                ? "medium"
                                : "low",
            },
        });
    }

    const activePatterns =
        await prisma.copilotPattern.findMany({
            where: {
                tradingAccountId,
            },
            orderBy: {
                occurrences: "desc",
            },
        });

    const mainPattern = activePatterns[0];

    if (mainPattern) {
        if (mainPattern.severity === "critical") {
            aiResponse += ` CRITICAL ALERT: the pattern "${mainPattern.title}" keeps repeating. VOLTIS recommends immediately reducing trading frequency and completing a full review of decision discipline.`;
        } else if (mainPattern.severity === "high") {
            aiResponse += ` High-risk recurring pattern detected: "${mainPattern.title}" appeared ${mainPattern.occurrences} times. Operational priority: protect execution and emotional control.`;
        } else if (mainPattern.occurrences >= 3) {
            aiResponse += ` Recurring pattern detected: "${mainPattern.title}" appeared ${mainPattern.occurrences} times.`;
        }
    }

    if (trades.length > 0) {
        const latestTrade = trades
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.openDate).getTime() -
                    new Date(a.openDate).getTime()
            )[0];

        if (latestTrade) {
            await prisma.copilotReviewNote.create({
                data: {
                    tradingAccountId,
                    tradeId: String(latestTrade.id),
                    title: "Latest Trade AI Review",
                    content: aiResponse,
                    severity:
                        behavioralRisk >= 50
                            ? "high"
                            : behavioralRisk >= 25
                                ? "medium"
                                : "low",
                },
            });
        }
    }

    if (behavioralRisk >= 50) {
        await prisma.copilotMemory.upsert({
            where: {
                id: `behavioral-risk-${tradingAccountId}`,
            },
            update: {
                description:
                    "Elevated behavioral risk detected on the account.",
                severity: "high",
                score: behavioralRisk,
            },
            create: {
                id: `behavioral-risk-${tradingAccountId}`,
                tradingAccountId,
                memoryType: "behavior",
                title: "Elevated Behavioral Risk",
                description:
                    "Elevated behavioral risk detected on the account.",
                severity: "high",
                score: behavioralRisk,
            },
        });
    }

    if (revengeRiskTrades > 0) {
        await prisma.copilotMemory.upsert({
            where: {
                id: `revenge-risk-${tradingAccountId}`,
            },
            update: {
                description:
                    "Revenge trading pattern detected after negative trades.",
                severity:
                    revengeRiskTrades >= 3
                        ? "critical"
                        : "high",
                score: revengeRiskTrades,
            },
            create: {
                id: `revenge-risk-${tradingAccountId}`,
                tradingAccountId,
                memoryType: "pattern",
                title: "Revenge Trading Memory",
                description:
                    "Revenge trading pattern detected after negative trades.",
                severity:
                    revengeRiskTrades >= 3
                        ? "critical"
                        : "high",
                score: revengeRiskTrades,
            },
        });
    }

    await prisma.copilotMemory.upsert({
        where: {
            id: `general-profile-${tradingAccountId}`,
        },
        update: {
            description:
                "General operating profile updated by Copilot.",
            severity: "low",
            score: totalTrades,
        },
        create: {
            id: `general-profile-${tradingAccountId}`,
            tradingAccountId,
            memoryType: "profile",
            title: "General Trading Profile",
            description:
                "General operating profile updated by Copilot.",
            severity: "low",
            score: totalTrades,
        },
    });

    const activeMemories =
        memorySnapshot.memories.slice(0, 3);

    if (activeMemories.length > 0) {
        aiResponse += ` Active operating memory: VOLTIS recognizes ${activeMemories.length} recurring patterns in your history. Main pattern: "${activeMemories[0].title}".`;
    }

    await prisma.copilotMessage.create({
        data: {
            tradingAccountId,
            role: "assistant",
            content: aiResponse,
        },
    });

    await logActivity({
        userId: membership.userId,
        accountId: tradingAccountId,
        type: "COPILOT_MESSAGE_SENT",
        title: "Copilot message sent",
        description: `${membership.userId} used Copilot`,
        metadata: {
            messageLength: content.length,
            totalTrades,
            winRate,
            behavioralRisk,
            disciplineScore,
        },
    });

    revalidatePath(
        `/accounts/${tradingAccountId}/copilot`
    );
}

export async function generateAnalysis(
    formData: FormData
) {
    const tradingAccountId = getString(
        formData,
        "tradingAccountId"
    );

    if (!tradingAccountId) return;

    const membership =
        await getCopilotAccess(tradingAccountId);

    const [trades, currentUser] = await Promise.all([
        prisma.trade.findMany({
            where: { tradingAccountId },
        }),
        prisma.user.findUnique({
            where: { id: membership.userId },
            select: { appLanguage: true },
        }),
    ]);

    const memorySnapshot =
        await analyzeCopilotMemory(tradingAccountId);

    const system = buildCopilotSystem({
        trades,
        copilotMemories: memorySnapshot.memories,
    });

    const analysisText = composeAnalysis(
        {
            totalTrades: system.analytics.totalTrades,
            winRate: system.analytics.winRate,
            disciplineScore:
                system.analytics.disciplineScore,
            behavioralRisk:
                system.analytics.behavioralRisk,
            weakExecutionTrades:
                system.analytics.weakExecutionTrades,
            emotionalTrades:
                system.analytics.emotionalTrades,
            lowConfidenceTrades:
                system.analytics.lowConfidenceTrades,
            lossStreak: system.analytics.lossStreak,
            winStreak: system.analytics.winStreak,
            revengeRiskTrades:
                system.patternMetrics.revengeRiskTrades,
            weakTimeTrades:
                system.patternMetrics.weakTimeTrades,
            executionDecay:
                system.stability.executionDecay,
            confidenceDecay:
                system.stability.confidenceDecay,
            behavioralDrift:
                system.stability.behavioralDrift,
            emotionalVolatility:
                system.stability.emotionalVolatility,
            emotionalInstabilityScore:
                system.stability.emotionalInstabilityScore,
            supervisorLevel:
                system.stability.supervisorLevel,
            averageExecution:
                system.review.averageExecution,
            averageConfidence:
                system.review.averageConfidence,
            reviewScore: system.review.reviewScore,
            consistencyScore: system.consistencyScore,
            consistencyLabel: system.consistencyLabel,
            recoveryDetected: system.recoveryDetected,
            recoveryScore: system.recoveryScore,
            recoveryLabel: system.recoveryLabel,
            sessionLocked:
                system.sessionLock.sessionLocked,
            reviewRequired:
                system.sessionLock.reviewRequired,
            coachingTone:
                system.adaptiveCoaching.tone,
            escalationLevel:
                system.riskEscalation.escalationLevel,
        },
        normalizeAppLanguage(currentUser?.appLanguage)
    );

    await prisma.copilotMessage.create({
        data: {
            tradingAccountId,
            role: "assistant",
            content: analysisText,
        },
    });

    await logActivity({
        userId: membership.userId,
        accountId: tradingAccountId,
        type: "COPILOT_MESSAGE_SENT",
        title: "Analysis generated",
        description: `${membership.userId} requested a full analysis`,
        metadata: {
            totalTrades: system.analytics.totalTrades,
            disciplineScore:
                system.analytics.disciplineScore,
            behavioralRisk:
                system.analytics.behavioralRisk,
        },
    });

    revalidatePath(
        `/accounts/${tradingAccountId}/copilot`
    );
}
