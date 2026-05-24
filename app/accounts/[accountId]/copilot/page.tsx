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

                <div className="mt-8 flex items-center gap-4">
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
        </div>
    );
}