import {
    formatReportCurrency,
    getReportLabels,
    type ReportI18nProps,
} from "@/components/reports/ReportI18n";

type Props = ReportI18nProps & {
    userName: string;

    totalTrades: number;
    totalPnl: number;
    winRate: number;
    wins: number;
    losses: number;
    averageWin: number;
    averageLoss: number;
    disciplineScore: number;
    behavioralRisk: number;
    emotionalTrades: number;
    weakExecutionTrades: number;
    primaryFocus: string;
    hasEnoughData: boolean;
};

export default function PDFCompactReport({
    userName,
    totalTrades,
    totalPnl,
    winRate,
    wins,
    losses,
    averageWin,
    averageLoss,
    disciplineScore,
    behavioralRisk,
    emotionalTrades,
    weakExecutionTrades,
    primaryFocus,
    hasEnoughData,
    appLanguage,
    currency,
}: Props) {
    const t = getReportLabels(appLanguage);

    return (
        <div className="pdf-only pdf-page min-h-0 bg-bg-base p-4 text-white">
            <section className="mb-6 border-b border-gray-300 pb-4">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-300">
                    {t.voltisIntelligenceReport}
                </p>

                <h1 className="mt-2 text-3xl font-black">
                    {t.tradingPerformanceReport}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    {t.institutionalPerformanceSummary}
                </p>
            </section>

            <section className="mb-5 grid grid-cols-4 gap-3">
                <div className="rounded-xl border border-gray-300 p-3">
                    <p className="text-xs text-gray-500">
                        {t.trades}
                    </p>
                    <h2 className="text-2xl font-black">
                        {totalTrades}
                    </h2>
                </div>

                <div className="rounded-xl border border-gray-300 p-3">
                    <p className="text-xs text-gray-500">
                        {t.pnl}
                    </p>
                    <h2 className="text-2xl font-black">
                        {formatReportCurrency(
                            totalPnl,
                            currency,
                            appLanguage
                        )}
                    </h2>
                </div>

                <div className="rounded-xl border border-gray-300 p-3">
                    <p className="text-xs text-gray-500">
                        {t.winRate}
                    </p>
                    <h2 className="text-2xl font-black">
                        {winRate}%
                    </h2>
                </div>

                <div className="rounded-xl border border-gray-300 p-3">
                    <p className="text-xs text-gray-500">
                        {t.discipline}
                    </p>
                    <h2 className="text-2xl font-black">
                        {disciplineScore}
                    </h2>
                </div>
            </section>

            <section className="mb-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-300 p-4">
                    <h2 className="text-lg font-black">
                        {t.pdfExecutiveSummary}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed">
                        {hasEnoughData
                            ? totalPnl >= 0
                                ? t.pdfPositive
                                : t.pdfNegative
                            : t.notEnoughDataMessage}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-300 p-4">
                    <h2 className="text-lg font-black">
                        {t.pdfBehavioralRisk}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed">
                        {hasEnoughData
                            ? t.pdfBehavior(
                                behavioralRisk,
                                emotionalTrades,
                                weakExecutionTrades
                            )
                            : t.notEnoughDataMessage}
                    </p>
                </div>
            </section>

            <section className="mb-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-300 p-4">
                    <h2 className="text-lg font-black">
                        {t.pdfPerformanceBreakdown}
                    </h2>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <p>{t.wins}: {wins}</p>
                        <p>{t.losses}: {losses}</p>
                        <p>
                            {t.avgWin}:{" "}
                            {formatReportCurrency(
                                averageWin,
                                currency,
                                appLanguage
                            )}
                        </p>
                        <p>
                            {t.avgLoss}:{" "}
                            {formatReportCurrency(
                                averageLoss,
                                currency,
                                appLanguage
                            )}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-300 p-4">
                    <h2 className="text-lg font-black">
                        {t.aiCoachingFocus}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed">
                        {hasEnoughData ? primaryFocus : t.notEnoughDataMessage}
                    </p>
                </div>
            </section>

            <footer className="mt-2 flex items-center justify-between border-t border-gray-300 pt-3 text-[10px] text-gray-500">
                <span>{t.generatedBy}</span>

                <span>
                    {t.preparedFor} {userName}
                </span>
            </footer>
        </div>
    );
}
