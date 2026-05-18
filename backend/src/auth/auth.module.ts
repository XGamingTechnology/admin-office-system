// backend/src/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm"; // ← ← ← TAMBAHKAN IMPORT INI
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";

// Import guards & decorators
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";

// ✅ TAMBAHKAN: Import User entity (sesuaikan path dengan project kamu)
// Coba salah satu path berikut (pilih yang file-nya benar-benar ada):
import { User } from "../users/entities/user.entity"; // ← Path umum #1
// import { User } from "../auth/entities/user.entity";  // ← Path umum #2
// import { User } from "../entities/user.entity";       // ← Path umum #3

@Module({
  imports: [
    PassportModule,
    ConfigModule,

    // ✅ TAMBAHKAN: Register User entity agar UserRepository tersedia
    TypeOrmModule.forFeature([User]), // ← ← ← INI YANG KURANG!

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "7d" },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
