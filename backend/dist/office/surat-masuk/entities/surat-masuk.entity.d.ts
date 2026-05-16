export declare enum SuratStatus {
    PENDING = "pending",
    PROSES = "proses",
    SELESAI = "selesai"
}
export declare class SuratMasuk {
    id: string;
    nomorSurat: string;
    asalSurat: string;
    perihal: string;
    tanggalSurat: Date;
    tanggalDiterima: Date;
    disposisi: string;
    status: SuratStatus;
    fileUrl: string;
    catatan: string;
    createdAt: Date;
    updatedAt: Date;
}
