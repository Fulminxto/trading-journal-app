"use client";

import { Megaphone } from "lucide-react";
import { useState } from "react";

type FilterId = "All" | "Features" | "Improvements" | "Fixes" | "Announcements";

type UpdateItem = {
  id: string;
  type: "announcement" | "feature" | "fix";
  typeLabel: string;
  priority: "high" | null;
  priorityLabel: string | null;
  title: string;
  content: string;
  publicationDate: string;
};

const mockUpdates: UpdateItem[] = [
  {
    id: "volt-engine-v2-4-release",
    type: "announcement",
    typeLabel: "ANNOUNCEMENT",
    priority: "high",
    priorityLabel: "HIGH",
    title: "Volt Engine v2.4 Release",
    content:
      "Completely revamped workspace data sync and added real-time execution analytics for prop accounts.",
    publicationDate: "May 26, 2026",
  },
  {
    id: "multi-account-archiving-restoration",
    type: "feature",
    typeLabel: "FEATURE",
    priority: null,
    priorityLabel: null,
    title: "Multi-Account Archiving & Restoration",
    content:
      "You can now safely archive inactive trading workspaces and restore them at any time from the account lifecycle manager.",
    publicationDate: "May 18, 2026",
  },
  {
    id: "latency-chart-display-improvements",
    type: "fix",
    typeLabel: "FIX",
    priority: null,
    priorityLabel: null,
    title: "Latency & Chart Display Improvements",
    content:
      "Fixed minor UI misalignments in trade history tables and reduced dashboard load times by 40%.",
    publicationDate: "May 10, 2026",
  },
];

type PageLabels = {
  eyebrow: string;
  title: string;
  description: string;
  empty: string;
};

const categories: FilterId[] = [
  "All",
  "Features",
  "Improvements",
  "Fixes",
  "Announcements",
];

function matchesCategory(type: UpdateItem["type"], category: FilterId) {
  if (category === "All") return true;
  if (category === "Features") return type === "feature";
  if (category === "Improvements") return false;
  if (category === "Fixes") return type === "fix";
  return type === "announcement";
}

function accentClass(type: UpdateItem["type"]) {
  if (type === "fix") return "bg-purple-500";
  if (type === "feature" || type === "announcement") return "bg-cyan-500";
  return "bg-blue-500";
}

function categoryBadgeClasses(type: UpdateItem["type"]) {
  if (type === "fix") {
    return "bg-purple-500/10 border-purple-500/20 text-purple-400";
  }

  return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
}

export default function UpdatesPageContent({
  labels,
}: {
  labels: PageLabels;
}) {
  const [activeTab, setActiveTab] = useState<FilterId>("All");
  const visibleUpdates = mockUpdates.filter((update) => matchesCategory(update.type, activeTab));

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="w-full mb-6">
        <span className="text-[10px] font-semibold tracking-widest text-cyan-400 uppercase">
          {labels.eyebrow}
        </span>

        <div className="flex items-center gap-3 mt-1">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Megaphone className="w-5 h-5" aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">{labels.title}</h1>
        </div>

        <p className="text-sm text-slate-400 mt-2">{labels.description}</p>
      </div>

      <div className="w-full flex items-center gap-2 mb-8 flex-wrap" aria-label="Filter updates">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={activeTab === category}
            onClick={() => setActiveTab(category)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === category
                ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm"
                : "bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="w-full space-y-4">
        {mockUpdates.length === 0 ? (
          <p className="text-sm text-slate-400">{labels.empty}</p>
        ) : visibleUpdates.length === 0 ? (
          <p className="text-sm text-slate-400">No updates in this category yet.</p>
        ) : (
          visibleUpdates.map((update) => (
            <div
              key={update.id}
              className="relative overflow-hidden bg-[#070d19]/80 border border-white/[0.06] rounded-xl p-5 hover:border-white/20 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-200 cursor-pointer"
            >
              <div
                aria-hidden="true"
                className={`absolute left-0 top-0 bottom-0 w-1 ${accentClass(update.type)}`}
              />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${categoryBadgeClasses(update.type)}`}
                  >
                    {update.typeLabel}
                  </span>

                  <span className="text-xs text-slate-500 font-medium">
                    {update.publicationDate}
                  </span>
                </div>

                {update.priority === "high" && update.priorityLabel ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-wider">
                    {update.priorityLabel}
                  </span>
                ) : null}
              </div>

              <h3 className="text-base font-semibold text-slate-100">{update.title}</h3>

              <p className="text-sm text-slate-300 leading-relaxed mt-1 whitespace-pre-line">
                {update.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
