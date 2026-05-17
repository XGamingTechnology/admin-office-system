import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuratKeluarService } from './surat-keluar.service';
import { CreateSuratKeluarDto, UpdateSuratKeluarDto } from './dto/surat-keluar.dto';
import { FormDataPipe } from '../../common/pipes/form-data.pipe';

@Controller('office/surat-keluar')
export class SuratKeluarController {
  constructor(private readonly suratKeluarService: SuratKeluarService) {}

  @Post()
  create(@Body(new FormDataPipe()) createSuratKeluarDto: CreateSuratKeluarDto) {
    return this.suratKeluarService.create(createSuratKeluarDto);
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
