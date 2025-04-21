import React, { useState } from 'react';
import { ViewState } from '../core/transform/viewState';
import { SampleRange } from '../core/types';
import { validateRange } from '../core/grid/sampleRange';

interface ToolbarProps {
  currentViewState: ViewState;
  onViewStateChange: (updates: Partial<ViewState>) => void;
  currentSampleRange: SampleRange;
  onSampleRangeChange: (newRange: SampleRange) => void;
  activeTool: string;
  onToolChange: (tool: string) => void;
}

const ROTATION_STEP = Math.PI / 18;
const ZOOM_STEP = 1.1;
const Z_FACTOR_STEP = 0.1;
const GRID_ZOOM_FACTOR = 0.8;
const MOUSE_SENSITIVITY = 0.01;

function Toolbar({ currentViewState, onViewStateChange, currentSampleRange, onSampleRangeChange, activeTool, onToolChange }: ToolbarProps) {
  const getButtonStyle = (tool: string) => ({
    backgroundColor: activeTool === tool ? '#4a90e2' : '#f0f0f0',
    color: activeTool === tool ? 'white' : 'black',
    padding: '5px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer'
  });

  return (
    <div style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
      <button 
        onClick={() => onToolChange('rotate')} 
        style={getButtonStyle('rotate')}
        title="Rotate View">
        Rotate
      </button>
      <button 
        onClick={() => onToolChange('shift')} 
        style={getButtonStyle('shift')}
        title="Shift View">
        Shift
      </button>
      <button 
        onClick={() => onToolChange('zoom')} 
        style={getButtonStyle('zoom')}
        title="Zoom View">
        Zoom
      </button>
      <button 
        onClick={() => onToolChange('zfactor')} 
        style={getButtonStyle('zfactor')}
        title="Adjust Z-Factor">
        Zfactor
      </button>
    </div>
  );
}

export default Toolbar;
