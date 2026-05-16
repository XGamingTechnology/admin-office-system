import { SuratStatus } from '../entities/surat-masuk.entity';
export declare class CreateSuratMasukDto {
    nomorSurat: string;
    asalSurat: string;
    perihal: string;
    tanggalSurat: string;
    tanggalDiterima?: string;
    disposisi?: string;
    catatan?: string;
}
export declare class UpdateSuratMasukDto {
    nomorSurat?: string;
    asalSurat?: string;
    perihal?: string;
    tanggalSurat?: string;
    status?: SuratStatus;
    disposisi?: string;
    catatan?: string;
}
