"use client";

import { useState } from 'react';
import { useFileUpload } from '@/src/hooks/useFileUpload';
import { useImageConverter } from '@/src/hooks/useImageConverter';
import { ImageMimeType } from '@/src/types/image.types';
import { FORMAT_DISPLAY_NAMES } from '@/src/constants/imageFormats';

import { UploadBox } from './UploadBox';
import { ImagePreview } from './ImagePreview';
import { OutputSelector } from './OutputSelector';
import { ConversionControls } from './ConversionControls';
import { FileOutput, Loader2, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { SUPPORTED_FORMATS } from '@/src/constants/imageFormats';

export function UniversalConverter({ featureSlug }: { featureSlug?: string }) {
  const { imageFile, error: uploadError, isDragging, setIsDragging, processFile, clearFile } = useFileUpload();
  const { isConverting, resultUrl, error: convertError, convert, download, clearResult } = useImageConverter();

  // Settings State
  const [targetFormat, setTargetFormat] = useState<ImageMimeType | null>(null);
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState('#FFFFFF');

  // When a file is uploaded, auto-select a default target format
  const handleFileSelect = (file: File) => {
    processFile(file);
    if (!targetFormat) {
      const type = file.type;
      let newTargetFormat: ImageMimeType | null = null;
      
      // 1. Try to extract expected target format from the URL slug (e.g. 'png-to-jpg' -> 'jpg')
      if (featureSlug) {
        let expectedTargetExt: string | undefined;
        
        if (featureSlug.includes('-to-')) {
           expectedTargetExt = featureSlug.split('-to-')[1]; // e.g. 'jpg'
        } else if (featureSlug.includes('webp')) {
           expectedTargetExt = 'webp';
        }
        
        if (expectedTargetExt) {
           // We cast to any because TS doesn't know expectedTargetExt is a valid key
           const targetMime = (SUPPORTED_FORMATS as any)[expectedTargetExt];
           // Only use it if the user didn't literally upload the exact same format
           if (targetMime && targetMime !== type) {
             newTargetFormat = targetMime;
           }
        }
      }
      
      // 2. Fallback to default behavior if the URL didn't specify or we couldn't use it
      if (!newTargetFormat) {
        newTargetFormat = type === 'image/jpeg' ? 'image/png' : 'image/jpeg';
      }
      
      setTargetFormat(newTargetFormat);
    }
    clearResult();
  };

  const handleClear = () => {
    clearFile();
    clearResult();
  };

  const handleConvert = async () => {
    if (!imageFile || !targetFormat) return;
    
    await convert(imageFile, {
      format: targetFormat,
      quality: quality / 100,
      backgroundColor: bgColor
    });
  };

  const handleSettingsChange = () => {
    clearResult(); // force them to re-convert if they change a setting
  };

  const error = uploadError || convertError;

  return (
    <div className="w-full space-y-6 animate-fade-in-up">

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-5 py-4 rounded-2xl flex items-center gap-3 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Upload or Preview */}
      {!imageFile ? (
        <UploadBox 
          onFileSelect={handleFileSelect} 
          isDragging={isDragging} 
          setIsDragging={setIsDragging} 
        />
      ) : (
        <ImagePreview imageFile={imageFile} onClear={handleClear} onFileSelect={handleFileSelect} />
      )}

      {/* Conversion Settings Pipeline */}
      {imageFile && (
        <div className="space-y-6 transition-all duration-500 ease-in-out">
          
          <OutputSelector 
            inputMimeType={imageFile.mimeType}
            selectedOutputFormat={targetFormat || 'image/jpeg'}
            onSelectFormat={(fmt) => {
              setTargetFormat(fmt);
              handleSettingsChange();
            }}
          />

          <ConversionControls 
            quality={quality}
            setQuality={setQuality}
            bgColor={bgColor}
            setBgColor={setBgColor}
            showQuality={targetFormat === 'image/jpeg' || targetFormat === 'image/webp' || targetFormat === 'image/avif'}
            showBgColor={targetFormat === 'image/jpeg' && (imageFile.mimeType === 'image/png' || imageFile.mimeType === 'image/svg+xml')}
            onSettingsChange={handleSettingsChange}
          />

          {/* Action Footer */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              {resultUrl && !isConverting ? (
                <>
                  <h4 className="font-bold text-emerald-500 text-lg flex items-center justify-center sm:justify-start gap-2">
                    <CheckCircle className="w-5 h-5" /> 
                    Successfully Converted!
                  </h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    Your {targetFormat ? FORMAT_DISPLAY_NAMES[targetFormat] : 'file'} is ready to download.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-foreground text-lg">Ready to convert</h4>
                  <p className="text-muted-foreground text-sm">
                    {FORMAT_DISPLAY_NAMES[imageFile.mimeType]} → {targetFormat ? FORMAT_DISPLAY_NAMES[targetFormat] : '?'}
                  </p>
                </>
              )}
            </div>

            <button 
              onClick={resultUrl ? () => download(`converted_${imageFile.name.split('.')[0]}.${targetFormat?.split('/')[1]}`) : handleConvert}
              disabled={isConverting || !targetFormat}
              className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground font-black rounded-xl shadow-sm hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {isConverting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : resultUrl ? (
                <Download className="w-6 h-6" />
              ) : (
                <FileOutput className="w-6 h-6" />
              )}
              {isConverting ? 'Processing...' : resultUrl ? 'Download Now' : 'Convert Image'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
