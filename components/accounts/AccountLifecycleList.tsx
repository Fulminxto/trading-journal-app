"use client";

import Link from "next/link";
import { Archive, LoaderCircle, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { archiveAccount, deleteAccount, restoreAccount } from "@/app/accounts/actions";

export type LifecycleAccount = { id: string; name: string; status: "ACTIVE" | "ARCHIVED"; type: string; currency: string; broker: string | null; canArchiveOrRestore: boolean; canDelete: boolean };
export type LifecycleLabels = { open: string; viewArchived: string; archive: string; restore: string; delete: string; cancel: string; archiveTitle: string; archiveDescription: string; restoreTitle: string; restoreDescription: string; deleteTitle: string; deleteDescription: string; pending: string; actionFailed: string };
type Confirmation = { kind: "archive" | "restore" | "delete"; account: LifecycleAccount };

export function getLifecycleActionLabels(account: LifecycleAccount, labels: LifecycleLabels) {
  return account.status === "ACTIVE"
    ? [labels.open, ...(account.canArchiveOrRestore ? [labels.archive] : []), ...(account.canDelete ? [labels.delete] : [])]
    : [labels.viewArchived, ...(account.canArchiveOrRestore ? [labels.restore] : [])];
}

export default function AccountLifecycleList({ accounts, labels }: { accounts: LifecycleAccount[]; labels: LifecycleLabels }) {
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [isPending, startTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (confirmation) queueMicrotask(() => cancelRef.current?.focus()); }, [confirmation]);
  const close = () => { if (isPending) return; setConfirmation(null); queueMicrotask(() => triggerRef.current?.focus()); };
  const request = (kind: Confirmation["kind"], account: LifecycleAccount, trigger: HTMLButtonElement) => { triggerRef.current = trigger; setConfirmation({ kind, account }); };
  const submit = () => {
    if (!confirmation || isPending) return;
    const formData = new FormData();
    formData.set("accountId", confirmation.account.id);
    formData.set("redirectTo", "/accounts/manage");
    const action = confirmation.kind === "archive" ? archiveAccount : confirmation.kind === "restore" ? restoreAccount : deleteAccount;
    startTransition(async () => { try { await action(formData); toast.error(labels.actionFailed); } catch { toast.error(labels.actionFailed); } });
  };
  const dialogTitle = confirmation?.kind === "archive" ? labels.archiveTitle : confirmation?.kind === "restore" ? labels.restoreTitle : labels.deleteTitle;
  const dialogDescription = confirmation?.kind === "archive" ? labels.archiveDescription : confirmation?.kind === "restore" ? labels.restoreDescription : labels.deleteDescription;

  return <><div className="divide-y divide-flash/[0.07]">{accounts.map((account) => <article key={account.id} className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 md:flex-row md:items-center md:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="max-w-full break-words text-base font-semibold text-flash">{account.name}</h3><span className={`rounded-pill border-[0.5px] px-2 py-1 text-micro font-medium ${account.status === "ACTIVE" ? "border-accent/20 text-accent" : "border-flash/[0.12] text-muted"}`}>{account.status === "ACTIVE" ? "Active" : "Archived"}</span></div><p className="mt-1 text-xs text-muted"><span>{account.type}</span><span aria-hidden="true"> · </span><span>{account.currency}</span>{account.broker && <><span aria-hidden="true"> · </span><span>{account.broker}</span></>}</p></div><div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap md:justify-end"><Link href={`/accounts/${account.id}/dashboard`} aria-label={`${account.status === "ACTIVE" ? labels.open : labels.viewArchived}: ${account.name}`} className="inline-flex min-h-11 items-center justify-center rounded-inner border-[0.5px] border-accent/25 px-3 py-2 text-sm font-medium text-accent-bright outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60">{account.status === "ACTIVE" ? labels.open : labels.viewArchived}</Link>{account.status === "ACTIVE" && account.canArchiveOrRestore && <button type="button" aria-label={`${labels.archive}: ${account.name}`} onClick={(event) => request("archive", account, event.currentTarget)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-inner border-[0.5px] border-warning/25 px-3 py-2 text-sm text-warning outline-none focus-visible:ring-2 focus-visible:ring-warning/60"><Archive size={15} aria-hidden="true" />{labels.archive}</button>}{account.status === "ARCHIVED" && account.canArchiveOrRestore && <button type="button" aria-label={`${labels.restore}: ${account.name}`} onClick={(event) => request("restore", account, event.currentTarget)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent/25 px-3 py-2 text-sm text-accent-bright outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"><RotateCcw size={15} aria-hidden="true" />{labels.restore}</button>}{account.status === "ACTIVE" && account.canDelete && <button type="button" aria-label={`${labels.delete}: ${account.name}`} onClick={(event) => request("delete", account, event.currentTarget)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-inner border-[0.5px] border-negative/25 px-3 py-2 text-sm text-negative outline-none focus-visible:ring-2 focus-visible:ring-negative/60"><Trash2 size={15} aria-hidden="true" />{labels.delete}</button>}</div></article>)}</div>{confirmation && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) close(); }}><div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="lifecycle-dialog-title" aria-describedby="lifecycle-dialog-description" onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(); } else if (event.key === "Tab") { const items = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? []); const first = items[0]; const last = items.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } } }} className="w-full max-w-md rounded-card border-[0.5px] border-flash/[0.14] bg-surface-1 p-6 shadow-[0_24px_80px_rgba(0,0,0,.58)]"><h2 id="lifecycle-dialog-title" className="text-subsection text-flash">{dialogTitle}</h2><p id="lifecycle-dialog-description" className="mt-3 text-sm leading-6 text-muted">{dialogDescription}</p><p className="mt-3 break-words text-sm font-medium text-flash">{confirmation.account.name}</p><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button ref={cancelRef} type="button" disabled={isPending} onClick={close} className="min-h-11 rounded-inner border-[0.5px] border-flash/[0.14] px-4 py-2 text-sm text-muted outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 disabled:cursor-not-allowed disabled:opacity-50">{labels.cancel}</button><button type="button" disabled={isPending} onClick={submit} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-inner bg-negative/15 px-4 py-2 text-sm font-semibold text-negative outline-none focus-visible:ring-2 focus-visible:ring-negative/60 disabled:cursor-not-allowed disabled:opacity-60">{isPending && <LoaderCircle size={15} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />}{isPending ? labels.pending : confirmation.kind === "archive" ? labels.archive : confirmation.kind === "restore" ? labels.restore : labels.delete}</button></div></div></div>}</>;
}
