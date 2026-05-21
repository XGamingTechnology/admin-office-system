// backend/src/office/reimbursement/reimbursement.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Req, UseGuards, ForbiddenException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";

import { ReimbursementService } from "./reimbursement.service";
import { CreateReimbursementDto, UpdateReimbursementDto, ApproveReimbursementDto } from "./dto/reimbursement.dto";
import { CloudinaryService } from "../../config/cloudinary.service";
// ❌ HAPUS IMPORT INI JIKA TIDAK DIPAKAI LAGI:
// import { FormDataPipe } from "../../common/pipes/form-data.pipe";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";

@Controller("office/reimbursements")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReimbursementController {
  constructor(
    private readonly reimbursementService: ReimbursementService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  // ✅ FIX: HAPUS @UsePipes(new FormDataPipe()) agar JSON request tidak di-override
  @Post()
  @Roles("admin", "user")
  @UseInterceptors(FileInterceptor("file"))
  // ❌ @UsePipes(new FormDataPipe())  ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←...... HAPUS INI!
  async create(@Body() createReimbursementDto: CreateReimbursementDto, @UploadedFile() file?: Express.Multer.File, @Req() req?: Request) {
    const userId = (req as any)?.user?.sub;

    // ✅ FIX: Start with receiptUrl from DTO (frontend may have already uploaded to Cloudinary via JSON)
    let finalReceiptUrl: string | undefined = createReimbursementDto.receiptUrl;

    // ✅ Jika ada file upload via multipart/form-data, upload ke Cloudinary & override
    if (file) {
      finalReceiptUrl = await this.cloudinaryService.uploadFile(file);
    }

    // ✅ PASS receiptUrl (bukan fileUrl!) ke service
    return this.reimbursementService.create({
      ...createReimbursementDto,
      receiptUrl: finalReceiptUrl, // ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←......
      createdBy: userId,
    });
  }

  @Get()
  @Roles("admin", "user")
  findAll(@Req() req?: Request) {
    const user = (req as any)?.user;
    const role = this._extractRole(user);

    if (role !== "admin") {
      return this.reimbursementService.findAllByUser(user?.sub);
    }
    return this.reimbursementService.findAll();
  }

  @Get("statistics")
  @Roles("admin")
  getStatistics() {
    return this.reimbursementService.getStatistics();
  }

  @Get(":id")
  @Roles("admin", "user")
  async findOne(@Param("id") id: string, @Req() req?: Request) {
    const item = await this.reimbursementService.findOne(id);
    const user = (req as any)?.user;
    const role = this._extractRole(user);

    if (role !== "admin" && item.createdBy !== user?.sub) {
      throw new ForbiddenException("You can only view your own reimbursements");
    }
    return item;
  }

  @Patch(":id")
  @Roles("admin", "user")
  async update(@Param("id") id: string, @Body() updateReimbursementDto: UpdateReimbursementDto, @Req() req?: Request) {
    const user = (req as any)?.user;
    const userId = user?.sub;
    const role = this._extractRole(user);

    console.log(`🔐 [RBAC] update reimbursement ${id}: role="${role}", userId="${userId}"`);

    const currentItem = await this.reimbursementService.findOne(id);

    // ✅ Admin bisa edit SEMUA, user hanya bisa edit milik sendiri
    if (role !== "admin" && currentItem.createdBy !== userId) {
      console.log(`🔐 [RBAC] Forbidden: user ${userId} tried to edit item owned by ${currentItem.createdBy}`);
      throw new ForbiddenException("You can only edit your own reimbursements");
    }

    // ✅ User biasa tidak boleh ubah status/approval
    if (role !== "admin") {
      if (updateReimbursementDto.status || updateReimbursementDto.approvedBy) {
        throw new ForbiddenException("Only admin can change status or approval fields");
      }
      if (currentItem.status !== "pending" && (updateReimbursementDto.amount || updateReimbursementDto.description)) {
        throw new ForbiddenException("Cannot modify amount or description after submission");
      }
    }

    return this.reimbursementService.update(id, updateReimbursementDto);
  }

  @Post(":id/approve")
  @Roles("admin")
  approve(@Param("id") id: string, @Body() approveDto: ApproveReimbursementDto, @Req() req?: Request) {
    const approvedBy = (req as any)?.user?.email || "admin";
    return this.reimbursementService.approve(id, approveDto, approvedBy);
  }

  // ✅ FIX: DELETE dengan RBAC ownership check
  @Delete(":id")
  @Roles("admin", "user")
  async remove(@Param("id") id: string, @Req() req?: Request) {
    const user = (req as any)?.user;
    const userId = user?.sub;
    const role = this._extractRole(user);

    console.log(`🔐 [RBAC DELETE] reimbursement ${id}: role="${role}", userId="${userId}"`);

    // ✅ FIX: Jika bukan admin, cek ownership
    if (role !== "admin") {
      const item = await this.reimbursementService.findOne(id);
      if (item.createdBy !== userId) {
        console.log(`🔐 [RBAC DELETE] Forbidden: user ${userId} tried to delete item owned by ${item.createdBy}`);
        throw new ForbiddenException("You can only delete your own reimbursements");
      }
    }

    await this.reimbursementService.remove(id);

    // ✅ RETURN JSON response
    return {
      success: true,
      message: "Reimbursement deleted successfully",
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
