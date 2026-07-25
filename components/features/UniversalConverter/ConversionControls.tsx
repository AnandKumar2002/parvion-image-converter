import { useState, useEffect } from 'react';

interface ConversionControlsProps {
  quality: number;
  setQuality: (val: number) => void;
  bgColor: string;
  setBgColor: (val: string) => void;
  showQuality: boolean; // only for JPG, WEBP
  showBgColor: boolean; // only when converting PNG/GIF to JPG
  onSettingsChange: () => void; // Used to reset resultUrl if they change settings
}

const BG_COLORS = [
  { label: 'White', value: '#FFFFFF' },
  { label: 'Black', value: '#000000' },
  { label: 'Transparent', value: 'transparent' }
];

export function ConversionControls({ 
  quality, 
  setQuality, 
  bgColor, 
  setBgColor, 
  showQuality, 
  showBgColor,
  onSettingsChange
}: ConversionControlsProps) {
  
  if (!showQuality && !showBgColor) return null;

  return (
    <div className="bg-card border border-border rounded-3xl shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border animate-fade-in-up w-full overflow-hidden">
      
      {showQuality && (
        <div className="flex-1 w-full p-6">
          <div className="flex items-center justify-between mb-1">
            <label className="font-bold text-foreground text-sm sm:text-base">Output Quality</label>
            <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">{quality}%</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Adjust to balance visual clarity with file size.</p>
          
          <input 
            type="range" 
            className="w-full accent-primary h-2 cursor-pointer mb-2" 
            min="1" 
            max="100" 
            value={quality}
            onChange={(e) => {
              setQuality(parseInt(e.target.value));
              onSettingsChange();
            }}
          />
          
          <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
            <span>Smaller File</span>
            <span>High Quality</span>
          </div>
        </div>
      )}

      {showBgColor && (
        <div className="flex-1 w-full p-6">
          <div className="mb-3">
            <label className="font-bold text-foreground text-sm sm:text-base">Background Color</label>
            <p className="text-xs text-muted-foreground mt-1">Fill transparent areas (JPEG doesn&apos;t support transparency).</p>
          </div>
          
          <div className="flex gap-3">
            {BG_COLORS.map(color => (
              <button
                key={color.value}
                onClick={() => {
                  setBgColor(color.value);
                  onSettingsChange();
                }}
                className={`
                  flex-1 py-2 px-3 rounded-xl border-2 transition-all text-sm font-bold
                  ${bgColor === color.value 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border bg-background hover:border-primary/50 text-foreground'}
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-border/50" 
                    style={{ background: color.value === 'transparent' ? 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50% / 8px 8px' : color.value }}
                  />
                  {color.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
