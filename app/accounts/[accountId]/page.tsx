import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  CandlestickChart,
  FileText,
  Goal,
  Landmark,
  Layers3,
  LineChart,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatCurrencyByLanguage,
  formatPercentByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type HubCard = {
  href: string;
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  show: boolean;
  accentClass: string;
};

type StatCardProps = {
  label: string;
  value: string | number;
  tone?: string;
};

type AccountHubLabels = {
  hubBadge: string;
  selectedAccount: string;
  archived: string;
  archivedMessage: string;
  heroDescription: string;

  currentEquity: string;
  totalPnl: string;
  winRate: string;
  totalTrades: string;

  initialBalance: string;
  targetProgress: string;
  needsReview: string;
  members: string;

  accountType: string;
  profitTarget: string;
  maxDrawdown: string;

  coreSectionTitle: string;
  coreSectionDescription: string;
  intelligenceSectionTitle: string;
  intelligenceSectionDescription: string;
  managementSectionTitle: string;
  managementSectionDescription: string;

  cards: {
    dashboard: HubCardText;
    diary: HubCardText;
    calendar: HubCardText;
    equity: HubCardText;
    analytics: HubCardText;
    reports: HubCardText;
    sessions: HubCardText;
    copilot: HubCardText;
    members: HubCardText;
    workspace: HubCardText;
    rules: HubCardText;
    integrations: HubCardText;
  };
};

type HubCardText = {
  title: string;
  eyebrow: string;
  description: string;
};

const accountHubLabels: Record<AppLanguage, AccountHubLabels> = {
  it: {
    hubBadge: "Account hub",
    selectedAccount: "Account selezionato",
    archived: "Archiviato",
    archivedMessage:
      "Questo account Ã¨ archiviato. Puoi consultare lo storico, ma le funzioni operative e di gestione sono limitate.",
    heroDescription:
      "Centro operativo dellâ€™account. Da qui puoi accedere rapidamente a performance, diario, analytics, report, team e impostazioni operative.",

    currentEquity: "Current Equity",
    totalPnl: "Total PnL",
    winRate: "Win Rate",
    totalTrades: "Total Trades",

    initialBalance: "Initial Balance",
    targetProgress: "Target Progress",
    needsReview: "Needs Review",
    members: "Members",

    accountType: "Account Type",
    profitTarget: "Profit Target",
    maxDrawdown: "Max Drawdown",

    coreSectionTitle: "Core workspace",
    coreSectionDescription:
      "Le aree principali per leggere e gestire lâ€™andamento dellâ€™account.",
    intelligenceSectionTitle: "Intelligence layer",
    intelligenceSectionDescription:
      "Analisi, report, sessioni e supporto operativo avanzato.",
    managementSectionTitle: "Management",
    managementSectionDescription:
      "Gestione di membri, workspace, regole e integrazioni.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "Overview",
        description:
          "Vista principale dellâ€™account: equity, performance, target e stato operativo generale.",
      },
      diary: {
        title: "Trading Diary",
        eyebrow: "Execution",
        description:
          "Consulta, inserisci e revisiona le operazioni con dati, note, sessioni e qualitÃ  esecutiva.",
      },
      calendar: {
        title: "Calendar",
        eyebrow: "Daily view",
        description:
          "Leggi la performance giornaliera e individua i giorni migliori, peggiori e piÃ¹ stabili.",
      },
      equity: {
        title: "Equity",
        eyebrow: "Capital",
        description:
          "Segui curva equity, drawdown, crescita del conto e andamento progressivo del capitale.",
      },
      analytics: {
        title: "Analytics",
        eyebrow: "Intelligence",
        description:
          "Analisi avanzata su simboli, sessioni, psicologia, qualitÃ  esecutiva e pattern ricorrenti.",
      },
      reports: {
        title: "Reports",
        eyebrow: "Review",
        description:
          "Riepiloghi professionali per leggere risultati, punti forti, criticitÃ  e focus operativo.",
      },
      sessions: {
        title: "Sessions",
        eyebrow: "Planning",
        description:
          "Pianifica e rivedi le sessioni operative con contesto, disciplina e focus pre/post market.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "Memoria operativa, pattern comportamentali, segnali di rischio e supporto decisionale.",
      },
      members: {
        title: "Members",
        eyebrow: "Team",
        description:
          "Controlla membri, ruoli, performance individuali, attivitÃ  e accessi dellâ€™account.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Osserva presenza live, attivitÃ  del team, leaderboard e segnali collaborativi.",
      },
      rules: {
        title: "Rules & Goals",
        eyebrow: "Control",
        description:
          "Gestisci obiettivi, regole operative, limiti e struttura di controllo dellâ€™account.",
      },
      integrations: {
        title: "Integrations",
        eyebrow: "Sync",
        description:
          "Configura MT5, broker sync, modalitÃ  di import e stato delle integrazioni automatiche.",
      },
    },
  },

  en: {
    hubBadge: "Account hub",
    selectedAccount: "Selected account",
    archived: "Archived",
    archivedMessage:
      "This account is archived. You can review historical data, but operational and management features are limited.",
    heroDescription:
      "The account operating center. From here you can quickly access performance, diary, analytics, reports, team and operational settings.",

    currentEquity: "Current Equity",
    totalPnl: "Total PnL",
    winRate: "Win Rate",
    totalTrades: "Total Trades",

    initialBalance: "Initial Balance",
    targetProgress: "Target Progress",
    needsReview: "Needs Review",
    members: "Members",

    accountType: "Account Type",
    profitTarget: "Profit Target",
    maxDrawdown: "Max Drawdown",

    coreSectionTitle: "Core workspace",
    coreSectionDescription:
      "The main areas to read and manage the accountâ€™s progress.",
    intelligenceSectionTitle: "Intelligence layer",
    intelligenceSectionDescription:
      "Analytics, reports, sessions and advanced operational support.",
    managementSectionTitle: "Management",
    managementSectionDescription:
      "Management of members, workspace, rules and integrations.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "Overview",
        description:
          "The main account view: equity, performance, targets and overall operational status.",
      },
      diary: {
        title: "Trading Diary",
        eyebrow: "Execution",
        description:
          "Review, enter and improve trades with data, notes, sessions and execution quality.",
      },
      calendar: {
        title: "Calendar",
        eyebrow: "Daily view",
        description:
          "Read daily performance and identify the best, worst and most stable days.",
      },
      equity: {
        title: "Equity",
        eyebrow: "Capital",
        description:
          "Track equity curve, drawdown, account growth and progressive capital movement.",
      },
      analytics: {
        title: "Analytics",
        eyebrow: "Intelligence",
        description:
          "Advanced analysis on symbols, sessions, psychology, execution quality and recurring patterns.",
      },
      reports: {
        title: "Reports",
        eyebrow: "Review",
        description:
          "Professional summaries to read results, strengths, weaknesses and operational focus.",
      },
      sessions: {
        title: "Sessions",
        eyebrow: "Planning",
        description:
          "Plan and review operational sessions with context, discipline and pre/post-market focus.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "Operational memory, behavioral patterns, risk signals and decision support.",
      },
      members: {
        title: "Members",
        eyebrow: "Team",
        description:
          "Control members, roles, individual performance, activity and account access.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Observe live presence, team activity, leaderboard and collaborative signals.",
      },
      rules: {
        title: "Rules & Goals",
        eyebrow: "Control",
        description:
          "Manage targets, operating rules, limits and the account control structure.",
      },
      integrations: {
        title: "Integrations",
        eyebrow: "Sync",
        description:
          "Configure MT5, broker sync, import modes and automatic integration status.",
      },
    },
  },

  uk: {
    hubBadge: "Ð¦ÐµÐ½Ñ‚Ñ€ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°",
    selectedAccount: "ÐžÐ±Ñ€Ð°Ð½Ð¸Ð¹ Ð°ÐºÐ°ÑƒÐ½Ñ‚",
    archived: "ÐÑ€Ñ…Ñ–Ð²Ð¾Ð²Ð°Ð½Ð¾",
    archivedMessage:
      "Ð¦ÐµÐ¹ Ð°ÐºÐ°ÑƒÐ½Ñ‚ Ð°Ñ€Ñ…Ñ–Ð²Ð¾Ð²Ð°Ð½Ð¾. Ð’Ð¸ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¿ÐµÑ€ÐµÐ³Ð»ÑÐ´Ð°Ñ‚Ð¸ Ñ–ÑÑ‚Ð¾Ñ€Ñ–ÑŽ, Ð°Ð»Ðµ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ñ– Ñ‚Ð° ÑƒÐ¿Ñ€Ð°Ð²Ð»Ñ–Ð½ÑÑŒÐºÑ– Ñ„ÑƒÐ½ÐºÑ†Ñ–Ñ— Ð¾Ð±Ð¼ÐµÐ¶ÐµÐ½Ñ–.",
    heroDescription:
      "ÐžÐ¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð¸Ð¹ Ñ†ÐµÐ½Ñ‚Ñ€ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°. Ð—Ð²Ñ–Ð´ÑÐ¸ Ð¼Ð¾Ð¶Ð½Ð° ÑˆÐ²Ð¸Ð´ÐºÐ¾ Ð¿ÐµÑ€ÐµÐ¹Ñ‚Ð¸ Ð´Ð¾ performance, Ñ‰Ð¾Ð´ÐµÐ½Ð½Ð¸ÐºÐ°, Ð°Ð½Ð°Ð»Ñ–Ñ‚Ð¸ÐºÐ¸, Ð·Ð²Ñ–Ñ‚Ñ–Ð², ÐºÐ¾Ð¼Ð°Ð½Ð´Ð¸ Ñ‚Ð° Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð¸Ñ… Ð½Ð°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð½ÑŒ.",

    currentEquity: "ÐŸÐ¾Ñ‚Ð¾Ñ‡Ð½Ð¸Ð¹ equity",
    totalPnl: "Ð—Ð°Ð³Ð°Ð»ÑŒÐ½Ð¸Ð¹ PnL",
    winRate: "Win Rate",
    totalTrades: "Ð£ÑÑŒÐ¾Ð³Ð¾ ÑƒÐ³Ð¾Ð´",

    initialBalance: "ÐŸÐ¾Ñ‡Ð°Ñ‚ÐºÐ¾Ð²Ð¸Ð¹ Ð±Ð°Ð»Ð°Ð½Ñ",
    targetProgress: "ÐŸÑ€Ð¾Ð³Ñ€ÐµÑ Ñ†Ñ–Ð»Ñ–",
    needsReview: "ÐŸÐ¾Ñ‚Ñ€ÐµÐ±ÑƒÑ” Ð¿ÐµÑ€ÐµÐ³Ð»ÑÐ´Ñƒ",
    members: "Ð£Ñ‡Ð°ÑÐ½Ð¸ÐºÐ¸",

    accountType: "Ð¢Ð¸Ð¿ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°",
    profitTarget: "Ð¦Ñ–Ð»ÑŒ Ð¿Ñ€Ð¸Ð±ÑƒÑ‚ÐºÑƒ",
    maxDrawdown: "ÐœÐ°ÐºÑ. drawdown",

    coreSectionTitle: "ÐžÑÐ½Ð¾Ð²Ð½Ð¸Ð¹ workspace",
    coreSectionDescription:
      "Ð“Ð¾Ð»Ð¾Ð²Ð½Ñ– Ñ€Ð¾Ð·Ð´Ñ–Ð»Ð¸ Ð´Ð»Ñ Ñ‡Ð¸Ñ‚Ð°Ð½Ð½Ñ Ñ‚Ð° ÐºÐµÑ€ÑƒÐ²Ð°Ð½Ð½Ñ Ñ€Ð¾Ð·Ð²Ð¸Ñ‚ÐºÐ¾Ð¼ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°.",
    intelligenceSectionTitle: "Ð†Ð½Ñ‚ÐµÐ»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¸Ð¹ ÑˆÐ°Ñ€",
    intelligenceSectionDescription:
      "ÐÐ½Ð°Ð»Ñ–Ñ‚Ð¸ÐºÐ°, Ð·Ð²Ñ–Ñ‚Ð¸, ÑÐµÑÑ–Ñ— Ñ‚Ð° Ð¿Ñ€Ð¾ÑÑƒÐ½ÑƒÑ‚Ð° Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð° Ð¿Ñ–Ð´Ñ‚Ñ€Ð¸Ð¼ÐºÐ°.",
    managementSectionTitle: "ÐšÐµÑ€ÑƒÐ²Ð°Ð½Ð½Ñ",
    managementSectionDescription:
      "ÐšÐµÑ€ÑƒÐ²Ð°Ð½Ð½Ñ ÑƒÑ‡Ð°ÑÐ½Ð¸ÐºÐ°Ð¼Ð¸, workspace, Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð°Ð¼Ð¸ Ñ‚Ð° Ñ–Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ñ–ÑÐ¼Ð¸.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "ÐžÐ³Ð»ÑÐ´",
        description:
          "Ð“Ð¾Ð»Ð¾Ð²Ð½Ð¸Ð¹ Ð²Ð¸Ð³Ð»ÑÐ´ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°: equity, performance, Ñ†Ñ–Ð»Ñ– Ñ‚Ð° Ð·Ð°Ð³Ð°Ð»ÑŒÐ½Ð¸Ð¹ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð¸Ð¹ ÑÑ‚Ð°Ð½.",
      },
      diary: {
        title: "Ð¢Ð¾Ñ€Ð³Ð¾Ð²Ð¸Ð¹ Ñ‰Ð¾Ð´ÐµÐ½Ð½Ð¸Ðº",
        eyebrow: "Ð’Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ",
        description:
          "ÐŸÐµÑ€ÐµÐ³Ð»ÑÐ´Ð°Ð¹Ñ‚Ðµ, Ð´Ð¾Ð´Ð°Ð²Ð°Ð¹Ñ‚Ðµ Ñ‚Ð° Ð°Ð½Ð°Ð»Ñ–Ð·ÑƒÐ¹Ñ‚Ðµ ÑƒÐ³Ð¾Ð´Ð¸ Ð· Ð´Ð°Ð½Ð¸Ð¼Ð¸, Ð½Ð¾Ñ‚Ð°Ñ‚ÐºÐ°Ð¼Ð¸, ÑÐµÑÑ–ÑÐ¼Ð¸ Ñ‚Ð° ÑÐºÑ–ÑÑ‚ÑŽ Ð²Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ.",
      },
      calendar: {
        title: "ÐšÐ°Ð»ÐµÐ½Ð´Ð°Ñ€",
        eyebrow: "Ð”ÐµÐ½Ð½Ð¸Ð¹ Ð¾Ð³Ð»ÑÐ´",
        description:
          "Ð§Ð¸Ñ‚Ð°Ð¹Ñ‚Ðµ Ð´ÐµÐ½Ð½Ñƒ performance Ñ‚Ð° Ð·Ð½Ð°Ñ…Ð¾Ð´ÑŒÑ‚Ðµ Ð½Ð°Ð¹ÐºÑ€Ð°Ñ‰Ñ–, Ð½Ð°Ð¹Ð³Ñ–Ñ€ÑˆÑ– Ð¹ Ð½Ð°Ð¹ÑÑ‚Ð°Ð±Ñ–Ð»ÑŒÐ½Ñ–ÑˆÑ– Ð´Ð½Ñ–.",
      },
      equity: {
        title: "Equity",
        eyebrow: "ÐšÐ°Ð¿Ñ–Ñ‚Ð°Ð»",
        description:
          "Ð’Ñ–Ð´ÑÑ‚ÐµÐ¶ÑƒÐ¹Ñ‚Ðµ equity curve, drawdown, Ð·Ñ€Ð¾ÑÑ‚Ð°Ð½Ð½Ñ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð° Ñ‚Ð° Ñ€ÑƒÑ… ÐºÐ°Ð¿Ñ–Ñ‚Ð°Ð»Ñƒ.",
      },
      analytics: {
        title: "ÐÐ½Ð°Ð»Ñ–Ñ‚Ð¸ÐºÐ°",
        eyebrow: "Intelligence",
        description:
          "ÐŸÑ€Ð¾ÑÑƒÐ½ÑƒÑ‚Ð° Ð°Ð½Ð°Ð»Ñ–Ñ‚Ð¸ÐºÐ° ÑÐ¸Ð¼Ð²Ð¾Ð»Ñ–Ð², ÑÐµÑÑ–Ð¹, Ð¿ÑÐ¸Ñ…Ð¾Ð»Ð¾Ð³Ñ–Ñ—, ÑÐºÐ¾ÑÑ‚Ñ– Ð²Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ Ñ‚Ð° Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€ÑŽÐ²Ð°Ð½Ð¸Ñ… Ð¿Ð°Ñ‚ÐµÑ€Ð½Ñ–Ð².",
      },
      reports: {
        title: "Ð—Ð²Ñ–Ñ‚Ð¸",
        eyebrow: "Review",
        description:
          "ÐŸÑ€Ð¾Ñ„ÐµÑÑ–Ð¹Ð½Ñ– Ð¿Ñ–Ð´ÑÑƒÐ¼ÐºÐ¸ Ð´Ð»Ñ Ñ‡Ð¸Ñ‚Ð°Ð½Ð½Ñ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ–Ð², ÑÐ¸Ð»ÑŒÐ½Ð¸Ñ… ÑÑ‚Ð¾Ñ€Ñ–Ð½, Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼ Ñ– Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð¾Ð³Ð¾ Ñ„Ð¾ÐºÑƒÑÑƒ.",
      },
      sessions: {
        title: "Ð¡ÐµÑÑ–Ñ—",
        eyebrow: "ÐŸÐ»Ð°Ð½ÑƒÐ²Ð°Ð½Ð½Ñ",
        description:
          "ÐŸÐ»Ð°Ð½ÑƒÐ¹Ñ‚Ðµ Ñ‚Ð° Ð¿ÐµÑ€ÐµÐ³Ð»ÑÐ´Ð°Ð¹Ñ‚Ðµ ÑÐµÑÑ–Ñ— Ð· ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð¾Ð¼, Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ñ–Ð½Ð¾ÑŽ Ñ‚Ð° pre/post-market Ñ„Ð¾ÐºÑƒÑÐ¾Ð¼.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "ÐžÐ¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð° Ð¿Ð°Ð¼â€™ÑÑ‚ÑŒ, Ð¿Ð¾Ð²ÐµÐ´Ñ–Ð½ÐºÐ¾Ð²Ñ– Ð¿Ð°Ñ‚ÐµÑ€Ð½Ð¸, ÑÐ¸Ð³Ð½Ð°Ð»Ð¸ Ñ€Ð¸Ð·Ð¸ÐºÑƒ Ñ‚Ð° Ð¿Ñ–Ð´Ñ‚Ñ€Ð¸Ð¼ÐºÐ° Ñ€Ñ–ÑˆÐµÐ½ÑŒ.",
      },
      members: {
        title: "Ð£Ñ‡Ð°ÑÐ½Ð¸ÐºÐ¸",
        eyebrow: "ÐšÐ¾Ð¼Ð°Ð½Ð´Ð°",
        description:
          "ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŽÐ¹Ñ‚Ðµ ÑƒÑ‡Ð°ÑÐ½Ð¸ÐºÑ–Ð², Ñ€Ð¾Ð»Ñ–, Ñ–Ð½Ð´Ð¸Ð²Ñ–Ð´ÑƒÐ°Ð»ÑŒÐ½Ñƒ performance, Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ–ÑÑ‚ÑŒ Ñ– Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð¸.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Ð¡Ð¿Ð¾ÑÑ‚ÐµÑ€Ñ–Ð³Ð°Ð¹Ñ‚Ðµ live presence, Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ–ÑÑ‚ÑŒ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð¸, leaderboard Ñ‚Ð° ÐºÐ¾Ð»Ð°Ð±Ð¾Ñ€Ð°Ñ‚Ð¸Ð²Ð½Ñ– ÑÐ¸Ð³Ð½Ð°Ð»Ð¸.",
      },
      rules: {
        title: "ÐŸÑ€Ð°Ð²Ð¸Ð»Ð° Ñ‚Ð° Ñ†Ñ–Ð»Ñ–",
        eyebrow: "ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒ",
        description:
          "ÐšÐµÑ€ÑƒÐ¹Ñ‚Ðµ Ñ†Ñ–Ð»ÑÐ¼Ð¸, Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð¸Ð¼Ð¸ Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð°Ð¼Ð¸, Ð»Ñ–Ð¼Ñ–Ñ‚Ð°Ð¼Ð¸ Ñ‚Ð° ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¾ÑŽ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŽ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°.",
      },
      integrations: {
        title: "Ð†Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ñ–Ñ—",
        eyebrow: "Sync",
        description:
          "ÐÐ°Ð»Ð°ÑˆÑ‚Ð¾Ð²ÑƒÐ¹Ñ‚Ðµ MT5, broker sync, Ñ€ÐµÐ¶Ð¸Ð¼Ð¸ Ñ–Ð¼Ð¿Ð¾Ñ€Ñ‚Ñƒ Ñ‚Ð° ÑÑ‚Ð°Ñ‚ÑƒÑ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡Ð½Ð¸Ñ… Ñ–Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ñ–Ð¹.",
      },
    },
  },

  ru: {
    hubBadge: "Ð¦ÐµÐ½Ñ‚Ñ€ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°",
    selectedAccount: "Ð’Ñ‹Ð±Ñ€Ð°Ð½Ð½Ñ‹Ð¹ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚",
    archived: "ÐÑ€Ñ…Ð¸Ð²Ð¸Ñ€Ð¾Ð²Ð°Ð½",
    archivedMessage:
      "Ð­Ñ‚Ð¾Ñ‚ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ Ð°Ñ€Ñ…Ð¸Ð²Ð¸Ñ€Ð¾Ð²Ð°Ð½. Ð’Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¿Ñ€Ð¾ÑÐ¼Ð°Ñ‚Ñ€Ð¸Ð²Ð°Ñ‚ÑŒ Ð¸ÑÑ‚Ð¾Ñ€Ð¸ÑŽ, Ð½Ð¾ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ðµ Ð¸ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ñ‡ÐµÑÐºÐ¸Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ñ‹.",
    heroDescription:
      "ÐžÐ¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¹ Ñ†ÐµÐ½Ñ‚Ñ€ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°. ÐžÑ‚ÑÑŽÐ´Ð° Ð¼Ð¾Ð¶Ð½Ð¾ Ð±Ñ‹ÑÑ‚Ñ€Ð¾ Ð¿ÐµÑ€ÐµÐ¹Ñ‚Ð¸ Ðº performance, Ð´Ð½ÐµÐ²Ð½Ð¸ÐºÑƒ, Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐµ, Ð¾Ñ‚Ñ‡ÐµÑ‚Ð°Ð¼, ÐºÐ¾Ð¼Ð°Ð½Ð´Ðµ Ð¸ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¼ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ°Ð¼.",

    currentEquity: "Ð¢ÐµÐºÑƒÑ‰Ð¸Ð¹ equity",
    totalPnl: "ÐžÐ±Ñ‰Ð¸Ð¹ PnL",
    winRate: "Win Rate",
    totalTrades: "Ð’ÑÐµÐ³Ð¾ ÑÐ´ÐµÐ»Ð¾Ðº",

    initialBalance: "ÐÐ°Ñ‡Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð±Ð°Ð»Ð°Ð½Ñ",
    targetProgress: "ÐŸÑ€Ð¾Ð³Ñ€ÐµÑÑ Ñ†ÐµÐ»Ð¸",
    needsReview: "Ð¢Ñ€ÐµÐ±ÑƒÐµÑ‚ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ¸",
    members: "Ð£Ñ‡Ð°ÑÑ‚Ð½Ð¸ÐºÐ¸",

    accountType: "Ð¢Ð¸Ð¿ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°",
    profitTarget: "Ð¦ÐµÐ»ÑŒ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»Ð¸",
    maxDrawdown: "ÐœÐ°ÐºÑ. drawdown",

    coreSectionTitle: "ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ workspace",
    coreSectionDescription:
      "Ð“Ð»Ð°Ð²Ð½Ñ‹Ðµ Ñ€Ð°Ð·Ð´ÐµÐ»Ñ‹ Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð¸ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑÑÐ¾Ð¼ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°.",
    intelligenceSectionTitle: "Ð˜Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ñ‹Ð¹ ÑÐ»Ð¾Ð¹",
    intelligenceSectionDescription:
      "ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ°, Ð¾Ñ‚Ñ‡ÐµÑ‚Ñ‹, ÑÐµÑÑÐ¸Ð¸ Ð¸ Ð¿Ñ€Ð¾Ð´Ð²Ð¸Ð½ÑƒÑ‚Ð°Ñ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð°Ñ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ°.",
    managementSectionTitle: "Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ",
    managementSectionDescription:
      "Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑƒÑ‡Ð°ÑÑ‚Ð½Ð¸ÐºÐ°Ð¼Ð¸, workspace, Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð°Ð¼Ð¸ Ð¸ Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸ÑÐ¼Ð¸.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "ÐžÐ±Ð·Ð¾Ñ€",
        description:
          "Ð“Ð»Ð°Ð²Ð½Ñ‹Ð¹ Ð²Ð¸Ð´ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°: equity, performance, Ñ†ÐµÐ»Ð¸ Ð¸ Ð¾Ð±Ñ‰Ð¸Ð¹ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¹ ÑÑ‚Ð°Ñ‚ÑƒÑ.",
      },
      diary: {
        title: "Ð¢Ð¾Ñ€Ð³Ð¾Ð²Ñ‹Ð¹ Ð´Ð½ÐµÐ²Ð½Ð¸Ðº",
        eyebrow: "Ð˜ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ",
        description:
          "ÐŸÑ€Ð¾ÑÐ¼Ð°Ñ‚Ñ€Ð¸Ð²Ð°Ð¹Ñ‚Ðµ, Ð´Ð¾Ð±Ð°Ð²Ð»ÑÐ¹Ñ‚Ðµ Ð¸ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹Ñ‚Ðµ ÑÐ´ÐµÐ»ÐºÐ¸ Ñ Ð´Ð°Ð½Ð½Ñ‹Ð¼Ð¸, Ð·Ð°Ð¼ÐµÑ‚ÐºÐ°Ð¼Ð¸, ÑÐµÑÑÐ¸ÑÐ¼Ð¸ Ð¸ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾Ð¼ Ð¸ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ.",
      },
      calendar: {
        title: "ÐšÐ°Ð»ÐµÐ½Ð´Ð°Ñ€ÑŒ",
        eyebrow: "Ð”Ð½ÐµÐ²Ð½Ð¾Ð¹ Ð¾Ð±Ð·Ð¾Ñ€",
        description:
          "Ð§Ð¸Ñ‚Ð°Ð¹Ñ‚Ðµ Ð´Ð½ÐµÐ²Ð½ÑƒÑŽ performance Ð¸ Ð½Ð°Ñ…Ð¾Ð´Ð¸Ñ‚Ðµ Ð»ÑƒÑ‡ÑˆÐ¸Ðµ, Ñ…ÑƒÐ´ÑˆÐ¸Ðµ Ð¸ ÑÐ°Ð¼Ñ‹Ðµ ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð½Ð¸.",
      },
      equity: {
        title: "Equity",
        eyebrow: "ÐšÐ°Ð¿Ð¸Ñ‚Ð°Ð»",
        description:
          "ÐžÑ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°Ð¹Ñ‚Ðµ equity curve, drawdown, Ñ€Ð¾ÑÑ‚ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð° Ð¸ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ ÐºÐ°Ð¿Ð¸Ñ‚Ð°Ð»Ð°.",
      },
      analytics: {
        title: "ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ°",
        eyebrow: "Intelligence",
        description:
          "ÐŸÑ€Ð¾Ð´Ð²Ð¸Ð½ÑƒÑ‚Ð°Ñ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð², ÑÐµÑÑÐ¸Ð¹, Ð¿ÑÐ¸Ñ…Ð¾Ð»Ð¾Ð³Ð¸Ð¸, ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð° Ð¸ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ Ð¸ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€ÑÑŽÑ‰Ð¸Ñ…ÑÑ Ð¿Ð°Ñ‚Ñ‚ÐµÑ€Ð½Ð¾Ð².",
      },
      reports: {
        title: "ÐžÑ‚Ñ‡ÐµÑ‚Ñ‹",
        eyebrow: "Review",
        description:
          "ÐŸÑ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ ÑÐ²Ð¾Ð´ÐºÐ¸ Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð², ÑÐ¸Ð»ÑŒÐ½Ñ‹Ñ… ÑÑ‚Ð¾Ñ€Ð¾Ð½, Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼ Ð¸ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð³Ð¾ Ñ„Ð¾ÐºÑƒÑÐ°.",
      },
      sessions: {
        title: "Ð¡ÐµÑÑÐ¸Ð¸",
        eyebrow: "ÐŸÐ»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ",
        description:
          "ÐŸÐ»Ð°Ð½Ð¸Ñ€ÑƒÐ¹Ñ‚Ðµ Ð¸ Ð¿ÐµÑ€ÐµÑÐ¼Ð°Ñ‚Ñ€Ð¸Ð²Ð°Ð¹Ñ‚Ðµ ÑÐµÑÑÐ¸Ð¸ Ñ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð¾Ð¼, Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ð¸Ð½Ð¾Ð¹ Ð¸ pre/post-market Ñ„Ð¾ÐºÑƒÑÐ¾Ð¼.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "ÐžÐ¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð°Ñ Ð¿Ð°Ð¼ÑÑ‚ÑŒ, Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ñ‡ÐµÑÐºÐ¸Ðµ Ð¿Ð°Ñ‚Ñ‚ÐµÑ€Ð½Ñ‹, ÑÐ¸Ð³Ð½Ð°Ð»Ñ‹ Ñ€Ð¸ÑÐºÐ° Ð¸ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ° Ñ€ÐµÑˆÐµÐ½Ð¸Ð¹.",
      },
      members: {
        title: "Ð£Ñ‡Ð°ÑÑ‚Ð½Ð¸ÐºÐ¸",
        eyebrow: "ÐšÐ¾Ð¼Ð°Ð½Ð´Ð°",
        description:
          "ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€ÑƒÐ¹Ñ‚Ðµ ÑƒÑ‡Ð°ÑÑ‚Ð½Ð¸ÐºÐ¾Ð², Ñ€Ð¾Ð»Ð¸, Ð¸Ð½Ð´Ð¸Ð²Ð¸Ð´ÑƒÐ°Ð»ÑŒÐ½ÑƒÑŽ performance, Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚ÑŒ Ð¸ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ñ‹.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Ð¡Ð»ÐµÐ´Ð¸Ñ‚Ðµ Ð·Ð° live presence, Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚ÑŒÑŽ ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ‹, leaderboard Ð¸ collaborative signals.",
      },
      rules: {
        title: "ÐŸÑ€Ð°Ð²Ð¸Ð»Ð° Ð¸ Ñ†ÐµÐ»Ð¸",
        eyebrow: "ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒ",
        description:
          "Ð£Ð¿Ñ€Ð°Ð²Ð»ÑÐ¹Ñ‚Ðµ Ñ†ÐµÐ»ÑÐ¼Ð¸, Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¼Ð¸ Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð°Ð¼Ð¸, Ð»Ð¸Ð¼Ð¸Ñ‚Ð°Ð¼Ð¸ Ð¸ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¾Ð¹ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ñ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°.",
      },
      integrations: {
        title: "Ð˜Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸",
        eyebrow: "Sync",
        description:
          "ÐÐ°ÑÑ‚Ñ€Ð°Ð¸Ð²Ð°Ð¹Ñ‚Ðµ MT5, broker sync, Ñ€ÐµÐ¶Ð¸Ð¼Ñ‹ Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚Ð° Ð¸ ÑÑ‚Ð°Ñ‚ÑƒÑ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¹.",
      },
    },
  },

  es: {
    hubBadge: "Centro de cuenta",
    selectedAccount: "Cuenta seleccionada",
    archived: "Archivada",
    archivedMessage:
      "Esta cuenta estÃ¡ archivada. Puedes consultar el histÃ³rico, pero las funciones operativas y de gestiÃ³n estÃ¡n limitadas.",
    heroDescription:
      "Centro operativo de la cuenta. Desde aquÃ­ puedes acceder rÃ¡pidamente a performance, diario, analÃ­tica, informes, equipo y ajustes operativos.",

    currentEquity: "Equity actual",
    totalPnl: "PnL total",
    winRate: "Win Rate",
    totalTrades: "Operaciones totales",

    initialBalance: "Balance inicial",
    targetProgress: "Progreso del objetivo",
    needsReview: "Requiere revisiÃ³n",
    members: "Miembros",

    accountType: "Tipo de cuenta",
    profitTarget: "Objetivo de beneficio",
    maxDrawdown: "Drawdown mÃ¡ximo",

    coreSectionTitle: "Workspace principal",
    coreSectionDescription:
      "Las Ã¡reas principales para leer y gestionar el progreso de la cuenta.",
    intelligenceSectionTitle: "Capa de inteligencia",
    intelligenceSectionDescription:
      "AnalÃ­tica, informes, sesiones y soporte operativo avanzado.",
    managementSectionTitle: "GestiÃ³n",
    managementSectionDescription:
      "GestiÃ³n de miembros, workspace, reglas e integraciones.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "Resumen",
        description:
          "Vista principal de la cuenta: equity, performance, objetivos y estado operativo general.",
      },
      diary: {
        title: "Diario de trading",
        eyebrow: "EjecuciÃ³n",
        description:
          "Consulta, introduce y revisa operaciones con datos, notas, sesiones y calidad de ejecuciÃ³n.",
      },
      calendar: {
        title: "Calendario",
        eyebrow: "Vista diaria",
        description:
          "Lee la performance diaria e identifica los mejores, peores y mÃ¡s estables dÃ­as.",
      },
      equity: {
        title: "Equity",
        eyebrow: "Capital",
        description:
          "Sigue equity curve, drawdown, crecimiento de la cuenta y movimiento progresivo del capital.",
      },
      analytics: {
        title: "AnalÃ­tica",
        eyebrow: "Intelligence",
        description:
          "AnÃ¡lisis avanzado de sÃ­mbolos, sesiones, psicologÃ­a, calidad de ejecuciÃ³n y patrones recurrentes.",
      },
      reports: {
        title: "Informes",
        eyebrow: "Review",
        description:
          "ResÃºmenes profesionales para leer resultados, fortalezas, debilidades y foco operativo.",
      },
      sessions: {
        title: "Sesiones",
        eyebrow: "PlanificaciÃ³n",
        description:
          "Planifica y revisa sesiones operativas con contexto, disciplina y foco pre/post-market.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "Memoria operativa, patrones de comportamiento, seÃ±ales de riesgo y soporte de decisiÃ³n.",
      },
      members: {
        title: "Miembros",
        eyebrow: "Equipo",
        description:
          "Controla miembros, roles, performance individual, actividad y accesos de la cuenta.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Observa presencia en vivo, actividad del equipo, leaderboard y seÃ±ales colaborativas.",
      },
      rules: {
        title: "Reglas y objetivos",
        eyebrow: "Control",
        description:
          "Gestiona objetivos, reglas operativas, lÃ­mites y estructura de control de la cuenta.",
      },
      integrations: {
        title: "Integraciones",
        eyebrow: "Sync",
        description:
          "Configura MT5, broker sync, modos de importaciÃ³n y estado de integraciones automÃ¡ticas.",
      },
    },
  },

  fr: {
    hubBadge: "Centre du compte",
    selectedAccount: "Compte sÃ©lectionnÃ©",
    archived: "ArchivÃ©",
    archivedMessage:
      "Ce compte est archivÃ©. Vous pouvez consulter lâ€™historique, mais les fonctions opÃ©rationnelles et de gestion sont limitÃ©es.",
    heroDescription:
      "Centre opÃ©rationnel du compte. Depuis ici, accÃ©dez rapidement Ã  la performance, au journal, aux analytics, aux rapports, Ã  lâ€™Ã©quipe et aux paramÃ¨tres opÃ©rationnels.",

    currentEquity: "Equity actuelle",
    totalPnl: "PnL total",
    winRate: "Win Rate",
    totalTrades: "Trades totaux",

    initialBalance: "Solde initial",
    targetProgress: "Progression de lâ€™objectif",
    needsReview: "Ã€ revoir",
    members: "Membres",

    accountType: "Type de compte",
    profitTarget: "Objectif de profit",
    maxDrawdown: "Drawdown maximal",

    coreSectionTitle: "Workspace principal",
    coreSectionDescription:
      "Les zones principales pour lire et gÃ©rer lâ€™Ã©volution du compte.",
    intelligenceSectionTitle: "Couche dâ€™intelligence",
    intelligenceSectionDescription:
      "Analytics, rapports, sessions et support opÃ©rationnel avancÃ©.",
    managementSectionTitle: "Gestion",
    managementSectionDescription:
      "Gestion des membres, workspace, rÃ¨gles et intÃ©grations.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "Vue dâ€™ensemble",
        description:
          "Vue principale du compte : equity, performance, objectifs et Ã©tat opÃ©rationnel gÃ©nÃ©ral.",
      },
      diary: {
        title: "Journal de trading",
        eyebrow: "ExÃ©cution",
        description:
          "Consultez, ajoutez et rÃ©visez les trades avec donnÃ©es, notes, sessions et qualitÃ© dâ€™exÃ©cution.",
      },
      calendar: {
        title: "Calendrier",
        eyebrow: "Vue quotidienne",
        description:
          "Lisez la performance quotidienne et identifiez les meilleurs, pires et plus stables jours.",
      },
      equity: {
        title: "Equity",
        eyebrow: "Capital",
        description:
          "Suivez lâ€™equity curve, le drawdown, la croissance du compte et lâ€™Ã©volution du capital.",
      },
      analytics: {
        title: "Analytics",
        eyebrow: "Intelligence",
        description:
          "Analyse avancÃ©e des symboles, sessions, psychologie, qualitÃ© dâ€™exÃ©cution et patterns rÃ©currents.",
      },
      reports: {
        title: "Rapports",
        eyebrow: "Review",
        description:
          "RÃ©sumÃ©s professionnels pour lire les rÃ©sultats, forces, faiblesses et focus opÃ©rationnel.",
      },
      sessions: {
        title: "Sessions",
        eyebrow: "Planification",
        description:
          "Planifiez et rÃ©visez les sessions opÃ©rationnelles avec contexte, discipline et focus pre/post-market.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "MÃ©moire opÃ©rationnelle, patterns comportementaux, signaux de risque et aide Ã  la dÃ©cision.",
      },
      members: {
        title: "Membres",
        eyebrow: "Ã‰quipe",
        description:
          "ContrÃ´lez les membres, rÃ´les, performance individuelle, activitÃ© et accÃ¨s du compte.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Observez la prÃ©sence live, lâ€™activitÃ© de lâ€™Ã©quipe, le leaderboard et les signaux collaboratifs.",
      },
      rules: {
        title: "RÃ¨gles et objectifs",
        eyebrow: "ContrÃ´le",
        description:
          "GÃ©rez les objectifs, rÃ¨gles opÃ©rationnelles, limites et structure de contrÃ´le du compte.",
      },
      integrations: {
        title: "IntÃ©grations",
        eyebrow: "Sync",
        description:
          "Configurez MT5, broker sync, modes dâ€™import et Ã©tat des intÃ©grations automatiques.",
      },
    },
  },

  de: {
    hubBadge: "Konto-Hub",
    selectedAccount: "AusgewÃ¤hltes Konto",
    archived: "Archiviert",
    archivedMessage:
      "Dieses Konto ist archiviert. Du kannst historische Daten ansehen, aber operative und administrative Funktionen sind eingeschrÃ¤nkt.",
    heroDescription:
      "Operatives Zentrum des Kontos. Von hier aus erreichst du schnell Performance, Tagebuch, Analytics, Berichte, Team und operative Einstellungen.",

    currentEquity: "Aktuelles Equity",
    totalPnl: "Gesamt-PnL",
    winRate: "Win Rate",
    totalTrades: "Trades gesamt",

    initialBalance: "Startkapital",
    targetProgress: "Ziel-Fortschritt",
    needsReview: "Review nÃ¶tig",
    members: "Mitglieder",

    accountType: "Kontotyp",
    profitTarget: "Gewinnziel",
    maxDrawdown: "Max. Drawdown",

    coreSectionTitle: "Core workspace",
    coreSectionDescription:
      "Die wichtigsten Bereiche, um den Kontofortschritt zu lesen und zu verwalten.",
    intelligenceSectionTitle: "Intelligence layer",
    intelligenceSectionDescription:
      "Analytics, Berichte, Sessions und erweiterte operative UnterstÃ¼tzung.",
    managementSectionTitle: "Management",
    managementSectionDescription:
      "Verwaltung von Mitgliedern, Workspace, Regeln und Integrationen.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "Ãœberblick",
        description:
          "Hauptansicht des Kontos: equity, performance, Ziele und allgemeiner operativer Status.",
      },
      diary: {
        title: "Trading-Tagebuch",
        eyebrow: "Execution",
        description:
          "PrÃ¼fe, erfasse und verbessere Trades mit Daten, Notizen, Sessions und AusfÃ¼hrungsqualitÃ¤t.",
      },
      calendar: {
        title: "Kalender",
        eyebrow: "Tagesansicht",
        description:
          "Lies die tÃ¤gliche Performance und erkenne beste, schlechteste und stabilste Tage.",
      },
      equity: {
        title: "Equity",
        eyebrow: "Kapital",
        description:
          "Verfolge equity curve, drawdown, Kontowachstum und Kapitalentwicklung.",
      },
      analytics: {
        title: "Analytics",
        eyebrow: "Intelligence",
        description:
          "Erweiterte Analyse von Symbolen, Sessions, Psychologie, AusfÃ¼hrungsqualitÃ¤t und wiederkehrenden Mustern.",
      },
      reports: {
        title: "Berichte",
        eyebrow: "Review",
        description:
          "Professionelle Zusammenfassungen zu Ergebnissen, StÃ¤rken, SchwÃ¤chen und operativem Fokus.",
      },
      sessions: {
        title: "Sessions",
        eyebrow: "Planung",
        description:
          "Plane und Ã¼berprÃ¼fe operative Sessions mit Kontext, Disziplin und pre/post-market Fokus.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "Operatives GedÃ¤chtnis, Verhaltensmuster, Risikosignale und EntscheidungsunterstÃ¼tzung.",
      },
      members: {
        title: "Mitglieder",
        eyebrow: "Team",
        description:
          "Kontrolliere Mitglieder, Rollen, individuelle Performance, AktivitÃ¤t und Kontozugriffe.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Beobachte Live-PrÃ¤senz, TeamaktivitÃ¤t, Leaderboard und kollaborative Signale.",
      },
      rules: {
        title: "Regeln & Ziele",
        eyebrow: "Kontrolle",
        description:
          "Verwalte Ziele, operative Regeln, Limits und die Kontrollstruktur des Kontos.",
      },
      integrations: {
        title: "Integrationen",
        eyebrow: "Sync",
        description:
          "Konfiguriere MT5, broker sync, Importmodi und Status automatischer Integrationen.",
      },
    },
  },
};

function formatOptionalPercent(
  value: number | null | undefined,
  language: AppLanguage
) {
  if (value === null || value === undefined) {
    return "-";
  }

  return formatPercentByLanguage(value, language);
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

function AccountHubCard({ card }: { card: HubCard }) {
  const Icon = card.icon;

  return (
    <Link
      href={card.href}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div
        className={`absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 ${card.accentClass}`}
      />

      <div className="relative z-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">
              {card.eyebrow}
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              {card.title}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-cyan-300">
            <Icon size={20} />
          </div>
        </div>

        <p className="text-sm leading-6 text-gray-400">
          {card.description}
        </p>
      </div>
    </Link>
  );
}

function StatCard({
  label,
  value,
  tone = "text-white",
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-gray-400">
        {label}
      </p>

      <p className={`mt-3 text-3xl font-black ${tone}`}>
        {value}
      </p>
    </div>
  );
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

  const membership = await prisma.accountMember.findFirst({
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

  const account = membership.tradingAccount;

  const currentUser = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      lastSeenAt: new Date(),
      lastActivityAt: new Date(),
    },
    select: {
      appLanguage: true,
    },
  });

  const language = normalizeAppLanguage(
    currentUser.appLanguage
  );

  const t = accountHubLabels[language];

  const [trades, membersCount] = await Promise.all([
    prisma.trade.findMany({
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
      select: {
        resultUsd: true,
        equity: true,
        outcome: true,
        needsReview: true,
      },
    }),

    prisma.accountMember.count({
      where: {
        tradingAccountId: accountId,
      },
    }),
  ]);

  const isManager = membership.role === "MANAGER";
  const isArchived = account.status === "ARCHIVED";

  const canViewAnalytics =
    isManager || membership.canViewAnalytics;

  const canViewReports =
    isManager || membership.canViewReports;

  const canUseSessions =
    isManager || membership.role === "MEMBER";

  const canViewCopilot =
    isManager || membership.canViewCopilot;

  const canViewMembers =
    isManager || membership.canViewMembers;

  const canManageAccount =
    isManager || membership.canManageAccount;

  const currency = account.currency || "USD";
  const initialBalance = account.initialBalance || 0;

  const totalTrades = trades.length;

  const closedTrades = trades.filter(
    (trade) =>
      trade.outcome === "win" ||
      trade.outcome === "loss" ||
      trade.outcome === "be"
  );

  const wins = closedTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

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

  const winRate =
    closedTrades.length > 0
      ? (wins / closedTrades.length) * 100
      : 0;

  const needsReviewCount = trades.filter(
    (trade) => trade.needsReview
  ).length;

  const accountProgress =
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

  const coreCards: HubCard[] = [
    {
      href: `/accounts/${account.id}/dashboard`,
      ...t.cards.dashboard,
      icon: BarChart3,
      show: true,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/diary`,
      ...t.cards.diary,
      icon: CandlestickChart,
      show: true,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/calendar`,
      ...t.cards.calendar,
      icon: CalendarDays,
      show: true,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.12),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/equity`,
      ...t.cards.equity,
      icon: LineChart,
      show: true,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_38%)]",
    },
  ];

  const intelligenceCards: HubCard[] = [
    {
      href: `/accounts/${account.id}/analytics`,
      ...t.cards.analytics,
      icon: Activity,
      show: canViewAnalytics,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.14),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/reports`,
      ...t.cards.reports,
      icon: FileText,
      show: canViewReports,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/sessions`,
      ...t.cards.sessions,
      icon: BookOpen,
      show: canUseSessions && !isArchived,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/copilot`,
      ...t.cards.copilot,
      icon: Bot,
      show: canViewCopilot && !isArchived,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.14),transparent_38%)]",
    },
  ];

  const managementCards: HubCard[] = [
    {
      href: `/accounts/${account.id}/members`,
      ...t.cards.members,
      icon: Users,
      show: canViewMembers,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/workspace`,
      ...t.cards.workspace,
      icon: Layers3,
      show: canViewMembers && !isArchived,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/rules`,
      ...t.cards.rules,
      icon: Goal,
      show: canManageAccount && !isArchived,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.12),transparent_38%)]",
    },
    {
      href: `/accounts/${account.id}/integrations`,
      ...t.cards.integrations,
      icon: Zap,
      show: canManageAccount && !isArchived,
      accentClass:
        "bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_38%)]",
    },
  ];

  const sections = [
    {
      title: t.coreSectionTitle,
      description: t.coreSectionDescription,
      cards: coreCards,
    },
    {
      title: t.intelligenceSectionTitle,
      description: t.intelligenceSectionDescription,
      cards: intelligenceCards.filter((card) => card.show),
    },
    {
      title: t.managementSectionTitle,
      description: t.managementSectionDescription,
      cards: managementCards.filter((card) => card.show),
    },
  ].filter((section) => section.cards.length > 0);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_35%)]" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                {t.hubBadge}
              </span>

              <span
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${isArchived
                    ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
                    : "border-green-500/20 bg-green-500/10 text-green-300"
                  }`}
              >
                {isArchived ? t.archived : account.status}
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                {membership.role}
              </span>
            </div>

            <p className="text-sm text-gray-400">
              {t.selectedAccount}
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-6xl">
              {account.name}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400">
              {t.heroDescription}
            </p>

            {isArchived && (
              <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-sm leading-6 text-yellow-100">
                {t.archivedMessage}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2">
            <StatCard
              label={t.currentEquity}
              value={formatCurrencyByLanguage(
                currentEquity,
                currency,
                language
              )}
            />

            <StatCard
              label={t.totalPnl}
              value={formatCurrencyByLanguage(
                totalPnl,
                currency,
                language
              )}
              tone={getResultTone(totalPnl)}
            />

            <StatCard
              label={t.winRate}
              value={formatPercentByLanguage(
                winRate,
                language
              )}
              tone={
                winRate >= 50
                  ? "text-green-400"
                  : "text-yellow-400"
              }
            />

            <StatCard
              label={t.totalTrades}
              value={totalTrades}
              tone="text-cyan-300"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Wallet className="text-green-400" size={22} />
            <p className="text-sm text-gray-400">
              {t.initialBalance}
            </p>
          </div>

          <p className="mt-4 text-3xl font-black text-white">
            {formatCurrencyByLanguage(
              initialBalance,
              currency,
              language
            )}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-cyan-300" size={22} />
            <p className="text-sm text-gray-400">
              {t.targetProgress}
            </p>
          </div>

          <p className="mt-4 text-3xl font-black text-cyan-300">
            {account.profitTarget
              ? formatPercentByLanguage(
                accountProgress,
                language
              )
              : "-"}
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-300"
              style={{
                width: `${accountProgress}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-yellow-300" size={22} />
            <p className="text-sm text-gray-400">
              {t.needsReview}
            </p>
          </div>

          <p className="mt-4 text-3xl font-black text-yellow-300">
            {needsReviewCount}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Landmark className="text-purple-300" size={22} />
            <p className="text-sm text-gray-400">
              {t.members}
            </p>
          </div>

          <p className="mt-4 text-3xl font-black text-white">
            {membersCount}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.accountType}
          </p>

          <p className="mt-3 text-2xl font-black text-white">
            {account.type}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.profitTarget}
          </p>

          <p className="mt-3 text-2xl font-black text-green-400">
            {formatOptionalPercent(
              account.profitTarget,
              language
            )}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.maxDrawdown}
          </p>

          <p className="mt-3 text-2xl font-black text-red-400">
            {formatOptionalPercent(
              account.maxDrawdown,
              language
            )}
          </p>
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.title}
          className="space-y-5"
        >
          <div>
            <p className="text-sm text-gray-400">
              {section.description}
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              {section.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {section.cards.map((card) => (
              <AccountHubCard
                key={card.href}
                card={card}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

