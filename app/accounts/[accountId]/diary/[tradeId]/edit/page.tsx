import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

import { updateAccountTrade } from "../../actions";

function formatDateForInput(date: Date | null) {
  if (!date) return "";

  return date.toISOString().split("T")[0];
}

type EditTradeLabels = {
  eyebrow: string;
  title: string;
  description: string;
  importedEyebrow: string;
  importedTitle: string;
  importedDescription: string;
  needsReview: string;
  reviewed: string;
  reviewStatus: string;
  markReviewed: string;
  reviewCheckboxDescription: string;
  manual: string;
  reason: string;
  strategy: string;
  instrument: string;
  goldAndCommodities: string;
  crypto: string;
  indices: string;
  amount: string;
  openingPrice: string;
  stopLoss: string;
  takeProfit: string;
  riskReward: string;
  closingPrice: string;
  outcome: string;
  resultUsd: string;
  notes: string;
  saveChanges: string;
  noStrategyOption: string;
};

const editTradeLabels: Record<
  AppLanguage,
  EditTradeLabels
> = {
  it: {
    eyebrow: "Modifica trade",
    title: "Modifica Trade",
    description:
      "Completa i dati operativi, la strategia, le note e la review del trade.",
    importedEyebrow: "Trade importato",
    importedTitle: "Review richiesta",
    importedDescription:
      "Questo trade è stato importato automaticamente. I dati tecnici sono già presenti, ma devi completare la parte personale: motivo, strategia, stato emotivo, errori e lezioni apprese.",
    needsReview: "Da revisionare",
    reviewed: "Revisionato",
    reviewStatus: "Stato review",
    markReviewed: "Segna il trade importato come revisionato",
    reviewCheckboxDescription:
      "Spunta questa casella solo dopo aver completato motivo, strategia, emozioni, errori e lezioni apprese.",
    manual: "Manuale",
    reason: "Motivo",
    strategy: "Strategia",
    instrument: "Strumento",
    goldAndCommodities: "Oro e materie prime",
    crypto: "Crypto",
    indices: "Indici",
    amount: "Amount",
    openingPrice: "Opening Price",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closingPrice: "Closing Price",
    outcome: "Outcome",
    resultUsd: "Result $",
    notes: "Note",
    saveChanges: "Salva modifiche",
    noStrategyOption: "— Nessuna strategia dal Playbook —",
  },

  en: {
    eyebrow: "Edit trade",
    title: "Edit Trade",
    description:
      "Complete the operational data, strategy, notes and trade review.",
    importedEyebrow: "Imported Trade",
    importedTitle: "Review required",
    importedDescription:
      "This trade was imported automatically. The technical data is already present, but you must complete the personal part: reason, strategy, emotional state, mistakes and lessons learned.",
    needsReview: "Needs Review",
    reviewed: "Reviewed",
    reviewStatus: "Review Status",
    markReviewed: "Mark imported trade as reviewed",
    reviewCheckboxDescription:
      "Check this box only after completing reason, strategy, emotions, mistakes and lessons learned.",
    manual: "Manual",
    reason: "Reason",
    strategy: "Strategy",
    instrument: "Instrument",
    goldAndCommodities: "Gold & Commodities",
    crypto: "Crypto",
    indices: "Indices",
    amount: "Amount",
    openingPrice: "Opening Price",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closingPrice: "Closing Price",
    outcome: "Outcome",
    resultUsd: "Result $",
    notes: "Notes",
    saveChanges: "Save changes",
    noStrategyOption: "— No Playbook strategy —",
  },

  uk: {
    eyebrow: "Редагувати trade",
    title: "Редагувати Trade",
    description:
      "Заповни операційні дані, стратегію, нотатки та review trade.",
    importedEyebrow: "Імпортований trade",
    importedTitle: "Потрібна review",
    importedDescription:
      "Цей trade було імпортовано автоматично. Технічні дані вже є, але потрібно заповнити особисту частину: причину, стратегію, емоційний стан, помилки та висновки.",
    needsReview: "Потребує review",
    reviewed: "Переглянуто",
    reviewStatus: "Статус review",
    markReviewed: "Позначити імпортований trade як переглянутий",
    reviewCheckboxDescription:
      "Позначай цю галочку лише після заповнення причини, стратегії, емоцій, помилок та висновків.",
    manual: "Manual",
    reason: "Причина",
    strategy: "Стратегія",
    instrument: "Інструмент",
    goldAndCommodities: "Золото та сировина",
    crypto: "Crypto",
    indices: "Індекси",
    amount: "Amount",
    openingPrice: "Opening Price",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closingPrice: "Closing Price",
    outcome: "Outcome",
    resultUsd: "Result $",
    notes: "Нотатки",
    saveChanges: "Зберегти зміни",
    noStrategyOption: "— Без стратегії Playbook —",
  },

  ru: {
    eyebrow: "Редактировать trade",
    title: "Редактировать Trade",
    description:
      "Заполни операционные данные, стратегию, заметки и review trade.",
    importedEyebrow: "Импортированный trade",
    importedTitle: "Требуется review",
    importedDescription:
      "Этот trade был импортирован автоматически. Технические данные уже есть, но нужно заполнить личную часть: причину, стратегию, эмоциональное состояние, ошибки и выводы.",
    needsReview: "Нужна review",
    reviewed: "Проверено",
    reviewStatus: "Статус review",
    markReviewed: "Отметить импортированный trade как проверенный",
    reviewCheckboxDescription:
      "Отмечай эту галочку только после заполнения причины, стратегии, эмоций, ошибок и выводов.",
    manual: "Manual",
    reason: "Причина",
    strategy: "Стратегия",
    instrument: "Инструмент",
    goldAndCommodities: "Золото и сырьевые товары",
    crypto: "Crypto",
    indices: "Индексы",
    amount: "Amount",
    openingPrice: "Opening Price",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closingPrice: "Closing Price",
    outcome: "Outcome",
    resultUsd: "Result $",
    notes: "Заметки",
    saveChanges: "Сохранить изменения",
    noStrategyOption: "— Без стратегии Playbook —",
  },

  es: {
    eyebrow: "Editar trade",
    title: "Editar Trade",
    description:
      "Completa los datos operativos, la estrategia, las notas y la review del trade.",
    importedEyebrow: "Trade importado",
    importedTitle: "Review requerida",
    importedDescription:
      "Este trade fue importado automáticamente. Los datos técnicos ya están presentes, pero debes completar la parte personal: motivo, estrategia, estado emocional, errores y lecciones aprendidas.",
    needsReview: "Necesita review",
    reviewed: "Revisado",
    reviewStatus: "Estado review",
    markReviewed: "Marcar trade importado como revisado",
    reviewCheckboxDescription:
      "Marca esta casilla solo después de completar motivo, estrategia, emociones, errores y lecciones aprendidas.",
    manual: "Manual",
    reason: "Motivo",
    strategy: "Estrategia",
    instrument: "Instrumento",
    goldAndCommodities: "Oro y materias primas",
    crypto: "Crypto",
    indices: "Índices",
    amount: "Amount",
    openingPrice: "Opening Price",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closingPrice: "Closing Price",
    outcome: "Outcome",
    resultUsd: "Result $",
    notes: "Notas",
    saveChanges: "Guardar cambios",
    noStrategyOption: "— Sin estrategia del Playbook —",
  },

  fr: {
    eyebrow: "Modifier trade",
    title: "Modifier Trade",
    description:
      "Complète les données opérationnelles, la stratégie, les notes et la review du trade.",
    importedEyebrow: "Trade importé",
    importedTitle: "Review requise",
    importedDescription:
      "Ce trade a été importé automatiquement. Les données techniques sont déjà présentes, mais tu dois compléter la partie personnelle : raison, stratégie, état émotionnel, erreurs et leçons apprises.",
    needsReview: "Review requise",
    reviewed: "Revu",
    reviewStatus: "Statut review",
    markReviewed: "Marquer le trade importé comme revu",
    reviewCheckboxDescription:
      "Coche cette case seulement après avoir complété la raison, la stratégie, les émotions, les erreurs et les leçons apprises.",
    manual: "Manuel",
    reason: "Raison",
    strategy: "Stratégie",
    instrument: "Instrument",
    goldAndCommodities: "Or et matières premières",
    crypto: "Crypto",
    indices: "Indices",
    amount: "Amount",
    openingPrice: "Opening Price",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closingPrice: "Closing Price",
    outcome: "Outcome",
    resultUsd: "Result $",
    notes: "Notes",
    saveChanges: "Enregistrer les modifications",
    noStrategyOption: "— Aucune stratégie Playbook —",
  },

  de: {
    eyebrow: "Trade bearbeiten",
    title: "Trade bearbeiten",
    description:
      "Vervollständige operative Daten, Strategie, Notizen und Trade-Review.",
    importedEyebrow: "Importierter Trade",
    importedTitle: "Review erforderlich",
    importedDescription:
      "Dieser Trade wurde automatisch importiert. Die technischen Daten sind bereits vorhanden, aber du musst den persönlichen Teil ergänzen: Grund, Strategie, emotionaler Zustand, Fehler und Lessons Learned.",
    needsReview: "Review erforderlich",
    reviewed: "Überprüft",
    reviewStatus: "Review-Status",
    markReviewed: "Importierten Trade als überprüft markieren",
    reviewCheckboxDescription:
      "Aktiviere diese Checkbox erst, nachdem Grund, Strategie, Emotionen, Fehler und Lessons Learned ergänzt wurden.",
    manual: "Manuell",
    reason: "Grund",
    strategy: "Strategie",
    instrument: "Instrument",
    goldAndCommodities: "Gold & Rohstoffe",
    crypto: "Crypto",
    indices: "Indizes",
    amount: "Amount",
    openingPrice: "Opening Price",
    stopLoss: "Stop Loss",
    takeProfit: "Take Profit",
    riskReward: "Risk Reward",
    closingPrice: "Closing Price",
    outcome: "Outcome",
    resultUsd: "Result $",
    notes: "Notizen",
    saveChanges: "Änderungen speichern",
    noStrategyOption: "— Keine Playbook-Strategie —",
  },
};

function getTradeSourceLabel(
  source: string | null | undefined,
  t: EditTradeLabels
) {
  if (source === "mt5") {
    return "MT5";
  }

  if (source === "broker") {
    return "Broker";
  }

  return t.manual;
}

function getTradeSourceClass(source?: string | null) {
  if (source === "mt5") {
    return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
  }

  if (source === "broker") {
    return "border-blue-500/20 bg-blue-500/10 text-blue-300";
  }

  return "border-white/10 bg-white/10 text-gray-300";
}

export default async function EditTradePage({
  params,
}: {
  params: Promise<{
    accountId: string;
    tradeId: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId, tradeId } = await params;

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
    membership.role === "MANAGER";

  const canEditTrades =
    isManager || membership.canEditTrades;

  if (!canEditTrades) {
    redirect(`/accounts/${accountId}/diary`);
  }

  if (
    membership.tradingAccount.status === "ARCHIVED"
  ) {
    redirect(`/accounts/${accountId}/diary`);
  }

  const trade = await prisma.trade.findFirst({
    where: {
      id: Number(tradeId),
      tradingAccountId: accountId,
    },
  });

  if (!trade) {
    redirect(`/accounts/${accountId}/diary`);
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      appLanguage: true,
    },
  });

  const language = normalizeAppLanguage(
    currentUser?.appLanguage
  );

  const t = editTradeLabels[language];

  const strategies = await prisma.strategy.findMany({
    where: { tradingAccountId: accountId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const isImportedTrade =
    trade.source !== "manual";

  async function updateTradeAction(
    formData: FormData
  ) {
    "use server";

    await updateAccountTrade(
      accountId,
      Number(tradeId),
      formData
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">
          {t.eyebrow}
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          {t.title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          {t.description}
        </p>
      </div>

      {isImportedTrade && (
        <div className="mb-6 rounded-3xl border border-yellow-500/20 bg-yellow-500/[0.06] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-yellow-300">
                {t.importedEyebrow}
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                {t.importedTitle}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
                {t.importedDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-xl border px-3 py-1 text-xs font-bold ${getTradeSourceClass(
                  trade.source
                )}`}
              >
                {getTradeSourceLabel(trade.source, t)}
              </span>

              {trade.needsReview && (
                <span className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-yellow-300">
                  {t.needsReview}
                </span>
              )}

              {trade.syncStatus === "reviewed" && (
                <span className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-green-400">
                  {t.reviewed}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <form
        action={updateTradeAction}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {isImportedTrade && (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 sm:col-span-2 xl:col-span-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  {t.reviewStatus}
                </p>

                <h3 className="mt-2 text-lg font-bold text-white">
                  {t.markReviewed}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {t.reviewCheckboxDescription}
                </p>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-400">
                <input
                  type="checkbox"
                  name="markAsReviewed"
                  defaultChecked={
                    !trade.needsReview &&
                    trade.syncStatus === "reviewed"
                  }
                  className="h-5 w-5"
                />
                {t.reviewed}
              </label>
            </div>
          </div>
        )}

        <input
          name="openDate"
          defaultValue={formatDateForInput(
            trade.openDate
          )}
          type="date"
          className="rounded-xl bg-zinc-900 p-3"
          required
        />

        <input
          name="openTime"
          defaultValue={trade.openTime || ""}
          type="time"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="reason"
          defaultValue={trade.reason || ""}
          placeholder={t.reason}
          className="rounded-xl bg-zinc-900 p-3"
        />

        <select
          name="strategyId"
          defaultValue={trade.strategyId ?? ""}
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="">{t.noStrategyOption}</option>
          {strategies.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          name="symbol"
          defaultValue={trade.symbol}
          required
          className="rounded-xl bg-zinc-900 p-3"
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
          defaultValue={trade.direction}
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="LONG">LONG</option>
          <option value="SHORT">SHORT</option>
        </select>

        <input
          name="amount"
          defaultValue={trade.amount ?? ""}
          placeholder={t.amount}
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="openingPrice"
          defaultValue={trade.openingPrice ?? ""}
          placeholder={t.openingPrice}
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="stopLoss"
          defaultValue={trade.stopLoss ?? ""}
          placeholder={t.stopLoss}
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="takeProfit"
          defaultValue={trade.takeProfit ?? ""}
          placeholder={t.takeProfit}
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="riskReward"
          defaultValue={trade.riskReward ?? ""}
          placeholder={t.riskReward}
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="closeDate"
          defaultValue={formatDateForInput(
            trade.closeDate
          )}
          type="date"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="closingPrice"
          defaultValue={trade.closingPrice ?? ""}
          placeholder={t.closingPrice}
          className="rounded-xl bg-zinc-900 p-3"
        />

        <select
          name="outcome"
          defaultValue={trade.outcome || ""}
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="">{t.outcome}</option>
          <option value="win">Win</option>
          <option value="loss">Loss</option>
          <option value="be">BE</option>
        </select>

        <input
          name="resultUsd"
          defaultValue={trade.resultUsd ?? ""}
          placeholder={t.resultUsd}
          className="rounded-xl bg-zinc-900 p-3"
        />

        <textarea
          name="notes"
          defaultValue={trade.notes || ""}
          placeholder={t.notes}
          className="rounded-xl bg-zinc-900 p-3 sm:col-span-2 xl:col-span-4"
        />

        <button
          type="submit"
          className="rounded-xl bg-green-500 p-3 font-bold text-black sm:col-span-2 xl:col-span-4"
        >
          {t.saveChanges}
        </button>
      </form>
    </div>
  );
}
