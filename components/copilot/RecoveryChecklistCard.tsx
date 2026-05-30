type Props = {
  reviewRequired: boolean;
};

export default function RecoveryChecklistCard({
  reviewRequired,
}: Props) {
  if (!reviewRequired) {
    return null;
  }

  const checklist = [
    "Ho interrotto l’operatività per almeno qualche minuto.",
    "Ho identificato se sto operando per paura, fretta o recupero.",
    "Ho controllato se il prossimo trade rispetta il piano.",
    "Ho accettato che non devo recuperare subito una perdita.",
  ];

  return (
    <div className="rounded-[36px] border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
        Recovery Checklist
      </p>

      <h2 className="mt-3 text-3xl font-black text-white">
        Pre-Execution Reset
      </h2>

      <div className="mt-8 space-y-4">
        {checklist.map((item, index) => (
          <div
            key={item}
            className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-black text-cyan-300">
              {index + 1}
            </div>

            <p className="text-sm leading-relaxed text-gray-300">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
