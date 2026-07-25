import { CloudUpload, Image as ImageIcon, Scissors } from 'lucide-react';
import { useRef } from 'react';
import { VALIDATION_RULES } from '@/src/constants/validation';

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

export function UploadBox({ onFileSelect, isDragging, setIsDragging }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className="relative w-full group cursor-pointer block animate-fade-in-up"
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={inputRef} 
        onChange={handleChange}
        accept={VALIDATION_RULES.ALLOWED_MIME_TYPES.join(',')}
      />
      
      {/* Outer glowing aura */}
      <div className={`absolute -inset-2 rounded-lg blur-2xl z-0 transition-all duration-700 ${isDragging ? 'bg-gradient-to-tr from-cyan-500/40 via-transparent to-purple-500/40 blur-3xl' : 'bg-gradient-to-tr from-cyan-500/20 via-transparent to-purple-500/20 group-hover:blur-3xl group-hover:from-cyan-500/30 group-hover:to-purple-500/30'}`}></div>

      {/* Main Container */}
      <div className={`bg-card/60 backdrop-blur-2xl border-muted-foreground/30 dark:border-border shadow-xl hover:shadow-2xl rounded-lg p-8 flex flex-col items-center justify-center border-dashed border-2 relative z-10 overflow-hidden transition-all duration-500 min-h-[300px] sm:min-h-[320px] ${isDragging ? 'border-cyan-500 bg-cyan-500/10 scale-[1.02]' : 'hover:border-cyan-500/50 hover:bg-cyan-500/5'}`}>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        {/* Icon Container */}
        <div className={`w-24 h-24 sm:w-28 sm:h-28 bg-background border border-border shadow-xl rounded-2xl flex items-center justify-center mb-8 sm:mb-10 relative transition-all duration-500 z-0 pointer-events-none ${isDragging ? '-translate-y-4 shadow-2xl scale-110' : 'group-hover:-translate-y-4 group-hover:shadow-2xl'}`}>
          <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors duration-500"></div>
          <div className={`absolute inset-[-4px] rounded-[1.25rem] border-2 transition-all duration-500 ${isDragging ? 'border-cyan-500/60 scale-105' : 'border-cyan-500/0 group-hover:border-cyan-500/40 group-hover:scale-105'}`}></div>
          <CloudUpload className={`text-cyan-500 dark:text-cyan-400 w-12 h-12 sm:w-16 sm:h-16 z-0 transition-transform duration-500 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`} />
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3 sm:mb-4 relative z-0 pointer-events-none">Drop image here</h3>
        <p className="text-base sm:text-lg text-muted-foreground mb-10 sm:mb-12 text-center font-light relative z-0 pointer-events-none">or click to browse from your device</p>
        
        {/* Decorative Background Elements */}
        <ImageIcon className="absolute top-8 sm:top-12 right-8 sm:right-12 text-foreground/5 w-16 h-16 sm:w-20 sm:h-20 rotate-12 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
        <Scissors className="absolute bottom-8 sm:bottom-12 left-8 sm:left-12 text-foreground/5 w-16 h-16 sm:w-20 sm:h-20 -rotate-12 group-hover:-rotate-45 group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
      </div>
    </div>
  );
}
