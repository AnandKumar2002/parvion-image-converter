import { useEditorStore } from "../store";

export function WatermarkTool() {
  const {
    watermarkType, setWatermarkType,
    watermarkText, setWatermarkText,
    watermarkOpacity, setWatermarkOpacity,
    watermarkSize, setWatermarkSize,
    watermarkPosition, setWatermarkPosition,
    watermarkPadding, setWatermarkPadding,
    watermarkColor, setWatermarkColor,
    watermarkImage, setWatermarkImage,
    watermarkRepeated, setWatermarkRepeated,
  } = useEditorStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (watermarkImage) URL.revokeObjectURL(watermarkImage);
      setWatermarkImage(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    if (watermarkImage) URL.revokeObjectURL(watermarkImage);
    setWatermarkImage(null);
  };

  return (
    <div className="space-y-6">
      <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Watermark Options</h4>
      
      {/* Type Selection */}
      <div className="flex gap-2 p-1 bg-background rounded-lg border border-border">
        <button
          onClick={() => setWatermarkType('text')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${watermarkType === 'text' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Text
        </button>
        <button
          onClick={() => setWatermarkType('image')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${watermarkType === 'image' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Image
        </button>
      </div>

      {/* Text Input & Color */}
      {watermarkType === 'text' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground">Watermark Text</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold focus:outline-none focus:border-primary"
              placeholder="Enter text..."
            />
            <input
              type="color"
              value={watermarkColor}
              onChange={(e) => setWatermarkColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 shrink-0"
              title="Text Color"
            />
          </div>
        </div>
      )}

      {/* Image Input */}
      {watermarkType === 'image' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground">Watermark Image</label>
          {watermarkImage ? (
            <div className="flex items-center gap-3 bg-background/50 border border-border rounded-lg p-2">
              <img src={watermarkImage} alt="Watermark" className="h-10 w-auto object-contain rounded" />
              <button 
                onClick={clearImage}
                className="ml-auto px-3 py-1 text-xs font-bold bg-destructive/10 text-destructive rounded-md hover:bg-destructive hover:text-white transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleImageUpload}
              className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
          )}
        </div>
      )}

      {/* Position Grid */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-muted-foreground">Position</label>
          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
            <input 
              type="checkbox" 
              checked={watermarkRepeated}
              onChange={(e) => setWatermarkRepeated(e.target.checked)}
              className="accent-primary w-4 h-4 rounded border-border"
            />
            Tile Watermark
          </label>
        </div>
        <div className={`grid grid-cols-3 gap-1 bg-background/50 p-2 rounded-xl border border-border aspect-square w-32 mx-auto transition-opacity ${watermarkRepeated ? 'opacity-50 pointer-events-none' : ''}`}>
          {['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'].map((pos) => (
            <button
              key={pos}
              onClick={() => setWatermarkPosition(pos as any)}
              className={`rounded-md transition-colors border ${watermarkPosition === pos ? 'bg-primary border-primary' : 'bg-background border-border hover:bg-primary/20'}`}
              title={pos.replace('-', ' ')}
            />
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-muted-foreground">Opacity</label>
            <span className="text-xs font-bold">{watermarkOpacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={watermarkOpacity}
            onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-muted-foreground">Size</label>
            <span className="text-xs font-bold">{watermarkSize}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={watermarkSize}
            onChange={(e) => setWatermarkSize(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-muted-foreground">Padding</label>
            <span className="text-xs font-bold">{watermarkPadding}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={watermarkPadding}
            onChange={(e) => setWatermarkPadding(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>
    </div>
  );
}
