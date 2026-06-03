"use client";

import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type LoginFormLabels = {
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  showPassword: string;
  hidePassword: string;
  invalidCredentials: string;
  submit: string;
};

const loginFormLabels: Record<
  AppLanguage,
  LoginFormLabels
> = {
  it: {
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    showPassword: "Mostra password",
    hidePassword: "Nascondi password",
    invalidCredentials:
      "Username o password non corretti.",
    submit: "Accedi",
  },

  en: {
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    invalidCredentials:
      "Username or password is incorrect.",
    submit: "Login",
  },

  uk: {
    usernamePlaceholder: "Ім’я користувача",
    passwordPlaceholder: "Пароль",
    showPassword: "Показати пароль",
    hidePassword: "Сховати пароль",
    invalidCredentials:
      "Ім’я користувача або пароль неправильні.",
    submit: "Увійти",
  },

  ru: {
    usernamePlaceholder: "Имя пользователя",
    passwordPlaceholder: "Пароль",
    showPassword: "Показать пароль",
    hidePassword: "Скрыть пароль",
    invalidCredentials:
      "Имя пользователя или пароль неверны.",
    submit: "Войти",
  },

  es: {
    usernamePlaceholder: "Usuario",
    passwordPlaceholder: "Contraseña",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    invalidCredentials:
      "El usuario o la contraseña no son correctos.",
    submit: "Iniciar sesión",
  },

  fr: {
    usernamePlaceholder: "Nom d’utilisateur",
    passwordPlaceholder: "Mot de passe",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    invalidCredentials:
      "Nom d’utilisateur ou mot de passe incorrect.",
    submit: "Connexion",
  },

  de: {
    usernamePlaceholder: "Benutzername",
    passwordPlaceholder: "Passwort",
    showPassword: "Passwort anzeigen",
    hidePassword: "Passwort ausblenden",
    invalidCredentials:
      "Benutzername oder Passwort ist falsch.",
    submit: "Anmelden",
  },
};

export default function LoginForm({
  appLanguage,
}: {
  appLanguage?: string | null;
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const language =
    normalizeAppLanguage(appLanguage);

  const t =
    loginFormLabels[language] ??
    loginFormLabels.en;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    const formData = new FormData(
      event.currentTarget
    );

    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: "/accounts",
    });

    if (result?.error) {
      setError(t.invalidCredentials);
      return;
    }

    window.location.href = "/accounts";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        name="username"
        placeholder={t.usernamePlaceholder}
        className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none transition placeholder:text-gray-600 focus:border-green-500/50 focus:bg-black/40"
        required
      />

      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder={t.passwordPlaceholder}
          className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 pr-12 outline-none transition placeholder:text-gray-600 focus:border-green-500/50 focus:bg-black/40"
          required
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          aria-label={
            showPassword
              ? t.hidePassword
              : t.showPassword
          }
          title={
            showPassword
              ? t.hidePassword
              : t.showPassword
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-500/10 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-2xl bg-green-500 p-4 font-bold text-black shadow-[0_0_30px_rgba(34,197,94,0.18)] transition hover:bg-green-400"
      >
        {t.submit}
      </button>
    </form>
  );
}