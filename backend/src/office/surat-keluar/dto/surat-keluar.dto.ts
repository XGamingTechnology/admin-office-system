// backend/src/office/surat-keluar/dto/surat-keluar.dto.ts
import { IsNotEmpty, IsString, IsOptional, Matches, IsEnum } from "class-validator";
import { SuratStatus } from "../entities/surat-keluar.entity";

export class CreateSuratKeluarDto {
  @IsNotEmpty()
  @IsString()
  nomorSurat: string;

  @IsNotEmpty()
  @IsString()
  tujuanSurat: string;

  @IsNotEmpty()
  @IsString()
  perihal: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "tanggalSurat must be in YYYY-MM-DD format",
  })
  tanggalSurat: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "tanggalKirim must be in YYYY-MM-DD format",
  })
  tanggalKirim?: string;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  // ✅ TAMBAHKAN: createdBy optional (diisi oleh controller dari JWT)
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdateSuratKeluarDto {
  @IsOptional()
  @IsString()
  nomorSurat?: string;

  @IsOptional()
  @IsString()
  tujuanSurat?: string;

  @IsOptional()
  @IsString()
  perihal?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "tanggalSurat must be in YYYY-MM-DD format",
  })
  tanggalSurat?: string;

  @IsOptional()
  @IsEnum(SuratStatus)
  status?: SuratStatus;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "tanggalKirim must be in YYYY-MM-DD format",
  })
  tanggalKirim?: string;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
