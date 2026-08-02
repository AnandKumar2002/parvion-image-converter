import { useState, useCallback, useEffect, useRef } from 'react';
import { ImageFile, ImageExtension, ImageMimeType } from '../types/image.types';
import { ImageValidationService } from '../services/imageValidationService';
import { generateUniqueId } from '../utils/fileUtils';
import { SUPPORTED_FORMATS } from '../constants/imageFormats';

export function useFileUpload() {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
    };
  }, []);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    const validation = ImageValidationService.validate(file);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    let fileToProcess = file;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'unknown';
    const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || ext === 'heic' || ext === 'heif';

    if (isHeic) {
      try {
        const heic2any = (await import('heic2any')).default;
        const conversionResult = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9
        });
        const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
        fileToProcess = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: 'image/jpeg'
        });
      } catch (err: any) {
        const errMsg = err?.message || (typeof err === 'string' ? err : '');
        if (errMsg.includes("already browser readable")) {
          // If the image is already browser-readable (e.g., a PNG/JPEG renamed to .heic),
          // we can skip the conversion and use the file directly.
          fileToProcess = file;
        } else {
          console.error("HEIC conversion failed:", err);
          let errorDetails = "";
          if (err instanceof Error) {
            errorDetails = err.message;
          } else if (typeof err === 'string') {
            errorDetails = err;
          } else {
            try {
              errorDetails = JSON.stringify(err);
            } catch (e) {
              errorDetails = String(err);
            }
          }
          if (errorDetails === "{}" || !errorDetails) {
            errorDetails = "Check console for details (possibly blocked by COEP policy or unsupported HEIC format)";
          }
          setError(`Failed to decode HEIC image: ${errorDetails}`);
          return;
        }
      }
    }

    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }

    const previewUrl = URL.createObjectURL(fileToProcess);
    urlRef.current = previewUrl;

    const resolvedMimeType = (file.type || SUPPORTED_FORMATS[ext as ImageExtension] || '') as ImageMimeType;

    const img = new Image();
    
    img.onload = () => {
      setImageFile({
        id: generateUniqueId(),
        file: fileToProcess,
        name: file.name,
        extension: ext as ImageExtension,
        mimeType: resolvedMimeType,
        size: file.size,
        width: img.width,
        height: img.height,
        previewUrl
      });
    };
    
    img.onerror = () => {
      setImageFile({
        id: generateUniqueId(),
        file: fileToProcess,
        name: file.name,
        extension: ext as ImageExtension,
        mimeType: resolvedMimeType,
        size: file.size,
        previewUrl
      });
    };

    img.src = previewUrl;
  }, []);

  const clearFile = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setImageFile(null);
    setError(null);
  }, []);

  return {
    imageFile,
    error,
    isDragging,
    setIsDragging,
    processFile,
    clearFile
  };
}
