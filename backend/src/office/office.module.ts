import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm"; // ← ← ← WAJIB IMPORT INI!

// Import controller
import { OfficeController } from "./office.controller";

// Import entity User untuk TypeOrmModule.forFeature
import { User } from "../auth/entities/user.entity";

// Import modules lain
import { SuratMasukModule } from "./surat-masuk/surat-masuk.module";
import { SuratKeluarModule } from "./surat-keluar/surat-keluar.module";
import { ReimbursementModule } from "./reimbursement/reimbursement.module";

@Module({
  imports: [
    // ✅ WAJIB: Daftarkan User entity agar UserRepository bisa di-inject di OfficeController
    TypeOrmModule.forFeature([User]),

    // Modules lain
    SuratMasukModule,
    SuratKeluarModule,
    ReimbursementModule,
  ],
  controllers: [OfficeController], // ← OfficeController sudah benar
})
export class OfficeModule {}
