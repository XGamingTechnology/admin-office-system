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
exports.SuratKeluarController = void 0;
const common_1 = require("@nestjs/common");
const surat_keluar_service_1 = require("./surat-keluar.service");
const surat_keluar_dto_1 = require("./dto/surat-keluar.dto");
let SuratKeluarController = class SuratKeluarController {
    constructor(suratKeluarService) {
        this.suratKeluarService = suratKeluarService;
    }
    create(createSuratKeluarDto) {
        return this.suratKeluarService.create(createSuratKeluarDto);
    }
    findAll() {
        return this.suratKeluarService.findAll();
    }
    getStatistics() {
        return this.suratKeluarService.getStatistics();
    }
    findOne(id) {
        return this.suratKeluarService.findOne(id);
    }
    update(id, updateSuratKeluarDto) {
        return this.suratKeluarService.update(id, updateSuratKeluarDto);
    }
    remove(id) {
        return this.suratKeluarService.remove(id);
    }
};
exports.SuratKeluarController = SuratKeluarController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [surat_keluar_dto_1.CreateSuratKeluarDto]),
    __metadata("design:returntype", void 0)
], SuratKeluarController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuratKeluarController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuratKeluarController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuratKeluarController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, surat_keluar_dto_1.UpdateSuratKeluarDto]),
    __metadata("design:returntype", void 0)
], SuratKeluarController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuratKeluarController.prototype, "remove", null);
exports.SuratKeluarController = SuratKeluarController = __decorate([
    (0, common_1.Controller)('office/surat-keluar'),
    __metadata("design:paramtypes", [surat_keluar_service_1.SuratKeluarService])
], SuratKeluarController);
//# sourceMappingURL=surat-keluar.controller.js.map