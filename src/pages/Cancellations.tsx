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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Pencil, Search } from "lucide-react";
import RefundDialog from "@/components/RefundDialog";

export default function Invoices() {
  const [search, setSearch] = useState("");

  /* 🔽 Refund dialog state */
  const [openRefund, setOpenRefund] = useState(false);
  const [selectedCancellation, setSelectedCancellation] =
    useState<null | {
      cancellationId: string;
      invoiceId: string;
      netReturn: number;
      alreadyRefunded: number;
    }>(null);

  /* ================= DUMMY DATA ================= */

  const cancellations = [
    {
      cancellationId: "CAN-001",
      invoiceId: "INV-1001",
      customer: "Rahul Gupta",
      phone: "9876543210",
      advance: 500000,
      cancellationCharge: 50000,
      netReturn: 450000,
      alreadyRefunded: 200000,
      remaining: 250000,
    },
    {
      cancellationId: "CAN-002",
      invoiceId: "INV-1002",
      customer: "Ananya Roy",
      phone: "9123456780",
      advance: 300000,
      cancellationCharge: 30000,
      netReturn: 270000,
      alreadyRefunded: 100000,
      remaining: 170000,
    },
    {
      cancellationId: "CAN-003",
      invoiceId: "INV-1003",
      customer: "Snehendu Mitra",
      phone: "7797722510",
      advance: 800000,
      cancellationCharge: 100000,
      netReturn: 700000,
      alreadyRefunded: 400000,
      remaining: 300000,
    },
    {
      cancellationId: "CAN-004",
      invoiceId: "INV-1004",
      customer: "Sudipta Nath",
      phone: "9874734626",
      advance: 250000,
      cancellationCharge: 20000,
      netReturn: 230000,
      alreadyRefunded: 150000,
      remaining: 80000,
    },
    {
      cancellationId: "CAN-005",
      invoiceId: "INV-1005",
      customer: "Rik Ganguly",
      phone: "8777061485",
      advance: 600000,
      cancellationCharge: 60000,
      netReturn: 540000,
      alreadyRefunded: 300000,
      remaining: 240000,
    },
  ];

  const filteredCancellations = cancellations.filter(
    (c) =>
      c.cancellationId.toLowerCase().includes(search.toLowerCase()) ||
      c.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
      c.customer.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="sticky top-0 z-20 bg-gray-100 pt-2 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Search cancellation / invoice / customer / phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-sm"
          />
          <Button className="flex gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl border bg-white p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cancellation ID</TableHead>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Advance</TableHead>
              <TableHead>Cancellation Charge</TableHead>
              <TableHead>Net Return</TableHead>
              <TableHead>Already Refunded</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCancellations.map((c) => (
              <TableRow key={c.cancellationId}>
                <TableCell className="font-medium">
                  {c.cancellationId}
                </TableCell>
                <TableCell>{c.invoiceId}</TableCell>
                <TableCell>{c.customer}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>₹{c.advance}</TableCell>
                <TableCell>₹{c.cancellationCharge}</TableCell>
                <TableCell>₹{c.netReturn}</TableCell>
                <TableCell>₹{c.alreadyRefunded}</TableCell>
                <TableCell className="font-semibold text-red-600">
                  ₹{c.remaining}
                </TableCell>
                <TableCell className="flex justify-end gap-3">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>

                  {/* 🔥 OPEN REFUND DIALOG */}
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedCancellation({
                        cancellationId: c.cancellationId,
                        invoiceId: c.invoiceId,
                        netReturn: c.netReturn,
                        alreadyRefunded: c.alreadyRefunded,
                      });
                      setOpenRefund(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="space-y-5 md:hidden">
        {filteredCancellations.map((c) => (
          <Card key={c.cancellationId} className="rounded-xl shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{c.customer}</p>
                  <p className="text-xs text-muted-foreground">{c.phone}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.cancellationId} • {c.invoiceId}
                  </p>
                </div>
                <span className="text-red-600 font-semibold">
                  ₹{c.remaining}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <p className="text-muted-foreground">Advance</p>
                <p>₹{c.advance}</p>

                <p className="text-muted-foreground">Cancellation</p>
                <p>₹{c.cancellationCharge}</p>

                <p className="text-muted-foreground">Net Return</p>
                <p>₹{c.netReturn}</p>

                <p className="text-muted-foreground">Already Refunded</p>
                <p>₹{c.alreadyRefunded}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-10 gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>

                {/* 🔥 OPEN REFUND DIALOG (MOBILE) */}
                <Button
                  size="sm"
                  className="flex-1 h-10 gap-2"
                  onClick={() => {
                    setSelectedCancellation({
                      cancellationId: c.cancellationId,
                      invoiceId: c.invoiceId,
                      netReturn: c.netReturn,
                      alreadyRefunded: c.alreadyRefunded,
                    });
                    setOpenRefund(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🔽 REFUND DIALOG */}
      {selectedCancellation && (
        <RefundDialog
          open={openRefund}
          setOpen={setOpenRefund}
          cancellationId={selectedCancellation.cancellationId}
          invoiceId={selectedCancellation.invoiceId}
          netReturn={selectedCancellation.netReturn}
          alreadyRefunded={selectedCancellation.alreadyRefunded}
        />
      )}
    </div>
  );
}
