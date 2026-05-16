"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuratMasukModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const surat_masuk_service_1 = require("./surat-masuk.service");
const surat_masuk_controller_1 = require("./surat-masuk.controller");
const surat_masuk_entity_1 = require("./entities/surat-masuk.entity");
let SuratMasukModule = class SuratMasukModule {
};
exports.SuratMasukModule = SuratMasukModule;
exports.SuratMasukModule = SuratMasukModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([surat_masuk_entity_1.SuratMasuk])],
        controllers: [surat_masuk_controller_1.SuratMasukController],
        providers: [surat_masuk_service_1.SuratMasukService],
        exports: [surat_masuk_service_1.SuratMasukService],
    })
], SuratMasukModule);
//# sourceMappingURL=surat-masuk.module.js.map