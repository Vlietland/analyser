import { useEffect } from 'react';
import { SampleRange } from '../../../core/types';
import { ViewState } from '../../../core/transform/viewState';
import * as transformEngine from '../../../core/transform/transformEngine';
import { validateRange } from '../../../core/grid/sampleRange';
import { RendererRefs, ToolState } from './types';

export function useShiftTool(
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
    if (activeTool !== 'shift') return;
    const canvas = canvasRef.current;
    if (!canvas || !rendererRef.current || !currentSampleRange || !onSampleRangeChange || !onViewStateChange) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - lastPosRef.current.x;
      const deltaY = e.clientY - lastPosRef.current.y;
      
      // Use transformEngine functions
      const { shiftX, shiftY } = transformEngine.calculateShift(
        currentSampleRange, 
        deltaX, 
        deltaY, 
        MOUSE_SENSITIVITY
      );
      const newRange = transformEngine.applyShiftToRange(currentSampleRange, shiftX, shiftY);

      if (validateRange(newRange)) {
        onSampleRangeChange(newRange);
        if (rendererRef.current) {
          const { controls, camera } = rendererRef.current;
          const currentTarget = controls.target.clone();
          
          // Get the zCenter value from the scene userData
          const zCenter = rendererRef.current.scene.userData.zCenter || 0;
          
          // Update controls target, but keep the z-coordinate at zCenter
          controls.target.set(
            currentTarget.x + shiftX,
            currentTarget.y + shiftY,
            zCenter // Use zCenter instead of currentTarget.z
          );
          
          // Update camera to look at new target
          camera.lookAt(controls.target);
          controls.update();
          
          // Update viewState with new target position
          onViewStateChange({
            targetX: controls.target.x,
            targetY: controls.target.y,
            targetZ: zCenter // Use zCenter instead of controls.target.z
          });
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
