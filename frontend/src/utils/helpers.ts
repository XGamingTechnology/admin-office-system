export const fmtRupiah = (n: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(n);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getStatusColor = (status: string): string => {
  const badgeColor: Record<string, string> = {
    Diterima: "bg-blue-100 text-blue-800",
    Draft: "bg-gray-100 text-gray-800",
    Didisposisikan: "bg-yellow-100 text-yellow-800",
    "Dalam Proses": "bg-orange-100 text-orange-800",
    Selesai: "bg-green-100 text-green-800",
    Disetujui: "bg-purple-100 text-purple-800",
    Terkirim: "bg-green-100 text-green-800",
    Menunggu: "bg-gray-100 text-gray-800",
    Ditolak: "bg-red-100 text-red-800",
    Dibayar: "bg-emerald-100 text-emerald-800",
  };
  return badgeColor[status] || "bg-gray-100 text-gray-800";
};
