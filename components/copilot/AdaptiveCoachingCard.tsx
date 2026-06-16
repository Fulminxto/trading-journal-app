import {
  getCopilotLabels,
  getCopilotStatusLabel,
  type CopilotI18nProps,
} from "@/components/copilot/CopilotI18n";


type Props = CopilotI18nProps & {
  mode: string;
  tone: string;
  message: string;
};

export default function AdaptiveCoachingCard({
  mode,
  tone,
  message,
  appLanguage,
}: Props) {
  const t = getCopilotLabels(appLanguage);

  return (
    <div className="rounded-[36px] border border-accent-bright/20 bg-accent-bright/10 p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
        {t.components.adaptiveCoaching.eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black text-white">
        {getCopilotStatusLabel(mode, t) || mode}
      </h2>

      <p className="mt-5 text-sm leading-relaxed text-gray-300">
        {message}
      </p>

      <div className="mt-6 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-300">
        {t.common.tone}: {getCopilotStatusLabel(tone, t) || tone}
      </div>
    </div>
  );
}
