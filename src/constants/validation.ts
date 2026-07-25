export const VALIDATION_RULES = {
  MAX_FILE_SIZE_MB: 20,
  MAX_FILE_SIZE_BYTES: 20 * 1024 * 1024, // 20 MB
  ALLOWED_MIME_TYPES: [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/x-icon',
    'image/avif',
    'image/svg+xml'
  ]
};
