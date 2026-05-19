import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "fa-chart-line" },
    { path: "/masuk", label: "Surat Masuk", icon: "fa-inbox" },
    { path: "/keluar", label: "Surat Keluar", icon: "fa-paper-plane" },
    { path: "/reimburse", label: "Reimbursement", icon: "fa-money-bill-wave" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white p-4 flex flex-col shadow-lg z-10">
      <div className="text-xl font-bold mb-8 flex items-center gap-2">
        <i className="fa-solid fa-briefcase text-blue-400"></i> AdminKantor
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={`w-full text-left px-4 py-2 rounded hover:bg-slate-700 transition flex items-center gap-2 ${location.pathname === item.path ? "bg-slate-800 font-bold" : ""}`}>
            <i className={`fa-solid ${item.icon} w-6`}></i>
            {item.label}
          </Link>
        ))}
        {/* Admin Control - Only visible for admin users */}
        {user?.role === "admin" && (
          <Link to="/admin" className={`w-full text-left px-4 py-2 rounded hover:bg-slate-700 transition flex items-center gap-2 ${location.pathname === "/admin" ? "bg-slate-800 font-bold" : ""}`}>
            <i className="fa-solid fa-users-gear w-6"></i>
            Admin Control
          </Link>
        )}
      </nav>
      <div className="mt-auto pt-4 border-t border-slate-700 space-y-2">
        <button onClick={() => window.confirm("Reset semua data demo?") && window.location.reload()} className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition flex items-center justify-center gap-2">
          <i className="fa-solid fa-rotate-left"></i> Reset Demo
        </button>
        <button onClick={logout} className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition flex items-center justify-center gap-2">
          <i className="fa-solid fa-right-from-bracket"></i> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
