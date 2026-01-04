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

export default function CancelRecords() {
  const [search, setSearch] = useState("");

  /* ================= DUMMY DATA ================= */

  const cancelledInvoices = [
    {
      invoiceId: "INV-9001",
      customer: "Rahul Gupta",
      phone: "9876543210",
    },
    {
      invoiceId: "INV-9002",
      customer: "Ananya Roy",
      phone: "9123456780",
    },
    {
      invoiceId: "INV-9003",
      customer: "Snehendu Mitra",
      phone: "7797722510",
    },
    {
      invoiceId: "INV-9004",
      customer: "Sudipta Nath",
      phone: "9874734626",
    },
    {
      invoiceId: "INV-9005",
      customer: "Rik Ganguly",
      phone: "8777061485",
    },
  ];

  const filteredRecords = cancelledInvoices.filter(
    (inv) =>
      inv.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="sticky top-0 z-20 bg-gray-100 pt-2 pb-4">
        <h1 className="text-2xl font-bold mb-3">Cancelled Invoices</h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Search invoice / customer / phone"
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
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRecords.map((inv) => (
              <TableRow key={inv.invoiceId} className="hover:bg-muted/40">
                <TableCell className="font-medium">
                  {inv.invoiceId}
                </TableCell>
                <TableCell>{inv.customer}</TableCell>
                <TableCell>{inv.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="space-y-4 md:hidden">
        {filteredRecords.map((inv) => (
          <Card key={inv.invoiceId} className="rounded-xl shadow-sm">
            <CardContent className="p-5 space-y-2">
              <p className="text-base font-semibold">{inv.customer}</p>
              <p className="text-sm text-muted-foreground">
                {inv.invoiceId}
              </p>
              <p className="text-sm">{inv.phone}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
