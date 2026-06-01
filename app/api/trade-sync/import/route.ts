import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { importSyncedTrade } from "@/lib/trade-sync";

type TradeSyncPayload = {
    tradingAccountId?: string;

    source?: string;
    externalTradeId?: string;
    externalAccountId?: string;
    externalOrderId?: string;

    platform?: string;
    brokerName?: string;

    symbol?: string;
    direction?: string;

    openDate?: string;
    openTime?: string;

    amount?: number;
    openingPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
    riskReward?: number;

    closeDate?: string;
    closingPrice?: number;

    outcome?: string;
    resultUsd?: number;

    commission?: number;
    swap?: number;
    fees?: number;

    rawImportData?: unknown;
};

function getString(value: unknown) {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
}

function getOptionalString(value: unknown) {
    const stringValue = getString(value);

    return stringValue || null;
}

function getNumber(value: unknown) {
    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        return null;
    }

    return value;
}

function getDate(value: unknown) {
    const stringValue = getString(value);

    if (!stringValue) {
        return null;
    }

    const date = new Date(stringValue);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
}

function getSource(value: unknown) {
    const source = getString(value).toLowerCase();

    if (source === "mt5" || source === "broker") {
        return source;
    }

    return null;
}

function getOutcome(value: unknown) {
    const outcome = getString(value).toLowerCase();

    if (
        outcome === "win" ||
        outcome === "loss" ||
        outcome === "be"
    ) {
        return outcome;
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

async function markAccountSyncError({
    tradingAccountId,
    error,
    source,
    externalTradeId,
}: {
    tradingAccountId: string;
    error: string;
    source?: string | null;
    externalTradeId?: string | null;
}) {
    try {
        await prisma.tradingAccount.update({
            where: {
                id: tradingAccountId,
            },
            data: {
                syncStatus: "error",
            },
        });

        await prisma.activityLog.create({
            data: {
                accountId: tradingAccountId,
                type: "TRADE_SYNC_ERROR",
                title: "Trade sync error",
                description: error,
                metadata: {
                    source,
                    externalTradeId,
                    error,
                },
            },
        });
    } catch {
        // Non blocchiamo la risposta API se fallisce il logging dell'errore
    }
}

async function validateAccountSyncAccess({
    tradingAccountId,
    source,
}: {
    tradingAccountId: string;
    source: "mt5" | "broker";
}) {
    const account =
        await prisma.tradingAccount.findUnique({
            where: {
                id: tradingAccountId,
            },
            select: {
                id: true,
                status: true,

                integrationMode: true,
                autoSyncEnabled: true,

                mt5Enabled: true,
                brokerSyncEnabled: true,

                syncStatus: true,
            },
        });

    if (!account) {
        return {
            allowed: false as const,
            status: 404,
            error: "Trading account not found",
        };
    }

    if (account.status === "ARCHIVED") {
        return {
            allowed: false as const,
            status: 403,
            error:
                "Trade sync is disabled for archived accounts",
        };
    }

    if (account.integrationMode === "manual") {
        return {
            allowed: false as const,
            status: 403,
            error:
                "Trade sync is disabled because this account is set to Manual Only",
        };
    }

    const sourceAllowedByMode =
        isSourceAllowedForMode({
            integrationMode: account.integrationMode,
            source,
        });

    if (!sourceAllowedByMode) {
        return {
            allowed: false as const,
            status: 403,
            error: `Source "${source}" is not allowed for integration mode "${account.integrationMode}"`,
        };
    }

    if (source === "mt5" && !account.mt5Enabled) {
        return {
            allowed: false as const,
            status: 403,
            error:
                "MT5 sync is not enabled for this account",
        };
    }

    if (
        source === "broker" &&
        !account.brokerSyncEnabled
    ) {
        return {
            allowed: false as const,
            status: 403,
            error:
                "Broker sync is not enabled for this account",
        };
    }

    if (!account.autoSyncEnabled) {
        return {
            allowed: false as const,
            status: 403,
            error:
                "Auto sync is not enabled for this account",
        };
    }

    return {
        allowed: true as const,
        account,
    };
}

export async function POST(request: NextRequest) {
    const expectedSecret =
        process.env.TRADE_SYNC_SECRET;

    if (!expectedSecret) {
        return NextResponse.json(
            {
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
                error: "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }

    let payload: TradeSyncPayload;

    try {
        payload = await request.json();
    } catch {
        return NextResponse.json(
            {
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

    const externalTradeId = getString(
        payload.externalTradeId
    );

    const symbol = getString(payload.symbol);
    const direction = getString(payload.direction);
    const openDate = getDate(payload.openDate);

    if (
        !tradingAccountId ||
        !source ||
        !externalTradeId ||
        !symbol ||
        !direction ||
        !openDate
    ) {
        return NextResponse.json(
            {
                error:
                    "Missing required fields: tradingAccountId, source, externalTradeId, symbol, direction, openDate",
            },
            {
                status: 400,
            }
        );
    }

    const accessCheck =
        await validateAccountSyncAccess({
            tradingAccountId,
            source,
        });

    if (!accessCheck.allowed) {
        return NextResponse.json(
            {
                error: accessCheck.error,
            },
            {
                status: accessCheck.status,
            }
        );
    }

    const closeDate = getDate(payload.closeDate);

    try {
        const result =
            await importSyncedTrade({
                tradingAccountId,
                source,
                externalTradeId,

                externalAccountId: getOptionalString(
                    payload.externalAccountId
                ),

                externalOrderId: getOptionalString(
                    payload.externalOrderId
                ),

                platform: getOptionalString(
                    payload.platform
                ),

                brokerName: getOptionalString(
                    payload.brokerName
                ),

                symbol,
                direction,

                openDate,

                openTime: getOptionalString(
                    payload.openTime
                ),

                amount: getNumber(payload.amount),

                openingPrice: getNumber(
                    payload.openingPrice
                ),

                stopLoss: getNumber(payload.stopLoss),

                takeProfit: getNumber(
                    payload.takeProfit
                ),

                riskReward: getNumber(
                    payload.riskReward
                ),

                closeDate,

                closingPrice: getNumber(
                    payload.closingPrice
                ),

                outcome: getOutcome(payload.outcome),

                resultUsd: getNumber(payload.resultUsd),

                commission: getNumber(
                    payload.commission
                ),

                swap: getNumber(payload.swap),

                fees: getNumber(payload.fees),

                rawImportData: {
                    receivedAt: new Date().toISOString(),

                    tradingAccountId,
                    source,
                    externalTradeId,

                    externalAccountId: getOptionalString(
                        payload.externalAccountId
                    ),

                    externalOrderId: getOptionalString(
                        payload.externalOrderId
                    ),

                    platform: getOptionalString(
                        payload.platform
                    ),

                    brokerName: getOptionalString(
                        payload.brokerName
                    ),

                    symbol,
                    direction,

                    openDate: openDate.toISOString(),

                    openTime: getOptionalString(
                        payload.openTime
                    ),

                    amount: getNumber(payload.amount),

                    openingPrice: getNumber(
                        payload.openingPrice
                    ),

                    stopLoss: getNumber(payload.stopLoss),

                    takeProfit: getNumber(
                        payload.takeProfit
                    ),

                    riskReward: getNumber(
                        payload.riskReward
                    ),

                    closeDate:
                        closeDate?.toISOString() ?? null,

                    closingPrice: getNumber(
                        payload.closingPrice
                    ),

                    outcome: getOutcome(payload.outcome),

                    resultUsd: getNumber(payload.resultUsd),

                    commission: getNumber(
                        payload.commission
                    ),

                    swap: getNumber(payload.swap),

                    fees: getNumber(payload.fees),
                },
            });

        if (result.status === "error") {
            await markAccountSyncError({
                tradingAccountId,
                error: result.reason,
                source,
                externalTradeId,
            });

            return NextResponse.json(
                {
                    error: result.reason,
                },
                {
                    status: 400,
                }
            );
        }

        return NextResponse.json({
            status: result.status,
            tradeId: result.trade.id,
            needsReview: result.trade.needsReview,
            syncStatus: result.trade.syncStatus,
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "Unknown trade sync error";

        await markAccountSyncError({
            tradingAccountId,
            error: errorMessage,
            source,
            externalTradeId,
        });

        return NextResponse.json(
            {
                error: "Trade sync import failed",
                details: errorMessage,
            },
            {
                status: 500,
            }
        );
    }
}