import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import { createAccountTrade } from "../actions";

// CTA Fulmine: REBRAND_BLUEPRINT.md §6 names "Add trade" explicitly.
const CTA_GRADIENT =
  "linear-gradient(120deg, #2E62E6, #3f86e8 60%, #5BE0FF)";

const selectClass =
  "w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-white outline-none transition-colors duration-base focus:border-accent-bright/50";

const textareaClass =
  "w-full min-h-[90px] rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-white outline-none transition-colors duration-base focus:border-accent-bright/50";

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

function Field({
  label,
  htmlFor,
  className = "",
  children,
}: {
  label: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-faint"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function FormSection({
  number,
  title,
  first = false,
  children,
}: {
  number: string;
  title: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={first ? "" : "mt-8 border-t border-white/[0.06] pt-8"}>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-black text-accent-bright">
          {number}
        </span>
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

type NewTradeLabels = {
  eyebrow: string;
  title: string;
  description: string;
  backToDiary: string;
  openDate: string;
  openTime: string;
  reason: string;
  noStrategy: string;
  instrument: string;
  goldAndCommodities: string;
  crypto: string;
  indices: string;
  amount: string;
  openingPrice: string;
  stopLoss: string;
  takeProfit: string;
  riskReward: string;
  closeDate: string;
  closingPrice: string;
  outcome: string;
  resultUsd: string;
  session: string;
  emotionalState: string;
  setupQuality: string;
  executionRating: string;
  confidence: string;
  mistakes: string;
  lessonsLearned: string;
  notes: string;
  addTrade: string;
  win: string;
  loss: string;
  be: string;
  calm: string;
  focused: string;
  confident: string;
  tired: string;
  stressed: string;
  impulsive: string;

  sectionExecution: string;
  sectionRisk: string;
  sectionResult: string;
  sectionContext: string;
  sectionReview: string;
  direction: string;
  strategy: string;
};

const newTradeLabels: Record<AppLanguage, NewTradeLabels> = {
  it: {
    eyebrow: "Nuova operazione",
    title: "Inserisci trade",
    description: "Registra un nuovo trade con i dettagli operativi, la strategia e l'analisi personale.",
    backToDiary: "Torna al Diary",
    openDate: "Data apertura",
    openTime: "Ora apertura",
    reason: "Motivo",
    noStrategy: "— Nessuna strategia —",
    instrument: "Strumento",
    goldAndCommodities: "Oro e materie prime",
    crypto: "Crypto",
    indices: "Indici",
    amount: "Amount / Lot",
    openingPrice: "Prezzo apertura",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Data chiusura",
    closingPrice: "Prezzo chiusura",
    outcome: "Outcome",
    resultUsd: "Risultato $",
    session: "Sessione",
    emotionalState: "Stato emotivo",
    setupQuality: "Qualità setup (1-10)",
    executionRating: "Valutazione esecuzione (1-10)",
    confidence: "Confidence (1-10)",
    mistakes: "Errori commessi",
    lessonsLearned: "Lezioni apprese",
    notes: "Note",
    addTrade: "Aggiungi trade",
    win: "Win",
    loss: "Loss",
    be: "BE",
    calm: "Calmo",
    focused: "Focused",
    confident: "Confident",
    tired: "Stanco",
    stressed: "Stressato",
    impulsive: "Impulsivo",

    sectionExecution: "Esecuzione",
    sectionRisk: "Livelli & Rischio",
    sectionResult: "Chiusura & Risultato",
    sectionContext: "Contesto",
    sectionReview: "Review personale",
    direction: "Direzione",
    strategy: "Strategia",
  },

  en: {
    eyebrow: "New operation",
    title: "Add Trade",
    description: "Record a new trade with all operational details, strategy, and self-analysis.",
    backToDiary: "Back to Diary",
    openDate: "Open date",
    openTime: "Open time",
    reason: "Reason",
    noStrategy: "— No strategy —",
    instrument: "Instrument",
    goldAndCommodities: "Gold & Commodities",
    crypto: "Crypto",
    indices: "Indices",
    amount: "Amount / Lot",
    openingPrice: "Opening price",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Close date",
    closingPrice: "Closing price",
    outcome: "Outcome",
    resultUsd: "Result $",
    session: "Session",
    emotionalState: "Emotional state",
    setupQuality: "Setup Quality (1-10)",
    executionRating: "Execution Rating (1-10)",
    confidence: "Confidence (1-10)",
    mistakes: "Mistakes",
    lessonsLearned: "Lessons learned",
    notes: "Notes",
    addTrade: "Add trade",
    win: "Win",
    loss: "Loss",
    be: "BE",
    calm: "Calm",
    focused: "Focused",
    confident: "Confident",
    tired: "Tired",
    stressed: "Stressed",
    impulsive: "Impulsive",

    sectionExecution: "Execution",
    sectionRisk: "Levels & Risk",
    sectionResult: "Close & Result",
    sectionContext: "Context",
    sectionReview: "Self-Review",
    direction: "Direction",
    strategy: "Strategy",
  },

  uk: {
    eyebrow: "Нова операція",
    title: "Додати trade",
    description: "Зареєструй новий trade з усіма операційними деталями, стратегією та особистим аналізом.",
    backToDiary: "Повернутися до Diary",
    openDate: "Дата відкриття",
    openTime: "Час відкриття",
    reason: "Причина",
    noStrategy: "— Без стратегії —",
    instrument: "Інструмент",
    goldAndCommodities: "Золото та сировина",
    crypto: "Crypto",
    indices: "Індекси",
    amount: "Amount / Lot",
    openingPrice: "Ціна відкриття",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Дата закриття",
    closingPrice: "Ціна закриття",
    outcome: "Результат",
    resultUsd: "Результат $",
    session: "Сесія",
    emotionalState: "Емоційний стан",
    setupQuality: "Якість сетапу (1-10)",
    executionRating: "Оцінка виконання (1-10)",
    confidence: "Впевненість (1-10)",
    mistakes: "Помилки",
    lessonsLearned: "Висновки",
    notes: "Нотатки",
    addTrade: "Додати trade",
    win: "Win",
    loss: "Loss",
    be: "BE",
    calm: "Спокійний",
    focused: "Сфокусований",
    confident: "Впевнений",
    tired: "Втомлений",
    stressed: "Напружений",
    impulsive: "Імпульсивний",

    sectionExecution: "Виконання",
    sectionRisk: "Рівні та ризик",
    sectionResult: "Закриття та результат",
    sectionContext: "Контекст",
    sectionReview: "Особистий review",
    direction: "Напрямок",
    strategy: "Стратегія",
  },

  ru: {
    eyebrow: "Новая операция",
    title: "Добавить trade",
    description: "Зафиксируй новую сделку со всеми операционными данными, стратегией и личным анализом.",
    backToDiary: "Вернуться к Diary",
    openDate: "Дата открытия",
    openTime: "Время открытия",
    reason: "Причина",
    noStrategy: "— Без стратегии —",
    instrument: "Инструмент",
    goldAndCommodities: "Золото и сырьевые товары",
    crypto: "Crypto",
    indices: "Индексы",
    amount: "Amount / Lot",
    openingPrice: "Цена открытия",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Дата закрытия",
    closingPrice: "Цена закрытия",
    outcome: "Результат",
    resultUsd: "Результат $",
    session: "Сессия",
    emotionalState: "Эмоциональное состояние",
    setupQuality: "Качество сетапа (1-10)",
    executionRating: "Оценка исполнения (1-10)",
    confidence: "Уверенность (1-10)",
    mistakes: "Ошибки",
    lessonsLearned: "Выводы",
    notes: "Заметки",
    addTrade: "Добавить trade",
    win: "Win",
    loss: "Loss",
    be: "BE",
    calm: "Спокойный",
    focused: "Сфокусированный",
    confident: "Уверенный",
    tired: "Уставший",
    stressed: "В стрессе",
    impulsive: "Импульсивный",

    sectionExecution: "Исполнение",
    sectionRisk: "Уровни и риск",
    sectionResult: "Закрытие и результат",
    sectionContext: "Контекст",
    sectionReview: "Личный review",
    direction: "Направление",
    strategy: "Стратегия",
  },

  es: {
    eyebrow: "Nueva operación",
    title: "Añadir trade",
    description: "Registra un nuevo trade con todos los detalles operativos, estrategia y autoanálisis.",
    backToDiary: "Volver al Diary",
    openDate: "Fecha de apertura",
    openTime: "Hora de apertura",
    reason: "Motivo",
    noStrategy: "— Sin estrategia —",
    instrument: "Instrumento",
    goldAndCommodities: "Oro y materias primas",
    crypto: "Crypto",
    indices: "Índices",
    amount: "Amount / Lot",
    openingPrice: "Precio de apertura",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Fecha de cierre",
    closingPrice: "Precio de cierre",
    outcome: "Resultado",
    resultUsd: "Resultado $",
    session: "Sesión",
    emotionalState: "Estado emocional",
    setupQuality: "Calidad del setup (1-10)",
    executionRating: "Ejecución (1-10)",
    confidence: "Confianza (1-10)",
    mistakes: "Errores",
    lessonsLearned: "Lecciones aprendidas",
    notes: "Notas",
    addTrade: "Añadir trade",
    win: "Win",
    loss: "Loss",
    be: "BE",
    calm: "Calmo",
    focused: "Enfocado",
    confident: "Confiado",
    tired: "Cansado",
    stressed: "Estresado",
    impulsive: "Impulsivo",

    sectionExecution: "Ejecución",
    sectionRisk: "Niveles y riesgo",
    sectionResult: "Cierre y resultado",
    sectionContext: "Contexto",
    sectionReview: "Auto-review",
    direction: "Dirección",
    strategy: "Estrategia",
  },

  fr: {
    eyebrow: "Nouvelle opération",
    title: "Ajouter un trade",
    description: "Enregistre un nouveau trade avec tous les détails opérationnels, la stratégie et l'auto-analyse.",
    backToDiary: "Retour au Diary",
    openDate: "Date d'ouverture",
    openTime: "Heure d'ouverture",
    reason: "Raison",
    noStrategy: "— Aucune stratégie —",
    instrument: "Instrument",
    goldAndCommodities: "Or et matières premières",
    crypto: "Crypto",
    indices: "Indices",
    amount: "Amount / Lot",
    openingPrice: "Prix d'ouverture",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Date de clôture",
    closingPrice: "Prix de clôture",
    outcome: "Résultat",
    resultUsd: "Résultat $",
    session: "Session",
    emotionalState: "État émotionnel",
    setupQuality: "Qualité du setup (1-10)",
    executionRating: "Exécution (1-10)",
    confidence: "Confiance (1-10)",
    mistakes: "Erreurs",
    lessonsLearned: "Leçons apprises",
    notes: "Notes",
    addTrade: "Ajouter un trade",
    win: "Win",
    loss: "Loss",
    be: "BE",
    calm: "Calme",
    focused: "Concentré",
    confident: "Confiant",
    tired: "Fatigué",
    stressed: "Stressé",
    impulsive: "Impulsif",

    sectionExecution: "Exécution",
    sectionRisk: "Niveaux & risque",
    sectionResult: "Clôture & résultat",
    sectionContext: "Contexte",
    sectionReview: "Auto-review",
    direction: "Direction",
    strategy: "Stratégie",
  },

  de: {
    eyebrow: "Neue Operation",
    title: "Trade hinzufügen",
    description: "Erfasse einen neuen Trade mit allen operativen Details, Strategie und Selbstanalyse.",
    backToDiary: "Zurück zum Diary",
    openDate: "Eröffnungsdatum",
    openTime: "Eröffnungszeit",
    reason: "Grund",
    noStrategy: "— Keine Strategie —",
    instrument: "Instrument",
    goldAndCommodities: "Gold & Rohstoffe",
    crypto: "Crypto",
    indices: "Indizes",
    amount: "Amount / Lot",
    openingPrice: "Eröffnungspreis",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closeDate: "Schlussdatum",
    closingPrice: "Schlusspreis",
    outcome: "Ergebnis",
    resultUsd: "Ergebnis $",
    session: "Session",
    emotionalState: "Emotionaler Zustand",
    setupQuality: "Setup-Qualität (1-10)",
    executionRating: "Execution Rating (1-10)",
    confidence: "Confidence (1-10)",
    mistakes: "Fehler",
    lessonsLearned: "Gelernte Lektionen",
    notes: "Notizen",
    addTrade: "Trade hinzufügen",
    win: "Win",
    loss: "Loss",
    be: "BE",
    calm: "Ruhig",
    focused: "Fokussiert",
    confident: "Selbstbewusst",
    tired: "Müde",
    stressed: "Gestresst",
    impulsive: "Impulsiv",

    sectionExecution: "Execution",
    sectionRisk: "Level & Risiko",
    sectionResult: "Abschluss & Ergebnis",
    sectionContext: "Kontext",
    sectionReview: "Selbstreview",
    direction: "Richtung",
    strategy: "Strategie",
  },
};

export default async function NewTradePage({
  params,
}: {
  params: Promise<{
    accountId: string;
  }>;
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

  const isManager = membership.role === "MANAGER";
  const canCreateTrades = isManager || membership.canCreateTrades;

  if (!canCreateTrades) {
    redirect(`/accounts/${accountId}/diary`);
  }

  if (membership.tradingAccount.status === "ARCHIVED") {
    redirect(`/accounts/${accountId}/diary`);
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { appLanguage: true },
  });

  const language = normalizeAppLanguage(currentUser?.appLanguage);
  const t = newTradeLabels[language];

  const strategies = await prisma.strategy.findMany({
    where: { tradingAccountId: accountId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <div className="reveal-rise mb-8" style={{ animationDelay: "0ms" }}>
        <Link
          href={`/accounts/${accountId}/diary`}
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-base hover:text-white"
        >
          ← {t.backToDiary}
        </Link>

        <p className="mt-4 text-sm text-muted">
          {t.eyebrow}
        </p>

        <h1 className="text-hero">
          {t.title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          {t.description}
        </p>
      </div>

      <div className="reveal-rise" style={{ animationDelay: "60ms" }}>
        <Card variant="hero" className="p-5 sm:p-8">
          <form
            action={createAccountTrade.bind(null, accountId)}
          >
            <FormSection number="01" title={t.sectionExecution} first>
              <Field label={t.openDate} htmlFor="openDate">
                <div className="dt-wrap">
                  <Input
                    id="openDate"
                    name="openDate"
                    type="date"
                    className="pr-8"
                    required
                  />
                  <span className="dt-icon" aria-hidden="true"><CalendarIcon /></span>
                </div>
              </Field>

              <Field label={t.openTime} htmlFor="openTime">
                <div className="dt-wrap">
                  <Input
                    id="openTime"
                    name="openTime"
                    type="time"
                    className="pr-8"
                  />
                  <span className="dt-icon" aria-hidden="true"><ClockIcon /></span>
                </div>
              </Field>

              <Field label={t.instrument} htmlFor="symbol">
                <select
                  id="symbol"
                  name="symbol"
                  required
                  defaultValue=""
                  className={selectClass}
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
                  <optgroup label={t.goldAndCommodities}>
                    <option value="XAUUSD">XAUUSD</option>
                    <option value="XAGUSD">XAGUSD</option>
                    <option value="USOIL">USOIL</option>
                    <option value="UKOIL">UKOIL</option>
                  </optgroup>
                  <optgroup label={t.crypto}>
                    <option value="BTCUSD">BTCUSD</option>
                    <option value="ETHUSD">ETHUSD</option>
                    <option value="SOLUSD">SOLUSD</option>
                    <option value="XRPUSD">XRPUSD</option>
                  </optgroup>
                  <optgroup label={t.indices}>
                    <option value="NASDAQ">NASDAQ</option>
                    <option value="S&P500">S&P500</option>
                    <option value="DAX40">DAX40</option>
                    <option value="DJI">DJI</option>
                  </optgroup>
                </select>
              </Field>

              <Field label={t.amount} htmlFor="amount">
                <Input id="amount" name="amount" placeholder={t.amount} />
              </Field>

              <Field label={t.direction} htmlFor="direction">
                <select
                  id="direction"
                  name="direction"
                  defaultValue="LONG"
                  className={selectClass}
                >
                  <option value="LONG">LONG</option>
                  <option value="SHORT">SHORT</option>
                </select>
              </Field>
            </FormSection>

            <FormSection number="02" title={t.sectionRisk}>
              <Field label={t.openingPrice} htmlFor="openingPrice">
                <Input id="openingPrice" name="openingPrice" placeholder={t.openingPrice} />
              </Field>

              <Field label={t.stopLoss} htmlFor="stopLoss">
                <Input id="stopLoss" name="stopLoss" placeholder={t.stopLoss} />
              </Field>

              <Field label={t.takeProfit} htmlFor="takeProfit">
                <Input id="takeProfit" name="takeProfit" placeholder={t.takeProfit} />
              </Field>

              <Field label={t.riskReward} htmlFor="riskReward">
                <Input id="riskReward" name="riskReward" placeholder={t.riskReward} />
              </Field>
            </FormSection>

            <FormSection number="03" title={t.sectionResult}>
              <Field label={t.closeDate} htmlFor="closeDate">
                <div className="dt-wrap">
                  <Input
                    id="closeDate"
                    name="closeDate"
                    type="date"
                    className="pr-8"
                  />
                  <span className="dt-icon" aria-hidden="true"><CalendarIcon /></span>
                </div>
              </Field>

              <Field label={t.closingPrice} htmlFor="closingPrice">
                <Input id="closingPrice" name="closingPrice" placeholder={t.closingPrice} />
              </Field>

              <Field label={t.outcome} htmlFor="outcome">
                <select
                  id="outcome"
                  name="outcome"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">{t.outcome}</option>
                  <option value="win">{t.win}</option>
                  <option value="loss">{t.loss}</option>
                  <option value="be">{t.be}</option>
                </select>
              </Field>

              <Field label={t.resultUsd} htmlFor="resultUsd">
                <Input id="resultUsd" name="resultUsd" placeholder={t.resultUsd} />
              </Field>
            </FormSection>

            <FormSection number="04" title={t.sectionContext}>
              <Field label={t.reason} htmlFor="reason">
                <Input id="reason" name="reason" placeholder={t.reason} />
              </Field>

              <Field label={t.strategy} htmlFor="strategyId">
                <select
                  id="strategyId"
                  name="strategyId"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">{t.noStrategy}</option>
                  {strategies.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t.session} htmlFor="session">
                <select
                  id="session"
                  name="session"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">{t.session}</option>
                  <option value="ASIA">Asia</option>
                  <option value="LONDON">London</option>
                  <option value="NEW_YORK">New York</option>
                  <option value="OVERLAP">Overlap</option>
                </select>
              </Field>

              <Field label={t.emotionalState} htmlFor="emotionalState">
                <select
                  id="emotionalState"
                  name="emotionalState"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">{t.emotionalState}</option>
                  <option value="CALM">{t.calm}</option>
                  <option value="FOCUSED">{t.focused}</option>
                  <option value="CONFIDENT">{t.confident}</option>
                  <option value="TIRED">{t.tired}</option>
                  <option value="STRESSED">{t.stressed}</option>
                  <option value="IMPULSIVE">{t.impulsive}</option>
                </select>
              </Field>
            </FormSection>

            <FormSection number="05" title={t.sectionReview}>
              <Field label={t.setupQuality} htmlFor="setupQuality">
                <Input id="setupQuality" name="setupQuality" type="number" min="1" max="10" placeholder="1-10" />
              </Field>

              <Field label={t.executionRating} htmlFor="executionRating">
                <Input id="executionRating" name="executionRating" type="number" min="1" max="10" placeholder="1-10" />
              </Field>

              <Field label={t.confidence} htmlFor="confidence">
                <Input id="confidence" name="confidence" type="number" min="1" max="10" placeholder="1-10" />
              </Field>

              <div className="hidden xl:block" aria-hidden="true" />

              <Field label={t.mistakes} htmlFor="mistakes" className="sm:col-span-2 xl:col-span-2">
                <textarea
                  id="mistakes"
                  name="mistakes"
                  placeholder={t.mistakes}
                  className={textareaClass}
                />
              </Field>

              <Field label={t.lessonsLearned} htmlFor="lessonsLearned" className="sm:col-span-2 xl:col-span-2">
                <textarea
                  id="lessonsLearned"
                  name="lessonsLearned"
                  placeholder={t.lessonsLearned}
                  className={textareaClass}
                />
              </Field>

              <Field label={t.notes} htmlFor="notes" className="sm:col-span-2 xl:col-span-4">
                <textarea
                  id="notes"
                  name="notes"
                  placeholder={t.notes}
                  className={textareaClass}
                />
              </Field>
            </FormSection>

            <button
              type="submit"
              style={{ background: CTA_GRADIENT }}
              className="mt-8 w-full rounded-inner p-3 font-semibold text-white transition-shadow duration-base hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]"
            >
              {t.addTrade}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
