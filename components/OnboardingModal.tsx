"use client";

import { useEffect, useState } from "react";
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

const ONBOARDING_STORAGE_KEY =
  "trading-journal-onboarding";

type OnboardingCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: string;
};

type OnboardingStep = {
  phase: string;
  eyebrow: string;
  title: string;
  description: string;
  spotlight?: string;
  icon: LucideIcon;
  accent: string;
  cards: OnboardingCard[];
};

const steps: OnboardingStep[] = [
  {
    phase: "Vision",
    eyebrow: "Private access",
    title: "VOLTIS non è una normale app di trading",
    description:
      "VOLTIS è un private trading operating system creato per trader selezionati che vogliono misurare, proteggere e migliorare il proprio comportamento operativo.",
    spotlight:
      "Non è aperto a tutti. Non è pensato per il mercato di massa. È uno strumento serio per chi vuole trattare il trading seriamente.",
    icon: Lock,
    accent: "text-cyan-300",
    cards: [
      {
        title: "Accesso selezionato",
        description:
          "VOLTIS non nasce per essere usato da chiunque. L’accesso è controllato, privato e intenzionale.",
        icon: ShieldCheck,
        tone: "text-cyan-300",
      },
      {
        title: "Non è solo gratuito",
        description:
          "Non lo usi perché costa poco. Lo usi perché sei dentro qualcosa che non è in vendita a tutti.",
        icon: Sparkles,
        tone: "text-green-400",
      },
    ],
  },
  {
    phase: "Philosophy",
    eyebrow: "Measure. Protect. Improve.",
    title: "La missione è renderti più lucido",
    description:
      "VOLTIS non serve solo a mostrarti numeri. Serve a farti capire come tradI, quali pattern ripeti, dove perdi disciplina e cosa devi proteggere.",
    spotlight:
      "Il vero obiettivo non è sapere solo quanto hai guadagnato o perso. È capire che tipo di trader stai diventando.",
    icon: Target,
    accent: "text-green-400",
    cards: [
      {
        title: "Measure",
        description:
          "Misura performance, equity, win rate, drawdown, sessioni e qualità operativa.",
        icon: BarChart3,
        tone: "text-cyan-300",
      },
      {
        title: "Protect",
        description:
          "Proteggi capitale, disciplina, lucidità e rispetto delle regole operative.",
        icon: ShieldCheck,
        tone: "text-yellow-300",
      },
      {
        title: "Improve",
        description:
          "Migliora esecuzione, review, comportamento e capacità decisionale nel tempo.",
        icon: CheckCircle2,
        tone: "text-green-400",
      },
    ],
  },
  {
    phase: "Operating flow",
    eyebrow: "Il metodo",
    title: "Il flusso corretto non è casuale",
    description:
      "VOLTIS funziona al meglio quando lo usi come un sistema operativo: prepari, esegui, registri, analizzi, proteggi e migliori.",
    spotlight:
      "Plan → Execute → Journal → Review → Detect Patterns → Protect Discipline → Improve Behavior",
    icon: Gauge,
    accent: "text-yellow-300",
    cards: [
      {
        title: "Prima della sessione",
        description:
          "Definisci focus, rischio, scenario, regole e condizioni operative.",
        icon: Gauge,
        tone: "text-yellow-300",
      },
      {
        title: "Durante l’operatività",
        description:
          "Rispetta il piano, evita impulsività e mantieni controllo sul rischio.",
        icon: ShieldCheck,
        tone: "text-green-400",
      },
      {
        title: "Dopo la sessione",
        description:
          "Registra, rivedi, individua errori, lezioni e pattern ricorrenti.",
        icon: BookOpen,
        tone: "text-cyan-300",
      },
    ],
  },
  {
    phase: "Navigation",
    eyebrow: "Account Hub",
    title: "La prima schermata dell’account",
    description:
      "Quando entri in un account, parti dall’Account Hub. È il centro di controllo da cui raggiungi tutte le aree importanti.",
    icon: Layers3,
    accent: "text-cyan-300",
    cards: [
      {
        title: "Account Hub",
        description:
          "Ti orienta nell’account e ti porta rapidamente verso Dashboard, Diary, Analytics, Reports e gestione.",
        icon: Layers3,
        tone: "text-cyan-300",
      },
      {
        title: "Dashboard",
        description:
          "Mostra subito lo stato dell’account: equity, PnL, win rate, target, drawdown e momentum.",
        icon: BarChart3,
        tone: "text-green-400",
      },
    ],
  },
  {
    phase: "Core pages",
    eyebrow: "Execution data",
    title: "Le pagine fondamentali",
    description:
      "Queste sezioni raccolgono la base del tuo trading: operazioni, calendario, crescita dell’equity e andamento del conto.",
    icon: BookOpen,
    accent: "text-green-400",
    cards: [
      {
        title: "Trading Diary",
        description:
          "Registra trade, sessione, setup, emozione, esecuzione, errori, note e lezioni.",
        icon: BookOpen,
        tone: "text-green-400",
      },
      {
        title: "Calendar",
        description:
          "Leggi la performance giorno per giorno e riconosci giornate positive, negative o flat.",
        icon: CalendarDays,
        tone: "text-blue-400",
      },
      {
        title: "Equity",
        description:
          "Controlla crescita del capitale, equity curve, drawdown, best trade e worst trade.",
        icon: LineChart,
        tone: "text-purple-300",
      },
    ],
  },
  {
    phase: "Intelligence",
    eyebrow: "Analytics & Reports",
    title: "Capisci cosa funziona davvero",
    description:
      "Analytics e Reports trasformano i dati in lettura operativa: simboli migliori, sessioni migliori, errori, psicologia, profit factor e aree da migliorare.",
    icon: BarChart3,
    accent: "text-purple-300",
    cards: [
      {
        title: "Analytics",
        description:
          "Analizza simboli, direzione, sessioni, emozioni, execution quality, confidence e pattern.",
        icon: BarChart3,
        tone: "text-purple-300",
      },
      {
        title: "Reports",
        description:
          "Leggi riepiloghi più chiari e professionali su performance, rischi, forza e debolezze.",
        icon: FileText,
        tone: "text-cyan-300",
      },
    ],
  },
  {
    phase: "Discipline",
    eyebrow: "Rules & Sessions",
    title: "La disciplina deve essere visibile",
    description:
      "VOLTIS ti aiuta a non trattare il trading come una sequenza casuale di operazioni. Regole, obiettivi e sessioni servono a proteggere il processo.",
    icon: ListChecks,
    accent: "text-yellow-300",
    cards: [
      {
        title: "Rules & Goals",
        description:
          "Imposta obiettivi mensili, limiti di drawdown, trade giornalieri e regole operative.",
        icon: ListChecks,
        tone: "text-yellow-300",
      },
      {
        title: "Sessions",
        description:
          "Prepara la sessione prima di tradare e rivedila dopo con focus, bias, qualità e review.",
        icon: Gauge,
        tone: "text-green-400",
      },
    ],
  },
  {
    phase: "Memory",
    eyebrow: "Copilot",
    title: "Il livello comportamentale",
    description:
      "Copilot non è pensato come una chat qualsiasi. È il livello che osserva memoria, pattern, segnali di rischio e comportamento operativo.",
    spotlight:
      "Il valore più grande arriva quando VOLTIS inizia a riconoscere ciò che tu rischi di non vedere.",
    icon: Bot,
    accent: "text-cyan-300",
    cards: [
      {
        title: "Copilot Memory",
        description:
          "Raccoglie pattern, rischi, sessioni ricorrenti, comportamenti e segnali di miglioramento.",
        icon: Bot,
        tone: "text-cyan-300",
      },
      {
        title: "Protection Layer",
        description:
          "Ti aiuta a capire quando stai perdendo lucidità, disciplina o controllo sul rischio.",
        icon: ShieldCheck,
        tone: "text-red-300",
      },
    ],
  },
  {
    phase: "Management",
    eyebrow: "Workspace & Settings",
    title: "Gestione, team e struttura",
    description:
      "VOLTIS può essere usato anche come ambiente di lavoro privato: membri, workspace, permessi, integrazioni e impostazioni generali.",
    icon: Users,
    accent: "text-green-400",
    cards: [
      {
        title: "Workspace & Members",
        description:
          "Gestisci membri, presenza, attività, performance individuali e accessi dell’account.",
        icon: Users,
        tone: "text-green-400",
      },
      {
        title: "Integrations",
        description:
          "Prepara MT5, broker sync, modalità manuale, automatica o ibrida.",
        icon: Zap,
        tone: "text-cyan-300",
      },
      {
        title: "Settings",
        description:
          "Gestisci preferenze, lingua, valuta, onboarding, backup e impostazioni generali.",
        icon: SettingsIcon,
        tone: "text-yellow-300",
      },
    ],
  },
  {
    phase: "Final principle",
    eyebrow: "Use it seriously",
    title: "VOLTIS vale quanto il modo in cui lo usi",
    description:
      "Non serve riempire l’app di dati casuali. Serve usarla con costanza, precisione e rispetto del processo.",
    spotlight:
      "Se hai accesso a VOLTIS, sei dentro qualcosa di serio.",
    icon: Sparkles,
    accent: "text-cyan-300",
    cards: [
      {
        title: "Inserisci dati veri",
        description:
          "Ogni trade registrato bene rende più utile ogni report, grafico e analisi futura.",
        icon: BookOpen,
        tone: "text-green-400",
      },
      {
        title: "Rivedi con lucidità",
        description:
          "Non usare VOLTIS solo quando vinci. Usalo soprattutto quando devi capire cosa correggere.",
        icon: BarChart3,
        tone: "text-purple-300",
      },
      {
        title: "Proteggi il processo",
        description:
          "Profitto e disciplina non devono essere separati. VOLTIS esiste per collegarli.",
        icon: ShieldCheck,
        tone: "text-cyan-300",
      },
    ],
  },
];

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(
      ONBOARDING_STORAGE_KEY
    );

    if (!hasSeenOnboarding) {
      setOpen(true);
    }
  }, []);

  function closeOnboarding() {
    localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      "true"
    );

    setOpen(false);
  }

  function goNext() {
    if (currentStep >= steps.length - 1) {
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

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const progress =
    ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[36px] border border-white/10 bg-[#071018] p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_35%)]" />

        <button
          onClick={closeOnboarding}
          className="absolute right-4 top-4 z-20 rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Close onboarding"
        >
          <X size={20} />
        </button>

        <div className="relative z-10">
          <div className="mb-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                VOLTIS Private Access
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                {step.phase}
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                {currentStep + 1}/{steps.length}
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
              Indietro
            </button>

            <button
              onClick={goNext}
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 text-sm font-black text-black transition hover:bg-green-400"
            >
              {currentStep === steps.length - 1
                ? "Entra in VOLTIS"
                : "Continua"}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}