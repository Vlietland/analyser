import React, { useState, useEffect, useCallback } from 'react';
import FormulaInput from './FormulaInput';
import SampleSelector from './SampleSelector';
import CanvasViewport from './CanvasViewport';
import Toolbar from './Toolbar';
import { DEFAULT_SAMPLES, generateGrid } from '../core/grid/gridCalculator';
import { compileExpression } from '../core/evaluator/expressionEngine';
import { isCompiledExpression, isParseError, CompilationResult } from '../core/evaluator/expressionTypes';
import { SurfaceGrid, SampleRange } from '../core/types'; // Import SampleRange
import { DEFAULT_SAMPLE_RANGE } from '../core/grid/sampleRange'; // Import default range
import { ViewState, DEFAULT_VIEW_STATE, updateViewState, normalizeRotation } from '../core/transform/viewState';
import * as transformEngine from '../core/transform/transformEngine';
import { useDebounce } from './hooks/useDebounce';

function App() {
  const [expressionString, setExpressionString] = useState('x^2+y^2');
  const [samples, setSamples] = useState(DEFAULT_SAMPLES);
  const [compiledExpressionResult, setCompiledExpressionResult] = useState<CompilationResult | null>(null);
  const [gridData, setGridData] = useState<SurfaceGrid | null>(null);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [sampleRange, setSampleRange] = useState<SampleRange>(DEFAULT_SAMPLE_RANGE);
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string>('rotate');

  const debouncedExpressionString = useDebounce(expressionString, 500);

  useEffect(() => {
    const result = compileExpression(debouncedExpressionString);
    setCompiledExpressionResult(result);
    if (isParseError(result)) {
      setError(result.message);
      setGridData(null);
    } else {
      setError(null);
    }
  }, [debouncedExpressionString]);

  useEffect(() => {
    if (compiledExpressionResult && isCompiledExpression(compiledExpressionResult)) {
      const newGrid = generateGrid(compiledExpressionResult, sampleRange, samples);
      setGridData(newGrid);
    } else if (!compiledExpressionResult) {
        setGridData(null);
    }
  }, [compiledExpressionResult, samples, sampleRange]); // Add sampleRange dependency

  const handleViewStateChange = useCallback((updates: Partial<ViewState>) => {
    setViewState(current => {
      const intermediateState = updateViewState(current, updates);
      
      // Use transformEngine to normalize rotation angles
      let finalRotationX = intermediateState.rotationX;
      let finalRotationZ = intermediateState.rotationZ;
      
      if (finalRotationX !== undefined) {
        finalRotationX = normalizeRotation(finalRotationX);
      }
      
      if (finalRotationZ !== undefined) {
        finalRotationZ = normalizeRotation(finalRotationZ);
      }
      
      if (finalRotationX !== intermediateState.rotationX || finalRotationZ !== intermediateState.rotationZ) {
        return {
          ...intermediateState,
          rotationX: finalRotationX,
          rotationZ: finalRotationZ,
        };
      } else {
        return intermediateState;
      }
    });
  }, []);

  useEffect(() => {
    const idealZoom = transformEngine.calculateIdealCameraZoom(sampleRange);
    handleViewStateChange({ zoomCamera: idealZoom });
  }, [sampleRange, handleViewStateChange]);

  useEffect(() => {
    console.log('🔍 viewState updated:', viewState);
  }, [viewState]);

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <h1>Analyser Web</h1>
      {error && <div style={{ color: 'red', padding: '0 10px' }}>Error: {error}</div>}
      <div className="controls" style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
        <FormulaInput value={expressionString} onChange={setExpressionString} />
        <SampleSelector value={samples} onChange={setSamples} />
        <Toolbar 
          currentViewState={viewState} 
          onViewStateChange={handleViewStateChange}
          currentSampleRange={sampleRange}
          onSampleRangeChange={setSampleRange}
          activeTool={activeTool}
          onToolChange={setActiveTool}
        />
        <div style={{ marginLeft: 'auto', fontSize: '0.9em', color: '#555' }}>
          <div>X: [{sampleRange.xMin.toFixed(2)}, {sampleRange.xMax.toFixed(2)}] | Y: [{sampleRange.yMin.toFixed(2)}, {sampleRange.yMax.toFixed(2)}]</div>
          <div>
            RotX: {viewState.rotationX.toFixed(2)} | 
            RotZ: {viewState.rotationZ.toFixed(2)} | 
            ZFactor: {viewState.zFactor.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="viewport-container" style={{ flexGrow: 1, position: 'relative' }}>
        <CanvasViewport 
          gridData={gridData} 
          viewState={viewState} 
          activeTool={activeTool}
          currentSampleRange={sampleRange}
          onSampleRangeChange={setSampleRange}
          onViewStateChange={handleViewStateChange}
        />
      </div>
    </div>
  );
}

export default App;
