import { useEffect } from 'react';
import { ViewState } from '../../../core/transform/viewState';
import { RendererRefs, ToolState } from './types';

export function useZFactorTool(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  rendererRef: React.RefObject<RendererRefs | null>,
  toolState: ToolState,
  activeTool: string,
  viewState: ViewState,
  onViewStateChange?: (updates: Partial<ViewState>) => void
) {
  const { isDraggingRef, lastPosRef, MOUSE_SENSITIVITY } = toolState;

  useEffect(() => {
    if (activeTool !== 'zfactor') return;
    const canvas = canvasRef.current;
    if (!canvas || !rendererRef.current || !onViewStateChange) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaY = e.clientY - lastPosRef.current.y;
      const newZFactor = viewState.zFactor + (deltaY * MOUSE_SENSITIVITY);
      
      if (newZFactor > 0.1) {
        if (rendererRef.current) {
          const { controls } = rendererRef.current;
          
          // Get the zCenter value from the scene userData
          const zCenter = rendererRef.current.scene.userData.zCenter || 0;
          
          // Update viewState with new zFactor and current target position
          // Use zCenter for the z-coordinate to ensure the image stays centered
          onViewStateChange({ 
            zFactor: newZFactor,
            targetX: controls.target.x,
            targetY: controls.target.y,
            targetZ: zCenter // Use zCenter instead of controls.target.z
          });
          
          controls.update();
        } else {
          onViewStateChange({ zFactor: newZFactor });
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
  }, [activeTool, viewState.zFactor, onViewStateChange, canvasRef, rendererRef, isDraggingRef, lastPosRef, MOUSE_SENSITIVITY]);
}
