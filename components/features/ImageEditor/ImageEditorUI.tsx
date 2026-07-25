"use client";

import { useState, useRef, useEffect } from "react";
import { Feature } from "@/src/types/feature";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { UploadBox } from "../UniversalConverter/UploadBox";
import { EditorSidebar } from "./EditorSidebar";
import { useEditorStore, EditorTool } from "./store";
import { SizeCheckerTool } from "./tools/SizeCheckerTool";
import { WatermarkTool } from "./tools/WatermarkTool";
import { 
  Crop, 
  Expand, 
  RotateCw, 
  FlipHorizontal,
  Download,
  Loader2,
  Link as LinkIcon,
  Unlink,
  Info,
  Stamp,
  Undo2,
  Redo2,
  ImagePlus
} from "lucide-react";
import ReactCrop, { type Crop as CropType } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export function ImageEditorUI({ feature }: { feature: Feature }) {
  const { imageFile, isDragging, setIsDragging, processFile, clearFile } = useFileUpload();
  
  const isStudioMode = feature.slug === 'image-editor';
  
  // Zustand Store
  const {
    activeTool, setActiveTool,
    crop, setCrop, cropAspect, setCropAspect,
    rotation, setRotation,
    scaleX, setScaleX,
    scaleY, setScaleY,
    resizeWidth, setResizeWidth,
    resizeHeight, setResizeHeight,
    maintainAspectRatio, setMaintainAspectRatio,
    watermarkType, watermarkText, watermarkOpacity,
    watermarkSize, watermarkPosition, watermarkPadding, watermarkColor,
    watermarkImage, watermarkRepeated,
    exportFormat, setExportFormat,
    resetEditor,
    past, future, commitHistory, undo, redo
  } = useEditorStore();

  const [patternUrl, setPatternUrl] = useState<string | null>(null);
  const [patternSize, setPatternSize] = useState<number>(100);

  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Set default tool based on feature
  useEffect(() => {
    let defaultTool: EditorTool = 'crop';
    if (feature.slug === 'resize-images') defaultTool = 'resize';
    if (feature.slug === 'rotate-images') defaultTool = 'rotate';
    if (feature.slug === 'flip-images') defaultTool = 'flip';
    if (feature.slug === 'size-checker') defaultTool = 'size-checker';
    if (feature.slug === 'watermark') defaultTool = 'watermark';
    
    if (!isStudioMode) {
      setActiveTool(defaultTool);
    } else if (activeTool === 'size-checker' || activeTool === 'watermark') {
      // If we are in studio mode, keep the current active tool
    }
  }, [feature.slug, isStudioMode, setActiveTool]);

  // Initialize dimensions on load
  useEffect(() => {
    if (imgRef.current && imageFile) {
      if (resizeWidth === '' && resizeHeight === '') {
        setResizeWidth(imgRef.current.naturalWidth);
        setResizeHeight(imgRef.current.naturalHeight);
      }
    }
  }, [imageFile, resizeWidth, resizeHeight, setResizeWidth, setResizeHeight]);

  // Generate Pattern URL for Live Preview
  useEffect(() => {
    if (activeTool !== 'watermark' || !watermarkRepeated) {
      setPatternUrl(null);
      return;
    }
    const vWidth = 1000;
    const tempCanvas = document.createElement('canvas');
    const tCtx = tempCanvas.getContext('2d');
    if (!tCtx) return;

    if (watermarkType === 'text' && watermarkText) {
      const baseFontSize = (vWidth * watermarkSize) / 100;
      tCtx.font = `bold ${baseFontSize}px Arial`;
      const metrics = tCtx.measureText(watermarkText);
      const paddingPx = (vWidth * watermarkPadding) / 100;
      const tileWidth = metrics.width + paddingPx * 2;
      const tileHeight = baseFontSize + paddingPx * 2;
      
      tempCanvas.width = tileWidth;
      tempCanvas.height = tileHeight;
      
      tCtx.font = `bold ${baseFontSize}px Arial`;
      tCtx.globalAlpha = watermarkOpacity / 100;
      tCtx.fillStyle = watermarkColor;
      tCtx.textAlign = 'center';
      tCtx.textBaseline = 'middle';
      tCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      tCtx.shadowBlur = baseFontSize * 0.1;
      tCtx.fillText(watermarkText, tileWidth / 2, tileHeight / 2);
      
      setPatternUrl(tempCanvas.toDataURL());
      setPatternSize((tileWidth / vWidth) * 100);
    } else if (watermarkType === 'image' && watermarkImage) {
      const img = new window.Image();
      img.src = watermarkImage;
      img.onload = () => {
        const targetWidth = (vWidth * watermarkSize) / 100;
        const ratio = img.naturalHeight / img.naturalWidth;
        const targetHeight = targetWidth * ratio;
        const paddingPx = (vWidth * watermarkPadding) / 100;
        const tileWidth = targetWidth + paddingPx * 2;
        const tileHeight = targetHeight + paddingPx * 2;
        
        tempCanvas.width = tileWidth;
        tempCanvas.height = tileHeight;
        
        tCtx.globalAlpha = watermarkOpacity / 100;
        tCtx.drawImage(img, paddingPx, paddingPx, targetWidth, targetHeight);
        setPatternUrl(tempCanvas.toDataURL());
        setPatternSize((tileWidth / vWidth) * 100);
      };
    }
  }, [activeTool, watermarkRepeated, watermarkType, watermarkText, watermarkImage, watermarkSize, watermarkPadding, watermarkOpacity, watermarkColor]);

  const handleFileSelect = (file: File) => {
    processFile(file);
    const currentTool = activeTool;
    resetEditor();
    if (!isStudioMode) {
      // We must force the tool back to what the page requires
      let defaultTool: EditorTool = 'crop';
      if (feature.slug === 'resize-images') defaultTool = 'resize';
      if (feature.slug === 'rotate-images') defaultTool = 'rotate';
      if (feature.slug === 'flip-images') defaultTool = 'flip';
      if (feature.slug === 'size-checker') defaultTool = 'size-checker';
      if (feature.slug === 'watermark') defaultTool = 'watermark';
      setActiveTool(defaultTool);
    } else {
      setActiveTool(currentTool);
    }
  };

  const handleResizeWidthChange = (val: string) => {
    const w = val ? Number(val) : '';
    setResizeWidth(w);
    if (maintainAspectRatio && typeof w === 'number' && imgRef.current) {
      const aspect = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
      setResizeHeight(Math.round(w / aspect));
    } else if (maintainAspectRatio && w === '') {
      setResizeHeight('');
    }
  };

  const handleResizeHeightChange = (val: string) => {
    const h = val ? Number(val) : '';
    setResizeHeight(h);
    if (maintainAspectRatio && typeof h === 'number' && imgRef.current) {
      const aspect = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
      setResizeWidth(Math.round(h * aspect));
    } else if (maintainAspectRatio && h === '') {
      setResizeWidth('');
    }
  };

  const toggleMaintainAspect = () => {
    const nextVal = !maintainAspectRatio;
    setMaintainAspectRatio(nextVal);
    if (nextVal && typeof resizeWidth === 'number' && imgRef.current) {
      const aspect = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
      setResizeHeight(Math.round(resizeWidth / aspect));
    }
  };

  const handleClear = () => {
    clearFile();
    const currentTool = activeTool;
    resetEditor();
    if (!isStudioMode) {
      let defaultTool: EditorTool = 'crop';
      if (feature.slug === 'resize-images') defaultTool = 'resize';
      if (feature.slug === 'rotate-images') defaultTool = 'rotate';
      if (feature.slug === 'flip-images') defaultTool = 'flip';
      if (feature.slug === 'size-checker') defaultTool = 'size-checker';
      if (feature.slug === 'watermark') defaultTool = 'watermark';
      setActiveTool(defaultTool);
    } else {
      setActiveTool(currentTool);
    }
  };

  const drawWatermark = async (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    if (activeTool !== 'watermark') return;
    
    if (watermarkRepeated) {
      const tempCanvas = document.createElement('canvas');
      const tCtx = tempCanvas.getContext('2d');
      if (!tCtx) return;

      if (watermarkType === 'text' && watermarkText) {
        const baseFontSize = (canvasWidth * watermarkSize) / 100;
        tCtx.font = `bold ${baseFontSize}px Arial`;
        const metrics = tCtx.measureText(watermarkText);
        const paddingPx = (canvasWidth * watermarkPadding) / 100;
        const tileWidth = metrics.width + paddingPx * 2;
        const tileHeight = baseFontSize + paddingPx * 2;
        
        tempCanvas.width = tileWidth;
        tempCanvas.height = tileHeight;
        
        tCtx.font = `bold ${baseFontSize}px Arial`;
        tCtx.globalAlpha = watermarkOpacity / 100;
        tCtx.fillStyle = watermarkColor;
        tCtx.textAlign = 'center';
        tCtx.textBaseline = 'middle';
        tCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        tCtx.shadowBlur = baseFontSize * 0.1;
        tCtx.fillText(watermarkText, tileWidth / 2, tileHeight / 2);
      } else if (watermarkType === 'image' && watermarkImage) {
        const img = new window.Image();
        img.src = watermarkImage;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        const targetWidth = (canvasWidth * watermarkSize) / 100;
        const ratio = img.naturalHeight / img.naturalWidth;
        const targetHeight = targetWidth * ratio;
        const paddingPx = (canvasWidth * watermarkPadding) / 100;
        const tileWidth = targetWidth + paddingPx * 2;
        const tileHeight = targetHeight + paddingPx * 2;
        
        tempCanvas.width = tileWidth;
        tempCanvas.height = tileHeight;
        
        tCtx.globalAlpha = watermarkOpacity / 100;
        tCtx.drawImage(img, paddingPx, paddingPx, targetWidth, targetHeight);
      } else {
        return;
      }
      
      ctx.save();
      const pattern = ctx.createPattern(tempCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        // Tile diagonally across a larger area to cover corners after rotation
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(-30 * Math.PI / 180); // Classic -30 degree slant
        const maxDim = Math.max(canvasWidth, canvasHeight) * 2;
        ctx.translate(-maxDim / 2, -maxDim / 2);
        ctx.fillRect(0, 0, maxDim, maxDim);
      }
      ctx.restore();
    } else {
      if (watermarkType === 'text' && watermarkText) {
      ctx.save();
      
      const baseFontSize = (canvasWidth * watermarkSize) / 100;
      ctx.font = `bold ${baseFontSize}px Arial`;
      ctx.globalAlpha = watermarkOpacity / 100;
      ctx.fillStyle = watermarkColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = baseFontSize * 0.1;
      
      const paddingPx = (canvasWidth * watermarkPadding) / 100;
      const metrics = ctx.measureText(watermarkText);
      const textHeight = baseFontSize;
      
      let x = 0;
      let y = 0;
      
      if (watermarkPosition.includes('left')) x = paddingPx + metrics.width / 2;
      if (watermarkPosition.includes('center')) x = canvasWidth / 2;
      if (watermarkPosition.includes('right')) x = canvasWidth - paddingPx - metrics.width / 2;
      
      if (watermarkPosition.includes('top')) y = paddingPx + textHeight / 2;
      if (watermarkPosition === 'center-left' || watermarkPosition === 'center' || watermarkPosition === 'center-right') y = canvasHeight / 2;
      if (watermarkPosition.includes('bottom')) y = canvasHeight - paddingPx - textHeight / 2;
      
      ctx.fillText(watermarkText, x, y);
      ctx.restore();
    } else if (watermarkType === 'image' && watermarkImage) {
      ctx.save();
      const img = new window.Image();
      img.src = watermarkImage;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
      
      ctx.globalAlpha = watermarkOpacity / 100;
      const paddingPx = (canvasWidth * watermarkPadding) / 100;
      
      const targetWidth = (canvasWidth * watermarkSize) / 100;
      const ratio = img.naturalHeight / img.naturalWidth;
      const targetHeight = targetWidth * ratio;
      
      let x = 0;
      let y = 0;
      
      if (watermarkPosition.includes('left')) x = paddingPx;
      if (watermarkPosition.includes('center')) x = (canvasWidth - targetWidth) / 2;
      if (watermarkPosition.includes('right')) x = canvasWidth - targetWidth - paddingPx;
      
      if (watermarkPosition.includes('top')) y = paddingPx;
      if (watermarkPosition === 'center-left' || watermarkPosition === 'center' || watermarkPosition === 'center-right') y = (canvasHeight - targetHeight) / 2;
      if (watermarkPosition.includes('bottom')) y = canvasHeight - targetHeight - paddingPx;
      
      ctx.drawImage(img, x, y, targetWidth, targetHeight);
      ctx.restore();
    }
    }
  };

  const handleExport = async () => {
    if (!imgRef.current || !imageFile) return;
    setIsProcessing(true);

    try {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No 2d context');

      let cropX = 0;
      let cropY = 0;
      let cropWidth = image.naturalWidth;
      let cropHeight = image.naturalHeight;

      if (activeTool === 'crop' && crop && crop.width && crop.height) {
        cropX = (crop.x * image.naturalWidth) / 100;
        cropY = (crop.y * image.naturalHeight) / 100;
        cropWidth = (crop.width * image.naturalWidth) / 100;
        cropHeight = (crop.height * image.naturalHeight) / 100;
      }

      const finalWidth = activeTool === 'resize' && typeof resizeWidth === 'number' ? resizeWidth : cropWidth;
      const finalHeight = activeTool === 'resize' && typeof resizeHeight === 'number' ? resizeHeight : cropHeight;

      const isRotated = (rotation / 90) % 2 !== 0;
      canvas.width = isRotated ? finalHeight : finalWidth;
      canvas.height = isRotated ? finalWidth : finalHeight;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scaleX, scaleY);
      ctx.translate(-finalWidth / 2, -finalHeight / 2);

      ctx.drawImage(
        image,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, finalWidth, finalHeight
      );

      ctx.restore();

      // Apply watermark if active
      await drawWatermark(ctx, canvas.width, canvas.height);

      const mimeType = exportFormat === 'original' ? imageFile.mimeType : exportFormat;
      let ext = mimeType.split('/')[1] || 'png';
      if (ext === 'jpeg') ext = 'jpg';
      const baseName = imageFile.name.replace(/\.[^/.]+$/, "");

      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Canvas is empty');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edited_${baseName}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsProcessing(false);
      }, mimeType, 0.9); // Use 0.9 quality for formats that support it

    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  const tools = [
    { id: 'crop', label: 'Crop', icon: <Crop className="w-5 h-5" /> },
    { id: 'resize', label: 'Resize', icon: <Expand className="w-5 h-5" /> },
    { id: 'rotate', label: 'Rotate', icon: <RotateCw className="w-5 h-5" /> },
    { id: 'flip', label: 'Flip', icon: <FlipHorizontal className="w-5 h-5" /> },
    { id: 'size-checker', label: 'Size', icon: <Info className="w-5 h-5" /> },
    { id: 'watermark', label: 'Watermark', icon: <Stamp className="w-5 h-5" /> },
  ] as const;

  if (!imageFile) {
    return (
      <div className="w-full animate-fade-in-up">
        <UploadBox 
          onFileSelect={handleFileSelect} 
          isDragging={isDragging} 
          setIsDragging={setIsDragging} 
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 animate-fade-in-up h-[800px] max-h-[80vh]">
      
      <EditorSidebar 
        featureName={feature.name}
        isStudioMode={isStudioMode}
        onClear={handleClear}
        toolsTabs={
          <div className="grid grid-cols-3 gap-2 mb-6">
            {tools.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id as EditorTool)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl gap-2 transition-all border-2 ${
                  activeTool === t.id 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-background/50 border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.icon}
                <span className="text-xs font-bold">{t.label}</span>
              </button>
            ))}
          </div>
        }
        toolSettings={
          <>
            {activeTool === 'crop' && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Crop Options</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    { label: 'Free', aspect: undefined },
                    { label: 'Square 1:1', aspect: 1 },
                    { label: '16:9', aspect: 16 / 9 },
                    { label: '4:3', aspect: 4 / 3 },
                    { label: '3:2', aspect: 3 / 2 },
                    { label: '9:16', aspect: 9 / 16 },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        commitHistory();
                        setCropAspect(preset.aspect);
                        if (preset.aspect) {
                          const img = imgRef.current;
                          if (img) {
                            const imgAspect = img.naturalWidth / img.naturalHeight;
                            let targetWidthPct = 80;
                            let targetHeightPct = (targetWidthPct * imgAspect) / preset.aspect;
                            
                            if (targetHeightPct > 80) {
                              targetHeightPct = 80;
                              targetWidthPct = (targetHeightPct * preset.aspect) / imgAspect;
                            }
                            
                            setCrop({ 
                              unit: '%', 
                              width: targetWidthPct, 
                              height: targetHeightPct, 
                              x: (100 - targetWidthPct) / 2, 
                              y: (100 - targetHeightPct) / 2 
                            });
                          }
                        } else {
                          setCrop(undefined); // Reset for free crop
                        }
                      }}
                      className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors ${
                        cropAspect === preset.aspect
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-background border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-foreground">Drag on the image to select a crop area.</p>
              </div>
            )}

            {activeTool === 'rotate' && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Rotate</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { commitHistory(); setRotation(r => r - 90); }} className="px-4 py-3 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors font-semibold flex items-center justify-center gap-2">
                    <RotateCw className="w-4 h-4 -scale-x-100" /> -90°
                  </button>
                  <button onClick={() => { commitHistory(); setRotation(r => r + 90); }} className="px-4 py-3 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors font-semibold flex items-center justify-center gap-2">
                    <RotateCw className="w-4 h-4" /> +90°
                  </button>
                </div>
              </div>
            )}

            {activeTool === 'flip' && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Flip</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { commitHistory(); setScaleX(s => s === 1 ? -1 : 1); }} className={`px-4 py-3 border rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${scaleX === -1 ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border hover:border-primary/50'}`}>
                    <FlipHorizontal className="w-4 h-4" /> Horizontal
                  </button>
                  <button onClick={() => { commitHistory(); setScaleY(s => s === 1 ? -1 : 1); }} className={`px-4 py-3 border rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${scaleY === -1 ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border hover:border-primary/50'}`}>
                    <FlipHorizontal className="w-4 h-4 rotate-90" /> Vertical
                  </button>
                </div>
              </div>
            )}

            {activeTool === 'resize' && (
              <div className="space-y-6">
                <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Resize Options</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '4K UHD', w: 3840, h: 2160 },
                    { label: 'QHD 1440p', w: 2560, h: 1440 },
                    { label: 'FHD 1080p', w: 1920, h: 1080 },
                    { label: 'HD 720p', w: 1280, h: 720 },
                    { label: 'IG Square', w: 1080, h: 1080 },
                    { label: 'IG Portrait', w: 1080, h: 1350 },
                    { label: 'IG Landscape', w: 1080, h: 566 },
                    { label: 'Twitter / FB', w: 1200, h: 675 },
                    { label: 'Web Standard', w: 800, h: 600 },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        commitHistory();
                        setMaintainAspectRatio(false);
                        setResizeWidth(preset.w);
                        setResizeHeight(preset.h);
                      }}
                      className="px-3 py-1.5 text-xs font-bold bg-background border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 bg-background/30 p-4 rounded-xl border border-border/50">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-muted-foreground mb-1 block">Width (px)</label>
                    <input type="number" value={resizeWidth} onChange={(e) => { commitHistory(); handleResizeWidthChange(e.target.value); }} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold focus:outline-none focus:border-primary" />
                  </div>
                  <div className="flex flex-col items-center justify-center pt-5">
                    <button onClick={() => { commitHistory(); toggleMaintainAspect(); }} className={`p-2 rounded-lg transition-colors ${maintainAspectRatio ? 'bg-primary/10 text-primary shadow-sm' : 'bg-background text-muted-foreground hover:bg-border/50'}`}>
                      {maintainAspectRatio ? <LinkIcon className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-muted-foreground mb-1 block">Height (px)</label>
                    <input type="number" value={resizeHeight} onChange={(e) => { commitHistory(); handleResizeHeightChange(e.target.value); }} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold focus:outline-none focus:border-primary" />
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'size-checker' && (
              <SizeCheckerTool imageFile={imageFile} imgRef={imgRef} />
            )}

            {activeTool === 'watermark' && (
              <WatermarkTool />
            )}
          </>
        }
        exportButton={
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-background/50 border border-border p-2 rounded-lg">
              <label className="text-xs font-bold text-muted-foreground px-2">Format</label>
              <select 
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-foreground border-none outline-none focus:ring-0 cursor-pointer"
              >
                <option value="original" className="bg-background text-foreground">Original</option>
                <option value="image/jpeg" className="bg-background text-foreground">JPG</option>
                <option value="image/png" className="bg-background text-foreground">PNG</option>
                <option value="image/webp" className="bg-background text-foreground">WEBP</option>
              </select>
            </div>
            <button 
              onClick={handleExport}
              disabled={isProcessing}
              className="w-full py-4 bg-primary text-primary-foreground font-black rounded-xl shadow-sm hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              Export Image
            </button>
          </div>
        }
      />

      {/* Main Canvas Area */}
      <div className="flex-grow bg-card/40 border border-border rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-sm flex flex-col relative min-h-0">
        
        {/* Toolbar Header */}
        <div className="w-full flex justify-between items-center mb-4 z-10 shrink-0 min-h-[40px]">
          <div className="flex gap-2">
            <button 
              onClick={() => document.getElementById('replace-image-input')?.click()}
              className="px-3 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors text-foreground flex items-center gap-2 text-xs font-bold shadow-sm"
              title="Upload a new image"
            >
              <ImagePlus className="w-4 h-4" /> Replace
            </button>
            <input 
              id="replace-image-input" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const currentTool = activeTool;
                  processFile(file);
                  resetEditor();
                  setActiveTool(currentTool);
                }
                e.target.value = ''; // reset input
              }} 
            />
          </div>
          
          {['crop', 'rotate', 'flip', 'resize'].includes(activeTool) && (
            <div className="flex gap-2">
              <button 
                onClick={undo}
                disabled={past.length === 0}
                className="p-2 bg-background border border-border rounded-lg hover:bg-muted disabled:opacity-50 transition-colors"
                title="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button 
                onClick={redo}
                disabled={future.length === 0}
                className="p-2 bg-background border border-border rounded-lg hover:bg-muted disabled:opacity-50 transition-colors"
                title="Redo"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex-grow flex items-center justify-center relative overflow-hidden min-h-0">
          {activeTool === 'crop' ? (
          <ReactCrop
            crop={crop}
            aspect={cropAspect}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onDragStart={() => commitHistory()}
            className="max-h-full max-w-full flex items-center justify-center shadow-2xl rounded-lg"
          >
            <img
              ref={imgRef}
              alt="Crop preview"
              src={imageFile.previewUrl}
              className="max-h-full max-w-full object-contain"
              style={{ maxHeight: 'calc(80vh - 160px)', transform: `scale(${scaleX}, ${scaleY}) rotate(${rotation}deg)` }}
            />
          </ReactCrop>
        ) : (
          <div className="relative max-h-full max-w-full flex items-center justify-center" style={{ maxHeight: 'calc(80vh - 160px)' }}>
            <div className="relative inline-block h-full w-full flex items-center justify-center">
              <img
                ref={imgRef}
                alt="Preview"
                src={imageFile.previewUrl}
                className={`max-h-full max-w-full shadow-2xl rounded-lg transition-all duration-300 ${activeTool === 'resize' ? '' : 'object-contain'}`}
                style={{ 
                  transform: `scale(${scaleX}, ${scaleY}) rotate(${rotation}deg)`,
                  ...(activeTool === 'resize' && resizeWidth && resizeHeight ? {
                    aspectRatio: `${resizeWidth} / ${resizeHeight}`,
                    objectFit: 'fill',
                  } : {})
                }}
              />
              {/* Live Preview Watermark Overlay */}
              {activeTool === 'watermark' && (
                <div 
                  className="absolute inset-0 pointer-events-none flex"
                  style={{
                    alignItems: watermarkRepeated ? 'center' : watermarkPosition.includes('top') ? 'flex-start' : watermarkPosition.includes('bottom') ? 'flex-end' : 'center',
                    justifyContent: watermarkRepeated ? 'center' : watermarkPosition.includes('left') ? 'flex-start' : watermarkPosition.includes('right') ? 'flex-end' : 'center',
                    padding: watermarkRepeated ? 0 : `${watermarkPadding}%`,
                  }}
                >
                  {watermarkRepeated && patternUrl ? (
                    <div 
                      className="absolute inset-[-50%] bg-repeat pointer-events-none" 
                      style={{ 
                        backgroundImage: `url(${patternUrl})`,
                        backgroundSize: `${patternSize * 0.75}%`, // Scaled for the rotated container
                        transform: 'rotate(-30deg)',
                      }}
                    />
                  ) : watermarkType === 'text' && watermarkText && !watermarkRepeated ? (
                    <span 
                      className="font-bold leading-none whitespace-nowrap"
                      style={{
                        color: watermarkColor,
                        fontSize: `${watermarkSize}cqw`, 
                        opacity: watermarkOpacity / 100,
                        textShadow: '0px 0px 8px rgba(0,0,0,0.5)',
                      }}
                    >
                      {watermarkText}
                    </span>
                  ) : watermarkType === 'image' && watermarkImage ? (
                    <img 
                      src={watermarkImage}
                      alt="Watermark Overlay"
                      style={{
                        width: `${watermarkSize}%`,
                        height: 'auto',
                        opacity: watermarkOpacity / 100,
                      }}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>

    </div>
  );
}
