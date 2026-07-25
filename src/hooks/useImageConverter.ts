import { useState, useCallback, useEffect, useRef } from 'react';
import { ImageFile, ConversionOptions } from '../types/image.types';
import { ImageConverterService } from '../services/imageConverterService';
import { VideoConverterService } from '../services/videoConverterService';

export function useImageConverter() {
  const [isConverting, setIsConverting] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to track the latest URL for cleanup
  const urlRef = useRef<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
    };
  }, []);

  const convert = useCallback(async (imageFile: ImageFile, options: ConversionOptions) => {
    setIsConverting(true);
    setError(null);
    setResultBlob(null);
    
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setResultUrl(null);

    try {
      let blob: Blob;

      if (options.format === 'video/mp4') {
        blob = await VideoConverterService.convertGifToMp4(imageFile, options);
      } else {
        blob = await ImageConverterService.convert(imageFile, options);
      }

      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      
      setResultBlob(blob);
      setResultUrl(url);
      setIsConverting(false);
      return url;
    } catch (err: any) {
      setError(err.message || 'An error occurred during conversion.');
      setIsConverting(false);
      return null;
    }
  }, []);

  const download = useCallback((filename: string) => {
    if (!urlRef.current) return;
    const a = document.createElement('a');
    a.href = urlRef.current;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const clearResult = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
  }, []);

  return {
    isConverting,
    resultBlob,
    resultUrl,
    error,
    convert,
    download,
    clearResult
  };
}
