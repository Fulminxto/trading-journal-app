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

    return new Date(date).toLocaleString("it-IT");
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

    return (
        <div>
            <div className="mb-10">
                <p className="text-sm text-green-400">
                    Workspace Intelligence
                </p>

                <h1 className="mt-2 text-4xl font-bold">
                    {membership.tradingAccount.name}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                    Monitoraggio intelligente del team, attività recenti, membri online e utilizzo reale del workspace.
                </p>
            </div>

            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">Members</p>
                    <h2 className="mt-2 text-3xl font-black">
                        {members.length}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">Online Now</p>
                    <h2 className="mt-2 text-3xl font-black text-green-400">
                        {onlineMembers.length}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">Active Today</p>
                    <h2 className="mt-2 text-3xl font-black text-blue-400">
                        {activeToday.length}
                    </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">Inactive</p>
                    <h2 className="mt-2 text-3xl font-black text-yellow-300">
                        {inactiveMembers.length}
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-400">
                            Leaderboard
                        </p>

                        <h2 className="text-2xl font-black">
                            Most Active Members
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {mostActiveMembers.map((member, index) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10 text-sm font-black text-green-400">
                                        #{index + 1}
                                    </div>

                                    <div>
                                        <p className="font-bold text-white">
                                            {member.user.name ||
                                                member.user.username}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-black text-white">
                                        {member.user.loginCount}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        logins
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-400">
                            Live Presence
                        </p>

                        <h2 className="text-2xl font-black">
                            Online Members
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {onlineMembers.length > 0 ? (
                            onlineMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-4"
                                >
                                    <div>
                                        <p className="font-bold text-white">
                                            {member.user.name ||
                                                member.user.username}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Last activity:{" "}
                                            {formatDate(
                                                member.user.lastActivityAt
                                            )}
                                        </p>
                                    </div>

                                    <span className="rounded-xl bg-green-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-green-400">
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

                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-400">
                            Attention
                        </p>

                        <h2 className="text-2xl font-black">
                            Inactive Members
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {inactiveMembers.length > 0 ? (
                            inactiveMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
                                >
                                    <div>
                                        <p className="font-bold text-white">
                                            {member.user.name ||
                                                member.user.username}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Last activity:{" "}
                                            {formatDate(
                                                member.user.lastActivityAt
                                            )}
                                        </p>
                                    </div>

                                    <span className="rounded-xl bg-yellow-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-yellow-300">
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

                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-400">
                                Audit
                            </p>

                            <h2 className="text-2xl font-black">
                                Recent Activity
                            </h2>
                        </div>

                        <Link
                            href="/activities"
                            className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
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
                                        <span className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-gray-300">
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
                                        <p className="mt-1 text-sm text-gray-500">
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
        </div>
    );
}