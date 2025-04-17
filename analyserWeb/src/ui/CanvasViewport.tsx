import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { SurfaceGrid } from '../core/types';
import { ViewState } from '../core/transform/viewState';
import { buildScene } from '../renderer/sceneBuilder';
import { renderSurface } from '../renderer/surfaceRenderer';
import { setupRenderer } from '../renderer/rendererState';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Needed for type checking controls

interface CanvasViewportProps {
  gridData: SurfaceGrid | null;
  viewState: ViewState;
}

// Cleanup function type no longer needs updateViewState
type CleanupFunction = () => void;

function CanvasViewport({ gridData, viewState }: CanvasViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Store refs for renderer, camera, controls etc.
  const rendererRef = useRef<{
    scene: THREE.Scene,
    camera: THREE.OrthographicCamera, // Assuming Orthographic for now
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls // Store controls reference
  } | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const cleanupRef = useRef<CleanupFunction | null>(null);

  useEffect(() => {
    // Initial setup
    if (canvasRef.current && !rendererRef.current) {
      // 1. Build the basic scene components
      const { scene, camera, renderer } = buildScene(canvasRef.current);

      // 2. Setup renderer logic, controls, and get cleanup + controls instance
      const { cleanup, controls } = setupRenderer(
        canvasRef.current,
        scene,
        camera, // Pass the created camera
        renderer, // Pass the created renderer
        viewState // Pass initial viewState for zoom etc.
      );

      // 3. Store all references
      rendererRef.current = { scene, camera, renderer, controls };
      cleanupRef.current = cleanup; // Store the cleanup function
    }

    // Cleanup on unmount
    return () => {
      cleanupRef.current?.();
      rendererRef.current = null; // Clear refs
    };
    // Rerun setup only if viewState reference changes (unlikely for object, but good practice)
  }, [viewState]);

  // Effect to render surface when gridData changes
  useEffect(() => {
    if (rendererRef.current && rendererRef.current.scene) {
      const { scene } = rendererRef.current;
      // Ensure meshRef is managed correctly (add/remove from scene)
      if (meshRef.current) {
        scene.remove(meshRef.current);
        meshRef.current.geometry.dispose();
        // Assuming material is shared or managed elsewhere, otherwise dispose it too
      }
      meshRef.current = renderSurface(scene, gridData); // renderSurface now adds to scene
      if (meshRef.current) {
         // Apply initial zFactor scale
         meshRef.current.scale.set(1, 1, viewState.zFactor);
      }
    }
  }, [gridData, viewState.zFactor]); // Rerun if grid or zFactor changes


  // Effect to update camera zoom and mesh zFactor based on viewState changes
  useEffect(() => {
    if (rendererRef.current && rendererRef.current.camera) {
      const { camera, controls } = rendererRef.current;
      // Update camera zoom (only for Orthographic)
      if (camera instanceof THREE.OrthographicCamera) {
        camera.zoom = viewState.zoom;
        camera.updateProjectionMatrix();
        controls.update(); // Important after camera changes
      }
      // Update mesh Z scale
      if (meshRef.current) {
        meshRef.current.scale.z = viewState.zFactor;
      }
    }
    // Exclude controls from dependency array as it's stable
  }, [viewState.zoom, viewState.zFactor]);


  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}

export default CanvasViewport;
