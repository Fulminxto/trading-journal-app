import { getSessionsCopy } from "./SessionI18n";

type Props = {
  lowScoreSessions: number;
  highScoreSessions: number;
  reviewedSessions: number;
  totalSessions: number;
  appLanguage?: string | null;
};

export default function ExecutionIntelligence({
  lowScoreSessions,
  highScoreSessions,
  reviewedSessions,
  totalSessions,
  appLanguage,
}: Props) {
  const t = getSessionsCopy(appLanguage);

  const reviewRate =
    totalSessions > 0
      ? Math.round(
        (reviewedSessions / totalSessions) * 100
      )
      : 0;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          {t.insights.executionEyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.insights.executionTitle}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.insights.reviewRate}
            </p>

            <h3 className="mt-3 text-4xl font-black text-cyan-400">
              {reviewRate}%
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.insights.highQuality}
            </p>

            <h3 className="mt-3 text-4xl font-black text-green-400">
              {highScoreSessions}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.insights.weakExecution}
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {lowScoreSessions}
            </h3>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.insights.executionDescription}
        </p>
      </div>
    </div>
  );
}
