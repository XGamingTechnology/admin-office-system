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

// ✅ Reimbursement (frontend display)
export interface Reimbursement {
  id: string; // UUID string dari backend
  tanggal: string; // Format: 'YYYY-MM-DD' (backend: 'expenseDate')
  kategori: "Transport" | "Makan" | "Akomodasi" | "Operasional" | "Lainnya"; // ← Frontend: 'kategori' (backend: 'department')
  keterangan: string; // ← Frontend: 'keterangan' (backend: 'description')
  jumlah: number; // ← Frontend: 'jumlah' (backend: 'amount')
  status: "Draft" | "Disetujui" | "Ditolak" | "Dibayar"; // ← Frontend status
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

// ✅ Type alias untuk kompatibilitas legacy
export type AppState = DashboardData;

// ✅ Helper types untuk form data (tanpa id & timestamps)
export type SuratFormData = Omit<Surat, "id" | "createdAt" | "updatedAt">;
export type ReimbursementFormData = Omit<Reimbursement, "id" | "createdAt" | "updatedAt">;

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
    pending: "Draft",
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

// Backend API response → Frontend type
export const mapSuratMasukBackendToFrontend = (backend: any): Surat => ({
  id: backend.id,
  nomor: backend.nomorSurat, // backend.nomorSurat → frontend.nomor
  tanggal: backend.tanggalSurat, // backend.tanggalSurat → frontend.tanggal (already 'YYYY-MM-DD')
  perihal: backend.perihal,
  pihak: backend.asalSurat, // backend.asalSurat → frontend.pihak
  status: mapSuratStatusToFrontend(backend.status),
  createdAt: backend.createdAt,
  updatedAt: backend.updatedAt,
});

// Frontend type → Backend API payload (for Create)
export const mapSuratMasukFrontendToBackend = (frontend: Omit<Surat, "id">) => ({
  nomorSurat: frontend.nomor, // frontend.nomor → backend.nomorSurat
  asalSurat: frontend.pihak, // frontend.pihak → backend.asalSurat
  perihal: frontend.perihal,
  tanggalSurat: frontend.tanggal, // frontend.tanggal → backend.tanggalSurat
  status: mapSuratStatusToBackend(frontend.status),
});

// ==================== SURAT KELUAR: Backend ↔ Frontend ====================

// Backend API response → Frontend type
export const mapSuratKeluarBackendToFrontend = (backend: any): Surat => ({
  id: backend.id,
  nomor: backend.nomorSurat,
  tanggal: backend.tanggalSurat,
  perihal: backend.perihal,
  pihak: backend.tujuanSurat, // backend.tujuanSurat → frontend.pihak
  status: mapSuratStatusToFrontend(backend.status),
  createdAt: backend.createdAt,
  updatedAt: backend.updatedAt,
});

// Frontend type → Backend API payload (for Create)
export const mapSuratKeluarFrontendToBackend = (frontend: Omit<Surat, "id">) => ({
  nomorSurat: frontend.nomor,
  tujuanSurat: frontend.pihak, // frontend.pihak → backend.tujuanSurat
  perihal: frontend.perihal,
  tanggalSurat: frontend.tanggal,
  status: mapSuratStatusToBackend(frontend.status),
});

// ==================== REIMBURSEMENT: Backend ↔ Frontend ====================

export const mapReimbursementBackendToFrontend = (backend: any): Reimbursement => ({
  id: backend.id,
  tanggal: backend.expenseDate,
  // ✅ Cast to proper union type
  kategori: mapDepartmentToKategori(backend.department) as Reimbursement["kategori"],
  keterangan: backend.description,
  jumlah: backend.amount,
  status: mapReimbursementStatusToFrontend(backend.status),
  createdAt: backend.createdAt,
  updatedAt: backend.updatedAt,
});
// Frontend type → Backend API payload (for Create)
export const mapReimbursementFrontendToBackend = (frontend: Omit<Reimbursement, "id">) => ({
  employeeName: "Admin", // Default value, or get from auth context
  department: mapKategoriToDepartment(frontend.kategori), // frontend.kategori → backend.department
  description: frontend.keterangan, // frontend.keterangan → backend.description
  amount: frontend.jumlah, // frontend.jumlah → backend.amount
  expenseDate: frontend.tanggal, // frontend.tanggal → backend.expenseDate
  status: mapReimbursementStatusToBackend(frontend.status),
});
