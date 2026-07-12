import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Settings } from "lucide-react";

import AccountLibrary, { type AccountLibraryItem } from "@/components/accounts/AccountLibrary";
import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import { auth } from "@/lib/auth";
import {
  formatCurrencyByLanguage,
  formatNumberByLanguage,
  normalizeAppLanguage,
} from "@/lib/i18n";
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
  const totalTrades = activeMemberships.reduce((sum, { tradingAccount }) => sum + tradingAccount.trades.length, 0);
  const totalPnl = activeMemberships.reduce(
    (sum, { tradingAccount }) => sum + tradingAccount.trades.reduce((tradeSum, trade) => tradeSum + (trade.resultUsd || 0), 0),
    0
  );

  const libraryAccounts: AccountLibraryItem[] = activeMemberships.map((membership) => {
    const account = membership.tradingAccount;
    const accountPnl = account.trades.reduce((sum, trade) => sum + (trade.resultUsd || 0), 0);
    const wins = account.trades.filter((trade) => trade.outcome === "win").length;
    const measuredWinRate = account.trades.length > 0 ? (wins / account.trades.length) * 100 : null;

    return {
      id: account.id,
      name: account.name,
      type: account.type,
      status: account.status,
      role: membership.role,
      broker: account.broker || account.brokerProvider,
      pnl: formatCurrencyByLanguage(accountPnl, account.currency, language),
      pnlValue: accountPnl,
      balance: formatCurrencyByLanguage(account.initialBalance, account.currency, language),
      totalTrades: formatNumberByLanguage(account.trades.length, language),
      totalTradesValue: account.trades.length,
      winRate: measuredWinRate === null ? null : `${measuredWinRate.toFixed(0)}%`,
      winRateValue: measuredWinRate,
      members: formatNumberByLanguage(account.members.length, language),
      membersValue: account.members.length,
      updatedAt: new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(account.updatedAt),
      isShared: account.type === "SHARED" || account.members.length > 1,
    };
  });

  const operatingSummary = `${formatNumberByLanguage(activeMemberships.length, language)} active ${activeMemberships.length === 1 ? "account" : "accounts"} · ${formatNumberByLanguage(totalTrades, language)} ${totalTrades === 1 ? "trade" : "trades"} · ${formatCurrencyByLanguage(totalPnl, defaultCurrency, language)} total PnL`;
  const primaryHref = canCreateAccount ? "/accounts/create" : "/accounts/manage";
  const primaryLabel = canCreateAccount ? "Create Account" : "Manage My Accounts";

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
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={primaryHref} style={{ background: CTA_GRADIENT }} className="inline-flex items-center gap-2 rounded-inner px-4 py-3 text-sm font-semibold text-white outline-none transition-shadow hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_18%,transparent)] focus-visible:ring-2 focus-visible:ring-accent-bright/60">{primaryLabel}</Link>
            {canCreateAccount && <Link href="/accounts/manage" className="inline-flex items-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-3 text-sm text-muted outline-none hover:bg-white/[0.04] hover:text-white focus-visible:ring-2 focus-visible:ring-accent-bright/60"><Settings size={16} />Manage My Accounts</Link>}
          </div>
        </div>
      </Card>

      {activeMemberships.length > 0 ? (
        <AccountLibrary
          accounts={libraryAccounts}
          labels={{ role: "Role", balance: "Balance", trades: "Trades", winRateShort: "WR", members: "Members", accountPnl: "Account PnL", openAccount: "Open Dashboard", archived: "Archived" }}
        />
      ) : (
        <Card variant="inner" className="border-dashed p-8 text-sm text-muted">No active accounts available.</Card>
      )}

      <Link href="/accounts/archived" className="group mt-7 flex items-center justify-between gap-5 rounded-inner border-[0.5px] border-flash/[0.07] bg-surface-1/25 px-4 py-3 outline-none transition-colors hover:border-flash/[0.14] hover:bg-surface-1/40 focus-visible:ring-2 focus-visible:ring-accent-bright/60 sm:px-5">
        <span><span className="block text-sm font-medium text-flash/90">Archived accounts</span><span className="mt-0.5 block text-xs text-muted-faint">Accounts you no longer actively use.</span></span>
        <span className="flex shrink-0 items-center gap-3"><span className="text-sm tabular-nums text-muted">{formatNumberByLanguage(archivedCount, language)}</span><ArrowRight size={16} aria-hidden="true" className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-flash" /></span>
      </Link>
    </div>
  );
}
