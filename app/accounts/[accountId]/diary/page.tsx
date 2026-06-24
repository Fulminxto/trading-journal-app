import { Prisma } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PlayCircle } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatCurrencyByLanguage,
  formatDateByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

import ExecutionInsights from "@/components/diary/ExecutionInsights";
import ScopeBar from "@/components/ScopeBar";
import {
  parseScopeParams,
  getPeriodRange,
  getPeriodSuffix,
} from "@/lib/scope";

import {
  createAccountTrade,
  deleteAccountTrade,
} from "./actions";

type DiaryLabels = {
  filteredPnl: string;
  currentEquity: string;
  winRate: string;
  filteredTrades: string;
  imported: string;
  needsReview: string;
  bestTrade: string;
  worstTrade: string;

  operationalRegister: string;
  title: string;
  memberFilterActive: string;
  viewingOnlyTradesOf: string;
  clearFilter: string;
  readOnlyMode: string;
  readOnlyTitle: string;
  readOnlyDescription: string;
  account: string;
  readOnly: string;
  win: string;
  loss: string;
  be: string;

  filtersEyebrow: string;
  filtersTitle: string;
  resetFilters: string;
  allSymbols: string;
  allOutcomes: string;
  allDirections: string;
  allSources: string;
  allStatuses: string;
  allTraders: string;
  strategy: string;
  allStrategies: string;
  noStrategy: string;
  applyFilters: string;

  newTradeEyebrow: string;
  newTradeTitle: string;
  openDate: string;
  openTime: string;
  reason: string;
  instrument: string;
  amount: string;
  openingPrice: string;
  stopLoss: string;
  takeProfit: string;
  riskReward: string;
  closeDate: string;
  closingPrice: string;
  outcome: string;
  result: string;
  session: string;
  emotionalState: string;
  setupQuality: string;
  executionRating: string;
  confidence: string;
  mistakes: string;
  lessonsLearned: string;
  addTrade: string;

  calm: string;
  focused: string;
  confident: string;
  tired: string;
  stressed: string;
  impulsive: string;

  historyEyebrow: string;
  historyTitle: string;
  filteredCount: (filtered: number, total: number) => string;
  noTrades: string;

  date: string;
  trader: string;
  symbol: string;
  sync: string;
  direction: string;
  equity: string;
  actions: string;
  edit: string;
  delete: string;
  manual: string;
  mt5: string;
  broker: string;
  unknownTrader: string;
  notes: string;
};

const diaryLabels: Record<AppLanguage, DiaryLabels> = {
  it: {
    filteredPnl: "PnL filtrato",
    currentEquity: "Equity attuale",
    winRate: "Win Rate",
    filteredTrades: "Trade filtrati",
    imported: "Importati",
    needsReview: "Da revisionare",
    bestTrade: "Miglior trade",
    worstTrade: "Peggior trade",

    operationalRegister: "Registro operativo",
    title: "Trading Diary",
    memberFilterActive: "Filtro membro attivo",
    viewingOnlyTradesOf: "Stai visualizzando solo i trade di",
    clearFilter: "Pulisci filtro",
    readOnlyMode: "ModalitÃ  sola lettura",
    readOnlyTitle: "Questo account Ã¨ in modalitÃ  visualizzazione",
    readOnlyDescription:
      "Puoi consultare il diario, ma non puoi creare, modificare o eliminare trade.",
    account: "Account",
    readOnly: "Sola lettura",
    win: "Win",
    loss: "Loss",
    be: "BE",

    filtersEyebrow: "Filtri operativi",
    filtersTitle: "Analizza i tuoi trade",
    resetFilters: "Reset filtri",
    allSymbols: "Tutti i simboli",
    allOutcomes: "Tutti gli outcome",
    allDirections: "Tutte le direzioni",
    allSources: "Tutte le sorgenti",
    allStatuses: "Tutti gli stati",
    allTraders: "Tutti i trader",
    strategy: "Strategia",
    allStrategies: "â€” Tutte le strategie â€”",
    noStrategy: "â€” Nessuna strategia â€”",
    applyFilters: "Applica filtri",

    newTradeEyebrow: "Nuova operazione",
    newTradeTitle: "Inserisci trade",
    openDate: "Data apertura",
    openTime: "Ora apertura",
    reason: "Motivo",
    instrument: "Strumento",
    amount: "Amount / Lot",
    openingPrice: "Prezzo apertura",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Data chiusura",
    closingPrice: "Prezzo chiusura",
    outcome: "Outcome",
    result: "Risultato $",
    session: "Sessione",
    emotionalState: "Stato emotivo",
    setupQuality: "QualitÃ  setup (1-10)",
    executionRating: "Valutazione esecuzione (1-10)",
    confidence: "Confidence (1-10)",
    mistakes: "Errori commessi",
    lessonsLearned: "Lezioni apprese",
    addTrade: "Aggiungi trade",

    calm: "Calmo",
    focused: "Focused",
    confident: "Confident",
    tired: "Stanco",
    stressed: "Stressato",
    impulsive: "Impulsivo",

    historyEyebrow: "Storico operazioni",
    historyTitle: "Trade registrati",
    filteredCount: (filtered, total) =>
      `${filtered} operazioni filtrate su ${total} totali`,
    noTrades: "Nessun trade trovato con questi filtri.",

    date: "Data",
    trader: "Trader",
    symbol: "Symbol",
    sync: "Sync",
    direction: "Direction",
    equity: "Equity",
    actions: "Azioni",
    edit: "Modifica",
    delete: "Elimina",
    manual: "Manuale",
    mt5: "MT5",
    broker: "Broker",
    unknownTrader: "Trader",
    notes: "Note",
  },

  en: {
    filteredPnl: "Filtered PnL",
    currentEquity: "Current Equity",
    winRate: "Win Rate",
    filteredTrades: "Filtered Trades",
    imported: "Imported",
    needsReview: "Needs Review",
    bestTrade: "Best Trade",
    worstTrade: "Worst Trade",

    operationalRegister: "Operational register",
    title: "Trading Diary",
    memberFilterActive: "Member filter active",
    viewingOnlyTradesOf: "You are viewing only trades from",
    clearFilter: "Clear filter",
    readOnlyMode: "Read only mode",
    readOnlyTitle: "This account is in view-only mode",
    readOnlyDescription:
      "You can read the diary, but you cannot create, edit or delete trades.",
    account: "Account",
    readOnly: "Read only",
    win: "Win",
    loss: "Loss",
    be: "BE",

    filtersEyebrow: "Operational filters",
    filtersTitle: "Analyze your trades",
    resetFilters: "Reset filters",
    allSymbols: "All symbols",
    allOutcomes: "All outcomes",
    allDirections: "All directions",
    allSources: "All sources",
    allStatuses: "All statuses",
    allTraders: "All traders",
    strategy: "Strategy",
    allStrategies: "â€” All strategies â€”",
    noStrategy: "â€” No strategy â€”",
    applyFilters: "Apply filters",

    newTradeEyebrow: "New operation",
    newTradeTitle: "Add trade",
    openDate: "Open date",
    openTime: "Open time",
    reason: "Reason",
    instrument: "Instrument",
    amount: "Amount / Lot",
    openingPrice: "Opening price",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Close date",
    closingPrice: "Closing price",
    outcome: "Outcome",
    result: "Result $",
    session: "Session",
    emotionalState: "Emotional state",
    setupQuality: "Setup Quality (1-10)",
    executionRating: "Execution Rating (1-10)",
    confidence: "Confidence (1-10)",
    mistakes: "Mistakes",
    lessonsLearned: "Lessons learned",
    addTrade: "Add trade",

    calm: "Calm",
    focused: "Focused",
    confident: "Confident",
    tired: "Tired",
    stressed: "Stressed",
    impulsive: "Impulsive",

    historyEyebrow: "Trade history",
    historyTitle: "Registered trades",
    filteredCount: (filtered, total) =>
      `${filtered} filtered trades out of ${total} total`,
    noTrades: "No trades found with these filters.",

    date: "Date",
    trader: "Trader",
    symbol: "Symbol",
    sync: "Sync",
    direction: "Direction",
    equity: "Equity",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    manual: "Manual",
    mt5: "MT5",
    broker: "Broker",
    unknownTrader: "Trader",
    notes: "Notes",
  },

  uk: {
    filteredPnl: "Ð’Ñ–Ð´Ñ„Ñ–Ð»ÑŒÑ‚Ñ€Ð¾Ð²Ð°Ð½Ð¸Ð¹ PnL",
    currentEquity: "ÐŸÐ¾Ñ‚Ð¾Ñ‡Ð½Ð° equity",
    winRate: "Win Rate",
    filteredTrades: "Ð’Ñ–Ð´Ñ„Ñ–Ð»ÑŒÑ‚Ñ€Ð¾Ð²Ð°Ð½Ñ– ÑƒÐ³Ð¾Ð´Ð¸",
    imported: "Ð†Ð¼Ð¿Ð¾Ñ€Ñ‚Ð¾Ð²Ð°Ð½Ñ–",
    needsReview: "ÐŸÐ¾Ñ‚Ñ€ÐµÐ±ÑƒÑ” Ñ€ÐµÐ²Ê¼ÑŽ",
    bestTrade: "ÐÐ°Ð¹ÐºÑ€Ð°Ñ‰Ð° ÑƒÐ³Ð¾Ð´Ð°",
    worstTrade: "ÐÐ°Ð¹Ð³Ñ–Ñ€ÑˆÐ° ÑƒÐ³Ð¾Ð´Ð°",
    operationalRegister: "ÐžÐ¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð¸Ð¹ Ð¶ÑƒÑ€Ð½Ð°Ð»",
    title: "Ð¢Ð¾Ñ€Ð³Ð¾Ð²Ð¸Ð¹ Ñ‰Ð¾Ð´ÐµÐ½Ð½Ð¸Ðº",
    memberFilterActive: "Ð¤Ñ–Ð»ÑŒÑ‚Ñ€ ÑƒÑ‡Ð°ÑÐ½Ð¸ÐºÐ° Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¸Ð¹",
    viewingOnlyTradesOf: "Ð’Ð¸ Ð¿ÐµÑ€ÐµÐ³Ð»ÑÐ´Ð°Ñ”Ñ‚Ðµ Ð»Ð¸ÑˆÐµ ÑƒÐ³Ð¾Ð´Ð¸ Ð²Ñ–Ð´",
    clearFilter: "ÐžÑ‡Ð¸ÑÑ‚Ð¸Ñ‚Ð¸ Ñ„Ñ–Ð»ÑŒÑ‚Ñ€",
    readOnlyMode: "Ð ÐµÐ¶Ð¸Ð¼ Ð»Ð¸ÑˆÐµ Ð¿ÐµÑ€ÐµÐ³Ð»ÑÐ´Ñƒ",
    readOnlyTitle: "Ð¦ÐµÐ¹ Ð°ÐºÐ°ÑƒÐ½Ñ‚ Ñƒ Ñ€ÐµÐ¶Ð¸Ð¼Ñ– Ð¿ÐµÑ€ÐµÐ³Ð»ÑÐ´Ñƒ",
    readOnlyDescription:
      "Ð’Ð¸ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¿ÐµÑ€ÐµÐ³Ð»ÑÐ´Ð°Ñ‚Ð¸ Ñ‰Ð¾Ð´ÐµÐ½Ð½Ð¸Ðº, Ð°Ð»Ðµ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ ÑÑ‚Ð²Ð¾Ñ€ÑŽÐ²Ð°Ñ‚Ð¸, Ñ€ÐµÐ´Ð°Ð³ÑƒÐ²Ð°Ñ‚Ð¸ Ð°Ð±Ð¾ Ð²Ð¸Ð´Ð°Ð»ÑÑ‚Ð¸ ÑƒÐ³Ð¾Ð´Ð¸.",
    account: "ÐÐºÐ°ÑƒÐ½Ñ‚",
    readOnly: "Ð›Ð¸ÑˆÐµ Ð¿ÐµÑ€ÐµÐ³Ð»ÑÐ´",
    win: "Win",
    loss: "Loss",
    be: "BE",
    filtersEyebrow: "ÐžÐ¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ñ– Ñ„Ñ–Ð»ÑŒÑ‚Ñ€Ð¸",
    filtersTitle: "ÐÐ½Ð°Ð»Ñ–Ð·ÑƒÐ¹Ñ‚Ðµ ÑÐ²Ð¾Ñ— ÑƒÐ³Ð¾Ð´Ð¸",
    resetFilters: "Ð¡ÐºÐ¸Ð½ÑƒÑ‚Ð¸ Ñ„Ñ–Ð»ÑŒÑ‚Ñ€Ð¸",
    allSymbols: "Ð£ÑÑ– ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¸",
    allOutcomes: "Ð£ÑÑ– Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¸",
    allDirections: "Ð£ÑÑ– Ð½Ð°Ð¿Ñ€ÑÐ¼ÐºÐ¸",
    allSources: "Ð£ÑÑ– Ð´Ð¶ÐµÑ€ÐµÐ»Ð°",
    allStatuses: "Ð£ÑÑ– ÑÑ‚Ð°Ñ‚ÑƒÑÐ¸",
    allTraders: "Ð£ÑÑ– Ñ‚Ñ€ÐµÐ¹Ð´ÐµÑ€Ð¸",
    strategy: "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ñ",
    allStrategies: "â€” Ð£ÑÑ– ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ñ— â€”",
    noStrategy: "â€” Ð‘ÐµÐ· ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ñ— â€”",
    applyFilters: "Ð—Ð°ÑÑ‚Ð¾ÑÑƒÐ²Ð°Ñ‚Ð¸ Ñ„Ñ–Ð»ÑŒÑ‚Ñ€Ð¸",
    newTradeEyebrow: "ÐÐ¾Ð²Ð° Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ñ",
    newTradeTitle: "Ð”Ð¾Ð´Ð°Ñ‚Ð¸ ÑƒÐ³Ð¾Ð´Ñƒ",
    openDate: "Ð”Ð°Ñ‚Ð° Ð²Ñ–Ð´ÐºÑ€Ð¸Ñ‚Ñ‚Ñ",
    openTime: "Ð§Ð°Ñ Ð²Ñ–Ð´ÐºÑ€Ð¸Ñ‚Ñ‚Ñ",
    reason: "ÐŸÑ€Ð¸Ñ‡Ð¸Ð½Ð°",
    instrument: "Ð†Ð½ÑÑ‚Ñ€ÑƒÐ¼ÐµÐ½Ñ‚",
    amount: "Amount / Lot",
    openingPrice: "Ð¦Ñ–Ð½Ð° Ð²Ñ–Ð´ÐºÑ€Ð¸Ñ‚Ñ‚Ñ",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Ð”Ð°Ñ‚Ð° Ð·Ð°ÐºÑ€Ð¸Ñ‚Ñ‚Ñ",
    closingPrice: "Ð¦Ñ–Ð½Ð° Ð·Ð°ÐºÑ€Ð¸Ñ‚Ñ‚Ñ",
    outcome: "Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚",
    result: "Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ $",
    session: "Ð¡ÐµÑÑ–Ñ",
    emotionalState: "Ð•Ð¼Ð¾Ñ†Ñ–Ð¹Ð½Ð¸Ð¹ ÑÑ‚Ð°Ð½",
    setupQuality: "Ð¯ÐºÑ–ÑÑ‚ÑŒ ÑÐµÑ‚Ð°Ð¿Ñƒ (1-10)",
    executionRating: "ÐžÑ†Ñ–Ð½ÐºÐ° Ð²Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ (1-10)",
    confidence: "Ð’Ð¿ÐµÐ²Ð½ÐµÐ½Ñ–ÑÑ‚ÑŒ (1-10)",
    mistakes: "ÐŸÐ¾Ð¼Ð¸Ð»ÐºÐ¸",
    lessonsLearned: "Ð’Ð¸Ð²Ñ‡ÐµÐ½Ñ– ÑƒÑ€Ð¾ÐºÐ¸",
    addTrade: "Ð”Ð¾Ð´Ð°Ñ‚Ð¸ ÑƒÐ³Ð¾Ð´Ñƒ",
    calm: "Ð¡Ð¿Ð¾ÐºÑ–Ð¹Ð½Ð¸Ð¹",
    focused: "Ð¡Ñ„Ð¾ÐºÑƒÑÐ¾Ð²Ð°Ð½Ð¸Ð¹",
    confident: "Ð’Ð¿ÐµÐ²Ð½ÐµÐ½Ð¸Ð¹",
    tired: "Ð’Ñ‚Ð¾Ð¼Ð»ÐµÐ½Ð¸Ð¹",
    stressed: "ÐÐ°Ð¿Ñ€ÑƒÐ¶ÐµÐ½Ð¸Ð¹",
    impulsive: "Ð†Ð¼Ð¿ÑƒÐ»ÑŒÑÐ¸Ð²Ð½Ð¸Ð¹",
    historyEyebrow: "Ð†ÑÑ‚Ð¾Ñ€Ñ–Ñ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹",
    historyTitle: "Ð—Ð°Ñ€ÐµÑ”ÑÑ‚Ñ€Ð¾Ð²Ð°Ð½Ñ– ÑƒÐ³Ð¾Ð´Ð¸",
    filteredCount: (filtered, total) =>
      `${filtered} Ð²Ñ–Ð´Ñ„Ñ–Ð»ÑŒÑ‚Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ… ÑƒÐ³Ð¾Ð´ Ñ–Ð· ${total}`,
    noTrades: "Ð—Ð° Ñ†Ð¸Ð¼Ð¸ Ñ„Ñ–Ð»ÑŒÑ‚Ñ€Ð°Ð¼Ð¸ ÑƒÐ³Ð¾Ð´ Ð½Ðµ Ð·Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾.",
    date: "Ð”Ð°Ñ‚Ð°",
    trader: "Ð¢Ñ€ÐµÐ¹Ð´ÐµÑ€",
    symbol: "Ð¡Ð¸Ð¼Ð²Ð¾Ð»",
    sync: "Ð¡Ð¸Ð½Ñ…Ñ€.",
    direction: "ÐÐ°Ð¿Ñ€ÑÐ¼Ð¾Ðº",
    equity: "Equity",
    actions: "Ð”Ñ–Ñ—",
    edit: "Ð ÐµÐ´Ð°Ð³ÑƒÐ²Ð°Ñ‚Ð¸",
    delete: "Ð’Ð¸Ð´Ð°Ð»Ð¸Ñ‚Ð¸",
    manual: "Ð’Ñ€ÑƒÑ‡Ð½Ñƒ",
    mt5: "MT5",
    broker: "Ð‘Ñ€Ð¾ÐºÐµÑ€",
    unknownTrader: "Ð¢Ñ€ÐµÐ¹Ð´ÐµÑ€",
    notes: "ÐÐ¾Ñ‚Ð°Ñ‚ÐºÐ¸",
  },

  ru: {
    filteredPnl: "ÐžÑ‚Ñ„Ð¸Ð»ÑŒÑ‚Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ PnL",
    currentEquity: "Ð¢ÐµÐºÑƒÑ‰Ð°Ñ equity",
    winRate: "Win Rate",
    filteredTrades: "ÐžÑ‚Ñ„Ð¸Ð»ÑŒÑ‚Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ ÑÐ´ÐµÐ»ÐºÐ¸",
    imported: "Ð˜Ð¼Ð¿Ð¾Ñ€Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ",
    needsReview: "Ð¢Ñ€ÐµÐ±ÑƒÐµÑ‚ Ñ€ÐµÐ²ÑŒÑŽ",
    bestTrade: "Ð›ÑƒÑ‡ÑˆÐ°Ñ ÑÐ´ÐµÐ»ÐºÐ°",
    worstTrade: "Ð¥ÑƒÐ´ÑˆÐ°Ñ ÑÐ´ÐµÐ»ÐºÐ°",
    operationalRegister: "ÐžÐ¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¹ Ð¶ÑƒÑ€Ð½Ð°Ð»",
    title: "Ð¢Ð¾Ñ€Ð³Ð¾Ð²Ñ‹Ð¹ Ð´Ð½ÐµÐ²Ð½Ð¸Ðº",
    memberFilterActive: "Ð¤Ð¸Ð»ÑŒÑ‚Ñ€ ÑƒÑ‡Ð°ÑÑ‚Ð½Ð¸ÐºÐ° Ð°ÐºÑ‚Ð¸Ð²ÐµÐ½",
    viewingOnlyTradesOf: "Ð’Ñ‹ Ð¿Ñ€Ð¾ÑÐ¼Ð°Ñ‚Ñ€Ð¸Ð²Ð°ÐµÑ‚Ðµ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ ÑÐ´ÐµÐ»ÐºÐ¸ Ð¾Ñ‚",
    clearFilter: "ÐžÑ‡Ð¸ÑÑ‚Ð¸Ñ‚ÑŒ Ñ„Ð¸Ð»ÑŒÑ‚Ñ€",
    readOnlyMode: "Ð ÐµÐ¶Ð¸Ð¼ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð°",
    readOnlyTitle: "Ð­Ñ‚Ð¾Ñ‚ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ Ð² Ñ€ÐµÐ¶Ð¸Ð¼Ðµ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð°",
    readOnlyDescription:
      "Ð’Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¿Ñ€Ð¾ÑÐ¼Ð°Ñ‚Ñ€Ð¸Ð²Ð°Ñ‚ÑŒ Ð´Ð½ÐµÐ²Ð½Ð¸Ðº, Ð½Ð¾ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ ÑÐ¾Ð·Ð´Ð°Ð²Ð°Ñ‚ÑŒ, Ñ€ÐµÐ´Ð°ÐºÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð¸Ð»Ð¸ ÑƒÐ´Ð°Ð»ÑÑ‚ÑŒ ÑÐ´ÐµÐ»ÐºÐ¸.",
    account: "ÐÐºÐºÐ°ÑƒÐ½Ñ‚",
    readOnly: "Ð¢Ð¾Ð»ÑŒÐºÐ¾ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€",
    win: "Win",
    loss: "Loss",
    be: "BE",
    filtersEyebrow: "ÐžÐ¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ðµ Ñ„Ð¸Ð»ÑŒÑ‚Ñ€Ñ‹",
    filtersTitle: "ÐÐ½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹Ñ‚Ðµ ÑÐ²Ð¾Ð¸ ÑÐ´ÐµÐ»ÐºÐ¸",
    resetFilters: "Ð¡Ð±Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ Ñ„Ð¸Ð»ÑŒÑ‚Ñ€Ñ‹",
    allSymbols: "Ð’ÑÐµ ÑÐ¸Ð¼Ð²Ð¾Ð»Ñ‹",
    allOutcomes: "Ð’ÑÐµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹",
    allDirections: "Ð’ÑÐµ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ",
    allSources: "Ð’ÑÐµ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¸",
    allStatuses: "Ð’ÑÐµ ÑÑ‚Ð°Ñ‚ÑƒÑÑ‹",
    allTraders: "Ð’ÑÐµ Ñ‚Ñ€ÐµÐ¹Ð´ÐµÑ€Ñ‹",
    strategy: "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ",
    allStrategies: "â€” Ð’ÑÐµ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¸ â€”",
    noStrategy: "â€” Ð‘ÐµÐ· ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¸ â€”",
    applyFilters: "ÐŸÑ€Ð¸Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ Ñ„Ð¸Ð»ÑŒÑ‚Ñ€Ñ‹",
    newTradeEyebrow: "ÐÐ¾Ð²Ð°Ñ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ñ",
    newTradeTitle: "Ð”Ð¾Ð±Ð°Ð²Ð¸Ñ‚ÑŒ ÑÐ´ÐµÐ»ÐºÑƒ",
    openDate: "Ð”Ð°Ñ‚Ð° Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚Ð¸Ñ",
    openTime: "Ð’Ñ€ÐµÐ¼Ñ Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚Ð¸Ñ",
    reason: "ÐŸÑ€Ð¸Ñ‡Ð¸Ð½Ð°",
    instrument: "Ð˜Ð½ÑÑ‚Ñ€ÑƒÐ¼ÐµÐ½Ñ‚",
    amount: "Amount / Lot",
    openingPrice: "Ð¦ÐµÐ½Ð° Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚Ð¸Ñ",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Ð”Ð°Ñ‚Ð° Ð·Ð°ÐºÑ€Ñ‹Ñ‚Ð¸Ñ",
    closingPrice: "Ð¦ÐµÐ½Ð° Ð·Ð°ÐºÑ€Ñ‹Ñ‚Ð¸Ñ",
    outcome: "Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚",
    result: "Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ $",
    session: "Ð¡ÐµÑÑÐ¸Ñ",
    emotionalState: "Ð­Ð¼Ð¾Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ðµ ÑÐ¾ÑÑ‚Ð¾ÑÐ½Ð¸Ðµ",
    setupQuality: "ÐšÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾ ÑÐµÑ‚Ð°Ð¿Ð° (1-10)",
    executionRating: "ÐžÑ†ÐµÐ½ÐºÐ° Ð¸ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ (1-10)",
    confidence: "Ð£Ð²ÐµÑ€ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ (1-10)",
    mistakes: "ÐžÑˆÐ¸Ð±ÐºÐ¸",
    lessonsLearned: "Ð£Ñ€Ð¾ÐºÐ¸",
    addTrade: "Ð”Ð¾Ð±Ð°Ð²Ð¸Ñ‚ÑŒ ÑÐ´ÐµÐ»ÐºÑƒ",
    calm: "Ð¡Ð¿Ð¾ÐºÐ¾Ð¹Ð½Ñ‹Ð¹",
    focused: "Ð¡Ñ„Ð¾ÐºÑƒÑÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹",
    confident: "Ð£Ð²ÐµÑ€ÐµÐ½Ð½Ñ‹Ð¹",
    tired: "Ð£ÑÑ‚Ð°Ð²ÑˆÐ¸Ð¹",
    stressed: "Ð’ ÑÑ‚Ñ€ÐµÑÑÐµ",
    impulsive: "Ð˜Ð¼Ð¿ÑƒÐ»ÑŒÑÐ¸Ð²Ð½Ñ‹Ð¹",
    historyEyebrow: "Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¹",
    historyTitle: "Ð—Ð°Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ ÑÐ´ÐµÐ»ÐºÐ¸",
    filteredCount: (filtered, total) =>
      `${filtered} Ð¾Ñ‚Ñ„Ð¸Ð»ÑŒÑ‚Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… ÑÐ´ÐµÐ»Ð¾Ðº Ð¸Ð· ${total}`,
    noTrades: "ÐŸÐ¾ ÑÑ‚Ð¸Ð¼ Ñ„Ð¸Ð»ÑŒÑ‚Ñ€Ð°Ð¼ ÑÐ´ÐµÐ»ÐºÐ¸ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½Ñ‹.",
    date: "Ð”Ð°Ñ‚Ð°",
    trader: "Ð¢Ñ€ÐµÐ¹Ð´ÐµÑ€",
    symbol: "Ð¡Ð¸Ð¼Ð²Ð¾Ð»",
    sync: "Ð¡Ð¸Ð½Ñ…Ñ€.",
    direction: "ÐÐ°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ",
    equity: "Equity",
    actions: "Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ",
    edit: "Ð ÐµÐ´Ð°ÐºÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ",
    delete: "Ð£Ð´Ð°Ð»Ð¸Ñ‚ÑŒ",
    manual: "Ð’Ñ€ÑƒÑ‡Ð½ÑƒÑŽ",
    mt5: "MT5",
    broker: "Ð‘Ñ€Ð¾ÐºÐµÑ€",
    unknownTrader: "Ð¢Ñ€ÐµÐ¹Ð´ÐµÑ€",
    notes: "Ð—Ð°Ð¼ÐµÑ‚ÐºÐ¸",
  },

  es: {
    filteredPnl: "PnL filtrado",
    currentEquity: "Equity actual",
    winRate: "Win Rate",
    filteredTrades: "Trades filtrados",
    imported: "Importados",
    needsReview: "Necesita revisiÃ³n",
    bestTrade: "Mejor trade",
    worstTrade: "Peor trade",
    operationalRegister: "Registro operativo",
    title: "Diario de trading",
    memberFilterActive: "Filtro de miembro activo",
    viewingOnlyTradesOf: "EstÃ¡s viendo solo los trades de",
    clearFilter: "Limpiar filtro",
    readOnlyMode: "Modo solo lectura",
    readOnlyTitle: "Esta cuenta estÃ¡ en modo visualizaciÃ³n",
    readOnlyDescription:
      "Puedes consultar el diario, pero no puedes crear, editar o eliminar trades.",
    account: "Cuenta",
    readOnly: "Solo lectura",
    win: "Win",
    loss: "Loss",
    be: "BE",
    filtersEyebrow: "Filtros operativos",
    filtersTitle: "Analiza tus trades",
    resetFilters: "Restablecer filtros",
    allSymbols: "Todos los sÃ­mbolos",
    allOutcomes: "Todos los resultados",
    allDirections: "Todas las direcciones",
    allSources: "Todas las fuentes",
    allStatuses: "Todos los estados",
    allTraders: "Todos los traders",
    strategy: "Estrategia",
    allStrategies: "â€” Todas las estrategias â€”",
    noStrategy: "â€” Sin estrategia â€”",
    applyFilters: "Aplicar filtros",
    newTradeEyebrow: "Nueva operaciÃ³n",
    newTradeTitle: "AÃ±adir trade",
    openDate: "Fecha de apertura",
    openTime: "Hora de apertura",
    reason: "Motivo",
    instrument: "Instrumento",
    amount: "Amount / Lot",
    openingPrice: "Precio de apertura",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Fecha de cierre",
    closingPrice: "Precio de cierre",
    outcome: "Resultado",
    result: "Resultado $",
    session: "SesiÃ³n",
    emotionalState: "Estado emocional",
    setupQuality: "Calidad del setup (1-10)",
    executionRating: "EjecuciÃ³n (1-10)",
    confidence: "Confianza (1-10)",
    mistakes: "Errores",
    lessonsLearned: "Lecciones aprendidas",
    addTrade: "AÃ±adir trade",
    calm: "Calmo",
    focused: "Enfocado",
    confident: "Confiado",
    tired: "Cansado",
    stressed: "Estresado",
    impulsive: "Impulsivo",
    historyEyebrow: "Historial de operaciones",
    historyTitle: "Trades registrados",
    filteredCount: (filtered, total) =>
      `${filtered} trades filtrados de ${total} totales`,
    noTrades: "No se encontraron trades con estos filtros.",
    date: "Fecha",
    trader: "Trader",
    symbol: "SÃ­mbolo",
    sync: "Sync",
    direction: "DirecciÃ³n",
    equity: "Equity",
    actions: "Acciones",
    edit: "Editar",
    delete: "Eliminar",
    manual: "Manual",
    mt5: "MT5",
    broker: "Broker",
    unknownTrader: "Trader",
    notes: "Notas",
  },

  fr: {
    filteredPnl: "PnL filtrÃ©",
    currentEquity: "Equity actuelle",
    winRate: "Win Rate",
    filteredTrades: "Trades filtrÃ©s",
    imported: "ImportÃ©s",
    needsReview: "Ã€ revoir",
    bestTrade: "Meilleur trade",
    worstTrade: "Pire trade",
    operationalRegister: "Registre opÃ©rationnel",
    title: "Journal de trading",
    memberFilterActive: "Filtre membre actif",
    viewingOnlyTradesOf: "Vous consultez uniquement les trades de",
    clearFilter: "Effacer le filtre",
    readOnlyMode: "Mode lecture seule",
    readOnlyTitle: "Ce compte est en mode consultation",
    readOnlyDescription:
      "Vous pouvez consulter le journal, mais vous ne pouvez pas crÃ©er, modifier ou supprimer des trades.",
    account: "Compte",
    readOnly: "Lecture seule",
    win: "Win",
    loss: "Loss",
    be: "BE",
    filtersEyebrow: "Filtres opÃ©rationnels",
    filtersTitle: "Analysez vos trades",
    resetFilters: "RÃ©initialiser les filtres",
    allSymbols: "Tous les symboles",
    allOutcomes: "Tous les rÃ©sultats",
    allDirections: "Toutes les directions",
    allSources: "Toutes les sources",
    allStatuses: "Tous les statuts",
    allTraders: "Tous les traders",
    strategy: "StratÃ©gie",
    allStrategies: "â€” Toutes les stratÃ©gies â€”",
    noStrategy: "â€” Aucune stratÃ©gie â€”",
    applyFilters: "Appliquer les filtres",
    newTradeEyebrow: "Nouvelle opÃ©ration",
    newTradeTitle: "Ajouter un trade",
    openDate: "Date dâ€™ouverture",
    openTime: "Heure dâ€™ouverture",
    reason: "Raison",
    instrument: "Instrument",
    amount: "Amount / Lot",
    openingPrice: "Prix dâ€™ouverture",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Date de clÃ´ture",
    closingPrice: "Prix de clÃ´ture",
    outcome: "RÃ©sultat",
    result: "RÃ©sultat $",
    session: "Session",
    emotionalState: "Ã‰tat Ã©motionnel",
    setupQuality: "QualitÃ© du setup (1-10)",
    executionRating: "ExÃ©cution (1-10)",
    confidence: "Confiance (1-10)",
    mistakes: "Erreurs",
    lessonsLearned: "LeÃ§ons apprises",
    addTrade: "Ajouter un trade",
    calm: "Calme",
    focused: "ConcentrÃ©",
    confident: "Confiant",
    tired: "FatiguÃ©",
    stressed: "StressÃ©",
    impulsive: "Impulsif",
    historyEyebrow: "Historique des opÃ©rations",
    historyTitle: "Trades enregistrÃ©s",
    filteredCount: (filtered, total) =>
      `${filtered} trades filtrÃ©s sur ${total} au total`,
    noTrades: "Aucun trade trouvÃ© avec ces filtres.",
    date: "Date",
    trader: "Trader",
    symbol: "Symbole",
    sync: "Sync",
    direction: "Direction",
    equity: "Equity",
    actions: "Actions",
    edit: "Modifier",
    delete: "Supprimer",
    manual: "Manuel",
    mt5: "MT5",
    broker: "Broker",
    unknownTrader: "Trader",
    notes: "Notes",
  },

  de: {
    filteredPnl: "Gefilterter PnL",
    currentEquity: "Aktuelle Equity",
    winRate: "Win Rate",
    filteredTrades: "Gefilterte Trades",
    imported: "Importiert",
    needsReview: "Review nÃ¶tig",
    bestTrade: "Bester Trade",
    worstTrade: "Schlechtester Trade",
    operationalRegister: "Operatives Register",
    title: "Trading-Tagebuch",
    memberFilterActive: "Mitgliederfilter aktiv",
    viewingOnlyTradesOf: "Du siehst nur Trades von",
    clearFilter: "Filter lÃ¶schen",
    readOnlyMode: "Nur-Lese-Modus",
    readOnlyTitle: "Dieses Konto ist im Ansichtsmodus",
    readOnlyDescription:
      "Du kannst das Tagebuch ansehen, aber keine Trades erstellen, bearbeiten oder lÃ¶schen.",
    account: "Konto",
    readOnly: "Nur Lesen",
    win: "Win",
    loss: "Loss",
    be: "BE",
    filtersEyebrow: "Operative Filter",
    filtersTitle: "Analysiere deine Trades",
    resetFilters: "Filter zurÃ¼cksetzen",
    allSymbols: "Alle Symbole",
    allOutcomes: "Alle Ergebnisse",
    allDirections: "Alle Richtungen",
    allSources: "Alle Quellen",
    allStatuses: "Alle Status",
    allTraders: "Alle Trader",
    strategy: "Strategie",
    allStrategies: "â€” Alle Strategien â€”",
    noStrategy: "â€” Keine Strategie â€”",
    applyFilters: "Filter anwenden",
    newTradeEyebrow: "Neue Operation",
    newTradeTitle: "Trade hinzufÃ¼gen",
    openDate: "ErÃ¶ffnungsdatum",
    openTime: "ErÃ¶ffnungszeit",
    reason: "Grund",
    instrument: "Instrument",
    amount: "Amount / Lot",
    openingPrice: "ErÃ¶ffnungspreis",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Schlussdatum",
    closingPrice: "Schlusspreis",
    outcome: "Ergebnis",
    result: "Ergebnis $",
    session: "Session",
    emotionalState: "Emotionaler Zustand",
    setupQuality: "Setup-QualitÃ¤t (1-10)",
    executionRating: "Execution Rating (1-10)",
    confidence: "Confidence (1-10)",
    mistakes: "Fehler",
    lessonsLearned: "Gelernte Lektionen",
    addTrade: "Trade hinzufÃ¼gen",
    calm: "Ruhig",
    focused: "Fokussiert",
    confident: "Selbstbewusst",
    tired: "MÃ¼de",
    stressed: "Gestresst",
    impulsive: "Impulsiv",
    historyEyebrow: "Operationshistorie",
    historyTitle: "Registrierte Trades",
    filteredCount: (filtered, total) =>
      `${filtered} gefilterte Trades von ${total} insgesamt`,
    noTrades: "Keine Trades mit diesen Filtern gefunden.",
    date: "Datum",
    trader: "Trader",
    symbol: "Symbol",
    sync: "Sync",
    direction: "Richtung",
    equity: "Equity",
    actions: "Aktionen",
    edit: "Bearbeiten",
    delete: "LÃ¶schen",
    manual: "Manuell",
    mt5: "MT5",
    broker: "Broker",
    unknownTrader: "Trader",
    notes: "Notizen",
  },
};

function getTradeSourceLabel(
  source: string | null | undefined,
  labels: DiaryLabels
) {
  if (source === "mt5") {
    return labels.mt5;
  }

  if (source === "broker") {
    return labels.broker;
  }

  return labels.manual;
}

function getTradeSourceClass(
  source?: string | null
) {
  if (source === "mt5") {
    return "border-accent-bright/20 bg-accent-bright/10 text-accent-bright";
  }

  if (source === "broker") {
    return "border-blue-500/20 bg-blue-500/10 text-blue-300";
  }

  return "border-white/10 bg-white/10 text-gray-300";
}

function getOutcomeLabel(
  outcome: string | null,
  labels: DiaryLabels
) {
  if (outcome === "win") {
    return labels.win;
  }

  if (outcome === "loss") {
    return labels.loss;
  }

  if (outcome === "be") {
    return labels.be;
  }

  return "-";
}

function getOutcomeClass(outcome: string | null) {
  if (outcome === "win") {
    return "bg-accent/10 text-accent";
  }

  if (outcome === "loss") {
    return "bg-red-500/10 text-red-400";
  }

  if (outcome === "be") {
    return "bg-yellow-500/10 text-yellow-400";
  }

  return "bg-white/10 text-gray-400";
}

export default async function DiaryPage({
  params,
  searchParams,
}: {
  params: Promise<{
    accountId: string;
  }>;

  searchParams: Promise<{
    symbol?: string;
    outcome?: string;
    direction?: string;
    strategyId?: string;
    trader?: string;
    from?: string;
    to?: string;
    member?: string;
    source?: string;
    needsReview?: string;
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

  const { period, ref } = parseScopeParams({
    period: filters.period,
    ref: filters.ref,
  });

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      appLanguage: true,
      timezone: true,
    },
  });

  if (!currentUser) {
    redirect("/login");
  }

  const language = normalizeAppLanguage(
    currentUser.appLanguage
  );

  const t = diaryLabels[language] ?? diaryLabels.en;

  const selectedTraderId =
    filters.trader || filters.member;

  const selectedMember = selectedTraderId
    ? await prisma.user.findUnique({
      where: {
        id: selectedTraderId,
      },
      select: {
        username: true,
        name: true,
      },
    })
    : null;

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

  const isManager =
    membership.role === "MANAGER";

  const canCreateTrades = Boolean(
    isManager || membership.canCreateTrades
  );

  const canEditTrades = Boolean(
    isManager || membership.canEditTrades
  );

  const canDeleteTrades = Boolean(
    isManager || membership.canDeleteTrades
  );

  const isReadOnly =
    !canCreateTrades &&
    !canEditTrades &&
    !canDeleteTrades;

  const account = membership.tradingAccount;
  const currency = account.currency || "USD";

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

  const where: Prisma.TradeWhereInput = {
    tradingAccountId: accountId,
  };

  if (filters.symbol) {
    where.symbol = filters.symbol;
  }

  if (filters.outcome) {
    where.outcome = filters.outcome;
  }

  if (filters.direction) {
    where.direction = filters.direction;
  }

  if (
    filters.source &&
    ["manual", "mt5", "broker"].includes(
      filters.source
    )
  ) {
    where.source = filters.source;
  }

  if (filters.needsReview === "true") {
    where.needsReview = true;
  }

  if (selectedTraderId) {
    where.createdById = selectedTraderId;
  }

  if (filters.strategyId) {
    where.strategyId = filters.strategyId;
  }

  if (filters.from || filters.to) {
    where.openDate = {
      ...(filters.from
        ? {
          gte: new Date(filters.from),
        }
        : {}),
      ...(filters.to
        ? {
          lte: new Date(filters.to),
        }
        : {}),
    };
  }

  const trades = await prisma.trade.findMany({
    where,
    include: {
      createdBy: true,
    },
    orderBy: [
      {
        openDate: "desc",
      },
      {
        id: "desc",
      },
    ],
  });

  const allTrades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
    },
    orderBy: [
      {
        openDate: "desc",
      },
      {
        id: "desc",
      },
    ],
  });

  const dateRange = getPeriodRange(
    period,
    ref,
    currentUser?.timezone ?? undefined
  );

  const periodTrades = dateRange
    ? trades.filter(
        (trade) =>
          trade.openDate >= dateRange.gte &&
          trade.openDate < dateRange.lte
      )
    : trades;

  const periodSuffix = getPeriodSuffix(
    period,
    ref,
    language
  );

  const symbols = Array.from(
    new Set(allTrades.map((trade) => trade.symbol))
  ).sort();

  const strategies = await prisma.strategy.findMany({
    where: { tradingAccountId: accountId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const totalTrades = periodTrades.length;

  const importedTrades = periodTrades.filter(
    (trade) => trade.source !== "manual"
  ).length;

  const needsReviewTrades = periodTrades.filter(
    (trade) => trade.needsReview
  ).length;

  const wins = periodTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const totalPnl = periodTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const winRate =
    totalTrades > 0
      ? (wins / totalTrades) * 100
      : 0;

  const bestTrade =
    periodTrades.length > 0
      ? Math.max(
        ...periodTrades.map(
          (trade) => trade.resultUsd || 0
        )
      )
      : 0;

  const worstTrade =
    periodTrades.length > 0
      ? Math.min(
        ...periodTrades.map(
          (trade) => trade.resultUsd || 0
        )
      )
      : 0;

  const hasActiveFilters =
    Boolean(filters.symbol) ||
    Boolean(filters.outcome) ||
    Boolean(filters.direction) ||
    Boolean(filters.source) ||
    Boolean(filters.needsReview) ||
    Boolean(selectedTraderId) ||
    Boolean(filters.strategyId) ||
    Boolean(filters.from) ||
    Boolean(filters.to) ||
    period !== "all";

  const keyMetrics = [
    {
      label: `${t.filteredPnl}${periodSuffix}`,
      value: formatCurrencyByLanguage(totalPnl, currency, language),
      tone: totalPnl >= 0 ? "text-green-400" : "text-red-400",
    },
    {
      label: `${t.winRate}${periodSuffix}`,
      value: `${winRate.toFixed(2)}%`,
      tone: "text-green-400",
    },
    {
      label: `${t.filteredTrades}${periodSuffix}`,
      value: totalTrades,
      tone: "text-white",
    },
    {
      label: `${t.needsReview}${periodSuffix}`,
      value: needsReviewTrades,
      tone: "text-yellow-300",
    },
  ];

  const secondaryMetrics = [
    {
      label: `${t.imported}${periodSuffix}`,
      value: importedTrades,
      tone: "text-accent-bright",
    },
    {
      label: `${t.bestTrade}${periodSuffix}`,
      value: formatCurrencyByLanguage(bestTrade, currency, language),
      tone: "text-green-400",
    },
    {
      label: `${t.worstTrade}${periodSuffix}`,
      value: formatCurrencyByLanguage(worstTrade, currency, language),
      tone: "text-red-400",
    },
  ];

  const averageExecution =
    periodTrades.length > 0
      ? Math.round(
        periodTrades.reduce(
          (acc, trade) =>
            acc + (trade.executionRating || 0),
          0
        ) / periodTrades.length
      )
      : 0;

  const averageConfidence =
    periodTrades.length > 0
      ? Math.round(
        periodTrades.reduce(
          (acc, trade) =>
            acc + (trade.confidence || 0),
          0
        ) / periodTrades.length
      )
      : 0;

  const highQualityTrades = periodTrades.filter(
    (trade) =>
      (trade.setupQuality || 0) >= 8 &&
      (trade.executionRating || 0) >= 8
  ).length;

  const weakExecutionTrades = periodTrades.filter(
    (trade) =>
      (trade.executionRating || 0) > 0 &&
      (trade.executionRating || 0) <= 4
  ).length;

  const emotionalTrades = periodTrades.filter(
    (trade) =>
      trade.emotionalState &&
      trade.emotionalState.length > 0
  ).length;

  const disciplineScore =
    periodTrades.length > 0
      ? Math.max(
        0,
        Math.min(
          100,
          Math.round(
            averageExecution * 4 +
            averageConfidence * 3 +
            (highQualityTrades /
              Math.max(periodTrades.length, 1)) *
            30 -
            weakExecutionTrades * 2
          )
        )
      )
      : 0;

  const setupStats = periodTrades.reduce(
    (acc, trade) => {
      const setup = trade.strategy || "Unknown";

      if (!acc[setup]) {
        acc[setup] = {
          count: 0,
          wins: 0,
        };
      }

      acc[setup].count += 1;

      if (trade.outcome === "win") {
        acc[setup].wins += 1;
      }

      return acc;
    },
    {} as Record<
      string,
      {
        count: number;
        wins: number;
      }
    >
  );

  const bestSetup =
    Object.entries(setupStats).sort((a, b) => {
      const winRateA =
        a[1].count > 0
          ? a[1].wins / a[1].count
          : 0;

      const winRateB =
        b[1].count > 0
          ? b[1].wins / b[1].count
          : 0;

      return winRateB - winRateA;
    })[0]?.[0] || "Not enough data";

  const scopeMembers = isSharedAccount
    ? accountMembers.map((m) => ({
        id: m.user.id,
        name: m.user.name ?? null,
        username: m.user.username,
        image: m.user.image ?? null,
      }))
    : undefined;

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {t.operationalRegister}
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            {t.title}
          </h1>

          {selectedMember && (
            <div className="mt-4 rounded-3xl border border-accent-bright/20 bg-accent-bright/10 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-bright">
                {t.memberFilterActive}
              </p>

              <h2 className="mt-2 text-xl font-black text-white">
                {t.viewingOnlyTradesOf}{" "}
                {selectedMember.name ||
                  selectedMember.username}
              </h2>

              <Link
                href={`/accounts/${accountId}/diary`}
                className="mt-4 inline-flex rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/[0.05]"
              >
                {t.clearFilter}
              </Link>
            </div>
          )}

          {isReadOnly && (
            <div className="mt-4 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-yellow-300">
                {t.readOnlyMode}
              </p>

              <h2 className="mt-2 text-xl font-black text-white">
                {t.readOnlyTitle}
              </h2>

              <p className="mt-3 text-sm text-gray-300">
                {t.readOnlyDescription}
              </p>
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-sm text-gray-500">
              {t.account}: {account.name}
            </p>

            {isReadOnly && (
              <div className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
                {t.readOnly}
              </div>
            )}
          </div>
        </div>

        {canCreateTrades && (
          <Link
            href="#new-trade-form"
            className="shrink-0 rounded-2xl bg-accent px-5 py-3 font-bold text-white transition hover:bg-accent-bright"
          >
            + {t.newTradeTitle}
          </Link>
        )}
      </div>

      <ScopeBar
        members={scopeMembers}
        selectedMemberId={selectedTraderId ?? undefined}
        currentPeriod={period}
        currentRef={ref}
        appLanguage={language}
        accountId={accountId}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {keyMetrics.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-sm text-gray-400">
              {stat.label}
            </p>

            <h2
              className={`mt-2 text-2xl font-bold ${stat.tone}`}
            >
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      <ExecutionInsights
        disciplineScore={disciplineScore}
        averageExecution={averageExecution}
        averageConfidence={averageConfidence}
        highQualityTrades={highQualityTrades}
        weakExecutionTrades={weakExecutionTrades}
        emotionalTrades={emotionalTrades}
        bestSetup={bestSetup}
        appLanguage={language}
      />


      <form
        action={`/accounts/${accountId}/diary`}
        className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              {t.filtersEyebrow}
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {t.filtersTitle}
            </h2>
          </div>

          {hasActiveFilters && (
            <Link
              href={`/accounts/${accountId}/diary`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300 hover:bg-white/[0.06]"
            >
              {t.resetFilters}
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-9">
          <select
            name="symbol"
            defaultValue={filters.symbol || ""}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          >
            <option value="">{t.allSymbols}</option>

            {symbols.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>

          <select
            name="outcome"
            defaultValue={filters.outcome || ""}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          >
            <option value="">{t.allOutcomes}</option>
            <option value="win">{t.win}</option>
            <option value="loss">{t.loss}</option>
            <option value="be">{t.be}</option>
          </select>

          <select
            name="direction"
            defaultValue={filters.direction || ""}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          >
            <option value="">{t.allDirections}</option>
            <option value="LONG">LONG</option>
            <option value="SHORT">SHORT</option>
          </select>

          <select
            name="source"
            defaultValue={filters.source || ""}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          >
            <option value="">{t.allSources}</option>
            <option value="manual">{t.manual}</option>
            <option value="mt5">{t.mt5}</option>
            <option value="broker">{t.broker}</option>
          </select>

          <select
            name="needsReview"
            defaultValue={filters.needsReview || ""}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          >
            <option value="">{t.allStatuses}</option>
            <option value="true">{t.needsReview}</option>
          </select>

          <select
            name="strategyId"
            defaultValue={filters.strategyId || ""}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          >
            <option value="">{t.allStrategies}</option>
            {strategies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            name="from"
            type="date"
            defaultValue={filters.from || ""}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <input
            name="to"
            type="date"
            defaultValue={filters.to || ""}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <button
            type="submit"
            className="rounded-2xl bg-accent p-4 font-bold text-white transition hover:bg-accent-bright sm:col-span-2 xl:col-span-9"
          >
            {t.applyFilters}
          </button>
        </div>
      </form>

      {canCreateTrades && (
        <form
          id="new-trade-form"
          action={createAccountTrade.bind(null, accountId)}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
        >
          <div className="mb-6">
            <p className="text-sm text-gray-400">
              {t.newTradeEyebrow}
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {t.newTradeTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <input
              name="openDate"
              type="date"
              aria-label={t.openDate}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
              required
            />

            <input
              name="openTime"
              type="time"
              aria-label={t.openTime}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <input
              name="reason"
              placeholder={t.reason}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <select
              name="strategyId"
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            >
              <option value="">{t.noStrategy}</option>
              {strategies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              name="symbol"
              required
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            >
              <option value="">{t.instrument}</option>

              <optgroup label="Forex">
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="USDJPY">USDJPY</option>
                <option value="AUDUSD">AUDUSD</option>
                <option value="USDCAD">USDCAD</option>
                <option value="USDCHF">USDCHF</option>
                <option value="NZDUSD">NZDUSD</option>
              </optgroup>

              <optgroup label="Gold & Commodities">
                <option value="XAUUSD">XAUUSD</option>
                <option value="XAGUSD">XAGUSD</option>
                <option value="USOIL">USOIL</option>
                <option value="UKOIL">UKOIL</option>
              </optgroup>

              <optgroup label="Crypto">
                <option value="BTCUSD">BTCUSD</option>
                <option value="ETHUSD">ETHUSD</option>
                <option value="SOLUSD">SOLUSD</option>
                <option value="XRPUSD">XRPUSD</option>
              </optgroup>

              <optgroup label="Indices">
                <option value="NASDAQ">NASDAQ</option>
                <option value="S&P500">S&P500</option>
                <option value="DAX40">DAX40</option>
                <option value="DJI">DJI</option>
              </optgroup>
            </select>

            <select
              name="direction"
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            >
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
            </select>

            <input
              name="amount"
              placeholder={t.amount}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <input
              name="openingPrice"
              placeholder={t.openingPrice}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <input
              name="stopLoss"
              placeholder={t.stopLoss}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <input
              name="takeProfit"
              placeholder={t.takeProfit}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <input
              name="riskReward"
              placeholder={t.riskReward}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <input
              name="closeDate"
              type="date"
              aria-label={t.closeDate}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <input
              name="closingPrice"
              placeholder={t.closingPrice}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <select
              name="outcome"
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            >
              <option value="">{t.outcome}</option>
              <option value="win">{t.win}</option>
              <option value="loss">{t.loss}</option>
              <option value="be">{t.be}</option>
            </select>

            <input
              name="resultUsd"
              placeholder={t.result}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <select
              name="session"
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            >
              <option value="">{t.session}</option>
              <option value="ASIA">Asia</option>
              <option value="LONDON">London</option>
              <option value="NEW_YORK">New York</option>
              <option value="OVERLAP">Overlap</option>
            </select>

            <select
              name="emotionalState"
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            >
              <option value="">{t.emotionalState}</option>
              <option value="CALM">{t.calm}</option>
              <option value="FOCUSED">{t.focused}</option>
              <option value="CONFIDENT">{t.confident}</option>
              <option value="TIRED">{t.tired}</option>
              <option value="STRESSED">{t.stressed}</option>
              <option value="IMPULSIVE">
                {t.impulsive}
              </option>
            </select>

            <input
              name="setupQuality"
              type="number"
              min="1"
              max="10"
              placeholder={t.setupQuality}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <input
              name="executionRating"
              type="number"
              min="1"
              max="10"
              placeholder={t.executionRating}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <input
              name="confidence"
              type="number"
              min="1"
              max="10"
              placeholder={t.confidence}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

            <textarea
              name="mistakes"
              placeholder={t.mistakes}
              className="min-h-[110px] rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40 sm:col-span-2"
            />

            <textarea
              name="lessonsLearned"
              placeholder={t.lessonsLearned}
              className="min-h-[110px] rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40 sm:col-span-2"
            />

            <button
              type="submit"
              className="rounded-2xl bg-accent p-4 font-bold text-white transition hover:bg-accent-bright sm:col-span-2 xl:col-span-4"
            >
              {t.addTrade}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {secondaryMetrics.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-sm text-gray-400">
              {stat.label}
            </p>

            <h2
              className={`mt-2 text-2xl font-bold ${stat.tone}`}
            >
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {t.historyEyebrow}
          </p>

          <h2 className="text-2xl font-bold">
            {t.historyTitle}
          </h2>
        </div>

        <p className="text-sm text-gray-500">
          {t.filteredCount(periodTrades.length, allTrades.length)}
        </p>
      </div>

      <div className="hidden overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03] lg:block">
        <table className="w-full border-collapse">
          <thead className="bg-white/5 text-left text-sm text-gray-400">
            <tr>
              <th className="p-4">{t.date}</th>
              {isSharedAccount && (
                <th className="p-4">{t.trader}</th>
              )}
              <th className="p-4">{t.symbol}</th>
              <th className="p-4">{t.sync}</th>
              <th className="p-4">{t.direction}</th>
              <th className="p-4">{t.outcome}</th>
              <th className="p-4">{t.result}</th>
              <th className="p-4">{t.equity}</th>
              <th className="p-4">{t.strategy}</th>
              <th className="p-4">R:R</th>
              <th className="p-4">{t.actions}</th>
            </tr>
          </thead>

          <tbody>
            {periodTrades.map((trade) => (
              <tr
                key={trade.id}
                className="border-t border-white/10 hover:bg-white/[0.02]"
              >
                <td className="p-4">
                  <div className="font-semibold">
                    {formatDateByLanguage(
                      trade.openDate,
                      language
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    {trade.openTime || "-"}
                  </div>
                </td>

                {isSharedAccount && (
                  <td className="p-4">
                    <span className="rounded-xl bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                      {trade.createdBy?.name ||
                        trade.createdBy?.username ||
                        t.unknownTrader}
                    </span>
                  </td>
                )}

                <td className="p-4 font-semibold">
                  {trade.symbol}
                </td>

                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    <span
                      className={`w-fit rounded-xl border px-3 py-1 text-xs font-bold ${getTradeSourceClass(
                        trade.source
                      )}`}
                    >
                      {getTradeSourceLabel(
                        trade.source,
                        t
                      )}
                    </span>

                    {trade.needsReview && (
                      <span className="w-fit rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-yellow-300">
                        {t.needsReview}
                      </span>
                    )}
                  </div>
                </td>

                <td
                  className={`p-4 font-semibold ${trade.direction === "LONG"
                      ? "text-green-400"
                      : "text-red-400"
                    }`}
                >
                  {trade.direction}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-xl px-3 py-1 text-sm font-semibold ${getOutcomeClass(
                      trade.outcome
                    )}`}
                  >
                    {getOutcomeLabel(trade.outcome, t)}
                  </span>
                </td>

                <td
                  className={`p-4 font-bold ${(trade.resultUsd || 0) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                    }`}
                >
                  {formatCurrencyByLanguage(
                    trade.resultUsd || 0,
                    currency,
                    language
                  )}
                </td>

                <td className="p-4 font-semibold">
                  {formatCurrencyByLanguage(
                    trade.equity || account.initialBalance,
                    currency,
                    language
                  )}
                </td>

                <td className="p-4 text-gray-300">
                  {trade.strategy || "-"}
                </td>

                <td className="p-4 text-gray-300">
                  {trade.riskReward || "-"}
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/accounts/${accountId}/diary/${trade.id}/replay`}
                      className="inline-flex items-center justify-center rounded-xl bg-indigo-500/10 p-2 text-indigo-400 hover:bg-indigo-500/20"
                      title="Replay"
                    >
                      <PlayCircle size={15} />
                    </Link>
                    {canEditTrades || canDeleteTrades ? (
                    <div className="flex gap-3">
                      {canEditTrades && (
                        <Link
                          href={`/accounts/${accountId}/diary/${trade.id}/edit`}
                          className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                        >
                          {t.edit}
                        </Link>
                      )}

                      {canDeleteTrades && (
                        <form
                          action={deleteAccountTrade.bind(
                            null,
                            accountId,
                            trade.id
                          )}
                        >
                          <button
                            type="submit"
                            className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                          >
                            {t.delete}
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    <span className="rounded-xl bg-yellow-500/10 px-3 py-2 text-xs font-semibold text-yellow-300">
                      {t.readOnly}
                    </span>
                  )}
                  </div>
                </td>
              </tr>
            ))}

            {periodTrades.length === 0 && (
              <tr>
                <td
                  colSpan={isSharedAccount ? 11 : 10}
                  className="p-8 text-center text-gray-500"
                >
                  {t.noTrades}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 lg:hidden">
        {periodTrades.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center text-gray-500">
            {t.noTrades}
          </div>
        ) : (
          periodTrades.map((trade) => (
            <div
              key={trade.id}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:border-accent-bright/20 hover:bg-white/[0.06]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_6%,transparent),transparent_35%)]" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                      {formatDateByLanguage(
                        trade.openDate,
                        language
                      )} {trade.openTime || ""}
                    </p>

                    <h3 className="mt-2 truncate text-2xl font-black text-white">
                      {trade.symbol}
                    </h3>

                    {isSharedAccount && (
                      <p className="mt-1 text-sm text-gray-500">
                        {t.trader}: {trade.createdBy?.name || trade.createdBy?.username || t.unknownTrader}
                      </p>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-2xl px-3 py-2 text-xs font-black ${trade.direction === "LONG"
                        ? "bg-accent/10 text-accent"
                        : "bg-red-500/10 text-red-400"
                      }`}
                  >
                    {trade.direction}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-black/20 p-3">
                    <p className="text-xs text-gray-500">
                      {t.outcome}
                    </p>

                    <p className="mt-1 font-bold text-white">
                      {getOutcomeLabel(trade.outcome, t)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/20 p-3">
                    <p className="text-xs text-gray-500">
                      {t.result}
                    </p>

                    <p
                      className={`mt-1 font-bold ${(trade.resultUsd || 0) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                        }`}
                    >
                      {formatCurrencyByLanguage(
                        trade.resultUsd || 0,
                        currency,
                        language
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/20 p-3">
                    <p className="text-xs text-gray-500">
                      {t.equity}
                    </p>

                    <p className="mt-1 font-bold text-white">
                      {formatCurrencyByLanguage(
                        trade.equity || account.initialBalance,
                        currency,
                        language
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/20 p-3">
                    <p className="text-xs text-gray-500">
                      {t.sync}
                    </p>

                    <p className="mt-1 font-bold text-accent-bright">
                      {getTradeSourceLabel(trade.source, t)}
                    </p>
                  </div>
                </div>

                {(trade.setupQuality ||
                  trade.executionRating ||
                  trade.confidence) && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {trade.setupQuality && (
                        <div className="rounded-2xl bg-black/20 p-3">
                          <p className="text-xs text-gray-500">
                            Setup
                          </p>

                          <p className="mt-1 font-bold text-accent">
                            {trade.setupQuality}/10
                          </p>
                        </div>
                      )}

                      {trade.executionRating && (
                        <div className="rounded-2xl bg-black/20 p-3">
                          <p className="text-xs text-gray-500">
                            Execution
                          </p>

                          <p className="mt-1 font-bold text-yellow-300">
                            {trade.executionRating}/10
                          </p>
                        </div>
                      )}

                      {trade.confidence && (
                        <div className="rounded-2xl bg-black/20 p-3">
                          <p className="text-xs text-gray-500">
                            Confidence
                          </p>

                          <p className="mt-1 font-bold text-blue-400">
                            {trade.confidence}/10
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                {trade.strategy && (
                  <p className="mt-4 rounded-2xl bg-black/20 p-3 text-sm text-gray-400">
                    {t.strategy}: {trade.strategy}
                  </p>
                )}

                {trade.notes && (
                  <p className="mt-4 rounded-2xl bg-black/20 p-3 text-sm text-gray-400">
                    {trade.notes}
                  </p>
                )}

                {trade.mistakes && (
                  <div className="mt-4 rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-400">
                      {t.mistakes}
                    </p>

                    <p className="mt-2 text-sm text-gray-300">
                      {trade.mistakes}
                    </p>
                  </div>
                )}

                {trade.lessonsLearned && (
                  <div className="mt-4 rounded-2xl border border-accent/10  param($m) $m.Value -replace 'green-500', 'accent'  p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {t.lessonsLearned}
                    </p>

                    <p className="mt-2 text-sm text-gray-300">
                      {trade.lessonsLearned}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/accounts/${accountId}/diary/${trade.id}/replay`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 px-3 py-3 text-sm text-indigo-400 hover:bg-indigo-500/20"
                  >
                    <PlayCircle size={14} />
                    Replay
                  </Link>
                  {canEditTrades && (
                    <Link
                      href={`/accounts/${accountId}/diary/${trade.id}/edit`}
                      className="flex-1 rounded-xl bg-white/10 px-3 py-3 text-center text-sm hover:bg-white/20"
                    >
                      {t.edit}
                    </Link>
                  )}
                  {canDeleteTrades && (
                    <form
                      action={deleteAccountTrade.bind(
                        null,
                        accountId,
                        trade.id
                      )}
                      className="flex-1"
                    >
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-red-500/10 px-3 py-3 text-sm text-red-400 hover:bg-red-500/20"
                      >
                        {t.delete}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}







