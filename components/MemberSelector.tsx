"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";
import VoltisLightningLoader from "@/components/VoltisLightningLoader";

type Member = {
  id: string;
  name: string | null;
  username: string;
};

type Props = {
  members: Member[];
  selectedMemberId?: string;
  accountId: string;
  appLanguage?: string | null;
};

const allLabel: Record<AppLanguage, string> = {
  it: "Tutti i trader",
  en: "All traders",
  uk: "Усі трейдери",
  ru: "Все трейдеры",
  es: "Todos los traders",
  fr: "Tous les traders",
  de: "Alle Trader",
};

const showLabel: Record<AppLanguage, string> = {
  it: "Mostra trade di",
  en: "Show trades by",
  uk: "Показати угоди",
  ru: "Показать сделки",
  es: "Mostrar trades de",
  fr: "Afficher les trades de",
  de: "Trades anzeigen von",
};

export default function MemberSelector({
  members,
  selectedMemberId,
  appLanguage,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = normalizeAppLanguage(appLanguage);
  const [isPending, startTransition] = useTransition();

  function handleSelect(memberId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (memberId) {
      params.set("member", memberId);
    } else {
      params.delete("member");
    }
    params.delete("trader");
    startTransition(() => router.push(`?${params.toString()}`));
  }

  const allInitial = allLabel[lang][0].toUpperCase();

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <p className="shrink-0 text-sm text-gray-400">{showLabel[lang]}</p>

      {isPending && <VoltisLightningLoader size={20} />}

      <div
        className={`flex flex-wrap gap-2 ${isPending ? "pointer-events-none opacity-50" : ""}`}
      >
        <button
          onClick={() => handleSelect("")}
          className={`flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-sm transition ${
            !selectedMemberId
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
              !selectedMemberId
                ? "bg-accent/20 text-accent"
                : "bg-white/10 text-gray-400"
            }`}
          >
            {allInitial}
          </span>
          <span>{allLabel[lang]}</span>
        </button>

        {members.map((member) => {
          const isActive = selectedMemberId === member.id;
          const displayName = member.name || member.username;
          const initial = displayName[0].toUpperCase();
          return (
            <button
              key={member.id}
              onClick={() => handleSelect(member.id)}
              className={`flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-sm transition ${
                isActive
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-accent/20 text-accent"
                    : "bg-white/10 text-gray-400"
                }`}
              >
                {initial}
              </span>
              <span>{displayName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
