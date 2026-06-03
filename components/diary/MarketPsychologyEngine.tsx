import {
  getDiaryLabels,
  type DiaryI18nProps,
} from "./DiaryI18n";

type Props = DiaryI18nProps & {
  emotionalTrades: number;
  lowConfidenceTrades: number;
  highQualityTrades: number;
};

export default function MarketPsychologyEngine({
  emotionalTrades,
  lowConfidenceTrades,
  highQualityTrades,
  appLanguage,
}: Props) {
  const t = getDiaryLabels(appLanguage);

  const emotionalRisk =
    emotionalTrades > highQualityTrades ||
    lowConfidenceTrades > 2;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0c0714] via-[#140b20] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          {t.marketPsychology}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.psychologyEngine}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.emotionalTrades}
            </p>

            <h3 className="mt-3 text-4xl font-black text-yellow-400">
              {emotionalTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.lowConfidence}
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {lowConfidenceTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.psychologyStatus}
            </p>

            <h3
              className={`mt-3 text-3xl font-black ${emotionalRisk
                  ? "text-red-400"
                  : "text-green-400"
                }`}
            >
              {emotionalRisk ? t.atRisk : t.stable}
            </h3>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.psychologyDescription}
        </p>
      </div>
    </div>
  );
}
