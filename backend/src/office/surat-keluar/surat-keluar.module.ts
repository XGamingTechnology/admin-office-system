import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuratKeluarService } from './surat-keluar.service';
import { SuratKeluarController } from './surat-keluar.controller';
import { SuratKeluar } from './entities/surat-keluar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SuratKeluar])],
  controllers: [SuratKeluarController],
  providers: [SuratKeluarService],
  exports: [SuratKeluarService],
})
export class SuratKeluarModule {}
