import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  orderId: string;
  msisdn: string;
  value: string;
  status: "Delivered" | "Pending" | "Failed";
  time: string;
}

const transactions: Transaction[] = [
  {
    orderId: "#3991038",
    msisdn: "0244123456",
    value: "10 GB",
    status: "Delivered",
    time: "2 mins ago",
  },
  {
    orderId: "#3991037",
    msisdn: "0551234567",
    value: "5 GB",
    status: "Delivered",
    time: "15 mins ago",
  },
  {
    orderId: "#3991036",
    msisdn: "0201234567",
    value: "20 GB",
    status: "Delivered",
    time: "1 hour ago",
  },
];

export function RecentTransactions() {
  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-semibold mb-4">Recent AT Transactions</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>MSISDN</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.orderId}>
              <TableCell>
                <span className="font-medium text-destructive">{transaction.orderId}</span>
              </TableCell>
              <TableCell className="font-mono text-sm">{transaction.msisdn}</TableCell>
              <TableCell className="font-medium">{transaction.value}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className="bg-success-light text-success border-success/20"
                >
                  {transaction.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{transaction.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
