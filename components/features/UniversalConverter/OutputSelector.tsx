import { ImageMimeType } from '@/src/types/image.types';
import { SUPPORTED_OUTPUT_MIME_TYPES, FORMAT_DISPLAY_NAMES } from '@/src/constants/imageFormats';

interface OutputSelectorProps {
  inputMimeType: ImageMimeType;
  selectedOutputFormat: ImageMimeType;
  onSelectFormat: (format: ImageMimeType) => void;
}

export function OutputSelector({ inputMimeType, selectedOutputFormat, onSelectFormat }: OutputSelectorProps) {
  // Filter out the input format so they don't convert PNG to PNG (unless we add a generic compression tool later)
  const availableFormats = SUPPORTED_OUTPUT_MIME_TYPES.filter(fmt => fmt !== inputMimeType);

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm animate-fade-in-up">
      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
        Convert to
      </h4>
      
      <div className="flex flex-wrap gap-3">
        {availableFormats.map((format) => {
          const isSelected = selectedOutputFormat === format;
          return (
            <button
              key={format}
              onClick={() => onSelectFormat(format)}
              className={`
                px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border-2 cursor-pointer
                ${isSelected 
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20 scale-105' 
                  : 'bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5'}
              `}
            >
              {FORMAT_DISPLAY_NAMES[format]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
