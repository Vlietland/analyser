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
    if (canvasRef.current && gridData && !rendererRef.current) {
      const { scene, camera, renderer } = buildScene(canvasRef.current);
      const result = renderSurface(scene, gridData);
      const zCenter = result?.zCenter ?? 0;
      zCenterRef.current = zCenter;
      const { cleanup, controls } = setupRenderer(
        canvasRef.current,
        scene,
        camera,
        renderer,
        viewState,
        zCenter
      );
      rendererRef.current = { scene, camera, renderer, controls };
      cleanupRef.current = cleanup;
    }
    return () => {
      cleanupRef.current?.();
      rendererRef.current = null;
    };
  }, [viewState, gridData]);

  useEffect(() => {
    if (rendererRef.current && rendererRef.current.scene) {
      const { scene, camera } = rendererRef.current;
      if (meshRef.current) {
        scene.remove(meshRef.current);
        meshRef.current.geometry.dispose();
      }
      const result = renderSurface(scene, gridData);
      meshRef.current = result?.mesh || null;
      zCenterRef.current = result?.zCenter ?? 0;
      if (meshRef.current) {
        meshRef.current.scale.set(1, 1, viewState.zFactor);
      }
      if (camera && camera instanceof THREE.OrthographicCamera) {
        camera.lookAt(0, 0, zCenterRef.current);
      }
    }
  }, [gridData, viewState.zFactor]);

  useEffect(() => {
    if (rendererRef.current && rendererRef.current.camera) {
      const { camera, controls } = rendererRef.current;
      if (camera instanceof THREE.OrthographicCamera) {
        camera.zoom = viewState.zoom;
        camera.updateProjectionMatrix();
        controls.target.set(0, 0, zCenterRef.current);
        controls.update();
      }
      if (meshRef.current) {
        meshRef.current.scale.z = viewState.zFactor;
      }
    }
  }, [viewState.zoom, viewState.zFactor]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}

export default CanvasViewport;