import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { ImageFile, ConversionOptions } from '../types/image.types';

export class VideoConverterService {
  static ffmpeg: FFmpeg | null = null;

  static async load() {
    if (this.ffmpeg) return;
    
    this.ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  }

  static async convertGifToMp4(imageFile: ImageFile, options: ConversionOptions): Promise<Blob> {
    if (imageFile.mimeType !== 'image/gif') {
      throw new Error('This service currently only supports converting GIFs to MP4');
    }

    if (!this.ffmpeg) {
      await this.load();
    }

    const ffmpeg = this.ffmpeg!;
    const inputName = `input_${imageFile.id}.gif`;
    const outputName = `output_${imageFile.id}.mp4`;

    try {
      // Write file to FFmpeg FS
      await ffmpeg.writeFile(inputName, await fetchFile(imageFile.file));

      // Execute conversion command
      // -pix_fmt yuv420p is required for MP4s to play in QuickTime/Apple devices
      await ffmpeg.exec(['-i', inputName, '-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', outputName]);

      // Read output
      const data = await ffmpeg.readFile(outputName);
      
      // Cleanup FFmpeg FS
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      return new Blob([data as any], { type: 'video/mp4' });
    } catch (error) {
      console.error('FFmpeg Conversion Error:', error);
      throw new Error('Failed to convert GIF to MP4.');
    }
  }
  static async convertImageToGif(imageBlob: Blob): Promise<Blob> {
    if (!this.ffmpeg) {
      await this.load();
    }

    const ffmpeg = this.ffmpeg!;
    const inputName = `input_${Date.now()}.png`;
    const outputName = `output_${Date.now()}.gif`;

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(imageBlob));

      // Convert image to a high quality 1-frame GIF
      await ffmpeg.exec(['-i', inputName, outputName]);

      const data = await ffmpeg.readFile(outputName);
      
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      return new Blob([data as any], { type: 'image/gif' });
    } catch (error) {
      console.error('FFmpeg GIF Conversion Error:', error);
      throw new Error('Failed to convert image to GIF.');
    }
  }
}
