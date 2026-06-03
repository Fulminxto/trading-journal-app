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
    overviewEyebrow: "ÐžÐ³Ð»ÑÐ´ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ñ–Ð²",
    welcomeBack: "Ð— Ð¿Ð¾Ð²ÐµÑ€Ð½ÐµÐ½Ð½ÑÐ¼",
    heroDescription:
      "Ð§Ð¸ÑÑ‚Ð¸Ð¹ Ð¾Ð³Ð»ÑÐ´ Ð²Ð°ÑˆÐ¸Ñ… Ñ€Ð¾Ð±Ð¾Ñ‡Ð¸Ñ… Ð°ÐºÐ°ÑƒÐ½Ñ‚Ñ–Ð². Ð¢ÑƒÑ‚ Ð²Ð¸ Ð²Ñ–Ð´ÐºÑ€Ð¸Ð²Ð°Ñ”Ñ‚Ðµ Ñ‚Ð° Ð°Ð½Ð°Ð»Ñ–Ð·ÑƒÑ”Ñ‚Ðµ; Ð¿Ð¾Ð²Ð½Ðµ ÐºÐµÑ€ÑƒÐ²Ð°Ð½Ð½Ñ Ð·Ð°Ð»Ð¸ÑˆÐ°Ñ”Ñ‚ÑŒÑÑ Ð² Ñ€Ð¾Ð·Ð´Ñ–Ð»Ñ– ÐºÐµÑ€ÑƒÐ²Ð°Ð½Ð½Ñ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°Ð¼Ð¸.",

    manageAccounts: "ÐšÐµÑ€ÑƒÐ²Ð°Ñ‚Ð¸ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°Ð¼Ð¸",
    createAccount: "Ð¡Ñ‚Ð²Ð¾Ñ€Ð¸Ñ‚Ð¸ Ð°ÐºÐ°ÑƒÐ½Ñ‚",
    admin: "ÐÐ´Ð¼Ñ–Ð½",
    platformAccounts: "ÐÐºÐ°ÑƒÐ½Ñ‚Ð¸ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ð¸",

    accessibleAccounts: "Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ– Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð¸",
    active: "ÐÐºÑ‚Ð¸Ð²Ð½Ñ–",
    totalTrades: "Ð£ÑÑŒÐ¾Ð³Ð¾ ÑƒÐ³Ð¾Ð´",
    totalPnl: "Ð—Ð°Ð³Ð°Ð»ÑŒÐ½Ð¸Ð¹ PnL",
    personalAccounts: "ÐžÑÐ¾Ð±Ð¸ÑÑ‚Ñ– Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð¸",
    sharedAccounts: "Ð¡Ð¿Ñ–Ð»ÑŒÐ½Ñ– Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð¸",
    archived: "ÐÑ€Ñ…Ñ–Ð²Ð½Ñ–",

    workspaceEyebrow: "Workspace",
    activeAccounts: "ÐÐºÑ‚Ð¸Ð²Ð½Ñ– Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð¸",
    noActiveAccounts: "ÐÐµÐ¼Ð°Ñ” Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¸Ñ… Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¸Ñ… Ð°ÐºÐ°ÑƒÐ½Ñ‚Ñ–Ð².",
    inactiveWorkspace: "ÐÐµÐ°ÐºÑ‚Ð¸Ð²Ð½Ð¸Ð¹ workspace",
    archivedAccounts: "ÐÑ€Ñ…Ñ–Ð²Ð½Ñ– Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð¸",

    role: "Ð Ð¾Ð»ÑŒ",
    balance: "Ð‘Ð°Ð»Ð°Ð½Ñ",
    trades: "Ð£Ð³Ð¾Ð´Ð¸",
    winRateShort: "WR",
    members: "Ð£Ñ‡Ð°ÑÐ½Ð¸ÐºÐ¸",
    accountPnl: "PnL Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°",
    openAccount: "Ð’Ñ–Ð´ÐºÑ€Ð¸Ñ‚Ð¸ Ð°ÐºÐ°ÑƒÐ½Ñ‚",
  },

  ru: {
    overviewEyebrow: "ÐžÐ±Ð·Ð¾Ñ€ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð¾Ð²",
    welcomeBack: "Ð¡ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‰ÐµÐ½Ð¸ÐµÐ¼",
    heroDescription:
      "Ð§Ð¸ÑÑ‚Ñ‹Ð¹ Ð¾Ð±Ð·Ð¾Ñ€ Ð²Ð°ÑˆÐ¸Ñ… Ñ€Ð°Ð±Ð¾Ñ‡Ð¸Ñ… Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð¾Ð². Ð—Ð´ÐµÑÑŒ Ð²Ñ‹ Ð¾Ñ‚ÐºÑ€Ñ‹Ð²Ð°ÐµÑ‚Ðµ Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐµÑ‚Ðµ; Ð¿Ð¾Ð»Ð½Ð¾Ðµ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¾ÑÑ‚Ð°ÐµÑ‚ÑÑ Ð² Ñ€Ð°Ð·Ð´ÐµÐ»Ðµ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°Ð¼Ð¸.",

    manageAccounts: "Ð£Ð¿Ñ€Ð°Ð²Ð»ÑÑ‚ÑŒ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°Ð¼Ð¸",
    createAccount: "Ð¡Ð¾Ð·Ð´Ð°Ñ‚ÑŒ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚",
    admin: "ÐÐ´Ð¼Ð¸Ð½",
    platformAccounts: "ÐÐºÐºÐ°ÑƒÐ½Ñ‚Ñ‹ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ñ‹",

    accessibleAccounts: "Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹Ðµ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ñ‹",
    active: "ÐÐºÑ‚Ð¸Ð²Ð½Ñ‹Ðµ",
    totalTrades: "Ð’ÑÐµÐ³Ð¾ ÑÐ´ÐµÐ»Ð¾Ðº",
    totalPnl: "ÐžÐ±Ñ‰Ð¸Ð¹ PnL",
    personalAccounts: "Ð›Ð¸Ñ‡Ð½Ñ‹Ðµ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ñ‹",
    sharedAccounts: "ÐžÐ±Ñ‰Ð¸Ðµ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ñ‹",
    archived: "ÐÑ€Ñ…Ð¸Ð²Ð½Ñ‹Ðµ",

    workspaceEyebrow: "Workspace",
    activeAccounts: "ÐÐºÑ‚Ð¸Ð²Ð½Ñ‹Ðµ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ñ‹",
    noActiveAccounts: "ÐÐµÑ‚ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹Ñ… Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ñ… Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð¾Ð².",
    inactiveWorkspace: "ÐÐµÐ°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ð¹ workspace",
    archivedAccounts: "ÐÑ€Ñ…Ð¸Ð²Ð½Ñ‹Ðµ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ñ‹",

    role: "Ð Ð¾Ð»ÑŒ",
    balance: "Ð‘Ð°Ð»Ð°Ð½Ñ",
    trades: "Ð¡Ð´ÐµÐ»ÐºÐ¸",
    winRateShort: "WR",
    members: "Ð£Ñ‡Ð°ÑÑ‚Ð½Ð¸ÐºÐ¸",
    accountPnl: "PnL Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°",
    openAccount: "ÐžÑ‚ÐºÑ€Ñ‹Ñ‚ÑŒ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚",
  },

  es: {
    overviewEyebrow: "Resumen de cuentas",
    welcomeBack: "Bienvenido de nuevo",
    heroDescription:
      "Una vista limpia de tus cuentas operativas. Desde aquÃ­ abres y analizas; la gestiÃ³n completa queda dentro de Manage My Accounts.",

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
    overviewEyebrow: "Vue dâ€™ensemble des comptes",
    welcomeBack: "Bon retour",
    heroDescription:
      "Une vue claire de vos comptes opÃ©rationnels. Ouvrez et analysez ici; la gestion complÃ¨te reste dans Manage My Accounts.",

    manageAccounts: "GÃ©rer mes comptes",
    createAccount: "CrÃ©er un compte",
    admin: "Admin",
    platformAccounts: "Comptes plateforme",

    accessibleAccounts: "Comptes accessibles",
    active: "Actifs",
    totalTrades: "Trades totaux",
    totalPnl: "PnL total",
    personalAccounts: "Comptes personnels",
    sharedAccounts: "Comptes partagÃ©s",
    archived: "ArchivÃ©s",

    workspaceEyebrow: "Workspace",
    activeAccounts: "Comptes actifs",
    noActiveAccounts: "Aucun compte actif disponible.",
    inactiveWorkspace: "Workspace inactif",
    archivedAccounts: "Comptes archivÃ©s",

    role: "RÃ´le",
    balance: "Solde",
    trades: "Trades",
    winRateShort: "WR",
    members: "Membres",
    accountPnl: "PnL du compte",
    openAccount: "Ouvrir le compte",
  },

  de: {
    overviewEyebrow: "KontenÃ¼bersicht",
    welcomeBack: "Willkommen zurÃ¼ck",
    heroDescription:
      "Eine klare Ãœbersicht deiner operativen Konten. Hier Ã¶ffnest und analysierst du; die vollstÃ¤ndige Verwaltung bleibt in Manage My Accounts.",

    manageAccounts: "Konten verwalten",
    createAccount: "Konto erstellen",
    admin: "Admin",
    platformAccounts: "Plattformkonten",

    accessibleAccounts: "ZugÃ¤ngliche Konten",
    active: "Aktiv",
    totalTrades: "Trades gesamt",
    totalPnl: "Gesamt-PnL",
    personalAccounts: "PersÃ¶nliche Konten",
    sharedAccounts: "Geteilte Konten",
    archived: "Archiviert",

    workspaceEyebrow: "Workspace",
    activeAccounts: "Aktive Konten",
    noActiveAccounts: "Keine aktiven Konten verfÃ¼gbar.",
    inactiveWorkspace: "Inaktiver Workspace",
    archivedAccounts: "Archivierte Konten",

    role: "Rolle",
    balance: "Kontostand",
    trades: "Trades",
    winRateShort: "WR",
    members: "Mitglieder",
    accountPnl: "Konto-PnL",
    openAccount: "Konto Ã¶ffnen",
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
              <h2 className="text-2xl font-bold transition group-hover:text-green-400">
                {account.name}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {t.role}: {membership.role}
              </p>
            </div>

            <ArrowRight
              size={20}
              className="mt-1 text-gray-600 transition group-hover:translate-x-1 group-hover:text-green-400"
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
                    ? "text-green-400"
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
                  ? "text-green-400"
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
            className="flex-1 rounded-2xl bg-green-500 px-4 py-3 text-center text-sm font-bold text-black hover:bg-green-400"
          >
            {t.openAccount}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-green-400">
              {t.overviewEyebrow}
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
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
              className="inline-flex items-center gap-2 rounded-2xl bg-green-500 px-4 py-3 text-sm font-bold text-black hover:bg-green-400"
            >
              <Settings size={16} />
              {t.manageAccounts}
            </Link>

            {canCreateAccount && (
              <Link
                href="/accounts/manage"
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

          <h2 className="mt-2 text-3xl font-bold text-green-400">
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
                ? "text-green-400"
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

      <div className="mb-5 flex items-center justify-between">
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {archivedMemberships.map(renderAccountCard)}
          </div>
        </div>
      )}
    </div>
  );
}

