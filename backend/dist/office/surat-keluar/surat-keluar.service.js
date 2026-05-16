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
exports.SuratKeluarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const surat_keluar_entity_1 = require("./entities/surat-keluar.entity");
let SuratKeluarService = class SuratKeluarService {
    constructor(suratKeluarRepository) {
        this.suratKeluarRepository = suratKeluarRepository;
    }
    async create(createSuratKeluarDto) {
        const suratKeluar = this.suratKeluarRepository.create({
            ...createSuratKeluarDto,
            tanggalKirim: createSuratKeluarDto.tanggalKirim || new Date(),
        });
        return this.suratKeluarRepository.save(suratKeluar);
    }
    async findAll() {
        return this.suratKeluarRepository.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        const suratKeluar = await this.suratKeluarRepository.findOne({ where: { id } });
        if (!suratKeluar) {
            throw new common_1.NotFoundException(`Surat keluar with ID ${id} not found`);
        }
        return suratKeluar;
    }
    async update(id, updateSuratKeluarDto) {
        const suratKeluar = await this.findOne(id);
        Object.assign(suratKeluar, updateSuratKeluarDto);
        return this.suratKeluarRepository.save(suratKeluar);
    }
    async remove(id) {
        const suratKeluar = await this.findOne(id);
        await this.suratKeluarRepository.remove(suratKeluar);
    }
    async getStatistics() {
        const total = await this.suratKeluarRepository.count();
        const pending = await this.suratKeluarRepository.count({ where: { status: 'pending' } });
        const proses = await this.suratKeluarRepository.count({ where: { status: 'proses' } });
        const selesai = await this.suratKeluarRepository.count({ where: { status: 'selesai' } });
        return { total, pending, proses, selesai };
    }
};
exports.SuratKeluarService = SuratKeluarService;
exports.SuratKeluarService = SuratKeluarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(surat_keluar_entity_1.SuratKeluar)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SuratKeluarService);
//# sourceMappingURL=surat-keluar.service.js.map