import { NextRequest, NextResponse } from "next/server";

import {
    authenticateTradeSyncRequest,
    authorizeTradeSyncAccount,
    getTradeSyncSource,
} from "@/lib/trade-sync-auth";
import {
    completeSyncOperation,
    SyncOperationCompletionError,
} from "@/lib/trade-sync-operation-completion";

type CompleteSyncOperationPayload = {
    tradingAccountId?: unknown;
    source?: unknown;
};

function getRequiredString(value: unknown) {
    if (typeof value !== "string") {
        return null;
    }

    return value.trim() || null;
}

export async function POST(
    request: NextRequest,
    context: {
        params: Promise<{ operationId: string }>;
    }
) {
    const authentication =
        authenticateTradeSyncRequest(request.headers);

    if (!authentication.authorized) {
        return NextResponse.json(
            { error: authentication.error },
            { status: authentication.status }
        );
    }

    let payload: CompleteSyncOperationPayload;

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

    if (!tradingAccountId || !source) {
        return NextResponse.json(
            {
                error:
                    "Missing or invalid fields: tradingAccountId, source",
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

    const { operationId } = await context.params;

    try {
        const result = await completeSyncOperation({
            operationId,
            tradingAccountId,
            source,
        });

        return NextResponse.json({
            operationId: result.operationId,
            status: result.status,
            totalCount: result.totalCount,
            importedCount: result.importedCount,
            updatedCount: result.updatedCount,
            skippedCount: result.skippedCount,
            failedCount: result.failedCount,
            processedCount: result.processedCount,
            completedAt: result.completedAt.toISOString(),
            durationMs: result.durationMs,
            replayed: result.replayed,
        });
    } catch (error) {
        if (error instanceof SyncOperationCompletionError) {
            return NextResponse.json(
                { error: error.safeMessage },
                { status: error.httpStatus }
            );
        }

        return NextResponse.json(
            { error: "Batch completion failed" },
            { status: 500 }
        );
    }
}
