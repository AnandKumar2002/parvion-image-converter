import { useEffect } from "react";
import { useEditorStore, TextItem } from "../store";
import { Plus, Trash2, AlignLeft, AlignCenter, AlignRight, Type } from "lucide-react";

const FONT_FAMILIES = [
  { name: "Inter (Sans-Serif)", value: "Inter" },
  { name: "Arial (Classic)", value: "Arial" },
  { name: "Georgia (Serif)", value: "Georgia" },
  { name: "Courier New (Monospace)", value: "Courier New" },
  { name: "Times New Roman", value: "Times New Roman" },
  { name: "Impact (Bold Headline)", value: "Impact" },
  { name: "Bebas Neue (Bold Tall)", value: "Bebas Neue" },
  { name: "Lobster (Playful)", value: "Lobster" },
  { name: "Montserrat (Modern)", value: "Montserrat" },
  { name: "Pacifico (Script)", value: "Pacifico" },
  { name: "Playfair Display (Elegant)", value: "Playfair Display" },
  { name: "Outfit (Geometric)", value: "Outfit" },
];

export function TextTool() {
  const {
    textItems,
    selectedTextId,
    addTextItem,
    updateTextItem,
    removeTextItem,
    setSelectedTextId,
    commitHistory,
  } = useEditorStore();

  // Dynamically load Google Web Fonts
  useEffect(() => {
    const linkId = "google-fonts-text-tool";
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lobster&family=Montserrat:wght@400;700&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@400;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const selectedItem = textItems.find((item) => item.id === selectedTextId);

  const handleAddText = () => {
    commitHistory();
    addTextItem();
  };

  const handleUpdate = (updates: Partial<TextItem>) => {
    if (!selectedTextId) return;
    updateTextItem(selectedTextId, updates);
  };

  const handleUpdateComplete = () => {
    commitHistory();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Text Layers</h4>
        <button
          onClick={handleAddText}
          className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Text
        </button>
      </div>

      {/* Layer List / Selector */}
      {textItems.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground">Active Layers</label>
          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
            {textItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedTextId(item.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                  selectedTextId === item.id
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-background/50 border-border hover:bg-background text-foreground"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Type className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.text || "(Empty text)"}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    commitHistory();
                    removeTextItem(item.id);
                  }}
                  className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors"
                  title="Delete layer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedItem ? (
        <div className="space-y-4 border-t border-border/40 pt-4 animate-fade-in">
          {/* Text input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Text Content</label>
            <textarea
              value={selectedItem.text}
              onChange={(e) => handleUpdate({ text: e.target.value })}
              onBlur={handleUpdateComplete}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold text-xs focus:outline-none focus:border-primary resize-y min-h-[60px]"
              placeholder="Enter your caption..."
            />
          </div>

          {/* Font Family selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Font Family</label>
            <select
              value={selectedItem.fontFamily}
              onChange={(e) => {
                commitHistory();
                handleUpdate({ fontFamily: e.target.value });
              }}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold text-xs focus:outline-none focus:border-primary"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          {/* Alignment */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Alignment</label>
            <div className="flex gap-2 p-1 bg-background rounded-lg border border-border w-fit">
              {(["left", "center", "right"] as const).map((align) => {
                const Icon =
                  align === "left"
                    ? AlignLeft
                    : align === "center"
                    ? AlignCenter
                    : AlignRight;
                return (
                  <button
                    key={align}
                    onClick={() => {
                      commitHistory();
                      handleUpdate({ alignment: align });
                    }}
                    className={`p-1.5 rounded-md transition-colors ${
                      selectedItem.alignment === align
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    title={`Align ${align}`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Font Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={selectedItem.color}
                onChange={(e) => handleUpdate({ color: e.target.value })}
                onBlur={handleUpdateComplete}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 shrink-0"
                title="Choose Color"
              />
              <input
                type="text"
                value={selectedItem.color.toUpperCase()}
                onChange={(e) => handleUpdate({ color: e.target.value })}
                onBlur={handleUpdateComplete}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold text-xs focus:outline-none focus:border-primary"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          {/* Font Size slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground">Font Size</label>
              <span className="text-xs font-bold">{selectedItem.fontSize}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value={selectedItem.fontSize}
              onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
              onMouseUp={handleUpdateComplete}
              onTouchEnd={handleUpdateComplete}
              className="w-full accent-primary"
            />
          </div>

          {/* Text Highlight (Background) */}
          <div className="border-t border-border/40 pt-4 space-y-4">
            <h5 className="text-xs font-bold text-primary uppercase tracking-wider">Highlight Box</h5>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">Box Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={selectedItem.backgroundColor || "#000000"}
                  onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
                  onBlur={handleUpdateComplete}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 shrink-0"
                />
                <input
                  type="text"
                  value={(selectedItem.backgroundColor || "#000000").toUpperCase()}
                  onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
                  onBlur={handleUpdateComplete}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-muted-foreground">Box Opacity</label>
                <span className="text-xs font-bold">{selectedItem.backgroundOpacity || 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedItem.backgroundOpacity || 0}
                onChange={(e) => handleUpdate({ backgroundOpacity: Number(e.target.value) })}
                onMouseUp={handleUpdateComplete}
                onTouchEnd={handleUpdateComplete}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-muted-foreground">Box Padding</label>
                <span className="text-xs font-bold">{selectedItem.backgroundPadding || 8}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="32"
                value={selectedItem.backgroundPadding || 8}
                onChange={(e) => handleUpdate({ backgroundPadding: Number(e.target.value) })}
                onMouseUp={handleUpdateComplete}
                onTouchEnd={handleUpdateComplete}
                className="w-full accent-primary"
              />
            </div>
          </div>

          {/* Text Stroke / Border */}
          <div className="border-t border-border/40 pt-4 space-y-4">
            <h5 className="text-xs font-bold text-primary uppercase tracking-wider">Text Border (Stroke)</h5>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">Border Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={selectedItem.strokeColor || "#000000"}
                  onChange={(e) => handleUpdate({ strokeColor: e.target.value })}
                  onBlur={handleUpdateComplete}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 shrink-0"
                />
                <input
                  type="text"
                  value={(selectedItem.strokeColor || "#000000").toUpperCase()}
                  onChange={(e) => handleUpdate({ strokeColor: e.target.value })}
                  onBlur={handleUpdateComplete}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground font-bold text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-muted-foreground">Border Width</label>
                <span className="text-xs font-bold">{selectedItem.strokeWidth || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={selectedItem.strokeWidth || 0}
                onChange={(e) => handleUpdate({ strokeWidth: Number(e.target.value) })}
                onMouseUp={handleUpdateComplete}
                onTouchEnd={handleUpdateComplete}
                className="w-full accent-primary"
              />
            </div>
          </div>

          {/* Opacity slider */}
          <div className="border-t border-border/40 pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground">Overall Opacity</label>
              <span className="text-xs font-bold">{selectedItem.opacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedItem.opacity}
              onChange={(e) => handleUpdate({ opacity: Number(e.target.value) })}
              onMouseUp={handleUpdateComplete}
              onTouchEnd={handleUpdateComplete}
              className="w-full accent-primary"
            />
          </div>

          {/* Text Shadow */}
          <div className="flex items-center justify-between py-1">
            <label className="text-xs font-bold text-muted-foreground">Drop Shadow</label>
            <input
              type="checkbox"
              checked={selectedItem.shadow}
              onChange={(e) => {
                commitHistory();
                handleUpdate({ shadow: e.target.checked });
              }}
              className="accent-primary w-4 h-4 rounded border-border"
            />
          </div>

          {/* Delete Layer button */}
          <button
            onClick={() => {
              commitHistory();
              removeTextItem(selectedItem.id);
            }}
            className="w-full mt-2 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Text Layer
          </button>
        </div>
      ) : (
        textItems.length === 0 && (
          <div className="py-6 text-center text-muted-foreground text-xs border border-dashed border-border rounded-2xl bg-card/20">
            No text layers added yet. Click "Add Text" to start writing captions.
          </div>
        )
      )}
    </div>
  );
}
