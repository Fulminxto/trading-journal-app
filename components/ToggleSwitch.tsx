"use client";

import { useOptimistic, useTransition } from "react";
import { updateToggle } from "@/app/settings/actions";

interface ToggleSwitchProps {
  name: string;
  checked: boolean;
  disabled?: boolean;
}

export default function ToggleSwitch({
  name,
  checked,
  disabled = false,
}: ToggleSwitchProps) {
  const [, startTransition] = useTransition();
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(checked);

  function handleToggle() {
    if (disabled) return;
    const next = !optimisticChecked;
    startTransition(async () => {
      setOptimisticChecked(next);
      await updateToggle(name, next);
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimisticChecked ? "true" : "false"}
      aria-label={name}
      disabled={disabled}
      onClick={handleToggle}
      className={[
        "relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1",
        optimisticChecked
          ? "bg-accent"
          : "bg-white/20",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
          optimisticChecked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}
