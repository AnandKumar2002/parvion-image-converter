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
    <div className="lg:col-span-5 flex flex-col bg-card border border-border/80 rounded-3xl overflow-hidden lg:h-[600px] shadow-md w-full">
      <div className="p-6 pb-2 border-b border-border/40 bg-card/40 backdrop-blur-xl z-10 flex-shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">
            {isStudioMode ? 'Studio Tools' : featureName}
          </h3>
          <button 
            onClick={onClear}
            className="p-1.5 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-lg transition-colors shadow-sm cursor-pointer"
            title="Clear Image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        {isStudioMode && toolsTabs}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 text-left">
        {toolSettings}
      </div>

      <div className="flex-shrink-0 p-6 border-t border-border bg-card/40 backdrop-blur-xl z-10 mt-auto flex flex-col gap-4 w-full">
        {exportButton}
      </div>
    </div>
  );
}
