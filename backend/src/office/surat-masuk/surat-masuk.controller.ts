// src/office/surat-masuk/surat-masuk.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UsePipes, Req, UseGuards, ForbiddenException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";

import { SuratMasukService } from "./surat-masuk.service";
import { CreateSuratMasukDto, UpdateSuratMasukDto } from "./dto/surat-masuk.dto";
import { CloudinaryService } from "../../config/cloudinary.service";
import { FormDataPipe } from "../../common/pipes/form-data.pipe";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";

@Controller("office/surat-masuk")
@UseGuards(JwtAuthGuard, RolesGuard) // ← ← ← Protect all endpoints
export class SuratMasukController {
  constructor(
    private readonly suratMasukService: SuratMasukService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  @Roles("admin", "user") // ← Both can create
  @UseInterceptors(FileInterceptor("file"))
  @UsePipes(new FormDataPipe())
  async create(@Body() createSuratMasukDto: CreateSuratMasukDto, @UploadedFile() file?: Express.Multer.File, @Req() req: Request) {
    let fileUrl: string | undefined;

    // Upload file if provided
    if (file) {
      fileUrl = await this.cloudinaryService.uploadFile(file);
    }

    const userId = (req as any).user?.sub;

    // Create with default status (PENDING) - frontend cannot set status on CREATE
    return this.suratMasukService.create({
      ...createSuratMasukDto,
      fileUrl,
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
      return this.suratMasukService.findAllByUser(userId);
    }
    return this.suratMasukService.findAll();
  }

  @Get("statistics")
  @Roles("admin") // ← Only admin can view statistics
  getStatistics() {
    return this.suratMasukService.getStatistics();
  }

  @Get(":id")
  @Roles("admin", "user")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    const item = await this.suratMasukService.findOne(id);
    const userId = (req as any).user?.sub;
    const role = (req as any).user?.role;

    // If not admin, check ownership
    if (role !== "admin" && item.createdBy !== userId) {
      throw new ForbiddenException("You can only view your own incoming letters");
    }
    return item;
  }

  @Patch(":id")
  @Roles("admin", "user")
  @UseInterceptors(FileInterceptor("file"))
  async update(@Param("id") id: string, @Body() updateSuratMasukDto: UpdateSuratMasukDto, @UploadedFile() file?: Express.Multer.File, @Req() req: Request) {
    const userId = (req as any).user?.sub;
    const role = (req as any).user?.role;

    // Fetch current item to check ownership
    const currentItem = await this.suratMasukService.findOne(id);

    // If not admin, check ownership
    if (role !== "admin" && currentItem.createdBy !== userId) {
      throw new ForbiddenException("You can only edit your own incoming letters");
    }

    // Handle file upload for update
    if (file) {
      const fileUrl = await this.cloudinaryService.uploadFile(file);
      updateSuratMasukDto.fileUrl = fileUrl;
    }

    // If not admin, prevent changing status
    if (role !== "admin" && updateSuratMasukDto.status) {
      throw new ForbiddenException("Only admin can change letter status");
    }

    return this.suratMasukService.update(id, updateSuratMasukDto);
  }

  @Delete(":id")
  @Roles("admin") // ← Only admin can delete
  remove(@Param("id") id: string) {
    return this.suratMasukService.remove(id);
  }

  @Get("health")
  async health() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
