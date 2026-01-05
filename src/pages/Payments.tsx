import { useEffect, useState } from "react";
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
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import type { IGetPaymentResponse, IPAYMENT } from "@/types/paymentType";
import { getAllPayments } from "@/api/payment";

/* ================= UTILS ================= */

const getDate = (iso: string) => iso.split("T")[0];
const getTime = (iso: string) => iso.split("T")[1].slice(0, 5);

/* ================= COMPONENT ================= */

export default function Payments() {
  const [payments, setPayments] = useState<IPAYMENT[]>([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  /* ================= FETCH PAYMENTS ================= */
  useEffect(() => {
    const fetchPayments = async () => {
      const data: IGetPaymentResponse = await getAllPayments();
      setPayments(data.data);
    };

    fetchPayments();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredPayments = payments.filter(
    (p) =>
      p.cancellation_id?.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.phone.toLowerCase().includes(search.toLowerCase()) ||
      p.payment.mode.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* ================= SEARCH ================= */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search payment / invoice / customer / mode"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block rounded-2xl border bg-white p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[320px]">Payment ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Cancellation ID</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPayments.map((p) => (
              <>
                <TableRow
                  key={p._id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() =>
                    p.payment.mode === "Cheque" && toggleExpand(p._id)
                  }
                >
                  <TableCell className="font-medium break-all -mr-16">
                    {p._id}
                  </TableCell>

                  <TableCell>{p.customer.name}</TableCell>

                  <TableCell>{p.cancellation_id}</TableCell>

                  <TableCell className="flex items-center gap-2">
                    {p.payment.mode}
                    {p.payment.mode === "Cheque" &&
                      (expanded === p._id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </TableCell>

                  <TableCell className="font-semibold text-green-600">
                    ₹{p.amount.toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell>{getDate(p.createdAt)}</TableCell>
                  <TableCell>{getTime(p.createdAt)}</TableCell>
                </TableRow>

                {/* ================= CHEQUE DETAILS ================= */}
                {expanded === p._id && p.payment.mode === "Cheque" && (
                  <TableRow className="bg-muted/40">
                    <TableCell colSpan={7} className="text-sm">
                      <span className="font-medium">Bank:</span>{" "}
                      {p.payment.bankName || "-"}
                      <span className="mx-2">|</span>
                      <span className="font-medium">Cheque No:</span>{" "}
                      {p.payment.chequeNumber || "-"}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>

        {filteredPayments.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-6">
            No payments found
          </p>
        )}
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-4 md:hidden">
        {filteredPayments.map((p) => (
          <Card key={p._id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{p.customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.cancellation_id}
                  </p>
                </div>
                <p className="font-bold text-green-600">
                  ₹{p.amount.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <p className="text-muted-foreground">Mode</p>
                <p
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() =>
                    p.payment.mode === "Cheque" && toggleExpand(p._id)
                  }
                >
                  {p.payment.mode}
                  {p.payment.mode === "Cheque" &&
                    (expanded === p._id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </p>

                <p className="text-muted-foreground">Date</p>
                <p>{getDate(p.createdAt)}</p>

                <p className="text-muted-foreground">Time</p>
                <p>{getTime(p.createdAt)}</p>
              </div>

              {expanded === p._id && p.payment.mode === "Cheque" && (
                <div className="text-sm bg-muted/40 rounded-md p-2">
                  <p>
                    <span className="font-medium">Bank:</span>{" "}
                    {p.payment.bankName || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Cheque No:</span>{" "}
                    {p.payment.chequeNumber || "-"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
