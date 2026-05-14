// src/types.ts

// ✅ Surat: untuk Surat Masuk & Surat Keluar
export interface Surat {
  id: string; // ← UUID string dari backend (BUKAN number!)
  nomor: string;
  tanggal: string; // Format: 'YYYY-MM-DD'
  perihal: string;
  pihak: string; // pengirim (masuk) / tujuan (keluar)
  status: "Diterima" | "Didisposisikan" | "Dalam Proses" | "Selesai" | "Draft" | "Terkirim";
  createdAt?: string; // ISO string dari backend
  updatedAt?: string;
}

// ✅ Reimbursement
export interface Reimbursement {
  id: string; // ← UUID string dari backend!
  tanggal: string; // Format: 'YYYY-MM-DD'
  kategori: "Transport" | "Makan" | "Akomodasi" | "Operasional" | "Lainnya";
  keterangan: string;
  jumlah: number; // Dalam Rupiah (integer)
  status: "Draft" | "Disetujui" | "Ditolak" | "Dibayar";
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Dashboard data shape
export interface DashboardData {
  masuk: Surat[];
  keluar: Surat[];
  reimburse: Reimbursement[];
  logs: string[];
}

// ✅ User (dari auth)
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
}

// ✅ FIX: Type alias untuk kompatibilitas dengan useAppData.ts (legacy hook)
export type AppState = DashboardData;

// ✅ Optional: Helper types untuk form data (tanpa id & timestamps)
export type SuratFormData = Omit<Surat, "id" | "createdAt" | "updatedAt">;
export type ReimbursementFormData = Omit<Reimbursement, "id" | "createdAt" | "updatedAt">;
