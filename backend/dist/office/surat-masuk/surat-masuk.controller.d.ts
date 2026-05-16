import { SuratMasukService } from './surat-masuk.service';
import { CreateSuratMasukDto, UpdateSuratMasukDto } from './dto/surat-masuk.dto';
export declare class SuratMasukController {
    private readonly suratMasukService;
    constructor(suratMasukService: SuratMasukService);
    create(createSuratMasukDto: CreateSuratMasukDto): Promise<import("./entities/surat-masuk.entity").SuratMasuk>;
    findAll(): Promise<import("./entities/surat-masuk.entity").SuratMasuk[]>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        proses: number;
        selesai: number;
    }>;
    findOne(id: string): Promise<import("./entities/surat-masuk.entity").SuratMasuk>;
    update(id: string, updateSuratMasukDto: UpdateSuratMasukDto): Promise<import("./entities/surat-masuk.entity").SuratMasuk>;
    remove(id: string): Promise<void>;
}
