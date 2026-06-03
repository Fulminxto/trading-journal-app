import { getSessionsCopy } from "./SessionI18n";

type Props = {
  totalSessions: number;
  averageScore: number;
  appLanguage?: string | null;
};

export default function SessionsHero({
  totalSessions,
  averageScore,
  appLanguage,
}: Props) {
  const t = getSessionsCopy(appLanguage);

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#070b14] via-[#0f1726] to-black p-8 shadow-2xl shadow-cyan-500/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10 flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400" />

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              {t.hero.badge}
            </p>
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-white xl:text-7xl">
            {t.hero.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400 xl:text-lg">
            {t.hero.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:min-w-[420px]">
          <div className="rounded-3xl border border-cyan-500/10 bg-cyan-500/[0.06] p-5 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              {t.hero.totalSessions}
            </p>

            <h2 className="mt-3 text-4xl font-black text-cyan-400">
              {totalSessions}
            </h2>
          </div>

          <div className="rounded-3xl border border-violet-500/10 bg-violet-500/[0.06] p-5 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              {t.hero.averageScore}
            </p>

            <h2 className="mt-3 text-4xl font-black text-violet-400">
              {averageScore}/10
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
