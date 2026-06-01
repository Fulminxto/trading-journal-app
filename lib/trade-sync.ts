import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { logActivity, notifyAccountMembers, } from "@/lib/activity";

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
    if (resultUsd === null || resultUsd === undefined) {
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

async function getImporterUserId(
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
                ? ((equity - equityPeak) / equityPeak) * 100
                : 0;

        const resultPercent =
            account.initialBalance > 0
                ? (resultUsd / account.initialBalance) * 100
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
) {
    const importerUserId =
        await getImporterUserId(
            input.tradingAccountId
        );

    if (!importerUserId) {
        return {
            status: "error" as const,
            reason: "No importer user found",
        };
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

    const outcome =
        input.outcome ||
        normalizeOutcome(input.resultUsd);

    if (existingTrade) {
        const updatedTrade =
            await prisma.trade.update({
                where: {
                    id: existingTrade.id,
                },
                data: {
                    symbol: input.symbol,
                    direction: normalizeDirection(
                        input.direction
                    ),

                    openDate: input.openDate,
                    openTime: input.openTime || null,

                    amount: input.amount ?? null,
                    openingPrice:
                        input.openingPrice ?? null,
                    stopLoss: input.stopLoss ?? null,
                    takeProfit:
                        input.takeProfit ?? null,
                    riskReward:
                        input.riskReward ?? null,

                    closeDate: input.closeDate ?? null,
                    closingPrice:
                        input.closingPrice ?? null,

                    outcome,
                    resultUsd: input.resultUsd ?? null,

                    source: input.source,
                    syncStatus: existingTrade.needsReview
                        ? "imported"
                        : existingTrade.syncStatus,
                    needsReview:
                        existingTrade.needsReview,

                    externalAccountId:
                        input.externalAccountId ?? null,
                    externalOrderId:
                        input.externalOrderId ?? null,

                    platform: input.platform ?? null,
                    brokerName:
                        input.brokerName ?? null,

                    commission:
                        input.commission ?? null,
                    swap: input.swap ?? null,
                    fees: input.fees ?? null,

                    importedAt:
                        existingTrade.importedAt ||
                        new Date(),

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

        return {
            status: "updated" as const,
            trade: updatedTrade,
        };
    }

    const trade = await prisma.trade.create({
        data: {
            tradingAccountId:
                input.tradingAccountId,
            createdById: importerUserId,

            openDate: input.openDate,
            openTime: input.openTime || null,

            symbol: input.symbol,
            direction: normalizeDirection(
                input.direction
            ),

            amount: input.amount ?? null,
            openingPrice:
                input.openingPrice ?? null,
            stopLoss: input.stopLoss ?? null,
            takeProfit:
                input.takeProfit ?? null,
            riskReward:
                input.riskReward ?? null,

            closeDate: input.closeDate ?? null,
            closingPrice:
                input.closingPrice ?? null,

            outcome,
            resultUsd: input.resultUsd ?? null,

            source: input.source,
            syncStatus: "imported",
            needsReview: true,

            externalTradeId:
                input.externalTradeId,
            externalAccountId:
                input.externalAccountId ?? null,
            externalOrderId:
                input.externalOrderId ?? null,

            platform: input.platform ?? null,
            brokerName:
                input.brokerName ?? null,

            commission:
                input.commission ?? null,
            swap: input.swap ?? null,
            fees: input.fees ?? null,

            importedAt: new Date(),
            rawImportData:
                input.rawImportData ??
                Prisma.JsonNull,
        },
    });

    await logActivity({
        userId: importerUserId,
        accountId: input.tradingAccountId,
        type: "TRADE_IMPORTED",
        title: "Trade imported",
        description: `${input.symbol} ${normalizeDirection(
            input.direction
        )} trade imported from ${input.source}`,
        metadata: {
            tradeId: trade.id,
            source: input.source,
            externalTradeId:
                input.externalTradeId,
            platform: input.platform,
            brokerName: input.brokerName,
            needsReview: true,
        },
    });

    await notifyAccountMembers({
        accountId: input.tradingAccountId,
        actorId: importerUserId,
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
        status: "created" as const,
        trade,
    };
}