import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Crop } from 'react-image-crop';
import { generateUniqueId } from '@/src/utils/fileUtils';

export type EditorTool = 'crop' | 'resize' | 'rotate' | 'flip' | 'size-checker' | 'watermark' | 'text';

export type WatermarkPosition = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface TextItem {
  id: string;
  text: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  fontSize: number; // in pixels
  fontFamily: string;
  color: string;
  opacity: number; // 0-100
  shadow: boolean;
  shadowColor: string;
  alignment: 'left' | 'center' | 'right';
  backgroundColor: string;
  backgroundOpacity: number; // 0-100
  backgroundPadding: number; // px
  strokeColor: string;
  strokeWidth: number; // px
}

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
  watermarkX: number; // percentage (0-100)
  setWatermarkX: (x: number) => void;
  watermarkY: number; // percentage (0-100)
  setWatermarkY: (y: number) => void;

  // Text Tool State
  textItems: TextItem[];
  selectedTextId: string | null;
  addTextItem: () => void;
  updateTextItem: (id: string, updates: Partial<TextItem>) => void;
  removeTextItem: (id: string) => void;
  setSelectedTextId: (id: string | null) => void;

  exportFormat: 'original' | 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif' | 'image/svg+xml';
  setExportFormat: (format: 'original' | 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif' | 'image/svg+xml') => void;

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
  watermarkX: 85,
  watermarkY: 90,
  
  textItems: [] as TextItem[],
  selectedTextId: null as string | null,
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
  watermarkX: state.watermarkX,
  watermarkY: state.watermarkY,
  textItems: state.textItems.map(item => ({ ...item })), // deep clone items array
  selectedTextId: state.selectedTextId,
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
      setWatermarkX: (watermarkX) => set({ watermarkX }),
      setWatermarkY: (watermarkY) => set({ watermarkY }),
      
      // Text Actions
      addTextItem: () => set((state) => {
        const newItem: TextItem = {
          id: generateUniqueId(),
          text: 'Double click to edit',
          x: 50,
          y: 50,
          fontSize: 32,
          fontFamily: 'Inter',
          color: '#ffffff',
          opacity: 100,
          shadow: true,
          shadowColor: '#000000',
          alignment: 'center',
          backgroundColor: '#000000',
          backgroundOpacity: 0,
          backgroundPadding: 8,
          strokeColor: '#000000',
          strokeWidth: 0,
        };
        return {
          textItems: [...state.textItems, newItem],
          selectedTextId: newItem.id,
        };
      }),
      updateTextItem: (id, updates) => set((state) => ({
        textItems: state.textItems.map((item) => 
          item.id === id ? { ...item, ...updates } : item
        ),
      })),
      removeTextItem: (id) => set((state) => ({
        textItems: state.textItems.filter((item) => item.id !== id),
        selectedTextId: state.selectedTextId === id ? null : state.selectedTextId,
      })),
      setSelectedTextId: (selectedTextId) => set({ selectedTextId }),
      
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
