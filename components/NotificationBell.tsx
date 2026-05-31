"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotificationBell() {
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

  return (
    <a
      href="/notifications"
      aria-label="Notifications"
      title="Notifications"
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