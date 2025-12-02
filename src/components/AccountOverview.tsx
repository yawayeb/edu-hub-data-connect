import { Card } from "@/components/ui/card";
import { Circle } from "lucide-react";

interface OverviewItem {
  label: string;
  value: string;
  colorClass: string;
}

const overviewItems: OverviewItem[] = [
  {
    label: "Recent Topup",
    value: "GH¢",
    colorClass: "text-success",
  },
  {
    label: "Last Login",
    value: "December 2nd 2025, 2:18:31am | Web",
    colorClass: "text-info",
  },
  {
    label: "Last Commission Paid",
    value: "null | GH¢0",
    colorClass: "text-warning",
  },
  {
    label: "Device",
    value: "desktop – Windows – Microsoft Edge",
    colorClass: "text-primary",
  },
  {
    label: "Location",
    value: "GH | 154.160.23.45",
    colorClass: "text-muted-foreground",
  },
];

export function AccountOverview() {
  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-semibold mb-6">Account Overview</h3>
      <div className="space-y-5">
        {overviewItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <Circle className={`h-5 w-5 mt-0.5 fill-current ${item.colorClass}`} />
            <div>
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <p className="text-sm text-foreground mt-1">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
