import { getSessionsCopy } from "./SessionI18n";

type Props = {
  reviewedSessions: number;
  pendingReviews: number;
  highScoreSessions: number;
  appLanguage?: string | null;
};

export default function PostMarketIntelligence({
  reviewedSessions,
  pendingReviews,
  highScoreSessions,
  appLanguage,
}: Props) {
  const t = getSessionsCopy(appLanguage);

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
          {t.insights.postMarketEyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.insights.postMarketTitle}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.insights.reviewed}
            </p>

            <h3 className="mt-3 text-4xl font-black text-cyan-400">
              {reviewedSessions}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.insights.pendingReview}
            </p>

            <h3 className="mt-3 text-4xl font-black text-yellow-400">
              {pendingReviews}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.insights.highScore}
            </p>

            <h3 className="mt-3 text-4xl font-black text-green-400">
              {highScoreSessions}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
