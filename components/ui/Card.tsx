import type { HTMLAttributes } from "react";

type CardProps = {
  variant?: "base" | "hero" | "inner";
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;

const HALO_BASE =
  "radial-gradient(circle at top right, color-mix(in srgb, var(--color-halo) 22%, transparent) 0%, transparent 60%)";
const HALO_HERO =
  "radial-gradient(circle at top right, color-mix(in srgb, var(--color-halo) 32%, transparent) 0%, transparent 55%)";

export default function Card({
  variant = "base",
  interactive = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  const isInteractive = interactive && variant !== "inner";

  const variantCls =
    variant === "inner"
      ? "bg-surface-2 border-[0.5px] border-white/[0.06] rounded-inner p-4"
      : variant === "hero"
        ? "bg-gradient-to-br from-flash/[0.05] to-flash/[0.02] backdrop-blur-[8px] border-[0.5px] border-flash/[0.12] rounded-card p-8 shadow-[0_12px_48px_rgba(0,0,0,0.35)]"
        : "bg-flash/[0.04] backdrop-blur-[8px] border-[0.5px] border-flash/[0.12] rounded-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]";

  const interactiveCls = isInteractive
    ? "group cursor-pointer transition-all duration-base ease-in-out hover:border-accent-bright hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
    : "";

  const halo = variant === "hero" ? HALO_HERO : HALO_BASE;

  return (
    <div
      className={`relative overflow-hidden ${variantCls} ${interactiveCls} ${className}`.trim()}
      {...rest}
    >
      {isInteractive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-base group-hover:opacity-100"
          style={{ background: halo }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
