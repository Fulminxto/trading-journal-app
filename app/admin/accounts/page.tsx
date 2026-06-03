import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
  createTradingAccount,
  addMemberToAccount,
  removeMemberFromAccount,
  updateMemberRole,
  updateMemberPermissions,
} from "../actions";

import {
  archiveAccount,
  restoreAccount,
  deleteAccount,
} from "@/app/accounts/actions";

import {
  formatAdminMoney,
  getAdminI18n,
  valueLabel,
} from "../AdminI18n";

export default async function AdminAccountsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!currentUser || currentUser.role !== "FOUNDER") {
    redirect("/accounts");
  }

  const { language, t } = getAdminI18n(
    currentUser.appLanguage
  );

  const accounts = await prisma.tradingAccount.findMany({
    include: {
      createdBy: true,
      members: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      trades: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const activeAccounts = accounts.filter(
    (account) => account.status === "ACTIVE"
  );

  const archivedAccounts = accounts.filter(
    (account) => account.status === "ARCHIVED"
  );

  const renderAccountCard = (
    account: (typeof accounts)[number]
  ) => {
    const totalPnl = account.trades.reduce(
      (acc, trade) => acc + (trade.resultUsd || 0),
      0
    );

    const isArchived =
      account.status === "ARCHIVED";

    return (
      <div
        key={account.id}
        className={`rounded-3xl border p-6 ${isArchived
            ? "border-yellow-500/20 bg-yellow-500/[0.04]"
            : "border-white/10 bg-white/[0.03]"
          }`}
      >
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold">
                {account.name}
              </h2>

              <span
                className={`rounded-xl px-3 py-1 text-xs font-bold ${isArchived
                    ? "bg-yellow-500/10 text-yellow-300"
                    : "bg-green-500/10 text-green-400"
                  }`}
              >
                {valueLabel(
                  t,
                  "accountStatus",
                  account.status
                )}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-400">
              {account.type} · {t.createdBy}{" "}
              <span className="text-gray-200">
                {account.createdBy?.username || t.system}
              </span>
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-gray-500">
                  {t.broker}
                </p>

                <h3 className="mt-2 font-bold">
                  {account.broker || "-"}
                </h3>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-gray-500">
                  {t.phase}
                </p>

                <h3 className="mt-2 font-bold">
                  {account.phase || "-"}
                </h3>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-gray-500">
                  {t.profitTarget}
                </p>

                <h3 className="mt-2 font-bold text-green-400">
                  {account.profitTarget
                    ? `${account.profitTarget}%`
                    : "-"}
                </h3>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-gray-500">
                  {t.maxDd}
                </p>

                <h3 className="mt-2 font-bold text-red-400">
                  {account.maxDrawdown
                    ? `${account.maxDrawdown}%`
                    : "-"}
                </h3>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-gray-500">
                  {t.dailyDd}
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
              {t.trades}: {account.trades.length}
            </div>

            <div
              className={`rounded-2xl px-4 py-2 text-sm font-semibold ${totalPnl >= 0
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
                }`}
            >
              {t.pnl}:{" "}
              {formatAdminMoney(
                totalPnl,
                account.currency,
                language
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-300">
            {t.accountActions}
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={`/accounts/${account.id}`}
              className="rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-black hover:bg-green-400"
            >
              {t.openAccount}
            </a>

            {!isArchived ? (
              <form action={archiveAccount}>
                <input
                  type="hidden"
                  name="accountId"
                  value={account.id}
                />

                <input
                  type="hidden"
                  name="redirectTo"
                  value="/admin/accounts"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-yellow-500/10 px-4 py-3 text-sm font-bold text-yellow-400 hover:bg-yellow-500/20"
                >
                  {t.archive}
                </button>
              </form>
            ) : (
              <form action={restoreAccount}>
                <input
                  type="hidden"
                  name="accountId"
                  value={account.id}
                />

                <input
                  type="hidden"
                  name="redirectTo"
                  value="/admin/accounts"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-blue-500/10 px-4 py-3 text-sm font-bold text-blue-400 hover:bg-blue-500/20"
                >
                  {t.restore}
                </button>
              </form>
            )}
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
            placeholder={t.userUsernamePlaceholder}
            className="rounded-2xl bg-zinc-900 p-4"
            required
          />

          <select
            name="role"
            aria-label={t.memberRole}
            className="rounded-2xl bg-zinc-900 p-4"
            defaultValue="MEMBER"
          >
            <option value="MANAGER">MANAGER</option>
            <option value="MEMBER">MEMBER</option>
            <option value="VIEWER">VIEWER</option>
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-white/10 p-4 font-semibold hover:bg-white/20"
          >
            {t.addMember}
          </button>
        </form>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {account.members.map((member) => {
            const isAccountManager =
              member.role === "MANAGER";

            return (
              <div
                key={member.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold">
                      {member.user.username}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {member.user.name || "-"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/10 px-3 py-1 text-sm font-bold">
                    {member.role}
                  </div>
                </div>

                <div className="space-y-3">
                  <form
                    action={updateMemberRole}
                    className="grid grid-cols-1 gap-3"
                  >
                    <input
                      type="hidden"
                      name="membershipId"
                      value={member.id}
                    />

                    <select
                      name="role"
                      aria-label={t.updateMemberRole}
                      defaultValue={member.role}
                      className="rounded-xl bg-zinc-900 p-3 text-sm"
                    >
                      <option value="MANAGER">MANAGER</option>
                      <option value="MEMBER">MEMBER</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>

                    <button
                      type="submit"
                      className="rounded-xl bg-green-500/10 px-3 py-2 text-sm font-semibold text-green-400 hover:bg-green-500/20"
                    >
                      {t.updateRole}
                    </button>
                  </form>

                  {isAccountManager ? (
                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-300">
                      {t.fullAccountAccess}
                    </div>
                  ) : (
                    <form
                      action={updateMemberPermissions}
                      className="rounded-xl border border-white/10 p-3 text-sm"
                    >
                      <input
                        type="hidden"
                        name="membershipId"
                        value={member.id}
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="canCreateTrades"
                            defaultChecked={member.canCreateTrades}
                          />
                          {t.createTrades}
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="canEditTrades"
                            defaultChecked={member.canEditTrades}
                          />
                          {t.editTrades}
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="canDeleteTrades"
                            defaultChecked={member.canDeleteTrades}
                          />
                          {t.deleteTrades}
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="canViewAnalytics"
                            defaultChecked={member.canViewAnalytics}
                          />
                          {t.analytics}
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="canViewReports"
                            defaultChecked={member.canViewReports}
                          />
                          {t.reports}
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="canViewCopilot"
                            defaultChecked={member.canViewCopilot}
                          />
                          {t.copilot}
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="canViewMembers"
                            defaultChecked={member.canViewMembers}
                          />
                          {t.members}
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="canManageMembers"
                            defaultChecked={member.canManageMembers}
                          />
                          {t.manageMembers}
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="canManageRoles"
                            defaultChecked={member.canManageRoles}
                          />
                          {t.manageRoles}
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="canManageAccount"
                            defaultChecked={member.canManageAccount}
                          />
                          {t.manageAccount}
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="mt-3 w-full rounded-xl bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-400 hover:bg-blue-500/20"
                      >
                        {t.savePermissions}
                      </button>
                    </form>
                  )}

                  <form action={removeMemberFromAccount}>
                    <input
                      type="hidden"
                      name="membershipId"
                      value={member.id}
                    />

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                    >
                      {t.remove}
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>

        <details className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-4">
          <summary className="cursor-pointer text-sm font-bold text-red-400">
            {t.dangerZone}
          </summary>

          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-red-500/20 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-bold text-red-300">
                {t.deleteAccountPermanently}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                {t.deleteAccountWarning}
              </p>
            </div>

            <form action={deleteAccount}>
              <input
                type="hidden"
                name="accountId"
                value={account.id}
              />

              <input
                type="hidden"
                name="redirectTo"
                value="/admin/accounts"
              />

              <button
                type="submit"
                className="rounded-xl bg-red-500 px-4 py-3 text-sm font-black text-black hover:bg-red-400"
              >
                {t.deletePermanently}
              </button>
            </form>
          </div>
        </details>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-10">
        <p className="text-sm text-gray-400">
          {t.accountsEyebrow}
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          {t.accountsManagement}
        </h1>
      </div>

      <form
        action={createTradingAccount}
        className="mb-10 grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2 xl:grid-cols-4"
      >
        <input
          name="name"
          placeholder={t.accountName}
          className="rounded-2xl bg-zinc-900 p-4"
          required
        />

        <select
          name="type"
          aria-label={t.accountType}
          className="rounded-2xl bg-zinc-900 p-4"
          required
        >
          <option value="LIVE">LIVE</option>
          <option value="DEMO">DEMO</option>
          <option value="PROP">PROP</option>
          <option value="SHARED">SHARED</option>
          <option value="CHALLENGE">CHALLENGE</option>
          <option value="FUNDED">FUNDED</option>
        </select>

        <input
          name="initialBalance"
          type="number"
          placeholder={t.initialBalance}
          className="rounded-2xl bg-zinc-900 p-4"
          required
        />

        <input
          name="currency"
          defaultValue="USD"
          placeholder={t.currency}
          className="rounded-2xl bg-zinc-900 p-4"
          required
        />

        <input
          name="broker"
          placeholder={t.brokerPropFirm}
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="phase"
          placeholder={t.phase}
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="profitTarget"
          type="number"
          step="0.01"
          placeholder={`${t.profitTarget} %`}
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="maxDrawdown"
          type="number"
          step="0.01"
          placeholder={`${t.maxDd} %`}
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <input
          name="dailyDrawdown"
          type="number"
          step="0.01"
          placeholder={`${t.dailyDd} %`}
          className="rounded-2xl bg-zinc-900 p-4"
        />

        <button
          type="submit"
          className="rounded-2xl bg-green-500 p-4 font-bold text-black md:col-span-2 xl:col-span-4"
        >
          {t.createAccount}
        </button>
      </form>

      <div className="space-y-12">
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                {t.activeWorkspace}
              </p>

              <h2 className="text-2xl font-black">
                {t.activeAccounts}
              </h2>
            </div>

            <span className="rounded-xl bg-green-500/10 px-3 py-2 text-sm font-bold text-green-400">
              {activeAccounts.length}
            </span>
          </div>

          <div className="space-y-8">
            {activeAccounts.length > 0 ? (
              activeAccounts.map(renderAccountCard)
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm text-gray-400">
                {t.noActiveAccounts}
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                {t.inactiveWorkspace}
              </p>

              <h2 className="text-2xl font-black">
                {t.archivedAccounts}
              </h2>
            </div>

            <span className="rounded-xl bg-yellow-500/10 px-3 py-2 text-sm font-bold text-yellow-300">
              {archivedAccounts.length}
            </span>
          </div>

          <div className="space-y-8">
            {archivedAccounts.length > 0 ? (
              archivedAccounts.map(renderAccountCard)
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm text-gray-400">
                {t.noArchivedAccounts}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
