import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import BehavioralReportCard from "@/components/reports/BehavioralReportCard";
import PerformanceBreakdownCard from "@/components/reports/PerformanceBreakdownCard";
import ExecutiveSummaryCard from "@/components/reports/ExecutiveSummaryCard";
import PsychologyMindsetCard from "@/components/reports/PsychologyMindsetCard";
import GrowthFocusCard from "@/components/reports/GrowthFocusCard";
import ReportsNavigation from "@/components/reports/ReportsNavigation";
import PrintReportButton from "@/components/reports/PrintReportButton";
import PDFReportFooter from "@/components/reports/PDFReportFooter";
import PDFCompactReport from "@/components/reports/PDFCompactReport";
import { getReportLabels } from "@/components/reports/ReportI18n";

import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";

import {
  formatCurrencyByLanguage,
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

// Below this many trades in the selected period, the report shows an
// honest "not enough data" fallback for every interpretive verdict
// instead of a confident-sounding label computed from a handful of
// trades. Raw counts (PnL, win/loss) still display - only the tiered
// status/verdict text is gated.
const MIN_TRADES_FOR_VERDICT = 5;

type ReportsLabels = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;

  totalTrades: string;
  totalPnl: string;
  average: string;
  winRate: string;
  behavioralRisk: string;
  behavioralRiskDescription: string;

  strongSample: string;
  growingSample: string;
  earlySample: string;

  focusReduceBehavioralRisk: string;
  focusImproveRiskReward: string;
  focusReviewSetups: string;
  focusProtectEdge: string;
};

const reportsLabels: Record<
  AppLanguage,
  ReportsLabels
> = {
  it: {
    heroEyebrow: "VOLTIS Intelligence Reports",
    heroTitle: "Report Intelligence",
    heroDescription:
      "Un riepilogo operativo per leggere performance, comportamento, rischio, disciplina ed evoluzione del trader.",

    totalTrades: "Trade Totali",
    totalPnl: "PnL Totale",
    average: "Media",
    winRate: "Win Rate",
    behavioralRisk: "Rischio Comportamentale",
    behavioralRiskDescription:
      "Emozione, confidence, esecuzione",

    strongSample: "Campione solido",
    growingSample: "Campione in crescita",
    earlySample: "Campione iniziale",

    focusReduceBehavioralRisk:
      "Riduci il rischio comportamentale prima di aumentare il volume.",
    focusImproveRiskReward:
      "Migliora il rapporto rischio/rendimento e il controllo delle perdite.",
    focusReviewSetups:
      "Rivedi setup e qualità degli ingressi.",
    focusProtectEdge:
      "Proteggi l'edge attuale con esecuzione costante.",
  },

  en: {
    heroEyebrow: "VOLTIS Intelligence Reports",
    heroTitle: "Intelligence Reports",
    heroDescription:
      "An operational summary to read performance, behavior, risk, discipline and trader evolution.",

    totalTrades: "Total Trades",
    totalPnl: "Total PnL",
    average: "Average",
    winRate: "Win Rate",
    behavioralRisk: "Behavioral Risk",
    behavioralRiskDescription:
      "Emotion, confidence, execution",

    strongSample: "Strong sample",
    growingSample: "Growing sample",
    earlySample: "Early sample",

    focusReduceBehavioralRisk:
      "Reduce behavioral risk before scaling volume.",
    focusImproveRiskReward:
      "Improve risk/reward balance and loss control.",
    focusReviewSetups:
      "Review setups and entry quality.",
    focusProtectEdge:
      "Protect the current edge with consistent execution.",
  },

  uk: {
    heroEyebrow: "VOLTIS Intelligence Reports",
    heroTitle: "Інтелектуальні звіти",
    heroDescription:
      "Операційний підсумок для аналізу результатів, поведінки, ризику, дисципліни та розвитку трейдера.",

    totalTrades: "Усього угод",
    totalPnl: "Загальний PnL",
    average: "Середнє",
    winRate: "Відсоток перемог",
    behavioralRisk: "Поведінковий ризик",
    behavioralRiskDescription:
      "Емоції, впевненість, виконання",

    strongSample: "Сильна вибірка",
    growingSample: "Вибірка зростає",
    earlySample: "Початкова вибірка",

    focusReduceBehavioralRisk:
      "Зменш поведінковий ризик перед збільшенням обсягу.",
    focusImproveRiskReward:
      "Покращ баланс ризику/прибутку та контроль збитків.",
    focusReviewSetups:
      "Переглянь сетапи та якість входів.",
    focusProtectEdge:
      "Захищай поточну перевагу стабільним виконанням.",
  },

  ru: {
    heroEyebrow: "VOLTIS Intelligence Reports",
    heroTitle: "Интеллектуальные отчеты",
    heroDescription:
      "Операционный обзор для анализа результатов, поведения, риска, дисциплины и развития трейдера.",

    totalTrades: "Всего сделок",
    totalPnl: "Общий PnL",
    average: "Среднее",
    winRate: "Процент побед",
    behavioralRisk: "Поведенческий риск",
    behavioralRiskDescription:
      "Эмоции, уверенность, исполнение",

    strongSample: "Сильная выборка",
    growingSample: "Растущая выборка",
    earlySample: "Начальная выборка",

    focusReduceBehavioralRisk:
      "Снизь поведенческий риск перед увеличением объема.",
    focusImproveRiskReward:
      "Улучши баланс риск/прибыль и контроль убытков.",
    focusReviewSetups:
      "Пересмотри сетапы и качество входов.",
    focusProtectEdge:
      "Защищай текущий edge стабильным исполнением.",
  },

  es: {
    heroEyebrow: "VOLTIS Intelligence Reports",
    heroTitle: "Informes de inteligencia",
    heroDescription:
      "Un resumen operativo para leer rendimiento, comportamiento, riesgo, disciplina y evolución del trader.",

    totalTrades: "Trades totales",
    totalPnl: "PnL total",
    average: "Media",
    winRate: "Win Rate",
    behavioralRisk: "Riesgo conductual",
    behavioralRiskDescription:
      "Emoción, confianza, ejecución",

    strongSample: "Muestra sólida",
    growingSample: "Muestra en crecimiento",
    earlySample: "Muestra inicial",

    focusReduceBehavioralRisk:
      "Reduce el riesgo conductual antes de aumentar volumen.",
    focusImproveRiskReward:
      "Mejora el balance riesgo/beneficio y el control de pérdidas.",
    focusReviewSetups:
      "Revisa setups y calidad de entrada.",
    focusProtectEdge:
      "Protege el edge actual con ejecución constante.",
  },

  fr: {
    heroEyebrow: "VOLTIS Intelligence Reports",
    heroTitle: "Rapports d'intelligence",
    heroDescription:
      "Un résumé opérationnel pour lire performance, comportement, risque, discipline et évolution du trader.",

    totalTrades: "Trades totaux",
    totalPnl: "PnL total",
    average: "Moyenne",
    winRate: "Win Rate",
    behavioralRisk: "Risque comportemental",
    behavioralRiskDescription:
      "Émotion, confiance, exécution",

    strongSample: "Échantillon solide",
    growingSample: "Échantillon en croissance",
    earlySample: "Échantillon initial",

    focusReduceBehavioralRisk:
      "Réduis le risque comportemental avant d'augmenter le volume.",
    focusImproveRiskReward:
      "Améliore l'équilibre risque/rendement et le contrôle des pertes.",
    focusReviewSetups:
      "Revois les setups et la qualité des entrées.",
    focusProtectEdge:
      "Protège l'edge actuel avec une exécution constante.",
  },

  de: {
    heroEyebrow: "VOLTIS Intelligence Reports",
    heroTitle: "Intelligence-Berichte",
    heroDescription:
      "Eine operative Zusammenfassung zur Analyse von Performance, Verhalten, Risiko, Disziplin und Trader-Entwicklung.",

    totalTrades: "Trades gesamt",
    totalPnl: "Gesamt-PnL",
    average: "Durchschnitt",
    winRate: "Win Rate",
    behavioralRisk: "Verhaltensrisiko",
    behavioralRiskDescription:
      "Emotion, Vertrauen, Ausführung",

    strongSample: "Starke Stichprobe",
    growingSample: "Wachsende Stichprobe",
    earlySample: "Frühe Stichprobe",

    focusReduceBehavioralRisk:
      "Reduziere Verhaltensrisiko, bevor du Volumen erhöhst.",
    focusImproveRiskReward:
      "Verbessere Risiko/Ertrag-Balance und Verlustkontrolle.",
    focusReviewSetups:
      "Überprüfe Setups und Einstiegsqualität.",
    focusProtectEdge:
      "Schütze den aktuellen Edge mit konstanter Ausführung.",
  },
};

function getResultTone(value: number) {
  if (value > 0) {
    return "text-green-400";
  }

  if (value < 0) {
    return "text-red-400";
  }

  return "text-yellow-400";
}

function getRiskTone(value: number) {
  if (value >= 60) {
    return "text-red-400";
  }

  if (value >= 35) {
    return "text-yellow-400";
  }

  return "text-green-400";
}

function getScoreTone(value: number) {
  if (value >= 70) {
    return "text-green-400";
  }

  if (value >= 45) {
    return "text-yellow-400";
  }

  return "text-red-400";
}

export default async function ReportsPage({
  params,
  searchParams,
}: {
  params: Promise<{
    accountId: string;
  }>;
  searchParams: Promise<{
    member?: string;
    period?: string;
    ref?: string;
  }>;
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

  const [membership, currentUser, accountMembers] =
    await Promise.all([
      prisma.accountMember.findFirst({
        where: {
          userId: session.user.id,
          tradingAccountId: accountId,
        },
        include: {
          tradingAccount: true,
        },
      }),

      prisma.user.findUnique({
        where: {
          id: session.user.id,
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

  if (
    membership.role !== "MANAGER" &&
    !membership.canViewReports
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    membership.tradingAccount.status === "ARCHIVED"
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      lastSeenAt: new Date(),
      lastActivityAt: new Date(),
    },
  });

  const isSharedAccount = accountMembers.length > 1;

  const language = normalizeAppLanguage(
    currentUser?.appLanguage
  );

  const t = reportsLabels[language];

  const account = membership.tradingAccount;
  const currency = account.currency || "USD";

  const formatCurrency = (value: number) =>
    formatCurrencyByLanguage(
      value,
      currency,
      language
    );

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
      ...(selectedMemberId
        ? { createdById: selectedMemberId }
        : {}),
    },

    orderBy: {
      openDate: "desc",
    },
  });

  const dateRange = getPeriodRange(
    period,
    ref,
    currentUser?.timezone ?? undefined
  );

  const periodTrades = dateRange
    ? trades.filter(
        (trade) =>
          trade.openDate >= dateRange.gte &&
          trade.openDate < dateRange.lte
      )
    : trades;

  const periodSuffix = getPeriodSuffix(
    period,
    ref,
    language
  );

  const totalTrades = periodTrades.length;

  const wins = periodTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const losses = periodTrades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const breakEven = periodTrades.filter(
    (trade) => trade.outcome === "be"
  ).length;

  const closedTrades =
    wins + losses + breakEven;

  const totalPnl = periodTrades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const winningTrades = periodTrades.filter(
    (trade) => trade.outcome === "win"
  );

  const losingTrades = periodTrades.filter(
    (trade) => trade.outcome === "loss"
  );

  const grossProfit = winningTrades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const grossLoss = losingTrades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const winRate =
    closedTrades > 0
      ? Math.round((wins / closedTrades) * 100)
      : 0;

  const averageWin =
    wins > 0 ? grossProfit / wins : 0;

  const averageLoss =
    losses > 0 ? grossLoss / losses : 0;

  const averageResult =
    closedTrades > 0
      ? totalPnl / closedTrades
      : 0;

  const profitFactor =
    Math.abs(grossLoss) > 0
      ? grossProfit / Math.abs(grossLoss)
      : grossProfit > 0
        ? grossProfit
        : 0;

  const emotionalTrades = periodTrades.filter(
    (trade) =>
      trade.emotionalState &&
      trade.emotionalState.length > 0
  ).length;

  const lowConfidenceTrades = periodTrades.filter(
    (trade) =>
      (trade.confidence || 0) > 0 &&
      (trade.confidence || 0) <= 4
  ).length;

  const weakExecutionTrades = periodTrades.filter(
    (trade) =>
      (trade.executionRating || 0) > 0 &&
      (trade.executionRating || 0) <= 4
  ).length;

  const disciplineScore =
    closedTrades > 0
      ? Math.max(
        0,
        Math.min(
          100,
          Math.round(
            winRate +
            (totalPnl > 0 ? 10 : -10)
          )
        )
      )
      : 0;

  const behavioralRisk =
    totalTrades > 0
      ? Math.min(
        100,
        Math.round(
          ((emotionalTrades +
            lowConfidenceTrades +
            weakExecutionTrades) /
            totalTrades) *
          100
        )
      )
      : 0;

  const reportReadiness =
    totalTrades >= 30
      ? t.strongSample
      : totalTrades >= 10
        ? t.growingSample
        : t.earlySample;

  const hasEnoughData = totalTrades >= MIN_TRADES_FOR_VERDICT;

  const primaryFocus =
    behavioralRisk >= 50
      ? t.focusReduceBehavioralRisk
      : profitFactor < 1
        ? t.focusImproveRiskReward
        : winRate < 45
          ? t.focusReviewSetups
          : t.focusProtectEdge;

  const members = isSharedAccount
    ? accountMembers.map((m) => ({
        id: m.userId,
        name: m.user.name ?? null,
        username: m.user.username,
        image: m.user.image ?? null,
      }))
    : undefined;

  // Shared with the on-screen hero's document-meta strip below, so the
  // web view and the printed cover page agree on who this was prepared
  // for - a "referto" states this once, not per-chapter.
  const traderName =
    currentUser?.name ??
    session.user.name ??
    "Trader";

  const rt = getReportLabels(language);

  const generatedDate = new Date().toLocaleDateString(language, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className={pageDensity.reports.page}>
      <PDFCompactReport
        appLanguage={language}
        currency={currency}
        userName={traderName}
        totalTrades={totalTrades}
        totalPnl={totalPnl}
        winRate={winRate}
        wins={wins}
        losses={losses}
        averageWin={averageWin}
        averageLoss={averageLoss}
        disciplineScore={disciplineScore}
        behavioralRisk={behavioralRisk}
        emotionalTrades={emotionalTrades}
        weakExecutionTrades={weakExecutionTrades}
        primaryFocus={primaryFocus}
        hasEnoughData={hasEnoughData}
      />

      <div className={`web-report-content ${pageDensity.reports.webStack}`}>
        {/* Hero-dossier: the report's cover page. Deliberately not
            `variant="hero"` - no cut-corner facet, no pulsing edge. A
            tribunal document sits still; it doesn't have the same
            "alive" crystal signature every other page's hero uses. */}
        <div className="print-hidden">
          <Card className={`border-[0.5px] border-flash/[0.14] ${pageDensity.reports.panel} ${pageDensity.topbarSafeArea}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <SignatureEdge orientation="vertical" pulse={false} className="h-4" />
                <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">
                  {t.heroEyebrow} &middot; {account.name}
                </p>
              </div>

              <PrintReportButton appLanguage={language} />
            </div>

            <h1 className="mt-4 text-hero text-white">
              {t.heroTitle}
            </h1>
          </Card>
        </div>

        <div className="print:hidden">
          <ScopeBar
            members={members}
            selectedMemberId={selectedMemberId ?? undefined}
            currentPeriod={period}
            currentRef={ref}
            appLanguage={language}
            accountId={accountId}
          />
        </div>

        <div className="print-hidden">
          <ReportsNavigation appLanguage={language} />
        </div>

        <div className={`grid grid-cols-2 ${pageDensity.reports.grid} xl:grid-cols-4`}>
          <Card interactive className="p-5">
            <p className="text-sm text-muted">
              {t.totalTrades}{periodSuffix}
            </p>

            <h2 className="mt-4 text-metric-lg text-accent-bright">
              {totalTrades}
            </h2>

            <p className="mt-3 text-sm text-muted-faint">
              {reportReadiness}
            </p>
          </Card>

          <Card interactive className="p-5">
            <p className="text-sm text-muted">
              {t.totalPnl}{periodSuffix}
            </p>

            <h2
              className={`mt-4 text-metric-lg ${getResultTone(totalPnl)}`}
            >
              {formatCurrency(totalPnl)}
            </h2>

            <p className="mt-3 text-sm text-muted-faint">
              {t.average}{" "}
              {formatCurrency(averageResult)}
            </p>
          </Card>

          <Card interactive className="p-5">
            <p className="text-sm text-muted">
              {t.winRate}{periodSuffix}
            </p>

            <h2
              className={`mt-4 text-metric-lg ${getScoreTone(winRate)}`}
            >
              {winRate}%
            </h2>

            <p className="mt-3 text-sm text-muted-faint">
              {wins}W / {losses}L / {breakEven}BE
            </p>
          </Card>

          <Card interactive className="p-5">
            <p className="text-sm text-muted">
              {t.behavioralRisk}{periodSuffix}
            </p>

            <h2
              className={`mt-4 text-metric-lg ${getRiskTone(behavioralRisk)}`}
            >
              {behavioralRisk}%
            </h2>

            <p className="mt-3 text-sm text-muted-faint">
              {t.behavioralRiskDescription}
            </p>
          </Card>
        </div>

        <div id="executive">
          <ExecutiveSummaryCard
            appLanguage={language}
            currency={currency}
            totalPnl={totalPnl}
            winRate={winRate}
            disciplineScore={disciplineScore}
            behavioralRisk={behavioralRisk}
            hasEnoughData={hasEnoughData}
          />
        </div>

        <div id="performance">
          <PerformanceBreakdownCard
            appLanguage={language}
            currency={currency}
            wins={wins}
            losses={losses}
            breakEven={breakEven}
            averageWin={averageWin}
            averageLoss={averageLoss}
            profitFactor={profitFactor}
            hasEnoughData={hasEnoughData}
          />
        </div>

        <div id="risk">
          <BehavioralReportCard
            appLanguage={language}
            currency={currency}
            emotionalTrades={emotionalTrades}
            lowConfidenceTrades={lowConfidenceTrades}
            weakExecutionTrades={weakExecutionTrades}
            losses={losses}
            behavioralRisk={behavioralRisk}
            averageWin={averageWin}
            averageLoss={averageLoss}
            hasEnoughData={hasEnoughData}
          />
        </div>

        <div id="psychology">
          <PsychologyMindsetCard
            appLanguage={language}
            currency={currency}
            emotionalTrades={emotionalTrades}
            totalTrades={totalTrades}
            behavioralRisk={behavioralRisk}
            disciplineScore={disciplineScore}
            hasEnoughData={hasEnoughData}
          />
        </div>

        <div id="growth" className="print-hidden">
          <GrowthFocusCard
            appLanguage={language}
            currency={currency}
            primaryFocus={primaryFocus}
            hasEnoughData={hasEnoughData}
          />
        </div>

        <div className="print-hidden">
          <PDFReportFooter appLanguage={language} />
        </div>
      </div>
    </div>
  );
}
