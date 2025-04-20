import { renderHook, act } from '@testing-library/react-hooks';
import { useZoomTool } from '../../../../src/ui/hooks/viewport';
import { SampleRange } from '../../../../src/core/types';
import { ViewState } from '../../../../src/core/transform/viewState';
import * as transformEngine from '../../../../src/core/transform/transformEngine';
import { validateRange } from '../../../../src/core/grid/sampleRange';

// Mock dependencies
jest.mock('../../../../src/core/transform/transformEngine', () => ({
  calculateZoomFactor: jest.fn(),
  applyZoomToRange: jest.fn()
}));

jest.mock('../../../../src/core/grid/sampleRange', () => ({
  validateRange: jest.fn()
}));

describe('useZoomTool', () => {
  const mockCanvasRef = { current: document.createElement('canvas') };
  const mockControls = {
    update: jest.fn(),
    target: { x: 0, y: 0, z: 0 }
  };
  const mockRendererRef = {
    current: {
      controls: mockControls,
      scene: {},
      camera: {},
      renderer: {},
      gizmoResources: {}
    }
  };
  const mockToolState = {
    isDraggingRef: { current: false },
    lastPosRef: { current: { x: 0, y: 0 } },
    MOUSE_SENSITIVITY: 0.01
  };
  const mockSampleRange: SampleRange = {
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10
  };
  const mockOnSampleRangeChange = jest.fn();
  const mockOnViewStateChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup mocks
    (transformEngine.calculateZoomFactor as jest.Mock).mockReturnValue(1.1);
    (transformEngine.applyZoomToRange as jest.Mock).mockReturnValue({
      xMin: -11,
      xMax: 11,
      yMin: -11,
      yMax: 11
    });
    (validateRange as jest.Mock).mockReturnValue(true);
  });

  it('should not add event listeners when activeTool is not zoom', () => {
    const addEventListenerSpy = jest.spyOn(mockCanvasRef.current, 'addEventListener');
    const windowAddEventListenerSpy = jest.spyOn(window, 'addEventListener');

    renderHook(() => useZoomTool(
      mockCanvasRef,
      mockRendererRef,
      mockToolState,
      'rotate', // Not 'zoom'
      mockSampleRange,
      mockOnSampleRangeChange,
      mockOnViewStateChange
    ));

    expect(addEventListenerSpy).not.toHaveBeenCalled();
    expect(windowAddEventListenerSpy).not.toHaveBeenCalled();
  });

  it('should add event listeners when activeTool is zoom', () => {
    const addEventListenerSpy = jest.spyOn(mockCanvasRef.current, 'addEventListener');
    const windowAddEventListenerSpy = jest.spyOn(window, 'addEventListener');

    renderHook(() => useZoomTool(
      mockCanvasRef,
      mockRendererRef,
      mockToolState,
      'zoom',
      mockSampleRange,
      mockOnSampleRangeChange,
      mockOnViewStateChange
    ));

    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(windowAddEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  it('should handle mouse zoom correctly', () => {
    // Setup
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

    expect(mockToolState.isDraggingRef.current).toBe(true);
    expect(mockToolState.lastPosRef.current).toEqual({ x: 100, y: 100 });

    // Simulate mouse move
    act(() => {
      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 110 });
      window.dispatchEvent(mouseMoveEvent);
    });

    expect(transformEngine.calculateZoomFactor).toHaveBeenCalledWith(10, 0.01);
    expect(transformEngine.applyZoomToRange).toHaveBeenCalledWith(mockSampleRange, 1.1);
    expect(validateRange).toHaveBeenCalled();
    expect(mockOnSampleRangeChange).toHaveBeenCalled();
    expect(mockOnViewStateChange).toHaveBeenCalledWith({
      targetX: 0,
      targetY: 0,
      targetZ: 0
    });
    expect(mockControls.update).toHaveBeenCalled();
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(mockCanvasRef.current, 'removeEventListener');
    const windowRemoveEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useZoomTool(
      mockCanvasRef,
      mockRendererRef,
      mockToolState,
      'zoom',
      mockSampleRange,
      mockOnSampleRangeChange,
      mockOnViewStateChange
    ));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });
});
