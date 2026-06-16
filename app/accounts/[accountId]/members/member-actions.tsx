"use client";

import { useState, useTransition } from "react";
import {
    changeMemberRole,
    updateMemberPermissions,
    removeMember,
} from "./actions";

type MemberRole = "MANAGER" | "MEMBER" | "VIEWER";

type CurrentPerms = {
    canCreateTrades: boolean;
    canEditTrades: boolean;
    canDeleteTrades: boolean;
    canViewAnalytics: boolean;
    canViewReports: boolean;
    canViewCopilot: boolean;
    canViewMembers: boolean;
};

const PERM_KEYS: (keyof CurrentPerms)[] = [
    "canCreateTrades",
    "canEditTrades",
    "canDeleteTrades",
    "canViewAnalytics",
    "canViewReports",
    "canViewCopilot",
    "canViewMembers",
];

type MemberActionsLabels = {
    changeRoleLabel: string;
    saveRole: string;
    permissionsLabel: string;
    savePermissions: string;
    removeMemberLabel: string;
    confirmRemove: string;
    confirmYes: string;
    cancelConfirm: string;
    lastManagerNote: string;
    roleManager: string;
    roleMember: string;
    roleViewer: string;
    perm_canCreateTrades: string;
    perm_canEditTrades: string;
    perm_canDeleteTrades: string;
    perm_canViewAnalytics: string;
    perm_canViewReports: string;
    perm_canViewCopilot: string;
    perm_canViewMembers: string;
};

export function MemberManagementActions({
    accountId,
    targetUserId,
    currentRole,
    currentPerms,
    canManageRoles,
    canManageMembers,
    isCreator,
    isLastManager,
    t,
}: {
    accountId: string;
    targetUserId: string;
    currentRole: MemberRole;
    currentPerms: CurrentPerms;
    canManageRoles: boolean;
    canManageMembers: boolean;
    isCreator: boolean;
    isLastManager: boolean;
    t: MemberActionsLabels;
}) {
    const [isPending, startTransition] = useTransition();
    const [selectedRole, setSelectedRole] = useState<MemberRole>(currentRole);
    const [perms, setPerms] = useState<CurrentPerms>(currentPerms);
    const [showConfirmRemove, setShowConfirmRemove] = useState(false);
    const [roleError, setRoleError] = useState<string | null>(null);
    const [permError, setPermError] = useState<string | null>(null);
    const [removeError, setRemoveError] = useState<string | null>(null);

    if (!canManageRoles && !canManageMembers) return null;

    const canDemote = !(currentRole === "MANAGER" && isLastManager);

    const permLabels: Record<keyof CurrentPerms, string> = {
        canCreateTrades: t.perm_canCreateTrades,
        canEditTrades: t.perm_canEditTrades,
        canDeleteTrades: t.perm_canDeleteTrades,
        canViewAnalytics: t.perm_canViewAnalytics,
        canViewReports: t.perm_canViewReports,
        canViewCopilot: t.perm_canViewCopilot,
        canViewMembers: t.perm_canViewMembers,
    };

    function handleSaveRole() {
        setRoleError(null);
        startTransition(async () => {
            const result = await changeMemberRole(accountId, targetUserId, selectedRole);
            if (result?.error) setRoleError(result.error);
        });
    }

    function handleSavePermissions() {
        setPermError(null);
        startTransition(async () => {
            const result = await updateMemberPermissions(accountId, targetUserId, perms);
            if (result?.error) setPermError(result.error);
        });
    }

    function handleRemove() {
        setRemoveError(null);
        startTransition(async () => {
            const result = await removeMember(accountId, targetUserId);
            if (result?.error) {
                setRemoveError(result.error);
                setShowConfirmRemove(false);
            }
        });
    }

    return (
        <div className="mt-6 space-y-6 border-t border-white/10 pt-6">
            {/* Change Role */}
            {canManageRoles && (
                <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.15em] text-gray-500">
                        {t.changeRoleLabel}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as MemberRole)}
                            disabled={isPending}
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-accent-bright/40 disabled:opacity-50"
                        >
                            <option value="MANAGER">{t.roleManager}</option>
                            <option value="MEMBER">{t.roleMember}</option>
                            <option value="VIEWER">{t.roleViewer}</option>
                        </select>
                        <button
                            onClick={handleSaveRole}
                            disabled={
                                isPending ||
                                selectedRole === currentRole ||
                                (!canDemote && selectedRole !== "MANAGER")
                            }
                            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/[0.06] disabled:opacity-40"
                        >
                            {t.saveRole}
                        </button>
                    </div>
                    {!canDemote && (
                        <p className="mt-2 text-xs text-yellow-400">{t.lastManagerNote}</p>
                    )}
                    {roleError && (
                        <p className="mt-2 text-sm text-red-400">{roleError}</p>
                    )}
                </div>
            )}

            {/* Edit Permissions */}
            {canManageRoles && (
                <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.15em] text-gray-500">
                        {t.permissionsLabel}
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {PERM_KEYS.map((key) => (
                            <label
                                key={key}
                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300 transition hover:bg-white/[0.03]"
                            >
                                <input
                                    type="checkbox"
                                    checked={perms[key]}
                                    onChange={(e) =>
                                        setPerms((p) => ({ ...p, [key]: e.target.checked }))
                                    }
                                    disabled={isPending}
                                    className="accent-cyan-400"
                                />
                                {permLabels[key]}
                            </label>
                        ))}
                    </div>
                    <button
                        onClick={handleSavePermissions}
                        disabled={isPending}
                        className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/[0.06] disabled:opacity-50"
                    >
                        {t.savePermissions}
                    </button>
                    {permError && (
                        <p className="mt-2 text-sm text-red-400">{permError}</p>
                    )}
                </div>
            )}

            {/* Remove Member */}
            {canManageMembers && !isCreator && !isLastManager && (
                <div>
                    {!showConfirmRemove ? (
                        <button
                            onClick={() => setShowConfirmRemove(true)}
                            disabled={isPending}
                            className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                        >
                            {t.removeMemberLabel}
                        </button>
                    ) : (
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-sm text-red-400">{t.confirmRemove}</p>
                            <button
                                onClick={handleRemove}
                                disabled={isPending}
                                className="rounded-2xl border border-red-500/30 bg-red-500/20 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
                            >
                                {t.confirmYes}
                            </button>
                            <button
                                onClick={() => setShowConfirmRemove(false)}
                                disabled={isPending}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/[0.06] disabled:opacity-50"
                            >
                                {t.cancelConfirm}
                            </button>
                        </div>
                    )}
                    {removeError && (
                        <p className="mt-2 text-sm text-red-400">{removeError}</p>
                    )}
                </div>
            )}
        </div>
    );
}
