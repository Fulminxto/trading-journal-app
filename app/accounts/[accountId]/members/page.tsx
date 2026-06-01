import {
    Activity,
    ArrowLeft,
    BarChart3,
    Clock3,
    Radio,
    TrendingUp,
    Users,
} from "lucide-react";

import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function formatDateTime(date: Date | null) {
    if (!date) {
        return "Never";
    }

    return new Date(date).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDate(date: Date | null) {
    if (!date) {
        return "Never";
    }

    return new Date(date).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function getActivityStatus(lastActivityAt: Date | null) {
    if (!lastActivityAt) {
        return {
            label: "Inactive",
            color:
                "bg-red-500/10 text-red-300 border-red-500/20",
            dot: "bg-red-400",
        };
    }

    const now = new Date().getTime();

    const diff =
        now - new Date(lastActivityAt).getTime();

    const minutes = diff / (1000 * 60);
    const days = diff / (1000 * 60 * 60 * 24);

    if (minutes <= 5) {
        return {
            label: "Online Now",
            color:
                "bg-green-500/10 text-green-300 border-green-500/20",
            dot: "bg-green-400",
        };
    }

    if (days < 1) {
        return {
            label: "Active Today",
            color:
                "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
            dot: "bg-cyan-400",
        };
    }

    if (days < 7) {
        return {
            label: "Active This Week",
            color:
                "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
            dot: "bg-yellow-400",
        };
    }

    return {
        label: "Inactive",
        color:
            "bg-red-500/10 text-red-300 border-red-500/20",
        dot: "bg-red-400",
    };
}

function isOnline(lastActivityAt: Date | null) {
    if (!lastActivityAt) {
        return false;
    }

    const now = new Date().getTime();

    const diff =
        now - new Date(lastActivityAt).getTime();

    return diff <= 1000 * 60 * 5;
}

function getRoleTone(role: string) {
    if (role === "MANAGER") {
        return "border-green-500/20 bg-green-500/10 text-green-300";
    }

    if (role === "MEMBER") {
        return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
    }

    if (role === "VIEWER") {
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
    }

    return "border-white/10 bg-white/[0.03] text-gray-300";
}

export default async function MembersPage({
    params,
}: {
    params: Promise<{
        accountId: string;
    }>;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { accountId } = await params;

    const membership =
        await prisma.accountMember.findFirst({
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

    await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            lastSeenAt: new Date(),
            lastActivityAt: new Date(),
        },
    });

    const members =
        await prisma.accountMember.findMany({
            where: {
                tradingAccountId: accountId,
            },

            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        role: true,
                        lastSeenAt: true,
                        lastLoginAt: true,
                        lastActivityAt: true,
                        loginCount: true,
                    },
                },
            },

            orderBy: [
                {
                    role: "asc",
                },
                {
                    createdAt: "asc",
                },
            ],
        });

    const membersWithStats =
        await Promise.all(
            members.map(async (member) => {
                const lastTrade =
                    await prisma.trade.findFirst({
                        where: {
                            tradingAccountId: accountId,
                            createdById: member.userId,
                        },

                        orderBy: [
                            {
                                openDate: "desc",
                            },
                            {
                                openTime: "desc",
                            },
                            {
                                createdAt: "desc",
                            },
                        ],
                    });

                const totalTrades =
                    await prisma.trade.count({
                        where: {
                            tradingAccountId: accountId,
                            createdById: member.userId,
                        },
                    });

                return {
                    ...member,

                    lastTrade,
                    totalTrades,
                };
            })
        );

    const totalAccountTrades =
        await prisma.trade.count({
            where: {
                tradingAccountId: accountId,
            },
        });

    const lastAccountTrade =
        await prisma.trade.findFirst({
            where: {
                tradingAccountId: accountId,
            },
            orderBy: [
                {
                    openDate: "desc",
                },
                {
                    openTime: "desc",
                },
                {
                    createdAt: "desc",
                },
            ],
        });

    const sortedByActivity =
        membersWithStats
            .slice()
            .sort(
                (a, b) =>
                    b.totalTrades - a.totalTrades
            );

    const mostActiveMember =
        sortedByActivity[0];

    const onlineMembers =
        membersWithStats.filter((member) =>
            isOnline(member.user.lastActivityAt)
        );

    const activeToday =
        membersWithStats.filter((member) => {
            if (!member.user.lastActivityAt) {
                return false;
            }

            const diff =
                new Date().getTime() -
                new Date(
                    member.user.lastActivityAt
                ).getTime();

            return diff <= 1000 * 60 * 60 * 24;
        });

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] p-8 md:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.08),transparent_30%)]" />

                <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                            <Users size={14} />
                            Account Members
                        </div>

                        <h1 className="mt-6 text-4xl font-black text-white md:text-6xl">
                            Members Activity
                        </h1>

                        <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-400 md:text-base">
                            Monitora presenza, attività e contributo operativo
                            dei membri dentro questo account condiviso.
                        </p>
                    </div>

                    <div className="grid min-w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[460px]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <p className="text-sm text-gray-400">
                                Members
                            </p>

                            <p className="mt-3 text-3xl font-black text-white">
                                {members.length}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-5">
                            <p className="text-sm text-gray-400">
                                Online Now
                            </p>

                            <p className="mt-3 text-3xl font-black text-green-400">
                                {onlineMembers.length}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5">
                            <p className="text-sm text-gray-400">
                                Active Today
                            </p>

                            <p className="mt-3 text-3xl font-black text-cyan-300">
                                {activeToday.length}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-5">
                            <p className="text-sm text-gray-400">
                                Total Trades
                            </p>

                            <p className="mt-3 text-3xl font-black text-yellow-300">
                                {totalAccountTrades}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Last Trade
                    </p>

                    <p className="mt-3 text-2xl font-black text-white">
                        {lastAccountTrade
                            ? lastAccountTrade.symbol
                            : "No trades"}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                        Latest trade across this account.
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Most Active
                    </p>

                    <p className="mt-3 text-2xl font-black text-white">
                        {mostActiveMember
                            ? mostActiveMember.user.username
                            : "N/A"}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                        Based on inserted trades.
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Live Presence
                    </p>

                    <p className="mt-3 text-2xl font-black text-green-400">
                        {members.length > 0
                            ? `${Math.round(
                                (onlineMembers.length /
                                    members.length) *
                                100
                            )}%`
                            : "0%"}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                        Active in the last 5 minutes.
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-sm text-gray-400">
                        Account Status
                    </p>

                    <p className="mt-3 text-2xl font-black text-cyan-300">
                        {onlineMembers.length > 0
                            ? "Live"
                            : "Quiet"}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                        Presence and activity snapshot.
                    </p>
                </div>
            </section>

            <section className="grid items-stretch gap-6 xl:grid-cols-2">
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-400">
                                Leaderboard
                            </p>

                            <h2 className="mt-1 text-3xl font-black text-white">
                                Most Active Members
                            </h2>
                        </div>

                        <div className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-green-300">
                            Top 5
                        </div>
                    </div>

                    <div className="mt-7 space-y-3">
                        {sortedByActivity
                            .slice(0, 5)
                            .map((member, index) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/10 text-lg font-black text-green-400">
                                            #{index + 1}
                                        </div>

                                        <div>
                                            <p className="text-lg font-black text-white">
                                                {
                                                    member.user
                                                        .username
                                                }
                                            </p>

                                            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">
                                                {member.role}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xl font-black text-white">
                                            {member.totalTrades}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            trades
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-400">
                                Live Presence
                            </p>

                            <h2 className="mt-1 text-3xl font-black text-white">
                                Online Members
                            </h2>
                        </div>

                        <div className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-green-300">
                            {onlineMembers.length} Online
                        </div>
                    </div>

                    <div className="mt-7 space-y-3">
                        {onlineMembers.length > 0 ? (
                            onlineMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between gap-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-4"
                                >
                                    <div>
                                        <p className="text-lg font-black text-white">
                                            {
                                                member.user
                                                    .username
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-green-300">
                                            Active now
                                        </p>
                                    </div>

                                    <Radio className="text-green-400" />
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-gray-400">
                                Nessun membro online ora.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="space-y-5">
                <div>
                    <p className="text-sm text-gray-400">
                        Member Overview
                    </p>

                    <h2 className="mt-1 text-3xl font-black text-white">
                        Account Team
                    </h2>
                </div>

                <div className="grid gap-6">
                    {membersWithStats.map((member) => {
                        const activity =
                            getActivityStatus(
                                member.user
                                    .lastActivityAt
                            );

                        return (
                            <div
                                key={member.id}
                                className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7"
                            >
                                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-3xl font-black text-white">
                                                {
                                                    member.user
                                                        .username
                                                }
                                            </h3>

                                            <div
                                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${activity.color}`}
                                            >
                                                <span
                                                    className={`h-2 w-2 rounded-full ${activity.dot}`}
                                                />
                                                {activity.label}
                                            </div>

                                            <div
                                                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${getRoleTone(
                                                    member.role
                                                )}`}
                                            >
                                                {member.role}
                                            </div>
                                        </div>

                                        <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-400">
                                            Activity profile based on
                                            login presence, last
                                            activity and trade
                                            contribution inside this
                                            account.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-sm font-black uppercase tracking-[0.15em] text-cyan-300">
                                        {member.totalTrades} Trades
                                    </div>
                                </div>

                                <div className="mt-7 grid gap-4 md:grid-cols-3">
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                        <div className="flex items-center gap-3">
                                            <Clock3
                                                size={18}
                                                className="text-cyan-400"
                                            />

                                            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                                                Last Activity
                                            </p>
                                        </div>

                                        <p className="mt-4 text-lg font-black text-white">
                                            {formatDateTime(
                                                member.user
                                                    .lastActivityAt ||
                                                member.user
                                                    .lastSeenAt
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                        <div className="flex items-center gap-3">
                                            <Clock3
                                                size={18}
                                                className="text-cyan-400"
                                            />

                                            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                                                Last Login
                                            </p>
                                        </div>

                                        <p className="mt-4 text-lg font-black text-white">
                                            {formatDateTime(
                                                member.user
                                                    .lastLoginAt
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                        <div className="flex items-center gap-3">
                                            <Activity
                                                size={18}
                                                className="text-cyan-400"
                                            />

                                            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                                                Last Trade
                                            </p>
                                        </div>

                                        <p className="mt-4 text-lg font-black text-white">
                                            {member.lastTrade
                                                ? `${member.lastTrade.symbol} · ${formatDate(
                                                    member
                                                        .lastTrade
                                                        .openDate
                                                )}`
                                                : "No trades"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        href={`/accounts/${accountId}/diary?member=${member.userId}`}
                                        className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20"
                                    >
                                        View Member Trades
                                    </Link>

                                    <Link
                                        href={`/accounts/${accountId}/members/${member.userId}`}
                                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/[0.06]"
                                    >
                                        Member Analytics
                                    </Link>

                                    <Link
                                        href={`/accounts/${accountId}/workspace`}
                                        className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-3 text-sm font-bold text-yellow-300 transition hover:bg-yellow-500/20"
                                    >
                                        Open Workspace
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <div>
                <Link
                    href={`/accounts/${accountId}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/[0.06]"
                >
                    <ArrowLeft size={16} />
                    Back to account
                </Link>
            </div>
        </div>
    );
}