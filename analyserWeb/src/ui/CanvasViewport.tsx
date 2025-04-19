import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { SurfaceGrid, SampleRange } from '../core/types';
import { ViewState } from '../core/transform/viewState';
import { validateRange } from '../core/grid/sampleRange';
import { buildScene } from '../renderer/sceneBuilder';
import { renderSurface } from '../renderer/surfaceRenderer';
import { setupRenderer } from '../renderer/rendererState';
import { GizmoResources } from './viewportGizmo';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface CanvasViewportProps {
  gridData: SurfaceGrid | null;
  viewState: ViewState;
  activeTool: string;
  currentSampleRange?: SampleRange;
  onSampleRangeChange?: (newRange: SampleRange) => void;
  onViewStateChange?: (updates: Partial<ViewState>) => void;
}

type CleanupFunction = () => void;

function CanvasViewport({ 
  gridData, 
  viewState, 
  activeTool,
  currentSampleRange,
  onSampleRangeChange,
  onViewStateChange
}: CanvasViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<{
    scene: THREE.Scene,
    camera: THREE.OrthographicCamera,
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls,
    gizmoResources: GizmoResources
  } | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const cleanupRef = useRef<CleanupFunction | null>(null);
  const zCenterRef = useRef<number>(0);
  const MOUSE_SENSITIVITY = 0.01;
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

  //run once on mount to setup the scene, camera, renderer, controls and gizmo
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
  }, []);

  // Listens globally for mouseup, Resets isDraggingRef to stop drag interaction regardless of tool.
  useEffect(() => {
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Handles mouse-based zooming. On drag: calculates a zoom factor from vertical mouse movement.
  // Adjusts currentSampleRange proportionally around the center. Updates camera and controls.
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
      const zoomFactor = 1 + deltaY * MOUSE_SENSITIVITY;
      const centerX = (currentSampleRange.xMax + currentSampleRange.xMin) / 2;
      const centerY = (currentSampleRange.yMax + currentSampleRange.yMin) / 2;
      const halfWidth = (currentSampleRange.xMax - currentSampleRange.xMin) * zoomFactor / 2;
      const halfHeight = (currentSampleRange.yMax - currentSampleRange.yMin) * zoomFactor / 2;

      const newRange = {
        xMin: centerX - halfWidth,
        xMax: centerX + halfWidth,
        yMin: centerY - halfHeight,
        yMax: centerY + halfHeight
      };

      if (validateRange(newRange)) {
        onSampleRangeChange(newRange);
        if (rendererRef.current) {
          rendererRef.current.controls.update();
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
  }, [activeTool, currentSampleRange, onSampleRangeChange]);

  // Handles panning (shifting) of the view. On drag: shifts the currentSampleRange in X and Y.
  // Updates the camera controls.target to match the new center.
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
      const width = currentSampleRange.xMax - currentSampleRange.xMin;
      const height = currentSampleRange.yMax - currentSampleRange.yMin;
      const shiftX = deltaX * width * MOUSE_SENSITIVITY;
      const shiftY = -deltaY * height * MOUSE_SENSITIVITY;

      const newRange = {
        xMin: currentSampleRange.xMin + shiftX,
        xMax: currentSampleRange.xMax + shiftX,
        yMin: currentSampleRange.yMin + shiftY,
        yMax: currentSampleRange.yMax + shiftY
      };

      if (validateRange(newRange)) {
        onSampleRangeChange(newRange);
        if (rendererRef.current) {
          const { controls, camera } = rendererRef.current;
          const currentTarget = controls.target.clone();
          controls.target.set(
            currentTarget.x + shiftX,
            currentTarget.y + shiftY,
            currentTarget.z
          );
          camera.lookAt(controls.target);
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
  }, [activeTool, currentSampleRange, onSampleRangeChange, onViewStateChange]);

  // Runs only when activeTool === 'zfactor' updates viewState.zFactor, scaling it inversely (as per your correction: smaller = taller)
  // Clamps: keeps zFactor above 0.1 to avoid collapse/inversion. Triggers: camera control update
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
        onViewStateChange({ zFactor: newZFactor });
        if (rendererRef.current) {
          rendererRef.current.controls.update();
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
  }, [activeTool, viewState.zFactor, onViewStateChange]);

  // Enables/disables OrbitControls. Attaches a 'change' listener to extract camera orientation.
  // Updates viewState.rotationX and rotationZ using camera position relative to target.
  useEffect(() => {
    if (rendererRef.current?.controls) {
      rendererRef.current.controls.enabled = activeTool === 'rotate';

      if (activeTool === 'rotate' && onViewStateChange) {
        const controls = rendererRef.current.controls;

        const updateRotationFromCamera = () => {
          const camera = rendererRef.current?.camera;
          if (!camera) return;

          const position = new THREE.Vector3();
          camera.getWorldPosition(position);
          const target = controls.target;
          const direction = new THREE.Vector3().subVectors(target, position).normalize();
          const rotationX = Math.atan2(-direction.z, Math.sqrt(direction.x ** 2 + direction.y ** 2));
          const rotationZ = Math.atan2(direction.y, direction.x);

          onViewStateChange({
            rotationX: rotationX,
            rotationZ: rotationZ
          });
        };

        controls.addEventListener('change', updateRotationFromCamera);
        return () => {
          controls.removeEventListener('change', updateRotationFromCamera);
        };
      }
    }
  }, [activeTool, onViewStateChange]);

  // Renders new surface mesh on gridData change. Applies new zoom level (zoomCamera) and height scaling (zFactor).
  // Sets camera zoom, lookAt, and control target accordingly. Also handles disposing old mesh.
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
          meshRef.current.scale.set(1, 1, 1 / viewState.zFactor);
          scene.add(meshRef.current);
        }
        if (camera instanceof THREE.OrthographicCamera) {
          camera.zoom = viewState.zoomCamera;
          camera.updateProjectionMatrix();
          camera.lookAt(0, 0, zCenterRef.current * 1 / viewState.zFactor);
          controls.target.set(0, 0, zCenterRef.current / viewState.zFactor);
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
