import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Archive, RotateCcw } from "lucide-react";

import { restoreAccount } from "@/app/accounts/actions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import IconTile from "@/components/ui/IconTile";
import EmptyState from "@/components/EmptyState";
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
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Account archive</p>
        <h1 className="mb-2 mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">Archived accounts</h1>
        <p className="max-w-2xl text-caption leading-5 text-muted">Review accounts that are no longer part of your active workspace.</p>
      </header>

      {memberships.length === 0 ? (
        <EmptyState title="No archived accounts" description="Archived trading accounts will appear here." icon={Archive} action={<Link href="/accounts" aria-label="Back to account library" className="inline-flex min-h-11 items-center gap-2 rounded-inner border-[0.5px] border-accent/30 px-4 py-3 text-sm text-accent-bright outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60">Back to account library<ArrowRight size={15} aria-hidden="true" /></Link>} />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {memberships.map((membership) => {
            const account = membership.tradingAccount;
            const pnl = account.trades.reduce((sum, trade) => sum + (trade.resultUsd || 0), 0);
            const canRestore = currentUser.role === "FOUNDER" || currentUser.role === "ADMIN" || (account.createdById === currentUser.id && currentUser.canArchiveOwnAccounts);

            return (
              <article
                key={account.id}
                className="group relative rounded-2xl border border-white/10 bg-[#090f1e]/60 p-6 backdrop-blur-xl transition-all hover:border-white/20 focus-within:border-white/20"
              >
                <Link
                  href={`/accounts/${account.id}/dashboard`}
                  aria-label={`View archived account ${account.name}`}
                  className="absolute inset-0 z-10 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-slate-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070d19]"
                >
                  <span className="sr-only">View archived account {account.name}</span>
                </Link>

                <div className="pointer-events-none relative z-20 opacity-75 transition-opacity duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:duration-150">
                  <div className="flex items-start gap-3">
                    <IconTile
                      size="md"
                      interactive={false}
                      className="border-slate-800/40 text-slate-600 transition-colors duration-[260ms] group-hover:border-slate-700/60 group-hover:text-slate-400 group-focus-within:border-slate-700/60 group-focus-within:text-slate-400 motion-reduce:duration-150"
                    >
                      <Archive size={18} aria-hidden="true" />
                    </IconTile>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{account.type} · Archived</p>
                      <h2 className="mt-1 line-clamp-2 break-words text-base font-bold leading-snug text-slate-200">{account.name}</h2>
                      <p className="mt-1 text-xs text-slate-500">Role: {membership.role}</p>
                    </div>
                  </div>

                  <div className="my-4 border-t border-slate-900/60" />

                  <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
                    <div className="min-w-0"><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Balance</dt><dd className="mt-0.5 break-words text-sm font-semibold tabular-nums text-slate-400 [overflow-wrap:anywhere]">{formatCurrencyByLanguage(account.initialBalance, account.currency, language)}</dd></div>
                    <div className="min-w-0"><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">PnL</dt><dd className="mt-0.5 break-words text-sm font-semibold tabular-nums text-slate-400 [overflow-wrap:anywhere]">{formatCurrencyByLanguage(pnl, account.currency, language)}</dd></div>
                    <div className="min-w-0"><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Trades</dt><dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-400">{formatNumberByLanguage(account.trades.length, language)}</dd></div>
                    <div className="min-w-0"><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Last modified</dt><dd className="mt-0.5 break-words text-sm font-semibold text-slate-400">{new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(account.updatedAt)}</dd></div>
                  </dl>

                </div>

                {canRestore && (
                  <div className="pointer-events-auto relative z-30">
                    <form action={restoreAccount}>
                      <input type="hidden" name="accountId" value={account.id} />
                      <input type="hidden" name="redirectTo" value="/accounts/archived" />
                      <button type="submit" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 py-2.5 text-xs font-medium text-amber-400 outline-none transition-all hover:bg-amber-500/20 focus-visible:ring-2 focus-visible:ring-amber-400/60">
                        <RotateCcw aria-hidden="true" className="h-4 w-4 text-amber-400" />
                        Restore account
                      </button>
                    </form>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
