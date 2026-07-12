"use client";

import { useActionState, useEffect, useId, useRef, useState, useTransition } from "react";
import { Check, ChevronDown, PenLine, Plus, Save, Trash2 } from "lucide-react";
import { createStrategy, updateStrategy, deleteStrategy } from "./actions";

const COLOR_PRESETS = [
  "#5BE0FF",
  "#34A8FF",
  "#2E62E6",
  "#9FB4DD",
  "#7D8DB5",
];

const COLOR_NAMES: Record<string, string> = {
  "#5BE0FF": "Cyan",
  "#34A8FF": "Blue",
  "#2E62E6": "Indigo",
  "#9FB4DD": "Slate",
  "#7D8DB5": "Gray",
};

export type StrategyFormLabels = {
  namePlaceholder: string;
  descriptionPlaceholder: string;
  colorLabel: string;
  createButton: string;
  saveButton: string;
  editButton: string;
  deleteButton: string;
  confirmDelete: string;
  confirmYes: string;
  cancelConfirm: string;
};

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_PRESETS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className="h-7 w-7 rounded-full border-2 transition"
          style={{
            backgroundColor: color,
            borderColor: value === color ? "white" : "transparent",
          }}
          aria-label={color}
        />
      ))}
    </div>
  );
}

export function CreateStrategyForm({
  accountId,
  defaultColor,
}: {
  accountId: string;
  defaultColor: string;
}) {
  const [state, formAction, isPending] = useActionState(
    createStrategy.bind(null, accountId),
    null
  );
  const [color, setColor] = useState(defaultColor);
  const [clientError, setClientError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const errorId = useId();

  useEffect(() => {
    if (state !== null && !state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  function validateName(event: React.FormEvent<HTMLFormElement>) {
    const name = new FormData(event.currentTarget).get("name");
    if (typeof name !== "string" || !name.trim()) {
      event.preventDefault();
      setClientError("Strategy name cannot contain only spaces.");
    } else {
      setClientError(null);
    }
  }

  return (
    <form
      id="strategy-create-form"
      ref={formRef}
      action={formAction}
      onSubmit={validateName}
      className="mt-6 space-y-5"
    >
      <input type="hidden" name="color" value={color} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <label className="block min-w-0" htmlFor="strategy-name">
          <span className="text-micro uppercase tracking-label text-muted-faint">
            Strategy name
          </span>
          <input
            id="strategy-name"
            name="name"
            type="text"
            placeholder="Example: London continuation"
            required
            maxLength={80}
            autoComplete="off"
            disabled={isPending}
            aria-describedby={clientError || state?.error ? errorId : undefined}
            aria-invalid={Boolean(clientError || state?.error)}
            className="mt-2 w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/20 disabled:opacity-50"
          />
        </label>
        <fieldset>
          <legend className="text-micro uppercase tracking-label text-muted-faint">
            Library marker
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setColor(preset)}
                disabled={isPending}
                aria-label={`${COLOR_NAMES[preset]} library marker`}
                aria-pressed={color === preset}
                className="flex h-10 w-10 items-center justify-center rounded-pill border-[0.5px] border-flash/[0.16] outline-none ring-accent-bright/70 transition-all duration-fast hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1 disabled:opacity-50"
                style={{ backgroundColor: preset }}
              >
                {color === preset && (
                  <Check size={16} strokeWidth={3} className="text-surface-0" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      <label className="block" htmlFor="strategy-description">
        <span className="text-micro uppercase tracking-label text-muted-faint">
          Execution doctrine
        </span>
        <textarea
          id="strategy-description"
          name="description"
          placeholder="Entry context, invalidation rules, risk notes, and review criteria."
          maxLength={300}
          rows={4}
          disabled={isPending}
          className="mt-2 w-full resize-y rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/20 disabled:opacity-50"
        />
      </label>
      {(clientError || state?.error) && (
        <p id={errorId} role="alert" className="text-caption text-negative">
          {clientError || state?.error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-caption leading-5 text-muted">
          A strategy is an execution rulebook, not a performance claim.
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-5 py-3 text-sm font-semibold text-accent-bright outline-none transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55 focus-visible:ring-2 focus-visible:ring-accent-bright/60 disabled:opacity-50 sm:w-auto"
        >
          <Plus size={17} aria-hidden="true" />
          {isPending ? "Adding strategy…" : "Add strategy"}
        </button>
      </div>
    </form>
  );
}

export function StrategyEditor({
  accountId,
  strategyId,
  strategyName,
  description,
  color: initialColor,
}: {
  accountId: string;
  strategyId: string;
  strategyName: string;
  description: string | null;
  color: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [color, setColor] = useState(initialColor);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPendingEdit, startEditTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const panelId = useId();
  const confirmTitleId = useId();
  const confirmDescriptionId = useId();
  const cancelDeleteRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showDeleteConfirm) {
      cancelDeleteRef.current?.focus();
    }
  }, [showDeleteConfirm]);

  function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("color", color);
    setEditError(null);
    startEditTransition(async () => {
      const result = await updateStrategy(accountId, strategyId, null, formData);
      if (result?.error) {
        setEditError(result.error);
      } else {
        setIsOpen(false);
      }
    });
  }

  function handleDelete() {
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteStrategy(accountId, strategyId);
      if (result?.error) {
        setDeleteError(result.error);
        setShowDeleteConfirm(false);
      }
    });
  }

  return (
    <div className="mt-5 border-t-[0.5px] border-flash/[0.08] pt-5">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group flex w-full items-center justify-between gap-3 rounded-inner text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 focus-visible:ring-offset-4 focus-visible:ring-offset-surface-1"
      >
        <span className="inline-flex items-center gap-2 text-caption font-medium text-muted transition-colors duration-fast group-hover:text-accent-bright">
          <PenLine size={15} aria-hidden="true" />
          Edit strategy
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`text-muted transition-transform duration-base ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div id={panelId} className="mt-5 space-y-5">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <label className="block">
              <span className="text-micro uppercase tracking-label text-muted-faint">
                Strategy name
              </span>
              <input
                name="name"
                type="text"
                defaultValue={strategyName}
                required
                maxLength={80}
                autoComplete="off"
                disabled={isPendingEdit}
                className="mt-2 w-full rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/20 disabled:opacity-50"
              />
            </label>

            <label className="block">
              <span className="text-micro uppercase tracking-label text-muted-faint">
                Execution doctrine
              </span>
              <textarea
                name="description"
                defaultValue={description ?? ""}
                placeholder="Document setup rules, invalidation criteria, and review notes."
                maxLength={300}
                rows={3}
                disabled={isPendingEdit}
                className="mt-2 w-full resize-none rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm text-flash outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/20 disabled:opacity-50"
              />
            </label>

            {editError && (
              <p role="alert" className="text-caption text-negative">
                {editError}
              </p>
            )}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <fieldset>
                <legend className="text-micro uppercase tracking-label text-muted-faint">
                  Library marker
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setColor(preset)}
                      disabled={isPendingEdit}
                      aria-label={`${COLOR_NAMES[preset]} library marker`}
                      aria-pressed={color === preset}
                      className="flex h-9 w-9 items-center justify-center rounded-pill border-[0.5px] border-flash/[0.16] outline-none ring-accent-bright/70 transition-all duration-fast hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1 disabled:opacity-50"
                      style={{ backgroundColor: preset }}
                    >
                      {color === preset && (
                        <Check
                          size={14}
                          strokeWidth={3}
                          className="text-surface-0"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={isPendingEdit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/30 bg-accent-bright/[0.08] px-4 py-3 text-sm font-medium text-accent-bright outline-none transition-all duration-fast hover:-translate-y-0.5 hover:border-accent-bright/55 focus-visible:ring-2 focus-visible:ring-accent-bright/60 disabled:opacity-50 sm:w-auto"
              >
                <Save size={16} aria-hidden="true" />
                {isPendingEdit ? "Saving strategy…" : "Save strategy"}
              </button>
            </div>
          </form>

          <div className="rounded-inner border-[0.5px] border-negative/15 bg-negative/[0.035] p-4">
            {!showDeleteConfirm ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-body font-medium text-flash">
                    Remove from library
                  </p>
                  <p className="mt-1 text-caption leading-5 text-muted">
                    Deleting this strategy removes it from the library. Existing
                    trade records retain their data.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-inner border-[0.5px] border-negative/30 bg-negative/[0.08] px-4 py-3 text-sm font-medium text-negative outline-none transition-all duration-fast hover:border-negative/55 focus-visible:ring-2 focus-visible:ring-negative/60 sm:w-auto"
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Delete
                </button>
              </div>
            ) : (
              <div
                role="alertdialog"
                aria-labelledby={confirmTitleId}
                aria-describedby={confirmDescriptionId}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p id={confirmTitleId} className="text-body font-medium text-flash">
                    Remove “{strategyName}” from the library?
                  </p>
                  <p id={confirmDescriptionId} className="mt-1 text-caption leading-5 text-muted">
                    Historical trade data will be retained. This removal cannot
                    be undone from the UI.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    ref={cancelDeleteRef}
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isPendingDelete}
                    className="rounded-inner border-[0.5px] border-flash/[0.12] bg-surface-2 px-4 py-3 text-sm font-medium text-muted outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPendingDelete}
                    className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-negative/30 bg-negative/[0.1] px-4 py-3 text-sm font-medium text-negative outline-none focus-visible:ring-2 focus-visible:ring-negative/60 disabled:opacity-50"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    {isPendingDelete ? "Removing…" : "Confirm removal"}
                  </button>
                </div>
              </div>
            )}
            {deleteError && (
              <p role="alert" className="mt-3 text-caption text-negative">
                {deleteError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function StrategyCardActions({
  accountId,
  strategyId,
  currentName,
  currentDescription,
  currentColor,
  t,
}: {
  accountId: string;
  strategyId: string;
  currentName: string;
  currentDescription: string | null;
  currentColor: string | null;
  t: StrategyFormLabels;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [color, setColor] = useState(currentColor ?? COLOR_PRESETS[0]);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const [isPendingEdit, startEditTransition] = useTransition();

  function handleEditSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("color", color);
    setEditError(null);
    startEditTransition(async () => {
      const result = await updateStrategy(accountId, strategyId, null, formData);
      if (result?.error) {
        setEditError(result.error);
      } else {
        setIsEditing(false);
      }
    });
  }

  function handleDelete() {
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteStrategy(accountId, strategyId);
      if (result?.error) {
        setDeleteError(result.error);
        setShowConfirm(false);
      }
    });
  }

  if (isEditing) {
    return (
      <div className="mt-5 space-y-4 border-t border-white/10 pt-5">
        <form onSubmit={handleEditSubmit} className="space-y-3">
          <input
            name="name"
            type="text"
            defaultValue={currentName}
            required
            maxLength={80}
            disabled={isPendingEdit}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-accent-bright/40 disabled:opacity-50"
          />
          <textarea
            name="description"
            defaultValue={currentDescription ?? ""}
            maxLength={300}
            rows={2}
            disabled={isPendingEdit}
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-accent-bright/40 disabled:opacity-50"
          />
          <ColorPicker value={color} onChange={setColor} />
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isPendingEdit}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/[0.06] disabled:opacity-50"
            >
              {t.saveButton}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isPendingEdit}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-500 transition hover:bg-white/[0.06] disabled:opacity-50"
            >
              {t.cancelConfirm}
            </button>
          </div>
          {editError && (
            <p className="text-sm text-red-400">{editError}</p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/[0.06]"
      >
        {t.editButton}
      </button>

      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={isPendingDelete}
          className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
        >
          {t.deleteButton}
        </button>
      ) : (
        <>
          <span className="text-xs text-red-400">{t.confirmDelete}</span>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPendingDelete}
            className="rounded-2xl border border-red-500/30 bg-red-500/20 px-4 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
          >
            {t.confirmYes}
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            disabled={isPendingDelete}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-gray-400 transition hover:bg-white/[0.06] disabled:opacity-50"
          >
            {t.cancelConfirm}
          </button>
        </>
      )}
      {deleteError && (
        <p className="w-full text-sm text-red-400">{deleteError}</p>
      )}
    </div>
  );
}
