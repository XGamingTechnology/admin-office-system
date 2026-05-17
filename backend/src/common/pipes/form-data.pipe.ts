import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FormDataPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Only process objects (not null, undefined, etc.)
    if (!value || typeof value !== 'object') {
      return value;
    }

    const transformed: any = {};
    
    for (const [key, val] of Object.entries(value)) {
      // If value is an array, extract the first element (FormData sends values as arrays)
      if (Array.isArray(val)) {
        transformed[key] = val.length > 0 ? val[0] : undefined;
      } else {
        transformed[key] = val;
      }
    }

    return transformed;
  }
}
