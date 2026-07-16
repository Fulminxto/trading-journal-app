"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import {
    getChangedActivityFields,
    hasMeaningfulChanges,
} from "@/lib/activity-policy";

const ALLOWED_INTEGRATION_MODES = [
    "manual",
    "mt5",
    "broker",
    "hybrid",
] as const;

type IntegrationMode =
    (typeof ALLOWED_INTEGRATION_MODES)[number];

export type IntegrationSetupState = {
    error?: string;
    fieldErrors?: Partial<Record<
        | "integrationMode"
        | "mt5AccountLogin"
        | "mt5ServerName"
        | "brokerProvider"
        | "brokerAccountId",
        string
    >>;
};

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

function getIntegrationMode(value: string) {
    if (
        ALLOWED_INTEGRATION_MODES.includes(
            value as IntegrationMode
        )
    ) {
        return value as IntegrationMode;
    }

    return null;
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
    _previousState: IntegrationSetupState | null,
    formData: FormData
): Promise<IntegrationSetupState> {
    const membership =
        await getIntegrationAccess(accountId);

    const integrationMode =
        getIntegrationMode(
            getString(formData, "integrationMode")
        );

    if (!integrationMode) {
        return {
            error: "Choose a valid integration mode.",
            fieldErrors: {
                integrationMode: "Choose a valid integration mode.",
            },
        };
    }

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

    const fieldErrors: IntegrationSetupState["fieldErrors"] = {};

    if (mt5Enabled && !mt5AccountLogin) {
        fieldErrors.mt5AccountLogin = "Enter the MT5 account login.";
    }

    if (mt5Enabled && !mt5ServerName) {
        fieldErrors.mt5ServerName = "Enter the MT5 server name.";
    }

    if (brokerSyncEnabled && !brokerProvider) {
        fieldErrors.brokerProvider = "Enter the broker provider.";
    }

    if (brokerSyncEnabled && !brokerAccountId) {
        fieldErrors.brokerAccountId = "Enter the broker account ID.";
    }

    if (Object.keys(fieldErrors).length > 0) {
        return {
            error: "Complete the required identifiers before saving.",
            fieldErrors,
        };
    }

    const syncStatus =
        !autoSyncEnabled
            ? "inactive"
            : integrationMode !== membership.tradingAccount.integrationMode
                ? "pending"
                : membership.tradingAccount.syncStatus === "connected" ||
                    membership.tradingAccount.syncStatus === "error"
                    ? membership.tradingAccount.syncStatus
                    : "pending";

    const currentConfiguration = {
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

    const desiredConfiguration = {
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
        brokerProvider: brokerSyncEnabled
            ? brokerProvider
            : null,
        brokerAccountId: brokerSyncEnabled
            ? brokerAccountId
            : null,
        syncStatus,
    };

    const changes = getChangedActivityFields(
        currentConfiguration,
        desiredConfiguration
    );

    if (hasMeaningfulChanges(changes)) {
        await prisma.tradingAccount.update({
            where: {
                id: accountId,
            },
            data: {
                ...desiredConfiguration,
                lastSyncedAt:
                    membership.tradingAccount.lastSyncedAt,
            },
        });

        const sensitiveFields = new Set([
            "mt5AccountLogin",
            "mt5ServerName",
            "brokerAccountId",
        ]);
        const sensitiveFieldsChanged =
            changes.changedFields.filter((field) =>
                sensitiveFields.has(field)
            );
        const safeChangedFields =
            changes.changedFields.filter((field) =>
                !sensitiveFields.has(field)
            );
        const safeBefore = Object.fromEntries(
            safeChangedFields.map((field) => [
                field,
                changes.before[field],
            ])
        );
        const safeAfter = Object.fromEntries(
            safeChangedFields.map((field) => [
                field,
                changes.after[field],
            ])
        );

        await logActivity({
            userId: membership.userId,
            accountId,
            type: "INTEGRATION_SETTINGS_UPDATED",
            title: "Integration settings updated",
            description: `${membership.user.username} updated integration settings`,
            metadata: {
                changedFields: changes.changedFields,
                sensitiveFieldsChanged,
                before: safeBefore,
                after: safeAfter,
            },
        });
    }

    revalidatePath(
        `/accounts/${accountId}/integrations`
    );

    redirect(
        `/accounts/${accountId}/integrations?toast=updated`
    );
}

export async function resetAccountSyncStatus(
    accountId: string
) {
    const membership =
        await getIntegrationAccess(accountId);

    const nextStatus =
        membership.tradingAccount.integrationMode === "manual"
            ? "inactive"
            : "pending";

    const currentStatus =
        membership.tradingAccount.syncStatus;

    if (currentStatus !== nextStatus) {
        await prisma.tradingAccount.update({
            where: {
                id: accountId,
            },
            data: {
                syncStatus: nextStatus,
            },
        });

        await logActivity({
            userId: membership.userId,
            accountId,
            type: "INTEGRATION_SYNC_RESET",
            title: "Sync status reset",
            description: `${membership.user.username} reset integration sync status`,
            metadata: {
                changedFields: ["syncStatus"],
                before: {
                    syncStatus: currentStatus,
                },
                after: {
                    syncStatus: nextStatus,
                },
            },
        });
    }

    revalidatePath(
        `/accounts/${accountId}/integrations`
    );

    redirect(
        `/accounts/${accountId}/integrations?toast=updated`
    );
}
