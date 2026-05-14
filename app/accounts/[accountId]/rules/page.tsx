import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const rules = [
  {
    title: "Risk Management",
    description:
      "Mai rischiare più del 2% per trade.",
  },

  {
    title: "No Revenge Trading",
    description:
      "Dopo una loss mantenere lucidità.",
  },

  {
    title: "Follow The Plan",
    description:
      "Entrare solo con setup validi.",
  },

  {
    title: "Max Trades",
    description:
      "Massimo 3 trade al giorno.",
  },

  {
    title: "No FOMO",
    description:
      "Non inseguire il mercato.",
  },

  {
    title: "Consistency",
    description:
      "Puntare alla consistenza e non all’ego.",
  },
];

const goals = [
  {
    title: "Monthly Consistency",
    description:
      "Chiudere mesi consecutivi in profitto.",
  },

  {
    title: "Drawdown Control",
    description:
      "Restare sotto il 10% di DD.",
  },

  {
    title: "Discipline",
    description:
      "Seguire sempre il piano.",
  },

  {
    title: "Emotional Control",
    description:
      "Gestire emozioni e impulsività.",
  },

  {
    title: "Scaling",
    description:
      "Aumentare size solo con consistenza.",
  },
];

export default async function RulesPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

  const membership =
    await prisma.accountMember.findFirst({
      where: {
        userId: session.user.id,
        tradingAccountId: accountId,
      },
    });

  if (!membership) {
    redirect("/accounts");
  }

  return (
    <div>
      <div className="mb-10">
        <p className="text-sm text-gray-400">
          Disciplina e obiettivi
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          Rules & Goals
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-2xl font-bold">
            Trading Rules
          </h2>

          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-black/20 p-5"
              >
                <h3 className="text-lg font-bold">
                  {rule.title}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-2xl font-bold">
            Goals
          </h2>

          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-black/20 p-5"
              >
                <h3 className="text-lg font-bold">
                  {goal.title}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  {goal.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}