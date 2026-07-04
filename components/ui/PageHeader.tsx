import type { ReactNode } from "react";

import SignatureEdge from "@/components/ui/SignatureEdge";

type PageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  badges?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/*
 * Shared page-header treatment.
 *
 * Intended order in account workspaces:
 * Header -> ScopeBar -> Hero -> Tools -> Content -> Secondary.
 *
 * The large-screen right padding preserves visual air for the fixed global
 * notification/profile controls without coupling pages to Topbar internals.
 */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  badges,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <header
      className={`relative overflow-hidden rounded-card border-[0.5px] border-flash/[0.1] bg-surface-1/90 px-5 py-5 shadow-[0_10px_36px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:px-6 lg:pr-44 ${className}`.trim()}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flash/25 to-transparent" />
      <SignatureEdge
        orientation="horizontal"
        className="absolute bottom-0 left-5 right-5"
      />

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <div className="text-micro uppercase tracking-label text-muted-faint">
              {eyebrow}
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-section text-flash sm:text-hero">
              {title}
            </h1>
            {badges && <div className="flex flex-wrap gap-2">{badges}</div>}
          </div>

          {subtitle && (
            <p className="mt-3 max-w-3xl text-body text-muted">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
