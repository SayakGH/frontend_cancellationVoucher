// src/pages/Dashboard.tsx
import { useGlobal } from "@/context/GlobalContext";
import Analytics from "./Analytics";
import Invoices from "./Cancellations";
import Manage from "./Manage";
import AddInvoice from "./AddCancellations";

import Payments from "./Payments";

export default function Dashboard() {
  const { page } = useGlobal();
  const role = localStorage.getItem("role");

  return (
    <div className="p-4">
      {page === "analytics" && role === "admin" && <Analytics />}
      {page === "voucher" && role === "admin" && <Invoices />}
      {page === "manage" && role === "admin" && <Manage />}
      {page === "payments" && role === "admin" && <Payments />}
      {page === "addVoucher" && <AddInvoice />}
    </div>
  );
}
