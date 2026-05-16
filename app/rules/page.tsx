import {
  Target,
  ShieldCheck,
  Brain,
  TrendingUp,
} from "lucide-react";

export default function RulesPage() {
  const rules = [
    "Seguo il piano prima dell’emozione.",
    "Non aumento il rischio per recuperare una perdita.",
    "Entro solo quando il setup è chiaro e confermato.",
    "Accetto lo stop loss senza spostarlo per paura.",
    "Evito overtrading dopo una serie negativa.",
    "La disciplina viene prima del profitto.",
  ];

  const goals = [
    {
      label: "Monthly Consistency",
      value: "Process first",
    },
    {
      label: "Risk Control",
      value: "Protected capital",
    },
    {
      label: "Execution Quality",
      value: "Clean entries",
    },
    {
      label: "Mindset",
      value: "Calm decisions",
    },
  ];

  const discipline = [
    "No revenge trading",
    "No impulsive entries",
    "No oversized positions",
    "No emotional exits",
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">
          Discipline System
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Rules & Goals
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
          Questa pagina non serve solo a ricordarti cosa fare.
          Serve a mantenerti coerente quando il mercato prova a
          farti uscire dal tuo piano.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {goals.map((goal) => (
          <div
            key={goal.label}
            className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6"
          >
            <p className="text-sm text-gray-400">
              {goal.label}
            </p>

            <h2 className="mt-3 text-2xl font-bold text-white">
              {goal.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-green-500/10 p-3 text-green-400">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Trading Rules
              </p>

              <h2 className="text-2xl font-bold">
                Regole operative
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div
                key={rule}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-sm text-gray-500">
                  Rule {index + 1}
                </p>

                <p className="mt-1 font-medium text-gray-200">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-yellow-500/10 p-3 text-yellow-400">
              <Target size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Discipline Tracker
              </p>

              <h2 className="text-2xl font-bold">
                Errori da evitare
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {discipline.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="font-medium text-gray-200">
                  {item}
                </p>

                <span className="rounded-xl bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                  Avoid
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-white/5 p-3 text-white">
              <Brain size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Mindset
              </p>

              <h2 className="text-2xl font-bold">
                Identity Statement
              </h2>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-lg leading-8 text-gray-300">
              Non sto cercando di vincere ogni trade. Sto costruendo
              una versione di me capace di rispettare il piano anche
              quando il risultato non è immediato.
            </p>
          </div>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-gradient-to-br from-green-500/10 to-transparent p-6 xl:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-green-500/10 p-3 text-green-400">
              <TrendingUp size={22} />
            </div>

            <div>
              <p className="text-sm text-green-400">
                Performance Focus
              </p>

              <h2 className="text-2xl font-bold">
                Obiettivo reale
              </h2>
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-7 text-gray-400">
            Il vero obiettivo non è solo aumentare il profitto, ma
            diventare più stabile, più lucido e più coerente nel modo
            in cui prendi decisioni operative.
          </p>
        </div>
      </div>
    </div>
  );
}