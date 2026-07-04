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
import Card from "@/components/ui/Card";
import ListRow from "@/components/ui/ListRow";
import SignatureEdge from "@/components/ui/SignatureEdge";
import {
  parseScopeParams,
  getPeriodRange,
  getPeriodSuffix,
} from "@/lib/scope";
import { pageDensity } from "@/lib/page-density";

import { deleteAccountTrade } from "./actions";

// CTA Fulmine: REBRAND_BLUEPRINT.md §6 names both "Apply filters" and
// "Add trade" explicitly as CTA-worthy actions.
const CTA_GRADIENT =
  "linear-gradient(120deg, #2E62E6, #3f86e8 60%, #5BE0FF)";

const selectClass =
  "rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-3 py-2 text-sm text-white outline-none transition-colors duration-base focus:border-accent-bright/50";

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
  noTradesAccount: string;
  emptyFiltersHint: string;
  resetAllFilters: string;
  activeFilters: string;
  dateConflictWarning: string;

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
    readOnlyMode: "Modalità sola lettura",
    readOnlyTitle: "Questo account è in modalità visualizzazione",
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
    allStrategies: "— Tutte le strategie —",
    noStrategy: "— Nessuna strategia —",
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
    setupQuality: "Qualità setup (1-10)",
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
    noTradesAccount: "Nessun trade registrato. Aggiungi il tuo primo trade.",
    emptyFiltersHint: "Potrebbe esserci un conflitto tra l'intervallo date preciso e il periodo rapido della ScopeBar.",
    resetAllFilters: "Azzera tutti i filtri",
    activeFilters: "Filtri attivi:",
    dateConflictWarning: "⚠ date in conflitto",

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
    allStrategies: "— All strategies —",
    noStrategy: "— No strategy —",
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
    noTradesAccount: "No trades recorded yet. Add your first trade.",
    emptyFiltersHint: "A date range conflict between the precise filter and the ScopeBar period may be causing empty results.",
    resetAllFilters: "Clear all filters",
    activeFilters: "Active filters:",
    dateConflictWarning: "⚠ date conflict",

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
    allStrategies: "— Ð£ÑÑ– ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ñ— —",
    noStrategy: "— Ð‘ÐµÐ· ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ñ— —",
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
    noTradesAccount: "Угод ще не зареєстровано. Додайте свій перший trade.",
    emptyFiltersHint: "Можливий конфлікт між точним діапазоном дат і швидким періодом ScopeBar.",
    resetAllFilters: "Скинути всі фільтри",
    activeFilters: "Активні фільтри:",
    dateConflictWarning: "⚠ конфлікт дат",
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
    allStrategies: "— Ð’ÑÐµ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¸ —",
    noStrategy: "— Ð‘ÐµÐ· ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¸ —",
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
    noTradesAccount: "Сделок пока нет. Добавьте свою первую сделку.",
    emptyFiltersHint: "Возможен конфликт между точным диапазоном дат и быстрым периодом ScopeBar.",
    resetAllFilters: "Сбросить все фильтры",
    activeFilters: "Активные фильтры:",
    dateConflictWarning: "⚠ конфликт дат",
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
    needsReview: "Necesita revisión",
    bestTrade: "Mejor trade",
    worstTrade: "Peor trade",
    operationalRegister: "Registro operativo",
    title: "Diario de trading",
    memberFilterActive: "Filtro de miembro activo",
    viewingOnlyTradesOf: "Estás viendo solo los trades de",
    clearFilter: "Limpiar filtro",
    readOnlyMode: "Modo solo lectura",
    readOnlyTitle: "Esta cuenta está en modo visualización",
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
    allSymbols: "Todos los símbolos",
    allOutcomes: "Todos los resultados",
    allDirections: "Todas las direcciones",
    allSources: "Todas las fuentes",
    allStatuses: "Todos los estados",
    allTraders: "Todos los traders",
    strategy: "Estrategia",
    allStrategies: "— Todas las estrategias —",
    noStrategy: "— Sin estrategia —",
    applyFilters: "Aplicar filtros",
    newTradeEyebrow: "Nueva operación",
    newTradeTitle: "Añadir trade",
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
    session: "Sesión",
    emotionalState: "Estado emocional",
    setupQuality: "Calidad del setup (1-10)",
    executionRating: "Ejecución (1-10)",
    confidence: "Confianza (1-10)",
    mistakes: "Errores",
    lessonsLearned: "Lecciones aprendidas",
    addTrade: "Añadir trade",
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
    noTradesAccount: "Aún no hay trades registrados. Añade tu primer trade.",
    emptyFiltersHint: "Puede haber un conflicto entre el rango de fechas y el período rápido del ScopeBar.",
    resetAllFilters: "Limpiar todos los filtros",
    activeFilters: "Filtros activos:",
    dateConflictWarning: "⚠ conflicto de fechas",
    date: "Fecha",
    trader: "Trader",
    symbol: "Símbolo",
    sync: "Sync",
    direction: "Dirección",
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
    filteredPnl: "PnL filtré",
    currentEquity: "Equity actuelle",
    winRate: "Win Rate",
    filteredTrades: "Trades filtrés",
    imported: "Importés",
    needsReview: "À revoir",
    bestTrade: "Meilleur trade",
    worstTrade: "Pire trade",
    operationalRegister: "Registre opérationnel",
    title: "Journal de trading",
    memberFilterActive: "Filtre membre actif",
    viewingOnlyTradesOf: "Vous consultez uniquement les trades de",
    clearFilter: "Effacer le filtre",
    readOnlyMode: "Mode lecture seule",
    readOnlyTitle: "Ce compte est en mode consultation",
    readOnlyDescription:
      "Vous pouvez consulter le journal, mais vous ne pouvez pas créer, modifier ou supprimer des trades.",
    account: "Compte",
    readOnly: "Lecture seule",
    win: "Win",
    loss: "Loss",
    be: "BE",
    filtersEyebrow: "Filtres opérationnels",
    filtersTitle: "Analysez vos trades",
    resetFilters: "Réinitialiser les filtres",
    allSymbols: "Tous les symboles",
    allOutcomes: "Tous les résultats",
    allDirections: "Toutes les directions",
    allSources: "Toutes les sources",
    allStatuses: "Tous les statuts",
    allTraders: "Tous les traders",
    strategy: "Stratégie",
    allStrategies: "— Toutes les stratégies —",
    noStrategy: "— Aucune stratégie —",
    applyFilters: "Appliquer les filtres",
    newTradeEyebrow: "Nouvelle opération",
    newTradeTitle: "Ajouter un trade",
    openDate: "Date d’ouverture",
    openTime: "Heure d’ouverture",
    reason: "Raison",
    instrument: "Instrument",
    amount: "Amount / Lot",
    openingPrice: "Prix d’ouverture",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Date de clôture",
    closingPrice: "Prix de clôture",
    outcome: "Résultat",
    result: "Résultat $",
    session: "Session",
    emotionalState: "État émotionnel",
    setupQuality: "Qualité du setup (1-10)",
    executionRating: "Exécution (1-10)",
    confidence: "Confiance (1-10)",
    mistakes: "Erreurs",
    lessonsLearned: "Leçons apprises",
    addTrade: "Ajouter un trade",
    calm: "Calme",
    focused: "Concentré",
    confident: "Confiant",
    tired: "Fatigué",
    stressed: "Stressé",
    impulsive: "Impulsif",
    historyEyebrow: "Historique des opérations",
    historyTitle: "Trades enregistrés",
    filteredCount: (filtered, total) =>
      `${filtered} trades filtrés sur ${total} au total`,
    noTrades: "Aucun trade trouvé avec ces filtres.",
    noTradesAccount: "Aucun trade enregistré. Ajoutez votre premier trade.",
    emptyFiltersHint: "Un conflit de dates entre le filtre précis et la période ScopeBar peut vider les résultats.",
    resetAllFilters: "Effacer tous les filtres",
    activeFilters: "Filtres actifs :",
    dateConflictWarning: "⚠ conflit de dates",
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
    needsReview: "Review nötig",
    bestTrade: "Bester Trade",
    worstTrade: "Schlechtester Trade",
    operationalRegister: "Operatives Register",
    title: "Trading-Tagebuch",
    memberFilterActive: "Mitgliederfilter aktiv",
    viewingOnlyTradesOf: "Du siehst nur Trades von",
    clearFilter: "Filter löschen",
    readOnlyMode: "Nur-Lese-Modus",
    readOnlyTitle: "Dieses Konto ist im Ansichtsmodus",
    readOnlyDescription:
      "Du kannst das Tagebuch ansehen, aber keine Trades erstellen, bearbeiten oder löschen.",
    account: "Konto",
    readOnly: "Nur Lesen",
    win: "Win",
    loss: "Loss",
    be: "BE",
    filtersEyebrow: "Operative Filter",
    filtersTitle: "Analysiere deine Trades",
    resetFilters: "Filter zurücksetzen",
    allSymbols: "Alle Symbole",
    allOutcomes: "Alle Ergebnisse",
    allDirections: "Alle Richtungen",
    allSources: "Alle Quellen",
    allStatuses: "Alle Status",
    allTraders: "Alle Trader",
    strategy: "Strategie",
    allStrategies: "— Alle Strategien —",
    noStrategy: "— Keine Strategie —",
    applyFilters: "Filter anwenden",
    newTradeEyebrow: "Neue Operation",
    newTradeTitle: "Trade hinzufügen",
    openDate: "Eröffnungsdatum",
    openTime: "Eröffnungszeit",
    reason: "Grund",
    instrument: "Instrument",
    amount: "Amount / Lot",
    openingPrice: "Eröffnungspreis",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Schlussdatum",
    closingPrice: "Schlusspreis",
    outcome: "Ergebnis",
    result: "Ergebnis $",
    session: "Session",
    emotionalState: "Emotionaler Zustand",
    setupQuality: "Setup-Qualität (1-10)",
    executionRating: "Execution Rating (1-10)",
    confidence: "Confidence (1-10)",
    mistakes: "Fehler",
    lessonsLearned: "Gelernte Lektionen",
    addTrade: "Trade hinzufügen",
    calm: "Ruhig",
    focused: "Fokussiert",
    confident: "Selbstbewusst",
    tired: "Müde",
    stressed: "Gestresst",
    impulsive: "Impulsiv",
    historyEyebrow: "Operationshistorie",
    historyTitle: "Registrierte Trades",
    filteredCount: (filtered, total) =>
      `${filtered} gefilterte Trades von ${total} insgesamt`,
    noTrades: "Keine Trades mit diesen Filtern gefunden.",
    noTradesAccount: "Noch keine Trades erfasst. Füge deinen ersten Trade hinzu.",
    emptyFiltersHint: "Ein Datumskonflikt zwischen präzisem Filter und ScopeBar-Zeitraum kann leere Ergebnisse erzeugen.",
    resetAllFilters: "Alle Filter zurücksetzen",
    activeFilters: "Aktive Filter:",
    dateConflictWarning: "⚠ Datumskonflikt",
    date: "Datum",
    trader: "Trader",
    symbol: "Symbol",
    sync: "Sync",
    direction: "Richtung",
    equity: "Equity",
    actions: "Aktionen",
    edit: "Bearbeiten",
    delete: "Löschen",
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
  // Cold family only, per REBRAND_BLUEPRINT.md's "colore-etichetta"
  // rule - these distinguish sync sources, they don't mean anything
  // semantically, so they stay within accent/accent-bright/neutral,
  // never an arbitrary hue like Tailwind's blue-500.
  if (source === "mt5") {
    return "border-accent-bright/20 bg-accent-bright/10 text-accent-bright";
  }

  if (source === "broker") {
    return "border-accent/20 bg-accent/10 text-accent";
  }

  return "border-white/10 bg-white/10 text-muted";
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
  // win was previously bg-accent/10 (cyan) here - every other page
  // (Dashboard, Equity, Account Hub) treats a win outcome as green.
  // Fixed to match; loss/be were already correct.
  if (outcome === "win") {
    return "bg-green-500/10 text-green-400";
  }

  if (outcome === "loss") {
    return "bg-red-500/10 text-red-400";
  }

  if (outcome === "be") {
    return "bg-yellow-500/10 text-yellow-400";
  }

  return "bg-white/10 text-muted";
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
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

  const activeDateConflict =
    period !== "all" && Boolean(filters.from || filters.to);

  const activeFilterChips: string[] = [];
  if (filters.symbol) activeFilterChips.push(filters.symbol);
  if (filters.outcome) activeFilterChips.push(filters.outcome.toUpperCase());
  if (filters.direction) activeFilterChips.push(filters.direction);
  if (filters.source) activeFilterChips.push(filters.source);
  if (filters.needsReview === "true") activeFilterChips.push(t.needsReview);
  if (filters.strategyId) {
    const strat = strategies.find((s) => s.id === filters.strategyId);
    if (strat) activeFilterChips.push(strat.name);
  }
  if (filters.from) activeFilterChips.push(`>= ${filters.from}`);
  if (filters.to) activeFilterChips.push(`<= ${filters.to}`);
  if (period !== "all") activeFilterChips.push(period + (ref ? ` (${ref})` : ""));

  const keyMetrics = [
    {
      label: `${t.filteredPnl}${periodSuffix}`,
      value: formatCurrencyByLanguage(totalPnl, currency, language),
      tone: totalPnl >= 0 ? "text-green-400" : "text-red-400",
    },
    {
      label: `${t.winRate}${periodSuffix}`,
      value: `${winRate.toFixed(2)}%`,
      // Was hardcoded green regardless of the actual rate - a 20%
      // win rate still showed as a positive signal.
      tone: winRate >= 50 ? "text-green-400" : "text-red-400",
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
    <div className={pageDensity.diary.page}>
      <div className="reveal-rise" style={{ animationDelay: "0ms" }}>
        <div className="flex items-center gap-3">
          <SignatureEdge orientation="vertical" className="h-4" />
          <p className="text-sm text-muted">
            {t.operationalRegister}
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-4">
          <h1 className="text-hero">
            {t.title}
          </h1>
        </div>

        {selectedMember && (
          <Card variant="inner" className="mt-4 p-5">
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
              className="mt-4 inline-flex rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-3 text-sm font-bold text-muted transition-colors duration-base hover:text-white hover:bg-white/[0.05]"
            >
              {t.clearFilter}
            </Link>
          </Card>
        )}

        {isReadOnly && (
          <Card variant="inner" className="mt-4 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {t.readOnlyMode}
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              {t.readOnlyTitle}
            </h2>

            <p className="mt-3 text-sm text-muted">
              {t.readOnlyDescription}
            </p>
          </Card>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-faint">
            {t.account}: {account.name}
          </p>

          {isReadOnly && (
            <div className="rounded-full bg-white/[0.06] px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-muted">
              {t.readOnly}
            </div>
          )}
        </div>
      </div>

      <ScopeBar
        members={scopeMembers}
        selectedMemberId={selectedTraderId ?? undefined}
        currentPeriod={period}
        currentRef={ref}
        appLanguage={language}
        accountId={accountId}
      />

      <div
        className={`reveal-rise grid grid-cols-2 ${pageDensity.diary.grid} xl:grid-cols-4`}
        style={{ animationDelay: "60ms" }}
      >
        {keyMetrics.map((stat) => (
          <Card key={stat.label} interactive className={pageDensity.diary.panel}>
            <p className="text-sm text-muted">
              {stat.label}
            </p>

            <h2
              className={`mt-2 text-2xl font-bold ${stat.tone}`}
            >
              {stat.value}
            </h2>
          </Card>
        ))}
      </div>

      <div className="reveal-rise" style={{ animationDelay: "100ms" }}>
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
      </div>

      <form
        action={`/accounts/${accountId}/diary`}
        className="reveal-rise rounded-card border-[0.5px] border-flash/[0.1] bg-surface-1 p-4"
        style={{ animationDelay: "140ms" }}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="shrink-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-bright">
              {t.filtersEyebrow}
            </p>
            <h2 className="mt-1 text-lg font-bold text-white">
              {t.filtersTitle}
            </h2>
          </div>

          <div className="flex flex-1 flex-wrap items-center gap-2">
          <select
            name="symbol"
            defaultValue={filters.symbol || ""}
            className={selectClass}
          >
            <option value="">{t.allSymbols}</option>
            {symbols.map((symbol) => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>

          <select
            name="outcome"
            defaultValue={filters.outcome || ""}
            className={selectClass}
          >
            <option value="">{t.allOutcomes}</option>
            <option value="win">{t.win}</option>
            <option value="loss">{t.loss}</option>
            <option value="be">{t.be}</option>
          </select>

          <select
            name="direction"
            defaultValue={filters.direction || ""}
            className={selectClass}
          >
            <option value="">{t.allDirections}</option>
            <option value="LONG">LONG</option>
            <option value="SHORT">SHORT</option>
          </select>

          <select
            name="source"
            defaultValue={filters.source || ""}
            className={selectClass}
          >
            <option value="">{t.allSources}</option>
            <option value="manual">{t.manual}</option>
            <option value="mt5">{t.mt5}</option>
            <option value="broker">{t.broker}</option>
          </select>

          <select
            name="needsReview"
            defaultValue={filters.needsReview || ""}
            className={selectClass}
          >
            <option value="">{t.allStatuses}</option>
            <option value="true">{t.needsReview}</option>
          </select>

          <select
            name="strategyId"
            defaultValue={filters.strategyId || ""}
            className={selectClass}
          >
            <option value="">{t.allStrategies}</option>
            {strategies.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <div className={`flex items-center gap-2 rounded-inner border-[0.5px] px-3 py-1.5 ${activeDateConflict ? "border-yellow-500/40 bg-yellow-500/[0.06]" : "border-accent-bright/30 bg-accent-bright/[0.04]"}`}>
            <div className="dt-wrap">
              <input
                name="from"
                type="date"
                defaultValue={filters.from || ""}
                className="bg-transparent pr-6 text-sm text-gray-300 outline-none"
              />
              <span className="dt-icon" aria-hidden="true"><CalendarIcon /></span>
            </div>
            <span className="text-xs text-muted-faint">→</span>
            <div className="dt-wrap">
              <input
                name="to"
                type="date"
                defaultValue={filters.to || ""}
                className="bg-transparent pr-6 text-sm text-gray-300 outline-none"
              />
              <span className="dt-icon" aria-hidden="true"><CalendarIcon /></span>
            </div>
            {activeDateConflict && (
              <span className="text-xs font-bold text-yellow-400">{t.dateConflictWarning}</span>
            )}
          </div>

          <button
            type="submit"
            style={{ background: CTA_GRADIENT }}
            className="rounded-inner px-4 py-2 text-sm font-semibold text-white transition-shadow duration-base hover:shadow-[0_0_24px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]"
          >
            {t.applyFilters}
          </button>

          {hasActiveFilters && (
            <Link
              href={`/accounts/${accountId}/diary`}
              className="rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-2 text-sm text-muted transition-colors duration-base hover:text-white hover:bg-white/[0.06]"
            >
              {t.resetFilters}
            </Link>
          )}
          </div>
        </div>

        {activeFilterChips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-faint">{t.activeFilters}</span>
            {activeFilterChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-white/[0.05] px-3 py-0.5 text-xs text-muted"
              >
                {chip}
              </span>
            ))}
            {activeDateConflict && (
              <span className="rounded-full bg-yellow-500/10 px-3 py-0.5 text-xs font-semibold text-yellow-400">
                {t.dateConflictWarning}
              </span>
            )}
          </div>
        )}
      </form>

      <div
        className="reveal-rise space-y-3"
        style={{ animationDelay: "180ms" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted">
              {t.historyEyebrow}
            </p>

            <h2 className="text-2xl font-bold">
              {t.historyTitle}
            </h2>
          </div>

          {canCreateTrades && (
            <Link
              href={`/accounts/${accountId}/diary/new`}
              style={{ background: CTA_GRADIENT }}
              className="inline-flex items-center gap-1.5 rounded-inner px-4 py-2 text-sm font-semibold text-white transition-shadow duration-base hover:shadow-[0_0_24px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]"
            >
              + {t.newTradeTitle}
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="text-xs text-muted-faint">
            {t.filteredCount(periodTrades.length, allTrades.length)}
          </p>
          {secondaryMetrics.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1">
              <span className="text-xs text-muted-faint">{stat.label}:</span>
              <span className={`text-xs font-semibold ${stat.tone}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="reveal-rise hidden rounded-card border-[0.5px] border-flash/[0.1] bg-surface-1 p-4 lg:block"
        style={{ animationDelay: "220ms" }}
      >
        {periodTrades.length === 0 ? (
          <Card variant="inner" className="border-dashed p-10 text-center">
            {allTrades.length === 0 ? (
              <p className="font-medium text-muted">{t.noTradesAccount}</p>
            ) : (
              <div className="space-y-3">
                <p className="text-muted">{t.noTrades}</p>
                {activeDateConflict && (
                  <p className="text-sm text-yellow-400">{t.emptyFiltersHint}</p>
                )}
                <Link
                  href={`/accounts/${accountId}/diary`}
                  className="inline-block rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-2 text-sm text-muted transition-colors duration-base hover:text-white hover:bg-white/[0.08]"
                >
                  {t.resetAllFilters}
                </Link>
              </div>
            )}
          </Card>
        ) : (
          <div className="relative space-y-3 before:absolute before:bottom-5 before:left-6 before:top-5 before:w-px before:bg-gradient-to-b before:from-accent-bright/10 before:via-accent-bright/35 before:to-accent/10 before:content-['']">
            {periodTrades.map((trade) => (
              <ListRow
                key={trade.id}
                className="relative ml-2 !p-0 !pl-10"
              >
                <span
                  className={`absolute left-3 top-6 h-3 w-3 rounded-full border bg-surface-1 ${
                    (trade.resultUsd || 0) >= 0
                      ? "border-green-400/50 shadow-[0_0_0_4px_rgba(74,222,128,0.06)]"
                      : "border-red-400/50 shadow-[0_0_0_4px_rgba(248,113,113,0.06)]"
                  }`}
                  aria-hidden="true"
                />

                <div className="grid grid-cols-[130px_minmax(0,1.15fr)_140px_150px_190px] items-center gap-4 rounded-inner border-[0.5px] border-white/[0.06] bg-bg-base/30 px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-faint">
                      {formatDateByLanguage(
                        trade.openDate,
                        language
                      )}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {trade.openTime || "-"}
                    </p>
                    {isSharedAccount && (
                      <p className="mt-1 truncate text-xs text-muted-faint">
                        {t.trader}:{" "}
                        {trade.createdBy?.name ||
                          trade.createdBy?.username ||
                          t.unknownTrader}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-white">
                        {trade.symbol}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getOutcomeClass(
                          trade.outcome
                        )}`}
                      >
                        {getOutcomeLabel(trade.outcome, t)}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          trade.direction === "LONG"
                            ? "bg-accent/10 text-accent"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {trade.direction}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${getTradeSourceClass(
                          trade.source
                        )}`}
                      >
                        {getTradeSourceLabel(
                          trade.source,
                          t
                        )}
                      </span>
                      {trade.needsReview && (
                        <span className="w-fit rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-yellow-300">
                          {t.needsReview}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-faint">{t.result}</p>
                    <p
                      className={`mt-1 text-lg font-black ${(trade.resultUsd || 0) >= 0
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
                    <p className="mt-1 text-xs text-muted">
                      {t.equity}:{" "}
                      <span className="font-semibold text-white">
                        {formatCurrencyByLanguage(
                          trade.equity || account.initialBalance,
                          currency,
                          language
                        )}
                      </span>
                    </p>
                  </div>

                  <div className="text-sm">
                    <p className="text-xs text-muted-faint">{t.strategy}</p>
                    <p className="mt-1 truncate font-semibold text-gray-300">
                      {trade.strategy || "-"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      R:R{" "}
                      <span className="font-semibold text-white">
                        {trade.riskReward || "-"}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/accounts/${accountId}/diary/${trade.id}/replay`}
                      className="inline-flex items-center gap-1.5 rounded-inner border-[0.5px] border-accent-bright/20 bg-accent-bright/[0.04] px-3 py-2 text-sm font-semibold text-accent-bright transition-colors duration-base hover:bg-accent-bright/[0.08]"
                      title="Replay"
                    >
                      <PlayCircle size={15} />
                      Replay
                    </Link>
                    {canEditTrades || canDeleteTrades ? (
                      <div className="flex gap-2">
                        {canEditTrades && (
                          <Link
                            href={`/accounts/${accountId}/diary/${trade.id}/edit`}
                            className="rounded-inner bg-white/10 px-3 py-2 text-sm transition-colors duration-base hover:bg-white/20"
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
                              className="rounded-inner bg-red-500/10 px-3 py-2 text-sm text-red-400 transition-colors duration-base hover:bg-red-500/20"
                            >
                              {t.delete}
                            </button>
                          </form>
                        )}
                      </div>
                    ) : (
                      <span className="rounded-inner bg-white/[0.06] px-3 py-2 text-xs font-semibold text-muted">
                        {t.readOnly}
                      </span>
                    )}
                  </div>
                </div>
              </ListRow>
            ))}
          </div>
        )}
      </div>

      <div
        className={`reveal-rise ${pageDensity.diary.mobileStack} lg:hidden ${periodTrades.length > 0 ? "relative before:absolute before:bottom-8 before:left-5 before:top-8 before:w-px before:bg-gradient-to-b before:from-accent-bright/10 before:via-accent-bright/30 before:to-accent/10 before:content-['']" : ""}`}
        style={{ animationDelay: "260ms" }}
      >
        {periodTrades.length === 0 ? (
          <Card variant="inner" className="space-y-3 border-dashed p-8 text-center">
            {allTrades.length === 0 ? (
              <p className="font-medium text-muted">{t.noTradesAccount}</p>
            ) : (
              <>
                <p className="text-muted">{t.noTrades}</p>
                {activeDateConflict && (
                  <p className="text-sm text-yellow-400">{t.emptyFiltersHint}</p>
                )}
                <Link
                  href={`/accounts/${accountId}/diary`}
                  className="inline-block rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-2 text-sm text-muted transition-colors duration-base hover:text-white hover:bg-white/[0.08]"
                >
                  {t.resetAllFilters}
                </Link>
              </>
            )}
          </Card>
        ) : (
          periodTrades.map((trade) => (
            <ListRow key={trade.id} className="relative !p-6 !pl-10">
              <span
                className={`absolute left-4 top-8 h-3 w-3 rounded-full border bg-surface-1 ${
                  (trade.resultUsd || 0) >= 0
                    ? "border-green-400/50 shadow-[0_0_0_4px_rgba(74,222,128,0.06)]"
                    : "border-red-400/50 shadow-[0_0_0_4px_rgba(248,113,113,0.06)]"
                }`}
                aria-hidden="true"
              />
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-faint">
                    {formatDateByLanguage(
                      trade.openDate,
                      language
                    )} {trade.openTime || ""}
                  </p>

                  <h3 className="mt-2 truncate text-2xl font-black text-white">
                    {trade.symbol}
                  </h3>

                  {isSharedAccount && (
                    <p className="mt-1 text-sm text-muted-faint">
                      {t.trader}: {trade.createdBy?.name || trade.createdBy?.username || t.unknownTrader}
                    </p>
                  )}
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ${trade.direction === "LONG"
                      ? "bg-accent/10 text-accent"
                      : "bg-red-500/10 text-red-400"
                    }`}
                >
                  {trade.direction}
                </span>
              </div>

              {/* Primary value: Result $, the one number this card
                  leads with. */}
              <p
                className={`mt-5 text-3xl font-black ${(trade.resultUsd || 0) >= 0
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

              {/* Support: compact strip, not four boxed sub-cards. */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/[0.06] pt-3 text-xs">
                <span className={`font-semibold ${getOutcomeClass(trade.outcome)} rounded-full px-2 py-0.5`}>
                  {getOutcomeLabel(trade.outcome, t)}
                </span>

                <span className="text-muted">
                  {t.equity}:{" "}
                  <span className="font-semibold text-white">
                    {formatCurrencyByLanguage(
                      trade.equity || account.initialBalance,
                      currency,
                      language
                    )}
                  </span>
                </span>

                <span className="text-muted">
                  {t.sync}:{" "}
                  <span className="font-semibold text-accent-bright">
                    {getTradeSourceLabel(trade.source, t)}
                  </span>
                </span>
              </div>

              {(trade.setupQuality ||
                trade.executionRating ||
                trade.confidence) && (
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    {trade.setupQuality && (
                      <span className="text-muted">
                        Setup: <span className="font-semibold text-accent">{trade.setupQuality}/10</span>
                      </span>
                    )}

                    {trade.executionRating && (
                      <span className="text-muted">
                        Execution: <span className="font-semibold text-yellow-300">{trade.executionRating}/10</span>
                      </span>
                    )}

                    {trade.confidence && (
                      <span className="text-muted">
                        Confidence: <span className="font-semibold text-accent-bright">{trade.confidence}/10</span>
                      </span>
                    )}
                  </div>
                )}

              {trade.strategy && (
                <p className="mt-3 text-sm text-muted">
                  {t.strategy}: {trade.strategy}
                </p>
              )}

              {trade.notes && (
                <Card variant="inner" className="mt-3 p-3 text-sm text-muted">
                  {trade.notes}
                </Card>
              )}

              {trade.mistakes && (
                <div className="mt-3 rounded-inner border border-red-500/10 bg-red-500/[0.03] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-400">
                    {t.mistakes}
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    {trade.mistakes}
                  </p>
                </div>
              )}

              {trade.lessonsLearned && (
                <div className="mt-3 rounded-inner border border-accent/10 bg-accent/[0.03] p-3">
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
                  className="inline-flex items-center gap-1.5 rounded-inner border-[0.5px] border-flash/[0.1] px-3 py-3 text-sm text-muted transition-colors duration-base hover:text-accent-bright"
                >
                  <PlayCircle size={14} />
                  Replay
                </Link>
                {canEditTrades && (
                  <Link
                    href={`/accounts/${accountId}/diary/${trade.id}/edit`}
                    className="flex-1 rounded-inner bg-white/10 px-3 py-3 text-center text-sm transition-colors duration-base hover:bg-white/20"
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
                      className="w-full rounded-inner bg-red-500/10 px-3 py-3 text-sm text-red-400 transition-colors duration-base hover:bg-red-500/20"
                    >
                      {t.delete}
                    </button>
                  </form>
                )}
              </div>
            </ListRow>
          ))
        )}
      </div>
    </div>
  );
}







