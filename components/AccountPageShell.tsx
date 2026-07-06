import type { ReactNode } from "react";

import { pageDensity } from "@/lib/page-density";
import SignatureEdge from "@/components/ui/SignatureEdge";

type AccountPageShellProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  badges?: ReactNode;
  action?: ReactNode;
  supportLine?: ReactNode;
  scopeBar?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function AccountPageShell({
  eyebrow,
  title,
  badges,
  action,
  supportLine,
  scopeBar,
  children,
  className = "",
}: AccountPageShellProps) {
  return (
    <div className={`space-y-5 ${className}`.trim()}>
      <section className="reveal-rise space-y-4" style={{ animationDelay: "0ms" }}>
        <header
          className={`flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between ${pageDensity.topbarSafeArea}`}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <SignatureEdge orientation="vertical" className="h-4" />
              <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">
                {eyebrow}
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-hero text-flash">{title}</h1>
              {badges && (
                <div className="flex flex-wrap items-center gap-2">
                  {badges}
                </div>
              )}
            </div>

            {supportLine && (
              <p className="mt-2 max-w-3xl text-sm text-muted">
                {supportLine}
              </p>
            )}
          </div>

          {action && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {action}
            </div>
          )}
        </header>

        {scopeBar && <div className="w-full">{scopeBar}</div>}
      </section>

      {children}
    </div>
  );
}
