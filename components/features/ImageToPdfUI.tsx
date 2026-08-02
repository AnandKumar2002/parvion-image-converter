"use client";

import { useState, useRef, useEffect } from "react";
import { Feature } from "@/src/types/feature";
import { Download, Upload, Trash2, FileText, Settings, BookOpen, ChevronUp, ChevronDown, Plus, Check } from "lucide-react";
import { jsPDF } from "jspdf";
import { ImageValidationService } from "@/src/services/imageValidationService";
import { generateUniqueId } from "@/src/utils/fileUtils";
import { ImageFile, ImageExtension, ImageMimeType } from "@/src/types/image.types";
import { UploadBox } from "./UniversalConverter/UploadBox";

interface PageOptions {
  pageSize: "a4" | "letter" | "legal" | "fit";
  orientation: "auto" | "portrait" | "landscape";
  margin: "none" | "small" | "medium" | "large";
  imageFit: "fit" | "center" | "stretch";
}

interface PdfImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  width?: number;
  height?: number;
  size: number;
  layout: PageOptions; // Local per-page configuration
}

export function ImageToPdfUI({ feature }: { feature: Feature }) {
  const [pdfImages, setPdfImages] = useState<PdfImageItem[]>([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"layout" | "pages" | "metadata">("pages");

  // Metadata is global
  const [metaTitle, setMetaTitle] = useState("");
  const [metaAuthor, setMetaAuthor] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const appendInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && pdfImages.length > 0) {
      let file = e.target.files[0];
      const validation = ImageValidationService.validate(file);
      if (!validation.isValid) return;

      const ext = file.name.split('.').pop()?.toLowerCase() as ImageExtension || 'unknown';
      let previewUrl = URL.createObjectURL(file);

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
          file = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
            type: 'image/jpeg'
          });
          previewUrl = URL.createObjectURL(file);
        } catch (err: any) {
          const errMsg = err?.message || (typeof err === 'string' ? err : '');
          if (!errMsg.includes("already browser readable")) {
            console.error("HEIC conversion failed:", err);
            return;
          }
        }
      }

      const oldImg = pdfImages[selectedPageIndex];
      if (oldImg) URL.revokeObjectURL(oldImg.previewUrl);

      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setPdfImages(prev => {
            const copy = [...prev];
            copy[selectedPageIndex] = {
              ...copy[selectedPageIndex],
              file,
              name: file.name,
              previewUrl,
              width: img.width,
              height: img.height,
              size: file.size
            };
            return copy;
          });
          resolve();
        };
        img.onerror = () => {
          setPdfImages(prev => {
            const copy = [...prev];
            copy[selectedPageIndex] = {
              ...copy[selectedPageIndex],
              file,
              name: file.name,
              previewUrl,
              size: file.size
            };
            return copy;
          });
          resolve();
        };
        img.src = previewUrl;
      });
    }
    e.target.value = "";
  };

  // Default layout options
  const defaultLayout = (): PageOptions => ({
    pageSize: "a4",
    orientation: "auto",
    margin: "none",
    imageFit: "fit"
  });

  const activePage = pdfImages[selectedPageIndex];

  // Helper to validate and convert File object to PdfImageItem
  const addFilesToList = async (files: FileList | File[]) => {
    const validImageFiles: PdfImageItem[] = [];
    
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const validation = ImageValidationService.validate(file);
      if (!validation.isValid) continue;

      const ext = file.name.split('.').pop()?.toLowerCase() as ImageExtension || 'unknown';
      let previewUrl = URL.createObjectURL(file);

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
          file = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
            type: 'image/jpeg'
          });
          previewUrl = URL.createObjectURL(file);
        } catch (err: any) {
          const errMsg = err?.message || (typeof err === 'string' ? err : '');
          if (!errMsg.includes("already browser readable")) {
            console.error("HEIC conversion failed:", err);
            continue;
          }
        }
      }

      // Load dimensions asynchronously
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          validImageFiles.push({
            id: generateUniqueId(),
            file,
            name: file.name,
            previewUrl,
            width: img.width,
            height: img.height,
            size: file.size,
            layout: defaultLayout()
          });
          resolve();
        };
        img.onerror = () => {
          validImageFiles.push({
            id: generateUniqueId(),
            file,
            name: file.name,
            previewUrl,
            size: file.size,
            layout: defaultLayout()
          });
          resolve();
        };
        img.src = previewUrl;
      });
    }

    if (validImageFiles.length > 0) {
      setPdfImages(prev => {
        const newImages = [...prev, ...validImageFiles];
        // Default selection to the first added image if list was previously empty
        if (prev.length === 0) {
          setSelectedPageIndex(0);
        }
        return newImages;
      });
      setActiveTab("pages");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToList(e.target.files);
    }
    e.target.value = "";
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFilesToList(e.dataTransfer.files);
    }
  };

  // Option update bindings (applies to selected page only)
  const updateActivePageLayout = <K extends keyof PageOptions>(key: K, value: PageOptions[K]) => {
    if (pdfImages.length === 0) return;
    setPdfImages(prev => {
      const copy = [...prev];
      copy[selectedPageIndex] = {
        ...copy[selectedPageIndex],
        layout: {
          ...copy[selectedPageIndex].layout,
          [key]: value
        }
      };
      return copy;
    });
  };

  const applyLayoutToAllPages = () => {
    if (pdfImages.length === 0) return;
    const activeLayout = pdfImages[selectedPageIndex].layout;
    setPdfImages(prev => prev.map(img => ({
      ...img,
      layout: { ...activeLayout }
    })));
  };

  // Reordering controls
  const movePageUp = (index: number) => {
    if (index === 0) return;
    setPdfImages(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
    if (selectedPageIndex === index) {
      setSelectedPageIndex(index - 1);
    } else if (selectedPageIndex === index - 1) {
      setSelectedPageIndex(index);
    }
  };

  const movePageDown = (index: number) => {
    setPdfImages(prev => {
      if (index === prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
    if (selectedPageIndex === index) {
      setSelectedPageIndex(index + 1);
    } else if (selectedPageIndex === index + 1) {
      setSelectedPageIndex(index);
    }
  };

  const removePage = (index: number) => {
    setPdfImages(prev => {
      const copy = [...prev];
      const removed = copy.splice(index, 1)[0];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return copy;
    });

    // Keep active selectedPageIndex in range
    setSelectedPageIndex(prev => {
      if (prev >= pdfImages.length - 1) {
        return Math.max(0, pdfImages.length - 2);
      }
      return prev;
    });
  };

  const handleReset = () => {
    pdfImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setPdfImages([]);
    setSelectedPageIndex(0);
    setMetaTitle("");
    setMetaAuthor("");
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  };

  // Generate PDF and update Preview URL
  useEffect(() => {
    if (pdfImages.length === 0) {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
      return;
    }

    setIsGenerating(true);

    const pageDimensions = {
      a4: { p: [595.28, 841.89], l: [841.89, 595.28] },
      letter: { p: [612.0, 792.0], l: [792.0, 612.0] },
      legal: { p: [612.0, 1008.0], l: [1008.0, 612.0] }
    };

    const compilePdf = async () => {
      try {
        let pdf: jsPDF | null = null;

        for (let i = 0; i < pdfImages.length; i++) {
          const imgItem = pdfImages[i];
          const { pageSize: pSize, orientation: orient, margin: pMargin, imageFit: pFit } = imgItem.layout;
          
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const imgW = img.naturalWidth || 800;
              const imgH = img.naturalHeight || 600;

              // Calculate page orientation
              let pageO: "p" | "l" = "p";
              if (orient === "portrait") {
                pageO = "p";
              } else if (orient === "landscape") {
                pageO = "l";
              } else {
                pageO = imgW > imgH ? "l" : "p";
              }

              // Calculate page dimensions
              let pageWidth = 0;
              let pageHeight = 0;
              if (pSize === "fit") {
                pageWidth = imgW * 0.75;
                pageHeight = imgH * 0.75;
              } else {
                const dims = pageDimensions[pSize][pageO];
                pageWidth = dims[0];
                pageHeight = dims[1];
              }

              // Margins in points
              let m = 0;
              if (pMargin === "small") m = 10;
              if (pMargin === "medium") m = 20;
              if (pMargin === "large") m = 30;

              const maxCanvasW = pageWidth - m * 2;
              const maxCanvasH = pageHeight - m * 2;

              let destW = maxCanvasW;
              let destH = maxCanvasH;
              let destX = m;
              let destY = m;

              const imgRatio = imgW / imgH;
              const pageRatio = maxCanvasW / maxCanvasH;

              if (pFit === "fit") {
                if (imgRatio > pageRatio) {
                  destW = maxCanvasW;
                  destH = maxCanvasW / imgRatio;
                  destY = m + (maxCanvasH - destH) / 2;
                } else {
                  destH = maxCanvasH;
                  destW = maxCanvasH * imgRatio;
                  destX = m + (maxCanvasW - destW) / 2;
                }
              } else if (pFit === "center") {
                destW = imgW * 0.75;
                destH = imgH * 0.75;
                if (destW > maxCanvasW || destH > maxCanvasH) {
                  const shrinkRatio = Math.min(maxCanvasW / destW, maxCanvasH / destH);
                  destW *= shrinkRatio;
                  destH *= shrinkRatio;
                }
                destX = m + (maxCanvasW - destW) / 2;
                destY = m + (maxCanvasH - destH) / 2;
              }

              // Load image Base64 data Url
              const tempCanvas = document.createElement("canvas");
              tempCanvas.width = imgW;
              tempCanvas.height = imgH;
              const tempCtx = tempCanvas.getContext("2d");
              if (tempCtx) {
                tempCtx.drawImage(img, 0, 0);
                const dataUrl = tempCanvas.toDataURL(imgItem.file.type || "image/jpeg", 0.92);
                const formatType = imgItem.file.type.includes("png") ? "PNG" : imgItem.file.type.includes("webp") ? "WEBP" : "JPEG";

                if (i === 0) {
                  pdf = new jsPDF({
                    orientation: pageO,
                    unit: "pt",
                    format: pSize === "fit" ? [pageWidth, pageHeight] : pSize
                  });
                  if (metaTitle) pdf.setProperties({ title: metaTitle });
                  if (metaAuthor) pdf.setProperties({ author: metaAuthor });
                } else if (pdf) {
                  pdf.addPage(pSize === "fit" ? [pageWidth, pageHeight] : pSize, pageO);
                }

                if (pdf) {
                  pdf.addImage(dataUrl, formatType, destX, destY, destW, destH);
                }
              }
              resolve();
            };
            img.onerror = () => {
              resolve();
            };
            img.src = imgItem.previewUrl;
          });
        }

        if (pdf) {
          const pdfBlob = (pdf as jsPDF).output("blob");
          if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
          setPdfBlobUrl(URL.createObjectURL(pdfBlob));
        }
      } catch (err) {
        console.error("PDF compilation failed:", err);
      } finally {
        setIsGenerating(false);
      }
    };

    compilePdf();
  }, [pdfImages, metaTitle, metaAuthor]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      pdfImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, []);

  const handleDownload = () => {
    if (!pdfBlobUrl || pdfImages.length === 0) return;
    const a = document.createElement("a");
    a.href = pdfBlobUrl;
    const baseName = pdfImages[0].name.replace(/\.[^/.]+$/, "");
    a.download = pdfImages.length > 1 ? `${baseName}_compiled.pdf` : `${baseName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

  return (
    <div className="w-full">
      {/* File inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={appendInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleReplaceFile}
        accept="image/*"
        className="hidden"
      />

      {/* STATE A: UPLOAD ZONE */}
      {pdfImages.length === 0 ? (
        <UploadBox
          onFileSelect={(file) => addFilesToList([file])}
          onFilesSelect={addFilesToList}
          multiple={true}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          title="Upload to Image to PDF"
          subtitle="Support JPG, PNG, WEBP, and SVG. 100% locally in your browser."
        />
      ) : (
        /* STATE B: PDF EDITOR WORKSPACE */
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch animate-fade-in-up">
          
          {/* LEFT COLUMN: Controls & Page Ordering */}
          <div className="lg:col-span-5 flex flex-col bg-card border border-border/80 rounded-3xl overflow-hidden lg:h-[600px] shadow-md">
            
            {/* Header Tabs */}
            <div className="p-6 pb-2 border-b border-border/40 bg-card/40 backdrop-blur-xl z-10 flex-shrink-0 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  Image to PDF
                </h3>
                <button 
                  onClick={handleReset}
                  className="p-1.5 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-lg transition-colors shadow-sm cursor-pointer animate-fade-in"
                  title="Clear All Pages"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex overflow-x-auto no-scrollbar gap-1">
                <button
                  onClick={() => setActiveTab("pages")}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === "pages" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Pages ({pdfImages.length})
                </button>
                <button
                  onClick={() => setActiveTab("layout")}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === "layout" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Page Layout
                </button>
                <button
                  onClick={() => setActiveTab("metadata")}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === "metadata" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  PDF Metadata
                </button>
              </div>
            </div>

            {/* Config Options Panel */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-5 text-left min-h-0">
              
              {/* Tab 1: Pages Manager */}
              {activeTab === "pages" && (
                <div className="space-y-4 animate-fade-in flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">PDF Page Order</span>
                    
                    {/* Add More button */}
                    <button
                      onClick={() => appendInputRef.current?.click()}
                      className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-primary/20 transition-all cursor-pointer shadow-sm animate-fade-in"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Images
                    </button>
                  </div>

                  <div className="flex-grow overflow-y-auto pr-1 space-y-2 max-h-[350px] no-scrollbar">
                    {pdfImages.map((img, index) => (
                      <div 
                        key={img.id}
                        onClick={() => {
                          setSelectedPageIndex(index);
                          setActiveTab("layout");
                        }}
                        className={`flex items-center justify-between bg-background border rounded-2xl p-2.5 hover:border-primary/50 transition-all shadow-sm cursor-pointer group ${selectedPageIndex === index ? 'border-primary ring-2 ring-primary/10' : 'border-border/80'}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Page Index Badge */}
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black flex-shrink-0 ${selectedPageIndex === index ? 'bg-primary border-primary text-white' : 'bg-muted border-border text-muted-foreground'}`}>
                            {index + 1}
                          </span>
                          {/* Thumbnail preview */}
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-border/50 bg-muted/30 flex-shrink-0 flex items-center justify-center select-none pointer-events-none">
                            <img src={img.previewUrl} alt={img.name} className="w-full h-full object-cover" />
                          </div>
                          {/* File info */}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate max-w-[120px]" title={img.name}>
                              {img.name}
                            </p>
                            <p className="text-[9px] font-semibold text-muted-foreground">
                              {(img.size / 1024).toFixed(0)} KB • {img.width && img.height ? `${img.width}x${img.height}px` : "Vector"}
                            </p>
                          </div>
                        </div>

                        {/* Page reordering actions */}
                        <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => movePageUp(index)}
                            disabled={index === 0}
                            className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none border border-transparent"
                            title="Move Page Up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => movePageDown(index)}
                            disabled={index === pdfImages.length - 1}
                            className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none border border-transparent"
                            title="Move Page Down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removePage(index)}
                            className="p-1.5 bg-destructive/5 hover:bg-destructive hover:text-white text-destructive rounded-lg transition-all cursor-pointer border border-destructive/10"
                            title="Delete Page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Layout settings (Edits currently selected page layout) */}
              {activeTab === "layout" && activePage && (
                <div className="space-y-5 animate-fade-in">
                  
                  {/* Select page context header */}
                  <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white">
                        {selectedPageIndex + 1}
                      </span>
                      <span className="text-xs font-bold text-foreground">Editing page layout settings</span>
                    </div>
                    
                    {/* Apply to All Pages */}
                    {pdfImages.length > 1 && (
                      <button
                        onClick={applyLayoutToAllPages}
                        className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-black rounded-lg hover:bg-primary/95 transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                        title="Copy this page's layout to all other pages"
                      >
                        <Check className="w-3 h-3" /> Apply to All
                      </button>
                    )}
                  </div>

                  {/* Page Size */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-muted-foreground">Page Size:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "a4", label: "A4" },
                        { id: "letter", label: "Letter" },
                        { id: "legal", label: "Legal" },
                        { id: "fit", label: "Fit Image Size" }
                      ].map((sizeOpt) => (
                        <button
                          key={sizeOpt.id}
                          onClick={() => updateActivePageLayout("pageSize", sizeOpt.id as any)}
                          className={`px-3 py-2.5 text-xs font-bold border rounded-xl transition-all cursor-pointer text-center ${activePage.layout.pageSize === sizeOpt.id ? "bg-primary/10 border-primary text-primary" : "bg-background border-border hover:border-foreground/50 text-foreground"}`}
                        >
                          {sizeOpt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orientation */}
                  {activePage.layout.pageSize !== "fit" && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-muted-foreground">Orientation:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "auto", label: "Auto" },
                          { id: "portrait", label: "Portrait" },
                          { id: "landscape", label: "Landscape" }
                        ].map((orientOpt) => (
                          <button
                            key={orientOpt.id}
                            onClick={() => updateActivePageLayout("orientation", orientOpt.id as any)}
                            className={`px-2 py-2 text-xs font-bold border rounded-xl transition-all cursor-pointer text-center ${activePage.layout.orientation === orientOpt.id ? "bg-primary/10 border-primary text-primary" : "bg-background border-border hover:border-foreground/50 text-foreground"}`}
                          >
                            {orientOpt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Page Margins */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-muted-foreground">Margins:</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "none", label: "None" },
                        { id: "small", label: "Small" },
                        { id: "medium", label: "Medium" },
                        { id: "large", label: "Large" }
                      ].map((marginOpt) => (
                        <button
                          key={marginOpt.id}
                          onClick={() => updateActivePageLayout("margin", marginOpt.id as any)}
                          className={`px-1.5 py-2.5 text-xs font-bold border rounded-xl transition-all cursor-pointer text-center ${activePage.layout.margin === marginOpt.id ? "bg-primary/10 border-primary text-primary" : "bg-background border-border hover:border-foreground/50 text-foreground"}`}
                        >
                          {marginOpt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Scaling */}
                  {activePage.layout.pageSize !== "fit" && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-muted-foreground">Image Alignment / Scaling:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "fit", label: "Fit Page" },
                          { id: "center", label: "Center" },
                          { id: "stretch", label: "Stretch to Fill" }
                        ].map((fitOpt) => (
                          <button
                            key={fitOpt.id}
                            onClick={() => updateActivePageLayout("imageFit", fitOpt.id as any)}
                            className={`px-2 py-2 text-xs font-bold border rounded-xl transition-all cursor-pointer text-center ${activePage.layout.imageFit === fitOpt.id ? "bg-primary/10 border-primary text-primary" : "bg-background border-border hover:border-foreground/50 text-foreground"}`}
                          >
                            {fitOpt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Tab 3: Metadata settings */}
              {activeTab === "metadata" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Document Title:</label>
                    <input
                      type="text"
                      placeholder="e.g. My Scanned Document"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-foreground font-semibold text-sm focus:outline-none focus:border-primary shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Author / Owner:</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={metaAuthor}
                      onChange={(e) => setMetaAuthor(e.target.value)}
                      className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-foreground font-semibold text-sm focus:outline-none focus:border-primary shadow-inner"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Action Footer */}
            <div className="flex-shrink-0 p-6 border-t border-border bg-card/40 backdrop-blur-xl z-10 mt-auto flex flex-col gap-4 w-full">
              <button
                onClick={handleDownload}
                disabled={!pdfBlobUrl || isGenerating || pdfImages.length === 0}
                className="w-full px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Live PDF Preview */}
          <div className="lg:col-span-7 flex flex-col lg:h-[600px]">
            <div className="flex-1 flex flex-col bg-card border border-border/80 rounded-3xl overflow-hidden shadow-md">
              
              {/* Header toolbar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-card/40 backdrop-blur-xl flex-shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => replaceInputRef.current?.click()}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm animate-fade-in"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Replace
                  </button>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground font-bold pr-1">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Live PDF Preview</span>
                </div>
              </div>

              {/* PDF Preview Frame */}
              <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden select-none">
                <div className="absolute inset-0 bg-checkerboard opacity-10 pointer-events-none z-0" />
                
                <div className="relative w-full h-full flex items-center justify-center z-10">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <p className="text-xs font-bold text-muted-foreground">Compiling PDF Layout...</p>
                    </div>
                  ) : pdfBlobUrl ? (
                    <iframe
                      src={`${pdfBlobUrl}#toolbar=0&navpanes=0&statusbar=0&view=Fit`}
                      className="w-full h-full rounded-xl border border-border bg-background animate-fade-in"
                      title="PDF preview"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <p className="text-xs font-bold text-muted-foreground">Loading file...</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
