import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reimbursement, ReimbursementStatus } from './entities/reimbursement.entity';
import { CreateReimbursementDto, UpdateReimbursementDto, ApproveReimbursementDto } from './dto/reimbursement.dto';

@Injectable()
export class ReimbursementService {
  constructor(
    @InjectRepository(Reimbursement)
    private reimbursementRepository: Repository<Reimbursement>,
  ) {}

  async create(createReimbursementDto: CreateReimbursementDto): Promise<Reimbursement> {
    const reimbursement = this.reimbursementRepository.create(createReimbursementDto);
    return this.reimbursementRepository.save(reimbursement);
  }

  async findAll(): Promise<Reimbursement[]> {
    return this.reimbursementRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Reimbursement> {
    const reimbursement = await this.reimbursementRepository.findOne({ where: { id } });
    if (!reimbursement) {
      throw new NotFoundException(`Reimbursement with ID ${id} not found`);
    }
    return reimbursement;
  }

  async update(id: string, updateReimbursementDto: UpdateReimbursementDto): Promise<Reimbursement> {
    const reimbursement = await this.findOne(id);
    Object.assign(reimbursement, updateReimbursementDto);
    return this.reimbursementRepository.save(reimbursement);
  }

  async approve(id: string, approveDto: ApproveReimbursementDto, approvedBy: string): Promise<Reimbursement> {
    const reimbursement = await this.findOne(id);
    reimbursement.status = approveDto.status;
    reimbursement.approvedBy = approvedBy;
    reimbursement.approvedAt = new Date();
    if (approveDto.notes) {
      reimbursement.notes = approveDto.notes;
    }
    return this.reimbursementRepository.save(reimbursement);
  }

  async remove(id: string): Promise<void> {
    const reimbursement = await this.findOne(id);
    await this.reimbursementRepository.remove(reimbursement);
  }

  async getStatistics() {
    const total = await this.reimbursementRepository.count();
    const pending = await this.reimbursementRepository.count({ where: { status: ReimbursementStatus.PENDING } });
    const approved = await this.reimbursementRepository.count({ where: { status: ReimbursementStatus.APPROVED } });
    const rejected = await this.reimbursementRepository.count({ where: { status: ReimbursementStatus.REJECTED } });
    const paid = await this.reimbursementRepository.count({ where: { status: ReimbursementStatus.PAID } });
    
    const totalAmountResult = await this.reimbursementRepository
      .createQueryBuilder('reimbursement')
      .select('SUM(reimbursement.amount)', 'total')
      .where('reimbursement.status IN (:...statuses)', { statuses: [ReimbursementStatus.APPROVED, ReimbursementStatus.PAID] })
      .getRawOne();
    
    return { 
      total, 
      pending, 
      approved, 
      rejected, 
      paid,
      totalAmount: parseFloat(totalAmountResult.total) || 0
    };
  }
}
