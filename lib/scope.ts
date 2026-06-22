import type { AppLanguage } from "@/lib/i18n";
import { getLocaleFromLanguage } from "@/lib/i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Period = "all" | "day" | "week" | "month" | "year";

export type ScopeParams = {
  period: Period;
  ref: string; // "2026-06-22" | "2026-06" | "2026" | "" depending on period
};

export type DateRange = {
  gte: Date;
  lte: Date; // exclusive upper bound: openDate >= gte && openDate < lte
};

// ─── Parsing ──────────────────────────────────────────────────────────────────

function isValidPeriod(value?: string): value is Period {
  return (
    value === "day" ||
    value === "week" ||
    value === "month" ||
    value === "year" ||
    value === "all"
  );
}

/**
 * Normalises raw searchParams into a typed ScopeParams.
 * If period is set but ref is absent, defaults to the current period.
 */
export function parseScopeParams(raw: {
  period?: string;
  ref?: string;
}): ScopeParams {
  const period = isValidPeriod(raw.period) ? raw.period : "all";
  let ref = raw.ref ?? "";
  if (period !== "all" && !ref) {
    ref = defaultRef(period);
  }
  return { period, ref };
}

// ─── Timezone helpers ─────────────────────────────────────────────────────────

/**
 * Returns the UTC offset of an IANA timezone on a given date, in minutes.
 * Positive = east of UTC (e.g. Europe/Rome in summer → +120).
 * Uses 12:00 UTC as reference to avoid any DST boundary at local midnight.
 */
function getTZOffsetMinutes(dateStr: string, tz: string): number {
  const utcNoon = new Date(`${dateStr}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(utcNoon);

  const get = (type: string): number =>
    parseInt(parts.find((p) => p.type === type)?.value ?? "0", 10);

  // Some engines emit 24 for midnight when hour12:false
  let hour = get("hour");
  if (hour === 24) hour = 0;

  // (local hours − 12 UTC hours) × 60 → offset in minutes
  return (hour + get("minute") / 60 + get("second") / 3600 - 12) * 60;
}

/**
 * Returns the UTC Date that corresponds to 00:00:00 of `dateStr` (YYYY-MM-DD)
 * in the given IANA timezone.
 *
 * Example: "2026-06-22", "Europe/Rome" (UTC+2)
 *   → 2026-06-21T22:00:00.000Z
 */
function startOfDayUTC(dateStr: string, tz: string): Date {
  let offsetMinutes = 0;
  try {
    offsetMinutes = getTZOffsetMinutes(dateStr, tz);
  } catch {
    // invalid / unsupported timezone → fall back to UTC
  }
  const utcMidnight = new Date(`${dateStr}T00:00:00Z`);
  // UTC = local midnight − offset
  return new Date(utcMidnight.getTime() - offsetMinutes * 60_000);
}

// ─── Date string helpers ──────────────────────────────────────────────────────

function addDaysToDateStr(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T12:00:00Z`); // noon avoids DST shift surprises
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Returns the ISO date string (YYYY-MM-DD) of the Monday of the ISO week
 * that contains `dateStr`. Week starts on Monday (ISO 8601).
 */
function getMondayOfWeek(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  const dow = d.getUTCDay(); // 0 = Sun, 1 = Mon … 6 = Sat
  const daysFromMonday = (dow + 6) % 7; // Mon → 0, Sun → 6
  d.setUTCDate(d.getUTCDate() - daysFromMonday);
  return d.toISOString().slice(0, 10);
}

/**
 * Adds `months` to a "YYYY-MM" string, wrapping year boundaries correctly.
 */
function addMonthsToMonthStr(monthStr: string, months: number): string {
  const [yearStr, monthNumStr] = monthStr.split("-");
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthNumStr, 10) + months; // 1-indexed
  while (month > 12) { month -= 12; year += 1; }
  while (month < 1)  { month += 12; year -= 1; }
  return `${year}-${String(month).padStart(2, "0")}`;
}

// ─── Current-period defaults ──────────────────────────────────────────────────

function todayUTCDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function currentUTCMonthStr(): string {
  return new Date().toISOString().slice(0, 7);
}

function currentUTCYearStr(): string {
  return String(new Date().getUTCFullYear());
}

/**
 * Returns the default ref for a period when none is supplied in the URL.
 * Uses UTC date so it works both server- and client-side without a timezone arg.
 */
export function defaultRef(period: Period): string {
  if (period === "day")   return todayUTCDateStr();
  if (period === "week")  return getMondayOfWeek(todayUTCDateStr());
  if (period === "month") return currentUTCMonthStr();
  if (period === "year")  return currentUTCYearStr();
  return "";
}

// ─── Period range (server-side) ───────────────────────────────────────────────

/**
 * Computes the [gte, lte) UTC date range for the given period + ref.
 * Returns null for period="all" (= no date filter).
 *
 * timezone should be an IANA timezone string (e.g. "Europe/Rome").
 * Falls back to UTC if the timezone is absent or invalid.
 *
 * Usage in Prisma:  where: { openDate: { gte: range.gte, lt: range.lte } }
 * Usage in JS:      trade.openDate >= range.gte && trade.openDate < range.lte
 */
export function getPeriodRange(
  period: Period,
  ref: string,
  timezone = "UTC",
): DateRange | null {
  if (period === "all" || !ref) return null;

  const tz = timezone || "UTC";

  if (period === "day") {
    return {
      gte: startOfDayUTC(ref, tz),
      lte: startOfDayUTC(addDaysToDateStr(ref, 1), tz),
    };
  }

  if (period === "week") {
    const monday = getMondayOfWeek(ref);
    return {
      gte: startOfDayUTC(monday, tz),
      lte: startOfDayUTC(addDaysToDateStr(monday, 7), tz),
    };
  }

  if (period === "month") {
    const firstDay = `${ref}-01`;
    const firstDayNext = `${addMonthsToMonthStr(ref, 1)}-01`;
    return {
      gte: startOfDayUTC(firstDay, tz),
      lte: startOfDayUTC(firstDayNext, tz),
    };
  }

  if (period === "year") {
    const y = parseInt(ref, 10);
    return {
      gte: startOfDayUTC(`${y}-01-01`, tz),
      lte: startOfDayUTC(`${y + 1}-01-01`, tz),
    };
  }

  return null;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

/**
 * Returns the new `ref` after pressing ‹ (direction=-1) or › (direction=+1).
 * For week, always normalises ref to the Monday of that week.
 */
export function navigatePeriod(
  period: Period,
  ref: string,
  direction: -1 | 1,
): string {
  const base = ref || defaultRef(period);

  if (period === "day")   return addDaysToDateStr(base, direction);
  if (period === "week")  return addDaysToDateStr(getMondayOfWeek(base), direction * 7);
  if (period === "month") return addMonthsToMonthStr(base, direction);
  if (period === "year")  return String(parseInt(base, 10) + direction);
  return base;
}

// ─── Labels ───────────────────────────────────────────────────────────────────

const PRESET_LABELS: Record<Period, Record<AppLanguage, string>> = {
  all:   { it: "Tutto",      en: "All time",  uk: "Весь час",   ru: "Всё время", es: "Todo",    fr: "Tout",     de: "Gesamt"    },
  day:   { it: "Giorno",     en: "Day",       uk: "День",       ru: "День",      es: "Día",     fr: "Jour",     de: "Tag"       },
  week:  { it: "Settimana",  en: "Week",      uk: "Тиждень",    ru: "Неделя",    es: "Semana",  fr: "Semaine",  de: "Woche"     },
  month: { it: "Mese",       en: "Month",     uk: "Місяць",     ru: "Месяц",     es: "Mes",     fr: "Mois",     de: "Monat"     },
  year:  { it: "Anno",       en: "Year",      uk: "Рік",        ru: "Год",       es: "Año",     fr: "Année",    de: "Jahr"      },
};

/** Short pill label for the preset buttons: "Giorno", "Settimana", … */
export function getPeriodPresetLabel(period: Period, lang: AppLanguage): string {
  return PRESET_LABELS[period]?.[lang] ?? PRESET_LABELS[period].en;
}

/**
 * Long label shown in the navigator between ‹ and ›.
 *
 * day   → "22 giu 2026"
 * week  → "16 giu – 22 giu 2026"
 * month → "Giugno 2026"
 * year  → "2026"
 * all   → "Tutto" / "All time" / …
 */
export function getPeriodLabel(
  period: Period,
  ref: string,
  lang: AppLanguage,
): string {
  const locale = getLocaleFromLanguage(lang);

  if (period === "all" || !ref) return PRESET_LABELS.all[lang];

  if (period === "day") {
    return new Date(`${ref}T12:00:00Z`).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  if (period === "week") {
    const monday = getMondayOfWeek(ref);
    const sunday = addDaysToDateStr(monday, 6);
    const startLabel = new Date(`${monday}T12:00:00Z`).toLocaleDateString(
      locale,
      { day: "numeric", month: "short", timeZone: "UTC" },
    );
    const endLabel = new Date(`${sunday}T12:00:00Z`).toLocaleDateString(
      locale,
      { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" },
    );
    return `${startLabel} – ${endLabel}`;
  }

  if (period === "month") {
    return new Date(`${ref}-01T12:00:00Z`).toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  if (period === "year") return ref;

  return ref;
}

/**
 * Returns " · Giugno 2026" for filtered periods, or "" for all-time.
 * Intended for metric card labels: `t.totalPnl + getPeriodSuffix(…)`.
 */
export function getPeriodSuffix(
  period: Period,
  ref: string,
  lang: AppLanguage,
): string {
  if (period === "all" || !ref) return "";
  return ` · ${getPeriodLabel(period, ref, lang)}`;
}

// ─── Scope description ────────────────────────────────────────────────────────

const VIEWING_LABELS: Record<AppLanguage, string> = {
  it: "STAI VEDENDO", en: "VIEWING",    uk: "ПЕРЕГЛЯД",
  ru: "ПРОСМОТР",    es: "VIENDO",     fr: "VOUS VOYEZ",  de: "ANGEZEIGT",
};

const ALL_TRADERS_LABELS: Record<AppLanguage, string> = {
  it: "Tutti i trader", en: "All traders",     uk: "Усі трейдери",
  ru: "Все трейдеры",  es: "Todos los traders", fr: "Tous les traders", de: "Alle Trader",
};

/**
 * Builds the confirmation row below the ScopeBar.
 *
 * traderName:
 *   undefined  → personal account: trader part omitted entirely
 *   null       → shared account, all traders selected → "Tutti i trader"
 *   string     → specific trader name
 *
 * Examples (IT):
 *   personal, all-time  → "STAI VEDENDO: Tutto"
 *   personal, month     → "STAI VEDENDO: Mese · Giugno 2026"
 *   shared, all traders → "STAI VEDENDO: Tutti i trader · Tutto"
 *   shared, Ivan, month → "STAI VEDENDO: Ivan · Mese · Giugno 2026"
 */
export function getScopeDescription(params: {
  period: Period;
  ref: string;
  lang: AppLanguage;
  traderName?: string | null;
}): string {
  const { period, ref, lang, traderName } = params;
  const prefix = VIEWING_LABELS[lang];

  const periodPart =
    period === "all" || !ref
      ? PRESET_LABELS.all[lang]
      : `${getPeriodPresetLabel(period, lang)} · ${getPeriodLabel(period, ref, lang)}`;

  if (traderName === undefined) {
    // Personal account: no trader dimension
    return `${prefix}: ${periodPart}`;
  }

  const trader = traderName ?? ALL_TRADERS_LABELS[lang];
  return `${prefix}: ${trader} · ${periodPart}`;
}
