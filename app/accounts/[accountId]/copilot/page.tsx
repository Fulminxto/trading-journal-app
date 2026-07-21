import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  canUseCopilot,
  getAccountMembershipWithAccount,
} from "@/lib/permissions";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  Database,
  FileText,
  Radar,
  ShieldAlert,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import CopilotConversationCard from "@/components/copilot/CopilotConversationCard";
import CopilotMemorySystem from "@/components/copilot/CopilotMemorySystem";
import { buildCopilotSystem } from "@/lib/copilot";
import { analyzeCopilotMemory } from "@/lib/copilot/copilot-memory";
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
    <Card className="p-5">
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

  const appLanguage = currentUser?.appLanguage;
  const isArchived = membership.tradingAccount.status === "ARCHIVED";
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

            <p className="mt-2 max-w-3xl text-sm text-muted">
              Review recorded account evidence, operating rules, and retained context without market predictions.
            </p>
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Evidence base"
          value={`${totalTrades} ${totalTrades === 1 ? "trade" : "trades"}`}
          description="Recorded trades available to the operating engine."
          icon={Database}
          tone={hasContext ? "neutral" : "warning"}
        />

        <MetricCard
          label="Decision readiness"
          value={
            hasContext
              ? getCopilotStatusLabel(riskLabel, t) || riskLabel
              : "Not ready"
          }
          description="Whether the current sample supports reliable operating conclusions."
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
          label="Active memories"
          value={String(copilotMemories.length)}
          description="Retained observations and account context."
          icon={FileText}
          tone={
            copilotMemories.length > 0
              ? "neutral"
              : "warning"
          }
        />

        <MetricCard
          label="Open signals"
          value={String(protectionSignals)}
          description="Current operational observations requiring attention."
          icon={ShieldAlert}
          tone={
            protectionSignals > 0
              ? "danger"
              : "neutral"
          }
        />
      </section>

      <section className="min-h-0">
        <CopilotConversationCard
          copilotMessages={translatedCopilotMessages}
          accountId={accountId}
          appLanguage={appLanguage}
          hasContext={hasContext}
          promptExamples={promptExamples}
          readOnly={isArchived}
        />
      </section>

      <section>
        <Card className="p-5 sm:p-6">
          <SectionHeader
            eyebrow="Operating control"
            title="Current operating state"
          />

          <div className="mt-6 grid items-start md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,0.9fr)]">
            <div className="pb-5 md:pr-5 lg:pb-0">
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
                  : `Complete at least ${Math.max(
                      MIN_TRADES_FOR_CONTEXT - totalTrades,
                      0
                    )} more completed ${MIN_TRADES_FOR_CONTEXT - totalTrades === 1 ? "trade" : "trades"} before evaluating recurring patterns.`
              }
            />

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-flash/[0.08] pt-4">
              <div>
                <p className="text-xs text-muted-faint">{t.common.discipline}</p>
                <p className="mt-1.5 text-lg font-black text-white">
                  {hasContext ? `${disciplineScore}%` : "Pending"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-faint">{t.common.tone}</p>
                <p className="mt-1.5 text-lg font-black text-accent-bright">
                  {getCopilotStatusLabel(adaptiveCoaching.tone, t) ||
                    adaptiveCoaching.tone}
                </p>
              </div>
            </div>
            </div>

            <div className="border-t border-flash/[0.08] py-5 md:border-l md:border-t-0 md:py-0 md:pl-5 lg:px-5">
              <SectionHeader
                eyebrow="Protection"
                title="Risk guard"
                description="Protection signals are rules, not discretionary advice."
              />

          <div className="mt-4 space-y-1.5">
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
              compact
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
              compact
            />
            <SignalRow
              label={t.components.aiRiskSupervisor.title}
              value={
                getCopilotStatusLabel(supervisorLevel, t) ||
                supervisorLevel
              }
              tone={getSeverityTone(supervisorLevel)}
              compact
            />
          </div>

          {(sessionLock.reviewRequired ||
            riskEscalation.protectionRequired) && (
            <div className="mt-4 border-t border-flash/[0.08] pt-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-warning">
                Required review
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                {translatedSessionLockReason ||
                  translatedRiskEscalationMessage}
              </p>
            </div>
          )}
            </div>

            <div className="border-t border-flash/[0.08] pt-5 md:col-span-2 md:mt-5 lg:col-span-1 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <SectionHeader
              eyebrow={t.components.dailyFeed.eyebrow}
              title="Intelligence queue"
              description="What the engine is waiting to evaluate from recorded evidence."
            />

            <div className="mt-4 space-y-2">
              {!hasContext || translatedIntelligenceFeed.length === 0 ? (
                <div className="border-l-2 border-flash/[0.12] pl-3">
                  <p className="text-sm font-medium text-white">Awaiting evidence</p>
                  <p className="mt-1 text-caption leading-5 text-muted">
                    More completed trades are required before operating observations can be evaluated.
                  </p>
                </div>
              ) : (
                translatedIntelligenceFeed.slice(0, 5).map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 border-b border-flash/[0.08] py-3 first:pt-0 last:border-0 last:pb-0"
                  >
                    <Sparkles
                      className="mt-0.5 shrink-0 text-accent-bright"
                      size={15}
                      aria-hidden="true"
                    />
                    <p className="text-caption leading-5 text-gray-300">{item}</p>
                  </div>
                ))
              )}
            </div>
            </div>
          </div>
        </Card>
      </section>

      <CopilotMemorySystem
        showReliabilityNote={!hasContext}
        reviewMemories={translatedReviewNotes.map((note) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          statusLabel:
            getCopilotStatusLabel(note.severity, t) || note.severity,
          tone: getSeverityTone(note.severity),
        }))}
        operationalMemories={translatedCopilotMemories.map((memory) => ({
          id: memory.id,
          memoryType: memory.memoryType,
          title: memory.title,
          description: memory.description,
          score: memory.score,
          statusLabel:
            getCopilotStatusLabel(memory.severity, t) || memory.severity,
          tone: getSeverityTone(memory.severity),
        }))}
      />

      <section>
        <Card className="p-5 sm:p-6">
          <SectionHeader
            eyebrow="Account review"
            title="Behavioral intelligence and latest review"
          />

          <div className="mt-6 grid items-start lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="pb-5 lg:pb-0 lg:pr-6">
              <SectionHeader
                eyebrow={t.components.patternMemory.eyebrow}
                title={t.components.patternMemory.title}
                description="Patterns are stored only when the server-side analysis finds recurrence. No pattern means no conclusion."
              />

              <div className="mt-5 space-y-3">
                {translatedCopilotPatterns.length === 0 ? (
                  <EmptyState
                    title={t.components.patternMemory.empty}
                    description="Copilot has not found a recurring operating pattern yet."
                  />
                ) : (
                  translatedCopilotPatterns.map((pattern) => (
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
            </div>

            <div className="border-t border-flash/[0.08] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
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

              <div className="mt-5 grid gap-1.5">
                <SignalRow
                  label={t.common.execution}
                  value={
                    latestTrade?.executionRating
                      ? `${latestTrade.executionRating}/10`
                      : "Not measured"
                  }
                  tone="neutral"
                  compact
                />
                <SignalRow
                  label={t.common.confidence}
                  value={
                    latestTrade?.confidence
                      ? `${latestTrade.confidence}/10`
                      : "Not measured"
                  }
                  tone="neutral"
                  compact
                />
                <SignalRow
                  label={t.components.recoveryIntelligence.recoveryScore}
                  value={hasContext ? `${recoveryScore}%` : "Pending"}
                  tone={hasContext ? getSeverityTone(recoveryLabel) : "neutral"}
                  compact
                />
              </div>
            </div>
          </div>
        </Card>
      </section>

    </div>
  );
}

function SignalRow({
  label,
  value,
  tone,
  compact = false,
}: {
  label: string;
  value: string;
  tone: StatusTone;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex items-center justify-between gap-4 border-b border-flash/[0.08] py-2.5 first:pt-0 last:border-0 last:pb-0">
        <p className="text-sm text-muted">{label}</p>
        <StatusPill tone={tone}>{value}</StatusPill>
      </div>
    );
  }

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
