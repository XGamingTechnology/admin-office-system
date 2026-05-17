// src/types.ts

// ==================== FRONTEND TYPES (User-friendly) ====================

// ✅ Surat: untuk Surat Masuk & Surat Keluar (frontend display)
export interface Surat {
  id: string; // UUID string dari backend
  nomor: string; // ← Frontend: 'nomor' (backend: 'nomorSurat')
  tanggal: string; // Format: 'YYYY-MM-DD' (backend: 'tanggalSurat')
  perihal: string;
  pihak: string; // ← Frontend: 'pihak' (backend: 'asalSurat' / 'tujuanSurat')
  status: "Diterima" | "Didisposisikan" | "Dalam Proses" | "Selesai" | "Draft" | "Terkirim";
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Reimbursement (UPDATED - sesuai backend API response)
export interface Reimbursement {
  id: string; // UUID string dari backend

  // Frontend fields (untuk display)
  tanggal: string; // Format: 'YYYY-MM-DD' (backend: 'expenseDate')
  kategori: "Transport" | "Makan" | "Akomodasi" | "Operasional" | "Lainnya";
  keterangan: string;
  jumlah: number;
  status: "Draft" | "Disetujui" | "Ditolak" | "Dibayar" | "pending"; // ← Tambahkan "pending"

  // Backend fields (untuk internal processing & API)
  employeeName?: string; // ← TAMBAHKAN
  department?: string; // ← TAMBAHKAN (mapped from kategori)
  description?: string; // ← TAMBAHKAN (mapped from keterangan)
  amount?: number; // ← TAMBAHKAN (mapped from jumlah)
  expenseDate?: string; // ← TAMBAHKAN (mapped from tanggal)
  receiptUrl?: string | null; // ← TAMBAHKAN (untuk gambar/PDF bukti)
  notes?: string | null; // ← TAMBAHKAN
  approvedBy?: string | null; // ← TAMBAHKAN
  approvedAt?: string | null; // ← TAMBAHKAN

  // Timestamps
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
  role: "Admin" | "Client" | string; // 👈 TAMBAHKAN INI
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Type alias untuk kompatibilitas legacy
export type AppState = DashboardData;

// ✅ Helper types untuk form data (tanpa id & timestamps)
export type SuratFormData = Omit<Surat, "id" | "createdAt" | "updatedAt">;
export type ReimbursementFormData = Omit<Reimbursement, "id" | "createdAt" | "updatedAt" | "employeeName" | "department" | "description" | "amount" | "expenseDate" | "receiptUrl" | "notes" | "approvedBy" | "approvedAt">;

// ==================== STATUS MAPPINGS ====================

// 🔄 Surat Status: Backend enum → Frontend display
export const mapSuratStatusToFrontend = (backendStatus: string): Surat["status"] => {
  const map: Record<string, Surat["status"]> = {
    pending: "Diterima",
    proses: "Dalam Proses",
    selesai: "Selesai",
  };
  return map[backendStatus] || "Diterima";
};

// 🔄 Surat Status: Frontend display → Backend enum
export const mapSuratStatusToBackend = (frontendStatus: Surat["status"]): string => {
  const map: Record<Surat["status"], string> = {
    Diterima: "pending",
    Didisposisikan: "proses",
    "Dalam Proses": "proses",
    Selesai: "selesai",
    Draft: "pending",
    Terkirim: "selesai",
  };
  return map[frontendStatus] || "pending";
};

// 🔄 Reimbursement Status: Backend enum → Frontend display
export const mapReimbursementStatusToFrontend = (backendStatus: string): Reimbursement["status"] => {
  const map: Record<string, Reimbursement["status"]> = {
    pending: "Draft", // atau "pending" jika mau tampil sebagai "pending"
    approved: "Disetujui",
    rejected: "Ditolak",
    paid: "Dibayar",
  };
  return map[backendStatus] || "Draft";
};

// 🔄 Reimbursement Status: Frontend display → Backend enum
export const mapReimbursementStatusToBackend = (frontendStatus: Reimbursement["status"]): string => {
  const map: Record<Reimbursement["status"], string> = {
    Draft: "pending",
    pending: "pending", // ← TAMBAHKAN untuk handle "pending"
    Disetujui: "approved",
    Ditolak: "rejected",
    Dibayar: "paid",
  };
  return map[frontendStatus] || "pending";
};

// 🔄 Kategori ↔ Department mapping
export const mapKategoriToDepartment = (kategori: string): string => {
  const map: Record<string, string> = {
    Transport: "Transportasi",
    Makan: "Makan & Minum",
    Akomodasi: "Akomodasi",
    Operasional: "Operasional Kantor",
    Lainnya: "Lain-lain",
  };
  return map[kategori] || kategori;
};

export const mapDepartmentToKategori = (department: string): string => {
  const map: Record<string, string> = {
    Transportasi: "Transport",
    "Makan & Minum": "Makan",
    Akomodasi: "Akomodasi",
    "Operasional Kantor": "Operasional",
    "Lain-lain": "Lainnya",
  };
  return map[department] || "Lainnya";
};

// ==================== SURAT MASUK: Backend ↔ Frontend ====================

// Backend API response → Frontend type (for GET/fetch)
export const mapSuratMasukBackendToFrontend = (backend: any): Surat => ({
  id: backend.id,
  nomor: backend.nomorSurat,
  tanggal: backend.tanggalSurat,
  perihal: backend.perihal,
  pihak: backend.asalSurat,
  status: mapSuratStatusToFrontend(backend.status),
  createdAt: backend.createdAt,
  updatedAt: backend.updatedAt,
});

// ✅ Frontend → Backend for CREATE (NO status field - backend sets default)
export const mapSuratMasukFrontendToBackend = (frontend: Omit<Surat, "id">) => ({
  nomorSurat: frontend.nomor,
  asalSurat: frontend.pihak,
  perihal: frontend.perihal,
  tanggalSurat: frontend.tanggal,
});

// ✅ Frontend → Backend for UPDATE (CAN include status)
export const mapSuratMasukFrontendToBackendForUpdate = (frontend: Surat) => ({
  nomorSurat: frontend.nomor,
  asalSurat: frontend.pihak,
  perihal: frontend.perihal,
  tanggalSurat: frontend.tanggal,
  status: mapSuratStatusToBackend(frontend.status),
});

// ==================== SURAT KELUAR: Backend ↔ Frontend ====================

// Backend API response → Frontend type
export const mapSuratKeluarBackendToFrontend = (backend: any): Surat => ({
  id: backend.id,
  nomor: backend.nomorSurat,
  tanggal: backend.tanggalSurat,
  perihal: backend.perihal,
  pihak: backend.tujuanSurat,
  status: mapSuratStatusToFrontend(backend.status),
  createdAt: backend.createdAt,
  updatedAt: backend.updatedAt,
});

// ✅ Frontend → Backend for CREATE (NO status field - backend sets default)
export const mapSuratKeluarFrontendToBackend = (frontend: Omit<Surat, "id">) => {
  const result: any = {
    nomorSurat: frontend.nomor,
    tujuanSurat: frontend.pihak,
    perihal: frontend.perihal,
    tanggalSurat: frontend.tanggal,
  };
  return result;
};

// ✅ Frontend → Backend for UPDATE (CAN include status)
export const mapSuratKeluarFrontendToBackendForUpdate = (frontend: Surat) => ({
  nomorSurat: frontend.nomor,
  tujuanSurat: frontend.pihak,
  perihal: frontend.perihal,
  tanggalSurat: frontend.tanggal,
  status: mapSuratStatusToBackend(frontend.status),
});

// ==================== REIMBURSEMENT: Backend ↔ Frontend ====================

// Backend API response → Frontend type
export const mapReimbursementBackendToFrontend = (backend: any): Reimbursement => ({
  // Frontend fields
  id: backend.id,
  tanggal: backend.expenseDate,
  kategori: mapDepartmentToKategori(backend.department) as Reimbursement["kategori"],
  keterangan: backend.description,
  jumlah: backend.amount,
  status: mapReimbursementStatusToFrontend(backend.status),

  // Backend fields (simpan untuk keperluan internal)
  employeeName: backend.employeeName,
  department: backend.department,
  description: backend.description,
  amount: backend.amount,
  expenseDate: backend.expenseDate,
  receiptUrl: backend.receiptUrl,
  notes: backend.notes,
  approvedBy: backend.approvedBy,
  approvedAt: backend.approvedAt,

  // Timestamps
  createdAt: backend.createdAt,
  updatedAt: backend.updatedAt,
});

// ✅ Frontend → Backend for CREATE (NO status field - backend sets default: PENDING)
export const mapReimbursementFrontendToBackend = (frontend: Omit<Reimbursement, "id">) => ({
  employeeName: frontend.employeeName || "Admin", // atau ambil dari currentUser
  department: mapKategoriToDepartment(frontend.kategori),
  description: frontend.keterangan,
  amount: frontend.jumlah,
  expenseDate: frontend.tanggal,
  // ❌ NO status field for CREATE
});

// ✅ Frontend → Backend for UPDATE (CAN include status)
export const mapReimbursementFrontendToBackendForUpdate = (frontend: Reimbursement) => ({
  employeeName: frontend.employeeName || "Admin",
  department: mapKategoriToDepartment(frontend.kategori),
  description: frontend.keterangan,
  amount: frontend.jumlah,
  expenseDate: frontend.tanggal,
  status: mapReimbursementStatusToBackend(frontend.status),
  notes: frontend.notes,
  receiptUrl: frontend.receiptUrl,
});
