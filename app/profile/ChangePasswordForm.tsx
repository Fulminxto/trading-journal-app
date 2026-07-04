"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { changePassword } from "./actions";

type ChangePasswordLabels = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  submit: string;
  show: string;
  hide: string;
};

const baseLabels: ChangePasswordLabels = {
  currentPassword: "Current password",
  newPassword: "New password",
  confirmPassword: "Confirm new password",
  submit: "Update password",
  show: "Show password",
  hide: "Hide password",
};

const labels: Record<AppLanguage, ChangePasswordLabels> = {
  it: baseLabels,
  en: baseLabels,
  uk: baseLabels,
  ru: baseLabels,
  es: baseLabels,
  fr: baseLabels,
  de: baseLabels,
};

function PasswordField({
  name,
  label,
  type = "password",
  children,
}: {
  name: string;
  label: string;
  type?: string;
  children?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-micro uppercase tracking-label text-muted-faint">
        {label}
      </span>
      <div className="relative mt-2">
        <input
          name={name}
          type={type}
          required
          className="w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 pr-12 text-sm text-flash outline-none transition-all duration-base focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10"
        />
        {children}
      </div>
    </label>
  );
}

export default function ChangePasswordForm({
  appLanguage,
}: {
  appLanguage?: string | null;
}) {
  const [showNew, setShowNew] = useState(false);
  const lang = normalizeAppLanguage(appLanguage);
  const t = labels[lang] ?? labels.en;

  return (
    <form action={changePassword} className="space-y-4">
      <PasswordField name="currentPassword" label={t.currentPassword} />

      <PasswordField
        name="newPassword"
        label={t.newPassword}
        type={showNew ? "text" : "password"}
      >
        <button
          type="button"
          onClick={() => setShowNew(!showNew)}
          aria-label={showNew ? t.hide : t.show}
          title={showNew ? t.hide : t.show}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors duration-fast hover:text-accent-bright"
        >
          {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </PasswordField>

      <PasswordField name="confirmPassword" label={t.confirmPassword} />

      <button
        type="submit"
        className="w-full rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-5 py-3 text-sm font-semibold text-accent-bright transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55"
      >
        {t.submit}
      </button>
    </form>
  );
}
