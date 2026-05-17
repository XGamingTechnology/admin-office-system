import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UsePipes } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SuratMasukService } from "./surat-masuk.service";
import { CreateSuratMasukDto, UpdateSuratMasukDto } from "./dto/surat-masuk.dto";
import { CloudinaryService } from "../../config/cloudinary.service";
import { FormDataPipe } from "../../common/pipes/form-data.pipe";

@Controller("office/surat-masuk")
export class SuratMasukController {
  constructor(
    private readonly suratMasukService: SuratMasukService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new FormDataPipe())
  async create(@Body() createSuratMasukDto: CreateSuratMasukDto, @UploadedFile() file?: any) {
    let fileUrl: string | undefined;
    if (file) {
      fileUrl = await this.cloudinaryService.uploadFile(file);
    }
    return this.suratMasukService.create({ ...createSuratMasukDto, fileUrl });
  }

  @Get()
  findAll() {
    return this.suratMasukService.findAll();
  }

  @Get("statistics")
  getStatistics() {
    return this.suratMasukService.getStatistics();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.suratMasukService.findOne(id);
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor('file'))
  async update(@Param("id") id: string, @Body() updateSuratMasukDto: UpdateSuratMasukDto, @UploadedFile() file?: any) {
    if (file) {
      const fileUrl = await this.cloudinaryService.uploadFile(file);
      updateSuratMasukDto.fileUrl = fileUrl;
    }
    return this.suratMasukService.update(id, updateSuratMasukDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.suratMasukService.remove(id);
  }

  @Get("health")
  async health() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
