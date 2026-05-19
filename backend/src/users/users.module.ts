// backend/src/users/users.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service"; // ← ← ← IMPORT SERVICE
import { UsersController } from "./users.controller"; // ← ← ← IMPORT CONTROLLER

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register UserRepository
  providers: [UsersService], // ← ← ← WAJIB: Daftarkan service
  controllers: [UsersController], // ← ← ← WAJIB: Daftarkan controller (ini yang bikin route /admin/users bekerja!)
  exports: [UsersService], // Export agar module lain bisa inject service ini
})
export class UsersModule {}
