import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  LineChart as LineChartIcon,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import EquityChart from "@/components/EquityChart";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatCurrencyByLanguage,
  formatDateByLanguage,
  formatPercentByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import ScopeBar from "@/components/ScopeBar";
import {
  parseScopeParams,
  getPeriodRange,
  getPeriodSuffix,
} from "@/lib/scope";

type StatCardProps = {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  tone?: string;
};

type EquityLabels = {
  heroBadge: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  backToAccountHub: string;

  currentEquity: string;
  currentEquityDescription: string;
  totalPnl: string;
  totalPnlDescription: string;
  growth: string;
  growthDescription: string;
  maxDrawdown: string;
  maxDrawdownDescription: string;

  accountGrowth: string;
  equityProgression: string;
  noTradesChart: string;

  equityPeak: string;
  equityPeakDescription: string;
  lowestEquity: string;
  lowestEquityDescription: string;

  positiveTrades: string;
  positiveTradesDescription: string;
  negativeTrades: string;
  negativeTradesDescription: string;
  flatTrades: string;
  flatTradesDescription: string;
  averagePnl: string;
  averagePnlDescription: string;

  bestTrade: string;
  bestTradeDescription: string;
  worstTrade: string;
  worstTradeDescription: string;

  equityHistory: string;
  tradeByTradeProgression: string;
  showingLatest: (shown: number, total: number) => string;

  unknownSymbol: string;
  equity: string;
  drawdown: string;
  date: string;
  symbol: string;
  outcome: string;
  pnl: string;
  noEquityHistory: string;
};

const equityLabels: Record<AppLanguage, EquityLabels> = {
  it: {
    heroBadge: "Tracciamento capitale",
    heroEyebrow: "Centro controllo equity",
    heroTitle: "Curva Equity",
    heroDescription:
      "Segui la crescita dell’account, la protezione del capitale, il comportamento del drawdown e l’evoluzione della tua equity nel tempo.",
    backToAccountHub: "Torna all’Account Hub",

    currentEquity: "Equity attuale",
    currentEquityDescription:
      "Ultima equity calcolata dopo i trade chiusi.",
    totalPnl: "PnL totale",
    totalPnlDescription:
      "Profitto o perdita totale generata dall’account.",
    growth: "Crescita",
    growthDescription:
      "Performance rispetto al saldo iniziale.",
    maxDrawdown: "Drawdown massimo",
    maxDrawdownDescription:
      "Peggiore calo dell’equity registrato sull’account.",

    accountGrowth: "Crescita account",
    equityProgression: "Progressione Equity",
    noTradesChart:
      "Nessun trade presente. Quando aggiungerai operazioni, la curva equity comparirà qui.",

    equityPeak: "Picco Equity",
    equityPeakDescription:
      "Valore equity più alto registrato su questo account.",
    lowestEquity: "Equity minima",
    lowestEquityDescription:
      "Valore equity più basso registrato includendo il saldo iniziale.",

    positiveTrades: "Trade positivi",
    positiveTradesDescription:
      "Trade chiusi con risultato positivo.",
    negativeTrades: "Trade negativi",
    negativeTradesDescription:
      "Trade chiusi con risultato negativo.",
    flatTrades: "Trade flat",
    flatTradesDescription:
      "Trade chiusi a break-even o senza PnL.",
    averagePnl: "PnL medio",
    averagePnlDescription:
      "Risultato medio per trade registrato.",

    bestTrade: "Miglior trade",
    bestTradeDescription:
      "Risultato positivo singolo più grande registrato su questo account.",
    worstTrade: "Peggior trade",
    worstTradeDescription:
      "Risultato negativo singolo più grande registrato su questo account.",

    equityHistory: "Storico equity",
    tradeByTradeProgression: "Progressione trade per trade",
    showingLatest: (shown, total) =>
      `Mostrati gli ultimi ${shown} di ${total} trade`,

    unknownSymbol: "Simbolo sconosciuto",
    equity: "Equity",
    drawdown: "Drawdown",
    date: "Data",
    symbol: "Simbolo",
    outcome: "Esito",
    pnl: "PnL",
    noEquityHistory:
      "Nessuno storico equity presente. Aggiungi trade per iniziare a tracciare la progressione del capitale.",
  },

  en: {
    heroBadge: "Capital tracking",
    heroEyebrow: "Equity control center",
    heroTitle: "Equity Curve",
    heroDescription:
      "Follow account growth, capital protection, drawdown behavior and the progression of your trading equity over time.",
    backToAccountHub: "Back to Account Hub",

    currentEquity: "Current Equity",
    currentEquityDescription:
      "Latest calculated account equity after closed trades.",
    totalPnl: "Total PnL",
    totalPnlDescription:
      "Total profit or loss generated by the account.",
    growth: "Growth",
    growthDescription:
      "Performance compared to the initial balance.",
    maxDrawdown: "Max Drawdown",
    maxDrawdownDescription:
      "Deepest equity pullback recorded on the account.",

    accountGrowth: "Account growth",
    equityProgression: "Equity Progression",
    noTradesChart:
      "No trades yet. Once trades are added, the equity curve will appear here.",

    equityPeak: "Equity Peak",
    equityPeakDescription:
      "Highest recorded equity value for this account.",
    lowestEquity: "Lowest Equity",
    lowestEquityDescription:
      "Lowest recorded equity value including the initial balance.",

    positiveTrades: "Positive Trades",
    positiveTradesDescription:
      "Trades closed with a positive result.",
    negativeTrades: "Negative Trades",
    negativeTradesDescription:
      "Trades closed with a negative result.",
    flatTrades: "Flat Trades",
    flatTradesDescription:
      "Trades closed at break-even or without PnL.",
    averagePnl: "Average PnL",
    averagePnlDescription:
      "Average result per recorded trade.",

    bestTrade: "Best Trade",
    bestTradeDescription:
      "Largest single positive result recorded on this account.",
    worstTrade: "Worst Trade",
    worstTradeDescription:
      "Largest single negative result recorded on this account.",

    equityHistory: "Equity history",
    tradeByTradeProgression: "Trade by Trade Progression",
    showingLatest: (shown, total) =>
      `Showing latest ${shown} of ${total} trades`,

    unknownSymbol: "Unknown Symbol",
    equity: "Equity",
    drawdown: "Drawdown",
    date: "Date",
    symbol: "Symbol",
    outcome: "Outcome",
    pnl: "PnL",
    noEquityHistory:
      "No equity history yet. Add trades to start tracking capital progression.",
  },

  uk: {
    heroBadge: "Відстеження капіталу",
    heroEyebrow: "Центр контролю equity",
    heroTitle: "Крива Equity",
    heroDescription:
      "Відстежуй зростання акаунта, захист капіталу, поведінку drawdown та розвиток торгової equity з часом.",
    backToAccountHub: "Назад до Account Hub",

    currentEquity: "Поточна equity",
    currentEquityDescription:
      "Останнє розраховане значення equity після закритих угод.",
    totalPnl: "Загальний PnL",
    totalPnlDescription:
      "Загальний прибуток або збиток, створений акаунтом.",
    growth: "Зростання",
    growthDescription:
      "Результат відносно початкового балансу.",
    maxDrawdown: "Максимальний drawdown",
    maxDrawdownDescription:
      "Найглибше просідання equity, зафіксоване на акаунті.",

    accountGrowth: "Зростання акаунта",
    equityProgression: "Прогресія Equity",
    noTradesChart:
      "Угод ще немає. Коли ти додаси угоди, крива equity з’явиться тут.",

    equityPeak: "Пік Equity",
    equityPeakDescription:
      "Найвище значення equity, зафіксоване на цьому акаунті.",
    lowestEquity: "Мінімальна equity",
    lowestEquityDescription:
      "Найнижче значення equity з урахуванням початкового балансу.",

    positiveTrades: "Позитивні угоди",
    positiveTradesDescription:
      "Угоди, закриті з позитивним результатом.",
    negativeTrades: "Негативні угоди",
    negativeTradesDescription:
      "Угоди, закриті з негативним результатом.",
    flatTrades: "Flat угоди",
    flatTradesDescription:
      "Угоди, закриті в break-even або без PnL.",
    averagePnl: "Середній PnL",
    averagePnlDescription:
      "Середній результат за одну записану угоду.",

    bestTrade: "Найкраща угода",
    bestTradeDescription:
      "Найбільший одиничний позитивний результат на цьому акаунті.",
    worstTrade: "Найгірша угода",
    worstTradeDescription:
      "Найбільший одиничний негативний результат на цьому акаунті.",

    equityHistory: "Історія equity",
    tradeByTradeProgression: "Прогресія угода за угодою",
    showingLatest: (shown, total) =>
      `Показано останні ${shown} з ${total} угод`,

    unknownSymbol: "Невідомий символ",
    equity: "Equity",
    drawdown: "Drawdown",
    date: "Дата",
    symbol: "Символ",
    outcome: "Результат",
    pnl: "PnL",
    noEquityHistory:
      "Історії equity ще немає. Додай угоди, щоб почати відстежувати прогрес капіталу.",
  },

  ru: {
    heroBadge: "Отслеживание капитала",
    heroEyebrow: "Центр контроля equity",
    heroTitle: "Кривая Equity",
    heroDescription:
      "Следи за ростом аккаунта, защитой капитала, поведением drawdown и развитием торговой equity во времени.",
    backToAccountHub: "Назад к Account Hub",

    currentEquity: "Текущая equity",
    currentEquityDescription:
      "Последнее рассчитанное значение equity после закрытых сделок.",
    totalPnl: "Общий PnL",
    totalPnlDescription:
      "Общая прибыль или убыток, созданные аккаунтом.",
    growth: "Рост",
    growthDescription:
      "Результат относительно начального баланса.",
    maxDrawdown: "Максимальный drawdown",
    maxDrawdownDescription:
      "Самое глубокое снижение equity, зафиксированное на аккаунте.",

    accountGrowth: "Рост аккаунта",
    equityProgression: "Прогрессия Equity",
    noTradesChart:
      "Сделок пока нет. Когда ты добавишь сделки, кривая equity появится здесь.",

    equityPeak: "Пик Equity",
    equityPeakDescription:
      "Самое высокое значение equity, зафиксированное на этом аккаунте.",
    lowestEquity: "Минимальная equity",
    lowestEquityDescription:
      "Самое низкое значение equity с учетом начального баланса.",

    positiveTrades: "Положительные сделки",
    positiveTradesDescription:
      "Сделки, закрытые с положительным результатом.",
    negativeTrades: "Отрицательные сделки",
    negativeTradesDescription:
      "Сделки, закрытые с отрицательным результатом.",
    flatTrades: "Flat сделки",
    flatTradesDescription:
      "Сделки, закрытые в break-even или без PnL.",
    averagePnl: "Средний PnL",
    averagePnlDescription:
      "Средний результат на одну записанную сделку.",

    bestTrade: "Лучшая сделка",
    bestTradeDescription:
      "Самый крупный единичный положительный результат на этом аккаунте.",
    worstTrade: "Худшая сделка",
    worstTradeDescription:
      "Самый крупный единичный отрицательный результат на этом аккаунте.",

    equityHistory: "История equity",
    tradeByTradeProgression: "Прогрессия сделка за сделкой",
    showingLatest: (shown, total) =>
      `Показаны последние ${shown} из ${total} сделок`,

    unknownSymbol: "Неизвестный символ",
    equity: "Equity",
    drawdown: "Drawdown",
    date: "Дата",
    symbol: "Символ",
    outcome: "Результат",
    pnl: "PnL",
    noEquityHistory:
      "Истории equity пока нет. Добавь сделки, чтобы начать отслеживать прогресс капитала.",
  },

  es: {
    heroBadge: "Seguimiento de capital",
    heroEyebrow: "Centro de control de equity",
    heroTitle: "Curva Equity",
    heroDescription:
      "Sigue el crecimiento de la cuenta, la protección del capital, el comportamiento del drawdown y la evolución de tu equity en el tiempo.",
    backToAccountHub: "Volver al Account Hub",

    currentEquity: "Equity actual",
    currentEquityDescription:
      "Último valor de equity calculado después de las operaciones cerradas.",
    totalPnl: "PnL total",
    totalPnlDescription:
      "Ganancia o pérdida total generada por la cuenta.",
    growth: "Crecimiento",
    growthDescription:
      "Rendimiento comparado con el balance inicial.",
    maxDrawdown: "Drawdown máximo",
    maxDrawdownDescription:
      "Mayor retroceso de equity registrado en la cuenta.",

    accountGrowth: "Crecimiento de la cuenta",
    equityProgression: "Progresión de Equity",
    noTradesChart:
      "Aún no hay operaciones. Cuando agregues trades, la curva equity aparecerá aquí.",

    equityPeak: "Pico de Equity",
    equityPeakDescription:
      "Valor de equity más alto registrado en esta cuenta.",
    lowestEquity: "Equity mínima",
    lowestEquityDescription:
      "Valor de equity más bajo registrado incluyendo el balance inicial.",

    positiveTrades: "Trades positivos",
    positiveTradesDescription:
      "Trades cerrados con resultado positivo.",
    negativeTrades: "Trades negativos",
    negativeTradesDescription:
      "Trades cerrados con resultado negativo.",
    flatTrades: "Trades flat",
    flatTradesDescription:
      "Trades cerrados en break-even o sin PnL.",
    averagePnl: "PnL promedio",
    averagePnlDescription:
      "Resultado promedio por trade registrado.",

    bestTrade: "Mejor trade",
    bestTradeDescription:
      "Mayor resultado positivo individual registrado en esta cuenta.",
    worstTrade: "Peor trade",
    worstTradeDescription:
      "Mayor resultado negativo individual registrado en esta cuenta.",

    equityHistory: "Historial de equity",
    tradeByTradeProgression: "Progresión trade por trade",
    showingLatest: (shown, total) =>
      `Mostrando los últimos ${shown} de ${total} trades`,

    unknownSymbol: "Símbolo desconocido",
    equity: "Equity",
    drawdown: "Drawdown",
    date: "Fecha",
    symbol: "Símbolo",
    outcome: "Resultado",
    pnl: "PnL",
    noEquityHistory:
      "Aún no hay historial de equity. Agrega trades para empezar a seguir la progresión del capital.",
  },

  fr: {
    heroBadge: "Suivi du capital",
    heroEyebrow: "Centre de contrôle equity",
    heroTitle: "Courbe Equity",
    heroDescription:
      "Suis la croissance du compte, la protection du capital, le comportement du drawdown et l’évolution de ton equity dans le temps.",
    backToAccountHub: "Retour à l’Account Hub",

    currentEquity: "Equity actuelle",
    currentEquityDescription:
      "Dernière equity calculée après les trades clôturés.",
    totalPnl: "PnL total",
    totalPnlDescription:
      "Profit ou perte total généré par le compte.",
    growth: "Croissance",
    growthDescription:
      "Performance comparée au solde initial.",
    maxDrawdown: "Drawdown maximal",
    maxDrawdownDescription:
      "Plus forte baisse d’equity enregistrée sur le compte.",

    accountGrowth: "Croissance du compte",
    equityProgression: "Progression Equity",
    noTradesChart:
      "Aucun trade pour le moment. Une fois les trades ajoutés, la courbe equity apparaîtra ici.",

    equityPeak: "Pic Equity",
    equityPeakDescription:
      "Valeur equity la plus élevée enregistrée sur ce compte.",
    lowestEquity: "Equity minimale",
    lowestEquityDescription:
      "Valeur equity la plus basse enregistrée, solde initial inclus.",

    positiveTrades: "Trades positifs",
    positiveTradesDescription:
      "Trades clôturés avec un résultat positif.",
    negativeTrades: "Trades négatifs",
    negativeTradesDescription:
      "Trades clôturés avec un résultat négatif.",
    flatTrades: "Trades flat",
    flatTradesDescription:
      "Trades clôturés au break-even ou sans PnL.",
    averagePnl: "PnL moyen",
    averagePnlDescription:
      "Résultat moyen par trade enregistré.",

    bestTrade: "Meilleur trade",
    bestTradeDescription:
      "Plus grand résultat positif individuel enregistré sur ce compte.",
    worstTrade: "Pire trade",
    worstTradeDescription:
      "Plus grand résultat négatif individuel enregistré sur ce compte.",

    equityHistory: "Historique equity",
    tradeByTradeProgression: "Progression trade par trade",
    showingLatest: (shown, total) =>
      `Affichage des ${shown} derniers trades sur ${total}`,

    unknownSymbol: "Symbole inconnu",
    equity: "Equity",
    drawdown: "Drawdown",
    date: "Date",
    symbol: "Symbole",
    outcome: "Résultat",
    pnl: "PnL",
    noEquityHistory:
      "Aucun historique equity pour le moment. Ajoute des trades pour commencer à suivre la progression du capital.",
  },

  de: {
    heroBadge: "Kapitalverfolgung",
    heroEyebrow: "Equity-Kontrollzentrum",
    heroTitle: "Equity-Kurve",
    heroDescription:
      "Verfolge Kontowachstum, Kapitalschutz, Drawdown-Verhalten und die Entwicklung deiner Trading-Equity im Zeitverlauf.",
    backToAccountHub: "Zurück zum Account Hub",

    currentEquity: "Aktuelle Equity",
    currentEquityDescription:
      "Zuletzt berechnete Konto-Equity nach geschlossenen Trades.",
    totalPnl: "Gesamt-PnL",
    totalPnlDescription:
      "Gesamter Gewinn oder Verlust, der vom Konto erzeugt wurde.",
    growth: "Wachstum",
    growthDescription:
      "Performance im Vergleich zum Anfangssaldo.",
    maxDrawdown: "Maximaler Drawdown",
    maxDrawdownDescription:
      "Tiefster Equity-Rückgang, der auf dem Konto erfasst wurde.",

    accountGrowth: "Kontowachstum",
    equityProgression: "Equity-Entwicklung",
    noTradesChart:
      "Noch keine Trades. Sobald Trades hinzugefügt werden, erscheint die Equity-Kurve hier.",

    equityPeak: "Equity-Hoch",
    equityPeakDescription:
      "Höchster Equity-Wert, der für dieses Konto erfasst wurde.",
    lowestEquity: "Niedrigste Equity",
    lowestEquityDescription:
      "Niedrigster Equity-Wert inklusive Anfangssaldo.",

    positiveTrades: "Positive Trades",
    positiveTradesDescription:
      "Trades, die mit positivem Ergebnis geschlossen wurden.",
    negativeTrades: "Negative Trades",
    negativeTradesDescription:
      "Trades, die mit negativem Ergebnis geschlossen wurden.",
    flatTrades: "Flat Trades",
    flatTradesDescription:
      "Trades, die bei Break-even oder ohne PnL geschlossen wurden.",
    averagePnl: "Durchschnittlicher PnL",
    averagePnlDescription:
      "Durchschnittliches Ergebnis pro erfasstem Trade.",

    bestTrade: "Bester Trade",
    bestTradeDescription:
      "Größtes einzelnes positives Ergebnis auf diesem Konto.",
    worstTrade: "Schlechtester Trade",
    worstTradeDescription:
      "Größtes einzelnes negatives Ergebnis auf diesem Konto.",

    equityHistory: "Equity-Historie",
    tradeByTradeProgression: "Trade-für-Trade-Entwicklung",
    showingLatest: (shown, total) =>
      `Zeige die letzten ${shown} von ${total} Trades`,

    unknownSymbol: "Unbekanntes Symbol",
    equity: "Equity",
    drawdown: "Drawdown",
    date: "Datum",
    symbol: "Symbol",
    outcome: "Ergebnis",
    pnl: "PnL",
    noEquityHistory:
      "Noch keine Equity-Historie. Füge Trades hinzu, um die Kapitalentwicklung zu verfolgen.",
  },
};

function formatPercent(
  value: number,
  language: AppLanguage
) {
  return formatPercentByLanguage(value, language);
}

function formatDate(
  date: Date,
  language: AppLanguage
) {
  return formatDateByLanguage(date, language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatShortDate(
  date: Date,
  language: AppLanguage
) {
  return formatDateByLanguage(date, language, {
    day: "2-digit",
    month: "2-digit",
  });
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

export default async function EquityPage({
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
  const { period, ref } = parseScopeParams({
    period: filters.period,
    ref: filters.ref,
  });

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

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      lastSeenAt: new Date(),
      lastActivityAt: new Date(),
    },
  });

  const currentUser = await prisma.user.findUnique({
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

  const t = equityLabels[language];

  const account = membership.tradingAccount;

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
      ...(selectedMemberId ? { createdById: selectedMemberId } : {}),
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

  const dateRange = getPeriodRange(
    period,
    ref,
    currentUser?.timezone ?? undefined,
  );

  const periodTrades = dateRange
    ? trades.filter(
        (trade) =>
          trade.openDate >= dateRange.gte &&
          trade.openDate < dateRange.lte,
      )
    : trades;

  const periodSuffix = getPeriodSuffix(period, ref, language);

  const initialBalance = account.initialBalance || 0;
  const currency = account.currency || "USD";

  const money = (value: number) =>
    formatCurrencyByLanguage(
      value,
      currency,
      language
    );

  const currentEquity =
    trades.length > 0
      ? trades[trades.length - 1].equity || initialBalance
      : initialBalance;

  const totalPnl = periodTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const currentProfitPercent =
    initialBalance > 0
      ? ((currentEquity - initialBalance) /
        initialBalance) *
      100
      : 0;

  const positiveTrades = periodTrades.filter(
    (trade) => (trade.resultUsd || 0) > 0
  ).length;

  const negativeTrades = periodTrades.filter(
    (trade) => (trade.resultUsd || 0) < 0
  ).length;

  const flatTrades = periodTrades.filter(
    (trade) => (trade.resultUsd || 0) === 0
  ).length;

  const maxDrawdown =
    periodTrades.length > 0
      ? Math.min(
        ...periodTrades.map(
          (trade) => trade.drawdownPercent || 0
        )
      )
      : 0;

  const maxEquity =
    periodTrades.length > 0
      ? Math.max(
        initialBalance,
        ...periodTrades.map(
          (trade) => trade.equity || initialBalance
        )
      )
      : initialBalance;

  const lowestEquity =
    periodTrades.length > 0
      ? Math.min(
        initialBalance,
        ...periodTrades.map(
          (trade) => trade.equity || initialBalance
        )
      )
      : initialBalance;

  const bestTrade =
    periodTrades.length > 0
      ? Math.max(
        ...periodTrades.map((trade) => trade.resultUsd || 0)
      )
      : 0;

  const worstTrade =
    periodTrades.length > 0
      ? Math.min(
        ...periodTrades.map((trade) => trade.resultUsd || 0)
      )
      : 0;

  const averagePnl =
    periodTrades.length > 0 ? totalPnl / periodTrades.length : 0;

  const chartData = periodTrades.map((trade) => ({
    date: formatShortDate(trade.openDate, language),
    equity: trade.equity || initialBalance,
  }));

  const recentTrades = [...periodTrades].reverse().slice(0, 10);

  const stats = [
    {
      label: t.currentEquity,
      value: money(currentEquity),
      description: t.currentEquityDescription,
      icon: Wallet,
      tone: "text-white",
    },
    {
      label: t.totalPnl + periodSuffix,
      value: money(totalPnl),
      description: t.totalPnlDescription,
      icon: TrendingUp,
      tone: getResultTone(totalPnl),
    },
    {
      label: t.growth,
      value: formatPercent(
        currentProfitPercent,
        language
      ),
      description: t.growthDescription,
      icon: BarChart3,
      tone: getResultTone(currentProfitPercent),
    },
    {
      label: t.maxDrawdown + periodSuffix,
      value: formatPercent(maxDrawdown, language),
      description: t.maxDrawdownDescription,
      icon: ShieldAlert,
      tone:
        maxDrawdown < 0
          ? "text-red-400"
          : "text-yellow-400",
    },
  ];

  return (
    <div className="space-y-12">
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

      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_14%,transparent),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_35%)]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-accent-bright/20 bg-accent-bright/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-accent-bright">
                {t.heroBadge}
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                {account.name}
              </span>
            </div>

            <p className="text-sm text-gray-400">
              {t.heroEyebrow}
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-6xl">
              {t.heroTitle}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400">
              {t.heroDescription}
            </p>
          </div>

          <Link
            href={`/accounts/${accountId}`}
            className="flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
          >
            <ArrowLeft size={17} />
            {t.backToAccountHub}
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            tone={stat.tone}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                {t.accountGrowth}
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                {t.equityProgression}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-accent-bright">
              <LineChartIcon size={20} />
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="min-w-0">
              <EquityChart data={chartData} language={language} />
            </div>
          ) : (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm leading-6 text-gray-400">
              {t.noTradesChart}
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-400">
              {t.equityPeak + periodSuffix}
            </p>

            <h2 className="mt-3 text-3xl font-black text-accent">
              {money(maxEquity)}
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              {t.equityPeakDescription}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-400">
              {t.lowestEquity + periodSuffix}
            </p>

            <h2 className="mt-3 text-3xl font-black text-red-400">
              {money(lowestEquity)}
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              {t.lowestEquityDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t.positiveTrades + periodSuffix}
          value={positiveTrades}
          description={t.positiveTradesDescription}
          icon={TrendingUp}
          tone="text-accent"
        />

        <StatCard
          label={t.negativeTrades + periodSuffix}
          value={negativeTrades}
          description={t.negativeTradesDescription}
          icon={TrendingDown}
          tone="text-red-400"
        />

        <StatCard
          label={t.flatTrades + periodSuffix}
          value={flatTrades}
          description={t.flatTradesDescription}
          icon={Activity}
          tone="text-yellow-400"
        />

        <StatCard
          label={t.averagePnl + periodSuffix}
          value={money(averagePnl)}
          description={t.averagePnlDescription}
          icon={BarChart3}
          tone={getResultTone(averagePnl)}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.bestTrade + periodSuffix}
          </p>

          <h2 className="mt-3 text-4xl font-black text-accent">
            {money(bestTrade)}
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            {t.bestTradeDescription}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            {t.worstTrade + periodSuffix}
          </p>

          <h2 className="mt-3 text-4xl font-black text-red-400">
            {money(worstTrade)}
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            {t.worstTradeDescription}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              {t.equityHistory}
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              {t.tradeByTradeProgression}
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {t.showingLatest(
              recentTrades.length,
              periodTrades.length
            )}
          </p>
        </div>

        {recentTrades.length > 0 ? (
          <>
            <div className="space-y-3 lg:hidden">
              {recentTrades.map((trade) => {
                const result = trade.resultUsd || 0;
                const equity =
                  trade.equity || initialBalance;
                const drawdown =
                  trade.drawdownPercent || 0;

                return (
                  <div
                    key={trade.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-white">
                          {trade.symbol || t.unknownSymbol}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {formatDate(
                            trade.openDate,
                            language
                          )}{" "}
                          · {trade.outcome || "-"}
                        </p>
                      </div>

                      <p
                        className={`shrink-0 font-black ${getResultTone(
                          result
                        )}`}
                      >
                        {money(result)}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-white/[0.03] p-3">
                        <p className="text-gray-500">
                          {t.equity}
                        </p>
                        <p className="mt-1 font-bold text-white">
                          {money(equity)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/[0.03] p-3">
                        <p className="text-gray-500">
                          {t.drawdown}
                        </p>
                        <p
                          className={`mt-1 font-bold ${drawdown < 0
                              ? "text-red-400"
                              : "text-gray-300"
                            }`}
                        >
                          {formatPercent(
                            drawdown,
                            language
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-white/10 lg:block">
              <table className="w-full border-collapse">
                <thead className="bg-white/5 text-left text-sm text-gray-400">
                  <tr>
                    <th className="p-4">
                      {t.date}
                    </th>
                    <th className="p-4">
                      {t.symbol}
                    </th>
                    <th className="p-4">
                      {t.outcome}
                    </th>
                    <th className="p-4">
                      {t.equity}
                    </th>
                    <th className="p-4">
                      {t.pnl}
                    </th>
                    <th className="p-4">
                      {t.drawdown}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentTrades.map((trade) => {
                    const result =
                      trade.resultUsd || 0;
                    const drawdown =
                      trade.drawdownPercent || 0;

                    return (
                      <tr
                        key={trade.id}
                        className="border-t border-white/10"
                      >
                        <td className="p-4 text-gray-300">
                          {formatDate(
                            trade.openDate,
                            language
                          )}
                        </td>

                        <td className="p-4 font-semibold text-white">
                          {trade.symbol || "-"}
                        </td>

                        <td className="p-4 text-gray-300">
                          {trade.outcome || "-"}
                        </td>

                        <td className="p-4 font-semibold text-white">
                          {money(
                            trade.equity ||
                            initialBalance
                          )}
                        </td>

                        <td
                          className={`p-4 font-semibold ${getResultTone(
                            result
                          )}`}
                        >
                          {money(result)}
                        </td>

                        <td
                          className={`p-4 font-semibold ${drawdown < 0
                              ? "text-red-400"
                              : "text-gray-300"
                            }`}
                        >
                          {formatPercent(
                            drawdown,
                            language
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-gray-400">
            {t.noEquityHistory}
          </div>
        )}
      </section>
    </div>
  );
}
