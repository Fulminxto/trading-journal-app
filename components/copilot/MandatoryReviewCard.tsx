type Props = {
  sessionLocked: boolean;
  reviewRequired: boolean;
};

export default function MandatoryReviewCard({
  sessionLocked,
  reviewRequired,
}: Props) {
  if (!sessionLocked && !reviewRequired) {
    return null;
  }

  return (
    <div className="rounded-[36px] border border-yellow-500/20 bg-yellow-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-yellow-300">
            Mandatory Review
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Recovery Protocol Required
          </h2>
        </div>

        <div className="rounded-full bg-yellow-500/20 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-yellow-300">
          Required
        </div>
      </div>

      <p className="mt-6 max-w-4xl text-sm leading-relaxed text-gray-300">
        VOLTIS consiglia una review mentale e operativa prima di continuare.
        L’obiettivo è ridurre impulsività, ripristinare lucidità e proteggere
        qualità decisionale.
      </p>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Step 1
          </p>
          <h3 className="mt-3 text-xl font-black text-white">
            Stop operativo
          </h3>
          <p className="mt-3 text-sm text-gray-400">
            Prenditi una pausa prima di valutare nuove operazioni.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Step 2
          </p>
          <h3 className="mt-3 text-xl font-black text-white">
            Review mentale
          </h3>
          <p className="mt-3 text-sm text-gray-400">
            Identifica stato emotivo, trigger e qualità della decisione.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Step 3
          </p>
          <h3 className="mt-3 text-xl font-black text-white">
            Reset execution
          </h3>
          <p className="mt-3 text-sm text-gray-400">
            Torna solo su setup chiari, pianificati e ad alta qualità.
          </p>
        </div>
      </div>
    </div>
  );
}