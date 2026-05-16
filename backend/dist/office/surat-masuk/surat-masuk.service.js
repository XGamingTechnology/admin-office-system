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
exports.SuratMasukService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const surat_masuk_entity_1 = require("./entities/surat-masuk.entity");
let SuratMasukService = class SuratMasukService {
    constructor(suratMasukRepository) {
        this.suratMasukRepository = suratMasukRepository;
    }
    async create(createSuratMasukDto) {
        const suratMasuk = this.suratMasukRepository.create({
            ...createSuratMasukDto,
            tanggalDiterima: createSuratMasukDto.tanggalDiterima || new Date(),
        });
        return this.suratMasukRepository.save(suratMasuk);
    }
    async findAll() {
        return this.suratMasukRepository.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        const suratMasuk = await this.suratMasukRepository.findOne({ where: { id } });
        if (!suratMasuk) {
            throw new common_1.NotFoundException(`Surat masuk with ID ${id} not found`);
        }
        return suratMasuk;
    }
    async update(id, updateSuratMasukDto) {
        const suratMasuk = await this.findOne(id);
        Object.assign(suratMasuk, updateSuratMasukDto);
        return this.suratMasukRepository.save(suratMasuk);
    }
    async remove(id) {
        const suratMasuk = await this.findOne(id);
        await this.suratMasukRepository.remove(suratMasuk);
    }
    async getStatistics() {
        const total = await this.suratMasukRepository.count();
        const pending = await this.suratMasukRepository.count({ where: { status: 'pending' } });
        const proses = await this.suratMasukRepository.count({ where: { status: 'proses' } });
        const selesai = await this.suratMasukRepository.count({ where: { status: 'selesai' } });
        return { total, pending, proses, selesai };
    }
};
exports.SuratMasukService = SuratMasukService;
exports.SuratMasukService = SuratMasukService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(surat_masuk_entity_1.SuratMasuk)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SuratMasukService);
//# sourceMappingURL=surat-masuk.service.js.map