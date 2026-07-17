import { prisma } from "@/lib/prisma";
import { sendPushToUser } from "@/lib/push";

export const SYNC_EFFECT_STALE_PROCESSING_MS = 5 * 60 * 1000;
export const SYNC_EFFECT_MAX_ATTEMPTS = 5;
export const SYNC_EFFECT_BATCH_SIZE = 25;

const TERMINAL_OPERATION_STATUSES = new Set([
    "COMPLETED",
    "PARTIAL",
    "FAILED",
]);

export type SyncOperationEffectDispatchResult = {
    operationId: string;
    claimedCount: number;
    completedCount: number;
    failedCount: number;
    skippedCount: number;
    exhaustedCount: number;
    pendingCount: number;
};

export class SyncOperationEffectDispatchError extends Error {
    constructor(
        readonly httpStatus: number,
        readonly safeMessage: string
    ) {
        super(safeMessage);
        this.name = "SyncOperationEffectDispatchError";
    }
}

export async function dispatchSyncOperationPushEffects({
    operationId,
    now = new Date(),
}: {
    operationId: string;
    now?: Date;
}): Promise<SyncOperationEffectDispatchResult> {
    const operation = await prisma.syncOperation.findUnique({
        where: { id: operationId },
        select: { status: true },
    });

    if (!operation) {
        throw new SyncOperationEffectDispatchError(
            404,
            "Sync operation not found"
        );
    }

    if (!TERMINAL_OPERATION_STATUSES.has(operation.status)) {
        throw new SyncOperationEffectDispatchError(
            409,
            "Sync operation is not complete"
        );
    }

    const staleBefore = new Date(
        now.getTime() - SYNC_EFFECT_STALE_PROCESSING_MS
    );
    const candidates =
        await prisma.syncOperationEffect.findMany({
            where: {
                operationId,
                attemptCount: {
                    lt: SYNC_EFFECT_MAX_ATTEMPTS,
                },
                OR: [
                    { status: "PENDING" },
                    { status: "FAILED" },
                    {
                        status: "PROCESSING",
                        lastAttemptAt: { lte: staleBefore },
                    },
                ],
            },
            select: {
                id: true,
                status: true,
                attemptCount: true,
                startedAt: true,
            },
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
            take: SYNC_EFFECT_BATCH_SIZE,
        });

    let claimedCount = 0;
    let completedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (const candidate of candidates) {
        const statusCondition =
            candidate.status === "PROCESSING"
                ? {
                    status: "PROCESSING" as const,
                    lastAttemptAt: { lte: staleBefore },
                }
                : { status: candidate.status };
        const claimedAttempt = candidate.attemptCount + 1;
        const claim =
            await prisma.syncOperationEffect.updateMany({
                where: {
                    id: candidate.id,
                    operationId,
                    attemptCount: {
                        equals: candidate.attemptCount,
                        lt: SYNC_EFFECT_MAX_ATTEMPTS,
                    },
                    ...statusCondition,
                },
                data: {
                    status: "PROCESSING",
                    attemptCount: { increment: 1 },
                    startedAt: candidate.startedAt ?? now,
                    lastAttemptAt: now,
                    safeErrorCode: null,
                },
            });

        if (claim.count !== 1) {
            skippedCount += 1;
            continue;
        }

        claimedCount += 1;

        const effect =
            await prisma.syncOperationEffect.findUnique({
                where: { id: candidate.id },
                select: {
                    notification: {
                        select: {
                            userId: true,
                            title: true,
                            message: true,
                            link: true,
                        },
                    },
                },
            });
        const ownershipWhere = {
            id: candidate.id,
            operationId,
            status: "PROCESSING" as const,
            attemptCount: claimedAttempt,
            lastAttemptAt: now,
        };

        if (!effect?.notification) {
            const failed =
                await prisma.syncOperationEffect.updateMany({
                    where: ownershipWhere,
                    data: {
                        status: "FAILED",
                        safeErrorCode: "NOTIFICATION_MISSING",
                        completedAt: null,
                    },
                });

            if (failed.count === 1) {
                failedCount += 1;
            } else {
                skippedCount += 1;
            }
            continue;
        }

        try {
            await sendPushToUser(effect.notification.userId, {
                title: effect.notification.title,
                body: effect.notification.message,
                url: effect.notification.link ?? undefined,
            });
        } catch {
            const failed =
                await prisma.syncOperationEffect.updateMany({
                    where: ownershipWhere,
                    data: {
                        status: "FAILED",
                        safeErrorCode: "PUSH_DELIVERY_FAILED",
                        completedAt: null,
                    },
                });

            if (failed.count === 1) {
                failedCount += 1;
            } else {
                skippedCount += 1;
            }
            continue;
        }

        // At-least-once delivery: a crash after the remote send and before this
        // guarded update may cause the stale attempt to be delivered again.
        const completed =
            await prisma.syncOperationEffect.updateMany({
                where: ownershipWhere,
                data: {
                    status: "COMPLETED",
                    completedAt: new Date(),
                    safeErrorCode: null,
                },
            });

        if (completed.count === 1) {
            completedCount += 1;
        } else {
            skippedCount += 1;
        }
    }

    const [exhaustedCount, pendingCount] = await Promise.all([
        prisma.syncOperationEffect.count({
            where: {
                operationId,
                status: { not: "COMPLETED" },
                attemptCount: {
                    gte: SYNC_EFFECT_MAX_ATTEMPTS,
                },
            },
        }),
        prisma.syncOperationEffect.count({
            where: {
                operationId,
                attemptCount: {
                    lt: SYNC_EFFECT_MAX_ATTEMPTS,
                },
                OR: [
                    { status: "PENDING" },
                    { status: "FAILED" },
                    {
                        status: "PROCESSING",
                        lastAttemptAt: { lte: staleBefore },
                    },
                ],
            },
        }),
    ]);

    return {
        operationId,
        claimedCount,
        completedCount,
        failedCount,
        skippedCount,
        exhaustedCount,
        pendingCount,
    };
}
