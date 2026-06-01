import Link from "next/link";
import {
    AlertTriangle,
    ArrowLeft,
    Cable,
    CheckCircle2,
    DatabaseZap,
    KeyRound,
    Lock,
    RefreshCw,
    Server,
    Settings2,
    ShieldCheck,
    UploadCloud,
    Zap,
    type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import GlobalToast from "@/components/GlobalToast";

import {
    resetAccountSyncStatus,
    updateAccountIntegrations,
} from "./actions";

type StatusCardProps = {
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
    tone?: string;
};

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

    return new Date(date).toLocaleString("it-IT");
}

function getSyncReadiness(account: {
    integrationMode: string | null;
    autoSyncEnabled: boolean;
    mt5Enabled: boolean;
    brokerSyncEnabled: boolean;
    syncStatus: string | null;
}) {
    if (
        !account.integrationMode ||
        account.integrationMode === "manual"
    ) {
        return {
            label: "Manual Mode",
            tone: "border-white/10 bg-white/[0.04] text-gray-300",
            description:
                "Questo account è impostato su Manual Only. I trade vengono gestiti manualmente dal Diary.",
            checklist: [
                {
                    label: "Manual mode active",
                    ok: true,
                },
                {
                    label: "Automatic sync disabled",
                    ok: !account.autoSyncEnabled,
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
                ok:
                    Boolean(account.integrationMode) &&
                    account.integrationMode !== "manual",
            },
            {
                label: "Auto sync enabled",
                ok: account.autoSyncEnabled,
            },
            {
                label: "MT5 source enabled",
                ok:
                    account.integrationMode === "broker"
                        ? true
                        : account.mt5Enabled,
            },
            {
                label: "Broker source enabled",
                ok:
                    account.integrationMode === "mt5"
                        ? true
                        : account.brokerSyncEnabled,
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

function StatusCard({
    label,
    value,
    description,
    icon: Icon,
    tone = "text-white",
}: StatusCardProps) {
    return (
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-400">
                        {label}
                    </p>

                    <h2 className={`mt-3 text-2xl font-black ${tone}`}>
                        {value}
                    </h2>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-cyan-300">
                    <Icon size={20} />
                </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-500">
                {description}
            </p>
        </div>
    );
}

function ToggleRow({
    name,
    title,
    description,
    defaultChecked,
}: {
    name: string;
    title: string;
    description: string;
    defaultChecked: boolean;
}) {
    return (
        <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.04]">
            <input
                name={name}
                type="checkbox"
                defaultChecked={defaultChecked}
                className="mt-1 h-5 w-5 accent-green-500"
            />

            <div>
                <p className="font-bold text-white">
                    {title}
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                    {description}
                </p>
            </div>
        </label>
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
        redirect(`/accounts/${accountId}`);
    }

    if (
        membership.tradingAccount.status === "ARCHIVED"
    ) {
        redirect(`/accounts/${accountId}`);
    }

    await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            lastSeenAt: new Date(),
            lastActivityAt: new Date(),
        },
    });

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

    const mt5Configured =
        Boolean(account.mt5AccountLogin) &&
        Boolean(account.mt5ServerName);

    const brokerConfigured =
        Boolean(account.brokerProvider) &&
        Boolean(account.brokerAccountId);

    return (
        <div className="space-y-8">
            <GlobalToast status={query.toast} />

            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_35%)]" />

                <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <div className="mb-6 flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                                Trade Sync
                            </span>

                            <span className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${getStatusClass(account.syncStatus)}`}>
                                {getStatusLabel(account.syncStatus)}
                            </span>

                            <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                                {getModeLabel(account.integrationMode)}
                            </span>
                        </div>

                        <p className="text-sm text-gray-400">
                            Account integrations
                        </p>

                        <h1 className="mt-3 flex items-center gap-4 text-5xl font-black tracking-tight text-white sm:text-6xl">
                            <Cable className="hidden text-cyan-300 sm:block" />
                            Integrations
                        </h1>

                        <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400">
                            Configura la base per Manual, MT5, Broker
                            e Hybrid Sync. In questa fase VOLTIS non
                            salva password, token o API key: prepara
                            solo la struttura sicura per la sincronizzazione.
                        </p>
                    </div>

                    <Link
                        href={`/accounts/${accountId}`}
                        className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
                    >
                        <ArrowLeft size={16} />
                        Back to Account Hub
                    </Link>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatusCard
                    label="Integration Mode"
                    value={getModeLabel(account.integrationMode)}
                    description="Strategia di gestione dei trade per questo account."
                    icon={DatabaseZap}
                />

                <StatusCard
                    label="Auto Sync"
                    value={
                        account.autoSyncEnabled
                            ? "Enabled"
                            : "Disabled"
                    }
                    description="Controlla se l’account accetta import automatici."
                    icon={RefreshCw}
                    tone={
                        account.autoSyncEnabled
                            ? "text-green-400"
                            : "text-gray-300"
                    }
                />

                <StatusCard
                    label="MT5 Setup"
                    value={
                        mt5Configured
                            ? "Configured"
                            : "Missing"
                    }
                    description="Login e server MT5 identificativi, senza credenziali sensibili."
                    icon={Server}
                    tone={
                        mt5Configured
                            ? "text-green-400"
                            : "text-yellow-300"
                    }
                />

                <StatusCard
                    label="Last Sync"
                    value={formatDate(account.lastSyncedAt)}
                    description="Ultima sincronizzazione registrata dall’account."
                    icon={CheckCircle2}
                />
            </section>

            <section className={`rounded-3xl border p-6 ${syncReadiness.tone}`}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
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
                            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
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
            </section>

            {account.syncStatus === "error" && (
                <section className="rounded-3xl border border-red-500/20 bg-red-500/[0.08] p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.18em] text-red-400">
                                Sync Error Detected
                            </p>

                            <h2 className="mt-2 text-3xl font-black text-white">
                                Ultima sincronizzazione fallita
                            </h2>

                            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-300">
                                VOLTIS ha rilevato un errore durante
                                l’importazione automatica dei trade.
                                Controlla configurazione, Account ID,
                                secret e Sync Logs.
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

                        <form action={resetSyncStatusAction}>
                            <button
                                type="submit"
                                className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
                            >
                                Reset Sync
                            </button>
                        </form>
                    </div>
                </section>
            )}

            <form
                action={updateIntegrationsAction}
                className="space-y-8"
            >
                <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Sync mode
                                </p>

                                <h2 className="mt-1 text-2xl font-black text-white">
                                    Integration Strategy
                                </h2>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                                    Scegli come questo account dovrà
                                    gestire i trade. Manual Only mantiene
                                    solo l’inserimento manuale. MT5,
                                    Broker e Hybrid preparano il conto
                                    alla sincronizzazione automatica.
                                </p>
                            </div>

                            <Settings2 className="text-cyan-300" />
                        </div>

                        <select
                            name="integrationMode"
                            defaultValue={
                                account.integrationMode ||
                                "manual"
                            }
                            className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 text-white outline-none transition focus:border-green-500/40"
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

                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6">
                            <p className="text-sm text-gray-400">
                                Activation
                            </p>

                            <h2 className="mt-1 text-2xl font-black text-white">
                                Sources
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <ToggleRow
                                name="autoSyncEnabled"
                                title="Auto Sync"
                                description="Permette all’account di accettare import automatici."
                                defaultChecked={
                                    account.autoSyncEnabled
                                }
                            />

                            <ToggleRow
                                name="mt5Enabled"
                                title="MT5"
                                description="Abilita la sorgente MT5 per il futuro connettore."
                                defaultChecked={
                                    account.mt5Enabled
                                }
                            />

                            <ToggleRow
                                name="brokerSyncEnabled"
                                title="Broker"
                                description="Abilita la sorgente Broker Integration."
                                defaultChecked={
                                    account.brokerSyncEnabled
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">
                                    MT5 Connector
                                </p>

                                <h2 className="mt-1 text-2xl font-black text-white">
                                    MetaTrader 5 Details
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Inserisci solo dati identificativi non
                                    sensibili. Password e token non vengono
                                    gestiti da VOLTIS.
                                </p>
                            </div>

                            <Cable className="text-green-400" />
                        </div>

                        <div className="space-y-4">
                            <input
                                name="mt5AccountLogin"
                                defaultValue={
                                    account.mt5AccountLogin || ""
                                }
                                placeholder="MT5 account login"
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
                            />

                            <input
                                name="mt5ServerName"
                                defaultValue={
                                    account.mt5ServerName || ""
                                }
                                placeholder="MT5 server name"
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Broker Integration
                                </p>

                                <h2 className="mt-1 text-2xl font-black text-white">
                                    Broker Details
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Salviamo solo provider e identificativo
                                    account. Le credenziali reali verranno
                                    aggiunte più avanti con storage sicuro.
                                </p>
                            </div>

                            <UploadCloud className="text-blue-300" />
                        </div>

                        <div className="space-y-4">
                            <input
                                name="brokerProvider"
                                defaultValue={
                                    account.brokerProvider || ""
                                }
                                placeholder="Broker provider"
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
                            />

                            <input
                                name="brokerAccountId"
                                defaultValue={
                                    account.brokerAccountId || ""
                                }
                                placeholder="Broker account ID"
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-green-500/20 bg-green-500/[0.05] p-6">
                    <div className="mb-6 flex items-start gap-4">
                        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-3 text-green-400">
                            <KeyRound size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-green-400">
                                Connector setup
                            </p>

                            <h2 className="mt-1 text-2xl font-black text-white">
                                Connection Details
                            </h2>

                            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
                                Questi dati serviranno per testare il
                                futuro Expert Advisor MT5 o una futura
                                integrazione Broker. Per ora sono informazioni
                                di configurazione, non una connessione reale.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
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
                                Non viene mostrata in app. Verrà inserita
                                manualmente nel connettore solo in fase di test controllato.
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
                            Future sync flow
                        </p>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Il connettore controllerà prima l’Health Check.
                            Se VOLTIS risponde che la sync è pronta,
                            invierà i trade chiusi all’Import Endpoint.
                            I trade entreranno nel Diary come importati e,
                            se necessario, in stato Needs Review.
                        </p>
                    </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-400">
                                Sync Logs
                            </p>

                            <h2 className="mt-1 text-2xl font-black text-white">
                                Recent Import Activity
                            </h2>

                            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
                                Qui vedrai gli ultimi eventi collegati alla
                                sincronizzazione automatica: trade importati,
                                impostazioni aggiornate, reset e futuri errori
                                MT5/Broker.
                            </p>
                        </div>

                        <Zap className="text-cyan-300" />
                    </div>

                    {recentSyncLogs.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <p className="text-sm leading-6 text-gray-400">
                                Nessuna attività sync registrata per ora.
                                Quando un trade verrà importato da MT5 o
                                Broker, apparirà qui.
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
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <Lock className="text-green-400" />

                        <div>
                            <p className="text-sm text-gray-400">
                                Security Notice
                            </p>

                            <h2 className="text-2xl font-black text-white">
                                No sensitive credentials stored
                            </h2>
                        </div>
                    </div>

                    <p className="max-w-3xl text-sm leading-6 text-gray-400">
                        In questa fase VOLTIS non memorizza password MT5,
                        API key broker, token o dati sensibili. La connessione
                        reale verrà costruita più avanti con un sistema
                        dedicato e protetto.
                    </p>
                </section>

                <input
                    type="hidden"
                    name="syncStatus"
                    value={account.syncStatus || "inactive"}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-6 text-gray-500">
                        Salva solo impostazioni non sensibili. La sync reale
                        verrà testata più avanti in ambiente controllato.
                    </p>

                    <button
                        type="submit"
                        className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black transition hover:bg-green-400"
                    >
                        Save Integration Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
