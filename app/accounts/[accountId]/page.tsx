import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookMarked,
  BookOpen,
  Bot,
  CalendarDays,
  CandlestickChart,
  ChevronRight,
  CircleAlert,
  FileText,
  Goal,
  Layers3,
  LineChart,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isManager as checkIsManager } from "@/lib/permissions";
import Card from "@/components/ui/Card";
import AccountCore from "@/components/accounts/AccountCore";
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
};

type AccountHubLabels = {
  hubBadge: string;
  selectedAccount: string;
  archived: string;
  archivedMessage: string;
  heroDescription: string;
  directoryEyebrow: string;
  directoryTitle: string;
  directoryDescription: string;

  currentEquity: string;
  totalPnl: string;
  winRate: string;
  totalTrades: string;

  initialBalance: string;
  targetProgress: string;
  needsReview: string;
  tradesNeedReview: string;
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
    playbook: HubCardText;
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
    directoryEyebrow: "Directory account",
    directoryTitle: "Ambienti applicazione",
    directoryDescription:
      "Apri gli ambienti operativi, di intelligence e controllo disponibili per il tuo ruolo.",

    currentEquity: "Current Equity",
    totalPnl: "Total PnL",
    winRate: "Win Rate",
    totalTrades: "Total Trades",

    initialBalance: "Initial Balance",
    targetProgress: "Target Progress",
    needsReview: "Needs Review",
    tradesNeedReview: "trade da revisionare",
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
    managementSectionTitle: "Account control",
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
      playbook: {
        title: "Playbook",
        eyebrow: "Strategie",
        description:
          "Crea e gestisci le strategie operative, collegale ai trade e analizza le performance per setup.",
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
    directoryEyebrow: "Account directory",
    directoryTitle: "Application rooms",
    directoryDescription:
      "Open the workspace, intelligence and control rooms available to your role.",

    currentEquity: "Current Equity",
    totalPnl: "Total PnL",
    winRate: "Win Rate",
    totalTrades: "Total Trades",

    initialBalance: "Initial Balance",
    targetProgress: "Target Progress",
    needsReview: "Needs Review",
    tradesNeedReview: "trades need review",
    members: "Members",

    accountType: "Account Type",
    profitTarget: "Profit Target",
    maxDrawdown: "Max Drawdown",

    coreSectionTitle: "Core workspace",
    coreSectionDescription:
      "The main areas to read and manage the account’s progress.",
    intelligenceSectionTitle: "Intelligence layer",
    intelligenceSectionDescription:
      "Analysis and decision-support tools.",
    managementSectionTitle: "Controllo account",
    managementSectionDescription:
      "Accessi, configurazione e standard operativi.",

    cards: {
      dashboard: {
        title: "Dashboard",
        eyebrow: "Overview",
        description:
          "Account summary and current operating condition.",
      },
      diary: {
        title: "Trading Diary",
        eyebrow: "Execution",
        description:
          "Enter, inspect and replay trading activity.",
      },
      calendar: {
        title: "Calendar",
        eyebrow: "Daily view",
        description:
          "Review daily performance and consistency.",
      },
      equity: {
        title: "Equity",
        eyebrow: "Capital",
        description:
          "Inspect capital growth and drawdown.",
      },
      analytics: {
        title: "Analytics",
        eyebrow: "Intelligence",
        description:
          "Diagnose execution, psychology and recurring patterns.",
      },
      reports: {
        title: "Reports",
        eyebrow: "Review",
        description:
          "Generate structured performance and risk reviews.",
      },
      sessions: {
        title: "Sessions",
        eyebrow: "Planning",
        description:
          "Plan, execute and review trading sessions.",
      },
      copilot: {
        title: "Copilot",
        eyebrow: "AI layer",
        description:
          "Use account evidence and operating rules for decisions.",
      },
      members: {
        title: "Members",
        eyebrow: "Team",
        description:
          "Review roles, permissions and collaboration boundaries.",
      },
      workspace: {
        title: "Workspace",
        eyebrow: "Command room",
        description:
          "Review readiness, access and account wiring.",
      },
      rules: {
        title: "Rules & Goals",
        eyebrow: "Control",
        description:
          "Define standards, limits and operating rules.",
      },
      integrations: {
        title: "Integrations",
        eyebrow: "Sync",
        description:
          "Configure manual and external account connections.",
      },
      playbook: {
        title: "Playbook",
        eyebrow: "Strategies",
        description:
          "Document the strategies the account is allowed to trade.",
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
    directoryEyebrow: "Каталог акаунта",
    directoryTitle: "Простори застосунку",
    directoryDescription:
      "Відкривайте доступні для вашої ролі робочі, аналітичні та контрольні простори.",

    currentEquity: "Поточний equity",
    totalPnl: "Загальний PnL",
    winRate: "Win Rate",
    totalTrades: "Усього угод",

    initialBalance: "Початковий баланс",
    targetProgress: "Прогрес цілі",
    needsReview: "Потребує перегляду",
    tradesNeedReview: "угод потребують перегляду",
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
      playbook: {
        title: "Playbook",
        eyebrow: "Стратегії",
        description:
          "Створюйте та керуйте торговими стратегіями, пов'язуйте їх з угодами та аналізуйте ефективність.",
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
    directoryEyebrow: "Каталог аккаунта",
    directoryTitle: "Разделы приложения",
    directoryDescription:
      "Открывайте доступные вашей роли рабочие, аналитические и контрольные разделы.",

    currentEquity: "Текущий equity",
    totalPnl: "Общий PnL",
    winRate: "Win Rate",
    totalTrades: "Всего сделок",

    initialBalance: "Начальный баланс",
    targetProgress: "Прогресс цели",
    needsReview: "Требует проверки",
    tradesNeedReview: "сделок требуют проверки",
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
      playbook: {
        title: "Playbook",
        eyebrow: "Стратегии",
        description:
          "Создавайте и управляйте торговыми стратегиями, связывайте их со сделками и анализируйте результаты.",
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
    directoryEyebrow: "Directorio de cuenta",
    directoryTitle: "Áreas de la aplicación",
    directoryDescription:
      "Abre las áreas de trabajo, inteligencia y control disponibles para tu rol.",

    currentEquity: "Equity actual",
    totalPnl: "PnL total",
    winRate: "Win Rate",
    totalTrades: "Operaciones totales",

    initialBalance: "Balance inicial",
    targetProgress: "Progreso del objetivo",
    needsReview: "Requiere revisión",
    tradesNeedReview: "operaciones requieren revisión",
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
      playbook: {
        title: "Playbook",
        eyebrow: "Estrategias",
        description:
          "Crea y gestiona tus estrategias operativas, vincúlalas a los trades y analiza el rendimiento por setup.",
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
    directoryEyebrow: "Répertoire du compte",
    directoryTitle: "Espaces de l’application",
    directoryDescription:
      "Ouvrez les espaces de travail, d’intelligence et de contrôle disponibles pour votre rôle.",

    currentEquity: "Equity actuelle",
    totalPnl: "PnL total",
    winRate: "Win Rate",
    totalTrades: "Trades totaux",

    initialBalance: "Solde initial",
    targetProgress: "Progression de l’objectif",
    needsReview: "À revoir",
    tradesNeedReview: "trades doivent être révisés",
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
      playbook: {
        title: "Playbook",
        eyebrow: "Stratégies",
        description:
          "Créez et gérez vos stratégies de trading, liez-les aux trades et analysez la performance par setup.",
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
    directoryEyebrow: "Kontoverzeichnis",
    directoryTitle: "Anwendungsbereiche",
    directoryDescription:
      "Öffne die für deine Rolle verfügbaren Arbeits-, Intelligence- und Kontrollbereiche.",

    currentEquity: "Aktuelles Equity",
    totalPnl: "Gesamt-PnL",
    winRate: "Win Rate",
    totalTrades: "Trades gesamt",

    initialBalance: "Startkapital",
    targetProgress: "Ziel-Fortschritt",
    needsReview: "Review nötig",
    tradesNeedReview: "Trades müssen geprüft werden",
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
      playbook: {
        title: "Playbook",
        eyebrow: "Strategien",
        description:
          "Erstellen und verwalten Sie Ihre Handelsstrategien, verknüpfen Sie sie mit Trades und analysieren Sie die Leistung.",
      },
    },
  },
};

function getResultTone(value: number) {
  if (value > 0) {
    return "text-green-400";
  }

  if (value < 0) {
    return "text-red-400";
  }

  return "text-muted";
}

function ModuleRow({ card, isLast }: { card: HubCard; isLast: boolean }) {
  const Icon = card.icon;

  return (
    <Link
      href={card.href}
      className={`group flex min-h-20 items-center gap-3 px-1 py-4 outline-none transition-colors duration-base hover:bg-white/[0.025] focus-visible:rounded-inner focus-visible:ring-2 focus-visible:ring-accent-bright/50 ${
        isLast ? "" : "border-b-[0.5px] border-flash/[0.08]"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 text-muted transition-colors duration-base group-hover:text-accent-bright">
        <Icon size={17} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-medium text-flash">
          {card.title}
        </span>
        <span className="mt-1 block text-caption leading-5 text-muted">
          {card.description}
        </span>
      </span>
      <ChevronRight
        size={17}
        aria-hidden="true"
        className="shrink-0 text-muted-faint transition-transform duration-base group-hover:translate-x-0.5 group-hover:text-accent-bright"
      />
    </Link>
  );
}

function ModulePanel({
  title,
  description,
  cards,
}: {
  title: string;
  description: string;
  cards: HubCard[];
}) {
  return (
    <Card className="p-5">
      <div className="border-b-[0.5px] border-flash/[0.08] pb-4">
        <p className="text-micro uppercase tracking-label text-accent-bright">
          {title}
        </p>
        <h3 className="mt-2 text-subsection text-flash">{description}</h3>
      </div>
      <nav aria-label={title}>
        {cards.map((card, index) => (
          <ModuleRow
            key={card.href}
            card={card}
            isLast={index === cards.length - 1}
          />
        ))}
      </nav>
    </Card>
  );
}

function QuickAccessTile({ card }: { card: HubCard }) {
  const Icon = card.icon;

  return (
    <Link
      href={card.href}
      className="group flex min-h-24 items-center gap-3 rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 p-4 outline-none transition-all duration-base hover:-translate-y-0.5 hover:border-accent-bright/30 focus-visible:ring-2 focus-visible:ring-accent-bright/60"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-1 text-muted group-hover:text-accent-bright">
        <Icon size={17} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-medium text-flash">
          {card.title}
        </span>
        <span className="mt-1 block line-clamp-2 text-caption leading-5 text-muted">
          {card.description}
        </span>
      </span>
      <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-muted-faint" />
    </Link>
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

  const t = accountHubLabels.en;

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
        drawdownPercent: true,
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

  const isManager = checkIsManager(membership);
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

  const canCreateTrades =
    isManager || membership.canCreateTrades;

  const currency = account.currency || "USD";
  const initialBalance = account.initialBalance || 0;

  const totalTrades = trades.length;

  const totalPnl = trades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const currentEquity =
    trades.length > 0
      ? trades[trades.length - 1].equity ||
      initialBalance
      : initialBalance;

  const needsReviewCount = trades.filter(
    (trade) => trade.needsReview
  ).length;

  const currentDrawdown =
    totalTrades > 0 && trades[trades.length - 1].drawdownPercent !== null
      ? trades[trades.length - 1].drawdownPercent
      : null;
  const hasDrawdownBoundary =
    account.maxDrawdown !== null &&
    account.maxDrawdown !== undefined &&
    account.maxDrawdown > 0;
  const hasProfitTarget =
    account.profitTarget !== null &&
    account.profitTarget !== undefined &&
    account.profitTarget > 0;
  const drawdownMagnitude = Math.abs(currentDrawdown ?? 0);
  const drawdownState =
    currentDrawdown === null
      ? "Not measured"
      : !hasDrawdownBoundary
        ? "No boundary"
        : drawdownMagnitude > account.maxDrawdown!
          ? "Breached"
          : drawdownMagnitude === account.maxDrawdown!
            ? "Boundary reached"
            : "Within limit";
  const drawdownTone =
    drawdownState === "Breached" || drawdownState === "Boundary reached"
      ? "text-negative"
      : "text-muted";
  const drawdownDetail = hasDrawdownBoundary
    ? `${drawdownState} · ${formatPercentByLanguage(account.maxDrawdown!, language)} max boundary`
    : drawdownState;

  const coreCards: HubCard[] = [
    {
      href: `/accounts/${account.id}/dashboard`,
      ...t.cards.dashboard,
      icon: BarChart3,
      show: true,
    },
    {
      href: `/accounts/${account.id}/diary`,
      ...t.cards.diary,
      icon: CandlestickChart,
      show: true,
    },
    {
      href: `/accounts/${account.id}/calendar`,
      ...t.cards.calendar,
      icon: CalendarDays,
      show: true,
    },
    {
      href: `/accounts/${account.id}/equity`,
      ...t.cards.equity,
      icon: LineChart,
      show: true,
    },
  ];

  const intelligenceCards: HubCard[] = [
    {
      href: `/accounts/${account.id}/analytics`,
      ...t.cards.analytics,
      icon: Activity,
      show: canViewAnalytics,
    },
    {
      href: `/accounts/${account.id}/reports`,
      ...t.cards.reports,
      icon: FileText,
      show: canViewReports,
    },
    {
      href: `/accounts/${account.id}/sessions`,
      ...t.cards.sessions,
      icon: BookOpen,
      show: canUseSessions && !isArchived,
    },
    {
      href: `/accounts/${account.id}/copilot`,
      ...t.cards.copilot,
      icon: Bot,
      show: canViewCopilot && !isArchived,
    },
  ];

  const managementCards: HubCard[] = [
    {
      href: `/accounts/${account.id}/workspace`,
      ...t.cards.workspace,
      icon: Layers3,
      show: canViewMembers && !isArchived,
    },
    {
      href: `/accounts/${account.id}/members`,
      ...t.cards.members,
      icon: Users,
      show: canViewMembers,
    },
    {
      href: `/accounts/${account.id}/rules`,
      ...t.cards.rules,
      icon: Goal,
      show: canManageAccount && !isArchived,
    },
    {
      href: `/accounts/${account.id}/integrations`,
      ...t.cards.integrations,
      icon: Zap,
      show: canManageAccount && !isArchived,
    },
    {
      href: `/accounts/${account.id}/playbook`,
      ...t.cards.playbook,
      icon: BookMarked,
      show: !isArchived,
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

  const riskRequiresAction =
    hasDrawdownBoundary &&
    currentDrawdown !== null &&
    drawdownMagnitude >= account.maxDrawdown!;
  const nextMove = riskRequiresAction
    ? {
        key: "risk",
        title: "Review the account risk boundary",
        description:
          "Current drawdown has reached the configured account boundary.",
        href:
          canManageAccount && !isArchived
            ? `/accounts/${account.id}/rules`
            : `/accounts/${account.id}/equity`,
        label:
          canManageAccount && !isArchived
            ? "Open Rules & Goals"
            : "Open Equity",
      }
    : needsReviewCount > 0
      ? {
          key: "reviews",
          title: "Review pending trades",
          description:
            "Complete the open reviews before evaluating execution consistency.",
          href: `/accounts/${account.id}/diary`,
          label: "Open Trading Diary",
        }
      : totalTrades === 0
        ? {
            key: "trades",
            title: "Record the first trade",
            description: "Start building the account’s operational history.",
            href:
              canCreateTrades && !isArchived
                ? `/accounts/${account.id}/diary/new`
                : `/accounts/${account.id}/diary`,
            label:
              canCreateTrades && !isArchived
                ? "Add first trade"
                : "Open Trading Diary",
          }
        : (!hasProfitTarget || !hasDrawdownBoundary) &&
            canManageAccount &&
            !isArchived
          ? {
              key: "standards",
              title: "Configure operating standards",
              description:
                "Complete the account target and drawdown boundaries.",
              href: `/accounts/${account.id}/rules`,
              label: "Open Rules & Goals",
            }
          : {
              key: "performance",
              title: "Review current performance",
              description: "The account has no immediate operating blockers.",
              href: `/accounts/${account.id}/dashboard`,
              label: "Open Dashboard",
            };

  const attentionSignals = [
    ...(riskRequiresAction
      ? [
          {
            key: "risk",
            text:
              drawdownState === "Breached"
                ? "Drawdown boundary breached"
                : "Drawdown boundary reached",
          },
        ]
      : []),
    ...(needsReviewCount > 0
      ? [
          {
            key: "reviews",
            text: `${needsReviewCount} ${needsReviewCount === 1 ? "trade needs" : "trades need"} review`,
          },
        ]
      : []),
    ...(!hasProfitTarget
      ? [{ key: "standards", text: "Profit target not configured" }]
      : []),
    ...(!hasDrawdownBoundary
      ? [{ key: "standards", text: "Drawdown boundary not configured" }]
      : []),
    ...(totalTrades === 0
      ? [{ key: "trades", text: "No trades recorded" }]
      : []),
  ]
    .filter((signal) => signal.key !== nextMove.key)
    .slice(0, 3);

  const quickAccessCards = [
    coreCards[0],
    coreCards[1],
    coreCards[2],
    intelligenceCards[2],
    intelligenceCards[0],
    intelligenceCards[1],
  ].filter((card) => card.show);

  return (
    <div className="space-y-6">
      <Card className="reveal-rise p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-pill border-[0.5px] border-accent-bright/25 bg-accent-bright/[0.08] px-3 py-1 text-micro font-medium uppercase tracking-label text-accent-bright">
                Selected account · {account.type} account
              </span>
              <span className="rounded-pill border-[0.5px] border-flash/[0.1] bg-surface-2 px-3 py-1 text-micro font-medium uppercase tracking-label text-muted">
                {isArchived ? "Archived" : account.status}
              </span>
              <span className="rounded-pill border-[0.5px] border-flash/[0.1] bg-surface-2 px-3 py-1 text-micro font-medium uppercase tracking-label text-muted">
                {membership.role}
              </span>
            </div>
            <h1 className="mt-3 break-words text-section text-flash">
              {account.name}
            </h1>
          </div>
          <p className="text-caption text-muted">
            {membersCount} {membersCount === 1 ? "member" : "members"}
          </p>
        </div>
        {isArchived && (
          <p className="mt-3 border-t-[0.5px] border-flash/[0.08] pt-3 text-caption leading-5 text-muted">
            This account is archived. Operational and management rooms remain limited.
          </p>
        )}
      </Card>

      <Card variant="hero" className="reveal-rise p-5 sm:p-6" style={{ animationDelay: "60ms" }}>
        <AccountCore
          accountId={account.id}
          accountName={account.name}
          status={isArchived ? "Archived" : account.status}
          totalPnl={formatCurrencyByLanguage(totalPnl, currency, language)}
          totalPnlTone={getResultTone(totalPnl)}
          currentEquity={formatCurrencyByLanguage(currentEquity, currency, language)}
          currentDrawdown={
            currentDrawdown === null
              ? "Not measured"
              : formatPercentByLanguage(currentDrawdown, language)
          }
          drawdownDetail={drawdownDetail}
          drawdownTone={drawdownTone}
          needsReview={needsReviewCount}
          totalTrades={totalTrades}
        />

        <div className="mt-6 border-t-[0.5px] border-flash/[0.1] pt-5">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-micro uppercase tracking-label text-accent-bright">
                Next move
              </p>
              <h2 className="mt-2 text-subsection text-flash">{nextMove.title}</h2>
              <p className="mt-2 text-caption leading-5 text-muted">
                {nextMove.description}
              </p>
            </div>
            <Link
              href={nextMove.href}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/25 bg-accent-bright/[0.07] px-4 py-3 text-sm font-medium text-accent-bright outline-none transition-all duration-base hover:-translate-y-0.5 hover:border-accent-bright/45 focus-visible:ring-2 focus-visible:ring-accent-bright/60 sm:w-auto"
            >
              {nextMove.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>

          <section className="mt-4 flex flex-col gap-2 border-t-[0.5px] border-flash/[0.07] pt-4 sm:flex-row sm:items-center">
            <p className="shrink-0 text-micro uppercase tracking-label text-muted-faint">
              Attention
            </p>
            {attentionSignals.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {attentionSignals.map((signal) => (
                  <li
                    key={`${signal.key}-${signal.text}`}
                    className="inline-flex items-center gap-2 rounded-pill border-[0.5px] border-yellow-200/15 bg-yellow-200/[0.04] px-3 py-1.5 text-caption text-muted"
                  >
                    <CircleAlert size={14} aria-hidden="true" className="shrink-0 text-yellow-200" />
                    {signal.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-caption text-muted">
                No immediate operational warnings.
              </p>
            )}
          </section>
        </div>
      </Card>

      <section className="reveal-rise" style={{ animationDelay: "100ms" }}>
        <p className="text-micro uppercase tracking-label text-accent-bright">
          Quick access
        </p>
        <h2 className="mt-2 text-section text-flash">Primary rooms</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {quickAccessCards.map((card) => (
            <QuickAccessTile key={card.href} card={card} />
          ))}
        </div>
      </section>

      <Card className="reveal-rise p-0" style={{ animationDelay: "140ms" }}>
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-bright/60 sm:p-6 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="block text-body font-medium text-flash">
                All application rooms
              </span>
              <span className="mt-1 block text-caption text-muted">
                Open the complete account directory.
              </span>
            </span>
            <ChevronRight
              size={18}
              aria-hidden="true"
              className="shrink-0 text-muted transition-transform duration-base group-open:rotate-90"
            />
          </summary>
          <div className="border-t-[0.5px] border-flash/[0.08] p-5 sm:p-6">
            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {sections.map((section) => (
                <ModulePanel
                  key={section.title}
                  title={section.title}
                  description={section.description}
                  cards={section.cards}
                />
              ))}
            </div>
          </div>
        </details>
      </Card>
    </div>
  );
}


