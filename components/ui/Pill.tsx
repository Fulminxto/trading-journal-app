import type { ReactNode } from "react";

type PillProps = {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  avatar?: ReactNode;
  className?: string;
};

/**
 * Filter/selector pill: cyan wash + border when active, tenue outline
 * at rest. Generalizes the pattern ScopeBar had duplicated per pill kind.
 */
export default function Pill({
  active = false,
  onClick,
  children,
  avatar,
  className = "",
}: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-pill border px-3 py-1.5 text-sm transition-colors duration-base ${
        active
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-white/10 text-muted hover:bg-white/5 hover:text-white"
      } ${className}`.trim()}
    >
      {avatar}
      <span>{children}</span>
    </button>
  );
}
