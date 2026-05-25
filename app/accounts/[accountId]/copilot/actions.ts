"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendCopilotMessage(formData: FormData) {
    const tradingAccountId = String(
        formData.get("tradingAccountId")
    );

    const content = String(formData.get("content") || "");

    if (!tradingAccountId || !content.trim()) {
        return;
    }

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
            acc[session].pnl += trade.resultUsd || 0;

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

    const sessionEntries = Object.entries(sessionStats);

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
                : `Ho analizzato ${totalTrades} trade. Win rate: ${winRate}%, disciplina: ${disciplineScore}%, rischio comportamentale: ${behavioralRisk}%. Streak attuale: ${winStreak > 0 ? `${winStreak} win consecutivi` : lossStreak > 0 ? `${lossStreak} loss consecutivi` : "neutrale"}.`;
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

    await prisma.copilotMessage.create({
        data: {
            tradingAccountId,
            role: "assistant",
            content: aiResponse,
        },
    });

    revalidatePath(
        `/accounts/${tradingAccountId}/copilot`
    );
}