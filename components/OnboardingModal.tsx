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
          "VOLTIS non è una normale app di trading",
        description:
          "VOLTIS è un private trading operating system creato per trader selezionati che vogliono misurare, proteggere e migliorare il proprio comportamento operativo.",
        spotlight:
          "Non è aperto a tutti. Non è pensato per il mercato di massa. È uno strumento serio per chi vuole trattare il trading seriamente.",
        cards: [
          {
            title: "Accesso selezionato",
            description:
              "VOLTIS non nasce per essere usato da chiunque. L’accesso è controllato, privato e intenzionale.",
          },
          {
            title: "Non è solo gratuito",
            description:
              "Non lo usi perché costa poco. Lo usi perché sei dentro qualcosa che non è in vendita a tutti.",
          },
        ],
      },
      {
        phase: "Filosofia",
        eyebrow: "Measure. Protect. Improve.",
        title: "La missione è renderti più lucido",
        description:
          "VOLTIS non serve solo a mostrarti numeri. Serve a farti capire come tradi, quali pattern ripeti, dove perdi disciplina e cosa devi proteggere.",
        spotlight:
          "Il vero obiettivo non è sapere solo quanto hai guadagnato o perso. È capire che tipo di trader stai diventando.",
        cards: [
          {
            title: "Measure",
            description:
              "Misura performance, equity, win rate, drawdown, sessioni e qualità operativa.",
          },
          {
            title: "Protect",
            description:
              "Proteggi capitale, disciplina, lucidità e rispetto delle regole operative.",
          },
          {
            title: "Improve",
            description:
              "Migliora esecuzione, review, comportamento e capacità decisionale nel tempo.",
          },
        ],
      },
      {
        phase: "Metodo",
        eyebrow: "Operating flow",
        title: "Il flusso corretto non è casuale",
        description:
          "VOLTIS funziona al meglio quando lo usi come un sistema operativo: prepari, esegui, registri, analizzi, proteggi e migliori.",
        spotlight:
          "Plan → Execute → Journal → Review → Detect Patterns → Protect Discipline → Improve Behavior",
        cards: [
          {
            title: "Prima della sessione",
            description:
              "Definisci focus, rischio, scenario, regole e condizioni operative.",
          },
          {
            title: "Durante l’operatività",
            description:
              "Rispetta il piano, evita impulsività e mantieni controllo sul rischio.",
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
          "Parti dal centro operativo dell’account",
        description:
          "Quando entri in un account, parti dall’Account Hub. Da lì puoi raggiungere Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot e gestione.",
        cards: [
          {
            title: "Account Hub",
            description:
              "La prima schermata dell’account. Ti orienta e ti porta nelle sezioni giuste.",
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
          "Le pagine core raccolgono la base del tuo trading: operazioni, calendario, crescita dell’equity e andamento del conto.",
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
        title: "Proteggi lucidità e disciplina",
        description:
          "VOLTIS non deve solo mostrarti risultati. Deve aiutarti a capire quando stai perdendo lucidità, disciplina o controllo operativo.",
        spotlight:
          "Il valore più grande arriva quando VOLTIS inizia a riconoscere ciò che tu rischi di non vedere.",
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
          "VOLTIS può essere anche un ambiente privato di lavoro: membri, workspace, permessi, integrazioni, impostazioni e backup.",
        cards: [
          {
            title: "Workspace & Members",
            description:
              "Gestisci membri, presenza, attività, performance individuali e accessi.",
          },
          {
            title: "Integrations",
            description:
              "Prepara MT5, broker sync e modalità manuale, automatica o ibrida.",
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
          "Non serve riempire l’app di dati casuali. Serve usarla con costanza, precisione e rispetto del processo.",
        spotlight:
          "Se hai accesso a VOLTIS, sei dentro qualcosa di serio.",
        cards: [
          {
            title: "Inserisci dati veri",
            description:
              "Ogni trade registrato bene rende più utile ogni report, grafico e analisi futura.",
          },
          {
            title: "Rivedi con lucidità",
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
          "Plan → Execute → Journal → Review → Detect Patterns → Protect Discipline → Improve Behavior",
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
    back: "Назад",
    continue: "Продовжити",
    enterVoltis: "Увійти у VOLTIS",
    close: "Закрити онбординг",
    steps: [
      {
        phase: "Бачення",
        eyebrow: "Private access",
        title: "VOLTIS — це не звичайний торговий застосунок",
        description:
          "VOLTIS — це приватна операційна система для трейдингу, створена для обраних трейдерів, які хочуть вимірювати, захищати та покращувати свою операційну поведінку.",
        spotlight:
          "Він не відкритий для всіх. Він не створений для масового ринку. Це серйозний інструмент для тих, хто хоче ставитися до трейдингу серйозно.",
        cards: [
          {
            title: "Вибірковий доступ",
            description:
              "VOLTIS не створений для будь-кого. Доступ контрольований, приватний і свідомий.",
          },
          {
            title: "Це не просто безкоштовно",
            description:
              "Ти користуєшся ним не тому, що він дешевий. Ти всередині того, що не продається всім.",
          },
        ],
      },
      {
        phase: "Філософія",
        eyebrow: "Measure. Protect. Improve.",
        title: "Місія — зробити тебе більш ясним",
        description:
          "VOLTIS не просто показує цифри. Він допомагає зрозуміти, як ти торгуєш, які патерни повторюєш, де втрачаєш дисципліну і що потрібно захищати.",
        spotlight:
          "Справжня мета — не лише знати, скільки ти заробив або втратив. Мета — зрозуміти, яким трейдером ти стаєш.",
        cards: [
          {
            title: "Measure",
            description:
              "Вимірюй performance, equity, win rate, drawdown, сесії та якість виконання.",
          },
          {
            title: "Protect",
            description:
              "Захищай капітал, дисципліну, ясність і дотримання операційних правил.",
          },
          {
            title: "Improve",
            description:
              "Покращуй виконання, review, поведінку та якість рішень з часом.",
          },
        ],
      },
      {
        phase: "Метод",
        eyebrow: "Operating flow",
        title: "Правильний потік не є випадковим",
        description:
          "VOLTIS працює найкраще, коли ти використовуєш його як операційну систему: плануєш, виконуєш, записуєш, аналізуєш, захищаєш і покращуєш.",
        spotlight:
          "Plan → Execute → Journal → Review → Detect Patterns → Protect Discipline → Improve Behavior",
        cards: [
          {
            title: "Перед сесією",
            description:
              "Визнач focus, risk, scenario, правила та операційні умови.",
          },
          {
            title: "Під час торгівлі",
            description:
              "Дотримуйся плану, уникай імпульсивності та тримай ризик під контролем.",
          },
          {
            title: "Після сесії",
            description:
              "Запиши, переглянь, знайди помилки, уроки та повторювані патерни.",
          },
        ],
      },
      {
        phase: "Акаунт",
        eyebrow: "Account Hub & Dashboard",
        title: "Починай з центру керування акаунтом",
        description:
          "Коли входиш в акаунт, починай з Account Hub. Звідти ти переходиш до Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot і керування.",
        cards: [
          {
            title: "Account Hub",
            description:
              "Перша сторінка акаунта. Вона орієнтує тебе і веде в потрібні розділи.",
          },
          {
            title: "Dashboard",
            description:
              "Одразу показує equity, PnL, win rate, target, drawdown і загальний стан.",
          },
        ],
      },
      {
        phase: "Execution",
        eyebrow: "Diary, Calendar, Equity",
        title: "Будуй операційну памʼять",
        description:
          "Core-сторінки збирають основу твого трейдингу: угоди, календар, зростання equity і прогрес акаунта.",
        cards: [
          {
            title: "Trading Diary",
            description:
              "Записуй угоди, setup, емоції, виконання, помилки, нотатки та уроки.",
          },
          {
            title: "Calendar",
            description:
              "Дивись performance по днях і визначай позитивні, негативні або flat-дні.",
          },
          {
            title: "Equity",
            description:
              "Відстежуй зростання капіталу, equity curve, drawdown, best trade і worst trade.",
          },
        ],
      },
      {
        phase: "Intelligence",
        eyebrow: "Analytics, Reports, Rules",
        title: "Зрозумій, що справді працює",
        description:
          "Analytics, Reports і Rules перетворюють дані на операційне читання: найкращі символи, сесії, помилки, психологія, цілі та ліміти.",
        cards: [
          {
            title: "Analytics",
            description:
              "Аналізуй symbols, direction, sessions, emotions, execution quality і patterns.",
          },
          {
            title: "Reports",
            description:
              "Читай професійні підсумки про performance, ризики, сильні та слабкі сторони.",
          },
          {
            title: "Rules & Goals",
            description:
              "Встановлюй targets, limits, операційні правила та контрольні сигнали.",
          },
        ],
      },
      {
        phase: "Protection",
        eyebrow: "Sessions & Copilot",
        title: "Захищай ясність і дисципліну",
        description:
          "VOLTIS має не лише показувати результати. Він має допомагати тобі зрозуміти, коли ти втрачаєш ясність, дисципліну або операційний контроль.",
        spotlight:
          "Найбільша цінність з’являється тоді, коли VOLTIS починає розпізнавати те, що ти ризикуєш не побачити.",
        cards: [
          {
            title: "Sessions",
            description:
              "Готуй сесію перед торгівлею і переглядай її після з focus, bias і review.",
          },
          {
            title: "Copilot",
            description:
              "Спостерігай за памʼяттю, патернами, сигналами ризику та операційною поведінкою.",
          },
        ],
      },
      {
        phase: "Management",
        eyebrow: "Workspace, Members, Integrations",
        title: "Керуй структурою, командою і системою",
        description:
          "VOLTIS може бути також приватним робочим середовищем: members, workspace, permissions, integrations, settings і backup.",
        cards: [
          {
            title: "Workspace & Members",
            description:
              "Керуй members, presence, activity, індивідуальною performance і access.",
          },
          {
            title: "Integrations",
            description:
              "Готуй MT5, broker sync і manual, automatic або hybrid mode.",
          },
          {
            title: "Settings",
            description:
              "Керуй мовою, валютою, onboarding, backup і загальними налаштуваннями.",
          },
        ],
      },
      {
        phase: "Фінальний принцип",
        eyebrow: "Use it seriously",
        title: "VOLTIS вартий того, як ти його використовуєш",
        description:
          "Мета не в тому, щоб заповнювати застосунок випадковими даними. Мета — використовувати його стабільно, точно і з повагою до процесу.",
        spotlight:
          "Якщо ти маєш доступ до VOLTIS, ти всередині чогось серйозного.",
        cards: [
          {
            title: "Внось справжні дані",
            description:
              "Кожна добре записана угода робить майбутні reports, charts і analysis кориснішими.",
          },
          {
            title: "Переглядай з ясністю",
            description:
              "Не використовуй VOLTIS лише коли перемагаєш. Використовуй його особливо тоді, коли потрібно щось виправити.",
          },
          {
            title: "Захищай процес",
            description:
              "Profit і discipline не мають бути розділені. VOLTIS існує, щоб їх поєднати.",
          },
        ],
      },
    ],
  },

  ru: {
    privateAccess: "VOLTIS Private Access",
    stepCounter: (current, total) => `${current}/${total}`,
    back: "Назад",
    continue: "Продолжить",
    enterVoltis: "Войти в VOLTIS",
    close: "Закрыть онбординг",
    steps: [
      {
        phase: "Видение",
        eyebrow: "Private access",
        title: "VOLTIS — это не обычное приложение для трейдинга",
        description:
          "VOLTIS — это приватная операционная система для трейдинга, созданная для выбранных трейдеров, которые хотят измерять, защищать и улучшать свое операционное поведение.",
        spotlight:
          "Она не открыта для всех. Она не создана для массового рынка. Это серьезный инструмент для тех, кто хочет относиться к трейдингу серьезно.",
        cards: [
          {
            title: "Выборочный доступ",
            description:
              "VOLTIS не создан для каждого. Доступ контролируемый, приватный и осознанный.",
          },
          {
            title: "Это не просто бесплатно",
            description:
              "Ты используешь его не потому, что он дешевый. Ты внутри того, что не продается всем.",
          },
        ],
      },
      {
        phase: "Философия",
        eyebrow: "Measure. Protect. Improve.",
        title: "Миссия — сделать тебя более ясным",
        description:
          "VOLTIS не просто показывает цифры. Он помогает понять, как ты торгуешь, какие паттерны повторяешь, где теряешь дисциплину и что нужно защищать.",
        spotlight:
          "Настоящая цель — не только знать, сколько ты заработал или потерял. Цель — понять, каким трейдером ты становишься.",
        cards: [
          {
            title: "Measure",
            description:
              "Измеряй performance, equity, win rate, drawdown, сессии и качество исполнения.",
          },
          {
            title: "Protect",
            description:
              "Защищай капитал, дисциплину, ясность и соблюдение операционных правил.",
          },
          {
            title: "Improve",
            description:
              "Улучшай исполнение, review, поведение и качество решений со временем.",
          },
        ],
      },
      {
        phase: "Метод",
        eyebrow: "Operating flow",
        title: "Правильный поток не случаен",
        description:
          "VOLTIS работает лучше всего, когда ты используешь его как операционную систему: планируешь, исполняешь, записываешь, анализируешь, защищаешь и улучшаешь.",
        spotlight:
          "Plan → Execute → Journal → Review → Detect Patterns → Protect Discipline → Improve Behavior",
        cards: [
          {
            title: "Перед сессией",
            description:
              "Определи focus, risk, scenario, правила и операционные условия.",
          },
          {
            title: "Во время торговли",
            description:
              "Следуй плану, избегай импульсивности и держи риск под контролем.",
          },
          {
            title: "После сессии",
            description:
              "Записывай, пересматривай, находи ошибки, уроки и повторяющиеся паттерны.",
          },
        ],
      },
      {
        phase: "Аккаунт",
        eyebrow: "Account Hub & Dashboard",
        title: "Начинай с центра управления аккаунтом",
        description:
          "Когда ты входишь в аккаунт, начинай с Account Hub. Оттуда ты переходишь к Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot и управлению.",
        cards: [
          {
            title: "Account Hub",
            description:
              "Первая страница аккаунта. Она ориентирует тебя и ведет в нужные разделы.",
          },
          {
            title: "Dashboard",
            description:
              "Сразу показывает equity, PnL, win rate, target, drawdown и общий статус.",
          },
        ],
      },
      {
        phase: "Execution",
        eyebrow: "Diary, Calendar, Equity",
        title: "Создавай операционную память",
        description:
          "Core-страницы собирают основу твоего трейдинга: сделки, календарь, рост equity и прогресс аккаунта.",
        cards: [
          {
            title: "Trading Diary",
            description:
              "Записывай сделки, setup, эмоции, исполнение, ошибки, заметки и уроки.",
          },
          {
            title: "Calendar",
            description:
              "Смотри performance по дням и определяй положительные, отрицательные или flat-дни.",
          },
          {
            title: "Equity",
            description:
              "Отслеживай рост капитала, equity curve, drawdown, best trade и worst trade.",
          },
        ],
      },
      {
        phase: "Intelligence",
        eyebrow: "Analytics, Reports, Rules",
        title: "Пойми, что действительно работает",
        description:
          "Analytics, Reports и Rules превращают данные в операционное чтение: лучшие символы, сессии, ошибки, психология, цели и лимиты.",
        cards: [
          {
            title: "Analytics",
            description:
              "Анализируй symbols, direction, sessions, emotions, execution quality и patterns.",
          },
          {
            title: "Reports",
            description:
              "Читай профессиональные сводки о performance, рисках, сильных и слабых сторонах.",
          },
          {
            title: "Rules & Goals",
            description:
              "Устанавливай targets, limits, операционные правила и контрольные сигналы.",
          },
        ],
      },
      {
        phase: "Protection",
        eyebrow: "Sessions & Copilot",
        title: "Защищай ясность и дисциплину",
        description:
          "VOLTIS должен не только показывать результаты. Он должен помогать понять, когда ты теряешь ясность, дисциплину или операционный контроль.",
        spotlight:
          "Самая большая ценность появляется тогда, когда VOLTIS начинает распознавать то, что ты рискуешь не увидеть.",
        cards: [
          {
            title: "Sessions",
            description:
              "Готовь сессию перед торговлей и пересматривай ее после с focus, bias и review.",
          },
          {
            title: "Copilot",
            description:
              "Наблюдай за памятью, паттернами, сигналами риска и операционным поведением.",
          },
        ],
      },
      {
        phase: "Management",
        eyebrow: "Workspace, Members, Integrations",
        title: "Управляй структурой, командой и системой",
        description:
          "VOLTIS может быть и приватной рабочей средой: members, workspace, permissions, integrations, settings и backup.",
        cards: [
          {
            title: "Workspace & Members",
            description:
              "Управляй members, presence, activity, индивидуальной performance и access.",
          },
          {
            title: "Integrations",
            description:
              "Подготовь MT5, broker sync и manual, automatic или hybrid mode.",
          },
          {
            title: "Settings",
            description:
              "Управляй языком, валютой, onboarding, backup и общими настройками.",
          },
        ],
      },
      {
        phase: "Финальный принцип",
        eyebrow: "Use it seriously",
        title: "VOLTIS ценен настолько, насколько серьезно ты его используешь",
        description:
          "Цель не в том, чтобы заполнить приложение случайными данными. Цель — использовать его стабильно, точно и с уважением к процессу.",
        spotlight:
          "Если у тебя есть доступ к VOLTIS, ты внутри чего-то серьезного.",
        cards: [
          {
            title: "Вноси реальные данные",
            description:
              "Каждая хорошо записанная сделка делает будущие reports, charts и analysis полезнее.",
          },
          {
            title: "Пересматривай с ясностью",
            description:
              "Не используй VOLTIS только когда выигрываешь. Используй его особенно тогда, когда нужно что-то исправить.",
          },
          {
            title: "Защищай процесс",
            description:
              "Profit и discipline не должны быть разделены. VOLTIS существует, чтобы их соединить.",
          },
        ],
      },
    ],
  },

  es: {
    privateAccess: "VOLTIS Private Access",
    stepCounter: (current, total) => `${current}/${total}`,
    back: "Atrás",
    continue: "Continuar",
    enterVoltis: "Entrar en VOLTIS",
    close: "Cerrar onboarding",
    steps: [
      {
        phase: "Visión",
        eyebrow: "Private access",
        title: "VOLTIS no es una app de trading normal",
        description:
          "VOLTIS es un sistema operativo privado de trading creado para traders seleccionados que quieren medir, proteger y mejorar su comportamiento operativo.",
        spotlight:
          "No está abierto a todos. No está diseñado para el mercado masivo. Es una herramienta seria para quienes quieren tratar el trading seriamente.",
        cards: [
          {
            title: "Acceso seleccionado",
            description:
              "VOLTIS no está creado para cualquiera. El acceso es controlado, privado e intencional.",
          },
          {
            title: "No es solo gratis",
            description:
              "No lo usas porque sea barato. Lo usas porque estás dentro de algo que no se vende a todos.",
          },
        ],
      },
      {
        phase: "Filosofía",
        eyebrow: "Measure. Protect. Improve.",
        title: "La misión es darte más claridad",
        description:
          "VOLTIS no solo muestra números. Te ayuda a entender cómo operas, qué patrones repites, dónde pierdes disciplina y qué debes proteger.",
        spotlight:
          "El objetivo real no es solo saber cuánto ganaste o perdiste. Es entender qué tipo de trader te estás convirtiendo.",
        cards: [
          {
            title: "Measure",
            description:
              "Mide performance, equity, win rate, drawdown, sesiones y calidad de ejecución.",
          },
          {
            title: "Protect",
            description:
              "Protege capital, disciplina, claridad y respeto por las reglas operativas.",
          },
          {
            title: "Improve",
            description:
              "Mejora ejecución, review, comportamiento y calidad de decisión con el tiempo.",
          },
        ],
      },
      {
        phase: "Método",
        eyebrow: "Operating flow",
        title: "El flujo correcto no es casual",
        description:
          "VOLTIS funciona mejor cuando lo usas como un sistema operativo: planificas, ejecutas, registras, revisas, proteges y mejoras.",
        spotlight:
          "Plan → Execute → Journal → Review → Detect Patterns → Protect Discipline → Improve Behavior",
        cards: [
          {
            title: "Antes de la sesión",
            description:
              "Define focus, risk, scenario, reglas y condiciones operativas.",
          },
          {
            title: "Durante la operativa",
            description:
              "Respeta el plan, evita impulsividad y mantén el riesgo bajo control.",
          },
          {
            title: "Después de la sesión",
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
          "Cuando entras en una cuenta, empieza desde Account Hub. Desde allí accedes a Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot y gestión.",
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
          "Las páginas core reúnen la base de tu trading: operaciones, calendario, crecimiento de equity y progreso de la cuenta.",
        cards: [
          {
            title: "Trading Diary",
            description:
              "Registra operaciones, setup, emoción, ejecución, errores, notas y lecciones.",
          },
          {
            title: "Calendar",
            description:
              "Lee la performance día por día e identifica días positivos, negativos o flat.",
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
        title: "Entiende qué funciona de verdad",
        description:
          "Analytics, Reports y Rules convierten datos en lectura operativa: mejores símbolos, sesiones, errores, psicología, objetivos y límites.",
        cards: [
          {
            title: "Analytics",
            description:
              "Analiza symbols, direction, sessions, emotions, execution quality y patterns.",
          },
          {
            title: "Reports",
            description:
              "Lee resúmenes profesionales sobre performance, riesgos, fortalezas y debilidades.",
          },
          {
            title: "Rules & Goals",
            description:
              "Configura targets, limits, reglas operativas y señales de control.",
          },
        ],
      },
      {
        phase: "Protection",
        eyebrow: "Sessions & Copilot",
        title: "Protege claridad y disciplina",
        description:
          "VOLTIS no debe solo mostrar resultados. Debe ayudarte a entender cuándo estás perdiendo claridad, disciplina o control operativo.",
        spotlight:
          "El mayor valor llega cuando VOLTIS empieza a reconocer lo que tú corres el riesgo de no ver.",
        cards: [
          {
            title: "Sessions",
            description:
              "Prepara la sesión antes de operar y revísala después con focus, bias y review.",
          },
          {
            title: "Copilot",
            description:
              "Observa memoria, patrones, señales de riesgo y comportamiento operativo.",
          },
        ],
      },
      {
        phase: "Management",
        eyebrow: "Workspace, Members, Integrations",
        title: "Gestiona estructura, equipo y sistema",
        description:
          "VOLTIS también puede ser un entorno de trabajo privado: members, workspace, permissions, integrations, settings y backup.",
        cards: [
          {
            title: "Workspace & Members",
            description:
              "Gestiona members, presence, activity, performance individual y access.",
          },
          {
            title: "Integrations",
            description:
              "Prepara MT5, broker sync y modo manual, automático o híbrido.",
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
        title: "VOLTIS vale según cómo lo usas",
        description:
          "No se trata de llenar la app con datos aleatorios. Se trata de usarla con constancia, precisión y respeto por el proceso.",
        spotlight:
          "Si tienes acceso a VOLTIS, estás dentro de algo serio.",
        cards: [
          {
            title: "Introduce datos reales",
            description:
              "Cada operación bien registrada hace más útiles todos los futuros reports, charts y analysis.",
          },
          {
            title: "Revisa con claridad",
            description:
              "No uses VOLTIS solo cuando ganas. Úsalo sobre todo cuando necesitas corregir algo.",
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
    close: "Fermer l’onboarding",
    steps: [
      {
        phase: "Vision",
        eyebrow: "Private access",
        title: "VOLTIS n’est pas une application de trading ordinaire",
        description:
          "VOLTIS est un système d’exploitation privé pour le trading, créé pour des traders sélectionnés qui veulent mesurer, protéger et améliorer leur comportement opérationnel.",
        spotlight:
          "Il n’est pas ouvert à tout le monde. Il n’est pas conçu pour le marché de masse. C’est un outil sérieux pour ceux qui veulent traiter le trading sérieusement.",
        cards: [
          {
            title: "Accès sélectionné",
            description:
              "VOLTIS n’est pas fait pour n’importe qui. L’accès est contrôlé, privé et intentionnel.",
          },
          {
            title: "Pas simplement gratuit",
            description:
              "Tu ne l’utilises pas parce qu’il est bon marché. Tu l’utilises parce que tu es dans quelque chose qui n’est pas vendu à tout le monde.",
          },
        ],
      },
      {
        phase: "Philosophie",
        eyebrow: "Measure. Protect. Improve.",
        title: "La mission est de te rendre plus lucide",
        description:
          "VOLTIS ne sert pas seulement à afficher des chiffres. Il t’aide à comprendre comment tu trades, quels patterns tu répètes, où tu perds ta discipline et ce que tu dois protéger.",
        spotlight:
          "Le vrai objectif n’est pas seulement de savoir combien tu as gagné ou perdu. C’est de comprendre quel type de trader tu deviens.",
        cards: [
          {
            title: "Measure",
            description:
              "Mesure performance, equity, win rate, drawdown, sessions et qualité d’exécution.",
          },
          {
            title: "Protect",
            description:
              "Protège capital, discipline, lucidité et respect des règles opérationnelles.",
          },
          {
            title: "Improve",
            description:
              "Améliore exécution, review, comportement et qualité de décision dans le temps.",
          },
        ],
      },
      {
        phase: "Méthode",
        eyebrow: "Operating flow",
        title: "Le bon flux n’est pas aléatoire",
        description:
          "VOLTIS fonctionne au mieux quand tu l’utilises comme un système d’exploitation : planifier, exécuter, journaliser, revoir, protéger et améliorer.",
        spotlight:
          "Plan → Execute → Journal → Review → Detect Patterns → Protect Discipline → Improve Behavior",
        cards: [
          {
            title: "Avant la session",
            description:
              "Définis focus, risk, scenario, règles et conditions opérationnelles.",
          },
          {
            title: "Pendant le trading",
            description:
              "Respecte le plan, évite l’impulsivité et garde le risque sous contrôle.",
          },
          {
            title: "Après la session",
            description:
              "Journalise, revois, identifie erreurs, leçons et patterns récurrents.",
          },
        ],
      },
      {
        phase: "Compte",
        eyebrow: "Account Hub & Dashboard",
        title: "Commence par le centre opérationnel du compte",
        description:
          "Quand tu entres dans un compte, commence par l’Account Hub. De là, tu accèdes à Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot et gestion.",
        cards: [
          {
            title: "Account Hub",
            description:
              "Le premier écran du compte. Il t’oriente et t’envoie vers les bonnes sections.",
          },
          {
            title: "Dashboard",
            description:
              "Affiche immédiatement equity, PnL, win rate, target, drawdown et état général.",
          },
        ],
      },
      {
        phase: "Execution",
        eyebrow: "Diary, Calendar, Equity",
        title: "Construis une mémoire opérationnelle",
        description:
          "Les pages core collectent la base de ton trading : trades, calendrier, croissance de l’equity et progression du compte.",
        cards: [
          {
            title: "Trading Diary",
            description:
              "Enregistre trades, setup, émotion, exécution, erreurs, notes et leçons.",
          },
          {
            title: "Calendar",
            description:
              "Lis la performance jour par jour et reconnais les journées positives, négatives ou flat.",
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
          "Analytics, Reports et Rules transforment les données en lecture opérationnelle : meilleurs symboles, sessions, erreurs, psychologie, objectifs et limites.",
        cards: [
          {
            title: "Analytics",
            description:
              "Analyse symbols, direction, sessions, emotions, execution quality et patterns.",
          },
          {
            title: "Reports",
            description:
              "Lis des résumés professionnels sur performance, risques, forces et faiblesses.",
          },
          {
            title: "Rules & Goals",
            description:
              "Définis targets, limits, règles opérationnelles et signaux de contrôle.",
          },
        ],
      },
      {
        phase: "Protection",
        eyebrow: "Sessions & Copilot",
        title: "Protège lucidité et discipline",
        description:
          "VOLTIS ne doit pas seulement montrer des résultats. Il doit t’aider à comprendre quand tu perds lucidité, discipline ou contrôle opérationnel.",
        spotlight:
          "La plus grande valeur arrive quand VOLTIS commence à reconnaître ce que tu risques de ne pas voir.",
        cards: [
          {
            title: "Sessions",
            description:
              "Prépare la session avant de trader et revois-la après avec focus, bias et review.",
          },
          {
            title: "Copilot",
            description:
              "Observe mémoire, patterns, signaux de risque et comportement opérationnel.",
          },
        ],
      },
      {
        phase: "Management",
        eyebrow: "Workspace, Members, Integrations",
        title: "Gère structure, équipe et système",
        description:
          "VOLTIS peut aussi être un environnement de travail privé : members, workspace, permissions, integrations, settings et backup.",
        cards: [
          {
            title: "Workspace & Members",
            description:
              "Gère members, presence, activity, performance individuelle et access.",
          },
          {
            title: "Integrations",
            description:
              "Prépare MT5, broker sync et mode manuel, automatique ou hybride.",
          },
          {
            title: "Settings",
            description:
              "Gère langue, devise, onboarding, backup et paramètres généraux.",
          },
        ],
      },
      {
        phase: "Principe final",
        eyebrow: "Use it seriously",
        title: "VOLTIS vaut autant que la manière dont tu l’utilises",
        description:
          "Le but n’est pas de remplir l’app avec des données aléatoires. Le but est de l’utiliser avec constance, précision et respect du processus.",
        spotlight:
          "Si tu as accès à VOLTIS, tu es dans quelque chose de sérieux.",
        cards: [
          {
            title: "Entre de vraies données",
            description:
              "Chaque trade bien enregistré rend les futurs reports, charts et analysis plus utiles.",
          },
          {
            title: "Revois avec lucidité",
            description:
              "N’utilise pas VOLTIS seulement quand tu gagnes. Utilise-le surtout quand tu dois corriger quelque chose.",
          },
          {
            title: "Protège le processus",
            description:
              "Profit et discipline ne doivent pas être séparés. VOLTIS existe pour les connecter.",
          },
        ],
      },
    ],
  },

  de: {
    privateAccess: "VOLTIS Private Access",
    stepCounter: (current, total) => `${current}/${total}`,
    back: "Zurück",
    continue: "Weiter",
    enterVoltis: "VOLTIS betreten",
    close: "Onboarding schließen",
    steps: [
      {
        phase: "Vision",
        eyebrow: "Private access",
        title: "VOLTIS ist keine normale Trading-App",
        description:
          "VOLTIS ist ein privates Trading Operating System für ausgewählte Trader, die ihr operatives Verhalten messen, schützen und verbessern wollen.",
        spotlight:
          "Es ist nicht für alle offen. Es ist nicht für den Massenmarkt gedacht. Es ist ein ernsthaftes Werkzeug für Trader, die Trading ernsthaft behandeln wollen.",
        cards: [
          {
            title: "Ausgewählter Zugang",
            description:
              "VOLTIS ist nicht für jeden gebaut. Der Zugang ist kontrolliert, privat und bewusst.",
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
          "VOLTIS zeigt nicht nur Zahlen. Es hilft dir zu verstehen, wie du tradest, welche Muster du wiederholst, wo Disziplin fällt und was du schützen musst.",
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
              "Schütze Kapital, Disziplin, Klarheit und die Einhaltung operativer Regeln.",
          },
          {
            title: "Improve",
            description:
              "Verbessere execution, review, Verhalten und Entscheidungsqualität mit der Zeit.",
          },
        ],
      },
      {
        phase: "Methode",
        eyebrow: "Operating flow",
        title: "Der richtige Ablauf ist nicht zufällig",
        description:
          "VOLTIS funktioniert am besten, wenn du es als Betriebssystem nutzt: planen, ausführen, journalen, überprüfen, schützen und verbessern.",
        spotlight:
          "Plan → Execute → Journal → Review → Detect Patterns → Protect Discipline → Improve Behavior",
        cards: [
          {
            title: "Vor der Session",
            description:
              "Definiere focus, risk, scenario, Regeln und operative Bedingungen.",
          },
          {
            title: "Während des Tradings",
            description:
              "Halte dich an den Plan, vermeide Impulsivität und kontrolliere das Risiko.",
          },
          {
            title: "Nach der Session",
            description:
              "Journale, überprüfe, erkenne Fehler, Lektionen und wiederkehrende Muster.",
          },
        ],
      },
      {
        phase: "Account",
        eyebrow: "Account Hub & Dashboard",
        title: "Starte im operativen Zentrum des Accounts",
        description:
          "Wenn du einen Account öffnest, starte im Account Hub. Von dort erreichst du Dashboard, Diary, Calendar, Equity, Analytics, Reports, Copilot und Management.",
        cards: [
          {
            title: "Account Hub",
            description:
              "Der erste Account-Bildschirm. Er orientiert dich und führt dich zu den richtigen Bereichen.",
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
              "Lies die Performance Tag für Tag und erkenne positive, negative oder flat Tage.",
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
              "Lies professionelle Zusammenfassungen zu performance, Risiken, Stärken und Schwächen.",
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
        title: "Schütze Klarheit und Disziplin",
        description:
          "VOLTIS soll nicht nur Ergebnisse zeigen. Es soll dir helfen zu erkennen, wann du Klarheit, Disziplin oder operative Kontrolle verlierst.",
        spotlight:
          "Der größte Wert entsteht, wenn VOLTIS erkennt, was du selbst zu übersehen riskierst.",
        cards: [
          {
            title: "Sessions",
            description:
              "Bereite die Session vor dem Trading vor und überprüfe sie danach mit focus, bias und review.",
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
              "Verwalte Sprache, Währung, onboarding, backup und allgemeine Einstellungen.",
          },
        ],
      },
      {
        phase: "Finales Prinzip",
        eyebrow: "Use it seriously",
        title: "VOLTIS ist so wertvoll, wie du es nutzt",
        description:
          "Es geht nicht darum, die App mit zufälligen Daten zu füllen. Es geht darum, sie konstant, präzise und mit Respekt für den Prozess zu nutzen.",
        spotlight:
          "Wenn du Zugang zu VOLTIS hast, bist du in etwas Ernsthaftem.",
        cards: [
          {
            title: "Gib echte Daten ein",
            description:
              "Jeder gut erfasste Trade macht zukünftige reports, charts und analysis nützlicher.",
          },
          {
            title: "Überprüfe mit Klarheit",
            description:
              "Nutze VOLTIS nicht nur, wenn du gewinnst. Nutze es besonders, wenn du etwas korrigieren musst.",
          },
          {
            title: "Schütze den Prozess",
            description:
              "Profit und discipline dürfen nicht getrennt sein. VOLTIS existiert, um sie zu verbinden.",
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



