"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";

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

  function handleChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (e.target.value) {
      params.set("member", e.target.value);
    } else {
      params.delete("member");
    }

    // Remove trader param to avoid conflict with diary's dual-param logic
    params.delete("trader");

    router.push(`?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex items-center gap-3">
      <p className="shrink-0 text-sm text-gray-400">
        {showLabel[lang]}
      </p>

      <select
        value={selectedMemberId || ""}
        onChange={handleChange}
        className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm outline-none focus:border-green-500/40"
      >
        <option value="">{allLabel[lang]}</option>

        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name || member.username}
          </option>
        ))}
      </select>
    </div>
  );
}
