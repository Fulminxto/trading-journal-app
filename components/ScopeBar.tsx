"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  type Period,
  getPeriodPresetLabel,
  getPeriodLabel,
  navigatePeriod,
  defaultRef,
  getScopeDescription,
} from "@/lib/scope";
import { type AppLanguage } from "@/lib/i18n";
import VoltisLightningLoader from "@/components/VoltisLightningLoader";
import Pill from "@/components/ui/Pill";

type Member = {
  id: string;
  name: string | null;
  username: string;
};

type Props = {
  accountId: string;
  // Trader group — omit entirely on personal accounts
  members?: Member[];
  selectedMemberId?: string;
  // Period group
  currentPeriod: Period;
  currentRef: string;
  // i18n
  appLanguage: AppLanguage;
  mode?: "all" | "trader" | "period";
};

const PRESETS: Period[] = ["all", "day", "week", "month", "year"];

const TRADER_LABEL: Record<AppLanguage, string> = {
  it: "Trader", en: "Trader", uk: "Трейдер",
  ru: "Трейдер", es: "Trader", fr: "Trader", de: "Trader",
};

const PERIOD_LABEL: Record<AppLanguage, string> = {
  it: "Periodo", en: "Period", uk: "Період",
  ru: "Период", es: "Período", fr: "Période", de: "Zeitraum",
};

const ALL_TRADERS_LABEL: Record<AppLanguage, string> = {
  it: "Tutti", en: "All", uk: "Усі",
  ru: "Все", es: "Todos", fr: "Tous", de: "Alle",
};

export default function ScopeBar({
  members,
  selectedMemberId,
  currentPeriod,
  currentRef,
  appLanguage,
  mode = "all",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const lang = appLanguage;

  const isShared = members !== undefined && members.length > 0;

  // ── Helpers ────────────────────────────────────────────────────────────────

  function buildParams(overrides: Record<string, string | undefined>): string {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    return params.toString();
  }

  function go(overrides: Record<string, string | undefined>) {
    startTransition(() => router.push(`?${buildParams(overrides)}`));
  }

  // ── Trader handlers ────────────────────────────────────────────────────────

  function selectTrader(memberId: string) {
    go({ member: memberId || undefined });
  }

  // ── Period handlers ────────────────────────────────────────────────────────

  function selectPeriod(period: Period) {
    if (period === "all") {
      go({ period: undefined, ref: undefined });
    } else {
      const ref = currentPeriod === period ? currentRef : defaultRef(period);
      go({ period, ref });
    }
  }

  function navigate(direction: -1 | 1) {
    const newRef = navigatePeriod(currentPeriod, currentRef, direction);
    go({ period: currentPeriod, ref: newRef });
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const selectedMember = isShared
    ? members!.find((m) => m.id === selectedMemberId)
    : undefined;

  const traderName = isShared
    ? (selectedMember ? (selectedMember.name || selectedMember.username) : null)
    : undefined; // undefined = personal → skip trader in description

  const scopeDescription = getScopeDescription({
    period: currentPeriod,
    ref: currentRef,
    lang,
    traderName,
  });

  const navigatorLabel = getPeriodLabel(currentPeriod, currentRef, lang);
  const showTrader = mode === "all" || mode === "trader";
  const showPeriod = mode === "all" || mode === "period";
  const showDescription = false;

  if (mode === "trader" && !isShared) {
    return null;
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="relative z-0 w-full py-0.5">
      <div
        className={`relative flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
          isPending ? "pointer-events-none" : ""
        }`}
      >
        {/* ── LEFT: Trader pills (shared accounts only) ── */}
        {showTrader && isShared && (
          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto">
            <p className="shrink-0 text-micro font-medium uppercase tracking-label text-muted-faint">
              {TRADER_LABEL[lang]}
            </p>

            <div className={`flex min-w-0 flex-wrap gap-1.5 ${isPending ? "opacity-50" : ""}`}>
              {/* All traders pill */}
              <Pill
                active={!selectedMemberId}
                onClick={() => selectTrader("")}
                avatar={
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                      !selectedMemberId
                        ? "bg-accent/20 text-accent"
                        : "bg-white/10 text-muted"
                    }`}
                  >
                    {ALL_TRADERS_LABEL[lang][0].toUpperCase()}
                  </span>
                }
                className="px-2 py-1 text-xs"
              >
                {ALL_TRADERS_LABEL[lang]}
              </Pill>

              {members!.map((member) => {
                const isActive = selectedMemberId === member.id;
                const displayName = member.name || member.username;
                return (
                  <Pill
                    key={member.id}
                    active={isActive}
                    onClick={() => selectTrader(member.id)}
                    avatar={
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                          isActive
                            ? "bg-accent/20 text-accent"
                            : "bg-white/10 text-muted"
                        }`}
                      >
                        {displayName[0].toUpperCase()}
                      </span>
                    }
                    className="px-2 py-1 text-xs"
                  >
                    {displayName}
                  </Pill>
                );
              })}
            </div>
          </div>
        )}

        {/* ── RIGHT: Period pills + navigator ── */}
        {showPeriod && (
          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <p className="shrink-0 text-micro font-medium uppercase tracking-label text-muted-faint">
              {PERIOD_LABEL[lang]}
            </p>

            <div className={`flex min-w-0 flex-wrap items-center gap-1.5 ${isPending ? "opacity-50" : ""}`}>
              {/* Preset pills */}
              {PRESETS.map((preset) => (
                <Pill
                  key={preset}
                  active={currentPeriod === preset}
                  onClick={() => selectPeriod(preset)}
                  className="px-2 py-1 text-xs"
                >
                  {getPeriodPresetLabel(preset, lang)}
                </Pill>
              ))}

              {/* Navigator: only when a specific period is active */}
              {currentPeriod !== "all" && currentRef && (
                <div className="flex items-center gap-1 rounded-pill border border-white/10 bg-white/[0.03] px-1 py-0.5">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex h-6 w-6 items-center justify-center rounded-pill text-muted transition hover:bg-white/10 hover:text-white"
                    aria-label="Previous"
                  >
                    ‹
                  </button>

                  <span className="min-w-[96px] px-1.5 text-center text-xs text-white">
                    {navigatorLabel}
                  </span>

                  <button
                    onClick={() => navigate(1)}
                    className="flex h-6 w-6 items-center justify-center rounded-pill text-muted transition hover:bg-white/10 hover:text-white"
                    aria-label="Next"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            {/* Loading indicator */}
            {isPending && <VoltisLightningLoader size={16} />}
          </div>
        )}
      </div>

      {/* ── Scope description row ── */}
      {showDescription && (
        <p className="relative mt-1.5 text-micro text-muted-faint">
          {scopeDescription}
        </p>
      )}
    </div>
  );
}
