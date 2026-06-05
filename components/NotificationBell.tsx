"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

const bellLabels: Record<AppLanguage, string> = {
  en: "Notifications",
  it: "Notifiche",
  uk: "Сповіщення",
  ru: "Уведомления",
  es: "Notificaciones",
  fr: "Notifications",
  de: "Benachrichtigungen",
};

export default function NotificationBell({
  language,
}: {
  language?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function loadUnreadCount() {
      const response = await fetch("/api/notifications/unread");

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setCount(data.count || 0);
    }

    loadUnreadCount();
  }, []);

  const label = bellLabels[normalizeAppLanguage(language)];

  return (
    <a
      href="/notifications"
      aria-label={label}
      title={label}
      className="relative rounded-2xl border border-white/10 bg-[#071018]/80 p-3 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-[#071018]"
    >
      <Bell size={18} />

      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </a>
  );
}