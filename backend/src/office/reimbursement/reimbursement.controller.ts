// src/office/reimbursement/reimbursement.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UsePipes, Req, UseGuards, ForbiddenException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";

import { ReimbursementService } from "./reimbursement.service";
import { CreateReimbursementDto, UpdateReimbursementDto, ApproveReimbursementDto } from "./dto/reimbursement.dto";
import { CloudinaryService } from "../../config/cloudinary.service";
import { FormDataPipe } from "../../common/pipes/form-data.pipe";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";

@Controller("office/reimbursements")
@UseGuards(JwtAuthGuard, RolesGuard) // ← ← ← Protect all endpoints
export class ReimbursementController {
  constructor(
    private readonly reimbursementService: ReimbursementService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  @Roles("admin", "user") // ← Both can create
  @UseInterceptors(FileInterceptor("file"))
  @UsePipes(new FormDataPipe())
  async create(
    @Body() createReimbursementDto: CreateReimbursementDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req: Request // ← Get authenticated user
  ) {
    let fileUrl: string | undefined;

    // Upload file if provided
    if (file) {
      fileUrl = await this.cloudinaryService.uploadFile(file);
    }

    // Get user info from JWT
    const userId = (req as any).user?.sub;

    // Create with default status (PENDING) - frontend cannot set status on CREATE
    return this.reimbursementService.create({
      ...createReimbursementDto,
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
      return this.reimbursementService.findAllByUser(userId);
    }
    return this.reimbursementService.findAll();
  }

  @Get("statistics")
  @Roles("admin") // ← Only admin can view statistics
  getStatistics() {
    return this.reimbursementService.getStatistics();
  }

  @Get(":id")
  @Roles("admin", "user")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    const item = await this.reimbursementService.findOne(id);
    const userId = (req as any).user?.sub;
    const role = (req as any).user?.role;

    // If not admin, check ownership
    if (role !== "admin" && item.createdBy !== userId) {
      throw new ForbiddenException("You can only view your own reimbursements");
    }
    return item;
  }

  @Patch(":id")
  @Roles("admin", "user")
  async update(@Param("id") id: string, @Body() updateReimbursementDto: UpdateReimbursementDto, @Req() req: Request) {
    const userId = (req as any).user?.sub;
    const role = (req as any).user?.role;

    // Fetch current item to check ownership
    const currentItem = await this.reimbursementService.findOne(id);

    // If not admin, check ownership
    if (role !== "admin" && currentItem.createdBy !== userId) {
      throw new ForbiddenException("You can only edit your own reimbursements");
    }

    // If not admin, prevent changing sensitive fields
    if (role !== "admin") {
      if (updateReimbursementDto.status || updateReimbursementDto.approvedBy || updateReimbursementDto.approvedAt) {
        throw new ForbiddenException("Only admin can change status or approval fields");
      }
      // Also prevent changing amount/description after submission (optional business rule)
      if (currentItem.status !== "pending" && (updateReimbursementDto.amount || updateReimbursementDto.description)) {
        throw new ForbiddenException("Cannot modify amount or description after submission");
      }
    }

    return this.reimbursementService.update(id, updateReimbursementDto);
  }

  @Post(":id/approve")
  @Roles("admin") // ← Only admin can approve
  approve(@Param("id") id: string, @Body() approveDto: ApproveReimbursementDto, @Req() req: Request) {
    // Get admin name from authenticated user
    const approvedBy = (req as any).user?.email || "admin";
    return this.reimbursementService.approve(id, approveDto, approvedBy);
  }

  @Delete(":id")
  @Roles("admin") // ← Only admin can delete
  remove(@Param("id") id: string) {
    return this.reimbursementService.remove(id);
  }
}
