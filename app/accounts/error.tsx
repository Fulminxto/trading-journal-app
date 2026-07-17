"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import Card from "@/components/ui/Card";

export function retryAccounts(reset: () => void) {
  reset();
}

export default function AccountsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Card variant="hero" className="mx-auto max-w-3xl p-8 sm:p-10">
      <div role="alert" aria-live="assertive">
        <AlertTriangle size={24} aria-hidden="true" className="text-warning" />
        <p className="mt-5 text-micro uppercase tracking-label text-warning">Account Library</p>
        <h1 className="mt-2 text-section text-flash">Accounts could not be loaded</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">Something went wrong while loading your accounts. Try again.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={() => retryAccounts(reset)} className="inline-flex min-h-11 items-center justify-center rounded-inner bg-accent px-4 py-3 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60">Try again</button>
          <Link href="/accounts" className="inline-flex min-h-11 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.14] px-4 py-3 text-sm font-medium text-muted outline-none hover:text-flash focus-visible:ring-2 focus-visible:ring-accent-bright/60">Back to account library</Link>
        </div>
      </div>
    </Card>
  );
}
