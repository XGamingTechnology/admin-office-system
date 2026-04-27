import { IsNotEmpty, IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { SuratStatus } from '../entities/surat-masuk.entity';

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
  @IsDateString()
  tanggalSurat: string;

  @IsOptional()
  @IsDateString()
  tanggalDiterima?: string;

  @IsOptional()
  @IsString()
  disposisi?: string;

  @IsOptional()
  @IsString()
  catatan?: string;
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
  @IsDateString()
  tanggalSurat?: string;

  @IsOptional()
  @IsEnum(SuratStatus)
  status?: SuratStatus;

  @IsOptional()
  @IsString()
  disposisi?: string;

  @IsOptional()
  @IsString()
  catatan?: string;
}
