import { Repository } from 'typeorm';
import { Reimbursement } from './entities/reimbursement.entity';
import { CreateReimbursementDto, UpdateReimbursementDto, ApproveReimbursementDto } from './dto/reimbursement.dto';
export declare class ReimbursementService {
    private reimbursementRepository;
    constructor(reimbursementRepository: Repository<Reimbursement>);
    create(createReimbursementDto: CreateReimbursementDto): Promise<Reimbursement>;
    findAll(): Promise<Reimbursement[]>;
    findOne(id: string): Promise<Reimbursement>;
    update(id: string, updateReimbursementDto: UpdateReimbursementDto): Promise<Reimbursement>;
    approve(id: string, approveDto: ApproveReimbursementDto, approvedBy: string): Promise<Reimbursement>;
    remove(id: string): Promise<void>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        paid: number;
        totalAmount: number;
    }>;
}
