"use client";

type RulesStandardsLinkProps = {
  className?: string;
};

export default function RulesStandardsLink({
  className = "",
}: RulesStandardsLinkProps) {
  function focusRulebook() {
    const rulebook = document.getElementById("set-the-rulebook");

    if (!rulebook) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    rulebook.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    const firstField = rulebook.querySelector<HTMLInputElement>(
      'input:not([disabled])'
    );
    const focusField = () => firstField?.focus({ preventScroll: true });

    if (reduceMotion) {
      window.requestAnimationFrame(focusField);
    } else {
      window.setTimeout(focusField, 500);
    }
  }

  return (
    <button type="button" onClick={focusRulebook} className={className}>
      Configure standards
    </button>
  );
}
