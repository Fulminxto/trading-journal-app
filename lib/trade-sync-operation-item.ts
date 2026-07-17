import { createHash } from "node:crypto";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
    persistSyncedTrade,
    TradeSyncServiceError,
    type SyncTradeInput,
    type TradeSyncErrorCode,
    type TradeSyncResult,
} from "@/lib/trade-sync";

const ACTIVE_OPERATION_STATUSES = new Set([
    "STARTED",
    "PROCESSING",
]);

type OperationBinding = {
    operationId: string;
    itemKey: string;
    payloadHash: string;
    input: SyncTradeInput;
};

type Receipt = {
    status: string;
    payloadHash: string;
    tradeId: number | null;
    needsReview: boolean | null;
    syncStatus: string | null;
    changedFields: string[];
    safeErrorCode: string | null;
    httpStatus: number | null;
};

export class OperationItemError extends Error {
    constructor(
        readonly httpStatus: number,
        readonly safeMessage: string
    ) {
        super(safeMessage);
        this.name = "OperationItemError";
    }
}

function canonicalTradeInput(input: SyncTradeInput) {
    return {
        tradingAccountId: input.tradingAccountId,
        source: input.source,
        externalTradeId: input.externalTradeId,
        externalAccountId: input.externalAccountId ?? null,
        externalOrderId: input.externalOrderId ?? null,
        platform: input.platform ?? null,
        brokerName: input.brokerName ?? null,
        symbol: input.symbol,
        direction: input.direction,
        openDate: input.openDate.toISOString(),
        openTime: input.openTime ?? null,
        amount: input.amount ?? null,
        openingPrice: input.openingPrice ?? null,
        stopLoss: input.stopLoss ?? null,
        takeProfit: input.takeProfit ?? null,
        riskReward: input.riskReward ?? null,
        closeDate:
            input.closeDate?.toISOString() ?? null,
        closingPrice: input.closingPrice ?? null,
        outcome: input.outcome ?? null,
        resultUsd: input.resultUsd ?? null,
        commission: input.commission ?? null,
        swap: input.swap ?? null,
        fees: input.fees ?? null,
    };
}

export function hashSyncTradePayload(
    input: SyncTradeInput
) {
    return createHash("sha256")
        .update(JSON.stringify(canonicalTradeInput(input)))
        .digest("hex");
}

function safeMessageForCode(code: string | null) {
    if (code === "TRADE_VALIDATION_FAILED") {
        return "Trade sync could not assign the required trade owner.";
    }

    return "Trade sync import failed.";
}

function replayReceipt(receipt: Receipt) {
    if (receipt.status === "PROCESSING") {
        throw new OperationItemError(
            409,
            "Item is already being processed"
        );
    }

    if (receipt.status === "FAILED") {
        throw new OperationItemError(
            receipt.httpStatus ?? 500,
            safeMessageForCode(receipt.safeErrorCode)
        );
    }

    if (
        receipt.tradeId === null ||
        receipt.needsReview === null ||
        receipt.syncStatus === null
    ) {
        throw new Error("Incomplete terminal receipt");
    }

    const base = {
        tradeId: receipt.tradeId,
        needsReview: receipt.needsReview,
        syncStatus: receipt.syncStatus,
    };

    if (receipt.status === "CREATED") {
        return {
            status: "created" as const,
            ...base,
        };
    }

    if (receipt.status === "UPDATED") {
        return {
            status: "updated" as const,
            ...base,
            changedFields: receipt.changedFields,
        };
    }

    if (receipt.status === "SKIPPED") {
        return {
            status: "skipped" as const,
            ...base,
        };
    }

    throw new Error("Unknown receipt status");
}

function ensureMatchingHash(
    receipt: Receipt,
    payloadHash: string
) {
    if (receipt.payloadHash !== payloadHash) {
        throw new OperationItemError(
            409,
            "Item identifier already exists with different payload"
        );
    }
}

function validateOperation(
    operation: {
        accountId: string;
        source: string;
        trigger: string;
        status: string;
    } | null,
    input: SyncTradeInput
) {
    if (!operation) {
        throw new OperationItemError(
            404,
            "Sync operation not found"
        );
    }

    if (
        operation.accountId !== input.tradingAccountId ||
        operation.source !== input.source ||
        operation.trigger !== "automatic"
    ) {
        throw new OperationItemError(
            409,
            "Sync operation does not match request"
        );
    }

    return operation;
}

function isTargetedUniqueError(
    error: unknown,
    fields: string[]
) {
    if (
        !(error instanceof
            Prisma.PrismaClientKnownRequestError) ||
        error.code !== "P2002"
    ) {
        return false;
    }

    const target = error.meta?.target;

    return (
        Array.isArray(target) &&
        fields.every((field) => target.includes(field))
    );
}

async function loadReceipt(
    operationId: string,
    itemKey: string
) {
    return prisma.syncOperationItem.findUnique({
        where: {
            operationId_itemKey: {
                operationId,
                itemKey,
            },
        },
    });
}

async function replayAfterReceiptRace(
    operationId: string,
    itemKey: string,
    payloadHash: string
) {
    const receipt = await loadReceipt(
        operationId,
        itemKey
    );

    if (!receipt) {
        throw new Error("Receipt race could not be resolved");
    }

    ensureMatchingHash(receipt, payloadHash);

    return replayReceipt(receipt);
}

async function claimActiveOperation(
    tx: Prisma.TransactionClient,
    binding: OperationBinding
) {
    const operation = validateOperation(
        await tx.syncOperation.findUnique({
            where: { id: binding.operationId },
            select: {
                accountId: true,
                source: true,
                trigger: true,
                status: true,
            },
        }),
        binding.input
    );

    if (!ACTIVE_OPERATION_STATUSES.has(operation.status)) {
        throw new OperationItemError(
            409,
            "Sync operation is not accepting new items"
        );
    }

    const claim = await tx.syncOperation.updateMany({
        where: {
            id: binding.operationId,
            status: {
                in: ["STARTED", "PROCESSING"],
            },
        },
        data: {
            status: "PROCESSING",
        },
    });

    if (claim.count !== 1) {
        throw new OperationItemError(
            409,
            "Sync operation is not accepting new items"
        );
    }
}

async function runAtomicItem(
    binding: OperationBinding
) {
    return prisma.$transaction(async (tx) => {
        await claimActiveOperation(tx, binding);

        const receipt =
            await tx.syncOperationItem.create({
                data: {
                    operationId: binding.operationId,
                    itemKey: binding.itemKey,
                    payloadHash: binding.payloadHash,
                    status: "PROCESSING",
                },
            });

        const persisted = await persistSyncedTrade(
            tx,
            binding.input
        );
        const { domainUserId: _domainUserId, ...result } =
            persisted;
        const completedAt = new Date();

        await tx.syncOperationItem.update({
            where: { id: receipt.id },
            data: {
                status: result.status.toUpperCase() as
                    | "CREATED"
                    | "UPDATED"
                    | "SKIPPED",
                tradeId: result.tradeId,
                needsReview: result.needsReview,
                syncStatus: result.syncStatus,
                changedFields:
                    result.status === "updated"
                        ? result.changedFields
                        : [],
                completedAt,
            },
        });

        await tx.syncOperation.update({
            where: { id: binding.operationId },
            data: {
                lastItemAt: completedAt,
            },
        });

        return result;
    });
}

async function persistFailedReceipt(
    binding: OperationBinding,
    error: TradeSyncServiceError
) {
    const httpStatus =
        error.stage === "validation" ? 400 : 500;

    try {
        await prisma.$transaction(async (tx) => {
            await claimActiveOperation(tx, binding);

            const completedAt = new Date();

            await tx.syncOperationItem.create({
                data: {
                    operationId: binding.operationId,
                    itemKey: binding.itemKey,
                    payloadHash: binding.payloadHash,
                    status: "FAILED",
                    safeErrorCode:
                        error.code as TradeSyncErrorCode,
                    httpStatus,
                    completedAt,
                },
            });

            await tx.syncOperation.update({
                where: { id: binding.operationId },
                data: { lastItemAt: completedAt },
            });
        });
    } catch (receiptError) {
        if (
            isTargetedUniqueError(receiptError, [
                "operationId",
                "itemKey",
            ])
        ) {
            return {
                result: await replayAfterReceiptRace(
                    binding.operationId,
                    binding.itemKey,
                    binding.payloadHash
                ),
                replayed: true as const,
            };
        }

        throw receiptError;
    }

    throw new OperationItemError(
        httpStatus,
        error.safeMessage
    );
}

export async function processSyncOperationItem(
    binding: OperationBinding
): Promise<{
    result: TradeSyncResult;
    replayed: boolean;
}> {
    const operation = validateOperation(
        await prisma.syncOperation.findUnique({
            where: { id: binding.operationId },
            select: {
                accountId: true,
                source: true,
                trigger: true,
                status: true,
            },
        }),
        binding.input
    );
    const existingReceipt = await loadReceipt(
        binding.operationId,
        binding.itemKey
    );

    if (existingReceipt) {
        ensureMatchingHash(
            existingReceipt,
            binding.payloadHash
        );

        return {
            result: replayReceipt(existingReceipt),
            replayed: true,
        };
    }

    if (!ACTIVE_OPERATION_STATUSES.has(operation.status)) {
        throw new OperationItemError(
            409,
            "Sync operation is not accepting new items"
        );
    }

    let tradeRaceRetried = false;

    while (true) {
        try {
            return {
                result: await runAtomicItem(binding),
                replayed: false,
            };
        } catch (error) {
            if (
                isTargetedUniqueError(error, [
                    "operationId",
                    "itemKey",
                ])
            ) {
                return {
                    result: await replayAfterReceiptRace(
                        binding.operationId,
                        binding.itemKey,
                        binding.payloadHash
                    ),
                    replayed: true,
                };
            }

            if (
                !tradeRaceRetried &&
                isTargetedUniqueError(error, [
                    "tradingAccountId",
                    "externalTradeId",
                ])
            ) {
                tradeRaceRetried = true;
                continue;
            }

            if (error instanceof TradeSyncServiceError) {
                return await persistFailedReceipt(
                    binding,
                    error
                );
            }

            throw error;
        }
    }
}
