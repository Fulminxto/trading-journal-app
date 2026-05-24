const sections = [
  {
    id: "executive",
    label: "Executive",
  },
  {
    id: "weekly",
    label: "Weekly",
  },
  {
    id: "monthly",
    label: "Monthly",
  },
  {
    id: "behavior",
    label: "Behavior",
  },
  {
    id: "performance",
    label: "Performance",
  },
  {
    id: "evolution",
    label: "Evolution",
  },
  {
    id: "coaching",
    label: "Coaching",
  },
  {
    id: "risk",
    label: "Risk",
  },
  {
    id: "consistency",
    label: "Consistency",
  },
  {
    id: "psychology",
    label: "Psychology",
  },
  {
    id: "forecast",
    label: "Forecast",
  },
  {
    id: "growth",
    label: "Growth",
  },
  {
    id: "edge",
    label: "Edge",
  },
  {
    id: "decision",
    label: "Decision",
  },
  {
    id: "execution",
    label: "Execution",
  },
  {
    id: "setup",
    label: "Setup",
  },
  {
    id: "confidence",
    label: "Confidence",
  },
  {
    id: "discipline",
    label: "Discipline",
  },
  {
    id: "emotion",
    label: "Emotion",
  },
  {
    id: "identity",
    label: "Identity",
  },
  {
    id: "cognitive",
    label: "Cognitive",
  },
  {
    id: "resilience",
    label: "Resilience",
  },
];

export default function ReportsNavigation() {
  return (
    <div className="print-hidden sticky top-4 z-30 rounded-[28px] border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
      <div className="flex gap-3 overflow-x-auto">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-gray-300 transition hover:border-cyan-400/40 hover:text-cyan-400"
          >
            {section.label}
          </a>
        ))}
      </div>
    </div>
  );
}