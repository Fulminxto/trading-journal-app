"use client";

import Link from "next/link";
import {
  Archive,
  Cable,
  Ellipsis,
  LoaderCircle,
  Settings,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { archiveAccount, deleteAccount } from "@/app/accounts/actions";

type ConfirmationKind = "archive" | "delete";

type AccountActionsMenuProps = {
  accountId: string;
  accountName: string;
  accountStatus: string;
  canOpenManage: boolean;
  canViewMembers: boolean;
  canManageIntegrations: boolean;
  canArchiveAccount: boolean;
  canDeleteAccount: boolean;
  placement: "grid" | "focus";
  className?: string;
};

const MENU_WIDTH = 240;
const VIEWPORT_GAP = 8;

function getMenuPosition(
  trigger: HTMLButtonElement,
  estimatedHeight: number
): CSSProperties {
  const bounds = trigger.getBoundingClientRect();
  const left = Math.min(
    Math.max(VIEWPORT_GAP, bounds.right - MENU_WIDTH),
    window.innerWidth - MENU_WIDTH - VIEWPORT_GAP
  );
  const below = bounds.bottom + 6;
  const above = bounds.top - estimatedHeight - 6;
  const top =
    below + estimatedHeight <= window.innerHeight - VIEWPORT_GAP
      ? below
      : Math.max(VIEWPORT_GAP, above);

  return { left, top, width: MENU_WIDTH };
}

export default function AccountActionsMenu({
  accountId,
  accountName,
  accountStatus,
  canOpenManage,
  canViewMembers,
  canManageIntegrations,
  canArchiveAccount,
  canDeleteAccount,
  placement,
  className = "",
}: AccountActionsMenuProps) {
  const triggerId = useId();
  const menuId = useId();
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const focusOnOpen = useRef<"first" | "last">("first");
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<CSSProperties>({
    left: VIEWPORT_GAP,
    top: VIEWPORT_GAP,
    width: MENU_WIDTH,
  });
  const [confirmation, setConfirmation] = useState<ConfirmationKind | null>(null);
  const [isPending, startTransition] = useTransition();

  const canEditAccount = accountStatus === "ACTIVE" && canOpenManage;
  const navigationCount = [canEditAccount, canOpenManage, canViewMembers, canManageIntegrations].filter(Boolean).length;
  const canArchive = accountStatus === "ACTIVE" && canArchiveAccount;
  const mutationCount = [canArchive, canDeleteAccount].filter(Boolean).length;
  const hasActions = navigationCount + mutationCount > 0;
  const estimatedMenuHeight = 12 + (navigationCount + mutationCount) * 40 + (navigationCount > 0 && mutationCount > 0 ? 9 : 0);

  const updateMenuPosition = useCallback(() => {
    if (triggerRef.current) {
      setMenuPosition(getMenuPosition(triggerRef.current, estimatedMenuHeight));
    }
  }, [estimatedMenuHeight]);

  const closeMenu = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) {
      queueMicrotask(() => triggerRef.current?.focus());
    }
  };

  const openMenu = (focus: "first" | "last" = "first") => {
    focusOnOpen.current = focus;
    updateMenuPosition();
    setOpen(true);
  };

  const closeDialog = () => {
    if (isPending) return;
    setConfirmation(null);
    queueMicrotask(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return;

    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const handleViewportChange = () => updateMenuPosition();

    document.addEventListener("pointerdown", handleOutsidePointer);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    queueMicrotask(() => {
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[role='menuitem']") ?? []);
      const target = focusOnOpen.current === "last" ? items.at(-1) : items[0];
      target?.focus();
    });

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!confirmation) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => cancelRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [confirmation]);

  if (!hasActions) return null;

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      openMenu("first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu("last");
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      closeMenu(true);
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[role='menuitem']") ?? []);
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      items[(currentIndex + delta + items.length) % items.length]?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      items[event.key === "Home" ? 0 : items.length - 1]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  const openConfirmation = (kind: ConfirmationKind) => {
    setOpen(false);
    setConfirmation(kind);
  };

  const submitMutation = () => {
    if (!confirmation || isPending) return;

    const formData = new FormData();
    formData.set("accountId", accountId);
    formData.set("redirectTo", "/accounts");
    const kind = confirmation;

    startTransition(async () => {
      try {
        if (kind === "archive") {
          await archiveAccount(formData);
        } else {
          await deleteAccount(formData);
        }

        toast.error(
          kind === "archive"
            ? "Unable to archive the account."
            : "Unable to delete the account."
        );
      } catch {
        toast.error(
          kind === "archive"
            ? "Unable to archive the account. Try again."
            : "Unable to delete the account. Try again."
        );
      }
    });
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && !isPending) {
      event.preventDefault();
      closeDialog();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input:not([disabled])"
      ) ?? []
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const menu = open && typeof document !== "undefined"
    ? createPortal(
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          onKeyDown={handleMenuKeyDown}
          className="fixed z-[100] overflow-hidden rounded-inner border-[0.5px] border-flash/[0.16] bg-[#08111d] p-1.5 shadow-[0_18px_45px_rgba(0,0,0,.58)]"
          style={menuPosition}
        >
          {canEditAccount && (
            <Link role="menuitem" href={`/accounts/${accountId}/edit`} onClick={() => setOpen(false)} className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm text-muted outline-none hover:bg-white/[0.06] hover:text-flash focus-visible:bg-white/[0.08] focus-visible:text-flash focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-bright/60">
              <Pencil size={15} aria-hidden="true" />Edit account information
            </Link>
          )}
          {canOpenManage && (
            <Link role="menuitem" href="/accounts/manage" onClick={() => setOpen(false)} className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm text-muted outline-none hover:bg-white/[0.06] hover:text-flash focus-visible:bg-white/[0.08] focus-visible:text-flash focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-bright/60">
              <Settings size={15} aria-hidden="true" />Manage accounts
            </Link>
          )}
          {canViewMembers && (
            <Link role="menuitem" href={`/accounts/${accountId}/members`} onClick={() => setOpen(false)} className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm text-muted outline-none hover:bg-white/[0.06] hover:text-flash focus-visible:bg-white/[0.08] focus-visible:text-flash focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-bright/60">
              <Users size={15} aria-hidden="true" />Members
            </Link>
          )}
          {canManageIntegrations && (
            <Link role="menuitem" href={`/accounts/${accountId}/integrations`} onClick={() => setOpen(false)} className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm text-muted outline-none hover:bg-white/[0.06] hover:text-flash focus-visible:bg-white/[0.08] focus-visible:text-flash focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-bright/60">
              <Cable size={15} aria-hidden="true" />Integrations
            </Link>
          )}
          {navigationCount > 0 && mutationCount > 0 && <div role="separator" className="my-1.5 border-t-[0.5px] border-flash/[0.1]" />}
          {canArchive && (
            <button type="button" role="menuitem" onClick={() => openConfirmation("archive")} className="flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm text-warning outline-none hover:bg-warning/[0.08] focus-visible:bg-warning/[0.1] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning/60">
              <Archive size={15} aria-hidden="true" />Archive account
            </button>
          )}
          {canDeleteAccount && (
            <button type="button" role="menuitem" onClick={() => openConfirmation("delete")} className="flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm text-red-400 outline-none hover:bg-red-400/[0.08] focus-visible:bg-red-400/[0.1] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-400/60">
              <Trash2 size={15} aria-hidden="true" />Delete account
            </button>
          )}
        </div>,
        document.body
      )
    : null;

  const dialog = confirmation && typeof document !== "undefined"
    ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget && !isPending) closeDialog();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescriptionId}
            onKeyDown={handleDialogKeyDown}
            className={`w-full max-w-md rounded-card border-[0.5px] bg-surface-1 p-5 shadow-[0_24px_80px_rgba(0,0,0,.58)] sm:p-6 ${confirmation === "delete" ? "border-red-400/25" : "border-flash/[0.14]"}`}
          >
            <div className="flex items-start gap-4">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-inner border-[0.5px] ${confirmation === "delete" ? "border-red-400/25 bg-red-400/[0.08] text-red-400" : "border-warning/25 bg-warning/[0.08] text-warning"}`}>
                {confirmation === "delete" ? <Trash2 size={18} aria-hidden="true" /> : <Archive size={18} aria-hidden="true" />}
              </span>
              <div className="min-w-0">
                <h2 id={dialogTitleId} className="text-subsection text-flash">
                  {confirmation === "delete" ? "Delete account permanently?" : "Archive account?"}
                </h2>
                <p id={dialogDescriptionId} className="mt-2 text-sm leading-6 text-muted">
                  {confirmation === "delete"
                    ? "This permanently deletes the account and its associated data. This action cannot be undone."
                    : "The account will be removed from your active library and moved to Archived accounts. Its trading data will be preserved."}
                </p>
                <p className="mt-3 truncate text-sm font-medium text-flash" title={accountName}>{accountName}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button ref={cancelRef} type="button" onClick={closeDialog} disabled={isPending} className="inline-flex min-h-11 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.14] px-4 py-2.5 text-sm text-muted outline-none hover:bg-white/[0.05] hover:text-flash focus-visible:ring-2 focus-visible:ring-accent-bright/60 disabled:cursor-not-allowed disabled:opacity-50">
                Cancel
              </button>
              <button type="button" onClick={submitMutation} disabled={isPending} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-inner px-4 py-2.5 text-sm font-semibold outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${confirmation === "delete" ? "bg-red-500 text-white hover:bg-red-400 focus-visible:ring-red-400/70" : "bg-warning/15 text-warning hover:bg-warning/20 focus-visible:ring-warning/70"}`}>
                {isPending && <LoaderCircle size={15} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />}
                {isPending
                  ? confirmation === "delete" ? "Deleting…" : "Archiving…"
                  : confirmation === "delete" ? "Delete permanently" : "Archive account"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  const handleTriggerPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-label={`More actions for ${accountName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onPointerDown={handleTriggerPointerDown}
        onClick={(event) => {
          event.stopPropagation();
          if (open) closeMenu(true);
          else openMenu("first");
        }}
        onKeyDown={handleTriggerKeyDown}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-inner border-[0.5px] outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/70 ${placement === "focus" ? "border-flash/[0.16] bg-black/35 text-flash backdrop-blur-sm hover:bg-black/50" : "border-flash/[0.1] bg-surface-2/70 text-muted hover:border-flash/[0.18] hover:text-flash"}`}
      >
        <Ellipsis size={18} aria-hidden="true" />
      </button>
      {menu}
      {dialog}
    </div>
  );
}
