import { Prisma } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatCurrencyByLanguage,
  formatDateByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

import TradeQualityHero from "@/components/diary/TradeQualityHero";
import TradeQualityIntelligence from "@/components/diary/TradeQualityIntelligence";
import TradeBehaviorWarnings from "@/components/diary/TradeBehaviorWarnings";
import ExecutionPatternEngine from "@/components/diary/ExecutionPatternEngine";
import TradeDisciplineScore from "@/components/diary/TradeDisciplineScore";
import TradePerformanceClusters from "@/components/diary/TradePerformanceClusters";
import EdgeDetectionEngine from "@/components/diary/EdgeDetectionEngine";
import TraderIdentityEngine from "@/components/diary/TraderIdentityEngine";
import AdaptiveCoachingLayer from "@/components/diary/AdaptiveCoachingLayer";
import MarketPsychologyEngine from "@/components/diary/MarketPsychologyEngine";
import ConfidenceAnalyticsEngine from "@/components/diary/ConfidenceAnalyticsEngine";
import BehavioralCorrelationEngine from "@/components/diary/BehavioralCorrelationEngine";
import AIPerformanceTimeline from "@/components/diary/AIPerformanceTimeline";

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
    filteredPnl: "Відфільтрований PnL",
    currentEquity: "Поточна equity",
    winRate: "Win Rate",
    filteredTrades: "Відфільтровані угоди",
    imported: "Імпортовані",
    needsReview: "Потребує ревʼю",
    bestTrade: "Найкраща угода",
    worstTrade: "Найгірша угода",
    operationalRegister: "Операційний журнал",
    title: "Торговий щоденник",
    memberFilterActive: "Фільтр учасника активний",
    viewingOnlyTradesOf: "Ви переглядаєте лише угоди від",
    clearFilter: "Очистити фільтр",
    readOnlyMode: "Режим лише перегляду",
    readOnlyTitle: "Цей акаунт у режимі перегляду",
    readOnlyDescription:
      "Ви можете переглядати щоденник, але не можете створювати, редагувати або видаляти угоди.",
    account: "Акаунт",
    readOnly: "Лише перегляд",
    win: "Win",
    loss: "Loss",
    be: "BE",
    filtersEyebrow: "Операційні фільтри",
    filtersTitle: "Аналізуйте свої угоди",
    resetFilters: "Скинути фільтри",
    allSymbols: "Усі символи",
    allOutcomes: "Усі результати",
    allDirections: "Усі напрямки",
    allSources: "Усі джерела",
    allStatuses: "Усі статуси",
    allTraders: "Усі трейдери",
    strategy: "Стратегія",
    applyFilters: "Застосувати фільтри",
    newTradeEyebrow: "Нова операція",
    newTradeTitle: "Додати угоду",
    openDate: "Дата відкриття",
    openTime: "Час відкриття",
    reason: "Причина",
    instrument: "Інструмент",
    amount: "Amount / Lot",
    openingPrice: "Ціна відкриття",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Дата закриття",
    closingPrice: "Ціна закриття",
    outcome: "Результат",
    result: "Результат $",
    session: "Сесія",
    emotionalState: "Емоційний стан",
    setupQuality: "Якість сетапу (1-10)",
    executionRating: "Оцінка виконання (1-10)",
    confidence: "Впевненість (1-10)",
    mistakes: "Помилки",
    lessonsLearned: "Вивчені уроки",
    addTrade: "Додати угоду",
    calm: "Спокійний",
    focused: "Сфокусований",
    confident: "Впевнений",
    tired: "Втомлений",
    stressed: "Напружений",
    impulsive: "Імпульсивний",
    historyEyebrow: "Історія операцій",
    historyTitle: "Зареєстровані угоди",
    filteredCount: (filtered, total) =>
      `${filtered} відфільтрованих угод із ${total}`,
    noTrades: "За цими фільтрами угод не знайдено.",
    date: "Дата",
    trader: "Трейдер",
    symbol: "Символ",
    sync: "Синхр.",
    direction: "Напрямок",
    equity: "Equity",
    actions: "Дії",
    edit: "Редагувати",
    delete: "Видалити",
    manual: "Вручну",
    mt5: "MT5",
    broker: "Брокер",
    unknownTrader: "Трейдер",
    notes: "Нотатки",
  },

  ru: {
    filteredPnl: "Отфильтрованный PnL",
    currentEquity: "Текущая equity",
    winRate: "Win Rate",
    filteredTrades: "Отфильтрованные сделки",
    imported: "Импортированные",
    needsReview: "Требует ревью",
    bestTrade: "Лучшая сделка",
    worstTrade: "Худшая сделка",
    operationalRegister: "Операционный журнал",
    title: "Торговый дневник",
    memberFilterActive: "Фильтр участника активен",
    viewingOnlyTradesOf: "Вы просматриваете только сделки от",
    clearFilter: "Очистить фильтр",
    readOnlyMode: "Режим только просмотра",
    readOnlyTitle: "Этот аккаунт в режиме просмотра",
    readOnlyDescription:
      "Вы можете просматривать дневник, но не можете создавать, редактировать или удалять сделки.",
    account: "Аккаунт",
    readOnly: "Только просмотр",
    win: "Win",
    loss: "Loss",
    be: "BE",
    filtersEyebrow: "Операционные фильтры",
    filtersTitle: "Анализируйте свои сделки",
    resetFilters: "Сбросить фильтры",
    allSymbols: "Все символы",
    allOutcomes: "Все результаты",
    allDirections: "Все направления",
    allSources: "Все источники",
    allStatuses: "Все статусы",
    allTraders: "Все трейдеры",
    strategy: "Стратегия",
    applyFilters: "Применить фильтры",
    newTradeEyebrow: "Новая операция",
    newTradeTitle: "Добавить сделку",
    openDate: "Дата открытия",
    openTime: "Время открытия",
    reason: "Причина",
    instrument: "Инструмент",
    amount: "Amount / Lot",
    openingPrice: "Цена открытия",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Дата закрытия",
    closingPrice: "Цена закрытия",
    outcome: "Результат",
    result: "Результат $",
    session: "Сессия",
    emotionalState: "Эмоциональное состояние",
    setupQuality: "Качество сетапа (1-10)",
    executionRating: "Оценка исполнения (1-10)",
    confidence: "Уверенность (1-10)",
    mistakes: "Ошибки",
    lessonsLearned: "Уроки",
    addTrade: "Добавить сделку",
    calm: "Спокойный",
    focused: "Сфокусированный",
    confident: "Уверенный",
    tired: "Уставший",
    stressed: "В стрессе",
    impulsive: "Импульсивный",
    historyEyebrow: "История операций",
    historyTitle: "Зарегистрированные сделки",
    filteredCount: (filtered, total) =>
      `${filtered} отфильтрованных сделок из ${total}`,
    noTrades: "По этим фильтрам сделки не найдены.",
    date: "Дата",
    trader: "Трейдер",
    symbol: "Символ",
    sync: "Синхр.",
    direction: "Направление",
    equity: "Equity",
    actions: "Действия",
    edit: "Редактировать",
    delete: "Удалить",
    manual: "Вручную",
    mt5: "MT5",
    broker: "Брокер",
    unknownTrader: "Трейдер",
    notes: "Заметки",
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
  if (source === "mt5") {
    return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
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
    return "bg-green-500/10 text-green-400";
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
    strategy?: string;
    trader?: string;
    from?: string;
    to?: string;
    member?: string;
    source?: string;
    needsReview?: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;
  const filters = await searchParams;

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      appLanguage: true,
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
    String(membership.role) === "MANAGER";

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

  if (filters.strategy) {
    where.strategy = {
      contains: filters.strategy,
      mode: "insensitive",
    };
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

  const symbols = Array.from(
    new Set(allTrades.map((trade) => trade.symbol))
  ).sort();

  const strategies = Array.from(
    new Set(
      allTrades
        .map((trade) => trade.strategy)
        .filter(
          (strategy): strategy is string =>
            Boolean(strategy)
        )
    )
  ).sort();

  const totalTrades = trades.length;

  const importedTrades = trades.filter(
    (trade) => trade.source !== "manual"
  ).length;

  const needsReviewTrades = trades.filter(
    (trade) => trade.needsReview
  ).length;

  const wins = trades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const losses = trades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const breakEven = trades.filter(
    (trade) => trade.outcome === "be"
  ).length;

  const totalPnl = trades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const winRate =
    totalTrades > 0
      ? (wins / totalTrades) * 100
      : 0;

  const latestTrade = allTrades[0];

  const currentEquity = latestTrade
    ? latestTrade.equity || account.initialBalance
    : account.initialBalance;

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

  const hasActiveFilters =
    Boolean(filters.symbol) ||
    Boolean(filters.outcome) ||
    Boolean(filters.direction) ||
    Boolean(filters.source) ||
    Boolean(filters.needsReview) ||
    Boolean(selectedTraderId) ||
    Boolean(filters.strategy) ||
    Boolean(filters.from) ||
    Boolean(filters.to);

  const statCards = [
    {
      label: t.filteredPnl,
      value: formatCurrencyByLanguage(
        totalPnl,
        currency,
        language
      ),
      tone:
        totalPnl >= 0
          ? "text-green-400"
          : "text-red-400",
    },
    {
      label: t.currentEquity,
      value: formatCurrencyByLanguage(
        currentEquity,
        currency,
        language
      ),
      tone: "text-white",
    },
    {
      label: t.winRate,
      value: `${winRate.toFixed(2)}%`,
      tone: "text-green-400",
    },
    {
      label: t.filteredTrades,
      value: totalTrades,
      tone: "text-white",
    },
    {
      label: t.imported,
      value: importedTrades,
      tone: "text-cyan-400",
    },
    {
      label: t.needsReview,
      value: needsReviewTrades,
      tone: "text-yellow-300",
    },
    {
      label: t.bestTrade,
      value: formatCurrencyByLanguage(
        bestTrade,
        currency,
        language
      ),
      tone: "text-green-400",
    },
    {
      label: t.worstTrade,
      value: formatCurrencyByLanguage(
        worstTrade,
        currency,
        language
      ),
      tone: "text-red-400",
    },
  ];

  const averageExecution =
    trades.length > 0
      ? Math.round(
        trades.reduce(
          (acc, trade) =>
            acc + (trade.executionRating || 0),
          0
        ) / trades.length
      )
      : 0;

  const averageConfidence =
    trades.length > 0
      ? Math.round(
        trades.reduce(
          (acc, trade) =>
            acc + (trade.confidence || 0),
          0
        ) / trades.length
      )
      : 0;

  const highQualityTrades = trades.filter(
    (trade) =>
      (trade.setupQuality || 0) >= 8 &&
      (trade.executionRating || 0) >= 8
  ).length;

  const weakExecutionTrades = trades.filter(
    (trade) =>
      (trade.executionRating || 0) > 0 &&
      (trade.executionRating || 0) <= 4
  ).length;

  const emotionalTrades = trades.filter(
    (trade) =>
      trade.emotionalState &&
      trade.emotionalState.length > 0
  ).length;

  const lowConfidenceTrades = trades.filter(
    (trade) =>
      (trade.confidence || 0) > 0 &&
      (trade.confidence || 0) <= 4
  ).length;

  const weakSetupTrades = trades.filter(
    (trade) =>
      (trade.setupQuality || 0) > 0 &&
      (trade.setupQuality || 0) <= 4
  ).length;

  const impulsiveTrades = trades.filter(
    (trade) =>
      trade.mistakes &&
      trade.mistakes.toLowerCase().includes("impuls")
  ).length;

  const disciplineScore =
    trades.length > 0
      ? Math.max(
        0,
        Math.min(
          100,
          Math.round(
            averageExecution * 4 +
            averageConfidence * 3 +
            (highQualityTrades /
              Math.max(trades.length, 1)) *
            30 -
            weakExecutionTrades * 2
          )
        )
      )
      : 0;

  const strongTrades = trades.filter(
    (trade) =>
      (trade.executionRating || 0) >= 8 &&
      (trade.setupQuality || 0) >= 8
  ).length;

  const averageTrades = trades.filter(
    (trade) =>
      (trade.executionRating || 0) >= 5 &&
      (trade.executionRating || 0) < 8
  ).length;

  const weakTrades = trades.filter(
    (trade) =>
      (trade.executionRating || 0) > 0 &&
      (trade.executionRating || 0) <= 4
  ).length;

  const setupStats = trades.reduce(
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

  const traderType =
    averageConfidence >= 7 && averageExecution >= 7
      ? "Confident Executor"
      : averageExecution >= 7
        ? "Technical Executor"
        : averageConfidence >= 7
          ? "High Conviction Trader"
          : "Developing Trader";

  const traderStrength =
    highQualityTrades >= weakExecutionTrades
      ? "Execution Quality"
      : "Data Awareness";

  const traderWeakness =
    emotionalTrades > highQualityTrades
      ? "Emotional Discipline"
      : weakSetupTrades > strongTrades
        ? "Setup Selection"
        : "Consistency";

  const highConfidenceTrades = trades.filter(
    (trade) => (trade.confidence || 0) >= 8
  ).length;

  return (
    <div>
      <TradeQualityHero
        totalTrades={trades.length}
        averageExecution={averageExecution}
        averageConfidence={averageConfidence}
        appLanguage={language}
      />

      <div className="mt-8">
        <TradeDisciplineScore score={disciplineScore} appLanguage={language} />
      </div>

      <div className="mt-8">
        <TradeQualityIntelligence
          highQualityTrades={highQualityTrades}
          weakExecutionTrades={weakExecutionTrades}
          emotionalTrades={emotionalTrades}
          appLanguage={language}
        />
      </div>

      <div className="mt-8">
        <TradeBehaviorWarnings
          weakExecutionTrades={weakExecutionTrades}
          emotionalTrades={emotionalTrades}
          highQualityTrades={highQualityTrades}
          appLanguage={language}
        />
      </div>

      <div className="mt-8">
        <TradePerformanceClusters
          strongTrades={strongTrades}
          averageTrades={averageTrades}
          weakTrades={weakTrades}
          appLanguage={language}
        />
      </div>

      <div className="mt-8">
        <EdgeDetectionEngine
          bestSetup={bestSetup}
          weakSetupCount={weakSetupTrades}
          strongTradeCount={strongTrades}
          appLanguage={language}
        />
      </div>

      <div className="mt-8">
        <TraderIdentityEngine
          traderType={traderType}
          strength={traderStrength}
          weakness={traderWeakness}
          appLanguage={language}
        />
      </div>

      <div className="mt-8">
        <AdaptiveCoachingLayer
          disciplineScore={disciplineScore}
          traderType={traderType}
          weakness={traderWeakness}
          weakExecutionTrades={weakExecutionTrades}
          emotionalTrades={emotionalTrades}
          appLanguage={language}
        />
      </div>

      <div className="mt-8">
        <MarketPsychologyEngine
          emotionalTrades={emotionalTrades}
          lowConfidenceTrades={lowConfidenceTrades}
          highQualityTrades={highQualityTrades}
          appLanguage={language}
        />
      </div>

      <div className="mt-8">
        <ConfidenceAnalyticsEngine
          lowConfidenceTrades={lowConfidenceTrades}
          highConfidenceTrades={highConfidenceTrades}
          highQualityTrades={highQualityTrades}
          appLanguage={language}
        />
      </div>

      <div className="mt-8">
        <BehavioralCorrelationEngine
          emotionalTrades={emotionalTrades}
          weakExecutionTrades={weakExecutionTrades}
          lowConfidenceTrades={lowConfidenceTrades}
          totalTrades={trades.length}
          appLanguage={language}
        />
      </div>

      <div className="mt-8">
        <AIPerformanceTimeline
          totalTrades={trades.length}
          highQualityTrades={highQualityTrades}
          weakExecutionTrades={weakExecutionTrades}
          disciplineScore={disciplineScore}
          appLanguage={language}
        />
      </div>

      <div className="mt-8">
        <ExecutionPatternEngine
          lowConfidenceTrades={lowConfidenceTrades}
          weakSetupTrades={weakSetupTrades}
          impulsiveTrades={impulsiveTrades}
          appLanguage={language}
        />
      </div>

      <div className="mb-8 mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {t.operationalRegister}
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            {t.title}
          </h1>

          {selectedMember && (
            <div className="mt-4 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
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

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
          {wins} {t.win} - {losses} {t.loss} - {breakEven} {t.be}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-8">
        {statCards.map((stat) => (
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

          {isSharedAccount && (
            <select
              name="trader"
              defaultValue={selectedTraderId || ""}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            >
              <option value="">{t.allTraders}</option>

              {accountMembers.map((member) => (
                <option
                  key={member.user.id}
                  value={member.user.id}
                >
                  {member.user.name ||
                    member.user.username ||
                    t.unknownTrader}
                </option>
              ))}
            </select>
          )}

          <input
            name="strategy"
            defaultValue={filters.strategy || ""}
            list="strategy-list"
            placeholder={t.strategy}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <datalist id="strategy-list">
            {strategies.map((strategy) => (
              <option
                key={strategy}
                value={strategy}
              />
            ))}
          </datalist>

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
            className="rounded-2xl bg-green-500 p-4 font-bold text-black transition hover:bg-green-400 sm:col-span-2 xl:col-span-9"
          >
            {t.applyFilters}
          </button>
        </div>
      </form>

      {canCreateTrades && (
        <form
          action={createAccountTrade.bind(null, accountId)}
          className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-5"
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

            <input
              name="strategy"
              placeholder={t.strategy}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            />

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
              className="rounded-2xl bg-green-500 p-4 font-bold text-black transition hover:bg-green-400 sm:col-span-2 xl:col-span-4"
            >
              {t.addTrade}
            </button>
          </div>
        </form>
      )}

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {t.historyEyebrow}
          </p>

          <h2 className="text-2xl font-bold">
            {t.historyTitle}
          </h2>
        </div>

        <p className="text-sm text-gray-500">
          {t.filteredCount(totalTrades, allTrades.length)}
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
            {trades.map((trade) => (
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
                </td>
              </tr>
            ))}

            {trades.length === 0 && (
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
        {trades.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center text-gray-500">
            {t.noTrades}
          </div>
        ) : (
          trades.map((trade) => (
            <div
              key={trade.id}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.06]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.06),transparent_35%)]" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                      {formatDateByLanguage(
                        trade.openDate,
                        language
                      )} {trade.openTime || ""}
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-white">
                      {trade.symbol}
                    </h3>

                    {isSharedAccount && (
                      <p className="mt-1 text-sm text-gray-500">
                        {t.trader}: {trade.createdBy?.name || trade.createdBy?.username || t.unknownTrader}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-2xl px-3 py-2 text-xs font-black ${trade.direction === "LONG"
                        ? "bg-green-500/10 text-green-400"
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

                    <p className="mt-1 font-bold text-cyan-300">
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

                          <p className="mt-1 font-bold text-green-400">
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
                  <div className="mt-4 rounded-2xl border border-green-500/10 bg-green-500/[0.03] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-400">
                      {t.lessonsLearned}
                    </p>

                    <p className="mt-2 text-sm text-gray-300">
                      {trade.lessonsLearned}
                    </p>
                  </div>
                )}

                {(canEditTrades || canDeleteTrades) && (
                  <div className="mt-4 flex gap-3">
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
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}







