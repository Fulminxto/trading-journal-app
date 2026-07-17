"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createAccountWithState,
  type CreateAccountField,
} from "@/app/accounts/actions";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export type CreateAccountFormLabels = {
  accountName: string;
  accountType: string;
  initialBalance: string;
  currency: string;
  broker: string;
  phase: string;
  profitTarget: string;
  maxDrawdown: string;
  dailyDrawdown: string;
  required: string;
  optional: string;
  cancel: string;
  submit: string;
  pending: string;
};

function FieldError({ name, error }: { name: CreateAccountField; error?: string }) {
  if (!error) return null;
  return <span id={`${name}-error`} className="mt-2 block text-caption text-negative">{error}</span>;
}

export default function CreateAccountForm({
  labels,
  canCreatePersonalAccount,
  canCreateSharedAccount,
}: {
  labels: CreateAccountFormLabels;
  canCreatePersonalAccount: boolean;
  canCreateSharedAccount: boolean;
}) {
  const [state, formAction, isPending] = useActionState(createAccountWithState, null);
  const errors = state?.fieldErrors ?? {};
  const values = state?.values;
  const fieldProps = (name: CreateAccountField) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <Card variant="inner" className="p-6">
      <form action={formAction} noValidate className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {state?.error && (
          <p role="alert" className="rounded-inner border-[0.5px] border-negative/25 bg-negative/[0.06] px-4 py-3 text-sm text-negative md:col-span-2">
            {state.error}
          </p>
        )}

        <label className="block">
          <span className="text-micro uppercase tracking-label text-muted-faint">{labels.accountName} <span className="normal-case tracking-normal">({labels.required})</span></span>
          <Input name="name" defaultValue={values?.name ?? ""} maxLength={80} required disabled={isPending} className="mt-2" {...fieldProps("name")} />
          <FieldError name="name" error={errors.name} />
        </label>

        <label className="block">
          <span className="text-micro uppercase tracking-label text-muted-faint">{labels.accountType} <span className="normal-case tracking-normal">({labels.required})</span></span>
          <select name="type" defaultValue={values?.type || (canCreatePersonalAccount ? "LIVE" : "SHARED")} required disabled={isPending} className="mt-2 w-full rounded-inner border-[0.5px] border-white/[0.08] bg-surface-2 px-4 py-3 text-sm text-white outline-none transition-colors duration-base focus:border-accent-bright/50 disabled:opacity-50" {...fieldProps("type")}>
            {canCreatePersonalAccount && <><option value="LIVE">LIVE</option><option value="DEMO">DEMO</option><option value="PROP">PROP</option><option value="CHALLENGE">CHALLENGE</option><option value="FUNDED">FUNDED</option></>}
            {canCreateSharedAccount && <option value="SHARED">SHARED</option>}
          </select>
          <FieldError name="type" error={errors.type} />
        </label>

        <label className="block">
          <span className="text-micro uppercase tracking-label text-muted-faint">{labels.initialBalance} <span className="normal-case tracking-normal">({labels.required})</span></span>
          <Input name="initialBalance" type="number" defaultValue={values?.initialBalance ?? ""} required disabled={isPending} className="mt-2" {...fieldProps("initialBalance")} />
          <FieldError name="initialBalance" error={errors.initialBalance} />
        </label>

        <label className="block">
          <span className="text-micro uppercase tracking-label text-muted-faint">{labels.currency} <span className="normal-case tracking-normal">({labels.required})</span></span>
          <select name="currency" defaultValue={values?.currency || "USD"} required disabled={isPending} className="mt-2 w-full rounded-inner border-[0.5px] border-white/[0.08] bg-surface-2 px-4 py-3 text-sm text-white outline-none transition-colors duration-base focus:border-accent-bright/50 disabled:opacity-50" {...fieldProps("currency")}>
            <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="JPY">JPY</option>
          </select>
          <FieldError name="currency" error={errors.currency} />
        </label>

        {([
          ["broker", labels.broker, "text", undefined],
          ["phase", labels.phase, "text", undefined],
          ["profitTarget", labels.profitTarget, "number", "0.01"],
          ["maxDrawdown", labels.maxDrawdown, "number", "0.01"],
          ["dailyDrawdown", labels.dailyDrawdown, "number", "0.01"],
        ] as const).map(([name, label, type, step]) => (
          <label key={name} className="block">
            <span className="text-micro uppercase tracking-label text-muted-faint">{label} <span className="normal-case tracking-normal">({labels.optional})</span></span>
            <Input name={name} type={type} step={step} defaultValue={values?.[name] ?? ""} maxLength={type === "text" ? 80 : undefined} disabled={isPending} className="mt-2" {...fieldProps(name)} />
            <FieldError name={name} error={errors[name]} />
          </label>
        ))}

        <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row">
          <Link href="/accounts" className="inline-flex min-h-11 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.12] px-5 py-3 text-sm font-semibold text-muted outline-none hover:bg-white/[0.04] hover:text-flash focus-visible:ring-2 focus-visible:ring-accent-bright/60">
            {labels.cancel}
          </Link>
          <button type="submit" disabled={isPending} aria-disabled={isPending} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-5 py-3 text-sm font-semibold text-accent-bright outline-none transition-colors duration-fast hover:border-accent-bright/55 focus-visible:ring-2 focus-visible:ring-accent-bright/50 disabled:cursor-not-allowed disabled:opacity-60">
            {isPending ? labels.pending : labels.submit}
          </button>
        </div>
        <span className="sr-only" aria-live="polite">{isPending ? labels.pending : ""}</span>
      </form>
    </Card>
  );
}
