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

import {
  formatAdminDate,
  formatAdminDateTime,
  getAdminI18n,
} from "./AdminI18n";

function getServerTimestamp() {
  return Date.now();
}

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

  if (!currentUser || currentUser.role !== "FOUNDER") {
    redirect("/accounts");
  }

  const { language, t } = getAdminI18n(
    currentUser.appLanguage
  );

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

  const now = await getServerTimestamp();

  return (
    <div>
      <div className="mb-10">
        <p className="text-sm text-gray-400">
          {t.platformControl}
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          {t.adminPanel}
        </h1>
      </div>

      <form
        action={createUser}
        className="mb-8 grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-4"
      >
        <input
          name="username"
          placeholder={t.username}
          className="rounded-xl bg-zinc-900 p-3"
          required
        />

        <input
          name="password"
          type="password"
          placeholder={t.password}
          className="rounded-xl bg-zinc-900 p-3"
          required
        />

        <input
          name="name"
          placeholder={t.name}
          className="rounded-xl bg-zinc-900 p-3"
        />

        <select
          name="role"
          defaultValue="MEMBER"
          aria-label={t.newUserRole}
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="MEMBER">MEMBER</option>
          <option value="VIEWER">VIEWER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="FOUNDER">FOUNDER</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-accent p-3 font-bold text-white md:col-span-4"
        >
          {t.createUser}
        </button>
      </form>

      <div className="space-y-6">
        {users.map((user) => {
          const isCurrentUser =
            user.id === currentUser.id;

          const isSelfFounder =
            isCurrentUser && user.role === "FOUNDER";

          const isFrozen =
            user.status === "FROZEN";

          const isOnline =
            user.lastActivityAt &&
            now -
            new Date(user.lastActivityAt).getTime() <
            5 * 60 * 1000;

          return (
            <div
              key={user.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold">
                      {user.username}
                    </h2>

                    {isOnline ? (
                      <span className="rounded-xl bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-accent">
                        {t.online}
                      </span>
                    ) : (
                      <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                        {t.offline}
                      </span>
                    )}

                    {isFrozen && (
                      <span className="rounded-xl bg-yellow-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-yellow-300">
                        {t.frozen}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-gray-400">
                    {user.name || t.noName}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    {t.created}:{" "}
                    {formatAdminDate(
                      user.createdAt,
                      language
                    )}
                  </p>

                  {user.loginCount > 0 && (
                    <p className="mt-1 text-xs text-gray-500">
                      {t.logins}: {user.loginCount}
                    </p>
                  )}

                  {user.lastLoginAt && (
                    <p className="mt-1 text-xs text-gray-500">
                      {t.lastLogin}:{" "}
                      {formatAdminDateTime(
                        user.lastLoginAt,
                        language
                      )}
                    </p>
                  )}

                  {user.lastActivityAt && (
                    <p className="mt-1 text-xs text-gray-500">
                      {t.lastActivity}:{" "}
                      {formatAdminDateTime(
                        user.lastActivityAt,
                        language
                      )}
                    </p>
                  )}

                  {user.lastSeenAt && (
                    <p className="mt-1 text-xs text-gray-500">
                      {t.lastSeen}:{" "}
                      {formatAdminDateTime(
                        user.lastSeenAt,
                        language
                      )}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {isSelfFounder ? (
                    <div className="rounded-xl bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
                      {t.founderSystemAdmin}
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
                        aria-label={t.userRole}
                        className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
                      >
                        <option value="FOUNDER">FOUNDER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>

                      <button
                        type="submit"
                        className="rounded-xl bg-accent/10 px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/20"
                      >
                        {t.save}
                      </button>
                    </form>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {!isCurrentUser && (
                      <>
                        {isFrozen ? (
                          <form action={unfreezeUser}>
                            <input
                              type="hidden"
                              name="userId"
                              value={user.id}
                            />

                            <button
                              type="submit"
                              className="rounded-xl bg-accent/10 px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/20"
                            >
                              {t.unfreeze}
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
                              className="rounded-xl bg-yellow-500/10 px-3 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-500/20"
                            >
                              {t.freeze}
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
                            className="rounded-xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20"
                          >
                            {t.delete}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {!isSelfFounder && (
                <form
                  action={updateUserPermissions}
                  className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <input
                    type="hidden"
                    name="userId"
                    value={user.id}
                  />

                  <p className="mb-3 text-sm font-semibold text-gray-300">
                    {t.globalPermissions}
                  </p>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="canCreatePersonalAccounts"
                        defaultChecked={user.canCreatePersonalAccounts}
                      />
                      {t.createPersonalAccounts}
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="canCreateSharedAccounts"
                        defaultChecked={user.canCreateSharedAccounts}
                      />
                      {t.createSharedAccounts}
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="canArchiveOwnAccounts"
                        defaultChecked={user.canArchiveOwnAccounts}
                      />
                      {t.archiveOwnAccounts}
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="canDeleteOwnAccounts"
                        defaultChecked={user.canDeleteOwnAccounts}
                      />
                      {t.deleteOwnAccounts}
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="canUseCopilot"
                        defaultChecked={user.canUseCopilot}
                      />
                      {t.useCopilot}
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="canViewAnalytics"
                        defaultChecked={user.canViewAnalytics}
                      />
                      {t.viewAnalytics}
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="canViewReports"
                        defaultChecked={user.canViewReports}
                      />
                      {t.viewReports}
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="canManageUsers"
                        defaultChecked={user.canManageUsers}
                      />
                      {t.manageUsers}
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="canManageSystem"
                        defaultChecked={user.canManageSystem}
                      />
                      {t.manageSystem}
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-4 rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 hover:bg-blue-500/20"
                  >
                    {t.savePermissions}
                  </button>
                </form>
              )}

              <form
                action={resetUserPassword}
                className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_auto]"
              >
                <input
                  type="hidden"
                  name="userId"
                  value={user.id}
                />

                <input
                  name="password"
                  type="password"
                  placeholder={t.newPassword}
                  className="rounded-xl bg-zinc-900 p-3"
                  required
                />

                <button
                  type="submit"
                  className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/20"
                >
                  {t.resetPassword}
                </button>
              </form>

              {user.memberships.length > 0 && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="mb-3 text-sm font-semibold text-gray-300">
                    {t.accountMemberships}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {user.memberships.map((membership) => (
                      <div
                        key={membership.id}
                        className="rounded-xl bg-white/10 px-3 py-2 text-xs text-gray-300"
                      >
                        {membership.tradingAccount.name} ·{" "}
                        {membership.role}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}




