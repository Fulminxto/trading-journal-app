import {
  getArrayCount,
  getCopilotLabels,
  getCopilotStatusLabel,
  type CopilotI18nProps,
} from "@/components/copilot/CopilotI18n";

type Props = CopilotI18nProps & {
  supervisorLevel: string;
  riskSignals: number | unknown[];
  behavioralDrift: boolean;
  executionDecay: boolean;
  confidenceDecay: boolean;
};

export default function AIRiskSupervisorCard({
  supervisorLevel,
  riskSignals,
  behavioralDrift,
  executionDecay,
  confidenceDecay,
  appLanguage,
}: Props) {
  const t = getCopilotLabels(appLanguage);
  const riskSignalsCount = getArrayCount(riskSignals);

  return (
    <div className="rounded-[36px] border border-red-500/20 bg-red-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-red-400">{t.components.aiRiskSupervisor.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black text-white">{t.components.aiRiskSupervisor.title}</h2>
        </div>
        <div className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${supervisorLevel === "Critical" ? "bg-red-600/20 text-red-300" : supervisorLevel === "High" ? "bg-red-500/20 text-red-300" : supervisorLevel === "Moderate" ? "bg-yellow-500/20 text-yellow-300" : "bg-emerald-500/20 text-emerald-300"}`}>
          {getCopilotStatusLabel(supervisorLevel, t) || supervisorLevel}
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-4">
        <Metric label={t.components.aiRiskSupervisor.riskSignals} value={String(riskSignalsCount)} />
        <Metric label={t.components.aiRiskSupervisor.drift} value={behavioralDrift ? t.common.detected : t.common.stable} tone={behavioralDrift ? "text-red-400" : "text-emerald-400"} small />
        <Metric label={t.components.aiRiskSupervisor.execution} value={executionDecay ? t.common.declining : t.common.stable} tone={executionDecay ? "text-red-400" : "text-emerald-400"} small />
        <Metric label={t.components.aiRiskSupervisor.confidence} value={confidenceDecay ? t.common.declining : t.common.stable} tone={confidenceDecay ? "text-red-400" : "text-emerald-400"} small />
      </div>
    </div>
  );
}

function Metric({ label, value, tone = "text-white", small = false }: { label: string; value: string; tone?: string; small?: boolean }) {
  return <div className="rounded-[28px] border border-white/10 bg-black/20 p-5"><p className="text-xs uppercase tracking-[0.15em] text-gray-400">{label}</p><h3 className={`mt-3 font-black ${small ? "text-2xl" : "text-4xl"} ${tone}`}>{value}</h3></div>;
}
