import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getString(value: unknown): string {
    if (typeof value !== "string") return "";
    return value.trim();
}

export async function POST(request: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    const data = body as Record<string, unknown>;

    const endpoint = getString(data.endpoint);
    const p256dh = getString(data.p256dh);
    const authKey = getString(data.auth);
    const deviceLabel =
        getString(data.deviceLabel) || null;

    if (!endpoint || !p256dh || !authKey) {
        return NextResponse.json(
            {
                error: "Missing required fields: endpoint, p256dh, auth",
            },
            { status: 400 }
        );
    }

    await prisma.pushSubscription.upsert({
        where: { endpoint },
        update: {
            p256dh,
            auth: authKey,
            deviceLabel,
            userId: session.user.id,
        },
        create: {
            endpoint,
            p256dh,
            auth: authKey,
            deviceLabel,
            userId: session.user.id,
        },
    });

    return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    const data = body as Record<string, unknown>;
    const endpoint = getString(data.endpoint);

    if (!endpoint) {
        return NextResponse.json(
            { error: "Missing required field: endpoint" },
            { status: 400 }
        );
    }

    await prisma.pushSubscription.deleteMany({
        where: {
            endpoint,
            userId: session.user.id,
        },
    });

    return NextResponse.json({ ok: true });
}
