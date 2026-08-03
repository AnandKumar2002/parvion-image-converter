"use client";

import { useState, useRef, useEffect } from "react";
import { Feature } from "@/src/types/feature";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { UploadBox } from "../UniversalConverter/UploadBox";
import { EditorSidebar } from "./EditorSidebar";
import { useEditorStore, EditorTool } from "./store";
import { SizeCheckerTool } from "./tools/SizeCheckerTool";
import { WatermarkTool } from "./tools/WatermarkTool";
import { TextTool } from "./tools/TextTool";
import { CanvasService } from '@/src/services/canvasService';
import { VideoConverterService } from '@/src/services/videoConverterService';
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
  ImagePlus,
  X,
  ChevronDown,
  Upload,
  Type
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
    watermarkSize, watermarkPosition, setWatermarkPosition, watermarkPadding, setWatermarkPadding, watermarkColor,
    watermarkImage, watermarkRepeated, watermarkX, setWatermarkX, watermarkY, setWatermarkY,
    textItems, selectedTextId, updateTextItem, setSelectedTextId,
    exportFormat, setExportFormat,
    resetEditor,
    past, future, commitHistory, undo, redo
  } = useEditorStore();

  const [patternUrl, setPatternUrl] = useState<string | null>(null);
  const [patternSize, setPatternSize] = useState<number>(100);
  const [exportQuality, setExportQuality] = useState(90);

  type MeasurementUnit = 'px' | '%' | 'in' | 'cm';
  const [unit, setUnit] = useState<MeasurementUnit>('px');
  const [dpi, setDpi] = useState<number>(300);

  const pxToUnit = (px: number, u: MeasurementUnit, d: number, naturalSize?: number): number => {
    if (u === 'px') return px;
    if (u === '%') return naturalSize ? (px / naturalSize) * 100 : 0;
    if (u === 'in') return px / d;
    if (u === 'cm') return px / (d / 2.54);
    return px;
  };

  const unitToPx = (val: number, u: MeasurementUnit, d: number, naturalSize?: number): number => {
    if (u === 'px') return val;
    if (u === '%') return naturalSize ? (val / 100) * naturalSize : 0;
    if (u === 'in') return val * d;
    if (u === 'cm') return val * (d / 2.54);
    return val;
  };

  const formatUnitVal = (val: number) => Math.round(val * 100) / 100;

  const [customCropW, setCustomCropW] = useState<number | ''>('');
  const [customCropH, setCustomCropH] = useState<number | ''>('');
  const [customCropLinked, setCustomCropLinked] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null);

  const updateImageSize = () => {
    if (imgRef.current) {
      setImgSize({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
      });
    }
  };

  useEffect(() => {
    updateImageSize();
    window.addEventListener('resize', updateImageSize);
    return () => window.removeEventListener('resize', updateImageSize);
  }, [imageFile]);

  const getActualImageSize = () => {
    if (!imgRef.current || !imgSize) return null;
    const img = imgRef.current;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    if (!naturalWidth || !naturalHeight) return null;

    const visibleWidth = Math.min(imgSize.width, imgSize.height * (naturalWidth / naturalHeight));
    const visibleHeight = Math.min(imgSize.height, imgSize.width * (naturalHeight / naturalWidth));

    return {
      width: visibleWidth,
      height: visibleHeight,
    };
  };

  useEffect(() => {
    const timer = setTimeout(updateImageSize, 120);
    return () => clearTimeout(timer);
  }, [activeTool, rotation, scaleX, scaleY, resizeWidth, resizeHeight]);


  // Set default tool based on feature
  useEffect(() => {
    let defaultTool: EditorTool = 'crop';
    if (feature.slug === 'resize-images') defaultTool = 'resize';
    if (feature.slug === 'rotate-images') defaultTool = 'rotate';
    if (feature.slug === 'flip-images') defaultTool = 'flip';
    if (feature.slug === 'size-checker') defaultTool = 'size-checker';
    if (feature.slug === 'watermark') defaultTool = 'watermark';
    if (feature.slug === 'add-text') defaultTool = 'text';
    
    if (!isStudioMode && activeTool !== defaultTool) {
      setActiveTool(defaultTool);
    }
  }, [feature.slug, isStudioMode, activeTool, setActiveTool]);

  // Initialize dimensions on load
  useEffect(() => {
    if (imgRef.current && imageFile) {
      if (resizeWidth === '' && resizeHeight === '') {
        setResizeWidth(imgRef.current.naturalWidth);
        setResizeHeight(imgRef.current.naturalHeight);
      }
    }
  }, [imageFile, resizeWidth, resizeHeight, setResizeWidth, setResizeHeight]);

  // Text dragging state & handlers
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const textStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleTextDragStart = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.stopPropagation();
    setSelectedTextId(id);
    commitHistory();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStartPos.current = { x: clientX, y: clientY };
    const item = textItems.find((t) => t.id === id);
    if (item) {
      textStartPos.current = { x: item.x, y: item.y };
      setDraggingId(id);
    }
  };

  useEffect(() => {
    if (!draggingId) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const deltaX = clientX - dragStartPos.current.x;
      const deltaY = clientY - dragStartPos.current.y;

      const actualSize = getActualImageSize() || imgSize;
      if (actualSize) {
        const deltaXPct = (deltaX / actualSize.width) * 100;
        const deltaYPct = (deltaY / actualSize.height) * 100;

        const newX = Math.min(Math.max(0, textStartPos.current.x + deltaXPct), 100);
        const newY = Math.min(Math.max(0, textStartPos.current.y + deltaYPct), 100);

        updateTextItem(draggingId, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [draggingId, imgSize, textItems, updateTextItem]);

  // Watermark dragging state & handlers
  const [draggingWatermark, setDraggingWatermark] = useState<boolean>(false);
  const watermarkDragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const watermarkStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleWatermarkDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    commitHistory();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    watermarkDragStartPos.current = { x: clientX, y: clientY };
    
    // If it's a preset position, convert it to custom center coordinates so it doesn't jump
    if (watermarkPosition as string !== 'custom') {
      const halfW = watermarkSize / 2;
      const halfH = watermarkType === 'text' ? watermarkSize / 4 : watermarkSize / 2;
      
      let x = watermarkX;
      let y = watermarkY;
      
      if (watermarkPosition.includes('left')) x = watermarkX + halfW;
      if (watermarkPosition.includes('right')) x = watermarkX - halfW;
      
      if (watermarkPosition.includes('top')) y = watermarkY + halfH;
      if (watermarkPosition.includes('bottom')) y = watermarkY - halfH;
      
      setWatermarkX(x);
      setWatermarkY(y);
      setWatermarkPosition('custom' as any);
      watermarkStartPos.current = { x, y };
    } else {
      watermarkStartPos.current = { x: watermarkX, y: watermarkY };
    }
    
    setDraggingWatermark(true);
  };

  useEffect(() => {
    if (!draggingWatermark) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const deltaX = clientX - watermarkDragStartPos.current.x;
      const deltaY = clientY - watermarkDragStartPos.current.y;

      const actualSize = getActualImageSize() || imgSize;
      if (actualSize) {
        const deltaXPct = (deltaX / actualSize.width) * 100;
        const deltaYPct = (deltaY / actualSize.height) * 100;

        const newX = Math.min(Math.max(0, watermarkStartPos.current.x + deltaXPct), 100);
        const newY = Math.min(Math.max(0, watermarkStartPos.current.y + deltaYPct), 100);

        setWatermarkX(newX);
        setWatermarkY(newY);
      }
    };

    const handleMouseUp = () => {
      setDraggingWatermark(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [draggingWatermark, imgSize, watermarkX, watermarkY, setWatermarkX, setWatermarkY]);

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
  }, [activeTool, watermarkRepeated, watermarkType, watermarkText, watermarkImage, watermarkSize, watermarkPadding, watermarkOpacity, watermarkColor, watermarkX, watermarkY]);

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
      // Free dragging position drawing
      const x = (watermarkX * canvasWidth) / 100;
      const y = (watermarkY * canvasHeight) / 100;

      if (watermarkType === 'text' && watermarkText) {
        ctx.save();
        const baseFontSize = (canvasWidth * watermarkSize) / 100;
        ctx.font = `bold ${baseFontSize}px Arial`;
        ctx.globalAlpha = watermarkOpacity / 100;
        ctx.fillStyle = watermarkColor;
        
        let textAlign: CanvasTextAlign = 'center';
        let textBaseline: CanvasTextBaseline = 'middle';
        
        if (watermarkPosition as string !== 'custom') {
          if (watermarkPosition.includes('left')) textAlign = 'left';
          if (watermarkPosition.includes('right')) textAlign = 'right';
          
          if (watermarkPosition.includes('top')) textBaseline = 'top';
          if (watermarkPosition.includes('bottom')) textBaseline = 'bottom';
        }
        
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = baseFontSize * 0.1;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
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
        
        const targetWidth = (canvasWidth * watermarkSize) / 100;
        const ratio = img.naturalHeight / img.naturalWidth;
        const targetHeight = targetWidth * ratio;
        
        let offsetX = -targetWidth / 2;
        let offsetY = -targetHeight / 2;
        
        if (watermarkPosition as string !== 'custom') {
          if (watermarkPosition.includes('left')) offsetX = 0;
          if (watermarkPosition.includes('center')) offsetX = -targetWidth / 2;
          if (watermarkPosition.includes('right')) offsetX = -targetWidth;
          
          if (watermarkPosition.includes('top')) offsetY = 0;
          if (watermarkPosition === 'center-left' || watermarkPosition === 'center' || watermarkPosition === 'center-right') offsetY = -targetHeight / 2;
          if (watermarkPosition.includes('bottom')) offsetY = -targetHeight;
        }
        
        ctx.drawImage(img, x + offsetX, y + offsetY, targetWidth, targetHeight);
        ctx.restore();
      }
    }
  };

  const drawTextItems = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    textItems.forEach((item) => {
      ctx.save();
      ctx.globalAlpha = item.opacity / 100;
      ctx.fillStyle = item.color;
      
      const xPos = (item.x * canvasWidth) / 100;
      const yPos = (item.y * canvasHeight) / 100;
      
      const canvasFontSize = item.fontSize;
      ctx.font = `${canvasFontSize}px ${item.fontFamily}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = item.alignment;
      
      if (item.shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }
      
      const maxWidth = canvasWidth * 0.8;
      const lineHeight = canvasFontSize * 1.2;
      
      // Wrap text algorithm
      const paragraphs = item.text.split('\n');
      const lines: string[] = [];
      
      paragraphs.forEach((para) => {
        const words = para.split(' ');
        let currentLine = '';
        
        words.forEach((word) => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });
        if (currentLine) {
          lines.push(currentLine);
        }
      });
      
      const totalHeight = lines.length * lineHeight;
      
      // Draw background box highlight if enabled
      if (item.backgroundColor && item.backgroundOpacity > 0) {
        ctx.save();
        ctx.globalAlpha = (item.opacity / 100) * (item.backgroundOpacity / 100);
        ctx.fillStyle = item.backgroundColor;
        
        let maxLineWidth = 0;
        lines.forEach((line) => {
          const w = ctx.measureText(line).width;
          if (w > maxLineWidth) maxLineWidth = w;
        });
        
        const paddingPx = item.backgroundPadding;
        const boxWidth = maxLineWidth + paddingPx * 2;
        const boxHeight = totalHeight + paddingPx * 2;
        
        let boxX = xPos - paddingPx;
        if (item.alignment === 'center') boxX = xPos - maxLineWidth / 2 - paddingPx;
        if (item.alignment === 'right') boxX = xPos - maxLineWidth - paddingPx;
        
        const boxY = yPos - totalHeight / 2 - paddingPx;
        const radius = 4;
        
        ctx.beginPath();
        ctx.moveTo(boxX + radius, boxY);
        ctx.lineTo(boxX + boxWidth - radius, boxY);
        ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + radius);
        ctx.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
        ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - radius, boxY + boxHeight);
        ctx.lineTo(boxX + radius, boxY + boxHeight);
        ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - radius);
        ctx.lineTo(boxX, boxY + radius);
        ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      
      const startY = yPos - totalHeight / 2 + lineHeight / 2;
      
      lines.forEach((line, index) => {
        const lineY = startY + (index * lineHeight);
        
        // Draw stroke if enabled (stroke first to preserve fill weight)
        if (item.strokeWidth > 0) {
          ctx.save();
          ctx.strokeStyle = item.strokeColor;
          ctx.lineWidth = item.strokeWidth;
          ctx.lineJoin = 'round';
          ctx.strokeText(line, xPos, lineY);
          ctx.restore();
        }
        
        ctx.fillText(line, xPos, lineY);
      });
      
      ctx.restore();
    });
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

      // Apply text layers
      drawTextItems(ctx, canvas.width, canvas.height);

      const mimeType = exportFormat === 'original' ? imageFile.mimeType : exportFormat;
      let ext = mimeType.split('/')[1] || 'png';
      if (ext === 'jpeg') ext = 'jpg';
      if (ext === 'svg+xml') ext = 'svg';
      const baseName = imageFile.name.replace(/\.[^/.]+$/, "");

      let blob: Blob;
      if (mimeType === 'image/gif') {
        const pngBlob = await CanvasService.exportCanvasToBlob(canvas, 'image/png', 1.0);
        blob = await VideoConverterService.convertImageToGif(pngBlob);
      } else {
        blob = await CanvasService.exportCanvasToBlob(canvas, mimeType, exportQuality / 100);
      }

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
    { id: 'text', label: 'Text', icon: <Type className="w-5 h-5" /> },
  ] as const;

  if (!imageFile) {
    return (
      <div className="w-full animate-fade-in-up">
        <UploadBox 
          onFileSelect={handleFileSelect} 
          isDragging={isDragging} 
          setIsDragging={setIsDragging} 
          title={activeTool === 'size-checker' ? 'Upload to Check Size' : `Upload to ${activeTool.charAt(0).toUpperCase() + activeTool.slice(1)}`}
          subtitle="Drop an image to start editing"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch animate-fade-in-up">
      
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
                    { label: 'Passport (2x2 in)', aspect: 1 },
                    { label: 'Passport (35x45 mm)', aspect: 35 / 45 },
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
                <div className="flex flex-col gap-2 mt-2 mb-2">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Custom Size</h4>
                      <div className="relative">
                        <select 
                          value={unit} 
                          onChange={(e) => setUnit(e.target.value as MeasurementUnit)}
                          className="appearance-none bg-background/50 border border-border rounded-lg px-3 py-1.5 pr-7 text-[11px] font-bold text-foreground uppercase tracking-wider focus:outline-none focus:border-primary cursor-pointer hover:bg-background transition-colors"
                        >
                          <option value="px">PX</option>
                          <option value="%">%</option>
                          <option value="in">IN</option>
                          <option value="cm">CM</option>
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                      </div>
                    </div>
                    {(unit === 'in' || unit === 'cm') && (
                      <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-2 px-3 mb-1">
                        <span className="text-xs font-bold text-primary">Print Resolution (DPI)</span>
                        <input type="number" value={dpi} onChange={(e) => setDpi(Number(e.target.value) || 300)} className="w-16 bg-background border border-border rounded-md px-2 py-1 text-xs text-center font-bold focus:outline-none focus:border-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 bg-background/30 p-4 rounded-xl border border-border/50">
                    <div className="flex-1">
                      <label className="text-xs font-bold text-muted-foreground mb-1 block">Width</label>
                      <input 
                        type="number" step="any"
                        value={customCropW === '' ? '' : formatUnitVal(pxToUnit(customCropW, unit, dpi, imgRef.current?.naturalWidth))}
                        onChange={(e) => {
                          const numVal = e.target.value ? Number(e.target.value) : '';
                          const w = numVal === '' ? '' : unitToPx(numVal, unit, dpi, imgRef.current?.naturalWidth);
                          setCustomCropW(w);
                          
                          let wNum = Number(w);
                          let hNum = Number(customCropH);
                          
                          if (customCropLinked && wNum > 0 && cropAspect) {
                            hNum = Math.round(wNum / cropAspect);
                            setCustomCropH(hNum);
                          }
                          
                          if (wNum > 0 && hNum > 0 && imgRef.current) {
                            commitHistory();
                            setCropAspect(wNum / hNum);
                            const imgAspect = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
                            let targetWidthPct = (wNum / imgRef.current.naturalWidth) * 100;
                            let targetHeightPct = (hNum / imgRef.current.naturalHeight) * 100;
                            
                            if (targetWidthPct > 100) { targetWidthPct = 100; targetHeightPct = (100 * imgAspect) / (wNum/hNum); }
                            if (targetHeightPct > 100) { targetHeightPct = 100; targetWidthPct = (100 * (wNum/hNum)) / imgAspect; }
                            
                            setCrop({
                              unit: '%',
                              width: targetWidthPct,
                              height: targetHeightPct,
                              x: (100 - targetWidthPct) / 2,
                              y: (100 - targetHeightPct) / 2
                            });
                          }
                        }}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center pt-5">
                      <button onClick={() => setCustomCropLinked(prev => !prev)} className={`p-2 rounded-lg transition-colors ${customCropLinked ? 'bg-primary/10 text-primary shadow-sm' : 'bg-background text-muted-foreground hover:bg-border/50'}`}>
                        {customCropLinked ? <LinkIcon className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-bold text-muted-foreground mb-1 block">Height</label>
                      <input 
                        type="number" step="any"
                        value={customCropH === '' ? '' : formatUnitVal(pxToUnit(customCropH, unit, dpi, imgRef.current?.naturalHeight))}
                        onChange={(e) => {
                          const numVal = e.target.value ? Number(e.target.value) : '';
                          const h = numVal === '' ? '' : unitToPx(numVal, unit, dpi, imgRef.current?.naturalHeight);
                          setCustomCropH(h);
                          
                          let wNum = Number(customCropW);
                          let hNum = Number(h);
                          
                          if (customCropLinked && hNum > 0 && cropAspect) {
                            wNum = Math.round(hNum * cropAspect);
                            setCustomCropW(wNum);
                          }
                          
                          if (wNum > 0 && hNum > 0 && imgRef.current) {
                            commitHistory();
                            setCropAspect(wNum / hNum);
                            const imgAspect = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
                            let targetWidthPct = (wNum / imgRef.current.naturalWidth) * 100;
                            let targetHeightPct = (hNum / imgRef.current.naturalHeight) * 100;
                            
                            if (targetWidthPct > 100) { targetWidthPct = 100; targetHeightPct = (100 * imgAspect) / (wNum/hNum); }
                            if (targetHeightPct > 100) { targetHeightPct = 100; targetWidthPct = (100 * (wNum/hNum)) / imgAspect; }
                            
                            setCrop({
                              unit: '%',
                              width: targetWidthPct,
                              height: targetHeightPct,
                              x: (100 - targetWidthPct) / 2,
                              y: (100 - targetHeightPct) / 2
                            });
                          }
                        }}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
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
                <div className="flex flex-col gap-2 mt-2 mb-2">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Custom Size</h4>
                      <div className="relative">
                        <select 
                          value={unit} 
                          onChange={(e) => setUnit(e.target.value as MeasurementUnit)}
                          className="appearance-none bg-background/50 border border-border rounded-lg px-3 py-1.5 pr-7 text-[11px] font-bold text-foreground uppercase tracking-wider focus:outline-none focus:border-primary cursor-pointer hover:bg-background transition-colors"
                        >
                          <option value="px">PX</option>
                          <option value="%">%</option>
                          <option value="in">IN</option>
                          <option value="cm">CM</option>
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                      </div>
                    </div>
                    {(unit === 'in' || unit === 'cm') && (
                      <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-2 px-3 mb-1">
                        <span className="text-xs font-bold text-primary">Print Resolution (DPI)</span>
                        <input type="number" value={dpi} onChange={(e) => setDpi(Number(e.target.value) || 300)} className="w-16 bg-background border border-border rounded-md px-2 py-1 text-xs text-center font-bold focus:outline-none focus:border-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 bg-background/30 p-4 rounded-xl border border-border/50">
                    <div className="flex-1">
                    <label className="text-xs font-bold text-muted-foreground mb-1 block">Width</label>
                    <input 
                      type="number" step="any"
                      value={resizeWidth === '' ? '' : formatUnitVal(pxToUnit(resizeWidth, unit, dpi, imgRef.current?.naturalWidth))} 
                      onChange={(e) => { 
                        commitHistory();
                        const numVal = e.target.value ? Number(e.target.value) : '';
                        const wStr = numVal === '' ? '' : unitToPx(numVal, unit, dpi, imgRef.current?.naturalWidth).toString();
                        handleResizeWidthChange(wStr); 
                      }} 
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold focus:outline-none focus:border-primary" 
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center pt-5">
                    <button onClick={() => { commitHistory(); toggleMaintainAspect(); }} className={`p-2 rounded-lg transition-colors ${maintainAspectRatio ? 'bg-primary/10 text-primary shadow-sm' : 'bg-background text-muted-foreground hover:bg-border/50'}`}>
                      {maintainAspectRatio ? <LinkIcon className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-muted-foreground mb-1 block">Height</label>
                    <input 
                      type="number" step="any"
                      value={resizeHeight === '' ? '' : formatUnitVal(pxToUnit(resizeHeight, unit, dpi, imgRef.current?.naturalHeight))} 
                      onChange={(e) => { 
                        commitHistory(); 
                        const numVal = e.target.value ? Number(e.target.value) : '';
                        const hStr = numVal === '' ? '' : unitToPx(numVal, unit, dpi, imgRef.current?.naturalHeight).toString();
                        handleResizeHeightChange(hStr); 
                      }} 
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold focus:outline-none focus:border-primary" 
                    />
                  </div>
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

            {activeTool === 'text' && (
              <TextTool />
            )}
          </>
        }
        exportButton={
          <div className="flex flex-col gap-4 w-full">
            {/* Export Quality Configuration */}
            {(exportFormat === "image/jpeg" || exportFormat === "image/webp" || (exportFormat === "original" && imageFile && (imageFile.mimeType === "image/jpeg" || imageFile.mimeType === "image/webp"))) && (
              <div className="space-y-1 animate-fade-in-up w-full text-left">
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                  <span>Export Quality</span>
                  <span>{exportQuality}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={exportQuality}
                  onChange={(e) => setExportQuality(parseInt(e.target.value))}
                  className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                />
              </div>
            )}
            
            <div className="flex items-stretch gap-2 w-full">
              <div className="relative">
                <select 
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="appearance-none pl-4 pr-9 py-3.5 border border-border bg-background text-foreground hover:border-primary font-bold rounded-xl outline-none cursor-pointer text-sm transition-all uppercase"
                >
                  <option value="original">Original</option>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WEBP</option>
                  <option value="image/gif">GIF</option>
                  <option value="image/svg+xml">SVG</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </div>
              </div>
              <button 
                onClick={handleExport}
                disabled={isProcessing}
                className="flex-grow py-3 bg-primary text-primary-foreground font-black rounded-xl shadow-sm hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export Image
              </button>
            </div>
          </div>
        }
      />

      {/* RIGHT COLUMN: Live Canvas Preview */}
      <div className="lg:col-span-7 flex flex-col lg:h-[600px] w-full">
        {/* Right card: header toolbar + preview as single rounded container */}
        <div className="flex-1 flex flex-col bg-card border border-border/80 rounded-3xl overflow-hidden shadow-md">
          {/* Header toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-card/40 backdrop-blur-xl flex-shrink-0">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => document.getElementById('replace-image-input')?.click()}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Upload a new image"
              >
                <Upload className="w-3.5 h-3.5" /> Replace
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
              <div className="flex items-center gap-1">
                <button 
                  onClick={undo}
                  disabled={past.length === 0}
                  className="p-2 bg-background border border-border/80 text-foreground rounded-xl hover:bg-muted/50 disabled:opacity-40 cursor-pointer transition-all duration-200"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={redo}
                  disabled={future.length === 0}
                  className="p-2 bg-background border border-border/80 text-foreground rounded-xl hover:bg-muted/50 disabled:opacity-40 cursor-pointer transition-all duration-200"
                  title="Redo"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Preview Box */}
          <div 
            onClick={() => setSelectedTextId(null)}
            className="flex-1 flex items-center justify-center p-6 relative overflow-hidden select-none"
          >
            <div className="absolute inset-0 bg-checkerboard opacity-10 pointer-events-none z-0" />
            <div className="relative w-full h-full flex items-center justify-center z-10">
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
                    style={{ maxHeight: '100%', transform: `scale(${scaleX}, ${scaleY}) rotate(${rotation}deg)` }}
                  />
                </ReactCrop>
              ) : (
                <div className="relative h-full w-full max-h-full max-w-full flex items-center justify-center">
                  <div className="relative h-full w-full flex items-center justify-center">
                    <img
                      ref={imgRef}
                      alt="Preview"
                      src={imageFile.previewUrl}
                      onLoad={updateImageSize}
                      className={`max-h-full max-w-full shadow-2xl rounded-lg ${activeTool === 'resize' ? '' : 'object-contain'}`}
                      style={{ 
                        transform: `scale(${scaleX}, ${scaleY}) rotate(${rotation}deg)`,
                        ...(activeTool === 'resize' && resizeWidth && resizeHeight ? {
                          aspectRatio: `${resizeWidth} / ${resizeHeight}`,
                          objectFit: 'fill',
                        } : {})
                      }}
                    />
                    {/* Live Preview Text Overlay */}
                    {activeTool === 'text' && imgSize && (() => {
                      const actualSize = getActualImageSize() || imgSize;
                      const naturalWidth = imgRef.current?.naturalWidth || 800;
                      const previewScale = actualSize.width / naturalWidth;
                      
                      return (
                        <div 
                          className="absolute select-none pointer-events-none"
                          style={{
                            width: `${actualSize.width}px`,
                            height: `${actualSize.height}px`,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          {textItems.map((item) => {
                            const isSelected = item.id === selectedTextId;
                            const isEditing = item.id === editingId;
                            const xPx = (item.x * actualSize.width) / 100;
                            const yPx = (item.y * actualSize.height) / 100;
                            
                            const previewFontSize = item.fontSize * previewScale;
                            const previewStrokeWidth = (item.strokeWidth || 0) * previewScale;
                            const previewPadding = (item.backgroundPadding || 8) * previewScale;
                            
                            // Convert hex background color to hex+alpha for transparency
                            const bgHex = item.backgroundColor || "#000000";
                            const bgAlpha = Math.round(((item.backgroundOpacity || 0) / 100) * 255).toString(16).padStart(2, '0');
                            const backgroundStyle = item.backgroundOpacity > 0 ? `${bgHex}${bgAlpha}` : 'transparent';
                            
                            return (
                              <div
                                key={item.id}
                                onMouseDown={(e) => {
                                  if (!isEditing) handleTextDragStart(e, item.id);
                                }}
                                onTouchStart={(e) => {
                                  if (!isEditing) handleTextDragStart(e, item.id);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTextId(item.id);
                                }}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  setEditingId(item.id);
                                }}
                                className={`absolute cursor-move select-none p-1 border rounded pointer-events-auto ${
                                  isSelected 
                                    ? 'border-primary ring-2 ring-primary/20' 
                                    : 'border-transparent hover:border-border/60 hover:bg-card/25'
                                }`}
                                style={{
                                  left: 0,
                                  top: 0,
                                  transform: `translate(calc(${xPx}px - 50%), calc(${yPx}px - 50%))`,
                                  fontSize: `${previewFontSize}px`,
                                  fontFamily: item.fontFamily,
                                  color: item.color,
                                  opacity: item.opacity / 100,
                                  textShadow: item.shadow ? `${2 * previewScale}px ${2 * previewScale}px ${4 * previewScale}px rgba(0, 0, 0, 0.4)` : 'none',
                                  textAlign: item.alignment,
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  maxWidth: '80%',
                                  backgroundColor: backgroundStyle,
                                  padding: `${previewPadding}px`,
                                  borderRadius: `${4 * previewScale}px`,
                                  WebkitTextStroke: previewStrokeWidth > 0 ? `${previewStrokeWidth}px ${item.strokeColor}` : 'initial',
                                }}
                              >
                                {isEditing ? (
                                  <textarea
                                    value={item.text}
                                    autoFocus
                                    onChange={(e) => updateTextItem(item.id, { text: e.target.value })}
                                    onBlur={() => {
                                      setEditingId(null);
                                      commitHistory();
                                    }}
                                    className="bg-transparent border-0 outline-none p-0 resize-none font-inherit text-inherit leading-inherit w-full h-full select-text pointer-events-auto min-w-[120px]"
                                    style={{
                                      color: item.color,
                                      fontFamily: item.fontFamily,
                                      textAlign: item.alignment,
                                      fontSize: 'inherit',
                                      WebkitTextStroke: 'initial', // Reset stroke on editing input for clarity
                                      textShadow: 'none',
                                    }}
                                  />
                                ) : (
                                  item.text
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )})()}
                    {/* Live Preview Watermark Overlay */}
                    {activeTool === 'watermark' && imgSize && (() => {
                      const actualSize = getActualImageSize() || imgSize;
                      
                      return (
                        <div 
                          className="absolute select-none pointer-events-none"
                          style={{
                            width: `${actualSize.width}px`,
                            height: `${actualSize.height}px`,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          {watermarkRepeated && patternUrl ? (
                            <div 
                              className="absolute inset-[-50%] bg-repeat pointer-events-none" 
                              style={{ 
                                backgroundImage: `url(${patternUrl})`,
                                backgroundSize: `${patternSize * 0.75}%`, // Scaled for the rotated container
                                transform: 'rotate(-30deg)',
                                opacity: watermarkOpacity / 100,
                              }}
                            />
                          ) : (() => {
                            let translateX = '-50%';
                            let translateY = '-50%';
                            
                            if (watermarkPosition as string !== 'custom') {
                              if (watermarkPosition.includes('left')) translateX = '0%';
                              if (watermarkPosition.includes('right')) translateX = '-100%';
                              
                              if (watermarkPosition.includes('top')) translateY = '0%';
                              if (watermarkPosition.includes('bottom')) translateY = '-100%';
                            }
                            
                            return (
                              <div
                                onMouseDown={handleWatermarkDragStart}
                                onTouchStart={handleWatermarkDragStart}
                                className="absolute cursor-move select-none p-0 border border-dashed border-transparent hover:border-primary/45 active:border-primary/60 rounded hover:bg-primary/5 active:bg-primary/10 pointer-events-auto flex items-center justify-center"
                                style={{
                                  left: 0,
                                  top: 0,
                                  transform: `translate(calc(${(watermarkX * actualSize.width) / 100}px + ${translateX}), calc(${(watermarkY * actualSize.height) / 100}px + ${translateY}))`,
                                  opacity: watermarkOpacity / 100,
                                }}
                              >
                                {watermarkType === 'text' && watermarkText ? (
                                  <span 
                                    className="font-bold whitespace-nowrap"
                                    style={{
                                      color: watermarkColor,
                                      fontSize: `${(watermarkSize * actualSize.width) / 100}px`,
                                      textShadow: '0px 0px 8px rgba(0,0,0,0.5)',
                                    }}
                                  >
                                    {watermarkText}
                                  </span>
                                ) : watermarkType === 'image' && watermarkImage ? (
                                  <img 
                                    src={watermarkImage}
                                    alt="Watermark Overlay"
                                    className="object-contain pointer-events-none"
                                    style={{
                                      width: `${(watermarkSize * actualSize.width) / 100}px`,
                                      maxHeight: `${actualSize.height * 0.5}px`,
                                    }}
                                  />
                                ) : null}
                              </div>
                            );
                          })()}
                        </div>
                      )})()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
