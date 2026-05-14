import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
  createUser,
  deleteUser,
} from "./actions";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!currentUser || currentUser.role !== "OWNER") {
    redirect("/accounts");
  }

  const users = await prisma.user.findMany({
    include: {
      memberships: {
        include: {
          tradingAccount: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Pannello amministratore
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Admin Panel
          </h1>
        </div>

        <a
          href="/admin/accounts"
          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 hover:bg-white/[0.06]"
        >
          Gestione Accounts
        </a>
      </div>

      <form
        action={createUser}
        className="mb-8 grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-3"
      >
        <input
          name="username"
          placeholder="Username"
          className="rounded-xl bg-zinc-900 p-3"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="rounded-xl bg-zinc-900 p-3"
          required
        />

        <input
          name="name"
          placeholder="Nome"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <button
          type="submit"
          className="rounded-xl bg-green-500 p-3 font-bold text-black md:col-span-3"
        >
          Crea utente
        </button>
      </form>

      <div className="space-y-6">
        {users.map((user) => {
          const isCurrentUser =
            user.id === currentUser.id;

          return (
            <div
              key={user.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {user.username}
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {user.name || "-"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                      user.role === "OWNER"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {user.role}
                  </div>

                  {isCurrentUser ? (
                    <div className="rounded-xl bg-white/10 px-4 py-2 text-sm text-gray-400">
                      Utente attuale
                    </div>
                  ) : (
                    <form action={deleteUser}>
                      <input
                        type="hidden"
                        name="userId"
                        value={user.id}
                      />

                      <button
                        type="submit"
                        className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20"
                      >
                        Elimina utente
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {user.memberships.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-500">
                    Nessun account collegato.
                  </div>
                ) : (
                  user.memberships.map((membership) => (
                    <div
                      key={membership.id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium">
                          {
                            membership
                              .tradingAccount
                              .name
                          }
                        </p>

                        <p className="text-sm text-gray-400">
                          {
                            membership
                              .tradingAccount
                              .type
                          }
                        </p>
                      </div>

                      <div className="rounded-lg bg-white/10 px-3 py-1 text-sm">
                        {membership.role}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}