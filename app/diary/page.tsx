import { prisma } from "@/lib/prisma";
import { createTrade, deleteTrade } from "./actions";

export default async function DiaryPage({
  searchParams,
}: {
  searchParams: Promise<{
    symbol?: string;
    direction?: string;
    outcome?: string;
    strategy?: string;
  }>;
}) {
  const params = await searchParams;

  const symbol = params.symbol || "";
  const direction = params.direction || "";
  const outcome = params.outcome || "";
  const strategy = params.strategy || "";

  const trades = await prisma.trade.findMany({
    where: {
      ...(symbol ? { symbol } : {}),
      ...(direction ? { direction } : {}),
      ...(outcome ? { outcome } : {}),
      ...(strategy
        ? {
            strategy: {
              contains: strategy,
            },
          }
        : {}),
    },
    orderBy: {
      id: "desc",
    },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">Registro operazioni</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Trading Diary</h1>
      </div>

      {/* CREATE TRADE FORM */}
      <form
        action={createTrade}
        className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4"
      >
        <input name="openDate" type="date" className="rounded-xl bg-zinc-900 p-3" required />
        <input name="openTime" type="time" className="rounded-xl bg-zinc-900 p-3" />
        <input name="reason" placeholder="Motivo" className="rounded-xl bg-zinc-900 p-3" />
        <input name="strategy" placeholder="Strategia" className="rounded-xl bg-zinc-900 p-3" />

        <select name="symbol" className="rounded-xl bg-zinc-900 p-3" required>
          <option value="">Strumento</option>
          <option value="XAUUSD">XAUUSD</option>
          <option value="BTCUSD">BTCUSD</option>
          <option value="EURUSD">EURUSD</option>
          <option value="GBPUSD">GBPUSD</option>
          <option value="USDJPY">USDJPY</option>
          <option value="NASDAQ">NASDAQ</option>
          <option value="S&P500">S&P500</option>
        </select>

        <select name="direction" className="rounded-xl bg-zinc-900 p-3" required>
          <option value="LONG">LONG</option>
          <option value="SHORT">SHORT</option>
        </select>

        <select name="amount" className="rounded-xl bg-zinc-900 p-3">
          <option value="">Amount / Lotto</option>
          <option value="0.01">0.01</option>
          <option value="0.02">0.02</option>
          <option value="0.03">0.03</option>
          <option value="0.05">0.05</option>
          <option value="0.10">0.10</option>
          <option value="0.20">0.20</option>
          <option value="0.50">0.50</option>
          <option value="1.00">1.00</option>
        </select>

        <input name="openingPrice" placeholder="Opening Price" className="rounded-xl bg-zinc-900 p-3" />
        <input name="stopLoss" placeholder="Stop Loss" className="rounded-xl bg-zinc-900 p-3" />
        <input name="takeProfit" placeholder="Take Profit" className="rounded-xl bg-zinc-900 p-3" />

        <select name="riskReward" className="rounded-xl bg-zinc-900 p-3">
          <option value="">Risk / Reward</option>
          <option value="1">1R</option>
          <option value="1.5">1.5R</option>
          <option value="2">2R</option>
          <option value="2.5">2.5R</option>
          <option value="3">3R</option>
          <option value="4">4R</option>
          <option value="5">5R</option>
        </select>

        <input name="closeDate" type="date" className="rounded-xl bg-zinc-900 p-3" />
        <input name="closingPrice" placeholder="Closing Price" className="rounded-xl bg-zinc-900 p-3" />

        <select name="outcome" className="rounded-xl bg-zinc-900 p-3">
          <option value="">Outcome</option>
          <option value="win">Win</option>
          <option value="loss">Loss</option>
          <option value="be">BE</option>
        </select>

        <input name="resultUsd" placeholder="Result $" className="rounded-xl bg-zinc-900 p-3" />

        <textarea
          name="notes"
          placeholder="Note"
          className="rounded-xl bg-zinc-900 p-3 sm:col-span-2 xl:col-span-4"
        />

        <button
          type="submit"
          className="rounded-xl bg-green-500 p-3 font-bold text-black sm:col-span-2 xl:col-span-4"
        >
          Salva operazione
        </button>
      </form>

      {/* FILTERS */}
      <form
        action="/diary"
        className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        <select
          name="symbol"
          defaultValue={symbol}
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="">Tutti gli strumenti</option>
          <option value="XAUUSD">XAUUSD</option>
          <option value="BTCUSD">BTCUSD</option>
          <option value="EURUSD">EURUSD</option>
          <option value="GBPUSD">GBPUSD</option>
          <option value="USDJPY">USDJPY</option>
          <option value="NASDAQ">NASDAQ</option>
          <option value="S&P500">S&P500</option>
        </select>

        <select
          name="direction"
          defaultValue={direction}
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="">Tutte le direzioni</option>
          <option value="LONG">LONG</option>
          <option value="SHORT">SHORT</option>
        </select>

        <select
          name="outcome"
          defaultValue={outcome}
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="">Tutti gli outcome</option>
          <option value="win">Win</option>
          <option value="loss">Loss</option>
          <option value="be">BE</option>
        </select>

        <input
          name="strategy"
          defaultValue={strategy}
          placeholder="Cerca strategia"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <div className="grid grid-cols-2 gap-3 sm:col-span-2 xl:col-span-1">
          <button
            type="submit"
            className="rounded-xl bg-green-500 p-3 font-bold text-black"
          >
            Filtra
          </button>

          <a
            href="/diary"
            className="rounded-xl bg-white/10 p-3 text-center font-bold text-gray-200 hover:bg-white/20"
          >
            Reset
          </a>
        </div>
      </form>

      <div className="mb-4 text-sm text-gray-400">
        Operazioni trovate:{" "}
        <span className="font-semibold text-white">{trades.length}</span>
      </div>

      {/* MOBILE CARDS */}
      <div className="space-y-4 lg:hidden">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold">{trade.symbol}</p>
                <p className="text-sm text-gray-400">
                  {new Date(trade.openDate).toLocaleDateString()}{" "}
                  {trade.openTime || ""}
                </p>
              </div>

              <span
                className={
                  trade.direction === "LONG"
                    ? "rounded-lg bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400"
                    : "rounded-lg bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-400"
                }
              >
                {trade.direction}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Strategia</p>
                <p className="font-medium">{trade.strategy || "-"}</p>
              </div>

              <div>
                <p className="text-gray-500">Outcome</p>
                <p
                  className={
                    trade.outcome === "win"
                      ? "font-semibold text-green-400"
                      : trade.outcome === "loss"
                      ? "font-semibold text-red-400"
                      : trade.outcome === "be"
                      ? "font-semibold text-yellow-400"
                      : "font-semibold text-gray-400"
                  }
                >
                  {trade.outcome || "Pending"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Result $</p>
                <p
                  className={
                    trade.resultUsd && trade.resultUsd < 0
                      ? "font-semibold text-red-400"
                      : "font-semibold text-green-400"
                  }
                >
                  {trade.resultUsd ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Result %</p>
                <p
                  className={
                    trade.resultPercent && trade.resultPercent < 0
                      ? "font-semibold text-red-400"
                      : "font-semibold text-green-400"
                  }
                >
                  {trade.resultPercent !== null
                    ? `${trade.resultPercent.toFixed(2)}%`
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Equity</p>
                <p>{trade.equity !== null ? trade.equity.toFixed(2) : "-"}</p>
              </div>

              <div>
                <p className="text-gray-500">Drawdown</p>
                <p
                  className={
                    trade.drawdownPercent && trade.drawdownPercent < 0
                      ? "text-red-400"
                      : "text-gray-300"
                  }
                >
                  {trade.drawdownPercent !== null
                    ? `${trade.drawdownPercent.toFixed(2)}%`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href={`/diary/${trade.id}/edit`}
                className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-center text-sm text-gray-200 hover:bg-white/20"
              >
                Modifica
              </a>

              <form action={deleteTrade} className="flex-1">
                <input type="hidden" name="id" value={trade.id} />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                >
                  Elimina
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] lg:block">
        <table className="w-full min-w-[1600px] border-collapse">
          <thead className="bg-white/5 text-left text-sm text-gray-400">
            <tr>
              <th className="p-4">Data</th>
              <th className="p-4">Ora</th>
              <th className="p-4">Strategia</th>
              <th className="p-4">Strumento</th>
              <th className="p-4">Direzione</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Entry</th>
              <th className="p-4">SL</th>
              <th className="p-4">TP</th>
              <th className="p-4">R:R</th>
              <th className="p-4">Outcome</th>
              <th className="p-4">Result $</th>
              <th className="p-4">Result %</th>
              <th className="p-4">Equity</th>
              <th className="p-4">Equity Peak</th>
              <th className="p-4">Drawdown %</th>
              <th className="p-4">Azioni</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-t border-white/10 text-sm">
                <td className="p-4">
                  {new Date(trade.openDate).toLocaleDateString()}
                </td>
                <td className="p-4">{trade.openTime || "-"}</td>
                <td className="p-4">{trade.strategy || "-"}</td>
                <td className="p-4 font-medium">{trade.symbol}</td>
                <td className="p-4">
                  <span
                    className={
                      trade.direction === "LONG"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {trade.direction}
                  </span>
                </td>
                <td className="p-4">{trade.amount ?? "-"}</td>
                <td className="p-4">{trade.openingPrice ?? "-"}</td>
                <td className="p-4">{trade.stopLoss ?? "-"}</td>
                <td className="p-4">{trade.takeProfit ?? "-"}</td>
                <td className="p-4">{trade.riskReward ?? "-"}</td>
                <td className="p-4">{trade.outcome || "Pending"}</td>
                <td
                  className={
                    trade.resultUsd && trade.resultUsd < 0
                      ? "p-4 text-red-400"
                      : "p-4 text-green-400"
                  }
                >
                  {trade.resultUsd ?? "-"}
                </td>
                <td
                  className={
                    trade.resultPercent && trade.resultPercent < 0
                      ? "p-4 text-red-400"
                      : "p-4 text-green-400"
                  }
                >
                  {trade.resultPercent !== null
                    ? `${trade.resultPercent.toFixed(2)}%`
                    : "-"}
                </td>
                <td className="p-4">
                  {trade.equity !== null ? trade.equity.toFixed(2) : "-"}
                </td>
                <td className="p-4">
                  {trade.equityPeak !== null
                    ? trade.equityPeak.toFixed(2)
                    : "-"}
                </td>
                <td
                  className={
                    trade.drawdownPercent && trade.drawdownPercent < 0
                      ? "p-4 text-red-400"
                      : "p-4 text-gray-300"
                  }
                >
                  {trade.drawdownPercent !== null
                    ? `${trade.drawdownPercent.toFixed(2)}%`
                    : "-"}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <a
                      href={`/diary/${trade.id}/edit`}
                      className="rounded-lg bg-white/10 px-3 py-1 text-sm text-gray-200 hover:bg-white/20"
                    >
                      Modifica
                    </a>

                    <form action={deleteTrade}>
                      <input type="hidden" name="id" value={trade.id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-red-500/10 px-3 py-1 text-sm text-red-400 hover:bg-red-500/20"
                      >
                        Elimina
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}