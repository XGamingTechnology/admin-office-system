// src/pages/Reimbursement.tsx
import React, { useState, useEffect } from "react";
import { Reimbursement as ReimbursementType } from "../types";
import { fmtRupiah, getStatusColor } from "../utils/helpers";

interface ReimbursementProps {
  data: ReimbursementType[];
  onAdd: (r: Omit<ReimbursementType, "id" | "status"> & { file?: File }) => void;
  onUpdate: (r: ReimbursementType) => void;
  onDelete: (id: string) => void;
}

const Reimbursement: React.FC<ReimbursementProps> = ({ data, onAdd, onUpdate, onDelete }) => {
  // 🐛 DEBUG: Log props (bisa dihapus nanti)
  useEffect(() => {
    console.log("🔍 [DEBUG Reimbursement] Props:", {
      count: data?.length,
      hasHandlers: !!(onAdd && onUpdate && onDelete),
    });
  }, [data, onAdd, onUpdate, onDelete]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReimbursementType | null>(null);

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

  const filteredData = data.filter((r) => r.kategori?.toLowerCase().includes(searchTerm.toLowerCase()) || r.keterangan?.toLowerCase().includes(searchTerm.toLowerCase()));

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

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
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
    if (confirm("Hapus reimbursement ini?")) {
      onDelete(id);
    }
  };

  return (
    <div className="fade-in">
      {/* Search + Add */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <input type="text" placeholder="Cari kategori/keterangan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 border rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 outline-none" />
        <button onClick={() => openModal()} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Ajukan Reimburse
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 font-semibold text-gray-700">Tanggal</th>
                <th className="p-3 font-semibold text-gray-700">Kategori</th>
                <th className="p-3 font-semibold text-gray-700">Keterangan</th>
                <th className="p-3 font-semibold text-gray-700">Jumlah</th>
                <th className="p-3 font-semibold text-gray-700">Status</th>
                <th className="p-3 font-semibold text-gray-700 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    Tidak ada data reimbursement
                  </td>
                </tr>
              ) : (
                filteredData.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-3 text-sm">{r.tanggal}</td>
                    <td className="p-3">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{r.kategori}</span>
                    </td>
                    <td className="p-3 text-sm text-gray-700">{r.keterangan}</td>
                    <td className="p-3 font-semibold text-emerald-700">{fmtRupiah(r.jumlah)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(r.status)}`}>{r.status}</span>
                    </td>
                    {/* Dalam tbody > tr > td Aksi */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* ✅ Edit Button - Professional Style */}
                        <button
                          onClick={() => openModal(r)}
                          className="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                          title="Edit data"
                          aria-label="Edit"
                        >
                          <i className="fa-solid fa-pen text-xs group-hover:scale-110 transition-transform"></i>
                          {/* Hover tooltip */}
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            Edit
                          </span>
                        </button>

                        {/* ✅ Delete Button - Professional Style */}
                        <button
                          onClick={() => {
                            if (confirm("Hapus data ini? Tindakan ini tidak dapat dibatalkan.")) {
                              onDelete(r.id);
                            }
                          }}
                          className="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                          title="Hapus data"
                          aria-label="Delete"
                        >
                          <i className="fa-solid fa-trash text-xs group-hover:scale-110 transition-transform"></i>
                          {/* Hover tooltip */}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">{editingItem ? "Edit Reimburse" : "Ajukan Reimburse"}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-500 text-xl">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengeluaran</label>
                  <input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as ReimbursementType["kategori"] })}
                    required
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Transport">Transportasi</option>
                    <option value="Makan">Makan/Minum</option>
                    <option value="Akomodasi">Akomodasi</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <input
                  type="text"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Transportasi meeting client"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
                <input
                  type="number"
                  value={formData.jumlah || ""}
                  onChange={(e) => setFormData({ ...formData, jumlah: parseFloat(e.target.value) || 0 })}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bukti / Lampiran</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFormData({ ...formData, file });
                  }}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.file && (
                  <p className="text-xs text-green-600 mt-1">
                    ✅ File: {formData.file.name} ({Math.round(formData.file.size / 1024)} KB)
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ReimbursementType["status"] })}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!editingItem}
                >
                  <option value="Draft">Draft / Menunggu</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Ditolak">Ditolak</option>
                  <option value="Dibayar">Sudah Dibayar</option>
                </select>
                {!editingItem && <p className="text-xs text-gray-500 mt-1">* Status diatur otomatis saat pengajuan</p>}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reimbursement;
