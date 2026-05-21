import AnalyticsSection from "./AnalyticsSection";

type Props = {
  winRate: number;
  averageRR: number;
  totalPnl: number;
  bestSymbol?: string;
};

export default function PerformanceInsights({
  winRate,
  averageRR,
  totalPnl,
  bestSymbol,
}: Props) {
  const insights = [
    {
      title: "Performance Health",
      label: totalPnl >= 0 ? "Positive" : "Defensive",
      tone:
        totalPnl >= 0
          ? "text-green-400"
          : "text-red-400",
      text:
        totalPnl >= 0
          ? "Il conto è in fase positiva. Mantieni focus su esecuzione e gestione rischio."
          : "Il conto è in fase negativa. Riduci esposizione e concentrati sulla qualità dei setup.",
    },
    {
      title: "Win Rate Quality",
      label: winRate >= 50 ? "Stable" : "Review",
      tone:
        winRate >= 50
          ? "text-cyan-400"
          : "text-yellow-400",
      text:
        winRate >= 50
          ? "Il win rate è sopra la soglia base. Ora il focus è migliorare il rapporto rischio/rendimento."
          : "Il win rate è sotto il 50%. Analizza gli errori ricorrenti e filtra meglio gli ingressi.",
    },
    {
      title: "Risk Reward",
      label: averageRR >= 1.5 ? "Healthy" : "Weak",
      tone:
        averageRR >= 1.5
          ? "text-violet-400"
          : "text-yellow-400",
      text:
        averageRR >= 1.5
          ? "Il rapporto rischio/rendimento è sano. Continua a proteggere questa metrica."
          : "Il rapporto rischio/rendimento può migliorare. Evita trade con upside debole.",
    },
    {
      title: "Market Edge",
      label: bestSymbol || "Pending",
      tone: bestSymbol
        ? "text-green-400"
        : "text-gray-400",
      text: bestSymbol
        ? `${bestSymbol} sembra essere lo strumento con maggiore edge operativo.`
        : "Non ci sono ancora abbastanza dati per identificare un mercato dominante.",
    },
  ];

  return (
    <div className="xl:col-span-2">
      <AnalyticsSection
        subtitle="Performance insights"
        title="VOLTIS Intelligence"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className="group rounded-3xl border border-white/10 bg-black/20 p-5 transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-bold text-white">
                  {insight.title}
                </p>

                <span
                  className={`rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold ${insight.tone}`}
                >
                  {insight.label}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </AnalyticsSection>
    </div>
  );
}