import {
    Cable,
    CheckCircle2,
    DatabaseZap,
    Lock,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import GlobalToast from "@/components/GlobalToast";

import { updateAccountIntegrations } from "./actions";

function getModeLabel(mode?: string | null) {
    if (mode === "mt5") {
        return "MT5 Connector";
    }

    if (mode === "broker") {
        return "Broker Integration";
    }

    if (mode === "hybrid") {
        return "MT5 + Broker";
    }

    return "Manual Only";
}

function getStatusLabel(status?: string | null) {
    if (status === "connected") {
        return "Connected";
    }

    if (status === "pending") {
        return "Pending";
    }

    if (status === "error") {
        return "Error";
    }

    return "Inactive";
}

function getStatusClass(status?: string | null) {
    if (status === "connected") {
        return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (status === "pending") {
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
    }

    if (status === "error") {
        return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-white/10 bg-white/10 text-gray-300";
}

function formatDate(date?: Date | null) {
    if (!date) {
        return "Never";
    }

    return new Date(date).toLocaleString(
        "it-IT"
    );
}

export default async function IntegrationsPage({
    params,
    searchParams,
}: {
    params: Promise<{
        accountId: string;
    }>;

    searchParams: Promise<{
        toast?: string;
    }>;
}) {
    const { accountId } = await params;
    const query = await searchParams;

    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

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
        membership.role === "MANAGER";

    const canManageIntegrations =
        isManager || membership.canManageAccount;

    if (!canManageIntegrations) {
        redirect(
            `/accounts/${accountId}/dashboard`
        );
    }

    const account = membership.tradingAccount;

    const updateIntegrationsAction =
        updateAccountIntegrations.bind(
            null,
            accountId
        );

    return (
        <div>
            <GlobalToast status={query.toast} />

            <div className="mb-8">
                <p className="text-sm text-green-400">
                    Account Integrations
                </p>

                <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
                    <Cable className="text-green-400" />
                    Trade Sync Settings
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
                    Configura la base delle integrazioni automatiche del conto. Per ora VOLTIS non salva password, token o API key: questa pagina prepara solo la struttura per MT5 Connector e Broker Integration.
                </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-green-400">
                        <DatabaseZap size={20} />
                    </div>

                    <p className="text-sm text-gray-400">
                        Integration Mode
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-white">
                        {getModeLabel(
                            account.integrationMode
                        )}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-green-400">
                        <RefreshCw size={20} />
                    </div>

                    <p className="text-sm text-gray-400">
                        Auto Sync
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-white">
                        {account.autoSyncEnabled
                            ? "Enabled"
                            : "Disabled"}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-green-400">
                        <CheckCircle2 size={20} />
                    </div>

                    <p className="text-sm text-gray-400">
                        Sync Status
                    </p>

                    <span
                        className={`mt-3 inline-flex rounded-xl border px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${getStatusClass(
                            account.syncStatus
                        )}`}
                    >
                        {getStatusLabel(
                            account.syncStatus
                        )}
                    </span>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-green-400">
                        <ShieldCheck size={20} />
                    </div>

                    <p className="text-sm text-gray-400">
                        Last Sync
                    </p>

                    <h2 className="mt-2 text-sm font-black text-white">
                        {formatDate(account.lastSyncedAt)}
                    </h2>
                </div>
            </div>

            <form
                action={updateIntegrationsAction}
                className="space-y-6"
            >
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-400">
                            Sync Mode
                        </p>

                        <h2 className="mt-1 text-2xl font-bold">
                            Integration Strategy
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                            Scegli come questo account dovrà gestire i trade in futuro. Manual Only mantiene solo l’inserimento manuale. MT5, Broker e Hybrid preparano il conto alla sincronizzazione automatica.
                        </p>
                    </div>

                    <select
                        name="integrationMode"
                        defaultValue={
                            account.integrationMode ||
                            "manual"
                        }
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
                    >
                        <option value="manual">
                            Manual Only
                        </option>

                        <option value="mt5">
                            MT5 Connector
                        </option>

                        <option value="broker">
                            Broker Integration
                        </option>

                        <option value="hybrid">
                            MT5 + Broker Integration
                        </option>
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6">
                            <p className="text-sm text-gray-400">
                                MT5 Connector
                            </p>

                            <h2 className="mt-1 text-2xl font-bold">
                                MetaTrader 5 Details
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Inserisci solo dati identificativi non sensibili. Password e token non vengono ancora gestiti da VOLTIS.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <input
                                name="mt5AccountLogin"
                                defaultValue={
                                    account.mt5AccountLogin || ""
                                }
                                placeholder="MT5 account login"
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
                            />

                            <input
                                name="mt5ServerName"
                                defaultValue={
                                    account.mt5ServerName || ""
                                }
                                placeholder="MT5 server name"
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6">
                            <p className="text-sm text-gray-400">
                                Broker Integration
                            </p>

                            <h2 className="mt-1 text-2xl font-bold">
                                Broker Details
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Salviamo solo provider e identificativo account. Le credenziali reali verranno aggiunte più avanti con storage sicuro.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <input
                                name="brokerProvider"
                                defaultValue={
                                    account.brokerProvider || ""
                                }
                                placeholder="Broker provider"
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
                            />

                            <input
                                name="brokerAccountId"
                                defaultValue={
                                    account.brokerAccountId || ""
                                }
                                placeholder="Broker account ID"
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <Lock className="text-green-400" />

                        <div>
                            <p className="text-sm text-gray-400">
                                Security Notice
                            </p>

                            <h2 className="text-2xl font-bold">
                                No sensitive credentials stored
                            </h2>
                        </div>
                    </div>

                    <p className="max-w-3xl text-sm leading-6 text-gray-400">
                        In questa fase VOLTIS non memorizza password MT5, API key broker, token o dati sensibili. La connessione reale verrà costruita più avanti con un sistema dedicato e protetto.
                    </p>
                </div>

                <input
                    type="hidden"
                    name="syncStatus"
                    value={account.syncStatus || "inactive"}
                />

                <button
                    type="submit"
                    className="rounded-2xl bg-green-500 px-6 py-4 font-bold text-black transition hover:bg-green-400"
                >
                    Save Integration Settings
                </button>
            </form>
        </div>
    );
}