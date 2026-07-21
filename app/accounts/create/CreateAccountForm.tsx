"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createAccountWithState,
  updateAccountInformationWithState,
  type CreateAccountField,
  type CreateAccountValues,
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
  accountId,
  initialValues,
  correctionMode = false,
  cancelHref = "/accounts",
}: {
  labels: CreateAccountFormLabels;
  canCreatePersonalAccount: boolean;
  canCreateSharedAccount: boolean;
  accountId?: string;
  initialValues?: CreateAccountValues;
  correctionMode?: boolean;
  cancelHref?: string;
}) {
  const action = accountId ? updateAccountInformationWithState : createAccountWithState;
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = state?.fieldErrors ?? {};
  const values = state?.values ?? initialValues;
  const fieldProps = (name: CreateAccountField) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <Card variant="inner" className="p-6">
      <form action={formAction} noValidate className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {accountId && <input type="hidden" name="accountId" value={accountId} />}
        {correctionMode && <input type="hidden" name="correctionMode" value="1" />}
        {correctionMode && (
          <p className="rounded-inner border-[0.5px] border-warning/25 bg-warning/[0.06] px-4 py-3 text-sm text-warning md:col-span-2">
            This account is archived. Changes to account parameters may affect how historical performance is interpreted.
          </p>
        )}
        {state?.error && (
          <p role="alert" className="rounded-inner border-[0.5px] border-negative/25 bg-negative/[0.06] px-4 py-3 text-sm text-negative md:col-span-2">
            {state.error}
          </p>
        )}

        <label className="block">
          <span className="text-micro uppercase tracking-label text-slate-300">{labels.accountName} <span className="normal-case tracking-normal text-slate-500">({labels.required})</span></span>
          <Input name="name" defaultValue={values?.name ?? ""} maxLength={80} required disabled={isPending} className="mt-2 bg-[#070d19]/60 border border-white/[0.06] rounded-xl text-sm text-slate-200 placeholder-slate-500 px-4 py-2.5 focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all" {...fieldProps("name")} />
          <FieldError name="name" error={errors.name} />
        </label>

        <label className="block">
          <span className="text-micro uppercase tracking-label text-slate-300">{labels.accountType} <span className="normal-case tracking-normal text-slate-500">({labels.required})</span></span>
          <select name="type" defaultValue={values?.type || (canCreatePersonalAccount ? "LIVE" : "SHARED")} required disabled={isPending} className="mt-2 w-full bg-[#070d19]/60 border border-white/[0.06] rounded-xl text-sm text-slate-200 placeholder-slate-500 px-4 py-2.5 focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all disabled:opacity-50" {...fieldProps("type")}>
            {canCreatePersonalAccount && <><option value="LIVE">LIVE</option><option value="DEMO">DEMO</option><option value="PROP">PROP</option><option value="CHALLENGE">CHALLENGE</option><option value="FUNDED">FUNDED</option></>}
            {canCreateSharedAccount && <option value="SHARED">SHARED</option>}
          </select>
          <FieldError name="type" error={errors.type} />
        </label>

        <label className="block">
          <span className="text-micro uppercase tracking-label text-slate-300">{labels.initialBalance} <span className="normal-case tracking-normal text-slate-500">({labels.required})</span></span>
          <Input name="initialBalance" type="number" defaultValue={values?.initialBalance ?? ""} required disabled={isPending} className="mt-2 bg-[#070d19]/60 border border-white/[0.06] rounded-xl text-sm text-slate-200 placeholder-slate-500 px-4 py-2.5 focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all" {...fieldProps("initialBalance")} />
          <FieldError name="initialBalance" error={errors.initialBalance} />
        </label>

        <label className="block">
          <span className="text-micro uppercase tracking-label text-slate-300">{labels.currency} <span className="normal-case tracking-normal text-slate-500">({labels.required})</span></span>
          <select name="currency" defaultValue={values?.currency || "USD"} required disabled={isPending} className="mt-2 w-full bg-[#070d19]/60 border border-white/[0.06] rounded-xl text-sm text-slate-200 placeholder-slate-500 px-4 py-2.5 focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all disabled:opacity-50" {...fieldProps("currency")}>
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
            <span className="text-micro uppercase tracking-label text-slate-300">{label} <span className="normal-case tracking-normal text-slate-500">({labels.optional})</span></span>
            <Input name={name} type={type} step={step} defaultValue={values?.[name] ?? ""} maxLength={type === "text" ? 80 : undefined} disabled={isPending} className="mt-2 bg-[#070d19]/60 border border-white/[0.06] rounded-xl text-sm text-slate-200 placeholder-slate-500 px-4 py-2.5 focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all" {...fieldProps(name)} />
            <FieldError name={name} error={errors[name]} />
          </label>
        ))}

        <div className="flex flex-wrap justify-end items-center gap-4 mt-6 md:col-span-2 max-sm:flex-col-reverse max-sm:items-stretch">
          <Link href={cancelHref} className="text-sm text-slate-400 hover:text-slate-200 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 max-sm:inline-flex max-sm:min-h-11 max-sm:items-center max-sm:justify-center">
            {labels.cancel}
          </Link>
          <button type="submit" disabled={isPending} aria-disabled={isPending} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-60 max-sm:w-full">
            {isPending ? labels.pending : labels.submit}
          </button>
        </div>
        <span className="sr-only" aria-live="polite">{isPending ? labels.pending : ""}</span>
      </form>
    </Card>
  );
}
