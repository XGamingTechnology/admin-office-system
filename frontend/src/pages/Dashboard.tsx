// src/pages/Dashboard.tsx
import React from "react";
import { Surat, Reimbursement as ReimbursementType } from "../types";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  data: {
    masuk: Surat[];
    keluar: Surat[];
    reimburse: ReimbursementType[];
    logs: string[];
  };
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate statistics
  const stats = {
    masuk: data.masuk.length,
    keluar: data.keluar.length,
    reimburse: data.reimburse.length,
    reimburseTotal: data.reimburse.reduce((sum, r) => sum + (r.jumlah || 0), 0),
    // ✅ BENAR: Gunakan status values yang sesuai frontend type
    pendingReimburse: data.reimburse.filter((r) => r.status === "Draft").length,
  };

  // Format rupiah helper
  const fmtRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Admin Control Card - Only for Admin */}
      {user?.role === "admin" && (
        <div
          onClick={() => navigate("/admin")}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg shadow-lg border border-purple-200 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition">
                <i className="fa-solid fa-shield-halved text-white text-2xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Admin Control Panel</h3>
                <p className="text-purple-100 text-sm">Manage users, roles & permissions</p>
              </div>
            </div>
            <div className="text-white/80 group-hover:text-white transition">
              <i className="fa-solid fa-arrow-right text-xl"></i>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Surat Masuk */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-600 text-sm">Surat Masuk</h3>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.masuk}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <i className="fa-solid fa-inbox text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        {/* Surat Keluar */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-600 text-sm">Surat Keluar</h3>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.keluar}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <i className="fa-solid fa-paper-plane text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        {/* Reimbursement Count */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-600 text-sm">Total Reimburse</h3>
              <p className="text-3xl font-bold text-purple-600 mt-1">{stats.reimburse}</p>
              {stats.pendingReimburse > 0 && <p className="text-xs text-orange-600 mt-1">{stats.pendingReimburse} pending</p>}
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <i className="fa-solid fa-receipt text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        {/* Reimbursement Total Amount */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-600 text-sm">Total Nominal</h3>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{fmtRupiah(stats.reimburseTotal)}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <i className="fa-solid fa-wallet text-emerald-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reimbursements */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Reimbursement Terbaru</h3>
            <button onClick={() => navigate("/reimburse")} className="text-sm text-blue-600 hover:text-blue-800 transition">
              Lihat Semua <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>
          {data.reimburse.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Belum ada data reimbursement</p>
          ) : (
            <div className="space-y-3">
              {data.reimburse.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{r.keterangan || "Tanpa keterangan"}</p>
                    <p className="text-xs text-gray-500">
                      {r.kategori} • {r.tanggal}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 text-sm">{fmtRupiah(r.jumlah)}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        r.status === "Disetujui" || r.status === "Dibayar" ? "bg-green-100 text-green-700" : r.status === "Ditolak" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700" // Draft atau status lain
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Letters */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Surat Terbaru</h3>
            <div className="flex gap-2">
              <button onClick={() => navigate("/masuk")} className="text-sm text-blue-600 hover:text-blue-800 transition">
                Masuk <i className="fa-solid fa-arrow-right ml-1"></i>
              </button>
              <span className="text-gray-300">|</span>
              <button onClick={() => navigate("/keluar")} className="text-sm text-blue-600 hover:text-blue-800 transition">
                Keluar <i className="fa-solid fa-arrow-right ml-1"></i>
              </button>
            </div>
          </div>
          {data.masuk.length === 0 && data.keluar.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Belum ada data surat</p>
          ) : (
            <div className="space-y-3">
              {[...data.masuk.slice(0, 3), ...data.keluar.slice(0, 2)]
                .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
                .slice(0, 5)
                .map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{s.perihal || "Tanpa perihal"}</p>
                      <p className="text-xs text-gray-500">
                        {s.pihak} • {s.tanggal}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${"bg-blue-100 text-blue-700"}`}>{s.status}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
