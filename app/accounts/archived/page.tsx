import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Archive, RotateCcw } from "lucide-react";

import { restoreAccount } from "@/app/accounts/actions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import {
  formatCurrencyByLanguage,
  formatNumberByLanguage,
  normalizeAppLanguage,
} from "@/lib/i18n";

export default async function ArchivedAccountsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      appLanguage: true,
      canArchiveOwnAccounts: true,
    },
  });
  if (!currentUser) redirect("/login");

  const memberships = await prisma.accountMember.findMany({
    where: {
      userId: currentUser.id,
      tradingAccount: { status: "ARCHIVED" },
    },
    include: {
      tradingAccount: {
        include: { trades: true },
      },
    },
    orderBy: { tradingAccount: { updatedAt: "desc" } },
  });

  const language = normalizeAppLanguage(currentUser.appLanguage);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-micro uppercase tracking-label text-accent-bright">Account archive</p>
          <h1 className="mt-2 text-section text-flash">Archived accounts</h1>
          <p className="mt-2 max-w-2xl text-caption leading-5 text-muted">Review accounts that are no longer part of your active workspace.</p>
        </div>
        <Link href="/accounts" className="inline-flex min-h-11 items-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-3 text-sm text-muted outline-none hover:text-flash focus-visible:ring-2 focus-visible:ring-accent-bright/60"><ArrowLeft size={16} aria-hidden="true" />Back to account library</Link>
      </header>

      {memberships.length === 0 ? (
        <Card variant="inner" className="border-dashed p-8 text-center">
          <Archive size={22} aria-hidden="true" className="mx-auto text-muted" />
          <h2 className="mt-4 text-subsection text-flash">No archived accounts</h2>
          <p className="mt-2 text-caption text-muted">Accounts you archive will appear here.</p>
          <Link href="/accounts" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-inner border-[0.5px] border-accent/30 px-4 py-3 text-sm text-accent-bright">Back to account library<ArrowRight size={15} /></Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {memberships.map((membership) => {
            const account = membership.tradingAccount;
            const pnl = account.trades.reduce((sum, trade) => sum + (trade.resultUsd || 0), 0);
            const canRestore = currentUser.role === "FOUNDER" || currentUser.role === "ADMIN" || (account.createdById === currentUser.id && currentUser.canArchiveOwnAccounts);

            return (
              <Card key={account.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="text-micro uppercase tracking-label text-muted-faint">{account.type} · Archived</p><h2 className="mt-2 truncate text-subsection text-flash">{account.name}</h2><p className="mt-1 text-caption text-muted">Role: {membership.role}</p></div>
                  <Archive size={18} aria-hidden="true" className="shrink-0 text-muted" />
                </div>
                <p className="mt-4 border-t-[0.5px] border-flash/[0.08] pt-4 text-caption text-muted">Last modified {new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(account.updatedAt)}</p>
                <dl className="mt-4 grid grid-cols-3 gap-3">
                  <div><dt className="text-micro text-muted-faint">Balance</dt><dd className="mt-1 text-caption font-medium tabular-nums text-flash">{formatCurrencyByLanguage(account.initialBalance, account.currency, language)}</dd></div>
                  <div><dt className="text-micro text-muted-faint">PnL</dt><dd className={`mt-1 text-caption font-medium tabular-nums ${pnl > 0 ? "text-accent" : pnl < 0 ? "text-red-400" : "text-muted"}`}>{formatCurrencyByLanguage(pnl, account.currency, language)}</dd></div>
                  <div><dt className="text-micro text-muted-faint">Trades</dt><dd className="mt-1 text-caption font-medium tabular-nums text-flash">{formatNumberByLanguage(account.trades.length, language)}</dd></div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2 border-t-[0.5px] border-flash/[0.08] pt-4">
                  <Link href={`/accounts/${account.id}/dashboard`} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-3 text-sm text-muted outline-none hover:text-flash focus-visible:ring-2 focus-visible:ring-accent-bright/60">View dashboard<ArrowRight size={15} /></Link>
                  {canRestore && (
                    <form action={restoreAccount}>
                      <input type="hidden" name="accountId" value={account.id} />
                      <input type="hidden" name="redirectTo" value="/accounts/archived" />
                      <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-inner bg-accent/10 px-4 py-3 text-sm font-medium text-accent-bright outline-none hover:bg-accent/15 focus-visible:ring-2 focus-visible:ring-accent-bright/60"><RotateCcw size={15} />Restore account</button>
                    </form>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
