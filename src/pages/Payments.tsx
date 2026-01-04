import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function Payments() {
  const [search, setSearch] = useState("");

  /* ================= DUMMY DATA ================= */

  const payments = [
    {
      paymentId: "PAY-001",
      invoiceId: "INV-1001",
      customer: "Rahul Gupta",
      phone: "9876543210",
      amount: 200000,
    },
    {
      paymentId: "PAY-002",
      invoiceId: "INV-1002",
      customer: "Ananya Roy",
      phone: "9123456780",
      amount: 100000,
    },
    {
      paymentId: "PAY-003",
      invoiceId: "INV-1003",
      customer: "Snehendu Mitra",
      phone: "7797722510",
      amount: 400000,
    },
    {
      paymentId: "PAY-004",
      invoiceId: "INV-1004",
      customer: "Sudipta Nath",
      phone: "9874734626",
      amount: 150000,
    },
    {
      paymentId: "PAY-005",
      invoiceId: "INV-1005",
      customer: "Rik Ganguly",
      phone: "8777061485",
      amount: 300000,
    },
  ];

  const filteredPayments = payments.filter(
    (p) =>
      p.paymentId.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="sticky top-0 z-20 bg-gray-100 pt-2 pb-4">
        <h1 className="text-2xl font-bold mb-3">Payments</h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Search payment / invoice / customer / phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-sm"
          />
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Search className="h-4 w-4" />
            Search
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl border bg-white p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPayments.map((p) => (
              <TableRow key={p.paymentId} className="hover:bg-muted/40">
                <TableCell className="font-medium">
                  {p.paymentId}
                </TableCell>
                <TableCell>{p.invoiceId}</TableCell>
                <TableCell>{p.customer}</TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell className="font-semibold">
                  ₹{p.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="space-y-4 md:hidden">
        {filteredPayments.map((p) => (
          <Card key={p.paymentId} className="rounded-xl shadow-sm">
            <CardContent className="p-5 space-y-2">
              <p className="text-base font-semibold">{p.customer}</p>
              <p className="text-xs text-muted-foreground">
                {p.phone}
              </p>
              <p className="text-xs text-muted-foreground">
                {p.paymentId} • {p.invoiceId}
              </p>
              <p className="text-sm font-semibold">
                Amount: ₹{p.amount}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
