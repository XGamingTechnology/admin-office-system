export declare enum SuratStatus {
    PENDING = "pending",
    PROSES = "proses",
    SELESAI = "selesai"
}
export declare class SuratKeluar {
    id: string;
    nomorSurat: string;
    tujuanSurat: string;
    perihal: string;
    tanggalSurat: Date;
    tanggalKirim: Date;
    status: SuratStatus;
    fileUrl: string;
    catatan: string;
    createdAt: Date;
    updatedAt: Date;
}
