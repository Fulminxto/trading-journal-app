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

    const lowerContent = content.toLowerCase();

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
        lowerContent.includes("emotivo") ||
        lowerContent.includes("revenge")
    ) {
        aiResponse =
            emotionalTrades > 0
                ? `Ho rilevato ${emotionalTrades} trade con componente emotiva. Il focus è ridurre revenge trading e decisioni prese sotto pressione emotiva.`
                : "Non rilevo segnali importanti di emotional trading. La struttura emotiva appare stabile.";
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
    } else {
        aiResponse =
            totalTrades === 0
                ? "Non ho ancora abbastanza dati per analizzare il tuo conto. Inserisci trade nel Diary per attivare il motore intelligence."
                : `Ho analizzato ${totalTrades} trade. Attualmente il win rate è ${winRate}%, la disciplina ${disciplineScore}% e il rischio comportamentale ${behavioralRisk}%.`;
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