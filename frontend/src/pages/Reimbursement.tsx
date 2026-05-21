// src/pages/Reimbursement.tsx
import React, { useState, useEffect } from "react";
import { Reimbursement as ReimbursementType } from "../types";
import { fmtRupiah, getStatusColor } from "../utils/helpers";
import { useAuth } from "../context/AuthContext"; // ← ← ← TAMBAHKAN IMPORT INI

interface ReimbursementProps {
  data: ReimbursementType[];
  onAdd: (r: Omit<ReimbursementType, "id" | "status"> & { file?: File }) => void;
  onUpdate: (r: ReimbursementType) => void;
  onDelete: (id: string) => void;
}

const Reimbursement: React.FC<ReimbursementProps> = ({ data, onAdd, onUpdate, onDelete }) => {
  // ✅ GET USER INFO dari AuthContext
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // 🐛 DEBUG: Log props (bisa dihapus nanti)
  useEffect(() => {
    console.log("🔍 [DEBUG Reimbursement] Props:", {
      count: data?.length,
      hasHandlers: !!(onAdd && onUpdate && onDelete),
      isAdmin,
      currentUser: user?.email,
    });
  }, [data, onAdd, onUpdate, onDelete, isAdmin, user]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReimbursementType | null>(null);
  const [viewingItem, setViewingItem] = useState<ReimbursementType | null>(null);

  const [formData, setFormData] = useState<{
    tanggal: string;
    kategori: ReimbursementType["kategori"];
    keterangan: string;
    jumlah: number;
    status: ReimbursementType["status"];
    file?: File | null;
  }>({
    tanggal: new Date().toISOString().split("T")[0],
    kategori: "Transport",
    keterangan: "",
    jumlah: 0,
    status: "Draft",
    file: null,
  });

  const filteredData = data.filter(
    (r) =>
      r.kategori?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.keterangan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // ✅ Tambahkan filter by pengaju jika admin
      (isAdmin && r.createdBy?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openModal = (item?: ReimbursementType) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        tanggal: item.tanggal || new Date().toISOString().split("T")[0],
        kategori: item.kategori,
        keterangan: item.keterangan || "",
        jumlah: item.jumlah || 0,
        status: item.status,
        file: null,
      });
    } else {
      setEditingItem(null);
      setFormData({
        tanggal: new Date().toISOString().split("T")[0],
        kategori: "Transport",
        keterangan: "",
        jumlah: 0,
        status: "Draft",
        file: null,
      });
    }
    setIsModalOpen(true);
  };

  const openDetailModal = (item: ReimbursementType) => {
    setViewingItem(item);
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setViewingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdate({ ...editingItem, ...formData });
    } else {
      const { status, ...formDataWithoutStatus } = formData;
      const payload = { ...formDataWithoutStatus, file: formData.file || undefined };
      onAdd(payload);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus reimbursement ini? Tindakan ini tidak dapat dibatalkan.")) {
      onDelete(id);
    }
  };

  // 🔍 Helper: File preview detection
  const getFileIcon = (url: string | null | undefined) => {
    if (!url) return "fa-file";
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return "fa-image";
    if (url.match(/\.pdf$/i)) return "fa-file-pdf";
    return "fa-file";
  };

  const isImage = (url: string | null | undefined) => {
    return !!url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  };

  const isPdf = (url: string | null | undefined) => {
    return !!url?.match(/\.pdf$/i);
  };

  // 📊 Stats calculations
  const stats = {
    total: data.length,
    draft: data.filter((r) => r.status === "Draft").length,
    disetujui: data.filter((r) => r.status === "Disetujui").length,
    ditolak: data.filter((r) => r.status === "Ditolak").length,
    dibayar: data.filter((r) => r.status === "Dibayar").length,
    totalNominal: data.reduce((sum, r) => sum + (r.jumlah || 0), 0),
  };

  // 👤 Helper: Format nama pengaju (fallback ke email/ID)
  const getPengajuName = (createdBy: string | null | undefined, userEmail?: string) => {
    if (!createdBy) return "Unknown";
    // Jika createdBy adalah email, ambil bagian sebelum @
    if (createdBy.includes("@")) {
      return createdBy.split("@")[0];
    }
    // Jika createdBy adalah UUID, tampilkan singkat
    if (createdBy.length > 8) {
      return `User •••${createdBy.slice(-4)}`;
    }
    return createdBy;
  };

  return (
    <div className="fade-in space-y-6">
      {/* 🎯 Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">💰</span>
            Reimbursement
          </h1>
          <p className="text-gray-600 text-sm mt-1">Kelola klaim reimbursement karyawan dengan sistem digital yang efisien</p>
          {/* ✅ Tampilkan info user yang login */}
          {user && (
            <p className="text-xs text-gray-500 mt-1">
              Login sebagai: <span className="font-medium text-emerald-600">{user.name || user.email}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{isAdmin ? "👑 Admin" : "👤 User"}</span>
            </p>
          )}
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <i className="fa-solid fa-plus text-sm"></i>
          Ajukan Reimburse
        </button>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Total */}
        <div className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:scale-105 transition-transform">{stats.total}</p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <i className="fa-solid fa-receipt text-blue-600"></i>
            </div>
          </div>
        </div>

        {/* Draft */}
        <div className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-yellow-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Draft</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:scale-105 transition-transform">{stats.draft}</p>
            </div>
            <div className="p-2.5 bg-yellow-50 rounded-xl group-hover:bg-yellow-100 transition-colors">
              <i className="fa-solid fa-pen-to-square text-yellow-600"></i>
            </div>
          </div>
        </div>

        {/* Disetujui */}
        <div className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Disetujui</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:scale-105 transition-transform">{stats.disetujui}</p>
            </div>
            <div className="p-2.5 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
              <i className="fa-solid fa-circle-check text-green-600"></i>
            </div>
          </div>
        </div>

        {/* Ditolak */}
        <div className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Ditolak</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:scale-105 transition-transform">{stats.ditolak}</p>
            </div>
            <div className="p-2.5 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
              <i className="fa-solid fa-circle-xmark text-red-600"></i>
            </div>
          </div>
        </div>

        {/* Dibayar */}
        <div className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Dibayar</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:scale-105 transition-transform">{stats.dibayar}</p>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <i className="fa-solid fa-money-bill-wave text-emerald-600"></i>
            </div>
          </div>
        </div>

        {/* Total Nominal */}
        <div className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-purple-100 hover:shadow-md hover:border-purple-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 uppercase font-semibold tracking-wide">Total Nominal</p>
              <p className="text-lg font-bold text-gray-900 mt-1 group-hover:scale-105 transition-transform">{fmtRupiah(stats.totalNominal)}</p>
            </div>
            <div className="p-2.5 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
              <i className="fa-solid fa-wallet text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder={isAdmin ? "🔍 Cari kategori, keterangan, atau pengaju..." : "🔍 Cari kategori atau keterangan..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 shadow-sm hover:shadow-md"
        />
        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>

      {/* 📋 Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-700 text-sm">Tanggal</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Kategori</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Keterangan</th>
                {/* ✅ KOLOM PENGAJU - Hanya untuk Admin */}
                {isAdmin && <th className="p-4 font-semibold text-gray-700 text-sm">Pengaju</th>}
                <th className="p-4 font-semibold text-gray-700 text-sm text-right">Jumlah</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-700 text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-gray-100 rounded-full animate-pulse">
                        <i className="fa-solid fa-receipt text-4xl text-gray-400"></i>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 font-medium">Tidak ada data reimbursement</p>
                        <p className="text-gray-400 text-sm mt-1">Mulai dengan mengajukan reimbursement pertama Anda</p>
                      </div>
                      <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors">
                        <i className="fa-solid fa-plus"></i>
                        Ajukan Sekarang
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((r) => (
                  <tr key={r.id} className="group hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-transparent transition-all duration-150">
                    <td className="p-4 text-sm text-gray-600 font-mono">{r.tanggal}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors">{r.kategori}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-700 max-w-xs truncate" title={r.keterangan}>
                      {r.keterangan}
                    </td>

                    {/* ✅ KOLOM PENGAJU - Hanya untuk Admin */}
                    {isAdmin && (
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">{getPengajuName(r.createdBy).charAt(0).toUpperCase()}</div>
                          <span className="text-sm text-gray-700" title={r.createdBy || ""}>
                            {getPengajuName(r.createdBy, r.createdBy)}
                          </span>
                        </div>
                      </td>
                    )}

                    <td className="p-4 text-sm font-bold text-emerald-600 text-right">{fmtRupiah(r.jumlah)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(r.status)}`}>{r.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* 👁️ View Detail Button */}
                        <button
                          onClick={() => openDetailModal(r)}
                          className="group/btn relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                          title="Lihat Detail"
                          aria-label="View Detail"
                        >
                          <i className="fa-solid fa-eye text-sm group-hover/btn:scale-110 transition-transform"></i>
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                            Detail
                          </span>
                        </button>

                        {/* ✏️ Edit Button */}
                        <button
                          onClick={() => openModal(r)}
                          className="group/btn relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                          title="Edit data"
                          aria-label="Edit"
                        >
                          <i className="fa-solid fa-pen text-sm group-hover/btn:scale-110 transition-transform"></i>
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                            Edit
                          </span>
                        </button>

                        {/* 🗑️ Delete Button */}
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="group/btn relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                          title="Hapus data"
                          aria-label="Delete"
                        >
                          <i className="fa-solid fa-trash text-sm group-hover/btn:scale-110 transition-transform"></i>
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                            Hapus
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📝 Modal: Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-file-invoice text-emerald-600"></i>
                {editingItem ? "✏️ Edit Reimbursement" : "➕ Ajukan Reimbursement"}
              </h3>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tanggal */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Pengeluaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as ReimbursementType["kategori"] })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-white"
                  >
                    <option value="Transport">🚗 Transportasi</option>
                    <option value="Makan">🍽️ Makan/Minum</option>
                    <option value="Akomodasi">🏨 Akomodasi</option>
                    <option value="Operasional">💼 Operasional</option>
                    <option value="Lainnya">📦 Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Keterangan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 resize-none"
                  placeholder="Contoh: Transportasi meeting dengan client PT. XYZ"
                />
              </div>

              {/* Jumlah */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jumlah (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rp</span>
                  <input
                    type="number"
                    value={formData.jumlah || ""}
                    onChange={(e) => setFormData({ ...formData, jumlah: parseFloat(e.target.value) || 0 })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Bukti / Lampiran */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bukti / Lampiran</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert("Ukuran file terlalu besar. Maksimal 5MB.");
                          return;
                        }
                        setFormData({ ...formData, file });
                      }
                    }}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                  {formData.file && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                      <i className="fa-solid fa-check-circle"></i>
                      <span className="truncate">
                        {formData.file.name} • {Math.round(formData.file.size / 1024)} KB
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">Format: JPG, PNG, PDF • Max 5MB</p>
              </div>

              {/* Status (hanya untuk edit) */}
              {!editingItem && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ReimbursementType["status"] })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-white"
                    disabled
                  >
                    <option value="Draft">📝 Draft / Menunggu</option>
                    <option value="Disetujui">✅ Disetujui</option>
                    <option value="Ditolak">❌ Ditolak</option>
                    <option value="Dibayar">💰 Sudah Dibayar</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">* Status diatur otomatis saat pengajuan. Admin dapat mengubah status nanti.</p>
                </div>
              )}
            </form>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="px-5 py-2.5 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors">
                Batal
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                {editingItem ? "💾 Update" : "✅ Ajukan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👁️ Modal: Detail View */}
      {isDetailModalOpen && viewingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-eye text-purple-600"></i>
                Detail Reimbursement
              </h3>
              <button onClick={closeDetailModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-6 overflow-y-auto flex-1">
              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1.5">Tanggal</p>
                  <p className="text-lg font-bold text-gray-900">{viewingItem.tanggal}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1.5">Status</p>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(viewingItem.status)}`}>{viewingItem.status}</span>
                </div>
              </div>

              {/* ✅ TAMBAHKAN: Info Pengaju - Hanya untuk Admin */}
              {isAdmin && viewingItem.createdBy && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-600 uppercase font-semibold mb-1.5">Diajukan Oleh</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">{getPengajuName(viewingItem.createdBy).charAt(0).toUpperCase()}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{getPengajuName(viewingItem.createdBy, viewingItem.createdBy)}</p>
                      <p className="text-xs text-gray-500 font-mono">{viewingItem.createdBy}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Info */}
              <div className="space-y-4">
                {/* Kategori */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1.5">Kategori</p>
                  <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">{viewingItem.kategori}</span>
                </div>

                {/* Keterangan */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1.5">Keterangan</p>
                  <p className="text-base text-gray-800 leading-relaxed">{viewingItem.keterangan}</p>
                </div>

                {/* Jumlah & ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1.5">Jumlah</p>
                    <p className="text-2xl font-bold text-emerald-600">{fmtRupiah(viewingItem.jumlah)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1.5">ID Data</p>
                    <p className="text-xs font-mono text-gray-400 break-all">{viewingItem.id}</p>
                  </div>
                </div>

                {/* File Preview Section */}
                {viewingItem.receiptUrl && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-paperclip text-gray-400"></i>
                      Bukti / Lampiran
                    </p>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      {isImage(viewingItem.receiptUrl) ? (
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg border border-gray-200 p-2">
                            <img
                              src={viewingItem.receiptUrl}
                              alt="Bukti"
                              className="w-full max-h-80 object-contain rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Preview+Error";
                              }}
                            />
                          </div>
                          <a
                            href={viewingItem.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                          >
                            <i className="fa-solid fa-download"></i>
                            Download Gambar
                          </a>
                        </div>
                      ) : isPdf(viewingItem.receiptUrl) ? (
                        <div className="space-y-4">
                          <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                            <i className="fa-solid fa-file-pdf text-7xl text-red-500 mb-4"></i>
                            <p className="text-gray-700 font-semibold">File PDF</p>
                            <p className="text-sm text-gray-500 mt-1">Klik tombol di bawah untuk melihat atau download</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <a
                              href={viewingItem.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                            >
                              <i className="fa-solid fa-eye"></i>
                              Lihat PDF
                            </a>
                            <a
                              href={viewingItem.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                            >
                              <i className="fa-solid fa-download"></i>
                              Download
                            </a>
                          </div>
                        </div>
                      ) : (
                        <a href={viewingItem.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
                          <i className={`fa-solid ${getFileIcon(viewingItem.receiptUrl)}`}></i>
                          Lihat Lampiran
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Info */}
              <div className="pt-4 border-t border-gray-200 text-xs text-gray-400 space-y-1">
                <p>
                  🕐 Dibuat:{" "}
                  {new Date(viewingItem.createdAt || Date.now()).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                {viewingItem.updatedAt && viewingItem.updatedAt !== viewingItem.createdAt && (
                  <p>
                    🔄 Terakhir diupdate:{" "}
                    {new Date(viewingItem.updatedAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={closeDetailModal} className="px-5 py-2.5 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors">
                Tutup
              </button>
              <button
                onClick={() => {
                  closeDetailModal();
                  openModal(viewingItem);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <i className="fa-solid fa-pen"></i>
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reimbursement;
