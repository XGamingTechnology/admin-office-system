export interface Surat {
  id: number;
  nomor: string;
  tanggal: string;
  perihal: string;
  pihak: string;
  status: string;
}

export interface Reimbursement {
  id: number;
  tanggal: string;
  kategori: string;
  keterangan: string;
  jumlah: number;
  status: string;
}

export interface LogEntry {
  timestamp: string;
  message: string;
}

export interface AppState {
  masuk: Surat[];
  keluar: Surat[];
  reimburse: Reimbursement[];
  logs: string[];
}
