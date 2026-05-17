// src/office/surat-masuk/surat-masuk.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SuratMasuk, SuratStatus } from "./entities/surat-masuk.entity";
import { CreateSuratMasukDto, UpdateSuratMasukDto } from "./dto/surat-masuk.dto";

@Injectable()
export class SuratMasukService {
  constructor(
    @InjectRepository(SuratMasuk)
    private suratMasukRepository: Repository<SuratMasuk>
  ) {}

  // ✅ CREATE: Support createdBy & fileUrl
  async create(createSuratMasukDto: CreateSuratMasukDto & { createdBy?: string; fileUrl?: string }): Promise<SuratMasuk> {
    const suratMasuk = this.suratMasukRepository.create({
      ...createSuratMasukDto,
      createdBy: createSuratMasukDto.createdBy,
      fileUrl: createSuratMasukDto.fileUrl,
      tanggalDiterima: createSuratMasukDto.tanggalDiterima || new Date(),
      // status defaults to PENDING via entity
    });
    return this.suratMasukRepository.save(suratMasuk);
  }

  // ✅ READ ALL: Return all (for admin)
  async findAll(): Promise<SuratMasuk[]> {
    return this.suratMasukRepository.find({ order: { createdAt: "DESC" } });
  }

  // ✅ READ BY USER: Filter by createdBy (for non-admin)
  async findAllByUser(userId: string): Promise<SuratMasuk[]> {
    return this.suratMasukRepository.find({
      where: { createdBy: userId },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string): Promise<SuratMasuk> {
    const suratMasuk = await this.suratMasukRepository.findOne({ where: { id } });
    if (!suratMasuk) {
      throw new NotFoundException(`Surat masuk with ID ${id} not found`);
    }
    return suratMasuk;
  }

  // ✅ UPDATE: Support fileUrl
  async update(id: string, updateSuratMasukDto: UpdateSuratMasukDto & { fileUrl?: string }): Promise<SuratMasuk> {
    const suratMasuk = await this.findOne(id);

    // Handle fileUrl update
    if (updateSuratMasukDto.fileUrl) {
      suratMasuk.fileUrl = updateSuratMasukDto.fileUrl;
    }

    // Update other fields
    const { fileUrl, ...updateData } = updateSuratMasukDto;
    Object.assign(suratMasuk, updateData);

    return this.suratMasukRepository.save(suratMasuk);
  }

  async remove(id: string): Promise<void> {
    const suratMasuk = await this.findOne(id);
    await this.suratMasukRepository.remove(suratMasuk);
  }

  // ✅ STATISTICS: Use enum values directly
  async getStatistics() {
    const total = await this.suratMasukRepository.count();

    const pending = await this.suratMasukRepository.count({
      where: { status: SuratStatus.PENDING },
    });
    const proses = await this.suratMasukRepository.count({
      where: { status: SuratStatus.PROSES },
    });
    const selesai = await this.suratMasukRepository.count({
      where: { status: SuratStatus.SELESAI },
    });

    return { total, pending, proses, selesai };
  }
}
