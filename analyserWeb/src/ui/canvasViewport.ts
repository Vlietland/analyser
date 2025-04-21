import React, { useRef } from 'react';
import { SurfaceGrid, SampleRange } from '../core/types';
import { ViewState } from '../core/transform/viewState';
import {
  useViewportTools,
  useViewportSetup,
  useZoomTool,
  useShiftTool,
  useZFactorTool,
  useRotateTool,
  useRenderSurface
} from './hooks';

interface CanvasViewportProps {
  gridData: SurfaceGrid | null;
  viewState: ViewState;
  activeTool: string;
  currentSampleRange?: SampleRange;
  onSampleRangeChange?: (newRange: SampleRange) => void;
  onViewStateChange?: (updates: Partial<ViewState>) => void;
}

function CanvasViewport({ 
  gridData, 
  viewState, 
  activeTool,
  currentSampleRange,
  onSampleRangeChange,
  onViewStateChange
}: CanvasViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Set up common tool state
  const toolState = useViewportTools();
  
  // Set up the viewport
  const { rendererRef } = useViewportSetup(canvasRef, viewState);
  
  // Handle rendering to get zCenterRef
  const { meshRef, zCenterRef } = useRenderSurface(rendererRef, gridData, viewState);
  
  // Set up individual tools
  useZoomTool(canvasRef, rendererRef, toolState, activeTool, currentSampleRange, onSampleRangeChange, onViewStateChange);
  useShiftTool(canvasRef, rendererRef, toolState, activeTool, currentSampleRange, onSampleRangeChange, onViewStateChange);
  useZFactorTool(canvasRef, rendererRef, toolState, activeTool, viewState, onViewStateChange);
  useRotateTool(rendererRef, activeTool, onViewStateChange);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}

export default CanvasViewport;
