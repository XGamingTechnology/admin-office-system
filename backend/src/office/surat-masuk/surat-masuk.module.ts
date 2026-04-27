import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuratMasukService } from './surat-masuk.service';
import { SuratMasukController } from './surat-masuk.controller';
import { SuratMasuk } from './entities/surat-masuk.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SuratMasuk])],
  controllers: [SuratMasukController],
  providers: [SuratMasukService],
  exports: [SuratMasukService],
})
export class SuratMasukModule {}
