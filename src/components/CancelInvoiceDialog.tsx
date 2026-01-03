import { useState } from "react";
import type { INVOICE } from "@/types/invoicsTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  invoice: INVOICE;
}

export default function CancelInvoiceDialog({ open, setOpen, invoice }: Props) {
  const [refund, setRefund] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    await fetch(`http://localhost:5000/invoices/${invoice._id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refundAmount: Number(refund),
        reason,
      }),
    });

    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm">
            Invoice ID: <b>{invoice._id}</b>
          </p>

          <Input
            placeholder="Refund amount"
            type="number"
            value={refund}
            onChange={(e) => setRefund(e.target.value)}
          />

          <Textarea
            placeholder="Cancellation reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

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
  );
}
