import React from 'react';
import { ViewState } from '../core/transform/viewState';
import { SampleRange } from '../core/types';
import { validateRange } from '../core/grid/sampleRange';

interface ToolbarProps {
  currentViewState: ViewState;
  onViewStateChange: (updates: Partial<ViewState>) => void;
  currentSampleRange: SampleRange;
  onSampleRangeChange: (newRange: SampleRange) => void;
}

const ROTATION_STEP = Math.PI / 18; // 10 degrees
const ZOOM_STEP = 1.1; // Multiplicative zoom
const Z_FACTOR_STEP = 0.1; // Additive z-scale
const GRID_ZOOM_FACTOR = 0.8; // Factor to zoom in/out grid range

function Toolbar({ currentViewState, onViewStateChange, currentSampleRange, onSampleRangeChange }: ToolbarProps) {
  const handleCameraZoom = (factor: number) => {
    onViewStateChange({ zoomCamera: currentViewState.zoomCamera * factor });
  };
  const handleZFactor = (delta: number) => {
    onViewStateChange({ zFactor: currentViewState.zFactor + delta });
  };
  const handleGridZoom = (zoomIn: boolean) => {
    const factor = zoomIn ? GRID_ZOOM_FACTOR : 1 / GRID_ZOOM_FACTOR;
    const centerX = (currentSampleRange.xMax + currentSampleRange.xMin) / 2;
    const centerY = (currentSampleRange.yMax + currentSampleRange.yMin) / 2;
    const halfWidth = (currentSampleRange.xMax - currentSampleRange.xMin) * factor / 2;
    const halfHeight = (currentSampleRange.yMax - currentSampleRange.yMin) * factor / 2;
    
    const newRange = {
      xMin: centerX - halfWidth,
      xMax: centerX + halfWidth,
      yMin: centerY - halfHeight,
      yMax: centerY + halfHeight
    };
    
    if (validateRange(newRange)) onSampleRangeChange(newRange);
  };

  return (
    <div style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
      <button onClick={() => handleZFactor(Z_FACTOR_STEP)} title="Increase Z-Factor">Zfactor+</button>
      <button onClick={() => handleZFactor(-Z_FACTOR_STEP)} title="Decrease Z-Factor">Zfactor-</button>
      <button onClick={() => handleCameraZoom(ZOOM_STEP)} title="Zoom In Camera">CameraZoom+</button>
      <button onClick={() => handleCameraZoom(1 / ZOOM_STEP)} title="Zoom Out Camera">CameraZoom-</button>
      <button onClick={() => handleGridZoom(true)} title="Zoom In Domain">GridZoom+</button>
      <button onClick={() => handleGridZoom(false)} title="Zoom Out Domain">GridZoom-</button>
    </div>
  );
}

export default Toolbar;
