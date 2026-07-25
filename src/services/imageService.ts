export type TargetFormat = 'JPG' | 'PNG' | 'WEBP';

export class ImageService {
  /**
   * Converts an image file to a new format using HTML5 Canvas.
   * Runs entirely in the browser.
   */
  static async convertImage(file: File, targetFormat: TargetFormat, quality: number = 0.9): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        // 1. Create a FileReader to read the uploaded file
        const reader = new FileReader();
        
        reader.onload = (event) => {
          // 2. Load the file data into an HTML Image element
          const img = new Image();
          
          img.onload = () => {
            // 3. Create a canvas with the exact dimensions of the image
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 4. Draw the image onto the canvas
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              return reject(new Error("Could not get 2D context from canvas"));
            }

            // Fill background with white for JPGs (since they don't support transparency)
            if (targetFormat === 'JPG') {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);
            
            // 5. Determine the MIME type
            let mimeType = 'image/jpeg';
            if (targetFormat === 'PNG') mimeType = 'image/png';
            if (targetFormat === 'WEBP') mimeType = 'image/webp';

            // 6. Export the canvas to a Blob
            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Failed to convert image to blob"));
              },
              mimeType,
              quality
            );
          };

          img.onerror = () => reject(new Error("Failed to load image element"));
          img.src = event.target?.result as string;
        };
        
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }
}
