const ACCENT_MAP: Record<string, { accent: string; bright: string }> = {
  blue:     { accent: "#2C74E8", bright: "#5BE0FF" },
  purple:   { accent: "#7C3AED", bright: "#C4B5FD" },
  teal:     { accent: "#0D9488", bright: "#5EEAD4" },
  amber:    { accent: "#D97706", bright: "#FCD34D" },
  coral:    { accent: "#E05252", bright: "#FCA5A5" },
  platinum: { accent: "#94A3B8", bright: "#E2E8F0" },
  green:    { accent: "#2C74E8", bright: "#5BE0FF" }, // legacy → blue
  red:      { accent: "#E05252", bright: "#FCA5A5" }, // legacy → coral
};

export function resolveAccent(key: string | null | undefined) {
  return ACCENT_MAP[key ?? "blue"] ?? ACCENT_MAP.blue;
}
