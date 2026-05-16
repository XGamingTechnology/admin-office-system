import { Repository } from 'typeorm';
import { SuratMasuk } from './entities/surat-masuk.entity';
import { CreateSuratMasukDto, UpdateSuratMasukDto } from './dto/surat-masuk.dto';
export declare class SuratMasukService {
    private suratMasukRepository;
    constructor(suratMasukRepository: Repository<SuratMasuk>);
    create(createSuratMasukDto: CreateSuratMasukDto): Promise<SuratMasuk>;
    findAll(): Promise<SuratMasuk[]>;
    findOne(id: string): Promise<SuratMasuk>;
    update(id: string, updateSuratMasukDto: UpdateSuratMasukDto): Promise<SuratMasuk>;
    remove(id: string): Promise<void>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        proses: number;
        selesai: number;
    }>;
}
