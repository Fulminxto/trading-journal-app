"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleDot,
  X,
} from "lucide-react";

import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import {
  formatCurrencyByLanguage,
  formatDateByLanguage,
  getLocaleFromLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { pageDensity } from "@/lib/page-density";

type CalendarDayTrade = {
  id: number;
  symbol: string;
  direction: string | null;
  outcome: string | null;
  resultUsd: number | null;
  openDate: string;
  openTime: string | null;
  closeDate: string | null;
};

type CalendarDay = {
  pnl: number;
  trades: number;
  wins: number;
  losses: number;
  be: number;
  tradesList: CalendarDayTrade[];
};

type Labels = {
  monthlyPerformanceView: string;
  previousMonth: string;
  nextMonth: string;
  calendarMatrix: string;
  monthPerformance: string;
  profit: string;
  loss: string;
  noResult: string;
  noTradesThisMonth: string;
  trades: string;
  winsShort: string;
  lossesShort: string;
  beShort: string;
};

type Props = {
  accountId: string;
  language: AppLanguage;
  currency: string;
  month: number;
  year: number;
  monthName: string;
  days: number;
  adjustedFirstDay: number;
  endEmptyDays: number;
  activeDays: number;
  weekdays: string[];
  grouped: Record<number, CalendarDay>;
  previousMonth: number;
  previousYear: number;
  nextMonth: number;
  nextYear: number;
  selectedMemberId?: string;
  labels: Labels;
};

const drawerLabels: Record<
  AppLanguage,
  {
    close: string;
    dailyPnl: string;
    trades: string;
    wins: string;
    losses: string;
    breakEven: string;
    winRate: string;
    noActivityTitle: string;
    noActivityDescription: string;
    result: string;
    opened: string;
    closed: string;
    unknownSymbol: string;
  }
> = {
  it: {
    close: "Chiudi dettaglio giorno",
    dailyPnl: "PnL giornaliero",
    trades: "Trade",
    wins: "Win",
    losses: "Loss",
    breakEven: "Break even",
    winRate: "Win rate",
    noActivityTitle: "Nessuna attività di trading",
    noActivityDescription: "Nessun trade registrato per questo giorno.",
    result: "Risultato",
    opened: "Aperto",
    closed: "Chiuso",
    unknownSymbol: "Simbolo sconosciuto",
  },
  en: {
    close: "Close day detail",
    dailyPnl: "Daily PnL",
    trades: "Trades",
    wins: "Wins",
    losses: "Losses",
    breakEven: "Break even",
    winRate: "Win rate",
    noActivityTitle: "No trading activity",
    noActivityDescription: "No trades were recorded for this day.",
    result: "Result",
    opened: "Opened",
    closed: "Closed",
    unknownSymbol: "Unknown symbol",
  },
  uk: {
    close: "Close day detail",
    dailyPnl: "Daily PnL",
    trades: "Trades",
    wins: "Wins",
    losses: "Losses",
    breakEven: "Break even",
    winRate: "Win rate",
    noActivityTitle: "No trading activity",
    noActivityDescription: "No trades were recorded for this day.",
    result: "Result",
    opened: "Opened",
    closed: "Closed",
    unknownSymbol: "Unknown symbol",
  },
  ru: {
    close: "Close day detail",
    dailyPnl: "Daily PnL",
    trades: "Trades",
    wins: "Wins",
    losses: "Losses",
    breakEven: "Break even",
    winRate: "Win rate",
    noActivityTitle: "No trading activity",
    noActivityDescription: "No trades were recorded for this day.",
    result: "Result",
    opened: "Opened",
    closed: "Closed",
    unknownSymbol: "Unknown symbol",
  },
  es: {
    close: "Cerrar detalle del día",
    dailyPnl: "PnL diario",
    trades: "Trades",
    wins: "Wins",
    losses: "Losses",
    breakEven: "Break even",
    winRate: "Win rate",
    noActivityTitle: "Sin actividad de trading",
    noActivityDescription: "No se registraron trades para este día.",
    result: "Resultado",
    opened: "Apertura",
    closed: "Cierre",
    unknownSymbol: "Símbolo desconocido",
  },
  fr: {
    close: "Fermer le détail du jour",
    dailyPnl: "PnL quotidien",
    trades: "Trades",
    wins: "Wins",
    losses: "Losses",
    breakEven: "Break even",
    winRate: "Win rate",
    noActivityTitle: "Aucune activité de trading",
    noActivityDescription: "Aucun trade enregistré pour ce jour.",
    result: "Résultat",
    opened: "Ouvert",
    closed: "Fermé",
    unknownSymbol: "Symbole inconnu",
  },
  de: {
    close: "Tagesdetail schließen",
    dailyPnl: "Tages-PnL",
    trades: "Trades",
    wins: "Wins",
    losses: "Losses",
    breakEven: "Break even",
    winRate: "Win rate",
    noActivityTitle: "Keine Trading-Aktivität",
    noActivityDescription: "Für diesen Tag wurden keine Trades erfasst.",
    result: "Ergebnis",
    opened: "Eröffnet",
    closed: "Geschlossen",
    unknownSymbol: "Unbekanntes Symbol",
  },
};

function getResultTone(value: number) {
  if (value > 0) return "text-green-400";
  if (value < 0) return "text-red-400";
  return "text-yellow-300";
}

function getOutcomeTone(outcome: string | null) {
  if (outcome === "win") {
    return "border-green-400/20 bg-green-400/10 text-green-300";
  }

  if (outcome === "loss") {
    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  if (outcome === "be") {
    return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
  }

  return "border-white/10 bg-white/[0.04] text-muted";
}

function formatTime(
  date: string | null,
  fallbackTime: string | null,
  language: AppLanguage
) {
  if (fallbackTime) {
    return fallbackTime;
  }

  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    getLocaleFromLanguage(language),
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(date));
}

export default function CalendarMatrix({
  accountId,
  language,
  currency,
  month,
  year,
  monthName,
  days,
  adjustedFirstDay,
  endEmptyDays,
  activeDays,
  weekdays,
  grouped,
  previousMonth,
  previousYear,
  nextMonth,
  nextYear,
  selectedMemberId,
  labels,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const dl = drawerLabels[language];
  const now = useMemo(() => new Date(), []);

  const selectedData =
    selectedDay !== null ? grouped[selectedDay] : undefined;

  const selectedDate =
    selectedDay !== null
      ? new Date(year, month, selectedDay)
      : null;

  const selectedDateLabel = selectedDate
    ? formatDateByLanguage(selectedDate, language, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const selectedWeekdayLabel = selectedDate
    ? new Intl.DateTimeFormat(getLocaleFromLanguage(language), {
        weekday: "long",
      }).format(selectedDate)
    : "";

  const winRate =
    selectedData && selectedData.trades > 0
      ? `${Math.round((selectedData.wins / selectedData.trades) * 100)}%`
      : "0%";

  const buildMonthHref = (
    targetMonth: number,
    targetYear: number
  ) => {
    const params = new URLSearchParams({
      month: String(targetMonth),
      year: String(targetYear),
    });

    if (selectedMemberId) {
      params.set("member", selectedMemberId);
    }

    return `/accounts/${accountId}/calendar?${params.toString()}`;
  };

  function closeDrawer() {
    setSelectedDay(null);
  }

  useEffect(() => {
    if (selectedDay === null) {
      return;
    }

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDrawer();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [selectedDay]);

  return (
    <>
      <div className="reveal-rise" style={{ animationDelay: "140ms" }}>
        <Card variant="hero" className={`relative ${pageDensity.calendar.panel}`}>
          <SignatureEdge
            orientation="vertical"
            className="absolute bottom-6 left-0 top-6"
          />

          <div className="pl-4">
            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-muted">
                  {labels.calendarMatrix}
                </p>

                <h2 className="mt-1 text-section capitalize text-white">
                  {labels.monthPerformance}
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
                  <p className="shrink-0 text-micro font-medium uppercase tracking-label text-muted-faint">
                    {labels.monthlyPerformanceView}
                  </p>

                  <div className="flex items-center gap-1 rounded-pill border border-white/10 bg-white/[0.03] px-1 py-0.5">
                    <Link
                      href={buildMonthHref(
                        previousMonth,
                        previousYear
                      )}
                      className="flex h-6 w-6 items-center justify-center rounded-pill text-muted transition hover:bg-white/10 hover:text-white"
                      aria-label={labels.previousMonth}
                    >
                      <ChevronLeft size={14} />
                    </Link>

                    <span className="min-w-[120px] px-1.5 text-center text-xs capitalize text-white">
                      {monthName}
                    </span>

                    <Link
                      href={buildMonthHref(
                        nextMonth,
                        nextYear
                      )}
                      className="flex h-6 w-6 items-center justify-center rounded-pill text-muted transition hover:bg-white/10 hover:text-white"
                      aria-label={labels.nextMonth}
                    >
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-muted">
                  <div className="flex items-center gap-2">
                    <CircleDot size={14} className="text-green-400" />
                    {labels.profit}
                  </div>

                  <div className="flex items-center gap-2">
                    <CircleDot size={14} className="text-red-400" />
                    {labels.loss}
                  </div>

                  <div className="flex items-center gap-2">
                    <CircleDot size={14} className="text-muted-faint" />
                    {labels.noResult}
                  </div>
                </div>
              </div>
            </div>

            {activeDays === 0 && (
              <Card variant="inner" className="mb-6 border-dashed p-4 text-sm text-muted">
                {labels.noTradesThisMonth}
              </Card>
            )}

            <div className="overflow-x-auto">
              <div className="min-w-[840px] overflow-hidden rounded-inner border-[0.5px] border-white/[0.08]">
                <div className="grid grid-cols-7 border-b border-white/[0.08] bg-surface-2">
                  {weekdays.map((day) => (
                    <div
                      key={day}
                      className="border-r border-white/[0.08] p-4 text-center text-sm font-black uppercase tracking-[0.14em] text-muted-faint last:border-r-0"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 bg-bg-deep/40">
                  {Array.from({ length: adjustedFirstDay }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="min-h-[150px] border-r border-b border-white/[0.08] bg-surface-1/60"
                    />
                  ))}

                  {Array.from({ length: days }).map((_, index) => {
                    const day = index + 1;
                    const data = grouped[day];
                    const pnl = data?.pnl || 0;
                    const tradesCount = data?.trades || 0;
                    const positive = pnl > 0;
                    const negative = pnl < 0;
                    const hasTrades = tradesCount > 0;
                    const selected = selectedDay === day;
                    const intensity = Math.min(Math.abs(pnl) / 500, 1);
                    const isToday =
                      now.getDate() === day &&
                      now.getMonth() === month &&
                      now.getFullYear() === year;
                    const date = new Date(year, month, day);
                    const ariaLabel = `${formatDateByLanguage(date, language, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}: ${tradesCount} ${labels.trades}, ${formatCurrencyByLanguage(
                      pnl,
                      currency,
                      language
                    )}`;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        aria-label={ariaLabel}
                        aria-pressed={selected}
                        className={`group relative block w-full cursor-pointer border-r border-b border-white/[0.08] text-left ${pageDensity.calendar.dayCell} transition-colors duration-base last:border-r-0 hover:border-accent-bright/20 hover:bg-white/[0.025] focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-bright ${
                          selected
                            ? "border-accent-bright/45 bg-white/[0.045]"
                            : ""
                        }`}
                        style={{
                          backgroundColor: positive
                            ? `color-mix(in srgb, var(--color-positive) ${4 + intensity * 10}%, transparent)`
                            : negative
                              ? `color-mix(in srgb, var(--color-negative) ${4 + intensity * 10}%, transparent)`
                              : undefined,
                        }}
                      >
                        <div
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-x-3 top-2 h-px bg-accent-bright/35 transition-opacity duration-base ${
                            selected
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                        />

                        <div className="relative mb-5 flex items-center justify-between">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black transition-colors duration-base ${
                              isToday
                                ? "bg-accent-bright text-bg-deep"
                                : selected
                                  ? "bg-accent-bright/14 text-accent-bright"
                                  : "bg-white/5 text-white group-hover:bg-white/[0.08]"
                            }`}
                          >
                            {day}
                          </div>

                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              positive
                                ? "bg-green-400"
                                : negative
                                  ? "bg-red-400"
                                  : "bg-white/10"
                            }`}
                          />
                        </div>

                        <div className="relative space-y-2">
                          <p
                            className={`text-sm font-black ${
                              positive
                                ? "text-green-400"
                                : negative
                                  ? "text-red-400"
                                  : hasTrades
                                    ? "text-yellow-300"
                                    : "text-muted-faint"
                            }`}
                          >
                            {formatCurrencyByLanguage(pnl, currency, language)}
                          </p>

                          <p
                            className={`text-xs ${
                              hasTrades
                                ? "text-muted-faint"
                                : "text-muted-faint/70"
                            }`}
                          >
                            {tradesCount} {labels.trades}
                          </p>

                          {data && (
                            <p className="text-xs text-muted-faint">
                              {data.wins}
                              {labels.winsShort} / {data.losses}
                              {labels.lossesShort} / {data.be}
                              {labels.beShort}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {Array.from({ length: endEmptyDays }).map((_, index) => (
                    <div
                      key={`end-empty-${index}`}
                      className="min-h-[150px] border-r border-b border-white/[0.08] bg-surface-1/60"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {selectedDay !== null && (
        <div
          className="fixed inset-0 z-[9998] bg-black/30"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDrawer();
            }
          }}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-day-drawer-title"
            className="fixed inset-x-3 bottom-3 max-h-[86vh] overflow-hidden rounded-card border-[0.5px] border-flash/[0.12] bg-surface-1 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:inset-y-0 sm:left-auto sm:right-0 sm:bottom-auto sm:h-dvh sm:max-h-none sm:w-[min(88vw,460px)] sm:rounded-none sm:rounded-l-[18px] sm:border-y-0 sm:border-r-0 sm:border-l sm:border-white/[0.10]"
          >
            <div className="flex h-full max-h-[86vh] flex-col sm:h-dvh sm:max-h-none">
              <header className="shrink-0 border-b border-white/10 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2
                      id="calendar-day-drawer-title"
                      className="text-2xl font-black text-white"
                    >
                      {selectedDateLabel}
                    </h2>

                    <p className="mt-1 text-sm capitalize text-muted">
                      {selectedWeekdayLabel}
                    </p>
                  </div>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={closeDrawer}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-inner border border-white/10 text-muted transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright"
                    aria-label={dl.close}
                  >
                    <X size={20} />
                  </button>
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                {selectedData && selectedData.trades > 0 ? (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        [
                          dl.dailyPnl,
                          formatCurrencyByLanguage(
                            selectedData.pnl,
                            currency,
                            language
                          ),
                          getResultTone(selectedData.pnl),
                        ],
                        [dl.trades, selectedData.trades, "text-white"],
                        [dl.wins, selectedData.wins, "text-green-400"],
                        [dl.losses, selectedData.losses, "text-red-400"],
                        [dl.breakEven, selectedData.be, "text-yellow-300"],
                        [dl.winRate, winRate, "text-accent-bright"],
                      ].map(([label, value, tone]) => (
                        <Card
                          key={label}
                          variant="inner"
                          className="p-3"
                        >
                          <p className="text-xs text-muted-faint">
                            {label}
                          </p>

                          <p className={`mt-1 text-lg font-black ${tone}`}>
                            {value}
                          </p>
                        </Card>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {selectedData.tradesList.map((trade) => {
                        const result = trade.resultUsd || 0;

                        return (
                          <Card
                            key={trade.id}
                            variant="inner"
                            className="p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="truncate text-base font-black text-white">
                                  {trade.symbol || dl.unknownSymbol}
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  {trade.direction && (
                                    <span className="rounded-full border border-accent-bright/15 bg-accent-bright/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-accent-bright">
                                      {trade.direction}
                                    </span>
                                  )}

                                  {trade.outcome && (
                                    <span
                                      className={`rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${getOutcomeTone(
                                        trade.outcome
                                      )}`}
                                    >
                                      {trade.outcome}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <p
                                className={`shrink-0 text-right text-base font-black ${getResultTone(
                                  result
                                )}`}
                              >
                                {formatCurrencyByLanguage(
                                  result,
                                  currency,
                                  language
                                )}
                              </p>
                            </div>

                            <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                              <span className="text-muted-faint">
                                {dl.result}
                              </span>
                              <span className={`font-semibold ${getResultTone(result)}`}>
                                {formatCurrencyByLanguage(
                                  result,
                                  currency,
                                  language
                                )}
                              </span>

                              <span className="text-muted-faint">
                                {dl.opened}
                              </span>
                              <span className="font-semibold text-gray-300">
                                {formatTime(
                                  trade.openDate,
                                  trade.openTime,
                                  language
                                )}
                              </span>

                              {trade.closeDate && (
                                <>
                                  <span className="text-muted-faint">
                                    {dl.closed}
                                  </span>
                                  <span className="font-semibold text-gray-300">
                                    {formatTime(
                                      trade.closeDate,
                                      null,
                                      language
                                    )}
                                  </span>
                                </>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Card
                    variant="inner"
                    className="border-dashed p-5 text-sm"
                  >
                    <p className="text-base font-black text-white">
                      {dl.noActivityTitle}
                    </p>

                    <p className="mt-2 leading-6 text-muted">
                      {dl.noActivityDescription}
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
