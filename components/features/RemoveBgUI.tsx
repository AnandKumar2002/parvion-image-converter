"use client";

import { useState, useRef, useEffect } from "react";
import { Feature } from "@/src/types/feature";
import { UploadBox } from "./UniversalConverter/UploadBox";
import { ImagePreview } from "./UniversalConverter/ImagePreview";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { Download, Wand2, Loader2, AlertCircle, RotateCcw, Palette, Sliders, Sparkles, Eye, Undo2, Redo2, ImagePlus, Upload, Trash2 } from "lucide-react";

interface EditorOptions {
  bgType: "transparent" | "color" | "blur" | "custom" | "preset" | "gradient";
  solidColor: string;
  blurAmount: number;
  customBgUrl: string | null;
  activePreset: string;
  customGradColor1: string;
  customGradColor2: string;
  customGradAngle: number;
  scale: number;
  posX: number;
  posY: number;
  flipH: boolean;
  flipV: boolean;
  rotateDeg: number;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffset: number;
  strokeEnabled: boolean;
  strokeColor: string;
  strokeWidth: number;
  effectGrayscale: number;
  effectBrightness: number;
  effectContrast: number;
  effectSepia: number;
  subjectFilterPreset: string;
}

export function RemoveBgUI({ feature }: { feature: Feature }) {
  const { imageFile, error: uploadError, isDragging, setIsDragging, processFile, clearFile } = useFileUpload();

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStep, setProgressStep] = useState<string>("");
  
  // Background processing states
  const [transparentBlob, setTransparentBlob] = useState<Blob | null>(null);
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"background" | "subject" | "effects">("background");

  // Options State Group
  const [options, setOptions] = useState<EditorOptions>({
    bgType: "transparent",
    solidColor: "#ffffff",
    blurAmount: 10,
    customBgUrl: null,
    activePreset: "sunset",
    customGradColor1: "#8b5cf6",
    customGradColor2: "#ec4899",
    customGradAngle: 135,
    scale: 1.0,
    posX: 0,
    posY: 0,
    flipH: false,
    flipV: false,
    rotateDeg: 0,
    shadowEnabled: false,
    shadowColor: "#000000",
    shadowBlur: 15,
    shadowOffset: 8,
    strokeEnabled: false,
    strokeColor: "#ffffff",
    strokeWidth: 8,
    effectGrayscale: 0,
    effectBrightness: 100,
    effectContrast: 100,
    effectSepia: 0,
    subjectFilterPreset: "none",
  });

  const {
    bgType, solidColor, blurAmount, customBgUrl, activePreset,
    customGradColor1, customGradColor2, customGradAngle,
    scale, posX, posY, flipH, flipV, rotateDeg, shadowEnabled, shadowColor,
    shadowBlur, shadowOffset,
    strokeEnabled, strokeColor, strokeWidth,
    effectGrayscale, effectBrightness, effectContrast, effectSepia,
    subjectFilterPreset
  } = options;

  const [showBgDropdown, setShowBgDropdown] = useState<boolean>(false);
  const [expandedEffectSec, setExpandedEffectSec] = useState<"filters" | "outline" | "shadow" | "all" | null>("filters");

  // Undo/Redo History
  const [history, setHistory] = useState<EditorOptions[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isUndoRedoRef = useRef<boolean>(false);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOriginalFloat, setShowOriginalFloat] = useState<boolean>(false);

  const errorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  
  // Cached Image elements for 60 FPS drawing
  const imgOriginalRef = useRef<HTMLImageElement | null>(null);
  const imgForegroundRef = useRef<HTMLImageElement | null>(null);
  const imgCustomBgRef = useRef<HTMLImageElement | null>(null);
  const [drawTrigger, setDrawTrigger] = useState<number>(0);

  const bgTypeLabels = {
    transparent: "Transparent",
    blur: "Portrait Blur",
    color: "Solid Color",
    preset: "Presets Gallery",
    gradient: "Custom Gradient",
    custom: "Custom Background"
  };

  // Scroll to error
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  // Load original image into memory
  useEffect(() => {
    if (!imageFile) {
      imgOriginalRef.current = null;
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(imageFile.file);
    img.onload = () => {
      imgOriginalRef.current = img;
      setDrawTrigger(prev => prev + 1);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [imageFile]);

  // Load transparent foreground subject into memory
  useEffect(() => {
    if (!transparentBlob) {
      imgForegroundRef.current = null;
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(transparentBlob);
    img.onload = () => {
      imgForegroundRef.current = img;
      setDrawTrigger(prev => prev + 1);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [transparentBlob]);

  // Load custom background image into memory
  useEffect(() => {
    if (!customBgUrl) {
      imgCustomBgRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      imgCustomBgRef.current = img;
      setDrawTrigger(prev => prev + 1);
    };
    img.src = customBgUrl;
  }, [customBgUrl]);

  // Initialize history when transparentBlob is generated (initial state)
  useEffect(() => {
    if (transparentBlob) {
      const initialOptions: EditorOptions = {
        bgType: "transparent",
        solidColor: "#ffffff",
        blurAmount: 10,
        customBgUrl: null,
        activePreset: "sunset",
        customGradColor1: "#8b5cf6",
        customGradColor2: "#ec4899",
        customGradAngle: 135,
        scale: 1.0,
        posX: 0,
        posY: 0,
        flipH: false,
        flipV: false,
        rotateDeg: 0,
        shadowEnabled: false,
        shadowColor: "#000000",
        shadowBlur: 15,
        shadowOffset: 8,
        strokeEnabled: false,
        strokeColor: "#ffffff",
        strokeWidth: 8,
        effectGrayscale: 0,
        effectBrightness: 100,
        effectContrast: 100,
        effectSepia: 0,
        subjectFilterPreset: "none",
      };
      setOptions(initialOptions);
      setHistory([initialOptions]);
      setHistoryIndex(0);
    }
  }, [transparentBlob]);

  // Debounced history committer
  useEffect(() => {
    if (!transparentBlob) return;
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setHistory(prev => {
        const last = prev[historyIndex];
        if (last && JSON.stringify(last) === JSON.stringify(options)) {
          return prev;
        }
        const nextHist = prev.slice(0, historyIndex + 1);
        nextHist.push(options);
        setHistoryIndex(nextHist.length - 1);
        return nextHist;
      });
    }, 450);

    return () => clearTimeout(timer);
  }, [options, transparentBlob]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoRedoRef.current = true;
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setOptions(history[nextIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoRef.current = true;
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setOptions(history[nextIndex]);
    }
  };

  // Option Updater
  const updateOption = <K extends keyof EditorOptions>(key: K, value: EditorOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  // Trigger drawing on changes
  useEffect(() => {
    if (!imgForegroundRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fgImg = imgForegroundRef.current;
    const width = fgImg.naturalWidth;
    const height = fgImg.naturalHeight;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Selected Background
    if (bgType === "transparent") {
      // Left empty for transparency
    } else if (bgType === "color") {
      ctx.fillStyle = solidColor;
      ctx.fillRect(0, 0, width, height);
    } else if (bgType === "blur" && imgOriginalRef.current) {
      ctx.save();
      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(imgOriginalRef.current, -blurAmount * 2, -blurAmount * 2, width + blurAmount * 4, height + blurAmount * 4);
      ctx.restore();
    } else if (bgType === "custom" && imgCustomBgRef.current) {
      ctx.drawImage(imgCustomBgRef.current, 0, 0, width, height);
    } else if (bgType === "preset") {
      drawPresetGradient(ctx, width, height, activePreset);
    } else if (bgType === "gradient") {
      const angleRad = (customGradAngle * Math.PI) / 180;
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.sqrt(width * width + height * height) / 2;
      
      const x1 = cx - Math.cos(angleRad) * r;
      const y1 = cy - Math.sin(angleRad) * r;
      const x2 = cx + Math.cos(angleRad) * r;
      const y2 = cy + Math.sin(angleRad) * r;
      
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, customGradColor1);
      grad.addColorStop(1, customGradColor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Draw Subject with modifications
    ctx.save();

    // Subject size & coordinates
    const subW = width * scale;
    const subH = height * scale;
    const x = (width - subW) / 2 + posX;
    const y = (height - subH) / 2 + posY;

    // Transformations
    ctx.translate(x + subW / 2, y + subH / 2);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.rotate((rotateDeg * Math.PI) / 180);
    ctx.translate(-(x + subW / 2), -(y + subH / 2));

    // Shadow effect
    if (shadowEnabled) {
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = shadowOffset;
      ctx.shadowOffsetY = shadowOffset;
    }

    // A. Draw Outline Stroke (Sticker style outline border)
    if (strokeEnabled && strokeWidth > 0) {
      const strokeCanvas = document.createElement("canvas");
      strokeCanvas.width = subW + strokeWidth * 2;
      strokeCanvas.height = subH + strokeWidth * 2;
      const strokeCtx = strokeCanvas.getContext("2d");
      if (strokeCtx) {
        strokeCtx.drawImage(fgImg, strokeWidth, strokeWidth, subW, subH);
        strokeCtx.globalCompositeOperation = "source-in";
        strokeCtx.fillStyle = strokeColor;
        strokeCtx.fillRect(0, 0, strokeCanvas.width, strokeCanvas.height);
        
        ctx.save();
        for (let angle = 0; angle < 360; angle += 22.5) {
          const rad = (angle * Math.PI) / 180;
          ctx.drawImage(
            strokeCanvas,
            x - strokeWidth + Math.cos(rad) * strokeWidth,
            y - strokeWidth + Math.sin(rad) * strokeWidth
          );
        }
        ctx.restore();
      }
    }

    // B. Apply color filters
    let filterString = `grayscale(${effectGrayscale}%) brightness(${effectBrightness}%) contrast(${effectContrast}%) sepia(${effectSepia}%)`;
    if (subjectFilterPreset === "bw") {
      filterString += " grayscale(100%)";
    } else if (subjectFilterPreset === "vintage") {
      filterString += " sepia(80%) contrast(120%)";
    } else if (subjectFilterPreset === "cool") {
      filterString += " hue-rotate(180deg) saturate(120%)";
    } else if (subjectFilterPreset === "warm") {
      filterString += " saturate(140%) sepia(20%)";
    } else if (subjectFilterPreset === "invert") {
      filterString += " invert(100%)";
    } else if (subjectFilterPreset === "hue-shift") {
      filterString += " hue-rotate(90deg)";
    } else if (subjectFilterPreset === "blur") {
      filterString += " blur(6px)";
    }
    ctx.filter = filterString;

    ctx.drawImage(fgImg, x, y, subW, subH);
    ctx.restore();

    // Export result
    setResultUrl(canvas.toDataURL("image/png"));

  }, [
    drawTrigger, bgType, solidColor, blurAmount, customBgUrl, activePreset,
    customGradColor1, customGradColor2, customGradAngle,
    scale, posX, posY, flipH, flipV, rotateDeg, shadowEnabled, shadowColor,
    shadowBlur, shadowOffset, strokeEnabled, strokeColor, strokeWidth,
    effectGrayscale, effectBrightness, effectContrast, effectSepia,
    subjectFilterPreset
  ]);

  const drawPresetGradient = (ctx: CanvasRenderingContext2D, w: number, h: number, preset: string) => {
    let grad;
    switch (preset) {
      case "sunset":
        grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#f97316");
        grad.addColorStop(1, "#ec4899");
        break;
      case "ocean":
        grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "#06b6d4");
        grad.addColorStop(1, "#3b82f6");
        break;
      case "neon":
        grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, "#8b5cf6");
        grad.addColorStop(0.5, "#d946ef");
        grad.addColorStop(1, "#06b6d4");
        break;
      case "sunset-subtle":
        grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#ffe4e6");
        grad.addColorStop(1, "#fecdd3");
        break;
      case "studio-grey":
        grad = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, Math.max(w, h)/1.2);
        grad.addColorStop(0, "#f3f4f6");
        grad.addColorStop(1, "#9ca3af");
        break;
      case "studio-dark":
        grad = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, Math.max(w, h)/1.2);
        grad.addColorStop(0, "#374151");
        grad.addColorStop(1, "#111827");
        break;
      default:
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        return;
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  };

  const handleFileSelect = (file: File) => {
    processFile(file);
    setTransparentBlob(null);
    setResultUrl(null);
    setError(null);
    setProgressPercent(0);
    setProgressStep("");
    
    setOptions({
      bgType: "transparent",
      solidColor: "#ffffff",
      blurAmount: 10,
      customBgUrl: null,
      activePreset: "sunset",
      customGradColor1: "#8b5cf6",
      customGradColor2: "#ec4899",
      customGradAngle: 135,
      scale: 1.0,
      posX: 0,
      posY: 0,
      flipH: false,
      flipV: false,
      rotateDeg: 0,
      shadowEnabled: false,
      shadowColor: "#000000",
      shadowBlur: 15,
      shadowOffset: 8,
      strokeEnabled: false,
      strokeColor: "#ffffff",
      strokeWidth: 8,
      effectGrayscale: 0,
      effectBrightness: 100,
      effectContrast: 100,
      effectSepia: 0,
      subjectFilterPreset: "none",
    });
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handleRemove = async () => {
    if (!imageFile) return;
    setIsProcessing(true);
    setTransparentBlob(null);
    setResultUrl(null);
    setError(null);
    setProgressPercent(0);
    setProgressStep("Preparing image...");

    // Smooth simulated progress bar tracker to avoid frozen 0% state
    let currentProgress = 1;
    setProgressPercent(1);
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 8 + 3; // Increment by 3% - 11%
      if (currentProgress >= 99) {
        currentProgress = 99;
        clearInterval(progressInterval);
      }
      setProgressPercent(Math.round(currentProgress));

      if (currentProgress < 15) {
        setProgressStep("Preparing photo workspace...");
      } else if (currentProgress < 50) {
        setProgressStep("Loading local AI modules...");
      } else {
        setProgressStep("Analyzing and erasing background...");
      }
    }, 60);

    try {
      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(imageFile.file);
        img.onload = () => {
          const maxDim = 1600;
          let width = img.naturalWidth;
          let height = img.naturalHeight;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            URL.revokeObjectURL(url);
            reject(new Error("Could not initialize image workspace."));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            if (blob) resolve(blob);
            else reject(new Error("Failed to read image source."));
          }, "image/png");
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to load image. Make sure the file isn't corrupted."));
        };
        img.src = url;
      });

      const { removeBackground } = await import("@imgly/background-removal");
      
      const processedBlob = await removeBackground(pngBlob, {
        progress: () => {
          // Handled smoothly by the simulation timer
        }
      });

      clearInterval(progressInterval);
      setProgressPercent(99);
      setProgressStep("Generating Transparent Preview...");
      
      // Briefly show 99% then transition to 100% completion
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgressPercent(100);
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      setTransparentBlob(processedBlob);
    } catch (e: any) {
      clearInterval(progressInterval);
      console.error(e);
      setError(e.message || "Failed to remove the background. Try another file.");
    } finally {
      setIsProcessing(false);
      setProgressPercent(0);
      setProgressStep("");
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !imageFile) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `edited_${imageFile.name.split(".")[0]}.png`;
    a.click();
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (customBgUrl) URL.revokeObjectURL(customBgUrl);
      updateOption("customBgUrl", URL.createObjectURL(e.target.files[0]));
      updateOption("bgType", "custom");
    }
  };

  const handleReplaceClick = () => {
    replaceInputRef.current?.click();
  };

  const handleReplaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleReset = () => {
    clearFile();
    setTransparentBlob(null);
    setResultUrl(null);
    setError(null);
    setProgressPercent(0);
    setProgressStep("");
    if (customBgUrl) URL.revokeObjectURL(customBgUrl);
    setOptions({
      bgType: "transparent",
      solidColor: "#ffffff",
      blurAmount: 10,
      customBgUrl: null,
      activePreset: "sunset",
      customGradColor1: "#8b5cf6",
      customGradColor2: "#ec4899",
      customGradAngle: 135,
      scale: 1.0,
      posX: 0,
      posY: 0,
      flipH: false,
      flipV: false,
      rotateDeg: 0,
      shadowEnabled: false,
      shadowColor: "#000000",
      shadowBlur: 15,
      shadowOffset: 8,
      strokeEnabled: false,
      strokeColor: "#ffffff",
      strokeWidth: 8,
      effectGrayscale: 0,
      effectBrightness: 100,
      effectContrast: 100,
      effectSepia: 0,
      subjectFilterPreset: "none",
    });
    setHistory([]);
    setHistoryIndex(-1);

    // Smooth scroll back to the top of the container
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const checkerStyle = {
    backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%),
                      linear-gradient(-45deg, #ccc 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #ccc 75%),
                      linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
    backgroundSize: "16px 16px",
    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
    backgroundColor: "#f0f0f0",
  };

  const PRESETS = [
    { id: "sunset", label: "Sunset", class: "bg-gradient-to-br from-orange-500 to-pink-500" },
    { id: "ocean", label: "Ocean", class: "bg-gradient-to-br from-cyan-500 to-blue-500" },
    { id: "neon", label: "Neon", class: "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" },
    { id: "sunset-subtle", label: "Rose", class: "bg-gradient-to-br from-rose-100 to-rose-200" },
    { id: "studio-grey", label: "Grey", class: "bg-radial from-gray-100 to-gray-400" },
    { id: "studio-dark", label: "Dark", class: "bg-radial from-gray-700 to-gray-900" },
  ];

  const QUICK_COLORS = [
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Grey", value: "#f3f4f6" },
    { name: "Blue", value: "#e0f2fe" }
  ];

  return (
    <div ref={containerRef} className="w-full space-y-6 animate-fade-in-up">
      {/* Hidden composite canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden replace input */}
      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleReplaceChange}
        accept="image/*"
        className="hidden"
      />

      {/* Error display */}
      {(error || uploadError) && (
        <div ref={errorRef} className="bg-destructive/10 border border-destructive/20 text-destructive px-5 py-4 rounded-2xl flex items-center gap-3 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error || uploadError}
        </div>
      )}

      {/* Upload Zone */}
      {!imageFile ? (
        <UploadBox
          onFileSelect={handleFileSelect}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          title="Upload to Remove Background"
          subtitle="Processed 100% locally and privately in your browser"
        />
      ) : (
        <>
          {/* STATE B: Single card showing Upload Preview BEFORE background is removed (Full Width Layout) */}
          {!transparentBlob ? (
            <div className="flex flex-col gap-6 w-full bg-card border border-border/80 rounded-3xl p-6 shadow-md">
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Original Photo</p>
                <div className="bg-muted/30 border border-border/50 rounded-2xl p-2 flex items-center justify-center min-h-[300px] relative overflow-hidden">
                  <ImagePreview imageFile={imageFile} onClear={handleReset} />
                </div>
              </div>

              {/* Remove Background Action Button */}
              <button
                onClick={handleRemove}
                disabled={isProcessing}
                className="w-full px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-base flex items-center justify-center gap-3 disabled:opacity-75 cursor-pointer"
              >
                {isProcessing ? (
                  <span>{progressStep} ({progressPercent}%)</span>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Remove Background</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            
            /* STATE C: 2-Column Split Editor Workspace AFTER background is removed */
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT COLUMN: Controls & Adjustments */}
              <div className={`lg:col-span-5 flex flex-col bg-card border border-border/80 rounded-3xl ${showBgDropdown ? 'overflow-visible z-30' : 'overflow-hidden'} lg:overflow-hidden lg:h-[600px] shadow-md`}>
                
                {/* Header (Tab selector) with padding and blur bg */}
                <div className="p-6 pb-2 border-b border-border/40 bg-card/40 backdrop-blur-xl z-10 flex-shrink-0 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">
                      {feature.name}
                    </h3>
                    <button 
                      onClick={handleReset}
                      className="p-1.5 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                      title="Reset & Clear Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex overflow-x-auto no-scrollbar gap-1">
                    <button
                      onClick={() => setActiveTab("background")}
                      className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === "background" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    >
                      <Palette className="w-3.5 h-3.5" />
                      Background
                    </button>
                    <button
                      onClick={() => setActiveTab("subject")}
                      className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === "subject" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Subject
                    </button>
                    <button
                      onClick={() => setActiveTab("effects")}
                      className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === "effects" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Effects
                    </button>
                  </div>
                </div>

                {/* Main Content scrollable panel */}
                <div className={`flex-1 ${showBgDropdown ? 'overflow-visible relative z-30' : 'overflow-y-auto'} no-scrollbar p-6`}>
                  
                  {/* Tab 1: Background Settings */}
                  {activeTab === "background" && (
                    <div className="flex flex-col gap-4 animate-fade-in text-left">
                      
                      {/* Custom Dropdown for Background Type */}
                      <div className="flex flex-col gap-1.5 relative">
                        <span className="text-xs font-bold text-muted-foreground">Background Style:</span>
                        <div className="relative">
                          <button
                            onClick={() => setShowBgDropdown(!showBgDropdown)}
                            className="w-full px-4 py-3 bg-background border border-border/80 rounded-xl hover:bg-muted/50 text-foreground flex items-center justify-between transition-all cursor-pointer font-semibold text-sm shadow-sm"
                          >
                            <span>{bgTypeLabels[bgType]}</span>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${showBgDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                          </button>

                          {showBgDropdown && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowBgDropdown(false)} />
                              <div className="absolute left-0 right-0 mt-1.5 z-20 bg-card border border-border/80 rounded-2xl shadow-xl overflow-y-auto max-h-52 py-1 divide-y divide-border/20 animate-fade-in-up no-scrollbar">
                                {Object.entries(bgTypeLabels).map(([key, label]) => (
                                  <button
                                    key={key}
                                    onClick={() => {
                                      updateOption("bgType", key as any);
                                      setShowBgDropdown(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-sm font-semibold hover:bg-muted/80 flex items-center justify-between transition-colors ${bgType === key ? "text-primary bg-primary/5" : "text-foreground"}`}
                                  >
                                    <span>{label}</span>
                                    {bgType === key && <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Solid Color Config */}
                      {bgType === "color" && (
                        <div className="space-y-3 animate-fade-in-up pt-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {QUICK_COLORS.map((col) => (
                              <button
                                key={col.value}
                                onClick={() => updateOption("solidColor", col.value)}
                                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${solidColor === col.value ? "border-primary bg-primary/5 text-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
                              >
                                <span className="w-3 h-3 rounded-md border border-border/40" style={{ backgroundColor: col.value }} />
                                {col.name}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 bg-muted/20 px-3 py-1.5 rounded-xl border border-border/30 w-fit">
                            <span className="text-xs font-medium text-muted-foreground">Custom:</span>
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border/80 shadow-inner cursor-pointer">
                              <input
                                type="color"
                                value={solidColor}
                                onChange={(e) => updateOption("solidColor", e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <div className="w-full h-full border border-border/20 rounded-md" style={{ backgroundColor: solidColor }} />
                            </div>
                            <span className="text-xs font-mono font-bold text-foreground">{solidColor.toUpperCase()}</span>
                          </div>
                        </div>
                      )}

                      {/* Portrait Blur Config */}
                      {bgType === "blur" && (
                        <div className="flex items-center gap-4 bg-muted/20 px-4 py-3 rounded-xl border border-border/30 w-full animate-fade-in-up">
                          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Blur Amount: {blurAmount}px</span>
                          <input
                            type="range"
                            min={1}
                            max={30}
                            value={blurAmount}
                            onChange={(e) => updateOption("blurAmount", parseInt(e.target.value))}
                            className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                          />
                        </div>
                      )}

                      {/* Presets Gallery */}
                      {bgType === "preset" && (
                        <div className="grid grid-cols-3 gap-2 animate-fade-in-up">
                          {PRESETS.map((preset) => (
                            <button
                              key={preset.id}
                              onClick={() => {
                                updateOption("activePreset", preset.id);
                                updateOption("bgType", "preset");
                              }}
                              className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${activePreset === preset.id ? "border-primary bg-primary/5" : "border-border hover:border-foreground/50 bg-background"}`}
                            >
                              <div className={`w-8 h-8 rounded-xl shadow-inner ${preset.class}`} />
                              <span className="text-[9px] font-bold text-foreground mt-1">{preset.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Custom Gradient Config */}
                      {bgType === "gradient" && (
                        <div className="space-y-4 animate-fade-in-up pt-1">
                          <div className="flex flex-wrap items-center gap-3">
                            {/* Color 1 Picker */}
                            <div className="flex items-center gap-2 bg-muted/20 px-3 py-1.5 rounded-xl border border-border/30 w-fit">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Start</span>
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border/80 shadow-inner cursor-pointer">
                                <input
                                  type="color"
                                  value={customGradColor1}
                                  onChange={(e) => updateOption("customGradColor1", e.target.value)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="w-full h-full border border-border/20 rounded-md" style={{ backgroundColor: customGradColor1 }} />
                              </div>
                              <span className="text-[11px] font-mono font-bold text-foreground">{customGradColor1.toUpperCase()}</span>
                            </div>

                            {/* Color 2 Picker */}
                            <div className="flex items-center gap-2 bg-muted/20 px-3 py-1.5 rounded-xl border border-border/30 w-fit">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">End</span>
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border/80 shadow-inner cursor-pointer">
                                <input
                                  type="color"
                                  value={customGradColor2}
                                  onChange={(e) => updateOption("customGradColor2", e.target.value)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="w-full h-full border border-border/20 rounded-md" style={{ backgroundColor: customGradColor2 }} />
                              </div>
                              <span className="text-[11px] font-mono font-bold text-foreground">{customGradColor2.toUpperCase()}</span>
                            </div>
                          </div>

                          {/* Gradient Direction Slider */}
                          <div className="flex items-center gap-4 bg-muted/20 px-4 py-3 rounded-xl border border-border/30 w-full">
                            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Direction: {customGradAngle}°</span>
                            <input
                              type="range"
                              min={0}
                              max={360}
                              value={customGradAngle}
                              onChange={(e) => updateOption("customGradAngle", parseInt(e.target.value))}
                              className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Custom Upload */}
                      {bgType === "custom" && (
                        <div className="flex flex-col gap-2 bg-muted/20 p-3 rounded-xl border border-border/30 w-full animate-fade-in-up">
                          <span className="text-xs font-semibold text-muted-foreground">Select Background:</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCustomBgUpload}
                            className="text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Subject Adjustments */}
                  {activeTab === "subject" && (
                    <div className="flex flex-col gap-4 animate-fade-in text-left">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                          <span>Subject Size: {Math.round(scale * 100)}%</span>
                          <button onClick={() => updateOption("scale", 1.0)} className="text-[10px] text-primary hover:underline">Reset</button>
                        </div>
                        <input
                          type="range"
                          min={0.2}
                          max={2.0}
                          step={0.05}
                          value={scale}
                          onChange={(e) => updateOption("scale", parseFloat(e.target.value))}
                          className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                          <span>Move Horizontal (X Offset): {posX}px</span>
                          <button onClick={() => updateOption("posX", 0)} className="text-[10px] text-primary hover:underline">Center</button>
                        </div>
                        <input
                          type="range"
                          min={-400}
                          max={400}
                          value={posX}
                          onChange={(e) => updateOption("posX", parseInt(e.target.value))}
                          className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                          <span>Move Vertical (Y Offset): {posY}px</span>
                          <button onClick={() => updateOption("posY", 0)} className="text-[10px] text-primary hover:underline">Center</button>
                        </div>
                        <input
                          type="range"
                          min={-400}
                          max={400}
                          value={posY}
                          onChange={(e) => updateOption("posY", parseInt(e.target.value))}
                          className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                        />
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                          <span>Rotate Angle: {rotateDeg}°</span>
                          <button onClick={() => updateOption("rotateDeg", 0)} className="text-[10px] text-primary hover:underline">Reset</button>
                        </div>
                        <input
                          type="range"
                          min={-180}
                          max={180}
                          value={rotateDeg}
                          onChange={(e) => updateOption("rotateDeg", parseInt(e.target.value))}
                          className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => updateOption("flipH", !flipH)}
                          className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${flipH ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:text-foreground"}`}
                        >
                          Mirror H
                        </button>
                        <button
                          onClick={() => updateOption("flipV", !flipV)}
                          className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${flipV ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:text-foreground"}`}
                        >
                          Mirror V
                        </button>
                      </div>
                    </div>
                  )}                  {/* Tab 3: Shadow & Glow Effects */}
                  {activeTab === "effects" && (
                    <div className="flex flex-col gap-3 animate-fade-in text-left">

                      {/* CARD 1: Filters & Adjustments */}
                      <div className="bg-background/40 border border-border/40 rounded-2xl overflow-hidden transition-all duration-300">
                        {/* Header */}
                        <button
                          onClick={() => setExpandedEffectSec(expandedEffectSec === "filters" ? null : "filters")}
                          className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-foreground">Filters & Adjustments</h4>
                              <p className="text-[9px] text-muted-foreground font-medium">Color styles and manual adjustments</p>
                            </div>
                          </div>
                          <svg className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${expandedEffectSec === "filters" || expandedEffectSec === "all" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                        </button>

                        {/* Content */}
                        {(expandedEffectSec === "filters" || expandedEffectSec === "all") && (
                          <div className="p-4 pt-0 border-t border-border/20 bg-muted/5 space-y-4 animate-fade-in">
                            <div className="space-y-2.5 pt-3">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Visual Styles</span>
                              <div className="grid grid-cols-4 gap-1.5">
                                {[
                                  { id: "none", label: "Original", class: "bg-gradient-to-br from-indigo-500 to-pink-500" },
                                  { id: "bw", label: "B&W", class: "bg-gradient-to-br from-indigo-500 to-pink-500 grayscale" },
                                  { id: "vintage", label: "Vintage", class: "bg-gradient-to-br from-indigo-500 to-pink-500 sepia contrast-125" },
                                  { id: "cool", label: "Cool Tone", class: "bg-gradient-to-br from-indigo-500 to-pink-500 hue-rotate-180 saturate-125" },
                                  { id: "warm", label: "Warm Tone", class: "bg-gradient-to-br from-indigo-500 to-pink-500 saturate-150 sepia-25" },
                                  { id: "invert", label: "Inverted", class: "bg-gradient-to-br from-indigo-500 to-pink-500 invert" },
                                  { id: "hue-shift", label: "Rainbow", class: "bg-gradient-to-br from-indigo-500 to-pink-500 hue-rotate-90" },
                                  { id: "blur", label: "Soft Blur", class: "bg-gradient-to-br from-indigo-500 to-pink-500 blur-[2px]" },
                                ].map((f) => (
                                  <button
                                    key={f.id}
                                    onClick={() => updateOption("subjectFilterPreset", f.id)}
                                    className={`flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all cursor-pointer ${subjectFilterPreset === f.id ? "border-primary bg-primary/10 shadow-sm" : "border-border/40 hover:border-foreground/30 bg-background"}`}
                                  >
                                    <div className={`w-7 h-7 rounded-lg overflow-hidden relative shadow-inner ${f.class}`} />
                                    <span className="text-[8px] font-bold text-muted-foreground mt-1 text-center truncate w-full">{f.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-3 pt-2">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Manual Fine-Tune</span>
                              
                              {/* Grayscale */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[10.5px] font-semibold text-muted-foreground">
                                  <span>Saturation</span>
                                  <span>{100 - effectGrayscale}%</span>
                                </div>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={effectGrayscale}
                                  onChange={(e) => updateOption("effectGrayscale", parseInt(e.target.value))}
                                  className="w-full accent-primary h-1 cursor-pointer bg-secondary rounded-lg appearance-none"
                                />
                              </div>

                              {/* Brightness */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[10.5px] font-semibold text-muted-foreground">
                                  <span>Brightness</span>
                                  <span>{effectBrightness}%</span>
                                </div>
                                <input
                                  type="range"
                                  min={50}
                                  max={150}
                                  value={effectBrightness}
                                  onChange={(e) => updateOption("effectBrightness", parseInt(e.target.value))}
                                  className="w-full accent-primary h-1 cursor-pointer bg-secondary rounded-lg appearance-none"
                                />
                              </div>

                              {/* Contrast */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[10.5px] font-semibold text-muted-foreground">
                                  <span>Contrast</span>
                                  <span>{effectContrast}%</span>
                                </div>
                                <input
                                  type="range"
                                  min={50}
                                  max={150}
                                  value={effectContrast}
                                  onChange={(e) => updateOption("effectContrast", parseInt(e.target.value))}
                                  className="w-full accent-primary h-1 cursor-pointer bg-secondary rounded-lg appearance-none"
                                />
                              </div>

                              {/* Sepia (Vintage) */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[10.5px] font-semibold text-muted-foreground">
                                  <span>Vintage (Sepia)</span>
                                  <span>{effectSepia}%</span>
                                </div>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={effectSepia}
                                  onChange={(e) => updateOption("effectSepia", parseInt(e.target.value))}
                                  className="w-full accent-primary h-1 cursor-pointer bg-secondary rounded-lg appearance-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CARD 2: Sticker Outline */}
                      <div className="bg-background/40 border border-border/40 rounded-2xl overflow-hidden transition-all duration-300">
                        {/* Header */}
                        <div
                          onClick={() => setExpandedEffectSec(expandedEffectSec === "outline" ? null : "outline")}
                          className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                              <Palette className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-foreground">Sticker Outline</h4>
                              <p className="text-[9px] text-muted-foreground font-medium">Cutout outline border and thickness</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateOption("strokeEnabled", !strokeEnabled);
                              }}
                              className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer ${strokeEnabled ? "bg-primary" : "bg-muted-foreground/30"}`}
                            >
                              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all duration-200 ${strokeEnabled ? "left-[19px]" : "left-[3px]"}`} />
                            </button>
                            <svg className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${expandedEffectSec === "outline" || expandedEffectSec === "all" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                          </div>
                        </div>

                        {/* Content */}
                        {(expandedEffectSec === "outline" || expandedEffectSec === "all") && (
                          <div className="p-4 pt-0 border-t border-border/20 bg-muted/5 space-y-4 animate-fade-in">
                            <div className="pt-3 space-y-4">
                              <div className="flex items-center gap-3 bg-muted/20 px-3 py-1.5 rounded-xl border border-border/30 w-fit">
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Color:</span>
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border/80 shadow-inner cursor-pointer">
                                  <input
                                    type="color"
                                    value={strokeColor}
                                    onChange={(e) => updateOption("strokeColor", e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  />
                                  <div className="w-full h-full border border-border/20 rounded-md" style={{ backgroundColor: strokeColor }} />
                                </div>
                                <span className="text-[11px] font-mono font-bold text-foreground">{strokeColor.toUpperCase()}</span>
                              </div>

                              <div className="space-y-1">
                                <span className="text-xs font-semibold text-muted-foreground">Outline Width: {strokeWidth}px</span>
                                <input
                                  type="range"
                                  min={1}
                                  max={30}
                                  value={strokeWidth}
                                  onChange={(e) => updateOption("strokeWidth", parseInt(e.target.value))}
                                  className="w-full accent-primary h-1 cursor-pointer bg-secondary rounded-lg appearance-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CARD 3: Glow & Shadow */}
                      <div className="bg-background/40 border border-border/40 rounded-2xl overflow-hidden transition-all duration-300">
                        {/* Header */}
                        <div
                          onClick={() => setExpandedEffectSec(expandedEffectSec === "shadow" ? null : "shadow")}
                          className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                              <Sparkles className="w-4 h-4 rotate-45" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-foreground">Glow & Shadow</h4>
                              <p className="text-[9px] text-muted-foreground font-medium">Soft back-glow and shadow offsets</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateOption("shadowEnabled", !shadowEnabled);
                              }}
                              className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer ${shadowEnabled ? "bg-primary" : "bg-muted-foreground/30"}`}
                            >
                              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all duration-200 ${shadowEnabled ? "left-[19px]" : "left-[3px]"}`} />
                            </button>
                            <svg className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${expandedEffectSec === "shadow" || expandedEffectSec === "all" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                          </div>
                        </div>

                        {/* Content */}
                        {(expandedEffectSec === "shadow" || expandedEffectSec === "all") && (
                          <div className="p-4 pt-0 border-t border-border/20 bg-muted/5 space-y-4 animate-fade-in">
                            <div className="pt-3 space-y-4">
                              <div className="flex items-center gap-3 bg-muted/20 px-3 py-1.5 rounded-xl border border-border/30 w-fit">
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Color:</span>
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border/80 shadow-inner cursor-pointer">
                                  <input
                                    type="color"
                                    value={shadowColor}
                                    onChange={(e) => updateOption("shadowColor", e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  />
                                  <div className="w-full h-full border border-border/20 rounded-md" style={{ backgroundColor: shadowColor }} />
                                </div>
                                <span className="text-[11px] font-mono font-bold text-foreground">{shadowColor.toUpperCase()}</span>
                              </div>

                              <div className="space-y-1">
                                <span className="text-xs font-semibold text-muted-foreground">Blur Radius: {shadowBlur}px</span>
                                <input
                                  type="range"
                                  min={2}
                                  max={50}
                                  value={shadowBlur}
                                  onChange={(e) => updateOption("shadowBlur", parseInt(e.target.value))}
                                  className="w-full accent-primary h-1 cursor-pointer bg-secondary rounded-lg appearance-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <span className="text-xs font-semibold text-muted-foreground">Offset Distance: {shadowOffset}px</span>
                                <input
                                  type="range"
                                  min={0}
                                  max={30}
                                  value={shadowOffset}
                                  onChange={(e) => updateOption("shadowOffset", parseInt(e.target.value))}
                                  className="w-full accent-primary h-1 cursor-pointer bg-secondary rounded-lg appearance-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>

                {/* ACTION BUTTONS FOOTER */}
                <div className="flex-shrink-0 p-6 border-t border-border bg-card/40 backdrop-blur-xl z-10 mt-auto flex flex-col gap-4 w-full">
                  <button
                    onClick={handleDownload}
                    className="w-full px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Export Image
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN: Live Canvas Preview */}
              <div className="lg:col-span-7 flex flex-col lg:h-[600px]">
                
                {/* Right card: header toolbar + preview as single rounded container */}
                <div className="flex-1 flex flex-col bg-card border border-border/80 rounded-3xl overflow-hidden shadow-md">
                  {/* Header toolbar */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-card/40 backdrop-blur-xl flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleReplaceClick}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm animate-fade-in"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Replace
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleUndo}
                        disabled={historyIndex <= 0}
                        className="p-2 bg-background border border-border/80 text-foreground rounded-xl hover:bg-muted/50 disabled:opacity-40 cursor-pointer transition-all duration-200"
                        title="Undo"
                      >
                        <Undo2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleRedo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-2 bg-background border border-border/80 text-foreground rounded-xl hover:bg-muted/50 disabled:opacity-40 cursor-pointer transition-all duration-200"
                        title="Redo"
                      >
                        <Redo2 className="w-4 h-4" />
                      </button>

                      {/* Toggle Original Preview */}
                      <div className="relative ml-1">
                        <button
                          onClick={() => setShowOriginalFloat(!showOriginalFloat)}
                          className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${showOriginalFloat ? "bg-primary/10 border-primary/40 text-primary" : "bg-background border-border/80 hover:bg-muted text-foreground"}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Original
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview Box */}
                  <div 
                    className="flex-1 flex items-center justify-center p-6 relative overflow-hidden select-none"
                    style={(showOriginalFloat || (resultUrl && bgType === "transparent")) ? checkerStyle : undefined}
                  >
                    {(showOriginalFloat || (resultUrl && bgType === "transparent")) && (
                      <div className="absolute inset-0 bg-checkerboard opacity-10 pointer-events-none z-0" />
                    )}

                    {showOriginalFloat ? (
                      <div className="relative w-full h-full flex items-center justify-center z-10">
                        <img src={imageFile.previewUrl} alt="Original Preview" className="max-w-full max-h-full object-contain p-4 animate-fade-in" />
                      </div>
                    ) : resultUrl ? (
                      <div className="relative w-full h-full flex items-center justify-center z-10">
                        <img src={resultUrl} alt="Result" className="max-w-full max-h-full object-contain p-4 animate-fade-in drop-shadow-lg" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-muted-foreground/40 py-16 px-6 text-center">
                        <Wand2 className="w-14 h-14" />
                        <p className="text-sm font-semibold">Result will appear here</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}
        </>
      )}
    </div>
  );
}
