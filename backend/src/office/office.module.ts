import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuratMasukModule } from './surat-masuk/surat-masuk.module';
import { SuratKeluarModule } from './surat-keluar/surat-keluar.module';
import { ReimbursementModule } from './reimbursement/reimbursement.module';

@Module({
  imports: [
    SuratMasukModule,
    SuratKeluarModule,
    ReimbursementModule,
  ],
})
export class OfficeModule {}
