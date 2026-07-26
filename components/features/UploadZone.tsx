"use client";

import { UploadCloud, FileUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface UploadZoneProps {
  title?: string;
  description?: string;
  onFileSelect?: (file: File) => void;
  accept?: string;
}

export function UploadZone({ 
  title = "Choose files", 
  description = "or drag and drop them here",
  onFileSelect,
  accept = "image/*"
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          e.preventDefault();
          if (onFileSelect) onFileSelect(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        alert("Invalid file type! Please upload an image file (JPG, PNG, WEBP, etc).");
        return;
      }
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert("Invalid file type! Please upload an image file (JPG, PNG, WEBP, etc).");
        return;
      }
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className="w-full relative group cursor-pointer animate-fade-in-up"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={inputRef} 
        onChange={handleChange}
        accept={accept}
      />
      
      {/* Subtle Glow using strictly theme colors */}
      <div className={`absolute -inset-0.5 rounded-3xl blur transition duration-500 pointer-events-none ${isDragging ? 'bg-primary/50 opacity-100' : 'bg-primary/20 opacity-0 group-hover:opacity-100'}`}></div>
      
      {/* Main Container - Uses standard bg-card and border-border */}
      <div className={`relative w-full min-h-[250px] border-2 border-dashed rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 sm:p-8 transition-all duration-300 ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border bg-card/40 group-hover:border-primary/50'}`}>
        
        {/* Animated Icon Area */}
        <div className="relative mb-6 mt-2">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 ${isDragging ? 'bg-primary/30 scale-110' : 'bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110'}`}>
            <UploadCloud className={`w-8 h-8 sm:w-10 sm:h-10 text-primary absolute transition-all duration-500 ${isDragging ? '-translate-y-2 opacity-0' : 'group-hover:-translate-y-2 group-hover:opacity-0'}`} />
            <FileUp className={`w-8 h-8 sm:w-10 sm:h-10 text-primary absolute transition-all duration-500 ${isDragging ? 'translate-y-0 opacity-100' : 'opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100'}`} />
          </div>
        </div>
        
        {/* Typography - Uses standard text-foreground */}
        <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 text-foreground transition-colors">
          {isDragging ? 'Drop file here' : title}
        </h3>
        <p className="text-muted-foreground max-w-md text-base sm:text-lg mb-10 group-hover:text-foreground/80 transition-colors">
          {isDragging ? 'Release to upload' : description}
        </p>

        {/* Standard Primary Button */}
        <button className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 text-lg flex items-center gap-2 mb-2 pointer-events-none">
          Select Images
        </button>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-3 text-xs text-muted-foreground font-medium tracking-wide z-10 bg-background/50 px-5 py-2.5 rounded-full border border-border/50 shadow-sm backdrop-blur-sm group-hover:bg-background/80 transition-colors">
          <div className="flex items-center gap-1.5 text-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span className="font-bold">100% Secure</span>
          </div>
          <span className="text-border/80">•</span>
          <span>Processed Locally</span>
        </div>
      </div>
    </div>
  );
}
