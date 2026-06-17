export const ACCENT_KEYS = [
  "blue",
  "violet",
  "teal",
  "amber",
  "coral",
  "platinum",
] as const;

export type AccentKey = (typeof ACCENT_KEYS)[number];

const ACCENT_MAP: Record<string, { accent: string; bright: string }> = {
  blue:     { accent: "#2C74E8", bright: "#5BE0FF" },
  violet:   { accent: "#7C3AED", bright: "#C4B5FD" },
  teal:     { accent: "#0D9488", bright: "#5EEAD4" },
  amber:    { accent: "#D97706", bright: "#FCD34D" },
  coral:    { accent: "#E05252", bright: "#FCA5A5" },
  platinum: { accent: "#94A3B8", bright: "#E2E8F0" },
  // legacy aliases
  green:    { accent: "#2C74E8", bright: "#5BE0FF" }, // → blue
  purple:   { accent: "#7C3AED", bright: "#C4B5FD" }, // → violet
  red:      { accent: "#E05252", bright: "#FCA5A5" }, // → coral
};

/** Hex preview color for each canonical accent (used by picker swatches). */
export const ACCENT_HEX: Record<AccentKey, string> = {
  blue:     "#2C74E8",
  violet:   "#7C3AED",
  teal:     "#0D9488",
  amber:    "#D97706",
  coral:    "#E05252",
  platinum: "#94A3B8",
};

/** Maps legacy DB values to the current canonical AccentKey. */
export function normalizeAccentKey(key: string | null | undefined): AccentKey {
  switch (key) {
    case "green":  return "blue";
    case "red":    return "coral";
    case "purple": return "violet";
    case "blue":
    case "violet":
    case "teal":
    case "amber":
    case "coral":
    case "platinum":
      return key;
    default:
      return "blue";
  }
}

export function resolveAccent(key: string | null | undefined) {
  return ACCENT_MAP[key ?? "blue"] ?? ACCENT_MAP.blue;
}
