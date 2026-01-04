import { useState } from "react";
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
  cancellationId: string;
  invoiceId: string;
  netReturn: number;
  alreadyRefunded: number;
}

export default function RefundDialog({
  open,
  setOpen,
  cancellationId,
  invoiceId,
  netReturn,
  alreadyRefunded,
}: Props) {
  const [addAmount, setAddAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const remaining = netReturn - alreadyRefunded - addAmount;
  const safeRemaining = remaining > 0 ? remaining : 0;

  const handleRefund = () => {
    setLoading(true);

    console.log("REFUND (UI ONLY)", {
      cancellationId,
      invoiceId,
      netReturn,
      alreadyRefunded,
      addAmount,
      remaining: safeRemaining,
    });

    setLoading(false);
    setOpen(false);          // close refund dialog
    setSuccessOpen(true);    // open success popup
  };

  return (
    <>
      {/* ================= REFUND DIALOG ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Amount</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* IDs */}
            <div className="text-sm space-y-1">
              <p>
                Cancellation ID: <b>{cancellationId}</b>
              </p>
              <p>
                Invoice ID: <b>{invoiceId}</b>
              </p>
            </div>

            {/* Net Return */}
            <div>
              <label className="text-sm font-medium">Net Return</label>
              <Input
                value={netReturn}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </div>

            {/* Already Refunded */}
            <div>
              <label className="text-sm font-medium">Already Refunded</label>
              <Input
                value={alreadyRefunded}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </div>

            {/* Add Amount */}
            <div>
              <label className="text-sm font-medium">Add Amount</label>
              <Input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(Number(e.target.value))}
                placeholder="Enter refund amount"
              />
            </div>

            {/* Remaining */}
            <div>
              <label className="text-sm font-medium">Remaining (Auto)</label>
              <Input
                value={safeRemaining}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </div>

            <Button
              className="w-full"
              disabled={loading}
              onClick={handleRefund}
            >
              {loading ? "Processing..." : "Confirm Refund"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= SUCCESS POPUP ================= */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="text-center space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600" />

          <DialogHeader>
            <DialogTitle>Refund Successful</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            The refund of <b>₹{addAmount}</b> has been recorded successfully.
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
