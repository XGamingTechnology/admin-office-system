// src/office/reimbursement/reimbursement.service.ts
import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reimbursement, ReimbursementStatus } from "./entities/reimbursement.entity";
import { CreateReimbursementDto, UpdateReimbursementDto, ApproveReimbursementDto } from "./dto/reimbursement.dto";

@Injectable()
export class ReimbursementService {
  constructor(
    @InjectRepository(Reimbursement)
    private reimbursementRepository: Repository<Reimbursement>
  ) {}

  // ✅ CREATE: Support createdBy & fileUrl
  async create(createReimbursementDto: CreateReimbursementDto & { createdBy?: string; fileUrl?: string }): Promise<Reimbursement> {
    const reimbursement = this.reimbursementRepository.create({
      ...createReimbursementDto,
      createdBy: createReimbursementDto.createdBy,
      receiptUrl: createReimbursementDto.fileUrl, // Map fileUrl to receiptUrl
      // status defaults to PENDING via entity @Column({ default: ... })
    });
    return this.reimbursementRepository.save(reimbursement);
  }

  // ✅ READ ALL: Return all (for admin)
  async findAll(): Promise<Reimbursement[]> {
    return this.reimbursementRepository.find({ order: { createdAt: "DESC" } });
  }

  // ✅ READ BY USER: Filter by createdBy (for non-admin)
  async findAllByUser(userId: string): Promise<Reimbursement[]> {
    return this.reimbursementRepository.find({
      where: { createdBy: userId },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string): Promise<Reimbursement> {
    const reimbursement = await this.reimbursementRepository.findOne({ where: { id } });
    if (!reimbursement) {
      throw new NotFoundException(`Reimbursement with ID ${id} not found`);
    }
    return reimbursement;
  }

  // ✅ UPDATE: Support fileUrl
  async update(id: string, updateReimbursementDto: UpdateReimbursementDto & { fileUrl?: string }): Promise<Reimbursement> {
    const reimbursement = await this.findOne(id);

    // Handle fileUrl update
    if (updateReimbursementDto.fileUrl) {
      reimbursement.receiptUrl = updateReimbursementDto.fileUrl;
    }

    // Update other fields (excluding fileUrl which we handled above)
    const { fileUrl, ...updateData } = updateReimbursementDto;
    Object.assign(reimbursement, updateData);

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

  // ✅ STATISTICS: Type-safe enum queries
  async getStatistics() {
    const total = await this.reimbursementRepository.count();

    // Use enum values directly for type safety
    const pending = await this.reimbursementRepository.count({
      where: { status: ReimbursementStatus.PENDING },
    });
    const approved = await this.reimbursementRepository.count({
      where: { status: ReimbursementStatus.APPROVED },
    });
    const rejected = await this.reimbursementRepository.count({
      where: { status: ReimbursementStatus.REJECTED },
    });
    const paid = await this.reimbursementRepository.count({
      where: { status: ReimbursementStatus.PAID },
    });

    const totalAmountResult = await this.reimbursementRepository
      .createQueryBuilder("reimbursement")
      .select("SUM(reimbursement.amount)", "total")
      .where("reimbursement.status IN (:...statuses)", {
        statuses: [ReimbursementStatus.APPROVED, ReimbursementStatus.PAID],
      })
      .getRawOne();

    return {
      total,
      pending,
      approved,
      rejected,
      paid,
      totalAmount: parseFloat(totalAmountResult?.total) || 0,
    };
  }
}
