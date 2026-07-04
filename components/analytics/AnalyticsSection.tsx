import Card from "@/components/ui/Card";

type Props = {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
};

export default function AnalyticsSection({
  title,
  subtitle,
  className = "",
  children,
}: Props) {
  return (
    <Card className={className}>
      <div className="mb-6">
        {subtitle && (
          <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-faint">
            {subtitle}
          </p>
        )}

        <h2 className="mt-2 text-section text-white">
          {title}
        </h2>
      </div>

      {children}
    </Card>
  );
}
