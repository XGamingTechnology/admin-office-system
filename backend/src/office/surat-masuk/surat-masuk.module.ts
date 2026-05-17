// src/office/surat-masuk/surat-masuk.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SuratMasukController } from "./surat-masuk.controller";
import { SuratMasukService } from "./surat-masuk.service";
import { SuratMasuk } from "./entities/surat-masuk.entity";
import { CloudinaryModule } from "../../config/cloudinary.module"; // ✅ Sudah ada

@Module({
  imports: [
    TypeOrmModule.forFeature([SuratMasuk]),
    CloudinaryModule, // ✅ Sudah di-import
  ],
  controllers: [SuratMasukController],
  providers: [SuratMasukService],
  exports: [SuratMasukService],
})
export class SuratMasukModule {}
