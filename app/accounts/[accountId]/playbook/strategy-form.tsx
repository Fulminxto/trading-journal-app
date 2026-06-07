"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { createStrategy, updateStrategy, deleteStrategy } from "./actions";

const COLOR_PRESETS = [
  "#22d3ee",
  "#4ade80",
  "#facc15",
  "#fb923c",
  "#f87171",
  "#c084fc",
  "#60a5fa",
  "#f472b6",
];

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
  t,
}: {
  accountId: string;
  t: StrategyFormLabels;
}) {
  const [state, formAction, isPending] = useActionState(
    createStrategy.bind(null, accountId),
    null
  );
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state !== null && !state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="color" value={color} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="name"
          type="text"
          placeholder={t.namePlaceholder}
          required
          maxLength={80}
          autoComplete="off"
          disabled={isPending}
          className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-50"
        >
          {t.createButton}
        </button>
      </div>
      <textarea
        name="description"
        placeholder={t.descriptionPlaceholder}
        maxLength={300}
        rows={2}
        disabled={isPending}
        className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500/40 disabled:opacity-50"
      />
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.15em] text-gray-500">
          {t.colorLabel}
        </p>
        <ColorPicker value={color} onChange={setColor} />
      </div>
      {state?.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
    </form>
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
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/40 disabled:opacity-50"
          />
          <textarea
            name="description"
            defaultValue={currentDescription ?? ""}
            maxLength={300}
            rows={2}
            disabled={isPendingEdit}
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500/40 disabled:opacity-50"
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
