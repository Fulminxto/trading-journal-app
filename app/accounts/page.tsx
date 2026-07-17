import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Settings } from "lucide-react";

import AccountLibrary from "@/components/accounts/AccountLibrary";
import {
  getAccountLibraryPnlAggregate,
  sortAccountLibraryItems,
  type AccountLibraryItem,
} from "@/components/accounts/account-library-utils";
import AccountLibraryEmptyState from "@/components/accounts/AccountLibraryEmptyState";
import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import { auth } from "@/lib/auth";
import {
  formatCurrencyByLanguage,
  formatNumberByLanguage,
  normalizeAppLanguage,
} from "@/lib/i18n";
import { isManager } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const CTA_GRADIENT = "linear-gradient(120deg, #2E62E6, #3f86e8 60%, #5BE0FF)";

export default async function AccountsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!currentUser) redirect("/login");

  const language = normalizeAppLanguage(currentUser.appLanguage);
  const defaultCurrency = currentUser.defaultCurrency ?? "USD";
  const canCreateAccount =
    currentUser.role === "FOUNDER" ||
    currentUser.role === "ADMIN" ||
    currentUser.canCreatePersonalAccounts ||
    currentUser.canCreateSharedAccounts;

  const memberships = await prisma.accountMember.findMany({
    where: { userId: session.user.id },
    include: {
      tradingAccount: {
        include: { trades: true, members: true },
      },
    },
  });

  const activeMemberships = memberships.filter(({ tradingAccount }) => tradingAccount.status === "ACTIVE");
  const archivedCount = memberships.filter(({ tradingAccount }) => tradingAccount.status === "ARCHIVED").length;
  const canManageAccounts = memberships.some((membership) => membership.role === "MANAGER" || membership.tradingAccount.createdById === currentUser.id);
  const totalTrades = activeMemberships.reduce((sum, { tradingAccount }) => sum + tradingAccount.trades.length, 0);
  const libraryAccounts = sortAccountLibraryItems<AccountLibraryItem>(activeMemberships.map((membership) => {
    const account = membership.tradingAccount;
    const accountPnl = account.trades.reduce((sum, trade) => sum + (trade.resultUsd || 0), 0);
    const wins = account.trades.filter((trade) => trade.outcome === "win").length;
    const measuredWinRate = account.trades.length > 0 ? (wins / account.trades.length) * 100 : null;

    return {
      id: account.id,
      name: account.name,
      type: account.type,
      status: account.status,
      membershipRole: membership.role,
      membersCount: account.members.length,
      formattedMembersCount: formatNumberByLanguage(account.members.length, language),
      hasMultipleMembers: account.members.length > 1,
      isSharedType: account.type === "SHARED",
      initialBalance: account.initialBalance,
      formattedInitialBalance: formatCurrencyByLanguage(account.initialBalance, account.currency, language),
      pnl: accountPnl,
      formattedPnl: formatCurrencyByLanguage(accountPnl, account.currency, language),
      pnlValue: accountPnl,
      tradeCount: account.trades.length,
      formattedTradeCount: formatNumberByLanguage(account.trades.length, language),
      winRate: measuredWinRate === null ? null : `${measuredWinRate.toFixed(0)}%`,
      winRateValue: measuredWinRate,
      currency: account.currency,
      brokerProvider: account.broker || account.brokerProvider,
      updatedAt: new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(account.updatedAt),
      integrationMode: account.integrationMode,
      autoSyncEnabled: account.autoSyncEnabled,
      syncStatus: account.syncStatus,
      canViewMembers: isManager(membership) || membership.canViewMembers,
      canManageIntegrations: isManager(membership) || membership.canManageAccount,
      canOpenManage: account.createdById === currentUser.id || membership.role === "MANAGER",
      canArchiveAccount:
        currentUser.role === "FOUNDER" ||
        currentUser.role === "ADMIN" ||
        (account.createdById === currentUser.id && currentUser.canArchiveOwnAccounts),
      canDeleteAccount:
        currentUser.role === "FOUNDER" ||
        currentUser.role === "ADMIN" ||
        (account.createdById === currentUser.id && currentUser.canDeleteOwnAccounts),
    };
  }));

  const pnlAggregate = getAccountLibraryPnlAggregate(libraryAccounts);
  const aggregatePnlLabel = pnlAggregate.kind === "single"
    ? `${formatCurrencyByLanguage(pnlAggregate.pnl, pnlAggregate.currency, language)} total PnL`
    : pnlAggregate.kind === "mixed"
      ? "Multiple currencies"
      : `${formatCurrencyByLanguage(0, defaultCurrency, language)} total PnL`;
  const operatingSummary = `${formatNumberByLanguage(activeMemberships.length, language)} active ${activeMemberships.length === 1 ? "account" : "accounts"} · ${formatNumberByLanguage(totalTrades, language)} ${totalTrades === 1 ? "trade" : "trades"} · ${aggregatePnlLabel}`;
  const primaryAction = canCreateAccount
    ? { href: "/accounts/create", label: "Create Account" }
    : canManageAccounts
      ? { href: "/accounts/manage", label: "Manage My Accounts" }
      : archivedCount > 0
        ? { href: "/accounts/archived", label: "View Archived Accounts" }
        : null;

  return (
    <div>
      <Card variant="hero" className="reveal-rise relative mb-8 p-8">
        <SignatureEdge orientation="vertical" className="absolute bottom-8 left-0 top-8" />
        <div className="flex flex-col gap-8 pl-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-muted">Accounts overview</p>
            <h1 className="text-hero mt-3">Welcome back, {currentUser.name || currentUser.username}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">Choose the trading workspace you want to continue working on.</p>
            <p className="mt-4 inline-flex rounded-pill border-[0.5px] border-flash/[0.1] bg-surface-2/70 px-3 py-1.5 text-micro uppercase tracking-label text-muted">{operatingSummary}</p>
            {pnlAggregate.kind === "mixed" && <p className="mt-2 text-xs text-muted-faint">View totals on individual accounts</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            {primaryAction && <Link href={primaryAction.href} style={{ background: CTA_GRADIENT }} className="inline-flex items-center gap-2 rounded-inner px-4 py-3 text-sm font-semibold text-white outline-none transition-shadow hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_18%,transparent)] focus-visible:ring-2 focus-visible:ring-accent-bright/60">{primaryAction.label}</Link>}
            {canCreateAccount && canManageAccounts && <Link href="/accounts/manage" className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-3 text-sm text-muted outline-none hover:bg-white/[0.04] hover:text-white focus-visible:ring-2 focus-visible:ring-accent-bright/60"><Settings size={16} aria-hidden="true" />Manage My Accounts</Link>}
          </div>
        </div>
      </Card>

      {activeMemberships.length > 0 ? (
        <AccountLibrary
          accounts={libraryAccounts}
          labels={{ initialBalance: "Initial balance", trades: "Trades", winRate: "Win rate", notMeasured: "Not measured", member: "member", members: "members", pnl: "PnL", openAccount: "Open workspace", archived: "Archived" }}
        />
      ) : (
        <AccountLibraryEmptyState language={language} canCreateAccount={canCreateAccount} canManageAccounts={canManageAccounts} hasArchivedAccounts={archivedCount > 0} />
      )}

      <Link href="/accounts/archived" className="group mt-6 flex items-center justify-between gap-5 rounded-inner border-[0.5px] border-flash/[0.05] bg-surface-1/15 px-4 py-2.5 outline-none transition-colors hover:border-flash/[0.1] hover:bg-surface-1/25 focus-visible:ring-2 focus-visible:ring-accent-bright/60 sm:px-5">
        <span><span className="block text-sm font-normal text-flash/80">Archived accounts</span><span className="mt-0.5 block text-xs text-muted-faint">Accounts you no longer actively use.</span></span>
        <span className="flex shrink-0 items-center gap-3"><span className="text-sm tabular-nums text-muted">{formatNumberByLanguage(archivedCount, language)}</span><ArrowRight size={16} aria-hidden="true" className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-flash" /></span>
      </Link>
    </div>
  );
}
