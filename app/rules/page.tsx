export default function RulesPage() {
  const rules = [
    "Seguire il piano senza impulsività",
    "Mai rischiare oltre il limite definito",
    "Entrare solo con conferma della strategia",
    "Evitare overtrading",
    "Non recuperare perdite emotivamente",
    "Rispettare stop loss e take profit",
  ];

  const goals = [
    "Mantenere consistenza mensile",
    "Ridurre drawdown",
    "Migliorare win rate",
    "Rispettare il risk management",
    "Raggiungere nuove equity highs",
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">
          Disciplina e obiettivi
        </p>

        <h1 className="text-4xl font-bold">
          Rules & Goals
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-400">
              Regole operative
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Trading Rules
            </h2>
          </div>

          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="rounded-xl bg-zinc-900 p-4"
              >
                <p className="text-gray-200">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-400">
              Obiettivi
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Trading Goals
            </h2>
          </div>

          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="rounded-xl bg-zinc-900 p-4"
              >
                <p className="text-gray-200">
                  {goal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}