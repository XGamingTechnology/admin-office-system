import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SuratKeluarService } from "./surat-keluar.service";
import { CreateSuratKeluarDto, UpdateSuratKeluarDto } from "./dto/surat-keluar.dto";
import { CloudinaryService } from "../../config/cloudinary.service";

@Controller("office/surat-keluar")
export class SuratKeluarController {
  constructor(
    private readonly suratKeluarService: SuratKeluarService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createSuratKeluarDto: CreateSuratKeluarDto, @UploadedFile() file?: Express.Multer.File) {
    let fileUrl: string | undefined;
    if (file) {
      fileUrl = await this.cloudinaryService.uploadFile(file);
    }
    return this.suratKeluarService.create({ ...createSuratKeluarDto, fileUrl });
  }

  @Get()
  findAll() {
    return this.suratKeluarService.findAll();
  }

  @Get('statistics')
  getStatistics() {
    return this.suratKeluarService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suratKeluarService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuratKeluarDto: UpdateSuratKeluarDto) {
    return this.suratKeluarService.update(id, updateSuratKeluarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suratKeluarService.remove(id);
  }
}
