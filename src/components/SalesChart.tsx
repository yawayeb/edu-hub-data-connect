import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function SalesChart() {
  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Weekly Sales</h3>
        <div className="flex items-center gap-1 text-sm text-success">
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">10%</span>
        </div>
      </div>
      <div className="h-32 flex items-end justify-between gap-2">
        {[0, 0, 0, 0, 0, 0, 0].map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-primary/20 rounded-t-lg" style={{ height: `${Math.max(value * 100, 10)}%` }}>
              <div className="w-full bg-primary rounded-t-lg h-1" />
            </div>
            <span className="text-xs text-muted-foreground">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-2xl font-bold mt-4">GH¢0.00</p>
    </Card>
  );
}
