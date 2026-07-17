import { prisma } from "@/lib/prisma";
import {
    ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE,
    isArchivedAccount,
} from "@/lib/account-write-guard";

export type TradeSyncSource = "mt5" | "broker";

export function getTradeSyncSource(value: unknown) {
    if (typeof value !== "string") {
        return null;
    }

    const source = value.trim().toLowerCase();

    if (source === "mt5" || source === "broker") {
        return source;
    }

    return null;
}

export function authenticateTradeSyncRequest(
    headers: Headers
) {
    const expectedSecret =
        process.env.TRADE_SYNC_SECRET;

    if (!expectedSecret) {
        return {
            authorized: false as const,
            status: 500,
            error: "Trade sync is not configured",
        };
    }

    const providedSecret = headers.get(
        "x-voltis-sync-secret"
    );

    if (providedSecret !== expectedSecret) {
        return {
            authorized: false as const,
            status: 401,
            error: "Unauthorized",
        };
    }

    return {
        authorized: true as const,
    };
}

export async function authorizeTradeSyncAccount({
    tradingAccountId,
    source,
}: {
    tradingAccountId: string;
    source: TradeSyncSource;
}) {
    const account =
        await prisma.tradingAccount.findUnique({
            where: {
                id: tradingAccountId,
            },
            select: {
                id: true,
                name: true,
                status: true,
                integrationMode: true,
                autoSyncEnabled: true,
                mt5Enabled: true,
                brokerSyncEnabled: true,
                syncStatus: true,
                lastSyncedAt: true,
            },
        });

    if (!account) {
        return {
            allowed: false as const,
            reason: "not_found" as const,
            status: 404,
            error: "Trading account not found",
            account: null,
        };
    }

    if (isArchivedAccount(account.status)) {
        return {
            allowed: false as const,
            reason: "archived" as const,
            status: 409,
            error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE,
            account,
        };
    }

    if (account.integrationMode === "manual") {
        return {
            allowed: false as const,
            reason: "manual" as const,
            status: 403,
            error:
                "Trade sync is disabled because this account is set to Manual Only",
            account,
        };
    }

    const sourceAllowedByMode =
        account.integrationMode === "hybrid" ||
        account.integrationMode === source;

    if (!sourceAllowedByMode) {
        return {
            allowed: false as const,
            reason: "source_not_allowed" as const,
            status: 403,
            error: `Source "${source}" is not allowed for integration mode "${account.integrationMode}"`,
            account,
        };
    }

    if (source === "mt5" && !account.mt5Enabled) {
        return {
            allowed: false as const,
            reason: "mt5_disabled" as const,
            status: 403,
            error:
                "MT5 sync is not enabled for this account",
            account,
        };
    }

    if (
        source === "broker" &&
        !account.brokerSyncEnabled
    ) {
        return {
            allowed: false as const,
            reason: "broker_disabled" as const,
            status: 403,
            error:
                "Broker sync is not enabled for this account",
            account,
        };
    }

    if (!account.autoSyncEnabled) {
        return {
            allowed: false as const,
            reason: "auto_sync_disabled" as const,
            status: 403,
            error:
                "Auto sync is not enabled for this account",
            account,
        };
    }

    return {
        allowed: true as const,
        account,
    };
}
