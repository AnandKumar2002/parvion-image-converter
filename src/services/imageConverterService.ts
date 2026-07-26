import { ConversionOptions, ImageFile } from '../types/image.types';
import { CanvasService } from './canvasService';
import { VideoConverterService } from './videoConverterService';

export class ImageConverterService {
  /**
   * Main entry point for converting an ImageFile using native browser APIs.
   */
  static async convert(imageFile: ImageFile, options: ConversionOptions): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        
        img.onload = async () => {
          try {
            // Draw to canvas with any resizing/backgrounds applied
            const canvas = CanvasService.drawImageToCanvas(img, options);
            // Export to final blob
            let blob: Blob;

            if (options.format === 'image/gif') {
              const pngBlob = await CanvasService.exportCanvasToBlob(canvas, 'image/png', 1.0);
              blob = await VideoConverterService.convertImageToGif(pngBlob);
            } else if (options.targetSizeKb && (options.format === 'image/jpeg' || options.format === 'image/webp')) {
              // Binary Search Compression
              const targetBytes = options.targetSizeKb * 1024;
              let minQ = 0.0;
              let maxQ = 1.0;
              let bestBlob: Blob | null = null;
              
              for (let i = 0; i < 7; i++) {
                const midQ = (minQ + maxQ) / 2;
                const currentBlob = await CanvasService.exportCanvasToBlob(canvas, options.format, midQ);
                
                if (currentBlob.size > targetBytes) {
                  maxQ = midQ; // Too big, lower quality
                } else {
                  bestBlob = currentBlob; // Good! Save it, try to increase quality
                  minQ = midQ;
                }
              }
              
              // If we never found a blob small enough, just use the absolute lowest quality (0.0)
              blob = bestBlob || await CanvasService.exportCanvasToBlob(canvas, options.format, 0.0);
              
            } else {
              // Standard single-pass compression
              blob = await CanvasService.exportCanvasToBlob(canvas, options.format, options.quality);
            }

            resolve(blob);
          } catch (err) {
            reject(err);
          }
        };

        img.onerror = () => reject(new Error('Failed to load image for conversion.'));
        img.src = imageFile.previewUrl;

      } catch (error) {
        reject(error);
      }
    });
  }
}
