// backend/src/office/surat-keluar/entities/surat-keluar.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum SuratStatus {
  PENDING = "pending",
  PROSES = "proses",
  SELESAI = "selesai",
}

@Entity("surat_keluar")
export class SuratKeluar {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "nomorSurat" })
  nomorSurat: string;

  @Column({ name: "tujuanSurat" })
  tujuanSurat: string;

  @Column({ name: "perihal" })
  perihal: string;

  @Column({ type: "date", name: "tanggalSurat" })
  tanggalSurat: Date;

  @Column({ type: "date", nullable: true, name: "tanggalKirim" })
  tanggalKirim: Date;

  @Column({
    type: "enum",
    enum: SuratStatus,
    default: SuratStatus.PENDING,
    name: "status",
  })
  status: SuratStatus;

  @Column({ name: "fileUrl", nullable: true })
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
