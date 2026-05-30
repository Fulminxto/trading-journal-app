"use client";

export default function ReopenOnboardingButton() {
  function reopenOnboarding() {
    localStorage.removeItem(
      "trading-journal-onboarding"
    );

    window.location.reload();
  }

  return (
    <button
      onClick={reopenOnboarding}
      className="mt-5 rounded-2xl bg-green-500 px-5 py-3 font-bold text-black transition hover:bg-green-400"
    >
      Apri guida iniziale
    </button>
  );
}
