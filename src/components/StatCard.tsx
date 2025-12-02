import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
}

export function StatCard({ title, value, icon: Icon, iconBgClass, iconColorClass }: StatCardProps) {
  return (
    <Card className="p-6 shadow-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={cn("p-3 rounded-xl", iconBgClass)}>
          <Icon className={cn("h-6 w-6", iconColorClass)} />
        </div>
      </div>
    </Card>
  );
}
