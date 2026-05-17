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
      text:
        totalPnl >= 0
          ? "Il conto è in fase positiva. Mantieni focus su esecuzione e gestione rischio."
          : "Il conto è in fase negativa. Riduci esposizione e concentrati sulla qualità dei setup.",
    },
    {
      title: "Win Rate Quality",
      text:
        winRate >= 50
          ? "Il win rate è sopra la soglia base. Ora il focus è migliorare il rapporto rischio/rendimento."
          : "Il win rate è sotto il 50%. Analizza gli errori ricorrenti e filtra meglio gli ingressi.",
    },
    {
      title: "Risk Reward",
      text:
        averageRR >= 1.5
          ? "Il rapporto rischio/rendimento è sano. Continua a proteggere questa metrica."
          : "Il rapporto rischio/rendimento può migliorare. Evita trade con upside debole.",
    },
    {
      title: "Market Edge",
      text: bestSymbol
        ? `${bestSymbol} sembra essere lo strumento con maggiore edge operativo.`
        : "Non ci sono ancora abbastanza dati per identificare un mercato dominante.",
    },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
      <p className="text-sm text-gray-400">
        Performance insights
      </p>

      <h2 className="mt-1 text-2xl font-bold">
        VOLTIS Intelligence
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className="rounded-2xl border border-white/10 bg-black/20 p-5"
          >
            <p className="font-bold text-white">
              {insight.title}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}