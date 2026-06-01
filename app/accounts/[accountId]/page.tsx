import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

  const membership = await prisma.accountMember.findFirst({
    where: {
      userId: session.user.id,
      tradingAccountId: accountId,
    },
    include: {
      tradingAccount: true,
    },
  });

  if (!membership) {
    redirect("/accounts");
  }

  const account = membership.tradingAccount;

  const isManager = membership.role === "MANAGER";
  const isArchived = account.status === "ARCHIVED";

  const canViewAnalytics =
    isManager || membership.canViewAnalytics;

  const canViewReports =
    isManager || membership.canViewReports;

  const canViewCopilot =
    isManager || membership.canViewCopilot;

  const canViewMembers =
    isManager || membership.canViewMembers;

  const canManageAccount =
    isManager || membership.canManageAccount;

  const cards = [
    {
      href: `/accounts/${account.id}/dashboard`,
      title: "Dashboard",
      description: "Statistiche account",
      show: true,
    },
    {
      href: `/accounts/${account.id}/diary`,
      title: "Trading Diary",
      description: "Consulta e gestisci le operazioni",
      show: true,
    },
    {
      href: `/accounts/${account.id}/calendar`,
      title: "Calendar",
      description: "Performance giornaliere",
      show: true,
    },
    {
      href: `/accounts/${account.id}/equity`,
      title: "Equity",
      description: "Equity curve e drawdown",
      show: true,
    },
    {
      href: `/accounts/${account.id}/analytics`,
      title: "Analytics",
      description: "Analisi avanzata dell’account",
      show: canViewAnalytics,
    },
    {
      href: `/accounts/${account.id}/reports`,
      title: "Reports",
      description: "Report e riepiloghi operativi",
      show: canViewReports,
    },
    {
      href: `/accounts/${account.id}/sessions`,
      title: "Sessions",
      description: "Session plan e review operative",
      show: canViewReports && !isArchived,
    },
    {
      href: `/accounts/${account.id}/copilot`,
      title: "Copilot",
      description: "Memoria e pattern operativi",
      show: canViewCopilot && !isArchived,
    },
    {
      href: `/accounts/${account.id}/members`,
      title: "Members",
      description: "Performance e attività del team",
      show: canViewMembers,
    },
    {
      href: `/accounts/${account.id}/workspace`,
      title: "Workspace",
      description: "Intelligence del team",
      show: canViewMembers && !isArchived,
    },
    {
      href: `/accounts/${account.id}/rules`,
      title: "Rules & Goals",
      description: "Obiettivi e regole operative",
      show: canManageAccount && !isArchived,
    },
    {
      href: `/accounts/${account.id}/integrations`,
      title: "Integrations",
      description: "MT5, Broker e sync automatiche",
      show: canManageAccount && !isArchived,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">
          Account selezionato
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold sm:text-4xl">
            {account.name}
          </h1>

          {isArchived && (
            <span className="w-fit rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-yellow-300">
              Archived
            </span>
          )}
        </div>

        {isArchived && (
          <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-400">
            Questo account è archiviato. Puoi consultare lo storico, ma le funzioni operative e di gestione sono limitate.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards
          .filter((card) => card.show)
          .map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.06]"
            >
              <h2 className="text-xl font-bold">
                {card.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                {card.description}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
}