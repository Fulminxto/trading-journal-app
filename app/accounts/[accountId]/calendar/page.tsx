import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Flame,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatCurrencyByLanguage,
  formatNumberByLanguage,
  getLocaleFromLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type CalendarLabels = {
  tradingCalendar: string;
  currentMonth: string;
  monthlyPerformanceView: string;
  heroDescription: string;
  backToAccountHub: string;
  previousMonth: string;
  nextMonth: string;

  monthlyPnl: string;
  activeDays: string;
  trades: string;
  averageDaily: string;
  averageDailyDescription: string;
  bestDay: string;
  worstDay: string;
  positiveDays: string;
  negativeDays: string;
  flatDays: string;
  avgTradesPerActiveDay: string;

  calendarMatrix: string;
  monthPerformance: (monthName: string) => string;
  profit: string;
  loss: string;
  noResult: string;

  winsShort: string;
  lossesShort: string;
  beShort: string;

  monthlySummary: string;
  whatThisMonthShows: string;
  activity: string;
  activityDescription: string;
  direction: string;
  positive: string;
  negative: string;
  flat: string;
  directionDescription: string;
  totalTrades: string;
  totalTradesDescription: string;
};

const calendarLabels: Record<
  AppLanguage,
  CalendarLabels
> = {
  it: {
    tradingCalendar: "Calendario trading",
    currentMonth: "Mese corrente",
    monthlyPerformanceView: "Vista performance mensile",
    heroDescription:
      "Una vista giorno per giorno della performance, dell’attività di trading e della consistenza mensile. Usala per individuare giornate forti, giornate deboli e periodi in cui la disciplina richiede più attenzione.",
    backToAccountHub: "Torna all’Account Hub",
    previousMonth: "Mese precedente",
    nextMonth: "Mese successivo",

    monthlyPnl: "PnL mensile",
    activeDays: "giorni attivi",
    trades: "trade",
    averageDaily: "Media giornaliera",
    averageDailyDescription:
      "PnL medio calcolato solo sui giorni di trading attivi.",
    bestDay: "Giorno migliore",
    worstDay: "Giorno peggiore",
    positiveDays: "Giorni positivi",
    negativeDays: "Giorni negativi",
    flatDays: "Giorni flat",
    avgTradesPerActiveDay: "Media trade / giorno attivo",

    calendarMatrix: "Matrice calendario",
    monthPerformance: (monthName) =>
      `Performance di ${monthName}`,
    profit: "Profitto",
    loss: "Perdita",
    noResult: "Nessun risultato",

    winsShort: "W",
    lossesShort: "L",
    beShort: "BE",

    monthlySummary: "Riepilogo mensile",
    whatThisMonthShows: "Cosa mostra questo mese",
    activity: "Attività",
    activityDescription:
      "Giorni con almeno un trade registrato.",
    direction: "Direzione",
    positive: "Positivo",
    negative: "Negativo",
    flat: "Flat",
    directionDescription:
      "Basato sul PnL mensile totale.",
    totalTrades: "Trade totali",
    totalTradesDescription:
      "Operazioni totali aperte durante questo mese.",
  },

  en: {
    tradingCalendar: "Trading calendar",
    currentMonth: "Current month",
    monthlyPerformanceView: "Monthly performance view",
    heroDescription:
      "A day-by-day view of performance, trading activity and monthly consistency. Use it to spot strong days, weak days and periods where discipline needs more attention.",
    backToAccountHub: "Back to Account Hub",
    previousMonth: "Previous month",
    nextMonth: "Next month",

    monthlyPnl: "Monthly PnL",
    activeDays: "active days",
    trades: "trades",
    averageDaily: "Average Daily",
    averageDailyDescription:
      "Average PnL only across active trading days.",
    bestDay: "Best Day",
    worstDay: "Worst Day",
    positiveDays: "Positive Days",
    negativeDays: "Negative Days",
    flatDays: "Flat Days",
    avgTradesPerActiveDay: "Avg Trades / Active Day",

    calendarMatrix: "Calendar matrix",
    monthPerformance: (monthName) =>
      `${monthName} performance`,
    profit: "Profit",
    loss: "Loss",
    noResult: "No result",

    winsShort: "W",
    lossesShort: "L",
    beShort: "BE",

    monthlySummary: "Monthly summary",
    whatThisMonthShows: "What this month shows",
    activity: "Activity",
    activityDescription:
      "Days with at least one recorded trade.",
    direction: "Direction",
    positive: "Positive",
    negative: "Negative",
    flat: "Flat",
    directionDescription:
      "Based on total monthly PnL.",
    totalTrades: "Total Trades",
    totalTradesDescription:
      "Total operations opened during this month.",
  },

  uk: {
    tradingCalendar: "Торговий календар",
    currentMonth: "Поточний місяць",
    monthlyPerformanceView: "Місячний огляд результатів",
    heroDescription:
      "Погляд день за днем на результативність, торгову активність і місячну стабільність. Використовуй це, щоб бачити сильні дні, слабкі дні та періоди, коли дисципліні потрібно більше уваги.",
    backToAccountHub: "Назад до Account Hub",
    previousMonth: "Попередній місяць",
    nextMonth: "Наступний місяць",

    monthlyPnl: "Місячний PnL",
    activeDays: "активних днів",
    trades: "угод",
    averageDaily: "Середній день",
    averageDailyDescription:
      "Середній PnL лише за активні торгові дні.",
    bestDay: "Найкращий день",
    worstDay: "Найгірший день",
    positiveDays: "Позитивні дні",
    negativeDays: "Негативні дні",
    flatDays: "Нейтральні дні",
    avgTradesPerActiveDay:
      "Середня кількість угод / активний день",

    calendarMatrix: "Матриця календаря",
    monthPerformance: (monthName) =>
      `Результати за ${monthName}`,
    profit: "Прибуток",
    loss: "Збиток",
    noResult: "Без результату",

    winsShort: "W",
    lossesShort: "L",
    beShort: "BE",

    monthlySummary: "Місячний підсумок",
    whatThisMonthShows: "Що показує цей місяць",
    activity: "Активність",
    activityDescription:
      "Дні з принаймні однією записаною угодою.",
    direction: "Напрям",
    positive: "Позитивний",
    negative: "Негативний",
    flat: "Нейтральний",
    directionDescription:
      "На основі загального місячного PnL.",
    totalTrades: "Усього угод",
    totalTradesDescription:
      "Загальна кількість операцій, відкритих протягом цього місяця.",
  },

  ru: {
    tradingCalendar: "Торговый календар",
    currentMonth: "Текущий месяц",
    monthlyPerformanceView: "Месячный обзор результатов",
    heroDescription:
      "Помесячный и подневный взгляд на результативность, торговую активность и стабильность. Используй его, чтобы видеть сильные дни, слабые дни и периоды, где дисциплине нужно больше внимания.",
    backToAccountHub: "Назад в Account Hub",
    previousMonth: "Предыдущий месяц",
    nextMonth: "Следующий месяц",

    monthlyPnl: "Месячный PnL",
    activeDays: "активных дней",
    trades: "сделок",
    averageDaily: "Средний день",
    averageDailyDescription:
      "Средний PnL только по активным торговым дням.",
    bestDay: "Лучший день",
    worstDay: "Худший день",
    positiveDays: "Положительные дни",
    negativeDays: "Отрицательные дни",
    flatDays: "Нейтральные дни",
    avgTradesPerActiveDay:
      "Среднее число сделок / активный день",

    calendarMatrix: "Матрица календаря",
    monthPerformance: (monthName) =>
      `Результаты за ${monthName}`,
    profit: "Прибыль",
    loss: "Убыток",
    noResult: "Без результата",

    winsShort: "W",
    lossesShort: "L",
    beShort: "BE",

    monthlySummary: "Месячная сводка",
    whatThisMonthShows: "Что показывает этот месяц",
    activity: "Активность",
    activityDescription:
      "Дни с хотя бы одной записанной сделкой.",
    direction: "Направление",
    positive: "Положительно",
    negative: "Отрицательно",
    flat: "Нейтрально",
    directionDescription:
      "Основано на общем месячном PnL.",
    totalTrades: "Всего сделок",
    totalTradesDescription:
      "Общее количество операций, открытых в течение этого месяца.",
  },

  es: {
    tradingCalendar: "Calendario de trading",
    currentMonth: "Mes actual",
    monthlyPerformanceView: "Vista de rendimiento mensual",
    heroDescription:
      "Una vista día a día del rendimiento, la actividad de trading y la consistencia mensual. Úsala para detectar días fuertes, días débiles y periodos donde la disciplina necesita más atención.",
    backToAccountHub: "Volver al Account Hub",
    previousMonth: "Mes anterior",
    nextMonth: "Mes siguiente",

    monthlyPnl: "PnL mensual",
    activeDays: "días activos",
    trades: "trades",
    averageDaily: "Media diaria",
    averageDailyDescription:
      "PnL medio calculado solo en días de trading activos.",
    bestDay: "Mejor día",
    worstDay: "Peor día",
    positiveDays: "Días positivos",
    negativeDays: "Días negativos",
    flatDays: "Días flat",
    avgTradesPerActiveDay:
      "Media trades / día activo",

    calendarMatrix: "Matriz del calendario",
    monthPerformance: (monthName) =>
      `Rendimiento de ${monthName}`,
    profit: "Ganancia",
    loss: "Pérdida",
    noResult: "Sin resultado",

    winsShort: "W",
    lossesShort: "L",
    beShort: "BE",

    monthlySummary: "Resumen mensual",
    whatThisMonthShows: "Qué muestra este mes",
    activity: "Actividad",
    activityDescription:
      "Días con al menos un trade registrado.",
    direction: "Dirección",
    positive: "Positivo",
    negative: "Negativo",
    flat: "Flat",
    directionDescription:
      "Basado en el PnL mensual total.",
    totalTrades: "Trades totales",
    totalTradesDescription:
      "Operaciones totales abiertas durante este mes.",
  },

  fr: {
    tradingCalendar: "Calendrier de trading",
    currentMonth: "Mois actuel",
    monthlyPerformanceView: "Vue de performance mensuelle",
    heroDescription:
      "Une vue jour par jour de la performance, de l’activité de trading et de la régularité mensuelle. Utilise-la pour repérer les jours forts, les jours faibles et les périodes où la discipline demande plus d’attention.",
    backToAccountHub: "Retour à l’Account Hub",
    previousMonth: "Mois précédent",
    nextMonth: "Mois suivant",

    monthlyPnl: "PnL mensuel",
    activeDays: "jours actifs",
    trades: "trades",
    averageDaily: "Moyenne quotidienne",
    averageDailyDescription:
      "PnL moyen calculé uniquement sur les jours de trading actifs.",
    bestDay: "Meilleur jour",
    worstDay: "Pire jour",
    positiveDays: "Jours positifs",
    negativeDays: "Jours négatifs",
    flatDays: "Jours flat",
    avgTradesPerActiveDay:
      "Moy. trades / jour actif",

    calendarMatrix: "Matrice calendrier",
    monthPerformance: (monthName) =>
      `Performance de ${monthName}`,
    profit: "Profit",
    loss: "Perte",
    noResult: "Aucun résultat",

    winsShort: "W",
    lossesShort: "L",
    beShort: "BE",

    monthlySummary: "Résumé mensuel",
    whatThisMonthShows: "Ce que montre ce mois",
    activity: "Activité",
    activityDescription:
      "Jours avec au moins un trade enregistré.",
    direction: "Direction",
    positive: "Positif",
    negative: "Négatif",
    flat: "Flat",
    directionDescription:
      "Basé sur le PnL mensuel total.",
    totalTrades: "Trades totaux",
    totalTradesDescription:
      "Nombre total d’opérations ouvertes durant ce mois.",
  },

  de: {
    tradingCalendar: "Trading-Kalender",
    currentMonth: "Aktueller Monat",
    monthlyPerformanceView: "Monatliche Performance-Ansicht",
    heroDescription:
      "Eine Tagesansicht von Performance, Trading-Aktivität und monatlicher Konstanz. Nutze sie, um starke Tage, schwache Tage und Phasen zu erkennen, in denen Disziplin mehr Aufmerksamkeit braucht.",
    backToAccountHub: "Zurück zum Account Hub",
    previousMonth: "Vorheriger Monat",
    nextMonth: "Nächster Monat",

    monthlyPnl: "Monatlicher PnL",
    activeDays: "aktive Tage",
    trades: "Trades",
    averageDaily: "Tagesdurchschnitt",
    averageDailyDescription:
      "Durchschnittlicher PnL nur über aktive Trading-Tage.",
    bestDay: "Bester Tag",
    worstDay: "Schlechtester Tag",
    positiveDays: "Positive Tage",
    negativeDays: "Negative Tage",
    flatDays: "Flat-Tage",
    avgTradesPerActiveDay:
      "Ø Trades / aktiver Tag",

    calendarMatrix: "Kalendermatrix",
    monthPerformance: (monthName) =>
      `${monthName} Performance`,
    profit: "Profit",
    loss: "Verlust",
    noResult: "Kein Ergebnis",

    winsShort: "W",
    lossesShort: "L",
    beShort: "BE",

    monthlySummary: "Monatsübersicht",
    whatThisMonthShows: "Was dieser Monat zeigt",
    activity: "Aktivität",
    activityDescription:
      "Tage mit mindestens einem eingetragenen Trade.",
    direction: "Richtung",
    positive: "Positiv",
    negative: "Negativ",
    flat: "Flat",
    directionDescription:
      "Basierend auf dem gesamten monatlichen PnL.",
    totalTrades: "Gesamt-Trades",
    totalTradesDescription:
      "Gesamtzahl der in diesem Monat eröffneten Operationen.",
  },
};

function getDaysInMonth(
  year: number,
  month: number
) {
  return new Date(
    year,
    month + 1,
    0
  ).getDate();
}

function formatNumber(
  value: number,
  language?: string | null
) {
  return formatNumberByLanguage(
    value,
    language
  );
}

function getResultTone(value: number) {
  if (value > 0) {
    return "text-green-400";
  }

  if (value < 0) {
    return "text-red-400";
  }

  return "text-yellow-400";
}

function getMonthIndex(value: string | undefined) {
  if (value === undefined) {
    return null;
  }

  const parsed = Number(value);

  if (
    Number.isNaN(parsed) ||
    parsed < 0 ||
    parsed > 11
  ) {
    return null;
  }

  return parsed;
}

function getYearValue(value: string | undefined) {
  if (value === undefined) {
    return null;
  }

  const parsed = Number(value);

  if (
    Number.isNaN(parsed) ||
    parsed < 2000 ||
    parsed > 2100
  ) {
    return null;
  }

  return parsed;
}

function StatCard({
  label,
  value,
  description,
  tone = "text-white",
}: {
  label: string;
  value: string | number;
  description: string;
  tone?: string;
}) {
  return (
    <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-gray-400">
        {label}
      </p>

      <h2 className={`mt-3 text-3xl font-black ${tone}`}>
        {value}
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default async function CalendarPage({
  params,
  searchParams,
}: {
  params: Promise<{
    accountId: string;
  }>;

  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } =
    await params;

  const query =
    await searchParams;

  const [membership, currentUser] =
    await Promise.all([
      prisma.accountMember.findFirst(
        {
          where: {
            userId:
              session.user.id,
            tradingAccountId:
              accountId,
          },

          include: {
            tradingAccount: true,
          },
        }
      ),

      prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          appLanguage: true,
        },
      }),
    ]);

  if (!membership) {
    redirect("/accounts");
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      lastSeenAt: new Date(),
      lastActivityAt: new Date(),
    },
  });

  const language = normalizeAppLanguage(
    currentUser?.appLanguage
  );

  const locale =
    getLocaleFromLanguage(language);

  const t = calendarLabels[language];

  const account =
    membership.tradingAccount;

  const now = new Date();

  const requestedMonth =
    getMonthIndex(query.month);

  const requestedYear =
    getYearValue(query.year);

  const month =
    requestedMonth !== null
      ? requestedMonth
      : now.getMonth();

  const year =
    requestedYear !== null
      ? requestedYear
      : now.getFullYear();

  const currency =
    account.currency || "USD";

  const monthStart = new Date(
    year,
    month,
    1
  );

  const monthEnd = new Date(
    year,
    month + 1,
    1
  );

  const trades =
    await prisma.trade.findMany({
      where: {
        tradingAccountId:
          accountId,

        openDate: {
          gte: monthStart,
          lt: monthEnd,
        },
      },

      orderBy: [
        {
          openDate: "asc",
        },

        {
          id: "asc",
        },
      ],
    });

  const days =
    getDaysInMonth(
      year,
      month
    );

  const grouped: Record<
    number,
    {
      pnl: number;
      trades: number;
      wins: number;
      losses: number;
      be: number;
    }
  > = {};

  for (const trade of trades) {
    const day = new Date(
      trade.openDate
    ).getDate();

    if (!grouped[day]) {
      grouped[day] = {
        pnl: 0,
        trades: 0,
        wins: 0,
        losses: 0,
        be: 0,
      };
    }

    grouped[day].pnl +=
      trade.resultUsd || 0;

    grouped[day].trades += 1;

    if (trade.outcome === "win") {
      grouped[day].wins += 1;
    }

    if (trade.outcome === "loss") {
      grouped[day].losses += 1;
    }

    if (trade.outcome === "be") {
      grouped[day].be += 1;
    }
  }

  const monthName = new Date(
    year,
    month
  ).toLocaleString(locale, {
    month: "long",
  });

  const monthLabel = new Date(
    year,
    month
  ).toLocaleString(locale, {
    month: "long",
    year: "numeric",
  });

  const previousMonth =
    month === 0
      ? 11
      : month - 1;

  const nextMonth =
    month === 11
      ? 0
      : month + 1;

  const previousYear =
    month === 0
      ? year - 1
      : year;

  const nextYear =
    month === 11
      ? year + 1
      : year;

  const groupedDays =
    Object.values(grouped);

  const totalMonthPnl =
    groupedDays.reduce(
      (acc, day) =>
        acc + day.pnl,
      0
    );

  const totalMonthTrades =
    groupedDays.reduce(
      (acc, day) =>
        acc + day.trades,
      0
    );

  const activeDays =
    groupedDays.length;

  const positiveDays =
    groupedDays.filter(
      (day) => day.pnl > 0
    ).length;

  const negativeDays =
    groupedDays.filter(
      (day) => day.pnl < 0
    ).length;

  const flatDays =
    groupedDays.filter(
      (day) => day.pnl === 0
    ).length;

  const bestDay =
    groupedDays.length > 0
      ? Math.max(
        ...groupedDays.map(
          (day) => day.pnl
        )
      )
      : 0;

  const worstDay =
    groupedDays.length > 0
      ? Math.min(
        ...groupedDays.map(
          (day) => day.pnl
        )
      )
      : 0;

  const averageDailyPnl =
    activeDays > 0
      ? totalMonthPnl /
      activeDays
      : 0;

  const averageTradesPerActiveDay =
    activeDays > 0
      ? totalMonthTrades /
      activeDays
      : 0;

  const bestDayEntry =
    Object.entries(grouped).sort(
      (a, b) => b[1].pnl - a[1].pnl
    )[0];

  const worstDayEntry =
    Object.entries(grouped).sort(
      (a, b) => a[1].pnl - b[1].pnl
    )[0];

  const bestDayLabel =
    bestDayEntry
      ? `${bestDayEntry[0]} ${monthName}`
      : "-";

  const worstDayLabel =
    worstDayEntry
      ? `${worstDayEntry[0]} ${monthName}`
      : "-";

  const weekdays = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(
        2026,
        5,
        1 + index
      );

      return new Intl.DateTimeFormat(
        locale,
        {
          weekday: "short",
        }
      ).format(date);
    }
  );

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const adjustedFirstDay =
    firstDay === 0
      ? 6
      : firstDay - 1;

  const endEmptyDays =
    (7 -
      ((adjustedFirstDay + days) %
        7)) %
    7;

  const isCurrentMonth =
    now.getMonth() === month &&
    now.getFullYear() === year;

  const formattedTotalMonthPnl =
    formatCurrencyByLanguage(
      totalMonthPnl,
      currency,
      language
    );

  const formattedAverageDailyPnl =
    formatCurrencyByLanguage(
      averageDailyPnl,
      currency,
      language
    );

  const formattedBestDay =
    formatCurrencyByLanguage(
      bestDay,
      currency,
      language
    );

  const formattedWorstDay =
    formatCurrencyByLanguage(
      worstDay,
      currency,
      language
    );

  const directionLabel =
    totalMonthPnl > 0
      ? t.positive
      : totalMonthPnl < 0
        ? t.negative
        : t.flat;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.08),transparent_35%)]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-300">
                {t.tradingCalendar}
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                {account.name}
              </span>

              {isCurrentMonth && (
                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  {t.currentMonth}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-400">
              {t.monthlyPerformanceView}
            </p>

            <h1 className="mt-3 text-3xl font-black capitalize tracking-tight break-words text-white sm:text-6xl">
              {monthLabel}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400">
              {t.heroDescription}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/accounts/${accountId}`}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
            >
              {t.backToAccountHub}
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href={`/accounts/${accountId}/calendar?month=${previousMonth}&year=${previousYear}`}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08]"
                aria-label={t.previousMonth}
              >
                <ChevronLeft size={20} />
              </Link>

              <Link
                href={`/accounts/${accountId}/calendar?month=${nextMonth}&year=${nextYear}`}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08]"
                aria-label={t.nextMonth}
              >
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t.monthlyPnl}
          value={formattedTotalMonthPnl}
          description={`${activeDays} ${t.activeDays} · ${totalMonthTrades} ${t.trades}`}
          tone={getResultTone(totalMonthPnl)}
        />

        <StatCard
          label={t.averageDaily}
          value={formattedAverageDailyPnl}
          description={t.averageDailyDescription}
          tone={getResultTone(averageDailyPnl)}
        />

        <StatCard
          label={t.bestDay}
          value={formattedBestDay}
          description={bestDayLabel}
          tone="text-green-400"
        />

        <StatCard
          label={t.worstDay}
          value={formattedWorstDay}
          description={worstDayLabel}
          tone="text-red-400"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <TrendingUp
              className="text-green-400"
              size={21}
            />
            <p className="text-sm text-gray-400">
              {t.positiveDays}
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-black text-green-400">
            {positiveDays}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <TrendingDown
              className="text-red-400"
              size={21}
            />
            <p className="text-sm text-gray-400">
              {t.negativeDays}
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-black text-red-400">
            {negativeDays}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Minus
              className="text-yellow-300"
              size={21}
            />
            <p className="text-sm text-gray-400">
              {t.flatDays}
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-black text-yellow-300">
            {flatDays}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Flame
              className="text-cyan-300"
              size={21}
            />
            <p className="text-sm text-gray-400">
              {t.avgTradesPerActiveDay}
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-black text-cyan-300">
            {formatNumber(
              averageTradesPerActiveDay,
              language
            )}
          </h2>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              {t.calendarMatrix}
            </p>

            <h2 className="mt-1 text-3xl font-black capitalize text-white">
              {t.monthPerformance(
                monthName
              )}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
            <div className="flex items-center gap-2">
              <CircleDot
                size={14}
                className="text-green-400"
              />
              {t.profit}
            </div>

            <div className="flex items-center gap-2">
              <CircleDot
                size={14}
                className="text-red-400"
              />
              {t.loss}
            </div>

            <div className="flex items-center gap-2">
              <CircleDot
                size={14}
                className="text-gray-500"
              />
              {t.noResult}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[840px] overflow-hidden rounded-3xl border border-white/10">
            <div className="grid grid-cols-7 border-b border-white/10 bg-black/20">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="border-r border-white/10 p-4 text-center text-sm font-black uppercase tracking-[0.14em] text-gray-500 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 bg-black/10">
              {Array.from({
                length:
                  adjustedFirstDay,
              }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="min-h-[150px] border-r border-b border-white/10 bg-black/20"
                />
              ))}

              {Array.from({
                length: days,
              }).map((_, index) => {
                const day = index + 1;

                const data =
                  grouped[day];

                const pnl =
                  data?.pnl || 0;

                const tradesCount =
                  data?.trades || 0;

                const positive =
                  pnl > 0;

                const negative =
                  pnl < 0;

                const intensity =
                  Math.min(
                    Math.abs(pnl) / 500,
                    1
                  );

                const isToday =
                  now.getDate() ===
                  day &&
                  now.getMonth() ===
                  month &&
                  now.getFullYear() ===
                  year;

                return (
                  <div
                    key={day}
                    className={`group relative min-h-[150px] border-r border-b border-white/10 p-4 transition-all duration-300 last:border-r-0 hover:z-10 hover:scale-[1.02] ${positive
                        ? "bg-green-500/10"
                        : negative
                          ? "bg-red-500/10"
                          : "bg-transparent"
                      }`}
                    style={{
                      backgroundColor: positive
                        ? `rgba(34,197,94,${0.06 +
                        intensity * 0.18
                        })`
                        : negative
                          ? `rgba(239,68,68,${0.06 +
                          intensity * 0.18
                          })`
                          : undefined,
                    }}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100 ${positive
                          ? "bg-green-500/10"
                          : negative
                            ? "bg-red-500/10"
                            : "bg-white/5"
                        }`}
                    />

                    <div className="relative mb-5 flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${isToday
                            ? "bg-white text-black"
                            : "bg-white/5 text-white"
                          }`}
                      >
                        {day}
                      </div>

                      <div
                        className={`h-2.5 w-2.5 rounded-full ${positive
                            ? "bg-green-400"
                            : negative
                              ? "bg-red-400"
                              : "bg-gray-500"
                          }`}
                      />
                    </div>

                    <div className="relative space-y-2">
                      <p
                        className={`text-sm font-black ${positive
                            ? "text-green-400"
                            : negative
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                      >
                        {formatCurrencyByLanguage(
                          pnl,
                          currency,
                          language
                        )}
                      </p>

                      <p className="text-xs text-gray-500">
                        {tradesCount} {t.trades}
                      </p>

                      {data && (
                        <p className="text-xs text-gray-600">
                          {data.wins}
                          {t.winsShort} /{" "}
                          {data.losses}
                          {t.lossesShort} /{" "}
                          {data.be}
                          {t.beShort}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {Array.from({
                length: endEmptyDays,
              }).map((_, index) => (
                <div
                  key={`end-empty-${index}`}
                  className="min-h-[150px] border-r border-b border-white/10 bg-black/20"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-center gap-3">
          <CalendarDays
            className="text-cyan-300"
            size={22}
          />

          <div>
            <p className="text-sm text-gray-400">
              {t.monthlySummary}
            </p>

            <h2 className="text-2xl font-black text-white">
              {t.whatThisMonthShows}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.activity}
            </p>

            <h3 className="mt-3 text-3xl font-black text-white">
              {activeDays}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {t.activityDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.direction}
            </p>

            <h3
              className={`mt-3 text-3xl font-black ${getResultTone(
                totalMonthPnl
              )}`}
            >
              {directionLabel}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {t.directionDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.totalTrades}
            </p>

            <h3 className="mt-3 text-3xl font-black text-cyan-300">
              {totalMonthTrades}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {t.totalTradesDescription}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
