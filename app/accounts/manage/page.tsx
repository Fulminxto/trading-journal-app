import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
    createAccount,
    archiveAccount,
    restoreAccount,
    deleteAccount,
} from "../actions";

const accountTypes = [
    "LIVE",
    "PROP",
    "DEMO",
    "SHARED",
    "CHALLENGE",
    "FUNDED",
] as const;

function formatCurrency(
    value: number,
    currency: string
) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(value);
}

export default async function ManageMyAccountsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!currentUser) {
        redirect("/login");
    }

    const canCreatePersonalAccount =
        currentUser.role === "FOUNDER" ||
        currentUser.role === "ADMIN" ||
        currentUser.canCreatePersonalAccounts;

    const canCreateSharedAccount =
        currentUser.role === "FOUNDER" ||
        currentUser.role === "ADMIN" ||
        currentUser.canCreateSharedAccounts;

    const canCreateAccount =
        canCreatePersonalAccount ||
        canCreateSharedAccount;

    const accounts = await prisma.tradingAccount.findMany({
        where: {
            OR: [
                {
                    createdById: currentUser.id,
                },
                {
                    members: {
                        some: {
                            userId: currentUser.id,
                            role: "MANAGER",
                        },
                    },
                },
            ],
        },
        include: {
            createdBy: true,
            trades: true,
            members: {
                include: {
                    user: true,
                },
            },
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

    const totalPnl = accounts.reduce(
        (acc, account) =>
            acc +
            account.trades.reduce(
                (sum, trade) => sum + (trade.resultUsd || 0),
                0
            ),
        0
    );

    const totalTrades = accounts.reduce(
        (acc, account) => acc + account.trades.length,
        0
    );

    const renderAccountCard = (
        account: (typeof accounts)[number]
    ) => {
        const accountPnl = account.trades.reduce(
            (acc, trade) => acc + (trade.resultUsd || 0),
            0
        );

        const isArchived =
            account.status === "ARCHIVED";

        const isCreator =
            account.createdById === currentUser.id;

        const canArchive =
            currentUser.role === "FOUNDER" ||
            currentUser.role === "ADMIN" ||
            (isCreator && currentUser.canArchiveOwnAccounts);

        const canDelete =
            currentUser.role === "FOUNDER" ||
            currentUser.role === "ADMIN" ||
            (isCreator && currentUser.canDeleteOwnAccounts);

        return (
            <div
                key={account.id}
                className={`rounded-3xl border p-6 ${isArchived
                        ? "border-yellow-500/20 bg-yellow-500/[0.04]"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
            >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-black">
                                {account.name}
                            </h3>

                            <span
                                className={`rounded-xl px-3 py-1 text-xs font-bold ${isArchived
                                        ? "bg-yellow-500/10 text-yellow-300"
                                        : "bg-green-500/10 text-green-400"
                                    }`}
                            >
                                {account.status}
                            </span>

                            <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                                {account.type}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-400">
                            Created by{" "}
                            <span className="text-gray-200">
                                {account.createdBy?.username || "System"}
                            </span>
                        </p>
                    </div>

                    <a
                        href={`/accounts/${account.id}/dashboard`}
                        className="rounded-2xl bg-green-500 px-4 py-3 text-center text-sm font-black text-black hover:bg-green-400"
                    >
                        Open Account
                    </a>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-gray-500">
                            Balance
                        </p>

                        <h4 className="mt-2 font-bold">
                            {formatCurrency(
                                account.initialBalance,
                                account.currency
                            )}
                        </h4>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-gray-500">
                            PnL
                        </p>

                        <h4
                            className={`mt-2 font-bold ${accountPnl >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                        >
                            {formatCurrency(
                                accountPnl,
                                account.currency
                            )}
                        </h4>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-gray-500">
                            Trades
                        </p>

                        <h4 className="mt-2 font-bold">
                            {account.trades.length}
                        </h4>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-gray-500">
                            Members
                        </p>

                        <h4 className="mt-2 font-bold">
                            {account.members.length}
                        </h4>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    {!isArchived && canArchive && (
                        <form action={archiveAccount}>
                            <input
                                type="hidden"
                                name="accountId"
                                value={account.id}
                            />

                            <input
                                type="hidden"
                                name="redirectTo"
                                value="/accounts/manage"
                            />

                            <button
                                type="submit"
                                className="rounded-xl bg-yellow-500/10 px-4 py-3 text-sm font-bold text-yellow-300 hover:bg-yellow-500/20"
                            >
                                Archive
                            </button>
                        </form>
                    )}

                    {isArchived && canArchive && (
                        <form action={restoreAccount}>
                            <input
                                type="hidden"
                                name="accountId"
                                value={account.id}
                            />

                            <input
                                type="hidden"
                                name="redirectTo"
                                value="/accounts/manage"
                            />

                            <button
                                type="submit"
                                className="rounded-xl bg-blue-500/10 px-4 py-3 text-sm font-bold text-blue-400 hover:bg-blue-500/20"
                            >
                                Restore
                            </button>
                        </form>
                    )}
                </div>

                {canDelete && (
                    <details className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-4">
                        <summary className="cursor-pointer text-sm font-bold text-red-400">
                            Danger Zone
                        </summary>

                        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-red-500/20 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="font-bold text-red-300">
                                    Delete account permanently
                                </p>

                                <p className="mt-1 text-sm text-gray-400">
                                    This action cannot be undone.
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
                                    value="/accounts/manage"
                                />

                                <button
                                    type="submit"
                                    className="rounded-xl bg-red-500 px-4 py-3 text-sm font-black text-black hover:bg-red-400"
                                >
                                    Delete Permanently
                                </button>
                            </form>
                        </div>
                    </details>
                )}
            </div>
        );
    };

    const renderSection = (
        title: string,
        subtitle: string,
        sectionAccounts: typeof accounts,
        tone: "green" | "yellow" | "white" = "white"
    ) => {
        const badgeClass =
            tone === "green"
                ? "bg-green-500/10 text-green-400"
                : tone === "yellow"
                    ? "bg-yellow-500/10 text-yellow-300"
                    : "bg-white/10 text-gray-300";

        return (
            <section>
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-400">
                            {subtitle}
                        </p>

                        <h2 className="text-2xl font-black">
                            {title}
                        </h2>
                    </div>

                    <span className={`rounded-xl px-3 py-2 text-sm font-bold ${badgeClass}`}>
                        {sectionAccounts.length}
                    </span>
                </div>

                {sectionAccounts.length > 0 ? (
                    <div className="space-y-6">
                        {sectionAccounts.map(renderAccountCard)}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm text-gray-400">
                        Nessun account in questa sezione.
                    </div>
                )}
            </section>
        );
    };

    return (
        <div>
            <div className="mb-10">
                <p className="text-sm text-green-400">
                    Personal workspace
                </p>

                <h1 className="mt-2 text-4xl font-bold">
                    Manage My Accounts
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                    Gestisci solo gli account creati da te o dove hai ruolo Manager.
                    La gestione globale della piattaforma rimane separata nell’area Admin.
                </p>
            </div>

            <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        My Accounts
                    </p>

                    <h2 className="mt-2 text-3xl font-black">
                        {accounts.length}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Total Trades
                    </p>

                    <h2 className="mt-2 text-3xl font-black">
                        {totalTrades}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Total PnL
                    </p>

                    <h2
                        className={`mt-2 text-3xl font-black ${totalPnl >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                    >
                        {totalPnl.toFixed(2)}
                    </h2>
                </div>
            </div>

            {canCreateAccount && (
                <form
                    action={createAccount}
                    className="mb-12 grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2 xl:grid-cols-4"
                >
                    <input
                        name="name"
                        placeholder="Account name"
                        className="rounded-2xl bg-zinc-900 p-4"
                        required
                    />

                    <select
                        name="type"
                        defaultValue={
                            canCreatePersonalAccount
                                ? "LIVE"
                                : "SHARED"
                        }
                        aria-label="Account type"
                        className="rounded-2xl bg-zinc-900 p-4"
                        required
                    >
                        {canCreatePersonalAccount && (
                            <>
                                <option value="LIVE">LIVE</option>
                                <option value="DEMO">DEMO</option>
                                <option value="PROP">PROP</option>
                                <option value="CHALLENGE">CHALLENGE</option>
                                <option value="FUNDED">FUNDED</option>
                            </>
                        )}

                        {canCreateSharedAccount && (
                            <option value="SHARED">SHARED</option>
                        )}
                    </select>

                    <input
                        name="initialBalance"
                        type="number"
                        placeholder="Initial balance"
                        className="rounded-2xl bg-zinc-900 p-4"
                        required
                    />

                    <input
                        name="currency"
                        defaultValue="USD"
                        placeholder="Currency"
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
                        className="rounded-2xl bg-green-500 p-4 font-bold text-black hover:bg-green-400 md:col-span-2 xl:col-span-4"
                    >
                        Create Account
                    </button>
                </form>
            )}

            <div className="space-y-12">
                {accountTypes.map((type) => {
                    const sectionAccounts = activeAccounts.filter(
                        (account) => account.type === type
                    );

                    return renderSection(
                        `${type} Accounts`,
                        "Active accounts",
                        sectionAccounts,
                        "green"
                    );
                })}

                {renderSection(
                    "Archived Accounts",
                    "Inactive workspace",
                    archivedAccounts,
                    "yellow"
                )}
            </div>
        </div>
    );
}