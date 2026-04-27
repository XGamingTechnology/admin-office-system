import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SuratStatus {
  PENDING = 'pending',
  PROSES = 'proses',
  SELESAI = 'selesai',
}

@Entity('surat_keluar')
export class SuratKeluar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nomorSurat: string;

  @Column()
  tujuanSurat: string;

  @Column()
  perihal: string;

  @Column({ type: 'date' })
  tanggalSurat: Date;

  @Column({ type: 'date', nullable: true })
  tanggalKirim: Date;

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
