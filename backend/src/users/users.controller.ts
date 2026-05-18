// backend/src/users/users.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ForbiddenException } from "@nestjs/common";
import { Request } from "express";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("admin/users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles("admin")
  async findAll(@Req() req: Request) {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Roles("admin")
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles("admin")
  async create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    const userId = (req as any).user?.sub;
    return this.usersService.create(createUserDto, userId);
  }

  @Patch(":id")
  @Roles("admin")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const user = (req as any).user;
    return this.usersService.update(id, updateUserDto, user?.sub, user?.role);
  }

  @Delete(":id")
  @Roles("admin")
  async remove(@Param("id") id: string) {
    return this.usersService.remove(id); // Soft delete
  }

  // Optional: Hard delete endpoint (use with caution)
  @Post(":id/hard-delete")
  @Roles("admin")
  async hardDelete(@Param("id") id: string) {
    return this.usersService.hardDelete(id);
  }
}
