"use client";

import { Feature } from "@/src/types/feature";
import { UploadZone } from "./UploadZone";
import { FileOutput, Loader2, Image as ImageIcon, Download } from "lucide-react";
import { useState } from "react";
import { ImageService, TargetFormat } from "@/src/services/imageService";

export function ConverterUI({ feature }: { feature: Feature }) {
  // Extract target format from slug if possible, e.g. "png-to-jpg" -> "JPG"
  const defaultFormat = (feature.slug.split("-to-")[1]?.toUpperCase() || "JPG") as TargetFormat;

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(90);
  const [isConverting, setIsConverting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResultUrl(null); // reset if new file uploaded
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsConverting(true);
    setResultUrl(null);

    try {
      const blob = await ImageService.convertImage(file, defaultFormat, quality / 100);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      
      // Auto-trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted_${file.name.split('.')[0]}.${defaultFormat.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Conversion failed:", error);
      alert("Failed to convert image. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {!file ? (
        <UploadZone 
          title={`Upload images to convert to ${defaultFormat}`} 
          onFileSelect={handleFileSelect} 
        />
      ) : (
        <div className="w-full relative min-h-[200px] border-2 border-border rounded-3xl bg-card/40 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center shadow-sm">
          {previewUrl ? (
            <div className="w-24 h-24 mb-4 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-sm relative bg-black/5 flex items-center justify-center">
              <img src={previewUrl} alt="Upload preview" className="object-cover w-full h-full" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
          <h3 className="text-xl font-bold text-foreground mb-1">{file.name}</h3>
          <p className="text-sm text-muted-foreground mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to convert</p>
          <button 
            onClick={() => {
              setFile(null);
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
            }} 
            className="text-xs text-muted-foreground hover:text-primary transition-colors underline font-medium"
          >
            Upload a different image
          </button>
        </div>
      )}
      
      <div className={`bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 transition-opacity duration-300 ${!file ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Compact Quality Slider */}
        <div className="flex-1 w-full">
           <div className="flex items-center justify-between mb-1">
             <label className="font-bold text-foreground text-sm sm:text-base">Output Quality</label>
             <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">{quality}%</span>
           </div>
           <p className="text-xs text-muted-foreground mb-4">Adjust the slider to balance visual clarity with file size.</p>
           
           <input 
             type="range" 
             className="w-full accent-primary h-2 cursor-pointer mb-2" 
             min="1" 
             max="100" 
             value={quality}
             onChange={(e) => {
               setQuality(parseInt(e.target.value));
               if (resultUrl) setResultUrl(null); // Reset conversion so they must convert again with new quality
             }}
           />
           
           <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
             <span>Smaller File</span>
             <span>High Quality</span>
           </div>
        </div>

        {/* Divider for Desktop */}
        <div className="h-16 w-px bg-border/60 hidden md:block"></div>
        
        {/* Action Button */}
        <button 
          onClick={resultUrl ? () => {
            const a = document.createElement('a');
            a.href = resultUrl;
            a.download = `converted_${file?.name.split('.')[0]}.${defaultFormat.toLowerCase()}`;
            a.click();
          } : handleConvert}
          disabled={!file || isConverting}
          className="w-full md:w-auto shrink-0 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isConverting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : resultUrl ? (
            <Download className="w-5 h-5" />
          ) : (
            <FileOutput className="w-5 h-5" />
          )}
          {isConverting ? 'Converting...' : resultUrl ? 'Download Again' : `Convert to ${defaultFormat}`}
        </button>
      </div>
    </div>
  );
}
