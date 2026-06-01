import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    _request: NextRequest,
    {
        params,
    }: {
        params: Promise<{
            accountId: string;
        }>;
    }
) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }

    const { accountId } = await params;

    const membership =
        await prisma.accountMember.findFirst({
            where: {
                userId: session.user.id,
                tradingAccountId: accountId,
            },
            select: {
                role: true,

                canCreateTrades: true,
                canEditTrades: true,
                canDeleteTrades: true,

                canViewAnalytics: true,
                canViewReports: true,
                canViewCopilot: true,
                canViewMembers: true,

                canManageMembers: true,
                canManageRoles: true,
                canManageAccount: true,
            },
        });

    if (!membership) {
        return NextResponse.json(
            {
                error: "Membership not found",
            },
            {
                status: 404,
            }
        );
    }

    return NextResponse.json({
        membership,
    });
}