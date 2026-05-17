// src/office/surat-keluar/surat-keluar.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SuratKeluar, SuratStatus } from "./entities/surat-keluar.entity";
import { CreateSuratKeluarDto, UpdateSuratKeluarDto } from "./dto/surat-keluar.dto";

@Injectable()
export class SuratKeluarService {
  constructor(
    @InjectRepository(SuratKeluar)
    private suratKeluarRepository: Repository<SuratKeluar>
  ) {}

  // ✅ CREATE: Support createdBy & fileUrl
  async create(createSuratKeluarDto: CreateSuratKeluarDto & { createdBy?: string; fileUrl?: string }): Promise<SuratKeluar> {
    const suratKeluar = this.suratKeluarRepository.create({
      ...createSuratKeluarDto,
      createdBy: createSuratKeluarDto.createdBy,
      fileUrl: createSuratKeluarDto.fileUrl,
      tanggalKirim: createSuratKeluarDto.tanggalKirim || new Date(),
      // status defaults to PENDING via entity
    });
    return this.suratKeluarRepository.save(suratKeluar);
  }

  // ✅ READ ALL: Return all (for admin)
  async findAll(): Promise<SuratKeluar[]> {
    return this.suratKeluarRepository.find({ order: { createdAt: "DESC" } });
  }

  // ✅ READ BY USER: Filter by createdBy (for non-admin)
  async findAllByUser(userId: string): Promise<SuratKeluar[]> {
    return this.suratKeluarRepository.find({
      where: { createdBy: userId },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string): Promise<SuratKeluar> {
    const suratKeluar = await this.suratKeluarRepository.findOne({ where: { id } });
    if (!suratKeluar) {
      throw new NotFoundException(`Surat keluar with ID ${id} not found`);
    }
    return suratKeluar;
  }

  // ✅ UPDATE: Support fileUrl
  async update(id: string, updateSuratKeluarDto: UpdateSuratKeluarDto & { fileUrl?: string }): Promise<SuratKeluar> {
    const suratKeluar = await this.findOne(id);

    // Handle fileUrl update
    if (updateSuratKeluarDto.fileUrl) {
      suratKeluar.fileUrl = updateSuratKeluarDto.fileUrl;
    }

    // Update other fields
    const { fileUrl, ...updateData } = updateSuratKeluarDto;
    Object.assign(suratKeluar, updateData);

    return this.suratKeluarRepository.save(suratKeluar);
  }

  async remove(id: string): Promise<void> {
    const suratKeluar = await this.findOne(id);
    await this.suratKeluarRepository.remove(suratKeluar);
  }

  // ✅ STATISTICS: Use enum values directly
  async getStatistics() {
    const total = await this.suratKeluarRepository.count();

    const pending = await this.suratKeluarRepository.count({
      where: { status: SuratStatus.PENDING },
    });
    const proses = await this.suratKeluarRepository.count({
      where: { status: SuratStatus.PROSES },
    });
    const selesai = await this.suratKeluarRepository.count({
      where: { status: SuratStatus.SELESAI },
    });

    return { total, pending, proses, selesai };
  }
}
