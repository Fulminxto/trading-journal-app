import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
  formatAdminDateTime,
  getAdminI18n,
} from "../AdminI18n";

export default async function AdminActivityPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (
    !currentUser ||
    (currentUser.role !== "FOUNDER" &&
      currentUser.role !== "ADMIN")
  ) {
    redirect("/accounts");
  }

  const { language, t } = getAdminI18n(
    currentUser.appLanguage
  );

  const activities = await prisma.activityLog.findMany({
    include: {
      user: true,
      account: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 200,
  });

  return (
    <div>
      <div className="mb-10">
        <p className="text-sm text-accent">
          {t.platformIntelligence}
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          {t.platformActivity}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          {t.activityDescription}
        </p>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                      {activity.type}
                    </span>

                    {activity.user && (
                      <span className="rounded-xl bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                        {activity.user.username}
                      </span>
                    )}

                    {activity.account && (
                      <span className="rounded-xl bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                        {activity.account.name}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold">
                    {activity.title}
                  </h2>

                  {activity.description && (
                    <p className="mt-2 text-sm text-gray-400">
                      {activity.description}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-gray-600">
                    {formatAdminDateTime(
                      activity.createdAt,
                      language
                    )}
                  </p>
                </div>

                {activity.accountId && (
                  <Link
                    href={`/accounts/${activity.accountId}/dashboard`}
                    className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/20"
                  >
                    {t.openAccount}
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">
            {t.noActivity}
          </div>
        )}
      </div>
    </div>
  );
}
