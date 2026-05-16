import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuratMasukController } from './surat-masuk.controller';
import { SuratMasukService } from './surat-masuk.service';
import { SuratMasuk } from './entities/surat-masuk.entity';
import { CloudinaryModule } from '../../config/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([SuratMasuk]), CloudinaryModule],
  controllers: [SuratMasukController],
  providers: [SuratMasukService],
  exports: [SuratMasukService],
})
export class SuratMasukModule {}
