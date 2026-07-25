import { Image as ImageIcon, X, ImagePlus } from 'lucide-react';
import { ImageFile } from '@/src/types/image.types';
import { formatBytes } from '@/src/utils/fileUtils';
import { FORMAT_DISPLAY_NAMES } from '@/src/constants/imageFormats';

interface ImagePreviewProps {
  imageFile: ImageFile;
  onClear: () => void;
  onFileSelect?: (file: File) => void;
}

export function ImagePreview({ imageFile, onClear, onFileSelect }: ImagePreviewProps) {
  return (
    <div className="w-full relative min-h-[200px] border-2 border-border rounded-3xl bg-card/40 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center shadow-sm animate-fade-in-up">
      {/* Top Actions */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {onFileSelect && (
          <>
            <button 
              onClick={() => document.getElementById('preview-replace-input')?.click()}
              className="px-3 py-1.5 bg-background border border-border rounded-lg hover:bg-muted transition-colors text-foreground flex items-center gap-2 text-xs font-bold shadow-sm cursor-pointer"
              title="Replace image"
            >
              <ImagePlus className="w-4 h-4" /> Replace
            </button>
            <input 
              id="preview-replace-input" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onFileSelect(file);
                }
                e.target.value = ''; // reset input
              }} 
            />
          </>
        )}
        <button 
          onClick={onClear}
          className="p-2 bg-background/50 border border-transparent hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors cursor-pointer"
          title="Remove image"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="w-24 h-24 mb-4 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-sm relative bg-black/5 flex items-center justify-center">
        <img 
          src={imageFile.previewUrl} 
          alt={imageFile.name} 
          className="object-cover w-full h-full" 
        />
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-1 max-w-[80%] truncate" title={imageFile.name}>
        {imageFile.name}
      </h3>
      
      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2 flex-wrap justify-center">
        <span className="font-medium px-2 py-1 bg-muted rounded-md">{FORMAT_DISPLAY_NAMES[imageFile.mimeType] || imageFile.extension.toUpperCase()}</span>
        <span>•</span>
        <span>{formatBytes(imageFile.size)}</span>
        {imageFile.width && imageFile.height && (
          <>
            <span>•</span>
            <span>{imageFile.width} × {imageFile.height}px</span>
          </>
        )}
      </div>
    </div>
  );
}
