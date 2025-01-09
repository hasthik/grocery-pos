"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentSales() {
  // Example data
  const salesData = [
    { id: 1, order: "#1012", customer: "John Doe", amount: "$120.00" },
    { id: 2, order: "#1013", customer: "Jane Doe", amount: "$90.00" },
    { id: 3, order: "#1014", customer: "Acme Corp.", amount: "$520.00" },
    { id: 4, order: "#1015", customer: "Random User", amount: "$75.00" },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {salesData.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.order}</TableCell>
            <TableCell>{row.customer}</TableCell>
            <TableCell>{row.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
