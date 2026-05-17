// src/office/surat-masuk/surat-masuk.dto.ts
import { IsNotEmpty, IsString, IsOptional, Matches, IsEnum } from "class-validator"; // ← ← ← Change: IsDateString → Matches
import { SuratStatus } from "../entities/surat-masuk.entity";

export class CreateSuratMasukDto {
  @IsNotEmpty()
  @IsString()
  nomorSurat: string;

  @IsNotEmpty()
  @IsString()
  asalSurat: string;

  @IsNotEmpty()
  @IsString()
  perihal: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    // ← ← ← FIX: Accept YYYY-MM-DD format from HTML input
    message: "tanggalSurat must be in YYYY-MM-DD format",
  })
  tanggalSurat: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    // ← ← ← FIX: Accept YYYY-MM-DD format
    message: "tanggalDiterima must be in YYYY-MM-DD format",
  })
  tanggalDiterima?: string;

  @IsOptional()
  @IsString()
  disposisi?: string;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string; // ← Optional: for manual URL or Cloudinary upload result
}

export class UpdateSuratMasukDto {
  @IsOptional()
  @IsString()
  nomorSurat?: string;

  @IsOptional()
  @IsString()
  asalSurat?: string;

  @IsOptional()
  @IsString()
  perihal?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    // ← ← ← FIX
    message: "tanggalSurat must be in YYYY-MM-DD format",
  })
  tanggalSurat?: string;

  @IsOptional()
  @IsEnum(SuratStatus)
  status?: SuratStatus;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    // ← ← ← FIX
    message: "tanggalDiterima must be in YYYY-MM-DD format",
  })
  tanggalDiterima?: string;

  @IsOptional()
  @IsString()
  disposisi?: string;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
