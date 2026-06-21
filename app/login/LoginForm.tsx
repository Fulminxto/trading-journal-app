"use client";

import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

import VoltisLightningLoader from "@/components/VoltisLightningLoader";

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
  otpPlaceholder: string;
  otpDescription: string;
  invalidOtp: string;
  otpSubmit: string;
  back: string;
};

const loginFormLabels: Record<AppLanguage, LoginFormLabels> = {
  it: {
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    showPassword: "Mostra password",
    hidePassword: "Nascondi password",
    invalidCredentials: "Username o password non corretti.",
    submit: "Accedi",
    otpPlaceholder: "Codice a 6 cifre",
    otpDescription: "Abbiamo inviato un codice alla tua email.",
    invalidOtp: "Codice non valido o scaduto.",
    otpSubmit: "Verifica",
    back: "← Indietro",
  },

  en: {
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    invalidCredentials: "Username or password is incorrect.",
    submit: "Login",
    otpPlaceholder: "6-digit code",
    otpDescription: "We sent a code to your email.",
    invalidOtp: "Invalid or expired code.",
    otpSubmit: "Verify",
    back: "← Back",
  },

  uk: {
    usernamePlaceholder: "Ім'я користувача",
    passwordPlaceholder: "Пароль",
    showPassword: "Показати пароль",
    hidePassword: "Сховати пароль",
    invalidCredentials: "Ім'я користувача або пароль неправильні.",
    submit: "Увійти",
    otpPlaceholder: "6-значний код",
    otpDescription: "Ми надіслали код на вашу пошту.",
    invalidOtp: "Невірний або прострочений код.",
    otpSubmit: "Підтвердити",
    back: "← Назад",
  },

  ru: {
    usernamePlaceholder: "Имя пользователя",
    passwordPlaceholder: "Пароль",
    showPassword: "Показать пароль",
    hidePassword: "Скрыть пароль",
    invalidCredentials: "Имя пользователя или пароль неверны.",
    submit: "Войти",
    otpPlaceholder: "6-значный код",
    otpDescription: "Мы отправили код на вашу почту.",
    invalidOtp: "Неверный или просроченный код.",
    otpSubmit: "Подтвердить",
    back: "← Назад",
  },

  es: {
    usernamePlaceholder: "Usuario",
    passwordPlaceholder: "Contraseña",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    invalidCredentials: "El usuario o la contraseña no son correctos.",
    submit: "Iniciar sesión",
    otpPlaceholder: "Código de 6 dígitos",
    otpDescription: "Hemos enviado un código a tu correo.",
    invalidOtp: "Código no válido o caducado.",
    otpSubmit: "Verificar",
    back: "← Atrás",
  },

  fr: {
    usernamePlaceholder: "Nom d'utilisateur",
    passwordPlaceholder: "Mot de passe",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    invalidCredentials: "Nom d'utilisateur ou mot de passe incorrect.",
    submit: "Connexion",
    otpPlaceholder: "Code à 6 chiffres",
    otpDescription: "Nous avons envoyé un code à votre adresse email.",
    invalidOtp: "Code invalide ou expiré.",
    otpSubmit: "Vérifier",
    back: "← Retour",
  },

  de: {
    usernamePlaceholder: "Benutzername",
    passwordPlaceholder: "Passwort",
    showPassword: "Passwort anzeigen",
    hidePassword: "Passwort ausblenden",
    invalidCredentials: "Benutzername oder Passwort ist falsch.",
    submit: "Anmelden",
    otpPlaceholder: "6-stelliger Code",
    otpDescription: "Wir haben einen Code an deine E-Mail gesendet.",
    invalidOtp: "Ungültiger oder abgelaufener Code.",
    otpSubmit: "Bestätigen",
    back: "← Zurück",
  },
};

export default function LoginForm({
  appLanguage,
}: {
  appLanguage?: string | null;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [preAuthToken, setPreAuthToken] = useState("");

  const language = normalizeAppLanguage(appLanguage);
  const t = loginFormLabels[language] ?? loginFormLabels.en;

  async function handleCredentialsSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await fetch("/api/auth/pre-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      setLoading(false);
      setError(t.invalidCredentials);
      return;
    }

    const data = (await res.json()) as {
      requires2FA: boolean;
      preAuthToken?: string;
    };

    if (!data.requires2FA) {
      // 2FA not enabled — complete login via NextAuth.
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: "/accounts",
      });

      if (result?.error) {
        setLoading(false);
        setError(t.invalidCredentials);
        return;
      }

      window.location.href = "/accounts";
      return;
    }

    // 2FA required — show OTP input.
    setPreAuthToken(data.preAuthToken ?? "");
    setStep("otp");
    setLoading(false);
  }

  async function handleOtpSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const otp = (formData.get("otp") as string).trim();

    const result = await signIn("credentials", {
      preAuthToken,
      otp,
      redirect: false,
      callbackUrl: "/accounts",
    });

    if (result?.error) {
      setLoading(false);
      setError(t.invalidOtp);
      return;
    }

    window.location.href = "/accounts";
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleOtpSubmit} className="space-y-4">
        <p className="text-center text-sm text-gray-400">
          {t.otpDescription}
        </p>

        <input
          name="otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder={t.otpPlaceholder}
          autoComplete="one-time-code"
          autoFocus
          required
          className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-center text-xl tracking-[0.5em] outline-none transition placeholder:text-gray-600 focus:border-accent/50 focus:bg-black/40"
        />

        {error && (
          <p className="rounded-2xl border border-red-500/10 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-2xl bg-accent p-4 font-bold text-black shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_18%,transparent)] transition hover:bg-accent-bright disabled:opacity-50"
        >
          {loading ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#060A1A]">
              <VoltisLightningLoader size={24} />
            </span>
          ) : (
            t.otpSubmit
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setStep("credentials");
            setPreAuthToken("");
            setError("");
          }}
          className="w-full text-center text-sm text-gray-500 transition hover:text-gray-300"
        >
          {t.back}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleCredentialsSubmit} className="space-y-4">
      <input
        name="username"
        placeholder={t.usernamePlaceholder}
        className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none transition placeholder:text-gray-600 focus:border-accent/50 focus:bg-black/40"
        required
      />

      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder={t.passwordPlaceholder}
          className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 pr-12 outline-none transition placeholder:text-gray-600 focus:border-accent/50 focus:bg-black/40"
          required
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? t.hidePassword : t.showPassword}
          title={showPassword ? t.hidePassword : t.showPassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-500/10 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-2xl bg-accent p-4 font-bold text-black shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_18%,transparent)] transition hover:bg-accent-bright disabled:opacity-50"
      >
        {loading ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#060A1A]">
            <VoltisLightningLoader size={24} />
          </span>
        ) : (
          t.submit
        )}
      </button>
    </form>
  );
}
