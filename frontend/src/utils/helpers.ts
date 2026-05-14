// src/utils/helpers.ts

// Format Rupiah (IDR)
export const fmtRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date untuk display (ISO → 'DD MMM YYYY')
export const fmtDate = (isoString?: string): string => {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Status badge colors (Tailwind classes)
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    // Surat statuses
    Diterima: "bg-blue-100 text-blue-800",
    Didisposisikan: "bg-purple-100 text-purple-800",
    "Dalam Proses": "bg-yellow-100 text-yellow-800",
    Selesai: "bg-green-100 text-green-800",
    Draft: "bg-gray-100 text-gray-800",
    Terkirim: "bg-emerald-100 text-emerald-800",
    // Reimbursement statuses
    Disetujui: "bg-green-100 text-green-800",
    Ditolak: "bg-red-100 text-red-800",
    Dibayar: "bg-emerald-100 text-emerald-800",
    Menunggu: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};
