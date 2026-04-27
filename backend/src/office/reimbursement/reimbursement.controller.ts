import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReimbursementService } from './reimbursement.service';
import { CreateReimbursementDto, UpdateReimbursementDto, ApproveReimbursementDto } from './dto/reimbursement.dto';

@Controller('office/reimbursements')
export class ReimbursementController {
  constructor(private readonly reimbursementService: ReimbursementService) {}

  @Post()
  create(@Body() createReimbursementDto: CreateReimbursementDto) {
    return this.reimbursementService.create(createReimbursementDto);
  }

  @Get()
  findAll() {
    return this.reimbursementService.findAll();
  }

  @Get('statistics')
  getStatistics() {
    return this.reimbursementService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reimbursementService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReimbursementDto: UpdateReimbursementDto) {
    return this.reimbursementService.update(id, updateReimbursementDto);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body() approveDto: ApproveReimbursementDto) {
    // In production, get approvedBy from authenticated user
    return this.reimbursementService.approve(id, approveDto, 'admin');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reimbursementService.remove(id);
  }
}
