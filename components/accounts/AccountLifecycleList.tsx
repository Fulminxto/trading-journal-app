"use client";

import Link from "next/link";
import { Archive, ArchiveRestore, Ellipsis, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, useTransition, type CSSProperties, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { archiveAccount, deleteAccount, restoreAccount } from "@/app/accounts/actions";

export type LifecycleAccount = { id: string; name: string; status: "ACTIVE" | "ARCHIVED"; type: string; currency: string; broker: string | null; role: string | null; canArchiveOrRestore: boolean; canDelete: boolean };
export type LifecycleLabels = { open: string; viewArchived: string; archive: string; restore: string; delete: string; cancel: string; archiveTitle: string; archiveDescription: string; restoreTitle: string; restoreDescription: string; deleteTitle: string; deleteDescription: string; pending: string; actionFailed: string };
type Confirmation = { kind: "archive" | "restore" | "delete"; account: LifecycleAccount };

export const DATA_TABLE_ROW = "flex w-full flex-col gap-3 px-0 py-3 md:flex-row md:items-center md:gap-0 md:px-6";

export function AccountDataTableHeader() {
  return <div role="row" className="mt-4 hidden w-full items-center border-b border-white/[0.05] px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 md:flex">
    <span role="columnheader" className="w-[30%] text-left">Account Name</span>
    <span role="columnheader" className="w-[20%] text-left">Type &amp; Currency</span>
    <span role="columnheader" className="w-[15%] text-left">Role</span>
    <span role="columnheader" className="w-[15%] text-left">Status</span>
    <span role="columnheader" className="flex w-[20%] items-center justify-end gap-3 text-right">Actions</span>
  </div>;
}

function LifecycleOverflowMenu({ account, labels, onRequest }: { account: LifecycleAccount; labels: LifecycleLabels; onRequest: (kind: Confirmation["kind"], account: LifecycleAccount, trigger: HTMLButtonElement) => void }) {
  const triggerId = useId();
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<CSSProperties>({ right: 8, top: 8 });
  const actions = account.status === "ACTIVE"
    ? [...(account.canArchiveOrRestore ? [{ kind: "archive" as const, label: labels.archive }] : []), ...(account.canDelete ? [{ kind: "delete" as const, label: labels.delete }] : [])]
    : account.canArchiveOrRestore ? [{ kind: "restore" as const, label: labels.restore }] : [];
  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const bounds = triggerRef.current.getBoundingClientRect();
    const width = 224;
    const estimatedHeight = 12 + (actions.length + 1) * 40 + (account.canDelete ? 9 : 0);
    const left = Math.min(Math.max(8, bounds.right - width), window.innerWidth - width - 8);
    const below = bounds.bottom + 6;
    const top = below + estimatedHeight <= window.innerHeight - 8
      ? below
      : Math.max(8, bounds.top - estimatedHeight - 6);
    setMenuPosition({ left, top, width });
  }, [account.canDelete, actions.length]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    const handleViewportChange = () => updateMenuPosition();
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    queueMicrotask(() => menuRef.current?.querySelector<HTMLElement>("[role='menuitem']")?.focus());
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open, updateMenuPosition]);

  if (actions.length === 0) return null;
  const close = (restoreFocus = false) => { setOpen(false); if (restoreFocus) queueMicrotask(() => triggerRef.current?.focus()); };
  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("[role='menuitem']") ?? []);
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      items[(current + delta + items.length) % items.length]?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      items[event.key === "Home" ? 0 : items.length - 1]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") setOpen(false);
  };

  const menu = open && typeof document !== "undefined" ? createPortal(
    <div ref={menuRef} id={menuId} role="menu" aria-labelledby={triggerId} onKeyDown={handleMenuKeyDown} style={menuPosition} className="fixed z-50 w-56 rounded-xl border border-white/10 bg-[#090f1e]/95 p-1.5 shadow-2xl backdrop-blur-xl">
      <Link role="menuitem" href={`/accounts/${account.id}/edit${account.status === "ARCHIVED" ? "?correction=1" : ""}`} onClick={() => close()} className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-300 outline-none transition-all hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.08] focus-visible:text-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-bright/60">
        <Pencil className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        {account.status === "ARCHIVED" ? "Edit archived account" : "Edit account information"}
      </Link>
      {actions.map((action) => {
        const isDelete = action.kind === "delete";
        const isArchive = action.kind === "archive";
        return <div key={action.kind} className={isDelete ? "my-1 border-t border-white/[0.06] pt-1" : undefined}>
          <button type="button" role="menuitem" onClick={() => { close(); if (triggerRef.current) onRequest(action.kind, account, triggerRef.current); }} className={`flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-inset ${isDelete ? "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:bg-rose-500/10 focus-visible:ring-rose-400/60" : isArchive ? "text-amber-400/90 hover:bg-amber-500/10 hover:text-amber-300 focus-visible:bg-amber-500/10 focus-visible:ring-amber-400/60" : "text-slate-300 hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.08] focus-visible:ring-accent-bright/60"}`}>
            {isDelete ? <Trash2 className="h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" /> : isArchive ? <Archive className="h-4 w-4 shrink-0 text-amber-400/80" aria-hidden="true" /> : <ArchiveRestore className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />}
            {action.label}
          </button>
        </div>;
      })}
    </div>,
    document.body
  ) : null;

  return <div className="relative shrink-0">
    <button ref={triggerRef} id={triggerId} type="button" aria-label={`Account actions for ${account.name}`} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined} onClick={() => { if (open) close(true); else { updateMenuPosition(); setOpen(true); } }} onKeyDown={(event) => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); updateMenuPosition(); setOpen(true); } else if (event.key === "Escape" && open) { event.preventDefault(); close(true); } }} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 outline-none transition-colors hover:bg-white/[0.04] hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-accent-bright/60">
      <Ellipsis size={16} aria-hidden="true" />
    </button>
    {menu}
  </div>;
}

export function getLifecycleActionLabels(account: LifecycleAccount, labels: LifecycleLabels) {
  return account.status === "ACTIVE"
    ? [labels.open, "Edit account information", ...(account.canArchiveOrRestore ? [labels.archive] : []), ...(account.canDelete ? [labels.delete] : [])]
    : [labels.viewArchived, "Edit archived account", ...(account.canArchiveOrRestore ? [labels.restore] : [])];
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

  return <>
    <div role="table" aria-label={accounts[0]?.status === "ACTIVE" ? "Active accounts" : "Archived accounts"}>
      <AccountDataTableHeader />
      {accounts.map((account) => <article role="row" key={account.id} className={`${DATA_TABLE_ROW} border-b border-white/[0.03] transition-colors last:border-b-0 hover:bg-white/[0.02]`}>
        <h3 role="cell" className="min-w-0 truncate text-left text-sm font-medium text-slate-200 md:w-[30%]" title={account.name}>{account.name}</h3>
        <p role="cell" className="text-left text-xs text-slate-500 md:w-[20%]"><span>{account.type}</span><span aria-hidden="true"> • </span><span>{account.currency}</span></p>
        <span role="cell" className="text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 md:w-[15%]">{account.role ?? "—"}</span>
        <div role="cell" className="flex items-center text-left md:w-[15%]"><span className={account.status === "ACTIVE" ? "inline-flex w-fit rounded-full border border-cyan-400/15 px-2 py-0.5 text-[10px] font-medium text-cyan-300/80" : "inline-flex w-fit rounded-full border border-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-slate-500"}>{account.status === "ACTIVE" ? "Active" : "Archived"}</span></div>
        <div role="cell" className="flex items-center justify-end gap-3 text-right md:w-[20%]">
          <Link href={`/accounts/${account.id}/dashboard`} aria-label={`${account.status === "ACTIVE" ? labels.open : labels.viewArchived}: ${account.name}`} className={account.status === "ACTIVE" ? "whitespace-nowrap rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400 outline-none transition-all hover:bg-cyan-500/20 focus-visible:ring-2 focus-visible:ring-accent-bright/60" : "rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-xs text-slate-300 hover:bg-white/[0.08] transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"}>{account.status === "ACTIVE" ? labels.open : labels.viewArchived}</Link>
          <LifecycleOverflowMenu account={account} labels={labels} onRequest={request} />
        </div>
      </article>)}
    </div>
    {confirmation && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="lifecycle-dialog-title" aria-describedby="lifecycle-dialog-description" onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(); } else if (event.key === "Tab") { const items = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? []); const first = items[0]; const last = items.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } } }} className="w-full max-w-md rounded-card border-[0.5px] border-flash/[0.14] bg-surface-1 p-6 shadow-[0_24px_80px_rgba(0,0,0,.58)]">
        <h2 id="lifecycle-dialog-title" className="text-subsection text-flash">{dialogTitle}</h2>
        <p id="lifecycle-dialog-description" className="mt-3 text-sm leading-6 text-muted">{dialogDescription}</p>
        <p className="mt-3 break-words text-sm font-medium text-flash">{confirmation.account.name}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button ref={cancelRef} type="button" disabled={isPending} onClick={close} className="min-h-11 rounded-inner border-[0.5px] border-flash/[0.14] px-4 py-2 text-sm text-muted outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 disabled:cursor-not-allowed disabled:opacity-50">{labels.cancel}</button>
          <button type="button" disabled={isPending} onClick={submit} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-inner bg-negative/15 px-4 py-2 text-sm font-semibold text-negative outline-none focus-visible:ring-2 focus-visible:ring-negative/60 disabled:cursor-not-allowed disabled:opacity-60">{isPending && <LoaderCircle size={15} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />}{isPending ? labels.pending : confirmation.kind === "archive" ? labels.archive : confirmation.kind === "restore" ? labels.restore : labels.delete}</button>
        </div>
      </div>
    </div>}
  </>;
}
