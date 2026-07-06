"use client";

import { useEffect, useState } from "react";

import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";

const sectionIds = [
  "executive",
  "performance",
  "risk",
  "psychology",
  "growth",
] as const;

export default function ReportsNavigation({
  appLanguage,
}: ReportI18nProps) {
  const [activeSection, setActiveSection] =
    useState<(typeof sectionIds)[number]>("executive");
  const t = getReportLabels(appLanguage);

  useEffect(() => {
    const validHash = sectionIds.find(
      (id) => `#${id}` === window.location.hash
    );

    if (validHash) {
      setActiveSection(validHash);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top)
          )[0];

        if (
          visible &&
          sectionIds.includes(
            visible.target.id as (typeof sectionIds)[number]
          )
        ) {
          setActiveSection(
            visible.target.id as (typeof sectionIds)[number]
          );
        }
      },
      {
        rootMargin: "-18% 0px -65% 0px",
        threshold: 0.01,
      }
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="print-hidden sticky top-4 z-30 border-b border-white/[0.08] bg-bg-deep/85 backdrop-blur">
      <div className="flex gap-6 overflow-x-auto">
        {sectionIds.map((id) => {
          const isActive = activeSection === id;

          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActiveSection(id)}
              className={`relative shrink-0 px-0.5 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-base ${
                isActive
                  ? "text-white"
                  : "text-muted-faint hover:text-muted"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {t[id]}
              <span
                className={`absolute inset-x-0 bottom-0 h-px rounded-full transition-all duration-base ${
                  isActive
                    ? "bg-accent-bright opacity-100"
                    : "bg-transparent opacity-0"
                }`}
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
