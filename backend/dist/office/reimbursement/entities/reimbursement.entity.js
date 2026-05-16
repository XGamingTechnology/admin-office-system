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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reimbursement = exports.ReimbursementStatus = void 0;
const typeorm_1 = require("typeorm");
var ReimbursementStatus;
(function (ReimbursementStatus) {
    ReimbursementStatus["PENDING"] = "pending";
    ReimbursementStatus["APPROVED"] = "approved";
    ReimbursementStatus["REJECTED"] = "rejected";
    ReimbursementStatus["PAID"] = "paid";
})(ReimbursementStatus || (exports.ReimbursementStatus = ReimbursementStatus = {}));
let Reimbursement = class Reimbursement {
};
exports.Reimbursement = Reimbursement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Reimbursement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reimbursement.prototype, "employeeName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reimbursement.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reimbursement.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Reimbursement.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Reimbursement.prototype, "expenseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReimbursementStatus,
        default: ReimbursementStatus.PENDING,
    }),
    __metadata("design:type", String)
], Reimbursement.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reimbursement.prototype, "receiptUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reimbursement.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reimbursement.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Reimbursement.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Reimbursement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Reimbursement.prototype, "updatedAt", void 0);
exports.Reimbursement = Reimbursement = __decorate([
    (0, typeorm_1.Entity)('reimbursements')
], Reimbursement);
//# sourceMappingURL=reimbursement.entity.js.map