"use client";

import { useTransition } from "react";
import { MessageSquareText, Route } from "lucide-react";

import {
  generateAnalysis,
  sendCopilotMessage,
} from "@/app/accounts/[accountId]/copilot/actions";

export function GenerateCurrentAnalysisButton({
  accountId,
  disabled,
}: {
  accountId: string;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const formData = new FormData();
    formData.set("tradingAccountId", accountId);

    startTransition(async () => {
      await generateAnalysis(formData);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isPending}
      className="inline-flex items-center justify-center gap-2 rounded-inner border-[0.5px] border-accent-bright/25 bg-accent-bright/[0.06] px-4 py-3 text-sm font-medium text-accent-bright transition-all duration-fast hover:border-accent-bright/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/50 disabled:cursor-not-allowed disabled:border-flash/[0.08] disabled:bg-surface-2 disabled:text-muted-faint"
    >
      <Route size={16} aria-hidden="true" />
      {isPending ? "Generating analysis…" : "Generate current analysis"}
    </button>
  );
}

export function QuickPromptButton({
  accountId,
  prompt,
  compact = false,
}: {
  accountId: string;
  prompt: string;
  compact?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const formData = new FormData();
    formData.set("tradingAccountId", accountId);
    formData.set("content", prompt);

    startTransition(async () => {
      await sendCopilotMessage(formData);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`flex min-w-0 w-full items-start gap-2.5 rounded-inner border-[0.5px] border-flash/[0.08] bg-surface-2 text-left transition-colors duration-fast hover:border-accent-bright/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/50 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "px-3 py-2" : "p-4"}`}
    >
      <MessageSquareText
        className="mt-0.5 shrink-0 text-accent-bright"
        size={17}
        aria-hidden="true"
      />
      <span className={`min-w-0 ${compact ? "text-caption leading-5" : "text-sm leading-6"} text-gray-300`}>
        {isPending ? "Sending prompt…" : prompt}
      </span>
    </button>
  );
}
