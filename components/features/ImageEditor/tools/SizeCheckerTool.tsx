import { useState, useEffect } from "react";

interface SizeCheckerToolProps {
  imageFile: { file: File; previewUrl: string; name: string } | null;
  imgRef: React.RefObject<HTMLImageElement | null>;
}

export function SizeCheckerTool({ imageFile, imgRef }: SizeCheckerToolProps) {
  const [targetMaxKB, setTargetMaxKB] = useState<number | ''>('');
  const [targetMaxWidth, setTargetMaxWidth] = useState<number | ''>('');

  const fileSizeKB = imageFile ? (imageFile.file.size / 1024).toFixed(2) : 0;
  const width = imgRef.current?.naturalWidth || 0;
  const height = imgRef.current?.naturalHeight || 0;

  const isSizeOk = targetMaxKB === '' || Number(fileSizeKB) <= Number(targetMaxKB);
  const isDimensionsOk = targetMaxWidth === '' || width <= Number(targetMaxWidth);

  return (
    <div className="space-y-6">
      <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Size Information</h4>
      
      <div className="space-y-3 bg-background/30 p-4 rounded-xl border border-border/50">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">File Size:</span>
          <span className={`font-bold ${!isSizeOk ? 'text-destructive' : 'text-foreground'}`}>
            {fileSizeKB} KB
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Dimensions:</span>
          <span className={`font-bold ${!isDimensionsOk ? 'text-destructive' : 'text-foreground'}`}>
            {width} × {height} px
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Validation Rules</h4>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground">Max File Size (KB)</label>
          <input 
            type="number"
            value={targetMaxKB}
            onChange={(e) => setTargetMaxKB(e.target.value ? Number(e.target.value) : '')}
            placeholder="e.g. 500"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold focus:outline-none focus:border-primary"
          />
          {!isSizeOk && (
            <p className="text-xs text-destructive">Image is larger than the target size.</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground">Max Width (px)</label>
          <input 
            type="number"
            value={targetMaxWidth}
            onChange={(e) => setTargetMaxWidth(e.target.value ? Number(e.target.value) : '')}
            placeholder="e.g. 1920"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold focus:outline-none focus:border-primary"
          />
          {!isDimensionsOk && (
            <p className="text-xs text-destructive">Image is wider than the target width.</p>
          )}
        </div>
      </div>
    </div>
  );
}
