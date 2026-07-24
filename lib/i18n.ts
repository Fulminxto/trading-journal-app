export const SUPPORTED_APP_LANGUAGES = [
  "it",
  "en",
  "uk",
  "ru",
  "es",
  "fr",
  "de",
] as const;

export type AppLanguage =
  (typeof SUPPORTED_APP_LANGUAGES)[number];

export const DEFAULT_APP_LANGUAGE: AppLanguage = "en";
export const FALLBACK_APP_LANGUAGE: AppLanguage = "en";

const ACCOUNT_CURRENCY_SYMBOLS: Readonly<Record<string, string>> = {
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  USDT: "₮",
  USDC: "$",
};

export function isSupportedAppLanguage(
  language?: string | null
): language is AppLanguage {
  return SUPPORTED_APP_LANGUAGES.includes(
    language as AppLanguage
  );
}

export function normalizeAppLanguage(
  language?: string | null
): AppLanguage {
  if (isSupportedAppLanguage(language)) {
    return language;
  }

  return FALLBACK_APP_LANGUAGE;
}

export function getLocaleFromLanguage(
  language?: string | null
) {
  const appLanguage = normalizeAppLanguage(language);

  if (appLanguage === "it") return "it-IT";
  if (appLanguage === "uk") return "uk-UA";
  if (appLanguage === "ru") return "ru-RU";
  if (appLanguage === "es") return "es-ES";
  if (appLanguage === "fr") return "fr-FR";
  if (appLanguage === "de") return "de-DE";

  return "en-US";
}

export function formatCurrencyByLanguage(
  value: number,
  currency = "USD",
  language?: string | null
) {
  const normalizedCurrency = currency.toUpperCase();
  const accountCurrencySymbol = ACCOUNT_CURRENCY_SYMBOLS[normalizedCurrency];
  const locale = getLocaleFromLanguage(language);

  if (accountCurrencySymbol) {
    const formattedValue = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
    const separator = normalizedCurrency === "CHF" ? " " : "";

    return `${value < 0 ? "-" : ""}${accountCurrencySymbol}${separator}${formattedValue}`;
  }

  return new Intl.NumberFormat(
    locale,
    {
      style: "currency",
      currency: normalizedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(value);
}

export function formatNumberByLanguage(
  value: number,
  language?: string | null
) {
  return new Intl.NumberFormat(
    getLocaleFromLanguage(language)
  ).format(value);
}

export function formatPercentByLanguage(
  value: number,
  language?: string | null
) {
  return (
    new Intl.NumberFormat(
      getLocaleFromLanguage(language),
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(value) + "%"
  );
}

export function formatDateByLanguage(
  date: Date | string,
  language?: string | null,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }
) {
  return new Date(date).toLocaleDateString(
    getLocaleFromLanguage(language),
    options
  );
}

export function formatDateTimeByLanguage(
  date: Date | string,
  language?: string | null,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
) {
  return new Date(date).toLocaleString(
    getLocaleFromLanguage(language),
    options
  );
}

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  it: "Italiano",
  en: "English",
  uk: "Українська",
  ru: "Русский",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

export const LANGUAGE_OPTIONS = SUPPORTED_APP_LANGUAGES.map(
  (value) => ({
    value,
    label: LANGUAGE_LABELS[value],
  })
);
