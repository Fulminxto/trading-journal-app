import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import {
  Wallet,
  Users,
  TrendingUp,
} from "lucide-react";

export default async function AccountsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser =
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

  const memberships =
    await prisma.accountMember.findMany({
      where: {
        userId: session.user.id,
      },

      include: {
        tradingAccount: true,
      },
    });

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Benvenuto,
            {" "}
            {currentUser?.name ||
              currentUser?.username}
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Select Account
          </h1>
        </div>

        {currentUser?.role ===
          "OWNER" && (
          <div className="flex gap-3">
            <a
              href="/admin"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 hover:bg-white/[0.06]"
            >
              Admin
            </a>

            <a
              href="/admin/accounts"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 hover:bg-white/[0.06]"
            >
              Accounts
            </a>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {memberships.map((membership) => {
          const account =
            membership.tradingAccount;

          return (
            <a
              key={account.id}
              href={`/accounts/${account.id}/dashboard`}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-green-500/20 hover:bg-white/[0.06]"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="rounded-2xl bg-green-500/10 p-4 text-green-400">
                  <Wallet size={26} />
                </div>

                <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-semibold text-gray-300">
                  {account.type}
                </span>
              </div>

              <h2 className="text-2xl font-bold transition group-hover:text-green-400">
                {account.name}
              </h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <TrendingUp size={16} />

                    <span>Balance</span>
                  </div>

                  <span className="font-semibold text-white">
                    {account.initialBalance.toLocaleString()}{" "}
                    {account.currency}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users size={16} />

                    <span>Role</span>
                  </div>

                  <span className="font-semibold text-white">
                    {membership.role}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}