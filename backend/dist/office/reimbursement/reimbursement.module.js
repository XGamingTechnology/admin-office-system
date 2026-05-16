"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReimbursementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reimbursement_service_1 = require("./reimbursement.service");
const reimbursement_controller_1 = require("./reimbursement.controller");
const reimbursement_entity_1 = require("./entities/reimbursement.entity");
let ReimbursementModule = class ReimbursementModule {
};
exports.ReimbursementModule = ReimbursementModule;
exports.ReimbursementModule = ReimbursementModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([reimbursement_entity_1.Reimbursement])],
        controllers: [reimbursement_controller_1.ReimbursementController],
        providers: [reimbursement_service_1.ReimbursementService],
        exports: [reimbursement_service_1.ReimbursementService],
    })
], ReimbursementModule);
//# sourceMappingURL=reimbursement.module.js.map