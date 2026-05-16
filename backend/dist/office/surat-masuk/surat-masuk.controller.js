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
exports.SuratMasukController = void 0;
const common_1 = require("@nestjs/common");
const surat_masuk_service_1 = require("./surat-masuk.service");
const surat_masuk_dto_1 = require("./dto/surat-masuk.dto");
let SuratMasukController = class SuratMasukController {
    constructor(suratMasukService) {
        this.suratMasukService = suratMasukService;
    }
    create(createSuratMasukDto) {
        return this.suratMasukService.create(createSuratMasukDto);
    }
    findAll() {
        return this.suratMasukService.findAll();
    }
    getStatistics() {
        return this.suratMasukService.getStatistics();
    }
    findOne(id) {
        return this.suratMasukService.findOne(id);
    }
    update(id, updateSuratMasukDto) {
        return this.suratMasukService.update(id, updateSuratMasukDto);
    }
    remove(id) {
        return this.suratMasukService.remove(id);
    }
};
exports.SuratMasukController = SuratMasukController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [surat_masuk_dto_1.CreateSuratMasukDto]),
    __metadata("design:returntype", void 0)
], SuratMasukController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuratMasukController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuratMasukController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuratMasukController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, surat_masuk_dto_1.UpdateSuratMasukDto]),
    __metadata("design:returntype", void 0)
], SuratMasukController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuratMasukController.prototype, "remove", null);
exports.SuratMasukController = SuratMasukController = __decorate([
    (0, common_1.Controller)('office/surat-masuk'),
    __metadata("design:paramtypes", [surat_masuk_service_1.SuratMasukService])
], SuratMasukController);
//# sourceMappingURL=surat-masuk.controller.js.map