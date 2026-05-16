"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeModule = void 0;
const common_1 = require("@nestjs/common");
const surat_masuk_module_1 = require("./surat-masuk/surat-masuk.module");
const surat_keluar_module_1 = require("./surat-keluar/surat-keluar.module");
const reimbursement_module_1 = require("./reimbursement/reimbursement.module");
let OfficeModule = class OfficeModule {
};
exports.OfficeModule = OfficeModule;
exports.OfficeModule = OfficeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            surat_masuk_module_1.SuratMasukModule,
            surat_keluar_module_1.SuratKeluarModule,
            reimbursement_module_1.ReimbursementModule,
        ],
    })
], OfficeModule);
//# sourceMappingURL=office.module.js.map