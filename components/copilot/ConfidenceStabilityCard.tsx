import {
  getCopilotLabels,
  type CopilotI18nProps,
} from "@/components/copilot/CopilotI18n";


type Props = CopilotI18nProps & { confidenceDecay: boolean; recentConfidenceAverage: number; previousConfidenceAverage: number; };
export default function ConfidenceStabilityCard({ confidenceDecay, recentConfidenceAverage, previousConfidenceAverage, appLanguage }: Props) { const t = getCopilotLabels(appLanguage); return <div className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/10 p-8"><div className="flex items-center justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">{t.components.confidenceStability.eyebrow}</p><h2 className="mt-3 text-3xl font-black text-white">{t.components.confidenceStability.title}</h2></div><Badge active={confidenceDecay} activeText={t.common.declining} inactiveText={t.common.stable} /></div><div className="mt-8 grid gap-4 xl:grid-cols-3"><Metric label={t.components.confidenceStability.recentConfidence} value={`${recentConfidenceAverage}/10`} /><Metric label={t.components.confidenceStability.previousConfidence} value={`${previousConfidenceAverage}/10`} /><Metric label={t.common.status} value={confidenceDecay ? t.common.declining : t.common.stable} tone={confidenceDecay ? "text-red-400" : "text-emerald-400"} /></div></div> }
function Badge({ active, activeText, inactiveText }: { active: boolean; activeText: string; inactiveText: string }) { return <div className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${active ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>{active ? activeText : inactiveText}</div> }
function Metric({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) { return <div className="rounded-[28px] border border-white/10 bg-black/20 p-5"><p className="text-xs uppercase tracking-[0.15em] text-gray-400">{label}</p><h3 className={`mt-3 text-4xl font-black ${tone}`}>{value}</h3></div> }

