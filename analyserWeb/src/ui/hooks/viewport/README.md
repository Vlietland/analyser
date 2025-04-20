# Viewport Hooks

This directory contains a set of React hooks that handle different aspects of the 3D viewport functionality. Each hook is responsible for a specific feature, making the code more modular, testable, and maintainable.

## Directory Structure

```
viewport/
├── types.ts                # Common types used across hooks
├── useViewportTools.ts     # Common tools and utilities for all viewport interactions
├── useViewportSetup.ts     # Initial setup of the scene, camera, renderer, and controls
├── useZoomTool.ts          # Zoom functionality
├── useShiftTool.ts         # Shift/pan functionality
├── useZFactorTool.ts       # Z-factor adjustment functionality
├── useRotateTool.ts        # Rotation functionality
├── useRenderSurface.ts     # Surface rendering
└── index.ts                # Exports all hooks
```

## Usage

Import the hooks you need in your component:

```tsx
import {
  useViewportTools,
  useViewportSetup,
  useZoomTool,
  useShiftTool,
  useZFactorTool,
  useRotateTool,
  useRenderSurface
} from './hooks/viewport';

function MyViewportComponent({ 
  gridData, 
  viewState, 
  activeTool,
  currentSampleRange,
  onSampleRangeChange,
  onViewStateChange
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Set up common tool state
  const toolState = useViewportTools();
  
  // Set up the viewport
  const { rendererRef } = useViewportSetup(canvasRef, viewState);
  
  // Set up individual tools
  useZoomTool(canvasRef, rendererRef, toolState, activeTool, currentSampleRange, onSampleRangeChange, onViewStateChange);
  useShiftTool(canvasRef, rendererRef, toolState, activeTool, currentSampleRange, onSampleRangeChange, onViewStateChange);
  useZFactorTool(canvasRef, rendererRef, toolState, activeTool, viewState, onViewStateChange);
  useRotateTool(rendererRef, activeTool, onViewStateChange);
  
  // Handle rendering
  const { meshRef, zCenterRef } = useRenderSurface(rendererRef, gridData, viewState);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
```

## Testing

Each hook can be tested independently. Here's an example of how to test the `useZoomTool` hook:

```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useZoomTool } from './hooks/viewport';

// Mock dependencies
jest.mock('../core/transform/transformEngine', () => ({
  calculateZoomFactor: jest.fn(),
  applyZoomToRange: jest.fn()
}));

jest.mock('../core/grid/sampleRange', () => ({
  validateRange: jest.fn()
}));

describe('useZoomTool', () => {
  // Setup mocks and test data
  
  it('should handle mouse zoom correctly', () => {
    // Render the hook
    const { result } = renderHook(() => useZoomTool(
      mockCanvasRef,
      mockRendererRef,
      mockToolState,
      'zoom',
      mockSampleRange,
      mockOnSampleRangeChange,
      mockOnViewStateChange
    ));

    // Simulate mouse down
    act(() => {
      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
      mockCanvasRef.current.dispatchEvent(mouseDownEvent);
    });

    // Simulate mouse move
    act(() => {
      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 110 });
      window.dispatchEvent(mouseMoveEvent);
    });

    // Assert expected behavior
    expect(transformEngine.calculateZoomFactor).toHaveBeenCalled();
    expect(transformEngine.applyZoomToRange).toHaveBeenCalled();
    expect(mockOnSampleRangeChange).toHaveBeenCalled();
    expect(mockOnViewStateChange).toHaveBeenCalled();
  });
});
```

## Benefits of This Approach

1. **Separation of Concerns**: Each hook has a single responsibility
2. **Testability**: Each feature can be tested in isolation
3. **Maintainability**: Easier to understand and modify individual features
4. **Reusability**: Hooks can be reused in other components if needed
5. **Scalability**: New tools can be added without modifying existing code

## Dependencies

To run the tests, you'll need to install the following packages:

```bash
npm install --save-dev @testing-library/react-hooks @testing-library/react @types/jest
```
