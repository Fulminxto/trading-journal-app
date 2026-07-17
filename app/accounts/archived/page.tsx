import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Archive, RotateCcw } from "lucide-react";

import { restoreAccount } from "@/app/accounts/actions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
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
        <p className="text-micro uppercase tracking-label text-accent-bright">Account archive</p>
        <div className="mb-2 mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="text-section text-flash">Archived accounts</h1>
          <Link
            href="/accounts"
            aria-label="Back to account library"
            className="group/back inline-flex h-8 w-fit shrink-0 translate-y-[1px] items-center gap-2 rounded-full border border-white/[0.05] bg-[#070d19]/80 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/25 hover:text-slate-200 hover:shadow-[0_0_15px_rgba(0,242,254,0.05)] focus-visible:border-cyan-400/30 focus-visible:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            <ArrowLeft size={14} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover/back:-translate-x-[3px] group-focus-visible/back:-translate-x-[3px] motion-reduce:transform-none motion-reduce:transition-none" />
            <span>Back to Library</span>
          </Link>
        </div>
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
                className="group relative rounded-2xl border border-white/[0.025] bg-[#070d19]/60 p-5 transition-[border-color,background-color,box-shadow] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-slate-600/35 hover:bg-[#070d19]/[0.82] hover:shadow-[0_10px_30px_-16px_rgba(255,255,255,0.07)] focus-within:border-slate-600/35 focus-within:bg-[#070d19]/[0.82] focus-within:shadow-[0_10px_30px_-16px_rgba(255,255,255,0.07)] motion-reduce:duration-150"
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
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{account.type} · Archived</p>
                      <h2 className="mt-1 line-clamp-2 break-words text-base font-bold leading-snug text-slate-200">{account.name}</h2>
                      <p className="mt-1 text-xs text-slate-500">Role: {membership.role}</p>
                    </div>
                  </div>

                  <div className="my-4 border-t border-slate-900/60" />

                  <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
                    <div className="min-w-0"><dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Balance</dt><dd className="mt-0.5 break-words text-sm font-semibold tabular-nums text-slate-400 [overflow-wrap:anywhere]">{formatCurrencyByLanguage(account.initialBalance, account.currency, language)}</dd></div>
                    <div className="min-w-0"><dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">PnL</dt><dd className="mt-0.5 break-words text-sm font-semibold tabular-nums text-slate-400 [overflow-wrap:anywhere]">{formatCurrencyByLanguage(pnl, account.currency, language)}</dd></div>
                    <div className="min-w-0"><dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Trades</dt><dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-400">{formatNumberByLanguage(account.trades.length, language)}</dd></div>
                    <div className="min-w-0"><dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Last modified</dt><dd className="mt-0.5 break-words text-sm font-semibold text-slate-400">{new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(account.updatedAt)}</dd></div>
                  </dl>

                  <p className="mt-5 inline-flex items-center text-xs font-semibold text-slate-300">
                    View archived account
                  </p>
                </div>

                {canRestore && (
                  <div className="pointer-events-auto relative z-30 mt-5">
                    <form action={restoreAccount}>
                      <input type="hidden" name="accountId" value={account.id} />
                      <input type="hidden" name="redirectTo" value="/accounts/archived" />
                      <button type="submit" className="group/restore inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-800/50 bg-slate-950/40 px-4 py-2.5 text-xs font-semibold text-slate-300/85 outline-none transition-all duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-slate-700/70 hover:bg-slate-900/75 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-slate-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070d19] motion-reduce:duration-150">
                        <RotateCcw size={15} aria-hidden="true" className="transition-transform duration-300 group-hover/restore:rotate-12 group-focus-visible/restore:rotate-12 motion-reduce:transform-none motion-reduce:transition-none" />
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
