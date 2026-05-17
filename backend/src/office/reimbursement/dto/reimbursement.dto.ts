// src/office/reimbursement/reimbursement.dto.ts
import { IsNotEmpty, IsString, IsOptional, Matches, IsNumber, IsEnum, Min } from "class-validator";
import { Transform } from "class-transformer";
import { ReimbursementStatus } from "../entities/reimbursement.entity";

export class CreateReimbursementDto {
  @IsNotEmpty()
  @IsString()
  employeeName: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    // ← ← ← FIX: Terima format YYYY-MM-DD dari HTML input
    message: "expenseDate must be in YYYY-MM-DD format",
  })
  expenseDate: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}

export class UpdateReimbursementDto {
  @IsOptional()
  @IsString()
  employeeName?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    // ← ← ← FIX
    message: "expenseDate must be in YYYY-MM-DD format",
  })
  expenseDate?: string;

  @IsOptional()
  @IsEnum(ReimbursementStatus)
  status?: ReimbursementStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  approvedBy?: string;
}

export class ApproveReimbursementDto {
  @IsNotEmpty()
  @IsEnum(ReimbursementStatus)
  status: ReimbursementStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
