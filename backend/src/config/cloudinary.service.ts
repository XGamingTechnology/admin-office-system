import { Injectable, BadRequestException } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

@Injectable()
export class CloudinaryService {
  /**
   * Upload file ke Cloudinary
   */
  async uploadFile(file: Express.Multer.File, folder: string = "admin-office"): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      cloudinary.uploader.upload(
        dataURI,
        {
          folder,
          resource_type: "auto", // auto-detect: image, video, raw
          overwrite: true,
          invalidate: true,
        },
        (error: UploadApiErrorResponse | null, result?: UploadApiResponse) => {
          if (error) {
            console.error("❌ Cloudinary Upload Error:", error);
            return reject(new BadRequestException(`Upload failed: ${error.message}`));
          }
          if (!result?.secure_url) {
            return reject(new BadRequestException("Upload succeeded but no URL returned"));
          }
          console.log("✅ Cloudinary Upload Success:", result.secure_url);
          resolve(result.secure_url);
        }
      );
    });
  }

  /**
   * Delete file dari Cloudinary berdasarkan public_id
   */
  async deleteFile(publicId: string): Promise<{ result: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
