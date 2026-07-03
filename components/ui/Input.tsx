import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Crystal input: surface-2 (blue-navy), never flat black — per
 * BRAND_SYSTEM.md Surfaces spec. Cyan focus ring comes from the
 * global input:focus rule in globals.css.
 */
export default function Input({ className = "", ...rest }: InputProps) {
  return (
    <input
      className={`w-full rounded-inner border-[0.5px] border-white/[0.08] bg-surface-2 px-4 py-3 text-sm text-white placeholder-muted-faint outline-none transition-colors duration-base focus:border-accent-bright/50 disabled:opacity-50 ${className}`.trim()}
      {...rest}
    />
  );
}
