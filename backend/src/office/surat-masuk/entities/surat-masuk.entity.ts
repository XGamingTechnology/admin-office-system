import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SuratStatus {
  PENDING = 'pending',
  PROSES = 'proses',
  SELESAI = 'selesai',
}

@Entity('surat_masuk')
export class SuratMasuk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nomorSurat: string;

  @Column()
  asalSurat: string;

  @Column()
  perihal: string;

  @Column({ type: 'date' })
  tanggalSurat: Date;

  @Column({ type: 'date', nullable: true })
  tanggalDiterima: Date;

  @Column({ nullable: true })
  disposisi: string;

  @Column({
    type: 'enum',
    enum: SuratStatus,
    default: SuratStatus.PENDING,
  })
  status: SuratStatus;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ nullable: true })
  catatan: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
