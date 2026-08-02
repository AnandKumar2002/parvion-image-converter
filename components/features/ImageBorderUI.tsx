"use client";

import React, { useState, useEffect, useRef } from "react";
import { Feature } from "@/src/types/feature";
import { 
  Upload, 
  Download, 
  RotateCcw, 
  Frame, 
  Palette, 
  Sparkles,
  Sliders,
  Undo2,
  Redo2,
  Trash2
} from "lucide-react";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { UploadBox } from "./UniversalConverter/UploadBox";

interface BorderOptions {
  borderType: "inset" | "expand"; // Overlay inside or expand canvas width
  outerWidth: number;
  outerColor: string;
  outerStyle: "solid" | "dashed" | "dotted" | "double";
  
  innerWidth: number;
  innerColor: string;
  innerOffset: number;
  
  borderRadius: number;
  
  bgType: "color" | "gradient";
  solidBg: string;
  gradColor1: string;
  gradColor2: string;
  gradAngle: number;
  
  frameStyle: "none" | "polaroid" | "wood" | "film";
  polaroidText: string;
  polaroidFont: "sans" | "serif" | "handwriting";
  polaroidTextColor: string;
  polaroidTextSize: number;
  
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffset: number;
}

const DEFAULT_OPTIONS: BorderOptions = {
  borderType: "expand",
  outerWidth: 20,
  outerColor: "#ffffff",
  outerStyle: "solid",
  innerWidth: 0,
  innerColor: "#000000",
  innerOffset: 10,
  borderRadius: 0,
  bgType: "color",
  solidBg: "#1e293b",
  gradColor1: "#8b5cf6",
  gradColor2: "#ec4899",
  gradAngle: 135,
  frameStyle: "none",
  polaroidText: "Memories",
  polaroidFont: "handwriting",
  polaroidTextColor: "#1e293b",
  polaroidTextSize: 24,
  shadowEnabled: false,
  shadowColor: "#000000",
  shadowBlur: 15,
  shadowOffset: 6,
};

export function ImageBorderUI({ feature }: { feature: Feature }) {
  const { imageFile, error: uploadError, isDragging, setIsDragging, processFile, clearFile } = useFileUpload();
  
  const [options, setOptions] = useState<BorderOptions>(DEFAULT_OPTIONS);
  const [activeTab, setActiveTab] = useState<"borders" | "background" | "frame" | "effects">("borders");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<BorderOptions[]>([DEFAULT_OPTIONS]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  
  // Export Configurations
  const [exportFormat, setExportFormat] = useState<"original" | "png" | "jpeg" | "webp">("original");
  const [exportQuality, setExportQuality] = useState<number>(90);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isUndoRedoRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    borderType, outerWidth, outerColor, outerStyle,
    innerWidth, innerColor, innerOffset,
    borderRadius, bgType, solidBg, gradColor1, gradColor2, gradAngle,
    frameStyle, polaroidText, polaroidFont, polaroidTextColor, polaroidTextSize,
    shadowEnabled, shadowColor, shadowBlur, shadowOffset
  } = options;

  // Handle file import
  useEffect(() => {
    if (imageFile) {
      setOptions(DEFAULT_OPTIONS);
      setHistory([DEFAULT_OPTIONS]);
      setHistoryIndex(0);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  // Set up Undo/Redo tracking
  const updateOption = <K extends keyof BorderOptions>(key: K, value: BorderOptions[K]) => {
    setOptions(prev => {
      const next = { ...prev, [key]: value };
      
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

      // Calculate canvas bounds
      let extraPadding = borderType === "expand" ? outerWidth * 2 : 0;
      let bottomPadding = 0;

      // Polaroid frame adds substantial bottom padding
      if (frameStyle === "polaroid") {
        extraPadding = imgW * 0.15; // 7.5% margins left/right/top
        bottomPadding = imgW * 0.35; // Generous space for caption writing
      } else if (frameStyle === "wood") {
        extraPadding = imgW * 0.08;
      } else if (frameStyle === "film") {
        extraPadding = imgW * 0.12;
      }

      const canvasW = imgW + extraPadding;
      const canvasH = imgH + extraPadding + bottomPadding;

      canvas.width = canvasW;
      canvas.height = canvasH;

      ctx.clearRect(0, 0, canvasW, canvasH);

      // 1. Draw Canvas background (solid, gradient, or blur)
      ctx.save();
      if (bgType === "color") {
        ctx.fillStyle = solidBg;
        ctx.fillRect(0, 0, canvasW, canvasH);
      } else if (bgType === "gradient") {
        const cx = canvasW / 2;
        const cy = canvasH / 2;
        const r = Math.sqrt(canvasW * canvasW + canvasH * canvasH) / 2;
        const rad = (gradAngle * Math.PI) / 180;
        const x1 = cx - Math.cos(rad) * r;
        const y1 = cy - Math.sin(rad) * r;
        const x2 = cx + Math.cos(rad) * r;
        const y2 = cy + Math.sin(rad) * r;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, gradColor1);
        grad.addColorStop(1, gradColor2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvasW, canvasH);
      }
      ctx.restore();

      // 2. Draw outer borders if expand mode
      const px = borderType === "expand" ? outerWidth : 0;
      const py = borderType === "expand" ? outerWidth : 0;
      const subW = imgW;
      const subH = imgH;

      // Renders with custom round corners
      ctx.save();
      if (borderRadius > 0) {
        ctx.beginPath();
        const rx = px;
        const ry = py;
        const rw = subW;
        const rh = subH;
        const rVal = Math.min(borderRadius, rw / 2, rh / 2);
        ctx.moveTo(rx + rVal, ry);
        ctx.arcTo(rx + rw, ry, rx + rw, ry + rh, rVal);
        ctx.arcTo(rx + rw, ry + rh, rx, ry + rh, rVal);
        ctx.arcTo(rx, ry + rh, rx, ry, rVal);
        ctx.arcTo(rx, ry, rx + rw, ry, rVal);
        ctx.closePath();
        ctx.clip();
      }

      // Draw the source photo
      ctx.drawImage(img, px, py, subW, subH);
      ctx.restore();

      // 3. Draw Inner borders (inset offset borders)
      if (innerWidth > 0) {
        ctx.save();
        ctx.strokeStyle = innerColor;
        ctx.lineWidth = innerWidth;
        const ix = px + innerOffset;
        const iy = py + innerOffset;
        const iw = subW - innerOffset * 2;
        const ih = subH - innerOffset * 2;
        ctx.strokeRect(ix, iy, iw, ih);
        ctx.restore();
      }

      // 4. Draw outer border styling (solid, dashed, double)
      if (outerWidth > 0 && borderType === "inset") {
        ctx.save();
        ctx.strokeStyle = outerColor;
        ctx.lineWidth = outerWidth;
        
        if (outerStyle === "dashed") {
          ctx.setLineDash([outerWidth * 2, outerWidth]);
        } else if (outerStyle === "dotted") {
          ctx.setLineDash([outerWidth / 2, outerWidth]);
        }

        ctx.strokeRect(outerWidth / 2, outerWidth / 2, canvasW - outerWidth, canvasH - outerWidth);
        
        if (outerStyle === "double") {
          ctx.lineWidth = outerWidth / 3;
          ctx.strokeStyle = outerColor;
          ctx.strokeRect(outerWidth * 0.15, outerWidth * 0.15, canvasW - outerWidth * 0.3, canvasH - outerWidth * 0.3);
        }
        ctx.restore();
      }

      // 5. Draw Frame Skins overlay
      if (frameStyle === "polaroid") {
        ctx.save();
        // Draw bottom polaroid frame borders
        ctx.fillStyle = "#ffffff";
        const borderSz = imgW * 0.075;
        // Left
        ctx.fillRect(0, 0, borderSz, canvasH);
        // Top
        ctx.fillRect(0, 0, canvasW, borderSz);
        // Right
        ctx.fillRect(canvasW - borderSz, 0, borderSz, canvasH);
        // Bottom block
        ctx.fillRect(0, canvasH - bottomPadding - borderSz, canvasW, bottomPadding + borderSz);

        // Polaroid shadow bevels
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.strokeRect(borderSz, borderSz, imgW, imgH);

        // Add Caption Text
        if (polaroidText) {
          ctx.fillStyle = polaroidTextColor;
          let fontStr = "normal 24px sans-serif";
          if (polaroidFont === "serif") fontStr = `italic ${polaroidTextSize * 1.5}px Georgia, serif`;
          else if (polaroidFont === "handwriting") fontStr = `${polaroidTextSize * 1.8}px 'Brush Script MT', cursive, sans-serif`;
          else fontStr = `bold ${polaroidTextSize * 1.3}px sans-serif`;

          ctx.font = fontStr;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(polaroidText, canvasW / 2, canvasH - bottomPadding / 2);
        }
        ctx.restore();
      } else if (frameStyle === "wood") {
        // Wooden Bezel
        ctx.save();
        const borderSz = imgW * 0.08;
        const grad = ctx.createLinearGradient(0, 0, canvasW, canvasH);
        grad.addColorStop(0, "#78350f");
        grad.addColorStop(0.5, "#451a03");
        grad.addColorStop(1, "#78350f");
        ctx.lineWidth = borderSz;
        ctx.strokeStyle = grad;
        ctx.strokeRect(borderSz / 2, borderSz / 2, canvasW - borderSz, canvasH - borderSz);
        
        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 3;
        ctx.strokeRect(borderSz - 1, borderSz - 1, imgW + 2, imgH + 2);
        ctx.restore();
      } else if (frameStyle === "film") {
        // Film roll sprocket frames
        ctx.save();
        const borderSz = imgW * 0.12;
        ctx.fillStyle = "#111111";
        // Paint black vertical borders
        ctx.fillRect(0, 0, borderSz, canvasH);
        ctx.fillRect(canvasW - borderSz, 0, borderSz, canvasH);

        // Paint white film roll sprocket boxes
        ctx.fillStyle = "#ffffff";
        const sprocketH = canvasH * 0.03;
        const sprocketW = borderSz * 0.3;
        const count = 15;
        const step = canvasH / count;
        for (let i = 0; i < count; i++) {
          const sy = i * step + (step - sprocketH) / 2;
          ctx.fillRect(borderSz * 0.35, sy, sprocketW, sprocketH);
          ctx.fillRect(canvasW - borderSz * 0.65, sy, sprocketW, sprocketH);
        }
        ctx.restore();
      }

      setPreviewUrl(canvas.toDataURL("image/png"));
    };

    img.src = objectUrl;

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [options, imageFile]);

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
    a.download = `bordered_${imageFile.name.split(".")[0]}.${fileExt}`;
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
          title="Upload to Image Border & Frame"
          subtitle="Processed 100% locally and privately in your browser"
        />
      ) : (
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
                  onClick={() => setActiveTab("borders")}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === "borders" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Borders
                </button>
                <button
                  onClick={() => setActiveTab("background")}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === "background" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  Canvas
                </button>
                <button
                  onClick={() => setActiveTab("frame")}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === "frame" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <Frame className="w-3.5 h-3.5" />
                  Frames
                </button>
              </div>
            </div>

            {/* Scrollable controls panel */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 text-left">
              
              {/* Tab 1: Borders Settings */}
              {activeTab === "borders" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Border Style Mode */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Border Application:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOption("borderType", "expand")}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          borderType === "expand" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border/85 hover:text-foreground"
                        }`}
                      >
                        Expand Canvas
                      </button>
                      <button
                        onClick={() => updateOption("borderType", "inset")}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          borderType === "inset" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border/85 hover:text-foreground"
                        }`}
                      >
                        Inset Overlay
                      </button>
                    </div>
                  </div>

                  {/* Outer Border Settings */}
                  <div className="space-y-4 pt-2 border-t border-border/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Outer Border Thickness: {outerWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={120}
                      value={outerWidth}
                      onChange={(e) => updateOption("outerWidth", parseInt(e.target.value))}
                      className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                    />

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-muted-foreground">Color:</span>
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border shadow-inner cursor-pointer">
                        <input
                          type="color"
                          value={outerColor}
                          onChange={(e) => updateOption("outerColor", e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="w-full h-full border border-border/20 rounded-md" style={{ backgroundColor: outerColor }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-foreground">{outerColor.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Inner Border settings */}
                  <div className="space-y-4 pt-4 border-t border-border/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Inner Inset Line Width: {innerWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={innerWidth}
                      onChange={(e) => updateOption("innerWidth", parseInt(e.target.value))}
                      className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                    />

                    {innerWidth > 0 && (
                      <div className="space-y-4 animate-fade-in-up">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-muted-foreground">Line Color:</span>
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border shadow-inner cursor-pointer">
                            <input
                              type="color"
                              value={innerColor}
                              onChange={(e) => updateOption("innerColor", e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div className="w-full h-full border border-border/20 rounded-md" style={{ backgroundColor: innerColor }} />
                          </div>
                          <span className="text-xs font-mono font-bold text-foreground">{innerColor.toUpperCase()}</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-muted-foreground">Inset Distance: {innerOffset}px</span>
                          <input
                            type="range"
                            min={2}
                            max={60}
                            value={innerOffset}
                            onChange={(e) => updateOption("innerOffset", parseInt(e.target.value))}
                            className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Corner Rounding settings */}
                  <div className="space-y-4 pt-4 border-t border-border/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Photo Corner Rounding: {borderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={80}
                      value={borderRadius}
                      onChange={(e) => updateOption("borderRadius", parseInt(e.target.value))}
                      className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                    />
                  </div>

                </div>
              )}

              {/* Tab 2: Background / Canvas style */}
              {activeTab === "background" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Fill style selector */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Canvas Fill Type:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOption("bgType", "color")}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          bgType === "color" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        Solid Color
                      </button>
                      <button
                        onClick={() => updateOption("bgType", "gradient")}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          bgType === "gradient" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        Gradient
                      </button>
                    </div>
                  </div>

                  {/* Solid Bg Color Input */}
                  {bgType === "color" && (
                    <div className="space-y-3 pt-2 border-t border-border/20 animate-fade-in-up">
                      <span className="text-xs font-semibold text-muted-foreground">Select Canvas Background:</span>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border shadow-inner cursor-pointer">
                          <input
                            type="color"
                            value={solidBg}
                            onChange={(e) => updateOption("solidBg", e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <div className="w-full h-full border border-border/20 rounded-md" style={{ backgroundColor: solidBg }} />
                        </div>
                        <span className="text-sm font-mono font-bold text-foreground">{solidBg.toUpperCase()}</span>
                      </div>
                    </div>
                  )}

                  {/* Gradient Settings */}
                  {bgType === "gradient" && (
                    <div className="space-y-5 pt-3 border-t border-border/20 animate-fade-in-up">
                      
                      <div className="flex items-center gap-6">
                        <div className="space-y-1.5 flex-1">
                          <span className="text-[11px] font-bold text-muted-foreground">Start Color:</span>
                          <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-border/50">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border/80 cursor-pointer flex-shrink-0">
                              <input
                                type="color"
                                value={gradColor1}
                                onChange={(e) => updateOption("gradColor1", e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <div className="w-full h-full border border-border/25" style={{ backgroundColor: gradColor1 }} />
                            </div>
                            <span className="text-xs font-mono font-bold text-foreground">{gradColor1.toUpperCase()}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <span className="text-[11px] font-bold text-muted-foreground">End Color:</span>
                          <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-border/50">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border/80 cursor-pointer flex-shrink-0">
                              <input
                                type="color"
                                value={gradColor2}
                                onChange={(e) => updateOption("gradColor2", e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <div className="w-full h-full border border-border/25" style={{ backgroundColor: gradColor2 }} />
                            </div>
                            <span className="text-xs font-mono font-bold text-foreground">{gradColor2.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                          <span>Gradient Rotation</span>
                          <span>{gradAngle}°</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={gradAngle}
                          onChange={(e) => updateOption("gradAngle", parseInt(e.target.value))}
                          className="w-full accent-primary h-1.5 cursor-pointer bg-secondary rounded-lg appearance-none"
                        />
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Tab 3: Frames & Polaroid Captions */}
              {activeTab === "frame" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Select Preset Frames style */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Frames overlay skins:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "none", label: "No Frame" },
                        { id: "polaroid", label: "Polaroid Bezel" },
                        { id: "wood", label: "Wooden Bezel" },
                        { id: "film", label: "Film Roll" },
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => updateOption("frameStyle", f.id as any)}
                          className={`py-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            frameStyle === f.id ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background text-muted-foreground border-border hover:text-foreground"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Polaroid caption controls */}
                  {frameStyle === "polaroid" && (
                    <div className="space-y-4 pt-4 border-t border-border/20 animate-fade-in-up">
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground">Polaroid Title text:</span>
                        <input
                          type="text"
                          value={polaroidText}
                          onChange={(e) => updateOption("polaroidText", e.target.value)}
                          className="w-full px-4 py-2.5 bg-background border border-border/80 rounded-xl text-foreground font-semibold text-sm focus:outline-none focus:border-primary transition-all"
                          placeholder="Memories..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground">Title Font Style:</span>
                        <div className="flex gap-2">
                          {[
                            { id: "sans", label: "Modern Sans" },
                            { id: "serif", label: "Serif" },
                            { id: "handwriting", label: "Handwritten" },
                          ].map(font => (
                            <button
                              key={font.id}
                              onClick={() => updateOption("polaroidFont", font.id as any)}
                              className={`flex-1 py-2.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                polaroidFont === font.id ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:text-foreground"
                              }`}
                            >
                              {font.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-6 pt-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-muted-foreground">Text Color:</span>
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border shadow-inner cursor-pointer">
                            <input
                              type="color"
                              value={polaroidTextColor}
                              onChange={(e) => updateOption("polaroidTextColor", e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div className="w-full h-full border border-border/20 rounded-md" style={{ backgroundColor: polaroidTextColor }} />
                          </div>
                        </div>

                        <div className="flex-1 space-y-1">
                          <span className="text-xs font-semibold text-muted-foreground">Font Size: {polaroidTextSize}px</span>
                          <input
                            type="range"
                            min={12}
                            max={48}
                            value={polaroidTextSize}
                            onChange={(e) => updateOption("polaroidTextSize", parseInt(e.target.value))}
                            className="w-full accent-primary h-1 cursor-pointer bg-secondary rounded-lg appearance-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>            {/* ACTION BUTTONS FOOTER */}
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
            
            {/* Right card: header row + preview box as single rounded container */}
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

              {/* Preview Area */}
              <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-checkerboard opacity-10 pointer-events-none z-0" />
                <div className="relative w-full h-full flex items-center justify-center z-10">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Live Border Preview"
                      className="max-w-full max-h-full object-contain rounded-xl shadow-lg animate-fade-in"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <p className="text-xs font-bold text-muted-foreground">Compiling bordered layout...</p>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
