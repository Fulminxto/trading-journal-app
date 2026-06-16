import {
  getCopilotLabels,
  getCopilotStatusLabel,
  type CopilotI18nProps,
} from "@/components/copilot/CopilotI18n";


type Props = CopilotI18nProps & { recoveryScore: number; recoveryLabel: string; recentWins: number; recentLosses: number; };
export default function RecoveryIntelligenceCard({ recoveryScore, recoveryLabel, recentWins, recentLosses, appLanguage }: Props) { const t = getCopilotLabels(appLanguage); return <div className="rounded-[36px] border border-accent-bright/20 bg-accent-bright/10 p-8"><div className="flex items-center justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-accent-bright">{t.components.recoveryIntelligence.eyebrow}</p><h2 className="mt-3 text-3xl font-black text-white">{t.components.recoveryIntelligence.title}</h2></div><div className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${recoveryScore >= 80 ? "bg-emerald-500/20 text-emerald-300" : recoveryScore >= 60 ? "bg-cyan-500/20 text-cyan-300" : recoveryScore > 0 ? "bg-yellow-500/20 text-yellow-300" : "bg-red-500/20 text-red-300"}`}>{getCopilotStatusLabel(recoveryLabel, t) || recoveryLabel}</div></div><div className="mt-8 grid gap-4 xl:grid-cols-3"><Metric label={t.components.recoveryIntelligence.recoveryScore} value={`${recoveryScore}%`} /><Metric label={t.components.recoveryIntelligence.recentWins} value={String(recentWins)} /><Metric label={t.components.recoveryIntelligence.recentLosses} value={String(recentLosses)} /></div></div> }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-[28px] border border-white/10 bg-black/20 p-5"><p className="text-xs uppercase tracking-[0.15em] text-gray-400">{label}</p><h3 className="mt-3 text-4xl font-black text-white">{value}</h3></div> }
