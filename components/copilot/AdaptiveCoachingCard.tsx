type Props = {
  mode: string;
  tone: string;
  message: string;
};

export default function AdaptiveCoachingCard({
  mode,
  tone,
  message,
}: Props) {
  return (
    <div className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/10 p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
        Adaptive Coaching
      </p>

      <h2 className="mt-3 text-3xl font-black text-white">
        {mode}
      </h2>

      <p className="mt-5 text-sm leading-relaxed text-gray-300">
        {message}
      </p>

      <div className="mt-6 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-300">
        Tone: {tone}
      </div>
    </div>
  );
}