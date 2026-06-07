"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { inviteMember, cancelInvite } from "./actions";

type InviteFormLabels = {
    usernamePlaceholder: string;
    sendInvite: string;
    roleManager: string;
    roleMember: string;
    roleViewer: string;
};

export function InviteMemberForm({
    accountId,
    canManageRoles,
    t,
}: {
    accountId: string;
    canManageRoles: boolean;
    t: InviteFormLabels;
}) {
    const [state, formAction, isPending] = useActionState(
        inviteMember.bind(null, accountId),
        null
    );

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state !== null && !state.error) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <form ref={formRef} action={formAction} className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    name="username"
                    type="text"
                    placeholder={t.usernamePlaceholder}
                    required
                    autoComplete="off"
                    disabled={isPending}
                    className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500/40 disabled:opacity-50"
                />
                <select
                    name="role"
                    defaultValue="MEMBER"
                    disabled={isPending}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/40 disabled:opacity-50"
                >
                    <option value="MEMBER">{t.roleMember}</option>
                    <option value="VIEWER">{t.roleViewer}</option>
                    {canManageRoles && (
                        <option value="MANAGER">{t.roleManager}</option>
                    )}
                </select>
                <button
                    type="submit"
                    disabled={isPending}
                    className="shrink-0 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-50"
                >
                    {t.sendInvite}
                </button>
            </div>
            {state?.error && (
                <p className="text-sm text-red-400">{state.error}</p>
            )}
        </form>
    );
}

export function CancelInviteButton({
    accountId,
    inviteId,
    label,
}: {
    accountId: string;
    inviteId: string;
    label: string;
}) {
    const [isPending, startTransition] = useTransition();

    function handleClick() {
        startTransition(async () => {
            await cancelInvite(accountId, inviteId);
        });
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className="shrink-0 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
        >
            {label}
        </button>
    );
}
