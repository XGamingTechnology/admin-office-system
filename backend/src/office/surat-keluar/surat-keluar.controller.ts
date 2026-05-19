// backend/src/office/surat-keluar/surat-keluar.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Req, UseGuards, ForbiddenException } from "@nestjs/common";
import { Request } from "express";

import { SuratKeluarService } from "./surat-keluar.service";
import { CreateSuratKeluarDto, UpdateSuratKeluarDto } from "./dto/surat-keluar.dto";
import { FormDataPipe } from "../../common/pipes/form-data.pipe";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";

@Controller("office/surat-keluar")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuratKeluarController {
  constructor(private readonly suratKeluarService: SuratKeluarService) {}

  @Post()
  @Roles("admin", "user")
  @UsePipes(new FormDataPipe())
  async create(@Body() createSuratKeluarDto: CreateSuratKeluarDto, @Req() req?: Request) {
    const userId = (req as any)?.user?.sub;
    return this.suratKeluarService.create({
      ...createSuratKeluarDto,
      createdBy: userId,
    });
  }

  @Get()
  @Roles("admin", "user")
  findAll(@Req() req?: Request) {
    const user = (req as any)?.user;
    const role = this._extractRole(user);

    if (role !== "admin") {
      return this.suratKeluarService.findAllByUser(user?.sub);
    }
    return this.suratKeluarService.findAll();
  }

  @Get("statistics")
  @Roles("admin")
  getStatistics() {
    return this.suratKeluarService.getStatistics();
  }

  @Get(":id")
  @Roles("admin", "user")
  async findOne(@Param("id") id: string, @Req() req?: Request) {
    const item = await this.suratKeluarService.findOne(id);
    const user = (req as any)?.user;
    const role = this._extractRole(user);

    if (role !== "admin" && item.createdBy !== user?.sub) {
      throw new ForbiddenException("You can only view your own outgoing letters");
    }
    return item;
  }

  @Patch(":id")
  @Roles("admin", "user")
  async update(@Param("id") id: string, @Body() updateSuratKeluarDto: UpdateSuratKeluarDto, @Req() req?: Request) {
    const user = (req as any)?.user;
    const userId = user?.sub;
    const role = this._extractRole(user);

    console.log(`🔐 [RBAC] update surat-keluar ${id}: role="${role}", userId="${userId}"`);

    const currentItem = await this.suratKeluarService.findOne(id);

    // ✅ Admin bisa edit SEMUA, user hanya bisa edit milik sendiri
    if (role !== "admin" && currentItem.createdBy !== userId) {
      console.log(`🔐 [RBAC] Forbidden: user ${userId} tried to edit item owned by ${currentItem.createdBy}`);
      throw new ForbiddenException("You can only edit your own outgoing letters");
    }

    // ✅ User biasa tidak boleh ubah status
    if (role !== "admin" && updateSuratKeluarDto.status) {
      throw new ForbiddenException("Only admin can change letter status");
    }

    return this.suratKeluarService.update(id, updateSuratKeluarDto);
  }

  // ✅ FIX: DELETE dengan RBAC ownership check
  @Delete(":id")
  @Roles("admin", "user") // ← ← ← Izinkan admin DAN user
  async remove(@Param("id") id: string, @Req() req?: Request) {
    const user = (req as any)?.user;
    const userId = user?.sub;
    const role = this._extractRole(user);

    console.log(`🔐 [RBAC DELETE] surat-keluar ${id}: role="${role}", userId="${userId}"`);

    // ✅ FIX: Jika bukan admin, cek ownership
    if (role !== "admin") {
      const item = await this.suratKeluarService.findOne(id);
      if (item.createdBy !== userId) {
        console.log(`🔐 [RBAC DELETE] Forbidden: user ${userId} tried to delete item owned by ${item.createdBy}`);
        throw new ForbiddenException("You can only delete your own outgoing letters");
      }
    }

    await this.suratKeluarService.remove(id);

    // ✅ RETURN JSON response
    return {
      success: true,
      message: "Surat keluar deleted successfully",
      id: id,
    };
  }

  // ✅ Helper: Flexible role extraction with fallback
  private _extractRole(user: any): string {
    if (!user) return "";
    const role = user?.role || user?.userRole || user?.roles || user?.permission || "";
    return String(role).toLowerCase().trim();
  }
}
