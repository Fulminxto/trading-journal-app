"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

const ALLOWED_INTEGRATION_MODES = [
    "manual",
    "mt5",
    "broker",
    "hybrid",
] as const;

const ALLOWED_SYNC_STATUSES = [
    "inactive",
    "pending",
    "connected",
    "error",
] as const;

type IntegrationMode =
    (typeof ALLOWED_INTEGRATION_MODES)[number];

type SyncStatus =
    (typeof ALLOWED_SYNC_STATUSES)[number];

function getString(
    formData: FormData,
    key: string
) {
    const value = formData.get(key);

    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
}

function getLimitedString(
    formData: FormData,
    key: string,
    maxLength: number
) {
    return getString(formData, key).slice(
        0,
        maxLength
    );
}

function getBoolean(
    formData: FormData,
    key: string
) {
    return formData.get(key) === "on";
}

function getIntegrationMode(
    value: string
): IntegrationMode {
    if (
        ALLOWED_INTEGRATION_MODES.includes(
            value as IntegrationMode
        )
    ) {
        return value as IntegrationMode;
    }

    return "manual";
}

function getSyncStatus(
    value: string
): SyncStatus {
    if (
        ALLOWED_SYNC_STATUSES.includes(
            value as SyncStatus
        )
    ) {
        return value as SyncStatus;
    }

    return "inactive";
}

async function getIntegrationAccess(
    accountId: string
) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const membership =
        await prisma.accountMember.findFirst({
            where: {
                userId: session.user.id,
                tradingAccountId: accountId,
            },
            include: {
                tradingAccount: true,
                user: true,
            },
        });

    if (!membership) {
        redirect("/accounts");
    }

    const isManager =
        membership.role === "MANAGER";

    const canManageIntegrations =
        isManager || membership.canManageAccount;

    if (!canManageIntegrations) {
        redirect(
            `/accounts/${accountId}/dashboard`
        );
    }

    if (
        membership.tradingAccount.status ===
        "ARCHIVED"
    ) {
        redirect(
            `/accounts/${accountId}/dashboard`
        );
    }

    return membership;
}

export async function updateAccountIntegrations(
    accountId: string,
    formData: FormData
) {
    const membership =
        await getIntegrationAccess(accountId);

    const integrationMode =
        getIntegrationMode(
            getString(formData, "integrationMode")
        );

    const mt5Enabled =
        integrationMode === "mt5" ||
        integrationMode === "hybrid";

    const brokerSyncEnabled =
        integrationMode === "broker" ||
        integrationMode === "hybrid";

    const autoSyncEnabled =
        integrationMode !== "manual";

    const mt5AccountLogin =
        getLimitedString(
            formData,
            "mt5AccountLogin",
            80
        ) || null;

    const mt5ServerName =
        getLimitedString(
            formData,
            "mt5ServerName",
            120
        ) || null;

    const brokerProvider =
        getLimitedString(
            formData,
            "brokerProvider",
            120
        ) || null;

    const brokerAccountId =
        getLimitedString(
            formData,
            "brokerAccountId",
            120
        ) || null;

    const requestedSyncStatus =
        getSyncStatus(
            getString(formData, "syncStatus")
        );

    const syncStatus =
        autoSyncEnabled
            ? requestedSyncStatus === "inactive"
                ? "pending"
                : requestedSyncStatus
            : "inactive";

    const before = {
        integrationMode:
            membership.tradingAccount.integrationMode,
        autoSyncEnabled:
            membership.tradingAccount.autoSyncEnabled,
        mt5Enabled:
            membership.tradingAccount.mt5Enabled,
        mt5AccountLogin:
            membership.tradingAccount.mt5AccountLogin,
        mt5ServerName:
            membership.tradingAccount.mt5ServerName,
        brokerSyncEnabled:
            membership.tradingAccount.brokerSyncEnabled,
        brokerProvider:
            membership.tradingAccount.brokerProvider,
        brokerAccountId:
            membership.tradingAccount.brokerAccountId,
        syncStatus:
            membership.tradingAccount.syncStatus,
    };

    const updatedAccount =
        await prisma.tradingAccount.update({
            where: {
                id: accountId,
            },
            data: {
                integrationMode,
                autoSyncEnabled,

                mt5Enabled,
                mt5AccountLogin: mt5Enabled
                    ? mt5AccountLogin
                    : null,
                mt5ServerName: mt5Enabled
                    ? mt5ServerName
                    : null,

                brokerSyncEnabled,
                brokerProvider:
                    brokerSyncEnabled
                        ? brokerProvider
                        : null,
                brokerAccountId:
                    brokerSyncEnabled
                        ? brokerAccountId
                        : null,

                syncStatus,
                lastSyncedAt:
                    syncStatus === "connected"
                        ? new Date()
                        : membership.tradingAccount
                            .lastSyncedAt,
            },
        });

    await logActivity({
        userId: membership.userId,
        accountId,
        type: "INTEGRATION_SETTINGS_UPDATED",
        title: "Integration settings updated",
        description: `${membership.user.username} updated integration settings`,
        metadata: {
            before,
            after: {
                integrationMode:
                    updatedAccount.integrationMode,
                autoSyncEnabled:
                    updatedAccount.autoSyncEnabled,
                mt5Enabled:
                    updatedAccount.mt5Enabled,
                mt5AccountLogin:
                    updatedAccount.mt5AccountLogin,
                mt5ServerName:
                    updatedAccount.mt5ServerName,
                brokerSyncEnabled:
                    updatedAccount.brokerSyncEnabled,
                brokerProvider:
                    updatedAccount.brokerProvider,
                brokerAccountId:
                    updatedAccount.brokerAccountId,
                syncStatus:
                    updatedAccount.syncStatus,
            },
        },
    });

    revalidatePath(
        `/accounts/${accountId}/integrations`
    );

    redirect(
        `/accounts/${accountId}/integrations?toast=updated`
    );
}