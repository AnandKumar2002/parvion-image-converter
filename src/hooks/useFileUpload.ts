import { useState, useCallback, useEffect, useRef } from 'react';
import { ImageFile, ImageExtension, ImageMimeType } from '../types/image.types';
import { ImageValidationService } from '../services/imageValidationService';
import { generateUniqueId } from '../utils/fileUtils';

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

    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }

    const previewUrl = URL.createObjectURL(file);
    urlRef.current = previewUrl;

    const img = new Image();
    
    img.onload = () => {
      const ext = file.name.split('.').pop()?.toLowerCase() as ImageExtension || 'unknown';
      setImageFile({
        id: generateUniqueId(),
        file,
        name: file.name,
        extension: ext,
        mimeType: file.type as ImageMimeType,
        size: file.size,
        width: img.width,
        height: img.height,
        previewUrl
      });
    };
    
    img.onerror = () => {
      const ext = file.name.split('.').pop()?.toLowerCase() as ImageExtension || 'unknown';
      setImageFile({
        id: generateUniqueId(),
        file,
        name: file.name,
        extension: ext,
        mimeType: file.type as ImageMimeType,
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
