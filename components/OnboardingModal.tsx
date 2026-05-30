"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  BarChart3,
  CheckCircle2,
  X,
} from "lucide-react";

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(
      "trading-journal-onboarding"
    );

    if (!hasSeenOnboarding) {
      setOpen(true);
    }
  }, []);

  function closeOnboarding() {
    localStorage.setItem(
      "trading-journal-onboarding",
      "true"
    );

    setOpen(false);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#071018] p-6 shadow-2xl">
        <button
          onClick={closeOnboarding}
          className="absolute right-4 top-4 rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <p className="text-sm text-green-400">
            Welcome to Trading Journal
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Costruisci il tuo sistema da trader
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Questa piattaforma non serve solo a segnare operazioni.
            Serve a capire come performi, dove migliori e quali pattern
            si ripetono nel tempo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-black/20 p-4">
            <BookOpen className="mb-3 text-green-400" />

            <h3 className="font-bold">
              1. Trading Diary
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Registra ogni trade con dati, emozioni, errori e lezioni.
            </p>
          </div>

          <div className="rounded-2xl bg-black/20 p-4">
            <CheckCircle2 className="mb-3 text-yellow-400" />

            <h3 className="font-bold">
              2. Sessions
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Prepara la giornata con focus, bias, checklist e review.
            </p>
          </div>

          <div className="rounded-2xl bg-black/20 p-4">
            <CalendarDays className="mb-3 text-blue-400" />

            <h3 className="font-bold">
              3. Calendar
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Controlla la performance giorno per giorno.
            </p>
          </div>

          <div className="rounded-2xl bg-black/20 p-4">
            <BarChart3 className="mb-3 text-purple-400" />

            <h3 className="font-bold">
              4. Analytics
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Studia numeri, pattern, comportamenti e punti deboli.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-green-500/10 bg-green-500/[0.03] p-4">
          <p className="text-sm text-gray-300">
            Usa l’app con costanza: pochi dati inseriti bene ogni giorno
            valgono più di mille operazioni mai analizzate.
          </p>
        </div>

        <button
          onClick={closeOnboarding}
          className="mt-6 w-full rounded-2xl bg-green-500 p-4 font-bold text-black transition hover:bg-green-400"
        >
          Inizia
        </button>
      </div>
    </div>
  );
}
