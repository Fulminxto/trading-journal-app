import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import AnalyticsStatCard from "@/components/analytics/AnalyticsStatCard";
import RiskConcentration from "@/components/analytics/RiskConcentration";
import QualityBreakdownRow from "@/components/analytics/QualityBreakdown";
import PsychologyTrendChart from "@/components/analytics/PsychologyTrendChart";
import SymbolPerformance from "@/components/analytics/SymbolPerformance";
import SessionPerformance from "@/components/analytics/SessionPerformance";
import PerformanceInsights from "@/components/analytics/PerformanceInsights";
import WeekdayHeatmap from "@/components/analytics/WeekdayHeatmap";

import {
  TrendingUp,
  TrendingDown,
  Target,
  CandlestickChart,
} from "lucide-react";

import {
  formatCurrencyByLanguage,
  getLocaleFromLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import ScopeBar from "@/components/ScopeBar";
import {
  parseScopeParams,
  getPeriodRange,
  getPeriodSuffix,
} from "@/lib/scope";

function getBestWinStreak(
  trades: {
    outcome?: string | null;
  }[]
) {
  let currentStreak = 0;
  let bestStreak = 0;

  for (const trade of trades) {
    if (trade.outcome === "win") {
      currentStreak += 1;
      bestStreak = Math.max(
        bestStreak,
        currentStreak
      );
    } else if (trade.outcome === "loss") {
      currentStreak = 0;
    }
  }

  return bestStreak;
}

type AnalyticsLabels = {
  profitFactor: string;
  bestWinStreak: string;
  averageWin: string;
  averageLoss: string;
  advancedStatsEyebrow: string;
  analyticsTitle: string;
  tradeDirectionEyebrow: string;
  longVsShort: string;
  longTrades: string;
  shortTrades: string;
  winrate: string;
  mistakesEyebrow: string;
  recurringMistakes: string;
  noMistakes: string;
  repeatedTimes: (count: number) => string;
  qualityBreakdownLabel: string;
  psychologySubtitle: string;
  psychologyTitle: string;
  trendLabel: string;
  trades: string;
  teamAnalyticsEyebrow: string;
  traderLeaderboard: string;
  traderFallback: string;
  monthlyPerformanceEyebrow: string;
  monthlyDashboard: string;
  bestMonth: string;
  worstMonth: string;
  greenMonths: string;
  redMonths: string;
  tradingPsychologyEyebrow: string;
  emotionalPerformance: string;
  pnl: string;
  wr: string;
  wins: string;
  totalPnl: string;
  lowConfidence: string;
  mediumConfidence: string;
  highConfidence: string;
  weakExecution: string;
  averageExecution: string;
  eliteExecution: string;
  weakSetup: string;
  averageSetup: string;
  eliteSetup: string;
  weakSetups: string;
  emotionalTrades: string;
  psychology: string;
  confidence: string;
  execution: string;
  setupQuality: string;
  noEmotionalStates: string;
};

const analyticsLabels: Record<
  AppLanguage,
  AnalyticsLabels
> = {
  it: {
    profitFactor: "Profit Factor",
    bestWinStreak: "Migliore serie di win",
    averageWin: "Win media",
    averageLoss: "Loss media",
    advancedStatsEyebrow: "Statistiche avanzate",
    analyticsTitle: "Analytics",
    tradeDirectionEyebrow: "Direzione trade",
    longVsShort: "Long vs Short",
    longTrades: "Trade Long",
    shortTrades: "Trade Short",
    winrate: "winrate",
    mistakesEyebrow: "Analisi errori",
    recurringMistakes: "Errori ricorrenti",
    noMistakes: "Nessun errore registrato nei trade.",
    repeatedTimes: (count) =>
      `Ripetuto ${count} ${count === 1 ? "volta" : "volte"}`,
    qualityBreakdownLabel: "Qualità a confronto",
    psychologySubtitle: "Intelligence psicologica",
    psychologyTitle: "Psicologia trader",
    trendLabel: "Execution & Confidence nel tempo",
    trades: "trade",
    teamAnalyticsEyebrow: "Analytics team",
    traderLeaderboard: "Classifica trader",
    traderFallback: "Trader",
    monthlyPerformanceEyebrow: "Performance mensile",
    monthlyDashboard: "Dashboard mensile",
    bestMonth: "Mese migliore",
    worstMonth: "Mese peggiore",
    greenMonths: "Mesi positivi",
    redMonths: "Mesi negativi",
    tradingPsychologyEyebrow: "Psicologia trading",
    emotionalPerformance: "Performance emotiva",
    pnl: "PnL",
    wr: "WR",
    wins: "Win",
    totalPnl: "PnL totale",
    lowConfidence: "Bassa fiducia",
    mediumConfidence: "Fiducia media",
    highConfidence: "Alta fiducia",
    weakExecution: "Execution debole",
    averageExecution: "Execution media",
    eliteExecution: "Execution elite",
    weakSetup: "Setup debole",
    averageSetup: "Setup medio",
    eliteSetup: "Setup elite",
    weakSetups: "Setup deboli",
    emotionalTrades: "Trade emotivi",
    psychology: "Psicologia",
    confidence: "Confidence",
    execution: "Execution",
    setupQuality: "Qualità setup",
    noEmotionalStates: "Nessuno stato emotivo registrato.",
  },

  en: {
    profitFactor: "Profit Factor",
    bestWinStreak: "Best Win Streak",
    averageWin: "Average Win",
    averageLoss: "Average Loss",
    advancedStatsEyebrow: "Advanced statistics",
    analyticsTitle: "Analytics",
    tradeDirectionEyebrow: "Trade Direction",
    longVsShort: "Long vs Short",
    longTrades: "Long Trades",
    shortTrades: "Short Trades",
    winrate: "winrate",
    mistakesEyebrow: "Mistakes Analytics",
    recurringMistakes: "Recurring mistakes",
    noMistakes: "No mistakes recorded in trades.",
    repeatedTimes: (count) =>
      `Repeated ${count} ${count === 1 ? "time" : "times"}`,
    qualityBreakdownLabel: "Quality Breakdown",
    psychologySubtitle: "Psychology intelligence",
    psychologyTitle: "Trader Psychology",
    trendLabel: "Execution & Confidence Over Time",
    trades: "trades",
    teamAnalyticsEyebrow: "Team Analytics",
    traderLeaderboard: "Trader Leaderboard",
    traderFallback: "Trader",
    monthlyPerformanceEyebrow: "Monthly Performance",
    monthlyDashboard: "Monthly Dashboard",
    bestMonth: "Best Month",
    worstMonth: "Worst Month",
    greenMonths: "Green Months",
    redMonths: "Red Months",
    tradingPsychologyEyebrow: "Trading Psychology",
    emotionalPerformance: "Emotional Performance",
    pnl: "PnL",
    wr: "WR",
    wins: "Wins",
    totalPnl: "Total PnL",
    lowConfidence: "Low Confidence",
    mediumConfidence: "Medium Confidence",
    highConfidence: "High Confidence",
    weakExecution: "Weak Execution",
    averageExecution: "Average Execution",
    eliteExecution: "Elite Execution",
    weakSetup: "Weak Setup",
    averageSetup: "Average Setup",
    eliteSetup: "Elite Setup",
    weakSetups: "Weak Setups",
    emotionalTrades: "Emotional Trades",
    psychology: "Psychology",
    confidence: "Confidence",
    execution: "Execution",
    setupQuality: "Setup Quality",
    noEmotionalStates: "No emotional state recorded.",
  },

  uk: {
    profitFactor: "Profit Factor",
    bestWinStreak: "Найкраща серія win",
    averageWin: "Середній виграш",
    averageLoss: "Середній збиток",
    advancedStatsEyebrow: "Розширена статистика",
    analyticsTitle: "Аналітика",
    tradeDirectionEyebrow: "Напрямок угод",
    longVsShort: "Long vs Short",
    longTrades: "Long угоди",
    shortTrades: "Short угоди",
    winrate: "winrate",
    mistakesEyebrow: "Аналітика помилок",
    recurringMistakes: "Повторювані помилки",
    noMistakes: "У трейдах ще не зафіксовано помилок.",
    repeatedTimes: (count) =>
      `Повторено ${count} ${count === 1 ? "раз" : "рази"}`,
    qualityBreakdownLabel: "Порівняння якості",
    psychologySubtitle: "Психологічна аналітика",
    psychologyTitle: "Психологія трейдера",
    trendLabel: "Execution і Confidence у часі",
    trades: "угод",
    teamAnalyticsEyebrow: "Аналітика команди",
    traderLeaderboard: "Рейтинг трейдерів",
    traderFallback: "Трейдер",
    monthlyPerformanceEyebrow: "Місячна performance",
    monthlyDashboard: "Місячна dashboard",
    bestMonth: "Найкращий місяць",
    worstMonth: "Найгірший місяць",
    greenMonths: "Позитивні місяці",
    redMonths: "Негативні місяці",
    tradingPsychologyEyebrow: "Психологія трейдингу",
    emotionalPerformance: "Емоційна performance",
    pnl: "PnL",
    wr: "WR",
    wins: "Win",
    totalPnl: "Загальний PnL",
    lowConfidence: "Низька впевненість",
    mediumConfidence: "Середня впевненість",
    highConfidence: "Висока впевненість",
    weakExecution: "Слабке виконання",
    averageExecution: "Середнє виконання",
    eliteExecution: "Elite виконання",
    weakSetup: "Слабкий сетап",
    averageSetup: "Середній сетап",
    eliteSetup: "Elite сетап",
    weakSetups: "Слабкі сетапи",
    emotionalTrades: "Емоційні угоди",
    psychology: "Психологія",
    confidence: "Впевненість",
    execution: "Виконання",
    setupQuality: "Якість сетапу",
    noEmotionalStates: "Емоційні стани ще не зареєстровані.",
  },

  ru: {
    profitFactor: "Profit Factor",
    bestWinStreak: "Лучшая серия побед",
    averageWin: "Средний выигрыш",
    averageLoss: "Средний убыток",
    advancedStatsEyebrow: "Расширенная статистика",
    analyticsTitle: "Аналитика",
    tradeDirectionEyebrow: "Направление сделок",
    longVsShort: "Long vs Short",
    longTrades: "Long сделки",
    shortTrades: "Short сделки",
    winrate: "winrate",
    mistakesEyebrow: "Аналитика ошибок",
    recurringMistakes: "Повторяющиеся ошибки",
    noMistakes: "В сделках пока нет зарегистрированных ошибок.",
    repeatedTimes: (count) =>
      `Повторено ${count} ${count === 1 ? "раз" : "раза"}`,
    qualityBreakdownLabel: "Сравнение качества",
    psychologySubtitle: "Психологическая аналитика",
    psychologyTitle: "Психология трейдера",
    trendLabel: "Execution и Confidence во времени",
    trades: "сделок",
    teamAnalyticsEyebrow: "Аналитика команды",
    traderLeaderboard: "Рейтинг трейдеров",
    traderFallback: "Трейдер",
    monthlyPerformanceEyebrow: "Месячная performance",
    monthlyDashboard: "Месячная dashboard",
    bestMonth: "Лучший месяц",
    worstMonth: "Худший месяц",
    greenMonths: "Положительные месяцы",
    redMonths: "Отрицательные месяцы",
    tradingPsychologyEyebrow: "Психология трейдинга",
    emotionalPerformance: "Эмоциональная performance",
    pnl: "PnL",
    wr: "WR",
    wins: "Win",
    totalPnl: "Общий PnL",
    lowConfidence: "Низкая уверенность",
    mediumConfidence: "Средняя уверенность",
    highConfidence: "Высокая уверенность",
    weakExecution: "Слабое исполнение",
    averageExecution: "Среднее исполнение",
    eliteExecution: "Elite исполнение",
    weakSetup: "Слабый сетап",
    averageSetup: "Средний сетап",
    eliteSetup: "Elite сетап",
    weakSetups: "Слабые сетапы",
    emotionalTrades: "Эмоциональные сделки",
    psychology: "Психология",
    confidence: "Уверенность",
    execution: "Исполнение",
    setupQuality: "Качество сетапа",
    noEmotionalStates: "Эмоциональные состояния еще не зарегистрированы.",
  },

  es: {
    profitFactor: "Profit Factor",
    bestWinStreak: "Mejor racha ganadora",
    averageWin: "Ganancia media",
    averageLoss: "Pérdida media",
    advancedStatsEyebrow: "Estadísticas avanzadas",
    analyticsTitle: "Analítica",
    tradeDirectionEyebrow: "Dirección del trade",
    longVsShort: "Long vs Short",
    longTrades: "Trades Long",
    shortTrades: "Trades Short",
    winrate: "winrate",
    mistakesEyebrow: "Analítica de errores",
    recurringMistakes: "Errores recurrentes",
    noMistakes: "No hay errores registrados en los trades.",
    repeatedTimes: (count) =>
      `Repetido ${count} ${count === 1 ? "vez" : "veces"}`,
    qualityBreakdownLabel: "Comparativa de calidad",
    psychologySubtitle: "Intelligence psicológica",
    psychologyTitle: "Psicología del trader",
    trendLabel: "Execution y Confidence en el tiempo",
    trades: "trades",
    teamAnalyticsEyebrow: "Analítica del equipo",
    traderLeaderboard: "Ranking de traders",
    traderFallback: "Trader",
    monthlyPerformanceEyebrow: "Performance mensual",
    monthlyDashboard: "Dashboard mensual",
    bestMonth: "Mejor mes",
    worstMonth: "Peor mes",
    greenMonths: "Meses positivos",
    redMonths: "Meses negativos",
    tradingPsychologyEyebrow: "Psicología del trading",
    emotionalPerformance: "Performance emocional",
    pnl: "PnL",
    wr: "WR",
    wins: "Ganadas",
    totalPnl: "PnL total",
    lowConfidence: "Baja confianza",
    mediumConfidence: "Confianza media",
    highConfidence: "Alta confianza",
    weakExecution: "Ejecución débil",
    averageExecution: "Ejecución media",
    eliteExecution: "Ejecución elite",
    weakSetup: "Setup débil",
    averageSetup: "Setup medio",
    eliteSetup: "Setup elite",
    weakSetups: "Setups débiles",
    emotionalTrades: "Trades emocionales",
    psychology: "Psicología",
    confidence: "Confianza",
    execution: "Ejecución",
    setupQuality: "Calidad del setup",
    noEmotionalStates: "No hay estados emocionales registrados.",
  },

  fr: {
    profitFactor: "Profit Factor",
    bestWinStreak: "Meilleure série de gains",
    averageWin: "Gain moyen",
    averageLoss: "Perte moyenne",
    advancedStatsEyebrow: "Statistiques avancées",
    analyticsTitle: "Analytics",
    tradeDirectionEyebrow: "Direction des trades",
    longVsShort: "Long vs Short",
    longTrades: "Trades Long",
    shortTrades: "Trades Short",
    winrate: "winrate",
    mistakesEyebrow: "Analyse des erreurs",
    recurringMistakes: "Erreurs récurrentes",
    noMistakes: "Aucune erreur enregistrée dans les trades.",
    repeatedTimes: (count) =>
      `Répété ${count} ${count === 1 ? "fois" : "fois"}`,
    qualityBreakdownLabel: "Comparatif de qualité",
    psychologySubtitle: "Intelligence psychologique",
    psychologyTitle: "Psychologie du trader",
    trendLabel: "Execution & Confidence dans le temps",
    trades: "trades",
    teamAnalyticsEyebrow: "Analytics équipe",
    traderLeaderboard: "Classement des traders",
    traderFallback: "Trader",
    monthlyPerformanceEyebrow: "Performance mensuelle",
    monthlyDashboard: "Dashboard mensuel",
    bestMonth: "Meilleur mois",
    worstMonth: "Pire mois",
    greenMonths: "Mois positifs",
    redMonths: "Mois négatifs",
    tradingPsychologyEyebrow: "Psychologie du trading",
    emotionalPerformance: "Performance émotionnelle",
    pnl: "PnL",
    wr: "WR",
    wins: "Gagnants",
    totalPnl: "PnL total",
    lowConfidence: "Faible confiance",
    mediumConfidence: "Confiance moyenne",
    highConfidence: "Haute confiance",
    weakExecution: "Exécution faible",
    averageExecution: "Exécution moyenne",
    eliteExecution: "Exécution elite",
    weakSetup: "Setup faible",
    averageSetup: "Setup moyen",
    eliteSetup: "Setup elite",
    weakSetups: "Setups faibles",
    emotionalTrades: "Trades émotionnels",
    psychology: "Psychologie",
    confidence: "Confiance",
    execution: "Exécution",
    setupQuality: "Qualité du setup",
    noEmotionalStates: "Aucun état émotionnel enregistré.",
  },

  de: {
    profitFactor: "Profit Factor",
    bestWinStreak: "Beste Gewinnserie",
    averageWin: "Durchschnittlicher Gewinn",
    averageLoss: "Durchschnittlicher Verlust",
    advancedStatsEyebrow: "Erweiterte Statistiken",
    analyticsTitle: "Analytics",
    tradeDirectionEyebrow: "Trade-Richtung",
    longVsShort: "Long vs Short",
    longTrades: "Long Trades",
    shortTrades: "Short Trades",
    winrate: "Winrate",
    mistakesEyebrow: "Fehleranalyse",
    recurringMistakes: "Wiederkehrende Fehler",
    noMistakes: "Keine Fehler in den Trades erfasst.",
    repeatedTimes: (count) =>
      `${count} ${count === 1 ? "Mal" : "Mal"} wiederholt`,
    qualityBreakdownLabel: "Qualitätsvergleich",
    psychologySubtitle: "Psychologie Intelligence",
    psychologyTitle: "Trader-Psychologie",
    trendLabel: "Execution & Confidence im Zeitverlauf",
    trades: "Trades",
    teamAnalyticsEyebrow: "Team Analytics",
    traderLeaderboard: "Trader-Rangliste",
    traderFallback: "Trader",
    monthlyPerformanceEyebrow: "Monatliche Performance",
    monthlyDashboard: "Monatliches Dashboard",
    bestMonth: "Bester Monat",
    worstMonth: "Schlechtester Monat",
    greenMonths: "Positive Monate",
    redMonths: "Negative Monate",
    tradingPsychologyEyebrow: "Trading-Psychologie",
    emotionalPerformance: "Emotionale Performance",
    pnl: "PnL",
    wr: "WR",
    wins: "Gewinne",
    totalPnl: "Gesamt-PnL",
    lowConfidence: "Geringes Vertrauen",
    mediumConfidence: "Mittleres Vertrauen",
    highConfidence: "Hohes Vertrauen",
    weakExecution: "Schwache Ausführung",
    averageExecution: "Durchschnittliche Ausführung",
    eliteExecution: "Elite-Ausführung",
    weakSetup: "Schwaches Setup",
    averageSetup: "Durchschnittliches Setup",
    eliteSetup: "Elite-Setup",
    weakSetups: "Schwache Setups",
    emotionalTrades: "Emotionale Trades",
    psychology: "Psychologie",
    confidence: "Vertrauen",
    execution: "Ausführung",
    setupQuality: "Setup-Qualität",
    noEmotionalStates: "Noch kein emotionaler Zustand erfasst.",
  },
};

function SubCaption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-black uppercase tracking-[0.15em] text-muted-faint">
      {children}
    </p>
  );
}

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>;
  searchParams: Promise<{ member?: string; period?: string; ref?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;
  const filters = await searchParams;
  const selectedMemberId = filters.member || undefined;
  const { period, ref } = parseScopeParams({
    period: filters.period,
    ref: filters.ref,
  });

  const membership =
    await prisma.accountMember.findFirst({
      where: {
        userId: session.user.id,
        tradingAccountId: accountId,
      },

      include: {
        tradingAccount: true,
      },
    });

  if (!membership) {
    redirect("/accounts");
  }

  if (
    membership.role !== "MANAGER" &&
    !membership.canViewAnalytics
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    membership.tradingAccount.status === "ARCHIVED"
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  const account = membership.tradingAccount;

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      appLanguage: true,
      timezone: true,
    },
  });

  const language = normalizeAppLanguage(
    currentUser?.appLanguage
  );

  const locale = getLocaleFromLanguage(language);
  const t = analyticsLabels[language];

  const formatCurrency = (
    value: number,
    currency: string = account.currency
  ) =>
    formatCurrencyByLanguage(
      value,
      currency,
      language
    );

  const accountMembers =
    await prisma.accountMember.findMany({
      where: {
        tradingAccountId: accountId,
      },

      include: {
        user: true,
      },
    });

  const isSharedAccount =
    accountMembers.length > 1;

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
      ...(selectedMemberId ? { createdById: selectedMemberId } : {}),
    },

    include: {
      createdBy: true,
    },

    orderBy: {
      openDate: "asc",
    },
  });

  const dateRange = getPeriodRange(
    period,
    ref,
    currentUser?.timezone ?? undefined,
  );

  const periodTrades = dateRange
    ? trades.filter(
        (trade) =>
          trade.openDate >= dateRange.gte &&
          trade.openDate < dateRange.lte,
      )
    : trades;

  const periodSuffix = getPeriodSuffix(period, ref, language);

  const wins = periodTrades.filter(
    (trade) => trade.outcome === "win"
  );

  const losses = periodTrades.filter(
    (trade) => trade.outcome === "loss"
  );

  const longTrades = periodTrades.filter(
    (trade) =>
      trade.direction?.toLowerCase() ===
      "long"
  );

  const shortTrades = periodTrades.filter(
    (trade) =>
      trade.direction?.toLowerCase() ===
      "short"
  );

  const totalPnl = periodTrades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const grossProfit = wins.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const grossLoss = losses.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const averageWin =
    wins.length > 0
      ? grossProfit / wins.length
      : 0;

  const averageLoss =
    losses.length > 0
      ? grossLoss / losses.length
      : 0;

  const profitFactor =
    Math.abs(grossLoss) > 0
      ? grossProfit / Math.abs(grossLoss)
      : grossProfit > 0
        ? grossProfit
        : 0;

  const bestWinStreak =
    getBestWinStreak(periodTrades);

  const averageRR =
    periodTrades.length > 0
      ? periodTrades.reduce(
        (acc, trade) =>
          acc +
          (trade.riskReward || 0),
        0
      ) / periodTrades.length
      : 0;

  const symbolStats: Record<
    string,
    {
      trades: number;
      pnl: number;
    }
  > = {};

  for (const trade of periodTrades) {
    const symbol = trade.symbol;

    if (!symbolStats[symbol]) {
      symbolStats[symbol] = {
        trades: 0,
        pnl: 0,
      };
    }

    symbolStats[symbol].trades += 1;

    symbolStats[symbol].pnl +=
      trade.resultUsd || 0;
  }

  const bestSymbol =
    Object.entries(symbolStats).sort(
      (a, b) =>
        b[1].pnl - a[1].pnl
    )[0];

  const worstSymbol =
    Object.entries(symbolStats).sort(
      (a, b) =>
        a[1].pnl - b[1].pnl
    )[0];

  const mostTraded =
    Object.entries(symbolStats).sort(
      (a, b) =>
        b[1].trades - a[1].trades
    )[0];

  const mistakesStats: Record<
    string,
    {
      count: number;
      pnl: number;
    }
  > = {};

  for (const trade of periodTrades) {
    if (!trade.mistakes) {
      continue;
    }

    const mistakes =
      trade.mistakes
        .split(",")
        .map((mistake) =>
          mistake.trim()
        )
        .filter(Boolean);

    for (const mistake of mistakes) {
      if (!mistakesStats[mistake]) {
        mistakesStats[mistake] = {
          count: 0,
          pnl: 0,
        };
      }

      mistakesStats[mistake].count += 1;

      mistakesStats[mistake].pnl +=
        trade.resultUsd || 0;
    }
  }

  const emotionalStats: Record<
    string,
    {
      trades: number;
      wins: number;
      pnl: number;
    }
  > = {};

  for (const trade of periodTrades) {
    if (!trade.emotionalState) {
      continue;
    }

    if (
      !emotionalStats[
      trade.emotionalState
      ]
    ) {
      emotionalStats[
        trade.emotionalState
      ] = {
        trades: 0,
        wins: 0,
        pnl: 0,
      };
    }

    emotionalStats[
      trade.emotionalState
    ].trades += 1;

    if (trade.outcome === "win") {
      emotionalStats[
        trade.emotionalState
      ].wins += 1;
    }

    emotionalStats[
      trade.emotionalState
    ].pnl +=
      trade.resultUsd || 0;
  }

  const winRate =
    periodTrades.length > 0
      ? (wins.length / periodTrades.length) * 100
      : 0;

  const longWinRate =
    longTrades.length > 0
      ? (longTrades.filter(
        (trade) =>
          trade.outcome === "win"
      ).length /
        longTrades.length) *
      100
      : 0;

  const shortWinRate =
    shortTrades.length > 0
      ? (shortTrades.filter(
        (trade) =>
          trade.outcome === "win"
      ).length /
        shortTrades.length) *
      100
      : 0;

  const monthlyStats: Record<
    string,
    {
      trades: number;
      wins: number;
      pnl: number;
    }
  > = {};

  for (const trade of periodTrades) {
    const month = new Date(
      trade.openDate
    ).toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    });

    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        trades: 0,
        wins: 0,
        pnl: 0,
      };
    }

    monthlyStats[month].trades += 1;

    if (trade.outcome === "win") {
      monthlyStats[month].wins += 1;
    }

    monthlyStats[month].pnl +=
      trade.resultUsd || 0;
  }

  const sessionStats: Record<
    string,
    {
      trades: number;
      wins: number;
      pnl: number;
    }
  > = {};

  for (const trade of periodTrades) {
    if (!trade.session) {
      continue;
    }

    if (!sessionStats[trade.session]) {
      sessionStats[trade.session] = {
        trades: 0,
        wins: 0,
        pnl: 0,
      };
    }

    sessionStats[trade.session].trades += 1;

    if (trade.outcome === "win") {
      sessionStats[trade.session].wins += 1;
    }

    sessionStats[trade.session].pnl +=
      trade.resultUsd || 0;
  }

  const setupQualityStats = {
    low: {
      trades: 0,
      wins: 0,
      pnl: 0,
    },

    medium: {
      trades: 0,
      wins: 0,
      pnl: 0,
    },

    high: {
      trades: 0,
      wins: 0,
      pnl: 0,
    },
  };

  for (const trade of periodTrades) {
    if (!trade.setupQuality) {
      continue;
    }

    let bucket:
      | "low"
      | "medium"
      | "high";

    if (trade.setupQuality <= 4) {
      bucket = "low";
    } else if (
      trade.setupQuality <= 7
    ) {
      bucket = "medium";
    } else {
      bucket = "high";
    }

    setupQualityStats[
      bucket
    ].trades += 1;

    if (trade.outcome === "win") {
      setupQualityStats[
        bucket
      ].wins += 1;
    }

    setupQualityStats[
      bucket
    ].pnl +=
      trade.resultUsd || 0;
  }

  const traderStats: Record<
    string,
    {
      name: string;
      trades: number;
      wins: number;
      pnl: number;
    }
  > = {};

  for (const trade of periodTrades) {
    const traderId =
      trade.createdById;

    const traderName =
      trade.createdBy?.username ||
      trade.createdBy?.name ||
      t.traderFallback;

    if (!traderStats[traderId]) {
      traderStats[traderId] = {
        name: traderName,
        trades: 0,
        wins: 0,
        pnl: 0,
      };
    }

    traderStats[traderId].trades += 1;

    if (trade.outcome === "win") {
      traderStats[traderId].wins += 1;
    }

    traderStats[traderId].pnl +=
      trade.resultUsd || 0;
  }

  const monthlyEntries =
    Object.entries(monthlyStats);

  const greenMonths =
    monthlyEntries.filter(
      ([, stats]) => stats.pnl >= 0
    ).length;

  const redMonths =
    monthlyEntries.filter(
      ([, stats]) => stats.pnl < 0
    ).length;

  const bestMonth =
    monthlyEntries.sort(
      (a, b) => b[1].pnl - a[1].pnl
    )[0];

  const worstMonth =
    monthlyEntries.sort(
      (a, b) => a[1].pnl - b[1].pnl
    )[0];

  // ── Advanced stats (Dashboard-exclusive economics) ───────────────────────

  const advancedStats = [
    {
      label: t.profitFactor + periodSuffix,
      value: profitFactor.toFixed(2),
      tone:
        profitFactor >= 1
          ? "text-green-400"
          : "text-red-400",
      icon: CandlestickChart,
    },
    {
      label: t.bestWinStreak + periodSuffix,
      value: bestWinStreak,
      tone: "text-white",
      icon: Target,
    },
    {
      label: t.averageWin + periodSuffix,
      value: formatCurrency(averageWin),
      tone: "text-green-400",
      icon: TrendingUp,
    },
    {
      label: t.averageLoss + periodSuffix,
      value: formatCurrency(Math.abs(averageLoss)),
      tone: "text-red-400",
      icon: TrendingDown,
    },
  ];

  // ── Weekday breakdown ─────────────────────────────────────────────────

  const weekdayMap = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  periodTrades.forEach((trade) => {
    const date = new Date(trade.openDate);

    const day = date.toLocaleDateString(
      "en-US",
      {
        weekday: "short",
      }
    );

    if (
      day in weekdayMap &&
      typeof trade.resultUsd === "number"
    ) {
      weekdayMap[
        day as keyof typeof weekdayMap
      ] += trade.resultUsd;
    }
  });

  const weekdayHeatmapData = Object.entries(
    weekdayMap
  ).map(([day, pnl]) => ({
    day,
    pnl,
  }));

  // ── Quality breakdown (confidence / execution / setup) ──────────────────

  const confidenceHeatmapData = [
    {
      level: t.lowConfidence,
      count: periodTrades.filter(
        (trade) =>
          (trade.confidence || 0) > 0 &&
          (trade.confidence || 0) <= 4
      ).length,
      pnl: periodTrades
        .filter(
          (trade) =>
            (trade.confidence || 0) > 0 &&
            (trade.confidence || 0) <= 4
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
    {
      level: t.mediumConfidence,
      count: periodTrades.filter(
        (trade) =>
          (trade.confidence || 0) >= 5 &&
          (trade.confidence || 0) <= 7
      ).length,
      pnl: periodTrades
        .filter(
          (trade) =>
            (trade.confidence || 0) >= 5 &&
            (trade.confidence || 0) <= 7
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
    {
      level: t.highConfidence,
      count: periodTrades.filter(
        (trade) =>
          (trade.confidence || 0) >= 8
      ).length,
      pnl: periodTrades
        .filter(
          (trade) =>
            (trade.confidence || 0) >= 8
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
  ];

  const executionHeatmapData = [
    {
      level: t.weakExecution,
      count: periodTrades.filter(
        (trade) =>
          (trade.executionRating || 0) > 0 &&
          (trade.executionRating || 0) <= 4
      ).length,
      pnl: periodTrades
        .filter(
          (trade) =>
            (trade.executionRating || 0) > 0 &&
            (trade.executionRating || 0) <= 4
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
    {
      level: t.averageExecution,
      count: periodTrades.filter(
        (trade) =>
          (trade.executionRating || 0) >= 5 &&
          (trade.executionRating || 0) <= 7
      ).length,
      pnl: periodTrades
        .filter(
          (trade) =>
            (trade.executionRating || 0) >= 5 &&
            (trade.executionRating || 0) <= 7
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
    {
      level: t.eliteExecution,
      count: periodTrades.filter(
        (trade) =>
          (trade.executionRating || 0) >= 8
      ).length,
      pnl: periodTrades
        .filter(
          (trade) =>
            (trade.executionRating || 0) >= 8
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
  ];

  const setupHeatmapData = [
    {
      level: t.weakSetup,
      count: setupQualityStats.low.trades,
      pnl: setupQualityStats.low.pnl,
    },
    {
      level: t.averageSetup,
      count: setupQualityStats.medium.trades,
      pnl: setupQualityStats.medium.pnl,
    },
    {
      level: t.eliteSetup,
      count: setupQualityStats.high.trades,
      pnl: setupQualityStats.high.pnl,
    },
  ];

  const avgConfidence =
    periodTrades.length > 0
      ? Math.round(
        periodTrades.reduce(
          (acc, trade) =>
            acc + (trade.confidence || 0),
          0
        ) / periodTrades.length
      )
      : 0;

  const avgExecution =
    periodTrades.length > 0
      ? Math.round(
        periodTrades.reduce(
          (acc, trade) =>
            acc + (trade.executionRating || 0),
          0
        ) / periodTrades.length
      )
      : 0;

  const avgSetupQuality =
    periodTrades.length > 0
      ? Math.round(
        periodTrades.reduce(
          (acc, trade) =>
            acc + (trade.setupQuality || 0),
          0
        ) / periodTrades.length
      )
      : 0;

  // ── Risk concentration (behavioral) ─────────────────────────────────────

  function getRiskSeverity(
    count: number,
    total: number
  ): "low" | "medium" | "high" {
    if (total === 0) {
      return "low";
    }

    const ratio = count / total;

    if (ratio >= 0.4) {
      return "high";
    }

    if (ratio >= 0.2) {
      return "medium";
    }

    return "low";
  }

  const lowConfidenceCount = periodTrades.filter(
    (trade) =>
      (trade.confidence || 0) > 0 &&
      (trade.confidence || 0) <= 4
  ).length;

  const weakExecutionCount = periodTrades.filter(
    (trade) =>
      (trade.executionRating || 0) > 0 &&
      (trade.executionRating || 0) <= 4
  ).length;

  const weakSetupCount = periodTrades.filter(
    (trade) =>
      (trade.setupQuality || 0) > 0 &&
      (trade.setupQuality || 0) <= 4
  ).length;

  const emotionalCount = periodTrades.filter(
    (trade) =>
      trade.emotionalState &&
      trade.emotionalState.length > 0
  ).length;

  const behavioralRiskData = [
    {
      factor: t.lowConfidence,
      count: lowConfidenceCount,
      severity: getRiskSeverity(
        lowConfidenceCount,
        periodTrades.length
      ),
    },
    {
      factor: t.weakExecution,
      count: weakExecutionCount,
      severity: getRiskSeverity(
        weakExecutionCount,
        periodTrades.length
      ),
    },
    {
      factor: t.weakSetups,
      count: weakSetupCount,
      severity: getRiskSeverity(
        weakSetupCount,
        periodTrades.length
      ),
    },
    {
      factor: t.emotionalTrades,
      count: emotionalCount,
      severity: getRiskSeverity(
        emotionalCount,
        periodTrades.length
      ),
    },
  ];

  // ── Psychology trend: execution + confidence, one chart ─────────────────

  const psychologyTrendData = periodTrades.map((trade) => ({
    date: new Date(trade.openDate).toLocaleDateString(
      locale,
      {
        day: "2-digit",
        month: "2-digit",
      }
    ),
    execution:
      typeof trade.executionRating === "number"
        ? trade.executionRating
        : null,
    confidence:
      typeof trade.confidence === "number"
        ? trade.confidence
        : null,
  }));

  const hasPsychologyTrend = psychologyTrendData.some(
    (point) => point.execution !== null || point.confidence !== null
  );

  const scopeMembers = isSharedAccount
    ? accountMembers.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        username: m.user.username,
      }))
    : undefined;

  return (
    <div className="space-y-8">
      <ScopeBar
        accountId={accountId}
        members={scopeMembers}
        selectedMemberId={selectedMemberId}
        currentPeriod={period}
        currentRef={ref}
        appLanguage={language}
      />

      <div className="reveal-rise" style={{ animationDelay: "0ms" }}>
        <div className="flex items-center gap-3">
          <SignatureEdge orientation="vertical" className="h-4" />
          <p className="text-sm text-muted">{t.advancedStatsEyebrow}</p>
        </div>

        <h1 className="mt-1 text-hero">{t.analyticsTitle}</h1>
      </div>

      <div
        className="reveal-rise grid grid-cols-2 gap-4 xl:grid-cols-4"
        style={{ animationDelay: "60ms" }}
      >
        {advancedStats.map((stat) => (
          <AnalyticsStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            tone={stat.tone}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="reveal-rise" style={{ animationDelay: "100ms" }}>
        <RiskConcentration
          data={behavioralRiskData}
          appLanguage={language}
        />
      </div>

      <Card className="reveal-rise p-6 sm:p-10" style={{ animationDelay: "140ms" }}>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-faint">
          {t.psychologySubtitle}
        </p>
        <h2 className="mt-2 text-section text-white">
          {t.psychologyTitle}
        </h2>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Card variant="inner" className="p-4 text-center">
            <p className="text-xs text-muted">{t.confidence}</p>
            <h3 className="mt-2 text-2xl font-black text-accent-bright">
              {avgConfidence}
              <span className="text-sm text-muted-faint">/10</span>
            </h3>
          </Card>
          <Card variant="inner" className="p-4 text-center">
            <p className="text-xs text-muted">{t.execution}</p>
            <h3 className="mt-2 text-2xl font-black text-accent">
              {avgExecution}
              <span className="text-sm text-muted-faint">/10</span>
            </h3>
          </Card>
          <Card variant="inner" className="p-4 text-center">
            <p className="text-xs text-muted">{t.setupQuality}</p>
            <h3 className="mt-2 text-2xl font-black text-white">
              {avgSetupQuality}
              <span className="text-sm text-muted-faint">/10</span>
            </h3>
          </Card>
        </div>

        <div className="mt-8 space-y-5 border-t border-white/[0.06] pt-8">
          <SubCaption>{t.qualityBreakdownLabel}</SubCaption>

          <QualityBreakdownRow
            label={t.confidence}
            items={confidenceHeatmapData}
          />
          <QualityBreakdownRow
            label={t.execution}
            items={executionHeatmapData}
          />
          <QualityBreakdownRow
            label={t.setupQuality}
            items={setupHeatmapData}
          />
        </div>

        <div className="mt-8 border-t border-white/[0.06] pt-8">
          <SubCaption>{t.emotionalPerformance}</SubCaption>

          {Object.keys(emotionalStats).length === 0 ? (
            <p className="text-sm text-muted-faint">
              {t.noEmotionalStates}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {Object.entries(emotionalStats).map(([state, stats]) => {
                const stateWinRate =
                  stats.trades > 0
                    ? (stats.wins / stats.trades) * 100
                    : 0;

                return (
                  <Card key={state} variant="inner" className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white">{state}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          stateWinRate >= 50
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {stateWinRate.toFixed(0)}%
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      {stats.trades} {t.trades}
                    </p>
                    <p
                      className={`mt-1 text-sm font-bold ${
                        stats.pnl >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {formatCurrency(stats.pnl)}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-white/[0.06] pt-8">
          <SubCaption>{t.trendLabel}</SubCaption>

          {hasPsychologyTrend ? (
            <PsychologyTrendChart
              data={psychologyTrendData}
              executionLabel={t.execution}
              confidenceLabel={t.confidence}
            />
          ) : (
            <p className="text-sm text-muted-faint">
              {t.noEmotionalStates}
            </p>
          )}
        </div>
      </Card>

      <div
        className="reveal-rise grid grid-cols-1 gap-6 xl:grid-cols-2"
        style={{ animationDelay: "180ms" }}
      >
        <SymbolPerformance
          bestSymbol={bestSymbol}
          worstSymbol={worstSymbol}
          mostTraded={mostTraded}
          currency={account.currency}
          formatCurrency={formatCurrency}
          appLanguage={language}
        />

        <Card className="p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-faint">
            {t.tradeDirectionEyebrow}
          </p>
          <h2 className="mt-2 text-section text-white">
            {t.longVsShort}
          </h2>

          <div className="mt-6 space-y-3">
            <Card variant="inner" className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-muted">{t.longTrades}</p>
                <p className="font-bold text-white">{longTrades.length}</p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-accent-bright"
                  style={{ width: `${Math.min(longWinRate, 100)}%` }}
                />
              </div>

              <p
                className={`mt-2 text-sm font-semibold ${
                  longWinRate >= 50 ? "text-green-400" : "text-red-400"
                }`}
              >
                {longWinRate.toFixed(2)}% {t.winrate}
              </p>
            </Card>

            <Card variant="inner" className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-muted">{t.shortTrades}</p>
                <p className="font-bold text-white">{shortTrades.length}</p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.min(shortWinRate, 100)}%` }}
                />
              </div>

              <p
                className={`mt-2 text-sm font-semibold ${
                  shortWinRate >= 50 ? "text-green-400" : "text-red-400"
                }`}
              >
                {shortWinRate.toFixed(2)}% {t.winrate}
              </p>
            </Card>
          </div>
        </Card>
      </div>

      <div
        className="reveal-rise"
        style={{ animationDelay: "220ms" }}
      >
        <WeekdayHeatmap
          data={weekdayHeatmapData}
          appLanguage={language}
        />
      </div>

      <div
        className="reveal-rise grid grid-cols-1 gap-6 xl:grid-cols-2"
        style={{ animationDelay: "240ms" }}
      >
        <SessionPerformance
          sessions={Object.entries(sessionStats)}
          formatCurrency={(value) => formatCurrency(value)}
          appLanguage={language}
        />

        {isSharedAccount && (
          <Card className="p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-faint">
              {t.teamAnalyticsEyebrow}
            </p>
            <h2 className="mt-2 text-section text-white">
              {t.traderLeaderboard}
            </h2>

            <div className="mt-6 space-y-3">
              {Object.values(traderStats)
                .sort((a, b) => b.pnl - a.pnl)
                .map((trader, index) => {
                  const wr =
                    trader.trades > 0
                      ? ((trader.wins / trader.trades) * 100).toFixed(0)
                      : "0";

                  return (
                    <Card key={trader.name} variant="inner" className="p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-inner bg-accent-bright/10 text-sm font-bold text-accent-bright">
                            #{index + 1}
                          </div>

                          <div>
                            <h3 className="font-bold text-white">
                              {trader.name}
                            </h3>
                            <p className="text-xs text-muted-faint">
                              {trader.trades} {t.trades}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-5">
                          <div>
                            <p className="text-xs text-muted-faint">{t.wr}</p>
                            <p className="font-bold text-white">{wr}%</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-faint">{t.wins}</p>
                            <p className="font-bold text-white">
                              {trader.wins}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-faint">{t.pnl}</p>
                            <p
                              className={`font-bold ${
                                trader.pnl >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {formatCurrency(trader.pnl)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </Card>
        )}
      </div>

      <Card
        className="reveal-rise p-6 sm:p-10"
        style={{ animationDelay: "260ms" }}
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-faint">
          {t.monthlyPerformanceEyebrow}
        </p>
        <h2 className="mt-2 text-section text-white">
          {t.monthlyDashboard}
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card variant="inner" className="p-4">
            <p className="text-xs text-muted-faint">{t.bestMonth}</p>
            <h3 className="mt-2 text-sm font-bold text-green-400">
              {bestMonth?.[0] || "—"}
            </h3>
            <p className="mt-1 text-sm text-green-400">
              {bestMonth ? formatCurrency(bestMonth[1].pnl) : "—"}
            </p>
          </Card>

          <Card variant="inner" className="p-4">
            <p className="text-xs text-muted-faint">{t.worstMonth}</p>
            <h3 className="mt-2 text-sm font-bold text-red-400">
              {worstMonth?.[0] || "—"}
            </h3>
            <p className="mt-1 text-sm text-red-400">
              {worstMonth ? formatCurrency(worstMonth[1].pnl) : "—"}
            </p>
          </Card>

          <Card variant="inner" className="p-4">
            <p className="text-xs text-muted-faint">{t.greenMonths}</p>
            <h3 className="mt-2 text-2xl font-black text-green-400">
              {greenMonths}
            </h3>
          </Card>

          <Card variant="inner" className="p-4">
            <p className="text-xs text-muted-faint">{t.redMonths}</p>
            <h3 className="mt-2 text-2xl font-black text-red-400">
              {redMonths}
            </h3>
          </Card>
        </div>

        <div className="mt-6 space-y-3">
          {Object.entries(monthlyStats)
            .reverse()
            .map(([month, stats]) => {
              const wr =
                stats.trades > 0
                  ? ((stats.wins / stats.trades) * 100).toFixed(0)
                  : "0";

              return (
                <Card key={month} variant="inner" className="p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-bold text-white">{month}</h3>
                      <p className="text-xs text-muted-faint">
                        {stats.trades} {t.trades}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-5">
                      <div>
                        <p className="text-xs text-muted-faint">{t.wr}</p>
                        <p
                          className={`font-bold ${
                            Number(wr) >= 50 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {wr}%
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-faint">{t.wins}</p>
                        <p className="font-bold text-white">{stats.wins}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-faint">{t.pnl}</p>
                        <p
                          className={`font-bold ${
                            stats.pnl >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {formatCurrency(stats.pnl)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      </Card>

      <div
        className="reveal-rise grid grid-cols-1 gap-6 xl:grid-cols-2"
        style={{ animationDelay: "280ms" }}
      >
        <Card className="p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-faint">
            {t.mistakesEyebrow}
          </p>
          <h2 className="mt-2 text-section text-white">
            {t.recurringMistakes}
          </h2>

          <div className="mt-6 space-y-3">
            {Object.entries(mistakesStats).length === 0 ? (
              <p className="text-sm text-muted-faint">{t.noMistakes}</p>
            ) : (
              Object.entries(mistakesStats)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([mistake, stats]) => (
                  <Card key={mistake} variant="inner" className="p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-bold text-white">{mistake}</h3>
                        <p className="mt-1 text-xs text-muted-faint">
                          {t.repeatedTimes(stats.count)}
                        </p>
                      </div>

                      <p
                        className={`font-bold ${
                          stats.pnl >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {formatCurrency(stats.pnl)}
                      </p>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </Card>

        <PerformanceInsights
          winRate={winRate}
          averageRR={averageRR}
          totalPnl={totalPnl}
          bestSymbol={bestSymbol?.[0]}
          appLanguage={language}
        />
      </div>
    </div>
  );
}
