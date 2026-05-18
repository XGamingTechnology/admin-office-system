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
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuratMasukController {
  constructor(
    private readonly suratMasukService: SuratMasukService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  @Roles("admin", "user")
  @UseInterceptors(FileInterceptor("file"))
  @UsePipes(new FormDataPipe())
  async create(
    @Body() createSuratMasukDto: CreateSuratMasukDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: Request // ✅ FIX: Made optional (setelah parameter optional file)
  ) {
    let fileUrl: string | undefined;

    if (file) {
      fileUrl = await this.cloudinaryService.uploadFile(file);
    }

    const userId = (req as any)?.user?.sub;

    return this.suratMasukService.create({
      ...createSuratMasukDto,
      fileUrl,
      createdBy: userId,
    });
  }

  @Get()
  @Roles("admin", "user")
  findAll(@Req() req?: Request) {
    // ✅ FIX: Made optional
    const userId = (req as any)?.user?.sub;
    const role = (req as any)?.user?.role;

    if (role !== "admin") {
      return this.suratMasukService.findAllByUser(userId);
    }
    return this.suratMasukService.findAll();
  }

  @Get("statistics")
  @Roles("admin")
  getStatistics() {
    return this.suratMasukService.getStatistics();
  }

  @Get(":id")
  @Roles("admin", "user")
  async findOne(@Param("id") id: string, @Req() req?: Request) {
    // ✅ FIX: Made optional
    const item = await this.suratMasukService.findOne(id);
    const userId = (req as any)?.user?.sub;
    const role = (req as any)?.user?.role;

    if (role !== "admin" && item.createdBy !== userId) {
      throw new ForbiddenException("You can only view your own incoming letters");
    }
    return item;
  }

  @Patch(":id")
  @Roles("admin", "user")
  @UseInterceptors(FileInterceptor("file"))
  async update(
    @Param("id") id: string,
    @Body() updateSuratMasukDto: UpdateSuratMasukDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: Request // ✅ FIX: Made optional (setelah parameter optional file)
  ) {
    const userId = (req as any)?.user?.sub;
    const role = (req as any)?.user?.role;

    const currentItem = await this.suratMasukService.findOne(id);

    if (role !== "admin" && currentItem.createdBy !== userId) {
      throw new ForbiddenException("You can only edit your own incoming letters");
    }

    if (file) {
      const fileUrl = await this.cloudinaryService.uploadFile(file);
      updateSuratMasukDto.fileUrl = fileUrl;
    }

    if (role !== "admin" && updateSuratMasukDto.status) {
      throw new ForbiddenException("Only admin can change letter status");
    }

    return this.suratMasukService.update(id, updateSuratMasukDto);
  }

  @Delete(":id")
  @Roles("admin")
  remove(@Param("id") id: string) {
    return this.suratMasukService.remove(id);
  }

  @Get("health")
  async health() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
