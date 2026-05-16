"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuratKeluarModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const surat_keluar_service_1 = require("./surat-keluar.service");
const surat_keluar_controller_1 = require("./surat-keluar.controller");
const surat_keluar_entity_1 = require("./entities/surat-keluar.entity");
let SuratKeluarModule = class SuratKeluarModule {
};
exports.SuratKeluarModule = SuratKeluarModule;
exports.SuratKeluarModule = SuratKeluarModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([surat_keluar_entity_1.SuratKeluar])],
        controllers: [surat_keluar_controller_1.SuratKeluarController],
        providers: [surat_keluar_service_1.SuratKeluarService],
        exports: [surat_keluar_service_1.SuratKeluarService],
    })
], SuratKeluarModule);
//# sourceMappingURL=surat-keluar.module.js.map