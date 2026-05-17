// src/pages/Reimbursement.tsx
import React, { useState, useRef } from "react";
import { Reimbursement as ReimbursementType } from "../types";
import { fmtRupiah, getStatusColor } from "../utils/helpers";

interface ReimbursementProps {
  data: ReimbursementType[];
  onAdd: (r: Omit<ReimbursementType, "id">, file?: File) => void;
  onUpdate: (r: ReimbursementType, file?: File) => void;
  onDelete: (id: string) => void;
}

const Reimbursement: React.FC<ReimbursementProps> = ({ data, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReimbursementType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    tanggal: string;
    kategori: ReimbursementType["kategori"];
    keterangan: string;
    jumlah: number;
    status: ReimbursementType["status"];
  }>({
    tanggal: new Date().toISOString().split("T")[0],
    kategori: "Transport",
    keterangan: "",
    jumlah: 0,
    status: "Draft",
  });

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

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
      });
      setPreviewUrl(null);
      setSelectedFile(null);
    } else {
      setEditingItem(null);
      setFormData({
        tanggal: new Date().toISOString().split("T")[0],
        kategori: "Transport",
        keterangan: "",
        jumlah: 0,
        status: "Draft",
      });
      setPreviewUrl(null);
      setSelectedFile(null);
    }
    setUploadProgress(0);
    setIsUploading(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Format file tidak didukung! Gunakan PDF atau gambar (JPG/PNG).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("Ukuran file terlalu besar! Maksimal 5MB.");
      return;
    }
    setSelectedFile(file);
    setUploadProgress(0);
    
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl("pdf");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFile) {
      setIsUploading(true);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      try {
        if (editingItem) {
          await onUpdate({ ...editingItem, ...formData }, selectedFile);
        } else {
          await onAdd(formData, selectedFile);
        }
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => closeModal(), 500);
      } catch (error) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        alert("Gagal mengupload file. Silakan coba lagi.");
      }
    } else {
      if (editingItem) {
        onUpdate({ ...editingItem, ...formData });
      } else {
        onAdd(formData);
      }
      closeModal();
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

      {/* Table: Display frontend field names */}
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

      {/* Modal: Form uses frontend field names */}
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        // ✅ FIX: Cast to ReimbursementType["kategori"] union
                        kategori: e.target.value as ReimbursementType["kategori"],
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
                      status: e.target.value as ReimbursementType["status"],
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

              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Bukti (PDF/Gambar)</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="space-y-3">
                      {previewUrl && previewUrl !== "pdf" ? (
                        <div className="relative">
                          <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-md" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSelectedFile();
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <i className="fa-solid fa-times"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <i className="fa-solid fa-file-pdf text-4xl text-red-500"></i>
                          <div className="text-left">
                            <p className="font-medium text-gray-700">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSelectedFile();
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      )}
                      {isUploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <i className="fa-solid fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                      <p className="text-sm text-gray-600">Klik atau drag & drop file di sini</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition" disabled={isUploading}>
                  {isUploading ? "Mengupload..." : "Simpan"}
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
