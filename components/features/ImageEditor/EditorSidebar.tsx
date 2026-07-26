"use client";

import { useEditorStore } from "./store";
import { Trash2 } from "lucide-react";

interface EditorSidebarProps {
  featureName: string;
  isStudioMode: boolean;
  onClear: () => void;
  toolsTabs: React.ReactNode;
  toolSettings: React.ReactNode;
  exportButton: React.ReactNode;
}

export function EditorSidebar({
  featureName,
  isStudioMode,
  onClear,
  toolsTabs,
  toolSettings,
  exportButton
}: EditorSidebarProps) {
  return (
    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col bg-card/60 backdrop-blur-xl border border-border rounded-3xl shadow-sm overflow-hidden h-auto lg:h-full">
      <div className="p-6 pb-2 flex-shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">
            {isStudioMode ? 'Studio Tools' : featureName}
          </h3>
          <button 
            onClick={onClear}
            className="p-1.5 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-lg transition-colors shadow-sm -mr-2 relative z-50"
            title="Clear Image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        {isStudioMode && toolsTabs}
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar px-6 pb-6 pt-2 space-y-6 min-h-0">
        {toolSettings}
      </div>

      <div className="flex-shrink-0 p-6 border-t border-border bg-card/40 backdrop-blur-xl z-10 mt-auto">
        {exportButton}
      </div>
    </div>
  );
}
