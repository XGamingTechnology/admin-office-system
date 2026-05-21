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

  @Column({ nullable: true, name: "catatan" })
  catatan: string;

  // ⚠️ created_by = snake_case (satu-satunya exception)
  @Column({ name: "created_by", nullable: true })
  createdBy: string;

  // ✅ fileUrl = camelCase (MUST match database EXACT)
  @Column({ name: "fileUrl", nullable: true })
  fileUrl: string;

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;
}
