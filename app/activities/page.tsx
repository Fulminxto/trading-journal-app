import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatValue(value: unknown) {
    if (typeof value === "boolean") {
        return value ? "Enabled" : "Disabled";
    }

    if (value === null || value === undefined) {
        return "-";
    }

    return String(value);
}

function getChanges(metadata: unknown) {
    if (!isRecord(metadata)) {
        return [];
    }

    const before = metadata.before;
    const after = metadata.after;

    if (!isRecord(before) || !isRecord(after)) {
        if (
            "field" in metadata &&
            "before" in metadata &&
            "after" in metadata
        ) {
            return [
                {
                    field: String(metadata.field),
                    before: metadata.before,
                    after: metadata.after,
                },
            ];
        }

        return [];
    }

    return Object.keys(after)
        .filter((key) => before[key] !== after[key])
        .map((key) => ({
            field: key,
            before: before[key],
            after: after[key],
        }));
}

export default async function ActivitiesPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const memberships = await prisma.accountMember.findMany({
        where: {
            userId: session.user.id,
        },
        select: {
            tradingAccountId: true,
        },
    });

    const accountIds = memberships.map(
        (membership) => membership.tradingAccountId
    );

    const activities = await prisma.activityLog.findMany({
        where: {
            OR: [
                {
                    userId: session.user.id,
                },
                {
                    accountId: {
                        in: accountIds,
                    },
                },
            ],
        },
        include: {
            user: true,
            account: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 100,
    });

    return (
        <div>
            <div className="mb-10">
                <p className="text-sm text-green-400">
                    Activity Feed
                </p>

                <h1 className="mt-2 text-4xl font-bold">
                    Recent Activity
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                    Cronologia intelligente delle attività legate ai tuoi account, trade e permessi.
                </p>
            </div>

            <div className="space-y-4">
                {activities.length > 0 ? (
                    activities.map((activity) => {
                        const changes = getChanges(activity.metadata);

                        return (
                            <div
                                key={activity.id}
                                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex-1">
                                        <div className="mb-3 flex flex-wrap items-center gap-2">
                                            <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                                                {activity.type}
                                            </span>

                                            {activity.account && (
                                                <span className="rounded-xl bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                                                    {activity.account.name}
                                                </span>
                                            )}

                                            {activity.user && (
                                                <span className="rounded-xl bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                                                    {activity.user.username}
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

                                        {changes.length > 0 && (
                                            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                                                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                                                    Changes
                                                </p>

                                                <div className="space-y-2">
                                                    {changes.map((change) => (
                                                        <div
                                                            key={change.field}
                                                            className="grid grid-cols-1 gap-2 rounded-xl bg-white/[0.03] p-3 text-sm md:grid-cols-[1fr_auto_auto]"
                                                        >
                                                            <span className="font-semibold text-white">
                                                                {change.field}
                                                            </span>

                                                            <span className="rounded-lg bg-red-500/10 px-2 py-1 text-xs font-bold text-red-300">
                                                                {formatValue(change.before)}
                                                            </span>

                                                            <span className="rounded-lg bg-green-500/10 px-2 py-1 text-xs font-bold text-green-300">
                                                                {formatValue(change.after)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <p className="mt-3 text-xs text-gray-600">
                                            {new Date(activity.createdAt).toLocaleString("it-IT")}
                                        </p>
                                    </div>

                                    {activity.accountId && (
                                        <Link
                                            href={`/accounts/${activity.accountId}`}
                                            className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/20"
                                        >
                                            Open Account
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">
                        Nessuna attività registrata per ora.
                    </div>
                )}
            </div>
        </div>
    );
}
