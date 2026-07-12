"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import Card from "@/components/ui/Card";

type Tone = "neutral" | "good" | "warning" | "danger";

type ReviewMemory = {
  id: string;
  title: string;
  content: string;
  statusLabel: string;
  tone: Tone;
};

type OperationalMemory = {
  id: string;
  memoryType: string;
  title: string;
  description: string;
  score: number;
  statusLabel: string;
  tone: Tone;
};

const toneClasses: Record<Tone, string> = {
  neutral: "border-accent-bright/20 bg-accent-bright/[0.06] text-accent-bright",
  good: "border-green-400/25 bg-green-400/[0.06] text-green-400",
  warning: "border-warning/25 bg-warning/[0.06] text-warning",
  danger: "border-negative/25 bg-negative/[0.06] text-negative",
};

function MemoryBadge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 rounded-pill border-[0.5px] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}

export default function CopilotMemorySystem({
  reviewMemories,
  operationalMemories,
  showReliabilityNote,
}: {
  reviewMemories: ReviewMemory[];
  operationalMemories: OperationalMemory[];
  showReliabilityNote: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"review" | "operational">(
    "review"
  );
  const reviewTabRef = useRef<HTMLButtonElement>(null);
  const operationalTabRef = useRef<HTMLButtonElement>(null);

  function selectTab(tab: "review" | "operational") {
    setActiveTab(tab);
    (tab === "review" ? reviewTabRef : operationalTabRef).current?.focus();
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    selectTab(activeTab === "review" ? "operational" : "review");
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-bright">
            Memory system
          </p>
          <h2 className="mt-2 text-section text-white">
            Operational context retained by VOLTIS
          </h2>
        </div>
        {showReliabilityNote && (
          <p className="max-w-md text-caption text-muted">
            Memory volume does not imply statistical reliability.
          </p>
        )}
      </div>

      <div
        role="tablist"
        aria-label="Copilot memory views"
        className="mt-5 grid rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-1 sm:w-fit sm:grid-cols-2"
      >
        <button
          ref={reviewTabRef}
          type="button"
          role="tab"
          id="review-memory-tab"
          aria-selected={activeTab === "review"}
          aria-controls="review-memory-panel"
          tabIndex={activeTab === "review" ? 0 : -1}
          onClick={() => selectTab("review")}
          onKeyDown={handleTabKeyDown}
          className={`rounded-inner px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/50 ${
            activeTab === "review"
              ? "bg-accent-bright/[0.1] text-accent-bright"
              : "text-muted hover:text-white"
          }`}
        >
          Review memory
        </button>
        <button
          ref={operationalTabRef}
          type="button"
          role="tab"
          id="operational-memory-tab"
          aria-selected={activeTab === "operational"}
          aria-controls="operational-memory-panel"
          tabIndex={activeTab === "operational" ? 0 : -1}
          onClick={() => selectTab("operational")}
          onKeyDown={handleTabKeyDown}
          className={`rounded-inner px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/50 ${
            activeTab === "operational"
              ? "bg-accent-bright/[0.1] text-accent-bright"
              : "text-muted hover:text-white"
          }`}
        >
          Operational memory
        </button>
      </div>

      <div
        role="tabpanel"
        id="review-memory-panel"
        aria-labelledby="review-memory-tab"
        hidden={activeTab !== "review"}
        className="mt-5"
      >
        {reviewMemories.length === 0 ? (
          <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
            <p className="text-sm font-medium text-white">No review notes</p>
            <p className="mt-1 text-caption text-muted">
              No review note has been generated yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-flash/[0.08]">
            {reviewMemories.map((memory) => (
              <div
                key={memory.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-faint">
                    {memory.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-gray-300">
                    {memory.content}
                  </p>
                </div>
                <MemoryBadge label={memory.statusLabel} tone={memory.tone} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        role="tabpanel"
        id="operational-memory-panel"
        aria-labelledby="operational-memory-tab"
        hidden={activeTab !== "operational"}
        className="mt-5"
      >
        {operationalMemories.length === 0 ? (
          <div className="rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 p-4">
            <p className="text-sm font-medium text-white">No operational memories</p>
            <p className="mt-1 text-caption text-muted">
              Memory activates after recurring account context is retained.
            </p>
          </div>
        ) : (
          <div className="grid gap-x-6 md:grid-cols-2">
            {operationalMemories.map((memory) => (
              <div
                key={memory.id}
                className="flex flex-col gap-3 border-b border-flash/[0.08] py-4 first:pt-0 md:[&:nth-child(2)]:pt-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-faint">
                      {memory.memoryType}
                    </p>
                    <h3 className="mt-1 text-body font-medium text-white">
                      {memory.title}
                    </h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold tabular-nums text-white">
                      {memory.score}
                    </span>
                    <MemoryBadge label={memory.statusLabel} tone={memory.tone} />
                  </div>
                </div>
                <p className="text-caption leading-5 text-muted">
                  {memory.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
