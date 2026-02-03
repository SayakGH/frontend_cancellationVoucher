// src/components/Sidebar.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/context/GlobalContext";
import {
  BarChart,
  FilePlus,
  FileText,
  Users,
  CreditCard,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const { setPage } = useGlobal();
  const role = localStorage.getItem("role");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-64"
      } hidden md:flex flex-col h-full bg-gray-900 text-white p-4 transition-all duration-300`}
    >
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
        )}

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* ===== Menu ===== */}
      <div className="space-y-1">
        {role === "admin" && (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800 focus:bg-gray-800"
            onClick={() => setPage("analytics")}
          >
            <BarChart size={20} />
            {!collapsed && "Analytics"}
          </Button>
        )}

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800 focus:bg-gray-800"
          onClick={() => setPage("addVoucher")}
        >
          <FilePlus size={20} />
          {!collapsed && "Add Cancellations"}
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800 focus:bg-gray-800"
          onClick={() => setPage("voucher")}
        >
          <FileText size={20} />
          {!collapsed && "Manage Cancellations"}
        </Button>

        {role === "admin" && (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800 focus:bg-gray-800"
            onClick={() => setPage("payments")}
          >
            <CreditCard size={20} />
            {!collapsed && "Payments"}
          </Button>
        )}

        {role === "admin" && (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800 focus:bg-gray-800"
            onClick={() => setPage("manage")}
          >
            <Users size={20} />
            {!collapsed && "Manage Users"}
          </Button>
        )}

        {role === "user" && (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800 focus:bg-gray-800"
            onClick={() => setPage("userinvoice")}
          >
            <Receipt size={20} />
            {!collapsed && "User Invoice"}
          </Button>
        )}
      </div>
    </div>
  );
}
