"use client";

type SessionBuilderLinkProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SessionBuilderLink({
  children,
  className = "",
}: SessionBuilderLinkProps) {
  function focusSessionBuilder() {
    const builder = document.getElementById("session-builder");

    if (!builder) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    builder.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    const firstField = builder.querySelector<HTMLElement>(
      "input:not([disabled]), select:not([disabled]), textarea:not([disabled])"
    );

    const focusFirstField = () =>
      firstField?.focus({ preventScroll: true });

    if (reduceMotion) {
      window.requestAnimationFrame(focusFirstField);
    } else {
      window.setTimeout(focusFirstField, 500);
    }
  }

  return (
    <button
      type="button"
      onClick={focusSessionBuilder}
      className={className}
    >
      {children}
    </button>
  );
}
