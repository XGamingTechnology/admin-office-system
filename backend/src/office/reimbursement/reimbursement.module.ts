// src/office/reimbursement/reimbursement.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reimbursement } from "./entities/reimbursement.entity";
import { ReimbursementService } from "./reimbursement.service";
import { ReimbursementController } from "./reimbursement.controller";
import { CloudinaryModule } from "../../config/cloudinary.module"; // ← ← ← ADD THIS IMPORT

@Module({
  imports: [
    TypeOrmModule.forFeature([Reimbursement]),
    CloudinaryModule, // ← ← ← ADD THIS: Makes CloudinaryService available
  ],
  providers: [ReimbursementService],
  controllers: [ReimbursementController],
  exports: [ReimbursementService],
})
export class ReimbursementModule {}
