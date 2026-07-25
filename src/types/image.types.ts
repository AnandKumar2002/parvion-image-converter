export type ImageMimeType = 
  | 'image/png' 
  | 'image/jpeg' 
  | 'image/webp' 
  | 'image/gif' 
  | 'image/bmp' 
  | 'image/tiff' 
  | 'image/x-icon' 
  | 'image/avif' 
  | 'image/svg+xml'
  | 'video/mp4';

export type ImageExtension = 
  | 'png' 
  | 'jpg' 
  | 'jpeg' 
  | 'webp' 
  | 'gif' 
  | 'bmp' 
  | 'tiff' 
  | 'ico' 
  | 'avif' 
  | 'svg'
  | 'mp4';

export interface ImageFile {
  file: File;
  id: string;
  name: string;
  extension: ImageExtension;
  mimeType: ImageMimeType;
  size: number;
  width?: number;
  height?: number;
  previewUrl: string;
}

export interface ConversionOptions {
  format: ImageMimeType;
  quality: number; // 0.1 to 1.0
  backgroundColor?: string; // e.g. '#FFFFFF' or 'transparent'
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  targetSizeKb?: number; // Target file size in KB for binary search compression
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
