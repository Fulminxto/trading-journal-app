import { redirect } from "next/navigation";
import {
  BarChart3,
  LineChart as LineChartIcon,
  ShieldAlert,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import AccountPageShell from "@/components/AccountPageShell";
import EquityChart from "@/components/EquityChart";
import DrawdownChart from "@/components/equity/DrawdownChart";
import Card from "@/components/ui/Card";
import IconTile from "@/components/ui/IconTile";
import ListRow from "@/components/ui/ListRow";
import SignatureEdge from "@/components/ui/SignatureEdge";
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
import { pageDensity } from "@/lib/page-density";

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

  protectBadge: string;
  underwaterCurve: string;
  underwaterDescription: string;
  tradeSplitTitle: string;
  extremesTitle: string;

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
    backToAccountHub: "Torna alla Dashboard",

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

    protectBadge: "Protect",
    underwaterCurve: "Curva Underwater",
    underwaterDescription:
      "Quanto il capitale resta sotto il picco massimo, trade per trade.",
    tradeSplitTitle: "Distribuzione Trade",
    extremesTitle: "Estremi",

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
    backToAccountHub: "Back to Dashboard",

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

    protectBadge: "Protect",
    underwaterCurve: "Underwater Curve",
    underwaterDescription:
      "How far capital stays below its peak, trade by trade.",
    tradeSplitTitle: "Trade Split",
    extremesTitle: "Extremes",

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
    backToAccountHub: "Назад до Dashboard",

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

    protectBadge: "Protect",
    underwaterCurve: "Крива Underwater",
    underwaterDescription:
      "Наскільки капітал залишається нижче піку, угода за угодою.",
    tradeSplitTitle: "Розподіл угод",
    extremesTitle: "Екстремуми",

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
    backToAccountHub: "Назад к Dashboard",

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

    protectBadge: "Protect",
    underwaterCurve: "Кривая Underwater",
    underwaterDescription:
      "Насколько капитал остается ниже пика, сделка за сделкой.",
    tradeSplitTitle: "Распределение сделок",
    extremesTitle: "Экстремумы",

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
    backToAccountHub: "Volver al Dashboard",

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

    protectBadge: "Protect",
    underwaterCurve: "Curva Underwater",
    underwaterDescription:
      "Cuánto permanece el capital por debajo de su pico, trade por trade.",
    tradeSplitTitle: "Distribución de Trades",
    extremesTitle: "Extremos",

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
    backToAccountHub: "Retour au Dashboard",

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

    protectBadge: "Protect",
    underwaterCurve: "Courbe Underwater",
    underwaterDescription:
      "Jusqu'où le capital reste sous son pic, trade par trade.",
    tradeSplitTitle: "Répartition des Trades",
    extremesTitle: "Extrêmes",

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
    backToAccountHub: "Zurück zum Dashboard",

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

    protectBadge: "Protect",
    underwaterCurve: "Underwater-Kurve",
    underwaterDescription:
      "Wie weit das Kapital unter seinem Höchststand bleibt, Trade für Trade.",
    tradeSplitTitle: "Trade-Verteilung",
    extremesTitle: "Extreme",

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
  date: Date
) {
  return formatDateByLanguage(date, "en", {
    day: "numeric",
    month: "short",
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

function getOutcomeBadgeClass(outcome: string | null) {
  if (outcome === "win") {
    return "border-green-400/20 bg-green-400/10 text-green-300";
  }

  if (outcome === "loss") {
    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  if (outcome === "be") {
    return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
  }

  return "border-white/10 bg-white/[0.04] text-muted";
}

function getOutcomeBadgeLabel(outcome: string | null) {
  if (outcome === "win") {
    return "WIN";
  }

  if (outcome === "loss") {
    return "LOSS";
  }

  if (outcome === "be") {
    return "BE";
  }

  return "-";
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "text-white",
}: StatCardProps) {
  return (
    <Card interactive className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            {label}
          </p>

          <h2 className={`mt-3 text-3xl font-black ${tone}`}>
            {value}
          </h2>
        </div>

        <IconTile>
          <Icon size={20} />
        </IconTile>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-faint">
        {description}
      </p>
    </Card>
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

  const lowestEquityTone =
    lowestEquity < initialBalance ? "text-red-400" : "text-white";

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

  // Underwater curve: percent below the running peak at each point,
  // derived from the same equity series as the hero chart above (not
  // from trade.drawdownPercent, which could drift out of sync with it).
  const underwaterData = periodTrades.reduce<{
    runningPeak: number;
    points: { date: string; drawdown: number }[];
  }>((acc, trade) => {
    const equity = trade.equity || initialBalance;
    const runningPeak = Math.max(acc.runningPeak, equity);

    return {
      runningPeak,
      points: [
        ...acc.points,
        {
          date: formatShortDate(trade.openDate, language),
          drawdown:
            runningPeak > 0
              ? ((equity - runningPeak) / runningPeak) * 100
              : 0,
        },
      ],
    };
  }, {
    runningPeak: initialBalance,
    points: [],
  }).points;

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
      // Zero drawdown is a good outcome, not a warning - was previously
      // shown as yellow ("caution") for the case with nothing to caution
      // about.
      tone: maxDrawdown < 0 ? "text-red-400" : "text-white",
    },
  ];

  return (
    <AccountPageShell
      className={pageDensity.equity.page}
      eyebrow={
        <>
          {t.heroEyebrow} &middot; {account.name}
        </>
      }
      title={t.heroTitle}
      supportLine="Monitor capital growth, drawdown and long-term account progression."
      badges={
        <span className="rounded-full border border-accent-bright/20 bg-accent-bright/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-accent-bright">
          {t.heroBadge}
        </span>
      }
      scopeBar={
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
      }
    >

      {/* PRIMARY - the equity curve, dominant, alone. */}
      <div className="reveal-rise" style={{ animationDelay: "60ms" }}>
        <Card variant="hero" interactive className={`relative ${pageDensity.equity.hero}`}>
          <SignatureEdge
            orientation="vertical"
            className="absolute bottom-8 left-0 top-8"
          />

          <div className="pl-4">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted">
                  {t.accountGrowth}
                </p>

                <h2 className="text-section mt-1 text-white">
                  {t.equityProgression}
                </h2>
              </div>

              <IconTile>
                <LineChartIcon size={20} />
              </IconTile>
            </div>

            {chartData.length > 0 ? (
              <div className="min-w-0">
                <EquityChart data={chartData} language={language} />
              </div>
            ) : (
              <Card
                variant="inner"
                className="flex min-h-[280px] items-center justify-center border-dashed p-8 text-center text-sm leading-6 text-muted"
              >
                {t.noTradesChart}
              </Card>
            )}
          </div>
        </Card>
      </div>

      {/* SECONDARY - 4 compact metrics. */}
      <div
        className={`reveal-rise grid grid-cols-1 ${pageDensity.equity.grid} md:grid-cols-2 xl:grid-cols-4`}
        style={{ animationDelay: "120ms" }}
      >
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
      </div>

      {/* PROTECT - Equity's differentiator from Dashboard: drawdown is
          the protagonist here (underwater curve + peak/lowest), not a
          single stat buried among a dozen others. */}
      <div className="reveal-rise" style={{ animationDelay: "180ms" }}>
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-300">
            {t.protectBadge}
          </span>

          <h2 className="text-section text-white">
            {t.underwaterCurve}
          </h2>
        </div>

        <div className={`grid grid-cols-1 ${pageDensity.equity.grid} xl:grid-cols-[minmax(0,1.5fr)_minmax(460px,1fr)]`}>
          <Card className={pageDensity.equity.panel}>
            <p className="mb-4 text-sm leading-6 text-muted">
              {t.underwaterDescription}
            </p>

            <DrawdownChart data={underwaterData} language={language} />
          </Card>

          <div className={`grid ${pageDensity.equity.grid} md:grid-cols-2`}>
            <Card interactive className={pageDensity.equity.panel}>
              <p className="text-sm text-muted">
                {t.equityPeak + periodSuffix}
              </p>

              <h3 className="mt-2 text-2xl font-black text-accent">
                {money(maxEquity)}
              </h3>

              <p className="mt-3 text-xs leading-5 text-muted-faint">
                {t.equityPeakDescription}
              </p>
            </Card>

            <Card interactive className={pageDensity.equity.panel}>
              <p className="text-sm text-muted">
                {t.lowestEquity + periodSuffix}
              </p>

              <h3 className={`mt-2 text-2xl font-black ${lowestEquityTone}`}>
                {money(lowestEquity)}
              </h3>

              <p className="mt-3 text-xs leading-5 text-muted-faint">
                {t.lowestEquityDescription}
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* TERTIARY - consolidated into two compact multi-row cards
          (was six separate stat tiles: positive/negative/flat/average
          /best/worst - the "KPI echo" pattern REBRAND_BLUEPRINT.md
          names as one of the four diseases). */}
      <div
        className={`reveal-rise grid grid-cols-1 ${pageDensity.equity.grid} md:grid-cols-2`}
        style={{ animationDelay: "240ms" }}
      >
        <Card interactive className={pageDensity.equity.panel}>
          <p className="text-sm text-muted">
            {t.tradeSplitTitle}
          </p>

          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.positiveTrades + periodSuffix}</span>
              <span className="font-black text-green-400">{positiveTrades}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.negativeTrades + periodSuffix}</span>
              <span className="font-black text-red-400">{negativeTrades}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.flatTrades + periodSuffix}</span>
              <span className="font-black text-yellow-300">{flatTrades}</span>
            </div>
          </div>
        </Card>

        <Card interactive className={pageDensity.equity.panel}>
          <p className="text-sm text-muted">
            {t.extremesTitle}
          </p>

          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.bestTrade + periodSuffix}</span>
              <span className="font-black text-accent">{money(bestTrade)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.worstTrade + periodSuffix}</span>
              <span className="font-black text-red-400">{money(worstTrade)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{t.averagePnl + periodSuffix}</span>
              <span className={`font-black ${getResultTone(averagePnl)}`}>
                {money(averagePnl)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="reveal-rise" style={{ animationDelay: "300ms" }}>
        <Card className={pageDensity.equity.panel}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted">
                {t.equityHistory}
              </p>

              <h2 className="text-section mt-1 text-white">
                {t.tradeByTradeProgression}
              </h2>
            </div>

            <p className="text-sm text-muted-faint">
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
                    <ListRow key={trade.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-bold text-white">
                            {trade.symbol || t.unknownSymbol}
                          </p>

                          <p className="mt-1 text-xs text-muted-faint">
                            {formatDate(trade.openDate)}
                            <span
                              className={`ml-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] ${getOutcomeBadgeClass(
                                trade.outcome
                              )}`}
                            >
                              {getOutcomeBadgeLabel(trade.outcome)}
                            </span>
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
                        <div>
                          <p className="text-muted-faint">
                            {t.equity}
                          </p>
                          <p className="mt-1 font-bold text-white">
                            {money(equity)}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-faint">
                            {t.drawdown}
                          </p>
                          <p
                            className={`mt-1 font-bold ${drawdown < 0
                                ? "text-red-400"
                                : "text-white"
                              }`}
                          >
                            {formatPercent(
                              drawdown,
                              language
                            )}
                          </p>
                        </div>
                      </div>
                    </ListRow>
                  );
                })}
              </div>

              <div className="hidden overflow-x-auto rounded-inner border-[0.5px] border-white/[0.08] lg:block">
                <table className="w-full border-collapse">
                  <thead className="bg-white/5 text-left text-sm text-muted">
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
                            {formatDate(trade.openDate)}
                          </td>

                          <td className="p-4 font-semibold text-white">
                            {trade.symbol || "-"}
                          </td>

                          <td className="p-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${getOutcomeBadgeClass(
                                trade.outcome
                              )}`}
                            >
                              {getOutcomeBadgeLabel(trade.outcome)}
                            </span>
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
            <Card variant="inner" className="border-dashed p-8 text-center text-sm text-muted">
              {t.noEquityHistory}
            </Card>
          )}
        </Card>
      </div>
    </AccountPageShell>
  );
}
