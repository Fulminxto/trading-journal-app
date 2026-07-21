"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { SendHorizontal } from "lucide-react";

import { sendCopilotMessage } from "@/app/accounts/[accountId]/copilot/actions";
import {
  getCopilotLabels,
  type CopilotI18nProps,
} from "@/components/copilot/CopilotI18n";
import Card from "@/components/ui/Card";
import {
  GenerateCurrentAnalysisButton,
  QuickPromptButton,
} from "@/components/copilot/CopilotCommandActions";

type Message = {
  id: string;
  role: string;
  content: string;
};

type Props = CopilotI18nProps & {
  copilotMessages: Message[];
  accountId: string;
  hasContext: boolean;
  promptExamples: string[];
  readOnly?: boolean;
};

export default function CopilotConversationCard({
  copilotMessages,
  accountId,
  appLanguage,
  hasContext,
  promptExamples,
  readOnly = false,
}: Props) {
  const t = getCopilotLabels(appLanguage);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isInitialScroll = useRef(true);
  const shouldAutoScroll = useRef(true);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;
    if (!isInitialScroll.current && !shouldAutoScroll.current) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    scrollArea.scrollTo({
      top: scrollArea.scrollHeight,
      behavior: isInitialScroll.current || reducedMotion ? "auto" : "smooth",
    });
    isInitialScroll.current = false;
  }, [copilotMessages.length]);

  function handleScroll() {
    const area = scrollAreaRef.current;
    if (!area) return;

    const distanceFromBottom =
      area.scrollHeight - area.scrollTop - area.clientHeight;
    shouldAutoScroll.current = distanceFromBottom < 96;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Enter a question before sending.");
      return;
    }

    const formData = new FormData();
    formData.set("tradingAccountId", accountId);
    formData.set("content", trimmedContent);
    setError(null);
    shouldAutoScroll.current = true;

    startTransition(async () => {
      await sendCopilotMessage(formData);
      setContent("");
    });
  }

  return (
    <Card className="h-[clamp(580px,72dvh,760px)] min-h-0 overflow-hidden p-0 md:h-[clamp(760px,82dvh,940px)] xl:h-[clamp(900px,86vh,1040px)] [&>div]:flex [&>div]:h-full [&>div]:min-h-0 [&>div]:flex-col">
      <div className="shrink-0 border-b border-flash/[0.08] px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-bright">
              {t.components.conversation.eyebrow}
            </p>
            <h2 className="mt-2 text-section text-white">
              {t.components.conversation.title}
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
              Answers use recorded account data and fixed operating rules. No
              market predictions are generated.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <span className="w-fit rounded-pill border-[0.5px] border-accent-bright/20 bg-accent-bright/[0.06] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-accent-bright">
                Rule-based
              </span>
              <span
                className={`w-fit rounded-pill border-[0.5px] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] ${
                  hasContext
                    ? "border-accent-bright/20 bg-accent-bright/[0.06] text-accent-bright"
                    : "border-warning/25 bg-warning/[0.06] text-warning"
                }`}
              >
                {hasContext ? "Evidence ready" : "Limited sample"}
              </span>
            </div>
          </div>

          {!readOnly && (
            <GenerateCurrentAnalysisButton
              accountId={accountId}
              disabled={!hasContext}
            />
          )}
        </div>
      </div>

      {!readOnly && <div className="shrink-0 border-b border-flash/[0.08] px-4 py-2.5 sm:px-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
          Quick prompts
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {promptExamples.map((prompt) => (
            <QuickPromptButton
              key={prompt}
              accountId={accountId}
              prompt={prompt}
              compact
            />
          ))}
        </div>
      </div>}

      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        role="log"
        aria-label="Copilot conversation"
        aria-live="polite"
        tabIndex={0}
        className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-bright/40 sm:px-6"
      >
        {copilotMessages.length === 0 ? (
          <div className="flex h-full min-h-48 items-center justify-center">
            <div className="max-w-xl text-center">
              <p className="text-body font-medium text-white">
                Start an operating review
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Ask about execution, discipline, risk, sessions or recorded
                account patterns.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {copilotMessages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    aria-label={`${isUser ? "User" : "VOLTIS"} message`}
                    className={`max-w-[90%] rounded-inner border-[0.5px] px-4 py-2 ${
                      isUser
                        ? "border-accent-bright/20 bg-accent-bright/[0.06] sm:max-w-xl"
                        : "border-flash/[0.08] bg-surface-2 sm:max-w-3xl"
                    }`}
                  >
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
                      {isUser ? "User" : "VOLTIS"}
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-gray-300">
                      {message.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!readOnly && <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-flash/[0.08] bg-surface-1 p-4 sm:p-5"
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              if (error) setError(null);
            }}
            placeholder={t.components.conversation.placeholder || "Ask VOLTIS Copilot..."}
            aria-label="Ask VOLTIS Copilot"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "copilot-composer-error" : undefined}
            disabled={isPending}
            maxLength={1200}
            className="h-12 min-w-0 rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 px-4 text-sm text-white outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-inner bg-[linear-gradient(120deg,var(--color-accent),#3f86e8_60%,var(--color-accent-bright))] px-5 text-sm font-semibold text-white transition-all duration-fast hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SendHorizontal size={16} aria-hidden="true" />
            {isPending ? "Sending…" : t.components.conversation.send}
          </button>
        </div>
        {error && (
          <p
            id="copilot-composer-error"
            role="alert"
            className="mt-2 text-caption text-negative"
          >
            {error}
          </p>
        )}
        <span className="sr-only" aria-live="polite">
          {isPending ? "Sending message" : ""}
        </span>
      </form>}
    </Card>
  );
}
