import {
  getCopilotLabels,
  getCopilotStatusLabel,
  type CopilotI18nProps,
} from "@/components/copilot/CopilotI18n";


type Props = CopilotI18nProps & { emotionalLabel: string; emotionalInstabilityScore: number; emotionalVolatility: boolean; emotionalTradesCount: number; };
export default function EmotionalStabilityCard({ emotionalLabel, emotionalInstabilityScore, emotionalVolatility, emotionalTradesCount, appLanguage }: Props) { const t = getCopilotLabels(appLanguage); return <div className="rounded-[36px] border border-pink-500/20 bg-pink-500/10 p-8"><div className="flex items-center justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-pink-400">{t.components.emotionalStability.eyebrow}</p><h2 className="mt-3 text-3xl font-black text-white">{t.components.emotionalStability.title}</h2></div><div className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${emotionalLabel === "Critical" ? "bg-red-600/20 text-red-300" : emotionalLabel === "High" ? "bg-red-500/20 text-red-300" : emotionalLabel === "Moderate" ? "bg-yellow-500/20 text-yellow-300" : "bg-emerald-500/20 text-emerald-300"}`}>{getCopilotStatusLabel(emotionalLabel, t) || emotionalLabel}</div></div><div className="mt-8 grid gap-4 xl:grid-cols-3"><Metric label={t.components.emotionalStability.emotionalInstability} value={`${emotionalInstabilityScore}%`} /><Metric label={t.components.emotionalStability.emotionalTrades} value={String(emotionalTradesCount)} /><Metric label={t.common.status} value={emotionalVolatility ? t.common.volatile : t.common.stable} tone={emotionalVolatility ? "text-red-400" : "text-emerald-400"} /></div></div> }
function Metric({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) { return <div className="rounded-[28px] border border-white/10 bg-black/20 p-5"><p className="text-xs uppercase tracking-[0.15em] text-gray-400">{label}</p><h3 className={`mt-3 text-4xl font-black ${tone}`}>{value}</h3></div> }
