import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Crop } from 'react-image-crop';

export type EditorTool = 'crop' | 'resize' | 'rotate' | 'flip' | 'size-checker' | 'watermark';

export type WatermarkPosition = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface EditorState {
  activeTool: EditorTool;
  setActiveTool: (tool: EditorTool) => void;

  // Crop State
  crop: Crop | undefined;
  setCrop: (crop: Crop | undefined) => void;
  cropAspect: number | undefined;
  setCropAspect: (aspect: number | undefined) => void;

  // Transform State (Rotate/Flip)
  rotation: number;
  setRotation: (rotation: number | ((prev: number) => number)) => void;
  scaleX: number;
  setScaleX: (scaleX: number | ((prev: number) => number)) => void;
  scaleY: number;
  setScaleY: (scaleY: number | ((prev: number) => number)) => void;

  // Resize State
  resizeWidth: number | '';
  setResizeWidth: (width: number | '') => void;
  resizeHeight: number | '';
  setResizeHeight: (height: number | '') => void;
  maintainAspectRatio: boolean;
  setMaintainAspectRatio: (maintain: boolean) => void;

  // Watermark State
  watermarkType: 'text' | 'image';
  setWatermarkType: (type: 'text' | 'image') => void;
  watermarkText: string;
  setWatermarkText: (text: string) => void;
  watermarkImage: string | null; // object URL
  setWatermarkImage: (image: string | null) => void;
  watermarkOpacity: number;
  setWatermarkOpacity: (opacity: number) => void;
  watermarkSize: number; // percentage of image size
  setWatermarkSize: (size: number) => void;
  watermarkPosition: WatermarkPosition;
  setWatermarkPosition: (position: WatermarkPosition) => void;
  watermarkPadding: number;
  setWatermarkPadding: (padding: number) => void;
  watermarkColor: string;
  setWatermarkColor: (color: string) => void;
  watermarkRepeated: boolean;
  setWatermarkRepeated: (repeated: boolean) => void;

  exportFormat: 'original' | 'image/png' | 'image/jpeg' | 'image/webp';
  setExportFormat: (format: 'original' | 'image/png' | 'image/jpeg' | 'image/webp') => void;

  // Reset
  resetEditor: () => void;

  // History
  past: Partial<EditorState>[];
  future: Partial<EditorState>[];
  commitHistory: () => void;
  undo: () => void;
  redo: () => void;
}

const initialState = {
  activeTool: 'crop' as EditorTool,
  crop: undefined,
  cropAspect: undefined,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  resizeWidth: '' as number | '',
  resizeHeight: '' as number | '',
  maintainAspectRatio: true,
  
  watermarkType: 'text' as const,
  watermarkText: 'Parvion',
  watermarkImage: null,
  watermarkOpacity: 50,
  watermarkSize: 20,
  watermarkPosition: 'bottom-right' as WatermarkPosition,
  watermarkPadding: 5,
  watermarkColor: '#ffffff',
  watermarkRepeated: false,
  exportFormat: 'original' as const,
};

const extractHistoryState = (state: EditorState) => ({
  crop: state.crop,
  cropAspect: state.cropAspect,
  rotation: state.rotation,
  scaleX: state.scaleX,
  scaleY: state.scaleY,
  resizeWidth: state.resizeWidth,
  resizeHeight: state.resizeHeight,
  maintainAspectRatio: state.maintainAspectRatio,
  watermarkType: state.watermarkType,
  watermarkText: state.watermarkText,
  watermarkOpacity: state.watermarkOpacity,
  watermarkSize: state.watermarkSize,
  watermarkPosition: state.watermarkPosition,
  watermarkPadding: state.watermarkPadding,
  watermarkColor: state.watermarkColor,
  watermarkRepeated: state.watermarkRepeated,
});

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      ...initialState,
      past: [],
      future: [],
      
      setActiveTool: (activeTool) => set({ activeTool }),
      
      setCrop: (crop) => set({ crop }),
      setCropAspect: (cropAspect) => set({ cropAspect }),
      
      setRotation: (updater) => set((state) => ({ 
        rotation: typeof updater === 'function' ? updater(state.rotation) : updater 
      })),
      setScaleX: (updater) => set((state) => ({ 
        scaleX: typeof updater === 'function' ? updater(state.scaleX) : updater 
      })),
      setScaleY: (updater) => set((state) => ({ 
        scaleY: typeof updater === 'function' ? updater(state.scaleY) : updater 
      })),

      setResizeWidth: (resizeWidth) => set({ resizeWidth }),
      setResizeHeight: (resizeHeight) => set({ resizeHeight }),
      setMaintainAspectRatio: (maintainAspectRatio) => set({ maintainAspectRatio }),

      setWatermarkType: (watermarkType) => set({ watermarkType }),
      setWatermarkText: (watermarkText) => set({ watermarkText }),
      setWatermarkImage: (watermarkImage) => set({ watermarkImage }),
      setWatermarkOpacity: (watermarkOpacity) => set({ watermarkOpacity }),
      setWatermarkSize: (watermarkSize) => set({ watermarkSize }),
      setWatermarkPosition: (watermarkPosition) => set({ watermarkPosition }),
      setWatermarkPadding: (watermarkPadding) => set({ watermarkPadding }),
      setWatermarkColor: (watermarkColor) => set({ watermarkColor }),
      setWatermarkRepeated: (watermarkRepeated) => set({ watermarkRepeated }),
      
      setExportFormat: (exportFormat) => set({ exportFormat }),

      commitHistory: () => set((state) => ({
        past: [...state.past, extractHistoryState(state)],
        future: []
      })),

      undo: () => set((state) => {
        if (state.past.length === 0) return state;
        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, -1);
        return {
          ...previous,
          past: newPast,
          future: [extractHistoryState(state), ...state.future]
        };
      }),

      redo: () => set((state) => {
        if (state.future.length === 0) return state;
        const next = state.future[0];
        const newFuture = state.future.slice(1);
        return {
          ...next,
          past: [...state.past, extractHistoryState(state)],
          future: newFuture
        };
      }),

      resetEditor: () => set({ ...initialState, past: [], future: [] }),
    }),
    {
      name: 'parvion-editor-storage',
      partialize: (state) => {
        // Don't persist object URLs or history stacks
        const { watermarkImage, past, future, ...rest } = state;
        return rest;
      }
    }
  )
);
