import { ConversionOptions } from '../types/image.types';

export class CanvasService {
  /**
   * Draws an HTMLImageElement to a canvas, applying resizing and background colors.
   */
  static drawImageToCanvas(img: HTMLImageElement, options: ConversionOptions): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    
    // Apply resizing if provided, otherwise use original dimensions
    let finalWidth = img.width;
    let finalHeight = img.height;
    
    if (options.width && options.height) {
      if (options.maintainAspectRatio) {
        const ratio = Math.min(options.width / img.width, options.height / img.height);
        finalWidth = img.width * ratio;
        finalHeight = img.height * ratio;
      } else {
        finalWidth = options.width;
        finalHeight = options.height;
      }
    } else if (options.width) {
      const ratio = options.width / img.width;
      finalWidth = options.width;
      finalHeight = img.height * ratio;
    } else if (options.height) {
      const ratio = options.height / img.height;
      finalWidth = img.width * ratio;
      finalHeight = options.height;
    }

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context from canvas');

    // Apply Background Color (crucial for transparent PNG -> JPG)
    if (options.backgroundColor && options.backgroundColor !== 'transparent') {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (options.format === 'image/jpeg') {
      // JPEG doesn't support transparency, default to white
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw the image
    ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

    return canvas;
  }

  static exportCanvasToBlob(canvas: HTMLCanvasElement, format: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (format === 'image/svg+xml') {
        const dataUrl = canvas.toDataURL('image/png');
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
  <image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" />
</svg>`;
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        return resolve(blob);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to export canvas to blob'));
        },
        format,
        quality
      );
    });
  }
}
