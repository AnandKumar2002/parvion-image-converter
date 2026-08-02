import { ImageExtension, ImageMimeType } from '../types/image.types';

export const SUPPORTED_FORMATS: Record<ImageExtension, ImageMimeType> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  ico: 'image/x-icon',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  heic: 'image/heic',
  heif: 'image/heif'
};

// Which formats we can currently convert TO using native Canvas APIs (Phase 1) + WASM (Phase 3)
// We add image/heic here so it shows up in the "Convert to" options list.
export const SUPPORTED_OUTPUT_MIME_TYPES: ImageMimeType[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/bmp',
  'image/gif',
  'image/svg+xml',
  'image/heic',
  'video/mp4' // Enabled via Phase 3 FFmpeg
];

export const FORMAT_DISPLAY_NAMES: Record<ImageMimeType, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'image/webp': 'WebP',
  'image/gif': 'GIF',
  'image/bmp': 'BMP',
  'image/tiff': 'TIFF',
  'image/x-icon': 'ICO',
  'image/avif': 'AVIF',
  'image/svg+xml': 'SVG',
  'video/mp4': 'MP4',
  'image/heic': 'HEIC',
  'image/heif': 'HEIF'
};
