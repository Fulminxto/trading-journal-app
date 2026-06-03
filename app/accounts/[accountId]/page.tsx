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
      "Questo account è archiviato. Puoi consultare lo storico, ma le funzioni operative e di gestione sono limitate.",
    heroDescription:
      "Centro operativo dell’account. Da qui puoi accedere rapidamente a performance, diario, analytics, report, team e impostazioni operative.",

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
      "Le aree principali per leggere e gestire l’andamento dell’account.",
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
          "Vista principale dell’account: equity, performance, target e stato operativo generale.",
      },
      diary: {
        title: "Trading Diary",
        eyebrow: "Execution",
        description:
          "Consulta, inserisci e revisiona le operazioni con dati, note, sessioni e qualità esecutiva.",
      },
      calendar: {
        title: "Calendar",
        eyebrow: "Daily view",
        description:
          "Leggi la performance giornaliera e individua i giorni migliori, peggiori e più stabili.",
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
          "Analisi avanzata su simboli, sessioni, psicologia, qualità esecutiva e pattern ricorrenti.",
      },
      reports: {
        title: "Reports",
        eyebrow: "Review",
        description:
          "Riepiloghi professionali per leggere risultati, punti forti, criticità e focus operativo.",
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
          "Controlla membri, ruoli, performance individuali, attività e accessi dell’account.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Osserva presenza live, attività del team, leaderboard e segnali collaborativi.",
      },
      rules: {
        title: "Rules & Goals",
        eyebrow: "Control",
        description:
          "Gestisci obiettivi, regole operative, limiti e struttura di controllo dell’account.",
      },
      integrations: {
        title: "Integrations",
        eyebrow: "Sync",
        description:
          "Configura MT5, broker sync, modalità di import e stato delle integrazioni automatiche.",
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
      "The main areas to read and manage the account’s progress.",
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
    hubBadge: "Центр акаунта",
    selectedAccount: "Обраний акаунт",
    archived: "Архівовано",
    archivedMessage:
      "Цей акаунт архівовано. Ви можете переглядати історію, але операційні та управлінські функції обмежені.",
    heroDescription:
      "Операційний центр акаунта. Звідси можна швидко перейти до performance, щоденника, аналітики, звітів, команди та операційних налаштувань.",

    currentEquity: "Поточний equity",
    totalPnl: "Загальний PnL",
    winRate: "Win Rate",
    totalTrades: "Усього угод",

    initialBalance: "Початковий баланс",
    targetProgress: "Прогрес цілі",
    needsReview: "Потребує перегляду",
    members: "Учасники",

    accountType: "Тип акаунта",
    profitTarget: "Ціль прибутку",
    maxDrawdown: "Макс. drawdown",

    coreSectionTitle: "Основний workspace",
    coreSectionDescription:
      "Головні розділи для читання та керування розвитком акаунта.",
    intelligenceSectionTitle: "Інтелектуальний шар",
    intelligenceSectionDescription:
      "Аналітика, звіти, сесії та просунута операційна підтримка.",
    managementSectionTitle: "Керування",
    managementSectionDescription:
      "Керування учасниками, workspace, правилами та інтеграціями.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "Огляд",
        description:
          "Головний вигляд акаунта: equity, performance, цілі та загальний операційний стан.",
      },
      diary: {
        title: "Торговий щоденник",
        eyebrow: "Виконання",
        description:
          "Переглядайте, додавайте та аналізуйте угоди з даними, нотатками, сесіями та якістю виконання.",
      },
      calendar: {
        title: "Календар",
        eyebrow: "Денний огляд",
        description:
          "Читайте денну performance та знаходьте найкращі, найгірші й найстабільніші дні.",
      },
      equity: {
        title: "Equity",
        eyebrow: "Капітал",
        description:
          "Відстежуйте equity curve, drawdown, зростання акаунта та рух капіталу.",
      },
      analytics: {
        title: "Аналітика",
        eyebrow: "Intelligence",
        description:
          "Просунута аналітика символів, сесій, психології, якості виконання та повторюваних патернів.",
      },
      reports: {
        title: "Звіти",
        eyebrow: "Review",
        description:
          "Професійні підсумки для читання результатів, сильних сторін, проблем і операційного фокусу.",
      },
      sessions: {
        title: "Сесії",
        eyebrow: "Планування",
        description:
          "Плануйте та переглядайте сесії з контекстом, дисципліною та pre/post-market фокусом.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "Операційна пам’ять, поведінкові патерни, сигнали ризику та підтримка рішень.",
      },
      members: {
        title: "Учасники",
        eyebrow: "Команда",
        description:
          "Контролюйте учасників, ролі, індивідуальну performance, активність і доступи.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Спостерігайте live presence, активність команди, leaderboard та колаборативні сигнали.",
      },
      rules: {
        title: "Правила та цілі",
        eyebrow: "Контроль",
        description:
          "Керуйте цілями, операційними правилами, лімітами та структурою контролю акаунта.",
      },
      integrations: {
        title: "Інтеграції",
        eyebrow: "Sync",
        description:
          "Налаштовуйте MT5, broker sync, режими імпорту та статус автоматичних інтеграцій.",
      },
    },
  },

  ru: {
    hubBadge: "Центр аккаунта",
    selectedAccount: "Выбранный аккаунт",
    archived: "Архивирован",
    archivedMessage:
      "Этот аккаунт архивирован. Вы можете просматривать историю, но операционные и управленческие функции ограничены.",
    heroDescription:
      "Операционный центр аккаунта. Отсюда можно быстро перейти к performance, дневнику, аналитике, отчетам, команде и операционным настройкам.",

    currentEquity: "Текущий equity",
    totalPnl: "Общий PnL",
    winRate: "Win Rate",
    totalTrades: "Всего сделок",

    initialBalance: "Начальный баланс",
    targetProgress: "Прогресс цели",
    needsReview: "Требует проверки",
    members: "Участники",

    accountType: "Тип аккаунта",
    profitTarget: "Цель прибыли",
    maxDrawdown: "Макс. drawdown",

    coreSectionTitle: "Основной workspace",
    coreSectionDescription:
      "Главные разделы для анализа и управления прогрессом аккаунта.",
    intelligenceSectionTitle: "Интеллектуальный слой",
    intelligenceSectionDescription:
      "Аналитика, отчеты, сессии и продвинутая операционная поддержка.",
    managementSectionTitle: "Управление",
    managementSectionDescription:
      "Управление участниками, workspace, правилами и интеграциями.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "Обзор",
        description:
          "Главный вид аккаунта: equity, performance, цели и общий операционный статус.",
      },
      diary: {
        title: "Торговый дневник",
        eyebrow: "Исполнение",
        description:
          "Просматривайте, добавляйте и анализируйте сделки с данными, заметками, сессиями и качеством исполнения.",
      },
      calendar: {
        title: "Календарь",
        eyebrow: "Дневной обзор",
        description:
          "Читайте дневную performance и находите лучшие, худшие и самые стабильные дни.",
      },
      equity: {
        title: "Equity",
        eyebrow: "Капитал",
        description:
          "Отслеживайте equity curve, drawdown, рост аккаунта и движение капитала.",
      },
      analytics: {
        title: "Аналитика",
        eyebrow: "Intelligence",
        description:
          "Продвинутая аналитика символов, сессий, психологии, качества исполнения и повторяющихся паттернов.",
      },
      reports: {
        title: "Отчеты",
        eyebrow: "Review",
        description:
          "Профессиональные сводки для анализа результатов, сильных сторон, проблем и операционного фокуса.",
      },
      sessions: {
        title: "Сессии",
        eyebrow: "Планирование",
        description:
          "Планируйте и пересматривайте сессии с контекстом, дисциплиной и pre/post-market фокусом.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "Операционная память, поведенческие паттерны, сигналы риска и поддержка решений.",
      },
      members: {
        title: "Участники",
        eyebrow: "Команда",
        description:
          "Контролируйте участников, роли, индивидуальную performance, активность и доступы.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Следите за live presence, активностью команды, leaderboard и collaborative signals.",
      },
      rules: {
        title: "Правила и цели",
        eyebrow: "Контроль",
        description:
          "Управляйте целями, операционными правилами, лимитами и структурой контроля аккаунта.",
      },
      integrations: {
        title: "Интеграции",
        eyebrow: "Sync",
        description:
          "Настраивайте MT5, broker sync, режимы импорта и статус автоматических интеграций.",
      },
    },
  },

  es: {
    hubBadge: "Centro de cuenta",
    selectedAccount: "Cuenta seleccionada",
    archived: "Archivada",
    archivedMessage:
      "Esta cuenta está archivada. Puedes consultar el histórico, pero las funciones operativas y de gestión están limitadas.",
    heroDescription:
      "Centro operativo de la cuenta. Desde aquí puedes acceder rápidamente a performance, diario, analítica, informes, equipo y ajustes operativos.",

    currentEquity: "Equity actual",
    totalPnl: "PnL total",
    winRate: "Win Rate",
    totalTrades: "Operaciones totales",

    initialBalance: "Balance inicial",
    targetProgress: "Progreso del objetivo",
    needsReview: "Requiere revisión",
    members: "Miembros",

    accountType: "Tipo de cuenta",
    profitTarget: "Objetivo de beneficio",
    maxDrawdown: "Drawdown máximo",

    coreSectionTitle: "Workspace principal",
    coreSectionDescription:
      "Las áreas principales para leer y gestionar el progreso de la cuenta.",
    intelligenceSectionTitle: "Capa de inteligencia",
    intelligenceSectionDescription:
      "Analítica, informes, sesiones y soporte operativo avanzado.",
    managementSectionTitle: "Gestión",
    managementSectionDescription:
      "Gestión de miembros, workspace, reglas e integraciones.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "Resumen",
        description:
          "Vista principal de la cuenta: equity, performance, objetivos y estado operativo general.",
      },
      diary: {
        title: "Diario de trading",
        eyebrow: "Ejecución",
        description:
          "Consulta, introduce y revisa operaciones con datos, notas, sesiones y calidad de ejecución.",
      },
      calendar: {
        title: "Calendario",
        eyebrow: "Vista diaria",
        description:
          "Lee la performance diaria e identifica los mejores, peores y más estables días.",
      },
      equity: {
        title: "Equity",
        eyebrow: "Capital",
        description:
          "Sigue equity curve, drawdown, crecimiento de la cuenta y movimiento progresivo del capital.",
      },
      analytics: {
        title: "Analítica",
        eyebrow: "Intelligence",
        description:
          "Análisis avanzado de símbolos, sesiones, psicología, calidad de ejecución y patrones recurrentes.",
      },
      reports: {
        title: "Informes",
        eyebrow: "Review",
        description:
          "Resúmenes profesionales para leer resultados, fortalezas, debilidades y foco operativo.",
      },
      sessions: {
        title: "Sesiones",
        eyebrow: "Planificación",
        description:
          "Planifica y revisa sesiones operativas con contexto, disciplina y foco pre/post-market.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "Memoria operativa, patrones de comportamiento, señales de riesgo y soporte de decisión.",
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
          "Observa presencia en vivo, actividad del equipo, leaderboard y señales colaborativas.",
      },
      rules: {
        title: "Reglas y objetivos",
        eyebrow: "Control",
        description:
          "Gestiona objetivos, reglas operativas, límites y estructura de control de la cuenta.",
      },
      integrations: {
        title: "Integraciones",
        eyebrow: "Sync",
        description:
          "Configura MT5, broker sync, modos de importación y estado de integraciones automáticas.",
      },
    },
  },

  fr: {
    hubBadge: "Centre du compte",
    selectedAccount: "Compte sélectionné",
    archived: "Archivé",
    archivedMessage:
      "Ce compte est archivé. Vous pouvez consulter l’historique, mais les fonctions opérationnelles et de gestion sont limitées.",
    heroDescription:
      "Centre opérationnel du compte. Depuis ici, accédez rapidement à la performance, au journal, aux analytics, aux rapports, à l’équipe et aux paramètres opérationnels.",

    currentEquity: "Equity actuelle",
    totalPnl: "PnL total",
    winRate: "Win Rate",
    totalTrades: "Trades totaux",

    initialBalance: "Solde initial",
    targetProgress: "Progression de l’objectif",
    needsReview: "À revoir",
    members: "Membres",

    accountType: "Type de compte",
    profitTarget: "Objectif de profit",
    maxDrawdown: "Drawdown maximal",

    coreSectionTitle: "Workspace principal",
    coreSectionDescription:
      "Les zones principales pour lire et gérer l’évolution du compte.",
    intelligenceSectionTitle: "Couche d’intelligence",
    intelligenceSectionDescription:
      "Analytics, rapports, sessions et support opérationnel avancé.",
    managementSectionTitle: "Gestion",
    managementSectionDescription:
      "Gestion des membres, workspace, règles et intégrations.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "Vue d’ensemble",
        description:
          "Vue principale du compte : equity, performance, objectifs et état opérationnel général.",
      },
      diary: {
        title: "Journal de trading",
        eyebrow: "Exécution",
        description:
          "Consultez, ajoutez et révisez les trades avec données, notes, sessions et qualité d’exécution.",
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
          "Suivez l’equity curve, le drawdown, la croissance du compte et l’évolution du capital.",
      },
      analytics: {
        title: "Analytics",
        eyebrow: "Intelligence",
        description:
          "Analyse avancée des symboles, sessions, psychologie, qualité d’exécution et patterns récurrents.",
      },
      reports: {
        title: "Rapports",
        eyebrow: "Review",
        description:
          "Résumés professionnels pour lire les résultats, forces, faiblesses et focus opérationnel.",
      },
      sessions: {
        title: "Sessions",
        eyebrow: "Planification",
        description:
          "Planifiez et révisez les sessions opérationnelles avec contexte, discipline et focus pre/post-market.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "Mémoire opérationnelle, patterns comportementaux, signaux de risque et aide à la décision.",
      },
      members: {
        title: "Membres",
        eyebrow: "Équipe",
        description:
          "Contrôlez les membres, rôles, performance individuelle, activité et accès du compte.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Observez la présence live, l’activité de l’équipe, le leaderboard et les signaux collaboratifs.",
      },
      rules: {
        title: "Règles et objectifs",
        eyebrow: "Contrôle",
        description:
          "Gérez les objectifs, règles opérationnelles, limites et structure de contrôle du compte.",
      },
      integrations: {
        title: "Intégrations",
        eyebrow: "Sync",
        description:
          "Configurez MT5, broker sync, modes d’import et état des intégrations automatiques.",
      },
    },
  },

  de: {
    hubBadge: "Konto-Hub",
    selectedAccount: "Ausgewähltes Konto",
    archived: "Archiviert",
    archivedMessage:
      "Dieses Konto ist archiviert. Du kannst historische Daten ansehen, aber operative und administrative Funktionen sind eingeschränkt.",
    heroDescription:
      "Operatives Zentrum des Kontos. Von hier aus erreichst du schnell Performance, Tagebuch, Analytics, Berichte, Team und operative Einstellungen.",

    currentEquity: "Aktuelles Equity",
    totalPnl: "Gesamt-PnL",
    winRate: "Win Rate",
    totalTrades: "Trades gesamt",

    initialBalance: "Startkapital",
    targetProgress: "Ziel-Fortschritt",
    needsReview: "Review nötig",
    members: "Mitglieder",

    accountType: "Kontotyp",
    profitTarget: "Gewinnziel",
    maxDrawdown: "Max. Drawdown",

    coreSectionTitle: "Core workspace",
    coreSectionDescription:
      "Die wichtigsten Bereiche, um den Kontofortschritt zu lesen und zu verwalten.",
    intelligenceSectionTitle: "Intelligence layer",
    intelligenceSectionDescription:
      "Analytics, Berichte, Sessions und erweiterte operative Unterstützung.",
    managementSectionTitle: "Management",
    managementSectionDescription:
      "Verwaltung von Mitgliedern, Workspace, Regeln und Integrationen.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "Überblick",
        description:
          "Hauptansicht des Kontos: equity, performance, Ziele und allgemeiner operativer Status.",
      },
      diary: {
        title: "Trading-Tagebuch",
        eyebrow: "Execution",
        description:
          "Prüfe, erfasse und verbessere Trades mit Daten, Notizen, Sessions und Ausführungsqualität.",
      },
      calendar: {
        title: "Kalender",
        eyebrow: "Tagesansicht",
        description:
          "Lies die tägliche Performance und erkenne beste, schlechteste und stabilste Tage.",
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
          "Erweiterte Analyse von Symbolen, Sessions, Psychologie, Ausführungsqualität und wiederkehrenden Mustern.",
      },
      reports: {
        title: "Berichte",
        eyebrow: "Review",
        description:
          "Professionelle Zusammenfassungen zu Ergebnissen, Stärken, Schwächen und operativem Fokus.",
      },
      sessions: {
        title: "Sessions",
        eyebrow: "Planung",
        description:
          "Plane und überprüfe operative Sessions mit Kontext, Disziplin und pre/post-market Fokus.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "Operatives Gedächtnis, Verhaltensmuster, Risikosignale und Entscheidungsunterstützung.",
      },
      members: {
        title: "Mitglieder",
        eyebrow: "Team",
        description:
          "Kontrolliere Mitglieder, Rollen, individuelle Performance, Aktivität und Kontozugriffe.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Beobachte Live-Präsenz, Teamaktivität, Leaderboard und kollaborative Signale.",
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


