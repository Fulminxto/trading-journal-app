import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
  createUser,
  deleteUser,
  freezeUser,
  unfreezeUser,
  resetUserPassword,
  updateUserRole,
  updateUserPermissions,
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

        <select
          name="role"
          defaultValue="MEMBER"
          aria-label="New user role"
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="MEMBER">MEMBER</option>
          <option value="VIEWER">VIEWER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="OWNER">OWNER</option>
        </select>

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

          const isSelfOwner =
            isCurrentUser && user.role === "OWNER";

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
                  {isSelfOwner ? (
                    <div className="rounded-xl bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
                      OWNER · System Owner
                    </div>
                  ) : (
                    <form
                      action={updateUserRole}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="hidden"
                        name="userId"
                        value={user.id}
                      />

                      <select
                        name="role"
                        defaultValue={user.role}
                        aria-label="User role"
                        className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
                      >
                        <option value="OWNER">OWNER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>

                      <button
                        type="submit"
                        className="rounded-xl bg-green-500/10 px-3 py-2 text-sm font-semibold text-green-400 hover:bg-green-500/20"
                      >
                        Save
                      </button>
                    </form>
                  )}

                  <div
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${user.status === "FROZEN"
                      ? "bg-yellow-500/10 text-yellow-300"
                      : "bg-cyan-500/10 text-cyan-300"
                      }`}
                  >
                    {user.status}
                  </div>

                  {isCurrentUser ? (
                    <div className="rounded-xl bg-white/10 px-4 py-2 text-sm text-gray-400">
                      Utente attuale
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {user.status === "FROZEN" ? (
                        <form action={unfreezeUser}>
                          <input
                            type="hidden"
                            name="userId"
                            value={user.id}
                          />

                          <button
                            type="submit"
                            className="rounded-xl bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20"
                          >
                            Unfreeze
                          </button>
                        </form>
                      ) : (
                        <form action={freezeUser}>
                          <input
                            type="hidden"
                            name="userId"
                            value={user.id}
                          />

                          <button
                            type="submit"
                            className="rounded-xl bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-500/20"
                          >
                            Freeze
                          </button>
                        </form>
                      )}

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
                    </div>
                  )}

                  {!isSelfOwner && (
                    <form
                      action={updateUserPermissions}
                      className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <input
                        type="hidden"
                        name="userId"
                        value={user.id}
                      />

                      <p className="mb-3 text-sm font-semibold text-gray-300">
                        Global Permissions
                      </p>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name="canCreatePersonalAccounts"
                            defaultChecked={user.canCreatePersonalAccounts}
                          />
                          Create Personal Accounts
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name="canCreateSharedAccounts"
                            defaultChecked={user.canCreateSharedAccounts}
                          />
                          Create Shared Accounts
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name="canArchiveOwnAccounts"
                            defaultChecked={user.canArchiveOwnAccounts}
                          />
                          Archive Own Accounts
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name="canDeleteOwnAccounts"
                            defaultChecked={user.canDeleteOwnAccounts}
                          />
                          Delete Own Accounts
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name="canUseCopilot"
                            defaultChecked={user.canUseCopilot}
                          />
                          Use Copilot
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name="canViewAnalytics"
                            defaultChecked={user.canViewAnalytics}
                          />
                          View Analytics
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name="canViewReports"
                            defaultChecked={user.canViewReports}
                          />
                          View Reports
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name="canManageUsers"
                            defaultChecked={user.canManageUsers}
                          />
                          Manage Users
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name="canManageSystem"
                            defaultChecked={user.canManageSystem}
                          />
                          Manage System
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="mt-4 rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 hover:bg-blue-500/20"
                      >
                        Save Permissions
                      </button>
                    </form>
                  )}

                  <form
                    action={resetUserPassword}
                    className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <input
                      type="hidden"
                      name="userId"
                      value={user.id}
                    />

                    <input
                      type="password"
                      name="password"
                      placeholder="Nuova password"
                      required
                      className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                    />

                    <button
                      type="submit"
                      className="rounded-xl bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20"
                    >
                      Reset password
                    </button>
                  </form>

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