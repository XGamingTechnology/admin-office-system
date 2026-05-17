// src/office/surat-keluar/surat-keluar.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Req, UseGuards, ForbiddenException } from "@nestjs/common";
import { Request } from "express";

import { SuratKeluarService } from "./surat-keluar.service";
import { CreateSuratKeluarDto, UpdateSuratKeluarDto } from "./dto/surat-keluar.dto";
import { FormDataPipe } from "../../common/pipes/form-data.pipe";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";

@Controller("office/surat-keluar")
@UseGuards(JwtAuthGuard, RolesGuard) // ← ← ← Protect all endpoints
export class SuratKeluarController {
  constructor(private readonly suratKeluarService: SuratKeluarService) {}

  @Post()
  @Roles("admin", "user") // ← Both can create
  @UsePipes(new FormDataPipe())
  async create(@Body() createSuratKeluarDto: CreateSuratKeluarDto, @Req() req: Request) {
    const userId = (req as any).user?.sub;

    // Create with default status (PENDING) - frontend cannot set status on CREATE
    return this.suratKeluarService.create({
      ...createSuratKeluarDto,
      createdBy: userId, // Track who created this
      // status is auto-set to PENDING by entity default
    });
  }

  @Get()
  @Roles("admin", "user")
  findAll(@Req() req: Request) {
    const userId = (req as any).user?.sub;
    const role = (req as any).user?.role;

    // If not admin, only return user's own data
    if (role !== "admin") {
      return this.suratKeluarService.findAllByUser(userId);
    }
    return this.suratKeluarService.findAll();
  }

  @Get("statistics")
  @Roles("admin") // ← Only admin can view statistics
  getStatistics() {
    return this.suratKeluarService.getStatistics();
  }

  @Get(":id")
  @Roles("admin", "user")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    const item = await this.suratKeluarService.findOne(id);
    const userId = (req as any).user?.sub;
    const role = (req as any).user?.role;

    // If not admin, check ownership
    if (role !== "admin" && item.createdBy !== userId) {
      throw new ForbiddenException("You can only view your own outgoing letters");
    }
    return item;
  }

  @Patch(":id")
  @Roles("admin", "user")
  async update(@Param("id") id: string, @Body() updateSuratKeluarDto: UpdateSuratKeluarDto, @Req() req: Request) {
    const userId = (req as any).user?.sub;
    const role = (req as any).user?.role;

    // Fetch current item to check ownership
    const currentItem = await this.suratKeluarService.findOne(id);

    // If not admin, check ownership
    if (role !== "admin" && currentItem.createdBy !== userId) {
      throw new ForbiddenException("You can only edit your own outgoing letters");
    }

    // If not admin, prevent changing status
    if (role !== "admin" && updateSuratKeluarDto.status) {
      throw new ForbiddenException("Only admin can change letter status");
    }

    return this.suratKeluarService.update(id, updateSuratKeluarDto);
  }

  @Delete(":id")
  @Roles("admin") // ← Only admin can delete
  remove(@Param("id") id: string) {
    return this.suratKeluarService.remove(id);
  }
}
