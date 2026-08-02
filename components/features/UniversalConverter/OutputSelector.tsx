import { ImageMimeType } from '@/src/types/image.types';
import { SUPPORTED_OUTPUT_MIME_TYPES, FORMAT_DISPLAY_NAMES } from '@/src/constants/imageFormats';

interface OutputSelectorProps {
  inputMimeType: ImageMimeType;
  selectedOutputFormat: ImageMimeType;
  onSelectFormat: (format: ImageMimeType) => void;
}

export function OutputSelector({ inputMimeType, selectedOutputFormat, onSelectFormat }: OutputSelectorProps) {
  // Filter out the input format so they don't convert PNG to PNG
  const availableFormats = SUPPORTED_OUTPUT_MIME_TYPES.filter(fmt => fmt !== inputMimeType);

  // MP4 conversion is only supported from GIF
  const isGif = inputMimeType === 'image/gif';

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm animate-fade-in-up">
      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
        Convert to
      </h4>
      
      <div className="flex flex-wrap gap-3">
        {availableFormats.map((format) => {
          const isSelected = selectedOutputFormat === format;
          const isMp4 = format === 'video/mp4';
          const isHeic = format === 'image/heic';
          const isDisabled = (isMp4 && !isGif) || isHeic;

          let tooltipText = '';
          if (isMp4 && !isGif) {
            tooltipText = 'Only GIF → MP4 is supported';
          } else if (isHeic) {
            tooltipText = 'HEIC is only supported as an input format';
          }

          return (
            <div key={format} className="relative group/btn">
              <button
                onClick={() => !isDisabled && onSelectFormat(format)}
                disabled={isDisabled}
                className={`
                  px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border-2
                  ${isDisabled
                    ? 'bg-muted text-muted-foreground border-border opacity-40 cursor-not-allowed'
                    : isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20 scale-105 cursor-pointer'
                      : 'bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer'}
                `}
              >
                {FORMAT_DISPLAY_NAMES[format]}
              </button>
              {isDisabled && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 text-center bg-popover text-popover-foreground text-xs font-medium px-2 py-1.5 rounded-lg shadow-lg border border-border opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-10">
                  {tooltipText}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
