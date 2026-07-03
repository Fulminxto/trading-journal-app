import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

import {
  Wallet,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  Activity,
  Archive,
  Settings,
} from "lucide-react";

import {
  formatCurrencyByLanguage,
  formatNumberByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type AccountsCopy = {
  overviewEyebrow: string;
  welcomeBack: string;
  heroDescription: string;

  manageAccounts: string;
  createAccount: string;
  admin: string;
  platformAccounts: string;

  accessibleAccounts: string;
  active: string;
  totalTrades: string;
  totalPnl: string;
  personalAccounts: string;
  sharedAccounts: string;
  archived: string;

  workspaceEyebrow: string;
  activeAccounts: string;
  noActiveAccounts: string;
  inactiveWorkspace: string;
  archivedAccounts: string;

  role: string;
  balance: string;
  trades: string;
  winRateShort: string;
  members: string;
  accountPnl: string;
  openAccount: string;
};

const accountsCopy: Record<AppLanguage, AccountsCopy> = {
  it: {
    overviewEyebrow: "Panoramica account",
    welcomeBack: "Bentornato",
    heroDescription:
      "Panoramica pulita dei tuoi account operativi. Qui apri e analizzi; la gestione completa rimane nella sezione Manage My Accounts.",

    manageAccounts: "Gestisci account",
    createAccount: "Crea account",
    admin: "Admin",
    platformAccounts: "Account piattaforma",

    accessibleAccounts: "Account accessibili",
    active: "Attivi",
    totalTrades: "Trade totali",
    totalPnl: "PnL totale",
    personalAccounts: "Account personali",
    sharedAccounts: "Account condivisi",
    archived: "Archiviati",

    workspaceEyebrow: "Workspace",
    activeAccounts: "Account attivi",
    noActiveAccounts: "Nessun account attivo disponibile.",
    inactiveWorkspace: "Workspace inattivo",
    archivedAccounts: "Account archiviati",

    role: "Ruolo",
    balance: "Saldo",
    trades: "Trade",
    winRateShort: "WR",
    members: "Membri",
    accountPnl: "PnL account",
    openAccount: "Apri account",
  },

  en: {
    overviewEyebrow: "Accounts overview",
    welcomeBack: "Welcome back",
    heroDescription:
      "A clean overview of your operating accounts. Open and analyze from here; full management remains inside Manage My Accounts.",

    manageAccounts: "Manage My Accounts",
    createAccount: "Create Account",
    admin: "Admin",
    platformAccounts: "Platform Accounts",

    accessibleAccounts: "Accessible Accounts",
    active: "Active",
    totalTrades: "Total Trades",
    totalPnl: "Total PnL",
    personalAccounts: "Personal Accounts",
    sharedAccounts: "Shared Accounts",
    archived: "Archived",

    workspaceEyebrow: "Workspace",
    activeAccounts: "Active Accounts",
    noActiveAccounts: "No active accounts available.",
    inactiveWorkspace: "Inactive workspace",
    archivedAccounts: "Archived Accounts",

    role: "Role",
    balance: "Balance",
    trades: "Trades",
    winRateShort: "WR",
    members: "Members",
    accountPnl: "Account PnL",
    openAccount: "Open Account",
  },

  uk: {
    overviewEyebrow: "Огляд акаунтів",
    welcomeBack: "З поверненням",
    heroDescription:
      "Чистий огляд ваших робочих акаунтів. Тут ви відкриваєте та аналізуєте; повне керування залишається в розділі керування акаунтами.",

    manageAccounts: "Керувати акаунтами",
    createAccount: "Створити акаунт",
    admin: "Адмін",
    platformAccounts: "Акаунти платформи",

    accessibleAccounts: "Доступні акаунти",
    active: "Активні",
    totalTrades: "Усього угод",
    totalPnl: "Загальний PnL",
    personalAccounts: "Особисті акаунти",
    sharedAccounts: "Спільні акаунти",
    archived: "Архівні",

    workspaceEyebrow: "Workspace",
    activeAccounts: "Активні акаунти",
    noActiveAccounts: "Немає доступних активних акаунтів.",
    inactiveWorkspace: "Неактивний workspace",
    archivedAccounts: "Архівні акаунти",

    role: "Роль",
    balance: "Баланс",
    trades: "Угоди",
    winRateShort: "WR",
    members: "Учасники",
    accountPnl: "PnL акаунта",
    openAccount: "Відкрити акаунт",
  },

  ru: {
    overviewEyebrow: "Обзор аккаунтов",
    welcomeBack: "С возвращением",
    heroDescription:
      "Чистый обзор ваших рабочих аккаунтов. Здесь вы открываете и анализируете; полное управление остается в разделе управления аккаунтами.",

    manageAccounts: "Управлять аккаунтами",
    createAccount: "Создать аккаунт",
    admin: "Админ",
    platformAccounts: "Аккаунты платформы",

    accessibleAccounts: "Доступные аккаунты",
    active: "Активные",
    totalTrades: "Всего сделок",
    totalPnl: "Общий PnL",
    personalAccounts: "Личные аккаунты",
    sharedAccounts: "Общие аккаунты",
    archived: "Архивные",

    workspaceEyebrow: "Workspace",
    activeAccounts: "Активные аккаунты",
    noActiveAccounts: "Нет доступных активных аккаунтов.",
    inactiveWorkspace: "Неактивный workspace",
    archivedAccounts: "Архивные аккаунты",

    role: "Роль",
    balance: "Баланс",
    trades: "Сделки",
    winRateShort: "WR",
    members: "Участники",
    accountPnl: "PnL аккаунта",
    openAccount: "Открыть аккаунт",
  },

  es: {
    overviewEyebrow: "Resumen de cuentas",
    welcomeBack: "Bienvenido de nuevo",
    heroDescription:
      "Una vista limpia de tus cuentas operativas. Desde aquí abres y analizas; la gestión completa queda dentro de Manage My Accounts.",

    manageAccounts: "Gestionar cuentas",
    createAccount: "Crear cuenta",
    admin: "Admin",
    platformAccounts: "Cuentas de plataforma",

    accessibleAccounts: "Cuentas accesibles",
    active: "Activas",
    totalTrades: "Trades totales",
    totalPnl: "PnL total",
    personalAccounts: "Cuentas personales",
    sharedAccounts: "Cuentas compartidas",
    archived: "Archivadas",

    workspaceEyebrow: "Workspace",
    activeAccounts: "Cuentas activas",
    noActiveAccounts: "No hay cuentas activas disponibles.",
    inactiveWorkspace: "Workspace inactivo",
    archivedAccounts: "Cuentas archivadas",

    role: "Rol",
    balance: "Balance",
    trades: "Trades",
    winRateShort: "WR",
    members: "Miembros",
    accountPnl: "PnL de cuenta",
    openAccount: "Abrir cuenta",
  },

  fr: {
    overviewEyebrow: "Vue d’ensemble des comptes",
    welcomeBack: "Bon retour",
    heroDescription:
      "Une vue claire de vos comptes opérationnels. Ouvrez et analysez ici; la gestion complète reste dans Manage My Accounts.",

    manageAccounts: "Gérer mes comptes",
    createAccount: "Créer un compte",
    admin: "Admin",
    platformAccounts: "Comptes plateforme",

    accessibleAccounts: "Comptes accessibles",
    active: "Actifs",
    totalTrades: "Trades totaux",
    totalPnl: "PnL total",
    personalAccounts: "Comptes personnels",
    sharedAccounts: "Comptes partagés",
    archived: "Archivés",

    workspaceEyebrow: "Workspace",
    activeAccounts: "Comptes actifs",
    noActiveAccounts: "Aucun compte actif disponible.",
    inactiveWorkspace: "Workspace inactif",
    archivedAccounts: "Comptes archivés",

    role: "Rôle",
    balance: "Solde",
    trades: "Trades",
    winRateShort: "WR",
    members: "Membres",
    accountPnl: "PnL du compte",
    openAccount: "Ouvrir le compte",
  },

  de: {
    overviewEyebrow: "Kontenübersicht",
    welcomeBack: "Willkommen zurück",
    heroDescription:
      "Eine klare Übersicht deiner operativen Konten. Hier öffnest und analysierst du; die vollständige Verwaltung bleibt in Manage My Accounts.",

    manageAccounts: "Konten verwalten",
    createAccount: "Konto erstellen",
    admin: "Admin",
    platformAccounts: "Plattformkonten",

    accessibleAccounts: "Zugängliche Konten",
    active: "Aktiv",
    totalTrades: "Trades gesamt",
    totalPnl: "Gesamt-PnL",
    personalAccounts: "Persönliche Konten",
    sharedAccounts: "Geteilte Konten",
    archived: "Archiviert",

    workspaceEyebrow: "Workspace",
    activeAccounts: "Aktive Konten",
    noActiveAccounts: "Keine aktiven Konten verfügbar.",
    inactiveWorkspace: "Inaktiver Workspace",
    archivedAccounts: "Archivierte Konten",

    role: "Rolle",
    balance: "Kontostand",
    trades: "Trades",
    winRateShort: "WR",
    members: "Mitglieder",
    accountPnl: "Konto-PnL",
    openAccount: "Konto öffnen",
  },
};

export default async function AccountsPage() {
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

  if (!currentUser) {
    redirect("/login");
  }

  const language = normalizeAppLanguage(
    currentUser.appLanguage
  );

  const t = accountsCopy[language] ?? accountsCopy.en;

  const defaultCurrency =
    currentUser.defaultCurrency ?? "USD";

  const canCreateAccount =
    currentUser.role === "FOUNDER" ||
    currentUser.role === "ADMIN" ||
    currentUser.canCreatePersonalAccounts ||
    currentUser.canCreateSharedAccounts;

  const canAccessAdmin =
    currentUser.role === "FOUNDER" ||
    currentUser.role === "ADMIN";

  const memberships =
    await prisma.accountMember.findMany({
      where: {
        userId: session.user.id,
      },

      include: {
        tradingAccount: {
          include: {
            trades: true,
            members: true,
          },
        },
      },
    });

  const activeMemberships = memberships.filter(
    (membership) =>
      membership.tradingAccount.status === "ACTIVE"
  );

  const archivedMemberships = memberships.filter(
    (membership) =>
      membership.tradingAccount.status === "ARCHIVED"
  );

  const personalMemberships = memberships.filter(
    (membership) =>
      membership.tradingAccount.createdById ===
      currentUser.id
  );

  const sharedMemberships = memberships.filter(
    (membership) =>
      membership.tradingAccount.members.length > 1 ||
      membership.tradingAccount.type === "SHARED"
  );

  const totalTrades = memberships.reduce(
    (acc, membership) =>
      acc + membership.tradingAccount.trades.length,
    0
  );

  const totalPnl = memberships.reduce(
    (acc, membership) =>
      acc +
      membership.tradingAccount.trades.reduce(
        (sum, trade) =>
          sum + (trade.resultUsd || 0),
        0
      ),
    0
  );

  const renderAccountCard = (
    membership: (typeof memberships)[number]
  ) => {
    const account =
      membership.tradingAccount;

    const accountPnl = account.trades.reduce(
      (acc, trade) =>
        acc + (trade.resultUsd || 0),
      0
    );

    const wins = account.trades.filter(
      (trade) => trade.outcome === "win"
    ).length;

    const winRate =
      account.trades.length > 0
        ? (wins / account.trades.length) * 100
        : 0;

    return (
      <div
        key={account.id}
        className="card-hover group rounded-3xl border border-white/10 bg-white/[0.03] p-6"
      >
        <Link href={`/accounts/${account.id}`}>
          <div className="mb-6 flex items-center justify-between">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white">
              <Wallet size={24} />
            </div>

            <div className="flex gap-2">
              <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-semibold text-gray-300">
                {account.type}
              </span>

              {account.status === "ARCHIVED" && (
                <span className="rounded-xl bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                  {t.archived}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold transition group-hover:text-accent">
                {account.name}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {t.role}: {membership.role}
              </p>
            </div>

            <ArrowRight
              size={20}
              className="mt-1 text-gray-600 transition group-hover:translate-x-1 group-hover:text-accent"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <TrendingUp size={15} />
                {t.balance}
              </div>

              <p className="font-bold text-white">
                {formatCurrencyByLanguage(
                  account.initialBalance,
                  account.currency,
                  language
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <Activity size={15} />
                {t.trades}
              </div>

              <p className="font-bold text-white">
                {formatNumberByLanguage(
                  account.trades.length,
                  language
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <Shield size={15} />
                {t.winRateShort}
              </div>

              <p
                className={`font-bold ${winRate >= 50
                    ? "text-accent"
                    : "text-red-400"
                  }`}
              >
                {winRate.toFixed(0)}%
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <Users size={15} />
                {t.members}
              </div>

              <p className="font-bold text-white">
                {formatNumberByLanguage(
                  account.members.length,
                  language
                )}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              {t.accountPnl}
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${accountPnl >= 0
                  ? "text-accent"
                  : "text-red-400"
                }`}
            >
              {formatCurrencyByLanguage(
                accountPnl,
                account.currency,
                language
              )}
            </p>
          </div>
        </Link>

        <div className="mt-5 flex gap-3">
          <Link
            href={`/accounts/${account.id}`}
            className="flex-1 rounded-2xl bg-accent px-4 py-3 text-center text-sm font-bold text-white hover:bg-accent-bright"
          >
            {t.openAccount}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="relative mb-10 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_12%,transparent),transparent_35%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_35%)]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              {t.overviewEyebrow}
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {t.welcomeBack},{" "}
              {currentUser.name ||
                currentUser.username}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400">
              {t.heroDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/accounts/manage"
              className="inline-flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent-bright"
            >
              <Settings size={16} />
              {t.manageAccounts}
            </Link>

            {canCreateAccount && (
              <Link
                href="/accounts/create"
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300 hover:bg-white/[0.06]"
              >
                {t.createAccount}
              </Link>
            )}

            {canAccessAdmin && (
              <>
                <Link
                  href="/admin"
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300 hover:bg-white/[0.06]"
                >
                  {t.admin}
                </Link>

                <Link
                  href="/admin/accounts"
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300 hover:bg-white/[0.06]"
                >
                  {t.platformAccounts}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            {t.accessibleAccounts}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {formatNumberByLanguage(
              memberships.length,
              language
            )}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            {t.active}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-accent">
            {formatNumberByLanguage(
              activeMemberships.length,
              language
            )}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            {t.totalTrades}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {formatNumberByLanguage(
              totalTrades,
              language
            )}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            {t.totalPnl}
          </p>

          <h2
            className={`mt-2 text-3xl font-bold ${totalPnl >= 0
                ? "text-accent"
                : "text-red-400"
              }`}
          >
            {formatCurrencyByLanguage(
              totalPnl,
              defaultCurrency,
              language
            )}
          </h2>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            {t.personalAccounts}
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {formatNumberByLanguage(
              personalMemberships.length,
              language
            )}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            {t.sharedAccounts}
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {formatNumberByLanguage(
              sharedMemberships.length,
              language
            )}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            {t.archived}
          </p>

          <h2 className="mt-2 text-3xl font-black text-yellow-300">
            {formatNumberByLanguage(
              archivedMemberships.length,
              language
            )}
          </h2>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {t.workspaceEyebrow}
          </p>

          <h2 className="text-2xl font-bold">
            {t.activeAccounts}
          </h2>
        </div>
      </div>

      {activeMemberships.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {activeMemberships.map(renderAccountCard)}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm text-gray-400">
          {t.noActiveAccounts}
        </div>
      )}

      {archivedMemberships.length > 0 && (
        <div className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <Archive
              size={18}
              className="text-yellow-300"
            />

            <div>
              <p className="text-sm text-gray-400">
                {t.inactiveWorkspace}
              </p>

              <h2 className="text-2xl font-bold">
                {t.archivedAccounts}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {archivedMemberships.map(renderAccountCard)}
          </div>
        </div>
      )}
    </div>
  );
}


