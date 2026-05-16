import { ReimbursementService } from './reimbursement.service';
import { CreateReimbursementDto, UpdateReimbursementDto, ApproveReimbursementDto } from './dto/reimbursement.dto';
export declare class ReimbursementController {
    private readonly reimbursementService;
    constructor(reimbursementService: ReimbursementService);
    create(createReimbursementDto: CreateReimbursementDto): Promise<import("./entities/reimbursement.entity").Reimbursement>;
    findAll(): Promise<import("./entities/reimbursement.entity").Reimbursement[]>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        paid: number;
        totalAmount: number;
    }>;
    findOne(id: string): Promise<import("./entities/reimbursement.entity").Reimbursement>;
    update(id: string, updateReimbursementDto: UpdateReimbursementDto): Promise<import("./entities/reimbursement.entity").Reimbursement>;
    approve(id: string, approveDto: ApproveReimbursementDto): Promise<import("./entities/reimbursement.entity").Reimbursement>;
    remove(id: string): Promise<void>;
}
