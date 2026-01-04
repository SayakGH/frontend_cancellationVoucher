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

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  invoice: INVOICE;
}

export default function CancelInvoiceDialog({
  open,
  setOpen,
  invoice,
}: Props) {
  const [cancellationCharge, setCancellationCharge] = useState<number>(0);
  const [netReturn, setNetReturn] = useState<number>(0);
  const [refund, setRefund] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

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

  const handleCancel = () => {
    setLoading(true);

    console.log("CANCEL INVOICE (UI ONLY)", {
      invoiceId: invoice._id,
      advance: invoice.advance,
      cancellationCharge,
      netReturn,
      refund,
      remaining,
    });

    setLoading(false);
    setOpen(false);        // close cancel dialog
    setSuccessOpen(true);  // open success popup
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
              <label className="text-sm font-medium">
                Cancellation Charge
              </label>
              <Input
                type="number"
                value={cancellationCharge}
                onChange={(e) =>
                  setCancellationCharge(Number(e.target.value))
                }
                placeholder="Enter cancellation charge"
              />
            </div>

            {/* Net Return */}
            <div>
              <label className="text-sm font-medium">
                Net Return (Auto)
              </label>
              <Input
                value={netReturn}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </div>

            {/* Refund */}
            <div>
              <label className="text-sm font-medium">
                Refund Amount
              </label>
              <Input
                type="number"
                value={refund}
                onChange={(e) => setRefund(Number(e.target.value))}
                placeholder="Amount being refunded now"
              />
            </div>

            {/* Remaining */}
            <div>
              <label className="text-sm font-medium">
                Remaining (Auto)
              </label>
              <Input
                value={remaining}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </div>

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

          <Button
            className="w-full"
            onClick={() => setSuccessOpen(false)}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
