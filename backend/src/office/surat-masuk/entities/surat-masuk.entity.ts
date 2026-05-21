// backend/src/office/surat-masuk/entities/surat-masuk.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum SuratStatus {
  PENDING = "pending",
  PROSES = "proses",
  SELESAI = "selesai",
}

@Entity("surat_masuk")
export class SuratMasuk {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "nomorSurat" })
  nomorSurat: string;

  @Column({ name: "asalSurat" })
  asalSurat: string;

  @Column({ name: "perihal" })
  perihal: string;

  @Column({ type: "date", name: "tanggalSurat" })
  tanggalSurat: Date;

  @Column({ type: "date", nullable: true, name: "tanggalDiterima" })
  tanggalDiterima: Date;

  @Column({ nullable: true, name: "disposisi" })
  disposisi: string;

  @Column({
    type: "enum",
    enum: SuratStatus,
    default: SuratStatus.PENDING,
    name: "status",
  })
  status: SuratStatus;

  // ✅ FIX: Explicit snake_case column name (match database)
  @Column({ name: "file_url", nullable: true })
  fileUrl: string;

  @Column({ nullable: true, name: "catatan" })
  catatan: string;

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;

  // ✅ FIX: Gunakan snake_case column name (match database)
  @Column({ name: "created_by", nullable: true })
  createdBy: string;
}
