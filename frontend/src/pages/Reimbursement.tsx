import React, { useState } from "react";
import type { Reimbursement } from "../types";
import { fmtRupiah, getStatusColor } from "../utils/helpers";
import { Button, Badge } from "../components/ui";

interface ReimbursementProps {
  data: Reimbursement[];
  onAdd: (reimbursement: Reimbursement) => void;
  onUpdate: (reimbursement: Reimbursement) => void;
  onDelete: (id: number) => void;
}

const Reimbursement: React.FC<ReimbursementProps> = ({ data, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Reimbursement | null>(null);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    kategori: "Transport",
    keterangan: "",
    jumlah: 0,
    status: "Draft",
  });

  const filteredData = data.filter((r) => r.kategori.toLowerCase().includes(searchTerm.toLowerCase()) || r.keterangan.toLowerCase().includes(searchTerm.toLowerCase()));

  const openModal = (item?: Reimbursement) => {
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
    const reimbursement: Reimbursement = {
      id: editingItem?.id || Date.now(),
      ...formData,
    };

    if (editingItem) {
      onUpdate(reimbursement);
    } else {
      onAdd(reimbursement);
    }
    closeModal();
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-4">
        <input type="text" placeholder="Cari kategori/keterangan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 border rounded-lg w-1/3 focus:ring-2 focus:ring-blue-500 outline-none" />
        <Button variant="success" onClick={() => openModal()}>
          <i className="fa-solid fa-plus mr-2"></i> Ajukan Reimburse
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Keterangan</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 border-b last:border-0">
                <td className="p-3 text-sm">{r.tanggal}</td>
                <td className="p-3">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{r.kategori}</span>
                </td>
                <td className="p-3">{r.keterangan}</td>
                <td className="p-3 font-semibold text-emerald-700">{fmtRupiah(r.jumlah)}</td>
                <td className="p-3">
                  <Badge color={getStatusColor(r.status)}>{r.status}</Badge>
                </td>
                <td className="p-3 text-center">
                  <button onClick={() => openModal(r)} className="text-blue-600 hover:text-blue-800 mx-1">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button onClick={() => onDelete(r.id)} className="text-red-600 hover:text-red-800 mx-1">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 transform transition-all scale-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{editingItem ? "Edit Reimburse" : "Ajukan Reimburse"}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-500 text-2xl">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal Pengeluaran</label>
                  <input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} required className="w-full px-3 py-2 border rounded outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <select value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })} required className="w-full px-3 py-2 border rounded outline-none">
                    <option value="Transport">Transportasi</option>
                    <option value="Makan">Makan/Minum</option>
                    <option value="Akomodasi">Akomodasi</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Keterangan</label>
                <input type="text" value={formData.keterangan} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} required className="w-full px-3 py-2 border rounded outline-none" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Jumlah (Rp)</label>
                <input type="number" value={formData.jumlah} onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value) || 0 })} required className="w-full px-3 py-2 border rounded outline-none" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Status Approval</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded outline-none">
                  <option value="Draft">Draft / Menunggu</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Ditolak">Ditolak</option>
                  <option value="Dibayar">Sudah Dibayar</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Batal
                </Button>
                <Button type="submit" variant="success">
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reimbursement;
