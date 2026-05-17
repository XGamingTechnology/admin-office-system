// src/office/surat-keluar/surat-keluar.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SuratKeluarService } from "./surat-keluar.service";
import { SuratKeluarController } from "./surat-keluar.controller";
import { SuratKeluar } from "./entities/surat-keluar.entity";
import { CloudinaryModule } from "../../config/cloudinary.module"; // ← ← ← ADD THIS IMPORT

@Module({
  imports: [
    TypeOrmModule.forFeature([SuratKeluar]),
    CloudinaryModule, // ← ← ← ADD THIS: Makes CloudinaryService available
  ],
  controllers: [SuratKeluarController],
  providers: [SuratKeluarService],
  exports: [SuratKeluarService],
})
export class SuratKeluarModule {}
