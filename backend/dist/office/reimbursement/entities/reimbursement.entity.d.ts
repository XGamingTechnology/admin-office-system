export declare enum ReimbursementStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    PAID = "paid"
}
export declare class Reimbursement {
    id: string;
    employeeName: string;
    department: string;
    description: string;
    amount: number;
    expenseDate: Date;
    status: ReimbursementStatus;
    receiptUrl: string;
    notes: string;
    approvedBy: string;
    approvedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
