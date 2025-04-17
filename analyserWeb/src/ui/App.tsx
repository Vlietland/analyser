import React, { useState, useEffect, useCallback } from 'react';
import FormulaInput from './FormulaInput';
import SampleSelector from './SampleSelector';
import CanvasViewport from './CanvasViewport';
import Toolbar from './Toolbar';
import { DEFAULT_SAMPLES, generateGrid } from '../core/grid/gridCalculator';
import { compileExpression } from '../core/evaluator/expressionEngine'; // isCompiledExpression/CompilationResult moved
import { isCompiledExpression, isParseError, CompilationResult } from '../core/evaluator/expressionTypes'; // Import from correct file
import { SurfaceGrid } from '../core/types';
import { ViewState, DEFAULT_VIEW_STATE, updateViewState } from '../core/transform/viewState';
import { useDebounce } from './hooks/useDebounce'; // Correct path

function App() {
  const [expressionString, setExpressionString] = useState('x^2+y^2');
  const [samples, setSamples] = useState(DEFAULT_SAMPLES);
  const [compiledExpressionResult, setCompiledExpressionResult] = useState<CompilationResult | null>(null);
  const [gridData, setGridData] = useState<SurfaceGrid | null>(null);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [error, setError] = useState<string | null>(null);

  const debouncedExpressionString = useDebounce(expressionString, 500); // Debounce input

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
      const newGrid = generateGrid(compiledExpressionResult, undefined, samples); // Use default range for now
      setGridData(newGrid);
    } else if (!compiledExpressionResult) {
        setGridData(null);
    }
  }, [compiledExpressionResult, samples]);

  useEffect(() => {
    console.log('🔍 viewState updated:', viewState);
  }, [viewState]);

  const handleViewStateChange = useCallback((updates: Partial<ViewState>) => {
    setViewState(current => updateViewState(current, updates));
  }, []);

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <h1>Analyser Web</h1>
      {error && <div style={{ color: 'red', padding: '0 10px' }}>Error: {error}</div>}
      <div className="controls" style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FormulaInput value={expressionString} onChange={setExpressionString} />
        <SampleSelector value={samples} onChange={setSamples} />
        <Toolbar currentViewState={viewState} onViewStateChange={handleViewStateChange} />
      </div>
      <div className="viewport-container" style={{ flexGrow: 1, position: 'relative' }}>
        <CanvasViewport gridData={gridData} viewState={viewState} />
      </div>
    </div>
  );
}

export default App;
