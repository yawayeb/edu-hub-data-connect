import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MonthlySalesChart() {
  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Monthly Sales</h3>
        <Select defaultValue="2025">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-48 flex items-end justify-between gap-2">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
          <div key={month} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-primary/20 rounded-t-lg" style={{ height: '10%' }}>
              <div className="w-full bg-primary rounded-t-lg h-1" />
            </div>
            <span className="text-xs text-muted-foreground">{month.slice(0, 1)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
