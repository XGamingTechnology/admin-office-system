// backend/src/app.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
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
        // ✅ GUNAKAN variable names yang sesuai dengan .env kamu:
        host: configService.get<string>("POSTGRES_HOST", "db"),
        port: configService.get<number>("POSTGRES_PORT", 5432),
        username: configService.get<string>("POSTGRES_USER", "postgres"),
        password: configService.get<string>("POSTGRES_PASSWORD", "postgres"),
        database: configService.get<string>("POSTGRES_DB", "office_admin"), // ← ← ← office_admin
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get<string>("NODE_ENV") !== "production",
        // Optional: Tambahkan logging untuk debug
        logging: configService.get<string>("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    ReimbursementModule,
    SuratMasukModule,
    SuratKeluarModule,
  ],
})
export class AppModule {}
