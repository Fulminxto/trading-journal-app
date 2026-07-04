import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Gauge,
  Save,
  ShieldCheck,
  Target,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getLocaleFromLanguage,
  normalizeAppLanguage,
} from "@/lib/i18n";
import ScopeBar from "@/components/ScopeBar";
import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";
import {
  parseScopeParams,
  getPeriodRange,
  getPeriodSuffix,
} from "@/lib/scope";
import { pageDensity } from "@/lib/page-density";

import { createTradingSession } from "./actions";
import { getSessionsCopy } from "@/components/sessions/SessionI18n";

type MetricCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  tone?: string;
};

type FieldBlockProps = {
  label: string;
  value: string | null;
  warning?: boolean;
};

const inputClass =
  "w-full rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 px-4 py-3 text-sm text-white outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10";

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "text-white",
}: MetricCardProps) {
  return (
    <Card interactive className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
            {title}
          </p>
          <h2 className={`mt-3 text-metric-lg ${tone}`}>
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

function FieldBlock({
  label,
  value,
  warning = false,
}: FieldBlockProps) {
  if (!value) {
    return null;
  }

  return (
    <Card
      variant="inner"
      className={
        warning
          ? "border-negative/20 bg-negative/[0.04] p-4"
          : "p-4"
      }
    >
      <p
        className={`text-xs font-medium uppercase tracking-[0.16em] ${
          warning ? "text-negative" : "text-muted-faint"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">
        {value}
      </p>
    </Card>
  );
}

function getScoreTone(score: number) {
  if (score >= 8) {
    return "text-green-400";
  }

  if (score <= 4) {
    return "text-red-400";
  }

  return "text-yellow-300";
}

function getReadinessTone(rate: number) {
  if (rate >= 80) {
    return "text-green-400";
  }

  if (rate >= 50) {
    return "text-yellow-300";
  }

  return "text-red-400";
}

function getEmotionTone(value?: string | null) {
  if (!value) {
    return "border-flash/[0.1] text-muted";
  }

  if (
    value === "STRESSED" ||
    value === "IMPULSIVE"
  ) {
    return "border-negative/25 bg-negative/[0.06] text-negative";
  }

  if (value === "TIRED") {
    return "border-warning/25 bg-warning/[0.06] text-warning";
  }

  return "border-accent-bright/20 bg-accent-bright/[0.06] text-accent-bright";
}

function formatPercent(
  value: number,
  language?: string | null
) {
  return (
    new Intl.NumberFormat(
      getLocaleFromLanguage(language),
      {
        maximumFractionDigits: 0,
      }
    ).format(value) + "%"
  );
}

function formatDate(
  date: Date,
  language?: string | null
) {
  return new Intl.DateTimeFormat(
    getLocaleFromLanguage(language),
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(date));
}

export default async function SessionsPage({
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

  if (
    membership.role !== "MANAGER" &&
    membership.role !== "MEMBER"
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    membership.tradingAccount.status === "ARCHIVED"
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  const [currentUser, accountMembers] =
    await Promise.all([
      prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          lastSeenAt: new Date(),
          lastActivityAt: new Date(),
        },
        select: {
          appLanguage: true,
          timezone: true,
        },
      }),
      prisma.accountMember.findMany({
        where: { tradingAccountId: accountId },
        include: { user: true },
      }),
    ]);

  const isSharedAccount = accountMembers.length > 1;

  const appLanguage = normalizeAppLanguage(
    currentUser.appLanguage
  );

  const t = getSessionsCopy(appLanguage);

  const canCreateSessions =
    membership.role === "MANAGER" ||
    membership.role === "MEMBER";

  const sessions =
    await prisma.tradingSession.findMany({
      where: {
        tradingAccountId: accountId,
        ...(selectedMemberId
          ? { createdById: selectedMemberId }
          : {}),
      },

      orderBy: {
        date: "desc",
      },
    });

  const dateRange = getPeriodRange(
    period,
    ref,
    currentUser.timezone ?? undefined
  );

  const periodSessions = dateRange
    ? sessions.filter(
        (tradingSession) =>
          tradingSession.date >= dateRange.gte &&
          tradingSession.date < dateRange.lte
      )
    : sessions;

  const periodSuffix = getPeriodSuffix(
    period,
    ref,
    appLanguage
  );

  const scoredSessions = periodSessions.filter(
    (tradingSession) =>
      tradingSession.finalScore !== null &&
      tradingSession.finalScore !== undefined
  );

  const averageScore =
    scoredSessions.length > 0
      ? Math.round(
          scoredSessions.reduce(
            (acc, tradingSession) =>
              acc +
              (tradingSession.finalScore || 0),
            0
          ) / scoredSessions.length
        )
      : null;

  const focusedSessions = periodSessions.filter(
    (tradingSession) =>
      tradingSession.focus &&
      tradingSession.focus.length > 10
  ).length;

  const reviewedSessions = periodSessions.filter(
    (tradingSession) =>
      tradingSession.sessionReview &&
      tradingSession.sessionReview.length > 10
  ).length;

  const highScoreSessions = periodSessions.filter(
    (tradingSession) =>
      (tradingSession.finalScore || 0) >= 8
  ).length;

  const lowScoreSessions = periodSessions.filter(
    (tradingSession) =>
      tradingSession.finalScore !== null &&
      tradingSession.finalScore !== undefined &&
      (tradingSession.finalScore || 0) <= 4
  ).length;

  const pendingReviews =
    periodSessions.length - reviewedSessions;

  const reviewCompletionRate =
    periodSessions.length > 0
      ? (reviewedSessions / periodSessions.length) * 100
      : null;

  const highScoreRate =
    scoredSessions.length > 0
      ? (highScoreSessions / scoredSessions.length) * 100
      : null;

  const planningRate =
    periodSessions.length > 0
      ? (focusedSessions / periodSessions.length) * 100
      : null;

  const lastSession = periodSessions[0];

  const readinessLabel =
    periodSessions.length === 0
      ? t.page.emptySessions
      : pendingReviews > 0 || lowScoreSessions > 0
        ? t.common.warningsActive
        : t.common.stable;

  const readinessTone =
    pendingReviews > 0 || lowScoreSessions > 0
      ? "text-warning"
      : "text-accent-bright";

  const noDataLabel = "Not measured";

  const members = isSharedAccount
    ? accountMembers.map((m) => ({
        id: m.userId,
        name: m.user.name ?? null,
        username: m.user.username,
        image: m.user.image ?? null,
      }))
    : undefined;

  return (
    <div className="space-y-6">
      <Card
        variant="hero"
        className={`p-6 sm:p-10 ${pageDensity.topbarSafeArea}`}
      >
        <div className="grid gap-8 xl:grid-cols-[1fr_360px] xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <SignatureEdge orientation="vertical" className="h-4" />
              <p className="text-sm text-muted">
                {t.page.workspaceBadge}
              </p>

              <span className="rounded-pill border-[0.5px] border-flash/[0.12] px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-muted">
                {membership.tradingAccount.name}
              </span>
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-faint">
              {t.page.titleSmall}
            </p>

            <h1 className="mt-3 text-hero text-white">
              {t.page.title}
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-muted">
              {t.page.description}
            </p>
          </div>

          <Card variant="inner" className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
                  Operating room
                </p>
                <p className={`mt-3 text-2xl font-black ${readinessTone}`}>
                  {readinessLabel}
                </p>
              </div>
              <ShieldCheck className="text-accent-bright" size={24} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-bg-base/40 p-3">
                <p className="text-xs text-muted-faint">
                  {t.page.totalSessions}
                </p>
                <p className="mt-1 text-2xl font-black text-accent-bright">
                  {periodSessions.length}
                </p>
              </div>
              <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-bg-base/40 p-3">
                <p className="text-xs text-muted-faint">
                  {t.page.reviewedSessions}
                </p>
                <p className="mt-1 text-2xl font-black text-white">
                  {reviewedSessions}
                </p>
              </div>
            </div>

            <Link
              href={`/accounts/${accountId}`}
              className="mt-5 inline-flex w-full items-center justify-center rounded-inner border-[0.5px] border-flash/[0.12] px-4 py-3 text-sm font-medium text-muted transition-colors duration-fast hover:border-accent-bright/40 hover:text-accent-bright"
            >
              {t.page.backToAccountHub}
            </Link>
          </Card>
        </div>
      </Card>

      <ScopeBar
        members={members}
        selectedMemberId={selectedMemberId}
        currentPeriod={period}
        currentRef={ref}
        appLanguage={appLanguage}
        accountId={accountId}
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={`${t.page.totalSessions}${periodSuffix}`}
          value={periodSessions.length}
          description={t.page.totalSessionsDescription}
          icon={CalendarDays}
          tone="text-accent-bright"
        />

        <MetricCard
          title={`${t.page.averageScore}${periodSuffix}`}
          value={
            averageScore !== null
              ? `${averageScore}/10`
              : noDataLabel
          }
          description={t.page.averageScoreDescription}
          icon={Gauge}
          tone={
            averageScore !== null
              ? getScoreTone(averageScore)
              : "text-muted-faint"
          }
        />

        <MetricCard
          title={`${t.page.reviewCompletion}${periodSuffix}`}
          value={
            reviewCompletionRate !== null
              ? formatPercent(
                  reviewCompletionRate,
                  appLanguage
                )
              : noDataLabel
          }
          description={t.page.reviewCompletionDescription}
          icon={CheckCircle2}
          tone={
            reviewCompletionRate !== null
              ? getReadinessTone(reviewCompletionRate)
              : "text-muted-faint"
          }
        />

        <MetricCard
          title={`${t.page.highQualitySessions}${periodSuffix}`}
          value={
            highScoreRate !== null
              ? formatPercent(
                  highScoreRate,
                  appLanguage
                )
              : noDataLabel
          }
          description={t.page.highQualitySessionsDescription}
          icon={Target}
          tone={
            highScoreRate !== null
              ? "text-green-400"
              : "text-muted-faint"
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        {canCreateSessions && (
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-bright">
                  {t.page.newSessionEyebrow}
                </p>
                <h2 className="mt-3 text-section text-white">
                  {t.page.preMarketPlanning}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                  {t.page.preMarketDescription}
                </p>
              </div>

              <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
                <ClipboardList size={22} />
              </div>
            </div>

            <form
              action={createTradingSession.bind(
                null,
                accountId
              )}
              className="mt-8 space-y-6"
            >
              <Card variant="inner" className="p-5">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-pill border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] text-xs font-black text-accent-bright">
                    1
                  </span>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                    Pre-market brief
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <input
                    name="date"
                    type="date"
                    required
                    className={inputClass}
                  />

                  <input
                    name="title"
                    placeholder={t.page.titlePlaceholder}
                    className={inputClass}
                  />

                  <select
                    name="sessionType"
                    className={inputClass}
                  >
                    <option value="">
                      {t.page.sessionTypePlaceholder}
                    </option>
                    <option value="ASIA">
                      {t.options.asia}
                    </option>
                    <option value="LONDON">
                      {t.options.london}
                    </option>
                    <option value="NEW_YORK">
                      {t.options.newYork}
                    </option>
                    <option value="OVERLAP">
                      {t.options.overlap}
                    </option>
                  </select>

                  <input
                    name="marketBias"
                    placeholder={t.page.marketBiasPlaceholder}
                    className={inputClass}
                  />

                  <input
                    name="focus"
                    placeholder={t.page.focusPlaceholder}
                    className={inputClass}
                  />

                  <select
                    name="emotionalState"
                    className={inputClass}
                  >
                    <option value="">
                      {t.page.emotionalStatePlaceholder}
                    </option>
                    <option value="CALM">
                      {t.options.calm}
                    </option>
                    <option value="FOCUSED">
                      {t.options.focused}
                    </option>
                    <option value="CONFIDENT">
                      {t.options.confident}
                    </option>
                    <option value="TIRED">
                      {t.options.tired}
                    </option>
                    <option value="STRESSED">
                      {t.options.stressed}
                    </option>
                    <option value="IMPULSIVE">
                      {t.options.impulsive}
                    </option>
                  </select>
                </div>
              </Card>

              <Card variant="inner" className="p-5">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-pill border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] text-xs font-black text-accent-bright">
                    2
                  </span>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                    Execution contract
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                  <textarea
                    name="checklist"
                    placeholder={t.page.checklistPlaceholder}
                    className={`${inputClass} min-h-[128px]`}
                  />

                  <textarea
                    name="goals"
                    placeholder={t.page.goalsPlaceholder}
                    className={`${inputClass} min-h-[128px]`}
                  />

                  <textarea
                    name="mistakesToAvoid"
                    placeholder={t.page.mistakesPlaceholder}
                    className={`${inputClass} min-h-[128px]`}
                  />

                  <textarea
                    name="sessionReview"
                    placeholder={t.page.reviewPlaceholder}
                    className={`${inputClass} min-h-[128px] xl:col-span-2`}
                  />

                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] xl:grid-cols-1">
                    <input
                      name="finalScore"
                      type="number"
                      min="1"
                      max="10"
                      placeholder={t.page.finalScorePlaceholder}
                      className={inputClass}
                    />

                    <button
                      type="submit"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-inner bg-[linear-gradient(120deg,var(--color-accent),#3f86e8_60%,var(--color-accent-bright))] px-5 py-3 text-sm font-semibold text-white transition-all duration-fast hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_22px_rgba(52,168,255,0.12)]"
                    >
                      <Save size={17} />
                      {t.page.saveSession}
                    </button>
                  </div>
                </div>
              </Card>
            </form>
          </Card>
        )}

        <div className="grid gap-4">
          <Card className="p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-bright">
              Review discipline
            </p>
            <h2 className="mt-3 text-section text-white">
              {t.insights.postMarketTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {periodSessions.length === 0
                ? t.page.emptySessions
                : t.insights.executionDescription}
            </p>

            <div className="mt-6 grid gap-3">
              <Card variant="inner" className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-muted">
                    {t.insights.postMarketEyebrow}
                  </p>
                  <p className="text-2xl font-black text-accent-bright">
                    {reviewedSessions}
                  </p>
                </div>
              </Card>

              <Card variant="inner" className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-muted">
                    {t.insights.pendingReview}
                  </p>
                  <p
                    className={`text-2xl font-black ${
                      pendingReviews > 0
                        ? "text-warning"
                        : "text-muted-faint"
                    }`}
                  >
                    {pendingReviews}
                  </p>
                </div>
              </Card>

              <Card variant="inner" className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-muted">
                    {t.page.focusedSessions}
                  </p>
                  <p className="text-2xl font-black text-white">
                    {planningRate !== null
                      ? formatPercent(
                          planningRate,
                          appLanguage
                        )
                      : noDataLabel}
                  </p>
                </div>
              </Card>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-3 text-muted">
                <TriangleAlert size={20} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-faint">
                  {t.insights.behaviorEyebrow}
                </p>
                <h3 className="mt-2 text-subsection text-white">
                  {t.insights.behaviorTitle}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {periodSessions.length === 0
                    ? t.page.emptySessions
                    : t.insights.behaviorDescription}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Card variant="inner" className="p-4">
                <p className="text-xs text-muted-faint">
                  {t.insights.lowScoreSessions}
                </p>
                <p
                  className={`mt-2 text-2xl font-black ${
                    lowScoreSessions > 0
                      ? "text-negative"
                      : "text-muted-faint"
                  }`}
                >
                  {lowScoreSessions}
                </p>
              </Card>
              <Card variant="inner" className="p-4">
                <p className="text-xs text-muted-faint">
                  {t.insights.highScore}
                </p>
                <p className="mt-2 text-2xl font-black text-green-400">
                  {highScoreSessions}
                </p>
              </Card>
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-faint">
              {t.page.sessionHistory}
            </p>
            <h2 className="mt-2 text-section text-white">
              {t.page.recentSessions}
            </h2>
          </div>

          {lastSession && (
            <div className="flex items-center gap-2 rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-1 px-4 py-3 text-sm text-muted">
              <Clock3 size={16} />
              {t.page.last}:{" "}
              {formatDate(
                lastSession.date,
                appLanguage
              )}
            </div>
          )}
        </div>

        {periodSessions.length === 0 ? (
          <Card className="p-8 text-center">
            <ClipboardCheck
              className="mx-auto text-muted"
              size={26}
            />
            <h3 className="mt-4 text-subsection text-white">
              {t.page.emptySessions}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
              {t.page.preMarketDescription}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {periodSessions.map((tradingSession) => {
              const hasFinalScore =
                tradingSession.finalScore !== null &&
                tradingSession.finalScore !== undefined;

              return (
                <Card
                  key={tradingSession.id}
                  interactive
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
                        {formatDate(
                          tradingSession.date,
                          appLanguage
                        )}
                      </p>

                      <h3 className="mt-2 text-subsection text-white">
                        {tradingSession.title ||
                          t.page.defaultSessionTitle}
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {tradingSession.sessionType && (
                          <span className="rounded-pill border-[0.5px] border-accent-bright/20 bg-accent-bright/[0.06] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-accent-bright">
                            {tradingSession.sessionType}
                          </span>
                        )}

                        {tradingSession.emotionalState && (
                          <span
                            className={`rounded-pill border-[0.5px] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] ${getEmotionTone(
                              tradingSession.emotionalState
                            )}`}
                          >
                            {tradingSession.emotionalState}
                          </span>
                        )}

                        {hasFinalScore && (
                          <span
                            className={`rounded-pill border-[0.5px] border-flash/[0.1] bg-surface-2 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] ${getScoreTone(
                              tradingSession.finalScore || 0
                            )}`}
                          >
                            {t.page.score}:{" "}
                            {tradingSession.finalScore}/10
                          </span>
                        )}
                      </div>
                    </div>

                    {tradingSession.marketBias && (
                      <Card variant="inner" className="min-w-56 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
                          {t.page.marketBias}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {tradingSession.marketBias}
                        </p>
                      </Card>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <FieldBlock
                      label={t.page.focus}
                      value={tradingSession.focus}
                    />

                    <FieldBlock
                      label={t.page.goals}
                      value={tradingSession.goals}
                    />

                    <FieldBlock
                      label={t.page.checklist}
                      value={tradingSession.checklist}
                    />

                    <FieldBlock
                      label={t.page.mistakesToAvoid}
                      value={tradingSession.mistakesToAvoid}
                      warning
                    />
                  </div>

                  {tradingSession.sessionReview && (
                    <div className="mt-4">
                      <FieldBlock
                        label={t.page.sessionReview}
                        value={tradingSession.sessionReview}
                      />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
