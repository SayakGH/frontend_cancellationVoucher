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
import { Button } from "@/components/ui/button";
import { Download, Pencil, Search, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import type {
  CANCELLATION,
  IGetLatestCancellationResponse,
} from "@/types/cancellationTypes";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getLatestCancellations,
  getCancellationHistory,
  deleteVoucher,
  updateVoucher,
} from "@/api/cancellation";
import { Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, History } from "lucide-react";

/* ================= UTILS ================= */
const getDate = (iso: string) => iso.split("T")[0];
const getTime = (iso: string) => iso.split("T")[1].slice(0, 5);

/* ================= COMPONENT ================= */
export default function Invoices() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [vouchers, setVouchers] = useState<CANCELLATION[]>([]);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyCancellations, setHistoryCancellations] = useState<
    CANCELLATION[]
  >([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  /* ===== Edit Payment ===== */
  const [open, setOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<CANCELLATION | null>(
    null,
  );
  const [payment, setPayment] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<
    "Bank Transfer" | "Cheque" | "UPI" | "Cash" | "Demand Draft" | "Others"
  >("Bank Transfer");
  const [chequeNumber, setChequeNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [loading, setLoading] = useState(false);

  const [chequeError, setChequeError] = useState("");
  const [bankError, setBankError] = useState("");

  /* ===== Delete ===== */
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  /* ================= FETCH ================= */
  const fetchVouchers = async () => {
    const data: IGetLatestCancellationResponse = await getLatestCancellations();
    setVouchers(data.data);
  };
  const fetchHistory = async (id: string) => {
    const data: IGetLatestCancellationResponse =
      await getCancellationHistory(id);
    setHistoryCancellations(data.data);
  };
  useEffect(() => {
    fetchVouchers();
  }, []);
  const clearSearch = () => {
    setSearch("");
  };

  /* ================= FILTER ================= */
  const filteredInvoices = vouchers.filter(
    (inv) =>
      inv._id.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.phone.includes(search) ||
      inv.company.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ================= HANDLERS ================= */

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Cancellation ID copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleEditClick = (cancellation: CANCELLATION) => {
    setSelectedInvoice(cancellation);
    setPayment(null);
    setPaymentMode("Bank Transfer");
    setChequeNumber("");
    setBankName("");
    setOpen(true);
  };

  const handleHistoryClick = async (cancellation: CANCELLATION) => {
    try {
      setHistoryLoading(true);
      setHistoryOpen(true);

      await fetchHistory(cancellation.inv_id);
    } catch (err) {
      toast.error("Failed to load invoice history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedInvoice || payment === null) {
      toast.error("Please enter payment amount");
      return;
    }

    // if (payment <= 0 || payment > selectedInvoice.remainingAmount) {
    //   toast.error("Invalid payment amount");
    //   return;
    // }

    // CHEQUE VALIDATION
    if (paymentMode === "Cheque") {
      if (chequeNumber.length !== 6) {
        toast.error("Cheque number must be 6 digits");
        return;
      }

      if (!bankName.trim()) {
        toast.error("Bank name is required");
        return;
      }
    }

    try {
      setLoading(true);

      const summary = {
        mode: paymentMode,
        chequeNumber: paymentMode === "Cheque" ? chequeNumber : undefined,
        bankName: paymentMode === "Cheque" ? bankName : undefined,
      };

      await updateVoucher(selectedInvoice.inv_id, payment, summary);

      toast.success("Payment added successfully");
      setOpen(false);
      fetchVouchers();
    } catch (err: any) {
      toast.error(err?.message || "Payment update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return;

    try {
      await deleteVoucher(invoiceToDelete);
      toast.success("Voucher deleted successfully");

      setVouchers((prev) => prev.filter((inv) => inv._id !== invoiceToDelete));
      await fetchVouchers();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleteOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const CancellationActionMenu = ({ can }: { can: CANCELLATION }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[170px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={() => handleHistoryClick(can)}>
          <History className="mr-2 h-4 w-4" />
          History
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            navigate(`/voucher/${can._id}`, {
              state: { cancellation: can },
            })
          }
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleEditClick(can)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Payment
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
          onClick={() => {
            setInvoiceToDelete(can.inv_id);
            setDeleteOpen(true);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* SEARCH */}
      <div className="flex gap-3 items-center">
        <Input
          placeholder="Search invoice / customer / phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <Button
            variant="outline"
            onClick={clearSearch}
            className="text-sm px-3"
          >
            Clear
          </Button>
        )}

        <Button>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block rounded-xl border bg-white p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cancellation</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredInvoices.map((can) => (
              <TableRow key={can._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{can._id}</span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(can._id)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>

                <TableCell>{can.inv_id}</TableCell>
                <TableCell>{can.customer.name}</TableCell>
                <TableCell>{can.customer.phone}</TableCell>
                <TableCell>₹{can.advance - can.cancellation_charge}</TableCell>
                <TableCell>₹{can.already_returned}</TableCell>
                <TableCell>₹{can.yetTB_returned}</TableCell>
                <TableCell>{getDate(can.createdAt)}</TableCell>
                <TableCell>{getTime(can.createdAt)}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  {/* <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleHistoryClick(can)}
                  >
                    History
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(`/voucher/${can._id}`, {
                        state: { cancellation: can },
                      })
                    }
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  <Button size="sm" onClick={() => handleEditClick(can)}>
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setInvoiceToDelete(can.inv_id);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button> */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(`/voucher/${can._id}`, {
                        state: { cancellation: can },
                      })
                    }
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <CancellationActionMenu can={can} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-3 md:hidden">
        {filteredInvoices.map((can) => (
          <div key={can._id} className="rounded-lg border bg-white shadow-sm">
            {/* ===== Header ===== */}
            <div className="flex items-start justify-between px-3 py-2 border-b bg-muted/20">
              <div className="space-y-0.5">
                <p className="font-medium text-sm leading-tight">
                  {can.customer.name}
                </p>

                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {can._id}
                  </p>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4"
                    onClick={() => copyToClipboard(can._id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  {can.customer.phone}
                </p>
              </div>

              {/* Action Menu */}
              <CancellationActionMenu can={can} />
            </div>

            {/* ===== Body ===== */}
            <div className="px-3 py-2 space-y-2">
              {/* Due row */}
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
                  Due
                </span>

                <span
                  className={`font-semibold text-sm ${
                    can.yetTB_returned === 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{can.yetTB_returned}
                </span>
              </div>

              {/* Compact details */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <span className="text-muted-foreground">Total</span>
                <span>₹{can.advance - can.cancellation_charge}</span>

                <span className="text-muted-foreground">Paid</span>
                <span className="text-green-700">₹{can.already_returned}</span>

                <span className="text-muted-foreground">Date</span>
                <span>
                  {getDate(can.createdAt)} {getTime(can.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DELETE CONFIRMATION ================= */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The invoice and all related payments
              will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ================= EDIT PAYMENT MODAL ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Label>Amount</Label>
            <Input
              type="number"
              value={payment ?? ""}
              onChange={(e) =>
                setPayment(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Mode</Label>
            <select
              className="w-full border rounded-md h-10 px-3"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as any)}
            >
              <option>Bank Transfer</option>
              <option>Cheque</option>
              <option>UPI</option>
              <option>Cash</option>
              <option>Demand Draft</option>
              <option>Others</option>
            </select>
          </div>

          {paymentMode === "Cheque" && (
            <>
              {/* CHEQUE NUMBER */}
              <Input
                placeholder="Enter 6 digit cheque number"
                value={chequeNumber}
                maxLength={6}
                onChange={(e) => {
                  const value = e.target.value;

                  // Only digits allowed
                  if (!/^\d*$/.test(value)) return;

                  setChequeNumber(value);

                  if (value.length != 6) {
                    setChequeError("Cheque number must be 6 digits");
                  } else {
                    setChequeError("");
                  }
                }}
                className={chequeError ? "border-red-500" : ""}
              />

              {/* BANK NAME */}
              <Input
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => {
                  setBankName(e.target.value);

                  if (!e.target.value.trim()) {
                    setBankError("Bank name is required");
                  } else {
                    setBankError("");
                  }
                }}
                className={bankError ? "border-red-500" : ""}
              />
            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Saving..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[95vw] md:max-w-[900px] lg:max-w-[1000px] xl:max-w-[1200px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Invoice History</DialogTitle>
          </DialogHeader>

          {historyLoading ? (
            <p>Loading history...</p>
          ) : historyCancellations.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No previous versions found.
            </p>
          ) : (
            <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cancellation</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Download</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {historyCancellations.map((can) => (
                    <TableRow key={can._id}>
                      <TableCell className="font-medium">{can._id}</TableCell>
                      <TableCell>{can.inv_id}</TableCell>

                      <TableCell>
                        ₹{can.advance - can.cancellation_charge}
                      </TableCell>

                      <TableCell className="text-green-700">
                        ₹{can.already_returned}
                      </TableCell>

                      <TableCell className="text-red-600 font-semibold">
                        ₹{can.yetTB_returned}
                      </TableCell>

                      <TableCell>{getDate(can.createdAt)}</TableCell>

                      <TableCell>{getTime(can.createdAt)}</TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          // onClick={() =>
                          //   navigate(`/invoice/${inv._id}`, {
                          //     state: { invoice: inv },
                          //   })
                          // }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
