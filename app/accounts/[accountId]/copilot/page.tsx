import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  canUseCopilot,
  getAccountMembershipWithAccount,
} from "@/lib/permissions";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  BrainCircuit,
  Database,
  FileText,
  MessageSquareText,
  Radar,
  Route,
  ShieldAlert,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import CopilotConversationCard from "@/components/copilot/CopilotConversationCard";
import { buildCopilotSystem } from "@/lib/copilot";
import { analyzeCopilotMemory } from "@/lib/copilot/copilot-memory";
import { generateAnalysis } from "./actions";
import {
  getArrayCount,
  getCopilotLabels,
  getCopilotStatusLabel,
} from "@/components/copilot/CopilotI18n";
import { pageDensity } from "@/lib/page-density";
import { renderCopilotText } from "@/components/copilot/CopilotTextRenderer";

const MIN_TRADES_FOR_CONTEXT = 5;

type StatusTone = "neutral" | "good" | "warning" | "danger";

type MetricCardProps = {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone?: StatusTone;
};

type MemoryItem = {
  id: string;
  memoryType: string;
  title: string;
  description: string;
  severity: string;
  score: number;
};

type PatternItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: string;
  occurrences: number;
};

type ReviewNote = {
  id: string;
  title: string;
  content: string;
  severity: string;
};

function getRiskLabel(behavioralRisk: number) {
  if (behavioralRisk >= 50) {
    return "High";
  }

  if (behavioralRisk >= 25) {
    return "Medium";
  }

  return "Low";
}

function getToneClasses(tone: StatusTone) {
  if (tone === "danger") {
    return {
      text: "text-negative",
      border: "border-negative/25",
      bg: "bg-negative/[0.06]",
    };
  }

  if (tone === "warning") {
    return {
      text: "text-warning",
      border: "border-warning/25",
      bg: "bg-warning/[0.06]",
    };
  }

  if (tone === "good") {
    return {
      text: "text-green-400",
      border: "border-green-400/25",
      bg: "bg-green-400/[0.06]",
    };
  }

  return {
    text: "text-accent-bright",
    border: "border-accent-bright/20",
    bg: "bg-accent-bright/[0.06]",
  };
}

function getSeverityTone(severity: string): StatusTone {
  if (
    severity === "critical" ||
    severity === "high" ||
    severity === "Protection" ||
    severity === "Critical"
  ) {
    return "danger";
  }

  if (
    severity === "medium" ||
    severity === "Moderate" ||
    severity === "Cooldown" ||
    severity === "Monitor"
  ) {
    return "warning";
  }

  return "good";
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "neutral",
}: MetricCardProps) {
  const toneClasses = getToneClasses(tone);

  return (
    <Card interactive className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
            {label}
          </p>
          <h2 className={`mt-3 text-metric-lg ${toneClasses.text}`}>
            {value}
          </h2>
        </div>

        <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted transition-colors duration-fast group-hover:text-accent-bright">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        {description}
      </p>
    </Card>
  );
}

function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: StatusTone;
}) {
  const toneClasses = getToneClasses(tone);

  return (
    <span
      className={`inline-flex w-fit rounded-pill border-[0.5px] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] ${toneClasses.border} ${toneClasses.bg} ${toneClasses.text}`}
    >
      {children}
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-bright">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-section text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
          {description}
        </p>
      )}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card variant="inner" className="p-5">
      <p className="text-sm font-semibold text-white">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">
        {description}
      </p>
    </Card>
  );
}

export default async function CopilotPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

  const [membership, currentUser] = await Promise.all([
    getAccountMembershipWithAccount(
      session.user.id,
      accountId
    ),
    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        appLanguage: true,
      },
    }),
  ]);

  if (!membership) {
    redirect("/accounts");
  }

  if (!canUseCopilot(membership)) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (membership.tradingAccount.status === "ARCHIVED") {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  const appLanguage = currentUser?.appLanguage;
  const t = getCopilotLabels(appLanguage);

  const [trades, copilotMessages, memorySnapshot] =
    await Promise.all([
      prisma.trade.findMany({
        where: {
          tradingAccountId: accountId,
        },
        orderBy: {
          openDate: "desc",
        },
      }),
      prisma.copilotMessage.findMany({
        where: {
          tradingAccountId: accountId,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      analyzeCopilotMemory(accountId),
    ]);

  const copilotPatterns = memorySnapshot.patterns;
  const copilotMemories = memorySnapshot.memories;
  const reviewNotes = memorySnapshot.reviewNotes;

  const criticalPatterns = copilotPatterns.filter(
    (pattern) => pattern.severity === "critical"
  );

  const highPatterns = copilotPatterns.filter(
    (pattern) => pattern.severity === "high"
  );

  const copilotSystem = buildCopilotSystem({
    trades,
    copilotMemories,
  });

  const {
    intelligenceFeed,
    adaptiveCoaching,
    riskEscalation,
    sessionLock,
    recoveryScore,
    recoveryLabel,
  } = copilotSystem;

  const {
    totalTrades,
    behavioralRisk,
    disciplineScore,
  } = copilotSystem.analytics;

  const { latestTrade, latestTradeReview } =
    copilotSystem.review;

  const { riskSignals, supervisorLevel } =
    copilotSystem.stability;

  const hasContext =
    totalTrades >= MIN_TRADES_FOR_CONTEXT;
  const riskLabel = getRiskLabel(behavioralRisk);
  const riskSignalsCount = getArrayCount(riskSignals);
  const protectionSignals =
    criticalPatterns.length +
    highPatterns.length +
    riskSignalsCount;

  const translatedIntelligenceFeed = intelligenceFeed.map((item) =>
    renderCopilotText(item, appLanguage)
  );

  const translatedAdaptiveCoachingMessage =
    renderCopilotText(
      adaptiveCoaching.message,
      appLanguage
    );

  const translatedRiskEscalationMessage =
    renderCopilotText(
      riskEscalation.message,
      appLanguage
    );

  const translatedSessionLockReason =
    renderCopilotText(
      sessionLock.lockReason,
      appLanguage
    );

  const translatedLatestTradeReview =
    renderCopilotText(
      latestTradeReview,
      appLanguage
    );

  const translatedReviewNotes: ReviewNote[] = reviewNotes.map((note) => ({
    ...note,
    title: renderCopilotText(note.title, appLanguage),
    content: renderCopilotText(note.content, appLanguage),
  }));

  const translatedCopilotMemories: MemoryItem[] = copilotMemories.map((memory) => ({
    ...memory,
    memoryType: renderCopilotText(memory.memoryType, appLanguage),
    title: renderCopilotText(memory.title, appLanguage),
    description: renderCopilotText(memory.description, appLanguage),
  }));

  const translatedCopilotPatterns: PatternItem[] = copilotPatterns.map((pattern) => ({
    ...pattern,
    type: renderCopilotText(pattern.type, appLanguage),
    title: renderCopilotText(pattern.title, appLanguage),
    description: renderCopilotText(pattern.description, appLanguage),
  }));

  const translatedCopilotMessages = copilotMessages.map((message) => ({
    ...message,
    content: renderCopilotText(message.content, appLanguage),
  }));

  const systemState = !hasContext
    ? "Data warming up"
    : protectionSignals > 0
      ? "Protection watch"
      : "Operational monitor";

  const systemTone: StatusTone = !hasContext
    ? "warning"
    : protectionSignals > 0
      ? "danger"
      : "neutral";

  const contextDescription = !hasContext
    ? "Copilot is using deterministic account rules, but the sample is still small. It will not produce strategic conclusions until more trades are logged."
    : "Copilot is running server-side rules, pattern memory, review notes, and structured prompts from your account data.";

  const promptExamples = [
    "What should I review before the next session?",
    "Where is my execution quality deteriorating?",
    "Which recurring behavior should I protect against?",
    "What is the safest next action after a loss streak?",
  ];

  return (
    <div className={pageDensity.copilot.page}>
      <Card
        variant="hero"
        className={`${pageDensity.copilot.hero} ${pageDensity.topbarSafeArea}`}
      >
        <div className={`grid ${pageDensity.copilot.sectionGrid} xl:grid-cols-[1fr_360px] xl:items-end`}>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <SignatureEdge orientation="vertical" className="h-4" />
              <p className="text-sm text-muted">
                VOLTIS Copilot
              </p>
              <StatusPill tone={systemTone}>
                {systemState}
              </StatusPill>
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-faint">
              Intelligence layer
            </p>

            <h1 className="mt-3 text-hero text-white">
              Command Center
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-muted">
              Copilot reads account data, recurring patterns, review notes,
              and rule-based safety signals. It is an operating layer, not a
              black-box chatbot, and every visible conclusion is tied to data
              the account already contains.
            </p>
          </div>

          <Card variant="inner" className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
                  Engine status
                </p>
                <p className="mt-3 text-2xl font-black text-accent-bright">
                  Rule based
                </p>
              </div>
              <BrainCircuit className="text-accent-bright" size={24} />
            </div>

            <p className="mt-4 text-sm leading-6 text-muted">
              {contextDescription}
            </p>
          </Card>
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={t.common.totalTrades}
          value={String(totalTrades)}
          description={
            hasContext
              ? "Enough trade history is available for structured account signals."
              : "Small sample. Copilot will keep conclusions conservative."
          }
          icon={Database}
          tone={hasContext ? "neutral" : "warning"}
        />

        <MetricCard
          label={t.common.behavioralRisk}
          value={
            hasContext
              ? getCopilotStatusLabel(riskLabel, t) || riskLabel
              : "Not ready"
          }
          description="Behavioral status is derived from weak execution, low confidence, and emotional trade markers."
          icon={Radar}
          tone={
            !hasContext
              ? "warning"
              : behavioralRisk >= 50
                ? "danger"
                : behavioralRisk >= 25
                  ? "warning"
                  : "good"
          }
        />

        <MetricCard
          label={t.common.activeMemories}
          value={String(copilotMemories.length)}
          description="Persistent memory contains recurring account patterns created by server-side analysis."
          icon={FileText}
          tone={
            copilotMemories.length > 0
              ? "neutral"
              : "warning"
          }
        />

        <MetricCard
          label={t.common.signals}
          value={String(protectionSignals)}
          description="Protection signals include critical/high patterns and current risk supervision triggers."
          icon={ShieldAlert}
          tone={
            protectionSignals > 0
              ? "danger"
              : "good"
          }
        />
      </section>

      <section className={`grid ${pageDensity.copilot.sectionGrid} xl:grid-cols-[1.15fr_0.85fr]`}>
        <Card className={pageDensity.copilot.panel}>
          <SectionHeader
            eyebrow="Structured prompts"
            title="Ask for operating decisions, not market predictions"
            description="These prompts route the assistant toward review, risk, discipline, and process. They avoid unsupported forecasting and keep the system inside account data."
          />

          <div className={`mt-6 grid ${pageDensity.copilot.promptGrid} md:grid-cols-2`}>
            {promptExamples.map((prompt) => (
              <Card key={prompt} variant="inner" className="p-4">
                <div className="flex items-start gap-3">
                  <MessageSquareText
                    className="mt-0.5 text-accent-bright"
                    size={17}
                  />
                  <p className="text-sm leading-6 text-gray-300">
                    {prompt}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Card className={pageDensity.copilot.panel}>
          <SectionHeader
            eyebrow="Current directive"
            title={
              hasContext
                ? getCopilotStatusLabel(adaptiveCoaching.mode, t) ||
                  adaptiveCoaching.mode
                : "Keep logging data"
            }
            description={
              hasContext
                ? translatedAdaptiveCoachingMessage
                : "Copilot needs more completed trades before it can separate noise from recurring behavior."
            }
          />

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Card variant="inner" className="p-4">
              <p className="text-xs text-muted-faint">
                {t.common.discipline}
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {hasContext ? `${disciplineScore}%` : "Pending"}
              </p>
            </Card>
            <Card variant="inner" className="p-4">
              <p className="text-xs text-muted-faint">
                {t.common.tone}
              </p>
              <p className="mt-2 text-2xl font-black text-accent-bright">
                {getCopilotStatusLabel(adaptiveCoaching.tone, t) ||
                  adaptiveCoaching.tone}
              </p>
            </Card>
          </div>
        </Card>
      </section>

      <section className={`grid ${pageDensity.copilot.sectionGrid} xl:grid-cols-3`}>
        <Card className={`${pageDensity.copilot.panel} xl:col-span-2`}>
          <SectionHeader
            eyebrow={t.components.dailyFeed.eyebrow}
            title="Intelligence queue"
            description="A compact list of server-side observations. When data is limited, the queue stays quiet instead of inventing conclusions."
          />

          <div className="mt-6 space-y-3">
            {!hasContext || translatedIntelligenceFeed.length === 0 ? (
              <EmptyState
                title={t.components.dailyFeed.empty}
                description="Add more completed trades to activate meaningful operating signals."
              />
            ) : (
              translatedIntelligenceFeed.slice(0, 5).map((item) => (
                <Card key={item} variant="inner" className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles
                      className="mt-0.5 text-accent-bright"
                      size={17}
                    />
                    <p className="text-sm leading-6 text-gray-300">
                      {item}
                    </p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>

        <Card className={pageDensity.copilot.panel}>
          <SectionHeader
            eyebrow="Protection"
            title="Risk guard"
            description="Protection signals are rules, not discretionary advice."
          />

          <div className="mt-6 space-y-3">
            <SignalRow
              label={t.components.sessionLock.title}
              value={
                sessionLock.sessionLocked
                  ? t.common.locked
                  : sessionLock.reviewRequired
                    ? t.common.review
                    : t.common.open
              }
              tone={
                sessionLock.sessionLocked
                  ? "danger"
                  : sessionLock.reviewRequired
                    ? "warning"
                    : "good"
              }
            />
            <SignalRow
              label={t.components.riskEscalation.title}
              value={
                getCopilotStatusLabel(
                  riskEscalation.escalationLevel,
                  t
                ) || riskEscalation.escalationLevel
              }
              tone={getSeverityTone(riskEscalation.escalationLevel)}
            />
            <SignalRow
              label={t.components.aiRiskSupervisor.title}
              value={
                getCopilotStatusLabel(supervisorLevel, t) ||
                supervisorLevel
              }
              tone={getSeverityTone(supervisorLevel)}
            />
          </div>

          {(sessionLock.reviewRequired ||
            riskEscalation.protectionRequired) && (
            <Card variant="inner" className="mt-5 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-warning">
                Required review
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                {translatedSessionLockReason ||
                  translatedRiskEscalationMessage}
              </p>
            </Card>
          )}
        </Card>
      </section>

      <section className={`grid ${pageDensity.copilot.sectionGrid} xl:grid-cols-2`}>
        <Card className={pageDensity.copilot.panel}>
          <SectionHeader
            eyebrow={t.page.reviewTimeline}
            title={t.page.persistentReviewMemory}
            description="Review notes are generated from explicit analysis actions and recent account events."
          />

          <div className="mt-6 space-y-3">
            {translatedReviewNotes.length === 0 ? (
              <EmptyState
                title={t.page.noReviewNotes}
                description="No review note has been generated yet."
              />
            ) : (
              translatedReviewNotes.slice(0, 4).map((note) => (
                <Card key={note.id} variant="inner" className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
                        {note.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-300">
                        {note.content}
                      </p>
                    </div>
                    <StatusPill tone={getSeverityTone(note.severity)}>
                      {getCopilotStatusLabel(note.severity, t)}
                    </StatusPill>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>

        <Card className={pageDensity.copilot.panel}>
          <SectionHeader
            eyebrow={t.page.memorySystem}
            title={t.page.activeOperationalMemory}
            description={t.page.memoryDescription}
          />

          <div className="mt-6 space-y-3">
            {translatedCopilotMemories.length === 0 ? (
              <EmptyState
                title={t.page.noMemories}
                description="Memory activates after recurring patterns are detected in account history."
              />
            ) : (
              translatedCopilotMemories.slice(0, 4).map((memory) => (
                <MemoryRow
                  key={memory.id}
                  memory={memory}
                  statusLabel={
                    getCopilotStatusLabel(memory.severity, t) ||
                    memory.severity
                  }
                />
              ))
            )}
          </div>
        </Card>
      </section>

      <section className={`grid ${pageDensity.copilot.sectionGrid} xl:grid-cols-3`}>
        <Card className={`${pageDensity.copilot.panel} xl:col-span-2`}>
          <SectionHeader
            eyebrow={t.components.patternMemory.eyebrow}
            title={t.components.patternMemory.title}
            description="Patterns are stored only when the server-side analysis finds recurrence. No pattern means no conclusion."
          />

          <div className="mt-6 space-y-3">
            {translatedCopilotPatterns.length === 0 ? (
              <EmptyState
                title={t.components.patternMemory.empty}
                description="Copilot has not found a recurring operating pattern yet."
              />
            ) : (
              translatedCopilotPatterns.slice(0, 5).map((pattern) => (
                <PatternRow
                  key={pattern.id}
                  pattern={pattern}
                  statusLabel={
                    getCopilotStatusLabel(pattern.severity, t) ||
                    pattern.severity
                  }
                  occurrencesLabel={t.common.occurrences}
                />
              ))
            )}
          </div>
        </Card>

        <Card className={pageDensity.copilot.panel}>
          <SectionHeader
            eyebrow="Latest review"
            title={
              latestTrade
                ? latestTrade.symbol
                : t.components.tradeReview.empty
            }
            description={
              latestTrade && hasContext
                ? translatedLatestTradeReview
                : "Latest-trade review appears only when there is enough account context."
            }
          />

          <div className="mt-6 grid gap-3">
            <SignalRow
              label={t.common.execution}
              value={
                latestTrade?.executionRating
                  ? `${latestTrade.executionRating}/10`
                  : "Not measured"
              }
              tone="neutral"
            />
            <SignalRow
              label={t.common.confidence}
              value={
                latestTrade?.confidence
                  ? `${latestTrade.confidence}/10`
                  : "Not measured"
              }
              tone="neutral"
            />
            <SignalRow
              label={t.components.recoveryIntelligence.recoveryScore}
              value={
                hasContext
                  ? `${recoveryScore}%`
                  : "Pending"
              }
              tone={getSeverityTone(recoveryLabel)}
            />
          </div>
        </Card>
      </section>

      <AnalyzeButton
        accountId={accountId}
        appLanguage={appLanguage}
        disabled={!hasContext}
      />

      <CopilotConversationCard
        copilotMessages={translatedCopilotMessages}
        accountId={accountId}
        appLanguage={appLanguage}
        hasContext={hasContext}
      />
    </div>
  );
}

function SignalRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: StatusTone;
}) {
  return (
    <Card variant="inner" className="p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {label}
        </p>
        <StatusPill tone={tone}>{value}</StatusPill>
      </div>
    </Card>
  );
}

function MemoryRow({
  memory,
  statusLabel,
}: {
  memory: MemoryItem;
  statusLabel: string;
}) {
  return (
    <Card variant="inner" className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
            {memory.memoryType}
          </p>
          <h3 className="mt-2 text-subsection text-white">
            {memory.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-300">
            {memory.description}
          </p>
        </div>
        <StatusPill tone={getSeverityTone(memory.severity)}>
          {statusLabel}
        </StatusPill>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-inner border-[0.5px] border-flash/[0.08] bg-bg-base/40 px-4 py-3">
        <span className="text-xs uppercase tracking-[0.16em] text-muted-faint">
          Score
        </span>
        <span className="text-sm font-black text-white">
          {memory.score}
        </span>
      </div>
    </Card>
  );
}

function PatternRow({
  pattern,
  statusLabel,
  occurrencesLabel,
}: {
  pattern: PatternItem;
  statusLabel: string;
  occurrencesLabel: string;
}) {
  return (
    <Card variant="inner" className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
            {pattern.type}
          </p>
          <h3 className="mt-2 text-subsection text-white">
            {pattern.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-300">
            {pattern.description}
          </p>
        </div>
        <StatusPill tone={getSeverityTone(pattern.severity)}>
          {statusLabel}
        </StatusPill>
      </div>

      <p className="mt-4 text-xs text-muted-faint">
        {occurrencesLabel}: {pattern.occurrences}
      </p>
    </Card>
  );
}

const ANALYZE_LABELS: Record<string, string> = {
  it: "Genera analisi rule-based",
  en: "Generate rule-based analysis",
  uk: "Generate rule-based analysis",
  ru: "Generate rule-based analysis",
  es: "Generar análisis con reglas",
  fr: "Générer une analyse par règles",
  de: "Regelbasierte Analyse erstellen",
};

function AnalyzeButton({
  accountId,
  appLanguage,
  disabled,
}: {
  accountId: string;
  appLanguage?: string | null;
  disabled: boolean;
}) {
  const label =
    ANALYZE_LABELS[appLanguage ?? "en"] ??
    ANALYZE_LABELS.en;

  return (
    <Card className="p-5">
      <form action={generateAnalysis}>
        <input
          type="hidden"
          name="tradingAccountId"
          value={accountId}
        />

        <button
          type="submit"
          disabled={disabled}
          className="group flex w-full flex-col items-start rounded-inner border-[0.5px] border-accent-bright/25 bg-accent-bright/[0.06] px-5 py-4 text-left transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_22px_rgba(52,168,255,0.12)] disabled:cursor-not-allowed disabled:border-flash/[0.08] disabled:bg-surface-2 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-accent-bright group-disabled:text-muted-faint">
            <Route size={15} />
            VOLTIS analyst
          </span>
          <span className="mt-2 text-lg font-black text-white">
            {label}
          </span>
          <span className="mt-2 text-sm leading-6 text-muted">
            {disabled
              ? "More completed trades are required before generating an account analysis."
              : "Creates a deterministic account analysis from trades, review metrics, memory, and protection rules."}
          </span>
        </button>
      </form>
    </Card>
  );
}
