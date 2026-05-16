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
exports.ReimbursementController = void 0;
const common_1 = require("@nestjs/common");
const reimbursement_service_1 = require("./reimbursement.service");
const reimbursement_dto_1 = require("./dto/reimbursement.dto");
let ReimbursementController = class ReimbursementController {
    constructor(reimbursementService) {
        this.reimbursementService = reimbursementService;
    }
    create(createReimbursementDto) {
        return this.reimbursementService.create(createReimbursementDto);
    }
    findAll() {
        return this.reimbursementService.findAll();
    }
    getStatistics() {
        return this.reimbursementService.getStatistics();
    }
    findOne(id) {
        return this.reimbursementService.findOne(id);
    }
    update(id, updateReimbursementDto) {
        return this.reimbursementService.update(id, updateReimbursementDto);
    }
    approve(id, approveDto) {
        return this.reimbursementService.approve(id, approveDto, 'admin');
    }
    remove(id) {
        return this.reimbursementService.remove(id);
    }
};
exports.ReimbursementController = ReimbursementController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reimbursement_dto_1.CreateReimbursementDto]),
    __metadata("design:returntype", void 0)
], ReimbursementController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReimbursementController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReimbursementController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReimbursementController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reimbursement_dto_1.UpdateReimbursementDto]),
    __metadata("design:returntype", void 0)
], ReimbursementController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reimbursement_dto_1.ApproveReimbursementDto]),
    __metadata("design:returntype", void 0)
], ReimbursementController.prototype, "approve", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReimbursementController.prototype, "remove", null);
exports.ReimbursementController = ReimbursementController = __decorate([
    (0, common_1.Controller)('office/reimbursements'),
    __metadata("design:paramtypes", [reimbursement_service_1.ReimbursementService])
], ReimbursementController);
//# sourceMappingURL=reimbursement.controller.js.map