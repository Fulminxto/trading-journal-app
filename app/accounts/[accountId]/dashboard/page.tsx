import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import EquityChart from "@/components/EquityChart";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import ConsistencyScoreCard from "@/components/dashboard/ConsistencyScoreCard";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

function formatCurrency(
  value: number,
  currency: string
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
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

function getDateLabel(
  date: Date,
  language: AppLanguage
) {
  const locale =
    language === "en"
      ? "en-US"
      : language === "uk"
        ? "uk-UA"
        : language === "ru"
          ? "ru-RU"
          : language === "es"
            ? "es-ES"
            : language === "fr"
              ? "fr-FR"
              : language === "de"
                ? "de-DE"
                : "it-IT";

  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
  });
}


type DashboardLabels = {
  accountStatus: string;
  accountStatusDescription: string;
  dashboardAccount: string;

  accountType: string;
  initialBalance: string;
  currency: string;
  brokerFirm: string;
  phase: string;
  profitTarget: string;
  maxDrawdownLimit: string;
  dailyDrawdownLimit: string;

  accountGrowth: string;
  equityCurve: string;
  noTradesEquity: string;

  targetProgress: string;
  currentProfit: string;
  target: string;
  remaining: string;

  recentMomentum: string;
  last: string;
  trades: string;
  winsShort: string;
  lossesShort: string;

  profitFactor: string;
  profitFactorDescription: string;
  outcomeSplit: string;
  wins: string;
  losses: string;
  breakEven: string;

  latestActivity: string;
  recentTrades: string;
  unknownSymbol: string;
  equity: string;
  noRecentTrades: string;

  reviewNotes: string;
  whatToWatch: string;
  risk: string;
  currentMaxDrawdownIs: string;
  execution: string;
  averageResultPerTradeIs: string;
  consistency: string;
  scoreCurrentlyAt: string;

  currentEquity: string;
  totalPnl: string;
  winRate: string;
  averageResult: string;
  averageWin: string;
  averageLoss: string;
  bestTrade: string;
  worstTrade: string;
  maxDrawdown: string;
  remainingTarget: string;

  healthWaitingForData: string;
  healthStable: string;
  healthPositiveMonitorRisk: string;
  healthNeedsReview: string;
};

const dashboardLabels: Record<
  AppLanguage,
  DashboardLabels
> = {
  it: {
    accountStatus: "Stato account",
    accountStatusDescription:
      "Snapshot basato su profitto, drawdown e comportamento recente dellâ€™account.",
    dashboardAccount: "Dashboard account",

    accountType: "Tipo account",
    initialBalance: "Saldo iniziale",
    currency: "Valuta",
    brokerFirm: "Broker / Firm",
    phase: "Fase",
    profitTarget: "Profit target",
    maxDrawdownLimit: "Limite max drawdown",
    dailyDrawdownLimit: "Limite drawdown giornaliero",

    accountGrowth: "Crescita account",
    equityCurve: "Curva equity",
    noTradesEquity:
      "Nessun trade ancora. Quando aggiungerai operazioni, la curva equity apparirÃ  qui.",

    targetProgress: "Progresso target",
    currentProfit: "Profitto attuale",
    target: "Target",
    remaining: "Rimanente",

    recentMomentum: "Momentum recente",
    last: "Ultimi",
    trades: "trade",
    winsShort: "W",
    lossesShort: "L",

    profitFactor: "Profit Factor",
    profitFactorDescription:
      "Profitto lordo confrontato con la perdita lorda.",
    outcomeSplit: "Distribuzione outcome",
    wins: "Win",
    losses: "Loss",
    breakEven: "Break Even",

    latestActivity: "AttivitÃ  recente",
    recentTrades: "Trade recenti",
    unknownSymbol: "Simbolo sconosciuto",
    equity: "Equity",
    noRecentTrades: "Nessun trade recente.",

    reviewNotes: "Note di review",
    whatToWatch: "Cosa osservare",
    risk: "Rischio",
    currentMaxDrawdownIs: "Il drawdown massimo attuale Ã¨",
    execution: "Esecuzione",
    averageResultPerTradeIs:
      "Il risultato medio per trade Ã¨",
    consistency: "Consistenza",
    scoreCurrentlyAt: "Score attualmente a",

    currentEquity: "Equity attuale",
    totalPnl: "PnL totale",
    winRate: "Win rate",
    averageResult: "Risultato medio",
    averageWin: "Win medio",
    averageLoss: "Loss medio",
    bestTrade: "Miglior trade",
    worstTrade: "Peggior trade",
    maxDrawdown: "Max drawdown",
    remainingTarget: "Target rimanente",

    healthWaitingForData: "In attesa di dati",
    healthStable: "Stabile",
    healthPositiveMonitorRisk:
      "Positivo, ma monitora il rischio",
    healthNeedsReview: "Da revisionare",
  },

  en: {
    accountStatus: "Account Status",
    accountStatusDescription:
      "Snapshot based on profit, drawdown and recent account behavior.",
    dashboardAccount: "Dashboard account",

    accountType: "Account Type",
    initialBalance: "Initial Balance",
    currency: "Currency",
    brokerFirm: "Broker / Firm",
    phase: "Phase",
    profitTarget: "Profit Target",
    maxDrawdownLimit: "Max Drawdown Limit",
    dailyDrawdownLimit: "Daily Drawdown Limit",

    accountGrowth: "Account Growth",
    equityCurve: "Equity Curve",
    noTradesEquity:
      "No trades yet. Once trades are added, the equity curve will appear here.",

    targetProgress: "Target Progress",
    currentProfit: "Current profit",
    target: "Target",
    remaining: "Remaining",

    recentMomentum: "Recent Momentum",
    last: "Last",
    trades: "trades",
    winsShort: "W",
    lossesShort: "L",

    profitFactor: "Profit Factor",
    profitFactorDescription:
      "Gross profit compared to gross loss.",
    outcomeSplit: "Outcome Split",
    wins: "Wins",
    losses: "Losses",
    breakEven: "Break Even",

    latestActivity: "Latest Activity",
    recentTrades: "Recent Trades",
    unknownSymbol: "Unknown Symbol",
    equity: "Equity",
    noRecentTrades: "No recent trades yet.",

    reviewNotes: "Review Notes",
    whatToWatch: "What to watch",
    risk: "Risk",
    currentMaxDrawdownIs: "Current max drawdown is",
    execution: "Execution",
    averageResultPerTradeIs:
      "Average result per trade is",
    consistency: "Consistency",
    scoreCurrentlyAt: "Score currently at",

    currentEquity: "Current Equity",
    totalPnl: "Total PnL",
    winRate: "Win Rate",
    averageResult: "Average Result",
    averageWin: "Average Win",
    averageLoss: "Average Loss",
    bestTrade: "Best Trade",
    worstTrade: "Worst Trade",
    maxDrawdown: "Max Drawdown",
    remainingTarget: "Remaining Target",

    healthWaitingForData: "Waiting for data",
    healthStable: "Stable",
    healthPositiveMonitorRisk:
      "Positive but monitor risk",
    healthNeedsReview: "Needs review",
  },

  uk: {
    accountStatus: "Ð¡Ñ‚Ð°Ñ‚ÑƒÑ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°",
    accountStatusDescription:
      "Ð—Ð½Ñ–Ð¼Ð¾Ðº Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ñ– Ð¿Ñ€Ð¸Ð±ÑƒÑ‚ÐºÑƒ, drawdown Ñ‚Ð° Ð¾ÑÑ‚Ð°Ð½Ð½ÑŒÐ¾Ñ— Ð¿Ð¾Ð²ÐµÐ´Ñ–Ð½ÐºÐ¸ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°.",
    dashboardAccount: "Ð”Ð°ÑˆÐ±Ð¾Ñ€Ð´ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°",

    accountType: "Ð¢Ð¸Ð¿ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°",
    initialBalance: "ÐŸÐ¾Ñ‡Ð°Ñ‚ÐºÐ¾Ð²Ð¸Ð¹ Ð±Ð°Ð»Ð°Ð½Ñ",
    currency: "Ð’Ð°Ð»ÑŽÑ‚Ð°",
    brokerFirm: "Ð‘Ñ€Ð¾ÐºÐµÑ€ / Ð¤Ñ–Ñ€Ð¼Ð°",
    phase: "Ð¤Ð°Ð·Ð°",
    profitTarget: "Ð¦Ñ–Ð»ÑŒ Ð¿Ñ€Ð¸Ð±ÑƒÑ‚ÐºÑƒ",
    maxDrawdownLimit: "Ð›Ñ–Ð¼Ñ–Ñ‚ max drawdown",
    dailyDrawdownLimit: "Ð”ÐµÐ½Ð½Ð¸Ð¹ Ð»Ñ–Ð¼Ñ–Ñ‚ drawdown",

    accountGrowth: "Ð—Ñ€Ð¾ÑÑ‚Ð°Ð½Ð½Ñ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°",
    equityCurve: "ÐšÑ€Ð¸Ð²Ð° equity",
    noTradesEquity:
      "ÐŸÐ¾ÐºÐ¸ Ð½ÐµÐ¼Ð°Ñ” trade. ÐšÐ¾Ð»Ð¸ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ñ— Ð±ÑƒÐ´ÑƒÑ‚ÑŒ Ð´Ð¾Ð´Ð°Ð½Ñ–, Ñ‚ÑƒÑ‚ Ð·â€™ÑÐ²Ð¸Ñ‚ÑŒÑÑ ÐºÑ€Ð¸Ð²Ð° equity.",

    targetProgress: "ÐŸÑ€Ð¾Ð³Ñ€ÐµÑ Ñ†Ñ–Ð»Ñ–",
    currentProfit: "ÐŸÐ¾Ñ‚Ð¾Ñ‡Ð½Ð¸Ð¹ Ð¿Ñ€Ð¸Ð±ÑƒÑ‚Ð¾Ðº",
    target: "Ð¦Ñ–Ð»ÑŒ",
    remaining: "Ð—Ð°Ð»Ð¸ÑˆÐ¸Ð»Ð¾ÑÑŒ",

    recentMomentum: "ÐžÑÑ‚Ð°Ð½Ð½Ñ–Ð¹ momentum",
    last: "ÐžÑÑ‚Ð°Ð½Ð½Ñ–",
    trades: "trade",
    winsShort: "W",
    lossesShort: "L",

    profitFactor: "Profit Factor",
    profitFactorDescription:
      "Ð’Ð°Ð»Ð¾Ð²Ð¸Ð¹ Ð¿Ñ€Ð¸Ð±ÑƒÑ‚Ð¾Ðº Ñƒ Ð¿Ð¾Ñ€Ñ–Ð²Ð½ÑÐ½Ð½Ñ– Ð· Ð²Ð°Ð»Ð¾Ð²Ð¸Ð¼ Ð·Ð±Ð¸Ñ‚ÐºÐ¾Ð¼.",
    outcomeSplit: "Ð Ð¾Ð·Ð¿Ð¾Ð´Ñ–Ð» Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ–Ð²",
    wins: "ÐŸÐµÑ€ÐµÐ¼Ð¾Ð³Ð¸",
    losses: "ÐŸÐ¾Ñ€Ð°Ð·ÐºÐ¸",
    breakEven: "Break Even",

    latestActivity: "ÐžÑÑ‚Ð°Ð½Ð½Ñ Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ–ÑÑ‚ÑŒ",
    recentTrades: "ÐžÑÑ‚Ð°Ð½Ð½Ñ– trade",
    unknownSymbol: "ÐÐµÐ²Ñ–Ð´Ð¾Ð¼Ð¸Ð¹ ÑÐ¸Ð¼Ð²Ð¾Ð»",
    equity: "Equity",
    noRecentTrades: "ÐŸÐ¾ÐºÐ¸ Ð½ÐµÐ¼Ð°Ñ” Ð¾ÑÑ‚Ð°Ð½Ð½Ñ–Ñ… trade.",

    reviewNotes: "ÐÐ¾Ñ‚Ð°Ñ‚ÐºÐ¸ review",
    whatToWatch: "ÐÐ° Ñ‰Ð¾ Ð·Ð²ÐµÑ€Ð½ÑƒÑ‚Ð¸ ÑƒÐ²Ð°Ð³Ñƒ",
    risk: "Ð Ð¸Ð·Ð¸Ðº",
    currentMaxDrawdownIs: "ÐŸÐ¾Ñ‚Ð¾Ñ‡Ð½Ð¸Ð¹ max drawdown ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ",
    execution: "Ð’Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ",
    averageResultPerTradeIs:
      "Ð¡ÐµÑ€ÐµÐ´Ð½Ñ–Ð¹ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð½Ð° trade ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ",
    consistency: "Ð¡Ñ‚Ð°Ð±Ñ–Ð»ÑŒÐ½Ñ–ÑÑ‚ÑŒ",
    scoreCurrentlyAt: "ÐŸÐ¾Ñ‚Ð¾Ñ‡Ð½Ð¸Ð¹ score",

    currentEquity: "ÐŸÐ¾Ñ‚Ð¾Ñ‡Ð½Ð° equity",
    totalPnl: "Ð—Ð°Ð³Ð°Ð»ÑŒÐ½Ð¸Ð¹ PnL",
    winRate: "Win rate",
    averageResult: "Ð¡ÐµÑ€ÐµÐ´Ð½Ñ–Ð¹ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚",
    averageWin: "Ð¡ÐµÑ€ÐµÐ´Ð½Ñ–Ð¹ win",
    averageLoss: "Ð¡ÐµÑ€ÐµÐ´Ð½Ñ–Ð¹ loss",
    bestTrade: "ÐÐ°Ð¹ÐºÑ€Ð°Ñ‰Ð¸Ð¹ trade",
    worstTrade: "ÐÐ°Ð¹Ð³Ñ–Ñ€ÑˆÐ¸Ð¹ trade",
    maxDrawdown: "Max drawdown",
    remainingTarget: "Ð—Ð°Ð»Ð¸ÑˆÐ¾Ðº Ð´Ð¾ Ñ†Ñ–Ð»Ñ–",

    healthWaitingForData: "ÐžÑ‡Ñ–ÐºÑƒÐ²Ð°Ð½Ð½Ñ Ð´Ð°Ð½Ð¸Ñ…",
    healthStable: "Ð¡Ñ‚Ð°Ð±Ñ–Ð»ÑŒÐ½Ð¾",
    healthPositiveMonitorRisk:
      "ÐŸÐ¾Ð·Ð¸Ñ‚Ð¸Ð²Ð½Ð¾, Ð°Ð»Ðµ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŽÐ¹ Ñ€Ð¸Ð·Ð¸Ðº",
    healthNeedsReview: "ÐŸÐ¾Ñ‚Ñ€Ñ–Ð±ÐµÐ½ review",
  },

  ru: {
    accountStatus: "Ð¡Ñ‚Ð°Ñ‚ÑƒÑ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°",
    accountStatusDescription:
      "Ð¡Ð½Ð¸Ð¼Ð¾Ðº Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»Ð¸, drawdown Ð¸ Ð½ÐµÐ´Ð°Ð²Ð½ÐµÐ³Ð¾ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ñ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°.",
    dashboardAccount: "Ð”Ð°ÑˆÐ±Ð¾Ñ€Ð´ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°",

    accountType: "Ð¢Ð¸Ð¿ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°",
    initialBalance: "ÐÐ°Ñ‡Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð±Ð°Ð»Ð°Ð½Ñ",
    currency: "Ð’Ð°Ð»ÑŽÑ‚Ð°",
    brokerFirm: "Ð‘Ñ€Ð¾ÐºÐµÑ€ / Ð¤Ð¸Ñ€Ð¼Ð°",
    phase: "Ð¤Ð°Ð·Ð°",
    profitTarget: "Ð¦ÐµÐ»ÑŒ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»Ð¸",
    maxDrawdownLimit: "Ð›Ð¸Ð¼Ð¸Ñ‚ max drawdown",
    dailyDrawdownLimit: "Ð”Ð½ÐµÐ²Ð½Ð¾Ð¹ Ð»Ð¸Ð¼Ð¸Ñ‚ drawdown",

    accountGrowth: "Ð Ð¾ÑÑ‚ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°",
    equityCurve: "ÐšÑ€Ð¸Ð²Ð°Ñ equity",
    noTradesEquity:
      "ÐŸÐ¾ÐºÐ° Ð½ÐµÑ‚ trade. ÐšÐ¾Ð³Ð´Ð° Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¸ Ð±ÑƒÐ´ÑƒÑ‚ Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ñ‹, Ð·Ð´ÐµÑÑŒ Ð¿Ð¾ÑÐ²Ð¸Ñ‚ÑÑ ÐºÑ€Ð¸Ð²Ð°Ñ equity.",

    targetProgress: "ÐŸÑ€Ð¾Ð³Ñ€ÐµÑÑ Ñ†ÐµÐ»Ð¸",
    currentProfit: "Ð¢ÐµÐºÑƒÑ‰Ð°Ñ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»ÑŒ",
    target: "Ð¦ÐµÐ»ÑŒ",
    remaining: "ÐžÑÑ‚Ð°Ð»Ð¾ÑÑŒ",

    recentMomentum: "ÐŸÐ¾ÑÐ»ÐµÐ´Ð½Ð¸Ð¹ momentum",
    last: "ÐŸÐ¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ",
    trades: "trade",
    winsShort: "W",
    lossesShort: "L",

    profitFactor: "Profit Factor",
    profitFactorDescription:
      "Ð’Ð°Ð»Ð¾Ð²Ð°Ñ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»ÑŒ Ð¿Ð¾ ÑÑ€Ð°Ð²Ð½ÐµÐ½Ð¸ÑŽ Ñ Ð²Ð°Ð»Ð¾Ð²Ñ‹Ð¼ ÑƒÐ±Ñ‹Ñ‚ÐºÐ¾Ð¼.",
    outcomeSplit: "Ð Ð°ÑÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð²",
    wins: "ÐŸÐ¾Ð±ÐµÐ´Ñ‹",
    losses: "ÐŸÐ¾Ñ€Ð°Ð¶ÐµÐ½Ð¸Ñ",
    breakEven: "Break Even",

    latestActivity: "ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÑÑ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚ÑŒ",
    recentTrades: "ÐŸÐ¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ trade",
    unknownSymbol: "ÐÐµÐ¸Ð·Ð²ÐµÑÑ‚Ð½Ñ‹Ð¹ ÑÐ¸Ð¼Ð²Ð¾Ð»",
    equity: "Equity",
    noRecentTrades: "ÐŸÐ¾ÐºÐ° Ð½ÐµÑ‚ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ñ… trade.",

    reviewNotes: "Ð—Ð°Ð¼ÐµÑ‚ÐºÐ¸ review",
    whatToWatch: "Ð—Ð° Ñ‡ÐµÐ¼ ÑÐ»ÐµÐ´Ð¸Ñ‚ÑŒ",
    risk: "Ð Ð¸ÑÐº",
    currentMaxDrawdownIs: "Ð¢ÐµÐºÑƒÑ‰Ð¸Ð¹ max drawdown ÑÐ¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚",
    execution: "Ð˜ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ",
    averageResultPerTradeIs:
      "Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð½Ð° trade ÑÐ¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚",
    consistency: "Ð¡Ñ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ",
    scoreCurrentlyAt: "Ð¢ÐµÐºÑƒÑ‰Ð¸Ð¹ score",

    currentEquity: "Ð¢ÐµÐºÑƒÑ‰Ð°Ñ equity",
    totalPnl: "ÐžÐ±Ñ‰Ð¸Ð¹ PnL",
    winRate: "Win rate",
    averageResult: "Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚",
    averageWin: "Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ win",
    averageLoss: "Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ loss",
    bestTrade: "Ð›ÑƒÑ‡ÑˆÐ¸Ð¹ trade",
    worstTrade: "Ð¥ÑƒÐ´ÑˆÐ¸Ð¹ trade",
    maxDrawdown: "Max drawdown",
    remainingTarget: "ÐžÑÑ‚Ð°Ñ‚Ð¾Ðº Ð´Ð¾ Ñ†ÐµÐ»Ð¸",

    healthWaitingForData: "ÐžÐ¶Ð¸Ð´Ð°Ð½Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ…",
    healthStable: "Ð¡Ñ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ð¾",
    healthPositiveMonitorRisk:
      "ÐŸÐ¾Ð»Ð¾Ð¶Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾, Ð½Ð¾ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€ÑƒÐ¹ Ñ€Ð¸ÑÐº",
    healthNeedsReview: "ÐÑƒÐ¶ÐµÐ½ review",
  },

  es: {
    accountStatus: "Estado de la cuenta",
    accountStatusDescription:
      "Snapshot basado en beneficio, drawdown y comportamiento reciente de la cuenta.",
    dashboardAccount: "Dashboard de cuenta",

    accountType: "Tipo de cuenta",
    initialBalance: "Balance inicial",
    currency: "Moneda",
    brokerFirm: "Broker / Firma",
    phase: "Fase",
    profitTarget: "Objetivo de beneficio",
    maxDrawdownLimit: "LÃ­mite max drawdown",
    dailyDrawdownLimit: "LÃ­mite diario de drawdown",

    accountGrowth: "Crecimiento de cuenta",
    equityCurve: "Curva de equity",
    noTradesEquity:
      "AÃºn no hay trades. Cuando se aÃ±adan operaciones, la curva de equity aparecerÃ¡ aquÃ­.",

    targetProgress: "Progreso del objetivo",
    currentProfit: "Beneficio actual",
    target: "Objetivo",
    remaining: "Restante",

    recentMomentum: "Momentum reciente",
    last: "Ãšltimos",
    trades: "trades",
    winsShort: "W",
    lossesShort: "L",

    profitFactor: "Profit Factor",
    profitFactorDescription:
      "Beneficio bruto comparado con pÃ©rdida bruta.",
    outcomeSplit: "DistribuciÃ³n de resultados",
    wins: "Ganadas",
    losses: "Perdidas",
    breakEven: "Break Even",

    latestActivity: "Actividad reciente",
    recentTrades: "Trades recientes",
    unknownSymbol: "SÃ­mbolo desconocido",
    equity: "Equity",
    noRecentTrades: "AÃºn no hay trades recientes.",

    reviewNotes: "Notas de review",
    whatToWatch: "QuÃ© observar",
    risk: "Riesgo",
    currentMaxDrawdownIs: "El max drawdown actual es",
    execution: "EjecuciÃ³n",
    averageResultPerTradeIs:
      "El resultado medio por trade es",
    consistency: "Consistencia",
    scoreCurrentlyAt: "Score actual",

    currentEquity: "Equity actual",
    totalPnl: "PnL total",
    winRate: "Win rate",
    averageResult: "Resultado medio",
    averageWin: "Win medio",
    averageLoss: "Loss medio",
    bestTrade: "Mejor trade",
    worstTrade: "Peor trade",
    maxDrawdown: "Max drawdown",
    remainingTarget: "Objetivo restante",

    healthWaitingForData: "Esperando datos",
    healthStable: "Estable",
    healthPositiveMonitorRisk:
      "Positivo, pero controla el riesgo",
    healthNeedsReview: "Necesita revisiÃ³n",
  },

  fr: {
    accountStatus: "Ã‰tat du compte",
    accountStatusDescription:
      "Snapshot basÃ© sur le profit, le drawdown et le comportement rÃ©cent du compte.",
    dashboardAccount: "Dashboard du compte",

    accountType: "Type de compte",
    initialBalance: "Solde initial",
    currency: "Devise",
    brokerFirm: "Broker / Firme",
    phase: "Phase",
    profitTarget: "Objectif de profit",
    maxDrawdownLimit: "Limite max drawdown",
    dailyDrawdownLimit: "Limite drawdown quotidien",

    accountGrowth: "Croissance du compte",
    equityCurve: "Courbe dâ€™equity",
    noTradesEquity:
      "Aucun trade pour le moment. Quand des opÃ©rations seront ajoutÃ©es, la courbe dâ€™equity apparaÃ®tra ici.",

    targetProgress: "Progression de lâ€™objectif",
    currentProfit: "Profit actuel",
    target: "Objectif",
    remaining: "Restant",

    recentMomentum: "Momentum rÃ©cent",
    last: "Derniers",
    trades: "trades",
    winsShort: "W",
    lossesShort: "L",

    profitFactor: "Profit Factor",
    profitFactorDescription:
      "Profit brut comparÃ© Ã  la perte brute.",
    outcomeSplit: "RÃ©partition des rÃ©sultats",
    wins: "Wins",
    losses: "Losses",
    breakEven: "Break Even",

    latestActivity: "ActivitÃ© rÃ©cente",
    recentTrades: "Trades rÃ©cents",
    unknownSymbol: "Symbole inconnu",
    equity: "Equity",
    noRecentTrades: "Aucun trade rÃ©cent.",

    reviewNotes: "Notes de review",
    whatToWatch: "Ã€ surveiller",
    risk: "Risque",
    currentMaxDrawdownIs: "Le max drawdown actuel est",
    execution: "ExÃ©cution",
    averageResultPerTradeIs:
      "Le rÃ©sultat moyen par trade est",
    consistency: "Consistance",
    scoreCurrentlyAt: "Score actuel",

    currentEquity: "Equity actuelle",
    totalPnl: "PnL total",
    winRate: "Win rate",
    averageResult: "RÃ©sultat moyen",
    averageWin: "Win moyen",
    averageLoss: "Loss moyen",
    bestTrade: "Meilleur trade",
    worstTrade: "Pire trade",
    maxDrawdown: "Max drawdown",
    remainingTarget: "Objectif restant",

    healthWaitingForData: "En attente de donnÃ©es",
    healthStable: "Stable",
    healthPositiveMonitorRisk:
      "Positif, mais surveille le risque",
    healthNeedsReview: "Ã€ revoir",
  },

  de: {
    accountStatus: "Kontostatus",
    accountStatusDescription:
      "Snapshot basierend auf Gewinn, Drawdown und aktuellem Kontoverhalten.",
    dashboardAccount: "Konto-Dashboard",

    accountType: "Kontotyp",
    initialBalance: "Startkapital",
    currency: "WÃ¤hrung",
    brokerFirm: "Broker / Firma",
    phase: "Phase",
    profitTarget: "Gewinnziel",
    maxDrawdownLimit: "Max-Drawdown-Limit",
    dailyDrawdownLimit: "TÃ¤gliches Drawdown-Limit",

    accountGrowth: "Kontowachstum",
    equityCurve: "Equity-Kurve",
    noTradesEquity:
      "Noch keine Trades. Sobald Trades hinzugefÃ¼gt werden, erscheint hier die Equity-Kurve.",

    targetProgress: "Zielfortschritt",
    currentProfit: "Aktueller Gewinn",
    target: "Ziel",
    remaining: "Verbleibend",

    recentMomentum: "Aktuelles Momentum",
    last: "Letzte",
    trades: "Trades",
    winsShort: "W",
    lossesShort: "L",

    profitFactor: "Profit Factor",
    profitFactorDescription:
      "Bruttogewinn im Vergleich zum Bruttoverlust.",
    outcomeSplit: "Outcome-Verteilung",
    wins: "Wins",
    losses: "Losses",
    breakEven: "Break Even",

    latestActivity: "Letzte AktivitÃ¤t",
    recentTrades: "Letzte Trades",
    unknownSymbol: "Unbekanntes Symbol",
    equity: "Equity",
    noRecentTrades: "Noch keine letzten Trades.",

    reviewNotes: "Review-Notizen",
    whatToWatch: "Worauf achten",
    risk: "Risiko",
    currentMaxDrawdownIs: "Der aktuelle Max Drawdown betrÃ¤gt",
    execution: "AusfÃ¼hrung",
    averageResultPerTradeIs:
      "Das durchschnittliche Ergebnis pro Trade betrÃ¤gt",
    consistency: "Konstanz",
    scoreCurrentlyAt: "Aktueller Score",

    currentEquity: "Aktuelle Equity",
    totalPnl: "Gesamt-PnL",
    winRate: "Win Rate",
    averageResult: "Durchschnittliches Ergebnis",
    averageWin: "Durchschnittlicher Win",
    averageLoss: "Durchschnittlicher Loss",
    bestTrade: "Bester Trade",
    worstTrade: "Schlechtester Trade",
    maxDrawdown: "Max Drawdown",
    remainingTarget: "Verbleibendes Ziel",

    healthWaitingForData: "Warte auf Daten",
    healthStable: "Stabil",
    healthPositiveMonitorRisk:
      "Positiv, aber Risiko Ã¼berwachen",
    healthNeedsReview: "Review nÃ¶tig",
  },
};


export default async function DashboardPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

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

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
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

  const account = membership.tradingAccount;

  const currentUser =
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        appLanguage: true,
      },
    });

  const language = normalizeAppLanguage(
    currentUser?.appLanguage
  );

  const t =
    dashboardLabels[language] ??
    dashboardLabels.en;

  const currency = account.currency;
  const initialBalance = account.initialBalance || 0;

  const totalTrades = trades.length;

  const wins = trades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const losses = trades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const be = trades.filter(
    (trade) => trade.outcome === "be"
  ).length;

  const closedTrades = trades.filter(
    (trade) =>
      trade.outcome === "win" ||
      trade.outcome === "loss" ||
      trade.outcome === "be"
  ).length;

  const winningTrades = trades.filter(
    (trade) => trade.outcome === "win"
  );

  const losingTrades = trades.filter(
    (trade) => trade.outcome === "loss"
  );

  const grossProfit = winningTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const grossLoss = losingTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const totalPnl = trades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const currentEquity =
    trades.length > 0
      ? trades[trades.length - 1].equity ||
      initialBalance
      : initialBalance;

  const currentProfitPercent =
    initialBalance > 0
      ? ((currentEquity - initialBalance) /
        initialBalance) *
      100
      : 0;

  const remainingToTarget =
    account.profitTarget
      ? account.profitTarget - currentProfitPercent
      : null;

  const targetProgress =
    account.profitTarget && account.profitTarget > 0
      ? Math.max(
        0,
        Math.min(
          100,
          (currentProfitPercent /
            account.profitTarget) *
          100
        )
      )
      : 0;

  const winRate =
    closedTrades > 0
      ? (wins / closedTrades) * 100
      : 0;

  const lossRate =
    closedTrades > 0
      ? (losses / closedTrades) * 100
      : 0;

  const beRate =
    closedTrades > 0
      ? (be / closedTrades) * 100
      : 0;

  const averageWin =
    wins > 0 ? grossProfit / wins : 0;

  const averageLoss =
    losses > 0 ? grossLoss / losses : 0;

  const averageResult =
    totalTrades > 0 ? totalPnl / totalTrades : 0;

  const profitFactor =
    Math.abs(grossLoss) > 0
      ? grossProfit / Math.abs(grossLoss)
      : grossProfit > 0
        ? grossProfit
        : 0;

  const bestTrade =
    trades.length > 0
      ? Math.max(
        ...trades.map(
          (trade) => trade.resultUsd || 0
        )
      )
      : 0;

  const worstTrade =
    trades.length > 0
      ? Math.min(
        ...trades.map(
          (trade) => trade.resultUsd || 0
        )
      )
      : 0;

  const maxDrawdown =
    trades.length > 0
      ? Math.min(
        ...trades.map(
          (trade) =>
            trade.drawdownPercent || 0
        )
      )
      : 0;

  const recentTrades = [...trades]
    .reverse()
    .slice(0, 5);

  const lastFivePnl = recentTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const lastFiveWins = recentTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const lastFiveLosses = recentTrades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const chartData = trades.map((trade) => ({
    date: getDateLabel(
      trade.openDate,
      language
    ),

    equity:
      trade.equity ||
      initialBalance,
  }));

  const consistencyScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        winRate * 0.5 +
        (averageWin > Math.abs(averageLoss)
          ? 20
          : 10) +
        (maxDrawdown > -5 ? 20 : 10)
      )
    )
  );

  const accountHealth =
    totalTrades === 0
      ? t.healthWaitingForData
      : currentProfitPercent >= 0 &&
        maxDrawdown > -5
        ? t.healthStable
        : currentProfitPercent >= 0
          ? t.healthPositiveMonitorRisk
          : t.healthNeedsReview;

  const stats = [
    {
      label: t.currentEquity,
      value: formatCurrency(
        currentEquity,
        currency
      ),
      tone: "text-white",
    },

    {
      label: t.currentProfit,
      value: formatPercent(
        currentProfitPercent
      ),
      tone: getResultTone(
        currentProfitPercent
      ),
    },

    {
      label: t.totalPnl,
      value: formatCurrency(
        totalPnl,
        currency
      ),
      tone: getResultTone(totalPnl),
    },

    {
      label: t.winRate,
      value: formatPercent(winRate),
      tone:
        winRate >= 50
          ? "text-green-400"
          : "text-red-400",
    },

    {
      label: t.trades,
      value: totalTrades,
      tone: "text-white",
    },

    {
      label: t.wins,
      value: wins,
      tone: "text-green-400",
    },

    {
      label: t.losses,
      value: losses,
      tone: "text-red-400",
    },

    {
      label: t.breakEven,
      value: be,
      tone: "text-yellow-400",
    },

    {
      label: t.averageResult,
      value: formatCurrency(
        averageResult,
        currency
      ),
      tone: getResultTone(
        averageResult
      ),
    },

    {
      label: t.averageWin,
      value: formatCurrency(
        averageWin,
        currency
      ),
      tone: "text-green-400",
    },

    {
      label: t.averageLoss,
      value: formatCurrency(
        averageLoss,
        currency
      ),
      tone: "text-red-400",
    },

    {
      label: t.profitFactor,
      value: profitFactor.toFixed(2),
      tone:
        profitFactor >= 1
          ? "text-green-400"
          : "text-red-400",
    },

    {
      label: t.bestTrade,
      value: formatCurrency(
        bestTrade,
        currency
      ),
      tone: "text-green-400",
    },

    {
      label: t.worstTrade,
      value: formatCurrency(
        worstTrade,
        currency
      ),
      tone: "text-red-400",
    },

    {
      label: t.maxDrawdown,
      value: formatPercent(maxDrawdown),
      tone: "text-red-400",
    },

    {
      label: t.remainingTarget,
      value:
        remainingToTarget !== null
          ? formatPercent(remainingToTarget)
          : "-",
      tone:
        remainingToTarget !== null &&
          remainingToTarget <= 0
          ? "text-green-400"
          : "text-yellow-400",
    },
  ];

  return (
    <div>
      <DashboardHero
        accountName={account.name}
        currentEquity={formatCurrency(
          currentEquity,
          currency
        )}
        totalPnl={formatCurrency(
          totalPnl,
          currency
        )}
        winRate={formatPercent(winRate)}
        totalTrades={totalTrades}
        appLanguage={language}
      />

      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ConsistencyScoreCard
            score={consistencyScore}
            appLanguage={language}
          />
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.accountStatus}
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            {accountHealth}
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            {t.accountStatusDescription}
          </p>
        </div>
      </div>

      <div className="mb-8 mt-10">
        <p className="text-sm text-gray-400">
          {t.dashboardAccount}
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          {account.name}
        </h1>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.accountType}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {account.type}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.initialBalance}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {formatCurrency(
              initialBalance,
              currency
            )}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.currency}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {currency}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.brokerFirm}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {account.broker || "-"}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.phase}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {account.phase || "-"}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.profitTarget}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {account.profitTarget
              ? formatPercent(
                account.profitTarget
              )
              : "-"}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.maxDrawdownLimit}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-400">
            {account.maxDrawdown
              ? formatPercent(
                account.maxDrawdown
              )
              : "-"}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.dailyDrawdownLimit}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-400">
            {account.dailyDrawdown
              ? formatPercent(
                account.dailyDrawdown
              )
              : "-"}
          </h2>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-6">
            <p className="text-sm text-gray-400">
              {t.accountGrowth}
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {t.equityCurve}
            </h2>
          </div>

          {chartData.length > 0 ? (
            <EquityChart data={chartData} />
          ) : (
            <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 p-8 text-center text-sm text-gray-400">
              {t.noTradesEquity}
            </div>
          )}
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.targetProgress}
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            {account.profitTarget
              ? `${targetProgress.toFixed(0)}%`
              : "-"}
          </h2>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-green-400"
              style={{
                width: `${targetProgress}%`,
              }}
            />
          </div>

          <div className="mt-5 space-y-3 text-sm text-gray-400">
            <div className="flex items-center justify-between gap-4">
              <span>{t.currentProfit}</span>
              <span
                className={getResultTone(
                  currentProfitPercent
                )}
              >
                {formatPercent(
                  currentProfitPercent
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>{t.target}</span>
              <span className="text-green-400">
                {account.profitTarget
                  ? formatPercent(
                    account.profitTarget
                  )
                  : "-"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>{t.remaining}</span>
              <span
                className={
                  remainingToTarget !== null &&
                    remainingToTarget <= 0
                    ? "text-green-400"
                    : "text-yellow-400"
                }
              >
                {remainingToTarget !== null
                  ? formatPercent(
                    remainingToTarget
                  )
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.recentMomentum}
          </p>

          <h2
            className={`mt-2 text-3xl font-black ${getResultTone(
              lastFivePnl
            )}`}
          >
            {formatCurrency(
              lastFivePnl,
              currency
            )}
          </h2>

          <p className="mt-3 text-sm text-gray-400">
            {t.last} {recentTrades.length} {t.trades} Â·{" "}
            <span className="text-green-400">
              {lastFiveWins}{t.winsShort}
            </span>{" "}
            /{" "}
            <span className="text-red-400">
              {lastFiveLosses}{t.lossesShort}
            </span>
          </p>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.profitFactor}
          </p>

          <h2
            className={`mt-2 text-3xl font-black ${profitFactor >= 1
              ? "text-green-400"
              : "text-red-400"
              }`}
          >
            {profitFactor.toFixed(2)}
          </h2>

          <p className="mt-3 text-sm text-gray-400">
            {t.profitFactorDescription}
          </p>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.outcomeSplit}
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <div className="mb-1 flex justify-between text-gray-400">
                <span>{t.wins}</span>
                <span className="text-green-400">
                  {formatPercent(winRate)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-green-400"
                  style={{
                    width: `${Math.min(
                      100,
                      winRate
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-gray-400">
                <span>{t.losses}</span>
                <span className="text-red-400">
                  {formatPercent(lossRate)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-red-400"
                  style={{
                    width: `${Math.min(
                      100,
                      lossRate
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-gray-400">
                <span>{t.breakEven}</span>
                <span className="text-yellow-400">
                  {formatPercent(beRate)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-yellow-400"
                  style={{
                    width: `${Math.min(
                      100,
                      beRate
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-3">
          <div className="mb-5">
            <p className="text-sm text-gray-400">
              {t.latestActivity}
            </p>

            <h2 className="text-2xl font-bold">
              {t.recentTrades}
            </h2>
          </div>

          {recentTrades.length > 0 ? (
            <div className="space-y-3">
              {recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-4"
                >
                  <div>
                    <p className="font-bold text-white">
                      {trade.symbol || t.unknownSymbol}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {getDateLabel(trade.openDate, language)} Â·{" "}
                      {trade.direction || "-"} Â·{" "}
                      {trade.outcome || "-"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold ${getResultTone(
                        trade.resultUsd || 0
                      )}`}
                    >
                      {formatCurrency(
                        trade.resultUsd || 0,
                        currency
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {t.equity}{" "}
                      {formatCurrency(
                        trade.equity ||
                        initialBalance,
                        currency
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-6 text-sm text-gray-400">
              {t.noRecentTrades}
            </div>
          )}
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-5">
            <p className="text-sm text-gray-400">
              {t.reviewNotes}
            </p>

            <h2 className="text-2xl font-bold">
              {t.whatToWatch}
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-6 text-gray-400">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="font-bold text-white">
                {t.risk}
              </p>
              <p className="mt-1">
                {t.currentMaxDrawdownIs}{" "}
                <span className="text-red-400">
                  {formatPercent(maxDrawdown)}
                </span>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="font-bold text-white">
                {t.execution}
              </p>
              <p className="mt-1">
                {t.averageResultPerTradeIs}{" "}
                <span
                  className={getResultTone(
                    averageResult
                  )}
                >
                  {formatCurrency(
                    averageResult,
                    currency
                  )}
                </span>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="font-bold text-white">
                {t.consistency}
              </p>
              <p className="mt-1">
                {t.scoreCurrentlyAt}{" "}
                <span className="text-green-400">
                  {consistencyScore}/100
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            tone={stat.tone}
          />
        ))}
      </div>
    </div>
  );
}


