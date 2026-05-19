// backend/src/users/users.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service"; // ← ← ← IMPORT
import { UsersController } from "./users.controller"; // ← ← ← IMPORT

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService], // ← ← ← WAJIB: Daftarkan service
  controllers: [UsersController], // ← ← ← WAJIB: Daftarkan controller
  exports: [UsersService], // Export agar module lain bisa inject
})
export class UsersModule {}
