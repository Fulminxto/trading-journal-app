import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getAccountPermissions } from "@/lib/permissions";

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

    const membership = await getAccountPermissions(
        session.user.id,
        accountId
    );

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