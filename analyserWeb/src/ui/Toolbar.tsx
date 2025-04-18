import React from 'react';
import { ViewState } from '../core/transform/viewState';

interface ToolbarProps {
  currentViewState: ViewState;
  onViewStateChange: (updates: Partial<ViewState>) => void;
}

const ROTATION_STEP = Math.PI / 18; // 10 degrees
const ZOOM_STEP = 1.1; // Multiplicative zoom
const Z_FACTOR_STEP = 0.1; // Additive z-scale

function Toolbar({ currentViewState, onViewStateChange }: ToolbarProps) {
  const handleZoom = (factor: number) => {
    onViewStateChange({ zoomCamera: currentViewState.zoomCamera * factor });
  };
  const handleZFactor = (delta: number) => {
    onViewStateChange({ zFactor: currentViewState.zFactor + delta });
  };

  return (
    <div style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
      <button onClick={() => handleZFactor(Z_FACTOR_STEP)} title="Increase Z-Factor">Zfactor+</button>
      <button onClick={() => handleZFactor(-Z_FACTOR_STEP)} title="Decrease Z-Factor">Zfactor-</button>
      <button onClick={() => handleZoom(ZOOM_STEP)} title="Zoom In Camera">Camera+</button>
      <button onClick={() => handleZoom(1 / ZOOM_STEP)} title="Zoom Out Camera">Camera-</button>
    </div>
  );
}

export default Toolbar;
