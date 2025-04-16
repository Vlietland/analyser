import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { SurfaceGrid } from '../core/types';
import { ViewState } from '../core/transform/viewState';
import { buildScene } from '../renderer/sceneBuilder';
import { renderSurface } from '../renderer/surfaceRenderer';
import { setupRenderer, updateCamera } from '../renderer/rendererState';

interface CanvasViewportProps {
  gridData: SurfaceGrid | null;
  viewState: ViewState;
}

function CanvasViewport({ gridData, viewState }: CanvasViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<{ scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer } | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const { scene, camera, renderer } = buildScene(canvasRef.current);
      rendererRef.current = { scene, camera, renderer };
      cleanupRef.current = setupRenderer(canvasRef.current, scene, camera, renderer);
    }
    return () => {
      cleanupRef.current?.();
      rendererRef.current?.renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (rendererRef.current) {
      const { scene } = rendererRef.current;
      meshRef.current = renderSurface(scene, gridData, meshRef.current || undefined);
    }
  }, [gridData]);

  useEffect(() => {
    if (rendererRef.current) {
      const { camera } = rendererRef.current;
      updateCamera(camera, viewState);
    }
  }, [viewState]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}

export default CanvasViewport;
