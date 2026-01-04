// src/components/Sidebar.tsx
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/context/GlobalContext";

export default function Sidebar() {
  const { setPage } = useGlobal();
  const role = localStorage.getItem("role");

  return (
    <div className="hidden md:block w-64 h-full bg-gray-900 text-white p-4 space-y-4">
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>

      {role === "admin" && (
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300"
          onClick={() => setPage("analytics")}
        >
          Analytics
        </Button>
      )}

      <Button
        variant="ghost"
        className="w-full justify-start text-gray-300"
        onClick={() => setPage("addinvoices")}
      >
        Add Cancellations
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start text-gray-300"
        onClick={() => setPage("invoices")}
      >
        Manage Cancellations
      </Button>

      {/* Cancel Records */}
      {role === "admin" && (
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300"
          onClick={() => setPage("cancelrecords")}
        >
          Cancelled Invoices
        </Button>
      )}

      {/* ✅ NEW: Payments */}
      {role === "admin" && (
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300"
          onClick={() => setPage("payments")}
        >
          Payments
        </Button>
      )}

      {role === "admin" && (
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300"
          onClick={() => setPage("manage")}
        >
          Manage Users
        </Button>
      )}
    </div>
  );
}
