// backend/src/common/pipes/form-data.pipe.ts
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FormDataPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // ✅ Jika value bukan object atau null, kembalikan apa adanya
    if (!value || typeof value !== "object") {
      return value;
    }

    // ✅ DETEKSI: Apakah ini JSON body atau multipart/form-data?
    // Ciri-ciri multipart: ada File object (punya property buffer/originalname/mimetype)
    const values = Object.values(value);
    const hasFileObject = values.some((v: any) => v && typeof v === "object" && ("buffer" in v || "originalname" in v || "mimetype" in v || v.constructor?.name === "File"));

    // ✅ Jika TIDAK ada File object → ini JSON request → kembalikan apa adanya!
    // Ini mencegah receiptUrl/fileUrl dari JSON di-override jadi undefined
    if (!hasFileObject) {
      return value;
    }

    // ✅ Jika ADA File object → ini multipart request → lakukan transformasi FormData
    // (extract first element from arrays, karena FormData sends values as arrays)
    const transformed: any = {};

    for (const [key, val] of Object.entries(value)) {
      if (Array.isArray(val)) {
        // Ambil element pertama jika array, atau undefined jika kosong
        transformed[key] = val.length > 0 ? val[0] : undefined;
      } else {
        transformed[key] = val;
      }
    }

    return transformed;
  }
}
