// backend/src/app.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module"; // ← ← ← TAMBAHKAN
import { ReimbursementModule } from "./office/reimbursement/reimbursement.module";
import { SuratMasukModule } from "./office/surat-masuk/surat-masuk.module";
import { SuratKeluarModule } from "./office/surat-keluar/surat-keluar.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST", "localhost"),
        port: +configService.get("DB_PORT", 5432),
        username: configService.get("DB_USERNAME", "postgres"),
        password: configService.get("DB_PASSWORD", "postgres"),
        database: configService.get("DB_NAME", "office_db"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get("NODE_ENV") !== "production",
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule, // ← ← ← TAMBAHKAN
    ReimbursementModule,
    SuratMasukModule,
    SuratKeluarModule,
  ],
})
export class AppModule {}
