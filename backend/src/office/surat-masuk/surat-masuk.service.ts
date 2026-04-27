import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuratMasuk } from './entities/surat-masuk.entity';
import { CreateSuratMasukDto, UpdateSuratMasukDto } from './dto/surat-masuk.dto';

@Injectable()
export class SuratMasukService {
  constructor(
    @InjectRepository(SuratMasuk)
    private suratMasukRepository: Repository<SuratMasuk>,
  ) {}

  async create(createSuratMasukDto: CreateSuratMasukDto): Promise<SuratMasuk> {
    const suratMasuk = this.suratMasukRepository.create({
      ...createSuratMasukDto,
      tanggalDiterima: createSuratMasukDto.tanggalDiterima || new Date(),
    });
    return this.suratMasukRepository.save(suratMasuk);
  }

  async findAll(): Promise<SuratMasuk[]> {
    return this.suratMasukRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<SuratMasuk> {
    const suratMasuk = await this.suratMasukRepository.findOne({ where: { id } });
    if (!suratMasuk) {
      throw new NotFoundException(`Surat masuk with ID ${id} not found`);
    }
    return suratMasuk;
  }

  async update(id: string, updateSuratMasukDto: UpdateSuratMasukDto): Promise<SuratMasuk> {
    const suratMasuk = await this.findOne(id);
    Object.assign(suratMasuk, updateSuratMasukDto);
    return this.suratMasukRepository.save(suratMasuk);
  }

  async remove(id: string): Promise<void> {
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
}
