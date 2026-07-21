"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import { toast } from "sonner";

import Card from "@/components/ui/Card";
import { updateTradingSessionReview } from "@/app/accounts/[accountId]/sessions/actions";
import { isSessionReviewed } from "./review-status";

export type SessionReviewItem = {
  id: string;
  dateLabel: string;
  title: string;
  sessionType: string | null;
  marketBias: string | null;
  focus: string | null;
  emotionalState: string | null;
  checklist: string | null;
  goals: string | null;
  mistakesToAvoid: string | null;
  sessionReview: string | null;
  finalScore: number | null;
};

type SessionReviewWorkspaceProps = {
  accountId: string;
  sessions: SessionReviewItem[];
  canEdit: boolean;
  correctionMode?: boolean;
};

type FormErrors = {
  review?: string;
  score?: string;
  form?: string;
};

const fieldClass =
  "w-full rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 px-4 py-3 text-sm text-white outline-none transition-colors duration-fast placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10 disabled:cursor-not-allowed disabled:opacity-60";

function ReadOnlyValue({
  label,
  value,
  warning = false,
}: {
  label: string;
  value: string | null;
  warning?: boolean;
}) {
  return (
    <Card
      variant="inner"
      className={warning ? "border-negative/20 bg-negative/[0.04] p-4" : "p-4"}
    >
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">
        {value?.trim() || "Not recorded"}
      </p>
    </Card>
  );
}

export default function SessionReviewWorkspace({
  accountId,
  sessions,
  canEdit,
  correctionMode = false,
}: SessionReviewWorkspaceProps) {
  const router = useRouter();
  const [selectedSession, setSelectedSession] =
    useState<SessionReviewItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [review, setReview] = useState("");
  const [score, setScore] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();
  const isPendingRef = useRef(false);
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  function openSession(
    session: SessionReviewItem,
    trigger: HTMLButtonElement
  ) {
    previouslyFocusedRef.current = trigger;
    setSelectedSession(session);
    setReview(session.sessionReview ?? "");
    setScore(
      typeof session.finalScore === "number"
        ? String(session.finalScore)
        : ""
    );
    setErrors({});
  }

  useEffect(() => {
    isPendingRef.current = isPending;
  }, [isPending]);

  function closeDrawer(force = false) {
    if (isPendingRef.current && !force) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    setIsVisible(false);
    window.setTimeout(
      () => setSelectedSession(null),
      reduceMotion ? 0 : 200
    );
  }

  useEffect(() => {
    if (!selectedSession) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      setIsVisible(true);
      closeButtonRef.current?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) {
        return;
      }

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [selectedSession]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedSession || !canEdit) {
      return;
    }

    const nextErrors: FormErrors = {};
    const trimmedReview = review.trim();
    const numericScore = Number(score);

    if (!trimmedReview) {
      nextErrors.review = "Final review is required.";
    }

    if (
      !score ||
      !Number.isInteger(numericScore) ||
      numericScore < 1 ||
      numericScore > 10
    ) {
      nextErrors.score = "Enter a whole number from 1 to 10.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    startTransition(async () => {
      try {
        const result = await updateTradingSessionReview(
          accountId,
          selectedSession.id,
          trimmedReview,
          numericScore
          , correctionMode
        );

        if (!result.success) {
          setErrors({ form: result.error ?? "Unable to save the review." });
          toast.error(result.error ?? "Unable to save the review.");
          return;
        }

        toast.success("Session review saved.");
        closeDrawer(true);
        router.refresh();
      } catch {
        setErrors({ form: "Unable to save the review." });
        toast.error("Unable to save the review.");
      }
    });
  }

  return (
    <>
      <div className="space-y-4">
        {sessions.map((session) => {
          const reviewed = isSessionReviewed(session);
          const stateLabel = reviewed ? "Reviewed" : "Pending Review";

          return (
            <Card key={session.id} className="p-5 sm:p-6">
              <button
                type="button"
                onClick={(event) => openSession(session, event.currentTarget)}
                aria-label={`Open ${session.title}, ${session.dateLabel}, ${stateLabel}`}
                className="absolute inset-0 z-20 cursor-pointer rounded-card border border-transparent transition-colors duration-fast hover:border-flash/20 hover:bg-white/[0.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-bright/60"
              />

              <div className="pointer-events-none flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
                    {session.dateLabel}
                  </p>
                  <h3 className="mt-2 text-subsection text-white">
                    {session.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-pill border-[0.5px] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] ${
                        reviewed
                          ? "border-green-400/25 bg-green-400/[0.06] text-green-400"
                          : "border-warning/25 bg-warning/[0.06] text-warning"
                      }`}
                    >
                      {stateLabel}
                    </span>
                    {session.sessionType && (
                      <span className="rounded-pill border-[0.5px] border-accent-bright/20 bg-accent-bright/[0.06] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-accent-bright">
                        {session.sessionType}
                      </span>
                    )}
                    {typeof session.finalScore === "number" && (
                      <span className="rounded-pill border-[0.5px] border-flash/[0.1] bg-surface-2 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-white">
                        Score: {session.finalScore}/10
                      </span>
                    )}
                  </div>
                </div>

                {session.marketBias && (
                  <Card variant="inner" className="w-full p-4 sm:w-56 sm:shrink-0">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
                      Market Bias
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {session.marketBias}
                    </p>
                  </Card>
                )}
              </div>

              <div className="pointer-events-none mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                {session.focus && <ReadOnlyValue label="Focus" value={session.focus} />}
                {session.goals && <ReadOnlyValue label="Goals" value={session.goals} />}
                {session.checklist && <ReadOnlyValue label="Checklist" value={session.checklist} />}
                {session.mistakesToAvoid && (
                  <ReadOnlyValue label="Mistakes To Avoid" value={session.mistakesToAvoid} warning />
                )}
              </div>

              {session.sessionReview && (
                <div className="pointer-events-none mt-4">
                  <ReadOnlyValue label="Session Review" value={session.sessionReview} />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {selectedSession && (
        <div
          className={`fixed inset-0 z-[9998] bg-black/30 transition-opacity duration-200 motion-reduce:transition-none ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isPending) {
              closeDrawer();
            }
          }}
        >
          <aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-review-drawer-title"
            className={`fixed inset-y-0 right-0 h-dvh w-full overflow-hidden border-l border-white/[0.1] bg-surface-1 shadow-[0_24px_80px_rgba(0,0,0,0.42)] transition-transform duration-200 motion-reduce:transition-none sm:w-[min(92vw,480px)] sm:rounded-l-[18px] ${
              isVisible ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-dvh flex-col">
              <header className="shrink-0 border-b border-white/10 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
                      {selectedSession.dateLabel}
                    </p>
                    <h2
                      id="session-review-drawer-title"
                      className="mt-2 truncate text-2xl font-black text-white"
                    >
                      {selectedSession.title}
                    </h2>
                    <span
                      className={`mt-3 inline-flex rounded-pill border-[0.5px] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] ${
                        isSessionReviewed(selectedSession)
                          ? "border-green-400/25 bg-green-400/[0.06] text-green-400"
                          : "border-warning/25 bg-warning/[0.06] text-warning"
                      }`}
                    >
                      {isSessionReviewed(selectedSession) ? "Reviewed" : "Pending Review"}
                    </span>
                  </div>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => closeDrawer()}
                    disabled={isPending}
                    aria-label="Close session review"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-inner border border-white/10 text-muted transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright disabled:opacity-50"
                  >
                    <X aria-hidden="true" size={20} />
                  </button>
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                <div className="space-y-6">
                  <section aria-labelledby="session-pre-market-title">
                    <h3 id="session-pre-market-title" className="text-xs font-medium uppercase tracking-[0.18em] text-accent-bright">
                      01 &mdash; Pre-Market Brief
                    </h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <ReadOnlyValue label="Session Type" value={selectedSession.sessionType} />
                      <ReadOnlyValue label="Market Bias" value={selectedSession.marketBias} />
                      <ReadOnlyValue label="Daily Focus" value={selectedSession.focus} />
                      <ReadOnlyValue label="Emotional State" value={selectedSession.emotionalState} />
                    </div>
                  </section>

                  <section aria-labelledby="session-contract-title">
                    <h3 id="session-contract-title" className="text-xs font-medium uppercase tracking-[0.18em] text-accent-bright">
                      02 &mdash; Execution Contract
                    </h3>
                    <div className="mt-4 grid gap-3">
                      <ReadOnlyValue label="Checklist" value={selectedSession.checklist} />
                      <ReadOnlyValue label="Goals" value={selectedSession.goals} />
                      <ReadOnlyValue label="Mistakes to avoid" value={selectedSession.mistakesToAvoid} warning />
                    </div>
                  </section>

                  <section aria-labelledby="session-post-market-title">
                    <h3 id="session-post-market-title" className="text-xs font-medium uppercase tracking-[0.18em] text-accent-bright">
                      03 &mdash; Post-Market Review
                    </h3>
                    {canEdit ? (
                      <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
                        <div>
                          <label htmlFor="drawer-session-review" className="mb-2 block text-sm font-medium text-white">
                            Final review
                          </label>
                          <textarea
                            id="drawer-session-review"
                            value={review}
                            onChange={(event) => setReview(event.target.value)}
                            disabled={isPending}
                            aria-invalid={Boolean(errors.review)}
                            aria-describedby={errors.review ? "drawer-review-error" : undefined}
                            className={`${fieldClass} min-h-36`}
                          />
                          {errors.review && (
                            <p id="drawer-review-error" role="alert" className="mt-2 text-sm text-negative">
                              {errors.review}
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="drawer-final-score" className="mb-2 block text-sm font-medium text-white">
                            Final Score (1&ndash;10)
                          </label>
                          <input
                            id="drawer-final-score"
                            type="number"
                            min="1"
                            max="10"
                            step="1"
                            value={score}
                            onChange={(event) => setScore(event.target.value)}
                            disabled={isPending}
                            aria-invalid={Boolean(errors.score)}
                            aria-describedby={errors.score ? "drawer-score-error" : undefined}
                            className={fieldClass}
                          />
                          {errors.score && (
                            <p id="drawer-score-error" role="alert" className="mt-2 text-sm text-negative">
                              {errors.score}
                            </p>
                          )}
                        </div>
                        {errors.form && (
                          <p role="alert" className="text-sm text-negative">
                            {errors.form}
                          </p>
                        )}
                        <button
                          type="submit"
                          disabled={isPending}
                          aria-busy={isPending}
                          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-inner bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright disabled:cursor-wait disabled:opacity-60"
                        >
                          <Save aria-hidden="true" size={17} />
                          {isPending
                            ? "Saving review..."
                            : isSessionReviewed(selectedSession)
                              ? "Update review"
                              : "Save review"}
                        </button>
                      </form>
                    ) : (
                      <div className="mt-4 grid gap-3">
                        <ReadOnlyValue label="Final review" value={selectedSession.sessionReview} />
                        <ReadOnlyValue
                          label="Final Score"
                          value={typeof selectedSession.finalScore === "number" ? `${selectedSession.finalScore}/10` : null}
                        />
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
