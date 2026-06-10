"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { changePassword } from "./actions";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type ChangePasswordLabels = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  submit: string;
  show: string;
  hide: string;
};

const labels: Record<AppLanguage, ChangePasswordLabels> = {
  it: {
    currentPassword: "Password attuale",
    newPassword: "Nuova password",
    confirmPassword: "Conferma nuova password",
    submit: "Aggiorna password",
    show: "Mostra password",
    hide: "Nascondi password",
  },
  en: {
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    submit: "Update password",
    show: "Show password",
    hide: "Hide password",
  },
  uk: {
    currentPassword: "Поточний пароль",
    newPassword: "Новий пароль",
    confirmPassword: "Підтвердіть новий пароль",
    submit: "Оновити пароль",
    show: "Показати пароль",
    hide: "Сховати пароль",
  },
  ru: {
    currentPassword: "Текущий пароль",
    newPassword: "Новый пароль",
    confirmPassword: "Подтвердите новый пароль",
    submit: "Обновить пароль",
    show: "Показать пароль",
    hide: "Скрыть пароль",
  },
  es: {
    currentPassword: "Contraseña actual",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar nueva contraseña",
    submit: "Actualizar contraseña",
    show: "Mostrar contraseña",
    hide: "Ocultar contraseña",
  },
  fr: {
    currentPassword: "Mot de passe actuel",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le nouveau mot de passe",
    submit: "Mettre à jour le mot de passe",
    show: "Afficher le mot de passe",
    hide: "Masquer le mot de passe",
  },
  de: {
    currentPassword: "Aktuelles Passwort",
    newPassword: "Neues Passwort",
    confirmPassword: "Neues Passwort bestätigen",
    submit: "Passwort aktualisieren",
    show: "Passwort anzeigen",
    hide: "Passwort ausblenden",
  },
};

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
      <div>
        <p className="mb-2 text-sm text-gray-400">
          {t.currentPassword}
        </p>

        <input
          name="currentPassword"
          type="password"
          required
          className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
        />
      </div>

      <div>
        <p className="mb-2 text-sm text-gray-400">
          {t.newPassword}
        </p>

        <div className="relative">
          <input
            name="newPassword"
            type={showNew ? "text" : "password"}
            required
            className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 pr-12 outline-none focus:border-green-500/40"
          />

          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            aria-label={showNew ? t.hide : t.show}
            title={showNew ? t.hide : t.show}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
          >
            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-gray-400">
          {t.confirmPassword}
        </p>

        <input
          name="confirmPassword"
          type="password"
          required
          className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-green-500 p-4 font-bold text-black transition hover:bg-green-400"
      >
        {t.submit}
      </button>
    </form>
  );
}
