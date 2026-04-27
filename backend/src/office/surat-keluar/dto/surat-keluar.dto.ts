import { IsNotEmpty, IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { SuratStatus } from '../entities/surat-keluar.entity';

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
  @IsDateString()
  tanggalSurat: string;

  @IsOptional()
  @IsDateString()
  tanggalKirim?: string;

  @IsOptional()
  @IsString()
  catatan?: string;
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
  @IsDateString()
  tanggalSurat?: string;

  @IsOptional()
  @IsEnum(SuratStatus)
  status?: SuratStatus;

  @IsOptional()
  @IsDateString()
  tanggalKirim?: string;

  @IsOptional()
  @IsString()
  catatan?: string;
}
