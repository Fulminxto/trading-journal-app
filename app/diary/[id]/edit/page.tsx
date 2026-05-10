import { prisma } from "@/lib/prisma";
import { updateTrade } from "../../actions";

function formatDateForInput(date: Date | null) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export default async function EditTradePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const trade = await prisma.trade.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!trade) {
    return <h1 className="text-3xl font-bold">Trade non trovato</h1>;
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">Modifica operazione</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Edit Trade</h1>
      </div>

      <form
        action={updateTrade}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4"
      >
        <input type="hidden" name="id" value={trade.id} />

        <input
          name="openDate"
          type="date"
          defaultValue={formatDateForInput(trade.openDate)}
          className="rounded-xl bg-zinc-900 p-3"
          required
        />

        <input
          name="openTime"
          type="time"
          defaultValue={trade.openTime || ""}
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
          className="rounded-xl bg-zinc-900 p-3"
          required
        >
          <option value="">Strumento</option>
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
          defaultValue={trade.direction}
          className="rounded-xl bg-zinc-900 p-3"
          required
        >
          <option value="LONG">LONG</option>
          <option value="SHORT">SHORT</option>
        </select>

        <select
          name="amount"
          defaultValue={trade.amount ?? ""}
          className="rounded-xl bg-zinc-900 p-3"
        >
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

        <select
          name="riskReward"
          defaultValue={trade.riskReward ?? ""}
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="">Risk / Reward</option>
          <option value="1">1R</option>
          <option value="1.5">1.5R</option>
          <option value="2">2R</option>
          <option value="2.5">2.5R</option>
          <option value="3">3R</option>
          <option value="4">4R</option>
          <option value="5">5R</option>
        </select>

        <input
          name="closeDate"
          type="date"
          defaultValue={formatDateForInput(trade.closeDate)}
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