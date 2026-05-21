// backend/src/office/reimbursement/entities/reimbursement.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum ReimbursementStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  PAID = "paid",
}

@Entity("reimbursements")
export class Reimbursement {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "employeeName" })
  employeeName: string;

  @Column({ name: "department" })
  department: string;

  @Column({ name: "description" })
  description: string;

  @Column("decimal", { precision: 10, scale: 2, name: "amount" })
  amount: number;

  @Column({ type: "date", name: "expenseDate" })
  expenseDate: Date;

  @Column({
    type: "enum",
    enum: ReimbursementStatus,
    default: ReimbursementStatus.PENDING,
    name: "status",
  })
  status: ReimbursementStatus;

  @Column({ nullable: true, name: "receiptUrl" })
  receiptUrl: string;

  @Column({ nullable: true, name: "notes" })
  notes: string;

  @Column({ nullable: true, name: "approvedBy" })
  approvedBy: string;

  @Column({ type: "date", nullable: true, name: "approvedAt" })
  approvedAt: Date;

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;

  // ✅ FIX: Gunakan snake_case column name (match database)
  @Column({ name: "created_by", nullable: true })
  createdBy: string;
}
