"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";

type TabId = "general" | "security" | "connected";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "general", label: "General" },
  { id: "security", label: "Security" },
  { id: "connected", label: "Connected Accounts" },
];

export default function ProfileTabs({
  general,
  security,
  connected,
}: {
  general: ReactNode;
  security: ReactNode;
  connected: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const panels: Record<TabId, ReactNode> = { general, security, connected };

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    setActiveTab(tabs[nextIndex].id);
    document.getElementById(`profile-tab-${tabs[nextIndex].id}`)?.focus();
  }

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label="Profile settings"
        className="flex w-full gap-2 overflow-x-auto border-b border-white/[0.06] pb-3"
      >
        {tabs.map((tab, index) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`profile-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`profile-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                selected
                  ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <section
          key={tab.id}
          id={`profile-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`profile-tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          tabIndex={0}
          className="mt-6 focus:outline-none"
        >
          {panels[tab.id]}
        </section>
      ))}
    </div>
  );
}
