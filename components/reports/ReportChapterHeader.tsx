type Props = {
  number: string;
  subtitle: string;
  title: string;
};

/**
 * Reports' one signature mechanic: every chapter opens with a large,
 * faint running numeral - the "referto" convention of a bound, numbered
 * document - instead of the small circular number-badge Replay/Edit
 * Trade use for their numbered sections. Reports-only by folder location
 * (not components/ui/), so it stays this page's mechanic, not a new
 * system-wide primitive.
 */
export default function ReportChapterHeader({
  number,
  subtitle,
  title,
}: Props) {
  return (
    <div className="mb-8 flex items-start gap-6 border-b border-white/10 pb-6">
      <span className="text-6xl font-black leading-none tracking-tight text-white/10 tabular-nums sm:text-7xl">
        {number}
      </span>

      <div className="pt-1">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-accent-bright">
          {subtitle}
        </p>

        <h2 className="mt-2 text-section text-white">
          {title}
        </h2>
      </div>
    </div>
  );
}
