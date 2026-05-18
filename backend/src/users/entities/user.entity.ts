// backend/src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Jangan return password di query biasa
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: "user" })
  role: string; // 'admin' | 'user'

  @Column({ default: true })
  isActive: boolean; // Untuk soft delete/deactivate

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
