import { NextRequest, NextResponse } from "next/server";

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

            closeDate: getDate(payload.closeDate),

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

                closeDate: getDate(payload.closeDate)
                    ?.toISOString() ?? null,

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
}