import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ViewState } from '../../../core/transform/viewState';
import { buildScene } from '../../../renderer/sceneBuilder';
import { setupRenderer } from '../../../renderer/rendererState';
import { CleanupFunction, RendererRefs } from './types';

export function useViewportSetup(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  viewState: ViewState
) {
  const rendererRef = useRef<RendererRefs | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const cleanupRef = useRef<CleanupFunction | null>(null);
  const zCenterRef = useRef<number>(0);

  useEffect(() => {
    let localCleanup: CleanupFunction | null = null;
    if (canvasRef.current && !rendererRef.current) {
      const { scene, camera, renderer } = buildScene(canvasRef.current, viewState);
      const initialZCenter = 0;
      const { cleanup, controls, gizmoResources } = setupRenderer(
        canvasRef.current,
        scene,
        camera,
        renderer,
        viewState,
        initialZCenter
      );
      rendererRef.current = { scene, camera, renderer, controls, gizmoResources };
      localCleanup = cleanup;
      cleanupRef.current = cleanup;
    }
    return () => {
      localCleanup?.();
      if (rendererRef.current) {
        if (meshRef.current) {
          rendererRef.current.scene.remove(meshRef.current);
          meshRef.current.geometry.dispose();
          meshRef.current = null;
        }
        rendererRef.current = null;
      }
    };
  }, [viewState, canvasRef]);

  return {
    rendererRef,
    meshRef,
    zCenterRef,
    cleanupRef
  };
}
