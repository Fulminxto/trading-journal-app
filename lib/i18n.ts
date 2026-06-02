export const SUPPORTED_APP_LANGUAGES = [
    "it",
    "en",
] as const;

export type AppLanguage =
    (typeof SUPPORTED_APP_LANGUAGES)[number];

export const DEFAULT_APP_LANGUAGE: AppLanguage =
    "it";

export function normalizeAppLanguage(
    language?: string | null
): AppLanguage {
    if (language === "en") {
        return "en";
    }

    return DEFAULT_APP_LANGUAGE;
}

export function getLocaleFromLanguage(
    language?: string | null
) {
    const appLanguage =
        normalizeAppLanguage(language);

    if (appLanguage === "en") {
        return "en-US";
    }

    return "it-IT";
}

export function formatCurrencyByLanguage(
    value: number,
    currency = "USD",
    language?: string | null
) {
    return new Intl.NumberFormat(
        getLocaleFromLanguage(language),
        {
            style: "currency",
            currency,
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
    return new Intl.NumberFormat(
        getLocaleFromLanguage(language),
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    ).format(value) + "%";
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

export const LANGUAGE_LABELS: Record<
    AppLanguage,
    string
> = {
    it: "Italiano",
    en: "English",
};