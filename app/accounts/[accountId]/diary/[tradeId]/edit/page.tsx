import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { updateAccountTrade } from "../../actions";

function formatDateForInput(date: Date | null) {
  if (!date) return "";

  return date.toISOString().split("T")[0];
}

function getTradeSourceLabel(source?: string | null) {
  if (source === "mt5") {
    return "MT5";
  }

  if (source === "broker") {
    return "Broker";
  }

  return "Manual";
}

function getTradeSourceClass(source?: string | null) {
  if (source === "mt5") {
    return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
  }

  if (source === "broker") {
    return "border-blue-500/20 bg-blue-500/10 text-blue-300";
  }

  return "border-white/10 bg-white/10 text-gray-300";
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

  const { accountId, tradeId } = await params;

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

  const isManager =
    String(membership.role) === "MANAGER";

  const canEditTrades =
    isManager || membership.canEditTrades;

  if (!canEditTrades) {
    redirect(`/accounts/${accountId}/diary`);
  }

  if (
    membership.tradingAccount.status === "ARCHIVED"
  ) {
    redirect(`/accounts/${accountId}/diary`);
  }

  const trade = await prisma.trade.findFirst({
    where: {
      id: Number(tradeId),
      tradingAccountId: accountId,
    },
  });

  if (!trade) {
    redirect(`/accounts/${accountId}/diary`);
  }

  const isImportedTrade =
    trade.source !== "manual";

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

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          Completa i dati operativi, la strategia, le note e la review del trade.
        </p>
      </div>

      {isImportedTrade && (
        <div className="mb-6 rounded-3xl border border-yellow-500/20 bg-yellow-500/[0.06] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-yellow-300">
                Imported Trade
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Review required
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
                Questo trade è stato importato automaticamente. I dati tecnici sono già presenti, ma devi completare la parte personale: motivo, strategia, stato emotivo, errori e lezioni apprese.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-xl border px-3 py-1 text-xs font-bold ${getTradeSourceClass(
                  trade.source
                )}`}
              >
                {getTradeSourceLabel(trade.source)}
              </span>

              {trade.needsReview && (
                <span className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-yellow-300">
                  Needs Review
                </span>
              )}

              {trade.syncStatus === "reviewed" && (
                <span className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-green-400">
                  Reviewed
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <form
        action={updateTradeAction}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {isImportedTrade && (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 sm:col-span-2 xl:col-span-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Review Status
                </p>

                <h3 className="mt-2 text-lg font-bold text-white">
                  Mark imported trade as reviewed
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Spunta questa casella solo dopo aver completato motivo, strategia, emozioni, errori e lezioni apprese.
                </p>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-400">
                <input
                  type="checkbox"
                  name="markAsReviewed"
                  defaultChecked={
                    !trade.needsReview &&
                    trade.syncStatus === "reviewed"
                  }
                  className="h-5 w-5"
                />
                Reviewed
              </label>
            </div>
          </div>
        )}

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
          defaultValue={trade.openTime || ""}
          type="time"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="reason"
          defaultValue={trade.reason || ""}
          placeholder="Motivo"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="strategy"
          defaultValue={trade.strategy || ""}
          placeholder="Strategia"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <select
          name="symbol"
          defaultValue={trade.symbol}
          required
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="">Strumento</option>

          <optgroup label="Forex">
            <option value="EURUSD">EURUSD</option>
            <option value="GBPUSD">GBPUSD</option>
            <option value="USDJPY">USDJPY</option>
            <option value="AUDUSD">AUDUSD</option>
            <option value="USDCAD">USDCAD</option>
            <option value="USDCHF">USDCHF</option>
            <option value="NZDUSD">NZDUSD</option>
          </optgroup>

          <optgroup label="Gold & Commodities">
            <option value="XAUUSD">XAUUSD</option>
            <option value="XAGUSD">XAGUSD</option>
            <option value="USOIL">USOIL</option>
            <option value="UKOIL">UKOIL</option>
          </optgroup>

          <optgroup label="Crypto">
            <option value="BTCUSD">BTCUSD</option>
            <option value="ETHUSD">ETHUSD</option>
            <option value="SOLUSD">SOLUSD</option>
            <option value="XRPUSD">XRPUSD</option>
          </optgroup>

          <optgroup label="Indices">
            <option value="NASDAQ">NASDAQ</option>
            <option value="S&P500">S&P500</option>
            <option value="DAX40">DAX40</option>
            <option value="DJI">DJI</option>
          </optgroup>
        </select>

        <select
          name="direction"
          defaultValue={trade.direction}
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="LONG">LONG</option>
          <option value="SHORT">SHORT</option>
        </select>

        <input
          name="amount"
          defaultValue={trade.amount ?? ""}
          placeholder="Amount"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="openingPrice"
          defaultValue={trade.openingPrice ?? ""}
          placeholder="Opening Price"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="stopLoss"
          defaultValue={trade.stopLoss ?? ""}
          placeholder="Stop Loss"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="takeProfit"
          defaultValue={trade.takeProfit ?? ""}
          placeholder="Take Profit"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="riskReward"
          defaultValue={trade.riskReward ?? ""}
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
          defaultValue={trade.closingPrice ?? ""}
          placeholder="Closing Price"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <select
          name="outcome"
          defaultValue={trade.outcome || ""}
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="">Outcome</option>
          <option value="win">Win</option>
          <option value="loss">Loss</option>
          <option value="be">BE</option>
        </select>

        <input
          name="resultUsd"
          defaultValue={trade.resultUsd ?? ""}
          placeholder="Result $"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <textarea
          name="notes"
          defaultValue={trade.notes || ""}
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