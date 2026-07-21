"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { isCorrectionMode } from "@/lib/correction-mode";

type PermissionSnapshot = {
  role: string;
  canManageAccount: boolean;
  accountStatus: string;
};

export default function ArchivedCorrectionModeIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [authorized, setAuthorized] = useState(false);
  const match = pathname.match(/^\/accounts\/([^/]+)/);
  const accountId = match?.[1];
  const requested = isCorrectionMode(searchParams.get("correction"));

  useEffect(() => {
    let cancelled = false;
    if (!requested || !accountId) {
      setAuthorized(false);
      return;
    }
    void fetch(`/api/accounts/${accountId}/permissions`)
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { membership?: PermissionSnapshot } | null) => {
        const membership = payload?.membership;
        if (!cancelled) setAuthorized(Boolean(
          membership?.accountStatus === "ARCHIVED" &&
          (membership.role === "MANAGER" || membership.canManageAccount)
        ));
      })
      .catch(() => { if (!cancelled) setAuthorized(false); });
    return () => { cancelled = true; };
  }, [accountId, requested]);

  if (!requested || !authorized) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-inner border border-warning/20 bg-warning/[0.05] px-4 py-2.5">
      <div>
        <p className="text-micro font-semibold uppercase tracking-label text-warning">Correction mode</p>
        <p className="mt-0.5 text-xs text-muted">You are editing historical data for this archived account.</p>
      </div>
      <Link href={pathname} className="text-micro font-semibold uppercase tracking-label text-warning hover:text-flash">
        Exit correction mode
      </Link>
    </div>
  );
}
