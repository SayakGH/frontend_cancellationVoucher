import { useState, useEffect } from "react";
import type { INVOICE } from "@/types/invoicsTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { createCancellationFromInvoice } from "@/api/cancellation";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  invoice: INVOICE;
  onRefresh: () => void; // 🔥 new
}

export default function CancelInvoiceDialog({
  open,
  setOpen,
  invoice,
  onRefresh,
}: Props) {
  const [cancellationCharge, setCancellationCharge] = useState<number>(0);
  const [netReturn, setNetReturn] = useState<number>(0);
  const [refund, setRefund] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<
    "Cash" | "UPI" | "Bank Transfer" | "Cheque" | "Others" | "Demand Draft"
  >("Cash");

  const [bankName, setBankName] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");

  /* ================= AUTO CALCULATION ================= */

  useEffect(() => {
    const calculatedNetReturn = invoice.advance - cancellationCharge;
    const safeNetReturn = calculatedNetReturn > 0 ? calculatedNetReturn : 0;

    const calculatedRemaining = safeNetReturn - refund;
    const safeRemaining = calculatedRemaining > 0 ? calculatedRemaining : 0;

    setNetReturn(safeNetReturn);
    setRemaining(safeRemaining);
  }, [cancellationCharge, refund, invoice.advance]);

  /* ================= SUBMIT (UI ONLY) ================= */

  const handleCancel = async () => {
    try {
      if (paymentMode === "Cheque") {
        if (!bankName.trim() || !chequeNumber.trim()) {
          toast.error(
            "Bank name and cheque number are required for cheque payments"
          );
          return;
        }
      }

      setLoading(true);

      const payload = {
        cancellation_charge: cancellationCharge,
        net_return: netReturn,
        already_returned: refund,
        yetTB_returned: remaining,
        payment: {
          mode: paymentMode,
          bankName: paymentMode === "Cheque" ? bankName : null,
          chequeNumber: paymentMode === "Cheque" ? chequeNumber : null,
        },
      };

      const res = await createCancellationFromInvoice(invoice._id, payload);

      if (!res.success) {
        throw new Error(res.message || "Cancellation failed");
      }

      setOpen(false);
      setSuccessOpen(true);

      onRefresh(); // 🔥 Reload invoices
    } catch (err: any) {
      console.error("Cancel Invoice Error:", err);
      toast.error(err.message || "Failed to cancel invoice");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <>
      {/* ================= CANCEL INVOICE DIALOG ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Invoice</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm">
              Invoice ID: <b>{invoice._id}</b>
            </p>

            {/* Advance */}
            <div>
              <label className="text-sm font-medium">Advance Paid</label>
              <Input
                value={invoice.advance}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </div>

            {/* Cancellation Charge */}
            <div>
              <label className="text-sm font-medium">Cancellation Charge</label>
              <Input
                type="number"
                value={cancellationCharge}
                onChange={(e) => setCancellationCharge(Number(e.target.value))}
                placeholder="Enter cancellation charge"
              />
            </div>

            {/* Net Return */}
            <div>
              <label className="text-sm font-medium">Net Return (Auto)</label>
              <Input
                value={netReturn}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </div>

            {/* Refund */}
            <div>
              <label className="text-sm font-medium">Refund Amount</label>
              <Input
                type="number"
                value={refund}
                onChange={(e) => setRefund(Number(e.target.value))}
                placeholder="Amount being refunded now"
              />
            </div>

            {/* Remaining */}
            <div>
              <label className="text-sm font-medium">Remaining (Auto)</label>
              <Input
                value={remaining}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </div>
            {/* Payment Mode */}
            <div>
              <label className="text-sm font-medium">Refund Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full border rounded-md p-2 mt-1"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Demand Draft">Demand Draft</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Bank + Cheque (only if cheque) */}
            {paymentMode === "Cheque" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Bank Name</label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter bank name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Cheque Number</label>
                  <Input
                    value={chequeNumber}
                    onChange={(e) => setChequeNumber(e.target.value)}
                    placeholder="Enter cheque number"
                  />
                </div>
              </div>
            )}

            <Button
              variant="destructive"
              className="w-full"
              disabled={loading}
              onClick={handleCancel}
            >
              {loading ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= SUCCESS POPUP ================= */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="text-center space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600" />

          <DialogHeader>
            <DialogTitle>Cancellation Successful</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            New cancellation cheque has been created successfully.
          </p>

          <Button className="w-full" onClick={() => setSuccessOpen(false)}>
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
