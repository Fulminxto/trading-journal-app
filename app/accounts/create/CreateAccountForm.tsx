"use client";

import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import {
  type KeyboardEvent,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

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

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($) - US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR (€) - Euro" },
  { code: "GBP", symbol: "£", label: "GBP (£) - British Pound" },
  { code: "JPY", symbol: "¥", label: "JPY (¥) - Japanese Yen" },
  { code: "CAD", symbol: "C$", label: "CAD (C$) - Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "AUD (A$) - Australian Dollar" },
  { code: "CHF", symbol: "CHF", label: "CHF - Swiss Franc" },
  { code: "USDT", symbol: "₮", label: "USDT (₮) - Tether" },
  { code: "USDC", symbol: "$", label: "USDC - USD Coin" },
] as const;

function FieldError({ name, error }: { name: CreateAccountField; error?: string }) {
  if (!error) return null;
  return <span id={`${name}-error`} className="mt-2 block text-caption text-negative">{error}</span>;
}

type SelectOption = {
  label: string;
  value: string;
};

function VoltisSelect({
  name,
  defaultValue,
  options,
  disabled,
  ariaInvalid,
  ariaDescribedBy,
  menuClassName = "",
}: {
  name: string;
  defaultValue: string;
  options: SelectOption[];
  disabled: boolean;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  menuClassName?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((option) => option.value === defaultValue))
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, open]);

  const openAt = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const selectOption = (option: SelectOption) => {
    setValue(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
      openAt(event.key === "ArrowDown" ? selectedIndex : Math.max(0, selectedIndex - 1));
    }
  };

  const handleListboxKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
      if (event.key === "Escape") {
        event.preventDefault();
        triggerRef.current?.focus();
      }
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      if (event.key === "Home") setActiveIndex(0);
      else if (event.key === "End") setActiveIndex(options.length - 1);
      else {
        const direction = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((current) => (current + direction + options.length) % options.length);
      }
    }
  };

  return (
    <div ref={rootRef} className="relative mt-2">
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        onClick={() => {
          if (open) setOpen(false);
          else openAt(Math.max(0, options.findIndex((option) => option.value === value)));
        }}
        onKeyDown={handleTriggerKeyDown}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-all hover:border-white/15 hover:bg-white/[0.045] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selectedOption ? "text-white" : "text-slate-500"}>
          {selectedOption?.label ?? ""}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={name}
          onKeyDown={handleListboxKeyDown}
          className={`absolute left-0 top-full z-[100] mt-2 w-full rounded-xl border border-white/10 bg-[#090f1e]/95 p-1.5 shadow-2xl backdrop-blur-xl ${menuClassName}`}
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="option"
                aria-selected={selected}
                tabIndex={activeIndex === index ? 0 : -1}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm outline-none transition-all hover:bg-white/[0.08] hover:text-white focus-visible:bg-white/[0.08] focus-visible:text-white ${
                  selected ? "bg-cyan-500/10 font-medium text-cyan-400" : "text-slate-300"
                }`}
              >
                <span>{option.label}</span>
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {selected && <Check className="h-4 w-4 text-cyan-400" aria-hidden="true" />}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CreateAccountForm({
  labels,
  canCreatePersonalAccount,
  canCreateSharedAccount,
  accountId,
  initialValues,
  correctionMode = false,
  cancelHref = "/accounts",
  usePremiumSelectionUi = false,
}: {
  labels: CreateAccountFormLabels;
  canCreatePersonalAccount: boolean;
  canCreateSharedAccount: boolean;
  accountId?: string;
  initialValues?: CreateAccountValues;
  correctionMode?: boolean;
  cancelHref?: string;
  usePremiumSelectionUi?: boolean;
}) {
  const action = accountId ? updateAccountInformationWithState : createAccountWithState;
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = state?.fieldErrors ?? {};
  const values = state?.values ?? initialValues;
  const fieldProps = (name: CreateAccountField) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const accountTypeOptions = [
    ...(canCreatePersonalAccount
      ? ["LIVE", "DEMO", "PROP", "CHALLENGE", "FUNDED"].map((value) => ({ label: value, value }))
      : []),
    ...(canCreateSharedAccount ? [{ label: "SHARED", value: "SHARED" }] : []),
  ];
  return (
    <Card
      variant="inner"
      className={
        usePremiumSelectionUi
          ? "mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#090f1e]/60 p-5 shadow-2xl backdrop-blur-xl sm:p-6 md:p-8"
          : "p-6"
      }
    >
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

        {usePremiumSelectionUi ? (
          <div className="block">
            <span className="text-micro uppercase tracking-label text-slate-300">{labels.accountType} <span className="normal-case tracking-normal text-slate-500">({labels.required})</span></span>
            <VoltisSelect
              name="type"
              defaultValue={values?.type || (canCreatePersonalAccount ? "LIVE" : "SHARED")}
              options={accountTypeOptions}
              disabled={isPending}
              ariaInvalid={Boolean(errors.type)}
              ariaDescribedBy={errors.type ? "type-error" : undefined}
            />
            <FieldError name="type" error={errors.type} />
          </div>
        ) : (
          <label className="block">
            <span className="text-micro uppercase tracking-label text-slate-300">{labels.accountType} <span className="normal-case tracking-normal text-slate-500">({labels.required})</span></span>
            <select name="type" defaultValue={values?.type || (canCreatePersonalAccount ? "LIVE" : "SHARED")} required disabled={isPending} className="mt-2 w-full bg-[#070d19]/60 border border-white/[0.06] rounded-xl text-sm text-slate-200 placeholder-slate-500 px-4 py-2.5 focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all disabled:opacity-50" {...fieldProps("type")}>
              {canCreatePersonalAccount && <><option value="LIVE">LIVE</option><option value="DEMO">DEMO</option><option value="PROP">PROP</option><option value="CHALLENGE">CHALLENGE</option><option value="FUNDED">FUNDED</option></>}
              {canCreateSharedAccount && <option value="SHARED">SHARED</option>}
            </select>
            <FieldError name="type" error={errors.type} />
          </label>
        )}

        <label className="block">
          <span className="text-micro uppercase tracking-label text-slate-300">{labels.initialBalance} <span className="normal-case tracking-normal text-slate-500">({labels.required})</span></span>
          <Input name="initialBalance" type="number" defaultValue={values?.initialBalance ?? ""} required disabled={isPending} className="mt-2 bg-[#070d19]/60 border border-white/[0.06] rounded-xl text-sm text-slate-200 placeholder-slate-500 px-4 py-2.5 focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all" {...fieldProps("initialBalance")} />
          <FieldError name="initialBalance" error={errors.initialBalance} />
        </label>

        {usePremiumSelectionUi ? (
          <div className="block">
            <span className="text-micro uppercase tracking-label text-slate-300">{labels.currency} <span className="normal-case tracking-normal text-slate-500">({labels.required})</span></span>
            <VoltisSelect
              name="currency"
              defaultValue={values?.currency || "USD"}
              options={CURRENCIES.map((currency) => ({
                label: currency.label,
                value: currency.code,
              }))}
              menuClassName="app-scrollbar max-h-56 overflow-y-auto"
              disabled={isPending}
              ariaInvalid={Boolean(errors.currency)}
              ariaDescribedBy={errors.currency ? "currency-error" : undefined}
            />
            <FieldError name="currency" error={errors.currency} />
          </div>
        ) : (
          <label className="block">
            <span className="text-micro uppercase tracking-label text-slate-300">{labels.currency} <span className="normal-case tracking-normal text-slate-500">({labels.required})</span></span>
            <select name="currency" defaultValue={values?.currency || "USD"} required disabled={isPending} className="mt-2 w-full bg-[#070d19]/60 border border-white/[0.06] rounded-xl text-sm text-slate-200 placeholder-slate-500 px-4 py-2.5 focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all disabled:opacity-50" {...fieldProps("currency")}>
              <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="JPY">JPY</option>
            </select>
            <FieldError name="currency" error={errors.currency} />
          </label>
        )}

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

        <div className="mt-6 flex flex-wrap items-center justify-end gap-4 md:col-span-2 max-sm:flex-col-reverse max-sm:items-stretch">
          <Link href={cancelHref} className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-slate-300 outline-none transition-all hover:bg-white/[0.08] hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-500/40 max-sm:min-h-11">
            {labels.cancel}
          </Link>
          <button type="submit" disabled={isPending} aria-disabled={isPending} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/10 outline-none transition-all hover:opacity-95 hover:shadow-cyan-500/25 focus-visible:ring-2 focus-visible:ring-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-cyan-500/10 max-sm:w-full max-sm:justify-center">
            {isPending ? labels.pending : labels.submit}
          </button>
        </div>
        <span className="sr-only" aria-live="polite">{isPending ? labels.pending : ""}</span>
      </form>
    </Card>
  );
}
