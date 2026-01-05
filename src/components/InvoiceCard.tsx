import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CancelInvoiceDialog from "./CancelInvoiceDialog";
import { useState } from "react";
import type { INVOICE } from "@/types/invoicsTypes";

interface Props {
  invoice: INVOICE;
  onRefresh: () => void;
}

export default function InvoiceCard({ invoice, onRefresh }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="shadow-md hover:shadow-xl transition">
        <CardHeader>
          <h2 className="font-semibold text-lg">{invoice.customer.name}</h2>
          <p className="text-sm text-muted-foreground">
            {invoice.customer.phone}
          </p>
        </CardHeader>

        <CardContent className="space-y-2">
          <p>Total: ₹{invoice.totalAmount}</p>
          <p>Paid: ₹{invoice.advance}</p>
          <p>Remaining: ₹{invoice.remainingAmount}</p>

          <Button
            variant="destructive"
            className="w-full mt-4"
            onClick={() => setOpen(true)}
          >
            Cancel Invoice
          </Button>
        </CardContent>
      </Card>

      <CancelInvoiceDialog
        open={open}
        setOpen={setOpen}
        invoice={invoice}
        onRefresh={onRefresh}
      />
    </>
  );
}
