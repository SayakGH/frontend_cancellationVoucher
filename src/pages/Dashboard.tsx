// src/pages/Dashboard.tsx
import { useGlobal } from "@/context/GlobalContext";
import Analytics from "./Analytics";
import Invoices from "./Cancellations";
import Manage from "./Manage";
import AddInvoice from "./AddCancellations";
import CancelRecords from "./CancelRecords";
import Payments from "./payments"; // 👈 NEW IMPORT

export default function Dashboard() {
  const { page } = useGlobal();
  const role = localStorage.getItem("role");

  return (
    <div className="p-4">
      {page === "analytics" && role === "admin" && <Analytics />}
      {page === "invoices" && role === "admin" && <Invoices />}
      {page === "manage" && role === "admin" && <Manage />}
      {page === "cancelrecords" && role === "admin" && <CancelRecords />}
      {page === "payments" && role === "admin" && <Payments />} {/* 👈 NEW */}
      {page === "addinvoices" && <AddInvoice />}
    </div>
  );
}
