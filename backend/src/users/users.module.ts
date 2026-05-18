// backend/src/users/users.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])], // ← ← ← WAJIB: Register UserRepository
  exports: [TypeOrmModule], // ← ← ← WAJIB: Export agar AuthModule bisa akses
})
export class UsersModule {}
