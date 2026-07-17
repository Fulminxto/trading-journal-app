import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderCog } from "lucide-react";

import EmptyState from "@/components/EmptyState";

import {
    createAccount,
    archiveAccount,
    restoreAccount,
    deleteAccount,
} from "../actions";

import {
    formatCurrencyByLanguage,
    normalizeAppLanguage,
    type AppLanguage,
} from "@/lib/i18n";

const accountTypes = [
    "LIVE",
    "PROP",
    "DEMO",
    "SHARED",
    "CHALLENGE",
    "FUNDED",
] as const;

type AccountType = (typeof accountTypes)[number];

const manageableEmptyLabels: Record<AppLanguage, { title: string; description: string; back: string }> = {
    en: { title: "No manageable accounts", description: "You do not currently have authority to manage any trading accounts.", back: "Back to account library" },
    it: { title: "Nessun account gestibile", description: "Al momento non hai l’autorizzazione per gestire account di trading.", back: "Torna alla libreria account" },
    uk: { title: "Немає акаунтів для керування", description: "Наразі у вас немає прав для керування торговими акаунтами.", back: "Назад до бібліотеки акаунтів" },
    ru: { title: "Нет аккаунтов для управления", description: "Сейчас у вас нет прав на управление торговыми аккаунтами.", back: "Назад к библиотеке аккаунтов" },
    es: { title: "No hay cuentas gestionables", description: "Actualmente no tienes autorización para gestionar cuentas de trading.", back: "Volver a la biblioteca de cuentas" },
    fr: { title: "Aucun compte à gérer", description: "Vous n’êtes actuellement autorisé à gérer aucun compte de trading.", back: "Retour à la bibliothèque de comptes" },
    de: { title: "Keine verwaltbaren Konten", description: "Du bist derzeit nicht berechtigt, Trading-Konten zu verwalten.", back: "Zurück zur Kontobibliothek" },
};

type ManageAccountsLabels = {
    personalWorkspace: string;
    title: string;
    description: string;

    myAccounts: string;
    totalTrades: string;
    totalPnl: string;

    createdBy: string;
    system: string;
    openAccount: string;
    balance: string;
    pnl: string;
    trades: string;
    members: string;

    archive: string;
    restore: string;
    dangerZone: string;
    deleteAccountTitle: string;
    deleteAccountDescription: string;
    deletePermanently: string;

    noAccountsInSection: string;
    activeAccounts: string;
    inactiveWorkspace: string;
    archivedAccounts: string;
    accountsSuffix: string;

    createAccountTitle: string;
    accountNamePlaceholder: string;
    accountTypeAria: string;
    initialBalancePlaceholder: string;
    currencyPlaceholder: string;
    brokerPlaceholder: string;
    phasePlaceholder: string;
    profitTargetPlaceholder: string;
    maxDrawdownPlaceholder: string;
    dailyDrawdownPlaceholder: string;
    createAccount: string;

    statuses: Record<"ACTIVE" | "ARCHIVED", string>;
    accountTypes: Record<AccountType, string>;
};

const manageAccountsLabels: Record<
    AppLanguage,
    ManageAccountsLabels
> = {
    it: {
        personalWorkspace: "Personal workspace",
        title: "Gestisci i miei account",
        description:
            "Gestisci solo gli account creati da te o dove hai ruolo Manager. La gestione globale della piattaforma rimane separata nell’area Admin.",

        myAccounts: "I miei account",
        totalTrades: "Trade totali",
        totalPnl: "PnL totale",

        createdBy: "Creato da",
        system: "Sistema",
        openAccount: "Apri Dashboard",
        balance: "Balance",
        pnl: "PnL",
        trades: "Trade",
        members: "Membri",

        archive: "Archivia",
        restore: "Ripristina",
        dangerZone: "Zona pericolosa",
        deleteAccountTitle: "Elimina account definitivamente",
        deleteAccountDescription:
            "Questa azione non può essere annullata.",
        deletePermanently: "Elimina definitivamente",

        noAccountsInSection:
            "Nessun account in questa sezione.",
        activeAccounts: "Account attivi",
        inactiveWorkspace: "Workspace inattivo",
        archivedAccounts: "Account archiviati",
        accountsSuffix: "Account",

        createAccountTitle: "Crea nuovo account",
        accountNamePlaceholder: "Nome account",
        accountTypeAria: "Tipo account",
        initialBalancePlaceholder: "Balance iniziale",
        currencyPlaceholder: "Valuta",
        brokerPlaceholder: "Broker / Prop Firm",
        phasePlaceholder: "Fase",
        profitTargetPlaceholder: "Profit Target %",
        maxDrawdownPlaceholder: "Max Drawdown %",
        dailyDrawdownPlaceholder: "Daily Drawdown %",
        createAccount: "Crea account",

        statuses: {
            ACTIVE: "ATTIVO",
            ARCHIVED: "ARCHIVIATO",
        },

        accountTypes: {
            LIVE: "LIVE",
            PROP: "PROP",
            DEMO: "DEMO",
            SHARED: "SHARED",
            CHALLENGE: "CHALLENGE",
            FUNDED: "FUNDED",
        },
    },

    en: {
        personalWorkspace: "Personal workspace",
        title: "Manage My Accounts",
        description:
            "Manage only accounts created by you or where you have the Manager role. Global platform management remains separate in the Admin area.",

        myAccounts: "My Accounts",
        totalTrades: "Total Trades",
        totalPnl: "Total PnL",

        createdBy: "Created by",
        system: "System",
        openAccount: "Open Dashboard",
        balance: "Balance",
        pnl: "PnL",
        trades: "Trades",
        members: "Members",

        archive: "Archive",
        restore: "Restore",
        dangerZone: "Danger Zone",
        deleteAccountTitle: "Delete account permanently",
        deleteAccountDescription:
            "This action cannot be undone.",
        deletePermanently: "Delete Permanently",

        noAccountsInSection:
            "No accounts in this section.",
        activeAccounts: "Active accounts",
        inactiveWorkspace: "Inactive workspace",
        archivedAccounts: "Archived Accounts",
        accountsSuffix: "Accounts",

        createAccountTitle: "Create new account",
        accountNamePlaceholder: "Account name",
        accountTypeAria: "Account type",
        initialBalancePlaceholder: "Initial balance",
        currencyPlaceholder: "Currency",
        brokerPlaceholder: "Broker / Prop Firm",
        phasePlaceholder: "Phase",
        profitTargetPlaceholder: "Profit Target %",
        maxDrawdownPlaceholder: "Max Drawdown %",
        dailyDrawdownPlaceholder: "Daily Drawdown %",
        createAccount: "Create Account",

        statuses: {
            ACTIVE: "ACTIVE",
            ARCHIVED: "ARCHIVED",
        },

        accountTypes: {
            LIVE: "LIVE",
            PROP: "PROP",
            DEMO: "DEMO",
            SHARED: "SHARED",
            CHALLENGE: "CHALLENGE",
            FUNDED: "FUNDED",
        },
    },

    uk: {
        personalWorkspace: "Особистий workspace",
        title: "Керування моїми акаунтами",
        description:
            "Керуйте лише акаунтами, які створили ви, або тими, де у вас роль Manager. Глобальне керування платформою залишається окремо в зоні Admin.",

        myAccounts: "Мої акаунти",
        totalTrades: "Усього угод",
        totalPnl: "Загальний PnL",

        createdBy: "Створено",
        system: "Система",
        openAccount: "Відкрити Dashboard",
        balance: "Баланс",
        pnl: "PnL",
        trades: "Угоди",
        members: "Учасники",

        archive: "Архівувати",
        restore: "Відновити",
        dangerZone: "Небезпечна зона",
        deleteAccountTitle: "Видалити акаунт назавжди",
        deleteAccountDescription:
            "Цю дію неможливо скасувати.",
        deletePermanently: "Видалити назавжди",

        noAccountsInSection:
            "У цій секції немає акаунтів.",
        activeAccounts: "Активні акаунти",
        inactiveWorkspace: "Неактивний workspace",
        archivedAccounts: "Архівовані акаунти",
        accountsSuffix: "Акаунти",

        createAccountTitle: "Створити новий акаунт",
        accountNamePlaceholder: "Назва акаунта",
        accountTypeAria: "Тип акаунта",
        initialBalancePlaceholder: "Початковий баланс",
        currencyPlaceholder: "Валюта",
        brokerPlaceholder: "Брокер / Prop Firm",
        phasePlaceholder: "Фаза",
        profitTargetPlaceholder: "Ціль прибутку %",
        maxDrawdownPlaceholder: "Макс. drawdown %",
        dailyDrawdownPlaceholder: "Денний drawdown %",
        createAccount: "Створити акаунт",

        statuses: {
            ACTIVE: "АКТИВНИЙ",
            ARCHIVED: "АРХІВОВАНИЙ",
        },

        accountTypes: {
            LIVE: "LIVE",
            PROP: "PROP",
            DEMO: "DEMO",
            SHARED: "SHARED",
            CHALLENGE: "CHALLENGE",
            FUNDED: "FUNDED",
        },
    },

    ru: {
        personalWorkspace: "Личный workspace",
        title: "Управление моими аккаунтами",
        description:
            "Управляйте только аккаунтами, созданными вами, или теми, где у вас роль Manager. Глобальное управление платформой остается отдельно в зоне Admin.",

        myAccounts: "Мои аккаунты",
        totalTrades: "Всего сделок",
        totalPnl: "Общий PnL",

        createdBy: "Создано",
        system: "Система",
        openAccount: "Открыть Dashboard",
        balance: "Баланс",
        pnl: "PnL",
        trades: "Сделки",
        members: "Участники",

        archive: "Архивировать",
        restore: "Восстановить",
        dangerZone: "Опасная зона",
        deleteAccountTitle: "Удалить аккаунт навсегда",
        deleteAccountDescription:
            "Это действие нельзя отменить.",
        deletePermanently: "Удалить навсегда",

        noAccountsInSection:
            "В этой секции нет аккаунтов.",
        activeAccounts: "Активные аккаунты",
        inactiveWorkspace: "Неактивный workspace",
        archivedAccounts: "Архивированные аккаунты",
        accountsSuffix: "Аккаунты",

        createAccountTitle: "Создать новый аккаунт",
        accountNamePlaceholder: "Название аккаунта",
        accountTypeAria: "Тип аккаунта",
        initialBalancePlaceholder: "Начальный баланс",
        currencyPlaceholder: "Валюта",
        brokerPlaceholder: "Брокер / Prop Firm",
        phasePlaceholder: "Фаза",
        profitTargetPlaceholder: "Цель прибыли %",
        maxDrawdownPlaceholder: "Макс. drawdown %",
        dailyDrawdownPlaceholder: "Дневной drawdown %",
        createAccount: "Создать аккаунт",

        statuses: {
            ACTIVE: "АКТИВНЫЙ",
            ARCHIVED: "АРХИВИРОВАН",
        },

        accountTypes: {
            LIVE: "LIVE",
            PROP: "PROP",
            DEMO: "DEMO",
            SHARED: "SHARED",
            CHALLENGE: "CHALLENGE",
            FUNDED: "FUNDED",
        },
    },

    es: {
        personalWorkspace: "Workspace personal",
        title: "Gestionar mis cuentas",
        description:
            "Gestiona solo las cuentas creadas por ti o donde tienes el rol Manager. La gestión global de la plataforma permanece separada en el área Admin.",

        myAccounts: "Mis cuentas",
        totalTrades: "Trades totales",
        totalPnl: "PnL total",

        createdBy: "Creado por",
        system: "Sistema",
        openAccount: "Abrir Dashboard",
        balance: "Balance",
        pnl: "PnL",
        trades: "Trades",
        members: "Miembros",

        archive: "Archivar",
        restore: "Restaurar",
        dangerZone: "Zona peligrosa",
        deleteAccountTitle: "Eliminar cuenta permanentemente",
        deleteAccountDescription:
            "Esta acción no se puede deshacer.",
        deletePermanently: "Eliminar permanentemente",

        noAccountsInSection:
            "No hay cuentas en esta sección.",
        activeAccounts: "Cuentas activas",
        inactiveWorkspace: "Workspace inactivo",
        archivedAccounts: "Cuentas archivadas",
        accountsSuffix: "Cuentas",

        createAccountTitle: "Crear nueva cuenta",
        accountNamePlaceholder: "Nombre de la cuenta",
        accountTypeAria: "Tipo de cuenta",
        initialBalancePlaceholder: "Balance inicial",
        currencyPlaceholder: "Moneda",
        brokerPlaceholder: "Broker / Prop Firm",
        phasePlaceholder: "Fase",
        profitTargetPlaceholder: "Objetivo de beneficio %",
        maxDrawdownPlaceholder: "Drawdown máximo %",
        dailyDrawdownPlaceholder: "Drawdown diario %",
        createAccount: "Crear cuenta",

        statuses: {
            ACTIVE: "ACTIVA",
            ARCHIVED: "ARCHIVADA",
        },

        accountTypes: {
            LIVE: "LIVE",
            PROP: "PROP",
            DEMO: "DEMO",
            SHARED: "SHARED",
            CHALLENGE: "CHALLENGE",
            FUNDED: "FUNDED",
        },
    },

    fr: {
        personalWorkspace: "Workspace personnel",
        title: "Gérer mes comptes",
        description:
            "Gérez uniquement les comptes créés par vous ou ceux où vous avez le rôle Manager. La gestion globale de la plateforme reste séparée dans la zone Admin.",

        myAccounts: "Mes comptes",
        totalTrades: "Trades totaux",
        totalPnl: "PnL total",

        createdBy: "Créé par",
        system: "Système",
        openAccount: "Ouvrir le Dashboard",
        balance: "Balance",
        pnl: "PnL",
        trades: "Trades",
        members: "Membres",

        archive: "Archiver",
        restore: "Restaurer",
        dangerZone: "Zone dangereuse",
        deleteAccountTitle: "Supprimer le compte définitivement",
        deleteAccountDescription:
            "Cette action ne peut pas être annulée.",
        deletePermanently: "Supprimer définitivement",

        noAccountsInSection:
            "Aucun compte dans cette section.",
        activeAccounts: "Comptes actifs",
        inactiveWorkspace: "Workspace inactif",
        archivedAccounts: "Comptes archivés",
        accountsSuffix: "Comptes",

        createAccountTitle: "Créer un nouveau compte",
        accountNamePlaceholder: "Nom du compte",
        accountTypeAria: "Type de compte",
        initialBalancePlaceholder: "Balance initiale",
        currencyPlaceholder: "Devise",
        brokerPlaceholder: "Broker / Prop Firm",
        phasePlaceholder: "Phase",
        profitTargetPlaceholder: "Objectif de profit %",
        maxDrawdownPlaceholder: "Drawdown maximum %",
        dailyDrawdownPlaceholder: "Drawdown quotidien %",
        createAccount: "Créer le compte",

        statuses: {
            ACTIVE: "ACTIF",
            ARCHIVED: "ARCHIVÉ",
        },

        accountTypes: {
            LIVE: "LIVE",
            PROP: "PROP",
            DEMO: "DEMO",
            SHARED: "SHARED",
            CHALLENGE: "CHALLENGE",
            FUNDED: "FUNDED",
        },
    },

    de: {
        personalWorkspace: "Persönlicher Workspace",
        title: "Meine Konten verwalten",
        description:
            "Verwalte nur Konten, die von dir erstellt wurden oder bei denen du die Manager-Rolle hast. Die globale Plattformverwaltung bleibt separat im Admin-Bereich.",

        myAccounts: "Meine Konten",
        totalTrades: "Gesamte Trades",
        totalPnl: "Gesamter PnL",

        createdBy: "Erstellt von",
        system: "System",
        openAccount: "Dashboard öffnen",
        balance: "Balance",
        pnl: "PnL",
        trades: "Trades",
        members: "Mitglieder",

        archive: "Archivieren",
        restore: "Wiederherstellen",
        dangerZone: "Gefahrenzone",
        deleteAccountTitle: "Konto dauerhaft löschen",
        deleteAccountDescription:
            "Diese Aktion kann nicht rückgängig gemacht werden.",
        deletePermanently: "Dauerhaft löschen",

        noAccountsInSection:
            "Keine Konten in diesem Abschnitt.",
        activeAccounts: "Aktive Konten",
        inactiveWorkspace: "Inaktiver Workspace",
        archivedAccounts: "Archivierte Konten",
        accountsSuffix: "Konten",

        createAccountTitle: "Neues Konto erstellen",
        accountNamePlaceholder: "Kontoname",
        accountTypeAria: "Kontotyp",
        initialBalancePlaceholder: "Anfangsbalance",
        currencyPlaceholder: "Währung",
        brokerPlaceholder: "Broker / Prop Firm",
        phasePlaceholder: "Phase",
        profitTargetPlaceholder: "Gewinnziel %",
        maxDrawdownPlaceholder: "Max. Drawdown %",
        dailyDrawdownPlaceholder: "Täglicher Drawdown %",
        createAccount: "Konto erstellen",

        statuses: {
            ACTIVE: "AKTIV",
            ARCHIVED: "ARCHIVIERT",
        },

        accountTypes: {
            LIVE: "LIVE",
            PROP: "PROP",
            DEMO: "DEMO",
            SHARED: "SHARED",
            CHALLENGE: "CHALLENGE",
            FUNDED: "FUNDED",
        },
    },
};

function getResultTone(value: number) {
    if (value >= 0) {
        return "text-accent";
    }

    return "text-red-400";
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

    const language = normalizeAppLanguage(
        currentUser.appLanguage
    );

    const t = manageAccountsLabels[language];
    const emptyT = manageableEmptyLabels[language];

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

    const defaultCurrency =
        currentUser.defaultCurrency || "USD";

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
                                        : "bg-accent/10 text-accent"
                                    }`}
                            >
                                {
                                    t.statuses[
                                    account.status as "ACTIVE" | "ARCHIVED"
                                    ] ?? account.status
                                }
                            </span>

                            <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                                {
                                    t.accountTypes[
                                    account.type as AccountType
                                    ] ?? account.type
                                }
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-400">
                            {t.createdBy}{" "}
                            <span className="text-gray-200">
                                {account.createdBy?.username || t.system}
                            </span>
                        </p>
                    </div>

                    <a
                        href={`/accounts/${account.id}/dashboard`}
                        className="rounded-2xl bg-accent px-4 py-3 text-center text-sm font-black text-white hover:bg-accent-bright"
                    >
                        {t.openAccount}
                    </a>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-gray-500">
                            {t.balance}
                        </p>

                        <h4 className="mt-2 font-bold">
                            {formatCurrencyByLanguage(
                                account.initialBalance,
                                account.currency,
                                language
                            )}
                        </h4>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-gray-500">
                            {t.pnl}
                        </p>

                        <h4
                            className={`mt-2 font-bold ${getResultTone(
                                accountPnl
                            )}`}
                        >
                            {formatCurrencyByLanguage(
                                accountPnl,
                                account.currency,
                                language
                            )}
                        </h4>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-gray-500">
                            {t.trades}
                        </p>

                        <h4 className="mt-2 font-bold">
                            {account.trades.length}
                        </h4>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-gray-500">
                            {t.members}
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
                                {t.archive}
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
                                {t.restore}
                            </button>
                        </form>
                    )}
                </div>

                {canDelete && (
                    <details className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-4">
                        <summary className="cursor-pointer text-sm font-bold text-red-400">
                            {t.dangerZone}
                        </summary>

                        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-red-500/20 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="font-bold text-red-300">
                                    {t.deleteAccountTitle}
                                </p>

                                <p className="mt-1 text-sm text-gray-400">
                                    {t.deleteAccountDescription}
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
                                    {t.deletePermanently}
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
                ? "bg-accent/10 text-accent"
                : tone === "yellow"
                    ? "bg-yellow-500/10 text-yellow-300"
                    : "bg-white/10 text-gray-300";

        return (
            <section key={`${title}-${tone}`}>
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
                        {t.noAccountsInSection}
                    </div>
                )}
            </section>
        );
    };

    return (
        <div>
            <div className="mb-10">
                <p className="text-sm text-accent">
                    {t.personalWorkspace}
                </p>

                <h1 className="mt-2 text-4xl font-bold">
                    {t.title}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                    {t.description}
                </p>
            </div>

            <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        {t.myAccounts}
                    </p>

                    <h2 className="mt-2 text-3xl font-black">
                        {accounts.length}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        {t.totalTrades}
                    </p>

                    <h2 className="mt-2 text-3xl font-black">
                        {totalTrades}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        {t.totalPnl}
                    </p>

                    <h2
                        className={`mt-2 text-3xl font-black ${getResultTone(
                            totalPnl
                        )}`}
                    >
                        {formatCurrencyByLanguage(
                            totalPnl,
                            defaultCurrency,
                            language
                        )}
                    </h2>
                </div>
            </div>

            {canCreateAccount && (
                <form
                    action={createAccount}
                    className="mb-12 grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2 xl:grid-cols-4"
                >
                    <div className="md:col-span-2 xl:col-span-4">
                        <h2 className="text-2xl font-black text-white">
                            {t.createAccountTitle}
                        </h2>
                    </div>

                    <input
                        name="name"
                        placeholder={t.accountNamePlaceholder}
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
                        aria-label={t.accountTypeAria}
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
                        placeholder={t.initialBalancePlaceholder}
                        className="rounded-2xl bg-zinc-900 p-4"
                        required
                    />

                    <input
                        name="currency"
                        defaultValue="USD"
                        placeholder={t.currencyPlaceholder}
                        className="rounded-2xl bg-zinc-900 p-4"
                        required
                    />

                    <input
                        name="broker"
                        placeholder={t.brokerPlaceholder}
                        className="rounded-2xl bg-zinc-900 p-4"
                    />

                    <input
                        name="phase"
                        placeholder={t.phasePlaceholder}
                        className="rounded-2xl bg-zinc-900 p-4"
                    />

                    <input
                        name="profitTarget"
                        type="number"
                        step="0.01"
                        placeholder={t.profitTargetPlaceholder}
                        className="rounded-2xl bg-zinc-900 p-4"
                    />

                    <input
                        name="maxDrawdown"
                        type="number"
                        step="0.01"
                        placeholder={t.maxDrawdownPlaceholder}
                        className="rounded-2xl bg-zinc-900 p-4"
                    />

                    <input
                        name="dailyDrawdown"
                        type="number"
                        step="0.01"
                        placeholder={t.dailyDrawdownPlaceholder}
                        className="rounded-2xl bg-zinc-900 p-4"
                    />

                    <button
                        type="submit"
                        className="rounded-2xl bg-accent p-4 font-bold text-white hover:bg-accent-bright md:col-span-2 xl:col-span-4"
                    >
                        {t.createAccount}
                    </button>
                </form>
            )}

            {accounts.length === 0 ? (
                <EmptyState title={emptyT.title} description={emptyT.description} icon={FolderCog} action={<Link href="/accounts" aria-label={emptyT.back} className="inline-flex min-h-11 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.14] px-4 py-3 text-sm font-medium text-muted outline-none hover:text-flash focus-visible:ring-2 focus-visible:ring-accent-bright/60">{emptyT.back}</Link>} />
            ) : <div className="space-y-12">
                {accountTypes.map((type) => {
                    const sectionAccounts = activeAccounts.filter(
                        (account) => account.type === type
                    );

                    return renderSection(
                        `${t.accountTypes[type]} ${t.accountsSuffix}`,
                        t.activeAccounts,
                        sectionAccounts,
                        "green"
                    );
                })}

                {renderSection(
                    t.archivedAccounts,
                    t.inactiveWorkspace,
                    archivedAccounts,
                    "yellow"
                )}
            </div>}
        </div>
    );
}
