import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

// Modules
import { AuthModule } from "./auth/auth.module";
import { OfficeModule } from "./office/office.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",

        // ✅ PAKAI NAMA ENV VAR YANG SAMA DENGAN .env KAMU:
        host: configService.get<string>("POSTGRES_HOST", "db"), // ← Default ke 'db' untuk Docker!
        port: configService.get<number>("POSTGRES_PORT", 5432),
        username: configService.get<string>("POSTGRES_USER", "admin"),
        password: configService.get<string>("POSTGRES_PASSWORD", "admin123"),
        database: configService.get<string>("POSTGRES_DB", "office_admin"),

        // ✅ AUTO-SYNC DATABASE (untuk initial deploy):
        entities: [],
        synchronize: true, // Auto-create tables dari entity files
        autoLoadEntities: true, // Auto-load *.entity.ts files

        // Optional: minimal logging untuk production
        logging: ["error", "warn"],
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET", "your-secret-key"),
        signOptions: { expiresIn: "24h" },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    OfficeModule,
  ],
})
export class AppModule {}
