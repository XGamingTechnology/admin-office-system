import { ReimbursementStatus } from '../entities/reimbursement.entity';
export declare class CreateReimbursementDto {
    employeeName: string;
    department: string;
    description: string;
    amount: number;
    expenseDate: string;
    notes?: string;
}
export declare class UpdateReimbursementDto {
    employeeName?: string;
    department?: string;
    description?: string;
    amount?: number;
    expenseDate?: string;
    status?: ReimbursementStatus;
    notes?: string;
    approvedBy?: string;
}
export declare class ApproveReimbursementDto {
    status: ReimbursementStatus;
    notes?: string;
}
