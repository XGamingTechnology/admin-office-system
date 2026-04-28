import { useState, useEffect } from 'react';
import { Surat, Reimbursement, AppState } from '../types';

const STORAGE_KEY = "admin_kantor_demo";

const getDummyData = (): AppState => {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const addDays = (d: Date, n: number) => {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  };

  return {
    masuk: [
      { id: 1, nomor: "SM/001/X/2024", tanggal: fmt(today), perihal: "Undangan Rapat Koordinasi", pihak: "Dinas Pendidikan", status: "Diterima" },
      { id: 2, nomor: "SM/002/X/2024", tanggal: fmt(addDays(today, -2)), perihal: "Penawaran Jasa IT", pihak: "PT Solusi Digital", status: "Didisposisikan" },
      { id: 3, nomor: "SM/003/X/2024", tanggal: fmt(addDays(today, -5)), perihal: "Laporan Keuangan Q3", pihak: "Internal Keuangan", status: "Dalam Proses" },
    ],
    keluar: [
      { id: 101, nomor: "SK/045/X/2024", tanggal: fmt(today), perihal: "Pengesahan Anggaran", pihak: "Direktur Utama", status: "Draft" },
      { id: 102, nomor: "SK/044/X/2024", tanggal: fmt(addDays(today, -1)), perihal: "Balasan Kerjasama", pihak: "PT Maju Jaya", status: "Terkirim" },
    ],
    reimburse: [
      { id: 501, tanggal: fmt(addDays(today, -1)), kategori: "Transport", keterangan: "Ojek online ke kantor cabang", jumlah: 45000, status: "Draft" },
      { id: 502, tanggal: fmt(addDays(today, -3)), kategori: "Makan", keterangan: "Konsumsi rapat klien", jumlah: 250000, status: "Disetujui" },
      { id: 503, tanggal: fmt(addDays(today, -7)), kategori: "Akomodasi", keterangan: "Hotel dinas luar kota", jumlah: 850000, status: "Dibayar" },
    ],
    logs: [`${new Date().toLocaleTimeString()} - Admin tambah surat SM/001`, `${new Date().toLocaleTimeString()} - Staff ajukan reimburse transport`],
  };
};

export const useAppData = () => {
  const [data, setData] = useState<AppState>({
    masuk: [],
    keluar: [],
    reimburse: [],
    logs: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      const dummy = getDummyData();
      setData(dummy);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dummy));
    }
  }, []);

  const saveData = (newData: AppState) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const resetData = () => {
    const dummy = getDummyData();
    saveData(dummy);
  };

  const addLog = (message: string) => {
    const newLogs = [...data.logs, `${new Date().toLocaleTimeString()} - ${message}`];
    const newData = { ...data, logs: newLogs };
    saveData(newData);
  };

  // Surat operations
  const addSurat = (type: 'masuk' | 'keluar', surat: Surat) => {
    const newData = {
      ...data,
      [type]: [...data[type], surat],
    };
    addLog(`Tambah surat ${type} ${surat.nomor}`);
    saveData(newData);
  };

  const updateSurat = (type: 'masuk' | 'keluar', surat: Surat) => {
    const newData = {
      ...data,
      [type]: data[type].map(s => s.id === surat.id ? surat : s),
    };
    addLog(`Edit surat ${type} ${surat.nomor}`);
    saveData(newData);
  };

  const deleteSurat = (type: 'masuk' | 'keluar', id: number) => {
    const surat = data[type].find(s => s.id === id);
    const newData = {
      ...data,
      [type]: data[type].filter(s => s.id !== id),
    };
    addLog(`Hapus ${type} ${surat?.nomor}`);
    saveData(newData);
  };

  // Reimbursement operations
  const addReimbursement = (reimbursement: Reimbursement) => {
    const newData = {
      ...data,
      reimburse: [...data.reimburse, reimbursement],
    };
    addLog(`Ajukan reimburse ${reimbursement.kategori}`);
    saveData(newData);
  };

  const updateReimbursement = (reimbursement: Reimbursement) => {
    const newData = {
      ...data,
      reimburse: data.reimburse.map(r => r.id === reimbursement.id ? reimbursement : r),
    };
    addLog(`Edit reimburse ${reimbursement.keterangan}`);
    saveData(newData);
  };

  const deleteReimbursement = (id: number) => {
    const newData = {
      ...data,
      reimburse: data.reimburse.filter(r => r.id !== id),
    };
    addLog(`Hapus reimburse`);
    saveData(newData);
  };

  return {
    data,
    resetData,
    addSurat,
    updateSurat,
    deleteSurat,
    addReimbursement,
    updateReimbursement,
    deleteReimbursement,
  };
};
