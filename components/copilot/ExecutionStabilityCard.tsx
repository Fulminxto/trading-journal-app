import {
  getCopilotLabels,
  type CopilotI18nProps,
} from "@/components/copilot/CopilotI18n";


type Props = CopilotI18nProps & { executionDecay: boolean; recentExecutionAverage: number; previousExecutionAverage: number; };
export default function ExecutionStabilityCard({ executionDecay, recentExecutionAverage, previousExecutionAverage, appLanguage }: Props) { const t = getCopilotLabels(appLanguage); return <div className="rounded-[36px] border border-orange-500/20 bg-orange-500/10 p-8"><div className="flex items-center justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-orange-400">{t.components.executionStability.eyebrow}</p><h2 className="mt-3 text-3xl font-black text-white">{t.components.executionStability.title}</h2></div><div className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${executionDecay ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>{executionDecay ? t.common.decay : t.common.stable}</div></div><div className="mt-8 grid gap-4 xl:grid-cols-3"><Metric label={t.components.executionStability.recentExecution} value={`${recentExecutionAverage}/10`} /><Metric label={t.components.executionStability.previousExecution} value={`${previousExecutionAverage}/10`} /><Metric label={t.common.status} value={executionDecay ? t.common.declining : t.common.stable} tone={executionDecay ? "text-red-400" : "text-emerald-400"} /></div></div> }
function Metric({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) { return <div className="rounded-[28px] border border-white/10 bg-black/20 p-5"><p className="text-xs uppercase tracking-[0.15em] text-gray-400">{label}</p><h3 className={`mt-3 text-4xl font-black ${tone}`}>{value}</h3></div> }

