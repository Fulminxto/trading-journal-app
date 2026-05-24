import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CopilotPage({
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
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#070b14] via-[#0f1726] to-black p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%)]" />

        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            VOLTIS Copilot
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight text-white xl:text-7xl">
            AI Trading Copilot
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-400 xl:text-lg">
            Assistant intelligente per analizzare
            performance, comportamento, execution,
            psicologia operativa e pattern ricorrenti.
          </p>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          Coming Intelligence Layer
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Copilot Engine
        </h2>

        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-400">
          In questa sezione costruiremo il layer AI di VOLTIS:
          analisi automatica dei trade, coaching dinamico,
          pattern detection, warning comportamentali e
          suggerimenti operativi contestuali.
        </p>
      </div>
    </div>
  );
}