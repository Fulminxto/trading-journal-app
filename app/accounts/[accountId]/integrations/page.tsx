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

import { resetAccountSyncStatus, updateAccountIntegrations, } from "./actions";

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

function getSyncReadiness(account: {
    integrationMode: string | null;
    autoSyncEnabled: boolean;
    mt5Enabled: boolean;
    brokerSyncEnabled: boolean;
    syncStatus: string | null;
}) {
    if (account.integrationMode === "manual") {
        return {
            label: "Not Ready",
            tone: "border-white/10 bg-white/[0.04] text-gray-300",
            description:
                "Questo account è impostato su Manual Only. Può usare solo inserimento manuale dei trade.",
            checklist: [
                {
                    label: "Manual mode active",
                    ok: true,
                },
                {
                    label: "Automatic sync disabled",
                    ok: false,
                },
            ],
        };
    }

    if (
        account.integrationMode === "mt5" &&
        account.autoSyncEnabled &&
        account.mt5Enabled
    ) {
        return {
            label: "Ready for MT5",
            tone: "border-cyan-500/20 bg-cyan-500/[0.08] text-cyan-300",
            description:
                "Questo account è pronto per ricevere trade da un futuro MT5 Connector.",
            checklist: [
                {
                    label: "MT5 mode active",
                    ok: true,
                },
                {
                    label: "Auto sync enabled",
                    ok: true,
                },
                {
                    label: "MT5 source enabled",
                    ok: true,
                },
            ],
        };
    }

    if (
        account.integrationMode === "broker" &&
        account.autoSyncEnabled &&
        account.brokerSyncEnabled
    ) {
        return {
            label: "Ready for Broker",
            tone: "border-blue-500/20 bg-blue-500/[0.08] text-blue-300",
            description:
                "Questo account è pronto per ricevere trade da una futura Broker Integration.",
            checklist: [
                {
                    label: "Broker mode active",
                    ok: true,
                },
                {
                    label: "Auto sync enabled",
                    ok: true,
                },
                {
                    label: "Broker source enabled",
                    ok: true,
                },
            ],
        };
    }

    if (
        account.integrationMode === "hybrid" &&
        account.autoSyncEnabled &&
        account.mt5Enabled &&
        account.brokerSyncEnabled
    ) {
        return {
            label: "Ready for MT5 + Broker",
            tone: "border-green-500/20 bg-green-500/[0.08] text-green-400",
            description:
                "Questo account è pronto per ricevere trade sia da MT5 sia da Broker Integration.",
            checklist: [
                {
                    label: "Hybrid mode active",
                    ok: true,
                },
                {
                    label: "Auto sync enabled",
                    ok: true,
                },
                {
                    label: "MT5 source enabled",
                    ok: true,
                },
                {
                    label: "Broker source enabled",
                    ok: true,
                },
            ],
        };
    }

    return {
        label: "Configuration Needed",
        tone: "border-yellow-500/20 bg-yellow-500/[0.08] text-yellow-300",
        description:
            "Questo account ha una modalità sync selezionata, ma la configurazione non è ancora completa.",
        checklist: [
            {
                label: "Integration mode selected",
                ok: account.integrationMode !== "manual",
            },
            {
                label: "Auto sync enabled",
                ok: account.autoSyncEnabled,
            },
            {
                label: "MT5 enabled",
                ok: account.mt5Enabled,
            },
            {
                label: "Broker enabled",
                ok: account.brokerSyncEnabled,
            },
        ],
    };
}

function getAppBaseUrl() {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return "http://localhost:3000";
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

    if (
        membership.tradingAccount.status === "ARCHIVED"
    ) {
        redirect(
            `/accounts/${accountId}/dashboard`
        );
    }

    const account = membership.tradingAccount;

    const recentSyncLogs =
        await prisma.activityLog.findMany({
            where: {
                accountId,
                type: {
                    in: [
                        "TRADE_IMPORTED",
                        "TRADE_SYNC_UPDATED",
                        "TRADE_SYNC_ERROR",
                        "INTEGRATION_SETTINGS_UPDATED",
                        "INTEGRATION_SYNC_RESET",
                    ],
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 8,
        });

    const latestSyncError =
        recentSyncLogs.find(
            (log) => log.type === "TRADE_SYNC_ERROR"
        );

    const syncReadiness =
        getSyncReadiness(account);

    const appBaseUrl = getAppBaseUrl();

    const healthEndpoint =
        `${appBaseUrl}/api/trade-sync/health`;

    const importEndpoint =
        `${appBaseUrl}/api/trade-sync/import`;

    const updateIntegrationsAction =
        updateAccountIntegrations.bind(
            null,
            accountId
        );

    const resetSyncStatusAction =
        resetAccountSyncStatus.bind(
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

            <div className={`mb-8 rounded-3xl border p-6 ${syncReadiness.tone}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.18em] opacity-80">
                            Trade Sync Readiness
                        </p>

                        <h2 className="mt-2 text-3xl font-black">
                            {syncReadiness.label}
                        </h2>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-300">
                            {syncReadiness.description}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white">
                        {getModeLabel(account.integrationMode)}
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {syncReadiness.checklist.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                        >
                            <span className="text-sm text-gray-300">
                                {item.label}
                            </span>

                            <span
                                className={
                                    item.ok
                                        ? "text-sm font-black text-green-400"
                                        : "text-sm font-black text-red-400"
                                }
                            >
                                {item.ok ? "OK" : "Missing"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {account.syncStatus === "error" && (
                <div className="mb-8 rounded-3xl border border-red-500/20 bg-red-500/[0.08] p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.18em] text-red-400">
                                Sync Error Detected
                            </p>

                            <h2 className="mt-2 text-3xl font-black text-white">
                                Ultima sincronizzazione fallita
                            </h2>

                            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-300">
                                VOLTIS ha rilevato un errore durante l’importazione automatica dei trade. Controlla la configurazione MT5/Broker, il secret, l’Account ID e i Sync Logs qui sotto.
                            </p>

                            {latestSyncError?.description && (
                                <div className="mt-5 rounded-2xl border border-red-500/20 bg-black/20 p-4">
                                    <p className="text-xs uppercase tracking-[0.16em] text-red-300">
                                        Latest Error
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-gray-300">
                                        {latestSyncError.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        <span className="w-fit rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-400">
                            Error
                        </span>
                        <form action={resetSyncStatusAction}>
                            <button
                                type="submit"
                                className="mt-3 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
                            >
                                Reset Sync
                            </button>
                        </form>
                    </div>
                </div>
            )}

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

                <div className="rounded-3xl border border-green-500/20 bg-green-500/[0.05] p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <Cable className="text-green-400" />

                        <div>
                            <p className="text-sm text-green-400">
                                MT5 Connector Setup
                            </p>

                            <h2 className="text-2xl font-bold">
                                Connection details for future connector
                            </h2>
                        </div>
                    </div>

                    <p className="max-w-3xl text-sm leading-6 text-gray-400">
                        Questi dati serviranno quando costruiremo l’Expert Advisor MT5. Per ora sono solo informazioni di configurazione: non viene ancora collegato nessun conto reale.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                                Trading Account ID
                            </p>

                            <p className="mt-3 break-all font-mono text-sm font-bold text-white">
                                {account.id}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                                Sync Secret
                            </p>

                            <p className="mt-3 text-sm font-bold text-yellow-300">
                                Stored only on server environment
                            </p>

                            <p className="mt-2 text-xs leading-5 text-gray-500">
                                Non viene mostrata in app. Verrà copiata manualmente nel connettore MT5 solo quando costruiremo la connessione reale.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                                Health Check Endpoint
                            </p>

                            <p className="mt-3 break-all font-mono text-sm font-bold text-white">
                                {healthEndpoint}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                                Import Endpoint
                            </p>

                            <p className="mt-3 break-all font-mono text-sm font-bold text-white">
                                {importEndpoint}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                        <p className="text-sm font-bold text-white">
                            Future MT5 flow
                        </p>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            MT5 controllerà prima l’Health Check. Se VOLTIS risponde che la sync è pronta, il connettore invierà il trade chiuso all’Import Endpoint. Il trade entrerà nel Diary come MT5 + Needs Review.
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-400">
                            Sync Logs
                        </p>

                        <h2 className="mt-1 text-2xl font-bold">
                            Recent Import Activity
                        </h2>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
                            Qui vedrai gli ultimi eventi collegati alla sincronizzazione automatica: trade importati, impostazioni aggiornate e attività future di MT5/Broker.
                        </p>
                    </div>

                    {recentSyncLogs.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <p className="text-sm leading-6 text-gray-400">
                                Nessuna attività sync registrata per ora. Quando un trade verrà importato da MT5 o Broker, apparirà qui.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentSyncLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                                >
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                        <div>
                                            <div className="mb-3 flex flex-wrap gap-2">
                                                <span className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-300">
                                                    {log.type}
                                                </span>

                                                {log.type === "TRADE_IMPORTED" && (
                                                    <span className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-cyan-300">
                                                        Import
                                                    </span>
                                                )}

                                                {log.type === "TRADE_SYNC_UPDATED" && (
                                                    <span className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-300">
                                                        Updated
                                                    </span>
                                                )}

                                                {log.type === "TRADE_SYNC_ERROR" && (
                                                    <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-red-400">
                                                        Error
                                                    </span>
                                                )}

                                                {log.type === "INTEGRATION_SYNC_RESET" && (
                                                    <span className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-yellow-300">
                                                        Reset
                                                    </span>
                                                )}

                                                {log.type === "INTEGRATION_SETTINGS_UPDATED" && (
                                                    <span className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-green-400">
                                                        Settings
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-base font-black text-white">
                                                {log.title}
                                            </h3>

                                            {log.description && (
                                                <p className="mt-2 text-sm leading-6 text-gray-400">
                                                    {log.description}
                                                </p>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-500">
                                            {formatDate(log.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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