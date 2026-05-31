import {
    Activity,
    Clock3,
    Users,
    TrendingUp,
} from "lucide-react";

import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function getActivityStatus(
    lastSeenAt: Date | null
) {
    if (!lastSeenAt) {
        return {
            label: "Inactive",
            color:
                "bg-red-500/10 text-red-300 border-red-500/20",
        };
    }

    const now = new Date().getTime();

    const diff =
        now - new Date(lastSeenAt).getTime();

    const days = diff / (1000 * 60 * 60 * 24);

    if (days < 1) {
        return {
            label: "Active Today",
            color:
                "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
        };
    }

    if (days < 7) {
        return {
            label: "Active This Week",
            color:
                "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
        };
    }

    return {
        label: "Inactive",
        color:
            "bg-red-500/10 text-red-300 border-red-500/20",
    };
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

    const mostActiveMember =
        membersWithStats
            .slice()
            .sort(
                (a, b) =>
                    b.totalTrades - a.totalTrades
            )[0];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-6">
                <div>
                    <p className="text-sm text-gray-400">
                        Account Members
                    </p>

                    <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
                        <Users className="text-cyan-400" />
                        Members Activity
                    </h1>

                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
                        Monitora l’attività operativa dei membri
                        dell’account condiviso.
                    </p>
                </div>

                <Link
                    href={`/accounts/${accountId}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-gray-300 transition hover:bg-white/[0.05]"
                >
                    Back
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                        Members
                    </p>

                    <p className="mt-4 text-3xl font-black text-white">
                        {members.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                        Total Trades
                    </p>

                    <p className="mt-4 text-3xl font-black text-white">
                        {totalAccountTrades}
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                        Last Trade
                    </p>

                    <p className="mt-4 text-lg font-black text-white">
                        {lastAccountTrade
                            ? `${lastAccountTrade.symbol}`
                            : "No trades"}
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                        Most Active
                    </p>

                    <p className="mt-4 text-lg font-black text-white">
                        {mostActiveMember
                            ? mostActiveMember.user.username
                            : "N/A"}
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {membersWithStats.map((member) => {
                    const activity =
                        getActivityStatus(
                            member.user.lastActivityAt
                        );

                    return (
                        <div
                            key={member.id}
                            className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8"
                        >
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="text-3xl font-black text-white">
                                            {member.user.username}
                                        </h2>

                                        <div
                                            className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${activity.color}`}
                                        >
                                            {activity.label}
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm text-gray-500">
                                        Role: {member.role}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Logins: {member.user.loginCount}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-cyan-300">
                                    {member.totalTrades} Trades
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                    <div className="flex items-center gap-3">
                                        <Clock3
                                            size={18}
                                            className="text-cyan-400"
                                        />

                                        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                                            Last Activity
                                        </p>

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
                                                {member.user.lastLoginAt
                                                    ? new Date(
                                                        member.user.lastLoginAt
                                                    ).toLocaleString("it-IT")
                                                    : "Never"}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-lg font-black text-white">
                                        {member.user.lastSeenAt
                                            ? new Date(
                                                member.user.lastSeenAt
                                            ).toLocaleString()
                                            : "No activity"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                    <div className="flex items-center gap-3">
                                        <Activity
                                            size={18}
                                            className="text-cyan-400"
                                        />

                                        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                                            Last Trade Logged
                                        </p>
                                    </div>

                                    <p className="mt-4 text-lg font-black text-white">
                                        {member.lastTrade
                                            ? `${member.lastTrade.symbol} • ${member.lastTrade.openDate}`
                                            : "No trades"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp
                                            size={18}
                                            className="text-cyan-400"
                                        />

                                        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                                            Contribution
                                        </p>
                                    </div>

                                    <p className="mt-4 text-lg font-black text-white">
                                        {member.totalTrades} trades inserted
                                    </p>
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
                                        href={`/accounts/${accountId}/members`}
                                        className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-3 text-sm font-bold text-yellow-300 transition hover:bg-yellow-500/20"
                                    >
                                        Activity Reminder
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}