import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
  createAccountTrade,
  deleteAccountTrade,
} from "./actions";

export default async function DiaryPage({
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

    orderBy: [
      {
        openDate: "desc",
      },
    ],
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Registro operativo
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Trading Diary
          </h1>
        </div>
      </div>

      <form
        action={createAccountTrade.bind(
          null,
          accountId
        )}
        className="mb-10 grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        <input
          name="openDate"
          type="date"
          className="rounded-2xl bg-zinc-900 p-4"
          required
        />

        <input
          name="openTime"
          type="time"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="reason"
          placeholder="Motivo"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="strategy"
          placeholder="Strategia"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <select
          name="symbol"
          required
          className="rounded-2xl bg-zinc-900 p-4"
        >
          <option value="">
            Strumento
          </option>

          <optgroup label="Forex">
            <option value="EURUSD">
              EURUSD
            </option>

            <option value="GBPUSD">
              GBPUSD
            </option>

            <option value="USDJPY">
              USDJPY
            </option>

            <option value="AUDUSD">
              AUDUSD
            </option>

            <option value="USDCAD">
              USDCAD
            </option>

            <option value="USDCHF">
              USDCHF
            </option>

            <option value="NZDUSD">
              NZDUSD
            </option>
          </optgroup>

          <optgroup label="Gold & Commodities">
            <option value="XAUUSD">
              XAUUSD
            </option>

            <option value="XAGUSD">
              XAGUSD
            </option>

            <option value="USOIL">
              USOIL
            </option>

            <option value="UKOIL">
              UKOIL
            </option>
          </optgroup>

          <optgroup label="Crypto">
            <option value="BTCUSD">
              BTCUSD
            </option>

            <option value="ETHUSD">
              ETHUSD
            </option>

            <option value="SOLUSD">
              SOLUSD
            </option>

            <option value="XRPUSD">
              XRPUSD
            </option>
          </optgroup>

          <optgroup label="Indices">
            <option value="NASDAQ">
              NASDAQ
            </option>

            <option value="S&P500">
              S&P500
            </option>

            <option value="DAX40">
              DAX40
            </option>

            <option value="DJI">
              DJI
            </option>
          </optgroup>
        </select>

        <select
          name="direction"
          className="rounded-2xl bg-zinc-900 p-4"
        >
          <option value="LONG">
            LONG
          </option>

          <option value="SHORT">
            SHORT
          </option>
        </select>

        <input
          name="amount"
          placeholder="Amount"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="openingPrice"
          placeholder="Opening Price"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="stopLoss"
          placeholder="Stop Loss"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="takeProfit"
          placeholder="Take Profit"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="riskReward"
          placeholder="Risk Reward"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="closeDate"
          type="date"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="closingPrice"
          placeholder="Closing Price"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <select
          name="outcome"
          className="rounded-2xl bg-zinc-900 p-4"
        >
          <option value="">
            Outcome
          </option>

          <option value="win">
            Win
          </option>

          <option value="loss">
            Loss
          </option>

          <option value="be">
            BE
          </option>
        </select>

        <input
          name="resultUsd"
          placeholder="Result $"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <textarea
          name="notes"
          placeholder="Note"
          className="rounded-2xl bg-zinc-900 p-4 sm:col-span-2 xl:col-span-4"
        />

        <button
          type="submit"
          className="rounded-2xl bg-green-500 p-4 font-bold text-black sm:col-span-2 xl:col-span-4"
        >
          Aggiungi trade
        </button>
      </form>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]">
        <table className="w-full border-collapse">
          <thead className="bg-white/5 text-left text-sm text-gray-400">
            <tr>
              <th className="p-4">
                Data
              </th>

              <th className="p-4">
                Symbol
              </th>

              <th className="p-4">
                Direction
              </th>

              <th className="p-4">
                Outcome
              </th>

              <th className="p-4">
                Result
              </th>

              <th className="p-4">
                Equity
              </th>

              <th className="p-4">
                Actions
              </th>
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
                  {trade.symbol}
                </td>

                <td
                  className={`p-4 font-semibold ${
                    trade.direction ===
                    "LONG"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {trade.direction}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-xl px-3 py-1 text-sm font-semibold ${
                      trade.outcome ===
                      "win"
                        ? "bg-green-500/10 text-green-400"
                        : trade.outcome ===
                          "loss"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {trade.outcome ||
                      "-"}
                  </span>
                </td>

                <td
                  className={`p-4 font-bold ${
                    (trade.resultUsd ||
                      0) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {(
                    trade.resultUsd ||
                    0
                  ).toFixed(2)}
                </td>

                <td className="p-4 font-semibold">
                  {(
                    trade.equity || 0
                  ).toFixed(2)}
                </td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <Link
                      href={`/accounts/${accountId}/diary/${trade.id}/edit`}
                      className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                    >
                      Edit
                    </Link>

                    <form
                      action={deleteAccountTrade.bind(
                        null,
                        accountId,
                        trade.id
                      )}
                    >
                      <button
                        type="submit"
                        className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                      >
                        Delete
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