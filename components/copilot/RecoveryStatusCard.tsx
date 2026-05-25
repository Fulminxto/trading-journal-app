type Props = {
  sessionLocked: boolean;
  reviewRequired: boolean;
};

export default function RecoveryStatusCard({
  sessionLocked,
  reviewRequired,
}: Props) {
  const status = sessionLocked
    ? "Locked"
    : reviewRequired
    ? "Review Required"
    : "Cleared";

  return (
    <div className="rounded-[36px] border border-emerald-500/20 bg-emerald-500/10 p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
        Recovery Status
      </p>

      <h2 className="mt-3 text-3xl font-black text-white">
        {status}
      </h2>

      <p className="mt-5 text-sm leading-relaxed text-gray-300">
        {sessionLocked
          ? "La sessione richiede protezione massima prima di continuare."
          : reviewRequired
          ? "Completa il reset operativo prima di riprendere."
          : "La sessione è stabile e non richiede recovery immediata."}
      </p>
    </div>
  );
}