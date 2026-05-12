import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ← Import useAuth dari context

// ✅ Hapus interface props, karena kita ambil semua dari AuthContext
const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth(); // ← Ambil logout function dari AuthContext

  const navItems = [
    { path: "/", label: "Dashboard", icon: "fa-chart-line" },
    { path: "/masuk", label: "Surat Masuk", icon: "fa-inbox" },
    { path: "/keluar", label: "Surat Keluar", icon: "fa-paper-plane" },
    { path: "/reimburse", label: "Reimbursement", icon: "fa-money-bill-wave" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white p-4 flex flex-col shadow-lg z-10">
      {/* Logo/Header */}
      <div className="text-xl font-bold mb-8 flex items-center gap-2">
        <i className="fa-solid fa-briefcase text-blue-400"></i> AdminKantor
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={`w-full text-left px-4 py-2 rounded hover:bg-slate-700 transition flex items-center gap-2 ${location.pathname === item.path ? "bg-slate-800 font-bold" : ""}`}>
            <i className={`fa-solid ${item.icon} w-6`}></i>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer Actions: Reset (optional) + Logout */}
      <div className="mt-auto pt-4 border-t border-slate-700 space-y-2">
        {/* Optional: Reset Demo Button (bisa dihapus kalau tidak dipakai) */}
        <button
          onClick={() => {
            if (window.confirm("Reset semua data demo?")) {
              // Logic reset data (opsional)
              window.location.reload();
            }
          }}
          className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-rotate-left"></i> Reset Demo
        </button>

        {/* Logout Button - Menggunakan logout dari AuthContext */}
        <button
          onClick={logout} // ← ← ← FIX: Pakai logout dari useAuth()
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
