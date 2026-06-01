import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type TradeSyncHealthPayload = {
    tradingAccountId?: string;
    source?: string;
};

function getString(value: unknown) {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
}

function getSource(value: unknown) {
    const source = getString(value).toLowerCase();

    if (source === "mt5" || source === "broker") {
        return source;
    }

    return null;
}

function isSourceAllowedForMode({
    integrationMode,
    source,
}: {
    integrationMode: string | null;
    source: "mt5" | "broker";
}) {
    if (integrationMode === "mt5") {
        return source === "mt5";
    }

    if (integrationMode === "broker") {
        return source === "broker";
    }

    if (integrationMode === "hybrid") {
        return source === "mt5" || source === "broker";
    }

    return false;
}

export async function POST(request: NextRequest) {
    const expectedSecret =
        process.env.TRADE_SYNC_SECRET;

    if (!expectedSecret) {
        return NextResponse.json(
            {
                ok: false,
                error: "Trade sync is not configured",
            },
            {
                status: 500,
            }
        );
    }

    const providedSecret =
        request.headers.get("x-voltis-sync-secret");

    if (providedSecret !== expectedSecret) {
        return NextResponse.json(
            {
                ok: false,
                error: "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }

    let payload: TradeSyncHealthPayload;

    try {
        payload = await request.json();
    } catch {
        return NextResponse.json(
            {
                ok: false,
                error: "Invalid JSON payload",
            },
            {
                status: 400,
            }
        );
    }

    const tradingAccountId = getString(
        payload.tradingAccountId
    );

    const source = getSource(payload.source);

    if (!tradingAccountId || !source) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    "Missing required fields: tradingAccountId, source",
            },
            {
                status: 400,
            }
        );
    }

    const account =
        await prisma.tradingAccount.findUnique({
            where: {
                id: tradingAccountId,
            },
            select: {
                id: true,
                name: true,
                status: true,

                integrationMode: true,
                autoSyncEnabled: true,

                mt5Enabled: true,
                brokerSyncEnabled: true,

                syncStatus: true,
                lastSyncedAt: true,
            },
        });

    if (!account) {
        return NextResponse.json(
            {
                ok: false,
                error: "Trading account not found",
            },
            {
                status: 404,
            }
        );
    }

    if (account.status === "ARCHIVED") {
        return NextResponse.json(
            {
                ok: false,
                error:
                    "Trade sync is disabled for archived accounts",
                account: {
                    id: account.id,
                    name: account.name,
                    status: account.status,
                },
            },
            {
                status: 403,
            }
        );
    }

    if (account.integrationMode === "manual") {
        return NextResponse.json(
            {
                ok: false,
                error:
                    "Trade sync is disabled because this account is set to Manual Only",
                account: {
                    id: account.id,
                    name: account.name,
                    integrationMode:
                        account.integrationMode,
                },
            },
            {
                status: 403,
            }
        );
    }

    const sourceAllowedByMode =
        isSourceAllowedForMode({
            integrationMode: account.integrationMode,
            source,
        });

    if (!sourceAllowedByMode) {
        return NextResponse.json(
            {
                ok: false,
                error: `Source "${source}" is not allowed for integration mode "${account.integrationMode}"`,
                account: {
                    id: account.id,
                    name: account.name,
                    integrationMode:
                        account.integrationMode,
                },
            },
            {
                status: 403,
            }
        );
    }

    if (source === "mt5" && !account.mt5Enabled) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    "MT5 sync is not enabled for this account",
            },
            {
                status: 403,
            }
        );
    }

    if (
        source === "broker" &&
        !account.brokerSyncEnabled
    ) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    "Broker sync is not enabled for this account",
            },
            {
                status: 403,
            }
        );
    }

    if (!account.autoSyncEnabled) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    "Auto sync is not enabled for this account",
            },
            {
                status: 403,
            }
        );
    }

    return NextResponse.json({
        ok: true,
        message: "Trade sync is ready",
        account: {
            id: account.id,
            name: account.name,
            status: account.status,
            integrationMode: account.integrationMode,
            autoSyncEnabled: account.autoSyncEnabled,
            mt5Enabled: account.mt5Enabled,
            brokerSyncEnabled:
                account.brokerSyncEnabled,
            syncStatus: account.syncStatus,
            lastSyncedAt: account.lastSyncedAt,
        },
        source,
    });
}