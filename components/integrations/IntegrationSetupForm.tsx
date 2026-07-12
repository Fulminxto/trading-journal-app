"use client";

import { useActionState, useState, type FormEvent } from "react";
import { Cable, Save, UploadCloud } from "lucide-react";

import type { IntegrationSetupState } from "@/app/accounts/[accountId]/integrations/actions";

type IntegrationMode = "manual" | "mt5" | "broker" | "hybrid";
type FieldName =
  | "mt5AccountLogin"
  | "mt5ServerName"
  | "brokerProvider"
  | "brokerAccountId";

type DraftValues = Record<FieldName, string>;

const modeLabels: Record<IntegrationMode, string> = {
  manual: "Manual only",
  mt5: "MT5 connector",
  broker: "Broker integration",
  hybrid: "MT5 + Broker",
};

const submitLabels: Record<IntegrationMode, string> = {
  manual: "Save manual setup",
  mt5: "Save MT5 setup",
  broker: "Save broker setup",
  hybrid: "Save hybrid setup",
};

function SetupField({
  name,
  label,
  value,
  placeholder,
  maxLength,
  error,
  describedBy,
  onChange,
  disabled,
}: {
  name: FieldName;
  label: string;
  value: string;
  placeholder: string;
  maxLength: number;
  error?: string;
  describedBy: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="block">
      <span className="text-micro uppercase tracking-label text-muted-faint">
        {label}
      </span>
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
        disabled={disabled}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${describedBy} ${errorId}` : describedBy}
        className="mt-2 w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10 disabled:opacity-60"
      />
      {error && (
        <span id={errorId} className="mt-2 block text-caption text-negative">
          {error}
        </span>
      )}
    </label>
  );
}

export default function IntegrationSetupForm({
  action,
  initialMode,
  initialValues,
}: {
  action: (
    previousState: IntegrationSetupState | null,
    formData: FormData
  ) => Promise<IntegrationSetupState>;
  initialMode: IntegrationMode;
  initialValues: DraftValues;
}) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [mode, setMode] = useState<IntegrationMode>(initialMode);
  const [values, setValues] = useState<DraftValues>(initialValues);
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<FieldName, string>>
  >({});

  const needsMt5 = mode === "mt5" || mode === "hybrid";
  const needsBroker = mode === "broker" || mode === "hybrid";
  const errors = { ...state?.fieldErrors, ...clientErrors };

  function updateValue(name: FieldName, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setClientErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const nextErrors: Partial<Record<FieldName, string>> = {};

    if (needsMt5 && !values.mt5AccountLogin.trim()) {
      nextErrors.mt5AccountLogin = "Enter the MT5 account login.";
    }
    if (needsMt5 && !values.mt5ServerName.trim()) {
      nextErrors.mt5ServerName = "Enter the MT5 server name.";
    }
    if (needsBroker && !values.brokerProvider.trim()) {
      nextErrors.brokerProvider = "Enter the broker provider.";
    }
    if (needsBroker && !values.brokerAccountId.trim()) {
      nextErrors.brokerAccountId = "Enter the broker account ID.";
    }

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
      setClientErrors(nextErrors);
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="mt-6 space-y-6"
    >
      <label className="block">
        <span className="text-micro uppercase tracking-label text-muted-faint">
          Integration mode
        </span>
        <select
          name="integrationMode"
          value={mode}
          onChange={(event) => {
            setMode(event.target.value as IntegrationMode);
            setClientErrors({});
          }}
          disabled={isPending}
          className="mt-2 w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10 disabled:opacity-60"
        >
          {(Object.keys(modeLabels) as IntegrationMode[]).map((value) => (
            <option key={value} value={value}>
              {modeLabels[value]}
            </option>
          ))}
        </select>
      </label>

      {needsMt5 && (
        <fieldset className="space-y-4 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
          <legend className="sr-only">MT5 identifiers</legend>
          <div className="flex items-start gap-3" id="mt5-security-note">
            <Cable size={18} className="mt-0.5 text-muted" aria-hidden="true" />
            <div>
              <p className="text-body font-medium text-flash">MT5 identifiers</p>
              <p className="mt-1 text-caption text-muted">
                Store login and server names only. Do not enter passwords,
                investor passwords, tokens or VPS secrets.
              </p>
            </div>
          </div>
          <SetupField
            name="mt5AccountLogin"
            label="MT5 account login"
            value={values.mt5AccountLogin}
            placeholder="Example: 12345678"
            maxLength={80}
            error={errors.mt5AccountLogin}
            describedBy="mt5-security-note"
            onChange={(value) => updateValue("mt5AccountLogin", value)}
            disabled={isPending}
          />
          <SetupField
            name="mt5ServerName"
            label="MT5 server name"
            value={values.mt5ServerName}
            placeholder="Example: Broker-Live"
            maxLength={120}
            error={errors.mt5ServerName}
            describedBy="mt5-security-note"
            onChange={(value) => updateValue("mt5ServerName", value)}
            disabled={isPending}
          />
        </fieldset>
      )}

      {needsBroker && (
        <fieldset className="space-y-4 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
          <legend className="sr-only">Broker identifiers</legend>
          <div className="flex items-start gap-3" id="broker-security-note">
            <UploadCloud size={18} className="mt-0.5 text-muted" aria-hidden="true" />
            <div>
              <p className="text-body font-medium text-flash">Broker identifiers</p>
              <p className="mt-1 text-caption text-muted">
                Store only the provider and non-sensitive account identifier.
                API keys and access tokens are never entered here.
              </p>
            </div>
          </div>
          <SetupField
            name="brokerProvider"
            label="Broker provider"
            value={values.brokerProvider}
            placeholder="Example: Broker name"
            maxLength={120}
            error={errors.brokerProvider}
            describedBy="broker-security-note"
            onChange={(value) => updateValue("brokerProvider", value)}
            disabled={isPending}
          />
          <SetupField
            name="brokerAccountId"
            label="Broker account ID"
            value={values.brokerAccountId}
            placeholder="External account identifier"
            maxLength={120}
            error={errors.brokerAccountId}
            describedBy="broker-security-note"
            onChange={(value) => updateValue("brokerAccountId", value)}
            disabled={isPending}
          />
        </fieldset>
      )}

      {mode === "manual" && (
        <div className="rounded-inner border-[0.5px] border-dashed border-flash/[0.12] bg-surface-2 p-5">
          <p className="text-body font-medium text-flash">Manual mode selected</p>
          <p className="mt-2 text-caption text-muted">
            Trades remain entered and managed through the Trading Diary. No
            external identifiers are required.
          </p>
        </div>
      )}

      {state?.error && !state.fieldErrors && (
        <p role="alert" className="text-caption text-negative">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-caption leading-5 text-muted">
          Saving updates setup metadata only. A successful import is recorded separately.
        </p>
        <button
          type="submit"
          disabled={isPending}
          aria-disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-5 py-3 text-sm font-semibold text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} aria-hidden="true" />
          {isPending ? "Saving setup…" : submitLabels[mode]}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {isPending ? "Saving integration setup" : ""}
      </span>
    </form>
  );
}
