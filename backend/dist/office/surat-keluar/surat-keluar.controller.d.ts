import { SuratKeluarService } from './surat-keluar.service';
import { CreateSuratKeluarDto, UpdateSuratKeluarDto } from './dto/surat-keluar.dto';
export declare class SuratKeluarController {
    private readonly suratKeluarService;
    constructor(suratKeluarService: SuratKeluarService);
    create(createSuratKeluarDto: CreateSuratKeluarDto): Promise<import("./entities/surat-keluar.entity").SuratKeluar>;
    findAll(): Promise<import("./entities/surat-keluar.entity").SuratKeluar[]>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        proses: number;
        selesai: number;
    }>;
    findOne(id: string): Promise<import("./entities/surat-keluar.entity").SuratKeluar>;
    update(id: string, updateSuratKeluarDto: UpdateSuratKeluarDto): Promise<import("./entities/surat-keluar.entity").SuratKeluar>;
    remove(id: string): Promise<void>;
}
