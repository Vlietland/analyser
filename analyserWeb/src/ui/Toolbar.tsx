import React from 'react';
import { ViewState } from '../core/transform/viewState';

interface ToolbarProps {
  currentViewState: ViewState;
  onViewStateChange: (updates: Partial<ViewState>) => void;
}

const ROTATION_STEP = Math.PI / 18; // 10 degrees
const ZOOM_STEP = 1.1; // Multiplicative zoom
const Z_FACTOR_STEP = 0.1; // Additive z-scale
const GRID_ZOOM_FACTOR = 0.8; // Factor to zoom in/out grid range

function Toolbar({ currentViewState, onViewStateChange }: ToolbarProps) {
  const handleCameraZoom = (factor: number) => {
    onViewStateChange({ zoomCamera: currentViewState.zoomCamera * factor });
  };
  const handleZFactor = (delta: number) => {
    onViewStateChange({ zFactor: currentViewState.zFactor + delta });
  };
  const handleGridZoomIn = () => {
    console.log('Grid zoom in clicked - will decrease sample range');
  };
  const handleGridZoomOut = () => {
    console.log('Grid zoom out clicked - will increase sample range');
  };

  return (
    <div style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
      <button onClick={() => handleZFactor(Z_FACTOR_STEP)} title="Increase Z-Factor">Zfactor+</button>
      <button onClick={() => handleZFactor(-Z_FACTOR_STEP)} title="Decrease Z-Factor">Zfactor-</button>
      <button onClick={() => handleCameraZoom(ZOOM_STEP)} title="Zoom In Camera">Camera+</button>
      <button onClick={() => handleCameraZoom(1 / ZOOM_STEP)} title="Zoom Out Camera">Camera-</button>
      <button onClick={() => handleGridZoomIn} title="Zoom In Domain">Zoom+</button>
      <button onClick={() => handleGridZoomOut} title="Zoom Out Domain">Zoom-</button>
    </div>
  );
}

export default Toolbar;
