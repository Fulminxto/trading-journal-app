import { headers } from "next/headers";
import { ShieldAlert } from "lucide-react";

import GlobalToast from "@/components/GlobalToast";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

import { submitAccountReview } from "./actions";

type AccountReviewLabels = {
  eyebrow: string;
  title: string;
  description: string;
  usernamePlaceholder: string;
  messagePlaceholder: string;
  submit: string;
};

const labels: Record<AppLanguage, AccountReviewLabels> = {
  it: {
    eyebrow: "Revisione account",
    title: "Richiedi assistenza",
    description:
      "Usa questo modulo solo se il tuo account è stato sospeso e vuoi richiedere una revisione.",
    usernamePlaceholder: "Il tuo username",
    messagePlaceholder:
      "Spiega il problema o il motivo della richiesta...",
    submit: "Invia richiesta",
  },
  en: {
    eyebrow: "Account Review",
    title: "Request support",
    description:
      "Use this form only if your account has been suspended and you want to request a review.",
    usernamePlaceholder: "Your username",
    messagePlaceholder:
      "Explain the issue or the reason for your request...",
    submit: "Submit request",
  },
  uk: {
    eyebrow: "Перевірка акаунта",
    title: "Запросити підтримку",
    description:
      "Використовуй цю форму лише якщо твій акаунт було призупинено і ти хочеш запросити перевірку.",
    usernamePlaceholder: "Твій username",
    messagePlaceholder:
      "Поясни проблему або причину запиту...",
    submit: "Надіслати запит",
  },
  ru: {
    eyebrow: "Проверка аккаунта",
    title: "Запросить поддержку",
    description:
      "Используй эту форму только если твой аккаунт был приостановлен и ты хочешь запросить проверку.",
    usernamePlaceholder: "Твой username",
    messagePlaceholder:
      "Объясни проблему или причину запроса...",
    submit: "Отправить запрос",
  },
  es: {
    eyebrow: "Revisión de cuenta",
    title: "Solicitar asistencia",
    description:
      "Usa este formulario solo si tu cuenta fue suspendida y quieres solicitar una revisión.",
    usernamePlaceholder: "Tu username",
    messagePlaceholder:
      "Explica el problema o el motivo de la solicitud...",
    submit: "Enviar solicitud",
  },
  fr: {
    eyebrow: "Révision du compte",
    title: "Demander assistance",
    description:
      "Utilise ce formulaire uniquement si ton compte a été suspendu et que tu veux demander une révision.",
    usernamePlaceholder: "Ton username",
    messagePlaceholder:
      "Explique le problème ou la raison de la demande...",
    submit: "Envoyer la demande",
  },
  de: {
    eyebrow: "Account-Überprüfung",
    title: "Support anfordern",
    description:
      "Nutze dieses Formular nur, wenn dein Account gesperrt wurde und du eine Überprüfung anfordern möchtest.",
    usernamePlaceholder: "Dein Username",
    messagePlaceholder:
      "Erkläre das Problem oder den Grund deiner Anfrage...",
    submit: "Anfrage senden",
  },
};

function getLanguageFromHeader(
  acceptLanguage: string | null
) {
  const value = acceptLanguage?.toLowerCase() || "";

  if (value.startsWith("it")) return "it";
  if (value.startsWith("uk")) return "uk";
  if (value.startsWith("ru")) return "ru";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("fr")) return "fr";
  if (value.startsWith("de")) return "de";

  return "en";
}

export default async function AccountReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string }>;
}) {
  const query = await searchParams;

  const requestHeaders = await headers();

  const language = normalizeAppLanguage(
    getLanguageFromHeader(
      requestHeaders.get("accept-language")
    )
  );

  const t = labels[language];

  return (
    <>
      <GlobalToast status={query.toast} />

      <div className="flex min-h-screen items-center justify-center bg-[#0C1430] p-8 text-white">
        <form
          action={submitAccountReview}
          className="w-full max-w-2xl rounded-[40px] border border-yellow-500/20 bg-yellow-500/10 p-10 backdrop-blur-xl"
        >
          <ShieldAlert className="text-yellow-300" size={38} />

          <p className="mt-8 text-sm uppercase tracking-[0.25em] text-yellow-300">
            {t.eyebrow}
          </p>

          <h1 className="mt-4 text-5xl font-black">
            {t.title}
          </h1>

          <p className="mt-6 text-sm leading-relaxed text-gray-300">
            {t.description}
          </p>

          <input
            name="username"
            required
            placeholder={t.usernamePlaceholder}
            className="mt-8 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-gray-500"
          />

          <textarea
            name="message"
            required
            rows={6}
            placeholder={t.messagePlaceholder}
            className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-gray-500"
          />

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-yellow-300"
          >
            {t.submit}
          </button>
        </form>
      </div>
    </>
  );
}
