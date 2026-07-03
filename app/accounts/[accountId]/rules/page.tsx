import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Gauge,
  ListChecks,
  Save,
  ShieldCheck,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  canManageRules,
  getAccountMembershipWithAccount,
} from "@/lib/permissions";
import {
  formatCurrencyByLanguage,
  getLocaleFromLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { saveTradingGoals } from "./actions";

type StatCardProps = {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  tone?: string;
};

type DisciplineRule = {
  title: string;
  description: string;
};

type RulesLabels = {
  disciplineSystem: string;
  accountControlCenter: string;
  title: string;
  description: string;
  backToAccountHub: string;

  monthlyPnl: string;
  winRate: string;
  maxDrawdown: string;
  tradesThisMonth: string;
  target: string;
  limit: string;
  dailyLimit: string;
  noMonthlyProfitTarget: string;
  noWinRateTarget: string;
  noDrawdownLimit: string;
  noDailyTradeLimit: string;

  performanceTargets: string;
  monthlyGoals: string;
  monthlyProfitGoalPlaceholder: string;
  monthlyWinRateGoalPlaceholder: string;
  maxDrawdownLimitPlaceholder: string;
  maxTradesPerDayPlaceholder: string;
  saveGoals: string;

  operatingFramework: string;
  disciplineRules: string;
  rules: DisciplineRule[];

  profitProgress: string;
  monthlyTarget: string;
  currentProgress: string;
  monthlyProfitTargetReached: string;
  remainingToReachTarget: string;
  setMonthlyProfitTarget: string;
  winRateProgress: string;
  drawdownUsage: string;

  controlSignals: string;
  riskGuardrails: string;
  busiestDay: string;
  busiestDayDescription: string;
  dailyLimitUsage: string;
  dailyLimitUsageDescription: string;
  closedTrades: string;
  closedTradesDescription: string;
};

const rulesLabels: Record<AppLanguage, RulesLabels> = {
  it: {
    disciplineSystem: "Sistema disciplina",
    accountControlCenter: "Centro controllo account",
    title: "Rules & Goals",
    description:
      "Imposta gli obiettivi mensili, definisci i limiti dell’account e mantieni visibili le regole operative prima che la performance diventi emotiva.",
    backToAccountHub: "Torna all’Account Hub",

    monthlyPnl: "PnL mensile",
    winRate: "Win Rate",
    maxDrawdown: "Drawdown massimo",
    tradesThisMonth: "Trade questo mese",
    target: "Target",
    limit: "Limite",
    dailyLimit: "Limite giornaliero",
    noMonthlyProfitTarget:
      "Nessun target di profitto mensile impostato.",
    noWinRateTarget:
      "Nessun target di win rate impostato.",
    noDrawdownLimit:
      "Nessun limite di drawdown impostato.",
    noDailyTradeLimit:
      "Nessun limite giornaliero di trade impostato.",

    performanceTargets: "Target performance",
    monthlyGoals: "Obiettivi mensili",
    monthlyProfitGoalPlaceholder:
      "Obiettivo profitto mensile",
    monthlyWinRateGoalPlaceholder:
      "Obiettivo win rate mensile %",
    maxDrawdownLimitPlaceholder:
      "Limite drawdown massimo %",
    maxTradesPerDayPlaceholder:
      "Trade massimi al giorno",
    saveGoals: "Salva obiettivi",

    operatingFramework: "Framework operativo",
    disciplineRules: "Regole disciplina",
    rules: [
      {
        title: "Niente revenge trading",
        description:
          "Non aprire un nuovo trade per recuperare emotivamente una perdita.",
      },
      {
        title: "Niente entrate impulsive",
        description:
          "Ogni entrata deve nascere da un setup valido e da una motivazione chiara.",
      },
      {
        title: "Rispetta i limiti di rischio",
        description:
          "L’account deve rimanere dentro i limiti di drawdown e frequenza operativa.",
      },
      {
        title: "Fermati dopo errori emotivi",
        description:
          "Se la qualità esecutiva cala, la priorità diventa protezione.",
      },
      {
        title: "Processo prima del profitto",
        description:
          "L’obiettivo è proteggere la consistenza, non inseguire un singolo risultato.",
      },
    ],

    profitProgress: "Progresso profitto",
    monthlyTarget: "Target mensile",
    currentProgress: "Progresso attuale",
    monthlyProfitTargetReached:
      "Target di profitto mensile raggiunto.",
    remainingToReachTarget:
      "rimanenti per raggiungere il target.",
    setMonthlyProfitTarget:
      "Imposta un target di profitto mensile per monitorare il progresso.",
    winRateProgress: "Progresso Win Rate",
    drawdownUsage: "Utilizzo drawdown",

    controlSignals: "Segnali di controllo",
    riskGuardrails: "Guardrail di rischio",
    busiestDay: "Giorno più intenso",
    busiestDayDescription:
      "Numero massimo di trade aperti in un singolo giorno questo mese.",
    dailyLimitUsage: "Utilizzo limite giornaliero",
    dailyLimitUsageDescription:
      "Calcolato sul giorno operativo più intenso.",
    closedTrades: "Trade chiusi",
    closedTradesDescription:
      "Usati per calcolare il win rate attuale.",
  },

  en: {
    disciplineSystem: "Discipline system",
    accountControlCenter: "Account control center",
    title: "Rules & Goals",
    description:
      "Set the monthly targets, define the account limits and keep the operating rules visible before performance becomes emotional.",
    backToAccountHub: "Back to Account Hub",

    monthlyPnl: "Monthly PnL",
    winRate: "Win Rate",
    maxDrawdown: "Max Drawdown",
    tradesThisMonth: "Trades This Month",
    target: "Target",
    limit: "Limit",
    dailyLimit: "Daily limit",
    noMonthlyProfitTarget:
      "No monthly profit target set.",
    noWinRateTarget: "No win rate target set.",
    noDrawdownLimit: "No drawdown limit set.",
    noDailyTradeLimit: "No daily trade limit set.",

    performanceTargets: "Performance targets",
    monthlyGoals: "Monthly Goals",
    monthlyProfitGoalPlaceholder:
      "Monthly Profit Goal",
    monthlyWinRateGoalPlaceholder:
      "Monthly Win Rate Goal %",
    maxDrawdownLimitPlaceholder:
      "Max Drawdown Limit %",
    maxTradesPerDayPlaceholder:
      "Max Trades Per Day",
    saveGoals: "Save Goals",

    operatingFramework: "Operating framework",
    disciplineRules: "Discipline Rules",
    rules: [
      {
        title: "No revenge trading",
        description:
          "Do not open a new trade to emotionally recover a loss.",
      },
      {
        title: "No impulsive entries",
        description:
          "Every entry must come from a valid setup and clear reason.",
      },
      {
        title: "Respect risk limits",
        description:
          "The account must stay inside drawdown and trade frequency limits.",
      },
      {
        title: "Stop after emotional mistakes",
        description:
          "If execution quality drops, the priority becomes protection.",
      },
      {
        title: "Process before profit",
        description:
          "The goal is to protect consistency, not chase a single result.",
      },
    ],

    profitProgress: "Profit progress",
    monthlyTarget: "Monthly Target",
    currentProgress: "Current progress",
    monthlyProfitTargetReached:
      "Monthly profit target reached.",
    remainingToReachTarget:
      "remaining to reach the target.",
    setMonthlyProfitTarget:
      "Set a monthly profit target to track progress.",
    winRateProgress: "Win Rate Progress",
    drawdownUsage: "Drawdown Usage",

    controlSignals: "Control signals",
    riskGuardrails: "Risk Guardrails",
    busiestDay: "Busiest day",
    busiestDayDescription:
      "Max trades opened in one day this month.",
    dailyLimitUsage: "Daily limit usage",
    dailyLimitUsageDescription:
      "Based on the busiest trading day.",
    closedTrades: "Closed trades",
    closedTradesDescription:
      "Used to calculate current win rate.",
  },

  uk: {
    disciplineSystem: "Система дисципліни",
    accountControlCenter: "Центр контролю акаунта",
    title: "Правила та цілі",
    description:
      "Встановлюй місячні цілі, визначай ліміти акаунта та тримай операційні правила видимими до того, як результат стане емоційним.",
    backToAccountHub: "Назад до Account Hub",

    monthlyPnl: "Місячний PnL",
    winRate: "Win Rate",
    maxDrawdown: "Максимальний drawdown",
    tradesThisMonth: "Trade цього місяця",
    target: "Ціль",
    limit: "Ліміт",
    dailyLimit: "Денний ліміт",
    noMonthlyProfitTarget:
      "Місячну ціль прибутку не встановлено.",
    noWinRateTarget: "Ціль win rate не встановлено.",
    noDrawdownLimit: "Ліміт drawdown не встановлено.",
    noDailyTradeLimit:
      "Денний ліміт trade не встановлено.",

    performanceTargets: "Цілі performance",
    monthlyGoals: "Місячні цілі",
    monthlyProfitGoalPlaceholder:
      "Місячна ціль прибутку",
    monthlyWinRateGoalPlaceholder:
      "Місячна ціль win rate %",
    maxDrawdownLimitPlaceholder:
      "Ліміт максимального drawdown %",
    maxTradesPerDayPlaceholder:
      "Максимум trade на день",
    saveGoals: "Зберегти цілі",

    operatingFramework: "Операційний framework",
    disciplineRules: "Правила дисципліни",
    rules: [
      {
        title: "Без revenge trading",
        description:
          "Не відкривай новий trade, щоб емоційно відіграти втрату.",
      },
      {
        title: "Без імпульсивних входів",
        description:
          "Кожен вхід має мати валідний setup і чітку причину.",
      },
      {
        title: "Поважай ліміти ризику",
        description:
          "Акаунт має залишатися в межах drawdown і частоти операцій.",
      },
      {
        title: "Зупинись після емоційних помилок",
        description:
          "Коли якість виконання падає, пріоритетом стає захист.",
      },
      {
        title: "Процес перед прибутком",
        description:
          "Ціль — захищати стабільність, а не гнатися за одним результатом.",
      },
    ],

    profitProgress: "Прогрес прибутку",
    monthlyTarget: "Місячна ціль",
    currentProgress: "Поточний прогрес",
    monthlyProfitTargetReached:
      "Місячну ціль прибутку досягнуто.",
    remainingToReachTarget:
      "залишилось до досягнення цілі.",
    setMonthlyProfitTarget:
      "Встанови місячну ціль прибутку, щоб відстежувати прогрес.",
    winRateProgress: "Прогрес Win Rate",
    drawdownUsage: "Використання drawdown",

    controlSignals: "Контрольні сигнали",
    riskGuardrails: "Захисні межі ризику",
    busiestDay: "Найактивніший день",
    busiestDayDescription:
      "Максимальна кількість trade, відкритих за один день цього місяця.",
    dailyLimitUsage: "Використання денного ліміту",
    dailyLimitUsageDescription:
      "Розраховано на основі найактивнішого торгового дня.",
    closedTrades: "Закриті trade",
    closedTradesDescription:
      "Використовуються для розрахунку поточного win rate.",
  },

  ru: {
    disciplineSystem: "Система дисциплины",
    accountControlCenter: "Центр контроля аккаунта",
    title: "Правила и цели",
    description:
      "Устанавливай месячные цели, определяй лимиты аккаунта и держи операционные правила видимыми до того, как результат станет эмоциональным.",
    backToAccountHub: "Назад в Account Hub",

    monthlyPnl: "Месячный PnL",
    winRate: "Win Rate",
    maxDrawdown: "Максимальный drawdown",
    tradesThisMonth: "Trade за месяц",
    target: "Цель",
    limit: "Лимит",
    dailyLimit: "Дневной лимит",
    noMonthlyProfitTarget:
      "Месячная цель прибыли не задана.",
    noWinRateTarget: "Цель win rate не задана.",
    noDrawdownLimit: "Лимит drawdown не задан.",
    noDailyTradeLimit:
      "Дневной лимит trade не задан.",

    performanceTargets: "Цели performance",
    monthlyGoals: "Месячные цели",
    monthlyProfitGoalPlaceholder:
      "Месячная цель прибыли",
    monthlyWinRateGoalPlaceholder:
      "Месячная цель win rate %",
    maxDrawdownLimitPlaceholder:
      "Лимит максимального drawdown %",
    maxTradesPerDayPlaceholder:
      "Максимум trade в день",
    saveGoals: "Сохранить цели",

    operatingFramework: "Операционный framework",
    disciplineRules: "Правила дисциплины",
    rules: [
      {
        title: "Без revenge trading",
        description:
          "Не открывай новый trade, чтобы эмоционально отыграть убыток.",
      },
      {
        title: "Без импульсивных входов",
        description:
          "Каждый вход должен иметь валидный setup и ясную причину.",
      },
      {
        title: "Соблюдай лимиты риска",
        description:
          "Аккаунт должен оставаться внутри лимитов drawdown и частоты сделок.",
      },
      {
        title: "Остановись после эмоциональных ошибок",
        description:
          "Если качество execution падает, приоритетом становится защита.",
      },
      {
        title: "Процесс перед прибылью",
        description:
          "Цель — защищать стабильность, а не гнаться за одним результатом.",
      },
    ],

    profitProgress: "Прогресс прибыли",
    monthlyTarget: "Месячная цель",
    currentProgress: "Текущий прогресс",
    monthlyProfitTargetReached:
      "Месячная цель прибыли достигнута.",
    remainingToReachTarget:
      "осталось до достижения цели.",
    setMonthlyProfitTarget:
      "Установи месячную цель прибыли, чтобы отслеживать прогресс.",
    winRateProgress: "Прогресс Win Rate",
    drawdownUsage: "Использование drawdown",

    controlSignals: "Контрольные сигналы",
    riskGuardrails: "Защитные рамки риска",
    busiestDay: "Самый активный день",
    busiestDayDescription:
      "Максимальное количество trade, открытых за один день в этом месяце.",
    dailyLimitUsage: "Использование дневного лимита",
    dailyLimitUsageDescription:
      "Рассчитано по самому активному торговому дню.",
    closedTrades: "Закрытые trade",
    closedTradesDescription:
      "Используются для расчета текущего win rate.",
  },

  es: {
    disciplineSystem: "Sistema de disciplina",
    accountControlCenter: "Centro de control de cuenta",
    title: "Reglas y objetivos",
    description:
      "Define objetivos mensuales, establece los límites de la cuenta y mantén visibles las reglas operativas antes de que el rendimiento se vuelva emocional.",
    backToAccountHub: "Volver al Account Hub",

    monthlyPnl: "PnL mensual",
    winRate: "Win Rate",
    maxDrawdown: "Drawdown máximo",
    tradesThisMonth: "Trades este mes",
    target: "Objetivo",
    limit: "Límite",
    dailyLimit: "Límite diario",
    noMonthlyProfitTarget:
      "No hay objetivo mensual de beneficio.",
    noWinRateTarget: "No hay objetivo de win rate.",
    noDrawdownLimit: "No hay límite de drawdown.",
    noDailyTradeLimit:
      "No hay límite diario de trades.",

    performanceTargets: "Objetivos de rendimiento",
    monthlyGoals: "Objetivos mensuales",
    monthlyProfitGoalPlaceholder:
      "Objetivo mensual de beneficio",
    monthlyWinRateGoalPlaceholder:
      "Objetivo mensual de win rate %",
    maxDrawdownLimitPlaceholder:
      "Límite máximo de drawdown %",
    maxTradesPerDayPlaceholder:
      "Máximo de trades por día",
    saveGoals: "Guardar objetivos",

    operatingFramework: "Marco operativo",
    disciplineRules: "Reglas de disciplina",
    rules: [
      {
        title: "Sin revenge trading",
        description:
          "No abras un nuevo trade para recuperar emocionalmente una pérdida.",
      },
      {
        title: "Sin entradas impulsivas",
        description:
          "Cada entrada debe venir de un setup válido y una razón clara.",
      },
      {
        title: "Respeta los límites de riesgo",
        description:
          "La cuenta debe mantenerse dentro de los límites de drawdown y frecuencia operativa.",
      },
      {
        title: "Detente después de errores emocionales",
        description:
          "Si la calidad de ejecución baja, la prioridad pasa a ser la protección.",
      },
      {
        title: "Proceso antes que beneficio",
        description:
          "El objetivo es proteger la consistencia, no perseguir un único resultado.",
      },
    ],

    profitProgress: "Progreso de beneficio",
    monthlyTarget: "Objetivo mensual",
    currentProgress: "Progreso actual",
    monthlyProfitTargetReached:
      "Objetivo mensual de beneficio alcanzado.",
    remainingToReachTarget:
      "restante para alcanzar el objetivo.",
    setMonthlyProfitTarget:
      "Define un objetivo mensual de beneficio para seguir el progreso.",
    winRateProgress: "Progreso Win Rate",
    drawdownUsage: "Uso del drawdown",

    controlSignals: "Señales de control",
    riskGuardrails: "Guardrails de riesgo",
    busiestDay: "Día más activo",
    busiestDayDescription:
      "Máximo de trades abiertos en un solo día este mes.",
    dailyLimitUsage: "Uso del límite diario",
    dailyLimitUsageDescription:
      "Basado en el día de trading más activo.",
    closedTrades: "Trades cerrados",
    closedTradesDescription:
      "Usados para calcular el win rate actual.",
  },

  fr: {
    disciplineSystem: "Système de discipline",
    accountControlCenter: "Centre de contrôle du compte",
    title: "Règles et objectifs",
    description:
      "Définis les objectifs mensuels, fixe les limites du compte et garde les règles opérationnelles visibles avant que la performance devienne émotionnelle.",
    backToAccountHub: "Retour à l’Account Hub",

    monthlyPnl: "PnL mensuel",
    winRate: "Win Rate",
    maxDrawdown: "Drawdown maximal",
    tradesThisMonth: "Trades ce mois-ci",
    target: "Objectif",
    limit: "Limite",
    dailyLimit: "Limite quotidienne",
    noMonthlyProfitTarget:
      "Aucun objectif de profit mensuel défini.",
    noWinRateTarget: "Aucun objectif de win rate défini.",
    noDrawdownLimit: "Aucune limite de drawdown définie.",
    noDailyTradeLimit:
      "Aucune limite quotidienne de trades définie.",

    performanceTargets: "Objectifs de performance",
    monthlyGoals: "Objectifs mensuels",
    monthlyProfitGoalPlaceholder:
      "Objectif de profit mensuel",
    monthlyWinRateGoalPlaceholder:
      "Objectif win rate mensuel %",
    maxDrawdownLimitPlaceholder:
      "Limite de drawdown maximal %",
    maxTradesPerDayPlaceholder:
      "Maximum de trades par jour",
    saveGoals: "Enregistrer les objectifs",

    operatingFramework: "Cadre opérationnel",
    disciplineRules: "Règles de discipline",
    rules: [
      {
        title: "Pas de revenge trading",
        description:
          "N’ouvre pas un nouveau trade pour récupérer émotionnellement une perte.",
      },
      {
        title: "Pas d’entrées impulsives",
        description:
          "Chaque entrée doit venir d’un setup valide et d’une raison claire.",
      },
      {
        title: "Respecte les limites de risque",
        description:
          "Le compte doit rester dans les limites de drawdown et de fréquence opérationnelle.",
      },
      {
        title: "Arrête-toi après des erreurs émotionnelles",
        description:
          "Si la qualité d’exécution baisse, la priorité devient la protection.",
      },
      {
        title: "Le processus avant le profit",
        description:
          "L’objectif est de protéger la constance, pas de courir après un seul résultat.",
      },
    ],

    profitProgress: "Progression du profit",
    monthlyTarget: "Objectif mensuel",
    currentProgress: "Progression actuelle",
    monthlyProfitTargetReached:
      "Objectif de profit mensuel atteint.",
    remainingToReachTarget:
      "restant pour atteindre l’objectif.",
    setMonthlyProfitTarget:
      "Définis un objectif de profit mensuel pour suivre la progression.",
    winRateProgress: "Progression Win Rate",
    drawdownUsage: "Utilisation du drawdown",

    controlSignals: "Signaux de contrôle",
    riskGuardrails: "Garde-fous de risque",
    busiestDay: "Jour le plus actif",
    busiestDayDescription:
      "Nombre maximal de trades ouverts en une journée ce mois-ci.",
    dailyLimitUsage: "Utilisation de la limite quotidienne",
    dailyLimitUsageDescription:
      "Basé sur la journée de trading la plus active.",
    closedTrades: "Trades clôturés",
    closedTradesDescription:
      "Utilisés pour calculer le win rate actuel.",
  },

  de: {
    disciplineSystem: "Disziplin-System",
    accountControlCenter: "Account-Kontrollzentrum",
    title: "Regeln & Ziele",
    description:
      "Setze monatliche Ziele, definiere Account-Limits und halte operative Regeln sichtbar, bevor Performance emotional wird.",
    backToAccountHub: "Zurück zum Account Hub",

    monthlyPnl: "Monatlicher PnL",
    winRate: "Win Rate",
    maxDrawdown: "Maximaler Drawdown",
    tradesThisMonth: "Trades diesen Monat",
    target: "Ziel",
    limit: "Limit",
    dailyLimit: "Tageslimit",
    noMonthlyProfitTarget:
      "Kein monatliches Gewinnziel gesetzt.",
    noWinRateTarget: "Kein Win-Rate-Ziel gesetzt.",
    noDrawdownLimit: "Kein Drawdown-Limit gesetzt.",
    noDailyTradeLimit:
      "Kein tägliches Trade-Limit gesetzt.",

    performanceTargets: "Performance-Ziele",
    monthlyGoals: "Monatliche Ziele",
    monthlyProfitGoalPlaceholder:
      "Monatliches Gewinnziel",
    monthlyWinRateGoalPlaceholder:
      "Monatliches Win-Rate-Ziel %",
    maxDrawdownLimitPlaceholder:
      "Maximales Drawdown-Limit %",
    maxTradesPerDayPlaceholder:
      "Maximale Trades pro Tag",
    saveGoals: "Ziele speichern",

    operatingFramework: "Operatives Framework",
    disciplineRules: "Disziplin-Regeln",
    rules: [
      {
        title: "Kein Revenge Trading",
        description:
          "Öffne keinen neuen Trade, um einen Verlust emotional zurückzuholen.",
      },
      {
        title: "Keine impulsiven Einstiege",
        description:
          "Jeder Einstieg muss aus einem validen Setup und einem klaren Grund entstehen.",
      },
      {
        title: "Risikogrenzen respektieren",
        description:
          "Der Account muss innerhalb der Drawdown- und Trade-Frequenz-Limits bleiben.",
      },
      {
        title: "Nach emotionalen Fehlern stoppen",
        description:
          "Wenn die Execution-Qualität fällt, wird Schutz zur Priorität.",
      },
      {
        title: "Prozess vor Profit",
        description:
          "Das Ziel ist, Konsistenz zu schützen, nicht ein einzelnes Ergebnis zu jagen.",
      },
    ],

    profitProgress: "Gewinnfortschritt",
    monthlyTarget: "Monatliches Ziel",
    currentProgress: "Aktueller Fortschritt",
    monthlyProfitTargetReached:
      "Monatliches Gewinnziel erreicht.",
    remainingToReachTarget:
      "verbleibend bis zum Ziel.",
    setMonthlyProfitTarget:
      "Setze ein monatliches Gewinnziel, um den Fortschritt zu verfolgen.",
    winRateProgress: "Win-Rate-Fortschritt",
    drawdownUsage: "Drawdown-Nutzung",

    controlSignals: "Kontrollsignale",
    riskGuardrails: "Risiko-Leitplanken",
    busiestDay: "Aktivster Tag",
    busiestDayDescription:
      "Maximale Anzahl an Trades, die diesen Monat an einem Tag eröffnet wurden.",
    dailyLimitUsage: "Nutzung des Tageslimits",
    dailyLimitUsageDescription:
      "Basierend auf dem aktivsten Trading-Tag.",
    closedTrades: "Geschlossene Trades",
    closedTradesDescription:
      "Wird zur Berechnung der aktuellen Win Rate genutzt.",
  },
};

function formatPercent(
  value: number,
  language?: string | null,
  digits = 2
) {
  return (
    new Intl.NumberFormat(
      getLocaleFromLanguage(language),
      {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }
    ).format(value) + "%"
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

function ProgressBar({
  value,
  tone = "bg-accent",
}: {
  value: number;
  tone?: string;
}) {
  const width = Math.min(
    Math.max(value, 0),
    100
  );

  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full ${tone}`}
        style={{
          width: `${width}%`,
        }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "text-white",
}: StatCardProps) {
  return (
    <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">
            {label}
          </p>

          <h2 className={`mt-3 text-3xl font-black ${tone}`}>
            {value}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-accent-bright">
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default async function RulesPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

  const membership = await getAccountMembershipWithAccount(
    session.user.id,
    accountId
  );

  if (!membership) {
    redirect("/accounts");
  }

  if (!canManageRules(membership)) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    membership.tradingAccount.status === "ARCHIVED"
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

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

  const t = rulesLabels[language];

  const account = membership.tradingAccount;
  const currency = account.currency || "USD";

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);

  const monthLabel = now.toLocaleDateString(
    getLocaleFromLanguage(language),
    {
      month: "long",
      year: "numeric",
    }
  );

  const goal =
    await prisma.tradingGoal.findUnique({
      where: {
        tradingAccountId_month_year: {
          tradingAccountId: accountId,
          month,
          year,
        },
      },
    });

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
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

  const totalPnl = trades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const closedTrades = trades.filter(
    (trade) =>
      trade.outcome === "win" ||
      trade.outcome === "loss" ||
      trade.outcome === "be"
  );

  const wins = closedTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const winRate =
    closedTrades.length > 0
      ? (wins / closedTrades.length) * 100
      : 0;

  const maxDrawdown =
    trades.length > 0
      ? Math.abs(
        Math.min(
          ...trades.map(
            (trade) =>
              trade.drawdownPercent || 0
          )
        )
      )
      : 0;

  const tradesByDay = new Map<string, number>();

  for (const trade of trades) {
    const key = trade.openDate.toDateString();
    tradesByDay.set(
      key,
      (tradesByDay.get(key) || 0) + 1
    );
  }

  const busiestDayTrades =
    tradesByDay.size > 0
      ? Math.max(...tradesByDay.values())
      : 0;

  const monthlyProfitGoal =
    goal?.monthlyProfitGoal || 0;

  const monthlyWinRateGoal =
    goal?.monthlyWinRateGoal || 0;

  const maxDrawdownLimit =
    goal?.maxDrawdownLimit || 0;

  const maxTradesPerDay =
    goal?.maxTradesPerDay || 0;

  const profitProgress =
    monthlyProfitGoal > 0
      ? (totalPnl / monthlyProfitGoal) * 100
      : 0;

  const winRateProgress =
    monthlyWinRateGoal > 0
      ? (winRate / monthlyWinRateGoal) * 100
      : 0;

  const drawdownUsage =
    maxDrawdownLimit > 0
      ? (maxDrawdown / maxDrawdownLimit) * 100
      : 0;

  const tradeLimitUsage =
    maxTradesPerDay > 0
      ? (busiestDayTrades / maxTradesPerDay) * 100
      : 0;

  const profitRemaining =
    monthlyProfitGoal > 0
      ? monthlyProfitGoal - totalPnl
      : null;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_35%)]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                {t.disciplineSystem}
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                {monthLabel}
              </span>
            </div>

            <p className="text-sm text-gray-400">
              {t.accountControlCenter}
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-6xl">
              {t.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400">
              {t.description}
            </p>
          </div>

          <Link
            href={`/accounts/${accountId}`}
            className="w-fit rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
          >
            {t.backToAccountHub}
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t.monthlyPnl}
          value={formatCurrencyByLanguage(
            totalPnl,
            currency,
            language
          )}
          description={
            monthlyProfitGoal > 0
              ? `${t.target}: ${formatCurrencyByLanguage(
                monthlyProfitGoal,
                currency,
                language
              )}`
              : t.noMonthlyProfitTarget
          }
          icon={TrendingUp}
          tone={getResultTone(totalPnl)}
        />

        <StatCard
          label={t.winRate}
          value={formatPercent(winRate, language)}
          description={
            monthlyWinRateGoal > 0
              ? `${t.target}: ${formatPercent(
                monthlyWinRateGoal,
                language
              )}`
              : t.noWinRateTarget
          }
          icon={Target}
          tone={
            winRate >= monthlyWinRateGoal &&
              monthlyWinRateGoal > 0
              ? "text-green-400"
              : "text-yellow-400"
          }
        />

        <StatCard
          label={t.maxDrawdown}
          value={formatPercent(maxDrawdown, language)}
          description={
            maxDrawdownLimit > 0
              ? `${t.limit}: ${formatPercent(
                maxDrawdownLimit,
                language
              )}`
              : t.noDrawdownLimit
          }
          icon={ShieldCheck}
          tone={
            maxDrawdownLimit > 0 &&
              maxDrawdown > maxDrawdownLimit
              ? "text-red-400"
              : "text-yellow-300"
          }
        />

        <StatCard
          label={t.tradesThisMonth}
          value={trades.length}
          description={
            maxTradesPerDay > 0
              ? `${t.dailyLimit}: ${maxTradesPerDay}`
              : t.noDailyTradeLimit
          }
          icon={Activity}
          tone="text-accent-bright"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form
          action={saveTradingGoals.bind(
            null,
            accountId
          )}
          className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                {t.performanceTargets}
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                {t.monthlyGoals}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-accent">
              <Gauge size={20} />
            </div>
          </div>

          <div className="space-y-4">
            <input
              name="monthlyProfitGoal"
              type="number"
              step="0.01"
              placeholder={
                t.monthlyProfitGoalPlaceholder
              }
              defaultValue={
                goal?.monthlyProfitGoal || ""
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
            />

            <input
              name="monthlyWinRateGoal"
              type="number"
              step="0.01"
              placeholder={
                t.monthlyWinRateGoalPlaceholder
              }
              defaultValue={
                goal?.monthlyWinRateGoal || ""
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
            />

            <input
              name="maxDrawdownLimit"
              type="number"
              step="0.01"
              placeholder={
                t.maxDrawdownLimitPlaceholder
              }
              defaultValue={
                goal?.maxDrawdownLimit || ""
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
            />

            <input
              name="maxTradesPerDay"
              type="number"
              placeholder={
                t.maxTradesPerDayPlaceholder
              }
              defaultValue={
                goal?.maxTradesPerDay || ""
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
            />

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent p-4 font-black text-white transition hover:bg-accent-bright"
            >
              <Save size={18} />
              {t.saveGoals}
            </button>
          </div>
        </form>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                {t.operatingFramework}
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                {t.disciplineRules}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-yellow-300">
              <ListChecks size={20} />
            </div>
          </div>

          <div className="space-y-3">
            {t.rules.map((rule) => (
              <div
                key={rule.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="font-bold text-white">
                  {rule.title}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                {t.profitProgress}
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                {t.monthlyTarget}
              </h2>
            </div>

            <CalendarDays className="text-accent" />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-gray-400">
                {t.currentProgress}
              </span>

              <span className={getResultTone(totalPnl)}>
                {formatPercent(
                  profitProgress,
                  language,
                  0
                )}
              </span>
            </div>

            <ProgressBar value={profitProgress} />

            <p className="mt-4 text-sm leading-6 text-gray-500">
              {profitRemaining !== null
                ? profitRemaining <= 0
                  ? t.monthlyProfitTargetReached
                  : `${formatCurrencyByLanguage(
                    profitRemaining,
                    currency,
                    language
                  )} ${t.remainingToReachTarget}`
                : t.setMonthlyProfitTarget}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.winRateProgress}
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            {formatPercent(
              winRateProgress,
              language,
              0
            )}
          </h2>

          <ProgressBar
            value={winRateProgress}
            tone="bg-cyan-300"
          />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.drawdownUsage}
          </p>

          <h2
            className={`mt-3 text-3xl font-black ${drawdownUsage > 100
                ? "text-red-400"
                : "text-yellow-300"
              }`}
          >
            {formatPercent(
              drawdownUsage,
              language,
              0
            )}
          </h2>

          <ProgressBar
            value={drawdownUsage}
            tone={
              drawdownUsage > 100
                ? "bg-red-400"
                : "bg-yellow-300"
            }
          />
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-red-300">
            <AlertTriangle size={20} />
          </div>

          <div>
            <p className="text-sm text-gray-400">
              {t.controlSignals}
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              {t.riskGuardrails}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.busiestDay}
            </p>

            <h3 className="mt-3 text-3xl font-black text-white">
              {busiestDayTrades}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {t.busiestDayDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.dailyLimitUsage}
            </p>

            <h3
              className={`mt-3 text-3xl font-black ${tradeLimitUsage > 100
                  ? "text-red-400"
                  : "text-yellow-300"
                }`}
            >
              {formatPercent(
                tradeLimitUsage,
                language,
                0
              )}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {t.dailyLimitUsageDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.closedTrades}
            </p>

            <h3 className="mt-3 text-3xl font-black text-accent-bright">
              {closedTrades.length}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {t.closedTradesDescription}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
