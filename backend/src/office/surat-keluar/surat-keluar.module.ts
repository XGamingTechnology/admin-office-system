import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuratKeluarService } from './surat-keluar.service';
import { SuratKeluarController } from './surat-keluar.controller';
import { SuratKeluar } from './entities/surat-keluar.entity';
import { CloudinaryModule } from '../../config/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([SuratKeluar]), CloudinaryModule],
  controllers: [SuratKeluarController],
  providers: [SuratKeluarService],
  exports: [SuratKeluarService],
})
export class SuratKeluarModule {}
