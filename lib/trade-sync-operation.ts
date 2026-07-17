import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { TradeSyncSource } from "@/lib/trade-sync-auth";

const operationResultSelect = {
    id: true,
    accountId: true,
    source: true,
    trigger: true,
    externalBatchId: true,
    status: true,
    totalCount: true,
    importedCount: true,
    updatedCount: true,
    skippedCount: true,
    failedCount: true,
    startedAt: true,
} satisfies Prisma.SyncOperationSelect;

type OperationResult = Prisma.SyncOperationGetPayload<{
    select: typeof operationResultSelect;
}>;

export class SyncOperationConflictError extends Error {
    constructor() {
        super(
            "Batch identifier already exists with different parameters"
        );
        this.name = "SyncOperationConflictError";
    }
}

export class SyncOperationTriggerError extends Error {
    constructor() {
        super("Trigger must be automatic");
        this.name = "SyncOperationTriggerError";
    }
}

function ensureCompatibleOperation(
    operation: OperationResult,
    expected: {
        trigger: string;
        totalCount: number | null;
    }
) {
    if (
        operation.trigger !== expected.trigger ||
        operation.totalCount !== expected.totalCount
    ) {
        throw new SyncOperationConflictError();
    }

    return operation;
}

function isUniqueConstraintError(error: unknown) {
    return (
        error instanceof
            Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    );
}

export async function startSyncOperation({
    accountId,
    source,
    externalBatchId,
    trigger,
    totalCount,
}: {
    accountId: string;
    source: TradeSyncSource;
    externalBatchId: string;
    trigger: string;
    totalCount: number | null;
}) {
    const where = {
        accountId_source_externalBatchId: {
            accountId,
            source,
            externalBatchId,
        },
    };

    const existing =
        await prisma.syncOperation.findUnique({
            where,
            select: operationResultSelect,
        });

    if (existing) {
        return {
            operation: ensureCompatibleOperation(
                existing,
                { trigger, totalCount }
            ),
            resumed: true as const,
        };
    }

    if (trigger !== "automatic") {
        throw new SyncOperationTriggerError();
    }

    try {
        const operation =
            await prisma.syncOperation.create({
                data: {
                    accountId,
                    actorUserId: null,
                    source,
                    trigger,
                    externalBatchId,
                    status: "STARTED",
                    totalCount,
                    importedCount: 0,
                    updatedCount: 0,
                    skippedCount: 0,
                    failedCount: 0,
                },
                select: operationResultSelect,
            });

        return {
            operation,
            resumed: false as const,
        };
    } catch (error) {
        if (!isUniqueConstraintError(error)) {
            throw error;
        }

        const racedOperation =
            await prisma.syncOperation.findUnique({
                where,
                select: operationResultSelect,
            });

        if (!racedOperation) {
            throw error;
        }

        return {
            operation: ensureCompatibleOperation(
                racedOperation,
                { trigger, totalCount }
            ),
            resumed: true as const,
        };
    }
}
