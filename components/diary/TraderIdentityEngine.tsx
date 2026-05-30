type Props = {
  traderType: string;
  strength: string;
  weakness: string;
};

export default function TraderIdentityEngine({
  traderType,
  strength,
  weakness,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#090b16] via-[#101426] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          Trader Identity
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Operating Profile
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Trader Type
            </p>

            <h3 className="mt-3 text-2xl font-black text-violet-400">
              {traderType}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Strength
            </p>

            <h3 className="mt-3 text-2xl font-black text-green-400">
              {strength}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Weakness
            </p>

            <h3 className="mt-3 text-2xl font-black text-red-400">
              {weakness}
            </h3>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          VOLTIS costruisce il profilo
          operativo del trader usando
          execution, confidence, setup
          quality e disciplina emotiva.
        </p>
      </div>
    </div>
  );
}
