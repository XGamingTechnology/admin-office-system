import { SuratStatus } from '../entities/surat-keluar.entity';
export declare class CreateSuratKeluarDto {
    nomorSurat: string;
    tujuanSurat: string;
    perihal: string;
    tanggalSurat: string;
    tanggalKirim?: string;
    catatan?: string;
}
export declare class UpdateSuratKeluarDto {
    nomorSurat?: string;
    tujuanSurat?: string;
    perihal?: string;
    tanggalSurat?: string;
    status?: SuratStatus;
    tanggalKirim?: string;
    catatan?: string;
}
