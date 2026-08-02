"use client";

import React, { useState, useEffect, useRef } from "react";
import { Feature } from "@/src/types/feature";
import { 
  Upload, 
  Download, 
  RotateCcw, 
  Sliders, 
  Sparkles,
  Undo2,
  Redo2,
  Columns,
  BarChart2,
  Trash2
} from "lucide-react";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { UploadBox } from "./UniversalConverter/UploadBox";

interface FilterOptions {
  activePreset: string;
  brightness: number; // 50 to 150 (default 100)
  contrast: number; // 50 to 150 (default 100)
  saturation: number; // 0 to 200 (default 100)
  hueRotate: number; // 0 to 360 (default 0)
  blur: number; // 0 to 20 (default 0)
  grayscale: number; // 0 to 100 (default 0)
  sepia: number; // 0 to 100 (default 0)
  invert: number; // 0 to 100 (default 0)
}

const DEFAULT_OPTIONS: FilterOptions = {
  activePreset: "none",
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hueRotate: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
};

const PRESETS = [
  { id: "none", label: "Original", filter: "none", class: "bg-gradient-to-br from-indigo-500 to-pink-500" },
  { id: "chrome", label: "Chrome", filter: "contrast(115%) saturate(125%)", class: "bg-gradient-to-br from-indigo-500 to-pink-500 saturate-150 contrast-125" },
  { id: "mono", label: "Mono", filter: "grayscale(100%) contrast(120%)", class: "bg-gradient-to-br from-indigo-500 to-pink-500 grayscale contrast-125" },
  { id: "vintage", label: "Vintage", filter: "sepia(70%) contrast(90%) brightness(95%)", class: "bg-gradient-to-br from-indigo-500 to-pink-500 sepia contrast-95 brightness-95" },
  { id: "cool", label: "Cool", filter: "hue-rotate(180deg) saturate(110%)", class: "bg-gradient-to-br from-indigo-500 to-pink-500 hue-rotate-180 saturate-110" },
  { id: "warm", label: "Warm", filter: "sepia(30%) saturate(140%) contrast(110%)", class: "bg-gradient-to-br from-indigo-500 to-pink-500 sepia-[30%] saturate-150 contrast-110" },
  { id: "retro", label: "Retro", filter: "contrast(120%) brightness(110%) sepia(20%) saturate(130%)", class: "bg-gradient-to-br from-indigo-500 to-pink-500 contrast-120 brightness-110 sepia-20 saturate-130" },
  { id: "noir", label: "Noir", filter: "grayscale(100%) contrast(150%) brightness(80%)", class: "bg-gradient-to-br from-indigo-500 to-pink-500 grayscale contrast-150 brightness-75" },
  { id: "negative", label: "Negative", filter: "invert(100%)", class: "bg-gradient-to-br from-indigo-500 to-pink-500 invert" },
];

export function ImageFiltersUI({ feature }: { feature: Feature }) {
  const { imageFile, error: uploadError, isDragging, setIsDragging, processFile, clearFile } = useFileUpload();
  
  const [options, setOptions] = useState<FilterOptions>(DEFAULT_OPTIONS);
  const [activeTab, setActiveTab] = useState<"presets" | "adjustments">("presets");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<FilterOptions[]>([DEFAULT_OPTIONS]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  
  // Comparative Split View states
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [splitPercent, setSplitPercent] = useState(50);
  const isDraggingSplit = useRef(false);
  
  // Histogram Visibility State
  const [showHistogram, setShowHistogram] = useState(true);
  
  // Export Configurations
  const [exportFormat, setExportFormat] = useState<"original" | "png" | "jpeg" | "webp">("original");
  const [exportQuality, setExportQuality] = useState<number>(90);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const histogramCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isUndoRedoRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    activePreset, brightness, contrast, saturation, hueRotate, blur, grayscale, sepia, invert
  } = options;

  // Handle file import
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile.file);
      setOriginalUrl(url);
      setOptions(DEFAULT_OPTIONS);
      setHistory([DEFAULT_OPTIONS]);
      setHistoryIndex(0);
      setCompareEnabled(false);
    } else {
      setPreviewUrl(null);
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      setOriginalUrl(null);
    }
  }, [imageFile]);

  // Set up Undo/Redo tracking
  const updateOption = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    setOptions(prev => {
      const next = { ...prev, [key]: value };
      
      // Clear preset selection if manual options are fine-tuned
      if (key !== "activePreset" && next.activePreset !== "none") {
        next.activePreset = "none";
      }

      // Commit history
      if (!isUndoRedoRef.current) {
        const nextHist = history.slice(0, historyIndex + 1);
        nextHist.push(next);
        setHistory(nextHist);
        setHistoryIndex(nextHist.length - 1);
      }
      isUndoRedoRef.current = false;
      return next;
    });
  };

  // Set preset preset
  const selectPreset = (presetId: string) => {
    setOptions(prev => {
      let base = { ...DEFAULT_OPTIONS, activePreset: presetId };
      
      // Apply default configurations corresponding to presets
      if (presetId === "chrome") {
        base = { ...base, contrast: 115, saturation: 125 };
      } else if (presetId === "mono") {
        base = { ...base, grayscale: 100, contrast: 120 };
      } else if (presetId === "vintage") {
        base = { ...base, sepia: 70, contrast: 90, brightness: 95 };
      } else if (presetId === "cool") {
        base = { ...base, hueRotate: 180, saturation: 110 };
      } else if (presetId === "warm") {
        base = { ...base, sepia: 30, saturation: 140, contrast: 110 };
      } else if (presetId === "retro") {
        base = { ...base, contrast: 120, brightness: 110, sepia: 20, saturation: 130 };
      } else if (presetId === "noir") {
        base = { ...base, grayscale: 100, contrast: 150, brightness: 80 };
      } else if (presetId === "negative") {
        base = { ...base, invert: 100 };
      }

      // Commit history
      if (!isUndoRedoRef.current) {
        const nextHist = history.slice(0, historyIndex + 1);
        nextHist.push(base);
        setHistory(nextHist);
        setHistoryIndex(nextHist.length - 1);
      }
      isUndoRedoRef.current = false;
      return base;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoRedoRef.current = true;
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setOptions(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoRef.current = true;
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setOptions(history[nextIdx]);
    }
  };

  // Canvas drawing routine
  useEffect(() => {
    if (!imageFile) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(imageFile.file);
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;

      canvas.width = imgW;
      canvas.height = imgH;

      ctx.clearRect(0, 0, imgW, imgH);

      // Build CSS Filter string
      let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) grayscale(${grayscale}%) sepia(${sepia}%) invert(${invert}%)`;
      if (blur > 0) {
        filterStr += ` blur(${blur}px)`;
      }

      ctx.save();
      ctx.filter = filterStr;
      ctx.drawImage(img, 0, 0, imgW, imgH);
      ctx.restore();

      setPreviewUrl(canvas.toDataURL("image/png"));
    };

    img.src = objectUrl;

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [options, imageFile]);

  // Generate live histogram
  useEffect(() => {
    if (!previewUrl || !showHistogram) return;
    
    const img = new Image();
    img.onload = () => {
      const canvas = histogramCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw onto tiny helper offscreen canvas for max performance
      const offscreen = document.createElement("canvas");
      offscreen.width = 100;
      offscreen.height = 100;
      const oCtx = offscreen.getContext("2d");
      if (!oCtx) return;
      oCtx.drawImage(img, 0, 0, 100, 100);

      try {
        const imgData = oCtx.getImageData(0, 0, 100, 100);
        const data = imgData.data;
        
        const rHist = new Array(256).fill(0);
        const gHist = new Array(256).fill(0);
        const bHist = new Array(256).fill(0);
        const lHist = new Array(256).fill(0);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const l = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

          rHist[r]++;
          gHist[g]++;
          bHist[b]++;
          lHist[l]++;
        }

        const maxVal = Math.max(
          Math.max(...rHist),
          Math.max(...gHist),
          Math.max(...bHist),
          Math.max(...lHist)
        ) || 1;

        // Draw curves
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const drawChannel = (hist: number[], color: string) => {
          ctx.beginPath();
          ctx.moveTo(0, h);
          for (let x = 0; x < 256; x++) {
            const val = (hist[x] / maxVal) * (h - 8); // margin
            const px = (x / 255) * w;
            const py = h - val;
            ctx.lineTo(px, py);
          }
          ctx.lineTo(w, h);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        };

        ctx.globalCompositeOperation = "source-over";
        // Dark theme grid lines
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
          const gx = (w / 4) * i;
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        }

        ctx.globalCompositeOperation = "screen";
        drawChannel(rHist, "rgba(239, 68, 68, 0.35)");   // Red
        drawChannel(gHist, "rgba(34, 197, 94, 0.35)");   // Green
        drawChannel(bHist, "rgba(59, 130, 246, 0.35)");  // Blue
        drawChannel(lHist, "rgba(226, 232, 240, 0.25)"); // Luminance
      } catch (err) {
        console.error(err);
      }
    };
    img.src = previewUrl;
  }, [previewUrl, showHistogram]);

  // Handle Split View drag operations
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingSplit.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplitPercent(pct);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDraggingSplit.current || !containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplitPercent(pct);
  };

  const stopDragging = () => {
    isDraggingSplit.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", stopDragging);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", stopDragging);
  };

  const startDragging = () => {
    isDraggingSplit.current = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", stopDragging);
  };

  const handleFileSelect = (file: File) => {
    processFile(file);
  };

  const handleDownload = () => {
    if (!previewUrl || !imageFile || !canvasRef.current) return;
    const canvas = canvasRef.current;
    
    let mimeType = "image/png";
    let fileExt = "png";
    
    const origType = imageFile.file.type;
    const origExt = imageFile.file.name.split(".").pop() || "png";

    if (exportFormat === "original") {
      mimeType = origType;
      fileExt = origExt;
    } else if (exportFormat === "jpeg") {
      mimeType = "image/jpeg";
      fileExt = "jpg";
    } else if (exportFormat === "webp") {
      mimeType = "image/webp";
      fileExt = "webp";
    }
    
    const quality = exportQuality / 100;
    const downloadUrl = canvas.toDataURL(mimeType, quality);
    
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `filtered_${imageFile.name.split(".")[0]}.${fileExt}`;
    a.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />

      {/* ERROR BANNER */}
      {(uploadError) && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold rounded-2xl animate-shake">
          {uploadError}
        </div>
      )}

      {/* STATE A: UPLOAD ZONE */}
      {!imageFile ? (
        <UploadBox
          onFileSelect={handleFileSelect}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          title="Upload to Image Filters"
          subtitle="Processed 100% locally and privately in your browser"
        />
      ) : (
        /* STATE B: FILTERS STUDIO WORKSPACE */
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch animate-fade-in-up">
          
          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-5 flex flex-col bg-card border border-border/80 rounded-3xl overflow-hidden lg:h-[600px] shadow-md">
            {/* Header (Tab selector) with padding and blur bg */}
            <div className="p-6 pb-2 border-b border-border/40 bg-card/40 backdrop-blur-xl z-10 flex-shrink-0 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  {feature.name}
                </h3>
                <button 
                  onClick={clearFile}
                  className="p-1.5 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                  title="Clear Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex overflow-x-auto no-scrollbar gap-1">
                <button
                  onClick={() => setActiveTab("presets")}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === "presets" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Presets
                </button>
                <button
                  onClick={() => setActiveTab("adjustments")}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === "adjustments" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Adjustments
                </button>
              </div>
            </div>

            {/* Scrollable controls panel */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 text-left">
              
              {/* Tab 1: Presets Gallery */}
              {activeTab === "presets" && (
                <div className="space-y-4 animate-fade-in">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Visual Filter presets</span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => selectPreset(p.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${activePreset === p.id ? "border-primary bg-primary/5" : "border-border hover:border-foreground/50 bg-background"}`}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden relative shadow-inner bg-muted flex items-center justify-center">
                          {originalUrl ? (
                            <img 
                              src={originalUrl} 
                              alt={p.label}
                              className="w-full h-full object-cover pointer-events-none select-none"
                              style={{ filter: p.filter }}
                            />
                          ) : (
                            <div className={`w-full h-full ${p.class}`} />
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-foreground mt-1 text-center truncate w-full">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Manual Adjustments sliders */}
              {activeTab === "adjustments" && (
                <div className="space-y-4 animate-fade-in">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Custom Photo Tuning</span>

                  {/* Brightness */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                      <span>Brightness</span>
                      <span>{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={150}
                      value={brightness}
                      onChange={(e) => updateOption("brightness", parseInt(e.target.value))}
                      className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                      <span>Contrast</span>
                      <span>{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={150}
                      value={contrast}
                      onChange={(e) => updateOption("contrast", parseInt(e.target.value))}
                      className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                      <span>Saturation</span>
                      <span>{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={saturation}
                      onChange={(e) => updateOption("saturation", parseInt(e.target.value))}
                      className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                    />
                  </div>

                  {/* Hue Rotation */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                      <span>Hue Shift</span>
                      <span>{hueRotate}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={hueRotate}
                      onChange={(e) => updateOption("hueRotate", parseInt(e.target.value))}
                      className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                    />
                  </div>

                  {/* Blur */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                      <span>Blur Radius</span>
                      <span>{blur}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={15}
                      value={blur}
                      onChange={(e) => updateOption("blur", parseInt(e.target.value))}
                      className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                    />
                  </div>

                  {/* Grayscale */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                      <span>Grayscale</span>
                      <span>{grayscale}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={grayscale}
                      onChange={(e) => updateOption("grayscale", parseInt(e.target.value))}
                      className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                    />
                  </div>

                  {/* Sepia */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                      <span>Sepia (Vintage)</span>
                      <span>{sepia}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={sepia}
                      onChange={(e) => updateOption("sepia", parseInt(e.target.value))}
                      className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                    />
                  </div>

                  {/* Invert */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                      <span>Invert Colors</span>
                      <span>{invert}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={invert}
                      onChange={(e) => updateOption("invert", parseInt(e.target.value))}
                      className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                    />
                  </div>

                </div>
              )}

            </div>

            {/* ACTION BUTTONS FOOTER */}
            <div className="flex-shrink-0 p-6 border-t border-border bg-card/40 backdrop-blur-xl z-10 mt-auto flex flex-col gap-4 w-full">
              {/* Export Quality Configuration (Only visible when compressing formats like JPEG or WebP) */}
              {(exportFormat === "jpeg" || exportFormat === "webp" || (exportFormat === "original" && imageFile && (imageFile.file.type === "image/jpeg" || imageFile.file.type === "image/webp" || imageFile.file.type === "image/jpg"))) && (
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

              <div className="flex items-center gap-3 w-full">
                <div className="relative">
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="appearance-none pl-4 pr-9 py-3.5 border border-border bg-background text-foreground hover:border-primary font-bold rounded-xl outline-none cursor-pointer text-sm transition-all uppercase"
                  >
                    <option value="original">Original</option>
                    <option value="png">PNG</option>
                    <option value="jpeg">JPG</option>
                    <option value="webp">WEBP</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="flex-grow px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Export Image
                </button>
              </div>
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
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Replace
                  </button>

                  <button
                    onClick={() => setCompareEnabled(!compareEnabled)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${compareEnabled ? "bg-primary/10 border-primary/40 text-primary" : "bg-background border-border hover:bg-muted text-foreground"}`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    Compare Split
                  </button>

                  <button
                    onClick={() => setShowHistogram(!showHistogram)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${showHistogram ? "bg-primary/10 border-primary/40 text-primary" : "bg-background border-border hover:bg-muted text-foreground"}`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    Histogram
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="p-2 bg-background border border-border/80 text-foreground rounded-xl hover:bg-muted/50 disabled:opacity-40 cursor-pointer transition-all duration-200"
                    title="Undo Change"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-2 bg-background border border-border/80 text-foreground rounded-xl hover:bg-muted/50 disabled:opacity-40 cursor-pointer transition-all duration-200"
                    title="Redo Change"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Preview Box */}
              <div 
                ref={containerRef}
                className="flex-1 flex items-center justify-center p-6 relative overflow-hidden select-none"
              >
              {/* Checkerboard container */}
              <div className="absolute inset-0 bg-checkerboard opacity-10 pointer-events-none z-0" />

              {/* Floating Color Histogram */}
              {previewUrl && showHistogram && (
                <div className="absolute top-4 right-4 z-20 w-32 h-16 bg-card/85 backdrop-blur-xl border border-border/50 rounded-2xl p-1 shadow-md hover:scale-105 transition-transform duration-200 pointer-events-none">
                  <canvas 
                    ref={histogramCanvasRef} 
                    width={256} 
                    height={64} 
                    className="w-full h-full bg-background/30 rounded-xl" 
                  />
                </div>
              )}

              <div className="relative w-full h-full flex items-center justify-center z-10">
                {previewUrl ? (
                  !compareEnabled ? (
                    /* NORMAL PREVIEW */
                    <img
                      src={previewUrl}
                      alt="Live Filters Preview"
                      className="max-w-full max-h-full object-contain rounded-xl shadow-lg animate-fade-in"
                    />
                  ) : (
                    /* DYNAMIC SPLIT SLIDER COMPARE PREVIEW */
                    <div className="relative w-full h-full rounded-xl overflow-hidden">

                      {/* Right side: Filtered output — full size base layer */}
                      <img
                        src={previewUrl}
                        alt="Filtered image"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                      />

                      {/* Left side: Original — same size, clipped by clip-path */}
                      {originalUrl && (
                        <img
                          src={originalUrl}
                          alt="Original image"
                          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                          style={{ clipPath: `inset(0 ${100 - splitPercent}% 0 0)` }}
                        />
                      )}

                      {/* Drag Handle */}
                      <div
                        onMouseDown={startDragging}
                        onTouchStart={startDragging}
                        className="absolute top-0 bottom-0 w-[2px] bg-white/90 cursor-ew-resize z-20 flex items-center justify-center"
                        style={{ left: `${splitPercent}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className="w-9 h-9 rounded-full bg-white text-slate-700 shadow-lg flex items-center justify-center select-none cursor-ew-resize hover:scale-110 active:scale-95 transition-transform border border-slate-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
                          </svg>
                        </div>
                      </div>

                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-xs font-bold text-muted-foreground">Applying photo filters...</p>
                  </div>
                )}
              </div>{/* end relative */}
              <canvas ref={canvasRef} className="hidden" />
            </div>{/* end preview box */}
          </div>{/* end card */}
        </div>{/* end right column */}

        </div>
      )}
    </div>
  );
}
