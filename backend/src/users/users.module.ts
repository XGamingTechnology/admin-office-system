// backend/src/users/users.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService], // ← ← ← WAJIB: Daftarkan service
  controllers: [UsersController], // ← ← ← WAJIB: Daftarkan controller
  exports: [UsersService],
})
export class UsersModule {}
