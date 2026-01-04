import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InvoiceCard from "@/components/InvoiceCard";
import type { INVOICE } from "@/types/invoicsTypes";
import { getAllInvoice } from "@/api/invoice";

export default function AddInvoice() {
  const [phone, setPhone] = useState(""); // 👈 must be string
  const [invoices, setInvoices] = useState<INVOICE[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInvoices = async () => {
    if (!phone || phone.length < 10) {
      setError("Enter a valid phone number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const phoneNumber = Number(phone);
      const res = await getAllInvoice(phoneNumber);
      setInvoices(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Invoice Search</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} // only numbers
          maxLength={10}
        />

        <Button onClick={fetchInvoices} disabled={loading || phone.length < 10}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {!loading && invoices.length === 0 && phone.length === 10 && (
        <p className="text-muted-foreground">No invoices found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {invoices.map((invoice) => (
          <InvoiceCard key={invoice._id} invoice={invoice} />
        ))}
      </div>
    </div>
  );
}
