import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function EquityPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

  const membership = await prisma.accountMember.findFirst({
    where: {
      userId: session.user.id,
      tradingAccountId: accountId,
    },

    include: {
      tradingAccount: true,
    },
  });

  if (!membership) {
    redirect("/accounts");
  }

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
    },

    orderBy: [{ openDate: "asc" }],
  });

  const initialBalance =
    membership.tradingAccount.initialBalance;

  const currentEquity =
    trades.length > 0
      ? trades[trades.length - 1].equity ||
        initialBalance
      : initialBalance;

  const totalPnl = trades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const positiveTrades = trades.filter(
    (trade) => (trade.resultUsd || 0) > 0
  ).length;

  const negativeTrades = trades.filter(
    (trade) => (trade.resultUsd || 0) < 0
  ).length;

  const maxDrawdown =
    trades.length > 0
      ? Math.min(
          ...trades.map(
            (trade) =>
              trade.drawdownPercent || 0
          )
        )
      : 0;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">
          Equity tracking
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          Equity Curve
        </h1>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            Current Equity
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {currentEquity.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            Total PnL
          </p>

          <h2
            className={`mt-2 text-3xl font-bold ${
              totalPnl >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {totalPnl.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            Positive Trades
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {positiveTrades}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            Negative Trades
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-400">
            {negativeTrades}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            Max Drawdown
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-400">
            {maxDrawdown.toFixed(2)}%
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full border-collapse">
          <thead className="bg-white/5 text-left text-sm text-gray-400">
            <tr>
              <th className="p-4">Data</th>
              <th className="p-4">Equity</th>
              <th className="p-4">PnL</th>
              <th className="p-4">Drawdown</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                className="border-t border-white/10"
              >
                <td className="p-4">
                  {new Date(
                    trade.openDate
                  ).toLocaleDateString()}
                </td>

                <td className="p-4 font-semibold">
                  {(
                    trade.equity ||
                    initialBalance
                  ).toFixed(2)}
                </td>

                <td
                  className={
                    (trade.resultUsd || 0) >= 0
                      ? "p-4 text-green-400"
                      : "p-4 text-red-400"
                  }
                >
                  {(trade.resultUsd || 0).toFixed(2)}
                </td>

                <td
                  className={
                    (trade.drawdownPercent || 0) < 0
                      ? "p-4 text-red-400"
                      : "p-4 text-gray-300"
                  }
                >
                  {(trade.drawdownPercent || 0).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}