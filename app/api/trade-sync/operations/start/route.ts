import { NextRequest, NextResponse } from "next/server";

import {
    authenticateTradeSyncRequest,
    authorizeTradeSyncAccount,
    getTradeSyncSource,
} from "@/lib/trade-sync-auth";
import {
    startSyncOperation,
    SyncOperationConflictError,
    SyncOperationTriggerError,
} from "@/lib/trade-sync-operation";

const MAX_EXTERNAL_BATCH_ID_LENGTH = 200;

type StartSyncOperationPayload = {
    tradingAccountId?: unknown;
    source?: unknown;
    externalBatchId?: unknown;
    trigger?: unknown;
    totalCount?: unknown;
};

function getRequiredString(value: unknown) {
    if (typeof value !== "string") {
        return null;
    }

    return value.trim() || null;
}

function getTotalCount(value: unknown) {
    if (value === undefined || value === null) {
        return null;
    }

    if (
        typeof value !== "number" ||
        !Number.isInteger(value) ||
        value < 0
    ) {
        return undefined;
    }

    return value;
}

export async function POST(request: NextRequest) {
    const authentication =
        authenticateTradeSyncRequest(request.headers);

    if (!authentication.authorized) {
        return NextResponse.json(
            { error: authentication.error },
            { status: authentication.status }
        );
    }

    let payload: StartSyncOperationPayload;

    try {
        payload = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON payload" },
            { status: 400 }
        );
    }

    const tradingAccountId = getRequiredString(
        payload.tradingAccountId
    );
    const source = getTradeSyncSource(payload.source);
    const externalBatchId = getRequiredString(
        payload.externalBatchId
    );
    const trigger = getRequiredString(payload.trigger);
    const totalCount = getTotalCount(payload.totalCount);

    if (
        !tradingAccountId ||
        !source ||
        !externalBatchId ||
        externalBatchId.length >
            MAX_EXTERNAL_BATCH_ID_LENGTH ||
        !trigger ||
        totalCount === undefined
    ) {
        return NextResponse.json(
            {
                error:
                    "Missing or invalid fields: tradingAccountId, source, externalBatchId, trigger (must be automatic), totalCount (must be a non-negative integer or null)",
            },
            { status: 400 }
        );
    }

    const accessCheck =
        await authorizeTradeSyncAccount({
            tradingAccountId,
            source,
        });

    if (!accessCheck.allowed) {
        return NextResponse.json(
            { error: accessCheck.error },
            { status: accessCheck.status }
        );
    }

    try {
        const result = await startSyncOperation({
            accountId: accessCheck.account.id,
            source,
            externalBatchId,
            trigger,
            totalCount,
        });
        const { operation } = result;

        return NextResponse.json(
            {
                operationId: operation.id,
                status: operation.status,
                totalCount: operation.totalCount,
                importedCount:
                    operation.importedCount,
                updatedCount: operation.updatedCount,
                skippedCount: operation.skippedCount,
                failedCount: operation.failedCount,
                startedAt:
                    operation.startedAt.toISOString(),
                resumed: result.resumed,
            },
            { status: result.resumed ? 200 : 201 }
        );
    } catch (error) {
        if (error instanceof SyncOperationConflictError) {
            return NextResponse.json(
                { error: error.message },
                { status: 409 }
            );
        }


        if (error instanceof SyncOperationTriggerError) {
            return NextResponse.json(
                {
                    error:
                        "Missing or invalid fields: tradingAccountId, source, externalBatchId, trigger (must be automatic), totalCount (must be a non-negative integer or null)",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Batch start failed" },
            { status: 500 }
        );
    }
}
