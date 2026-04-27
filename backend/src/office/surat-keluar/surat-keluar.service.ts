import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuratKeluar } from './entities/surat-keluar.entity';
import { CreateSuratKeluarDto, UpdateSuratKeluarDto } from './dto/surat-keluar.dto';

@Injectable()
export class SuratKeluarService {
  constructor(
    @InjectRepository(SuratKeluar)
    private suratKeluarRepository: Repository<SuratKeluar>,
  ) {}

  async create(createSuratKeluarDto: CreateSuratKeluarDto): Promise<SuratKeluar> {
    const suratKeluar = this.suratKeluarRepository.create({
      ...createSuratKeluarDto,
      tanggalKirim: createSuratKeluarDto.tanggalKirim || new Date(),
    });
    return this.suratKeluarRepository.save(suratKeluar);
  }

  async findAll(): Promise<SuratKeluar[]> {
    return this.suratKeluarRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<SuratKeluar> {
    const suratKeluar = await this.suratKeluarRepository.findOne({ where: { id } });
    if (!suratKeluar) {
      throw new NotFoundException(`Surat keluar with ID ${id} not found`);
    }
    return suratKeluar;
  }

  async update(id: string, updateSuratKeluarDto: UpdateSuratKeluarDto): Promise<SuratKeluar> {
    const suratKeluar = await this.findOne(id);
    Object.assign(suratKeluar, updateSuratKeluarDto);
    return this.suratKeluarRepository.save(suratKeluar);
  }

  async remove(id: string): Promise<void> {
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
}
