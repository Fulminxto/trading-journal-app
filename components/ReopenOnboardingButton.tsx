"use client";

import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

const buttonLabels: Record<AppLanguage, string> = {
  en: "Open tutorial",
  it: "Apri guida iniziale",
  uk: "Відкрити посібник",
  ru: "Открыть руководство",
  es: "Abrir tutorial",
  fr: "Ouvrir le tutoriel",
  de: "Tutorial öffnen",
};

export default function ReopenOnboardingButton({
  language,
}: {
  language?: string;
}) {
  const label = buttonLabels[normalizeAppLanguage(language)];

  function reopenOnboarding() {
    localStorage.removeItem(
      "trading-journal-onboarding"
    );

    window.location.reload();
  }

  return (
    <button
      onClick={reopenOnboarding}
      className="mt-5 rounded-2xl bg-green-500 px-5 py-3 font-bold text-black transition hover:bg-green-400"
    >
      {label}
    </button>
  );
}
