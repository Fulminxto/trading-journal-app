import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
  createTradingAccount,
  addMemberToAccount,
  removeMemberFromAccount,
} from "../actions";

export default async function AdminAccountsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser =
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

  if (
    !currentUser ||
    currentUser.role !== "OWNER"
  ) {
    redirect("/accounts");
  }

  const accounts =
    await prisma.tradingAccount.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },

        trades: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div>
      <div className="mb-10">
        <p className="text-sm text-gray-400">
          Gestione conti
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Accounts Management
        </h1>
      </div>

      <form
        action={createTradingAccount}
        className="mb-10 grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2 xl:grid-cols-4"
      >
        <input
          name="name"
          placeholder="Nome account"
          className="rounded-2xl bg-zinc-900 p-4"
          required
        />

        <select
          name="type"
          className="rounded-2xl bg-zinc-900 p-4"
          required
        >
          <option value="LIVE">
            LIVE
          </option>

          <option value="DEMO">
            DEMO
          </option>

          <option value="PROP">
            PROP
          </option>

          <option value="SHARED">
            SHARED
          </option>

          <option value="CHALLENGE">
            CHALLENGE
          </option>

          <option value="FUNDED">
            FUNDED
          </option>
        </select>

        <input
          name="initialBalance"
          type="number"
          placeholder="Balance iniziale"
          className="rounded-2xl bg-zinc-900 p-4"
          required
        />

        <input
          name="currency"
          defaultValue="USD"
          placeholder="Valuta"
          className="rounded-2xl bg-zinc-900 p-4"
          required
        />

        <input
          name="broker"
          placeholder="Broker / Prop Firm"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="phase"
          placeholder="Phase"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="profitTarget"
          type="number"
          step="0.01"
          placeholder="Profit Target %"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="maxDrawdown"
          type="number"
          step="0.01"
          placeholder="Max Drawdown %"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="dailyDrawdown"
          type="number"
          step="0.01"
          placeholder="Daily Drawdown %"
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <button
          type="submit"
          className="rounded-2xl bg-green-500 p-4 font-bold text-black md:col-span-2 xl:col-span-4"
        >
          Crea account
        </button>
      </form>

      <div className="space-y-8">
        {accounts.map((account) => {
          const totalPnl =
            account.trades.reduce(
              (acc, trade) =>
                acc +
                (trade.resultUsd || 0),
              0
            );

          return (
            <div
              key={account.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold">
                    {account.name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    {account.type}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-gray-500">
                        Broker
                      </p>

                      <h3 className="mt-2 font-bold">
                        {account.broker ||
                          "-"}
                      </h3>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-gray-500">
                        Phase
                      </p>

                      <h3 className="mt-2 font-bold">
                        {account.phase ||
                          "-"}
                      </h3>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-gray-500">
                        Profit Target
                      </p>

                      <h3 className="mt-2 font-bold text-green-400">
                        {account.profitTarget
                          ? `${account.profitTarget}%`
                          : "-"}
                      </h3>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-gray-500">
                        Max DD
                      </p>

                      <h3 className="mt-2 font-bold text-red-400">
                        {account.maxDrawdown
                          ? `${account.maxDrawdown}%`
                          : "-"}
                      </h3>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-gray-500">
                        Daily DD
                      </p>

                      <h3 className="mt-2 font-bold text-red-400">
                        {account.dailyDrawdown
                          ? `${account.dailyDrawdown}%`
                          : "-"}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="rounded-2xl bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
                    {account.currency}
                  </div>

                  <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm">
                    Trades:{" "}
                    {account.trades.length}
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                      totalPnl >= 0
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    PnL:{" "}
                    {totalPnl.toFixed(2)}
                  </div>
                </div>
              </div>

              <form
                action={addMemberToAccount}
                className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
              >
                <input
                  type="hidden"
                  name="tradingAccountId"
                  value={account.id}
                />

                <input
                  name="username"
                  placeholder="Username utente"
                  className="rounded-2xl bg-zinc-900 p-4"
                  required
                />

                <select
                  name="role"
                  className="rounded-2xl bg-zinc-900 p-4"
                >
                  <option value="MEMBER">
                    MEMBER
                  </option>

                  <option value="OWNER">
                    OWNER
                  </option>
                </select>

                <button
                  type="submit"
                  className="rounded-2xl bg-white/10 p-4 font-semibold hover:bg-white/20"
                >
                  Aggiungi membro
                </button>
              </form>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {account.members.map(
                  (member) => (
                    <div
                      key={member.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold">
                            {
                              member.user
                                .username
                            }
                          </p>

                          <p className="mt-1 text-sm text-gray-400">
                            {member.user
                              .name || "-"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-white/10 px-3 py-1 text-sm">
                            {member.role}
                          </div>

                          <form
                            action={
                              removeMemberFromAccount
                            }
                          >
                            <input
                              type="hidden"
                              name="membershipId"
                              value={
                                member.id
                              }
                            />

                            <button
                              type="submit"
                              className="rounded-xl bg-red-500/10 px-3 py-1 text-sm text-red-400 hover:bg-red-500/20"
                            >
                              Remove
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}