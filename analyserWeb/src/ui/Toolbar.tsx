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
  const handleRotateZ = (delta: number) => {
    onViewStateChange({ rotationZ: currentViewState.rotationZ + delta });
  };
  const handleRotateX = (delta: number) => {
    onViewStateChange({ rotationX: currentViewState.rotationX + delta });
  };
  const handleZoom = (factor: number) => {
    onViewStateChange({ zoom: currentViewState.zoom * factor });
  };
  const handleZFactor = (delta: number) => {
    onViewStateChange({ zFactor: currentViewState.zFactor + delta });
  };

  return (
    <div style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
      <button onClick={() => handleRotateZ(ROTATION_STEP)} title="Rotate Left">{'<'}</button>
      <button onClick={() => handleRotateZ(-ROTATION_STEP)} title="Rotate Right">{'>'}</button>
      <button onClick={() => handleRotateX(ROTATION_STEP)} title="Rotate Up">{'^'}</button>
      <button onClick={() => handleRotateX(-ROTATION_STEP)} title="Rotate Down">{'v'}</button>
      <button onClick={() => handleZoom(ZOOM_STEP)} title="Zoom In">+</button>
      <button onClick={() => handleZoom(1 / ZOOM_STEP)} title="Zoom Out">-</button>
      <button onClick={() => handleZFactor(Z_FACTOR_STEP)} title="Increase Z-Factor">Z+</button>
      <button onClick={() => handleZFactor(-Z_FACTOR_STEP)} title="Decrease Z-Factor">Z-</button>
    </div>
  );
}

export default Toolbar;
