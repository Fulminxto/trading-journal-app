import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
    logActivity,
    notifyAccountMembers,
} from "@/lib/activity";

type TradeSyncSource = "mt5" | "broker";

type SyncTradeInput = {
    tradingAccountId: string;

    source: TradeSyncSource;
    externalTradeId: string;
    externalAccountId?: string | null;
    externalOrderId?: string | null;

    platform?: string | null;
    brokerName?: string | null;

    symbol: string;
    direction: string;

    openDate: Date;
    openTime?: string | null;

    amount?: number | null;
    openingPrice?: number | null;
    stopLoss?: number | null;
    takeProfit?: number | null;
    riskReward?: number | null;

    closeDate?: Date | null;
    closingPrice?: number | null;

    outcome?: string | null;
    resultUsd?: number | null;

    commission?: number | null;
    swap?: number | null;
    fees?: number | null;

    rawImportData?: Prisma.InputJsonValue;
};

export type TradeSyncResult =
    | {
        status: "created";
        tradeId: number;
        needsReview: boolean;
        syncStatus: string;
    }
    | {
        status: "updated";
        tradeId: number;
        needsReview: boolean;
        syncStatus: string;
        changedFields: string[];
    }
    | {
        status: "skipped";
        tradeId: number;
        needsReview: boolean;
        syncStatus: string;
    };

export type TradeSyncErrorCode =
    | "TRADE_VALIDATION_FAILED"
    | "TRADE_PERSISTENCE_FAILED"
    | "INTERNAL_SYNC_ERROR";

export class TradeSyncServiceError extends Error {
    constructor(
        readonly code: TradeSyncErrorCode,
        readonly stage: "validation" | "persistence" | "internal",
        readonly retryable: boolean,
        readonly safeMessage: string
    ) {
        super(code);
        this.name = "TradeSyncServiceError";
    }
}

function normalizeDirection(value: string) {
    const direction = value.trim().toUpperCase();

    if (direction === "BUY" || direction === "LONG") {
        return "LONG";
    }

    if (direction === "SELL" || direction === "SHORT") {
        return "SHORT";
    }

    return "LONG";
}

function normalizeOutcome(
    resultUsd?: number | null
) {
    if (
        resultUsd === null ||
        resultUsd === undefined
    ) {
        return null;
    }

    if (resultUsd > 0) {
        return "win";
    }

    if (resultUsd < 0) {
        return "loss";
    }

    return "be";
}

function normalizeOptionalString(
    value?: string | null
) {
    const normalized = value?.trim();

    return normalized || null;
}

function buildDesiredSyncedTradeData({
    input,
    existingTrade,
    importedAt,
}: {
    input: SyncTradeInput;
    existingTrade?: {
        importedAt: Date | null;
        needsReview: boolean;
        syncStatus: string;
    };
    importedAt: Date;
}) {
    return {
        openDate: input.openDate,
        openTime: normalizeOptionalString(
            input.openTime
        ),
        symbol: input.symbol.trim(),
        direction: normalizeDirection(
            input.direction
        ),
        amount: input.amount ?? null,
        openingPrice: input.openingPrice ?? null,
        stopLoss: input.stopLoss ?? null,
        takeProfit: input.takeProfit ?? null,
        riskReward: input.riskReward ?? null,
        closeDate: input.closeDate ?? null,
        closingPrice: input.closingPrice ?? null,
        outcome:
            input.outcome ||
            normalizeOutcome(input.resultUsd),
        resultUsd: input.resultUsd ?? null,
        source: input.source,
        syncStatus: existingTrade
            ? existingTrade.needsReview
                ? "imported"
                : existingTrade.syncStatus
            : "imported",
        needsReview:
            existingTrade?.needsReview ?? true,
        externalTradeId: input.externalTradeId,
        externalAccountId: normalizeOptionalString(
            input.externalAccountId
        ),
        externalOrderId: normalizeOptionalString(
            input.externalOrderId
        ),
        platform: normalizeOptionalString(
            input.platform
        ),
        brokerName: normalizeOptionalString(
            input.brokerName
        ),
        commission: input.commission ?? null,
        swap: input.swap ?? null,
        fees: input.fees ?? null,
        importedAt:
            existingTrade?.importedAt ?? importedAt,
    };
}

function getComparableTradeValue(value: unknown) {
    if (value instanceof Date) {
        return value.getTime();
    }

    if (
        typeof value === "object" &&
        value !== null &&
        "toNumber" in value &&
        typeof value.toNumber === "function"
    ) {
        return value.toNumber();
    }

    return value;
}

function getChangedTradeFields(
    existingTrade: Record<string, unknown>,
    desiredTrade: Record<string, unknown>
) {
    return Object.keys(desiredTrade).filter(
        (field) =>
            getComparableTradeValue(
                existingTrade[field]
            ) !==
            getComparableTradeValue(
                desiredTrade[field]
            )
    );
}

async function getDomainTradeUserId(
    tradingAccountId: string
) {
    const account =
        await prisma.tradingAccount.findUnique({
            where: {
                id: tradingAccountId,
            },
            include: {
                members: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

    if (!account) {
        return null;
    }

    if (account.createdById) {
        return account.createdById;
    }

    const manager = account.members.find(
        (member) => member.role === "MANAGER"
    );

    if (manager) {
        return manager.userId;
    }

    return account.members[0]?.userId || null;
}

async function markAccountSyncConnected(
    tradingAccountId: string
) {
    await prisma.tradingAccount.update({
        where: {
            id: tradingAccountId,
        },
        data: {
            syncStatus: "connected",
            lastSyncedAt: new Date(),
            autoSyncEnabled: true,
        },
    });
}

async function restoreAccountSyncConnectedIfNeeded(
    tradingAccountId: string
) {
    const account =
        await prisma.tradingAccount.findUnique({
            where: {
                id: tradingAccountId,
            },
            select: {
                syncStatus: true,
                autoSyncEnabled: true,
            },
        });

    if (
        !account ||
        (
            account.syncStatus === "connected" &&
            account.autoSyncEnabled
        )
    ) {
        return;
    }

    await markAccountSyncConnected(
        tradingAccountId
    );
}

async function recalculateAccountEquity(
    tradingAccountId: string
) {
    const account =
        await prisma.tradingAccount.findUnique({
            where: {
                id: tradingAccountId,
            },
        });

    if (!account) {
        return;
    }

    const trades = await prisma.trade.findMany({
        where: {
            tradingAccountId,
        },
        orderBy: [
            {
                openDate: "asc",
            },
            {
                id: "asc",
            },
        ],
    });

    let equity = account.initialBalance;
    let equityPeak = equity;

    for (const trade of trades) {
        const resultUsd = trade.resultUsd || 0;

        equity += resultUsd;

        if (equity > equityPeak) {
            equityPeak = equity;
        }

        const drawdownPercent =
            equityPeak > 0
                ? ((equity - equityPeak) / equityPeak) *
                100
                : 0;

        const resultPercent =
            account.initialBalance > 0
                ? (resultUsd / account.initialBalance) *
                100
                : 0;

        await prisma.trade.update({
            where: {
                id: trade.id,
            },
            data: {
                equity,
                equityPeak,
                drawdownPercent,
                resultPercent,
            },
        });
    }
}

export async function importSyncedTrade(
    input: SyncTradeInput
) : Promise<TradeSyncResult> {
    const domainUserId =
        await getDomainTradeUserId(
            input.tradingAccountId
        );

    if (!domainUserId) {
        throw new TradeSyncServiceError(
            "TRADE_VALIDATION_FAILED",
            "validation",
            false,
            "Trade sync could not assign the required trade owner."
        );
    }

    const existingTrade =
        await prisma.trade.findFirst({
            where: {
                tradingAccountId:
                    input.tradingAccountId,
                externalTradeId:
                    input.externalTradeId,
            },
        });

    const importedAt = new Date();
    const desiredTrade =
        buildDesiredSyncedTradeData({
            input,
            existingTrade: existingTrade ?? undefined,
            importedAt,
        });

    if (existingTrade) {
        const changedFields =
            getChangedTradeFields(
                existingTrade,
                desiredTrade
            );

        if (changedFields.length === 0) {
            await restoreAccountSyncConnectedIfNeeded(
                input.tradingAccountId
            );

            return {
                status: "skipped",
                tradeId: existingTrade.id,
                needsReview:
                    existingTrade.needsReview,
                syncStatus:
                    existingTrade.syncStatus,
            };
        }

        const updatedTrade =
            await prisma.trade.update({
                where: {
                    id: existingTrade.id,
                },
                data: {
                    ...desiredTrade,
                    rawImportData:
                        input.rawImportData ??
                        Prisma.JsonNull,
                },
            });

        await markAccountSyncConnected(
            input.tradingAccountId
        );

        await recalculateAccountEquity(
            input.tradingAccountId
        );

        await logActivity({
            userId: null,
            accountId: input.tradingAccountId,
            type: "TRADE_SYNC_UPDATED",
            title: "Imported trade updated",
            description: `${input.symbol} ${normalizeDirection(
                input.direction
            )} imported trade updated from ${input.source
                }`,
            metadata: {
                tradeId: updatedTrade.id,
                source: input.source,
                platform: input.platform,
                brokerName: input.brokerName,
                reviewState:
                    updatedTrade.needsReview
                        ? "needs_review"
                        : "reviewed",
                changedFields,
                origin: "system",
            },
        });

        await notifyAccountMembers({
            accountId: input.tradingAccountId,
            actorId: domainUserId,
            type: "TRADE_SYNC_UPDATED",
            title: "Imported trade updated",
            message: `${input.symbol} ${normalizeDirection(
                input.direction
            )} updated from ${input.source.toUpperCase()}`,
            link: `/accounts/${input.tradingAccountId}/diary?source=${input.source}`,
        });

        return {
            status: "updated",
            tradeId: updatedTrade.id,
            needsReview:
                updatedTrade.needsReview,
            syncStatus:
                updatedTrade.syncStatus,
            changedFields,
        };
    }

    const trade = await prisma.trade.create({
        data: {
            tradingAccountId:
                input.tradingAccountId,
            createdById: domainUserId,
            ...desiredTrade,
            rawImportData:
                input.rawImportData ??
                Prisma.JsonNull,
        },
    });

    await logActivity({
        userId: null,
        accountId: input.tradingAccountId,
        type: "TRADE_IMPORTED",
        title: "Trade imported",
        description: `${input.symbol} ${normalizeDirection(
            input.direction
        )} trade imported from ${input.source}`,
        metadata: {
            tradeId: trade.id,
            source: input.source,
            platform: input.platform,
            brokerName: input.brokerName,
            reviewState: "needs_review",
            origin: "system",
        },
    });

    await notifyAccountMembers({
        accountId: input.tradingAccountId,
        actorId: domainUserId,
        type: "TRADE_IMPORTED",
        title: "Trade imported",
        message: `${input.symbol} ${normalizeDirection(
            input.direction
        )} imported from ${input.source.toUpperCase()}`,
        link: `/accounts/${input.tradingAccountId}/diary?source=${input.source}&needsReview=true`,
    });

    await markAccountSyncConnected(
        input.tradingAccountId
    );

    await recalculateAccountEquity(
        input.tradingAccountId
    );

    return {
        status: "created",
        tradeId: trade.id,
        needsReview: trade.needsReview,
        syncStatus: trade.syncStatus,
    };
}
