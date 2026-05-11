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
        host: configService.get<string>("POSTGRES_HOST", "db"),
        port: configService.get<number>("POSTGRES_PORT", 5432),
        username: configService.get<string>("POSTGRES_USER", "admin"),
        password: configService.get<string>("POSTGRES_PASSWORD", "admin123"),
        database: configService.get<string>("POSTGRES_DB", "office_admin"),

        // ✅ WAJIB: Scan semua file entity agar tabel auto-created
        entities: [__dirname + "/**/*.entity{.ts,.js}"],

        synchronize: true, // Auto-create tables
        autoLoadEntities: true, // Backup: auto-load entities
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
