"use client";

import { useState } from "react";
import { Feature } from "@/src/types/feature";
import { UploadBox } from "./UniversalConverter/UploadBox";
import { ImagePreview } from "./UniversalConverter/ImagePreview";
import { SlidersHorizontal, Zap, Layers, FileOutput, Loader2, Download, AlertCircle, TrendingDown } from "lucide-react";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { useImageConverter } from "@/src/hooks/useImageConverter";
import { ImageMimeType } from "@/src/types/image.types";
import { formatBytes } from "@/src/utils/fileUtils";

import { Settings2 } from "lucide-react";

type CompressionLevel = 'Lossless' | 'Optimal' | 'Extreme' | 'Custom';

const COMPRESSION_CONFIG: Record<string, any> = {
  Lossless: { quality: 0.95, desc: 'No quality loss, minor size reduction', icon: <Layers className="w-5 h-5 mb-3 opacity-70" /> },
  Optimal: { quality: 0.75, desc: 'Great visual quality, huge size reduction', icon: <Zap className="w-5 h-5 mb-3 opacity-70" /> },
  Extreme: { quality: 0.50, desc: 'Noticeable loss, tiny file sizes', icon: <SlidersHorizontal className="w-5 h-5 mb-3 opacity-70" /> },
  Custom: { quality: 0, desc: 'Target a specific max file size in KB', icon: <Settings2 className="w-5 h-5 mb-3 opacity-70" /> }
};

export function CompressorUI({ feature }: { feature: Feature }) {
  const { imageFile, error: uploadError, isDragging, setIsDragging, processFile, clearFile } = useFileUpload();
  const { isConverting, resultUrl, resultBlob, error: convertError, convert, download, clearResult } = useImageConverter();

  // If the user clicks "Reduce file size" from the sidebar, default to Custom
  const initialLevel = feature.slug === 'reduce-file-size' ? 'Custom' : 
                       feature.slug === 'lossless' ? 'Lossless' : 'Optimal';
                       
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>(initialLevel);
  const [targetSize, setTargetSize] = useState<string>('50'); // Default 50KB

  const handleFileSelect = (file: File) => {
    processFile(file);
    clearResult();
  };

  const handleClear = () => {
    clearFile();
    clearResult();
  };

  const handleLevelSelect = (level: CompressionLevel) => {
    setCompressionLevel(level);
    clearResult(); // force them to re-compress if they change level
  };

  const handleCompress = async () => {
    if (!imageFile) return;

    let targetFormat: ImageMimeType = imageFile.mimeType;
    
    // Auto-convert PNG to WebP for actual compression benefits
    if (targetFormat === 'image/png') {
      targetFormat = 'image/webp';
    }

    await convert(imageFile, {
      format: targetFormat,
      quality: compressionLevel === 'Custom' ? 1.0 : COMPRESSION_CONFIG[compressionLevel].quality,
      targetSizeKb: compressionLevel === 'Custom' ? parseFloat(targetSize) : undefined
    });
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

      {!imageFile ? (
        <UploadBox 
          onFileSelect={handleFileSelect} 
          isDragging={isDragging} 
          setIsDragging={setIsDragging} 
        />
      ) : (
        <ImagePreview imageFile={imageFile} onClear={handleClear} onFileSelect={handleFileSelect} />
      )}

      {/* Compression Pipeline */}
      {imageFile && (
        <div className="bg-card/40 border border-border rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-sm relative overflow-hidden transition-all duration-500 ease-in-out">
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-border/50">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
              <SlidersHorizontal className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Compression Level</h3>
              <p className="text-sm text-muted-foreground mt-1">Choose how aggressively to compress your {imageFile.extension.toUpperCase()} file</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(Object.keys(COMPRESSION_CONFIG) as CompressionLevel[]).map((level) => {
                const config = COMPRESSION_CONFIG[level];
                const isActive = compressionLevel === level;
                return (
                  <button 
                    key={level}
                    onClick={() => handleLevelSelect(level)}
                    className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 cursor-pointer ${
                      isActive 
                        ? 'bg-primary/5 border-primary shadow-[0_0_20px_-5px_rgba(var(--primary),0.15)] scale-[1.02]' 
                        : 'bg-background/50 border-border/50 hover:border-primary/50 hover:bg-background'
                    }`}
                  >
                    {config.icon}
                    <div className={`font-bold mb-2 text-xl ${isActive ? 'text-primary' : 'text-foreground'}`}>{level}</div>
                    <div className="text-sm text-muted-foreground font-medium leading-relaxed">{config.desc}</div>
                    
                    {level === 'Custom' && isActive && (
                      <div className="mt-4 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <input 
                          type="number" 
                          value={targetSize}
                          onChange={(e) => {
                            setTargetSize(e.target.value);
                            clearResult();
                          }}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold focus:outline-none focus:border-primary"
                          placeholder="e.g. 50"
                          min="1"
                        />
                        <span className="text-sm font-bold text-muted-foreground">KB</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-start sm:items-center gap-4 bg-primary/5 border border-primary/20 p-5 rounded-2xl">
              <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
                 <Zap className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-foreground/80 font-medium leading-relaxed">
                <strong className="text-primary mr-1">Smart Optimization:</strong> 
                {imageFile.mimeType === 'image/png' 
                  ? " PNGs don't compress well natively, so we automatically convert them to high-efficiency WebP format under the hood to dramatically reduce file size."
                  : " We automatically strip unnecessary hidden metadata (like EXIF camera data) to further optimize file sizes without affecting how the image looks."}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-10 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              {resultBlob && !isConverting ? (
                <>
                  <h4 className={`font-bold text-lg flex items-center justify-center sm:justify-start gap-2 ${
                    compressionLevel === 'Custom' && resultBlob.size > parseFloat(targetSize) * 1024 * 1.1
                      ? 'text-yellow-500'
                      : 'text-emerald-500'
                  }`}>
                    {compressionLevel === 'Custom' && resultBlob.size > parseFloat(targetSize) * 1024 * 1.1 ? (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        Maximum Compression Reached
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-5 h-5" />
                        Successfully Compressed!
                      </>
                    )}
                  </h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    Reduced from <span className="font-bold">{formatBytes(imageFile.size)}</span> to <span className="font-bold text-foreground">{formatBytes(resultBlob.size)}</span>
                  </p>
                  {compressionLevel === 'Custom' && resultBlob.size > parseFloat(targetSize) * 1024 * 1.1 && (
                    <p className="text-yellow-500/80 text-xs mt-2 max-w-sm">
                      We applied maximum compression (0% quality), but large image dimensions prevent it from reaching {targetSize}KB. Try resizing the dimensions first.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h4 className="font-bold text-foreground text-lg">Ready to compress</h4>
                  <p className="text-muted-foreground text-sm">
                    {imageFile.name}
                  </p>
                </>
              )}
            </div>

            <button 
              onClick={resultUrl ? () => download(`compressed_${imageFile.name.split('.')[0]}.${imageFile.mimeType === 'image/png' ? 'webp' : imageFile.extension}`) : handleCompress}
              disabled={isConverting}
              className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground font-black rounded-xl shadow-sm hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {isConverting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : resultUrl ? (
                <Download className="w-6 h-6" />
              ) : (
                <FileOutput className="w-6 h-6" />
              )}
              {isConverting ? 'Compressing...' : resultUrl ? 'Download Result' : 'Compress Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
