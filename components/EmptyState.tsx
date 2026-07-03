import { LucideIcon, Zap } from "lucide-react";

import Card from "@/components/ui/Card";
import IconTile from "@/components/ui/IconTile";

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
    <Card variant="inner" className="border-dashed p-10 text-center">
      <IconTile
        size="lg"
        interactive={false}
        className="mx-auto mb-5"
      >
        <Icon size={24} strokeWidth={2.2} />
      </IconTile>

      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-faint">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </Card>
  );
}
