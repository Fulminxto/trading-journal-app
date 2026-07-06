import { ChevronDown } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import AccountPageShell from "@/components/AccountPageShell";
import EquityChart from "@/components/EquityChart";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import ScopeBar from "@/components/ScopeBar";
import Card from "@/components/ui/Card";
import ListRow from "@/components/ui/ListRow";
import SignatureEdge from "@/components/ui/SignatureEdge";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import {
  parseScopeParams,
  getPeriodRange,
  getPeriodSuffix,
} from "@/lib/scope";
import { pageDensity } from "@/lib/page-density";

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

  equityTotal: string;
  scoreElite: string;
  scoreConsistent: string;
  scoreDeveloping: string;
  scoreUnstable: string;

  riskControl: string;
  exposure: string;

  averages: string;
  extremes: string;

  watchNoteFewTrades: string;
  watchNoteDrawdownLimit: string;
  watchNoteWinRatePressure: string;
  watchNoteAverageResultNegative: string;
  watchNoteProfitContained: string;
  watchNoteNoCriticalSignal: string;
};

const dashboardLabels: Record<
  AppLanguage,
  DashboardLabels
> = {
  it: {
    accountStatus: "Stato account",
    accountStatusDescription:
      "Snapshot basato su profitto, drawdown e comportamento recente dell’account.",
    dashboardAccount: "Account Dashboard",

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
      "Nessun trade ancora. Quando aggiungerai operazioni, la curva equity apparirà qui.",

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

    latestActivity: "Attività recente",
    recentTrades: "Trade recenti",
    unknownSymbol: "Simbolo sconosciuto",
    equity: "Equity",
    noRecentTrades: "Nessun trade recente.",

    reviewNotes: "Note di review",
    whatToWatch: "Cosa osservare",
    risk: "Rischio",
    currentMaxDrawdownIs: "Il drawdown massimo attuale è",
    execution: "Esecuzione",
    averageResultPerTradeIs:
      "Il risultato medio per trade è",
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

    equityTotal: "Equity totale",
    scoreElite: "Elite",
    scoreConsistent: "Consistente",
    scoreDeveloping: "In sviluppo",
    scoreUnstable: "Instabile",

    riskControl: "Controllo rischio",
    exposure: "Esposizione",

    averages: "Medie",
    extremes: "Estremi",

    watchNoteFewTrades: "Pochi trade. Considera i segnali come contesto iniziale.",
    watchNoteDrawdownLimit: "Il drawdown è vicino al limite dell'account.",
    watchNoteWinRatePressure: "Il win rate è sotto pressione. Rivedi gli ingressi.",
    watchNoteAverageResultNegative: "Il risultato medio è negativo. Controlla la dimensione delle perdite.",
    watchNoteProfitContained: "Il profitto è positivo e il rischio è contenuto.",
    watchNoteNoCriticalSignal: "Nessun segnale critico. Continua a monitorare l'esecuzione.",
  },

  en: {
    accountStatus: "Account Status",
    accountStatusDescription:
      "Snapshot based on profit, drawdown and recent account behavior.",
    dashboardAccount: "Account Dashboard",

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

    equityTotal: "Total Equity",
    scoreElite: "Elite",
    scoreConsistent: "Consistent",
    scoreDeveloping: "Developing",
    scoreUnstable: "Unstable",

    riskControl: "Risk Control",
    exposure: "Exposure",

    averages: "Averages",
    extremes: "Extremes",

    watchNoteFewTrades: "Few trades. Treat signals as early context.",
    watchNoteDrawdownLimit: "Drawdown is close to the account limit.",
    watchNoteWinRatePressure: "Win rate is under pressure. Review entries.",
    watchNoteAverageResultNegative: "Average result is negative. Watch loss size.",
    watchNoteProfitContained: "Profit is positive and risk is contained.",
    watchNoteNoCriticalSignal: "No critical signal. Keep monitoring execution.",
  },

  uk: {
    accountStatus: "Статус акаунта",
    accountStatusDescription:
      "Знімок на основі прибутку, drawdown та останньої поведінки акаунта.",
    dashboardAccount: "Дашборд акаунта",

    accountType: "Тип акаунта",
    initialBalance: "Початковий баланс",
    currency: "Валюта",
    brokerFirm: "Брокер / Фірма",
    phase: "Фаза",
    profitTarget: "Ціль прибутку",
    maxDrawdownLimit: "Ліміт max drawdown",
    dailyDrawdownLimit: "Денний ліміт drawdown",

    accountGrowth: "Зростання акаунта",
    equityCurve: "Крива equity",
    noTradesEquity:
      "Поки немає trade. Коли операції будуть додані, тут з’явиться крива equity.",

    targetProgress: "Прогрес цілі",
    currentProfit: "Поточний прибуток",
    target: "Ціль",
    remaining: "Залишилось",

    recentMomentum: "Останній momentum",
    last: "Останні",
    trades: "trade",
    winsShort: "W",
    lossesShort: "L",

    profitFactor: "Profit Factor",
    profitFactorDescription:
      "Валовий прибуток у порівнянні з валовим збитком.",
    outcomeSplit: "Розподіл результатів",
    wins: "Перемоги",
    losses: "Поразки",
    breakEven: "Break Even",

    latestActivity: "Остання активність",
    recentTrades: "Останні trade",
    unknownSymbol: "Невідомий символ",
    equity: "Equity",
    noRecentTrades: "Поки немає останніх trade.",

    reviewNotes: "Нотатки review",
    whatToWatch: "На що звернути увагу",
    risk: "Ризик",
    currentMaxDrawdownIs: "Поточний max drawdown становить",
    execution: "Виконання",
    averageResultPerTradeIs:
      "Середній результат на trade становить",
    consistency: "Стабільність",
    scoreCurrentlyAt: "Поточний score",

    currentEquity: "Поточна equity",
    totalPnl: "Загальний PnL",
    winRate: "Win rate",
    averageResult: "Середній результат",
    averageWin: "Середній win",
    averageLoss: "Середній loss",
    bestTrade: "Найкращий trade",
    worstTrade: "Найгірший trade",
    maxDrawdown: "Max drawdown",
    remainingTarget: "Залишок до цілі",

    healthWaitingForData: "Очікування даних",
    healthStable: "Стабільно",
    healthPositiveMonitorRisk:
      "Позитивно, але контролюй ризик",
    healthNeedsReview: "Потрібен review",

    equityTotal: "Загальна equity",
    scoreElite: "Elite",
    scoreConsistent: "Стабільний",
    scoreDeveloping: "У розвитку",
    scoreUnstable: "Нестабільний",

    riskControl: "Контроль ризику",
    exposure: "Експозиція",

    averages: "Середні",
    extremes: "Екстреми",

    watchNoteFewTrades: "Мало трейдів. Розглядай сигнали як ранній контекст.",
    watchNoteDrawdownLimit: "Drawdown наближається до ліміту акаунта.",
    watchNoteWinRatePressure: "Win rate під тиском. Переглянь входи.",
    watchNoteAverageResultNegative: "Середній результат негативний. Стеж за розміром збитків.",
    watchNoteProfitContained: "Прибуток позитивний і ризик під контролем.",
    watchNoteNoCriticalSignal: "Немає критичних сигналів. Продовжуй моніторинг виконання.",
  },

  ru: {
    accountStatus: "Статус аккаунта",
    accountStatusDescription:
      "Снимок на основе прибыли, drawdown и недавнего поведения аккаунта.",
    dashboardAccount: "Дашборд аккаунта",

    accountType: "Тип аккаунта",
    initialBalance: "Начальный баланс",
    currency: "Валюта",
    brokerFirm: "Брокер / Фирма",
    phase: "Фаза",
    profitTarget: "Цель прибыли",
    maxDrawdownLimit: "Лимит max drawdown",
    dailyDrawdownLimit: "Дневной лимит drawdown",

    accountGrowth: "Рост аккаунта",
    equityCurve: "Кривая equity",
    noTradesEquity:
      "Пока нет trade. Когда операции будут добавлены, здесь появится кривая equity.",

    targetProgress: "Прогресс цели",
    currentProfit: "Текущая прибыль",
    target: "Цель",
    remaining: "Осталось",

    recentMomentum: "Последний momentum",
    last: "Последние",
    trades: "trade",
    winsShort: "W",
    lossesShort: "L",

    profitFactor: "Profit Factor",
    profitFactorDescription:
      "Валовая прибыль по сравнению с валовым убытком.",
    outcomeSplit: "Распределение результатов",
    wins: "Победы",
    losses: "Поражения",
    breakEven: "Break Even",

    latestActivity: "Последняя активность",
    recentTrades: "Последние trade",
    unknownSymbol: "Неизвестный символ",
    equity: "Equity",
    noRecentTrades: "Пока нет последних trade.",

    reviewNotes: "Заметки review",
    whatToWatch: "За чем следить",
    risk: "Риск",
    currentMaxDrawdownIs: "Текущий max drawdown составляет",
    execution: "Исполнение",
    averageResultPerTradeIs:
      "Средний результат на trade составляет",
    consistency: "Стабильность",
    scoreCurrentlyAt: "Текущий score",

    currentEquity: "Текущая equity",
    totalPnl: "Общий PnL",
    winRate: "Win rate",
    averageResult: "Средний результат",
    averageWin: "Средний win",
    averageLoss: "Средний loss",
    bestTrade: "Лучший trade",
    worstTrade: "Худший trade",
    maxDrawdown: "Max drawdown",
    remainingTarget: "Остаток до цели",

    healthWaitingForData: "Ожидание данных",
    healthStable: "Стабильно",
    healthPositiveMonitorRisk:
      "Положительно, но контролируй риск",
    healthNeedsReview: "Нужен review",

    equityTotal: "Общая equity",
    scoreElite: "Elite",
    scoreConsistent: "Стабильный",
    scoreDeveloping: "В развитии",
    scoreUnstable: "Нестабильный",

    riskControl: "Контроль риска",
    exposure: "Экспозиция",

    averages: "Средние",
    extremes: "Экстремумы",

    watchNoteFewTrades: "Мало сделок. Рассматривай сигналы как ранний контекст.",
    watchNoteDrawdownLimit: "Drawdown приближается к лимиту аккаунта.",
    watchNoteWinRatePressure: "Win rate под давлением. Пересмотри входы.",
    watchNoteAverageResultNegative: "Средний результат отрицательный. Следи за размером убытков.",
    watchNoteProfitContained: "Прибыль положительная и риск под контролем.",
    watchNoteNoCriticalSignal: "Нет критических сигналов. Продолжай мониторинг исполнения.",
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
    maxDrawdownLimit: "Límite max drawdown",
    dailyDrawdownLimit: "Límite diario de drawdown",

    accountGrowth: "Crecimiento de cuenta",
    equityCurve: "Curva de equity",
    noTradesEquity:
      "Aún no hay trades. Cuando se añadan operaciones, la curva de equity aparecerá aquí.",

    targetProgress: "Progreso del objetivo",
    currentProfit: "Beneficio actual",
    target: "Objetivo",
    remaining: "Restante",

    recentMomentum: "Momentum reciente",
    last: "Últimos",
    trades: "trades",
    winsShort: "W",
    lossesShort: "L",

    profitFactor: "Profit Factor",
    profitFactorDescription:
      "Beneficio bruto comparado con pérdida bruta.",
    outcomeSplit: "Distribución de resultados",
    wins: "Ganadas",
    losses: "Perdidas",
    breakEven: "Break Even",

    latestActivity: "Actividad reciente",
    recentTrades: "Trades recientes",
    unknownSymbol: "Símbolo desconocido",
    equity: "Equity",
    noRecentTrades: "Aún no hay trades recientes.",

    reviewNotes: "Notas de review",
    whatToWatch: "Qué observar",
    risk: "Riesgo",
    currentMaxDrawdownIs: "El max drawdown actual es",
    execution: "Ejecución",
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
    healthNeedsReview: "Necesita revisión",

    equityTotal: "Equity total",
    scoreElite: "Elite",
    scoreConsistent: "Consistente",
    scoreDeveloping: "En desarrollo",
    scoreUnstable: "Inestable",

    riskControl: "Control de riesgo",
    exposure: "Exposición",

    averages: "Promedios",
    extremes: "Extremos",

    watchNoteFewTrades: "Pocos trades. Trata las señales como contexto inicial.",
    watchNoteDrawdownLimit: "El drawdown está cerca del límite de la cuenta.",
    watchNoteWinRatePressure: "El win rate está bajo presión. Revisa las entradas.",
    watchNoteAverageResultNegative: "El resultado medio es negativo. Controla el tamaño de las pérdidas.",
    watchNoteProfitContained: "El beneficio es positivo y el riesgo está contenido.",
    watchNoteNoCriticalSignal: "Sin señal crítica. Sigue monitorizando la ejecución.",
  },

  fr: {
    accountStatus: "État du compte",
    accountStatusDescription:
      "Snapshot basé sur le profit, le drawdown et le comportement récent du compte.",
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
    equityCurve: "Courbe d’equity",
    noTradesEquity:
      "Aucun trade pour le moment. Quand des opérations seront ajoutées, la courbe d’equity apparaîtra ici.",

    targetProgress: "Progression de l’objectif",
    currentProfit: "Profit actuel",
    target: "Objectif",
    remaining: "Restant",

    recentMomentum: "Momentum récent",
    last: "Derniers",
    trades: "trades",
    winsShort: "W",
    lossesShort: "L",

    profitFactor: "Profit Factor",
    profitFactorDescription:
      "Profit brut comparé à la perte brute.",
    outcomeSplit: "Répartition des résultats",
    wins: "Wins",
    losses: "Losses",
    breakEven: "Break Even",

    latestActivity: "Activité récente",
    recentTrades: "Trades récents",
    unknownSymbol: "Symbole inconnu",
    equity: "Equity",
    noRecentTrades: "Aucun trade récent.",

    reviewNotes: "Notes de review",
    whatToWatch: "À surveiller",
    risk: "Risque",
    currentMaxDrawdownIs: "Le max drawdown actuel est",
    execution: "Exécution",
    averageResultPerTradeIs:
      "Le résultat moyen par trade est",
    consistency: "Consistance",
    scoreCurrentlyAt: "Score actuel",

    currentEquity: "Equity actuelle",
    totalPnl: "PnL total",
    winRate: "Win rate",
    averageResult: "Résultat moyen",
    averageWin: "Win moyen",
    averageLoss: "Loss moyen",
    bestTrade: "Meilleur trade",
    worstTrade: "Pire trade",
    maxDrawdown: "Max drawdown",
    remainingTarget: "Objectif restant",

    healthWaitingForData: "En attente de données",
    healthStable: "Stable",
    healthPositiveMonitorRisk:
      "Positif, mais surveille le risque",
    healthNeedsReview: "À revoir",

    equityTotal: "Equity totale",
    scoreElite: "Elite",
    scoreConsistent: "Consistant",
    scoreDeveloping: "En développement",
    scoreUnstable: "Instable",

    riskControl: "Contrôle du risque",
    exposure: "Exposition",

    averages: "Moyennes",
    extremes: "Extrêmes",

    watchNoteFewTrades: "Peu de trades. Traite les signaux comme un contexte précoce.",
    watchNoteDrawdownLimit: "Le drawdown est proche de la limite du compte.",
    watchNoteWinRatePressure: "Le win rate est sous pression. Revois les entrées.",
    watchNoteAverageResultNegative: "Le résultat moyen est négatif. Surveille la taille des pertes.",
    watchNoteProfitContained: "Le profit est positif et le risque est contenu.",
    watchNoteNoCriticalSignal: "Aucun signal critique. Continue à surveiller l'exécution.",
  },

  de: {
    accountStatus: "Kontostatus",
    accountStatusDescription:
      "Snapshot basierend auf Gewinn, Drawdown und aktuellem Kontoverhalten.",
    dashboardAccount: "Konto-Dashboard",

    accountType: "Kontotyp",
    initialBalance: "Startkapital",
    currency: "Währung",
    brokerFirm: "Broker / Firma",
    phase: "Phase",
    profitTarget: "Gewinnziel",
    maxDrawdownLimit: "Max-Drawdown-Limit",
    dailyDrawdownLimit: "Tägliches Drawdown-Limit",

    accountGrowth: "Kontowachstum",
    equityCurve: "Equity-Kurve",
    noTradesEquity:
      "Noch keine Trades. Sobald Trades hinzugefügt werden, erscheint hier die Equity-Kurve.",

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

    latestActivity: "Letzte Aktivität",
    recentTrades: "Letzte Trades",
    unknownSymbol: "Unbekanntes Symbol",
    equity: "Equity",
    noRecentTrades: "Noch keine letzten Trades.",

    reviewNotes: "Review-Notizen",
    whatToWatch: "Worauf achten",
    risk: "Risiko",
    currentMaxDrawdownIs: "Der aktuelle Max Drawdown beträgt",
    execution: "Ausführung",
    averageResultPerTradeIs:
      "Das durchschnittliche Ergebnis pro Trade beträgt",
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
      "Positiv, aber Risiko überwachen",
    healthNeedsReview: "Review nötig",

    equityTotal: "Gesamt-Equity",
    scoreElite: "Elite",
    scoreConsistent: "Konstant",
    scoreDeveloping: "In Entwicklung",
    scoreUnstable: "Instabil",

    riskControl: "Risikokontrolle",
    exposure: "Exposition",

    averages: "Durchschnitte",
    extremes: "Extreme",

    watchNoteFewTrades: "Wenige Trades. Behandle Signale als frühen Kontext.",
    watchNoteDrawdownLimit: "Der Drawdown nähert sich dem Kontolimit.",
    watchNoteWinRatePressure: "Die Win-Rate steht unter Druck. Überprüfe die Einstiege.",
    watchNoteAverageResultNegative: "Das Durchschnittsergebnis ist negativ. Achte auf die Verlusthöhe.",
    watchNoteProfitContained: "Der Gewinn ist positiv und das Risiko ist begrenzt.",
    watchNoteNoCriticalSignal: "Kein kritisches Signal. Überwache weiter die Ausführung.",
  },
};


export default async function DashboardPage({
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

  const [membership, accountMembers] = await Promise.all([
    prisma.accountMember.findFirst({
      where: {
        userId: session.user.id,
        tradingAccountId: accountId,
      },
      include: {
        tradingAccount: true,
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

  const isSharedAccount = accountMembers.length > 1;

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
      ...(selectedMemberId
        ? { createdById: selectedMemberId }
        : {}),
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
        timezone: true,
      },
    });

  const language = normalizeAppLanguage(
    currentUser?.appLanguage
  );

  const t =
    dashboardLabels[language] ??
    dashboardLabels.en;

  // ── Scope (period + trader filter) ─────────────────────────────────────────
  const { period, ref } = parseScopeParams({
    period: filters.period,
    ref: filters.ref,
  });

  const dateRange = getPeriodRange(
    period,
    ref,
    currentUser?.timezone ?? undefined,
  );

  // All trades (member-filtered, date-unfiltered) — used for fixed metrics.
  // periodTrades is the date-filtered subset used for performance metrics.
  const periodTrades = dateRange
    ? trades.filter(
        (trade) =>
          trade.openDate >= dateRange.gte &&
          trade.openDate < dateRange.lte,
      )
    : trades;

  const periodSuffix = getPeriodSuffix(period, ref, language);
  // ───────────────────────────────────────────────────────────────────────────

  const currency = account.currency;
  const initialBalance = account.initialBalance || 0;

  const totalTrades = periodTrades.length;

  const wins = periodTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const losses = periodTrades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const be = periodTrades.filter(
    (trade) => trade.outcome === "be"
  ).length;

  const closedTrades = periodTrades.filter(
    (trade) =>
      trade.outcome === "win" ||
      trade.outcome === "loss" ||
      trade.outcome === "be"
  ).length;

  const winningTrades = periodTrades.filter(
    (trade) => trade.outcome === "win"
  );

  const losingTrades = periodTrades.filter(
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

  const totalPnl = periodTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  // currentEquity: always the most recent equity of the account (all-time, fixed).
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

  const maxDrawdown =
    periodTrades.length > 0
      ? Math.min(
        ...periodTrades.map(
          (trade) =>
            trade.drawdownPercent || 0
        )
      )
      : 0;

  const exposurePercent =
    account.maxDrawdown && account.maxDrawdown > 0
      ? Math.min(100, (Math.abs(maxDrawdown) / account.maxDrawdown) * 100)
      : 0;

  const recentTrades = [...periodTrades]
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

  const chartData = periodTrades.map((trade) => ({
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

  const scoreTierLabel =
    consistencyScore >= 80 ? t.scoreElite :
    consistencyScore >= 60 ? t.scoreConsistent :
    consistencyScore >= 40 ? t.scoreDeveloping :
                             t.scoreUnstable;

  const watchItems =
    totalTrades < 5
      ? [
          {
            label: t.execution,
            value: `${totalTrades} ${t.trades}`,
            tone: "text-yellow-400",
            note: t.watchNoteFewTrades,
          },
        ]
      : [
          ...(exposurePercent >= 70
            ? [
                {
                  label: t.risk,
                  value: formatPercent(maxDrawdown),
                  tone: "text-red-400",
                  note: t.watchNoteDrawdownLimit,
                },
              ]
            : []),
          ...(winRate < 45
            ? [
                {
                  label: t.consistency,
                  value: formatPercent(winRate),
                  tone: "text-red-400",
                  note: t.watchNoteWinRatePressure,
                },
              ]
            : []),
          ...(averageResult < 0
            ? [
                {
                  label: t.execution,
                  value: formatCurrency(averageResult, currency),
                  tone: "text-red-400",
                  note: t.watchNoteAverageResultNegative,
                },
              ]
            : []),
          ...(currentProfitPercent > 0 && exposurePercent < 50
            ? [
                {
                  label: t.risk,
                  value: formatPercent(currentProfitPercent),
                  tone: "text-green-400",
                  note: t.watchNoteProfitContained,
                },
              ]
            : []),
        ];

  const visibleWatchItems =
    watchItems.length > 0
      ? watchItems.slice(0, 3)
      : [
          {
            label: t.consistency,
            value: `${consistencyScore}/100`,
            tone: "text-accent",
            note: t.watchNoteNoCriticalSignal,
          },
        ];

  return (
    <AccountPageShell
      className={pageDensity.dashboard.page}
      eyebrow={
        <>
          VOLTIS DASHBOARD &middot; {account.name}
        </>
      }
      title={t.dashboardAccount}
      supportLine="Get a complete overview of performance, risk, discipline and recent trading activity."
      badges={
        <>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white">
            {accountHealth}
          </span>

          <span className="rounded-full border border-accent-bright/20 bg-accent-bright/10 px-3 py-1 text-xs font-semibold text-accent-bright">
            Score {consistencyScore}/100 / {scoreTierLabel}
          </span>
        </>
      }
      scopeBar={
        <ScopeBar
          accountId={accountId}
          members={
            isSharedAccount
              ? accountMembers.map((m) => ({
                  id: m.user.id,
                  name: m.user.name,
                  username: m.user.username,
                }))
              : undefined
          }
          selectedMemberId={selectedMemberId}
          currentPeriod={period}
          currentRef={ref}
          appLanguage={language}
        />
      }
    >

      {/* PRIMARY — the equity curve is the one hero, full width, dominant. */}
      <div className="reveal-rise" style={{ animationDelay: "40ms" }}>
        <Card variant="hero" interactive className={`relative ${pageDensity.dashboard.hero}`}>
          <SignatureEdge
            orientation="vertical"
            className="absolute bottom-6 left-0 top-6"
          />

          <div className="pl-4">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-faint">
                {t.accountGrowth}
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                {t.equityCurve}
              </h2>
            </div>

            {chartData.length > 0 ? (
              <EquityChart data={chartData} language={language} />
            ) : (
              <Card
                variant="inner"
                className="flex min-h-[260px] items-center justify-center border-dashed p-8 text-center text-sm text-muted"
              >
                {t.noTradesEquity}
              </Card>
            )}

            <div className={`mt-6 grid grid-cols-2 ${pageDensity.dashboard.grid} sm:grid-cols-4`}>
              <div>
                <p className="text-xs text-muted-faint">
                  {t.currentProfit}
                </p>

                <p className={`mt-1 text-lg font-black ${getResultTone(currentProfitPercent)}`}>
                  {formatPercent(currentProfitPercent)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-faint">
                  {t.target}
                </p>

                <p className="mt-1 text-lg font-black text-accent">
                  {account.profitTarget
                    ? formatPercent(account.profitTarget)
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-faint">
                  {t.remaining}
                </p>

                <p
                  className={`mt-1 text-lg font-black ${
                    remainingToTarget !== null && remainingToTarget <= 0
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {remainingToTarget !== null
                    ? formatPercent(remainingToTarget)
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-faint">
                  {t.recentMomentum}
                </p>

                <p className={`mt-1 text-lg font-black ${getResultTone(lastFivePnl)}`}>
                  {formatCurrency(lastFivePnl, currency)}
                </p>

                <p className="mt-0.5 text-xs text-muted-faint">
                  <span className="text-accent">{lastFiveWins}{t.winsShort}</span>
                  {" / "}
                  <span className="text-red-400">{lastFiveLosses}{t.lossesShort}</span>
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* SECONDARY — 4 compact metrics, staggered entrance. */}
      <div className={`grid grid-cols-1 ${pageDensity.dashboard.grid} sm:grid-cols-2 xl:grid-cols-4`}>
        <div className="reveal-rise" style={{ animationDelay: "120ms" }}>
          <DashboardStatCard
            label={t.totalPnl + periodSuffix}
            value={formatCurrency(totalPnl, currency)}
            tone={getResultTone(totalPnl)}
          />
        </div>

        <div className="reveal-rise" style={{ animationDelay: "160ms" }}>
          <DashboardStatCard
            label={t.winRate + periodSuffix}
            value={formatPercent(winRate)}
            tone={winRate >= 50 ? "text-green-400" : "text-red-400"}
          />
        </div>

        <div className="reveal-rise" style={{ animationDelay: "200ms" }}>
          <DashboardStatCard
            label={t.trades + periodSuffix}
            value={totalTrades}
            tone="text-white"
          />
        </div>

        <div className="reveal-rise" style={{ animationDelay: "240ms" }}>
          <DashboardStatCard
            label={t.equityTotal}
            value={formatCurrency(currentEquity, currency)}
            tone="text-white"
          />
        </div>
      </div>

      {/* TERTIARY — Risk sits as a peer among the summary cards, not
          beside the hero, so it never competes with the one dominant truth. */}
      <div
        className={`reveal-rise grid grid-cols-1 ${pageDensity.dashboard.grid} sm:grid-cols-2 xl:grid-cols-4`}
        style={{ animationDelay: "320ms" }}
      >
        <Card interactive className={pageDensity.dashboard.panel}>
          <p className="text-sm text-muted">
            {t.risk}
          </p>

          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="text-xs text-muted-faint">
                {t.maxDrawdown + periodSuffix}
              </p>

              <p className="mt-1 text-2xl font-black text-red-400">
                {formatPercent(maxDrawdown)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-faint">
                  {t.maxDrawdownLimit}
                </p>

                <p className="mt-1 text-sm font-bold text-gray-300">
                  {account.maxDrawdown
                    ? formatPercent(account.maxDrawdown)
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-faint">
                  {t.dailyDrawdownLimit}
                </p>

                <p className="mt-1 text-sm font-bold text-gray-300">
                  {account.dailyDrawdown
                    ? formatPercent(account.dailyDrawdown)
                    : "-"}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-muted-faint">
                <span>{t.exposure}</span>
                <span>{exposurePercent.toFixed(0)}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-red-400 transition-all"
                  style={{ width: `${exposurePercent}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card interactive className={pageDensity.dashboard.panel}>
          <p className="text-sm text-muted">
            {t.outcomeSplit}
          </p>

          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.wins}</span>
              <div className="text-right">
                <span className="font-black text-accent">{wins}</span>
                <span className="ml-2 text-muted-faint">{formatPercent(winRate)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.losses}</span>
              <div className="text-right">
                <span className="font-black text-red-400">{losses}</span>
                <span className="ml-2 text-muted-faint">{formatPercent(lossRate)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.breakEven}</span>
              <div className="text-right">
                <span className="font-black text-yellow-400">{be}</span>
                <span className="ml-2 text-muted-faint">{formatPercent(beRate)}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card interactive className={pageDensity.dashboard.panel}>
          <p className="text-sm text-muted">
            {t.averages}
          </p>

          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.averageResult + periodSuffix}</span>
              <span className={`font-black ${getResultTone(averageResult)}`}>
                {formatCurrency(averageResult, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.averageWin + periodSuffix}</span>
              <span className="font-black text-green-400">
                {formatCurrency(averageWin, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.averageLoss + periodSuffix}</span>
              <span className="font-black text-red-400">
                {formatCurrency(averageLoss, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.profitFactor + periodSuffix}</span>
              <span className={`font-black ${profitFactor >= 1 ? "text-green-400" : "text-red-400"}`}>
                {profitFactor.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        <Card interactive className={pageDensity.dashboard.panel}>
          <p className="text-sm text-muted">
            {t.extremes}
          </p>

          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.bestTrade + periodSuffix}</span>
              <span className="font-black text-green-400">
                {formatCurrency(bestTrade, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.worstTrade + periodSuffix}</span>
              <span className="font-black text-red-400">
                {formatCurrency(worstTrade, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.maxDrawdown + periodSuffix}</span>
              <span className="font-black text-red-400">
                {formatPercent(maxDrawdown)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div
        className={`reveal-rise grid grid-cols-1 ${pageDensity.dashboard.grid} xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]`}
        style={{ animationDelay: "420ms" }}
      >
        <Card interactive className="p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-sm text-muted">
              {t.latestActivity}
            </p>

            <h2 className="text-2xl font-black">
              {t.recentTrades}
            </h2>
          </div>

          {recentTrades.length > 0 ? (
            <div className="space-y-3">
              {recentTrades.map((trade) => (
                <ListRow key={trade.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-base font-black text-white">
                          {trade.symbol || t.unknownSymbol}
                        </p>

                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-300">
                          {trade.direction || "-"}
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${
                            trade.outcome === "win"
                              ? "border-green-400/20 bg-green-400/10 text-green-300"
                              : trade.outcome === "loss"
                                ? "border-red-400/20 bg-red-400/10 text-red-300"
                                : "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                          }`}
                        >
                          {trade.outcome || "-"}
                        </span>
                      </div>

                      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-faint">
                        <span>{getDateLabel(trade.openDate, language)}</span>
                        {trade.session ? (
                          <span>{trade.session}</span>
                        ) : null}
                      </p>
                    </div>

                    <div className="flex items-end justify-between gap-4 sm:block sm:shrink-0 sm:text-right">
                      <p
                        className={`text-lg font-black ${getResultTone(
                          trade.resultUsd || 0
                        )}`}
                      >
                        {formatCurrency(
                          trade.resultUsd || 0,
                          currency
                        )}
                      </p>

                      <p className="mt-1 text-xs text-muted-faint">
                        {t.equity}{" "}
                        {formatCurrency(
                          trade.equity ||
                          initialBalance,
                          currency
                        )}
                      </p>
                    </div>
                  </div>
                </ListRow>
              ))}
            </div>
          ) : (
            <Card variant="inner" className="border-dashed p-6 text-sm text-muted">
              {t.noRecentTrades}
            </Card>
          )}
        </Card>

        <Card interactive className="p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-sm text-muted">
              {t.reviewNotes}
            </p>

            <h2 className="text-2xl font-black">
              {t.whatToWatch}
            </h2>
          </div>

          <div className="space-y-3 text-sm leading-6 text-muted">
            {visibleWatchItems.map((item) => (
              <Card
                key={`${item.label}-${item.value}`}
                variant="inner"
                className="p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-white">
                    {item.label}
                  </p>

                  <p className={`shrink-0 font-black ${item.tone}`}>
                    {item.value}
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-muted-faint">
                  {item.note}
                </p>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      <details className="group rounded-card border-[0.5px] border-flash/[0.1] bg-surface-1 p-4 sm:p-5">
        <summary className="flex cursor-pointer list-none flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-faint">
              Technical profile
            </p>

            <h2 className="mt-1 text-lg font-black text-white">
              Account details
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-muted-faint">
            <span>{t.accountStatus}: {accountHealth}</span>
            <ChevronDown size={16} className="transition group-open:rotate-180" />
          </div>
        </summary>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [t.accountType, account.type],
            [t.phase, account.phase || "-"],
            [t.brokerFirm, account.broker || "-"],
            [t.currency, currency],
            [
              t.initialBalance,
              formatCurrency(initialBalance, currency),
            ],
            [
              t.profitTarget,
              account.profitTarget
                ? formatPercent(account.profitTarget)
                : "-",
            ],
            [
              t.maxDrawdownLimit,
              account.maxDrawdown
                ? formatPercent(account.maxDrawdown)
                : "-",
            ],
            [
              t.dailyDrawdownLimit,
              account.dailyDrawdown
                ? formatPercent(account.dailyDrawdown)
                : "-",
            ],
          ].map(([label, value]) => (
            <Card key={label} variant="inner" className="p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-faint">
                {label}
              </p>

              <p className="mt-2 truncate text-sm font-bold text-gray-200">
                {value}
              </p>
            </Card>
          ))}
        </div>
      </details>

    </AccountPageShell>
  );
}
