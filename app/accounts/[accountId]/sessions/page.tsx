import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { createTradingSession } from "./actions";
import SessionsHero from "@/components/sessions/SessionsHero";
import SessionInsightCard from "@/components/sessions/SessionInsightCard";

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
          (acc, session) =>
            acc +
            (session.finalScore || 0),
          0
        ) / sessions.length
      )
      : 0;

  const focusedSessions = sessions.filter(
    (session) =>
      session.focus &&
      session.focus.length > 10
  ).length;

  const reviewedSessions = sessions.filter(
    (session) =>
      session.sessionReview &&
      session.sessionReview.length > 10
  ).length;

  const highScoreSessions = sessions.filter(
    (session) =>
      (session.finalScore || 0) >= 8
  ).length;

  return (
    <div>

      <SessionsHero
        totalSessions={sessions.length}
        averageScore={averageScore}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
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
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-400">
          Trading Sessions
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Session Workspace
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Organizza mindset,
          focus e review operative.
        </p>
      </div>

      <form
        action={createTradingSession.bind(
          null,
          accountId
        )}
        className="relative mb-10 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_35%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.06),transparent_35%)]" />

        <div className="relative z-10">

          <div className="mb-6">
            <p className="text-sm text-gray-400">
              Nuova sessione
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Pre Market Planning
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <input
              name="date"
              type="date"
              required
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-cyan-500/30 focus:bg-white/[0.03] focus:ring-4 focus:ring-cyan-500/10"
            />

            <input
              name="title"
              placeholder="Titolo sessione"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-cyan-500/30 focus:bg-white/[0.03] focus:ring-4 focus:ring-cyan-500/10"
            />

            <select
              name="sessionType"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-cyan-500/30 focus:bg-white/[0.03] focus:ring-4 focus:ring-cyan-500/10"
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
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-cyan-500/30 focus:bg-white/[0.03] focus:ring-4 focus:ring-cyan-500/10"
            />

            <input
              name="focus"
              placeholder="Focus del giorno"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-cyan-500/30 focus:bg-white/[0.03] focus:ring-4 focus:ring-cyan-500/10"
            />

            <select
              name="emotionalState"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-cyan-500/30 focus:bg-white/[0.03] focus:ring-4 focus:ring-cyan-500/10"
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
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-cyan-500/30 focus:bg-white/[0.03] focus:ring-4 focus:ring-cyan-500/10"
            />

            <textarea
              name="goals"
              placeholder="Goals"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-cyan-500/30 focus:bg-white/[0.03] focus:ring-4 focus:ring-cyan-500/10"
            />

            <textarea
              name="mistakesToAvoid"
              placeholder="Errori da evitare"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-cyan-500/30 focus:bg-white/[0.03] focus:ring-4 focus:ring-cyan-500/10"
            />

            <textarea
              name="sessionReview"
              placeholder="Review finale"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-cyan-500/30 focus:bg-white/[0.03] focus:ring-4 focus:ring-cyan-500/10"
            />

            <input
              name="finalScore"
              type="number"
              min="1"
              max="10"
              placeholder="Final Score (1-10)"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-cyan-500/30 focus:bg-white/[0.03] focus:ring-4 focus:ring-cyan-500/10"
            />

            <button
              type="submit"
              className="rounded-2xl bg-green-500 p-4 font-bold text-black transition hover:bg-green-400 sm:col-span-2 xl:col-span-3"
            >
              Salva sessione
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-5">
        {sessions.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-500">
            Nessuna sessione registrata.
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      session.date
                    ).toLocaleDateString(
                      "it-IT"
                    )}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {session.title ||
                      "Trading Session"}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {session.sessionType && (
                      <span className="rounded-xl bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                        {session.sessionType}
                      </span>
                    )}

                    {session.emotionalState && (
                      <span className="rounded-xl bg-yellow-500/10 px-3 py-1 text-sm text-yellow-400">
                        {
                          session.emotionalState
                        }
                      </span>
                    )}

                    {session.finalScore && (
                      <span className="rounded-xl bg-green-500/10 px-3 py-1 text-sm text-green-400">
                        Score:{" "}
                        {session.finalScore}
                        /10
                      </span>
                    )}
                  </div>
                </div>

                {session.marketBias && (
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
                    <p className="text-gray-500">
                      Market Bias
                    </p>

                    <p className="mt-1 font-bold">
                      {session.marketBias}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                {session.focus && (
                  <div className="rounded-2xl bg-black/20 p-4">
                    <p className="text-sm text-gray-500">
                      Focus
                    </p>

                    <p className="mt-2 text-gray-300">
                      {session.focus}
                    </p>
                  </div>
                )}

                {session.goals && (
                  <div className="rounded-2xl bg-black/20 p-4">
                    <p className="text-sm text-gray-500">
                      Goals
                    </p>

                    <p className="mt-2 text-gray-300 whitespace-pre-wrap">
                      {session.goals}
                    </p>
                  </div>
                )}

                {session.checklist && (
                  <div className="rounded-2xl bg-black/20 p-4">
                    <p className="text-sm text-gray-500">
                      Checklist
                    </p>

                    <p className="mt-2 text-gray-300 whitespace-pre-wrap">
                      {session.checklist}
                    </p>
                  </div>
                )}

                {session.mistakesToAvoid && (
                  <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-4">
                    <p className="text-sm text-red-400">
                      Mistakes To Avoid
                    </p>

                    <p className="mt-2 text-gray-300 whitespace-pre-wrap">
                      {
                        session.mistakesToAvoid
                      }
                    </p>
                  </div>
                )}
              </div>

              {session.sessionReview && (
                <div className="mt-5 rounded-2xl border border-green-500/10 bg-green-500/[0.03] p-4">
                  <p className="text-sm text-green-400">
                    Session Review
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-gray-300">
                    {session.sessionReview}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}