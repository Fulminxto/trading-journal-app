// VOLTIS density presets.
// Density is page identity, not a generic compact mode:
// Dashboard light; Diary/Calendar medium; Equity medium-light;
// Analytics high; Reports medium-heavy; Copilot low-heavy.
export const pageDensity = {
  topbarSafeArea: "lg:pr-[18rem] xl:pr-[20rem]",
  headerRow:
    "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:pr-[18rem] xl:pr-[20rem]",
  dashboard: {
    page: "mx-auto w-full max-w-[1500px] space-y-6",
    header: "space-y-4",
    grid: "gap-5",
    panel: "p-6",
    hero: "p-6 sm:p-8",
    innerStack: "space-y-4",
  },
  diary: {
    page: "space-y-6",
    grid: "gap-4",
    panel: "p-5",
    tableCell: "p-4",
    mobileStack: "space-y-4",
  },
  calendar: {
    page: "space-y-6",
    grid: "gap-4",
    panel: "p-5 sm:p-6",
    dayCell: "min-h-[136px] p-3",
  },
  equity: {
    page: "space-y-6",
    grid: "gap-4",
    panel: "p-5 sm:p-6",
    hero: "p-6",
    tableCell: "p-4",
  },
  analytics: {
    page: "space-y-6",
    grid: "gap-3",
    panel: "p-5 sm:p-6",
    inner: "p-3",
    sectionStack: "space-y-3",
  },
  reports: {
    page: "space-y-6 print:space-y-0 print:bg-bg-base",
    webStack: "space-y-6",
    grid: "gap-3",
    panel: "p-6 sm:p-8",
  },
  copilot: {
    page: "space-y-6",
    sectionGrid: "gap-8",
    panel: "p-6 sm:p-8",
    hero: "p-8 sm:p-10",
    promptGrid: "gap-4",
  },
} as const;
