import { useRef, useEffect } from 'react';
import { ToolState } from './types';

export function useViewportTools(): ToolState {
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const MOUSE_SENSITIVITY = 0.01;

  useEffect(() => {
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return {
    isDraggingRef,
    lastPosRef,
    MOUSE_SENSITIVITY
  };
}
