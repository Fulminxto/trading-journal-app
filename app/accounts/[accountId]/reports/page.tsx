import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import WeeklyReportCard from "@/components/reports/WeeklyReportCard";
import MonthlyReportCard from "@/components/reports/MonthlyReportCard";
import BehavioralReportCard from "@/components/reports/BehavioralReportCard";
import PerformanceBreakdownCard from "@/components/reports/PerformanceBreakdownCard";
import TraderEvolutionReport from "@/components/reports/TraderEvolutionReport";
import ExecutiveSummaryCard from "@/components/reports/ExecutiveSummaryCard";
import AICoachingReport from "@/components/reports/AICoachingReport";
import RiskManagementReport from "@/components/reports/RiskManagementReport";
import ConsistencyIntelligenceReport from "@/components/reports/ConsistencyIntelligenceReport";
import PsychologicalStabilityReport from "@/components/reports/PsychologicalStabilityReport";
import PerformanceForecastReport from "@/components/reports/PerformanceForecastReport";
import GrowthRoadmapReport from "@/components/reports/GrowthRoadmapReport";
import EdgeAnalysisReport from "@/components/reports/EdgeAnalysisReport";
import DecisionQualityReport from "@/components/reports/DecisionQualityReport";
import ExecutionIntelligenceReport from "@/components/reports/ExecutionIntelligenceReport";
import SetupIntelligenceReport from "@/components/reports/SetupIntelligenceReport";
import ConfidenceIntelligenceReport from "@/components/reports/ConfidenceIntelligenceReport";
import DisciplineIntelligenceReport from "@/components/reports/DisciplineIntelligenceReport";
import EmotionalIntelligenceReport from "@/components/reports/EmotionalIntelligenceReport";
import TraderIdentityReport from "@/components/reports/TraderIdentityReport";
import CognitivePerformanceReport from "@/components/reports/CognitivePerformanceReport";
import MentalResilienceReport from "@/components/reports/MentalResilienceReport";
import ReportsNavigation from "@/components/reports/ReportsNavigation";
import PrintReportButton from "@/components/reports/PrintReportButton";
import PDFReportHeader from "@/components/reports/PDFReportHeader";
import PDFReportFooter from "@/components/reports/PDFReportFooter";
import PDFCompactReport from "@/components/reports/PDFCompactReport";

import {
  formatCurrencyByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import ScopeBar from "@/components/ScopeBar";
import {
  parseScopeParams,
  getPeriodRange,
  getPeriodSuffix,
} from "@/lib/scope";

type ReportsLabels = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;

  totalTrades: string;
  totalPnl: string;
  average: string;
  winRate: string;
  behavioralRisk: string;
  behavioralRiskDescription: string;

  executiveFocus: string;
  edgeQuality: string;
  profitFactorDescription: (lossRate: number) => string;

  strongSample: string;
  growingSample: string;
  earlySample: string;

  waitingForData: string;
  healthy: string;
  profitableMonitorBehavior: string;
  needsReview: string;

  focusReduceBehavioralRisk: string;
  focusImproveRiskReward: string;
  focusReviewSetups: string;
  focusProtectEdge: string;
};

const reportsLabels: Record<
  AppLanguage,
  ReportsLabels
> = {
  it: {
    heroEyebrow: "VOLTIS AI Reports",
    heroTitle: "Report Intelligence",
    heroDescription:
      "Un riepilogo operativo per leggere performance, comportamento, rischio, disciplina ed evoluzione del trader.",

    totalTrades: "Trade Totali",
    totalPnl: "PnL Totale",
    average: "Media",
    winRate: "Win Rate",
    behavioralRisk: "Rischio Comportamentale",
    behavioralRiskDescription:
      "Emozione, confidence, esecuzione",

    executiveFocus: "Focus esecutivo",
    edgeQuality: "QualitÃƒÂ  edge",
    profitFactorDescription: (lossRate) =>
      `Profit factor basato su gross profit e gross loss. Loss rate: ${lossRate}%.`,

    strongSample: "Campione solido",
    growingSample: "Campione in crescita",
    earlySample: "Campione iniziale",

    waitingForData: "In attesa di dati",
    healthy: "Sano",
    profitableMonitorBehavior:
      "Profittevole, monitora il comportamento",
    needsReview: "Da revisionare",

    focusReduceBehavioralRisk:
      "Riduci il rischio comportamentale prima di aumentare il volume.",
    focusImproveRiskReward:
      "Migliora il rapporto rischio/rendimento e il controllo delle perdite.",
    focusReviewSetups:
      "Rivedi setup e qualitÃƒÂ  degli ingressi.",
    focusProtectEdge:
      "Proteggi lÃ¢â‚¬â„¢edge attuale con esecuzione costante.",
  },

  en: {
    heroEyebrow: "VOLTIS AI Reports",
    heroTitle: "Intelligence Reports",
    heroDescription:
      "An operational summary to read performance, behavior, risk, discipline and trader evolution.",

    totalTrades: "Total Trades",
    totalPnl: "Total PnL",
    average: "Average",
    winRate: "Win Rate",
    behavioralRisk: "Behavioral Risk",
    behavioralRiskDescription:
      "Emotion, confidence, execution",

    executiveFocus: "Executive focus",
    edgeQuality: "Edge quality",
    profitFactorDescription: (lossRate) =>
      `Profit factor based on gross profit and gross loss. Loss rate is ${lossRate}%.`,

    strongSample: "Strong sample",
    growingSample: "Growing sample",
    earlySample: "Early sample",

    waitingForData: "Waiting for data",
    healthy: "Healthy",
    profitableMonitorBehavior:
      "Profitable, monitor behavior",
    needsReview: "Needs review",

    focusReduceBehavioralRisk:
      "Reduce behavioral risk before scaling volume.",
    focusImproveRiskReward:
      "Improve risk/reward balance and loss control.",
    focusReviewSetups:
      "Review setups and entry quality.",
    focusProtectEdge:
      "Protect the current edge with consistent execution.",
  },

  uk: {
    heroEyebrow: "VOLTIS AI Reports",
    heroTitle: "Ãâ€ ÃÂ½Ã‘â€šÃÂµÃÂ»ÃÂµÃÂºÃ‘â€šÃ‘Æ’ÃÂ°ÃÂ»Ã‘Å’ÃÂ½Ã‘â€“ ÃÂ·ÃÂ²Ã‘â€“Ã‘â€šÃÂ¸",
    heroDescription:
      "ÃÅ¾ÃÂ¿ÃÂµÃ‘â‚¬ÃÂ°Ã‘â€ Ã‘â€“ÃÂ¹ÃÂ½ÃÂ¸ÃÂ¹ ÃÂ¿Ã‘â€“ÃÂ´Ã‘ÂÃ‘Æ’ÃÂ¼ÃÂ¾ÃÂº ÃÂ´ÃÂ»Ã‘Â ÃÂ°ÃÂ½ÃÂ°ÃÂ»Ã‘â€“ÃÂ·Ã‘Æ’ Ã‘â‚¬ÃÂµÃÂ·Ã‘Æ’ÃÂ»Ã‘Å’Ã‘â€šÃÂ°Ã‘â€šÃ‘â€“ÃÂ², ÃÂ¿ÃÂ¾ÃÂ²ÃÂµÃÂ´Ã‘â€“ÃÂ½ÃÂºÃÂ¸, Ã‘â‚¬ÃÂ¸ÃÂ·ÃÂ¸ÃÂºÃ‘Æ’, ÃÂ´ÃÂ¸Ã‘ÂÃ‘â€ ÃÂ¸ÃÂ¿ÃÂ»Ã‘â€“ÃÂ½ÃÂ¸ Ã‘â€šÃÂ° Ã‘â‚¬ÃÂ¾ÃÂ·ÃÂ²ÃÂ¸Ã‘â€šÃÂºÃ‘Æ’ Ã‘â€šÃ‘â‚¬ÃÂµÃÂ¹ÃÂ´ÃÂµÃ‘â‚¬ÃÂ°.",

    totalTrades: "ÃÂ£Ã‘ÂÃ‘Å’ÃÂ¾ÃÂ³ÃÂ¾ Ã‘Æ’ÃÂ³ÃÂ¾ÃÂ´",
    totalPnl: "Ãâ€”ÃÂ°ÃÂ³ÃÂ°ÃÂ»Ã‘Å’ÃÂ½ÃÂ¸ÃÂ¹ PnL",
    average: "ÃÂ¡ÃÂµÃ‘â‚¬ÃÂµÃÂ´ÃÂ½Ã‘â€",
    winRate: "Ãâ€™Ã‘â€“ÃÂ´Ã‘ÂÃÂ¾Ã‘â€šÃÂ¾ÃÂº ÃÂ¿ÃÂµÃ‘â‚¬ÃÂµÃÂ¼ÃÂ¾ÃÂ³",
    behavioralRisk: "ÃÅ¸ÃÂ¾ÃÂ²ÃÂµÃÂ´Ã‘â€“ÃÂ½ÃÂºÃÂ¾ÃÂ²ÃÂ¸ÃÂ¹ Ã‘â‚¬ÃÂ¸ÃÂ·ÃÂ¸ÃÂº",
    behavioralRiskDescription:
      "Ãâ€¢ÃÂ¼ÃÂ¾Ã‘â€ Ã‘â€“Ã‘â€”, ÃÂ²ÃÂ¿ÃÂµÃÂ²ÃÂ½ÃÂµÃÂ½Ã‘â€“Ã‘ÂÃ‘â€šÃ‘Å’, ÃÂ²ÃÂ¸ÃÂºÃÂ¾ÃÂ½ÃÂ°ÃÂ½ÃÂ½Ã‘Â",

    executiveFocus: "ÃÅ¾ÃÂ¿ÃÂµÃ‘â‚¬ÃÂ°Ã‘â€ Ã‘â€“ÃÂ¹ÃÂ½ÃÂ¸ÃÂ¹ Ã‘â€žÃÂ¾ÃÂºÃ‘Æ’Ã‘Â",
    edgeQuality: "ÃÂ¯ÃÂºÃ‘â€“Ã‘ÂÃ‘â€šÃ‘Å’ ÃÂ¿ÃÂµÃ‘â‚¬ÃÂµÃÂ²ÃÂ°ÃÂ³ÃÂ¸",
    profitFactorDescription: (lossRate) =>
      `Profit factor ÃÂ½ÃÂ° ÃÂ¾Ã‘ÂÃÂ½ÃÂ¾ÃÂ²Ã‘â€“ ÃÂ²ÃÂ°ÃÂ»ÃÂ¾ÃÂ²ÃÂ¾ÃÂ³ÃÂ¾ ÃÂ¿Ã‘â‚¬ÃÂ¸ÃÂ±Ã‘Æ’Ã‘â€šÃÂºÃ‘Æ’ Ã‘â€šÃÂ° ÃÂ²ÃÂ°ÃÂ»ÃÂ¾ÃÂ²ÃÂ¸Ã‘â€¦ ÃÂ·ÃÂ±ÃÂ¸Ã‘â€šÃÂºÃ‘â€“ÃÂ². Loss rate: ${lossRate}%.`,

    strongSample: "ÃÂ¡ÃÂ¸ÃÂ»Ã‘Å’ÃÂ½ÃÂ° ÃÂ²ÃÂ¸ÃÂ±Ã‘â€“Ã‘â‚¬ÃÂºÃÂ°",
    growingSample: "Ãâ€™ÃÂ¸ÃÂ±Ã‘â€“Ã‘â‚¬ÃÂºÃÂ° ÃÂ·Ã‘â‚¬ÃÂ¾Ã‘ÂÃ‘â€šÃÂ°Ã‘â€",
    earlySample: "ÃÅ¸ÃÂ¾Ã‘â€¡ÃÂ°Ã‘â€šÃÂºÃÂ¾ÃÂ²ÃÂ° ÃÂ²ÃÂ¸ÃÂ±Ã‘â€“Ã‘â‚¬ÃÂºÃÂ°",

    waitingForData: "ÃÅ¾Ã‘â€¡Ã‘â€“ÃÂºÃ‘Æ’ÃÂ²ÃÂ°ÃÂ½ÃÂ½Ã‘Â ÃÂ´ÃÂ°ÃÂ½ÃÂ¸Ã‘â€¦",
    healthy: "Ãâ€”ÃÂ´ÃÂ¾Ã‘â‚¬ÃÂ¾ÃÂ²ÃÂ¸ÃÂ¹ Ã‘ÂÃ‘â€šÃÂ°ÃÂ½",
    profitableMonitorBehavior:
      "ÃÅ¸Ã‘â‚¬ÃÂ¸ÃÂ±Ã‘Æ’Ã‘â€šÃÂºÃÂ¾ÃÂ²ÃÂ¾, ÃÂºÃÂ¾ÃÂ½Ã‘â€šÃ‘â‚¬ÃÂ¾ÃÂ»Ã‘Å½ÃÂ¹ ÃÂ¿ÃÂ¾ÃÂ²ÃÂµÃÂ´Ã‘â€“ÃÂ½ÃÂºÃ‘Æ’",
    needsReview: "ÃÅ¸ÃÂ¾Ã‘â€šÃ‘â‚¬ÃÂµÃÂ±Ã‘Æ’Ã‘â€ ÃÂ¿ÃÂµÃ‘â‚¬ÃÂµÃÂ³ÃÂ»Ã‘ÂÃÂ´Ã‘Æ’",

    focusReduceBehavioralRisk:
      "Ãâ€”ÃÂ¼ÃÂµÃÂ½Ã‘Ë† ÃÂ¿ÃÂ¾ÃÂ²ÃÂµÃÂ´Ã‘â€“ÃÂ½ÃÂºÃÂ¾ÃÂ²ÃÂ¸ÃÂ¹ Ã‘â‚¬ÃÂ¸ÃÂ·ÃÂ¸ÃÂº ÃÂ¿ÃÂµÃ‘â‚¬ÃÂµÃÂ´ ÃÂ·ÃÂ±Ã‘â€“ÃÂ»Ã‘Å’Ã‘Ë†ÃÂµÃÂ½ÃÂ½Ã‘ÂÃÂ¼ ÃÂ¾ÃÂ±Ã‘ÂÃ‘ÂÃÂ³Ã‘Æ’.",
    focusImproveRiskReward:
      "ÃÅ¸ÃÂ¾ÃÂºÃ‘â‚¬ÃÂ°Ã‘â€° ÃÂ±ÃÂ°ÃÂ»ÃÂ°ÃÂ½Ã‘Â Ã‘â‚¬ÃÂ¸ÃÂ·ÃÂ¸ÃÂºÃ‘Æ’/ÃÂ¿Ã‘â‚¬ÃÂ¸ÃÂ±Ã‘Æ’Ã‘â€šÃÂºÃ‘Æ’ Ã‘â€šÃÂ° ÃÂºÃÂ¾ÃÂ½Ã‘â€šÃ‘â‚¬ÃÂ¾ÃÂ»Ã‘Å’ ÃÂ·ÃÂ±ÃÂ¸Ã‘â€šÃÂºÃ‘â€“ÃÂ².",
    focusReviewSetups:
      "ÃÅ¸ÃÂµÃ‘â‚¬ÃÂµÃÂ³ÃÂ»Ã‘ÂÃÂ½Ã‘Å’ Ã‘ÂÃÂµÃ‘â€šÃÂ°ÃÂ¿ÃÂ¸ Ã‘â€šÃÂ° Ã‘ÂÃÂºÃ‘â€“Ã‘ÂÃ‘â€šÃ‘Å’ ÃÂ²Ã‘â€¦ÃÂ¾ÃÂ´Ã‘â€“ÃÂ².",
    focusProtectEdge:
      "Ãâ€”ÃÂ°Ã‘â€¦ÃÂ¸Ã‘â€°ÃÂ°ÃÂ¹ ÃÂ¿ÃÂ¾Ã‘â€šÃÂ¾Ã‘â€¡ÃÂ½Ã‘Æ’ ÃÂ¿ÃÂµÃ‘â‚¬ÃÂµÃÂ²ÃÂ°ÃÂ³Ã‘Æ’ Ã‘ÂÃ‘â€šÃÂ°ÃÂ±Ã‘â€“ÃÂ»Ã‘Å’ÃÂ½ÃÂ¸ÃÂ¼ ÃÂ²ÃÂ¸ÃÂºÃÂ¾ÃÂ½ÃÂ°ÃÂ½ÃÂ½Ã‘ÂÃÂ¼.",
  },

  ru: {
    heroEyebrow: "VOLTIS AI Reports",
    heroTitle: "ÃËœÃÂ½Ã‘â€šÃÂµÃÂ»ÃÂ»ÃÂµÃÂºÃ‘â€šÃ‘Æ’ÃÂ°ÃÂ»Ã‘Å’ÃÂ½Ã‘â€¹ÃÂµ ÃÂ¾Ã‘â€šÃ‘â€¡ÃÂµÃ‘â€šÃ‘â€¹",
    heroDescription:
      "ÃÅ¾ÃÂ¿ÃÂµÃ‘â‚¬ÃÂ°Ã‘â€ ÃÂ¸ÃÂ¾ÃÂ½ÃÂ½Ã‘â€¹ÃÂ¹ ÃÂ¾ÃÂ±ÃÂ·ÃÂ¾Ã‘â‚¬ ÃÂ´ÃÂ»Ã‘Â ÃÂ°ÃÂ½ÃÂ°ÃÂ»ÃÂ¸ÃÂ·ÃÂ° Ã‘â‚¬ÃÂµÃÂ·Ã‘Æ’ÃÂ»Ã‘Å’Ã‘â€šÃÂ°Ã‘â€šÃÂ¾ÃÂ², ÃÂ¿ÃÂ¾ÃÂ²ÃÂµÃÂ´ÃÂµÃÂ½ÃÂ¸Ã‘Â, Ã‘â‚¬ÃÂ¸Ã‘ÂÃÂºÃÂ°, ÃÂ´ÃÂ¸Ã‘ÂÃ‘â€ ÃÂ¸ÃÂ¿ÃÂ»ÃÂ¸ÃÂ½Ã‘â€¹ ÃÂ¸ Ã‘â‚¬ÃÂ°ÃÂ·ÃÂ²ÃÂ¸Ã‘â€šÃÂ¸Ã‘Â Ã‘â€šÃ‘â‚¬ÃÂµÃÂ¹ÃÂ´ÃÂµÃ‘â‚¬ÃÂ°.",

    totalTrades: "Ãâ€™Ã‘ÂÃÂµÃÂ³ÃÂ¾ Ã‘ÂÃÂ´ÃÂµÃÂ»ÃÂ¾ÃÂº",
    totalPnl: "ÃÅ¾ÃÂ±Ã‘â€°ÃÂ¸ÃÂ¹ PnL",
    average: "ÃÂ¡Ã‘â‚¬ÃÂµÃÂ´ÃÂ½ÃÂµÃÂµ",
    winRate: "ÃÅ¸Ã‘â‚¬ÃÂ¾Ã‘â€ ÃÂµÃÂ½Ã‘â€š ÃÂ¿ÃÂ¾ÃÂ±ÃÂµÃÂ´",
    behavioralRisk: "ÃÅ¸ÃÂ¾ÃÂ²ÃÂµÃÂ´ÃÂµÃÂ½Ã‘â€¡ÃÂµÃ‘ÂÃÂºÃÂ¸ÃÂ¹ Ã‘â‚¬ÃÂ¸Ã‘ÂÃÂº",
    behavioralRiskDescription:
      "ÃÂ­ÃÂ¼ÃÂ¾Ã‘â€ ÃÂ¸ÃÂ¸, Ã‘Æ’ÃÂ²ÃÂµÃ‘â‚¬ÃÂµÃÂ½ÃÂ½ÃÂ¾Ã‘ÂÃ‘â€šÃ‘Å’, ÃÂ¸Ã‘ÂÃÂ¿ÃÂ¾ÃÂ»ÃÂ½ÃÂµÃÂ½ÃÂ¸ÃÂµ",

    executiveFocus: "ÃÅ¾ÃÂ¿ÃÂµÃ‘â‚¬ÃÂ°Ã‘â€ ÃÂ¸ÃÂ¾ÃÂ½ÃÂ½Ã‘â€¹ÃÂ¹ Ã‘â€žÃÂ¾ÃÂºÃ‘Æ’Ã‘Â",
    edgeQuality: "ÃÅ¡ÃÂ°Ã‘â€¡ÃÂµÃ‘ÂÃ‘â€šÃÂ²ÃÂ¾ ÃÂ¿Ã‘â‚¬ÃÂµÃÂ¸ÃÂ¼Ã‘Æ’Ã‘â€°ÃÂµÃ‘ÂÃ‘â€šÃÂ²ÃÂ°",
    profitFactorDescription: (lossRate) =>
      `Profit factor ÃÂ½ÃÂ° ÃÂ¾Ã‘ÂÃÂ½ÃÂ¾ÃÂ²ÃÂµ ÃÂ²ÃÂ°ÃÂ»ÃÂ¾ÃÂ²ÃÂ¾ÃÂ¹ ÃÂ¿Ã‘â‚¬ÃÂ¸ÃÂ±Ã‘â€¹ÃÂ»ÃÂ¸ ÃÂ¸ ÃÂ²ÃÂ°ÃÂ»ÃÂ¾ÃÂ²ÃÂ¾ÃÂ³ÃÂ¾ Ã‘Æ’ÃÂ±Ã‘â€¹Ã‘â€šÃÂºÃÂ°. Loss rate: ${lossRate}%.`,

    strongSample: "ÃÂ¡ÃÂ¸ÃÂ»Ã‘Å’ÃÂ½ÃÂ°Ã‘Â ÃÂ²Ã‘â€¹ÃÂ±ÃÂ¾Ã‘â‚¬ÃÂºÃÂ°",
    growingSample: "ÃÂ ÃÂ°Ã‘ÂÃ‘â€šÃ‘Æ’Ã‘â€°ÃÂ°Ã‘Â ÃÂ²Ã‘â€¹ÃÂ±ÃÂ¾Ã‘â‚¬ÃÂºÃÂ°",
    earlySample: "ÃÂÃÂ°Ã‘â€¡ÃÂ°ÃÂ»Ã‘Å’ÃÂ½ÃÂ°Ã‘Â ÃÂ²Ã‘â€¹ÃÂ±ÃÂ¾Ã‘â‚¬ÃÂºÃÂ°",

    waitingForData: "ÃÅ¾ÃÂ¶ÃÂ¸ÃÂ´ÃÂ°ÃÂ½ÃÂ¸ÃÂµ ÃÂ´ÃÂ°ÃÂ½ÃÂ½Ã‘â€¹Ã‘â€¦",
    healthy: "Ãâ€”ÃÂ´ÃÂ¾Ã‘â‚¬ÃÂ¾ÃÂ²ÃÂ¾ÃÂµ Ã‘ÂÃÂ¾Ã‘ÂÃ‘â€šÃÂ¾Ã‘ÂÃÂ½ÃÂ¸ÃÂµ",
    profitableMonitorBehavior:
      "ÃÅ¸Ã‘â‚¬ÃÂ¸ÃÂ±Ã‘â€¹ÃÂ»Ã‘Å’ÃÂ½ÃÂ¾, Ã‘ÂÃÂ»ÃÂµÃÂ´ÃÂ¸ ÃÂ·ÃÂ° ÃÂ¿ÃÂ¾ÃÂ²ÃÂµÃÂ´ÃÂµÃÂ½ÃÂ¸ÃÂµÃÂ¼",
    needsReview: "ÃÂ¢Ã‘â‚¬ÃÂµÃÂ±Ã‘Æ’ÃÂµÃ‘â€š ÃÂ°ÃÂ½ÃÂ°ÃÂ»ÃÂ¸ÃÂ·ÃÂ°",

    focusReduceBehavioralRisk:
      "ÃÂ¡ÃÂ½ÃÂ¸ÃÂ·Ã‘Å’ ÃÂ¿ÃÂ¾ÃÂ²ÃÂµÃÂ´ÃÂµÃÂ½Ã‘â€¡ÃÂµÃ‘ÂÃÂºÃÂ¸ÃÂ¹ Ã‘â‚¬ÃÂ¸Ã‘ÂÃÂº ÃÂ¿ÃÂµÃ‘â‚¬ÃÂµÃÂ´ Ã‘Æ’ÃÂ²ÃÂµÃÂ»ÃÂ¸Ã‘â€¡ÃÂµÃÂ½ÃÂ¸ÃÂµÃÂ¼ ÃÂ¾ÃÂ±Ã‘Å ÃÂµÃÂ¼ÃÂ°.",
    focusImproveRiskReward:
      "ÃÂ£ÃÂ»Ã‘Æ’Ã‘â€¡Ã‘Ë†ÃÂ¸ ÃÂ±ÃÂ°ÃÂ»ÃÂ°ÃÂ½Ã‘Â Ã‘â‚¬ÃÂ¸Ã‘ÂÃÂº/ÃÂ¿Ã‘â‚¬ÃÂ¸ÃÂ±Ã‘â€¹ÃÂ»Ã‘Å’ ÃÂ¸ ÃÂºÃÂ¾ÃÂ½Ã‘â€šÃ‘â‚¬ÃÂ¾ÃÂ»Ã‘Å’ Ã‘Æ’ÃÂ±Ã‘â€¹Ã‘â€šÃÂºÃÂ¾ÃÂ².",
    focusReviewSetups:
      "ÃÅ¸ÃÂµÃ‘â‚¬ÃÂµÃ‘ÂÃÂ¼ÃÂ¾Ã‘â€šÃ‘â‚¬ÃÂ¸ Ã‘ÂÃÂµÃ‘â€šÃÂ°ÃÂ¿Ã‘â€¹ ÃÂ¸ ÃÂºÃÂ°Ã‘â€¡ÃÂµÃ‘ÂÃ‘â€šÃÂ²ÃÂ¾ ÃÂ²Ã‘â€¦ÃÂ¾ÃÂ´ÃÂ¾ÃÂ².",
    focusProtectEdge:
      "Ãâ€”ÃÂ°Ã‘â€°ÃÂ¸Ã‘â€°ÃÂ°ÃÂ¹ Ã‘â€šÃÂµÃÂºÃ‘Æ’Ã‘â€°ÃÂ¸ÃÂ¹ edge Ã‘ÂÃ‘â€šÃÂ°ÃÂ±ÃÂ¸ÃÂ»Ã‘Å’ÃÂ½Ã‘â€¹ÃÂ¼ ÃÂ¸Ã‘ÂÃÂ¿ÃÂ¾ÃÂ»ÃÂ½ÃÂµÃÂ½ÃÂ¸ÃÂµÃÂ¼.",
  },

  es: {
    heroEyebrow: "VOLTIS AI Reports",
    heroTitle: "Informes de inteligencia",
    heroDescription:
      "Un resumen operativo para leer rendimiento, comportamiento, riesgo, disciplina y evoluciÃƒÂ³n del trader.",

    totalTrades: "Trades totales",
    totalPnl: "PnL total",
    average: "Media",
    winRate: "Win Rate",
    behavioralRisk: "Riesgo conductual",
    behavioralRiskDescription:
      "EmociÃƒÂ³n, confianza, ejecuciÃƒÂ³n",

    executiveFocus: "Foco ejecutivo",
    edgeQuality: "Calidad del edge",
    profitFactorDescription: (lossRate) =>
      `Profit factor basado en beneficio bruto y pÃƒÂ©rdida bruta. Loss rate: ${lossRate}%.`,

    strongSample: "Muestra sÃƒÂ³lida",
    growingSample: "Muestra en crecimiento",
    earlySample: "Muestra inicial",

    waitingForData: "Esperando datos",
    healthy: "Saludable",
    profitableMonitorBehavior:
      "Rentable, monitorea el comportamiento",
    needsReview: "Necesita revisiÃƒÂ³n",

    focusReduceBehavioralRisk:
      "Reduce el riesgo conductual antes de aumentar volumen.",
    focusImproveRiskReward:
      "Mejora el balance riesgo/beneficio y el control de pÃƒÂ©rdidas.",
    focusReviewSetups:
      "Revisa setups y calidad de entrada.",
    focusProtectEdge:
      "Protege el edge actual con ejecuciÃƒÂ³n constante.",
  },

  fr: {
    heroEyebrow: "VOLTIS AI Reports",
    heroTitle: "Rapports dÃ¢â‚¬â„¢intelligence",
    heroDescription:
      "Un rÃƒÂ©sumÃƒÂ© opÃƒÂ©rationnel pour lire performance, comportement, risque, discipline et ÃƒÂ©volution du trader.",

    totalTrades: "Trades totaux",
    totalPnl: "PnL total",
    average: "Moyenne",
    winRate: "Win Rate",
    behavioralRisk: "Risque comportemental",
    behavioralRiskDescription:
      "Ãƒâ€°motion, confiance, exÃƒÂ©cution",

    executiveFocus: "Focus exÃƒÂ©cutif",
    edgeQuality: "QualitÃƒÂ© de lÃ¢â‚¬â„¢edge",
    profitFactorDescription: (lossRate) =>
      `Profit factor basÃƒÂ© sur le profit brut et la perte brute. Loss rate : ${lossRate}%.`,

    strongSample: "Ãƒâ€°chantillon solide",
    growingSample: "Ãƒâ€°chantillon en croissance",
    earlySample: "Ãƒâ€°chantillon initial",

    waitingForData: "En attente de donnÃƒÂ©es",
    healthy: "Sain",
    profitableMonitorBehavior:
      "Rentable, surveille le comportement",
    needsReview: "Ãƒâ‚¬ revoir",

    focusReduceBehavioralRisk:
      "RÃƒÂ©duis le risque comportemental avant dÃ¢â‚¬â„¢augmenter le volume.",
    focusImproveRiskReward:
      "AmÃƒÂ©liore lÃ¢â‚¬â„¢ÃƒÂ©quilibre risque/rendement et le contrÃƒÂ´le des pertes.",
    focusReviewSetups:
      "Revois les setups et la qualitÃƒÂ© des entrÃƒÂ©es.",
    focusProtectEdge:
      "ProtÃƒÂ¨ge lÃ¢â‚¬â„¢edge actuel avec une exÃƒÂ©cution constante.",
  },

  de: {
    heroEyebrow: "VOLTIS AI Reports",
    heroTitle: "Intelligence-Berichte",
    heroDescription:
      "Eine operative Zusammenfassung zur Analyse von Performance, Verhalten, Risiko, Disziplin und Trader-Entwicklung.",

    totalTrades: "Trades gesamt",
    totalPnl: "Gesamt-PnL",
    average: "Durchschnitt",
    winRate: "Win Rate",
    behavioralRisk: "Verhaltensrisiko",
    behavioralRiskDescription:
      "Emotion, Vertrauen, AusfÃƒÂ¼hrung",

    executiveFocus: "Operativer Fokus",
    edgeQuality: "Edge-QualitÃƒÂ¤t",
    profitFactorDescription: (lossRate) =>
      `Profit Factor basierend auf Bruttogewinn und Bruttoverlust. Loss Rate: ${lossRate}%.`,

    strongSample: "Starke Stichprobe",
    growingSample: "Wachsende Stichprobe",
    earlySample: "FrÃƒÂ¼he Stichprobe",

    waitingForData: "Warten auf Daten",
    healthy: "Gesund",
    profitableMonitorBehavior:
      "Profitabel, Verhalten beobachten",
    needsReview: "BenÃƒÂ¶tigt Review",

    focusReduceBehavioralRisk:
      "Reduziere Verhaltensrisiko, bevor du Volumen erhÃƒÂ¶hst.",
    focusImproveRiskReward:
      "Verbessere Risiko/Ertrag-Balance und Verlustkontrolle.",
    focusReviewSetups:
      "ÃƒÅ“berprÃƒÂ¼fe Setups und EinstiegsqualitÃƒÂ¤t.",
    focusProtectEdge:
      "SchÃƒÂ¼tze den aktuellen Edge mit konstanter AusfÃƒÂ¼hrung.",
  },
};

function getResultTone(value: number) {
  if (value > 0) {
    return "text-green-400";
  }

  if (value < 0) {
    return "text-red-400";
  }

  return "text-yellow-400";
}

function getRiskTone(value: number) {
  if (value >= 60) {
    return "text-red-400";
  }

  if (value >= 35) {
    return "text-yellow-400";
  }

  return "text-green-400";
}

function getScoreTone(value: number) {
  if (value >= 70) {
    return "text-green-400";
  }

  if (value >= 45) {
    return "text-yellow-400";
  }

  return "text-red-400";
}

export default async function ReportsPage({
  params,
  searchParams,
}: {
  params: Promise<{
    accountId: string;
  }>;
  searchParams: Promise<{
    member?: string;
    period?: string;
    ref?: string;
  }>;
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

  const [membership, currentUser, accountMembers] =
    await Promise.all([
      prisma.accountMember.findFirst({
        where: {
          userId: session.user.id,
          tradingAccountId: accountId,
        },
        include: {
          tradingAccount: true,
        },
      }),

      prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      }),

      prisma.accountMember.findMany({
        where: { tradingAccountId: accountId },
        include: { user: true },
      }),
    ]);

  if (!membership) {
    redirect("/accounts");
  }

  if (
    membership.role !== "MANAGER" &&
    !membership.canViewReports
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    membership.tradingAccount.status === "ARCHIVED"
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
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

  const isSharedAccount = accountMembers.length > 1;

  const language = normalizeAppLanguage(
    currentUser?.appLanguage
  );

  const t = reportsLabels[language];

  const account = membership.tradingAccount;
  const currency = account.currency || "USD";

  const formatCurrency = (value: number) =>
    formatCurrencyByLanguage(
      value,
      currency,
      language
    );

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
      ...(selectedMemberId
        ? { createdById: selectedMemberId }
        : {}),
    },

    orderBy: {
      openDate: "desc",
    },
  });

  const dateRange = getPeriodRange(
    period,
    ref,
    currentUser?.timezone ?? undefined
  );

  const periodTrades = dateRange
    ? trades.filter(
        (t) =>
          t.openDate >= dateRange.gte &&
          t.openDate < dateRange.lte
      )
    : trades;

  const periodSuffix = getPeriodSuffix(
    period,
    ref,
    language
  );

  const totalTrades = periodTrades.length;

  const wins = periodTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const losses = periodTrades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const breakEven = periodTrades.filter(
    (trade) => trade.outcome === "be"
  ).length;

  const closedTrades =
    wins + losses + breakEven;

  const totalPnl = periodTrades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const winningTrades = periodTrades.filter(
    (trade) => trade.outcome === "win"
  );

  const losingTrades = periodTrades.filter(
    (trade) => trade.outcome === "loss"
  );

  const grossProfit = winningTrades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const grossLoss = losingTrades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const winRate =
    closedTrades > 0
      ? Math.round((wins / closedTrades) * 100)
      : 0;

  const lossRate =
    closedTrades > 0
      ? Math.round((losses / closedTrades) * 100)
      : 0;

  const averageWin =
    wins > 0 ? grossProfit / wins : 0;

  const averageLoss =
    losses > 0 ? grossLoss / losses : 0;

  const averageResult =
    closedTrades > 0
      ? totalPnl / closedTrades
      : 0;

  const profitFactor =
    Math.abs(grossLoss) > 0
      ? grossProfit / Math.abs(grossLoss)
      : grossProfit > 0
        ? grossProfit
        : 0;

  const emotionalTrades = periodTrades.filter(
    (trade) =>
      trade.emotionalState &&
      trade.emotionalState.length > 0
  ).length;

  const lowConfidenceTrades = periodTrades.filter(
    (trade) =>
      (trade.confidence || 0) > 0 &&
      (trade.confidence || 0) <= 4
  ).length;

  const weakExecutionTrades = periodTrades.filter(
    (trade) =>
      (trade.executionRating || 0) > 0 &&
      (trade.executionRating || 0) <= 4
  ).length;

  const disciplineScore =
    closedTrades > 0
      ? Math.max(
        0,
        Math.min(
          100,
          Math.round(
            winRate +
            (totalPnl > 0 ? 10 : -10)
          )
        )
      )
      : 0;

  const behavioralRisk =
    totalTrades > 0
      ? Math.min(
        100,
        Math.round(
          ((emotionalTrades +
            lowConfidenceTrades +
            weakExecutionTrades) /
            totalTrades) *
          100
        )
      )
      : 0;

  const reportReadiness =
    totalTrades >= 30
      ? t.strongSample
      : totalTrades >= 10
        ? t.growingSample
        : t.earlySample;

  const accountStatus =
    totalTrades === 0
      ? t.waitingForData
      : totalPnl >= 0 &&
        behavioralRisk < 35
        ? t.healthy
        : totalPnl >= 0
          ? t.profitableMonitorBehavior
          : t.needsReview;

  const primaryFocus =
    behavioralRisk >= 50
      ? t.focusReduceBehavioralRisk
      : profitFactor < 1
        ? t.focusImproveRiskReward
        : winRate < 45
          ? t.focusReviewSetups
          : t.focusProtectEdge;

  const members = isSharedAccount
    ? accountMembers.map((m) => ({
        id: m.userId,
        name: m.user.name ?? null,
        username: m.user.username,
        image: m.user.image ?? null,
      }))
    : undefined;

  return (
    <div className="space-y-12 print:space-y-0 print:bg-[#0C1430]">
      <div className="print:hidden">
        <ScopeBar
          members={members}
          selectedMemberId={selectedMemberId ?? undefined}
          currentPeriod={period}
          currentRef={ref}
          appLanguage={language}
          accountId={accountId}
        />
      </div>

      <PDFCompactReport
        appLanguage={language}
        currency={currency}
        userName={
          currentUser?.name ??
          session.user.name ??
          "Trader"
        }
        totalTrades={totalTrades}
        totalPnl={totalPnl}
        winRate={winRate}
        wins={wins}
        losses={losses}
        averageWin={averageWin}
        averageLoss={averageLoss}
        disciplineScore={disciplineScore}
        behavioralRisk={behavioralRisk}
        emotionalTrades={emotionalTrades}
        weakExecutionTrades={weakExecutionTrades}
      />

      <div className="web-report-content space-y-12">
        <div className="print-hidden">
          <PDFReportHeader
            appLanguage={language}
            currency={currency}
            totalTrades={totalTrades}
            totalPnl={totalPnl}
            winRate={winRate}
          />
        </div>

        <div className="print-hidden relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#070b14] via-[#0f1726] to-black p-8 shadow-2xl shadow-cyan-500/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_12%,transparent),transparent_35%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_35%)]" />

          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-accent-bright">
                {t.heroEyebrow}
              </p>

              <h1 className="mt-4 text-5xl font-black tracking-tight text-white xl:text-7xl">
                {t.heroTitle}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-400 xl:text-lg">
                {t.heroDescription}
              </p>
            </div>

            <div className="shrink-0">
              <PrintReportButton appLanguage={language} />
            </div>
          </div>
        </div>

        <ReportsNavigation appLanguage={language} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              {t.totalTrades}{periodSuffix}
            </p>

            <h2 className="mt-4 text-4xl font-black text-accent-bright">
              {totalTrades}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              {reportReadiness}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              {t.totalPnl}{periodSuffix}
            </p>

            <h2
              className={`mt-4 text-4xl font-black ${getResultTone(
                totalPnl
              )}`}
            >
              {formatCurrency(totalPnl)}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              {t.average}{" "}
              {formatCurrency(averageResult)}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              {t.winRate}{periodSuffix}
            </p>

            <h2
              className={`mt-4 text-4xl font-black ${getScoreTone(
                winRate
              )}`}
            >
              {winRate}%
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              {wins}W / {losses}L / {breakEven}BE
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              {t.behavioralRisk}{periodSuffix}
            </p>

            <h2
              className={`mt-4 text-4xl font-black ${getRiskTone(
                behavioralRisk
              )}`}
            >
              {behavioralRisk}%
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              {t.behavioralRiskDescription}
            </p>
          </div>
        </div>

        <div className="print-hidden grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 xl:col-span-2">
            <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
              {t.executiveFocus}
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {accountStatus}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-400">
              {primaryFocus}
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
              {t.edgeQuality}
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {profitFactor.toFixed(2)}
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              {t.profitFactorDescription(lossRate)}
            </p>
          </div>
        </div>

        <div id="executive">
          <ExecutiveSummaryCard
            appLanguage={language}
            currency={currency}
            totalPnl={totalPnl}
            winRate={winRate}
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
          />
        </div>

        <div
          id="weekly"
          className="print-hidden"
        >
          <WeeklyReportCard
            appLanguage={language}
            currency={currency}
            totalTrades={totalTrades}
            totalPnl={totalPnl}
            winRate={winRate}
          />
        </div>

        <div
          id="monthly"
          className="report-section"
        >
          <MonthlyReportCard
            appLanguage={language}
            currency={currency}
            totalTrades={totalTrades}
            totalPnl={totalPnl}
            winRate={winRate}
            emotionalTrades={emotionalTrades}
            disciplineScore={disciplineScore}
          />
        </div>

        <div
          id="behavior"
          className="report-section"
        >
          <BehavioralReportCard
            appLanguage={language}
            currency={currency}
            emotionalTrades={emotionalTrades}
            lowConfidenceTrades={lowConfidenceTrades}
            weakExecutionTrades={weakExecutionTrades}
            totalTrades={totalTrades}
          />
        </div>

        <div
          id="performance"
          className="report-section"
        >
          <PerformanceBreakdownCard
            appLanguage={language}
            currency={currency}
            wins={wins}
            losses={losses}
            breakEven={breakEven}
            averageWin={averageWin}
            averageLoss={averageLoss}
          />
        </div>

        <div
          id="evolution"
          className="print-hidden report-section"
        >
          <TraderEvolutionReport
            appLanguage={language}
            currency={currency}
            disciplineScore={disciplineScore}
            winRate={winRate}
            emotionalTrades={emotionalTrades}
            totalTrades={totalTrades}
          />
        </div>

        <div
          id="coaching"
          className="report-section"
        >
          <AICoachingReport
            appLanguage={language}
            currency={currency}
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
            winRate={winRate}
            emotionalTrades={emotionalTrades}
          />
        </div>

        <div
          id="risk"
          className="report-section"
        >
          <RiskManagementReport
            appLanguage={language}
            currency={currency}
            averageLoss={averageLoss}
            averageWin={averageWin}
            behavioralRisk={behavioralRisk}
            losses={losses}
          />
        </div>

        <div
          id="consistency"
          className="print-hidden report-section"
        >
          <ConsistencyIntelligenceReport
            appLanguage={language}
            currency={currency}
            disciplineScore={disciplineScore}
            winRate={winRate}
            totalTrades={totalTrades}
            emotionalTrades={emotionalTrades}
          />
        </div>

        <div
          id="psychology"
          className="print-hidden report-section"
        >
          <PsychologicalStabilityReport
            appLanguage={language}
            currency={currency}
            emotionalTrades={emotionalTrades}
            totalTrades={totalTrades}
            behavioralRisk={behavioralRisk}
            disciplineScore={disciplineScore}
          />
        </div>

        <div
          id="forecast"
          className="print-hidden report-section"
        >
          <PerformanceForecastReport
            appLanguage={language}
            currency={currency}
            winRate={winRate}
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
            totalPnl={totalPnl}
          />
        </div>

        <div
          id="growth"
          className="print-hidden report-section"
        >
          <GrowthRoadmapReport
            appLanguage={language}
            currency={currency}
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
            winRate={winRate}
          />
        </div>

        <div
          id="edge"
          className="print-hidden report-section"
        >
          <EdgeAnalysisReport
            appLanguage={language}
            currency={currency}
            averageWin={averageWin}
            averageLoss={averageLoss}
            winRate={winRate}
            disciplineScore={disciplineScore}
          />
        </div>

        <div
          id="decision"
          className="print-hidden report-section"
        >
          <DecisionQualityReport
            appLanguage={language}
            currency={currency}
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
            winRate={winRate}
            emotionalTrades={emotionalTrades}
          />
        </div>

        <div
          id="execution"
          className="print-hidden report-section"
        >
          <ExecutionIntelligenceReport
            appLanguage={language}
            currency={currency}
            weakExecutionTrades={weakExecutionTrades}
            totalTrades={totalTrades}
            disciplineScore={disciplineScore}
            averageWin={averageWin}
            averageLoss={averageLoss}
          />
        </div>

        <div
          id="setup"
          className="print-hidden report-section"
        >
          <SetupIntelligenceReport
            appLanguage={language}
            currency={currency}
            totalTrades={totalTrades}
            disciplineScore={disciplineScore}
            averageWin={averageWin}
            averageLoss={averageLoss}
            winRate={winRate}
          />
        </div>

        <div
          id="confidence"
          className="print-hidden report-section"
        >
          <ConfidenceIntelligenceReport
            appLanguage={language}
            currency={currency}
            lowConfidenceTrades={lowConfidenceTrades}
            totalTrades={totalTrades}
            disciplineScore={disciplineScore}
            winRate={winRate}
          />
        </div>

        <div
          id="discipline"
          className="print-hidden report-section"
        >
          <DisciplineIntelligenceReport
            appLanguage={language}
            currency={currency}
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
            emotionalTrades={emotionalTrades}
            totalTrades={totalTrades}
          />
        </div>

        <div
          id="emotion"
          className="print-hidden report-section"
        >
          <EmotionalIntelligenceReport
            appLanguage={language}
            currency={currency}
            emotionalTrades={emotionalTrades}
            totalTrades={totalTrades}
            behavioralRisk={behavioralRisk}
            disciplineScore={disciplineScore}
          />
        </div>

        <div
          id="identity"
          className="print-hidden report-section"
        >
          <TraderIdentityReport
            appLanguage={language}
            currency={currency}
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
            winRate={winRate}
            emotionalTrades={emotionalTrades}
            totalTrades={totalTrades}
          />
        </div>

        <div
          id="cognitive"
          className="print-hidden report-section"
        >
          <CognitivePerformanceReport
            appLanguage={language}
            currency={currency}
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
            lowConfidenceTrades={lowConfidenceTrades}
            weakExecutionTrades={weakExecutionTrades}
            totalTrades={totalTrades}
          />
        </div>

        <div
          id="resilience"
          className="print-hidden report-section"
        >
          <MentalResilienceReport
            appLanguage={language}
            currency={currency}
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
            emotionalTrades={emotionalTrades}
            losses={losses}
            totalTrades={totalTrades}
          />
        </div>

        <div className="print-hidden">
          <PDFReportFooter appLanguage={language} />
        </div>
      </div>
    </div>
  );
}
