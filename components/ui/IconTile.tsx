import type { ReactNode } from "react";

type IconTileProps = {
  children: ReactNode;
  size?: "sm" | "md";
  interactive?: boolean;
  className?: string;
};

const NEUTRAL_FACE =
  "linear-gradient(145deg, rgba(234,247,255,.06), rgba(10,16,32,.6))";

/**
 * Neutral crystal tile for icons — cyan only arrives on hover, never at rest.
 * Icon-library agnostic: pass any icon element as children (project uses
 * lucide-react; blueprint's stated Tabler-outline reference is a future
 * swap, not something this primitive should assume).
 */
export default function IconTile({
  children,
  size = "md",
  interactive = true,
  className = "",
}: IconTileProps) {
  const sizeCls = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-inner border-[0.5px] border-white/[0.08] text-muted ${sizeCls} ${
        interactive
          ? "transition-colors duration-base group-hover:border-accent-bright group-hover:text-accent-bright"
          : ""
      } ${className}`.trim()}
      style={{ background: NEUTRAL_FACE }}
    >
      {children}
    </span>
  );
}
