// src/app.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

// ✅ Pastikan import AuthModule
import { AuthModule } from "./auth/auth.module";
import { OfficeModule } from "./office/office.module";
import { CloudinaryModule } from "./config/cloudinary.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("POSTGRES_HOST", "db"),
        port: configService.get<number>("POSTGRES_PORT", 5432),
        username: configService.get<string>("POSTGRES_USER", "admin"),
        password: configService.get<string>("POSTGRES_PASSWORD", "admin123"),
        database: configService.get<string>("POSTGRES_DB", "office_admin"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: true,
        autoLoadEntities: true,
        logging: ["error", "warn"],
      }),
      inject: [ConfigService],
    }),

    // ✅ TAMBAHKAN AuthModule DI SINI (jika belum ada)
    AuthModule,

    // Cloudinary module untuk upload file
    CloudinaryModule,

    OfficeModule,
  ],
})
export class AppModule {}
