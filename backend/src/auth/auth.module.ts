// src/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsersModule } from "../users/users.module"; // or your user module
import { ConfigModule, ConfigService } from "@nestjs/config";

// Import guards & decorators
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard"; // ← ← ← ADD THIS

@Module({
  imports: [
    PassportModule,
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "7d" },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard, // ← Already exists
    RolesGuard, // ← ← ← ADD THIS
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtAuthGuard,
    RolesGuard, // ← ← ← ADD THIS (so other modules can use it)
  ],
})
export class AuthModule {}
