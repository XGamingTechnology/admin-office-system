// src/pages/SuratKeluar.tsx
import React, { useState, useEffect } from "react";
import { Surat } from "../types";
import { getStatusColor } from "../utils/helpers";

interface SuratKeluarProps {
  data: Surat[];
  onAdd: (s: Omit<Surat, "id" | "status"> & { file?: File }) => void;
  onUpdate: (s: Surat) => void;
  onDelete: (id: string) => void;
}

const SuratKeluar: React.FC<SuratKeluarProps> = ({ data, onAdd, onUpdate, onDelete }) => {
  // 🐛 DEBUG: Log props (bisa dihapus nanti)
  useEffect(() => {
    console.log("🔍 [DEBUG SuratKeluar] Props:", {
      count: data?.length,
      hasHandlers: !!(onAdd && onUpdate && onDelete),
    });
  }, [data, onAdd, onUpdate, onDelete]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingSurat, setEditingSurat] = useState<Surat | null>(null);
  const [viewingSurat, setViewingSurat] = useState<Surat | null>(null);

  const [formData, setFormData] = useState<{
    nomor: string;
    tanggal: string;
    perihal: string;
    pihak: string;
    status: Surat["status"];
    file?: File | null;
  }>({
    nomor: "",
    tanggal: new Date().toISOString().split("T")[0],
    perihal: "",
    pihak: "",
    status: "Draft",
    file: null,
  });

  const filteredData = data.filter((s) => s.nomor?.toLowerCase().includes(searchTerm.toLowerCase()) || s.perihal?.toLowerCase().includes(searchTerm.toLowerCase()) || s.pihak?.toLowerCase().includes(searchTerm.toLowerCase()));

  const openModal = (surat?: Surat) => {
    if (surat) {
      setEditingSurat(surat);
      setFormData({
        nomor: surat.nomor || "",
        tanggal: surat.tanggal || new Date().toISOString().split("T")[0],
        perihal: surat.perihal || "",
        pihak: surat.pihak || "",
        status: surat.status,
        file: null,
      });
    } else {
      setEditingSurat(null);
      setFormData({
        nomor: "",
        tanggal: new Date().toISOString().split("T")[0],
        perihal: "",
        pihak: "",
        status: "Draft",
        file: null,
      });
    }
    setIsModalOpen(true);
  };

  const openDetailModal = (surat: Surat) => {
    setViewingSurat(surat);
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSurat(null);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setViewingSurat(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSurat) {
      onUpdate({ ...editingSurat, ...formData });
    } else {
      const { status, ...formDataWithoutStatus } = formData;
      const payload = { ...formDataWithoutStatus, file: formData.file || undefined };
      onAdd(payload);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus surat keluar ini? Tindakan ini tidak dapat dibatalkan.")) {
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
    draft: data.filter((s) => s.status === "Draft").length,
    proses: data.filter((s) => s.status === "Dalam Proses").length,
    selesai: data.filter((s) => s.status === "Selesai").length,
  };

  // 📅 Format tanggal helper
  const fmtDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fade-in space-y-6">
      {/* 🎯 Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">📤</span>
            Surat Keluar
          </h1>
          <p className="text-gray-600 text-sm mt-1">Kelola dan pantau surat keluar dengan sistem agenda digital yang terintegrasi</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <i className="fa-solid fa-plus text-sm"></i>
          Buat Draft Keluar
        </button>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total */}
        <div className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:scale-105 transition-transform">{stats.total}</p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <i className="fa-solid fa-paper-plane text-blue-600"></i>
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

        {/* Dalam Proses */}
        <div className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Dalam Proses</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:scale-105 transition-transform">{stats.proses}</p>
            </div>
            <div className="p-2.5 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
              <i className="fa-solid fa-clock text-orange-600"></i>
            </div>
          </div>
        </div>

        {/* Selesai */}
        <div className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Selesai</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:scale-105 transition-transform">{stats.selesai}</p>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <i className="fa-solid fa-circle-check text-emerald-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 Cari nomor, perihal, atau tujuan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm hover:shadow-md"
        />
        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>

      {/* 📋 Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-700 text-sm">No. Surat</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Tanggal</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Perihal</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Tujuan</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-700 text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-gray-100 rounded-full animate-pulse">
                        <i className="fa-solid fa-paper-plane text-4xl text-gray-400"></i>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 font-medium">Tidak ada data surat keluar</p>
                        <p className="text-gray-400 text-sm mt-1">Mulai dengan membuat draft surat keluar pertama Anda</p>
                      </div>
                      <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                        <i className="fa-solid fa-plus"></i>
                        Buat Draft Sekarang
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((s) => (
                  <tr key={s.id} className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-150">
                    <td className="p-4 text-sm text-gray-800 font-mono font-medium">{s.nomor}</td>
                    <td className="p-4 text-sm text-gray-600">{fmtDate(s.tanggal)}</td>
                    <td className="p-4 text-sm text-gray-700 max-w-xs truncate" title={s.perihal}>
                      {s.perihal}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{s.pihak}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(s.status)}`}>{s.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* 👁️ View Detail Button */}
                        <button
                          onClick={() => openDetailModal(s)}
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
                          onClick={() => openModal(s)}
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
                          onClick={() => handleDelete(s.id)}
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
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-file-export text-blue-600"></i>
                {editingSurat ? "✏️ Edit Surat Keluar" : "➕ Buat Draft Keluar"}
              </h3>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nomor Surat */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor Surat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nomor}
                    onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-mono"
                    placeholder="Contoh: SK-001/2024"
                  />
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Perihal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Perihal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.perihal}
                  onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="Contoh: Undangan rapat koordinasi triwulan"
                />
              </div>

              {/* Tujuan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tujuan / Penerima <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.pihak}
                  onChange={(e) => setFormData({ ...formData, pihak: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="Contoh: PT. Mitra Sejahtera, Jakarta"
                />
              </div>

              {/* Lampiran / File */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lampiran / Dokumen</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          alert("Ukuran file terlalu besar. Maksimal 10MB.");
                          return;
                        }
                        setFormData({ ...formData, file });
                      }
                    }}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {formData.file && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                      <i className="fa-solid fa-check-circle"></i>
                      <span className="truncate">
                        {formData.file.name} • {Math.round(formData.file.size / 1024)} KB
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">Format: JPG, PNG, PDF, DOC • Max 10MB</p>
              </div>

              {/* Status (hanya untuk edit) */}
              {!editingSurat && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Surat["status"] })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
                    disabled
                  >
                    <option value="Draft">📝 Draft</option>
                    <option value="Dalam Proses">⏳ Dalam Proses</option>
                    <option value="Selesai">✅ Selesai / Terkirim</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">* Status diatur otomatis saat pembuatan. Admin dapat mengubah status nanti.</p>
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
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                {editingSurat ? "💾 Update" : "✅ Simpan Draft"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👁️ Modal: Detail View */}
      {isDetailModalOpen && viewingSurat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-eye text-indigo-600"></i>
                Detail Surat Keluar
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
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1.5">Nomor Surat</p>
                  <p className="text-lg font-bold text-gray-900 font-mono">{viewingSurat.nomor}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1.5">Status</p>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(viewingSurat.status)}`}>{viewingSurat.status}</span>
                </div>
              </div>

              {/* Main Info */}
              <div className="space-y-4">
                {/* Tujuan */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1.5">Tujuan / Penerima</p>
                  <p className="text-base font-semibold text-gray-800">{viewingSurat.pihak}</p>
                </div>

                {/* Perihal */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1.5">Perihal</p>
                  <p className="text-base text-gray-800 leading-relaxed">{viewingSurat.perihal}</p>
                </div>

                {/* Tanggal & ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1.5">Tanggal Surat</p>
                    <p className="text-base text-gray-800">{fmtDate(viewingSurat.tanggal)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1.5">ID Data</p>
                    <p className="text-xs font-mono text-gray-400 break-all">{viewingSurat.id}</p>
                  </div>
                </div>

                {/* File Preview Section */}
                {viewingSurat.fileUrl && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-paperclip text-gray-400"></i>
                      Lampiran / Dokumen
                    </p>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      {isImage(viewingSurat.fileUrl) ? (
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg border border-gray-200 p-2">
                            <img
                              src={viewingSurat.fileUrl}
                              alt="Lampiran"
                              className="w-full max-h-80 object-contain rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Preview+Error";
                              }}
                            />
                          </div>
                          <a
                            href={viewingSurat.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                          >
                            <i className="fa-solid fa-download"></i>
                            Download Gambar
                          </a>
                        </div>
                      ) : isPdf(viewingSurat.fileUrl) ? (
                        <div className="space-y-4">
                          <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                            <i className="fa-solid fa-file-pdf text-7xl text-red-500 mb-4"></i>
                            <p className="text-gray-700 font-semibold">File PDF</p>
                            <p className="text-sm text-gray-500 mt-1">Klik tombol di bawah untuk melihat atau download</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <a
                              href={viewingSurat.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                            >
                              <i className="fa-solid fa-eye"></i>
                              Lihat PDF
                            </a>
                            <a
                              href={viewingSurat.fileUrl}
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
                        <a href={viewingSurat.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
                          <i className={`fa-solid ${getFileIcon(viewingSurat.fileUrl)}`}></i>
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
                  {new Date(viewingSurat.createdAt || Date.now()).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                {viewingSurat.updatedAt && viewingSurat.updatedAt !== viewingSurat.createdAt && (
                  <p>
                    🔄 Terakhir diupdate:{" "}
                    {new Date(viewingSurat.updatedAt).toLocaleString("id-ID", {
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
                  openModal(viewingSurat);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
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

export default SuratKeluar;
