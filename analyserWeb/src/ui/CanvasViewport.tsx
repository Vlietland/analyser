import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { SurfaceGrid } from '../core/types';
import { ViewState } from '../core/transform/viewState';
import { buildScene } from '../renderer/sceneBuilder';
import { renderSurface } from '../renderer/surfaceRenderer';
import { setupRenderer } from '../renderer/rendererState';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface CanvasViewportProps {
  gridData: SurfaceGrid | null;
  viewState: ViewState;
}

type CleanupFunction = () => void;

function CanvasViewport({ gridData, viewState }: CanvasViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<{
    scene: THREE.Scene,
    camera: THREE.OrthographicCamera,
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls
  } | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const cleanupRef = useRef<CleanupFunction | null>(null);
  const zCenterRef = useRef<number>(0);

  useEffect(() => {
    let localCleanup: CleanupFunction | null = null;
    if (canvasRef.current && !rendererRef.current) {
      const { scene, camera, renderer } = buildScene(canvasRef.current);
      const initialZCenter = 0;
      const { cleanup, controls } = setupRenderer(
        canvasRef.current,
        scene,
        camera,
        renderer,
        viewState,
        initialZCenter
      );
      rendererRef.current = { scene, camera, renderer, controls };
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
  }, []);

  useEffect(() => {
    if (rendererRef.current && rendererRef.current.scene && rendererRef.current.camera) {
      const { scene, camera, controls } = rendererRef.current;
      if (meshRef.current) {
        scene.remove(meshRef.current);
        meshRef.current.geometry.dispose();
      }
      if (gridData) {
        const result = renderSurface(scene, gridData);
        meshRef.current = result?.mesh || null;
        zCenterRef.current = result?.zCenter ?? 0;
        if (meshRef.current) {
          meshRef.current.scale.set(1, 1, viewState.zFactor);
          scene.add(meshRef.current);
        }
        if (camera instanceof THREE.OrthographicCamera) {
          camera.zoom = viewState.zoomCamera;
          camera.updateProjectionMatrix();
          camera.lookAt(0, 0, zCenterRef.current * viewState.zFactor);
          controls.target.set(0, 0, zCenterRef.current * viewState.zFactor);
          controls.update();
        }
      }
    }
  }, [gridData, viewState.zoomCamera, viewState.zFactor]); 

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}

export default CanvasViewport;
