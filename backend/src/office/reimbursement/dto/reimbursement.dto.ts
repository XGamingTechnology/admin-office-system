import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, IsEnum, Min } from 'class-validator';
import { ReimbursementStatus } from '../entities/reimbursement.entity';

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
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  expenseDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
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
  @IsDateString()
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
