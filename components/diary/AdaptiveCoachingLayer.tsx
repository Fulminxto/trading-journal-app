import {
  getDiaryLabels,
  type DiaryI18nProps,
} from "./DiaryI18n";

type Props = DiaryI18nProps & {
  disciplineScore: number;
  traderType: string;
  weakness: string;
  weakExecutionTrades: number;
  emotionalTrades: number;
};

export default function AdaptiveCoachingLayer({
  disciplineScore,
  traderType,
  weakness,
  weakExecutionTrades,
  emotionalTrades,
  appLanguage,
}: Props) {
  const t = getDiaryLabels(appLanguage);

  const mainAdvice =
    disciplineScore >= 80
      ? t.strongAdvice
      : disciplineScore >= 60
        ? t.mediumAdvice
        : t.weakAdvice;

  const warning =
    weakExecutionTrades > 2
      ? t.weakExecutionWarning
      : emotionalTrades > 2
        ? t.emotionalWarning
        : t.noCriticalWarning;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#071014] via-[#0b1720] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_14%,transparent),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
          {t.adaptiveCoaching}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.coachLayer}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 xl:col-span-2">
            <p className="text-sm text-gray-400">
              {t.mainGuidance}
            </p>

            <h3 className="mt-3 text-xl font-black text-accent-bright">
              {mainAdvice}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.traderProfile}
            </p>

            <h3 className="mt-3 text-xl font-black text-violet-400">
              {traderType}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.currentWeakness}
            </p>

            <h3 className="mt-3 text-xl font-black text-red-400">
              {weakness}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 xl:col-span-2">
            <p className="text-sm text-gray-400">
              {t.warning}
            </p>

            <h3 className="mt-3 text-xl font-black text-yellow-400">
              {warning}
            </h3>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.coachingDescription}
        </p>
      </div>
    </div>
  );
}
