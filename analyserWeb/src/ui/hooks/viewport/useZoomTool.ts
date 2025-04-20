import { useEffect } from 'react';
import { SampleRange } from '../../../core/types';
import { ViewState } from '../../../core/transform/viewState';
import * as transformEngine from '../../../core/transform/transformEngine';
import { validateRange } from '../../../core/grid/sampleRange';
import { RendererRefs, ToolState } from './types';

export function useZoomTool(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  rendererRef: React.RefObject<RendererRefs | null>,
  toolState: ToolState,
  activeTool: string,
  currentSampleRange?: SampleRange,
  onSampleRangeChange?: (newRange: SampleRange) => void,
  onViewStateChange?: (updates: Partial<ViewState>) => void
) {
  const { isDraggingRef, lastPosRef, MOUSE_SENSITIVITY } = toolState;

  useEffect(() => {
    if (activeTool !== 'zoom') return;
    const canvas = canvasRef.current;
    if (!canvas || !rendererRef.current || !currentSampleRange || !onSampleRangeChange) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaY = e.clientY - lastPosRef.current.y;
      
      // Use transformEngine functions
      const zoomFactor = transformEngine.calculateZoomFactor(deltaY, MOUSE_SENSITIVITY);
      const newRange = transformEngine.applyZoomToRange(currentSampleRange, zoomFactor);

      if (validateRange(newRange)) {
        onSampleRangeChange(newRange);
        if (rendererRef.current && onViewStateChange) {
          const { controls } = rendererRef.current;
          
          // Get the zCenter value from the useRenderSurface hook
          // We need to use the actual zCenter value to ensure the image stays centered
          // at (zMax + zMin) / 2 even after releasing buttons
          const zCenter = rendererRef.current.scene.userData.zCenter || 0;
          
          // Update viewState with current target position and zCenter
          onViewStateChange({
            targetX: controls.target.x,
            targetY: controls.target.y,
            targetZ: zCenter // Use zCenter instead of controls.target.z
          });
          
          controls.update();
        }
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeTool, currentSampleRange, onSampleRangeChange, onViewStateChange, canvasRef, rendererRef, isDraggingRef, lastPosRef, MOUSE_SENSITIVITY]);
}
