import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { CloudinaryModule } from "../config/cloudinary.module";

@Module({
  imports: [CloudinaryModule],
  controllers: [UploadController],
})
export class UploadModule {}
