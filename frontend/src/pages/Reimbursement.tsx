// src/pages/Reimbursement.tsx
import React, { useState } from "react";
import type { Reimbursement as ReimbursementType } from "../types";
import { fmtRupiah, getStatusColor } from "../utils/helpers";

interface ReimbursementProps {
  data: ReimbursementType[];
  onAdd: (r: Omit<ReimbursementType, "id">) => void;
  onUpdate: (r: ReimbursementType) => void;
  onDelete: (id: string) => void;
}

const Reimbursement: React.FC<ReimbursementProps> = ({ data, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReimbursementType | null>(null);

  // ✅ FIX: Explicit type annotation untuk formData (tanpa `as const`)
  const [formData, setFormData] = useState<{
    tanggal: string;
    kategori: "Transport" | "Makan" | "Akomodasi" | "Operasional" | "Lainnya";
    keterangan: string;
    jumlah: number;
    status: "Draft" | "Disetujui" | "Ditolak" | "Dibayar";
  }>({
    tanggal: new Date().toISOString().split("T")[0],
    kategori: "Transport", // ← Tanpa `as const`
    keterangan: "",
    jumlah: 0,
    status: "Draft", // ← Tanpa `as const`
  });

  const filteredData = data.filter((r) => r.kategori.toLowerCase().includes(searchTerm.toLowerCase()) || r.keterangan.toLowerCase().includes(searchTerm.toLowerCase()));

  const openModal = (item?: ReimbursementType) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        tanggal: item.tanggal,
        kategori: item.kategori,
        keterangan: item.keterangan,
        jumlah: item.jumlah,
        status: item.status,
      });
    } else {
      setEditingItem(null);
      setFormData({
        tanggal: new Date().toISOString().split("T")[0],
        kategori: "Transport",
        keterangan: "",
        jumlah: 0,
        status: "Draft",
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
      onAdd(formData);
    }
    closeModal();
  };

  return (
    <div className="fade-in">
      {/* Search + Add Button */}
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
                    <td className="p-3 text-center">
                      <button onClick={() => openModal(r)} className="text-blue-600 hover:text-blue-800 mx-1 p-1" title="Edit">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        onClick={() => onDelete(r.id)}
                        className="text-red-600 hover:text-red-800 mx-1 p-1"
                        title="Hapus"
                        onClickCapture={(e) => {
                          if (!confirm("Hapus reimbursement ini?")) e.preventDefault();
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kategori: e.target.value as "Transport" | "Makan" | "Akomodasi" | "Operasional" | "Lainnya",
                      })
                    }
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
                  onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "Draft" | "Disetujui" | "Ditolak" | "Dibayar",
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Draft">Draft / Menunggu</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Ditolak">Ditolak</option>
                  <option value="Dibayar">Sudah Dibayar</option>
                </select>
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
