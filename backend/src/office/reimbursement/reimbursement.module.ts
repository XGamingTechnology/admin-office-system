import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReimbursementService } from './reimbursement.service';
import { ReimbursementController } from './reimbursement.controller';
import { Reimbursement } from './entities/reimbursement.entity';
import { CloudinaryModule } from '../../config/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reimbursement]), CloudinaryModule],
  controllers: [ReimbursementController],
  providers: [ReimbursementService],
  exports: [ReimbursementService],
})
export class ReimbursementModule {}
