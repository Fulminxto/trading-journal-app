import AnalyticsSection from "./AnalyticsSection";

type SymbolStats = {
  pnl: number;
  trades: number;
};

type Props = {
  bestSymbol?: [string, SymbolStats];
  worstSymbol?: [string, SymbolStats];
  mostTraded?: [string, SymbolStats];
  currency: string;
  formatCurrency: (
    value: number,
    currency: string
  ) => string;
};

export default function SymbolPerformance({
  bestSymbol,
  worstSymbol,
  mostTraded,
  currency,
  formatCurrency,
}: Props) {
  return (
    <AnalyticsSection
      subtitle="Market intelligence"
      title="Symbol Performance"
    >
      <div className="space-y-4">
        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-sm text-gray-500">
            Best Symbol
          </p>

          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-green-400">
              {bestSymbol?.[0] || "-"}
            </h3>

            <p className="font-semibold text-green-400">
              {bestSymbol
                ? formatCurrency(
                    bestSymbol[1].pnl,
                    currency
                  )
                : "-"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-sm text-gray-500">
            Worst Symbol
          </p>

          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-red-400">
              {worstSymbol?.[0] || "-"}
            </h3>

            <p className="font-semibold text-red-400">
              {worstSymbol
                ? formatCurrency(
                    worstSymbol[1].pnl,
                    currency
                  )
                : "-"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-sm text-gray-500">
            Most Traded
          </p>

          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {mostTraded?.[0] || "-"}
            </h3>

            <p className="font-semibold text-gray-400">
              {mostTraded
                ? `${mostTraded[1].trades} trades`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </AnalyticsSection>
  );
}