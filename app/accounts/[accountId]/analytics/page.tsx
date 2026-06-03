import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import AnalyticsStatCard from "@/components/analytics/AnalyticsStatCard";
import PerformanceIntelligence from "@/components/analytics/PerformanceIntelligence";
import SymbolPerformance from "@/components/analytics/SymbolPerformance";
import SessionPerformance from "@/components/analytics/SessionPerformance";
import PerformanceInsights from "@/components/analytics/PerformanceInsights";
import PsychologyAnalytics from "@/components/analytics/PsychologyAnalytics";
import AnalyticsHero from "@/components/analytics/AnalyticsHero";
import WeekdayHeatmap from "@/components/analytics/WeekdayHeatmap";
import EmotionalStateHeatmap from "@/components/analytics/EmotionalStateHeatmap";
import ConfidencePerformanceHeatmap from "@/components/analytics/ConfidencePerformanceHeatmap";
import ExecutionQualityHeatmap from "@/components/analytics/ExecutionQualityHeatmap";
import SetupQualityHeatmap from "@/components/analytics/SetupQualityHeatmap";
import BehavioralRiskHeatmap from "@/components/analytics/BehavioralRiskHeatmap";
import RiskConcentrationMatrix from "@/components/analytics/RiskConcentrationMatrix";
import ExecutionTrendChart from "@/components/analytics/ExecutionTrendChart";
import ConfidenceEvolutionChart from "@/components/analytics/ConfidenceEvolutionChart";
import EmotionalTimelineChart from "@/components/analytics/EmotionalTimelineChart";
import DisciplineEvolutionChart from "@/components/analytics/DisciplineEvolutionChart";
import ConsistencyCurveChart from "@/components/analytics/ConsistencyCurveChart";
import PsychologicalStabilityCurve from "@/components/analytics/PsychologicalStabilityCurve";

import {
  BarChart3,
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
  grossProfit: string;
  grossLoss: string;
  profitFactor: string;
  bestWinStreak: string;
  advancedStatsEyebrow: string;
  analyticsTitle: string;
  totalTrades: string;
  winRate: string;
  averageRR: string;
  totalPnl: string;
  tradeDirectionEyebrow: string;
  longVsShort: string;
  longTrades: string;
  shortTrades: string;
  winrate: string;
  tradeResultsEyebrow: string;
  bestResults: string;
  bestTrade: string;
  worstTrade: string;
  outcomeBreakdownEyebrow: string;
  outcomeBreakdownTitle: string;
  wins: string;
  losses: string;
  breakEven: string;
  mistakesEyebrow: string;
  recurringMistakes: string;
  noMistakes: string;
  repeatedTimes: (count: number) => string;
  setupQualityEyebrow: string;
  setupPerformance: string;
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
  aiInsightsEyebrow: string;
  performanceInsights: string;
  noInsights: string;
  tradingPsychologyEyebrow: string;
  emotionalPerformance: string;
  pnl: string;
  wr: string;
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
  bestEmotionalState: (state: string, rate: string) => string;
  mostExpensiveMistake: (mistake: string) => string;
  longBetter: string;
  shortBetter: string;
  solidExecution: string;
  focusRisk: string;
};

const analyticsLabels: Record<
  AppLanguage,
  AnalyticsLabels
> = {
  it: {
    grossProfit: "Profitto lordo",
    grossLoss: "Perdita lorda",
    profitFactor: "Profit Factor",
    bestWinStreak: "Migliore serie di win",
    advancedStatsEyebrow: "Statistiche avanzate",
    analyticsTitle: "Analytics",
    totalTrades: "Trade totali",
    winRate: "Win Rate",
    averageRR: "RR medio",
    totalPnl: "PnL totale",
    tradeDirectionEyebrow: "Direzione trade",
    longVsShort: "Long vs Short",
    longTrades: "Trade Long",
    shortTrades: "Trade Short",
    winrate: "winrate",
    tradeResultsEyebrow: "Risultati trade",
    bestResults: "Migliori risultati",
    bestTrade: "Miglior trade",
    worstTrade: "Peggior trade",
    outcomeBreakdownEyebrow: "Distribuzione esiti",
    outcomeBreakdownTitle: "Breakdown risultati",
    wins: "Win",
    losses: "Loss",
    breakEven: "Break Even",
    mistakesEyebrow: "Analisi errori",
    recurringMistakes: "Errori ricorrenti",
    noMistakes: "Nessun errore registrato nei trade.",
    repeatedTimes: (count) =>
      `Ripetuto ${count} ${count === 1 ? "volta" : "volte"}`,
    setupQualityEyebrow: "QualitÃ  setup",
    setupPerformance: "Performance setup",
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
    aiInsightsEyebrow: "AI Insights",
    performanceInsights: "Insight performance",
    noInsights: "Non ci sono ancora abbastanza dati.",
    tradingPsychologyEyebrow: "Psicologia trading",
    emotionalPerformance: "Performance emotiva",
    pnl: "PnL",
    wr: "WR",
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
    confidence: "Fiducia",
    execution: "Execution",
    setupQuality: "QualitÃ  setup",
    bestEmotionalState: (state, rate) =>
      `Migliore stato emotivo: ${state} (${rate}% WR)`,
    mostExpensiveMistake: (mistake) =>
      `Errore piÃ¹ costoso: ${mistake}`,
    longBetter:
      "I trade Long stanno performando meglio dei trade Short.",
    shortBetter:
      "I trade Short stanno performando meglio dei trade Long.",
    solidExecution:
      "La tua esecuzione complessiva Ã¨ attualmente molto solida.",
    focusRisk:
      "Concentrati sulla gestione del rischio e sulla selezione dei trade.",
  },

  en: {
    grossProfit: "Gross Profit",
    grossLoss: "Gross Loss",
    profitFactor: "Profit Factor",
    bestWinStreak: "Best Win Streak",
    advancedStatsEyebrow: "Advanced statistics",
    analyticsTitle: "Analytics",
    totalTrades: "Total Trades",
    winRate: "Win Rate",
    averageRR: "Average RR",
    totalPnl: "Total PnL",
    tradeDirectionEyebrow: "Trade Direction",
    longVsShort: "Long vs Short",
    longTrades: "Long Trades",
    shortTrades: "Short Trades",
    winrate: "winrate",
    tradeResultsEyebrow: "Trade Results",
    bestResults: "Best results",
    bestTrade: "Best Trade",
    worstTrade: "Worst Trade",
    outcomeBreakdownEyebrow: "Outcome Breakdown",
    outcomeBreakdownTitle: "Results breakdown",
    wins: "Wins",
    losses: "Losses",
    breakEven: "Break Even",
    mistakesEyebrow: "Mistakes Analytics",
    recurringMistakes: "Recurring mistakes",
    noMistakes: "No mistakes recorded in trades.",
    repeatedTimes: (count) =>
      `Repeated ${count} ${count === 1 ? "time" : "times"}`,
    setupQualityEyebrow: "Setup Quality",
    setupPerformance: "Setup Performance",
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
    aiInsightsEyebrow: "AI Insights",
    performanceInsights: "Performance Insights",
    noInsights: "There is not enough data yet.",
    tradingPsychologyEyebrow: "Trading Psychology",
    emotionalPerformance: "Emotional Performance",
    pnl: "PnL",
    wr: "WR",
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
    bestEmotionalState: (state, rate) =>
      `Best emotional state: ${state} (${rate}% WR)`,
    mostExpensiveMistake: (mistake) =>
      `Most expensive mistake: ${mistake}`,
    longBetter:
      "Long trades are currently performing better than Short trades.",
    shortBetter:
      "Short trades are currently performing better than Long trades.",
    solidExecution:
      "Your overall execution quality is currently very solid.",
    focusRisk:
      "Focus on risk management and trade selection.",
  },

  uk: {
    grossProfit: "Ð’Ð°Ð»Ð¾Ð²Ð¸Ð¹ Ð¿Ñ€Ð¸Ð±ÑƒÑ‚Ð¾Ðº",
    grossLoss: "Ð’Ð°Ð»Ð¾Ð²Ð¸Ð¹ Ð·Ð±Ð¸Ñ‚Ð¾Ðº",
    profitFactor: "Profit Factor",
    bestWinStreak: "ÐÐ°Ð¹ÐºÑ€Ð°Ñ‰Ð° ÑÐµÑ€Ñ–Ñ Ð¿ÐµÑ€ÐµÐ¼Ð¾Ð³",
    advancedStatsEyebrow: "Ð Ð¾Ð·ÑˆÐ¸Ñ€ÐµÐ½Ð° ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ°",
    analyticsTitle: "ÐÐ½Ð°Ð»Ñ–Ñ‚Ð¸ÐºÐ°",
    totalTrades: "Ð£ÑÑŒÐ¾Ð³Ð¾ ÑƒÐ³Ð¾Ð´",
    winRate: "Win Rate",
    averageRR: "Ð¡ÐµÑ€ÐµÐ´Ð½Ñ–Ð¹ RR",
    totalPnl: "Ð—Ð°Ð³Ð°Ð»ÑŒÐ½Ð¸Ð¹ PnL",
    tradeDirectionEyebrow: "ÐÐ°Ð¿Ñ€ÑÐ¼Ð¾Ðº ÑƒÐ³Ð¾Ð´",
    longVsShort: "Long vs Short",
    longTrades: "Long ÑƒÐ³Ð¾Ð´Ð¸",
    shortTrades: "Short ÑƒÐ³Ð¾Ð´Ð¸",
    winrate: "winrate",
    tradeResultsEyebrow: "Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¸ ÑƒÐ³Ð¾Ð´",
    bestResults: "ÐÐ°Ð¹ÐºÑ€Ð°Ñ‰Ñ– Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¸",
    bestTrade: "ÐÐ°Ð¹ÐºÑ€Ð°Ñ‰Ð° ÑƒÐ³Ð¾Ð´Ð°",
    worstTrade: "ÐÐ°Ð¹Ð³Ñ–Ñ€ÑˆÐ° ÑƒÐ³Ð¾Ð´Ð°",
    outcomeBreakdownEyebrow: "Ð Ð¾Ð·Ð¿Ð¾Ð´Ñ–Ð» Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ–Ð²",
    outcomeBreakdownTitle: "Breakdown Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ–Ð²",
    wins: "ÐŸÐµÑ€ÐµÐ¼Ð¾Ð³Ð¸",
    losses: "Ð—Ð±Ð¸Ñ‚ÐºÐ¸",
    breakEven: "Break Even",
    mistakesEyebrow: "ÐÐ½Ð°Ð»Ñ–Ñ‚Ð¸ÐºÐ° Ð¿Ð¾Ð¼Ð¸Ð»Ð¾Ðº",
    recurringMistakes: "ÐŸÐ¾Ð²Ñ‚Ð¾Ñ€ÑŽÐ²Ð°Ð½Ñ– Ð¿Ð¾Ð¼Ð¸Ð»ÐºÐ¸",
    noMistakes: "Ð£ Ñ‚Ñ€ÐµÐ¹Ð´Ð°Ñ… Ñ‰Ðµ Ð½Ðµ Ð·Ð°Ñ„Ñ–ÐºÑÐ¾Ð²Ð°Ð½Ð¾ Ð¿Ð¾Ð¼Ð¸Ð»Ð¾Ðº.",
    repeatedTimes: (count) =>
      `ÐŸÐ¾Ð²Ñ‚Ð¾Ñ€ÐµÐ½Ð¾ ${count} ${count === 1 ? "Ñ€Ð°Ð·" : "Ñ€Ð°Ð·Ð¸"}`,
    setupQualityEyebrow: "Ð¯ÐºÑ–ÑÑ‚ÑŒ ÑÐµÑ‚Ð°Ð¿Ñƒ",
    setupPerformance: "Performance ÑÐµÑ‚Ð°Ð¿Ñ–Ð²",
    trades: "ÑƒÐ³Ð¾Ð´",
    teamAnalyticsEyebrow: "ÐÐ½Ð°Ð»Ñ–Ñ‚Ð¸ÐºÐ° ÐºÐ¾Ð¼Ð°Ð½Ð´Ð¸",
    traderLeaderboard: "Ð ÐµÐ¹Ñ‚Ð¸Ð½Ð³ Ñ‚Ñ€ÐµÐ¹Ð´ÐµÑ€Ñ–Ð²",
    traderFallback: "Ð¢Ñ€ÐµÐ¹Ð´ÐµÑ€",
    monthlyPerformanceEyebrow: "ÐœÑ–ÑÑÑ‡Ð½Ð° performance",
    monthlyDashboard: "ÐœÑ–ÑÑÑ‡Ð½Ð° dashboard",
    bestMonth: "ÐÐ°Ð¹ÐºÑ€Ð°Ñ‰Ð¸Ð¹ Ð¼Ñ–ÑÑÑ†ÑŒ",
    worstMonth: "ÐÐ°Ð¹Ð³Ñ–Ñ€ÑˆÐ¸Ð¹ Ð¼Ñ–ÑÑÑ†ÑŒ",
    greenMonths: "ÐŸÐ¾Ð·Ð¸Ñ‚Ð¸Ð²Ð½Ñ– Ð¼Ñ–ÑÑÑ†Ñ–",
    redMonths: "ÐÐµÐ³Ð°Ñ‚Ð¸Ð²Ð½Ñ– Ð¼Ñ–ÑÑÑ†Ñ–",
    aiInsightsEyebrow: "AI Insights",
    performanceInsights: "Ð†Ð½ÑÐ°Ð¹Ñ‚Ð¸ performance",
    noInsights: "ÐŸÐ¾ÐºÐ¸ Ð½ÐµÐ´Ð¾ÑÑ‚Ð°Ñ‚Ð½ÑŒÐ¾ Ð´Ð°Ð½Ð¸Ñ….",
    tradingPsychologyEyebrow: "ÐŸÑÐ¸Ñ…Ð¾Ð»Ð¾Ð³Ñ–Ñ Ñ‚Ñ€ÐµÐ¹Ð´Ð¸Ð½Ð³Ñƒ",
    emotionalPerformance: "Ð•Ð¼Ð¾Ñ†Ñ–Ð¹Ð½Ð° performance",
    pnl: "PnL",
    wr: "WR",
    lowConfidence: "ÐÐ¸Ð·ÑŒÐºÐ° Ð²Ð¿ÐµÐ²Ð½ÐµÐ½Ñ–ÑÑ‚ÑŒ",
    mediumConfidence: "Ð¡ÐµÑ€ÐµÐ´Ð½Ñ Ð²Ð¿ÐµÐ²Ð½ÐµÐ½Ñ–ÑÑ‚ÑŒ",
    highConfidence: "Ð’Ð¸ÑÐ¾ÐºÐ° Ð²Ð¿ÐµÐ²Ð½ÐµÐ½Ñ–ÑÑ‚ÑŒ",
    weakExecution: "Ð¡Ð»Ð°Ð±ÐºÐµ Ð²Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ",
    averageExecution: "Ð¡ÐµÑ€ÐµÐ´Ð½Ñ” Ð²Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ",
    eliteExecution: "Elite Ð²Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ",
    weakSetup: "Ð¡Ð»Ð°Ð±ÐºÐ¸Ð¹ ÑÐµÑ‚Ð°Ð¿",
    averageSetup: "Ð¡ÐµÑ€ÐµÐ´Ð½Ñ–Ð¹ ÑÐµÑ‚Ð°Ð¿",
    eliteSetup: "Elite ÑÐµÑ‚Ð°Ð¿",
    weakSetups: "Ð¡Ð»Ð°Ð±ÐºÑ– ÑÐµÑ‚Ð°Ð¿Ð¸",
    emotionalTrades: "Ð•Ð¼Ð¾Ñ†Ñ–Ð¹Ð½Ñ– ÑƒÐ³Ð¾Ð´Ð¸",
    psychology: "ÐŸÑÐ¸Ñ…Ð¾Ð»Ð¾Ð³Ñ–Ñ",
    confidence: "Ð’Ð¿ÐµÐ²Ð½ÐµÐ½Ñ–ÑÑ‚ÑŒ",
    execution: "Ð’Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ",
    setupQuality: "Ð¯ÐºÑ–ÑÑ‚ÑŒ ÑÐµÑ‚Ð°Ð¿Ñƒ",
    bestEmotionalState: (state, rate) =>
      `ÐÐ°Ð¹ÐºÑ€Ð°Ñ‰Ð¸Ð¹ ÐµÐ¼Ð¾Ñ†Ñ–Ð¹Ð½Ð¸Ð¹ ÑÑ‚Ð°Ð½: ${state} (${rate}% WR)`,
    mostExpensiveMistake: (mistake) =>
      `ÐÐ°Ð¹Ð´Ð¾Ñ€Ð¾Ð¶Ñ‡Ð° Ð¿Ð¾Ð¼Ð¸Ð»ÐºÐ°: ${mistake}`,
    longBetter:
      "Long ÑƒÐ³Ð¾Ð´Ð¸ Ð·Ð°Ñ€Ð°Ð· Ð¿Ñ€Ð°Ñ†ÑŽÑŽÑ‚ÑŒ ÐºÑ€Ð°Ñ‰Ðµ, Ð½Ñ–Ð¶ Short ÑƒÐ³Ð¾Ð´Ð¸.",
    shortBetter:
      "Short ÑƒÐ³Ð¾Ð´Ð¸ Ð·Ð°Ñ€Ð°Ð· Ð¿Ñ€Ð°Ñ†ÑŽÑŽÑ‚ÑŒ ÐºÑ€Ð°Ñ‰Ðµ, Ð½Ñ–Ð¶ Long ÑƒÐ³Ð¾Ð´Ð¸.",
    solidExecution:
      "Ð¢Ð²Ð¾Ñ Ð·Ð°Ð³Ð°Ð»ÑŒÐ½Ð° ÑÐºÑ–ÑÑ‚ÑŒ Ð²Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ Ð·Ð°Ñ€Ð°Ð· Ð´ÑƒÐ¶Ðµ ÑÐ¸Ð»ÑŒÐ½Ð°.",
    focusRisk:
      "Ð—Ð¾ÑÐµÑ€ÐµÐ´ÑŒÑÑ Ð½Ð° Ñ€Ð¸Ð·Ð¸Ðº-Ð¼ÐµÐ½ÐµÐ´Ð¶Ð¼ÐµÐ½Ñ‚Ñ– Ñ‚Ð° Ð²Ñ–Ð´Ð±Ð¾Ñ€Ñ– ÑƒÐ³Ð¾Ð´.",
  },

  ru: {
    grossProfit: "Ð’Ð°Ð»Ð¾Ð²Ð°Ñ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»ÑŒ",
    grossLoss: "Ð’Ð°Ð»Ð¾Ð²Ñ‹Ð¹ ÑƒÐ±Ñ‹Ñ‚Ð¾Ðº",
    profitFactor: "Profit Factor",
    bestWinStreak: "Ð›ÑƒÑ‡ÑˆÐ°Ñ ÑÐµÑ€Ð¸Ñ Ð¿Ð¾Ð±ÐµÐ´",
    advancedStatsEyebrow: "Ð Ð°ÑÑˆÐ¸Ñ€ÐµÐ½Ð½Ð°Ñ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ°",
    analyticsTitle: "ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ°",
    totalTrades: "Ð’ÑÐµÐ³Ð¾ ÑÐ´ÐµÐ»Ð¾Ðº",
    winRate: "Win Rate",
    averageRR: "Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ RR",
    totalPnl: "ÐžÐ±Ñ‰Ð¸Ð¹ PnL",
    tradeDirectionEyebrow: "ÐÐ°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÐ´ÐµÐ»Ð¾Ðº",
    longVsShort: "Long vs Short",
    longTrades: "Long ÑÐ´ÐµÐ»ÐºÐ¸",
    shortTrades: "Short ÑÐ´ÐµÐ»ÐºÐ¸",
    winrate: "winrate",
    tradeResultsEyebrow: "Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹ ÑÐ´ÐµÐ»Ð¾Ðº",
    bestResults: "Ð›ÑƒÑ‡ÑˆÐ¸Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹",
    bestTrade: "Ð›ÑƒÑ‡ÑˆÐ°Ñ ÑÐ´ÐµÐ»ÐºÐ°",
    worstTrade: "Ð¥ÑƒÐ´ÑˆÐ°Ñ ÑÐ´ÐµÐ»ÐºÐ°",
    outcomeBreakdownEyebrow: "Ð Ð°Ð·Ð±Ð¾Ñ€ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð²",
    outcomeBreakdownTitle: "Breakdown Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð²",
    wins: "ÐŸÐ¾Ð±ÐµÐ´Ñ‹",
    losses: "Ð£Ð±Ñ‹Ñ‚ÐºÐ¸",
    breakEven: "Break Even",
    mistakesEyebrow: "ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¾ÑˆÐ¸Ð±Ð¾Ðº",
    recurringMistakes: "ÐŸÐ¾Ð²Ñ‚Ð¾Ñ€ÑÑŽÑ‰Ð¸ÐµÑÑ Ð¾ÑˆÐ¸Ð±ÐºÐ¸",
    noMistakes: "Ð’ ÑÐ´ÐµÐ»ÐºÐ°Ñ… Ð¿Ð¾ÐºÐ° Ð½ÐµÑ‚ Ð·Ð°Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ð¾ÑˆÐ¸Ð±Ð¾Ðº.",
    repeatedTimes: (count) =>
      `ÐŸÐ¾Ð²Ñ‚Ð¾Ñ€ÐµÐ½Ð¾ ${count} ${count === 1 ? "Ñ€Ð°Ð·" : "Ñ€Ð°Ð·Ð°"}`,
    setupQualityEyebrow: "ÐšÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾ ÑÐµÑ‚Ð°Ð¿Ð°",
    setupPerformance: "Performance ÑÐµÑ‚Ð°Ð¿Ð¾Ð²",
    trades: "ÑÐ´ÐµÐ»Ð¾Ðº",
    teamAnalyticsEyebrow: "ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ‹",
    traderLeaderboard: "Ð ÐµÐ¹Ñ‚Ð¸Ð½Ð³ Ñ‚Ñ€ÐµÐ¹Ð´ÐµÑ€Ð¾Ð²",
    traderFallback: "Ð¢Ñ€ÐµÐ¹Ð´ÐµÑ€",
    monthlyPerformanceEyebrow: "ÐœÐµÑÑÑ‡Ð½Ð°Ñ performance",
    monthlyDashboard: "ÐœÐµÑÑÑ‡Ð½Ð°Ñ dashboard",
    bestMonth: "Ð›ÑƒÑ‡ÑˆÐ¸Ð¹ Ð¼ÐµÑÑÑ†",
    worstMonth: "Ð¥ÑƒÐ´ÑˆÐ¸Ð¹ Ð¼ÐµÑÑÑ†",
    greenMonths: "ÐŸÐ¾Ð»Ð¾Ð¶Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð¼ÐµÑÑÑ†Ñ‹",
    redMonths: "ÐžÑ‚Ñ€Ð¸Ñ†Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð¼ÐµÑÑÑ†Ñ‹",
    aiInsightsEyebrow: "AI Insights",
    performanceInsights: "Ð˜Ð½ÑÐ°Ð¹Ñ‚Ñ‹ performance",
    noInsights: "ÐŸÐ¾ÐºÐ° Ð½ÐµÐ´Ð¾ÑÑ‚Ð°Ñ‚Ð¾Ñ‡Ð½Ð¾ Ð´Ð°Ð½Ð½Ñ‹Ñ….",
    tradingPsychologyEyebrow: "ÐŸÑÐ¸Ñ…Ð¾Ð»Ð¾Ð³Ð¸Ñ Ñ‚Ñ€ÐµÐ¹Ð´Ð¸Ð½Ð³Ð°",
    emotionalPerformance: "Ð­Ð¼Ð¾Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð°Ñ performance",
    pnl: "PnL",
    wr: "WR",
    lowConfidence: "ÐÐ¸Ð·ÐºÐ°Ñ ÑƒÐ²ÐµÑ€ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ",
    mediumConfidence: "Ð¡Ñ€ÐµÐ´Ð½ÑÑ ÑƒÐ²ÐµÑ€ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ",
    highConfidence: "Ð’Ñ‹ÑÐ¾ÐºÐ°Ñ ÑƒÐ²ÐµÑ€ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ",
    weakExecution: "Ð¡Ð»Ð°Ð±Ð¾Ðµ Ð¸ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ",
    averageExecution: "Ð¡Ñ€ÐµÐ´Ð½ÐµÐµ Ð¸ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ",
    eliteExecution: "Elite Ð¸ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ",
    weakSetup: "Ð¡Ð»Ð°Ð±Ñ‹Ð¹ ÑÐµÑ‚Ð°Ð¿",
    averageSetup: "Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ ÑÐµÑ‚Ð°Ð¿",
    eliteSetup: "Elite ÑÐµÑ‚Ð°Ð¿",
    weakSetups: "Ð¡Ð»Ð°Ð±Ñ‹Ðµ ÑÐµÑ‚Ð°Ð¿Ñ‹",
    emotionalTrades: "Ð­Ð¼Ð¾Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ ÑÐ´ÐµÐ»ÐºÐ¸",
    psychology: "ÐŸÑÐ¸Ñ…Ð¾Ð»Ð¾Ð³Ð¸Ñ",
    confidence: "Ð£Ð²ÐµÑ€ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ",
    execution: "Ð˜ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ",
    setupQuality: "ÐšÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾ ÑÐµÑ‚Ð°Ð¿Ð°",
    bestEmotionalState: (state, rate) =>
      `Ð›ÑƒÑ‡ÑˆÐµÐµ ÑÐ¼Ð¾Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ðµ ÑÐ¾ÑÑ‚Ð¾ÑÐ½Ð¸Ðµ: ${state} (${rate}% WR)`,
    mostExpensiveMistake: (mistake) =>
      `Ð¡Ð°Ð¼Ð°Ñ Ð´Ð¾Ñ€Ð¾Ð³Ð°Ñ Ð¾ÑˆÐ¸Ð±ÐºÐ°: ${mistake}`,
    longBetter:
      "Long ÑÐ´ÐµÐ»ÐºÐ¸ ÑÐµÐ¹Ñ‡Ð°Ñ Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÑŽÑ‚ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð»ÑƒÑ‡ÑˆÐµ, Ñ‡ÐµÐ¼ Short ÑÐ´ÐµÐ»ÐºÐ¸.",
    shortBetter:
      "Short ÑÐ´ÐµÐ»ÐºÐ¸ ÑÐµÐ¹Ñ‡Ð°Ñ Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÑŽÑ‚ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð»ÑƒÑ‡ÑˆÐµ, Ñ‡ÐµÐ¼ Long ÑÐ´ÐµÐ»ÐºÐ¸.",
    solidExecution:
      "ÐžÐ±Ñ‰ÐµÐµ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾ Ñ‚Ð²Ð¾ÐµÐ³Ð¾ Ð¸ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ ÑÐµÐ¹Ñ‡Ð°Ñ Ð¾Ñ‡ÐµÐ½ÑŒ ÑÐ¸Ð»ÑŒÐ½Ð¾Ðµ.",
    focusRisk:
      "Ð¡Ñ„Ð¾ÐºÑƒÑÐ¸Ñ€ÑƒÐ¹ÑÑ Ð½Ð° Ñ€Ð¸ÑÐº-Ð¼ÐµÐ½ÐµÐ´Ð¶Ð¼ÐµÐ½Ñ‚Ðµ Ð¸ Ð¾Ñ‚Ð±Ð¾Ñ€Ðµ ÑÐ´ÐµÐ»Ð¾Ðº.",
  },

  es: {
    grossProfit: "Beneficio bruto",
    grossLoss: "PÃ©rdida bruta",
    profitFactor: "Profit Factor",
    bestWinStreak: "Mejor racha ganadora",
    advancedStatsEyebrow: "EstadÃ­sticas avanzadas",
    analyticsTitle: "AnalÃ­tica",
    totalTrades: "Trades totales",
    winRate: "Win Rate",
    averageRR: "RR medio",
    totalPnl: "PnL total",
    tradeDirectionEyebrow: "DirecciÃ³n del trade",
    longVsShort: "Long vs Short",
    longTrades: "Trades Long",
    shortTrades: "Trades Short",
    winrate: "winrate",
    tradeResultsEyebrow: "Resultados de trades",
    bestResults: "Mejores resultados",
    bestTrade: "Mejor trade",
    worstTrade: "Peor trade",
    outcomeBreakdownEyebrow: "Desglose de resultados",
    outcomeBreakdownTitle: "Breakdown de resultados",
    wins: "Ganadas",
    losses: "Perdidas",
    breakEven: "Break Even",
    mistakesEyebrow: "AnalÃ­tica de errores",
    recurringMistakes: "Errores recurrentes",
    noMistakes: "No hay errores registrados en los trades.",
    repeatedTimes: (count) =>
      `Repetido ${count} ${count === 1 ? "vez" : "veces"}`,
    setupQualityEyebrow: "Calidad del setup",
    setupPerformance: "Performance del setup",
    trades: "trades",
    teamAnalyticsEyebrow: "AnalÃ­tica del equipo",
    traderLeaderboard: "Ranking de traders",
    traderFallback: "Trader",
    monthlyPerformanceEyebrow: "Performance mensual",
    monthlyDashboard: "Dashboard mensual",
    bestMonth: "Mejor mes",
    worstMonth: "Peor mes",
    greenMonths: "Meses positivos",
    redMonths: "Meses negativos",
    aiInsightsEyebrow: "AI Insights",
    performanceInsights: "Insights de performance",
    noInsights: "TodavÃ­a no hay suficientes datos.",
    tradingPsychologyEyebrow: "PsicologÃ­a del trading",
    emotionalPerformance: "Performance emocional",
    pnl: "PnL",
    wr: "WR",
    lowConfidence: "Baja confianza",
    mediumConfidence: "Confianza media",
    highConfidence: "Alta confianza",
    weakExecution: "EjecuciÃ³n dÃ©bil",
    averageExecution: "EjecuciÃ³n media",
    eliteExecution: "EjecuciÃ³n elite",
    weakSetup: "Setup dÃ©bil",
    averageSetup: "Setup medio",
    eliteSetup: "Setup elite",
    weakSetups: "Setups dÃ©biles",
    emotionalTrades: "Trades emocionales",
    psychology: "PsicologÃ­a",
    confidence: "Confianza",
    execution: "EjecuciÃ³n",
    setupQuality: "Calidad del setup",
    bestEmotionalState: (state, rate) =>
      `Mejor estado emocional: ${state} (${rate}% WR)`,
    mostExpensiveMistake: (mistake) =>
      `Error mÃ¡s costoso: ${mistake}`,
    longBetter:
      "Los trades Long actualmente funcionan mejor que los Short.",
    shortBetter:
      "Los trades Short actualmente funcionan mejor que los Long.",
    solidExecution:
      "Tu ejecuciÃ³n general actualmente es muy sÃ³lida.",
    focusRisk:
      "ConcÃ©ntrate en la gestiÃ³n del riesgo y la selecciÃ³n de trades.",
  },

  fr: {
    grossProfit: "Profit brut",
    grossLoss: "Perte brute",
    profitFactor: "Profit Factor",
    bestWinStreak: "Meilleure sÃ©rie de gains",
    advancedStatsEyebrow: "Statistiques avancÃ©es",
    analyticsTitle: "Analytics",
    totalTrades: "Trades totaux",
    winRate: "Win Rate",
    averageRR: "RR moyen",
    totalPnl: "PnL total",
    tradeDirectionEyebrow: "Direction des trades",
    longVsShort: "Long vs Short",
    longTrades: "Trades Long",
    shortTrades: "Trades Short",
    winrate: "winrate",
    tradeResultsEyebrow: "RÃ©sultats des trades",
    bestResults: "Meilleurs rÃ©sultats",
    bestTrade: "Meilleur trade",
    worstTrade: "Pire trade",
    outcomeBreakdownEyebrow: "RÃ©partition des rÃ©sultats",
    outcomeBreakdownTitle: "Breakdown des rÃ©sultats",
    wins: "Gagnants",
    losses: "Perdants",
    breakEven: "Break Even",
    mistakesEyebrow: "Analyse des erreurs",
    recurringMistakes: "Erreurs rÃ©currentes",
    noMistakes: "Aucune erreur enregistrÃ©e dans les trades.",
    repeatedTimes: (count) =>
      `RÃ©pÃ©tÃ© ${count} ${count === 1 ? "fois" : "fois"}`,
    setupQualityEyebrow: "QualitÃ© du setup",
    setupPerformance: "Performance des setups",
    trades: "trades",
    teamAnalyticsEyebrow: "Analytics Ã©quipe",
    traderLeaderboard: "Classement des traders",
    traderFallback: "Trader",
    monthlyPerformanceEyebrow: "Performance mensuelle",
    monthlyDashboard: "Dashboard mensuel",
    bestMonth: "Meilleur mois",
    worstMonth: "Pire mois",
    greenMonths: "Mois positifs",
    redMonths: "Mois nÃ©gatifs",
    aiInsightsEyebrow: "AI Insights",
    performanceInsights: "Insights performance",
    noInsights: "Il nâ€™y a pas encore assez de donnÃ©es.",
    tradingPsychologyEyebrow: "Psychologie du trading",
    emotionalPerformance: "Performance Ã©motionnelle",
    pnl: "PnL",
    wr: "WR",
    lowConfidence: "Faible confiance",
    mediumConfidence: "Confiance moyenne",
    highConfidence: "Haute confiance",
    weakExecution: "ExÃ©cution faible",
    averageExecution: "ExÃ©cution moyenne",
    eliteExecution: "ExÃ©cution elite",
    weakSetup: "Setup faible",
    averageSetup: "Setup moyen",
    eliteSetup: "Setup elite",
    weakSetups: "Setups faibles",
    emotionalTrades: "Trades Ã©motionnels",
    psychology: "Psychologie",
    confidence: "Confiance",
    execution: "ExÃ©cution",
    setupQuality: "QualitÃ© du setup",
    bestEmotionalState: (state, rate) =>
      `Meilleur Ã©tat Ã©motionnel : ${state} (${rate}% WR)`,
    mostExpensiveMistake: (mistake) =>
      `Erreur la plus coÃ»teuse : ${mistake}`,
    longBetter:
      "Les trades Long performent actuellement mieux que les trades Short.",
    shortBetter:
      "Les trades Short performent actuellement mieux que les trades Long.",
    solidExecution:
      "Ton exÃ©cution globale est actuellement trÃ¨s solide.",
    focusRisk:
      "Concentre-toi sur la gestion du risque et la sÃ©lection des trades.",
  },

  de: {
    grossProfit: "Bruttogewinn",
    grossLoss: "Bruttoverlust",
    profitFactor: "Profit Factor",
    bestWinStreak: "Beste Gewinnserie",
    advancedStatsEyebrow: "Erweiterte Statistiken",
    analyticsTitle: "Analytics",
    totalTrades: "Trades gesamt",
    winRate: "Win Rate",
    averageRR: "Durchschnittlicher RR",
    totalPnl: "Gesamt-PnL",
    tradeDirectionEyebrow: "Trade-Richtung",
    longVsShort: "Long vs Short",
    longTrades: "Long Trades",
    shortTrades: "Short Trades",
    winrate: "Winrate",
    tradeResultsEyebrow: "Trade-Ergebnisse",
    bestResults: "Beste Ergebnisse",
    bestTrade: "Bester Trade",
    worstTrade: "Schlechtester Trade",
    outcomeBreakdownEyebrow: "ErgebnisÃ¼bersicht",
    outcomeBreakdownTitle: "Ergebnis-Breakdown",
    wins: "Gewinne",
    losses: "Verluste",
    breakEven: "Break Even",
    mistakesEyebrow: "Fehleranalyse",
    recurringMistakes: "Wiederkehrende Fehler",
    noMistakes: "Keine Fehler in den Trades erfasst.",
    repeatedTimes: (count) =>
      `${count} ${count === 1 ? "Mal" : "Mal"} wiederholt`,
    setupQualityEyebrow: "Setup-QualitÃ¤t",
    setupPerformance: "Setup-Performance",
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
    aiInsightsEyebrow: "AI Insights",
    performanceInsights: "Performance Insights",
    noInsights: "Es gibt noch nicht genug Daten.",
    tradingPsychologyEyebrow: "Trading-Psychologie",
    emotionalPerformance: "Emotionale Performance",
    pnl: "PnL",
    wr: "WR",
    lowConfidence: "Geringes Vertrauen",
    mediumConfidence: "Mittleres Vertrauen",
    highConfidence: "Hohes Vertrauen",
    weakExecution: "Schwache AusfÃ¼hrung",
    averageExecution: "Durchschnittliche AusfÃ¼hrung",
    eliteExecution: "Elite-AusfÃ¼hrung",
    weakSetup: "Schwaches Setup",
    averageSetup: "Durchschnittliches Setup",
    eliteSetup: "Elite-Setup",
    weakSetups: "Schwache Setups",
    emotionalTrades: "Emotionale Trades",
    psychology: "Psychologie",
    confidence: "Vertrauen",
    execution: "AusfÃ¼hrung",
    setupQuality: "Setup-QualitÃ¤t",
    bestEmotionalState: (state, rate) =>
      `Bester emotionaler Zustand: ${state} (${rate}% WR)`,
    mostExpensiveMistake: (mistake) =>
      `Teuerster Fehler: ${mistake}`,
    longBetter:
      "Long Trades performen aktuell besser als Short Trades.",
    shortBetter:
      "Short Trades performen aktuell besser als Long Trades.",
    solidExecution:
      "Deine gesamte AusfÃ¼hrung ist aktuell sehr solide.",
    focusRisk:
      "Konzentriere dich auf Risikomanagement und Trade-Auswahl.",
  },
};


export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{
    accountId: string;
  }>;
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
    },
  });

  const language = normalizeAppLanguage(
    currentUser?.appLanguage
  );

  const locale = getLocaleFromLanguage(language);
  const t = analyticsLabels[language];

  const formatCurrency = (
    value: number,
    currency: string
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
    },

    include: {
      createdBy: true,
    },

    orderBy: {
      openDate: "asc",
    },
  });

  const totalTrades = trades.length;

  const wins = trades.filter(
    (trade) => trade.outcome === "win"
  );

  const losses = trades.filter(
    (trade) => trade.outcome === "loss"
  );

  const longTrades = trades.filter(
    (trade) =>
      trade.direction?.toLowerCase() ===
      "long"
  );

  const shortTrades = trades.filter(
    (trade) =>
      trade.direction?.toLowerCase() ===
      "short"
  );

  const totalPnl = trades.reduce(
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
    getBestWinStreak(trades);

  const averageRR =
    trades.length > 0
      ? trades.reduce(
        (acc, trade) =>
          acc +
          (trade.riskReward || 0),
        0
      ) / trades.length
      : 0;

  const bestTrade =
    trades.length > 0
      ? Math.max(
        ...trades.map(
          (trade) =>
            trade.resultUsd || 0
        )
      )
      : 0;

  const worstTrade =
    trades.length > 0
      ? Math.min(
        ...trades.map(
          (trade) =>
            trade.resultUsd || 0
        )
      )
      : 0;

  const symbolStats: Record<
    string,
    {
      trades: number;
      pnl: number;
    }
  > = {};

  for (const trade of trades) {
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

  for (const trade of trades) {
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

  for (const trade of trades) {
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
    totalTrades > 0
      ? (wins.length / totalTrades) * 100
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

  for (const trade of trades) {
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

  for (const trade of trades) {
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

  for (const trade of trades) {
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

  const insights: string[] = [];

  const bestEmotion =
    Object.entries(emotionalStats).sort(
      (a, b) => {
        const aRate =
          a[1].trades > 0
            ? a[1].wins /
            a[1].trades
            : 0;

        const bRate =
          b[1].trades > 0
            ? b[1].wins /
            b[1].trades
            : 0;

        return bRate - aRate;
      }
    )[0];

  if (bestEmotion) {
    const rate =
      bestEmotion[1].trades > 0
        ? (
          (bestEmotion[1].wins /
            bestEmotion[1].trades) *
          100
        ).toFixed(0)
        : "0";

    insights.push(
      t.bestEmotionalState(bestEmotion[0], rate)
    );
  }

  const worstMistake =
    Object.entries(mistakesStats).sort(
      (a, b) =>
        a[1].pnl - b[1].pnl
    )[0];

  if (worstMistake) {
    insights.push(
      t.mostExpensiveMistake(worstMistake[0])
    );
  }

  if (longWinRate > shortWinRate) {
    insights.push(
      t.longBetter
    );
  } else if (
    shortWinRate > longWinRate
  ) {
    insights.push(
      t.shortBetter
    );
  }

  if (winRate >= 60) {
    insights.push(
      t.solidExecution
    );
  } else if (winRate <= 40) {
    insights.push(
      t.focusRisk
    );
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

  for (const trade of trades) {
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

  const cards = [
    {
      label: t.totalTrades,
      value: totalTrades,
      tone: "text-white",
      icon: BarChart3,
    },

    {
      label: t.winRate,
      value: `${winRate.toFixed(2)}%`,
      tone:
        winRate >= 50
          ? "text-green-400"
          : "text-red-400",
      icon: Target,
    },

    {
      label: t.averageRR,
      value: averageRR.toFixed(2),
      tone: "text-yellow-400",
      icon: CandlestickChart,
    },

    {
      label: t.totalPnl,
      value: formatCurrency(
        totalPnl,
        account.currency
      ),
      tone:
        totalPnl >= 0
          ? "text-green-400"
          : "text-red-400",
      icon:
        totalPnl >= 0
          ? TrendingUp
          : TrendingDown,
    },
  ];

  const weekdayMap = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  trades.forEach((trade) => {
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

  const emotionalStateMap = trades.reduce(
    (acc, trade) => {
      const emotion =
        trade.emotionalState || t.traderFallback;

      if (!acc[emotion]) {
        acc[emotion] = {
          count: 0,
          pnl: 0,
        };
      }

      acc[emotion].count += 1;
      acc[emotion].pnl += trade.resultUsd || 0;

      return acc;
    },
    {} as Record<
      string,
      {
        count: number;
        pnl: number;
      }
    >
  );

  const emotionalStateHeatmapData =
    Object.entries(emotionalStateMap).map(
      ([emotion, stats]) => ({
        emotion,
        count: stats.count,
        pnl: stats.pnl,
      })
    );

  const confidenceHeatmapData = [
    {
      level: t.lowConfidence,
      count: trades.filter(
        (trade) =>
          (trade.confidence || 0) > 0 &&
          (trade.confidence || 0) <= 4
      ).length,
      pnl: trades
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
      count: trades.filter(
        (trade) =>
          (trade.confidence || 0) >= 5 &&
          (trade.confidence || 0) <= 7
      ).length,
      pnl: trades
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
      count: trades.filter(
        (trade) =>
          (trade.confidence || 0) >= 8
      ).length,
      pnl: trades
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
      count: trades.filter(
        (trade) =>
          (trade.executionRating || 0) > 0 &&
          (trade.executionRating || 0) <= 4
      ).length,
      pnl: trades
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
      count: trades.filter(
        (trade) =>
          (trade.executionRating || 0) >= 5 &&
          (trade.executionRating || 0) <= 7
      ).length,
      pnl: trades
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
      count: trades.filter(
        (trade) =>
          (trade.executionRating || 0) >= 8
      ).length,
      pnl: trades
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
      count: trades.filter(
        (trade) =>
          (trade.setupQuality || 0) > 0 &&
          (trade.setupQuality || 0) <= 4
      ).length,
      pnl: trades
        .filter(
          (trade) =>
            (trade.setupQuality || 0) > 0 &&
            (trade.setupQuality || 0) <= 4
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
    {
      level: t.averageSetup,
      count: trades.filter(
        (trade) =>
          (trade.setupQuality || 0) >= 5 &&
          (trade.setupQuality || 0) <= 7
      ).length,
      pnl: trades
        .filter(
          (trade) =>
            (trade.setupQuality || 0) >= 5 &&
            (trade.setupQuality || 0) <= 7
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
    {
      level: t.eliteSetup,
      count: trades.filter(
        (trade) =>
          (trade.setupQuality || 0) >= 8
      ).length,
      pnl: trades
        .filter(
          (trade) =>
            (trade.setupQuality || 0) >= 8
        )
        .reduce(
          (acc, trade) =>
            acc + (trade.resultUsd || 0),
          0
        ),
    },
  ];

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

  const lowConfidenceCount = trades.filter(
    (trade) =>
      (trade.confidence || 0) > 0 &&
      (trade.confidence || 0) <= 4
  ).length;

  const weakExecutionCount = trades.filter(
    (trade) =>
      (trade.executionRating || 0) > 0 &&
      (trade.executionRating || 0) <= 4
  ).length;

  const weakSetupCount = trades.filter(
    (trade) =>
      (trade.setupQuality || 0) > 0 &&
      (trade.setupQuality || 0) <= 4
  ).length;

  const emotionalCount = trades.filter(
    (trade) =>
      trade.emotionalState &&
      trade.emotionalState.length > 0
  ).length;

  const behavioralRiskHeatmapData = [
    {
      factor: t.lowConfidence,
      count: lowConfidenceCount,
      severity: getRiskSeverity(
        lowConfidenceCount,
        trades.length
      ),
    },
    {
      factor: t.weakExecution,
      count: weakExecutionCount,
      severity: getRiskSeverity(
        weakExecutionCount,
        trades.length
      ),
    },
    {
      factor: t.weakSetups,
      count: weakSetupCount,
      severity: getRiskSeverity(
        weakSetupCount,
        trades.length
      ),
    },
    {
      factor: t.emotionalTrades,
      count: emotionalCount,
      severity: getRiskSeverity(
        emotionalCount,
        trades.length
      ),
    },
  ];

  const riskConcentrationData = [
    {
      label: t.psychology,
      value:
        trades.length > 0
          ? Math.round(
            (emotionalCount / trades.length) *
            100
          )
          : 0,
    },
    {
      label: t.confidence,
      value:
        trades.length > 0
          ? Math.round(
            (lowConfidenceCount /
              trades.length) *
            100
          )
          : 0,
    },
    {
      label: t.execution,
      value:
        trades.length > 0
          ? Math.round(
            (weakExecutionCount /
              trades.length) *
            100
          )
          : 0,
    },
    {
      label: t.setupQuality,
      value:
        trades.length > 0
          ? Math.round(
            (weakSetupCount / trades.length) *
            100
          )
          : 0,
    },
  ];

  const executionTrendData = trades
    .filter(
      (trade) =>
        typeof trade.executionRating === "number"
    )
    .map((trade) => ({
      date: new Date(trade.openDate).toLocaleDateString(
        locale,
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
      execution: trade.executionRating || 0,
    }));

  const confidenceEvolutionData = trades
    .filter(
      (trade) =>
        typeof trade.confidence === "number"
    )
    .map((trade) => ({
      date: new Date(trade.openDate).toLocaleDateString(
        locale,
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
      confidence: trade.confidence || 0,
    }));

  const emotionalTimelineData = trades
    .filter(
      (trade) =>
        trade.emotionalState &&
        trade.emotionalState.length > 0
    )
    .map((trade) => ({
      date: new Date(trade.openDate).toLocaleDateString(
        locale,
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
      emotional: 1,
    }));

  const disciplineEvolutionData = trades
    .filter(
      (trade) =>
        typeof trade.executionRating === "number" ||
        typeof trade.setupQuality === "number"
    )
    .map((trade) => {
      const execution =
        trade.executionRating || 0;

      const setupQuality =
        trade.setupQuality || 0;

      const discipline =
        Math.round(
          (execution + setupQuality) / 2
        );

      return {
        date: new Date(trade.openDate).toLocaleDateString(
          locale,
          {
            day: "2-digit",
            month: "2-digit",
          }
        ),
        discipline,
      };
    });

  const consistencyCurveData = trades.map((trade) => {
    const execution =
      trade.executionRating || 0;

    const setupQuality =
      trade.setupQuality || 0;

    const confidence =
      trade.confidence || 0;

    const tradeScore = Math.round(
      execution * 4 +
      setupQuality * 4 +
      confidence * 2
    );

    return {
      date: new Date(trade.openDate).toLocaleDateString(
        locale,
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
      consistency: Math.min(100, tradeScore),
    };
  });

  const psychologicalStabilityData = trades.map((trade) => {
    const confidence =
      trade.confidence || 0;

    const hasEmotion =
      trade.emotionalState &&
      trade.emotionalState.length > 0;

    const stability = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          confidence * 10 -
          (hasEmotion ? 20 : 0)
        )
      )
    );

    return {
      date: new Date(trade.openDate).toLocaleDateString(
        locale,
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
      stability,
    };
  });

  return (
    <div>

      <AnalyticsHero
        accountName={account.name}
        totalPnl={formatCurrency(
          totalPnl,
          account.currency
        )}
        winRate={winRate}
        totalTrades={trades.length}
        appLanguage={language}
      />

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.grossProfit}
          </p>

          <h2 className="mt-2 text-2xl font-black text-green-400">
            {formatCurrency(
              grossProfit,
              account.currency
            )}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.grossLoss}
          </p>

          <h2 className="mt-2 text-2xl font-black text-red-400">
            {formatCurrency(
              grossLoss,
              account.currency
            )}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.profitFactor}
          </p>

          <h2 className={`mt-2 text-2xl font-black ${profitFactor >= 1
              ? "text-green-400"
              : "text-red-400"
            }`}>
            {profitFactor.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.bestWinStreak}
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            {bestWinStreak}
          </h2>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-400">
          {t.advancedStatsEyebrow}
        </p>

        <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
          <BarChart3 className="text-green-400" />
          {t.analyticsTitle}
        </h1>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <AnalyticsStatCard
            key={card.label}
            label={card.label}
            value={card.value}
            tone={card.tone}
            icon={card.icon}
          />
        ))}
      </div>

      <PerformanceIntelligence
        averageWin={formatCurrency(
          averageWin,
          account.currency
        )}
        averageLoss={formatCurrency(
          Math.abs(averageLoss),
          account.currency
        )}
        profitFactor={profitFactor.toFixed(2)}
        bestWinStreak={bestWinStreak}
      />

      <PerformanceInsights
        winRate={winRate}
        averageRR={averageRR}
        totalPnl={totalPnl}
        bestSymbol={bestSymbol?.[0]}
      />

      <div className="mt-8">
        <WeekdayHeatmap
          data={weekdayHeatmapData}
        />
      </div>

      <div className="mt-8">
        <EmotionalStateHeatmap
          data={emotionalStateHeatmapData}
        />
      </div>

      <div className="mt-8">
        <ConfidencePerformanceHeatmap
          data={confidenceHeatmapData}
        />
      </div>

      <div className="mt-8">
        <ExecutionQualityHeatmap
          data={executionHeatmapData}
        />
      </div>

      <div className="mt-8">
        <SetupQualityHeatmap
          data={setupHeatmapData}
        />
      </div>

      <div className="mt-8">
        <BehavioralRiskHeatmap
          data={behavioralRiskHeatmapData}
        />
      </div>

      <div className="mt-8">
        <RiskConcentrationMatrix
          risks={riskConcentrationData}
        />
      </div>

      <div className="mt-8">
        <ExecutionTrendChart
          data={executionTrendData}
        />
      </div>

      <div className="mt-8">
        <ConfidenceEvolutionChart
          data={confidenceEvolutionData}
        />
      </div>

      <div className="mt-8">
        <EmotionalTimelineChart
          data={emotionalTimelineData}
        />
      </div>

      <div className="mt-8">
        <DisciplineEvolutionChart
          data={disciplineEvolutionData}
        />
      </div>

      <div className="mt-8">
        <ConsistencyCurveChart
          data={consistencyCurveData}
        />
      </div>

      <div className="mt-8">
        <PsychologicalStabilityCurve
          data={psychologicalStabilityData}
        />
      </div>

      <PsychologyAnalytics
        averageConfidence={
          Math.round(
            trades.reduce(
              (acc, trade) =>
                acc + (trade.confidence || 0),
              0
            ) / Math.max(trades.length, 1)
          )
        }
        averageExecution={
          Math.round(
            trades.reduce(
              (acc, trade) =>
                acc +
                (trade.executionRating || 0),
              0
            ) / Math.max(trades.length, 1)
          )
        }
        averageSetupQuality={
          Math.round(
            trades.reduce(
              (acc, trade) =>
                acc +
                (trade.setupQuality || 0),
              0
            ) / Math.max(trades.length, 1)
          )
        }
      />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <SymbolPerformance
          bestSymbol={bestSymbol}
          worstSymbol={worstSymbol}
          mostTraded={mostTraded}
          currency={account.currency}
          formatCurrency={formatCurrency}
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-sm text-gray-400">
          {t.tradeDirectionEyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {t.longVsShort}
        </h2>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                {t.longTrades}
              </p>

              <p className="font-bold text-white">
                {longTrades.length}
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-green-400"
                style={{
                  width: `${Math.min(
                    longWinRate,
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm text-green-400">
              {longWinRate.toFixed(2)}%
              {t.winrate}
            </p>
          </div>

          <div className="rounded-2xl bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                {t.shortTrades}
              </p>

              <p className="font-bold text-white">
                {shortTrades.length}
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-red-400"
                style={{
                  width: `${Math.min(
                    shortWinRate,
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm text-red-400">
              {shortWinRate.toFixed(2)}%
              {t.winrate}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-sm text-gray-400">
          {t.tradeResultsEyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {t.bestResults}
        </h2>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              {t.bestTrade}
            </p>

            <h3 className="mt-2 text-2xl font-bold text-green-400">
              {formatCurrency(
                bestTrade,
                account.currency
              )}
            </h3>
          </div>

          <div className="rounded-2xl bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              {t.worstTrade}
            </p>

            <h3 className="mt-2 text-2xl font-bold text-red-400">
              {formatCurrency(
                worstTrade,
                account.currency
              )}
            </h3>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <SessionPerformance
          londonTrades={
            trades.filter(
              (trade) =>
                trade.session === "London"
            ).length
          }
          newYorkTrades={
            trades.filter(
              (trade) =>
                trade.session === "New York"
            ).length
          }
          asianTrades={
            trades.filter(
              (trade) =>
                trade.session === "Asian"
            ).length
          }
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-sm text-gray-400">
          {t.outcomeBreakdownEyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {t.outcomeBreakdownTitle}
        </h2>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
            <p className="text-gray-400">
              {t.wins}
            </p>

            <p className="font-bold text-green-400">
              {wins.length}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
            <p className="text-gray-400">
              {t.losses}
            </p>

            <p className="font-bold text-red-400">
              {losses.length}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
            <p className="text-gray-400">
              {t.breakEven}
            </p>

            <p className="font-bold text-yellow-400">
              {trades.filter(
                (trade) =>
                  trade.outcome === "be"
              ).length}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
        <p className="text-sm text-gray-400">
          {t.mistakesEyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {t.recurringMistakes}
        </h2>

        <div className="mt-6 space-y-4">
          {Object.entries(mistakesStats).length === 0 ? (
            <p className="text-sm text-gray-500">
              {t.noMistakes}
            </p>
          ) : (
            Object.entries(mistakesStats)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([mistake, stats]) => (
                <div
                  key={mistake}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="font-bold text-white">
                      {mistake}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {t.repeatedTimes(stats.count)}
                    </p>
                  </div>

                  <p
                    className={`font-bold ${stats.pnl >= 0
                      ? "text-green-400"
                      : "text-red-400"
                      }`}
                  >
                    {formatCurrency(stats.pnl, account.currency)}
                  </p>
                </div>
              ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
        <p className="text-sm text-gray-400">
          {t.setupQualityEyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {t.setupPerformance}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.entries(
            setupQualityStats
          ).map(([level, stats]) => {
            const wr =
              stats.trades > 0
                ? (
                  (stats.wins /
                    stats.trades) *
                  100
                ).toFixed(0)
                : "0";

            return (
              <div
                key={level}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold capitalize text-white">
                    {level}
                  </h3>

                  <div
                    className={`rounded-xl px-3 py-1 text-xs font-bold ${Number(wr) >= 50
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                      }`}
                  >
                    {wr}%
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {t.trades}
                    </p>

                    <p className="font-bold text-white">
                      {stats.trades}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {t.wins}
                    </p>

                    <p className="font-bold text-green-400">
                      {stats.wins}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {t.pnl}
                    </p>

                    <p
                      className={`font-bold ${stats.pnl >= 0
                        ? "text-green-400"
                        : "text-red-400"
                        }`}
                    >
                      {formatCurrency(
                        stats.pnl,
                        account.currency
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isSharedAccount && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <p className="text-sm text-gray-400">
            {t.teamAnalyticsEyebrow}
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {t.traderLeaderboard}
          </h2>

          <div className="mt-6 space-y-4">
            {Object.values(traderStats)
              .sort((a, b) => b.pnl - a.pnl)
              .map((trader, index) => {
                const wr =
                  trader.trades > 0
                    ? (
                      (trader.wins /
                        trader.trades) *
                      100
                    ).toFixed(0)
                    : "0";

                return (
                  <div
                    key={trader.name}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10 font-bold text-green-400">
                          #{index + 1}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {trader.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {trader.trades} {t.trades}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div>
                        <p className="text-xs text-gray-500">
                          {t.wr}
                        </p>

                        <p className="font-bold text-white">
                          {wr}%
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          {t.wins}
                        </p>

                        <p className="font-bold text-green-400">
                          {trader.wins}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          {t.pnl}
                        </p>

                        <p
                          className={`font-bold ${trader.pnl >= 0
                            ? "text-green-400"
                            : "text-red-400"
                            }`}
                        >
                          {formatCurrency(
                            trader.pnl,
                            account.currency
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
        <p className="text-sm text-gray-400">
          {t.monthlyPerformanceEyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {t.monthlyDashboard}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              {t.bestMonth}
            </p>

            <h3 className="mt-2 text-lg font-bold text-green-400">
              {bestMonth?.[0] || "-"}
            </h3>

            <p className="mt-1 text-sm text-green-400">
              {bestMonth
                ? formatCurrency(
                  bestMonth[1].pnl,
                  account.currency
                )
                : "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              {t.worstMonth}
            </p>

            <h3 className="mt-2 text-lg font-bold text-red-400">
              {worstMonth?.[0] || "-"}
            </h3>

            <p className="mt-1 text-sm text-red-400">
              {worstMonth
                ? formatCurrency(
                  worstMonth[1].pnl,
                  account.currency
                )
                : "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              {t.greenMonths}
            </p>

            <h3 className="mt-2 text-2xl font-bold text-green-400">
              {greenMonths}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-gray-500">
              {t.redMonths}
            </p>

            <h3 className="mt-2 text-2xl font-bold text-red-400">
              {redMonths}
            </h3>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {Object.entries(monthlyStats)
            .reverse()
            .map(([month, stats]) => {
              const wr =
                stats.trades > 0
                  ? (
                    (stats.wins /
                      stats.trades) *
                    100
                  ).toFixed(0)
                  : "0";

              return (
                <div
                  key={month}
                  className="card-hover flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {month}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {stats.trades} {t.trades}
                    </p>
                  </div>

                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-gray-500">
                        {t.wr}
                      </p>

                      <p
                        className={`font-bold ${Number(wr) >= 50
                          ? "text-green-400"
                          : "text-red-400"
                          }`}
                      >
                        {wr}%
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        {t.wins}
                      </p>

                      <p className="font-bold text-green-400">
                        {stats.wins}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        {t.pnl}
                      </p>

                      <p
                        className={`font-bold ${stats.pnl >= 0
                          ? "text-green-400"
                          : "text-red-400"
                          }`}
                      >
                        {formatCurrency(
                          stats.pnl,
                          account.currency
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
        <p className="text-sm text-gray-400">
          {t.aiInsightsEyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {t.performanceInsights}
        </h2>

        <div className="mt-6 space-y-4">
          {insights.length === 0 ? (
            <p className="text-sm text-gray-500">
              {t.noInsights}
            </p>
          ) : (
            insights.map((insight) => (
              <div
                key={insight}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-sm leading-6 text-gray-300">
                  {insight}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
        <p className="text-sm text-gray-400">
          {t.tradingPsychologyEyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {t.emotionalPerformance}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(
            emotionalStats
          ).map(([state, stats]) => {
            const stateWinRate =
              stats.trades > 0
                ? (stats.wins /
                  stats.trades) *
                100
                : 0;

            return (
              <div
                key={state}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    {state}
                  </h3>

                  <div
                    className={`rounded-xl px-3 py-1 text-xs font-bold ${stateWinRate >= 50
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                      }`}
                  >
                    {stateWinRate.toFixed(0)}%
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {t.trades}
                    </p>

                    <p className="font-bold text-white">
                      {stats.trades}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {t.wins}
                    </p>

                    <p className="font-bold text-green-400">
                      {stats.wins}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {t.totalPnl}
                    </p>

                    <p
                      className={`font-bold ${stats.pnl >= 0
                        ? "text-green-400"
                        : "text-red-400"
                        }`}
                    >
                      {formatCurrency(
                        stats.pnl,
                        account.currency
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}




