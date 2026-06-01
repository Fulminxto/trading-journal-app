import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

function isOnline(date?: Date | null) {
    if (!date) return false;

    return Date.now() - new Date(date).getTime() < 5 * 60 * 1000;
}

function formatDate(date?: Date | null) {
    if (!date) return "Never";

    return new Date(date).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatPercent(value: number) {
    return `${value.toFixed(0)}%`;
}

function getActivityTone(type: string) {
    const normalizedType = type.toLowerCase();

    if (
        normalizedType.includes("delete") ||
        normalizedType.includes("error") ||
        normalizedType.includes("freeze")
    ) {
        return "bg-red-500/10 text-red-300";
    }

    if (
        normalizedType.includes("create") ||
        normalizedType.includes("import") ||
        normalizedType.includes("sync")
    ) {
        return "bg-green-500/10 text-green-300";
    }

    if (
        normalizedType.includes("update") ||
        normalizedType.includes("edit") ||
        normalizedType.includes("reset")
    ) {
        return "bg-yellow-500/10 text-yellow-300";
    }

    return "bg-white/10 text-gray-300";
}

export default async function WorkspacePage({
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

    if (
        membership.role !== "MANAGER" &&
        !membership.canViewMembers
    ) {
        redirect(`/accounts/${accountId}/dashboard`);
    }

    if (
        membership.tradingAccount.status === "ARCHIVED"
    ) {
        redirect(`/accounts/${accountId}/dashboard`);
    }

    await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            lastSeenAt: new Date(),
            lastActivityAt: new Date(),
        },
    });

    const members = await prisma.accountMember.findMany({
        where: {
            tradingAccountId: accountId,
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const activities = await prisma.activityLog.findMany({
        where: {
            accountId,
        },
        include: {
            user: true,
            account: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });

    const onlineMembers = members.filter((member) =>
        isOnline(member.user.lastActivityAt)
    );

    const activeToday = members.filter((member) => {
        if (!member.user.lastActivityAt) return false;

        const lastActivity = new Date(member.user.lastActivityAt);
        const now = new Date();

        return (
            lastActivity.getDate() === now.getDate() &&
            lastActivity.getMonth() === now.getMonth() &&
            lastActivity.getFullYear() === now.getFullYear()
        );
    });

    const inactiveMembers = members.filter(
        (member) => !isOnline(member.user.lastActivityAt)
    );

    const mostActiveMembers = [...members]
        .sort((a, b) => b.user.loginCount - a.user.loginCount)
        .slice(0, 5);

    const activeTodayRate =
        members.length > 0
            ? (activeToday.length / members.length) * 100
            : 0;

    const onlineRate =
        members.length > 0
            ? (onlineMembers.length / members.length) * 100
            : 0;

    const workspaceHealth =
        members.length === 0
            ? "Waiting for members"
            : activeToday.length === members.length
                ? "Fully active today"
                : onlineMembers.length > 0
                    ? "Live activity detected"
                    : activeToday.length > 0
                        ? "Activity recorded today"
                        : "Quiet workspace";

    const recentActivityCount = activities.length;

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_35%)]" />

                <div className="relative z-10 grid gap-8 xl:grid-cols-5">
                    <div className="xl:col-span-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
                            Workspace Intelligence
                        </p>

                        <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                            {membership.tradingAccount.name}
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400">
                            Monitoraggio del team, attività recenti, membri online e utilizzo reale del workspace.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href={`/accounts/${accountId}/members`}
                                className="rounded-2xl bg-green-400 px-4 py-3 text-sm font-black text-black transition hover:bg-green-300"
                            >
                                Manage Members
                            </Link>

                            <Link
                                href="/activities"
                                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                            >
                                View Activity
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 xl:col-span-2 xl:grid-cols-1">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <p className="text-sm text-gray-400">
                                Workspace Status
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-white">
                                {workspaceHealth}
                            </h2>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <p className="text-sm text-gray-400">
                                Active Today
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-blue-400">
                                {formatPercent(activeTodayRate)}
                            </h2>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <p className="text-sm text-gray-400">
                                Live Presence
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-green-400">
                                {formatPercent(onlineRate)}
                            </h2>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Members
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-white">
                        {members.length}
                    </h2>

                    <p className="mt-3 text-xs text-gray-500">
                        Total members inside this account.
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Online Now
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-green-400">
                        {onlineMembers.length}
                    </h2>

                    <p className="mt-3 text-xs text-gray-500">
                        Active in the last 5 minutes.
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Active Today
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-blue-400">
                        {activeToday.length}
                    </h2>

                    <p className="mt-3 text-xs text-gray-500">
                        Members with activity today.
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Recent Events
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-yellow-300">
                        {recentActivityCount}
                    </h2>

                    <p className="mt-3 text-xs text-gray-500">
                        Latest activity records loaded.
                    </p>
                </div>
            </section>

            <section className="grid items-stretch gap-6 xl:grid-cols-2">
                <div className="flex">
                    <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Leaderboard
                                </p>

                                <h2 className="text-2xl font-black text-white">
                                    Most Active Members
                                </h2>
                            </div>

                            <span className="rounded-xl bg-green-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-green-400">
                                Top 5
                            </span>
                        </div>

                        <div className="space-y-3">
                            {mostActiveMembers.length > 0 ? (
                                mostActiveMembers.map((member, index) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-sm font-black text-green-400">
                                                #{index + 1}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-bold text-white">
                                                    {member.user.name ||
                                                        member.user.username}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {member.role}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="font-black text-white">
                                                {member.user.loginCount}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                logins
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-gray-400">
                                    Nessun membro disponibile.
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="flex">
                    <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Live Presence
                                </p>

                                <h2 className="text-2xl font-black text-white">
                                    Online Members
                                </h2>
                            </div>

                            <span className="rounded-xl bg-green-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-green-400">
                                {onlineMembers.length} Online
                            </span>
                        </div>

                        <div className="space-y-3">
                            {onlineMembers.length > 0 ? (
                                onlineMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-bold text-white">
                                                {member.user.name ||
                                                    member.user.username}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Last activity:{" "}
                                                {formatDate(
                                                    member.user.lastActivityAt
                                                )}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-xl bg-green-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-green-400">
                                            Online
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-gray-400">
                                    Nessun membro online ora.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </section>

            <section className="grid items-stretch gap-6 xl:grid-cols-2">
                <div className="flex">
                    <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Attention
                                </p>

                                <h2 className="text-2xl font-black text-white">
                                    Inactive Members
                                </h2>
                            </div>

                            <span className="rounded-xl bg-yellow-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-yellow-300">
                                {inactiveMembers.length} Offline
                            </span>
                        </div>

                        <div className="space-y-3">
                            {inactiveMembers.length > 0 ? (
                                inactiveMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-bold text-white">
                                                {member.user.name ||
                                                    member.user.username}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Last activity:{" "}
                                                {formatDate(
                                                    member.user.lastActivityAt
                                                )}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-xl bg-yellow-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-yellow-300">
                                            Offline
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-6 text-sm text-green-400">
                                    Tutti i membri risultano attivi.
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="flex">
                    <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Audit
                                </p>

                                <h2 className="text-2xl font-black text-white">
                                    Recent Activity
                                </h2>
                            </div>

                            <Link
                                href="/activities"
                                className="shrink-0 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {activities.length > 0 ? (
                                activities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="rounded-2xl border border-white/10 bg-black/20 p-4"
                                    >
                                        <div className="mb-2 flex flex-wrap gap-2">
                                            <span
                                                className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getActivityTone(
                                                    activity.type
                                                )}`}
                                            >
                                                {activity.type}
                                            </span>

                                            {activity.user && (
                                                <span className="rounded-lg bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-400">
                                                    {activity.user.username}
                                                </span>
                                            )}
                                        </div>

                                        <p className="font-bold text-white">
                                            {activity.title}
                                        </p>

                                        {activity.description && (
                                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                                {activity.description}
                                            </p>
                                        )}

                                        <p className="mt-2 text-xs text-gray-600">
                                            {formatDate(activity.createdAt)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-gray-400">
                                    Nessuna attività recente.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}
