import { prisma } from "@/lib/prisma";
import {
    persistAccountMemberNotifications,
    persistActivityLog,
} from "@/lib/activity";
import {
    recalculateTradeSyncAccountEquity,
    updateTradeSyncAccountConnected,
} from "@/lib/trade-sync";
import type { TradeSyncSource } from "@/lib/trade-sync-auth";

const TERMINAL_STATUSES = new Set([
    "COMPLETED",
    "PARTIAL",
    "FAILED",
]);

const operationSelect = {
    id: true,
    accountId: true,
    source: true,
    trigger: true,
    status: true,
    totalCount: true,
    importedCount: true,
    updatedCount: true,
    skippedCount: true,
    failedCount: true,
    startedAt: true,
    completedAt: true,
    durationMs: true,
} as const;

type CompletionOperation = {
    id: string;
    accountId: string;
    source: string;
    trigger: string;
    status: string;
    totalCount: number | null;
    importedCount: number;
    updatedCount: number;
    skippedCount: number;
    failedCount: number;
    startedAt: Date;
    completedAt: Date | null;
    durationMs: number | null;
};

export type SyncOperationCompletionResult = {
    operationId: string;
    status: "COMPLETED" | "PARTIAL" | "FAILED";
    totalCount: number;
    importedCount: number;
    updatedCount: number;
    skippedCount: number;
    failedCount: number;
    processedCount: number;
    completedAt: Date;
    durationMs: number;
    replayed: boolean;
};

export class SyncOperationCompletionError extends Error {
    constructor(
        readonly httpStatus: number,
        readonly safeMessage: string
    ) {
        super(safeMessage);
        this.name = "SyncOperationCompletionError";
    }
}

function validateBinding(
    operation: CompletionOperation | null,
    tradingAccountId: string,
    source: TradeSyncSource
) {
    if (!operation) {
        throw new SyncOperationCompletionError(
            404,
            "Sync operation not found"
        );
    }

    if (
        operation.accountId !== tradingAccountId ||
        operation.source !== source ||
        operation.trigger !== "automatic"
    ) {
        throw new SyncOperationCompletionError(
            409,
            "Sync operation does not match request"
        );
    }

    return operation;
}

function terminalResult(
    operation: CompletionOperation,
    replayed: boolean
): SyncOperationCompletionResult {
    if (
        !TERMINAL_STATUSES.has(operation.status) ||
        operation.completedAt === null ||
        operation.durationMs === null ||
        operation.totalCount === null
    ) {
        throw new SyncOperationCompletionError(
            409,
            "Sync operation terminal state is incomplete"
        );
    }

    const processedCount =
        operation.importedCount +
        operation.updatedCount +
        operation.skippedCount +
        operation.failedCount;

    return {
        operationId: operation.id,
        status: operation.status as
            | "COMPLETED"
            | "PARTIAL"
            | "FAILED",
        totalCount: operation.totalCount,
        importedCount: operation.importedCount,
        updatedCount: operation.updatedCount,
        skippedCount: operation.skippedCount,
        failedCount: operation.failedCount,
        processedCount,
        completedAt: operation.completedAt,
        durationMs: operation.durationMs,
        replayed,
    };
}

function getTerminalStatus({
    successfulCount,
    failedCount,
    missingCount,
}: {
    successfulCount: number;
    failedCount: number;
    missingCount: number;
}) {
    if (failedCount === 0 && missingCount === 0) {
        return "COMPLETED" as const;
    }

    if (successfulCount > 0) {
        return "PARTIAL" as const;
    }

    return "FAILED" as const;
}

export async function completeSyncOperation({
    operationId,
    tradingAccountId,
    source,
}: {
    operationId: string;
    tradingAccountId: string;
    source: TradeSyncSource;
}): Promise<SyncOperationCompletionResult> {
    return prisma.$transaction(async (tx) => {
        let operation = validateBinding(
            await tx.syncOperation.findUnique({
                where: { id: operationId },
                select: operationSelect,
            }),
            tradingAccountId,
            source
        );

        if (TERMINAL_STATUSES.has(operation.status)) {
            return terminalResult(operation, true);
        }

        const claim = await tx.syncOperation.updateMany({
            where: {
                id: operationId,
                status: {
                    in: ["STARTED", "PROCESSING"],
                },
            },
            data: { status: "PROCESSING" },
        });

        if (claim.count !== 1) {
            operation = validateBinding(
                await tx.syncOperation.findUnique({
                    where: { id: operationId },
                    select: operationSelect,
                }),
                tradingAccountId,
                source
            );

            if (TERMINAL_STATUSES.has(operation.status)) {
                return terminalResult(operation, true);
            }

            throw new SyncOperationCompletionError(
                409,
                "Sync operation could not be claimed for completion"
            );
        }

        const receiptCounts =
            await tx.syncOperationItem.groupBy({
                by: ["status"],
                where: { operationId },
                _count: { _all: true },
            });
        const counts = new Map(
            receiptCounts.map((row) => [
                row.status,
                row._count._all,
            ])
        );

        if ((counts.get("PROCESSING") ?? 0) > 0) {
            throw new SyncOperationCompletionError(
                409,
                "Sync operation still has items being processed"
            );
        }

        const importedCount = counts.get("CREATED") ?? 0;
        const updatedCount = counts.get("UPDATED") ?? 0;
        const skippedCount = counts.get("SKIPPED") ?? 0;
        const failedCount = counts.get("FAILED") ?? 0;
        const processedCount =
            importedCount +
            updatedCount +
            skippedCount +
            failedCount;
        const totalCount =
            operation.totalCount ?? processedCount;

        if (processedCount > totalCount) {
            throw new SyncOperationCompletionError(
                409,
                "Processed item count exceeds expected total"
            );
        }

        const missingCount = totalCount - processedCount;
        const successfulCount =
            importedCount + updatedCount + skippedCount;
        const status = getTerminalStatus({
            successfulCount,
            failedCount,
            missingCount,
        });
        const completedAt = new Date();
        const durationMs = Math.max(
            0,
            completedAt.getTime() -
                operation.startedAt.getTime()
        );

        await updateTradeSyncAccountConnected(
            tx,
            tradingAccountId,
            completedAt
        );

        if (importedCount + updatedCount > 0) {
            await recalculateTradeSyncAccountEquity(
                tx,
                tradingAccountId
            );
        }

        const needsSummary =
            status !== "COMPLETED" ||
            importedCount + updatedCount > 0;

        if (needsSummary) {
            const isWarning = status !== "COMPLETED";
            const activityType = isWarning
                ? "TRADE_SYNC_WARNING"
                : "TRADE_SYNC_SUMMARY";
            const notificationType = isWarning
                ? "trade_sync_warning"
                : "trade_sync_summary";
            const title = isWarning
                ? "Trade sync completed with warnings"
                : "Trade sync completed";
            const description = `${processedCount} trades processed: ${importedCount} imported, ${updatedCount} updated, ${skippedCount} skipped, ${failedCount} failed.`;
            const metadata = {
                source,
                trigger: "automatic",
                status,
                totalCount,
                processedCount,
                importedCount,
                updatedCount,
                skippedCount,
                failedCount,
                durationMs,
                origin: "system",
            };

            await persistActivityLog(tx, {
                userId: null,
                accountId: tradingAccountId,
                type: activityType,
                title,
                description,
                metadata,
            });

            const notifications =
                await persistAccountMemberNotifications(
                    tx,
                    {
                        accountId: tradingAccountId,
                        actorId: null,
                        type: notificationType,
                        title,
                        message: description,
                        link: `/accounts/${tradingAccountId}/diary?source=${source}`,
                    }
                );

            for (const notification of notifications) {
                if (!notification.pushNotificationsEnabled) {
                    continue;
                }

                await tx.syncOperationEffect.create({
                    data: {
                        operationId,
                        notificationId:
                            notification.notificationId,
                        effectKey: `push:${notification.notificationId}`,
                    },
                });
            }
        }

        const persisted =
            await tx.syncOperation.update({
                where: { id: operationId },
                data: {
                    status,
                    totalCount,
                    importedCount,
                    updatedCount,
                    skippedCount,
                    failedCount,
                    completedAt,
                    durationMs,
                },
                select: operationSelect,
            });

        return terminalResult(persisted, false);
    });
}
