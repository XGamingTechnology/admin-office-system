// src/pages/Dashboard.tsx
import React from "react";
import { Surat, Reimbursement as ReimbursementType } from "../types";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ✅ FIX: Tambahkan userName di interface props
interface DashboardProps {
  data: {
    masuk: Surat[];
    keluar: Surat[];
    reimburse: ReimbursementType[];
    logs: string[];
  };
  userName?: string; // ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←......
}

const Dashboard: React.FC<DashboardProps> = ({ data, userName }) => {
  // ← ← ← Terima userName
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

  // Format date helper
  const fmtDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header dengan Welcome Message */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">
            Selamat datang, <span className="font-semibold text-blue-600">{userName || user?.name || "Admin"}</span>!<span className="hidden sm:inline"> Berikut ringkasan data hari ini.</span>
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm text-gray-600 font-medium">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          {user?.role && <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{user.role === "admin" ? "👑 Administrator" : "👤 User"}</span>}
        </div>
      </div>

      {/* Admin Control Card - Only for Admin */}
      {user?.role === "admin" && (
        <div
          onClick={() => navigate("/admin")}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 rounded-xl shadow-lg border border-purple-200 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.02] group"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Surat Masuk */}
        <div onClick={() => navigate("/masuk")} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wide">Surat Masuk</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2 group-hover:scale-105 transition-transform">{stats.masuk}</p>
              <p className="text-xs text-gray-400 mt-1">total dokumen</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition">
              <i className="fa-solid fa-inbox text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        {/* Surat Keluar */}
        <div onClick={() => navigate("/keluar")} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wide">Surat Keluar</h3>
              <p className="text-3xl font-bold text-green-600 mt-2 group-hover:scale-105 transition-transform">{stats.keluar}</p>
              <p className="text-xs text-gray-400 mt-1">total dokumen</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition">
              <i className="fa-solid fa-paper-plane text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        {/* Reimbursement Count */}
        <div onClick={() => navigate("/reimburse")} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wide">Reimburse</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2 group-hover:scale-105 transition-transform">{stats.reimburse}</p>
              {stats.pendingReimburse > 0 && <p className="text-xs text-orange-600 mt-1 font-medium">⚠️ {stats.pendingReimburse} pending</p>}
            </div>
            <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition">
              <i className="fa-solid fa-receipt text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        {/* Reimbursement Total Amount */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wide">Total Nominal</h3>
              <p className="text-2xl font-bold text-emerald-600 mt-2">{fmtRupiah(stats.reimburseTotal)}</p>
              <p className="text-xs text-gray-400 mt-1">klaim disetujui</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <i className="fa-solid fa-wallet text-emerald-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reimbursements */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <i className="fa-solid fa-receipt text-purple-500"></i>
              Reimbursement Terbaru
            </h3>
            <button onClick={() => navigate("/reimburse")} className="text-sm text-blue-600 hover:text-blue-800 transition flex items-center gap-1">
              Lihat Semua <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
          {data.reimburse.length === 0 ? (
            <div className="text-center py-8">
              <i className="fa-solid fa-receipt text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-400 text-sm">Belum ada data reimbursement</p>
              <button onClick={() => navigate("/reimburse")} className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                + Tambah reimbursement pertama
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {data.reimburse.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer" onClick={() => navigate("/reimburse")}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{r.keterangan || "Tanpa keterangan"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {r.kategori} • {fmtDate(r.tanggal)}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="font-bold text-emerald-600 text-sm whitespace-nowrap">{fmtRupiah(r.jumlah)}</p>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium ${
                        r.status === "Disetujui" || r.status === "Dibayar" ? "bg-green-100 text-green-700" : r.status === "Ditolak" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
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
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <i className="fa-solid fa-envelope text-blue-500"></i>
              Surat Terbaru
            </h3>
            <div className="flex gap-3 text-sm">
              <button onClick={() => navigate("/masuk")} className="text-blue-600 hover:text-blue-800 transition flex items-center gap-1">
                Masuk <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
              <button onClick={() => navigate("/keluar")} className="text-blue-600 hover:text-blue-800 transition flex items-center gap-1">
                Keluar <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
          </div>
          {data.masuk.length === 0 && data.keluar.length === 0 ? (
            <div className="text-center py-8">
              <i className="fa-solid fa-inbox text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-400 text-sm">Belum ada data surat</p>
              <button onClick={() => navigate("/masuk")} className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                + Tambah surat pertama
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {[...data.masuk.slice(0, 3), ...data.keluar.slice(0, 2)]
                .sort((a, b) => new Date(b.tanggal || "").getTime() - new Date(a.tanggal || "").getTime())
                .slice(0, 5)
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => s.id && navigate(s.pihak?.toLowerCase().includes("tujuan") ? "/keluar" : "/masuk")}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{s.perihal || "Tanpa perihal"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {s.pihak} • {fmtDate(s.tanggal)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === "Diterima" ? "bg-blue-100 text-blue-700" : s.status === "Dalam Proses" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-bolt text-yellow-500"></i>
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button onClick={() => navigate("/masuk")} className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition group">
            <i className="fa-solid fa-plus text-blue-600 text-xl group-hover:scale-110 transition"></i>
            <span className="text-sm font-medium text-gray-700">Surat Masuk</span>
          </button>
          <button onClick={() => navigate("/keluar")} className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition group">
            <i className="fa-solid fa-plus text-green-600 text-xl group-hover:scale-110 transition"></i>
            <span className="text-sm font-medium text-gray-700">Surat Keluar</span>
          </button>
          <button onClick={() => navigate("/reimburse")} className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition group">
            <i className="fa-solid fa-plus text-purple-600 text-xl group-hover:scale-110 transition"></i>
            <span className="text-sm font-medium text-gray-700">Reimburse</span>
          </button>
          {user?.role === "admin" && (
            <button onClick={() => navigate("/admin")} className="flex flex-col items-center gap-2 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition group">
              <i className="fa-solid fa-users text-indigo-600 text-xl group-hover:scale-110 transition"></i>
              <span className="text-sm font-medium text-gray-700">Manage User</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
