import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { updateAccountTrade } from "../../actions";

function formatDateForInput(date: Date | null) {
  if (!date) return "";

  return date
    .toISOString()
    .split("T")[0];
}

export default async function EditTradePage({
  params,
}: {
  params: Promise<{
    accountId: string;
    tradeId: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const {
    accountId,
    tradeId,
  } = await params;

  const membership =
    await prisma.accountMember.findFirst({
      where: {
        userId: session.user.id,
        tradingAccountId:
          accountId,
      },
    });

  if (!membership) {
    redirect("/accounts");
  }

  const trade =
    await prisma.trade.findFirst({
      where: {
        id: Number(tradeId),
        tradingAccountId:
          accountId,
      },
    });

  if (!trade) {
    redirect(
      `/accounts/${accountId}/diary`
    );
  }

  async function updateTradeAction(
    formData: FormData
  ) {
    "use server";

    await updateAccountTrade(
      accountId,
      Number(tradeId),
      formData
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">
          Modifica trade
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          Edit Trade
        </h1>
      </div>

      <form
        action={updateTradeAction}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <input
          name="openDate"
          defaultValue={formatDateForInput(
            trade.openDate
          )}
          type="date"
          className="rounded-xl bg-zinc-900 p-3"
          required
        />

        <input
          name="openTime"
          defaultValue={
            trade.openTime || ""
          }
          type="time"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="reason"
          defaultValue={
            trade.reason || ""
          }
          placeholder="Motivo"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="strategy"
          defaultValue={
            trade.strategy || ""
          }
          placeholder="Strategia"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <select
          name="symbol"
          defaultValue={trade.symbol}
          required
          className="rounded-xl bg-zinc-900 p-3"
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
          defaultValue={
            trade.direction
          }
          className="rounded-xl bg-zinc-900 p-3"
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
          defaultValue={
            trade.amount ?? ""
          }
          placeholder="Amount"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="openingPrice"
          defaultValue={
            trade.openingPrice ??
            ""
          }
          placeholder="Opening Price"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="stopLoss"
          defaultValue={
            trade.stopLoss ?? ""
          }
          placeholder="Stop Loss"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="takeProfit"
          defaultValue={
            trade.takeProfit ?? ""
          }
          placeholder="Take Profit"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="riskReward"
          defaultValue={
            trade.riskReward ??
            ""
          }
          placeholder="Risk Reward"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="closeDate"
          defaultValue={formatDateForInput(
            trade.closeDate
          )}
          type="date"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="closingPrice"
          defaultValue={
            trade.closingPrice ??
            ""
          }
          placeholder="Closing Price"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <select
          name="outcome"
          defaultValue={
            trade.outcome || ""
          }
          className="rounded-xl bg-zinc-900 p-3"
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
          defaultValue={
            trade.resultUsd ?? ""
          }
          placeholder="Result $"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <textarea
          name="notes"
          defaultValue={
            trade.notes || ""
          }
          placeholder="Note"
          className="rounded-xl bg-zinc-900 p-3 sm:col-span-2 xl:col-span-4"
        />

        <button
          type="submit"
          className="rounded-xl bg-green-500 p-3 font-bold text-black sm:col-span-2 xl:col-span-4"
        >
          Salva modifiche
        </button>
      </form>
    </div>
  );
}