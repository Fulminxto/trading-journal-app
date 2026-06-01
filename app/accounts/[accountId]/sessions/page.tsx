import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Save,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { createTradingSession } from "./actions";
import SessionsHero from "@/components/sessions/SessionsHero";
import SessionInsightCard from "@/components/sessions/SessionInsightCard";
import PostMarketIntelligence from "@/components/sessions/PostMarketIntelligence";
import BehaviorWarningCard from "@/components/sessions/BehaviorWarningCard";
import ExecutionIntelligence from "@/components/sessions/ExecutionIntelligence";

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  tone?: string;
};

function StatCard({
  title,
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
            {title}
          </p>

          <h2 className={`mt-3 text-3xl font-black ${tone}`}>
            {value}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-cyan-300">
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
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

function formatPercent(value: number) {
  return `${value.toFixed(0)}%`;
}

export default async function SessionsPage({
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

  const canCreateSessions =
    membership.role === "MANAGER" ||
    membership.role === "MEMBER";

  const sessions =
    await prisma.tradingSession.findMany({
      where: {
        tradingAccountId: accountId,
      },

      orderBy: {
        date: "desc",
      },
    });

  const averageScore =
    sessions.length > 0
      ? Math.round(
        sessions.reduce(
          (acc, tradingSession) =>
            acc +
            (tradingSession.finalScore || 0),
          0
        ) / sessions.length
      )
      : 0;

  const focusedSessions = sessions.filter(
    (tradingSession) =>
      tradingSession.focus &&
      tradingSession.focus.length > 10
  ).length;

  const reviewedSessions = sessions.filter(
    (tradingSession) =>
      tradingSession.sessionReview &&
      tradingSession.sessionReview.length > 10
  ).length;

  const highScoreSessions = sessions.filter(
    (tradingSession) =>
      (tradingSession.finalScore || 0) >= 8
  ).length;

  const lowScoreSessions = sessions.filter(
    (tradingSession) =>
      (tradingSession.finalScore || 0) <= 4
  ).length;

  const pendingReviews =
    sessions.length - reviewedSessions;

  const reviewCompletionRate =
    sessions.length > 0
      ? (reviewedSessions / sessions.length) * 100
      : 0;

  const highScoreRate =
    sessions.length > 0
      ? (highScoreSessions / sessions.length) * 100
      : 0;

  const lastSession = sessions[0];

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-cyan-500/30 focus:bg-white/[0.03] focus:ring-4 focus:ring-cyan-500/10";

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_35%)]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Session workspace
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                {membership.tradingAccount.name}
              </span>
            </div>

            <p className="text-sm text-gray-400">
              Trading Sessions
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-6xl">
              Plan. Execute. Review.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400">
              Organizza mindset, focus, checklist e review operative.
              Questa pagina serve a proteggere la qualità della sessione
              prima e dopo il mercato.
            </p>
          </div>

          <Link
            href={`/accounts/${accountId}`}
            className="w-fit rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
          >
            Back to Account Hub
          </Link>
        </div>
      </section>

      <SessionsHero
        totalSessions={sessions.length}
        averageScore={averageScore}
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Sessions"
          value={sessions.length}
          description="Sessioni pianificate o revisionate in questo account."
          icon={CalendarDays}
          tone="text-cyan-300"
        />

        <StatCard
          title="Average Score"
          value={`${averageScore}/10`}
          description="Media del punteggio finale registrato nelle sessioni."
          icon={Star}
          tone={getScoreTone(averageScore)}
        />

        <StatCard
          title="Review Completion"
          value={formatPercent(reviewCompletionRate)}
          description="Percentuale di sessioni con review post-market compilata."
          icon={CheckCircle2}
          tone="text-violet-400"
        />

        <StatCard
          title="High Quality Sessions"
          value={formatPercent(highScoreRate)}
          description="Quota di sessioni con score operativo pari o superiore a 8/10."
          icon={TrendingUp}
          tone="text-green-400"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SessionInsightCard
          title="Focused Sessions"
          value={focusedSessions}
          tone="text-cyan-400"
          description="Sessioni con focus operativo dettagliato e pianificazione reale."
        />

        <SessionInsightCard
          title="Reviewed Sessions"
          value={reviewedSessions}
          tone="text-violet-400"
          description="Sessioni con review post-market completata."
        />

        <SessionInsightCard
          title="High Score Sessions"
          value={highScoreSessions}
          tone="text-green-400"
          description="Sessioni con execution score superiore a 8/10."
        />
      </section>

      <section className="grid items-stretch gap-6 xl:grid-cols-3">
        <div className="flex xl:col-span-2 [&>*]:h-full [&>*]:w-full">
          <PostMarketIntelligence
            reviewedSessions={reviewedSessions}
            pendingReviews={pendingReviews}
            highScoreSessions={highScoreSessions}
          />
        </div>

        <div className="flex [&>*]:h-full [&>*]:w-full">
          <BehaviorWarningCard
            lowScoreSessions={lowScoreSessions}
            pendingReviews={pendingReviews}
          />
        </div>
      </section>

      <ExecutionIntelligence
        lowScoreSessions={lowScoreSessions}
        highScoreSessions={highScoreSessions}
        reviewedSessions={reviewedSessions}
        totalSessions={sessions.length}
      />

      {canCreateSessions && (
        <form
          action={createTradingSession.bind(
            null,
            accountId
          )}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_35%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.06),transparent_35%)]" />

          <div className="relative z-10">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Nuova sessione
                </p>

                <h2 className="mt-1 text-3xl font-black text-white">
                  Pre Market Planning
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
                  Compila il piano prima della sessione e usa la review finale
                  per trasformare l’esecuzione in feedback reale.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-cyan-300">
                <ClipboardList size={22} />
              </div>
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
                placeholder="Titolo sessione"
                className={inputClass}
              />

              <select
                name="sessionType"
                className={inputClass}
              >
                <option value="">
                  Session Type
                </option>

                <option value="ASIA">
                  Asia
                </option>

                <option value="LONDON">
                  London
                </option>

                <option value="NEW_YORK">
                  New York
                </option>

                <option value="OVERLAP">
                  Overlap
                </option>
              </select>

              <input
                name="marketBias"
                placeholder="Market Bias"
                className={inputClass}
              />

              <input
                name="focus"
                placeholder="Focus del giorno"
                className={inputClass}
              />

              <select
                name="emotionalState"
                className={inputClass}
              >
                <option value="">
                  Emotional State
                </option>

                <option value="CALM">
                  Calm
                </option>

                <option value="FOCUSED">
                  Focused
                </option>

                <option value="CONFIDENT">
                  Confident
                </option>

                <option value="TIRED">
                  Tired
                </option>

                <option value="STRESSED">
                  Stressed
                </option>

                <option value="IMPULSIVE">
                  Impulsive
                </option>
              </select>

              <textarea
                name="checklist"
                placeholder="Checklist"
                className={`${inputClass} min-h-[120px]`}
              />

              <textarea
                name="goals"
                placeholder="Goals"
                className={`${inputClass} min-h-[120px]`}
              />

              <textarea
                name="mistakesToAvoid"
                placeholder="Errori da evitare"
                className={`${inputClass} min-h-[120px]`}
              />

              <textarea
                name="sessionReview"
                placeholder="Review finale"
                className={`${inputClass} min-h-[120px] sm:col-span-2`}
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <input
                  name="finalScore"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Final Score (1-10)"
                  className={inputClass}
                />

                <button
                  type="submit"
                  className="flex h-full min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-4 font-black text-black transition hover:bg-green-400"
                >
                  <Save size={18} />
                  Salva sessione
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Session history
            </p>

            <h2 className="mt-1 text-3xl font-black text-white">
              Recent Sessions
            </h2>
          </div>

          {lastSession && (
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-400">
              <Clock3 size={16} />
              Last: {new Date(lastSession.date).toLocaleDateString("it-IT")}
            </div>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-500">
            Nessuna sessione registrata.
          </div>
        ) : (
          sessions.map((tradingSession) => {
            const hasFinalScore =
              tradingSession.finalScore !== null &&
              tradingSession.finalScore !== undefined;

            return (
              <div
                key={tradingSession.id}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.06]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.06),transparent_35%)] opacity-0 transition group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          tradingSession.date
                        ).toLocaleDateString("it-IT")}
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-white">
                        {tradingSession.title ||
                          "Trading Session"}
                      </h2>

                      <div className="mt-3 flex flex-wrap gap-3">
                        {tradingSession.sessionType && (
                          <span className="rounded-xl bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                            {tradingSession.sessionType}
                          </span>
                        )}

                        {tradingSession.emotionalState && (
                          <span className="rounded-xl bg-yellow-500/10 px-3 py-1 text-sm text-yellow-400">
                            {tradingSession.emotionalState}
                          </span>
                        )}

                        {hasFinalScore && (
                          <span
                            className={`rounded-xl bg-white/10 px-3 py-1 text-sm ${getScoreTone(
                              tradingSession.finalScore || 0
                            )}`}
                          >
                            Score: {tradingSession.finalScore}/10
                          </span>
                        )}
                      </div>
                    </div>

                    {tradingSession.marketBias && (
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
                        <p className="text-gray-500">
                          Market Bias
                        </p>

                        <p className="mt-1 font-bold text-white">
                          {tradingSession.marketBias}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {tradingSession.focus && (
                      <div className="rounded-2xl bg-black/20 p-4">
                        <p className="text-sm text-gray-500">
                          Focus
                        </p>

                        <p className="mt-2 text-gray-300">
                          {tradingSession.focus}
                        </p>
                      </div>
                    )}

                    {tradingSession.goals && (
                      <div className="rounded-2xl bg-black/20 p-4">
                        <p className="text-sm text-gray-500">
                          Goals
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-gray-300">
                          {tradingSession.goals}
                        </p>
                      </div>
                    )}

                    {tradingSession.checklist && (
                      <div className="rounded-2xl bg-black/20 p-4">
                        <p className="text-sm text-gray-500">
                          Checklist
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-gray-300">
                          {tradingSession.checklist}
                        </p>
                      </div>
                    )}

                    {tradingSession.mistakesToAvoid && (
                      <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-4">
                        <p className="text-sm text-red-400">
                          Mistakes To Avoid
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-gray-300">
                          {tradingSession.mistakesToAvoid}
                        </p>
                      </div>
                    )}
                  </div>

                  {tradingSession.sessionReview && (
                    <div className="mt-5 rounded-2xl border border-green-500/10 bg-green-500/[0.03] p-4">
                      <p className="text-sm text-green-400">
                        Session Review
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-gray-300">
                        {tradingSession.sessionReview}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
