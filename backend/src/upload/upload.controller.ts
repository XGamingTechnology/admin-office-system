import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Req } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CloudinaryService } from "../config/cloudinary.service";

@Controller("upload")
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error("No file uploaded");

    const fileUrl = await this.cloudinaryService.uploadFile(file, "office_admin");

    return {
      success: true,
      fileUrl,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
