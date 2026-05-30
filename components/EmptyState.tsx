import { LucideIcon, Zap } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
};

export default function EmptyState({
  title,
  description,
  icon: Icon = Zap,
  action,
}: EmptyStateProps) {
  return (
    <div className="card-hover rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-10 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
        <Icon
          size={24}
          strokeWidth={2.2}
          className="text-gray-300"
        />
      </div>

      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}
