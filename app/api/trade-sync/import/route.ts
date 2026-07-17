import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import {
    authenticateTradeSyncRequest,
    authorizeTradeSyncAccount,
    getTradeSyncSource,
} from "@/lib/trade-sync-auth";
import {
    importSyncedTrade,
    TradeSyncServiceError,
    type SyncTradeInput,
    type TradeSyncErrorCode,
} from "@/lib/trade-sync";
import {
    hashSyncTradePayload,
    OperationItemError,
    processSyncOperationItem,
} from "@/lib/trade-sync-operation-item";

type TradeSyncPayload = {
    operationId?: unknown;
    itemKey?: unknown;

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

function getDirection(value: unknown) {
    const direction = getString(value).toUpperCase();

    if (direction === "BUY" || direction === "LONG") {
        return "LONG" as const;
    }

    if (direction === "SELL" || direction === "SHORT") {
        return "SHORT" as const;
    }

    return null;
}

async function markAccountSyncError({
    tradingAccountId,
    source,
    code,
    stage,
    retryable,
    safeMessage,
}: {
    tradingAccountId: string;
    source?: string | null;
    code: TradeSyncErrorCode;
    stage: "validation" | "persistence" | "internal";
    retryable: boolean;
    safeMessage: string;
}) {
    try {
        await prisma.tradingAccount.updateMany({
            where: {
                id: tradingAccountId,
                syncStatus: {
                    not: "error",
                },
            },
            data: {
                syncStatus: "error",
            },
        });

        await logActivity({
            userId: null,
            accountId: tradingAccountId,
            type: "TRADE_SYNC_ERROR",
            title: "Trade sync error",
            description: safeMessage,
            metadata: {
                source,
                code,
                stage,
                retryable,
            },
        });
    } catch {
        // Non blocchiamo la risposta API se fallisce il logging dell'errore
    }
}

export async function POST(request: NextRequest) {
    const authentication =
        authenticateTradeSyncRequest(request.headers);

    if (!authentication.authorized) {
        return NextResponse.json(
            {
                error: authentication.error,
            },
            {
                status: authentication.status,
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

    const source = getTradeSyncSource(payload.source);

    const externalTradeId = getString(
        payload.externalTradeId
    );

    const symbol = getString(payload.symbol);
    const direction = getDirection(payload.direction);
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
                    "Missing or invalid required fields: tradingAccountId, source, externalTradeId, symbol, direction (must be BUY/SELL/LONG/SHORT), openDate",
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

    const normalizedInput: SyncTradeInput = {
        tradingAccountId,
        source,
        externalTradeId,
        externalAccountId: getOptionalString(
            payload.externalAccountId
        ),
        externalOrderId: getOptionalString(
            payload.externalOrderId
        ),
        platform: getOptionalString(payload.platform),
        brokerName: getOptionalString(
            payload.brokerName
        ),
        symbol,
        direction,
        openDate,
        openTime: getOptionalString(payload.openTime),
        amount: getNumber(payload.amount),
        openingPrice: getNumber(payload.openingPrice),
        stopLoss: getNumber(payload.stopLoss),
        takeProfit: getNumber(payload.takeProfit),
        riskReward: getNumber(payload.riskReward),
        closeDate,
        closingPrice: getNumber(payload.closingPrice),
        outcome: getOutcome(payload.outcome),
        resultUsd: getNumber(payload.resultUsd),
        commission: getNumber(payload.commission),
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
            platform: getOptionalString(payload.platform),
            brokerName: getOptionalString(
                payload.brokerName
            ),
            symbol,
            direction,
            openDate: openDate.toISOString(),
            openTime: getOptionalString(payload.openTime),
            amount: getNumber(payload.amount),
            openingPrice: getNumber(payload.openingPrice),
            stopLoss: getNumber(payload.stopLoss),
            takeProfit: getNumber(payload.takeProfit),
            riskReward: getNumber(payload.riskReward),
            closeDate: closeDate?.toISOString() ?? null,
            closingPrice: getNumber(payload.closingPrice),
            outcome: getOutcome(payload.outcome),
            resultUsd: getNumber(payload.resultUsd),
            commission: getNumber(payload.commission),
            swap: getNumber(payload.swap),
            fees: getNumber(payload.fees),
        },
    };

    const hasOperationId =
        payload.operationId !== undefined;
    const hasItemKey = payload.itemKey !== undefined;

    if (hasOperationId !== hasItemKey) {
        return NextResponse.json(
            {
                error:
                    "operationId and itemKey must be provided together",
            },
            { status: 400 }
        );
    }

    if (hasOperationId && hasItemKey) {
        const operationId = getString(payload.operationId);
        const itemKey = getString(payload.itemKey);

        if (
            !operationId ||
            !itemKey ||
            operationId.length > 200 ||
            itemKey.length > 200
        ) {
            return NextResponse.json(
                {
                    error:
                        "operationId and itemKey must be non-empty strings of at most 200 characters",
                },
                { status: 400 }
            );
        }

        try {
            const processed =
                await processSyncOperationItem({
                    operationId,
                    itemKey,
                    payloadHash:
                        hashSyncTradePayload(
                            normalizedInput
                        ),
                    input: normalizedInput,
                });
            const result = processed.result;

            return NextResponse.json({
                status: result.status,
                tradeId: result.tradeId,
                needsReview: result.needsReview,
                syncStatus: result.syncStatus,
                ...(result.status === "updated"
                    ? {
                        changedFields:
                            result.changedFields,
                    }
                    : {}),
                operationId,
                itemStatus: "processed",
                replayed: processed.replayed,
            });
        } catch (error) {
            if (error instanceof OperationItemError) {
                return NextResponse.json(
                    { error: error.safeMessage },
                    { status: error.httpStatus }
                );
            }

            return NextResponse.json(
                { error: "Trade sync import failed." },
                { status: 500 }
            );
        }
    }

    try {
        const result =
            await importSyncedTrade(normalizedInput);

        return NextResponse.json({
            status: result.status,
            tradeId: result.tradeId,
            needsReview: result.needsReview,
            syncStatus: result.syncStatus,
            ...(result.status === "updated"
                ? {
                    changedFields:
                        result.changedFields,
                }
                : {}),
        });
    } catch (error) {
        const syncError =
            error instanceof TradeSyncServiceError
                ? error
                : new TradeSyncServiceError(
                    "TRADE_PERSISTENCE_FAILED",
                    "persistence",
                    true,
                    "Trade sync import failed."
                );

        await markAccountSyncError({
            tradingAccountId,
            source,
            code: syncError.code,
            stage: syncError.stage,
            retryable: syncError.retryable,
            safeMessage: syncError.safeMessage,
        });

        return NextResponse.json(
            {
                error: syncError.safeMessage,
            },
            {
                status:
                    syncError.stage === "validation"
                        ? 400
                        : 500,
            }
        );
    }
}
