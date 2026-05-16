import { Repository } from 'typeorm';
import { SuratKeluar } from './entities/surat-keluar.entity';
import { CreateSuratKeluarDto, UpdateSuratKeluarDto } from './dto/surat-keluar.dto';
export declare class SuratKeluarService {
    private suratKeluarRepository;
    constructor(suratKeluarRepository: Repository<SuratKeluar>);
    create(createSuratKeluarDto: CreateSuratKeluarDto): Promise<SuratKeluar>;
    findAll(): Promise<SuratKeluar[]>;
    findOne(id: string): Promise<SuratKeluar>;
    update(id: string, updateSuratKeluarDto: UpdateSuratKeluarDto): Promise<SuratKeluar>;
    remove(id: string): Promise<void>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        proses: number;
        selesai: number;
    }>;
}
