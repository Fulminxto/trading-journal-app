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

import Card from "@/components/ui/Card";
import IconTile from "@/components/ui/IconTile";
import SignatureEdge from "@/components/ui/SignatureEdge";

import {
  formatCurrencyByLanguage,
  formatNumberByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

// CTA Fulmine: reserved for the one action that counts on this page
// (Create Account is explicitly named in REBRAND_BLUEPRINT.md §6 as a
// CTA-Fulmine-worthy action). Everything else stays discrete/outline.
const CTA_GRADIENT =
  "linear-gradient(120deg, #2E62E6, #3f86e8 60%, #5BE0FF)";

type AccountsCopy = {
  overviewEyebrow: string;
  welcomeBack: string;
  heroDescription: string;
  operatingSummary: (activeAccounts: string, totalTrades: string) => string;

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
    operatingSummary: (activeAccounts, totalTrades) =>
      `Sistema stabile · ${activeAccounts} account attivi · ${totalTrades} trade registrati`,

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
    operatingSummary: (activeAccounts, totalTrades) =>
      `System stable · ${activeAccounts} active accounts · ${totalTrades} trades recorded`,

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
    operatingSummary: (activeAccounts, totalTrades) =>
      `System stable · ${activeAccounts} active accounts · ${totalTrades} trades recorded`,

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
    operatingSummary: (activeAccounts, totalTrades) =>
      `System stable · ${activeAccounts} active accounts · ${totalTrades} trades recorded`,

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
    operatingSummary: (activeAccounts, totalTrades) =>
      `Sistema estable · ${activeAccounts} cuentas activas · ${totalTrades} trades registrados`,

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
    operatingSummary: (activeAccounts, totalTrades) =>
      `Systeme stable · ${activeAccounts} comptes actifs · ${totalTrades} trades enregistres`,

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
    operatingSummary: (activeAccounts, totalTrades) =>
      `System stabil · ${activeAccounts} aktive Konten · ${totalTrades} Trades erfasst`,

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

  const operatingSummary = t.operatingSummary(
    formatNumberByLanguage(activeMemberships.length, language),
    formatNumberByLanguage(totalTrades, language)
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
      <Card key={account.id} interactive className="p-6">
        <Link href={`/accounts/${account.id}`}>
          <div className="mb-6 flex items-center justify-between">
            <IconTile>
              <Wallet size={20} />
            </IconTile>

            <div className="flex gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gray-300">
                {account.type}
              </span>

              {account.status === "ARCHIVED" && (
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-muted">
                  {t.archived}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white transition-colors duration-base group-hover:text-accent-bright">
                {account.name}
              </h2>

              <p className="mt-1 text-sm text-muted-faint">
                {t.role}: {membership.role}
              </p>
            </div>

            <ArrowRight
              size={18}
              className="mt-1 shrink-0 text-muted transition-all duration-base group-hover:translate-x-1 group-hover:text-accent-bright"
            />
          </div>

          {/* Primary value: this account's PnL, the one number that
              answers "how is this account doing". */}
          <div className="mt-5">
            <p className="text-xs text-muted-faint">
              {t.accountPnl}
            </p>

            <p
              className={`mt-1 text-3xl font-black ${accountPnl >= 0
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

          {/* Support: compact inline strip, not four competing sub-cards. */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4 text-xs">
            <span className="flex items-center gap-1.5 text-muted">
              <TrendingUp size={13} />
              {formatCurrencyByLanguage(
                account.initialBalance,
                account.currency,
                language
              )}
            </span>

            <span className="flex items-center gap-1.5 text-muted">
              <Activity size={13} />
              {formatNumberByLanguage(account.trades.length, language)}{" "}
              {t.trades}
            </span>

            <span
              className={`flex items-center gap-1.5 ${winRate >= 50 ? "text-accent" : "text-red-400"
                }`}
            >
              <Shield size={13} />
              {winRate.toFixed(0)}% {t.winRateShort}
            </span>

            <span className="flex items-center gap-1.5 text-muted">
              <Users size={13} />
              {formatNumberByLanguage(account.members.length, language)}
            </span>
          </div>
        </Link>

        <Link
          href={`/accounts/${account.id}`}
          className="mt-5 block rounded-inner bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition-colors duration-base hover:bg-accent-bright"
        >
          {t.openAccount}
        </Link>
      </Card>
    );
  };

  const primaryHref = canCreateAccount ? "/accounts/create" : "/accounts/manage";
  const primaryLabel = canCreateAccount ? t.createAccount : t.manageAccounts;

  return (
    <div>
      <Card
        variant="hero"
        className="reveal-rise relative mb-8 p-8"
        style={{ animationDelay: "0ms" }}
      >
        <SignatureEdge
          orientation="vertical"
          className="absolute bottom-8 left-0 top-8"
        />

        <div className="flex flex-col gap-8 pl-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-muted">
              {t.overviewEyebrow}
            </p>

            <h1 className="text-hero mt-3">
              {t.welcomeBack},{" "}
              {currentUser.name ||
                currentUser.username}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              {t.heroDescription}
            </p>

            <p className="mt-4 inline-flex rounded-pill border-[0.5px] border-flash/[0.1] bg-surface-2/70 px-3 py-1.5 text-micro uppercase tracking-label text-muted">
              {operatingSummary}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={primaryHref}
              style={{ background: CTA_GRADIENT }}
              className="inline-flex items-center gap-2 rounded-inner px-4 py-3 text-sm font-semibold text-white transition-shadow duration-base hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]"
            >
              {primaryLabel}
            </Link>

            {canCreateAccount && (
              <Link
                href="/accounts/manage"
                className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-3 text-sm text-muted transition-colors duration-base hover:text-white hover:bg-white/[0.04]"
              >
                <Settings size={16} />
                {t.manageAccounts}
              </Link>
            )}
          </div>
        </div>
      </Card>

      <div
        className="reveal-rise mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        style={{ animationDelay: "100ms" }}
      >
        <Card interactive className="p-5">
          <p className="text-sm text-muted">
            {t.accessibleAccounts}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {formatNumberByLanguage(
              memberships.length,
              language
            )}
          </h2>
        </Card>

        <Card interactive className="p-5">
          <p className="text-sm text-muted">
            {t.active}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-accent">
            {formatNumberByLanguage(
              activeMemberships.length,
              language
            )}
          </h2>
        </Card>

        <Card interactive className="p-5">
          <p className="text-sm text-muted">
            {t.totalTrades}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {formatNumberByLanguage(
              totalTrades,
              language
            )}
          </h2>
        </Card>

        <Card interactive className="p-5">
          <p className="text-sm text-muted">
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
        </Card>
      </div>

      {/* Secondary breakdown: compact, clearly subordinate to the row above. */}
      <div
        className="reveal-rise mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3"
        style={{ animationDelay: "140ms" }}
      >
        <Card variant="inner" className="flex items-center justify-between px-4 py-3">
          <p className="text-xs text-muted-faint">
            {t.personalAccounts}
          </p>

          <p className="text-lg font-bold text-gray-200">
            {formatNumberByLanguage(
              personalMemberships.length,
              language
            )}
          </p>
        </Card>

        <Card variant="inner" className="flex items-center justify-between px-4 py-3">
          <p className="text-xs text-muted-faint">
            {t.sharedAccounts}
          </p>

          <p className="text-lg font-bold text-gray-200">
            {formatNumberByLanguage(
              sharedMemberships.length,
              language
            )}
          </p>
        </Card>

        <Card variant="inner" className="flex items-center justify-between px-4 py-3">
          <p className="text-xs text-muted-faint">
            {t.archived}
          </p>

          <p className="text-lg font-bold text-gray-200">
            {formatNumberByLanguage(
              archivedMemberships.length,
              language
            )}
          </p>
        </Card>
      </div>

      <div
        className="reveal-rise"
        style={{ animationDelay: "200ms" }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">
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
          <Card variant="inner" className="border-dashed p-8 text-sm text-muted">
            {t.noActiveAccounts}
          </Card>
        )}

        {archivedMemberships.length > 0 && (
          <div className="mt-12">
            <div className="mb-5 flex items-center gap-3">
              <Archive size={18} className="text-muted" />

              <div>
                <p className="text-sm text-muted">
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
    </div>
  );
}


