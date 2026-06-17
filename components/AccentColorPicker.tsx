"use client";

import { useState } from "react";
import { ACCENT_KEYS, ACCENT_HEX, type AccentKey } from "@/lib/accent-colors";

type Props = {
  currentAccent: AccentKey;
  labels: [string, string, string, string, string, string];
};

export default function AccentColorPicker({
  currentAccent,
  labels,
}: Props) {
  const [selected, setSelected] = useState<AccentKey>(currentAccent);

  return (
    <div className="mt-4">
      <input type="hidden" name="accentColor" value={selected} />

      <div className="flex flex-wrap gap-2">
        {ACCENT_KEYS.map((key, i) => {
          const isActive = selected === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              aria-pressed={isActive}
              aria-label={labels[i]}
              className={[
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "border-white/40 bg-white/10 text-white ring-2 ring-white/30"
                  : "border-white/10 bg-black/20 text-gray-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              <span
                className="h-3.5 w-3.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: ACCENT_HEX[key] }}
                aria-hidden="true"
              />
              {labels[i]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
