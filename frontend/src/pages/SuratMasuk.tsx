import React, { useState } from 'react';
import { Surat } from '../types';
import { getStatusColor } from '../utils/helpers';
import { Button, Badge } from '../components/ui';

interface SuratMasukProps {
  data: Surat[];
  onAdd: (surat: Surat) => void;
  onUpdate: (surat: Surat) => void;
  onDelete: (id: number) => void;
}

const SuratMasuk: React.FC<SuratMasukProps> = ({ data, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurat, setEditingSurat] = useState<Surat | null>(null);
  const [formData, setFormData] = useState({
    nomor: '',
    tanggal: new Date().toISOString().split('T')[0],
    perihal: '',
    pihak: '',
    status: 'Diterima',
  });

  const filteredData = data.filter(
    (s) =>
      s.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.perihal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (surat?: Surat) => {
    if (surat) {
      setEditingSurat(surat);
      setFormData({
        nomor: surat.nomor,
        tanggal: surat.tanggal,
        perihal: surat.perihal,
        pihak: surat.pihak,
        status: surat.status,
      });
    } else {
      setEditingSurat(null);
      setFormData({
        nomor: '',
        tanggal: new Date().toISOString().split('T')[0],
        perihal: '',
        pihak: '',
        status: 'Diterima',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSurat(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const surat: Surat = {
      id: editingSurat?.id || Date.now(),
      ...formData,
    };

    if (editingSurat) {
      onUpdate(surat);
    } else {
      onAdd(surat);
    }
    closeModal();
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Cari nomor/perihal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg w-1/3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <Button onClick={() => openModal()}>
          <i className="fa-solid fa-plus mr-2"></i> Tambah Surat Masuk
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">No. Agenda</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Perihal</th>
              <th className="p-3">Pengirim</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 border-b last:border-0">
                <td className="p-3 font-mono text-sm">{s.nomor}</td>
                <td className="p-3 text-sm">{s.tanggal}</td>
                <td className="p-3">{s.perihal}</td>
                <td className="p-3 text-sm text-gray-600">{s.pihak}</td>
                <td className="p-3">
                  <Badge color={getStatusColor(s.status)}>{s.status}</Badge>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => openModal(s)}
                    className="text-blue-600 hover:text-blue-800 mx-1"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    onClick={() => onDelete(s.id)}
                    className="text-red-600 hover:text-red-800 mx-1"
                  >
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
              <h3 className="text-lg font-bold">
                {editingSurat ? 'Edit Surat Masuk' : 'Tambah Surat Masuk'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-500 text-2xl">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nomor Surat</label>
                  <input
                    type="text"
                    value={formData.nomor}
                    onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded outline-none"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Perihal</label>
                <input
                  type="text"
                  value={formData.perihal}
                  onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Pengirim</label>
                <input
                  type="text"
                  value={formData.pihak}
                  onChange={(e) => setFormData({ ...formData, pihak: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded outline-none"
                >
                  <option value="Diterima">Diterima</option>
                  <option value="Didisposisikan">Didisposisikan</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuratMasuk;
