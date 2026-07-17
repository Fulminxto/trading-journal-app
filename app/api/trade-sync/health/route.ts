import { NextRequest, NextResponse } from "next/server";

import {
    authenticateTradeSyncRequest,
    authorizeTradeSyncAccount,
    getTradeSyncSource,
} from "@/lib/trade-sync-auth";

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

export async function POST(request: NextRequest) {
    const authentication =
        authenticateTradeSyncRequest(request.headers);

    if (!authentication.authorized) {
        return NextResponse.json(
            {
                ok: false,
                error: authentication.error,
            },
            {
                status: authentication.status,
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

    const source = getTradeSyncSource(payload.source);

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

    const accessCheck =
        await authorizeTradeSyncAccount({
            tradingAccountId,
            source,
        });

    if (!accessCheck.allowed) {
        const account = accessCheck.account;
        const accountContext = account
            ? accessCheck.reason === "manual" ||
                    accessCheck.reason ===
                        "source_not_allowed"
                    ? {
                        id: account.id,
                        name: account.name,
                        integrationMode:
                            account.integrationMode,
                    }
                    : undefined
            : undefined;

        return NextResponse.json(
            {
                ok: false,
                error: accessCheck.error,
                ...(accountContext
                    ? { account: accountContext }
                    : {}),
            },
            {
                status: accessCheck.status,
            }
        );
    }

    const account = accessCheck.account;

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
