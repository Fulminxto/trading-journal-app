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

// Card cristallo: cold-night diagonal facet, never flat black.
const CRYSTAL_FACE =
  "linear-gradient(160deg, color-mix(in srgb, var(--color-accent) 8%, transparent) 0%, var(--color-surface-1) 55%, var(--color-surface-2) 100%)";

// Spigolo tagliato — hero cards get one cut facet corner, never a plain rectangle.
const HERO_CLIP =
  "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)";

export default function Card({
  variant = "base",
  interactive = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  const isInteractive = interactive && variant !== "inner";
  const isCrystal = variant !== "inner";

  const variantCls =
    variant === "inner"
      ? "bg-surface-2 border-[0.5px] border-white/[0.06] rounded-inner p-4"
      : variant === "hero"
        ? "border-[0.5px] border-flash/[0.1] rounded-card p-8 shadow-[0_12px_48px_rgba(0,0,0,0.35)]"
        : "border-[0.5px] border-flash/[0.1] rounded-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]";

  // Faccia luminosa in alto: thin bright line across the top edge only.
  const faceCls = isCrystal
    ? "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[''] before:bg-gradient-to-r before:from-transparent before:via-flash/25 before:to-transparent"
    : "";

  const interactiveCls = isInteractive
    ? "group cursor-pointer transition-all duration-base ease-in-out hover:-translate-y-0.5 hover:border-accent-bright hover:shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_22px_rgba(52,168,255,0.12)]"
    : "";

  const halo = variant === "hero" ? HALO_HERO : HALO_BASE;

  return (
    <div
      className={`relative overflow-hidden ${variantCls} ${faceCls} ${interactiveCls} ${className}`.trim()}
      style={
        isCrystal
          ? {
              background: CRYSTAL_FACE,
              clipPath: variant === "hero" ? HERO_CLIP : undefined,
            }
          : undefined
      }
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
