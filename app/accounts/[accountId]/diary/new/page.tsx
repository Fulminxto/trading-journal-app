import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

import { createAccountTrade } from "../actions";

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
      <div className="mb-8">
        <Link
          href={`/accounts/${accountId}/diary`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-white"
        >
          ← {t.backToDiary}
        </Link>

        <p className="mt-4 text-sm text-gray-400">
          {t.eyebrow}
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          {t.title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          {t.description}
        </p>
      </div>

      <form
        action={createAccountTrade.bind(null, accountId)}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <div className="dt-wrap rounded-xl bg-zinc-900">
          <input
            name="openDate"
            type="date"
            aria-label={t.openDate}
            className="w-full bg-transparent p-3 pr-8 outline-none"
            required
          />
          <span className="dt-icon" aria-hidden="true"><CalendarIcon /></span>
        </div>

        <div className="dt-wrap rounded-xl bg-zinc-900">
          <input
            name="openTime"
            type="time"
            aria-label={t.openTime}
            className="w-full bg-transparent p-3 pr-8 outline-none"
          />
          <span className="dt-icon" aria-hidden="true"><ClockIcon /></span>
        </div>

        <input
          name="reason"
          placeholder={t.reason}
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        />

        <select
          name="strategyId"
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        >
          <option value="">{t.noStrategy}</option>
          {strategies.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          name="symbol"
          required
          className="rounded-xl bg-zinc-900 p-3 outline-none"
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

        <select
          name="direction"
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        >
          <option value="LONG">LONG</option>
          <option value="SHORT">SHORT</option>
        </select>

        <input
          name="amount"
          placeholder={t.amount}
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        />

        <input
          name="openingPrice"
          placeholder={t.openingPrice}
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        />

        <input
          name="stopLoss"
          placeholder={t.stopLoss}
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        />

        <input
          name="takeProfit"
          placeholder={t.takeProfit}
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        />

        <input
          name="riskReward"
          placeholder={t.riskReward}
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        />

        <div className="dt-wrap rounded-xl bg-zinc-900">
          <input
            name="closeDate"
            type="date"
            aria-label={t.closeDate}
            className="w-full bg-transparent p-3 pr-8 outline-none"
          />
          <span className="dt-icon" aria-hidden="true"><CalendarIcon /></span>
        </div>

        <input
          name="closingPrice"
          placeholder={t.closingPrice}
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        />

        <select
          name="outcome"
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        >
          <option value="">{t.outcome}</option>
          <option value="win">{t.win}</option>
          <option value="loss">{t.loss}</option>
          <option value="be">{t.be}</option>
        </select>

        <input
          name="resultUsd"
          placeholder={t.resultUsd}
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        />

        <select
          name="session"
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        >
          <option value="">{t.session}</option>
          <option value="ASIA">Asia</option>
          <option value="LONDON">London</option>
          <option value="NEW_YORK">New York</option>
          <option value="OVERLAP">Overlap</option>
        </select>

        <select
          name="emotionalState"
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        >
          <option value="">{t.emotionalState}</option>
          <option value="CALM">{t.calm}</option>
          <option value="FOCUSED">{t.focused}</option>
          <option value="CONFIDENT">{t.confident}</option>
          <option value="TIRED">{t.tired}</option>
          <option value="STRESSED">{t.stressed}</option>
          <option value="IMPULSIVE">{t.impulsive}</option>
        </select>

        <input
          name="setupQuality"
          type="number"
          min="1"
          max="10"
          placeholder={t.setupQuality}
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        />

        <input
          name="executionRating"
          type="number"
          min="1"
          max="10"
          placeholder={t.executionRating}
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        />

        <input
          name="confidence"
          type="number"
          min="1"
          max="10"
          placeholder={t.confidence}
          className="rounded-xl bg-zinc-900 p-3 outline-none"
        />

        <textarea
          name="mistakes"
          placeholder={t.mistakes}
          className="min-h-[90px] rounded-xl bg-zinc-900 p-3 outline-none sm:col-span-2"
        />

        <textarea
          name="lessonsLearned"
          placeholder={t.lessonsLearned}
          className="min-h-[90px] rounded-xl bg-zinc-900 p-3 outline-none sm:col-span-2"
        />

        <textarea
          name="notes"
          placeholder={t.notes}
          className="min-h-[90px] rounded-xl bg-zinc-900 p-3 outline-none sm:col-span-2 xl:col-span-4"
        />

        <button
          type="submit"
          className="rounded-xl bg-accent p-3 font-bold text-white transition hover:bg-accent-bright sm:col-span-2 xl:col-span-4"
        >
          {t.addTrade}
        </button>
      </form>
    </div>
  );
}
