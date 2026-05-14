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

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">Account selezionato</p>
        <h1 className="text-3xl font-bold sm:text-4xl">{account.name}</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <a
          href={`/accounts/${account.id}/diary`}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]"
        >
          <h2 className="text-xl font-bold">Trading Diary</h2>
          <p className="mt-2 text-sm text-gray-400">Gestisci operazioni</p>
        </a>

        <a
          href={`/accounts/${account.id}/dashboard`}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]"
        >
          <h2 className="text-xl font-bold">Dashboard</h2>
          <p className="mt-2 text-sm text-gray-400">Statistiche account</p>
        </a>

        <a
          href={`/accounts/${account.id}/calendar`}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]"
        >
          <h2 className="text-xl font-bold">Calendar</h2>
          <p className="mt-2 text-sm text-gray-400">Performance giornaliere</p>
        </a>

        <a
          href={`/accounts/${account.id}/settings`}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]"
        >
          <h2 className="text-xl font-bold">Settings</h2>
          <p className="mt-2 text-sm text-gray-400">Impostazioni conto</p>
        </a>
      </div>
    </div>
  );
}