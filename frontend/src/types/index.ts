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
  fileUrl?: string | null; // ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←......
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
  receiptUrl?: string | null; // ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←......
  notes?: string;
  approvedBy?: string;
  createdBy?: string | null;
  approvedAt?: string;
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

// ✅ User type untuk Admin Control (dengan role)
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user"; // ← ← ← WAJIB ADA
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ✅ Payload types untuk Admin Control forms
export interface CreateUserPayload {
  email: string;
  name?: string;
  password: string;
  role?: "admin" | "user";
}

export interface UpdateUserPayload {
  name?: string;
  role?: "admin" | "user";
  isActive?: boolean;
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

// Backend API response → Frontend type (for GET/fetch)
export const mapSuratMasukBackendToFrontend = (backend: any): Surat => ({
  id: backend.id,
  nomor: backend.nomorSurat,
  tanggal: backend.tanggalSurat,
  perihal: backend.perihal,
  pihak: backend.asalSurat,
  status: mapSuratStatusToFrontend(backend.status),
  fileUrl: backend.fileUrl || backend.file_url || null, // ← ← ← Handle both naming conventions
  createdAt: backend.createdAt,
  updatedAt: backend.updatedAt,
});

// ✅ Frontend → Backend for CREATE (NO status field - backend sets default)
export const mapSuratMasukFrontendToBackend = (frontend: Omit<Surat, "id">) => ({
  nomorSurat: frontend.nomor,
  asalSurat: frontend.pihak,
  perihal: frontend.perihal,
  tanggalSurat: frontend.tanggal,
  fileUrl: frontend.fileUrl || null, // ← ← ← Include fileUrl
  // ❌ NO status field for CREATE
});

// ✅ Frontend → Backend for UPDATE (CAN include status)
export const mapSuratMasukFrontendToBackendForUpdate = (frontend: Surat) => ({
  nomorSurat: frontend.nomor,
  asalSurat: frontend.pihak,
  perihal: frontend.perihal,
  tanggalSurat: frontend.tanggal,
  fileUrl: frontend.fileUrl || null, // ← ← ← Include fileUrl
  status: mapSuratStatusToBackend(frontend.status), // ✓ Include status for UPDATE
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
  fileUrl: backend.fileUrl || backend.file_url || null, // ← ← ← Handle both naming conventions
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
    fileUrl: frontend.fileUrl || null, // ← ← ← Include fileUrl
  };
  // Explicitly exclude status for CREATE operations
  return result;
};

// ✅ Frontend → Backend for UPDATE (CAN include status)
export const mapSuratKeluarFrontendToBackendForUpdate = (frontend: Surat) => ({
  nomorSurat: frontend.nomor,
  tujuanSurat: frontend.pihak,
  perihal: frontend.perihal,
  tanggalSurat: frontend.tanggal,
  fileUrl: frontend.fileUrl || null, // ← ← ← Include fileUrl
  status: mapSuratStatusToBackend(frontend.status), // ✓ Include status for UPDATE
});

// ==================== REIMBURSEMENT: Backend ↔ Frontend ====================

// Backend API response → Frontend type
export const mapReimbursementBackendToFrontend = (backend: any): Reimbursement => ({
  id: backend.id,
  tanggal: backend.expenseDate,
  kategori: mapDepartmentToKategori(backend.department) as Reimbursement["kategori"],
  keterangan: backend.description,
  jumlah: backend.amount,
  status: mapReimbursementStatusToFrontend(backend.status),
  receiptUrl: backend.receiptUrl || backend.receipt_url || null, // ← ← ← Handle both naming conventions
  notes: backend.notes,
  approvedBy: backend.approvedBy,
  approvedAt: backend.approvedAt,
  createdAt: backend.createdAt,
  updatedAt: backend.updatedAt,
});

// ✅ Frontend → Backend for CREATE (NO status field - backend sets default: PENDING)
export const mapReimbursementFrontendToBackend = (frontend: Omit<Reimbursement, "id">) => ({
  employeeName: "Admin",
  department: mapKategoriToDepartment(frontend.kategori),
  description: frontend.keterangan,
  amount: frontend.jumlah,
  expenseDate: frontend.tanggal,
  receiptUrl: frontend.receiptUrl || null, // ← ← ← Include receiptUrl
  // ❌ NO status field for CREATE
});

// ✅ Frontend → Backend for UPDATE (CAN include status)
export const mapReimbursementFrontendToBackendForUpdate = (frontend: Reimbursement) => ({
  employeeName: "Admin",
  department: mapKategoriToDepartment(frontend.kategori),
  description: frontend.keterangan,
  amount: frontend.jumlah,
  expenseDate: frontend.tanggal,
  receiptUrl: frontend.receiptUrl || null, // ← ← ← Include receiptUrl
  status: mapReimbursementStatusToBackend(frontend.status), // ✓ Include status for UPDATE
});
