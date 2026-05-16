// src/pages/SuratMasuk.tsx
import React, { useState } from "react";
import { Surat } from "../types"; // ← Frontend type from types.ts
import { getStatusColor } from "../utils/helpers"; // ← ← ← FIX: Import from utils/helpers

interface SuratMasukProps {
  data: Surat[]; // ← Frontend type
  onAdd: (s: Omit<Surat, "id">) => void; // ← Frontend type
  onUpdate: (s: Surat) => void; // ← Frontend type
  onDelete: (id: string) => void;
}

const SuratMasuk: React.FC<SuratMasukProps> = ({ data, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurat, setEditingSurat] = useState<Surat | null>(null);

  // ✅ FIX: Explicit type annotation for formData with Surat["status"] union
  const [formData, setFormData] = useState<{
    nomor: string;
    tanggal: string;
    perihal: string;
    pihak: string;
    status: Surat["status"]; // ← ← ← Union type from Surat interface
  }>({
    nomor: "",
    tanggal: new Date().toISOString().split("T")[0], // 'YYYY-MM-DD'
    perihal: "",
    pihak: "",
    status: "Diterima", // ← No `as const` needed
  });

  // ✅ Filter: search by frontend field names
  const filteredData = data.filter((s) => s.nomor?.toLowerCase().includes(searchTerm.toLowerCase()) || s.perihal?.toLowerCase().includes(searchTerm.toLowerCase()));

  // ✅ openModal: use frontend field names
  const openModal = (surat?: Surat) => {
    if (surat) {
      setEditingSurat(surat);
      setFormData({
        nomor: surat.nomor || "",
        tanggal: surat.tanggal || new Date().toISOString().split("T")[0],
        perihal: surat.perihal || "",
        pihak: surat.pihak || "",
        status: surat.status,
      });
    } else {
      setEditingSurat(null);
      setFormData({
        nomor: "",
        tanggal: new Date().toISOString().split("T")[0],
        perihal: "",
        pihak: "",
        status: "Diterima",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSurat(null);
  };

  // ✅ handleSubmit: send frontend field names (App.tsx transforms to backend)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSurat) {
      onUpdate({ ...editingSurat, ...formData }); // ← Frontend type
    } else {
      onAdd(formData); // ← Frontend type, App.tsx transforms
    }
    closeModal();
  };

  return (
    <div className="fade-in">
      {/* Search + Add */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <input type="text" placeholder="Cari nomor/perihal..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 border rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 outline-none" />
        <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Tambah Surat Masuk
        </button>
      </div>

      {/* Table: Display frontend field names */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 font-semibold text-gray-700">No. Agenda</th>
                <th className="p-3 font-semibold text-gray-700">Tanggal</th>
                <th className="p-3 font-semibold text-gray-700">Perihal</th>
                <th className="p-3 font-semibold text-gray-700">Pengirim</th>
                <th className="p-3 font-semibold text-gray-700">Status</th>
                <th className="p-3 font-semibold text-gray-700 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    Tidak ada data surat masuk
                  </td>
                </tr>
              ) : (
                filteredData.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-3 font-mono text-sm text-gray-800">{s.nomor}</td>
                    <td className="p-3 text-sm">{s.tanggal}</td>
                    <td className="p-3 text-sm text-gray-700">{s.perihal}</td>
                    <td className="p-3 text-sm text-gray-600">{s.pihak}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(s.status)}`}>{s.status}</span>
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={() => openModal(s)} className="text-blue-600 hover:text-blue-800 mx-1 p-1" title="Edit">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        onClick={() => onDelete(s.id)}
                        className="text-red-600 hover:text-red-800 mx-1 p-1"
                        title="Hapus"
                        onClickCapture={(e) => {
                          if (!confirm("Hapus surat ini?")) e.preventDefault();
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

      {/* Modal: Form uses frontend field names */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">{editingSurat ? "Edit Surat Masuk" : "Tambah Surat Masuk"}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-500 text-xl">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat</label>
                  <input
                    type="text"
                    value={formData.nomor}
                    onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SM-001/2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perihal</label>
                <input
                  type="text"
                  value={formData.perihal}
                  onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Permohonan kerjasama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pengirim</label>
                <input
                  type="text"
                  value={formData.pihak}
                  onChange={(e) => setFormData({ ...formData, pihak: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama instansi/pengirim"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      // ✅ FIX: Cast to Surat["status"] union type
                      status: e.target.value as Surat["status"],
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Diterima">Diterima</option>
                  <option value="Didisposisikan">Didisposisikan</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Draft">Draft</option>
                  <option value="Terkirim">Terkirim</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
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

export default SuratMasuk;
