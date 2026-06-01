"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { analyzeCopilotMemory } from "@/lib/copilot/copilot-memory";

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

    const membership =
        await prisma.accountMember.findFirst({
            where: {
                userId: session.user.id,
                tradingAccountId,
            },
            include: {
                tradingAccount: true,
            },
        });

    if (!membership) {
        redirect("/accounts");
    }

    const canUseCopilot =
        membership.role === "MANAGER" ||
        membership.canViewCopilot;

    if (!canUseCopilot) {
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
                ? `La tua disciplina operativa è stabile (${disciplineScore}%). Il problema principale non sembra essere impulsività ma mantenimento della consistenza durante aumento della frequenza operativa.`
                : `La tua disciplina operativa è ancora instabile (${disciplineScore}%). VOLTIS rileva necessità di migliorare routine, execution e controllo emotivo.`;
    } else if (
        lowerContent.includes("emotion") ||
        lowerContent.includes("emotivo")
    ) {
        aiResponse =
            emotionalTrades > 0
                ? `Ho rilevato ${emotionalTrades} trade con componente emotiva. Il focus è ridurre revenge trading e decisioni prese sotto pressione emotiva.`
                : "Non rilevo segnali importanti di emotional trading. La struttura emotiva appare stabile.";
    } else if (
        lowerContent.includes("revenge") ||
        lowerContent.includes("impuls") ||
        lowerContent.includes("overtrading")
    ) {
        aiResponse =
            revengeRiskTrades > 0
                ? `Ho rilevato ${revengeRiskTrades} possibili segnali di revenge trading: dopo una perdita compaiono execution debole, bassa confidence o componente emotiva. Il focus è fermarti dopo una loss e fare review prima del trade successivo.`
                : "Non rilevo segnali forti di revenge trading nei dati attuali. Continua comunque a monitorare le operazioni successive a una perdita.";
    } else if (
        lowerContent.includes("risk") ||
        lowerContent.includes("rischio")
    ) {
        aiResponse =
            behavioralRisk >= 50
                ? `Il rischio comportamentale è elevato (${behavioralRisk}%). Weak execution e low confidence stanno aumentando instabilità operativa.`
                : `Il rischio comportamentale è sotto controllo (${behavioralRisk}%). Continua a proteggere qualità execution e sizing.`;
    } else if (
        lowerContent.includes("win rate") ||
        lowerContent.includes("performance") ||
        lowerContent.includes("profit")
    ) {
        aiResponse =
            winRate >= 60
                ? `La performance operativa è positiva. Win rate attuale: ${winRate}%. La priorità ora è scalare mantenendo disciplina e qualità setup.`
                : `Il win rate attuale (${winRate}%) suggerisce necessità di migliorare selezione setup e qualità execution.`;
    } else if (
        lowerContent.includes("orari") ||
        lowerContent.includes("fascia") ||
        lowerContent.includes("time quality") ||
        lowerContent.includes("sera")
    ) {
        aiResponse =
            weakTimeTrades > 0
                ? `Ho rilevato ${weakTimeTrades} trade potenzialmente deboli nelle fasce orarie serali. Questo può indicare calo di lucidità, stanchezza o decisioni meno selettive.`
                : "Non rilevo un peggioramento evidente della qualità operativa nelle fasce orarie serali.";
    } else if (
        lowerContent.includes("session") ||
        lowerContent.includes("londra") ||
        lowerContent.includes("new york") ||
        lowerContent.includes("orario") ||
        lowerContent.includes("time")
    ) {
        aiResponse =
            totalTrades === 0
                ? "Non ho ancora abbastanza dati per analizzare le sessioni operative."
                : sessionEntries.length < 2
                    ? "Per ora i dati sono concentrati in una sola sessione, quindi non posso confrontare in modo affidabile sessione migliore e peggiore. Inserisci trade in più fasce orarie per attivare un confronto reale."
                    : `La sessione migliore risulta essere ${bestSession}, mentre quella più debole è ${worstSession}. Usa questa informazione per capire dove il tuo edge operativo è più forte e dove invece rischi di perdere qualità.`;
    } else {
        aiResponse =
            totalTrades === 0
                ? "Non ho ancora abbastanza dati per analizzare il tuo conto. Inserisci trade nel Diary per attivare il motore intelligence."
                : `Ho analizzato ${totalTrades} trade. Win rate: ${winRate}%, disciplina: ${disciplineScore}%, rischio comportamentale: ${behavioralRisk}%. Streak attuale: ${winStreak > 0
                    ? `${winStreak} win consecutivi`
                    : lossStreak > 0
                        ? `${lossStreak} loss consecutivi`
                        : "neutrale"
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
                    "Possibili segnali di revenge trading dopo una perdita.",
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
                    "Possibili segnali di revenge trading dopo una perdita.",
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
            aiResponse += ` ALERT CRITICO: il pattern "${mainPattern.title}" continua a ripetersi. VOLTIS consiglia riduzione immediata della frequenza operativa e review completa della disciplina decisionale.`;
        } else if (mainPattern.severity === "high") {
            aiResponse += ` Pattern ricorrente ad alto rischio rilevato: "${mainPattern.title}" è comparso ${mainPattern.occurrences} volte. Priorità operativa: proteggere execution e controllo emotivo.`;
        } else if (mainPattern.occurrences >= 3) {
            aiResponse += ` Pattern ricorrente rilevato: "${mainPattern.title}" è comparso ${mainPattern.occurrences} volte.`;
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
                    "Rischio comportamentale elevato rilevato nel conto.",
                severity: "high",
                score: behavioralRisk,
            },
            create: {
                id: `behavioral-risk-${tradingAccountId}`,
                tradingAccountId,
                memoryType: "behavior",
                title: "Elevated Behavioral Risk",
                description:
                    "Rischio comportamentale elevato rilevato nel conto.",
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
                    "Pattern di revenge trading rilevato dopo operazioni negative.",
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
                    "Pattern di revenge trading rilevato dopo operazioni negative.",
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
                "Profilo operativo generale aggiornato dal Copilot.",
            severity: "low",
            score: totalTrades,
        },
        create: {
            id: `general-profile-${tradingAccountId}`,
            tradingAccountId,
            memoryType: "profile",
            title: "General Trading Profile",
            description:
                "Profilo operativo generale aggiornato dal Copilot.",
            severity: "low",
            score: totalTrades,
        },
    });

    const activeMemories =
        memorySnapshot.memories.slice(0, 3);

    if (activeMemories.length > 0) {
        aiResponse += ` Memoria operativa attiva: VOLTIS riconosce ${activeMemories.length} pattern ricorrenti nel tuo storico. Pattern principale: "${activeMemories[0].title}".`;
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