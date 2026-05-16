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
exports.SuratKeluar = exports.SuratStatus = void 0;
const typeorm_1 = require("typeorm");
var SuratStatus;
(function (SuratStatus) {
    SuratStatus["PENDING"] = "pending";
    SuratStatus["PROSES"] = "proses";
    SuratStatus["SELESAI"] = "selesai";
})(SuratStatus || (exports.SuratStatus = SuratStatus = {}));
let SuratKeluar = class SuratKeluar {
};
exports.SuratKeluar = SuratKeluar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SuratKeluar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SuratKeluar.prototype, "nomorSurat", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SuratKeluar.prototype, "tujuanSurat", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SuratKeluar.prototype, "perihal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], SuratKeluar.prototype, "tanggalSurat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SuratKeluar.prototype, "tanggalKirim", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SuratStatus,
        default: SuratStatus.PENDING,
    }),
    __metadata("design:type", String)
], SuratKeluar.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SuratKeluar.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SuratKeluar.prototype, "catatan", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SuratKeluar.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SuratKeluar.prototype, "updatedAt", void 0);
exports.SuratKeluar = SuratKeluar = __decorate([
    (0, typeorm_1.Entity)('surat_keluar')
], SuratKeluar);
//# sourceMappingURL=surat-keluar.entity.js.map