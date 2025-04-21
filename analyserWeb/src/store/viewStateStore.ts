import { create } from 'zustand';
import * as THREE from 'three';
import * as transformEngine from '../core/transform/transformEngine';
import { validateRange, DEFAULT_SAMPLE_RANGE } from '../core/grid/sampleRange';
import { SampleRange } from '../core/types';

const MOUSE_SENSITIVITY = 0.01;

export interface ViewStateStore {
  zoomCamera: number;
  rotationX: number;
  rotationZ: number;
  zFactor: number;
  targetX: number;
  targetY: number;
  targetZ: number;

  activeTool: string;
  currentSampleRange: SampleRange;

  setViewState: (updates: Partial<ViewStateStore>) => void;
  setActiveTool: (tool: string) => void;
  setSampleRange: (range: SampleRange) => void;

  handleZoom: (deltaY: number) => void;
  handleShift: (deltaX: number, deltaY: number) => void;
  handleRotation: (rotationX: number, rotationZ: number) => void;
  handleZFactor: (delta: number) => void;

  getCameraPosition: () => THREE.Vector3;

  getViewState: () => {
    zoomCamera: number;
    rotationX: number;
    rotationZ: number;
    zFactor: number;
    targetX: number;
    targetY: number;
    targetZ: number;
  };  
}

export const useViewStateStore = create<ViewStateStore>((set, get) => ({
  zoomCamera: 0.05,
  rotationX: 0.78,
  rotationZ: 3.92,
  zFactor: 1.0,
  targetX: 0,
  targetY: 0,
  targetZ: 0,

  activeTool: 'rotate',
  currentSampleRange: DEFAULT_SAMPLE_RANGE,

  setViewState: (updates) => set((state) => ({ ...state, ...updates })),

  setActiveTool: (tool) => set({ activeTool: tool }),

  setSampleRange: (range) => set({ currentSampleRange: range }),

  handleZoom: (deltaY) => {
    const { currentSampleRange } = get();
    const zoomFactor = transformEngine.calculateZoomFactor(deltaY, MOUSE_SENSITIVITY);
    const newRange = transformEngine.applyZoomToRange(currentSampleRange, zoomFactor);

    if (validateRange(newRange)) {
      set({ currentSampleRange: newRange });
    }
  },

  handleShift: (deltaX, deltaY) => {
    const { currentSampleRange, targetX, targetY } = get();
    const { shiftX, shiftY } = transformEngine.calculateShift(currentSampleRange, deltaX, deltaY, MOUSE_SENSITIVITY);
    const newRange = transformEngine.applyShiftToRange(currentSampleRange, shiftX, shiftY);

    if (validateRange(newRange)) {
      set({
        currentSampleRange: newRange,
        targetX: targetX + shiftX,
        targetY: targetY + shiftY
      });
    }
  },

  handleRotation: (rotationX, rotationZ) => {
    set({ rotationX, rotationZ });
  },

  handleZFactor: (delta) => {
    const { zFactor } = get();
    const newZFactor = zFactor + delta * MOUSE_SENSITIVITY;
    if (newZFactor > 0.1) {
      set({ zFactor: newZFactor });
    }
  },

  getCameraPosition: () => {
    const { rotationX, rotationZ } = get();
    const distance = 1000;
  
    const x = distance * Math.cos(rotationZ) * Math.cos(rotationX);
    const y = distance * Math.sin(rotationZ) * Math.cos(rotationX);
    const z = distance * Math.sin(rotationX);
  
    return new THREE.Vector3(x, y, z);
  }, 
  
  getViewState: () => {
    const { zoomCamera, rotationX, rotationZ, zFactor, targetX, targetY, targetZ } = get();
    const viewState = { zoomCamera, rotationX, rotationZ, zFactor, targetX, targetY, targetZ };
    console.log('getViewState:', viewState);  // Log the state when it's fetched
    return viewState;
  }   
}));
