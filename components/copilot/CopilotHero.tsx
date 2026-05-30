export default function CopilotHero() {
  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#070b14] via-[#0f1726] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
          VOLTIS Copilot
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight text-white xl:text-7xl">
          AI Trading Copilot
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-400 xl:text-lg">
          Assistant intelligente per analizzare performance,
          comportamento, execution, psicologia operativa e pattern
          ricorrenti.
        </p>
      </div>
    </div>
  );
}
