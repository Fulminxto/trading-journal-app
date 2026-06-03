"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  CheckCircle2,
  FileText,
  Gauge,
  Layers3,
  LineChart,
  ListChecks,
  Lock,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

const ONBOARDING_STORAGE_KEY =
  "trading-journal-onboarding";

type OnboardingCardText = {
  title: string;
  description: string;
};

type OnboardingStepText = {
  phase: string;
  eyebrow: string;
  title: string;
  description: string;
  spotlight?: string;
  cards: OnboardingCardText[];
};

type OnboardingCard = OnboardingCardText & {
  icon: LucideIcon;
  tone: string;
};

type OnboardingStep = Omit<
  OnboardingStepText,
  "cards"
> & {
  icon: LucideIcon;
  accent: string;
  cards: OnboardingCard[];
};

type OnboardingCopyText = {
  privateAccess: string;
  stepCounter: (
    current: number,
    total: number
  ) => string;
  back: string;
  continue: string;
  enterVoltis: string;
  close: string;
  steps: OnboardingStepText[];
};

type OnboardingCopy = Omit<
  OnboardingCopyText,
  "steps"
> & {
  steps: OnboardingStep[];
};

const stepVisuals: {
  icon: LucideIcon;
  accent: string;
  cards: {
    icon: LucideIcon;
    tone: string;
  }[];
}[] = [
    {
      icon: Lock,
      accent: "text-cyan-300",
      cards: [
        {
          icon: ShieldCheck,
          tone: "text-cyan-300",
        },
        {
          icon: Sparkles,
          tone: "text-green-400",
        },
      ],
    },
    {
      icon: Target,
      accent: "text-green-400",
      cards: [
        {
          icon: BarChart3,
          tone: "text-cyan-300",
        },
        {
          icon: ShieldCheck,
          tone: "text-yellow-300",
        },
        {
          icon: CheckCircle2,
          tone: "text-green-400",
        },
      ],
    },
    {
      icon: Gauge,
      accent: "text-yellow-300",
      cards: [
        {
          icon: Gauge,
          tone: "text-yellow-300",
        },
        {
          icon: ShieldCheck,
          tone: "text-green-400",
        },
        {
          icon: BookOpen,
          tone: "text-cyan-300",
        },
      ],
    },
    {
      icon: Layers3,
      accent: "text-cyan-300",
      cards: [
        {
          icon: Layers3,
          tone: "text-cyan-300",
        },
        {
          icon: BarChart3,
          tone: "text-green-400",
        },
      ],
    },
    {
      icon: BookOpen,
      accent: "text-green-400",
      cards: [
        {
          icon: BookOpen,
          tone: "text-green-400",
        },
        {
          icon: CalendarDays,
          tone: "text-blue-400",
        },
        {
          icon: LineChart,
          tone: "text-purple-300",
        },
      ],
    },
    {
      icon: BarChart3,
      accent: "text-purple-300",
      cards: [
        {
          icon: BarChart3,
          tone: "text-purple-300",
        },
        {
          icon: FileText,
          tone: "text-cyan-300",
        },
        {
          icon: ListChecks,
          tone: "text-yellow-300",
        },
      ],
    },
    {
      icon: Bot,
      accent: "text-cyan-300",
      cards: [
        {
          icon: Gauge,
          tone: "text-green-400",
        },
        {
          icon: Bot,
          tone: "text-cyan-300",
        },
      ],
    },
    {
      icon: Users,
      accent: "text-green-400",
      cards: [
        {
          icon: Users,
          tone: "text-green-400",
        },
        {
          icon: Zap,
          tone: "text-cyan-300",
        },
        {
          icon: SettingsIcon,
          tone: "text-yellow-300",
        },
      ],
    },
    {
      icon: Sparkles,
      accent: "text-cyan-300",
      cards: [
        {
          icon: BookOpen,
          tone: "text-green-400",
        },
        {
          icon: BarChart3,
          tone: "text-purple-300",
        },
        {
          icon: ShieldCheck,
          tone: "text-cyan-300",
        },
      ],
    },
  ];

const onboardingText: Record<
  AppLanguage,
  OnboardingCopyText
> = {
  it: {
    privateAccess: "VOLTIS Private Access",
    stepCounter: (current, total) => `${current}/${total}`,
    back: "Indietro",
    continue: "Continua",
    enterVoltis: "Entra in VOLTIS",
    close: "Chiudi onboarding",
    steps: [
      {
        phase: "Visione",
        eyebrow: "Private access",
        title:
          "VOLTIS non Ã¨ una normale app di trading",
        description:
          "VOLTIS Ã¨ un private trading operating system creato per trader selezionati che vogliono misurare, proteggere e migliorare il proprio comportamento operativo.",
        spotlight:
          "Non Ã¨ aperto a tutti. Non Ã¨ pensato per il mercato di massa. Ãˆ uno strumento serio per chi vuole trattare il trading seriamente.",
        cards: [
          {
            title: "Accesso selezionato",
            description:
              "VOLTIS non nasce per essere usato da chiunque. Lâ€™accesso Ã¨ controllato, privato e intenzionale.",
          },
          {
            title: "Non Ã¨ solo gratuito",
            description:
              "Non lo usi perchÃ© costa poco. Lo usi perchÃ© sei dentro qualcosa che non Ã¨ in vendita a tutti.",
          },
        ],
      },
      {
        phase: "Filosofia",
        eyebrow: "Measure. Protect. Improve.",
        title: "La missione Ã¨ renderti piÃ¹ lucido",
        description:
          "VOLTIS non serve solo a mostrarti numeri. Serve a farti capire come tradi, quali pattern ripeti, dove perdi disciplina e cosa devi proteggere.",
        spotlight:
          "Il vero obiettivo non Ã¨ sapere solo quanto hai guadagnato o perso. Ãˆ capire che tipo di trader stai diventando.",
        cards: [
          {
            title: "Measure",
            description:
              "Misura performance, equity, win rate, drawdown, sessioni e qualitÃ  operativa.",
          },
          {
            title: "Protect",
            description:
              "Proteggi capitale, disciplina, luciditÃ  e rispetto delle regole operative.",
          },
          {
            title: "Improve",
            description:
              "Migliora esecuzione, review, comportamento e capacitÃ  decisionale nel tempo.",
          },
        ],
      },
      {
        phase: "Metodo",
        eyebrow: "Operating flow",
        title: "Il flusso corretto non Ã¨ casuale",
        description:
          "VOLTIS funziona al meglio quando lo usi come un sistema operativo: prepari, esegui, registri, analizzi, proteggi e migliori.",
        spotlight:
          "Plan â†’ Execute â†’ Journal â†’ Review â†’ Detect Patterns â†’ Protect Discipline â†’ Improve Behavior",
        cards: [
          {
            title: "Prima della sessione",
            description:
              "Definisci focus, rischio, scenario, regole e condizioni operative.",
          },
          {
            title: "Durante lâ€™operativitÃ ",
            description:
              "Rispetta il piano, evita impulsivitÃ  e mantieni controllo sul rischio.",
          },
          {
            title: "Dopo la sessione",
            description:
              "Registra, rivedi, individua errori, lezioni e pattern ricorrenti.",
          },
        ],
      },
      {
        phase: "Account",
        eyebrow: "Account Hub & Dashboard",
        title:
          "Parti dal centro operativo dellâ€™account",
        description:
          "Quando entri in un account, parti dallâ€™Account Hub. Da lÃ¬ puoi raggiungere Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot e gestione.",
        cards: [
          {
            title: "Account Hub",
            description:
              "La prima schermata dellâ€™account. Ti orienta e ti porta nelle sezioni giuste.",
          },
          {
            title: "Dashboard",
            description:
              "Mostra subito equity, PnL, win rate, target, drawdown e stato generale.",
          },
        ],
      },
      {
        phase: "Execution",
        eyebrow: "Diary, Calendar, Equity",
        title: "Costruisci memoria operativa",
        description:
          "Le pagine core raccolgono la base del tuo trading: operazioni, calendario, crescita dellâ€™equity e andamento del conto.",
        cards: [
          {
            title: "Trading Diary",
            description:
              "Registra trade, setup, emozione, esecuzione, errori, note e lezioni.",
          },
          {
            title: "Calendar",
            description:
              "Leggi la performance giorno per giorno e riconosci giornate positive, negative o flat.",
          },
          {
            title: "Equity",
            description:
              "Controlla crescita del capitale, equity curve, drawdown, best trade e worst trade.",
          },
        ],
      },
      {
        phase: "Intelligence",
        eyebrow: "Analytics, Reports, Rules",
        title: "Capisci cosa funziona davvero",
        description:
          "Analytics, Reports e Rules trasformano i dati in lettura operativa: simboli migliori, sessioni, errori, psicologia, obiettivi e limiti.",
        cards: [
          {
            title: "Analytics",
            description:
              "Analizza simboli, direzione, sessioni, emozioni, execution quality e pattern.",
          },
          {
            title: "Reports",
            description:
              "Leggi riepiloghi professionali su performance, rischi, punti forti e debolezze.",
          },
          {
            title: "Rules & Goals",
            description:
              "Imposta obiettivi, limiti, regole operative e segnali di controllo.",
          },
        ],
      },
      {
        phase: "Protection",
        eyebrow: "Sessions & Copilot",
        title: "Proteggi luciditÃ  e disciplina",
        description:
          "VOLTIS non deve solo mostrarti risultati. Deve aiutarti a capire quando stai perdendo luciditÃ , disciplina o controllo operativo.",
        spotlight:
          "Il valore piÃ¹ grande arriva quando VOLTIS inizia a riconoscere ciÃ² che tu rischi di non vedere.",
        cards: [
          {
            title: "Sessions",
            description:
              "Prepara la sessione prima di tradare e rivedila dopo con focus, bias e review.",
          },
          {
            title: "Copilot",
            description:
              "Osserva memoria, pattern, segnali di rischio e comportamento operativo.",
          },
        ],
      },
      {
        phase: "Management",
        eyebrow: "Workspace, Members, Integrations",
        title: "Gestisci struttura, team e sistema",
        description:
          "VOLTIS puÃ² essere anche un ambiente privato di lavoro: membri, workspace, permessi, integrazioni, impostazioni e backup.",
        cards: [
          {
            title: "Workspace & Members",
            description:
              "Gestisci membri, presenza, attivitÃ , performance individuali e accessi.",
          },
          {
            title: "Integrations",
            description:
              "Prepara MT5, broker sync e modalitÃ  manuale, automatica o ibrida.",
          },
          {
            title: "Settings",
            description:
              "Gestisci lingua, valuta, onboarding, backup e impostazioni generali.",
          },
        ],
      },
      {
        phase: "Principio finale",
        eyebrow: "Use it seriously",
        title:
          "VOLTIS vale quanto il modo in cui lo usi",
        description:
          "Non serve riempire lâ€™app di dati casuali. Serve usarla con costanza, precisione e rispetto del processo.",
        spotlight:
          "Se hai accesso a VOLTIS, sei dentro qualcosa di serio.",
        cards: [
          {
            title: "Inserisci dati veri",
            description:
              "Ogni trade registrato bene rende piÃ¹ utile ogni report, grafico e analisi futura.",
          },
          {
            title: "Rivedi con luciditÃ ",
            description:
              "Non usare VOLTIS solo quando vinci. Usalo soprattutto quando devi correggere qualcosa.",
          },
          {
            title: "Proteggi il processo",
            description:
              "Profitto e disciplina non devono essere separati. VOLTIS esiste per collegarli.",
          },
        ],
      },
    ],
  },

  en: {
    privateAccess: "VOLTIS Private Access",
    stepCounter: (current, total) => `${current}/${total}`,
    back: "Back",
    continue: "Continue",
    enterVoltis: "Enter VOLTIS",
    close: "Close onboarding",
    steps: [
      {
        phase: "Vision",
        eyebrow: "Private access",
        title: "VOLTIS is not a normal trading app",
        description:
          "VOLTIS is a private trading operating system created for selected traders who want to measure, protect and improve their operational behavior.",
        spotlight:
          "It is not open to everyone. It is not designed for the mass market. It is a serious tool for traders who want to treat trading seriously.",
        cards: [
          {
            title: "Selected access",
            description:
              "VOLTIS is not built for everyone. Access is controlled, private and intentional.",
          },
          {
            title: "Not just free",
            description:
              "You do not use it because it is cheap. You use it because you are inside something not sold to everyone.",
          },
        ],
      },
      {
        phase: "Philosophy",
        eyebrow: "Measure. Protect. Improve.",
        title: "The mission is to make you clearer",
        description:
          "VOLTIS is not only here to show numbers. It helps you understand how you trade, which patterns repeat, where discipline drops and what you must protect.",
        spotlight:
          "The real goal is not only to know how much you won or lost. It is to understand what kind of trader you are becoming.",
        cards: [
          {
            title: "Measure",
            description:
              "Measure performance, equity, win rate, drawdown, sessions and execution quality.",
          },
          {
            title: "Protect",
            description:
              "Protect capital, discipline, clarity and respect for operational rules.",
          },
          {
            title: "Improve",
            description:
              "Improve execution, review, behavior and decision quality over time.",
          },
        ],
      },
      {
        phase: "Method",
        eyebrow: "Operating flow",
        title: "The correct flow is not random",
        description:
          "VOLTIS works best when you use it as an operating system: plan, execute, journal, review, protect and improve.",
        spotlight:
          "Plan â†’ Execute â†’ Journal â†’ Review â†’ Detect Patterns â†’ Protect Discipline â†’ Improve Behavior",
        cards: [
          {
            title: "Before the session",
            description:
              "Define focus, risk, scenario, rules and operating conditions.",
          },
          {
            title: "During trading",
            description:
              "Respect the plan, avoid impulsiveness and keep risk under control.",
          },
          {
            title: "After the session",
            description:
              "Journal, review, identify mistakes, lessons and repeated patterns.",
          },
        ],
      },
      {
        phase: "Account",
        eyebrow: "Account Hub & Dashboard",
        title: "Start from the account control center",
        description:
          "When you enter an account, start from the Account Hub. From there you reach Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot and management.",
        cards: [
          {
            title: "Account Hub",
            description:
              "The first account screen. It orients you and sends you to the right areas.",
          },
          {
            title: "Dashboard",
            description:
              "Immediately see equity, PnL, win rate, target, drawdown and general status.",
          },
        ],
      },
      {
        phase: "Execution",
        eyebrow: "Diary, Calendar, Equity",
        title: "Build operational memory",
        description:
          "The core pages collect the base of your trading: trades, calendar, equity growth and account progress.",
        cards: [
          {
            title: "Trading Diary",
            description:
              "Record trades, setup, emotion, execution, mistakes, notes and lessons.",
          },
          {
            title: "Calendar",
            description:
              "Read daily performance and identify positive, negative or flat days.",
          },
          {
            title: "Equity",
            description:
              "Track capital growth, equity curve, drawdown, best trade and worst trade.",
          },
        ],
      },
      {
        phase: "Intelligence",
        eyebrow: "Analytics, Reports, Rules",
        title: "Understand what really works",
        description:
          "Analytics, Reports and Rules turn data into operational reading: best symbols, sessions, mistakes, psychology, goals and limits.",
        cards: [
          {
            title: "Analytics",
            description:
              "Analyze symbols, direction, sessions, emotions, execution quality and patterns.",
          },
          {
            title: "Reports",
            description:
              "Read professional summaries about performance, risks, strengths and weaknesses.",
          },
          {
            title: "Rules & Goals",
            description:
              "Set targets, limits, operating rules and control signals.",
          },
        ],
      },
      {
        phase: "Protection",
        eyebrow: "Sessions & Copilot",
        title: "Protect clarity and discipline",
        description:
          "VOLTIS must not only show results. It must help you understand when you are losing clarity, discipline or operational control.",
        spotlight:
          "The greatest value comes when VOLTIS starts recognizing what you risk not seeing.",
        cards: [
          {
            title: "Sessions",
            description:
              "Prepare the session before trading and review it after with focus, bias and review.",
          },
          {
            title: "Copilot",
            description:
              "Observe memory, patterns, risk signals and operational behavior.",
          },
        ],
      },
      {
        phase: "Management",
        eyebrow: "Workspace, Members, Integrations",
        title: "Manage structure, team and system",
        description:
          "VOLTIS can also be a private work environment: members, workspace, permissions, integrations, settings and backup.",
        cards: [
          {
            title: "Workspace & Members",
            description:
              "Manage members, presence, activity, individual performance and access.",
          },
          {
            title: "Integrations",
            description:
              "Prepare MT5, broker sync and manual, automatic or hybrid mode.",
          },
          {
            title: "Settings",
            description:
              "Manage language, currency, onboarding, backup and general settings.",
          },
        ],
      },
      {
        phase: "Final principle",
        eyebrow: "Use it seriously",
        title: "VOLTIS is worth the way you use it",
        description:
          "The goal is not to fill the app with random data. The goal is to use it with consistency, precision and respect for the process.",
        spotlight:
          "If you have access to VOLTIS, you are inside something serious.",
        cards: [
          {
            title: "Enter real data",
            description:
              "Every well-recorded trade makes every future report, chart and analysis more useful.",
          },
          {
            title: "Review with clarity",
            description:
              "Do not use VOLTIS only when you win. Use it especially when you need to correct something.",
          },
          {
            title: "Protect the process",
            description:
              "Profit and discipline must not be separated. VOLTIS exists to connect them.",
          },
        ],
      },
    ],
  },

  uk: {
    privateAccess: "VOLTIS Private Access",
    stepCounter: (current, total) => `${current}/${total}`,
    back: "ÐÐ°Ð·Ð°Ð´",
    continue: "ÐŸÑ€Ð¾Ð´Ð¾Ð²Ð¶Ð¸Ñ‚Ð¸",
    enterVoltis: "Ð£Ð²Ñ–Ð¹Ñ‚Ð¸ Ñƒ VOLTIS",
    close: "Ð—Ð°ÐºÑ€Ð¸Ñ‚Ð¸ Ð¾Ð½Ð±Ð¾Ñ€Ð´Ð¸Ð½Ð³",
    steps: [
      {
        phase: "Ð‘Ð°Ñ‡ÐµÐ½Ð½Ñ",
        eyebrow: "Private access",
        title: "VOLTIS â€” Ñ†Ðµ Ð½Ðµ Ð·Ð²Ð¸Ñ‡Ð°Ð¹Ð½Ð¸Ð¹ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ð¸Ð¹ Ð·Ð°ÑÑ‚Ð¾ÑÑƒÐ½Ð¾Ðº",
        description:
          "VOLTIS â€” Ñ†Ðµ Ð¿Ñ€Ð¸Ð²Ð°Ñ‚Ð½Ð° Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð° ÑÐ¸ÑÑ‚ÐµÐ¼Ð° Ð´Ð»Ñ Ñ‚Ñ€ÐµÐ¹Ð´Ð¸Ð½Ð³Ñƒ, ÑÑ‚Ð²Ð¾Ñ€ÐµÐ½Ð° Ð´Ð»Ñ Ð¾Ð±Ñ€Ð°Ð½Ð¸Ñ… Ñ‚Ñ€ÐµÐ¹Ð´ÐµÑ€Ñ–Ð², ÑÐºÑ– Ñ…Ð¾Ñ‡ÑƒÑ‚ÑŒ Ð²Ð¸Ð¼Ñ–Ñ€ÑŽÐ²Ð°Ñ‚Ð¸, Ð·Ð°Ñ…Ð¸Ñ‰Ð°Ñ‚Ð¸ Ñ‚Ð° Ð¿Ð¾ÐºÑ€Ð°Ñ‰ÑƒÐ²Ð°Ñ‚Ð¸ ÑÐ²Ð¾ÑŽ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ñƒ Ð¿Ð¾Ð²ÐµÐ´Ñ–Ð½ÐºÑƒ.",
        spotlight:
          "Ð’Ñ–Ð½ Ð½Ðµ Ð²Ñ–Ð´ÐºÑ€Ð¸Ñ‚Ð¸Ð¹ Ð´Ð»Ñ Ð²ÑÑ–Ñ…. Ð’Ñ–Ð½ Ð½Ðµ ÑÑ‚Ð²Ð¾Ñ€ÐµÐ½Ð¸Ð¹ Ð´Ð»Ñ Ð¼Ð°ÑÐ¾Ð²Ð¾Ð³Ð¾ Ñ€Ð¸Ð½ÐºÑƒ. Ð¦Ðµ ÑÐµÑ€Ð¹Ð¾Ð·Ð½Ð¸Ð¹ Ñ–Ð½ÑÑ‚Ñ€ÑƒÐ¼ÐµÐ½Ñ‚ Ð´Ð»Ñ Ñ‚Ð¸Ñ…, Ñ…Ñ‚Ð¾ Ñ…Ð¾Ñ‡Ðµ ÑÑ‚Ð°Ð²Ð¸Ñ‚Ð¸ÑÑ Ð´Ð¾ Ñ‚Ñ€ÐµÐ¹Ð´Ð¸Ð½Ð³Ñƒ ÑÐµÑ€Ð¹Ð¾Ð·Ð½Ð¾.",
        cards: [
          {
            title: "Ð’Ð¸Ð±Ñ–Ñ€ÐºÐ¾Ð²Ð¸Ð¹ Ð´Ð¾ÑÑ‚ÑƒÐ¿",
            description:
              "VOLTIS Ð½Ðµ ÑÑ‚Ð²Ð¾Ñ€ÐµÐ½Ð¸Ð¹ Ð´Ð»Ñ Ð±ÑƒÐ´ÑŒ-ÐºÐ¾Ð³Ð¾. Ð”Ð¾ÑÑ‚ÑƒÐ¿ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒÐ¾Ð²Ð°Ð½Ð¸Ð¹, Ð¿Ñ€Ð¸Ð²Ð°Ñ‚Ð½Ð¸Ð¹ Ñ– ÑÐ²Ñ–Ð´Ð¾Ð¼Ð¸Ð¹.",
          },
          {
            title: "Ð¦Ðµ Ð½Ðµ Ð¿Ñ€Ð¾ÑÑ‚Ð¾ Ð±ÐµÐ·ÐºÐ¾ÑˆÑ‚Ð¾Ð²Ð½Ð¾",
            description:
              "Ð¢Ð¸ ÐºÐ¾Ñ€Ð¸ÑÑ‚ÑƒÑ”ÑˆÑÑ Ð½Ð¸Ð¼ Ð½Ðµ Ñ‚Ð¾Ð¼Ñƒ, Ñ‰Ð¾ Ð²Ñ–Ð½ Ð´ÐµÑˆÐµÐ²Ð¸Ð¹. Ð¢Ð¸ Ð²ÑÐµÑ€ÐµÐ´Ð¸Ð½Ñ– Ñ‚Ð¾Ð³Ð¾, Ñ‰Ð¾ Ð½Ðµ Ð¿Ñ€Ð¾Ð´Ð°Ñ”Ñ‚ÑŒÑÑ Ð²ÑÑ–Ð¼.",
          },
        ],
      },
      {
        phase: "Ð¤Ñ–Ð»Ð¾ÑÐ¾Ñ„Ñ–Ñ",
        eyebrow: "Measure. Protect. Improve.",
        title: "ÐœÑ–ÑÑ–Ñ â€” Ð·Ñ€Ð¾Ð±Ð¸Ñ‚Ð¸ Ñ‚ÐµÐ±Ðµ Ð±Ñ–Ð»ÑŒÑˆ ÑÑÐ½Ð¸Ð¼",
        description:
          "VOLTIS Ð½Ðµ Ð¿Ñ€Ð¾ÑÑ‚Ð¾ Ð¿Ð¾ÐºÐ°Ð·ÑƒÑ” Ñ†Ð¸Ñ„Ñ€Ð¸. Ð’Ñ–Ð½ Ð´Ð¾Ð¿Ð¾Ð¼Ð°Ð³Ð°Ñ” Ð·Ñ€Ð¾Ð·ÑƒÐ¼Ñ–Ñ‚Ð¸, ÑÐº Ñ‚Ð¸ Ñ‚Ð¾Ñ€Ð³ÑƒÑ”Ñˆ, ÑÐºÑ– Ð¿Ð°Ñ‚ÐµÑ€Ð½Ð¸ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€ÑŽÑ”Ñˆ, Ð´Ðµ Ð²Ñ‚Ñ€Ð°Ñ‡Ð°Ñ”Ñˆ Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ñ–Ð½Ñƒ Ñ– Ñ‰Ð¾ Ð¿Ð¾Ñ‚Ñ€Ñ–Ð±Ð½Ð¾ Ð·Ð°Ñ…Ð¸Ñ‰Ð°Ñ‚Ð¸.",
        spotlight:
          "Ð¡Ð¿Ñ€Ð°Ð²Ð¶Ð½Ñ Ð¼ÐµÑ‚Ð° â€” Ð½Ðµ Ð»Ð¸ÑˆÐµ Ð·Ð½Ð°Ñ‚Ð¸, ÑÐºÑ–Ð»ÑŒÐºÐ¸ Ñ‚Ð¸ Ð·Ð°Ñ€Ð¾Ð±Ð¸Ð² Ð°Ð±Ð¾ Ð²Ñ‚Ñ€Ð°Ñ‚Ð¸Ð². ÐœÐµÑ‚Ð° â€” Ð·Ñ€Ð¾Ð·ÑƒÐ¼Ñ–Ñ‚Ð¸, ÑÐºÐ¸Ð¼ Ñ‚Ñ€ÐµÐ¹Ð´ÐµÑ€Ð¾Ð¼ Ñ‚Ð¸ ÑÑ‚Ð°Ñ”Ñˆ.",
        cards: [
          {
            title: "Measure",
            description:
              "Ð’Ð¸Ð¼Ñ–Ñ€ÑŽÐ¹ performance, equity, win rate, drawdown, ÑÐµÑÑ–Ñ— Ñ‚Ð° ÑÐºÑ–ÑÑ‚ÑŒ Ð²Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ.",
          },
          {
            title: "Protect",
            description:
              "Ð—Ð°Ñ…Ð¸Ñ‰Ð°Ð¹ ÐºÐ°Ð¿Ñ–Ñ‚Ð°Ð», Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ñ–Ð½Ñƒ, ÑÑÐ½Ñ–ÑÑ‚ÑŒ Ñ– Ð´Ð¾Ñ‚Ñ€Ð¸Ð¼Ð°Ð½Ð½Ñ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð¸Ñ… Ð¿Ñ€Ð°Ð²Ð¸Ð».",
          },
          {
            title: "Improve",
            description:
              "ÐŸÐ¾ÐºÑ€Ð°Ñ‰ÑƒÐ¹ Ð²Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ, review, Ð¿Ð¾Ð²ÐµÐ´Ñ–Ð½ÐºÑƒ Ñ‚Ð° ÑÐºÑ–ÑÑ‚ÑŒ Ñ€Ñ–ÑˆÐµÐ½ÑŒ Ð· Ñ‡Ð°ÑÐ¾Ð¼.",
          },
        ],
      },
      {
        phase: "ÐœÐµÑ‚Ð¾Ð´",
        eyebrow: "Operating flow",
        title: "ÐŸÑ€Ð°Ð²Ð¸Ð»ÑŒÐ½Ð¸Ð¹ Ð¿Ð¾Ñ‚Ñ–Ðº Ð½Ðµ Ñ” Ð²Ð¸Ð¿Ð°Ð´ÐºÐ¾Ð²Ð¸Ð¼",
        description:
          "VOLTIS Ð¿Ñ€Ð°Ñ†ÑŽÑ” Ð½Ð°Ð¹ÐºÑ€Ð°Ñ‰Ðµ, ÐºÐ¾Ð»Ð¸ Ñ‚Ð¸ Ð²Ð¸ÐºÐ¾Ñ€Ð¸ÑÑ‚Ð¾Ð²ÑƒÑ”Ñˆ Ð¹Ð¾Ð³Ð¾ ÑÐº Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ñƒ ÑÐ¸ÑÑ‚ÐµÐ¼Ñƒ: Ð¿Ð»Ð°Ð½ÑƒÑ”Ñˆ, Ð²Ð¸ÐºÐ¾Ð½ÑƒÑ”Ñˆ, Ð·Ð°Ð¿Ð¸ÑÑƒÑ”Ñˆ, Ð°Ð½Ð°Ð»Ñ–Ð·ÑƒÑ”Ñˆ, Ð·Ð°Ñ…Ð¸Ñ‰Ð°Ñ”Ñˆ Ñ– Ð¿Ð¾ÐºÑ€Ð°Ñ‰ÑƒÑ”Ñˆ.",
        spotlight:
          "Plan â†’ Execute â†’ Journal â†’ Review â†’ Detect Patterns â†’ Protect Discipline â†’ Improve Behavior",
        cards: [
          {
            title: "ÐŸÐµÑ€ÐµÐ´ ÑÐµÑÑ–Ñ”ÑŽ",
            description:
              "Ð’Ð¸Ð·Ð½Ð°Ñ‡ focus, risk, scenario, Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð° Ñ‚Ð° Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ñ– ÑƒÐ¼Ð¾Ð²Ð¸.",
          },
          {
            title: "ÐŸÑ–Ð´ Ñ‡Ð°Ñ Ñ‚Ð¾Ñ€Ð³Ñ–Ð²Ð»Ñ–",
            description:
              "Ð”Ð¾Ñ‚Ñ€Ð¸Ð¼ÑƒÐ¹ÑÑ Ð¿Ð»Ð°Ð½Ñƒ, ÑƒÐ½Ð¸ÐºÐ°Ð¹ Ñ–Ð¼Ð¿ÑƒÐ»ÑŒÑÐ¸Ð²Ð½Ð¾ÑÑ‚Ñ– Ñ‚Ð° Ñ‚Ñ€Ð¸Ð¼Ð°Ð¹ Ñ€Ð¸Ð·Ð¸Ðº Ð¿Ñ–Ð´ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÐµÐ¼.",
          },
          {
            title: "ÐŸÑ–ÑÐ»Ñ ÑÐµÑÑ–Ñ—",
            description:
              "Ð—Ð°Ð¿Ð¸ÑˆÐ¸, Ð¿ÐµÑ€ÐµÐ³Ð»ÑÐ½ÑŒ, Ð·Ð½Ð°Ð¹Ð´Ð¸ Ð¿Ð¾Ð¼Ð¸Ð»ÐºÐ¸, ÑƒÑ€Ð¾ÐºÐ¸ Ñ‚Ð° Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€ÑŽÐ²Ð°Ð½Ñ– Ð¿Ð°Ñ‚ÐµÑ€Ð½Ð¸.",
          },
        ],
      },
      {
        phase: "ÐÐºÐ°ÑƒÐ½Ñ‚",
        eyebrow: "Account Hub & Dashboard",
        title: "ÐŸÐ¾Ñ‡Ð¸Ð½Ð°Ð¹ Ð· Ñ†ÐµÐ½Ñ‚Ñ€Ñƒ ÐºÐµÑ€ÑƒÐ²Ð°Ð½Ð½Ñ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð¾Ð¼",
        description:
          "ÐšÐ¾Ð»Ð¸ Ð²Ñ…Ð¾Ð´Ð¸Ñˆ Ð² Ð°ÐºÐ°ÑƒÐ½Ñ‚, Ð¿Ð¾Ñ‡Ð¸Ð½Ð°Ð¹ Ð· Account Hub. Ð—Ð²Ñ–Ð´Ñ‚Ð¸ Ñ‚Ð¸ Ð¿ÐµÑ€ÐµÑ…Ð¾Ð´Ð¸Ñˆ Ð´Ð¾ Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot Ñ– ÐºÐµÑ€ÑƒÐ²Ð°Ð½Ð½Ñ.",
        cards: [
          {
            title: "Account Hub",
            description:
              "ÐŸÐµÑ€ÑˆÐ° ÑÑ‚Ð¾Ñ€Ñ–Ð½ÐºÐ° Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°. Ð’Ð¾Ð½Ð° Ð¾Ñ€Ñ–Ñ”Ð½Ñ‚ÑƒÑ” Ñ‚ÐµÐ±Ðµ Ñ– Ð²ÐµÐ´Ðµ Ð² Ð¿Ð¾Ñ‚Ñ€Ñ–Ð±Ð½Ñ– Ñ€Ð¾Ð·Ð´Ñ–Ð»Ð¸.",
          },
          {
            title: "Dashboard",
            description:
              "ÐžÐ´Ñ€Ð°Ð·Ñƒ Ð¿Ð¾ÐºÐ°Ð·ÑƒÑ” equity, PnL, win rate, target, drawdown Ñ– Ð·Ð°Ð³Ð°Ð»ÑŒÐ½Ð¸Ð¹ ÑÑ‚Ð°Ð½.",
          },
        ],
      },
      {
        phase: "Execution",
        eyebrow: "Diary, Calendar, Equity",
        title: "Ð‘ÑƒÐ´ÑƒÐ¹ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ñƒ Ð¿Ð°Ð¼Ê¼ÑÑ‚ÑŒ",
        description:
          "Core-ÑÑ‚Ð¾Ñ€Ñ–Ð½ÐºÐ¸ Ð·Ð±Ð¸Ñ€Ð°ÑŽÑ‚ÑŒ Ð¾ÑÐ½Ð¾Ð²Ñƒ Ñ‚Ð²Ð¾Ð³Ð¾ Ñ‚Ñ€ÐµÐ¹Ð´Ð¸Ð½Ð³Ñƒ: ÑƒÐ³Ð¾Ð´Ð¸, ÐºÐ°Ð»ÐµÐ½Ð´Ð°Ñ€, Ð·Ñ€Ð¾ÑÑ‚Ð°Ð½Ð½Ñ equity Ñ– Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°.",
        cards: [
          {
            title: "Trading Diary",
            description:
              "Ð—Ð°Ð¿Ð¸ÑÑƒÐ¹ ÑƒÐ³Ð¾Ð´Ð¸, setup, ÐµÐ¼Ð¾Ñ†Ñ–Ñ—, Ð²Ð¸ÐºÐ¾Ð½Ð°Ð½Ð½Ñ, Ð¿Ð¾Ð¼Ð¸Ð»ÐºÐ¸, Ð½Ð¾Ñ‚Ð°Ñ‚ÐºÐ¸ Ñ‚Ð° ÑƒÑ€Ð¾ÐºÐ¸.",
          },
          {
            title: "Calendar",
            description:
              "Ð”Ð¸Ð²Ð¸ÑÑŒ performance Ð¿Ð¾ Ð´Ð½ÑÑ… Ñ– Ð²Ð¸Ð·Ð½Ð°Ñ‡Ð°Ð¹ Ð¿Ð¾Ð·Ð¸Ñ‚Ð¸Ð²Ð½Ñ–, Ð½ÐµÐ³Ð°Ñ‚Ð¸Ð²Ð½Ñ– Ð°Ð±Ð¾ flat-Ð´Ð½Ñ–.",
          },
          {
            title: "Equity",
            description:
              "Ð’Ñ–Ð´ÑÑ‚ÐµÐ¶ÑƒÐ¹ Ð·Ñ€Ð¾ÑÑ‚Ð°Ð½Ð½Ñ ÐºÐ°Ð¿Ñ–Ñ‚Ð°Ð»Ñƒ, equity curve, drawdown, best trade Ñ– worst trade.",
          },
        ],
      },
      {
        phase: "Intelligence",
        eyebrow: "Analytics, Reports, Rules",
        title: "Ð—Ñ€Ð¾Ð·ÑƒÐ¼Ñ–Ð¹, Ñ‰Ð¾ ÑÐ¿Ñ€Ð°Ð²Ð´Ñ– Ð¿Ñ€Ð°Ñ†ÑŽÑ”",
        description:
          "Analytics, Reports Ñ– Rules Ð¿ÐµÑ€ÐµÑ‚Ð²Ð¾Ñ€ÑŽÑŽÑ‚ÑŒ Ð´Ð°Ð½Ñ– Ð½Ð° Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ðµ Ñ‡Ð¸Ñ‚Ð°Ð½Ð½Ñ: Ð½Ð°Ð¹ÐºÑ€Ð°Ñ‰Ñ– ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¸, ÑÐµÑÑ–Ñ—, Ð¿Ð¾Ð¼Ð¸Ð»ÐºÐ¸, Ð¿ÑÐ¸Ñ…Ð¾Ð»Ð¾Ð³Ñ–Ñ, Ñ†Ñ–Ð»Ñ– Ñ‚Ð° Ð»Ñ–Ð¼Ñ–Ñ‚Ð¸.",
        cards: [
          {
            title: "Analytics",
            description:
              "ÐÐ½Ð°Ð»Ñ–Ð·ÑƒÐ¹ symbols, direction, sessions, emotions, execution quality Ñ– patterns.",
          },
          {
            title: "Reports",
            description:
              "Ð§Ð¸Ñ‚Ð°Ð¹ Ð¿Ñ€Ð¾Ñ„ÐµÑÑ–Ð¹Ð½Ñ– Ð¿Ñ–Ð´ÑÑƒÐ¼ÐºÐ¸ Ð¿Ñ€Ð¾ performance, Ñ€Ð¸Ð·Ð¸ÐºÐ¸, ÑÐ¸Ð»ÑŒÐ½Ñ– Ñ‚Ð° ÑÐ»Ð°Ð±ÐºÑ– ÑÑ‚Ð¾Ñ€Ð¾Ð½Ð¸.",
          },
          {
            title: "Rules & Goals",
            description:
              "Ð’ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÑŽÐ¹ targets, limits, Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ñ– Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð° Ñ‚Ð° ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒÐ½Ñ– ÑÐ¸Ð³Ð½Ð°Ð»Ð¸.",
          },
        ],
      },
      {
        phase: "Protection",
        eyebrow: "Sessions & Copilot",
        title: "Ð—Ð°Ñ…Ð¸Ñ‰Ð°Ð¹ ÑÑÐ½Ñ–ÑÑ‚ÑŒ Ñ– Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ñ–Ð½Ñƒ",
        description:
          "VOLTIS Ð¼Ð°Ñ” Ð½Ðµ Ð»Ð¸ÑˆÐµ Ð¿Ð¾ÐºÐ°Ð·ÑƒÐ²Ð°Ñ‚Ð¸ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¸. Ð’Ñ–Ð½ Ð¼Ð°Ñ” Ð´Ð¾Ð¿Ð¾Ð¼Ð°Ð³Ð°Ñ‚Ð¸ Ñ‚Ð¾Ð±Ñ– Ð·Ñ€Ð¾Ð·ÑƒÐ¼Ñ–Ñ‚Ð¸, ÐºÐ¾Ð»Ð¸ Ñ‚Ð¸ Ð²Ñ‚Ñ€Ð°Ñ‡Ð°Ñ”Ñˆ ÑÑÐ½Ñ–ÑÑ‚ÑŒ, Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ñ–Ð½Ñƒ Ð°Ð±Ð¾ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð¸Ð¹ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒ.",
        spotlight:
          "ÐÐ°Ð¹Ð±Ñ–Ð»ÑŒÑˆÐ° Ñ†Ñ–Ð½Ð½Ñ–ÑÑ‚ÑŒ Ð·â€™ÑÐ²Ð»ÑÑ”Ñ‚ÑŒÑÑ Ñ‚Ð¾Ð´Ñ–, ÐºÐ¾Ð»Ð¸ VOLTIS Ð¿Ð¾Ñ‡Ð¸Ð½Ð°Ñ” Ñ€Ð¾Ð·Ð¿Ñ–Ð·Ð½Ð°Ð²Ð°Ñ‚Ð¸ Ñ‚Ðµ, Ñ‰Ð¾ Ñ‚Ð¸ Ñ€Ð¸Ð·Ð¸ÐºÑƒÑ”Ñˆ Ð½Ðµ Ð¿Ð¾Ð±Ð°Ñ‡Ð¸Ñ‚Ð¸.",
        cards: [
          {
            title: "Sessions",
            description:
              "Ð“Ð¾Ñ‚ÑƒÐ¹ ÑÐµÑÑ–ÑŽ Ð¿ÐµÑ€ÐµÐ´ Ñ‚Ð¾Ñ€Ð³Ñ–Ð²Ð»ÐµÑŽ Ñ– Ð¿ÐµÑ€ÐµÐ³Ð»ÑÐ´Ð°Ð¹ Ñ—Ñ— Ð¿Ñ–ÑÐ»Ñ Ð· focus, bias Ñ– review.",
          },
          {
            title: "Copilot",
            description:
              "Ð¡Ð¿Ð¾ÑÑ‚ÐµÑ€Ñ–Ð³Ð°Ð¹ Ð·Ð° Ð¿Ð°Ð¼Ê¼ÑÑ‚Ñ‚ÑŽ, Ð¿Ð°Ñ‚ÐµÑ€Ð½Ð°Ð¼Ð¸, ÑÐ¸Ð³Ð½Ð°Ð»Ð°Ð¼Ð¸ Ñ€Ð¸Ð·Ð¸ÐºÑƒ Ñ‚Ð° Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð¾ÑŽ Ð¿Ð¾Ð²ÐµÐ´Ñ–Ð½ÐºÐ¾ÑŽ.",
          },
        ],
      },
      {
        phase: "Management",
        eyebrow: "Workspace, Members, Integrations",
        title: "ÐšÐµÑ€ÑƒÐ¹ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¾ÑŽ, ÐºÐ¾Ð¼Ð°Ð½Ð´Ð¾ÑŽ Ñ– ÑÐ¸ÑÑ‚ÐµÐ¼Ð¾ÑŽ",
        description:
          "VOLTIS Ð¼Ð¾Ð¶Ðµ Ð±ÑƒÑ‚Ð¸ Ñ‚Ð°ÐºÐ¾Ð¶ Ð¿Ñ€Ð¸Ð²Ð°Ñ‚Ð½Ð¸Ð¼ Ñ€Ð¾Ð±Ð¾Ñ‡Ð¸Ð¼ ÑÐµÑ€ÐµÐ´Ð¾Ð²Ð¸Ñ‰ÐµÐ¼: members, workspace, permissions, integrations, settings Ñ– backup.",
        cards: [
          {
            title: "Workspace & Members",
            description:
              "ÐšÐµÑ€ÑƒÐ¹ members, presence, activity, Ñ–Ð½Ð´Ð¸Ð²Ñ–Ð´ÑƒÐ°Ð»ÑŒÐ½Ð¾ÑŽ performance Ñ– access.",
          },
          {
            title: "Integrations",
            description:
              "Ð“Ð¾Ñ‚ÑƒÐ¹ MT5, broker sync Ñ– manual, automatic Ð°Ð±Ð¾ hybrid mode.",
          },
          {
            title: "Settings",
            description:
              "ÐšÐµÑ€ÑƒÐ¹ Ð¼Ð¾Ð²Ð¾ÑŽ, Ð²Ð°Ð»ÑŽÑ‚Ð¾ÑŽ, onboarding, backup Ñ– Ð·Ð°Ð³Ð°Ð»ÑŒÐ½Ð¸Ð¼Ð¸ Ð½Ð°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð½Ð½ÑÐ¼Ð¸.",
          },
        ],
      },
      {
        phase: "Ð¤Ñ–Ð½Ð°Ð»ÑŒÐ½Ð¸Ð¹ Ð¿Ñ€Ð¸Ð½Ñ†Ð¸Ð¿",
        eyebrow: "Use it seriously",
        title: "VOLTIS Ð²Ð°Ñ€Ñ‚Ð¸Ð¹ Ñ‚Ð¾Ð³Ð¾, ÑÐº Ñ‚Ð¸ Ð¹Ð¾Ð³Ð¾ Ð²Ð¸ÐºÐ¾Ñ€Ð¸ÑÑ‚Ð¾Ð²ÑƒÑ”Ñˆ",
        description:
          "ÐœÐµÑ‚Ð° Ð½Ðµ Ð² Ñ‚Ð¾Ð¼Ñƒ, Ñ‰Ð¾Ð± Ð·Ð°Ð¿Ð¾Ð²Ð½ÑŽÐ²Ð°Ñ‚Ð¸ Ð·Ð°ÑÑ‚Ð¾ÑÑƒÐ½Ð¾Ðº Ð²Ð¸Ð¿Ð°Ð´ÐºÐ¾Ð²Ð¸Ð¼Ð¸ Ð´Ð°Ð½Ð¸Ð¼Ð¸. ÐœÐµÑ‚Ð° â€” Ð²Ð¸ÐºÐ¾Ñ€Ð¸ÑÑ‚Ð¾Ð²ÑƒÐ²Ð°Ñ‚Ð¸ Ð¹Ð¾Ð³Ð¾ ÑÑ‚Ð°Ð±Ñ–Ð»ÑŒÐ½Ð¾, Ñ‚Ð¾Ñ‡Ð½Ð¾ Ñ– Ð· Ð¿Ð¾Ð²Ð°Ð³Ð¾ÑŽ Ð´Ð¾ Ð¿Ñ€Ð¾Ñ†ÐµÑÑƒ.",
        spotlight:
          "Ð¯ÐºÑ‰Ð¾ Ñ‚Ð¸ Ð¼Ð°Ñ”Ñˆ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ð´Ð¾ VOLTIS, Ñ‚Ð¸ Ð²ÑÐµÑ€ÐµÐ´Ð¸Ð½Ñ– Ñ‡Ð¾Ð³Ð¾ÑÑŒ ÑÐµÑ€Ð¹Ð¾Ð·Ð½Ð¾Ð³Ð¾.",
        cards: [
          {
            title: "Ð’Ð½Ð¾ÑÑŒ ÑÐ¿Ñ€Ð°Ð²Ð¶Ð½Ñ– Ð´Ð°Ð½Ñ–",
            description:
              "ÐšÐ¾Ð¶Ð½Ð° Ð´Ð¾Ð±Ñ€Ðµ Ð·Ð°Ð¿Ð¸ÑÐ°Ð½Ð° ÑƒÐ³Ð¾Ð´Ð° Ñ€Ð¾Ð±Ð¸Ñ‚ÑŒ Ð¼Ð°Ð¹Ð±ÑƒÑ‚Ð½Ñ– reports, charts Ñ– analysis ÐºÐ¾Ñ€Ð¸ÑÐ½Ñ–ÑˆÐ¸Ð¼Ð¸.",
          },
          {
            title: "ÐŸÐµÑ€ÐµÐ³Ð»ÑÐ´Ð°Ð¹ Ð· ÑÑÐ½Ñ–ÑÑ‚ÑŽ",
            description:
              "ÐÐµ Ð²Ð¸ÐºÐ¾Ñ€Ð¸ÑÑ‚Ð¾Ð²ÑƒÐ¹ VOLTIS Ð»Ð¸ÑˆÐµ ÐºÐ¾Ð»Ð¸ Ð¿ÐµÑ€ÐµÐ¼Ð°Ð³Ð°Ñ”Ñˆ. Ð’Ð¸ÐºÐ¾Ñ€Ð¸ÑÑ‚Ð¾Ð²ÑƒÐ¹ Ð¹Ð¾Ð³Ð¾ Ð¾ÑÐ¾Ð±Ð»Ð¸Ð²Ð¾ Ñ‚Ð¾Ð´Ñ–, ÐºÐ¾Ð»Ð¸ Ð¿Ð¾Ñ‚Ñ€Ñ–Ð±Ð½Ð¾ Ñ‰Ð¾ÑÑŒ Ð²Ð¸Ð¿Ñ€Ð°Ð²Ð¸Ñ‚Ð¸.",
          },
          {
            title: "Ð—Ð°Ñ…Ð¸Ñ‰Ð°Ð¹ Ð¿Ñ€Ð¾Ñ†ÐµÑ",
            description:
              "Profit Ñ– discipline Ð½Ðµ Ð¼Ð°ÑŽÑ‚ÑŒ Ð±ÑƒÑ‚Ð¸ Ñ€Ð¾Ð·Ð´Ñ–Ð»ÐµÐ½Ñ–. VOLTIS Ñ–ÑÐ½ÑƒÑ”, Ñ‰Ð¾Ð± Ñ—Ñ… Ð¿Ð¾Ñ”Ð´Ð½Ð°Ñ‚Ð¸.",
          },
        ],
      },
    ],
  },

  ru: {
    privateAccess: "VOLTIS Private Access",
    stepCounter: (current, total) => `${current}/${total}`,
    back: "ÐÐ°Ð·Ð°Ð´",
    continue: "ÐŸÑ€Ð¾Ð´Ð¾Ð»Ð¶Ð¸Ñ‚ÑŒ",
    enterVoltis: "Ð’Ð¾Ð¹Ñ‚Ð¸ Ð² VOLTIS",
    close: "Ð—Ð°ÐºÑ€Ñ‹Ñ‚ÑŒ Ð¾Ð½Ð±Ð¾Ñ€Ð´Ð¸Ð½Ð³",
    steps: [
      {
        phase: "Ð’Ð¸Ð´ÐµÐ½Ð¸Ðµ",
        eyebrow: "Private access",
        title: "VOLTIS â€” ÑÑ‚Ð¾ Ð½Ðµ Ð¾Ð±Ñ‹Ñ‡Ð½Ð¾Ðµ Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ Ð´Ð»Ñ Ñ‚Ñ€ÐµÐ¹Ð´Ð¸Ð½Ð³Ð°",
        description:
          "VOLTIS â€” ÑÑ‚Ð¾ Ð¿Ñ€Ð¸Ð²Ð°Ñ‚Ð½Ð°Ñ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð°Ñ ÑÐ¸ÑÑ‚ÐµÐ¼Ð° Ð´Ð»Ñ Ñ‚Ñ€ÐµÐ¹Ð´Ð¸Ð½Ð³Ð°, ÑÐ¾Ð·Ð´Ð°Ð½Ð½Ð°Ñ Ð´Ð»Ñ Ð²Ñ‹Ð±Ñ€Ð°Ð½Ð½Ñ‹Ñ… Ñ‚Ñ€ÐµÐ¹Ð´ÐµÑ€Ð¾Ð², ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ñ…Ð¾Ñ‚ÑÑ‚ Ð¸Ð·Ð¼ÐµÑ€ÑÑ‚ÑŒ, Ð·Ð°Ñ‰Ð¸Ñ‰Ð°Ñ‚ÑŒ Ð¸ ÑƒÐ»ÑƒÑ‡ÑˆÐ°Ñ‚ÑŒ ÑÐ²Ð¾Ðµ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ðµ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ.",
        spotlight:
          "ÐžÐ½Ð° Ð½Ðµ Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚Ð° Ð´Ð»Ñ Ð²ÑÐµÑ…. ÐžÐ½Ð° Ð½Ðµ ÑÐ¾Ð·Ð´Ð°Ð½Ð° Ð´Ð»Ñ Ð¼Ð°ÑÑÐ¾Ð²Ð¾Ð³Ð¾ Ñ€Ñ‹Ð½ÐºÐ°. Ð­Ñ‚Ð¾ ÑÐµÑ€ÑŒÐµÐ·Ð½Ñ‹Ð¹ Ð¸Ð½ÑÑ‚Ñ€ÑƒÐ¼ÐµÐ½Ñ‚ Ð´Ð»Ñ Ñ‚ÐµÑ…, ÐºÑ‚Ð¾ Ñ…Ð¾Ñ‡ÐµÑ‚ Ð¾Ñ‚Ð½Ð¾ÑÐ¸Ñ‚ÑŒÑÑ Ðº Ñ‚Ñ€ÐµÐ¹Ð´Ð¸Ð½Ð³Ñƒ ÑÐµÑ€ÑŒÐµÐ·Ð½Ð¾.",
        cards: [
          {
            title: "Ð’Ñ‹Ð±Ð¾Ñ€Ð¾Ñ‡Ð½Ñ‹Ð¹ Ð´Ð¾ÑÑ‚ÑƒÐ¿",
            description:
              "VOLTIS Ð½Ðµ ÑÐ¾Ð·Ð´Ð°Ð½ Ð´Ð»Ñ ÐºÐ°Ð¶Ð´Ð¾Ð³Ð¾. Ð”Ð¾ÑÑ‚ÑƒÐ¿ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€ÑƒÐµÐ¼Ñ‹Ð¹, Ð¿Ñ€Ð¸Ð²Ð°Ñ‚Ð½Ñ‹Ð¹ Ð¸ Ð¾ÑÐ¾Ð·Ð½Ð°Ð½Ð½Ñ‹Ð¹.",
          },
          {
            title: "Ð­Ñ‚Ð¾ Ð½Ðµ Ð¿Ñ€Ð¾ÑÑ‚Ð¾ Ð±ÐµÑÐ¿Ð»Ð°Ñ‚Ð½Ð¾",
            description:
              "Ð¢Ñ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑˆÑŒ ÐµÐ³Ð¾ Ð½Ðµ Ð¿Ð¾Ñ‚Ð¾Ð¼Ñƒ, Ñ‡Ñ‚Ð¾ Ð¾Ð½ Ð´ÐµÑˆÐµÐ²Ñ‹Ð¹. Ð¢Ñ‹ Ð²Ð½ÑƒÑ‚Ñ€Ð¸ Ñ‚Ð¾Ð³Ð¾, Ñ‡Ñ‚Ð¾ Ð½Ðµ Ð¿Ñ€Ð¾Ð´Ð°ÐµÑ‚ÑÑ Ð²ÑÐµÐ¼.",
          },
        ],
      },
      {
        phase: "Ð¤Ð¸Ð»Ð¾ÑÐ¾Ñ„Ð¸Ñ",
        eyebrow: "Measure. Protect. Improve.",
        title: "ÐœÐ¸ÑÑÐ¸Ñ â€” ÑÐ´ÐµÐ»Ð°Ñ‚ÑŒ Ñ‚ÐµÐ±Ñ Ð±Ð¾Ð»ÐµÐµ ÑÑÐ½Ñ‹Ð¼",
        description:
          "VOLTIS Ð½Ðµ Ð¿Ñ€Ð¾ÑÑ‚Ð¾ Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÑ‚ Ñ†Ð¸Ñ„Ñ€Ñ‹. ÐžÐ½ Ð¿Ð¾Ð¼Ð¾Ð³Ð°ÐµÑ‚ Ð¿Ð¾Ð½ÑÑ‚ÑŒ, ÐºÐ°Ðº Ñ‚Ñ‹ Ñ‚Ð¾Ñ€Ð³ÑƒÐµÑˆÑŒ, ÐºÐ°ÐºÐ¸Ðµ Ð¿Ð°Ñ‚Ñ‚ÐµÑ€Ð½Ñ‹ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€ÑÐµÑˆÑŒ, Ð³Ð´Ðµ Ñ‚ÐµÑ€ÑÐµÑˆÑŒ Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ð¸Ð½Ñƒ Ð¸ Ñ‡Ñ‚Ð¾ Ð½ÑƒÐ¶Ð½Ð¾ Ð·Ð°Ñ‰Ð¸Ñ‰Ð°Ñ‚ÑŒ.",
        spotlight:
          "ÐÐ°ÑÑ‚Ð¾ÑÑ‰Ð°Ñ Ñ†ÐµÐ»ÑŒ â€” Ð½Ðµ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð·Ð½Ð°Ñ‚ÑŒ, ÑÐºÐ¾Ð»ÑŒÐºÐ¾ Ñ‚Ñ‹ Ð·Ð°Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð» Ð¸Ð»Ð¸ Ð¿Ð¾Ñ‚ÐµÑ€ÑÐ». Ð¦ÐµÐ»ÑŒ â€” Ð¿Ð¾Ð½ÑÑ‚ÑŒ, ÐºÐ°ÐºÐ¸Ð¼ Ñ‚Ñ€ÐµÐ¹Ð´ÐµÑ€Ð¾Ð¼ Ñ‚Ñ‹ ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸ÑˆÑŒÑÑ.",
        cards: [
          {
            title: "Measure",
            description:
              "Ð˜Ð·Ð¼ÐµÑ€ÑÐ¹ performance, equity, win rate, drawdown, ÑÐµÑÑÐ¸Ð¸ Ð¸ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾ Ð¸ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ.",
          },
          {
            title: "Protect",
            description:
              "Ð—Ð°Ñ‰Ð¸Ñ‰Ð°Ð¹ ÐºÐ°Ð¿Ð¸Ñ‚Ð°Ð», Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ð¸Ð½Ñƒ, ÑÑÐ½Ð¾ÑÑ‚ÑŒ Ð¸ ÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ðµ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ñ… Ð¿Ñ€Ð°Ð²Ð¸Ð».",
          },
          {
            title: "Improve",
            description:
              "Ð£Ð»ÑƒÑ‡ÑˆÐ°Ð¹ Ð¸ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ, review, Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ Ð¸ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾ Ñ€ÐµÑˆÐµÐ½Ð¸Ð¹ ÑÐ¾ Ð²Ñ€ÐµÐ¼ÐµÐ½ÐµÐ¼.",
          },
        ],
      },
      {
        phase: "ÐœÐµÑ‚Ð¾Ð´",
        eyebrow: "Operating flow",
        title: "ÐŸÑ€Ð°Ð²Ð¸Ð»ÑŒÐ½Ñ‹Ð¹ Ð¿Ð¾Ñ‚Ð¾Ðº Ð½Ðµ ÑÐ»ÑƒÑ‡Ð°ÐµÐ½",
        description:
          "VOLTIS Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÐµÑ‚ Ð»ÑƒÑ‡ÑˆÐµ Ð²ÑÐµÐ³Ð¾, ÐºÐ¾Ð³Ð´Ð° Ñ‚Ñ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑˆÑŒ ÐµÐ³Ð¾ ÐºÐ°Ðº Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½ÑƒÑŽ ÑÐ¸ÑÑ‚ÐµÐ¼Ñƒ: Ð¿Ð»Ð°Ð½Ð¸Ñ€ÑƒÐµÑˆÑŒ, Ð¸ÑÐ¿Ð¾Ð»Ð½ÑÐµÑˆÑŒ, Ð·Ð°Ð¿Ð¸ÑÑ‹Ð²Ð°ÐµÑˆÑŒ, Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐµÑˆÑŒ, Ð·Ð°Ñ‰Ð¸Ñ‰Ð°ÐµÑˆÑŒ Ð¸ ÑƒÐ»ÑƒÑ‡ÑˆÐ°ÐµÑˆÑŒ.",
        spotlight:
          "Plan â†’ Execute â†’ Journal â†’ Review â†’ Detect Patterns â†’ Protect Discipline â†’ Improve Behavior",
        cards: [
          {
            title: "ÐŸÐµÑ€ÐµÐ´ ÑÐµÑÑÐ¸ÐµÐ¹",
            description:
              "ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»Ð¸ focus, risk, scenario, Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð° Ð¸ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ðµ ÑƒÑÐ»Ð¾Ð²Ð¸Ñ.",
          },
          {
            title: "Ð’Ð¾ Ð²Ñ€ÐµÐ¼Ñ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ð»Ð¸",
            description:
              "Ð¡Ð»ÐµÐ´ÑƒÐ¹ Ð¿Ð»Ð°Ð½Ñƒ, Ð¸Ð·Ð±ÐµÐ³Ð°Ð¹ Ð¸Ð¼Ð¿ÑƒÐ»ÑŒÑÐ¸Ð²Ð½Ð¾ÑÑ‚Ð¸ Ð¸ Ð´ÐµÑ€Ð¶Ð¸ Ñ€Ð¸ÑÐº Ð¿Ð¾Ð´ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÐµÐ¼.",
          },
          {
            title: "ÐŸÐ¾ÑÐ»Ðµ ÑÐµÑÑÐ¸Ð¸",
            description:
              "Ð—Ð°Ð¿Ð¸ÑÑ‹Ð²Ð°Ð¹, Ð¿ÐµÑ€ÐµÑÐ¼Ð°Ñ‚Ñ€Ð¸Ð²Ð°Ð¹, Ð½Ð°Ñ…Ð¾Ð´Ð¸ Ð¾ÑˆÐ¸Ð±ÐºÐ¸, ÑƒÑ€Ð¾ÐºÐ¸ Ð¸ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€ÑÑŽÑ‰Ð¸ÐµÑÑ Ð¿Ð°Ñ‚Ñ‚ÐµÑ€Ð½Ñ‹.",
          },
        ],
      },
      {
        phase: "ÐÐºÐºÐ°ÑƒÐ½Ñ‚",
        eyebrow: "Account Hub & Dashboard",
        title: "ÐÐ°Ñ‡Ð¸Ð½Ð°Ð¹ Ñ Ñ†ÐµÐ½Ñ‚Ñ€Ð° ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð¾Ð¼",
        description:
          "ÐšÐ¾Ð³Ð´Ð° Ñ‚Ñ‹ Ð²Ñ…Ð¾Ð´Ð¸ÑˆÑŒ Ð² Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚, Ð½Ð°Ñ‡Ð¸Ð½Ð°Ð¹ Ñ Account Hub. ÐžÑ‚Ñ‚ÑƒÐ´Ð° Ñ‚Ñ‹ Ð¿ÐµÑ€ÐµÑ…Ð¾Ð´Ð¸ÑˆÑŒ Ðº Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot Ð¸ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸ÑŽ.",
        cards: [
          {
            title: "Account Hub",
            description:
              "ÐŸÐµÑ€Ð²Ð°Ñ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ð° Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°. ÐžÐ½Ð° Ð¾Ñ€Ð¸ÐµÐ½Ñ‚Ð¸Ñ€ÑƒÐµÑ‚ Ñ‚ÐµÐ±Ñ Ð¸ Ð²ÐµÐ´ÐµÑ‚ Ð² Ð½ÑƒÐ¶Ð½Ñ‹Ðµ Ñ€Ð°Ð·Ð´ÐµÐ»Ñ‹.",
          },
          {
            title: "Dashboard",
            description:
              "Ð¡Ñ€Ð°Ð·Ñƒ Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÑ‚ equity, PnL, win rate, target, drawdown Ð¸ Ð¾Ð±Ñ‰Ð¸Ð¹ ÑÑ‚Ð°Ñ‚ÑƒÑ.",
          },
        ],
      },
      {
        phase: "Execution",
        eyebrow: "Diary, Calendar, Equity",
        title: "Ð¡Ð¾Ð·Ð´Ð°Ð²Ð°Ð¹ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½ÑƒÑŽ Ð¿Ð°Ð¼ÑÑ‚ÑŒ",
        description:
          "Core-ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹ ÑÐ¾Ð±Ð¸Ñ€Ð°ÑŽÑ‚ Ð¾ÑÐ½Ð¾Ð²Ñƒ Ñ‚Ð²Ð¾ÐµÐ³Ð¾ Ñ‚Ñ€ÐµÐ¹Ð´Ð¸Ð½Ð³Ð°: ÑÐ´ÐµÐ»ÐºÐ¸, ÐºÐ°Ð»ÐµÐ½Ð´Ð°Ñ€ÑŒ, Ñ€Ð¾ÑÑ‚ equity Ð¸ Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑÑ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°.",
        cards: [
          {
            title: "Trading Diary",
            description:
              "Ð—Ð°Ð¿Ð¸ÑÑ‹Ð²Ð°Ð¹ ÑÐ´ÐµÐ»ÐºÐ¸, setup, ÑÐ¼Ð¾Ñ†Ð¸Ð¸, Ð¸ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ, Ð¾ÑˆÐ¸Ð±ÐºÐ¸, Ð·Ð°Ð¼ÐµÑ‚ÐºÐ¸ Ð¸ ÑƒÑ€Ð¾ÐºÐ¸.",
          },
          {
            title: "Calendar",
            description:
              "Ð¡Ð¼Ð¾Ñ‚Ñ€Ð¸ performance Ð¿Ð¾ Ð´Ð½ÑÐ¼ Ð¸ Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÑÐ¹ Ð¿Ð¾Ð»Ð¾Ð¶Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ, Ð¾Ñ‚Ñ€Ð¸Ñ†Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð¸Ð»Ð¸ flat-Ð´Ð½Ð¸.",
          },
          {
            title: "Equity",
            description:
              "ÐžÑ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°Ð¹ Ñ€Ð¾ÑÑ‚ ÐºÐ°Ð¿Ð¸Ñ‚Ð°Ð»Ð°, equity curve, drawdown, best trade Ð¸ worst trade.",
          },
        ],
      },
      {
        phase: "Intelligence",
        eyebrow: "Analytics, Reports, Rules",
        title: "ÐŸÐ¾Ð¹Ð¼Ð¸, Ñ‡Ñ‚Ð¾ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÐµÑ‚",
        description:
          "Analytics, Reports Ð¸ Rules Ð¿Ñ€ÐµÐ²Ñ€Ð°Ñ‰Ð°ÑŽÑ‚ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð² Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ðµ Ñ‡Ñ‚ÐµÐ½Ð¸Ðµ: Ð»ÑƒÑ‡ÑˆÐ¸Ðµ ÑÐ¸Ð¼Ð²Ð¾Ð»Ñ‹, ÑÐµÑÑÐ¸Ð¸, Ð¾ÑˆÐ¸Ð±ÐºÐ¸, Ð¿ÑÐ¸Ñ…Ð¾Ð»Ð¾Ð³Ð¸Ñ, Ñ†ÐµÐ»Ð¸ Ð¸ Ð»Ð¸Ð¼Ð¸Ñ‚Ñ‹.",
        cards: [
          {
            title: "Analytics",
            description:
              "ÐÐ½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹ symbols, direction, sessions, emotions, execution quality Ð¸ patterns.",
          },
          {
            title: "Reports",
            description:
              "Ð§Ð¸Ñ‚Ð°Ð¹ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ ÑÐ²Ð¾Ð´ÐºÐ¸ Ð¾ performance, Ñ€Ð¸ÑÐºÐ°Ñ…, ÑÐ¸Ð»ÑŒÐ½Ñ‹Ñ… Ð¸ ÑÐ»Ð°Ð±Ñ‹Ñ… ÑÑ‚Ð¾Ñ€Ð¾Ð½Ð°Ñ….",
          },
          {
            title: "Rules & Goals",
            description:
              "Ð£ÑÑ‚Ð°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°Ð¹ targets, limits, Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ðµ Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð° Ð¸ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒÐ½Ñ‹Ðµ ÑÐ¸Ð³Ð½Ð°Ð»Ñ‹.",
          },
        ],
      },
      {
        phase: "Protection",
        eyebrow: "Sessions & Copilot",
        title: "Ð—Ð°Ñ‰Ð¸Ñ‰Ð°Ð¹ ÑÑÐ½Ð¾ÑÑ‚ÑŒ Ð¸ Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ð¸Ð½Ñƒ",
        description:
          "VOLTIS Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð½Ðµ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°Ñ‚ÑŒ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹. ÐžÐ½ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð¿Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÑŒ Ð¿Ð¾Ð½ÑÑ‚ÑŒ, ÐºÐ¾Ð³Ð´Ð° Ñ‚Ñ‹ Ñ‚ÐµÑ€ÑÐµÑˆÑŒ ÑÑÐ½Ð¾ÑÑ‚ÑŒ, Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ð¸Ð½Ñƒ Ð¸Ð»Ð¸ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¹ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒ.",
        spotlight:
          "Ð¡Ð°Ð¼Ð°Ñ Ð±Ð¾Ð»ÑŒÑˆÐ°Ñ Ñ†ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð¿Ð¾ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ñ‚Ð¾Ð³Ð´Ð°, ÐºÐ¾Ð³Ð´Ð° VOLTIS Ð½Ð°Ñ‡Ð¸Ð½Ð°ÐµÑ‚ Ñ€Ð°ÑÐ¿Ð¾Ð·Ð½Ð°Ð²Ð°Ñ‚ÑŒ Ñ‚Ð¾, Ñ‡Ñ‚Ð¾ Ñ‚Ñ‹ Ñ€Ð¸ÑÐºÑƒÐµÑˆÑŒ Ð½Ðµ ÑƒÐ²Ð¸Ð´ÐµÑ‚ÑŒ.",
        cards: [
          {
            title: "Sessions",
            description:
              "Ð“Ð¾Ñ‚Ð¾Ð²ÑŒ ÑÐµÑÑÐ¸ÑŽ Ð¿ÐµÑ€ÐµÐ´ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ð»ÐµÐ¹ Ð¸ Ð¿ÐµÑ€ÐµÑÐ¼Ð°Ñ‚Ñ€Ð¸Ð²Ð°Ð¹ ÐµÐµ Ð¿Ð¾ÑÐ»Ðµ Ñ focus, bias Ð¸ review.",
          },
          {
            title: "Copilot",
            description:
              "ÐÐ°Ð±Ð»ÑŽÐ´Ð°Ð¹ Ð·Ð° Ð¿Ð°Ð¼ÑÑ‚ÑŒÑŽ, Ð¿Ð°Ñ‚Ñ‚ÐµÑ€Ð½Ð°Ð¼Ð¸, ÑÐ¸Ð³Ð½Ð°Ð»Ð°Ð¼Ð¸ Ñ€Ð¸ÑÐºÐ° Ð¸ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¼ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸ÐµÐ¼.",
          },
        ],
      },
      {
        phase: "Management",
        eyebrow: "Workspace, Members, Integrations",
        title: "Ð£Ð¿Ñ€Ð°Ð²Ð»ÑÐ¹ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¾Ð¹, ÐºÐ¾Ð¼Ð°Ð½Ð´Ð¾Ð¹ Ð¸ ÑÐ¸ÑÑ‚ÐµÐ¼Ð¾Ð¹",
        description:
          "VOLTIS Ð¼Ð¾Ð¶ÐµÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð¸ Ð¿Ñ€Ð¸Ð²Ð°Ñ‚Ð½Ð¾Ð¹ Ñ€Ð°Ð±Ð¾Ñ‡ÐµÐ¹ ÑÑ€ÐµÐ´Ð¾Ð¹: members, workspace, permissions, integrations, settings Ð¸ backup.",
        cards: [
          {
            title: "Workspace & Members",
            description:
              "Ð£Ð¿Ñ€Ð°Ð²Ð»ÑÐ¹ members, presence, activity, Ð¸Ð½Ð´Ð¸Ð²Ð¸Ð´ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¹ performance Ð¸ access.",
          },
          {
            title: "Integrations",
            description:
              "ÐŸÐ¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²ÑŒ MT5, broker sync Ð¸ manual, automatic Ð¸Ð»Ð¸ hybrid mode.",
          },
          {
            title: "Settings",
            description:
              "Ð£Ð¿Ñ€Ð°Ð²Ð»ÑÐ¹ ÑÐ·Ñ‹ÐºÐ¾Ð¼, Ð²Ð°Ð»ÑŽÑ‚Ð¾Ð¹, onboarding, backup Ð¸ Ð¾Ð±Ñ‰Ð¸Ð¼Ð¸ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ°Ð¼Ð¸.",
          },
        ],
      },
      {
        phase: "Ð¤Ð¸Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð¿Ñ€Ð¸Ð½Ñ†Ð¸Ð¿",
        eyebrow: "Use it seriously",
        title: "VOLTIS Ñ†ÐµÐ½ÐµÐ½ Ð½Ð°ÑÑ‚Ð¾Ð»ÑŒÐºÐ¾, Ð½Ð°ÑÐºÐ¾Ð»ÑŒÐºÐ¾ ÑÐµÑ€ÑŒÐµÐ·Ð½Ð¾ Ñ‚Ñ‹ ÐµÐ³Ð¾ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑˆÑŒ",
        description:
          "Ð¦ÐµÐ»ÑŒ Ð½Ðµ Ð² Ñ‚Ð¾Ð¼, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð·Ð°Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÑŒ Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ ÑÐ»ÑƒÑ‡Ð°Ð¹Ð½Ñ‹Ð¼Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ð¼Ð¸. Ð¦ÐµÐ»ÑŒ â€” Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ ÐµÐ³Ð¾ ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ð¾, Ñ‚Ð¾Ñ‡Ð½Ð¾ Ð¸ Ñ ÑƒÐ²Ð°Ð¶ÐµÐ½Ð¸ÐµÐ¼ Ðº Ð¿Ñ€Ð¾Ñ†ÐµÑÑÑƒ.",
        spotlight:
          "Ð•ÑÐ»Ð¸ Ñƒ Ñ‚ÐµÐ±Ñ ÐµÑÑ‚ÑŒ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº VOLTIS, Ñ‚Ñ‹ Ð²Ð½ÑƒÑ‚Ñ€Ð¸ Ñ‡ÐµÐ³Ð¾-Ñ‚Ð¾ ÑÐµÑ€ÑŒÐµÐ·Ð½Ð¾Ð³Ð¾.",
        cards: [
          {
            title: "Ð’Ð½Ð¾ÑÐ¸ Ñ€ÐµÐ°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ",
            description:
              "ÐšÐ°Ð¶Ð´Ð°Ñ Ñ…Ð¾Ñ€Ð¾ÑˆÐ¾ Ð·Ð°Ð¿Ð¸ÑÐ°Ð½Ð½Ð°Ñ ÑÐ´ÐµÐ»ÐºÐ° Ð´ÐµÐ»Ð°ÐµÑ‚ Ð±ÑƒÐ´ÑƒÑ‰Ð¸Ðµ reports, charts Ð¸ analysis Ð¿Ð¾Ð»ÐµÐ·Ð½ÐµÐµ.",
          },
          {
            title: "ÐŸÐµÑ€ÐµÑÐ¼Ð°Ñ‚Ñ€Ð¸Ð²Ð°Ð¹ Ñ ÑÑÐ½Ð¾ÑÑ‚ÑŒÑŽ",
            description:
              "ÐÐµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹ VOLTIS Ñ‚Ð¾Ð»ÑŒÐºÐ¾ ÐºÐ¾Ð³Ð´Ð° Ð²Ñ‹Ð¸Ð³Ñ€Ñ‹Ð²Ð°ÐµÑˆÑŒ. Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹ ÐµÐ³Ð¾ Ð¾ÑÐ¾Ð±ÐµÐ½Ð½Ð¾ Ñ‚Ð¾Ð³Ð´Ð°, ÐºÐ¾Ð³Ð´Ð° Ð½ÑƒÐ¶Ð½Ð¾ Ñ‡Ñ‚Ð¾-Ñ‚Ð¾ Ð¸ÑÐ¿Ñ€Ð°Ð²Ð¸Ñ‚ÑŒ.",
          },
          {
            title: "Ð—Ð°Ñ‰Ð¸Ñ‰Ð°Ð¹ Ð¿Ñ€Ð¾Ñ†ÐµÑÑ",
            description:
              "Profit Ð¸ discipline Ð½Ðµ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð±Ñ‹Ñ‚ÑŒ Ñ€Ð°Ð·Ð´ÐµÐ»ÐµÐ½Ñ‹. VOLTIS ÑÑƒÑ‰ÐµÑÑ‚Ð²ÑƒÐµÑ‚, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¸Ñ… ÑÐ¾ÐµÐ´Ð¸Ð½Ð¸Ñ‚ÑŒ.",
          },
        ],
      },
    ],
  },

  es: {
    privateAccess: "VOLTIS Private Access",
    stepCounter: (current, total) => `${current}/${total}`,
    back: "AtrÃ¡s",
    continue: "Continuar",
    enterVoltis: "Entrar en VOLTIS",
    close: "Cerrar onboarding",
    steps: [
      {
        phase: "VisiÃ³n",
        eyebrow: "Private access",
        title: "VOLTIS no es una app de trading normal",
        description:
          "VOLTIS es un sistema operativo privado de trading creado para traders seleccionados que quieren medir, proteger y mejorar su comportamiento operativo.",
        spotlight:
          "No estÃ¡ abierto a todos. No estÃ¡ diseÃ±ado para el mercado masivo. Es una herramienta seria para quienes quieren tratar el trading seriamente.",
        cards: [
          {
            title: "Acceso seleccionado",
            description:
              "VOLTIS no estÃ¡ creado para cualquiera. El acceso es controlado, privado e intencional.",
          },
          {
            title: "No es solo gratis",
            description:
              "No lo usas porque sea barato. Lo usas porque estÃ¡s dentro de algo que no se vende a todos.",
          },
        ],
      },
      {
        phase: "FilosofÃ­a",
        eyebrow: "Measure. Protect. Improve.",
        title: "La misiÃ³n es darte mÃ¡s claridad",
        description:
          "VOLTIS no solo muestra nÃºmeros. Te ayuda a entender cÃ³mo operas, quÃ© patrones repites, dÃ³nde pierdes disciplina y quÃ© debes proteger.",
        spotlight:
          "El objetivo real no es solo saber cuÃ¡nto ganaste o perdiste. Es entender quÃ© tipo de trader te estÃ¡s convirtiendo.",
        cards: [
          {
            title: "Measure",
            description:
              "Mide performance, equity, win rate, drawdown, sesiones y calidad de ejecuciÃ³n.",
          },
          {
            title: "Protect",
            description:
              "Protege capital, disciplina, claridad y respeto por las reglas operativas.",
          },
          {
            title: "Improve",
            description:
              "Mejora ejecuciÃ³n, review, comportamiento y calidad de decisiÃ³n con el tiempo.",
          },
        ],
      },
      {
        phase: "MÃ©todo",
        eyebrow: "Operating flow",
        title: "El flujo correcto no es casual",
        description:
          "VOLTIS funciona mejor cuando lo usas como un sistema operativo: planificas, ejecutas, registras, revisas, proteges y mejoras.",
        spotlight:
          "Plan â†’ Execute â†’ Journal â†’ Review â†’ Detect Patterns â†’ Protect Discipline â†’ Improve Behavior",
        cards: [
          {
            title: "Antes de la sesiÃ³n",
            description:
              "Define focus, risk, scenario, reglas y condiciones operativas.",
          },
          {
            title: "Durante la operativa",
            description:
              "Respeta el plan, evita impulsividad y mantÃ©n el riesgo bajo control.",
          },
          {
            title: "DespuÃ©s de la sesiÃ³n",
            description:
              "Registra, revisa, identifica errores, lecciones y patrones repetidos.",
          },
        ],
      },
      {
        phase: "Cuenta",
        eyebrow: "Account Hub & Dashboard",
        title: "Empieza desde el centro operativo de la cuenta",
        description:
          "Cuando entras en una cuenta, empieza desde Account Hub. Desde allÃ­ accedes a Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot y gestiÃ³n.",
        cards: [
          {
            title: "Account Hub",
            description:
              "La primera pantalla de la cuenta. Te orienta y te lleva a las secciones correctas.",
          },
          {
            title: "Dashboard",
            description:
              "Muestra de inmediato equity, PnL, win rate, target, drawdown y estado general.",
          },
        ],
      },
      {
        phase: "Execution",
        eyebrow: "Diary, Calendar, Equity",
        title: "Construye memoria operativa",
        description:
          "Las pÃ¡ginas core reÃºnen la base de tu trading: operaciones, calendario, crecimiento de equity y progreso de la cuenta.",
        cards: [
          {
            title: "Trading Diary",
            description:
              "Registra operaciones, setup, emociÃ³n, ejecuciÃ³n, errores, notas y lecciones.",
          },
          {
            title: "Calendar",
            description:
              "Lee la performance dÃ­a por dÃ­a e identifica dÃ­as positivos, negativos o flat.",
          },
          {
            title: "Equity",
            description:
              "Controla crecimiento del capital, equity curve, drawdown, best trade y worst trade.",
          },
        ],
      },
      {
        phase: "Intelligence",
        eyebrow: "Analytics, Reports, Rules",
        title: "Entiende quÃ© funciona de verdad",
        description:
          "Analytics, Reports y Rules convierten datos en lectura operativa: mejores sÃ­mbolos, sesiones, errores, psicologÃ­a, objetivos y lÃ­mites.",
        cards: [
          {
            title: "Analytics",
            description:
              "Analiza symbols, direction, sessions, emotions, execution quality y patterns.",
          },
          {
            title: "Reports",
            description:
              "Lee resÃºmenes profesionales sobre performance, riesgos, fortalezas y debilidades.",
          },
          {
            title: "Rules & Goals",
            description:
              "Configura targets, limits, reglas operativas y seÃ±ales de control.",
          },
        ],
      },
      {
        phase: "Protection",
        eyebrow: "Sessions & Copilot",
        title: "Protege claridad y disciplina",
        description:
          "VOLTIS no debe solo mostrar resultados. Debe ayudarte a entender cuÃ¡ndo estÃ¡s perdiendo claridad, disciplina o control operativo.",
        spotlight:
          "El mayor valor llega cuando VOLTIS empieza a reconocer lo que tÃº corres el riesgo de no ver.",
        cards: [
          {
            title: "Sessions",
            description:
              "Prepara la sesiÃ³n antes de operar y revÃ­sala despuÃ©s con focus, bias y review.",
          },
          {
            title: "Copilot",
            description:
              "Observa memoria, patrones, seÃ±ales de riesgo y comportamiento operativo.",
          },
        ],
      },
      {
        phase: "Management",
        eyebrow: "Workspace, Members, Integrations",
        title: "Gestiona estructura, equipo y sistema",
        description:
          "VOLTIS tambiÃ©n puede ser un entorno de trabajo privado: members, workspace, permissions, integrations, settings y backup.",
        cards: [
          {
            title: "Workspace & Members",
            description:
              "Gestiona members, presence, activity, performance individual y access.",
          },
          {
            title: "Integrations",
            description:
              "Prepara MT5, broker sync y modo manual, automÃ¡tico o hÃ­brido.",
          },
          {
            title: "Settings",
            description:
              "Gestiona idioma, moneda, onboarding, backup y ajustes generales.",
          },
        ],
      },
      {
        phase: "Principio final",
        eyebrow: "Use it seriously",
        title: "VOLTIS vale segÃºn cÃ³mo lo usas",
        description:
          "No se trata de llenar la app con datos aleatorios. Se trata de usarla con constancia, precisiÃ³n y respeto por el proceso.",
        spotlight:
          "Si tienes acceso a VOLTIS, estÃ¡s dentro de algo serio.",
        cards: [
          {
            title: "Introduce datos reales",
            description:
              "Cada operaciÃ³n bien registrada hace mÃ¡s Ãºtiles todos los futuros reports, charts y analysis.",
          },
          {
            title: "Revisa con claridad",
            description:
              "No uses VOLTIS solo cuando ganas. Ãšsalo sobre todo cuando necesitas corregir algo.",
          },
          {
            title: "Protege el proceso",
            description:
              "Profit y discipline no deben estar separados. VOLTIS existe para conectarlos.",
          },
        ],
      },
    ],
  },

  fr: {
    privateAccess: "VOLTIS Private Access",
    stepCounter: (current, total) => `${current}/${total}`,
    back: "Retour",
    continue: "Continuer",
    enterVoltis: "Entrer dans VOLTIS",
    close: "Fermer lâ€™onboarding",
    steps: [
      {
        phase: "Vision",
        eyebrow: "Private access",
        title: "VOLTIS nâ€™est pas une application de trading ordinaire",
        description:
          "VOLTIS est un systÃ¨me dâ€™exploitation privÃ© pour le trading, crÃ©Ã© pour des traders sÃ©lectionnÃ©s qui veulent mesurer, protÃ©ger et amÃ©liorer leur comportement opÃ©rationnel.",
        spotlight:
          "Il nâ€™est pas ouvert Ã  tout le monde. Il nâ€™est pas conÃ§u pour le marchÃ© de masse. Câ€™est un outil sÃ©rieux pour ceux qui veulent traiter le trading sÃ©rieusement.",
        cards: [
          {
            title: "AccÃ¨s sÃ©lectionnÃ©",
            description:
              "VOLTIS nâ€™est pas fait pour nâ€™importe qui. Lâ€™accÃ¨s est contrÃ´lÃ©, privÃ© et intentionnel.",
          },
          {
            title: "Pas simplement gratuit",
            description:
              "Tu ne lâ€™utilises pas parce quâ€™il est bon marchÃ©. Tu lâ€™utilises parce que tu es dans quelque chose qui nâ€™est pas vendu Ã  tout le monde.",
          },
        ],
      },
      {
        phase: "Philosophie",
        eyebrow: "Measure. Protect. Improve.",
        title: "La mission est de te rendre plus lucide",
        description:
          "VOLTIS ne sert pas seulement Ã  afficher des chiffres. Il tâ€™aide Ã  comprendre comment tu trades, quels patterns tu rÃ©pÃ¨tes, oÃ¹ tu perds ta discipline et ce que tu dois protÃ©ger.",
        spotlight:
          "Le vrai objectif nâ€™est pas seulement de savoir combien tu as gagnÃ© ou perdu. Câ€™est de comprendre quel type de trader tu deviens.",
        cards: [
          {
            title: "Measure",
            description:
              "Mesure performance, equity, win rate, drawdown, sessions et qualitÃ© dâ€™exÃ©cution.",
          },
          {
            title: "Protect",
            description:
              "ProtÃ¨ge capital, discipline, luciditÃ© et respect des rÃ¨gles opÃ©rationnelles.",
          },
          {
            title: "Improve",
            description:
              "AmÃ©liore exÃ©cution, review, comportement et qualitÃ© de dÃ©cision dans le temps.",
          },
        ],
      },
      {
        phase: "MÃ©thode",
        eyebrow: "Operating flow",
        title: "Le bon flux nâ€™est pas alÃ©atoire",
        description:
          "VOLTIS fonctionne au mieux quand tu lâ€™utilises comme un systÃ¨me dâ€™exploitation : planifier, exÃ©cuter, journaliser, revoir, protÃ©ger et amÃ©liorer.",
        spotlight:
          "Plan â†’ Execute â†’ Journal â†’ Review â†’ Detect Patterns â†’ Protect Discipline â†’ Improve Behavior",
        cards: [
          {
            title: "Avant la session",
            description:
              "DÃ©finis focus, risk, scenario, rÃ¨gles et conditions opÃ©rationnelles.",
          },
          {
            title: "Pendant le trading",
            description:
              "Respecte le plan, Ã©vite lâ€™impulsivitÃ© et garde le risque sous contrÃ´le.",
          },
          {
            title: "AprÃ¨s la session",
            description:
              "Journalise, revois, identifie erreurs, leÃ§ons et patterns rÃ©currents.",
          },
        ],
      },
      {
        phase: "Compte",
        eyebrow: "Account Hub & Dashboard",
        title: "Commence par le centre opÃ©rationnel du compte",
        description:
          "Quand tu entres dans un compte, commence par lâ€™Account Hub. De lÃ , tu accÃ¨des Ã  Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot et gestion.",
        cards: [
          {
            title: "Account Hub",
            description:
              "Le premier Ã©cran du compte. Il tâ€™oriente et tâ€™envoie vers les bonnes sections.",
          },
          {
            title: "Dashboard",
            description:
              "Affiche immÃ©diatement equity, PnL, win rate, target, drawdown et Ã©tat gÃ©nÃ©ral.",
          },
        ],
      },
      {
        phase: "Execution",
        eyebrow: "Diary, Calendar, Equity",
        title: "Construis une mÃ©moire opÃ©rationnelle",
        description:
          "Les pages core collectent la base de ton trading : trades, calendrier, croissance de lâ€™equity et progression du compte.",
        cards: [
          {
            title: "Trading Diary",
            description:
              "Enregistre trades, setup, Ã©motion, exÃ©cution, erreurs, notes et leÃ§ons.",
          },
          {
            title: "Calendar",
            description:
              "Lis la performance jour par jour et reconnais les journÃ©es positives, nÃ©gatives ou flat.",
          },
          {
            title: "Equity",
            description:
              "Suis croissance du capital, equity curve, drawdown, best trade et worst trade.",
          },
        ],
      },
      {
        phase: "Intelligence",
        eyebrow: "Analytics, Reports, Rules",
        title: "Comprends ce qui fonctionne vraiment",
        description:
          "Analytics, Reports et Rules transforment les donnÃ©es en lecture opÃ©rationnelle : meilleurs symboles, sessions, erreurs, psychologie, objectifs et limites.",
        cards: [
          {
            title: "Analytics",
            description:
              "Analyse symbols, direction, sessions, emotions, execution quality et patterns.",
          },
          {
            title: "Reports",
            description:
              "Lis des rÃ©sumÃ©s professionnels sur performance, risques, forces et faiblesses.",
          },
          {
            title: "Rules & Goals",
            description:
              "DÃ©finis targets, limits, rÃ¨gles opÃ©rationnelles et signaux de contrÃ´le.",
          },
        ],
      },
      {
        phase: "Protection",
        eyebrow: "Sessions & Copilot",
        title: "ProtÃ¨ge luciditÃ© et discipline",
        description:
          "VOLTIS ne doit pas seulement montrer des rÃ©sultats. Il doit tâ€™aider Ã  comprendre quand tu perds luciditÃ©, discipline ou contrÃ´le opÃ©rationnel.",
        spotlight:
          "La plus grande valeur arrive quand VOLTIS commence Ã  reconnaÃ®tre ce que tu risques de ne pas voir.",
        cards: [
          {
            title: "Sessions",
            description:
              "PrÃ©pare la session avant de trader et revois-la aprÃ¨s avec focus, bias et review.",
          },
          {
            title: "Copilot",
            description:
              "Observe mÃ©moire, patterns, signaux de risque et comportement opÃ©rationnel.",
          },
        ],
      },
      {
        phase: "Management",
        eyebrow: "Workspace, Members, Integrations",
        title: "GÃ¨re structure, Ã©quipe et systÃ¨me",
        description:
          "VOLTIS peut aussi Ãªtre un environnement de travail privÃ© : members, workspace, permissions, integrations, settings et backup.",
        cards: [
          {
            title: "Workspace & Members",
            description:
              "GÃ¨re members, presence, activity, performance individuelle et access.",
          },
          {
            title: "Integrations",
            description:
              "PrÃ©pare MT5, broker sync et mode manuel, automatique ou hybride.",
          },
          {
            title: "Settings",
            description:
              "GÃ¨re langue, devise, onboarding, backup et paramÃ¨tres gÃ©nÃ©raux.",
          },
        ],
      },
      {
        phase: "Principe final",
        eyebrow: "Use it seriously",
        title: "VOLTIS vaut autant que la maniÃ¨re dont tu lâ€™utilises",
        description:
          "Le but nâ€™est pas de remplir lâ€™app avec des donnÃ©es alÃ©atoires. Le but est de lâ€™utiliser avec constance, prÃ©cision et respect du processus.",
        spotlight:
          "Si tu as accÃ¨s Ã  VOLTIS, tu es dans quelque chose de sÃ©rieux.",
        cards: [
          {
            title: "Entre de vraies donnÃ©es",
            description:
              "Chaque trade bien enregistrÃ© rend les futurs reports, charts et analysis plus utiles.",
          },
          {
            title: "Revois avec luciditÃ©",
            description:
              "Nâ€™utilise pas VOLTIS seulement quand tu gagnes. Utilise-le surtout quand tu dois corriger quelque chose.",
          },
          {
            title: "ProtÃ¨ge le processus",
            description:
              "Profit et discipline ne doivent pas Ãªtre sÃ©parÃ©s. VOLTIS existe pour les connecter.",
          },
        ],
      },
    ],
  },

  de: {
    privateAccess: "VOLTIS Private Access",
    stepCounter: (current, total) => `${current}/${total}`,
    back: "ZurÃ¼ck",
    continue: "Weiter",
    enterVoltis: "VOLTIS betreten",
    close: "Onboarding schlieÃŸen",
    steps: [
      {
        phase: "Vision",
        eyebrow: "Private access",
        title: "VOLTIS ist keine normale Trading-App",
        description:
          "VOLTIS ist ein privates Trading Operating System fÃ¼r ausgewÃ¤hlte Trader, die ihr operatives Verhalten messen, schÃ¼tzen und verbessern wollen.",
        spotlight:
          "Es ist nicht fÃ¼r alle offen. Es ist nicht fÃ¼r den Massenmarkt gedacht. Es ist ein ernsthaftes Werkzeug fÃ¼r Trader, die Trading ernsthaft behandeln wollen.",
        cards: [
          {
            title: "AusgewÃ¤hlter Zugang",
            description:
              "VOLTIS ist nicht fÃ¼r jeden gebaut. Der Zugang ist kontrolliert, privat und bewusst.",
          },
          {
            title: "Nicht einfach kostenlos",
            description:
              "Du nutzt es nicht, weil es billig ist. Du nutzt es, weil du in etwas bist, das nicht jedem verkauft wird.",
          },
        ],
      },
      {
        phase: "Philosophie",
        eyebrow: "Measure. Protect. Improve.",
        title: "Die Mission ist mehr Klarheit",
        description:
          "VOLTIS zeigt nicht nur Zahlen. Es hilft dir zu verstehen, wie du tradest, welche Muster du wiederholst, wo Disziplin fÃ¤llt und was du schÃ¼tzen musst.",
        spotlight:
          "Das echte Ziel ist nicht nur zu wissen, wie viel du gewonnen oder verloren hast. Es geht darum zu verstehen, welcher Trader du wirst.",
        cards: [
          {
            title: "Measure",
            description:
              "Messe performance, equity, win rate, drawdown, sessions und execution quality.",
          },
          {
            title: "Protect",
            description:
              "SchÃ¼tze Kapital, Disziplin, Klarheit und die Einhaltung operativer Regeln.",
          },
          {
            title: "Improve",
            description:
              "Verbessere execution, review, Verhalten und EntscheidungsqualitÃ¤t mit der Zeit.",
          },
        ],
      },
      {
        phase: "Methode",
        eyebrow: "Operating flow",
        title: "Der richtige Ablauf ist nicht zufÃ¤llig",
        description:
          "VOLTIS funktioniert am besten, wenn du es als Betriebssystem nutzt: planen, ausfÃ¼hren, journalen, Ã¼berprÃ¼fen, schÃ¼tzen und verbessern.",
        spotlight:
          "Plan â†’ Execute â†’ Journal â†’ Review â†’ Detect Patterns â†’ Protect Discipline â†’ Improve Behavior",
        cards: [
          {
            title: "Vor der Session",
            description:
              "Definiere focus, risk, scenario, Regeln und operative Bedingungen.",
          },
          {
            title: "WÃ¤hrend des Tradings",
            description:
              "Halte dich an den Plan, vermeide ImpulsivitÃ¤t und kontrolliere das Risiko.",
          },
          {
            title: "Nach der Session",
            description:
              "Journale, Ã¼berprÃ¼fe, erkenne Fehler, Lektionen und wiederkehrende Muster.",
          },
        ],
      },
      {
        phase: "Account",
        eyebrow: "Account Hub & Dashboard",
        title: "Starte im operativen Zentrum des Accounts",
        description:
          "Wenn du einen Account Ã¶ffnest, starte im Account Hub. Von dort erreichst du Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot und Management.",
        cards: [
          {
            title: "Account Hub",
            description:
              "Der erste Account-Bildschirm. Er orientiert dich und fÃ¼hrt dich zu den richtigen Bereichen.",
          },
          {
            title: "Dashboard",
            description:
              "Zeigt sofort equity, PnL, win rate, target, drawdown und allgemeinen Status.",
          },
        ],
      },
      {
        phase: "Execution",
        eyebrow: "Diary, Calendar, Equity",
        title: "Baue operative Erinnerung auf",
        description:
          "Die Core-Seiten sammeln die Basis deines Tradings: Trades, Kalender, Equity-Wachstum und Account-Fortschritt.",
        cards: [
          {
            title: "Trading Diary",
            description:
              "Erfasse trades, setup, emotion, execution, Fehler, Notizen und Lektionen.",
          },
          {
            title: "Calendar",
            description:
              "Lies die Performance Tag fÃ¼r Tag und erkenne positive, negative oder flat Tage.",
          },
          {
            title: "Equity",
            description:
              "Verfolge Kapitalwachstum, equity curve, drawdown, best trade und worst trade.",
          },
        ],
      },
      {
        phase: "Intelligence",
        eyebrow: "Analytics, Reports, Rules",
        title: "Verstehe, was wirklich funktioniert",
        description:
          "Analytics, Reports und Rules verwandeln Daten in operative Einsicht: beste Symbole, Sessions, Fehler, Psychologie, Ziele und Limits.",
        cards: [
          {
            title: "Analytics",
            description:
              "Analysiere symbols, direction, sessions, emotions, execution quality und patterns.",
          },
          {
            title: "Reports",
            description:
              "Lies professionelle Zusammenfassungen zu performance, Risiken, StÃ¤rken und SchwÃ¤chen.",
          },
          {
            title: "Rules & Goals",
            description:
              "Setze targets, limits, operative Regeln und Kontrollsignale.",
          },
        ],
      },
      {
        phase: "Protection",
        eyebrow: "Sessions & Copilot",
        title: "SchÃ¼tze Klarheit und Disziplin",
        description:
          "VOLTIS soll nicht nur Ergebnisse zeigen. Es soll dir helfen zu erkennen, wann du Klarheit, Disziplin oder operative Kontrolle verlierst.",
        spotlight:
          "Der grÃ¶ÃŸte Wert entsteht, wenn VOLTIS erkennt, was du selbst zu Ã¼bersehen riskierst.",
        cards: [
          {
            title: "Sessions",
            description:
              "Bereite die Session vor dem Trading vor und Ã¼berprÃ¼fe sie danach mit focus, bias und review.",
          },
          {
            title: "Copilot",
            description:
              "Beobachte Memory, Muster, Risikosignale und operatives Verhalten.",
          },
        ],
      },
      {
        phase: "Management",
        eyebrow: "Workspace, Members, Integrations",
        title: "Verwalte Struktur, Team und System",
        description:
          "VOLTIS kann auch eine private Arbeitsumgebung sein: members, workspace, permissions, integrations, settings und backup.",
        cards: [
          {
            title: "Workspace & Members",
            description:
              "Verwalte members, presence, activity, individuelle performance und access.",
          },
          {
            title: "Integrations",
            description:
              "Bereite MT5, broker sync und manual, automatic oder hybrid mode vor.",
          },
          {
            title: "Settings",
            description:
              "Verwalte Sprache, WÃ¤hrung, onboarding, backup und allgemeine Einstellungen.",
          },
        ],
      },
      {
        phase: "Finales Prinzip",
        eyebrow: "Use it seriously",
        title: "VOLTIS ist so wertvoll, wie du es nutzt",
        description:
          "Es geht nicht darum, die App mit zufÃ¤lligen Daten zu fÃ¼llen. Es geht darum, sie konstant, prÃ¤zise und mit Respekt fÃ¼r den Prozess zu nutzen.",
        spotlight:
          "Wenn du Zugang zu VOLTIS hast, bist du in etwas Ernsthaftem.",
        cards: [
          {
            title: "Gib echte Daten ein",
            description:
              "Jeder gut erfasste Trade macht zukÃ¼nftige reports, charts und analysis nÃ¼tzlicher.",
          },
          {
            title: "ÃœberprÃ¼fe mit Klarheit",
            description:
              "Nutze VOLTIS nicht nur, wenn du gewinnst. Nutze es besonders, wenn du etwas korrigieren musst.",
          },
          {
            title: "SchÃ¼tze den Prozess",
            description:
              "Profit und discipline dÃ¼rfen nicht getrennt sein. VOLTIS existiert, um sie zu verbinden.",
          },
        ],
      },
    ],
  },
};

function buildCopy(
  text: OnboardingCopyText
): OnboardingCopy {
  return {
    ...text,
    steps: text.steps.map((step, stepIndex) => {
      const visual = stepVisuals[stepIndex];

      return {
        ...step,
        icon: visual.icon,
        accent: visual.accent,
        cards: step.cards.map(
          (card, cardIndex) => {
            const cardVisual =
              visual.cards[cardIndex];

            return {
              ...card,
              icon: cardVisual.icon,
              tone: cardVisual.tone,
            };
          }
        ),
      };
    }),
  };
}

function getCopy(language: AppLanguage) {
  return buildCopy(
    onboardingText[language] ?? onboardingText.en
  );
}

export default function OnboardingModal({
  appLanguage,
}: {
  appLanguage?: string | null;
}) {
  const language =
    normalizeAppLanguage(appLanguage);

  const copy = getCopy(language);

  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return (
      localStorage.getItem(
        ONBOARDING_STORAGE_KEY
      ) !== "true"
    );
  });
  const [currentStep, setCurrentStep] =
    useState(0);
function closeOnboarding() {
    localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      "true"
    );

    setOpen(false);
  }

  function goNext() {
    if (
      currentStep >=
      copy.steps.length - 1
    ) {
      closeOnboarding();
      return;
    }

    setCurrentStep((step) => step + 1);
  }

  function goBack() {
    setCurrentStep((step) =>
      Math.max(0, step - 1)
    );
  }

  if (!open) {
    return null;
  }

  const step = copy.steps[currentStep];
  const StepIcon = step.icon;

  const progress =
    ((currentStep + 1) / copy.steps.length) *
    100;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[36px] border border-white/10 bg-[#071018] p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_35%)]" />

        <button
          onClick={closeOnboarding}
          className="absolute right-4 top-4 z-20 rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
          aria-label={copy.close}
        >
          <X size={20} />
        </button>

        <div className="relative z-10">
          <div className="mb-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                {copy.privateAccess}
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                {step.phase}
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                {copy.stepCounter(
                  currentStep + 1,
                  copy.steps.length
                )}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-300 transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <div className="grid min-h-[560px] items-stretch gap-8 lg:grid-cols-5">
            <div className="flex flex-col justify-center lg:col-span-3">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-black/20">
                <StepIcon
                  className={step.accent}
                  size={30}
                />
              </div>

              <p
                className={`text-sm font-black uppercase tracking-[0.2em] ${step.accent}`}
              >
                {step.eyebrow}
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                {step.title}
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400">
                {step.description}
              </p>

              {step.spotlight && (
                <div className="mt-7 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5">
                  <p className="text-sm font-semibold leading-7 text-cyan-100">
                    {step.spotlight}
                  </p>
                </div>
              )}
            </div>

            <div className="grid auto-rows-fr gap-4 lg:col-span-2">
              {step.cards.map((card) => {
                const CardIcon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                          <CardIcon
                            className={card.tone}
                            size={22}
                          />
                        </div>

                        <CheckCircle2
                          className="text-green-400"
                          size={18}
                        />
                      </div>

                      <h3 className="text-lg font-black text-white">
                        {card.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sticky bottom-0 z-20 mt-8 flex flex-col gap-3 border-t border-white/10 bg-[#071018]/95 pt-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={goBack}
              disabled={currentStep === 0}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-bold text-white transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={18} />
              {copy.back}
            </button>

            <button
              onClick={goNext}
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 text-sm font-black text-black transition hover:bg-green-400"
            >
              {currentStep ===
                copy.steps.length - 1
                ? copy.enterVoltis
                : copy.continue}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


