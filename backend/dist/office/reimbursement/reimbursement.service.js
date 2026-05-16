"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReimbursementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reimbursement_entity_1 = require("./entities/reimbursement.entity");
let ReimbursementService = class ReimbursementService {
    constructor(reimbursementRepository) {
        this.reimbursementRepository = reimbursementRepository;
    }
    async create(createReimbursementDto) {
        const reimbursement = this.reimbursementRepository.create(createReimbursementDto);
        return this.reimbursementRepository.save(reimbursement);
    }
    async findAll() {
        return this.reimbursementRepository.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        const reimbursement = await this.reimbursementRepository.findOne({ where: { id } });
        if (!reimbursement) {
            throw new common_1.NotFoundException(`Reimbursement with ID ${id} not found`);
        }
        return reimbursement;
    }
    async update(id, updateReimbursementDto) {
        const reimbursement = await this.findOne(id);
        Object.assign(reimbursement, updateReimbursementDto);
        return this.reimbursementRepository.save(reimbursement);
    }
    async approve(id, approveDto, approvedBy) {
        const reimbursement = await this.findOne(id);
        reimbursement.status = approveDto.status;
        reimbursement.approvedBy = approvedBy;
        reimbursement.approvedAt = new Date();
        if (approveDto.notes) {
            reimbursement.notes = approveDto.notes;
        }
        return this.reimbursementRepository.save(reimbursement);
    }
    async remove(id) {
        const reimbursement = await this.findOne(id);
        await this.reimbursementRepository.remove(reimbursement);
    }
    async getStatistics() {
        const total = await this.reimbursementRepository.count();
        const pending = await this.reimbursementRepository.count({ where: { status: reimbursement_entity_1.ReimbursementStatus.PENDING } });
        const approved = await this.reimbursementRepository.count({ where: { status: reimbursement_entity_1.ReimbursementStatus.APPROVED } });
        const rejected = await this.reimbursementRepository.count({ where: { status: reimbursement_entity_1.ReimbursementStatus.REJECTED } });
        const paid = await this.reimbursementRepository.count({ where: { status: reimbursement_entity_1.ReimbursementStatus.PAID } });
        const totalAmountResult = await this.reimbursementRepository
            .createQueryBuilder('reimbursement')
            .select('SUM(reimbursement.amount)', 'total')
            .where('reimbursement.status IN (:...statuses)', { statuses: [reimbursement_entity_1.ReimbursementStatus.APPROVED, reimbursement_entity_1.ReimbursementStatus.PAID] })
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
};
exports.ReimbursementService = ReimbursementService;
exports.ReimbursementService = ReimbursementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reimbursement_entity_1.Reimbursement)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReimbursementService);
//# sourceMappingURL=reimbursement.service.js.map