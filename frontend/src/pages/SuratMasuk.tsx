// src/pages/SuratMasuk.tsx
import React, { useState } from "react";
import { Surat } from "../types";
import { getStatusColor } from "../utils/helpers";

interface SuratMasukProps {
  data: Surat[];
  onAdd: (s: Omit<Surat, "id" | "status"> & { file?: File }) => void;
  onUpdate: (s: Surat) => void;
  onDelete: (id: string) => void;
}

const SuratMasuk: React.FC<SuratMasukProps> = ({ data, onAdd, onUpdate, onDelete }) => {
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
    status: "Diterima",
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
        status: "Diterima",
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
    if (confirm("Hapus surat masuk ini? Tindakan ini tidak dapat dibatalkan.")) {
      onDelete(id);
    }
  };

  // Helper untuk preview file
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

  // Stats calculations
  const stats = {
    total: data.length,
    diterima: data.filter((s) => s.status === "Diterima").length,
    diproses: data.filter((s) => s.status === "Dalam Proses").length,
    selesai: data.filter((s) => s.status === "Selesai").length,
  };

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">📥 Surat Masuk</h1>
        <p className="text-gray-600 text-sm">Kelola dan pantau surat masuk dengan sistem agenda digital</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-full">
              <i className="fa-solid fa-inbox text-blue-600"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Diterima</p>
              <p className="text-2xl font-bold text-gray-800">{stats.diterima}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-full">
              <i className="fa-solid fa-check text-green-600"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Diproses</p>
              <p className="text-2xl font-bold text-gray-800">{stats.diproses}</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-full">
              <i className="fa-solid fa-clock text-yellow-600"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-emerald-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Selesai</p>
              <p className="text-2xl font-bold text-gray-800">{stats.selesai}</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-full">
              <i className="fa-solid fa-flag-checkered text-emerald-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari nomor/perihal/pengirim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <button
          onClick={() => openModal()}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <i className="fa-solid fa-plus"></i> Tambah Surat Masuk
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-700 text-sm">No. Agenda</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Tanggal</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Perihal</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Pengirim</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-700 text-sm text-center">Lampiran</th>
                <th className="p-4 font-semibold text-gray-700 text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <i className="fa-solid fa-inbox text-3xl text-gray-400"></i>
                      </div>
                      <p className="text-gray-600">Tidak ada data surat masuk</p>
                      <button onClick={() => openModal()} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        + Tambah surat pertama
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition">
                    <td className="p-4 font-mono text-sm font-medium text-gray-900">{s.nomor}</td>
                    <td className="p-4 text-sm text-gray-600">{s.tanggal}</td>
                    <td className="p-4 text-sm text-gray-700 max-w-xs truncate" title={s.perihal}>
                      {s.perihal}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{s.pihak}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(s.status)}`}>{s.status}</span>
                    </td>
                    <td className="p-4 text-center">
                      {s.fileUrl ? (
                        <a
                          href={s.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition"
                          title="Lihat lampiran"
                        >
                          <i className={`fa-solid ${getFileIcon(s.fileUrl)}`}></i>
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* 👁️ View Detail Button */}
                        <button
                          onClick={() => openDetailModal(s)}
                          className="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
                          title="Lihat Detail"
                          aria-label="View Detail"
                        >
                          <i className="fa-solid fa-eye text-xs group-hover:scale-110 transition-transform"></i>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            Detail
                          </span>
                        </button>

                        {/* ✏️ Edit Button */}
                        <button
                          onClick={() => openModal(s)}
                          className="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                          title="Edit data"
                          aria-label="Edit"
                        >
                          <i className="fa-solid fa-pen text-xs group-hover:scale-110 transition-transform"></i>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            Edit
                          </span>
                        </button>

                        {/* 🗑️ Delete Button */}
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                          title="Hapus data"
                          aria-label="Delete"
                        >
                          <i className="fa-solid fa-trash text-xs group-hover:scale-110 transition-transform"></i>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
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

      {/* Modal: Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">{editingSurat ? "✏️ Edit Surat Masuk" : "➕ Tambah Surat Masuk"}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl transition">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Surat *</label>
                  <input
                    type="text"
                    value={formData.nomor}
                    onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Contoh: SM-001/2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal *</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Perihal *</label>
                <input
                  type="text"
                  value={formData.perihal}
                  onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Contoh: Permohonan kerjasama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pengirim *</label>
                <input
                  type="text"
                  value={formData.pihak}
                  onChange={(e) => setFormData({ ...formData, pihak: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Nama instansi/pengirim"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Lampiran File</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFormData({ ...formData, file });
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                {formData.file && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <i className="fa-solid fa-check-circle"></i>
                    File: {formData.file.name} ({Math.round(formData.file.size / 1024)} KB)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Surat["status"] })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="Diterima">Diterima</option>
                  <option value="Didisposisikan">Didisposisikan</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Draft">Draft</option>
                  <option value="Terkirim">Terkirim</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition shadow-md">
                  {editingSurat ? "💾 Update" : "✅ Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detail View */}
      {isDetailModalOpen && viewingSurat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fa-solid fa-eye text-indigo-600"></i>
                Detail Surat Masuk
              </h3>
              <button onClick={closeDetailModal} className="text-gray-400 hover:text-gray-600 text-2xl transition">
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Nomor Agenda</p>
                  <p className="text-lg font-bold text-gray-800 font-mono">{viewingSurat.nomor}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingSurat.status)}`}>{viewingSurat.status}</span>
                </div>
              </div>

              {/* Main Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Pengirim</p>
                  <p className="text-base font-semibold text-gray-800">{viewingSurat.pihak}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Perihal</p>
                  <p className="text-base text-gray-800">{viewingSurat.perihal}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Tanggal Surat</p>
                    <p className="text-base text-gray-800">{viewingSurat.tanggal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">ID Data</p>
                    <p className="text-xs font-mono text-gray-500">{viewingSurat.id}</p>
                  </div>
                </div>

                {/* File Preview */}
                {viewingSurat.fileUrl && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">Lampiran</p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {isImage(viewingSurat.fileUrl) ? (
                        <div className="text-center">
                          <img
                            src={viewingSurat.fileUrl}
                            alt="Lampiran"
                            className="max-h-64 mx-auto rounded-lg shadow-md border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                            }}
                          />
                          <a href={viewingSurat.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-800 transition text-sm">
                            <i className="fa-solid fa-download"></i>
                            Download Gambar
                          </a>
                        </div>
                      ) : isPdf(viewingSurat.fileUrl) ? (
                        <div className="text-center">
                          <i className="fa-solid fa-file-pdf text-5xl text-red-500 mb-3"></i>
                          <p className="text-sm text-gray-600 mb-3">File PDF</p>
                          <a href={viewingSurat.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm">
                            <i className="fa-solid fa-download"></i>
                            Download PDF
                          </a>
                        </div>
                      ) : (
                        <a href={viewingSurat.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
                          <i className={`fa-solid ${getFileIcon(viewingSurat.fileUrl)}`}></i>
                          Lihat Lampiran
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Info */}
              <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                <p>🕐 Dibuat: {new Date(viewingSurat.createdAt || Date.now()).toLocaleString("id-ID")}</p>
                {viewingSurat.updatedAt && viewingSurat.updatedAt !== viewingSurat.createdAt && <p>🔄 Terakhir diupdate: {new Date(viewingSurat.updatedAt).toLocaleString("id-ID")}</p>}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={closeDetailModal} className="px-5 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition">
                Tutup
              </button>
              <button
                onClick={() => {
                  closeDetailModal();
                  openModal(viewingSurat);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
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

export default SuratMasuk;
