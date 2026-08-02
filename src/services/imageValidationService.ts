import { ValidationResult } from '../types/image.types';
import { VALIDATION_RULES } from '../constants/validation';

export class ImageValidationService {
  static validate(file: File): ValidationResult {
    if (!file) {
      return { isValid: false, error: 'No file provided.' };
    }

    if (file.size === 0) {
      return { isValid: false, error: 'File is empty.' };
    }

    if (file.size > VALIDATION_RULES.MAX_FILE_SIZE_BYTES) {
      return { 
        isValid: false, 
        error: `File is too large. Maximum size is ${VALIDATION_RULES.MAX_FILE_SIZE_MB}MB.` 
      };
    }

    // Fallback for Windows/browsers that don't recognize some MIME types and return an empty string
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExtension = ext && ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'ico', 'svg', 'heic', 'heif'].includes(ext);

    if (!VALIDATION_RULES.ALLOWED_MIME_TYPES.includes(file.type as any) && !isAllowedExtension) {
      return { 
        isValid: false, 
        error: `Unsupported file type: ${file.type || ext || 'Unknown'}. Please upload a valid image.` 
      };
    }

    return { isValid: true };
  }
}
