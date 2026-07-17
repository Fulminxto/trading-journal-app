"use client";

import { Archive } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";

type PermissionPayload = {
  membership?: { accountStatus?: string };
};

export function shouldShowArchivedAccountBanner(status?: string): boolean {
  return status === "ARCHIVED";
}

const copy: Record<AppLanguage, { title: string; description: string }> = {
  it: { title: "Account archiviato", description: "I dati storici sono disponibili in modalità di sola lettura." },
  en: { title: "Account archived", description: "Historical data is available in read-only mode." },
  uk: { title: "Акаунт архівовано", description: "Історичні дані доступні в режимі лише для читання." },
  ru: { title: "Аккаунт архивирован", description: "Исторические данные доступны в режиме только для чтения." },
  es: { title: "Cuenta archivada", description: "Los datos históricos están disponibles en modo de solo lectura." },
  fr: { title: "Compte archivé", description: "Les données historiques sont disponibles en lecture seule." },
  de: { title: "Konto archiviert", description: "Historische Daten sind im schreibgeschützten Modus verfügbar." },
};

export default function ArchivedAccountBanner({ appLanguage }: { appLanguage?: string | null }) {
  const pathname = usePathname();
  const [archived, setArchived] = useState(false);
  const labels = copy[normalizeAppLanguage(appLanguage)];
  const match = pathname.match(/^\/accounts\/([^/]+)/);
  const accountId = match?.[1];
  const selectedAccountId =
    accountId && !["create", "manage", "archived"].includes(accountId)
      ? accountId
      : null;

  useEffect(() => {
    let cancelled = false;
    setArchived(false);

    if (!selectedAccountId) return () => { cancelled = true; };

    void fetch(`/api/accounts/${selectedAccountId}/permissions`)
      .then((response) => response.ok ? response.json() as Promise<PermissionPayload> : null)
      .then((payload) => {
        if (!cancelled) {
          setArchived(shouldShowArchivedAccountBanner(payload?.membership?.accountStatus));
        }
      })
      .catch(() => {
        if (!cancelled) setArchived(false);
      });

    return () => { cancelled = true; };
  }, [selectedAccountId]);

  if (!archived) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-5 flex items-start gap-3 rounded-inner border border-accent/20 bg-accent/[0.07] px-4 py-3 text-sm"
    >
      <Archive aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent-bright" />
      <div>
        <p className="font-semibold text-flash">{labels.title}</p>
        <p className="mt-0.5 text-muted">{labels.description}</p>
      </div>
    </div>
  );
}
