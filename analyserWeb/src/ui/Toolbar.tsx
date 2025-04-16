import React from 'react';
import { ViewState } from '../core/transform/viewState';

interface ToolbarProps {
  onViewStateChange: (updates: Partial<ViewState>) => void;
}

const ROTATION_STEP = 0.1;
const ZOOM_STEP = 0.1;
const Z_FACTOR_STEP = 0.1;

function Toolbar({ onViewStateChange }: ToolbarProps) {
  return (
    <div style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
      <button onClick={() => onViewStateChange({ rotationZ: ROTATION_STEP })} title="Rotate Left">{'<'}</button>
      <button onClick={() => onViewStateChange({ rotationZ: -ROTATION_STEP })} title="Rotate Right">{'>'}</button>
      <button onClick={() => onViewStateChange({ rotationX: ROTATION_STEP })} title="Rotate Up">{'^'}</button>
      <button onClick={() => onViewStateChange({ rotationX: -ROTATION_STEP })} title="Rotate Down">{'v'}</button>
      <button onClick={() => onViewStateChange({ zoom: ZOOM_STEP })} title="Zoom In">+</button>
      <button onClick={() => onViewStateChange({ zoom: -ZOOM_STEP })} title="Zoom Out">-</button>
      <button onClick={() => onViewStateChange({ zFactor: Z_FACTOR_STEP })} title="Increase Z-Factor">Z+</button>
      <button onClick={() => onViewStateChange({ zFactor: -Z_FACTOR_STEP })} title="Decrease Z-Factor">Z-</button>
    </div>
  );
}

export default Toolbar;
